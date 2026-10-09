export interface CommercialClient {
  id: string;
  name: string;
  tradeName?: string;
  document: string; // CNPJ / CPF
  contactName: string;
  contactRole?: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  address?: string;
  category: 'EMPRESA' | 'AGENCIA' | 'GRUPO' | 'UNIVERSIDADE' | 'OUTROS';
  totalOrders: number;
  totalVolume: number;
  lastPurchaseDate?: string;
  tags?: string[];
  notes?: string;
}

export interface CommercialOpportunity {
  id: string;
  title: string;
  clientName: string;
  clientId?: string;
  eventId?: string;
  eventName?: string;
  stage: 'PROSPECCAO' | 'PROPOSTA_ENVIADA' | 'NEGOCIACAO' | 'FECHADO_GANHO' | 'FECHADO_PERDIDO';
  estimatedValue: number;
  ticketsQuantity: number;
  assignedTo: string;
  probability: number;
  closeDate: string;
  notes?: string;
  lossReason?: string;
  proposalId?: string;
}

export interface ProposalItem {
  id: string;
  sectorName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CommercialProposal {
  id: string;
  proposalNumber: string;
  clientName: string;
  clientId?: string;
  eventId: string;
  eventName: string;
  totalTickets: number;
  totalAmount: number;
  discountRate: number;
  status: 'RASCUNHO' | 'ENVIADA' | 'APROVADA' | 'RECUSADA' | 'EXPIRADA';
  validUntil: string;
  createdAt: string;
  paymentTerms?: string;
  notes?: string;
  publicToken?: string;
  corporateOrderId?: string;
  items?: ProposalItem[];
}

export interface PartnerSettlement {
  id: string;
  date: string;
  amount: number;
  receiptNumber?: string;
  notes: string;
}

export interface CommercialPartner {
  id: string;
  name: string;
  category?: string;
  type?: 'HOTEL' | 'RESTAURANTE' | 'CLUBE_BENEFICIOS' | 'AGENCIA_VIAGEM' | 'CONSELHO' | 'GREMIO' | 'OUTROS';
  discountPct?: number;
  couponCode: string;
  discountType?: 'PERCENT' | 'FIXED';
  discountValue?: number;
  commissionRate?: number;
  activeEventsCount?: number;
  salesVolume?: number;
  ticketsSold?: number;
  grossSalesGenerated?: number;
  commissionEarned?: number;
  commissionPaid?: number;
  status: 'ACTIVE' | 'PAUSED';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  settlements?: PartnerSettlement[];
}

export interface CorporateAttendee {
  id: string;
  name: string;
  document: string; // CPF
  email: string;
  phone?: string;
  sector: string;
  ticketCode?: string;
  checkedIn?: boolean;
}

export interface CorporateOrder {
  id: string;
  orderNumber: string;
  companyName: string;
  cnpj: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  eventId?: string;
  eventName: string;
  ticketQuantity: number;
  sector: string;
  totalAmount: number;
  paymentTerm: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  invoiceIssued: boolean;
  invoiceNumber?: string;
  invoiceKey?: string;
  boletoBarcode?: string;
  boletoDigitableLine?: string;
  pixCode?: string;
  dueDate?: string;
  createdAt: string;
  proposalId?: string;
  attendees?: CorporateAttendee[];
}
