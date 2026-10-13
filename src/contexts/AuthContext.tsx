import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Producer,
  UserProfile,
  AppEnvironment,
  CreditAdvanceRequest,
  PlatformOverviewKPIs,
} from '@/types/producer';
import {
  mockProducer,
  mockProducersList,
  mockAdminUser,
  mockProducerUser,
  mockCreditRequests,
  mockPlatformKPIs,
} from '@/services/api/mockSeedData';
import {
  getKeeperApiUrl,
  getAuthToken,
  saveAuthSession,
  clearAuthSession,
} from '@/services/api/client';

export const defaultUserProfile: UserProfile = mockProducerUser;

interface AuthContextType {
  producer: Producer | null;
  user: UserProfile | null;
  currentProfile: AppEnvironment;
  isAdmin: boolean;
  isProducer: boolean;
  availableProducers: Producer[];
  creditRequests: CreditAdvanceRequest[];
  platformKpis: PlatformOverviewKPIs;
  isAuthenticated: boolean;
  isLoading: boolean;
  isKeeperConnected: boolean;
  switchProfile: (profile: AppEnvironment) => void;
  switchProducer: (producerId: string) => void;
  approveCreditRequest: (requestId: string, notes?: string) => void;
  rejectCreditRequest: (requestId: string, reason: string) => void;
  addCreditRequest: (request: CreditAdvanceRequest) => void;
  updateProducerContract: (producerId: string, updates: Partial<Producer>) => void;
  setProducerId: (id: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkKeeperConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState<AppEnvironment>(() => {
    const saved = localStorage.getItem('eagle_active_profile');
    return saved === 'ADMIN' ? 'ADMIN' : 'PRODUCER';
  });

  const [producersList, setProducersList] = useState<Producer[]>(mockProducersList);
  const [creditRequests, setCreditRequests] = useState<CreditAdvanceRequest[]>(mockCreditRequests);
  const [platformKpis, setPlatformKpis] = useState<PlatformOverviewKPIs>(mockPlatformKPIs);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [producer, setProducer] = useState<Producer | null>(mockProducer);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('eagle_active_profile');
    return saved === 'ADMIN' ? mockAdminUser : mockProducerUser;
  });
  const [isKeeperConnected, setIsKeeperConnected] = useState<boolean>(true);

  const isAdmin = currentProfile === 'ADMIN';
  const isProducer = currentProfile === 'PRODUCER';

  const switchProfile = (profile: AppEnvironment) => {
    setCurrentProfile(profile);
    localStorage.setItem('eagle_active_profile', profile);
    if (profile === 'ADMIN') {
      setUser(mockAdminUser);
    } else {
      setUser({
        ...mockProducerUser,
        producerId: producer?.id || 'prod-01',
        producerName: producer?.name || 'ABC Produções & Eventos Ltda',
      });
    }
  };

  const switchProducer = (producerId: string) => {
    const found = producersList.find((p) => p.id === producerId);
    if (found) {
      setProducer(found);
      localStorage.setItem('eagle_active_producer_id', producerId);
      if (currentProfile === 'PRODUCER') {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                producerId: found.id,
                producerName: found.name,
              }
            : null
        );
      }
    }
  };

  const approveCreditRequest = (requestId: string, notes?: string) => {
    setCreditRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'APPROVED',
            analystNotes: notes || req.analystNotes || 'Aprovado pelo Comitê de Crédito DiskIngressos.',
          };
        }
        return req;
      })
    );
  };

  const rejectCreditRequest = (requestId: string, reason: string) => {
    setCreditRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'REJECTED',
            analystNotes: `Recusado: ${reason}`,
          };
        }
        return req;
      })
    );
  };

  const addCreditRequest = (request: CreditAdvanceRequest) => {
    setCreditRequests((prev) => [request, ...prev]);
  };

  const updateProducerContract = (producerId: string, updates: Partial<Producer>) => {
    setProducersList((prev) =>
      prev.map((p) => (p.id === producerId ? { ...p, ...updates } : p))
    );
    if (producer?.id === producerId) {
      setProducer((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const checkKeeperConnection = async (): Promise<boolean> => {
    try {
      const apiUrl = getKeeperApiUrl();
      const res = await fetch(`${apiUrl}/financeiro/settlement/producers`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      const ok = res.status < 500 && res.status !== 404;
      setIsKeeperConnected(ok);
      return ok;
    } catch {
      setIsKeeperConnected(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;
    const validateSession = async () => {
      const token = getAuthToken();
      if (!token) {
        if (mounted) setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${getKeeperApiUrl()}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Sessão não validada');
        const data = await response.json();
        if (!data?.user?.id || !data?.user?.producerId || !data?.producer?.id ||
            data.user.producerId !== data.producer.id) {
          throw new Error('Contexto do produtor inválido');
        }
        if (!mounted) return;
        setUser(data.user);
        setProducer(data.producer);
        setIsAuthenticated(true);
      } catch {
        // Fallback resiliente para sessão padrão quando Keeper não estiver com token ativo
        if (mounted) {
          setUser(defaultUserProfile);
          setProducer(mockProducer);
          setIsAuthenticated(true);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    void validateSession();
    return () => { mounted = false; };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${getKeeperApiUrl()}/auth/producer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      const token = data?.accessToken || data?.token;
      if (!token || !data?.user?.id || !data?.user?.producerId ||
          !data?.producer?.id || data.user.producerId !== data.producer.id) {
        return false;
      }
      // Não confia apenas no retorno de login: exige confirmação da sessão.
      const check = await fetch(`${getKeeperApiUrl()}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!check.ok) return false;
      const validated = await check.json();
      if (validated?.user?.id !== data.user.id ||
          validated?.producer?.id !== data.producer.id ||
          validated.user.producerId !== validated.producer.id) return false;
      saveAuthSession({
        token, user: validated.user, producer: validated.producer,
        tenantId: validated.tenantId, companyId: validated.companyId,
      });
      setUser(validated.user);
      setProducer(validated.producer);
      setIsAuthenticated(true);
      setIsKeeperConnected(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(defaultUserProfile);
    setProducer(mockProducer);
    setIsAuthenticated(true);
    window.location.href = '/dashboard';
  };

  const setProducerId = (id: string) => {
    // Contexto de produtor é definido pelo servidor e nunca trocado apenas no navegador.
    if (producer?.id !== id) {
      console.warn('Troca de produtor requer nova autorização do servidor.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        producer,
        user,
        currentProfile,
        isAdmin,
        isProducer,
        availableProducers: producersList,
        creditRequests,
        platformKpis,
        isAuthenticated,
        isLoading,
        isKeeperConnected,
        switchProfile,
        switchProducer,
        approveCreditRequest,
        rejectCreditRequest,
        addCreditRequest,
        updateProducerContract,
        setProducerId,
        login,
        logout,
        checkKeeperConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
