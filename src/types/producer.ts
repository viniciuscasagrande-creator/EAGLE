export type AppEnvironment = 'ADMIN' | 'PRODUCER';

export type UserRole =
  | 'ADMIN_MASTER'
  | 'ADMIN_FINANCIAL'
  | 'PRODUCER_ADMIN'
  | 'PRODUCER_FINANCIAL'
  | 'PRODUCER_OPERATOR';

export interface Producer {
  id: string;
  name: string;
  tradeName?: string;
  cnpj: string;
  code: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  kycStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  email: string;
  phone: string;
  bankName: string;
  agency: string;
  account: string;
  pixKey: string;
  commissionRate?: number;
  maxAdvanceLimit?: number;
  totalEventsCount?: number;
  totalGrossSales?: number;
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
  role: UserRole;
  producerId?: string;
  producerName?: string;
  avatarUrl?: string;
  environment?: AppEnvironment;
}

export interface CreditAdvanceRequest {
  id: string;
  code: string;
  producerId: string;
  producerName: string;
  producerCnpj: string;
  requestedAmount: number;
  discountFeePercentage: number;
  netAmount: number;
  availableBalanceFuture: number;
  eventIds: string[];
  eventNames: string[];
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  requestedAt: string;
  analystNotes?: string;
  pixKey: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PlatformOverviewKPIs {
  totalGmv: number;
  platformTakeRateRevenue: number;
  activeProducersCount: number;
  activeEventsCount: number;
  ticketsSold30d: number;
  averageTicketValue: number;
  pendingAdvanceRequestsAmount: number;
  pendingAdvanceCount: number;
  pixVsCardRatio: { pixPercentage: number; cardPercentage: number };
}

