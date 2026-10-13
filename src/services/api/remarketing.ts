import { keeperRequest } from './client';

// Contratos PROPOSTOS: confirmar rotas com o backend do Eagle One antes do deploy.
// Identidade do produtor e autorização devem ser derivadas de sessão verificada no servidor.
const ROOT = '/producer/remarketing';

export type RecoveryStatus = 'PENDING' | 'RECOVERY_SENT' | 'RECOVERED' | 'EXPIRED';

export interface RecoveryCart {
  id: string;
  eventId: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  sectorName: string;
  ticketsCount: number;
  cartValue: number;
  abandonedAt: string;
  recoveryStatus: RecoveryStatus;
}

export interface RemarketingRule {
  id: string;
  name: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  delayMinutes: number;
  discountOffer: string;
  status: 'ACTIVE' | 'PAUSED';
  sentCount: number;
  openedRate: number;
  recoveredCount: number;
  recoveredRevenue: number;
}

function getUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const remarketingApi = {
  listCarts: () => keeperRequest<RecoveryCart[]>(`${ROOT}/carts`),

  recoverCart: (cartId: string) =>
    keeperRequest<{ jobId: string; status: string }>(
      `${ROOT}/carts/${encodeURIComponent(cartId)}/recover`,
      {
        method: 'POST',
        idempotencyKey: getUUID(),
      }
    ),

  recoverBatch: (ids: string[]) =>
    keeperRequest<{ jobId: string; acceptedCount: number }>(
      `${ROOT}/carts/recover-batch`,
      {
        method: 'POST',
        body: JSON.stringify({ cartIds: ids }),
        idempotencyKey: getUUID(),
      }
    ),

  listRules: () => keeperRequest<RemarketingRule[]>(`${ROOT}/rules`),

  createRule: (rule: Pick<RemarketingRule, 'name' | 'channel' | 'delayMinutes' | 'discountOffer'>) =>
    keeperRequest<RemarketingRule>(`${ROOT}/rules`, {
      method: 'POST',
      body: JSON.stringify(rule),
      idempotencyKey: getUUID(),
    }),

  updateRule: (id: string, patch: Partial<RemarketingRule>) =>
    keeperRequest<RemarketingRule>(`${ROOT}/rules/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
      idempotencyKey: getUUID(),
    }),
};
