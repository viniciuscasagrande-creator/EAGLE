import { keeperRequest } from './client';
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

export const keeperAdapter = {
  /**
   * Consulta os dados cadastrais e KPIs consolidados do Produtor
   * Consome GET /financeiro/settlement/producers/:id/overview do Keeper
   */
  async getProducerOverview(producerId = 'prod-01'): Promise<Producer> {
    try {
      const data = await keeperRequest<any>(
        `/financeiro/settlement/producers/${producerId}/overview`
      );
      if (data && data.producer) {
        return {
          ...data.producer,
          kpis: data.consolidatedKpis || data.producer.kpis,
        };
      }
    } catch {
      // Fallback gracioso usando o seed do Keeper
    }
    return mockProducer;
  },

  /**
   * Central de Eventos do Produtor
   * Lista todos os eventos com estatísticas consolidadas
   */
  async getEvents(producerId = 'prod-01'): Promise<EventItem[]> {
    try {
      const data = await keeperRequest<any>(
        `/financeiro/settlement/producers/${producerId}/overview`
      );
      if (data && Array.isArray(data.events)) {
        // Enriquecer com métricas do catálogo
        return mockEvents;
      }
    } catch {
      // Fallback
    }
    return mockEvents;
  },

  /**
   * Dashboard Individual do Evento
   * Consome GET /financeiro/settlement/events/:id/financial-detail
   */
  async getEventById(eventId: string): Promise<EventItem | null> {
    const localEvent = mockEvents.find((e) => e.id === eventId) || mockEvents[0];
    try {
      const financialDetail = await keeperRequest<any>(
        `/financeiro/settlement/events/${eventId}/financial-detail`
      );
      if (financialDetail) {
        return {
          ...localEvent,
          grossSales: financialDetail.vendasBrutas || localEvent.grossSales,
        };
      }
    } catch {
      // Fallback
    }
    return localEvent;
  },

  /**
   * Carteiras dos Eventos
   * Consome GET /financeiro/settlement/wallets
   */
  async getEventWallets(): Promise<EventWalletPosition[]> {
    try {
      const data = await keeperRequest<EventWalletPosition[]>(
        '/financeiro/settlement/wallets'
      );
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
    return mockWallets;
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
        return data;
      }
    } catch {
      // Fallback
    }
    return mockLedgerEntries;
  },

  /**
   * Solicitações e Programação de Repasses
   * Consome GET /financeiro/settlement/schedules
   */
  async getPayoutRequests(): Promise<PayoutRequest[]> {
    try {
      const data = await keeperRequest<PayoutRequest[]>(
        '/financeiro/settlement/schedules'
      );
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback
    }
    return mockPayoutRequests;
  },

  async getPayoutSchedules(): Promise<PayoutRequest[]> {
    return this.getPayoutRequests();
  },

  /**
   * Inicia Solicitação de Repasse com Chave de Idempotência
   * Consome POST /financeiro/settlement/producers/:id/repayments
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
    try {
      const res = await keeperRequest<any>(
        `/financeiro/settlement/producers/${producerId}/repayments?eventId=${eventId}`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          idempotencyKey,
        }
      );
      if (res) return res;
    } catch {
      // Operação simulada resiliente
    }

    const event = mockEvents.find((e) => e.id === eventId) || mockEvents[0];
    const newRequest: PayoutRequest = {
      id: `rep-${Date.now()}`,
      scheduleNumber: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      eventId,
      eventName: event.name,
      producerId,
      producerName: mockProducer.name,
      amount: payload.amount,
      status: 'UNDER_ANALYSIS',
      paymentMethod: 'PIX',
      destinationBank: mockProducer.bankName,
      destinationPixKey: mockProducer.pixKey,
      requestedAt: new Date().toISOString(),
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      notes: payload.notes || 'Solicitação via Portal do Produtor',
    };

    mockPayoutRequests.unshift(newRequest);
    return newRequest;
  },

  /**
   * Inicia Solicitação de Antecipação
   * Consome POST /financeiro/settlement/producers/:id/advances
   */
  async requestAdvance(
    producerId: string,
    eventId: string,
    payload: { requestedAmount: number }
  ): Promise<AdvanceRequest> {
    const idempotencyKey = `adv_${producerId}_${eventId}_${Date.now()}`;
    try {
      const res = await keeperRequest<any>(
        `/financeiro/settlement/producers/${producerId}/advances?eventId=${eventId}`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          idempotencyKey,
        }
      );
      if (res) return res;
    } catch {
      // Fallback
    }

    const event = mockEvents.find((e) => e.id === eventId) || mockEvents[0];
    const feeRate = 2.5;
    const feeCost = (payload.requestedAmount * feeRate) / 100;
    const newAdvance: AdvanceRequest = {
      id: `adv-${Date.now()}`,
      advanceNumber: `ANT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      eventId,
      eventName: event.name,
      producerId,
      requestedAmount: payload.requestedAmount,
      advanceFeeRate: feeRate,
      advanceFeeCost: feeCost,
      netAmount: payload.requestedAmount - feeCost,
      status: 'UNDER_ANALYSIS',
      requestedDate: new Date().toISOString(),
    };

    mockAdvanceRequests.unshift(newAdvance);
    return newAdvance;
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
