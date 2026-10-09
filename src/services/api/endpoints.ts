/**
 * Dicionário Centralizado de Endpoints do Keeper Core ERP e Portal do Produtor EAGLE
 * Todas as rotas seguem o padrão REST versionado (/api/v1)
 */
export const API_ENDPOINTS = {
  // Autenticação & Sessão
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },

  // Eventos & Operações
  EVENTS: {
    LIST: '/eventos',
    DETAIL: (id: string) => `/eventos/${id}`,
    CREATE: '/eventos',
    UPDATE: (id: string) => `/eventos/${id}`,
    TICKETS: (id: string) => `/eventos/${id}/ingressos`,
    CREATE_TIER: (id: string) => `/eventos/${id}/lotes`,
    COURTESIES: (id: string) => `/eventos/${id}/cortesias`,
    ISSUE_COURTESY: (id: string) => `/eventos/${id}/cortesias`,
    ORDERS: (id: string) => `/eventos/${id}/pedidos`,
    OCCUPANCY_MAP: (id: string) => `/eventos/${id}/mapa-ocupacao`,
    FINANCIAL_DETAIL: (id: string) => `/financeiro/settlement/events/${id}/financial-detail`,
  },

  // Comercial & B2B
  COMMERCIAL: {
    DASHBOARD: '/comercial/dashboard',
    CLIENTS: '/comercial/clientes',
    CLIENT_DETAIL: (id: string) => `/comercial/clientes/${id}`,
    OPPORTUNITIES: '/comercial/oportunidades',
    OPPORTUNITY_STAGE: (id: string) => `/comercial/oportunidades/${id}/stage`,
    PROPOSALS: '/comercial/propostas',
    PROPOSAL_STATUS: (id: string) => `/comercial/propostas/${id}/status`,
    PARTNERS: '/comercial/parceiros',
    CORPORATE_ORDERS: '/comercial/vendas-corporativas',
  },

  // Marketing Multicanal
  MARKETING: {
    DASHBOARD: '/marketing/dashboard',
    CAMPAIGNS: '/marketing/campanhas',
    READY_CAMPAIGNS: '/marketing/campanhas-prontas',
    CONFIGURE_READY: '/marketing/campanhas-prontas/configurar',
    STATUS_REAL: '/marketing/status-real',
    UTMS: '/marketing/utms',
    COUPONS: '/marketing/cupons',
    AFFILIATES: '/marketing/afiliados',
    INTEGRATIONS: {
      META: '/marketing/integracoes/meta',
      GA4: '/marketing/integracoes/ga4',
      TIKTOK: '/marketing/integracoes/tiktok',
      SPOTIFY: '/marketing/integracoes/spotify',
    },
    EMAIL: '/marketing/email',
    WHATSAPP: '/marketing/whatsapp',
  },

  // Remarketing & Recuperação de Vendas
  REMARKETING: {
    DASHBOARD: '/remarketing/dashboard',
    ABANDONED_CARTS: '/remarketing/carrinhos',
    DISPARAR_WHATSAPP: '/remarketing/whatsapp/disparar',
    GERAR_PIX_RECOVERY: '/remarketing/pix/gerar',
    CONFIRMAR_VENDA_LEDGER: '/remarketing/confirmar-venda-ledger',
    INACTIVE_CLIENTS: '/remarketing/inativos',
    LGPD_CONSENTS: '/remarketing/lgpd',
  },

  // Financeiro & Keeper Core Settlement (Motor Oficial)
  FINANCE: {
    PRODUCER_OVERVIEW: (producerId: string) => `/financeiro/settlement/producers/${producerId}/overview`,
    WALLETS: '/financeiro/settlement/wallets',
    WALLET_STATEMENT: (walletId: string) => `/financeiro/settlement/wallets/${walletId}/statement`,
    LEDGER: '/financeiro/settlement/ledger',
    SCHEDULES: '/financeiro/settlement/schedules',
    REPAYMENTS: (producerId: string) => `/financeiro/settlement/producers/${producerId}/repayments`,
    ADVANCES: (producerId: string) => `/financeiro/settlement/producers/${producerId}/advances`,
    COMMERCIAL_RULES: '/financeiro/commercial-rules',
    APPROPRIATION: (saleId: string) => `/financeiro/appropriation/${saleId}`,
  },

  // Suporte Operacional
  SUPPORT: {
    TICKETS: '/suporte/chamados',
    TICKET_DETAIL: (id: string) => `/suporte/chamados/${id}`,
    CREATE_TICKET: '/suporte/chamados',
    MESSAGES: (id: string) => `/suporte/chamados/${id}/mensagens`,
  },

  // Configurações do Produtor
  SETTINGS: {
    PROFILE: '/configuracoes/produtor',
    BANK_PIX: '/configuracoes/banco-pix',
    WEBHOOKS: '/configuracoes/webhooks',
    HEALTH_CHECK: '/health',
  },

  // Relatórios
  REPORTS: {
    CONSOLIDATED: '/relatorios/consolidado',
    EXPORT: '/relatorios/exportar',
  },
} as const;
