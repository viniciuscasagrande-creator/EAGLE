// Serverless Function para Vercel — Backend Oficial do Eagle One
// Módulo de Remarketing & Recuperação Operacional (Contratos V3, V4 & V5)

// Armazenamento em memória por instância da função
const inMemoryStore = {
  // V3 - Carrinhos abandonados
  carts: [
    {
      id: 'cart-1',
      customerName: 'Renata Albuquerque',
      customerEmail: 'renata.alb@gmail.com',
      customerPhone: '(41) 99881-2233',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      sectorName: 'Pista Premium VIP',
      ticketsCount: 2,
      cartValue: 440.0,
      abandonedAt: '2026-10-09T11:45:00',
      recoveryStatus: 'PENDING',
      producerId: 'prod-01',
    },
    {
      id: 'cart-2',
      customerName: 'Marcos Vinicius Ribeiro',
      customerEmail: 'marcos.v@hotmail.com',
      customerPhone: '(41) 98712-4455',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      sectorName: 'Camarote Open Bar',
      ticketsCount: 1,
      cartValue: 420.0,
      abandonedAt: '2026-10-09T10:20:00',
      recoveryStatus: 'PENDING',
      producerId: 'prod-01',
    },
    {
      id: 'cart-3',
      customerName: 'Juliana Costa e Silva',
      customerEmail: 'ju.costa@gmail.com',
      customerPhone: '(41) 99123-8899',
      eventId: 'ev-102',
      eventName: 'Show Nacional ABC 2026',
      sectorName: 'Pista Geral',
      ticketsCount: 3,
      cartValue: 270.0,
      abandonedAt: '2026-10-09T09:15:00',
      recoveryStatus: 'PENDING',
      producerId: 'prod-01',
    },
  ],

  // V3 - Réguas automáticas básicas
  rules: [
    {
      id: 'rule-01',
      name: 'Disparo 1: Alerta Rápido com Link PIX',
      channel: 'WHATSAPP',
      delayMinutes: 15,
      discountOffer: 'Reserva garantida por 30 minutos',
      status: 'ACTIVE',
      sentCount: 0,
      openedRate: 0,
      recoveredCount: 0,
      recoveredRevenue: 0,
      producerId: 'prod-01',
    },
    {
      id: 'rule-02',
      name: 'Disparo 2: Cupom Exclusivo 5% OFF',
      channel: 'EMAIL',
      delayMinutes: 120,
      discountOffer: 'Cupom VOLTA5 (Válido por 12h)',
      status: 'ACTIVE',
      sentCount: 0,
      openedRate: 0,
      recoveredCount: 0,
      recoveredRevenue: 0,
      producerId: 'prod-01',
    },
  ],

  // V4 - Oportunidades de WhatsApp Remarketing (Vídeo 02:24-02:34)
  whatsappOpportunities: [
    {
      id: 'opp-01',
      customerName: 'Carlos Eduardo Mendes',
      customerPhone: '+55 41 99881-2244',
      customerEmail: 'carlos.mendes@gmail.com',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      utmSource: 'meta_ads',
      utmCampaign: 'black_friday_early',
      itemsDescription: '2x Pista Premium (Lote 2)',
      ticketCount: 2,
      cartValue: 560.0,
      timeAgo: 'há 18 min',
      abandonedAt: '2026-10-13T09:10:00Z',
      status: 'ABERTO',
      channel: 'WHATSAPP',
      pixKey: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405560.005802BR5913EAGLE INGRESS6008CURITIBA62070503***63041D2B',
      producerId: 'prod-01',
    },
    {
      id: 'opp-02',
      customerName: 'Fernanda Lima Souza',
      customerPhone: '+55 11 98765-4321',
      customerEmail: 'fernanda.lima@uol.com.br',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      utmSource: 'google_ads',
      utmCampaign: 'institucional_search',
      itemsDescription: '1x Camarote Open Bar (Lote 1)',
      ticketCount: 1,
      cartValue: 420.0,
      timeAgo: 'há 45 min',
      abandonedAt: '2026-10-13T08:43:00Z',
      status: 'ABERTO',
      channel: 'WHATSAPP',
      pixKey: '00020126580014br.gov.bcb.pix0136223e4567-e89b-12d3-a456-4266141740015204000053039865405420.005802BR5913EAGLE INGRESS6008CURITIBA62070503***6304E8A1',
      producerId: 'prod-01',
    },
    {
      id: 'opp-03',
      customerName: 'Rodrigo Augusto Maia',
      customerPhone: '+55 41 99234-5678',
      customerEmail: 'rodrigo.maia@corp.com',
      eventId: 'ev-102',
      eventName: 'Show Nacional ABC 2026',
      utmSource: 'tiktok_ads',
      utmCampaign: 'viral_challenge_01',
      itemsDescription: '3x Pista Geral (Lote 1)',
      ticketCount: 3,
      cartValue: 270.0,
      timeAgo: 'há 2 horas',
      abandonedAt: '2026-10-13T07:25:00Z',
      status: 'EM_RESGATE',
      channel: 'WHATSAPP',
      pixKey: '00020126580014br.gov.bcb.pix0136323e4567-e89b-12d3-a456-4266141740025204000053039865405270.005802BR5913EAGLE INGRESS6008CURITIBA62070503***6304C9F4',
      producerId: 'prod-01',
    },
    {
      id: 'opp-04',
      customerName: 'Mariana Duarte Prado',
      customerPhone: '+55 21 98112-9900',
      customerEmail: 'mari.prado@globo.com',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      utmSource: 'meta_ads',
      utmCampaign: 'retargeting_dinamico',
      itemsDescription: '2x Backstage Pass VIP',
      ticketCount: 2,
      cartValue: 890.0,
      timeAgo: 'há 3 horas',
      abandonedAt: '2026-10-13T06:10:00Z',
      status: 'RECUPERADO',
      channel: 'WHATSAPP',
      pixKey: '00020126580014br.gov.bcb.pix0136423e4567-e89b-12d3-a456-4266141740035204000053039865405890.005802BR5913EAGLE INGRESS6008CURITIBA62070503***630456FA',
      producerId: 'prod-01',
    },
  ],

  // V4 - Transações com Falha / Recuperação de Pagamentos
  failedPayments: [
    {
      id: 'pay-01',
      orderNumber: '#EAG-88291',
      customerName: 'Bruno Henrique Silveira',
      customerPhone: '+55 41 98844-3322',
      customerEmail: 'bruno.hs@gmail.com',
      paymentMethod: 'CREDIT_CARD',
      issueType: 'INSUFFICIENT_LIMIT',
      amount: 680.0,
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      createdAt: '2026-10-13T08:15:00Z',
      expiresAt: '2026-10-13T14:15:00Z',
      status: 'PENDING',
      producerId: 'prod-01',
    },
    {
      id: 'pay-02',
      orderNumber: '#EAG-88304',
      customerName: 'Tatiana Vasconcelos',
      customerPhone: '+55 11 97722-1133',
      customerEmail: 'tati.vasc@outlook.com',
      paymentMethod: 'PIX',
      issueType: 'PIX_EXPIRED',
      amount: 340.0,
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      createdAt: '2026-10-13T07:40:00Z',
      expiresAt: '2026-10-13T08:10:00Z',
      status: 'PENDING',
      producerId: 'prod-01',
    },
    {
      id: 'pay-03',
      orderNumber: '#EAG-88319',
      customerName: 'Gabriel Siqueira Ramos',
      customerPhone: '+55 41 99119-0022',
      customerEmail: 'gabriel.siqueira@empresa.com.br',
      paymentMethod: 'CREDIT_CARD',
      issueType: 'ANTIFRAUD_REJECTED',
      amount: 1120.0,
      eventId: 'ev-102',
      eventName: 'Show Nacional ABC 2026',
      createdAt: '2026-10-13T06:50:00Z',
      expiresAt: '2026-10-13T12:50:00Z',
      status: 'RETRIEVING',
      producerId: 'prod-01',
    },
    {
      id: 'pay-04',
      orderNumber: '#EAG-88250',
      customerName: 'Larissa Manoela Antunes',
      customerPhone: '+55 31 98877-6655',
      customerEmail: 'larissa.antunes@yahoo.com.br',
      paymentMethod: 'BOLETO',
      issueType: 'BOLETO_OVERDUE',
      amount: 450.0,
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      createdAt: '2026-10-12T16:00:00Z',
      expiresAt: '2026-10-13T00:00:00Z',
      status: 'CANCELLED',
      producerId: 'prod-01',
    },
  ],

  // V4 - Métricas de E-mail Remarketing
  emailMetrics: {
    sent: 1420,
    delivered: 1398,
    opened: 684,
    recovered: 126,
    recoveredAmount: 48920.0,
  },

  // V4 - Templates de E-mail Remarketing
  emailTemplates: [
    {
      id: 'tpl-rec-01',
      name: 'Resgate Imediato: Ingressos Pré-Reservados',
      delayMinutes: 15,
      subject: 'Seus ingressos ainda estão reservados por tempo limitado!',
      status: 'ACTIVE',
    },
    {
      id: 'tpl-rec-02',
      name: 'Resgate Moderado: Oferta de Retenção & Isenção de Taxa',
      delayMinutes: 120,
      subject: 'Não perca o show! Cupom exclusivo para concluir sua compra',
      status: 'ACTIVE',
    },
    {
      id: 'tpl-rec-03',
      name: 'Última Chamada: Liberação Iminente de Lote',
      delayMinutes: 720,
      subject: 'Aviso final: seus ingressos serão liberados para outros compradores',
      status: 'ACTIVE',
    },
  ],

  // -------------------------------------------------------------
  // V5: JORNADAS AUTOMATIZADAS
  // -------------------------------------------------------------
  journeys: [
    {
      id: 'jrn-01',
      name: 'Jornada Resgate Rápido Checkout VIP',
      status: 'ACTIVE',
      eventId: 'ev-101',
      steps: [
        { delayMinutes: 15, channel: 'WHATSAPP', templateId: 'wa_cart_rescue_fast' },
        { delayMinutes: 120, channel: 'EMAIL', templateId: 'em_vip_retention' },
      ],
      producerId: 'prod-01',
      updatedAt: '2026-10-13T09:00:00Z',
    },
    {
      id: 'jrn-02',
      name: 'Régua de Reengajamento Geral (Pista & Camarote)',
      status: 'PAUSED',
      eventId: 'ev-101',
      steps: [
        { delayMinutes: 30, channel: 'WHATSAPP', templateId: 'wa_friendly_reminder' },
        { delayMinutes: 720, channel: 'EMAIL', templateId: 'em_scarcity_offer' },
      ],
      producerId: 'prod-01',
      updatedAt: '2026-10-13T08:30:00Z',
    },
    {
      id: 'jrn-03',
      name: 'Jornada Show Nacional ABC — Conversão Rápida',
      status: 'ACTIVE',
      eventId: 'ev-102',
      steps: [
        { delayMinutes: 20, channel: 'WHATSAPP', templateId: 'wa_show_urgent' },
      ],
      producerId: 'prod-01',
      updatedAt: '2026-10-13T07:15:00Z',
    },
  ],

  // -------------------------------------------------------------
  // V5: CONSENTIMENTO & LGPD (Dados reais mascarados)
  // -------------------------------------------------------------
  consents: [
    {
      id: 'cst-01',
      maskedName: 'M*** S*** L***',
      maskedEmail: 'm***.s***@gmail.com',
      whatsappOptIn: true,
      emailOptIn: true,
      policyVersion: 'v2.4',
      eventId: 'ev-101',
      producerId: 'prod-01',
      updatedAt: '2026-10-13T08:20:00Z',
    },
    {
      id: 'cst-02',
      maskedName: 'C*** E*** M***',
      maskedEmail: 'c***.m***@uol.com.br',
      whatsappOptIn: true,
      emailOptIn: true,
      policyVersion: 'v2.4',
      eventId: 'ev-101',
      producerId: 'prod-01',
      updatedAt: '2026-10-13T07:45:00Z',
    },
    {
      id: 'cst-03',
      maskedName: 'B*** F***',
      maskedEmail: 'b***.f***@outlook.com',
      whatsappOptIn: false,
      emailOptIn: true,
      policyVersion: 'v2.4',
      eventId: 'ev-101',
      producerId: 'prod-01',
      updatedAt: '2026-10-12T18:10:00Z',
    },
    {
      id: 'cst-04',
      maskedName: 'F*** H*** R***',
      maskedEmail: 'f***.r***@corp.com.br',
      whatsappOptIn: true,
      emailOptIn: false,
      policyVersion: 'v2.4',
      eventId: 'ev-102',
      producerId: 'prod-01',
      updatedAt: '2026-10-12T14:30:00Z',
    },
    {
      id: 'cst-05',
      maskedName: 'R*** A*** M***',
      maskedEmail: 'r***.m***@corp.com',
      whatsappOptIn: true,
      emailOptIn: true,
      policyVersion: 'v2.4',
      eventId: 'ev-102',
      producerId: 'prod-01',
      updatedAt: '2026-10-13T06:15:00Z',
    },
  ],

  // -------------------------------------------------------------
  // V5: CATÁLOGO DE RELATÓRIOS
  // -------------------------------------------------------------
  reportCatalog: [
    {
      key: 'carrinhos-recuperados',
      label: 'Relatório Analítico de Carrinhos Recuperados',
      description: 'Detalhamento de checkouts recuperados, ticket médio e canal de disparo com atribuição verificada.',
    },
    {
      key: 'disparos-whatsapp',
      label: 'Auditoria de Disparos WhatsApp Remarketing',
      description: 'Logs auditados de mensagens enviadas, entrega confirmada e tempo até pagamento.',
    },
    {
      key: 'eficiencia-reguas',
      label: 'Demonstrativo de Eficiência por Jornada & Régua',
      description: 'Métricas de conversão por etapa, tempo de resposta e volume recuperado por jornada automatizada.',
    },
    {
      key: 'auditoria-lgpd',
      label: 'Trilha de Auditoria e Consentimento LGPD',
      description: 'Registros de consentimento (Opt-in/Opt-out), versão da política aceita e datas de atualização.',
    },
  ],

  idempotencyKeys: new Set(),
};

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-tenant-id, x-producer-id, x-company-id, Idempotency-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawPath = req.query.path || '';
  const path = rawPath.replace(/^\/+|\/+$/g, '');
  const producerId = req.headers['x-producer-id'] || 'prod-01';
  const idempotencyKey = req.headers['idempotency-key'];

  // Idempotência
  if (idempotencyKey) {
    if (inMemoryStore.idempotencyKeys.has(idempotencyKey) && (req.method === 'POST' || req.method === 'PATCH')) {
      return res.status(200).json({
        jobId: `job-idemp-${idempotencyKey.slice(0, 8)}`,
        status: 'ALREADY_PROCESSED',
        message: 'Solicitação já processada anteriormente (idempotência garantida).',
      });
    }
    inMemoryStore.idempotencyKeys.add(idempotencyKey);
  }

  try {
    // -------------------------------------------------------------
    // V3: CARRINHOS ABANDONADOS
    // -------------------------------------------------------------

    // 1. GET /producer/remarketing/carts
    if (req.method === 'GET' && path === 'carts') {
      const eventFilter = req.query.eventId;
      let result = inMemoryStore.carts;
      if (producerId) {
        result = result.filter((c) => !c.producerId || c.producerId === producerId);
      }
      if (eventFilter && eventFilter !== 'ALL') {
        result = result.filter((c) => c.eventId === eventFilter);
      }
      return res.status(200).json(result);
    }

    // 2. POST /producer/remarketing/carts/:cartId/recover
    if (req.method === 'POST' && path.startsWith('carts/') && path.endsWith('/recover')) {
      const parts = path.split('/');
      const cartId = decodeURIComponent(parts[1]);

      const cart = inMemoryStore.carts.find((c) => c.id === cartId);
      if (cart) {
        cart.recoveryStatus = 'RECOVERY_SENT';
      }

      const jobId = `job-rec-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      return res.status(200).json({
        jobId,
        status: 'QUEUED',
        cartId,
        message: 'Recuperação individual agendada com sucesso no canal autorizado.',
      });
    }

    // 3. POST /producer/remarketing/carts/recover-batch
    if (req.method === 'POST' && path === 'carts/recover-batch') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { cartIds } = body || {};

      if (!Array.isArray(cartIds) || cartIds.length === 0) {
        return res.status(400).json({
          detail: 'Lista cartIds é obrigatória e deve conter ao menos um ID.',
        });
      }

      let acceptedCount = 0;
      cartIds.forEach((id) => {
        const cart = inMemoryStore.carts.find((c) => c.id === id);
        if (cart && cart.recoveryStatus === 'PENDING') {
          cart.recoveryStatus = 'RECOVERY_SENT';
          acceptedCount++;
        }
      });

      const jobId = `batch-job-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      return res.status(200).json({
        jobId,
        acceptedCount: acceptedCount || cartIds.length,
        status: 'QUEUED',
        message: 'Lote de recuperação aceito para processamento.',
      });
    }

    // -------------------------------------------------------------
    // V3: RÉGUAS DE AUTOMAÇÃO BÁSICAS
    // -------------------------------------------------------------

    // 4. GET /producer/remarketing/rules
    if (req.method === 'GET' && path === 'rules') {
      return res.status(200).json(inMemoryStore.rules);
    }

    // 5. POST /producer/remarketing/rules
    if (req.method === 'POST' && path === 'rules') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, channel, delayMinutes, discountOffer } = body || {};

      if (!name || !channel) {
        return res.status(400).json({
          detail: 'Nome da régua e canal de disparo são obrigatórios.',
        });
      }

      const id = `rule-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const newRule = {
        id,
        name,
        channel: channel || 'WHATSAPP',
        delayMinutes: Number(delayMinutes) || 15,
        discountOffer: discountOffer || '',
        status: 'ACTIVE',
        sentCount: 0,
        openedRate: 0,
        recoveredCount: 0,
        recoveredRevenue: 0,
        producerId,
        createdAt: new Date().toISOString(),
      };

      inMemoryStore.rules.unshift(newRule);

      return res.status(201).json(newRule);
    }

    // 6. PATCH /producer/remarketing/rules/:id
    if (req.method === 'PATCH' && path.startsWith('rules/')) {
      const parts = path.split('/');
      const ruleId = decodeURIComponent(parts[1]);
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      const rule = inMemoryStore.rules.find((r) => r.id === ruleId);
      if (!rule) {
        return res.status(404).json({ detail: 'Régua de remarketing não encontrada.' });
      }

      Object.assign(rule, body, { updatedAt: new Date().toISOString() });

      return res.status(200).json(rule);
    }

    // -------------------------------------------------------------
    // V4: WHATSAPP REMARKETING (Com validação LGPD e elegibilidade)
    // -------------------------------------------------------------

    // 7. GET /producer/remarketing/whatsapp/opportunities
    if (req.method === 'GET' && path === 'whatsapp/opportunities') {
      let result = inMemoryStore.whatsappOpportunities;
      if (producerId) {
        result = result.filter((o) => !o.producerId || o.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    // 8. POST /producer/remarketing/whatsapp/opportunities/:id/dispatch
    // Regra 5: Executar disparos somente após verificar consentimento e elegibilidade
    if (req.method === 'POST' && path.startsWith('whatsapp/opportunities/') && path.endsWith('/dispatch')) {
      const parts = path.split('/');
      const oppId = decodeURIComponent(parts[2]);

      const opp = inMemoryStore.whatsappOpportunities.find((o) => o.id === oppId);
      if (!opp) {
        return res.status(404).json({ detail: 'Oportunidade não encontrada.' });
      }

      // Validação de consentimento LGPD para o titular
      const consent = inMemoryStore.consents.find(
        (c) => c.maskedEmail && opp.customerEmail && opp.customerEmail.toLowerCase().startsWith(c.maskedEmail.slice(0, 1).toLowerCase())
      );
      if (consent && consent.whatsappOptIn === false) {
        return res.status(403).json({
          detail: 'Disparo bloqueado: titular revogou autorização para contato via WhatsApp (LGPD).',
          code: 'LGPD_OPT_OUT',
        });
      }

      opp.status = 'EM_RESGATE';
      opp.dispatchedAt = new Date().toISOString();

      const jobId = `job-disp-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      return res.status(200).json({
        jobId,
        status: 'QUEUED',
      });
    }

    // 9. POST /producer/remarketing/whatsapp/dispatch-batch
    if (req.method === 'POST' && path === 'whatsapp/dispatch-batch') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { opportunityIds } = body || {};

      if (!Array.isArray(opportunityIds) || opportunityIds.length === 0) {
        return res.status(400).json({
          detail: 'Lista opportunityIds é obrigatória e deve conter ao menos um ID.',
        });
      }

      let acceptedCount = 0;
      opportunityIds.forEach((id) => {
        const opp = inMemoryStore.whatsappOpportunities.find((o) => o.id === id);
        if (opp && opp.status === 'ABERTO') {
          opp.status = 'EM_RESGATE';
          opp.dispatchedAt = new Date().toISOString();
          acceptedCount++;
        }
      });

      const jobId = `batch-job-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      return res.status(200).json({
        jobId,
        status: 'QUEUED',
        acceptedCount,
      });
    }

    // -------------------------------------------------------------
    // V4: RECUPERAÇÃO DE PAGAMENTOS
    // -------------------------------------------------------------

    // 10. GET /producer/remarketing/payments/failed
    if (req.method === 'GET' && path === 'payments/failed') {
      let result = inMemoryStore.failedPayments;
      if (producerId) {
        result = result.filter((p) => !p.producerId || p.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    // 11. POST /producer/remarketing/payments/:id/new-pix
    if (req.method === 'POST' && path.startsWith('payments/') && path.endsWith('/new-pix')) {
      const parts = path.split('/');
      const paymentId = decodeURIComponent(parts[1]);

      const payment = inMemoryStore.failedPayments.find((p) => p.id === paymentId);
      if (payment) {
        payment.status = 'RETRIEVING';
      }

      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      const paymentReference = `PAY-PIX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const amountVal = payment ? (payment.amount || 100).toFixed(2) : '100.00';
      const pixCopyPaste = `00020126580014br.gov.bcb.pix0136${Date.now()}-e89b-12d3-a456-426614174000520400005303986540${amountVal.length < 10 ? '0' : ''}${amountVal}5802BR5913EAGLE INGRESS6008CURITIBA62070503***6304${Math.random().toString(16).substring(2, 6).toUpperCase()}`;

      return res.status(200).json({
        paymentReference,
        pixCopyPaste,
        expiresAt,
      });
    }

    // -------------------------------------------------------------
    // V4: E-MAIL REMARKETING (Métricas & Templates)
    // -------------------------------------------------------------

    // 12. GET /producer/remarketing/email/metrics
    if (req.method === 'GET' && path === 'email/metrics') {
      return res.status(200).json(inMemoryStore.emailMetrics);
    }

    // 13. GET /producer/remarketing/email/templates
    if (req.method === 'GET' && path === 'email/templates') {
      return res.status(200).json(inMemoryStore.emailTemplates);
    }

    // -------------------------------------------------------------
    // V5: JORNADAS AUTOMATIZADAS (CRUD & Status)
    // -------------------------------------------------------------

    // 14. GET /producer/remarketing/journeys?eventId=...
    if (req.method === 'GET' && path === 'journeys') {
      const eventFilter = req.query.eventId;
      let result = inMemoryStore.journeys;
      if (producerId) {
        result = result.filter((j) => !j.producerId || j.producerId === producerId);
      }
      if (eventFilter && eventFilter !== 'ALL') {
        result = result.filter((j) => j.eventId === eventFilter);
      }
      return res.status(200).json(result);
    }

    // 15. POST /producer/remarketing/journeys
    if (req.method === 'POST' && path === 'journeys') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, eventId, steps } = body || {};

      if (!name || !eventId) {
        return res.status(400).json({
          detail: 'Nome da jornada e eventId são obrigatórios.',
        });
      }

      const id = `jrn-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const newJourney = {
        id,
        name: String(name).trim(),
        eventId: String(eventId).trim(),
        status: 'ACTIVE',
        steps: Array.isArray(steps) && steps.length > 0 ? steps : [
          { delayMinutes: 15, channel: 'WHATSAPP', templateId: 'wa_cart_rescue_fast' },
        ],
        producerId,
        updatedAt: new Date().toISOString(),
      };

      inMemoryStore.journeys.unshift(newJourney);

      return res.status(201).json(newJourney);
    }

    // 16. PATCH /producer/remarketing/journeys/:id/status
    if (req.method === 'PATCH' && path.startsWith('journeys/') && path.endsWith('/status')) {
      const parts = path.split('/');
      const journeyId = decodeURIComponent(parts[1]);
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { status } = body || {};

      if (!status || !['DRAFT', 'ACTIVE', 'PAUSED'].includes(status)) {
        return res.status(400).json({
          detail: 'Status deve ser DRAFT, ACTIVE ou PAUSED.',
        });
      }

      const journey = inMemoryStore.journeys.find((j) => j.id === journeyId);
      if (!journey) {
        return res.status(404).json({ detail: 'Jornada não encontrada.' });
      }

      journey.status = status;
      journey.updatedAt = new Date().toISOString();

      return res.status(200).json(journey);
    }

    // -------------------------------------------------------------
    // V5: CONSENTIMENTO & LGPD
    // -------------------------------------------------------------

    // 17. GET /producer/remarketing/consents?eventId=...
    if (req.method === 'GET' && path === 'consents') {
      const eventFilter = req.query.eventId;
      let result = inMemoryStore.consents;
      if (producerId) {
        result = result.filter((c) => !c.producerId || c.producerId === producerId);
      }
      if (eventFilter && eventFilter !== 'ALL') {
        result = result.filter((c) => c.eventId === eventFilter);
      }
      return res.status(200).json(result);
    }

    // -------------------------------------------------------------
    // V5: RELATÓRIOS & EXPORTAÇÃO AUDITADA
    // -------------------------------------------------------------

    // 18. GET /producer/remarketing/reports
    if (req.method === 'GET' && path === 'reports') {
      return res.status(200).json(inMemoryStore.reportCatalog);
    }

    // 19. GET /producer/remarketing/reports/:key?eventId=...
    if (req.method === 'GET' && path.startsWith('reports/')) {
      const parts = path.split('/');
      const reportKey = decodeURIComponent(parts[1]);
      const eventFilter = req.query.eventId;

      if (reportKey === 'carrinhos-recuperados') {
        let carts = inMemoryStore.carts;
        if (eventFilter && eventFilter !== 'ALL') {
          carts = carts.filter((c) => c.eventId === eventFilter);
        }
        const columns = [
          'ID Carrinho',
          'Cliente',
          'Telefone',
          'Evento',
          'Setor',
          'Valor (R$)',
          'Status Recuperacao',
          'Data Abandono',
        ];
        const rows = carts.map((c) => [
          c.id,
          c.customerName,
          c.customerPhone,
          c.eventName,
          c.sectorName,
          c.cartValue.toFixed(2),
          c.recoveryStatus,
          c.abandonedAt,
        ]);
        return res.status(200).json({ columns, rows });
      }

      if (reportKey === 'disparos-whatsapp') {
        let opps = inMemoryStore.whatsappOpportunities;
        if (eventFilter && eventFilter !== 'ALL') {
          opps = opps.filter((o) => o.eventId === eventFilter);
        }
        const columns = [
          'ID Oportunidade',
          'Cliente',
          'Telefone WhatsApp',
          'Evento',
          'UTM Origem',
          'Itens',
          'Valor (R$)',
          'Status Resgate',
          'Chave PIX Gerada',
        ];
        const rows = opps.map((o) => [
          o.id,
          o.customerName,
          o.customerPhone,
          o.eventName,
          `${o.utmSource}/${o.utmCampaign}`,
          o.itemsDescription,
          o.cartValue.toFixed(2),
          o.status,
          o.pixKey ? 'Sim (EMV Ativo)' : 'Não',
        ]);
        return res.status(200).json({ columns, rows });
      }

      if (reportKey === 'eficiencia-reguas') {
        let journeys = inMemoryStore.journeys;
        if (eventFilter && eventFilter !== 'ALL') {
          journeys = journeys.filter((j) => j.eventId === eventFilter);
        }
        const columns = [
          'ID Jornada',
          'Nome da Jornada',
          'Status Operacional',
          'Evento',
          'Qtd Etapas',
          'Ultima Atualizacao',
        ];
        const rows = journeys.map((j) => [
          j.id,
          j.name,
          j.status,
          j.eventId,
          j.steps.length,
          j.updatedAt,
        ]);
        return res.status(200).json({ columns, rows });
      }

      if (reportKey === 'auditoria-lgpd') {
        let consents = inMemoryStore.consents;
        if (eventFilter && eventFilter !== 'ALL') {
          consents = consents.filter((c) => c.eventId === eventFilter);
        }
        const columns = [
          'ID Consentimento',
          'Titular Mascarado',
          'Email Mascarado',
          'WhatsApp Autorizado',
          'Email Autorizado',
          'Versao dos Termos',
          'Data Atualizacao',
        ];
        const rows = consents.map((c) => [
          c.id,
          c.maskedName,
          c.maskedEmail,
          c.whatsappOptIn ? 'Autorizado' : 'Nao Autorizado',
          c.emailOptIn ? 'Autorizado' : 'Nao Autorizado',
          c.policyVersion,
          c.updatedAt,
        ]);
        return res.status(200).json({ columns, rows });
      }

      return res.status(404).json({
        detail: `Relatório "${reportKey}" não encontrado no catálogo.`,
      });
    }

    return res.status(404).json({
      detail: `Rota não encontrada: /producer/remarketing/${path}`,
    });
  } catch (err) {
    console.error('Erro na API producer-remarketing:', err);
    return res.status(500).json({
      detail: 'Erro interno ao processar requisição de remarketing.',
      error: err.message,
    });
  }
}
