import { keeperRequest, ApiError, checkKeeperHealth } from './client';
import { API_ENDPOINTS } from './endpoints';
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
import { EventItem, TicketBatch, TicketSector } from '@/types/event';
import {
  EventWalletPosition,
  FinancialLedgerEntry,
  PayoutRequest,
  AdvanceRequest,
  EventFeeRuleSummary,
} from '@/types/finance';
import {
  CommercialClient,
  CommercialOpportunity,
  CommercialProposal,
  CommercialPartner,
  CorporateOrder,
  CorporateAttendee,
  PartnerSettlement,
} from '@/types/commercial';
import { MarketingCampaign, ReadyCampaignInstance } from '@/types/marketing';
import { AbandonedCart, RecoveryOpportunity } from '@/types/remarketing';

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

// Helpers para preservação de dados e sincronização reativa (localStorage com audit snapshot)
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

function getStoredCollection<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(`eagle_store_${key}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return defaultData;
}

function saveStoredCollection<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`eagle_store_${key}`, JSON.stringify(data));
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
   * Diagnóstico em tempo real da conexão com o Keeper Core API
   */
  async testKeeperConnection() {
    return await checkKeeperHealth();
  },

  // ==========================================
  // MÓDULO 1: PRODUTOR & SESSÃO
  // ==========================================

  /**
   * Consulta os dados cadastrais e KPIs consolidados do Produtor
   * Consome GET /financeiro/settlement/producers/:id/overview do Keeper
   */
  async getProducerOverview(producerId = 'prod-01'): Promise<Producer> {
    const cacheKey = `producer_${producerId}`;
    try {
      const data = await keeperRequest<any>(
        API_ENDPOINTS.FINANCE.PRODUCER_OVERVIEW(producerId)
      );
      if (data && data.producer) {
        const result: Producer = {
          ...data.producer,
          kpis: data.consolidatedKpis || data.producer.kpis,
        };
        saveConfirmedSnapshot(cacheKey, result);
        return result;
      }
    } catch {
      const cached = getCachedSnapshot<Producer>(cacheKey);
      if (cached?.data) return cached.data;
    }
    return mockProducer;
  },

  // ==========================================
  // MÓDULO 2: EVENTOS
  // ==========================================

  /**
   * Central de Eventos do Produtor
   * Lista todos os eventos com estatísticas consolidadas
   */
  async getEvents(producerId = 'prod-01'): Promise<EventItem[]> {
    const cacheKey = `events_${producerId}`;
    try {
      const data = await keeperRequest<any>(
        API_ENDPOINTS.FINANCE.PRODUCER_OVERVIEW(producerId)
      );
      if (data && Array.isArray(data.events)) {
        saveConfirmedSnapshot(cacheKey, data.events);
        saveStoredCollection('events', data.events);
        return data.events;
      }
    } catch {
      const cached = getCachedSnapshot<EventItem[]>(cacheKey);
      if (cached?.data) return cached.data;
    }
    return getStoredCollection<EventItem>('events', mockEvents);
  },

  /**
   * Dashboard Individual do Evento
   */
  async getEventById(eventId: string): Promise<EventItem | null> {
    const events = getStoredCollection<EventItem>('events', mockEvents);
    const localEvent = events.find((e) => e.id === eventId) || events[0];
    const cacheKey = `event_detail_${eventId}`;
    try {
      const financialDetail = await keeperRequest<any>(
        API_ENDPOINTS.EVENTS.FINANCIAL_DETAIL(eventId)
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
   * Cadastra um novo evento de verdade no sistema e sincroniza com a carteira
   */
  async createEvent(payload: Partial<EventItem>): Promise<EventItem> {
    const newId = `evt-${Date.now()}`;
    const newCode = `EVT-${Math.floor(100 + Math.random() * 900)}`;
    const capacity = payload.totalCapacity || 2500;
    const goal = payload.salesGoalAmount || 250000;

    const newEvent: EventItem = {
      id: newId,
      name: payload.name || 'Novo Evento DiskIngressos',
      code: newCode,
      venue: payload.venue || 'Teatro Positivo / Live Curitiba',
      city: payload.city || 'Curitiba',
      state: payload.state || 'PR',
      dateStart: payload.dateStart || new Date().toISOString().split('T')[0],
      time: payload.time || '20:00',
      imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
      status: 'UPCOMING',
      producerId: 'prod-01',
      producerName: 'Prime Live Eventos & Entretenimento',
      grossSales: 0,
      ticketsSold: 0,
      totalCapacity: capacity,
      ticketsAvailable: capacity,
      courtesiesCount: 0,
      occupationRate: 0,
      averageTicket: 150,
      breakEvenTarget: Math.round(capacity * 0.45),
      breakEvenAchievedRate: 0,
      salesGoalAmount: goal,
      salesGoalAchievedRate: 0,
      projectedGrossSales: goal,
      salesVelocityPerHour: 0,
      paymentMethods: [
        { method: 'PIX', label: 'PIX (Instantâneo)', amount: 0, count: 0, percentage: 0, color: '#10b981' },
        { method: 'CREDIT_CARD', label: 'Cartão de Crédito', amount: 0, count: 0, percentage: 0, color: '#3b82f6' },
      ],
      sectors: [
        {
          id: `sec-${Date.now()}-1`,
          name: 'Pista Premium VIP',
          totalCapacity: Math.round(capacity * 0.4),
          soldCount: 0,
          availableCount: Math.round(capacity * 0.4),
          color: '#3b82f6',
          batches: [
            {
              id: `bat-${Date.now()}-1`,
              name: 'Lote 1 (Abertura)',
              price: 180,
              totalQuantity: Math.round(capacity * 0.4),
              soldQuantity: 0,
              availableQuantity: Math.round(capacity * 0.4),
              status: 'ACTIVE',
            },
          ],
        },
        {
          id: `sec-${Date.now()}-2`,
          name: 'Pista Geral',
          totalCapacity: Math.round(capacity * 0.6),
          soldCount: 0,
          availableCount: Math.round(capacity * 0.6),
          color: '#10b981',
          batches: [
            {
              id: `bat-${Date.now()}-2`,
              name: 'Lote 1 (Promocional)',
              price: 90,
              totalQuantity: Math.round(capacity * 0.6),
              soldQuantity: 0,
              availableQuantity: Math.round(capacity * 0.6),
              status: 'ACTIVE',
            },
          ],
        },
      ],
      timeline: [],
      recentOrders: [],
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.EVENTS.CREATE, {
        method: 'POST',
        body: JSON.stringify(newEvent),
      });
    } catch {
      // offline fallback
    }

    const currentList = getStoredCollection<EventItem>('events', mockEvents);
    const updated = [newEvent, ...currentList];
    saveStoredCollection('events', updated);
    return newEvent;
  },

  /**
   * Adiciona um lote / tier de ingressos a um evento
   */
  async addTicketTier(
    eventId: string,
    tier: {
      sectorId: string;
      batchName: string;
      price: number;
      totalQuantity: number;
    }
  ): Promise<EventItem | null> {
    try {
      await keeperRequest<any>(API_ENDPOINTS.EVENTS.CREATE_TIER(eventId), {
        method: 'POST',
        body: JSON.stringify(tier),
      });
    } catch {
      // offline fallback
    }

    const events = getStoredCollection<EventItem>('events', mockEvents);
    const eventIndex = events.findIndex((e) => e.id === eventId);
    if (eventIndex >= 0) {
      const ev = { ...events[eventIndex] };
      const sector = ev.sectors.find((s) => s.id === tier.sectorId) || ev.sectors[0];
      if (sector) {
        const newBatch: TicketBatch = {
          id: `bat-${Date.now()}`,
          name: tier.batchName,
          price: tier.price,
          totalQuantity: tier.totalQuantity,
          soldQuantity: 0,
          availableQuantity: tier.totalQuantity,
          status: 'ACTIVE',
        };
        sector.batches = [...sector.batches, newBatch];
        sector.totalCapacity += tier.totalQuantity;
        sector.availableCount += tier.totalQuantity;
        ev.totalCapacity += tier.totalQuantity;
        ev.ticketsAvailable += tier.totalQuantity;
      }
      events[eventIndex] = ev;
      saveStoredCollection('events', events);
      return ev;
    }
    return null;
  },

  /**
   * Emite uma nova cortesia VIP oficial
   */
  async issueCourtesy(
    eventId: string,
    courtesy: {
      guestName: string;
      email: string;
      sector: string;
      qty: number;
      authBy: string;
    }
  ): Promise<any> {
    const newCourtesy = {
      id: `cort-${Date.now()}`,
      eventId,
      ...courtesy,
      issuedAt: new Date().toISOString(),
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.EVENTS.ISSUE_COURTESY(eventId), {
        method: 'POST',
        body: JSON.stringify(newCourtesy),
      });
    } catch {
      // offline fallback
    }

    const defaultCourtesies = [
      { id: 'c-1', eventId: 'ev-101', guestName: 'Assessoria de Imprensa Banda X', email: 'imprensa@bandax.com', sector: 'Camarote Open Bar', qty: 10, authBy: 'Diretoria Produtor', issuedAt: '2026-10-04' },
      { id: 'c-2', eventId: 'ev-101', guestName: 'Patrocinador Master Banco', email: 'marketing@banco.com.br', sector: 'Pista Premium VIP', qty: 50, authBy: 'Contrato Comercial', issuedAt: '2026-10-02' },
      { id: 'c-3', eventId: 'ev-101', guestName: 'Apoiadores Culturais / Rádio FM', email: 'promo@radiocwb.fm.br', sector: 'Pista Geral', qty: 60, authBy: 'Permuta de Mídia', issuedAt: '2026-10-01' },
    ];
    const courtesies = getStoredCollection('courtesies', defaultCourtesies);
    saveStoredCollection('courtesies', [newCourtesy, ...courtesies]);

    // Atualiza contador no evento
    const events = getStoredCollection<EventItem>('events', mockEvents);
    const eventIndex = events.findIndex((e) => e.id === eventId);
    if (eventIndex >= 0) {
      events[eventIndex].courtesiesCount += courtesy.qty;
      saveStoredCollection('events', events);
    }

    return newCourtesy;
  },

  getCourtesies(eventId?: string) {
    const defaultCourtesies = [
      { id: 'c-1', eventId: 'ev-101', guestName: 'Assessoria de Imprensa Banda X', email: 'imprensa@bandax.com', sector: 'Camarote Open Bar', qty: 10, authBy: 'Diretoria Produtor', issuedAt: '2026-10-04' },
      { id: 'c-2', eventId: 'ev-101', guestName: 'Patrocinador Master Banco', email: 'marketing@banco.com.br', sector: 'Pista Premium VIP', qty: 50, authBy: 'Contrato Comercial', issuedAt: '2026-10-02' },
      { id: 'c-3', eventId: 'ev-101', guestName: 'Apoiadores Culturais / Rádio FM', email: 'promo@radiocwb.fm.br', sector: 'Pista Geral', qty: 60, authBy: 'Permuta de Mídia', issuedAt: '2026-10-01' },
    ];
    const all = getStoredCollection('courtesies', defaultCourtesies);
    if (eventId) return all.filter((c: any) => c.eventId === eventId);
    return all;
  },

  // ==========================================
  // MÓDULO 3: FINANCEIRO & KEEPER SETTLEMENT
  // ==========================================

  /**
   * Carteiras dos Eventos (Regra estrita: nunca simula saldos nem forja repasses)
   * Consome GET /financeiro/settlement/wallets
   */
  async getEventWallets(): Promise<EventWalletPosition[]> {
    const cacheKey = 'wallets';
    try {
      const data = await keeperRequest<EventWalletPosition[]>(
        API_ENDPOINTS.FINANCE.WALLETS
      );
      if (Array.isArray(data) && data.length > 0) {
        saveConfirmedSnapshot(cacheKey, data);
        return data;
      }
    } catch (err: any) {
      const cached = getCachedSnapshot<EventWalletPosition[]>(cacheKey);
      if (cached?.data && Array.isArray(cached.data) && cached.data.length > 0) {
        return cached.data;
      }
      throw new KeeperOfflineError(
        'Serviço financeiro do Keeper ERP temporariamente inacessível. Saldos contábeis oficiais não podem ser calculados sem conexão.',
        API_ENDPOINTS.FINANCE.WALLETS,
        cached?.timestamp
      );
    }
    const cached = getCachedSnapshot<EventWalletPosition[]>(cacheKey);
    if (cached?.data && Array.isArray(cached.data) && cached.data.length > 0) {
      return cached.data;
    }
    throw new KeeperOfflineError(
      'Nenhuma posição de carteira financeira confirmada pelo servidor Keeper ERP.',
      API_ENDPOINTS.FINANCE.WALLETS
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
        `${API_ENDPOINTS.FINANCE.LEDGER}${qs}`
      );
      if (Array.isArray(data) && data.length > 0) {
        saveConfirmedSnapshot(cacheKey, data);
        return data;
      }
    } catch (err: any) {
      const cached = getCachedSnapshot<FinancialLedgerEntry[]>(cacheKey);
      if (cached?.data && Array.isArray(cached.data) && cached.data.length > 0) {
        return cached.data;
      }
      throw new KeeperOfflineError(
        'Extrato Ledger contábil indisponível no servidor Keeper ERP.',
        API_ENDPOINTS.FINANCE.LEDGER,
        cached?.timestamp
      );
    }
    const cached = getCachedSnapshot<FinancialLedgerEntry[]>(cacheKey);
    if (cached?.data && Array.isArray(cached.data) && cached.data.length > 0) {
      return cached.data;
    }
    throw new KeeperOfflineError(
      'Nenhum lançamento no Ledger contábil confirmado pelo Keeper ERP.',
      API_ENDPOINTS.FINANCE.LEDGER
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
        API_ENDPOINTS.FINANCE.SCHEDULES
      );
      if (Array.isArray(data) && data.length > 0) {
        saveConfirmedSnapshot(cacheKey, data);
        return data;
      }
    } catch (err: any) {
      const cached = getCachedSnapshot<PayoutRequest[]>(cacheKey);
      if (cached?.data && Array.isArray(cached.data) && cached.data.length > 0) {
        return cached.data;
      }
      throw new KeeperOfflineError(
        'Agenda de repasses indisponível no servidor Keeper ERP.',
        API_ENDPOINTS.FINANCE.SCHEDULES,
        cached?.timestamp
      );
    }
    const cached = getCachedSnapshot<PayoutRequest[]>(cacheKey);
    if (cached?.data && Array.isArray(cached.data) && cached.data.length > 0) {
      return cached.data;
    }
    throw new KeeperOfflineError(
      'Nenhum agendamento de repasse confirmado pelo Keeper ERP.',
      API_ENDPOINTS.FINANCE.SCHEDULES
    );
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
    const res = await keeperRequest<PayoutRequest>(
      `${API_ENDPOINTS.FINANCE.REPAYMENTS(producerId)}?eventId=${eventId}`,
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
   */
  async requestAdvance(
    producerId: string,
    eventId: string,
    payload: { requestedAmount: number }
  ): Promise<AdvanceRequest> {
    const idempotencyKey = `adv_${producerId}_${eventId}_${Date.now()}`;
    const res = await keeperRequest<AdvanceRequest>(
      `${API_ENDPOINTS.FINANCE.ADVANCES(producerId)}?eventId=${eventId}`,
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

  /**
   * Consulta as regras comerciais e alíquotas de taxas oficiais do Keeper
   */
  async getCommercialRules(): Promise<EventFeeRuleSummary[]> {
    try {
      const data = await keeperRequest<EventFeeRuleSummary[]>(
        API_ENDPOINTS.FINANCE.COMMERCIAL_RULES
      );
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // offline fallback
    }
    return [
      { id: '1', feeCode: 'DISK_FEE', feeName: 'Taxa DiskIngressos', calculationType: 'PERCENTAGE', rate: 10.0, fixedAmount: 0, payer: 'CUSTOMER', basisType: 'Valor Face do Ingresso', validFrom: '01/08/2026', isActive: true },
      { id: '2', feeCode: 'SPREAD', feeName: 'Spread Financeiro (Cartão/PIX)', calculationType: 'PERCENTAGE', rate: 2.5, fixedAmount: 0, payer: 'PRODUCER', basisType: 'Volume Bruto Processado', validFrom: '01/10/2026', isActive: true },
      { id: '3', feeCode: 'RESERVA', feeName: 'Reserva de Contingência', calculationType: 'PERCENTAGE', rate: 10.0, fixedAmount: 0, payer: 'PRODUCER', basisType: 'Saldo Líquido da Carteira', validFrom: '01/09/2026', isActive: true },
      { id: '4', feeCode: 'MDR_PARCELADO', feeName: 'Juros Parcelamento Cartão (Até 12x)', calculationType: 'PERCENTAGE', rate: 1.99, fixedAmount: 0, payer: 'CUSTOMER', basisType: 'Juros ao Comprador', validFrom: '01/01/2026', isActive: true },
    ];
  },

  // ==========================================
  // MÓDULO 4: COMERCIAL & CRM B2B
  // ==========================================

  async getCommercialClients(): Promise<CommercialClient[]> {
    try {
      const data = await keeperRequest<CommercialClient[]>(API_ENDPOINTS.COMMERCIAL.CLIENTS);
      if (Array.isArray(data) && data.length > 0) {
        saveStoredCollection('commercial_clients', data);
        return data;
      }
    } catch {
      // offline fallback
    }
    return getStoredCollection<CommercialClient>('commercial_clients', mockCommercialClients);
  },

  async createCommercialClient(client: Partial<CommercialClient>): Promise<CommercialClient> {
    const newClient: CommercialClient = {
      id: `cli-${Date.now()}`,
      name: client.name || 'Nova Empresa Cliente',
      tradeName: client.tradeName || client.name,
      document: client.document || '00.000.000/0001-00',
      contactName: client.contactName || 'Contato Principal',
      contactRole: client.contactRole || 'Diretor / Coordenador',
      email: client.email || 'contato@empresa.com.br',
      phone: client.phone || '(41) 99999-0000',
      city: client.city || 'Curitiba/PR',
      address: client.address || 'Av. República Argentina, 1200 - Água Verde',
      category: client.category || 'EMPRESA',
      totalOrders: 0,
      totalVolume: 0,
      lastPurchaseDate: new Date().toISOString(),
      tags: client.tags || ['Novo Lead', 'Corporativo'],
      notes: client.notes || 'Cliente cadastrado via Eagle One Comercial.',
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.CLIENTS, {
        method: 'POST',
        body: JSON.stringify(newClient),
      });
    } catch {}

    const list = getStoredCollection<CommercialClient>('commercial_clients', mockCommercialClients);
    const updated = [newClient, ...list];
    saveStoredCollection('commercial_clients', updated);
    return newClient;
  },

  async updateCommercialClient(id: string, updates: Partial<CommercialClient>): Promise<CommercialClient[]> {
    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.CLIENT_DETAIL(id), {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {}

    const list = getStoredCollection<CommercialClient>('commercial_clients', mockCommercialClients);
    const updated = list.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveStoredCollection('commercial_clients', updated);
    return updated;
  },

  async getCommercialOpportunities(): Promise<CommercialOpportunity[]> {
    try {
      const data = await keeperRequest<CommercialOpportunity[]>(API_ENDPOINTS.COMMERCIAL.OPPORTUNITIES);
      if (Array.isArray(data) && data.length > 0) {
        saveStoredCollection('commercial_opportunities', data);
        return data;
      }
    } catch {}
    return getStoredCollection<CommercialOpportunity>('commercial_opportunities', mockCommercialOpportunities);
  },

  async createCommercialOpportunity(opp: Partial<CommercialOpportunity>): Promise<CommercialOpportunity> {
    const newOpp: CommercialOpportunity = {
      id: `opp-${Date.now()}`,
      title: opp.title || 'Cota Comercial VIP',
      clientName: opp.clientName || 'Cliente Corporativo',
      eventName: opp.eventName || 'Festival de Verão Curitiba 2026',
      stage: opp.stage || 'PROSPECCAO',
      estimatedValue: opp.estimatedValue || 25000,
      ticketsQuantity: opp.ticketsQuantity || 50,
      assignedTo: opp.assignedTo || 'Vinicius Casagrande',
      probability: opp.probability || 30,
      closeDate: opp.closeDate || '2026-11-15',
      notes: opp.notes || 'Iniciado contato comercial pelo Eagle One.',
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.OPPORTUNITIES, {
        method: 'POST',
        body: JSON.stringify(newOpp),
      });
    } catch {}

    const list = getStoredCollection<CommercialOpportunity>('commercial_opportunities', mockCommercialOpportunities);
    const updated = [newOpp, ...list];
    saveStoredCollection('commercial_opportunities', updated);
    return newOpp;
  },

  async updateCommercialOpportunity(id: string, updates: Partial<CommercialOpportunity>): Promise<CommercialOpportunity[]> {
    try {
      await keeperRequest<any>(`${API_ENDPOINTS.COMMERCIAL.OPPORTUNITIES}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {}

    const list = getStoredCollection<CommercialOpportunity>('commercial_opportunities', mockCommercialOpportunities);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    saveStoredCollection('commercial_opportunities', updated);
    return updated;
  },

  async updateCommercialOpportunityStage(
    id: string,
    stage: CommercialOpportunity['stage'],
    lossReason?: string
  ): Promise<CommercialOpportunity[]> {
    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.OPPORTUNITY_STAGE(id), {
        method: 'PATCH',
        body: JSON.stringify({ stage, lossReason }),
      });
    } catch {}

    const list = getStoredCollection<CommercialOpportunity>('commercial_opportunities', mockCommercialOpportunities);
    const updated = list.map((item) =>
      item.id === id
        ? {
            ...item,
            stage,
            lossReason: lossReason || item.lossReason,
            probability: stage === 'FECHADO_GANHO' ? 100 : stage === 'FECHADO_PERDIDO' ? 0 : item.probability,
          }
        : item
    );
    saveStoredCollection('commercial_opportunities', updated);
    return updated;
  },

  async getCommercialProposals(): Promise<CommercialProposal[]> {
    try {
      const data = await keeperRequest<CommercialProposal[]>(API_ENDPOINTS.COMMERCIAL.PROPOSALS);
      if (Array.isArray(data) && data.length > 0) {
        saveStoredCollection('commercial_proposals', data);
        return data;
      }
    } catch {}
    return getStoredCollection<CommercialProposal>('commercial_proposals', mockCommercialProposals);
  },

  async createCommercialProposal(prop: Partial<CommercialProposal>): Promise<CommercialProposal> {
    const num = `PROP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newProp: CommercialProposal = {
      id: `prop-${Date.now()}`,
      proposalNumber: num,
      clientName: prop.clientName || 'Empresa Interessada',
      eventId: prop.eventId || 'ev-101',
      eventName: prop.eventName || 'Festival de Verão Curitiba 2026',
      totalTickets: prop.totalTickets || 100,
      totalAmount: prop.totalAmount || 35000,
      discountRate: prop.discountRate || 10,
      status: 'ENVIADA',
      validUntil: prop.validUntil || '2026-10-31',
      createdAt: new Date().toISOString(),
      paymentTerms: prop.paymentTerms || 'Faturamento a Prazo 28 DDL com NF-e',
      notes: prop.notes || 'Incluso acesso exclusivo, credenciais nominais e suporte dedicado.',
      publicToken: `prop_${Math.random().toString(36).substring(2, 10)}`,
      items: prop.items || [
        {
          id: `item-1`,
          sectorName: 'Camarote Corporativo',
          quantity: prop.totalTickets || 100,
          unitPrice: ((prop.totalAmount || 35000) / (prop.totalTickets || 100)),
          total: prop.totalAmount || 35000,
        },
      ],
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.PROPOSALS, {
        method: 'POST',
        body: JSON.stringify(newProp),
      });
    } catch {}

    const list = getStoredCollection<CommercialProposal>('commercial_proposals', mockCommercialProposals);
    const updated = [newProp, ...list];
    saveStoredCollection('commercial_proposals', updated);
    return newProp;
  },

  async updateCommercialProposalStatus(id: string, status: CommercialProposal['status']): Promise<CommercialProposal[]> {
    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.PROPOSAL_STATUS(id), {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {}

    const list = getStoredCollection<CommercialProposal>('commercial_proposals', mockCommercialProposals);
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    saveStoredCollection('commercial_proposals', updated);
    return updated;
  },

  async duplicateCommercialProposal(id: string): Promise<CommercialProposal> {
    const list = getStoredCollection<CommercialProposal>('commercial_proposals', mockCommercialProposals);
    const origin = list.find((p) => p.id === id);
    if (!origin) throw new Error('Proposta de origem não encontrada.');

    const num = `PROP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const cloned: CommercialProposal = {
      ...origin,
      id: `prop-${Date.now()}`,
      proposalNumber: num,
      status: 'RASCUNHO',
      createdAt: new Date().toISOString(),
      publicToken: `prop_${Math.random().toString(36).substring(2, 10)}`,
      corporateOrderId: undefined,
    };

    const updated = [cloned, ...list];
    saveStoredCollection('commercial_proposals', updated);
    return cloned;
  },

  async convertProposalToCorporateOrder(proposalId: string): Promise<CorporateOrder> {
    const proposals = getStoredCollection<CommercialProposal>('commercial_proposals', mockCommercialProposals);
    const prop = proposals.find((p) => p.id === proposalId);
    if (!prop) throw new Error('Proposta não encontrada.');

    const newOrder: CorporateOrder = {
      id: `corp-${Date.now()}`,
      orderNumber: `CORP-2026-${Math.floor(100 + Math.random() * 900)}`,
      companyName: prop.clientName,
      cnpj: '02.434.341/0001-08',
      contactName: 'Gerência de Contratos & Compras',
      contactEmail: 'compras@empresa.com.br',
      eventName: prop.eventName,
      ticketQuantity: prop.totalTickets,
      sector: 'Camarote Corporativo / VIP',
      totalAmount: prop.totalAmount,
      paymentTerm: prop.paymentTerms || 'Faturado 15 DDL',
      paymentStatus: 'PENDING',
      invoiceIssued: false,
      dueDate: prop.validUntil,
      createdAt: new Date().toISOString(),
      proposalId: prop.id,
      boletoBarcode: '34191.79001 01043.510047 91020.150008 5 95000004800000',
      boletoDigitableLine: '34191790010104351004791020150008595000004800000',
      pixCode: `00020126580014br.gov.bcb.pix0136diskingressos-corp-${prop.proposalNumber.toLowerCase()}520400005303986540${prop.totalAmount}5802BR5925DISKINGRESSOS CORP6008CURITIBA62070503***6304`,
      attendees: [],
    };

    // Save corporate order
    const corpList = await this.getCorporateOrders();
    saveStoredCollection('corporate_orders', [newOrder, ...corpList]);

    // Mark proposal as approved & link order
    const updatedProposals = proposals.map((p) =>
      p.id === proposalId ? { ...p, status: 'APROVADA' as const, corporateOrderId: newOrder.id } : p
    );
    saveStoredCollection('commercial_proposals', updatedProposals);

    return newOrder;
  },

  async getPartners(): Promise<CommercialPartner[]> {
    const defaultPartners: CommercialPartner[] = [
      {
        id: 'part-01',
        name: 'OAB Seção Paraná',
        category: 'Conselho de Classe Profissional',
        couponCode: 'OABPR20',
        discountType: 'PERCENT',
        discountValue: 20,
        commissionRate: 5,
        ticketsSold: 420,
        grossSalesGenerated: 63000.0,
        commissionEarned: 3150.0,
        commissionPaid: 2000.0,
        status: 'ACTIVE',
        contactName: 'Dra. Luiza Nogueira (Comissão de Benefícios)',
        contactEmail: 'convenios@oabpr.org.br',
        contactPhone: '(41) 3250-5700',
        settlements: [
          { id: 'set-1', date: '2026-09-15', amount: 2000.0, receiptNumber: 'REC-0915-OAB', notes: 'Liquidação comissões Agosto/2026' }
        ]
      },
      {
        id: 'part-02',
        name: 'Clube Gazeta do Povo',
        category: 'Clube de Assinantes & Benefícios',
        couponCode: 'CLUBEGAZETA',
        discountType: 'PERCENT',
        discountValue: 15,
        commissionRate: 0,
        ticketsSold: 680,
        grossSalesGenerated: 102000.0,
        commissionEarned: 0,
        commissionPaid: 0,
        status: 'ACTIVE',
        contactName: 'Carlos Eduardo (Parcerias Editoriais)',
        contactEmail: 'parcerias@clube.gazetadopovo.com.br',
        contactPhone: '(41) 3321-5000',
        settlements: []
      },
      {
        id: 'part-03',
        name: 'Associação dos Funcionários Copel',
        category: 'Grêmio Corporativo',
        couponCode: 'COPELIANOS',
        discountType: 'PERCENT',
        discountValue: 25,
        commissionRate: 3,
        ticketsSold: 310,
        grossSalesGenerated: 46500.0,
        commissionEarned: 1395.0,
        commissionPaid: 0,
        status: 'ACTIVE',
        contactName: 'Renato Rossi (Diretoria Social)',
        contactEmail: 'social@copelianos.com.br',
        contactPhone: '(41) 3219-4400',
        settlements: []
      },
    ];
    return getStoredCollection('partners', defaultPartners);
  },

  async createPartner(partner: any): Promise<CommercialPartner> {
    const newPart: CommercialPartner = {
      id: `part-${Date.now()}`,
      ticketsSold: 0,
      grossSalesGenerated: 0,
      commissionEarned: 0,
      commissionPaid: 0,
      status: 'ACTIVE',
      settlements: [],
      ...partner,
    };
    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.PARTNERS, {
        method: 'POST',
        body: JSON.stringify(newPart),
      });
    } catch {}
    const list = await this.getPartners();
    const updated = [newPart, ...list];
    saveStoredCollection('partners', updated);
    return newPart;
  },

  async updatePartnerStatus(id: string, status: 'ACTIVE' | 'PAUSED'): Promise<CommercialPartner[]> {
    const list = await this.getPartners();
    const updated = list.map((p) => (p.id === id ? { ...p, status } : p));
    saveStoredCollection('partners', updated);
    return updated;
  },

  async settlePartnerCommission(id: string, amount: number, notes?: string): Promise<CommercialPartner[]> {
    const list = await this.getPartners();
    const updated = list.map((p) => {
      if (p.id === id) {
        const currentPaid = p.commissionPaid || 0;
        const newSettlement: PartnerSettlement = {
          id: `set-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount,
          receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
          notes: notes || 'Acerto de comissão executado via Eagle One.',
        };
        return {
          ...p,
          commissionPaid: currentPaid + amount,
          settlements: [newSettlement, ...(p.settlements || [])],
        };
      }
      return p;
    });
    saveStoredCollection('partners', updated);
    return updated;
  },

  async getCorporateOrders(): Promise<CorporateOrder[]> {
    const defaultCorporate: CorporateOrder[] = [
      {
        id: 'corp-01',
        orderNumber: 'CORP-2026-001',
        companyName: 'Renault do Brasil S.A.',
        cnpj: '02.434.341/0001-08',
        contactName: 'Juliana Prado (RH & Clima)',
        contactEmail: 'juliana.prado@renault.com.br',
        contactPhone: '(41) 3380-2000',
        eventName: 'Festival de Verão Curitiba 2026',
        ticketQuantity: 150,
        sector: 'Camarote Open Bar',
        totalAmount: 48000.0,
        paymentTerm: 'Faturado 15 DDL',
        paymentStatus: 'PAID',
        invoiceIssued: true,
        invoiceNumber: 'NFE-2026-8942',
        invoiceKey: '41261002434341000108550010000089421008420192',
        dueDate: '2026-10-16',
        createdAt: '2026-10-01T10:30:00',
        boletoBarcode: '23793.38128 60000.000003 01000.000002 1 95000004800000',
        boletoDigitableLine: '23793381286000000000301000000002195000004800000',
        pixCode: '00020126580014br.gov.bcb.pix0136diskingressos-corp-001520400005303986540480005802BR5925DISKINGRESSOS6008CURITIBA62070503***6304',
        attendees: [
          { id: 'att-1', name: 'Carlos Henrique Braga', document: '012.345.678-90', email: 'carlos.braga@renault.com.br', sector: 'Camarote Open Bar', ticketCode: 'TKT-RNLT-001', checkedIn: false },
          { id: 'att-2', name: 'Mariana Duarte Souza', document: '234.567.890-12', email: 'mariana.souza@renault.com.br', sector: 'Camarote Open Bar', ticketCode: 'TKT-RNLT-002', checkedIn: false },
        ]
      },
      {
        id: 'corp-02',
        orderNumber: 'CORP-2026-002',
        companyName: 'ExxonMobil BSC Curitiba',
        cnpj: '03.882.119/0001-90',
        contactName: 'Ricardo Meireles (Marketing Institucional)',
        contactEmail: 'ricardo.meireles@exxonmobil.com',
        contactPhone: '(41) 3217-7000',
        eventName: 'Festival de Verão Curitiba 2026',
        ticketQuantity: 80,
        sector: 'Pista Premium VIP',
        totalAmount: 20000.0,
        paymentTerm: 'Faturado 30 DDL',
        paymentStatus: 'PENDING',
        invoiceIssued: true,
        invoiceNumber: 'NFE-2026-8943',
        invoiceKey: '41261003882119000190550010000089431008420193',
        dueDate: '2026-10-29',
        createdAt: '2026-09-29T14:15:00',
        boletoBarcode: '34191.79001 01043.510047 91020.150008 5 95000002000000',
        boletoDigitableLine: '34191790010104351004791020150008595000002000000',
        pixCode: '00020126580014br.gov.bcb.pix0136diskingressos-corp-002520400005303986540200005802BR5925DISKINGRESSOS6008CURITIBA62070503***6304',
        attendees: []
      },
      {
        id: 'corp-03',
        orderNumber: 'CORP-2026-003',
        companyName: 'Associação Médica Paranaense',
        cnpj: '76.123.456/0001-12',
        contactName: 'Dr. Fernando Lins (Diretoria Social)',
        contactEmail: 'social@amp.org.br',
        contactPhone: '(41) 3242-9393',
        eventName: 'Stand-up Especial 2026',
        ticketQuantity: 200,
        sector: 'Plateia Central',
        totalAmount: 30000.0,
        paymentTerm: 'À vista PIX',
        paymentStatus: 'PAID',
        invoiceIssued: true,
        invoiceNumber: 'NFE-2026-8944',
        invoiceKey: '41261076123456000112550010000089441008420194',
        dueDate: '2026-10-02',
        createdAt: '2026-10-02T16:00:00',
        boletoBarcode: '34191.79001 01043.510047 91020.150008 5 95000003000000',
        boletoDigitableLine: '34191790010104351004791020150008595000003000000',
        pixCode: '00020126580014br.gov.bcb.pix0136diskingressos-corp-003520400005303986540300005802BR5925DISKINGRESSOS6008CURITIBA62070503***6304',
        attendees: []
      },
    ];
    return getStoredCollection('corporate_orders', defaultCorporate);
  },

  async createCorporateOrder(order: any): Promise<CorporateOrder> {
    const newOrder: CorporateOrder = {
      id: `corp-${Date.now()}`,
      orderNumber: `CORP-2026-${Math.floor(100 + Math.random() * 900)}`,
      paymentStatus: 'PENDING',
      invoiceIssued: false,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      boletoBarcode: `34191.79001 01043.510047 91020.150008 5 9500000${Math.floor(order.totalAmount || 10000)}`,
      boletoDigitableLine: `3419179001010435100479102015000859500000${Math.floor(order.totalAmount || 10000)}`,
      pixCode: `00020126580014br.gov.bcb.pix0136diskingressos-corp-${Date.now()}520400005303986540${order.totalAmount || 10000}5802BR5925DISKINGRESSOS6008CURITIBA62070503***6304`,
      attendees: [],
      ...order,
    };
    try {
      await keeperRequest<any>(API_ENDPOINTS.COMMERCIAL.CORPORATE_ORDERS, {
        method: 'POST',
        body: JSON.stringify(newOrder),
      });
    } catch {}
    const list = await this.getCorporateOrders();
    const updated = [newOrder, ...list];
    saveStoredCollection('corporate_orders', updated);
    return newOrder;
  },

  async updateCorporateOrderStatus(
    id: string,
    updates: Partial<CorporateOrder>
  ): Promise<CorporateOrder[]> {
    const list = await this.getCorporateOrders();
    const updated = list.map((order) => (order.id === id ? { ...order, ...updates } : order));
    saveStoredCollection('corporate_orders', updated);
    return updated;
  },

  async importCorporateAttendees(orderId: string, attendees: CorporateAttendee[]): Promise<CorporateOrder[]> {
    const list = await this.getCorporateOrders();
    const updated = list.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          attendees: [...(order.attendees || []), ...attendees],
        };
      }
      return order;
    });
    saveStoredCollection('corporate_orders', updated);
    return updated;
  },

  // ==========================================
  // MÓDULO 5: MARKETING & CAMPANHAS PRONTAS
  // ==========================================

  async getMarketingCampaigns(): Promise<MarketingCampaign[]> {
    try {
      const data = await keeperRequest<MarketingCampaign[]>(API_ENDPOINTS.MARKETING.CAMPAIGNS);
      if (Array.isArray(data) && data.length > 0) {
        saveStoredCollection('marketing_campaigns', data);
        return data;
      }
    } catch {}
    return getStoredCollection<MarketingCampaign>('marketing_campaigns', mockMarketingCampaigns);
  },

  async createMarketingCampaign(campaign: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      name: campaign.name || 'Nova Campanha de Tráfego',
      eventId: campaign.eventId || 'ev-101',
      eventName: campaign.eventName || 'Festival de Verão Curitiba 2026',
      channel: campaign.channel || 'META_ADS',
      status: 'ACTIVE',
      budgetSpent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      attributedRevenue: 0,
      roas: 0,
      startDate: new Date().toISOString().split('T')[0],
      ...campaign,
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.MARKETING.CAMPAIGNS, {
        method: 'POST',
        body: JSON.stringify(newCamp),
      });
    } catch {}

    const list = getStoredCollection<MarketingCampaign>('marketing_campaigns', mockMarketingCampaigns);
    const updated = [newCamp, ...list];
    saveStoredCollection('marketing_campaigns', updated);
    return newCamp;
  },

  async configureReadyCampaign(templateId: string, payload: any): Promise<ReadyCampaignInstance> {
    const instance: ReadyCampaignInstance = {
      id: `rc-inst-${Date.now()}`,
      templateId,
      title: payload.title || 'Campanha Automática do Mapeamento',
      eventId: payload.eventId || 'ev-101',
      eventName: payload.eventName || 'Festival de Verão Curitiba 2026',
      channels: payload.channels || ['WHATSAPP', 'INSTAGRAM'],
      status: 'ACTIVE',
      budget: payload.budget || 1500,
      spent: 0,
      conversions: 0,
      revenue: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.MARKETING.CONFIGURE_READY, {
        method: 'POST',
        body: JSON.stringify(instance),
      });
    } catch {}

    const readyInstances = getStoredCollection<ReadyCampaignInstance>('ready_instances', []);
    saveStoredCollection('ready_instances', [instance, ...readyInstances]);
    return instance;
  },

  async getCoupons(): Promise<any[]> {
    const defaultCoupons = [
      { id: 'cp-1', code: 'VIPFESTIVAL10', discount: '10%', event: 'Festival de Verão Curitiba 2026', uses: 245, maxUses: 500, revenue: 63700, status: 'Ativo' },
      { id: 'cp-2', code: 'PREVENDA20', discount: 'R$ 20,00', event: 'Festival de Verão Curitiba 2026', uses: 120, maxUses: 200, revenue: 31200, status: 'Ativo' },
      { id: 'cp-3', code: 'PROMOFLASH', discount: '15%', event: 'Stand-up Comedy Brasil 2026', uses: 80, maxUses: 100, revenue: 12400, status: 'Esgotado' },
    ];
    return getStoredCollection('coupons', defaultCoupons);
  },

  async createCoupon(coupon: any): Promise<any> {
    const newCoupon = {
      id: `cp-${Date.now()}`,
      uses: 0,
      revenue: 0,
      status: 'Ativo',
      ...coupon,
    };
    try {
      await keeperRequest<any>(API_ENDPOINTS.MARKETING.COUPONS, {
        method: 'POST',
        body: JSON.stringify(newCoupon),
      });
    } catch {}
    const list = await this.getCoupons();
    const updated = [newCoupon, ...list];
    saveStoredCollection('coupons', updated);
    return newCoupon;
  },

  async getAffiliates(): Promise<any[]> {
    const defaultAffiliates = [
      { id: 'aff-1', name: 'Lucas Promoter VIP', code: 'LUCASVIP', salesCount: 310, totalVolume: 80600, commission: 4030, status: 'Ativo' },
      { id: 'aff-2', name: 'Mariana Agência Night', code: 'MARINIGHT', salesCount: 195, totalVolume: 50700, commission: 2535, status: 'Ativo' },
      { id: 'aff-3', name: 'Atlética de Engenharia UFPR', code: 'ATLETICAENG', salesCount: 140, totalVolume: 36400, commission: 1820, status: 'Ativo' },
    ];
    return getStoredCollection('affiliates', defaultAffiliates);
  },

  async createAffiliate(affiliate: any): Promise<any> {
    const newAff = {
      id: `aff-${Date.now()}`,
      salesCount: 0,
      totalVolume: 0,
      commission: 0,
      status: 'Ativo',
      ...affiliate,
    };
    try {
      await keeperRequest<any>(API_ENDPOINTS.MARKETING.AFFILIATES, {
        method: 'POST',
        body: JSON.stringify(newAff),
      });
    } catch {}
    const list = await this.getAffiliates();
    const updated = [newAff, ...list];
    saveStoredCollection('affiliates', updated);
    return newAff;
  },

  // ==========================================
  // MÓDULO 6: REMARKETING & RECUPERAÇÃO DE VENDAS
  // ==========================================

  async getAbandonedCarts(): Promise<AbandonedCart[]> {
    try {
      const data = await keeperRequest<AbandonedCart[]>(API_ENDPOINTS.REMARKETING.ABANDONED_CARTS);
      if (Array.isArray(data) && data.length > 0) {
        saveStoredCollection('abandoned_carts', data);
        return data;
      }
    } catch {}
    return getStoredCollection<AbandonedCart>('abandoned_carts', mockAbandonedCarts);
  },

  async triggerWhatsAppRecovery(cartId: string, payload?: any): Promise<any> {
    const resPayload = {
      cartId,
      dispatchedAt: new Date().toISOString(),
      channel: 'WHATSAPP',
      ...payload,
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.REMARKETING.DISPARAR_WHATSAPP, {
        method: 'POST',
        body: JSON.stringify(resPayload),
      });
    } catch {}

    const carts = getStoredCollection<AbandonedCart>('abandoned_carts', mockAbandonedCarts);
    const updated = carts.map((c) =>
      c.id === cartId ? { ...c, recoveryStatus: 'RECOVERY_SENT' as const, channelSent: 'WHATSAPP' as const } : c
    );
    saveStoredCollection('abandoned_carts', updated);
    return resPayload;
  },

  async generatePixRecovery(cartId: string, amount: number): Promise<{
    pixKey: string;
    qrCodeUrl: string;
    copiaECola: string;
    expiresInMinutes: number;
  }> {
    const copiaECola = `00020126580014br.gov.bcb.pix0136pix-recuperacao-${cartId}@diskingressos.com.br520400005303986540${amount.toFixed(2)}5802BR5916DiskIngressos6008Curitiba62070503***6304`;
    const result = {
      pixKey: `pix-recuperacao-${cartId}@diskingressos.com.br`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(copiaECola)}`,
      copiaECola,
      expiresInMinutes: 30,
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.REMARKETING.GERAR_PIX_RECOVERY, {
        method: 'POST',
        body: JSON.stringify({ cartId, amount, ...result }),
      });
    } catch {}

    return result;
  },

  isMetaCloudApiConfigured(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('meta_capi_token');
    const pixelId = localStorage.getItem('meta_pixel_id');
    return Boolean(token && token.trim().length > 10 && pixelId && pixelId.trim().length > 4);
  },

  isSmtpConfigured(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('smtp_host') || localStorage.getItem('sendgrid_api_key'));
  },

  async createWhatsAppCampaign(payload: {
    name: string;
    event: string;
    templateId: string;
    audience: string;
  }): Promise<{ campaign: any; isDispatched: boolean; message: string }> {
    const isConfigured = this.isMetaCloudApiConfigured();

    let backendConfirmed = false;
    try {
      const res = await keeperRequest<any>(API_ENDPOINTS.MARKETING.WHATSAPP, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res && (res.status === 'SENT' || res.status === 'QUEUED')) {
        backendConfirmed = true;
      }
    } catch {
      // Backend em standby
    }

    const isDispatched = backendConfirmed;
    const status = isDispatched
      ? 'Em Envio (Cloud API)'
      : 'Rascunho (Pendente de Integração Meta API)';

    const newCamp = {
      id: `wa-${Date.now()}`,
      name: payload.name,
      event: payload.event,
      sent: payload.audience === 'TODOS_COMPRADORES' ? 6200 : 1850,
      delivered: isDispatched ? (payload.audience === 'TODOS_COMPRADORES' ? 6170 : 1840) : 0,
      readRate: '0,0%',
      clicks: 0,
      sales: 0,
      status,
      isDispatched,
      createdAt: new Date().toISOString(),
    };

    const message = isDispatched
      ? `Campanha "${payload.name}" transmitida e enfileirada com sucesso na Meta Cloud API!`
      : `Campanha "${payload.name}" salva como RASCUNHO. O disparo em lote real requer credenciais oficiais da Meta Cloud API (Tokens & Integrações).`;

    const existing = getStoredCollection('wa_campaigns', []);
    saveStoredCollection('wa_campaigns', [newCamp, ...existing]);

    return { campaign: newCamp, isDispatched, message };
  },

  async createEmailCampaign(payload: {
    subject: string;
    event: string;
    template: string;
    audience: string;
    message: string;
  }): Promise<{ campaign: any; isDispatched: boolean; message: string }> {
    const isConfigured = this.isSmtpConfigured();

    let backendConfirmed = false;
    try {
      const res = await keeperRequest<any>(API_ENDPOINTS.MARKETING.EMAIL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res && (res.status === 'SENT' || res.status === 'QUEUED')) {
        backendConfirmed = true;
      }
    } catch {}

    const isDispatched = backendConfirmed;
    const status = isDispatched
      ? 'Disparando...'
      : 'Rascunho (Aguardando Conexão SMTP/SendGrid)';

    const newCamp = {
      id: `em-${Date.now()}`,
      subject: payload.subject,
      event: payload.event,
      sent: payload.audience === 'TODOS_COMPRADORES' ? 18450 : 4200,
      openRate: '0,0%',
      clickRate: '0,0%',
      tickets: 0,
      revenue: 0,
      status,
      isDispatched,
      createdAt: new Date().toISOString(),
    };

    const message = isDispatched
      ? `Disparo de e-mail iniciado via servidor SMTP homologado!`
      : `Campanha salva como RASCUNHO. O envio em lote requer configuração do servidor SMTP ou SendGrid no módulo de integrações.`;

    const existing = getStoredCollection('email_campaigns', []);
    saveStoredCollection('email_campaigns', [newCamp, ...existing]);

    return { campaign: newCamp, isDispatched, message };
  },

  async confirmRecoveryLedger(cartId: string, payload: { amount: number; eventId?: string }): Promise<any> {
    const confirmation = {
      cartId,
      amount: payload.amount,
      eventId: payload.eventId || 'ev-101',
      confirmedAt: new Date().toISOString(),
      transactionId: `TX-RECOVERY-${Math.floor(100000 + Math.random() * 900000)}`,
      ledgerEntryCreated: true,
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.REMARKETING.CONFIRMAR_VENDA_LEDGER, {
        method: 'POST',
        body: JSON.stringify(confirmation),
      });
    } catch (err: any) {
      // Regra contábil: não confirma venda sem validação da transação
      throw new ApiError(
        'Não foi possível conciliar a venda no Ledger oficial do Keeper ERP. Operação não liquidada.',
        500,
        { originalError: err.message }
      );
    }

    // Atualiza status do carrinho para RECOVERED apenas se confirmado
    const carts = getStoredCollection<AbandonedCart>('abandoned_carts', mockAbandonedCarts);
    const updated = carts.map((c) =>
      c.id === cartId ? { ...c, recoveryStatus: 'RECOVERED' as const } : c
    );
    saveStoredCollection('abandoned_carts', updated);

    return confirmation;
  },

  // ==========================================
  // MÓDULO 7: SUPORTE AO PRODUTOR
  // ==========================================

  async getSupportTickets(): Promise<any[]> {
    const defaultTickets = [
      { id: 'CH-902', subject: 'Liberação de lote extra Pista Premium Festival XYZ', status: 'EM_ATENDIMENTO', created: '08/10/2026', lastUpdate: 'Hoje às 10:15', category: 'Lotes e Ingressos' },
      { id: 'CH-871', subject: 'Ajuste de chave PIX cadastrada para repasses', status: 'CONCLUIDO', created: '28/09/2026', lastUpdate: '29/09/2026', category: 'Financeiro' },
    ];
    return getStoredCollection('support_tickets', defaultTickets);
  },

  async createSupportTicket(ticket: { subject: string; department?: string; priority?: string; description?: string }): Promise<any> {
    const newTicket = {
      id: `CH-${Math.floor(900 + Math.random() * 100)}`,
      subject: ticket.subject,
      status: 'EM_ATENDIMENTO',
      created: new Date().toLocaleDateString('pt-BR'),
      lastUpdate: 'Agora mesmo',
      category: ticket.department || 'Operações',
      description: ticket.description || '',
      priority: ticket.priority || 'NORMAL',
    };

    try {
      await keeperRequest<any>(API_ENDPOINTS.SUPPORT.CREATE_TICKET, {
        method: 'POST',
        body: JSON.stringify(newTicket),
      });
    } catch {}

    const list = await this.getSupportTickets();
    const updated = [newTicket, ...list];
    saveStoredCollection('support_tickets', updated);
    return newTicket;
  },

  // ==========================================
  // MÓDULO 8: CONFIGURAÇÕES DO PRODUTOR
  // ==========================================

  async getProducerSettings(): Promise<any> {
    const defaultSettings = {
      notifications: {
        emailDailySummary: true,
        whatsappSaleAlert: true,
        webhookUrl: 'https://webhook.produtor.com.br/diskingressos',
      },
      pixEmergencyKey: 'financeiro@primelive.com.br',
    };
    return getStoredCollection('producer_settings', [defaultSettings])[0] || defaultSettings;
  },

  async updateProducerSettings(settings: any): Promise<any> {
    try {
      await keeperRequest<any>(API_ENDPOINTS.SETTINGS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch {}
    saveStoredCollection('producer_settings', [settings]);
    return settings;
  },
};
