import { keeperRequest, ApiError } from './client';
import {
  mockProducer,
  mockEvents,
  mockWallets,
  mockLedgerEntries,
  mockPayoutRequests,
  mockAdvanceRequests,
  mockCommercialClients,
  mockCommercialOpportunities,
  mockCommercialProposals,
  mockMarketingCampaigns,
  mockAbandonedCarts,
} from './mockSeedData';
import { Producer } from '@/types/producer';
import { EventItem } from '@/types/event';
import {
  EventWalletPosition,
  FinancialLedgerEntry,
  PayoutRequest,
  AdvanceRequest,
} from '@/types/finance';

export class KeeperOfflineError extends Error {
  isOffline: boolean;
  endpoint: string;
  lastConfirmedAt?: string;
  cachedData?: any;

  constructor(
    message: string,
    endpoint: string,
    lastConfirmedAt?: string,
    cachedData?: any
  ) {
    super(message);
    this.name = 'KeeperOfflineError';
    this.isOffline = true;
    this.endpoint = endpoint;
    this.lastConfirmedAt = lastConfirmedAt;
    this.cachedData = cachedData;
  }
}

// Helpers para preservação de dados confirmados em auditoria
function getCachedSnapshot<T>(key: string): { data: T; timestamp: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`keeper_confirmed_${key}`);
    const time = localStorage.getItem(`keeper_confirmed_time_${key}`);
    if (raw && time) {
      return { data: JSON.parse(raw), timestamp: time };
    }
  } catch {
    // ignore
  }
  return null;
}

function saveConfirmedSnapshot(key: string, data: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`keeper_confirmed_${key}`, JSON.stringify(data));
    localStorage.setItem(`keeper_confirmed_time_${key}`, new Date().toISOString());
  } catch {
    // ignore
  }
}

export const keeperAdapter = {
  getLastSyncTime(key: string): string | null {
    const snap = getCachedSnapshot(key);
    return snap?.timestamp || null;
  },

  /**
   * Consulta os dados cadastrais e KPIs consolidados do Produtor
   * Consome GET /financeiro/settlement/producers/:id/overview do Keeper
   */
  async getProducerOverview(producerId = 'prod-01'): Promise<Producer> {
    const cacheKey = `producer_${producerId}`;
    try {
      const data = await keeperRequest<any>(
        `/financeiro/settlement/producers/${producerId}/overview`
      );
      if (data && data.producer) {
        const result: Producer = {
          ...data.producer,
          kpis: data.consolidatedKpis || data.producer.kpis,
        };
        saveConfirmedSnapshot(cacheKey, result);
        return result;
      }
    } catch (err: any) {
      const cached = getCachedSnapshot<Producer>(cacheKey);
      throw new KeeperOfflineError(
        'Serviço cadastral e financeiro do produtor indisponível no Keeper ERP.',
        `/financeiro/settlement/producers/${producerId}/overview`,
        cached?.timestamp,
        cached?.data || mockProducer
      );
    }
    return mockProducer;
  },

  /**
   * Central de Eventos do Produtor
   * Lista todos os eventos com estatísticas consolidadas
   */
  async getEvents(producerId = 'prod-01'): Promise<EventItem[]> {
    const cacheKey = `events_${producerId}`;
    try {
      const data = await keeperRequest<any>(
        `/financeiro/settlement/producers/${producerId}/overview`
      );
      if (data && Array.isArray(data.events)) {
        saveConfirmedSnapshot(cacheKey, data.events);
        return data.events;
      }
    } catch {
      const cached = getCachedSnapshot<EventItem[]>(cacheKey);
      if (cached?.data) return cached.data;
    }
    return mockEvents;
  },

  /**
   * Dashboard Individual do Evento
   * Consome GET /financeiro/settlement/events/:id/financial-detail
   */
  async getEventById(eventId: string): Promise<EventItem | null> {
    const localEvent = mockEvents.find((e) => e.id === eventId) || mockEvents[0];
    const cacheKey = `event_detail_${eventId}`;
    try {
      const financialDetail = await keeperRequest<any>(
        `/financeiro/settlement/events/${eventId}/financial-detail`
      );
      if (financialDetail) {
        const enriched = {
          ...localEvent,
          grossSales: financialDetail.vendasBrutas || localEvent.grossSales,
        };
        saveConfirmedSnapshot(cacheKey, enriched);
        return enriched;
      }
    } catch {
      const cached = getCachedSnapshot<EventItem>(cacheKey);
      if (cached?.data) return cached.data;
    }
    return localEvent;
  },

  /**
   * Carteiras dos Eventos (Regra estrita: nunca simula saldos)
   * Consome GET /financeiro/settlement/wallets
   */
  async getEventWallets(): Promise<EventWalletPosition[]> {
    const cacheKey = 'wallets';
    try {
      const data = await keeperRequest<EventWalletPosition[]>(
        '/financeiro/settlement/wallets'
      );
      if (Array.isArray(data) && data.length > 0) {
        saveConfirmedSnapshot(cacheKey, data);
        return data;
      }
    } catch (err: any) {
      const cached = getCachedSnapshot<EventWalletPosition[]>(cacheKey);
      throw new KeeperOfflineError(
        'Serviço financeiro temporariamente indisponível no Keeper ERP. Não foi possível consultar as carteiras oficiais.',
        '/financeiro/settlement/wallets',
        cached?.timestamp,
        cached?.data
      );
    }
    const cached = getCachedSnapshot<EventWalletPosition[]>(cacheKey);
    if (cached?.data) return cached.data;
    throw new KeeperOfflineError(
      'Nenhuma carteira financeira confirmada foi localizada no Keeper ERP.',
      '/financeiro/settlement/wallets'
    );
  },

  /**
   * Livro Financeiro Imutável (Financial Ledger oficial)
   * Consome GET /financeiro/settlement/ledger
   */
  async getLedgerEntries(params?: {
    producerId?: string;
    eventId?: string;
    entryType?: string;
  }): Promise<FinancialLedgerEntry[]> {
    const cacheKey = 'ledger';
    try {
      const query = new URLSearchParams();
      if (params?.producerId) query.append('producerId', params.producerId);
      if (params?.eventId) query.append('eventId', params.eventId);
      if (params?.entryType) query.append('entryType', params.entryType);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const data = await keeperRequest<FinancialLedgerEntry[]>(
        `/financeiro/settlement/ledger${qs}`
      );
      if (Array.isArray(data) && data.length > 0) {
        saveConfirmedSnapshot(cacheKey, data);
        return data;
      }
    } catch (err: any) {
      const cached = getCachedSnapshot<FinancialLedgerEntry[]>(cacheKey);
      throw new KeeperOfflineError(
        'Serviço de Ledger financeiro indisponível no Keeper ERP.',
        '/financeiro/settlement/ledger',
        cached?.timestamp,
        cached?.data
      );
    }
    const cached = getCachedSnapshot<FinancialLedgerEntry[]>(cacheKey);
    if (cached?.data) return cached.data;
    throw new KeeperOfflineError(
      'Extrato do Ledger financeiro indisponível.',
      '/financeiro/settlement/ledger'
    );
  },

  /**
   * Solicitações e Programação de Repasses
   * Consome GET /financeiro/settlement/schedules
   */
  async getPayoutRequests(): Promise<PayoutRequest[]> {
    const cacheKey = 'payout_schedules';
    try {
      const data = await keeperRequest<PayoutRequest[]>(
        '/financeiro/settlement/schedules'
      );
      if (Array.isArray(data) && data.length > 0) {
        saveConfirmedSnapshot(cacheKey, data);
        return data;
      }
    } catch (err: any) {
      const cached = getCachedSnapshot<PayoutRequest[]>(cacheKey);
      throw new KeeperOfflineError(
        'Serviço de programação de repasses indisponível no Keeper ERP.',
        '/financeiro/settlement/schedules',
        cached?.timestamp,
        cached?.data
      );
    }
    const cached = getCachedSnapshot<PayoutRequest[]>(cacheKey);
    if (cached?.data) return cached.data;
    throw new KeeperOfflineError(
      'Programação de repasses indisponível.',
      '/financeiro/settlement/schedules'
    );
  },

  async getPayoutSchedules(): Promise<PayoutRequest[]> {
    return this.getPayoutRequests();
  },

  /**
   * Inicia Solicitação de Repasse com Chave de Idempotência
   * Consome POST /financeiro/settlement/producers/:id/repayments
   *
   * REGRA CRÍTICA DE AUDITORIA:
   * NUNCA SIMULAR SUCESSO OU ADICIONAR RECORD FICTÍCIO EM CASO DE FALHA.
   * Se o Keeper ERP falhar, lançar a exceção diretamente para o frontend.
   */
  async requestPayout(
    producerId: string,
    eventId: string,
    payload: {
      amount: number;
      paymentMethod: string;
      notes?: string;
    }
  ): Promise<PayoutRequest> {
    const idempotencyKey = `payout_${producerId}_${eventId}_${Date.now()}`;
    // Executa a chamada oficial sem capturar silenciosamente
    const res = await keeperRequest<PayoutRequest>(
      `/financeiro/settlement/producers/${producerId}/repayments?eventId=${eventId}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        idempotencyKey,
      }
    );

    if (!res || !res.id) {
      throw new ApiError(
        'Resposta inválida do Keeper ERP ao submeter solicitação de repasse.',
        500
      );
    }

    return res;
  },

  /**
   * Inicia Solicitação de Antecipação
   * Consome POST /financeiro/settlement/producers/:id/advances
   *
   * REGRA CRÍTICA DE AUDITORIA:
   * NUNCA SIMULAR ANTECIPAÇÃO FICTÍCIA.
   */
  async requestAdvance(
    producerId: string,
    eventId: string,
    payload: { requestedAmount: number }
  ): Promise<AdvanceRequest> {
    const idempotencyKey = `adv_${producerId}_${eventId}_${Date.now()}`;
    const res = await keeperRequest<AdvanceRequest>(
      `/financeiro/settlement/producers/${producerId}/advances?eventId=${eventId}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        idempotencyKey,
      }
    );

    if (!res || !res.id) {
      throw new ApiError(
        'Resposta inválida do Keeper ERP ao submeter solicitação de antecipação.',
        500
      );
    }

    return res;
  },

  // Módulos Comerciais
  async getCommercialClients() {
    return mockCommercialClients;
  },
  async getCommercialOpportunities() {
    return mockCommercialOpportunities;
  },
  async getCommercialProposals() {
    return mockCommercialProposals;
  },

  // Marketing e Remarketing
  async getMarketingCampaigns() {
    return mockMarketingCampaigns;
  },
  async getAbandonedCarts() {
    return mockAbandonedCarts;
  },
};
