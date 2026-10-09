export interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventId: string;
  eventName: string;
  sectorName: string;
  ticketsCount: number;
  cartValue: number;
  abandonedAt: string;
  recoveryStatus: 'PENDING' | 'RECOVERY_SENT' | 'RECOVERED' | 'EXPIRED';
  channelSent?: 'WHATSAPP' | 'EMAIL';
}

// Oportunidade Operacional de Resgate no WhatsApp Remarketing (Vídeo 02:24-02:34)
export interface RecoveryOpportunity {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventId: string;
  eventName: string;
  utmSource: string;
  utmCampaign: string;
  itemsDescription: string;
  ticketCount: number;
  cartValue: number;
  timeAgo: string;
  abandonedAt: string;
  status: 'ABERTO' | 'EM_RESGATE' | 'RECUPERADO' | 'EXPIRADO';
  channel: 'WHATSAPP' | 'EMAIL';
  pixKey?: string;
  lastActionNote?: string;
  dispatchedAt?: string;
  verifiedTransactionId?: string;
}

export interface PaymentRecoveryItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  issueType: 'PIX_EXPIRED' | 'ANTIFRAUD_REJECTED' | 'BOLETO_OVERDUE' | 'INSUFFICIENT_LIMIT';
  amount: number;
  eventId: string;
  eventName: string;
  createdAt: string;
  expiresAt: string;
  status: 'PENDING' | 'RETRIEVING' | 'RECOVERED' | 'CANCELLED';
}
