import { keeperRequest } from './client';

/** Contratos propostos: habilitar operações somente se a API responder com ID e status. */
export type Channel = 'META_ADS' | 'GOOGLE_ADS' | 'TIKTOK_ADS' | 'SPOTIFY_ADS';

export interface CampaignResult {
  id: string;
  status: string;
  name?: string;
  message?: string;
}

function getUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Cria uma campanha de tráfego pago nos canais Meta, Google, TikTok ou Spotify.
 * Exige confirmação de ID e status retornado pela API autorizada.
 */
export async function createPaidCampaign(payload: {
  name: string;
  channel: Channel;
  eventName: string;
  dailyBudget: number;
}): Promise<CampaignResult> {
  const result = await keeperRequest<CampaignResult>('/producer/marketing/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
    idempotencyKey: getUUID(),
  });
  if (!result?.id || !result?.status) {
    throw new Error('API não confirmou criação da campanha.');
  }
  return result;
}

/**
 * Altera o status de uma campanha existente (ACTIVE ou PAUSED).
 * Exige confirmação de status retornado pelo servidor.
 */
export async function updatePaidCampaign(
  id: string,
  status: 'ACTIVE' | 'PAUSED'
): Promise<CampaignResult> {
  const result = await keeperRequest<CampaignResult>(
    `/producer/marketing/campaigns/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      idempotencyKey: getUUID(),
    }
  );
  if (!result?.id || result.status !== status) {
    throw new Error('API não confirmou alteração do status.');
  }
  return result;
}

/**
 * Registra o agendamento de uma campanha de WhatsApp Marketing.
 * Não simula envio imediato; aguarda confirmação de enfileiramento na Meta Cloud API.
 */
export async function launchWhatsApp(payload: {
  name: string;
  eventName: string;
  audience: string;
  templateId: string;
}): Promise<CampaignResult> {
  const result = await keeperRequest<CampaignResult>('/producer/marketing/whatsapp/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
    idempotencyKey: getUUID(),
  });
  if (!result?.id || !result?.status) {
    throw new Error('API não confirmou o agendamento WhatsApp.');
  }
  return result;
}

/**
 * Registra o agendamento de uma campanha de E-mail Marketing.
 * Não simula confirmação fictícia; exige ID e status retornado pelo provedor SMTP.
 */
export async function launchEmail(payload: {
  subject: string;
  template: string;
  event: string;
  audience: string;
  message: string;
}): Promise<CampaignResult> {
  const result = await keeperRequest<CampaignResult>('/producer/marketing/email/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
    idempotencyKey: getUUID(),
  });
  if (!result?.id || !result?.status) {
    throw new Error('API não confirmou o agendamento do e-mail.');
  }
  return result;
}

/**
 * Consulta listagem de campanhas de tráfego registradas no backend
 */
export async function getPaidCampaigns(eventId?: string): Promise<any[]> {
  try {
    const query = eventId ? `?eventId=${encodeURIComponent(eventId)}` : '';
    const result = await keeperRequest<any[]>(`/producer/marketing/campaigns${query}`, {
      method: 'GET',
    });
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}
