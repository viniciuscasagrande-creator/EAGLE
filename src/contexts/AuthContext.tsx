import React, { createContext, useContext, useState, useEffect } from 'react';
import { Producer, UserProfile } from '@/types/producer';
import { mockProducer } from '@/services/api/mockSeedData';
import {
  getKeeperApiUrl,
  getAuthToken,
  saveAuthSession,
  clearAuthSession,
} from '@/services/api/client';

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

const defaultUserProfile: UserProfile = {
  id: 'usr-01',
  name: 'Vinicius Casagrande',
  email: 'vinicius@abcproducoes.com.br',
  role: 'PRODUCER_ADMIN',
  producerId: 'prod-01',
  producerName: 'ABC Produções & Eventos Ltda',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [isKeeperConnected, setIsKeeperConnected] = useState<boolean>(false);

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
    // Restaurar sessão persistida legítima se houver token válido
    const restoreSession = async () => {
      try {
        const token = getAuthToken();
        const storedUser = localStorage.getItem('producer_user');
        const storedProducer = localStorage.getItem('producer_data');

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const parsedProducer = storedProducer ? JSON.parse(storedProducer) : mockProducer;

          // Valida sessão com o backend se disponível
          try {
            const apiUrl = getKeeperApiUrl();
            const res = await fetch(`${apiUrl}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
              signal: AbortSignal.timeout(3000),
            });

            if (res.status === 401 || res.status === 403) {
              // Sessão expirada ou token revogado
              clearAuthSession();
              setUser(null);
              setProducer(null);
              setIsAuthenticated(false);
              return;
            }
          } catch {
            // Backend offline - mantém sessão persistida válida do dispositivo
          }

          setUser(parsedUser);
          setProducer(parsedProducer);
          setIsAuthenticated(true);
        } else {
          // NUNCA autenticar automaticamente sem credenciais reais!
          clearAuthSession();
          setUser(null);
          setProducer(null);
          setIsAuthenticated(false);
        }
      } catch {
        clearAuthSession();
        setUser(null);
        setProducer(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
    checkKeeperConnection();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Autenticação via Servidor Central Keeper API
    try {
      const apiUrl = getKeeperApiUrl();
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const authData = await res.json();
        const sessionToken = authData.token || authData.accessToken;
        const loggedUser: UserProfile = authData.user || {
          id: authData.userId || 'usr-01',
          name: authData.userName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: authData.role || 'PRODUCER_ADMIN',
          producerId: authData.producerId || 'prod-01',
          producerName: authData.producerName || 'DiskIngressos Produtor',
          avatarUrl: defaultUserProfile.avatarUrl,
        };
        const producerData: Producer = authData.producer || mockProducer;

        saveAuthSession({
          token: sessionToken,
          user: loggedUser,
          producer: producerData,
          tenantId: authData.tenantId || '00000000-0000-0000-0000-000000000001',
          companyId: authData.companyId || '00000000-0000-0000-0000-000000000001',
        });

        setUser(loggedUser);
        setProducer(producerData);
        setIsAuthenticated(true);
        setIsKeeperConnected(true);
        return true;
      } else if (res.status === 401 || res.status === 403) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || errJson.detail || 'E-mail ou senha incorretos.');
      }
    } catch (err: any) {
      // Se foi erro de credencial explicitamente rejeitada pelo servidor, repassa
      if (err.message && !err.message.includes('fetch') && !err.message.includes('timeout') && !err.message.includes('Network')) {
        throw err;
      }
    }

    // 2. Se o servidor central estiver inacessível (ambiente offline de teste),
    // SOMENTE credenciais homologadas oficiais de Produtor DiskIngressos são autorizadas.
    // NUNCA aceitar e-mails ou senhas arbitrárias!
    const isAuthorizedProducer =
      cleanEmail === 'produtor@diskingressos.com.br' && cleanPass === 'disk@produtor2026';

    if (isAuthorizedProducer) {
      const sessionToken = `ey-disk-produtor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const loggedUser: UserProfile = {
        ...defaultUserProfile,
        email: cleanEmail,
        name: 'Vinicius Casagrande',
      };
      const producerData: Producer = {
        ...mockProducer,
        email: cleanEmail,
      };

      saveAuthSession({
        token: sessionToken,
        user: loggedUser,
        producer: producerData,
        tenantId: '00000000-0000-0000-0000-000000000001',
        companyId: '00000000-0000-0000-0000-000000000001',
      });

      setUser(loggedUser);
      setProducer(producerData);
      setIsAuthenticated(true);
      return true;
    }

    throw new Error('Credenciais não autorizadas. Verifique seu e-mail e senha cadastrados na DiskIngressos.');
  };

  const logout = () => {
    clearAuthSession();
    setIsAuthenticated(false);
    setUser(null);
    setProducer(null);
    window.location.href = '/login';
  };

  const setProducerId = (id: string) => {
    if (producer) {
      const updated = { ...producer, id };
      setProducer(updated);
      localStorage.setItem('producer_data', JSON.stringify(updated));
      localStorage.setItem('producer_id', id);
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
