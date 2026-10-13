import { z } from 'zod';
import { Producer } from '@/types/producer';
import { EventWalletPosition } from '@/types/finance';

export const ProducerKpisSchema = z.object({
  saldoTotal: z.number().default(0),
  disponivel: z.number().default(0),
  aReceber: z.number().default(0),
  emAntecipacao: z.number().default(0),
  emRepasse: z.number().default(0),
  despesas: z.number().default(0),
  bloqueado: z.number().default(0),
  projetado: z.number().default(0),
});

const defaultProducerKpis = {
  saldoTotal: 0,
  disponivel: 0,
  aReceber: 0,
  emAntecipacao: 0,
  emRepasse: 0,
  despesas: 0,
  bloqueado: 0,
  projetado: 0,
};

export const ProducerSchema: z.ZodType<Producer> = z.object({
  id: z.string(),
  name: z.string(),
  tradeName: z.string().optional(),
  cnpj: z.string(),
  code: z.string().default('PROD-00'),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']).default('ACTIVE'),
  kycStatus: z.enum(['VERIFIED', 'PENDING', 'REJECTED']).optional().default('VERIFIED'),
  email: z.string(),
  phone: z.string(),
  bankName: z.string().default('Banco Padrão'),
  agency: z.string().default('0001'),
  account: z.string().default('00000-0'),
  pixKey: z.string().default(''),
  commissionRate: z.number().optional().default(8.5),
  maxAdvanceLimit: z.number().optional().default(500000),
  totalEventsCount: z.number().optional().default(0),
  totalGrossSales: z.number().optional().default(0),
  kpis: ProducerKpisSchema.default(defaultProducerKpis),
});

export const EventWalletPositionSchema: z.ZodType<EventWalletPosition> = z.object({
  id: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  producerId: z.string().default('prod-01'),
  producerName: z.string().default('ABC Produções'),
  venue: z.string().default(''),
  date: z.string().default(''),
  grossTicketSales: z.number().default(0),
  diskFeeTotal: z.number().default(0),
  spreadFeeTotal: z.number().default(0),
  advanceFeeTotal: z.number().default(0),
  otherFeesTotal: z.number().default(0),
  expensesTotal: z.number().default(0),
  repaymentsPaidTotal: z.number().default(0),
  repaymentsScheduledTotal: z.number().default(0),
  balanceAvailable: z.number().default(0),
  blockedBalance: z.number().default(0),
  projectedBalance: z.number().default(0),
  advancesPaidTotal: z.number().default(0),
  contingencyReserveAmount: z.number().default(0),
  obligationsReservedTotal: z.number().default(0),
  obligationsPaidTotal: z.number().default(0),
  refundsPaidTotal: z.number().default(0),
  isCancellationBlocked: z.boolean().default(false),
  status: z.enum(['OPEN', 'SETTLING', 'CLOSED', 'BLOCKED']).default('OPEN'),
});

export const CommercialClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  tradeName: z.string().optional(),
  document: z.string(),
  contactName: z.string(),
  email: z.string(),
  phone: z.string(),
  city: z.string().default('Curitiba / PR'),
  category: z.enum(['EMPRESA', 'AGENCIA', 'GRUPO', 'UNIVERSIDADE', 'CLUBE_BENEFICIOS']).default('EMPRESA'),
  totalOrders: z.number().default(0),
  totalVolume: z.number().default(0),
  lastPurchaseDate: z.string().default(''),
  producerId: z.string().default('prod-01'),
});

export const CommercialOpportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  clientName: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  stage: z.enum(['PROSPECCAO', 'QUALIFICACAO', 'PROPOSTA_ENVIADA', 'NEGOCIACAO', 'FECHADO_GANHO', 'FECHADO_PERDIDO']).default('PROSPECCAO'),
  expectedTickets: z.number().default(0),
  ticketPriceEstimated: z.number().default(0),
  expectedRevenue: z.number().default(0),
  probability: z.number().default(50),
  closeDateExpected: z.string().default(''),
  responsibleName: z.string().default('Comercial'),
  producerId: z.string().default('prod-01'),
});

export const AbandonedCartSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  eventId: z.string(),
  eventName: z.string(),
  sectorName: z.string().default('Geral'),
  ticketsCount: z.number().default(1),
  cartValue: z.number().default(0),
  abandonedAt: z.string(),
  recoveryStatus: z.enum(['PENDING', 'SENT', 'CONVERTED', 'EXPIRED']).default('PENDING'),
  producerId: z.string().default('prod-01'),
});

/**
 * Resilient schema parse helper: valida ou retorna fallback seguro caso a API retorne schema inesperado,
 * prevenindo quebras em cascata de componentes visuais do frontend.
 */
export function safeValidate<T>(schema: z.ZodType<T>, data: unknown, fallback: T): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn('[Zod Schema Warning]: Payload da API divergiu do contrato esperado:', result.error.format());
    return fallback;
  }
  return result.data;
}

export function safeValidateArray<T>(schema: z.ZodType<T>, data: unknown, fallback: T[]): T[] {
  if (!Array.isArray(data)) {
    console.warn('[Zod Schema Warning]: Esperado array mas recebido:', typeof data);
    return fallback;
  }
  return data.map((item, index) => {
    const res = schema.safeParse(item);
    if (!res.success) {
      console.warn(`[Zod Schema Warning]: Item ${index} divergiu do schema:`, res.error.format());
      return item as T;
    }
    return res.data;
  });
}
