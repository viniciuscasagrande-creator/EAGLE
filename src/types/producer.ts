export interface Producer {
  id: string;
  name: string;
  tradeName?: string;
  cnpj: string;
  code: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  email: string;
  phone: string;
  bankName: string;
  agency: string;
  account: string;
  pixKey: string;
  kpis: {
    saldoTotal: number;
    disponivel: number;
    aReceber: number;
    emAntecipacao: number;
    emRepasse: number;
    despesas: number;
    bloqueado: number;
    projetado: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'PRODUCER_ADMIN' | 'PRODUCER_FINANCIAL' | 'PRODUCER_OPERATOR';
  producerId: string;
  producerName: string;
  avatarUrl?: string;
}
