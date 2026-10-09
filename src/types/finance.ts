export type LedgerEntryType =
  | 'VENDA_INGRESSO'
  | 'TAXA_SERVICO_DISK'
  | 'SPREAD_FINANCEIRO'
  | 'REPASSE_PRODUTOR'
  | 'ANTECIPACAO_PRODUTOR'
  | 'CUSTO_ANTECIPACAO'
  | 'DESPESA_OPERACIONAL'
  | 'RESERVA_CONTINGENCIA'
  | 'LIBERACAO_RESERVA'
  | 'ESTORNO_VENDA'
  | 'ESTORNO_PARCIAL'
  | 'ESTORNO_TAXA_DISK'
  | 'REVERSAO_LANCAMENTO';

export type LedgerDirection = 'CREDIT' | 'DEBIT';

export type SettlementStatus =
  | 'REQUESTED'
  | 'UNDER_ANALYSIS'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PROCESSING'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export interface EventWalletPosition {
  id: string;
  eventId: string;
  eventName: string;
  producerId: string;
  producerName: string;
  venue: string;
  date: string;
  grossTicketSales: number;
  diskFeeTotal: number;
  spreadFeeTotal: number;
  advanceFeeTotal: number;
  otherFeesTotal: number;
  expensesTotal: number;
  repaymentsPaidTotal: number;
  repaymentsScheduledTotal: number;
  balanceAvailable: number;
  blockedBalance: number;
  projectedBalance: number;
  advancesPaidTotal: number;
  contingencyReserveAmount: number;
  obligationsReservedTotal: number;
  obligationsPaidTotal: number;
  refundsPaidTotal: number;
  isCancellationBlocked: boolean;
  status: 'OPEN' | 'SETTLING' | 'CLOSED' | 'BLOCKED';
}

export interface FinancialLedgerEntry {
  id: string;
  producerId: string;
  eventWalletId: string;
  eventName?: string;
  saleId?: string;
  orderNumber?: string;
  entryType: LedgerEntryType;
  direction: LedgerDirection;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  isReversed: boolean;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  scheduleNumber: string;
  eventId: string;
  eventName: string;
  producerId: string;
  producerName: string;
  amount: number;
  status: SettlementStatus;
  paymentMethod: 'PIX' | 'TED';
  destinationBank?: string;
  destinationAccount?: string;
  destinationPixKey?: string;
  requestedAt: string;
  scheduledDate: string;
  authorizedBy?: string;
  paidAt?: string;
  transactionHash?: string;
  notes?: string;
}

export interface AdvanceRequest {
  id: string;
  advanceNumber: string;
  eventId: string;
  eventName: string;
  producerId: string;
  requestedAmount: number;
  advanceFeeRate: number; // e.g. 2.50%
  advanceFeeCost: number;
  netAmount: number;
  status: SettlementStatus;
  requestedDate: string;
  dueDate?: string;
  authorizedBy?: string;
  paidAt?: string;
}

export interface EventFeeRuleSummary {
  id: string;
  feeCode: string;
  feeName: string;
  calculationType: 'PERCENTAGE' | 'FIXED' | 'TIERED';
  rate: number;
  fixedAmount: number;
  payer: 'CUSTOMER' | 'PRODUCER';
  basisType: string;
  validFrom: string;
  validTo?: string | null;
  isActive: boolean;
}
