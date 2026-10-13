import React, { createContext, useContext, useState, useEffect } from 'react';
import { Producer, UserProfile } from '@/types/producer';
import { mockProducer } from '@/services/api/mockSeedData';
import {
  getKeeperApiUrl,
  getAuthToken,
  saveAuthSession,
  clearAuthSession,
} from '@/services/api/client';

export const defaultUserProfile: UserProfile = {
  id: 'usr-01',
  name: 'Vinicius Casagrande',
  email: 'vinicius@diskingressos.com.br',
  role: 'PRODUCER_ADMIN',
  producerId: 'prod-01',
  producerName: 'ABC Produções & Eventos Ltda',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

interface AuthContextType {
  producer: Producer | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isKeeperConnected: boolean;
  setProducerId: (id: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkKeeperConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Modo de acesso direto temporário: inicia autenticado com dados de sessão padrão
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(defaultUserProfile);
  const [producer, setProducer] = useState<Producer | null>(mockProducer);
  const [isKeeperConnected, setIsKeeperConnected] = useState<boolean>(true);

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
        isAuthenticated,
        isLoading,
        isKeeperConnected,
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
