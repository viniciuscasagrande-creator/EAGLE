import { keeperRequest } from './client';
import { API_ENDPOINTS } from './endpoints';

export type Channel = 'WHATSAPP' | 'EMAIL';
export type JourneyStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED';

export interface JourneyStep {
  delayMinutes: number;
  channel: Channel;
  templateId: string;
}

export interface Journey {
  id: string;
  name: string;
  status: JourneyStatus;
  eventId: string;
  steps: JourneyStep[];
  updatedAt: string;
  producerId?: string;
}

export interface Consent {
  id: string;
  maskedName: string;
  maskedEmail: string;
  whatsappOptIn: boolean;
  emailOptIn: boolean;
  policyVersion: string;
  updatedAt: string;
  eventId?: string;
  producerId?: string;
}

export interface ReportItem {
  key: string;
  label: string;
  description: string;
}

function getUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const params = (eventId?: string) => (eventId ? `?eventId=${encodeURIComponent(eventId)}` : '');

export const remarketingV5 = {
  listJourneys: (eventId?: string) =>
    keeperRequest<Journey[]>(`${API_ENDPOINTS.REMARKETING.PRODUCER_JOURNEYS}${params(eventId)}`),

  createJourney: (body: { name: string; eventId: string; steps: JourneyStep[] }) =>
    keeperRequest<Journey>(API_ENDPOINTS.REMARKETING.PRODUCER_JOURNEYS, {
      method: 'POST',
      body: JSON.stringify(body),
      idempotencyKey: getUUID(),
    }),

  updateJourneyStatus: (id: string, status: JourneyStatus) =>
    keeperRequest<Journey>(API_ENDPOINTS.REMARKETING.PRODUCER_JOURNEY_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      idempotencyKey: getUUID(),
    }),

  listConsents: (eventId?: string) =>
    keeperRequest<Consent[]>(`${API_ENDPOINTS.REMARKETING.PRODUCER_CONSENTS}${params(eventId)}`),

  listReports: () =>
    keeperRequest<ReportItem[]>(API_ENDPOINTS.REMARKETING.PRODUCER_REPORTS),

  getReport: (key: string, eventId?: string) =>
    keeperRequest<{ columns: string[]; rows: (string | number | null)[][] }>(
      `${API_ENDPOINTS.REMARKETING.PRODUCER_REPORT_DETAIL(key)}${params(eventId)}`
    ),
};
