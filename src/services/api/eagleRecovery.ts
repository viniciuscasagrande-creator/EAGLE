import { keeperRequest } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { RecoveryOpportunity, PaymentRecoveryItem } from '@/types/remarketing';

// Rotas autorizadas para o backend do Eagle One.
// Não atribuir status de envio/conversão sem confirmação posterior do provedor.

export interface AcceptedJob {
  jobId: string;
  status: 'QUEUED' | 'ACCEPTED';
}

export interface RecoveryPix {
  paymentReference: string;
  pixCopyPaste: string;
  expiresAt: string;
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  recovered: number;
  recoveredAmount: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  delayMinutes: number;
  subject: string;
  status: 'ACTIVE' | 'PAUSED';
}

function getUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const eagleRecoveryApi = {
  listWhatsApp: () =>
    keeperRequest<RecoveryOpportunity[]>(API_ENDPOINTS.REMARKETING.PRODUCER_WHATSAPP_OPPORTUNITIES),

  requestWhatsApp: (id: string) =>
    keeperRequest<AcceptedJob>(API_ENDPOINTS.REMARKETING.PRODUCER_WHATSAPP_DISPATCH(id), {
      method: 'POST',
      idempotencyKey: getUUID(),
    }),

  requestWhatsAppBatch: (ids: string[]) =>
    keeperRequest<AcceptedJob>(API_ENDPOINTS.REMARKETING.PRODUCER_WHATSAPP_DISPATCH_BATCH, {
      method: 'POST',
      body: JSON.stringify({ opportunityIds: ids }),
      idempotencyKey: getUUID(),
    }),

  listFailedPayments: () =>
    keeperRequest<PaymentRecoveryItem[]>(API_ENDPOINTS.REMARKETING.PRODUCER_PAYMENTS_FAILED),

  requestNewPix: (id: string) =>
    keeperRequest<RecoveryPix>(API_ENDPOINTS.REMARKETING.PRODUCER_PAYMENT_NEW_PIX(id), {
      method: 'POST',
      idempotencyKey: getUUID(),
    }),

  emailMetrics: () =>
    keeperRequest<EmailMetrics>(API_ENDPOINTS.REMARKETING.PRODUCER_EMAIL_METRICS),

  emailTemplates: () =>
    keeperRequest<EmailTemplate[]>(API_ENDPOINTS.REMARKETING.PRODUCER_EMAIL_TEMPLATES),
};
