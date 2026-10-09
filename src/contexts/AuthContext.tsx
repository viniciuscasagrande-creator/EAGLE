import React, { createContext, useContext, useState, useEffect } from 'react';
import { Producer, UserProfile } from '@/types/producer';
import { mockProducer } from '@/services/api/mockSeedData';

interface AuthContextType {
  producer: Producer;
  user: UserProfile;
  isAuthenticated: boolean;
  isKeeperConnected: boolean;
  setProducerId: (id: string) => void;
  logout: () => void;
}

const defaultUser: UserProfile = {
  id: 'usr-01',
  name: 'Vinicius Casagrande',
  email: 'vinicius@abcproducoes.com.br',
  role: 'PRODUCER_ADMIN',
  producerId: 'prod-01',
  producerName: 'ABC Produções & Eventos Ltda',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [producer, setProducer] = useState<Producer>(mockProducer);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isAuthenticated] = useState<boolean>(true);
  const [isKeeperConnected, setIsKeeperConnected] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se o backend do Keeper está online
    fetch('/api/v1/financeiro/settlement/producers', { method: 'GET' })
      .then((res) => {
        setIsKeeperConnected(res.ok);
      })
      .catch(() => {
        setIsKeeperConnected(false);
      });
  }, []);

  const setProducerId = (id: string) => {
    // Exemplo de troca de produtor para teste
    setProducer({ ...mockProducer, id });
  };

  const logout = () => {
    localStorage.removeItem('producer_token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        producer,
        user,
        isAuthenticated,
        isKeeperConnected,
        setProducerId,
        logout,
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
