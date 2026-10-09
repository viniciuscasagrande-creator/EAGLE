export interface CommercialClient {
  id: string;
  name: string;
  tradeName?: string;
  document: string; // CNPJ / CPF
  contactName: string;
  email: string;
  phone: string;
  city: string;
  category: 'EMPRESA' | 'AGENCIA' | 'GRUPO' | 'UNIVERSIDADE' | 'OUTROS';
  totalOrders: number;
  totalVolume: number;
  lastPurchaseDate?: string;
}

export interface CommercialOpportunity {
  id: string;
  title: string;
  clientName: string;
  eventId?: string;
  eventName?: string;
  stage: 'PROSPECCAO' | 'PROPOSTA_ENVIADA' | 'NEGOCIACAO' | 'FECHADO_GANHO' | 'FECHADO_PERDIDO';
  estimatedValue: number;
  ticketsQuantity: number;
  assignedTo: string;
  probability: number;
  closeDate: string;
}

export interface CommercialProposal {
  id: string;
  proposalNumber: string;
  clientName: string;
  eventId: string;
  eventName: string;
  totalTickets: number;
  totalAmount: number;
  discountRate: number;
  status: 'RASCUNHO' | 'ENVIADA' | 'APROVADA' | 'RECUSADA' | 'EXPIRADA';
  validUntil: string;
  createdAt: string;
}

export interface CommercialPartner {
  id: string;
  name: string;
  type: 'HOTEL' | 'RESTAURANTE' | 'CLUBE_BENEFICIOS' | 'AGENCIA_VIAGEM';
  discountPct: number;
  couponCode: string;
  activeEventsCount: number;
  salesVolume: number;
}
