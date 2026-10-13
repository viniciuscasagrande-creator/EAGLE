// Serverless Function para Vercel — Backend Oficial do Eagle One
// Módulo de Remarketing & Recuperação Operacional (Contratos V3 & V4)

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

  // V3 - Réguas automáticas
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
    if (inMemoryStore.idempotencyKeys.has(idempotencyKey) && req.method === 'POST') {
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
    // V3: RÉGUAS DE AUTOMAÇÃO
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
    // V4: WHATSAPP REMARKETING (Oportunidades & Disparos)
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
    if (req.method === 'POST' && path.startsWith('whatsapp/opportunities/') && path.endsWith('/dispatch')) {
      const parts = path.split('/');
      const oppId = decodeURIComponent(parts[2]);

      const opp = inMemoryStore.whatsappOpportunities.find((o) => o.id === oppId);
      if (opp) {
        opp.status = 'EM_RESGATE';
        opp.dispatchedAt = new Date().toISOString();
      }

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

      opportunityIds.forEach((id) => {
        const opp = inMemoryStore.whatsappOpportunities.find((o) => o.id === id);
        if (opp && opp.status === 'ABERTO') {
          opp.status = 'EM_RESGATE';
          opp.dispatchedAt = new Date().toISOString();
        }
      });

      const jobId = `batch-job-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      return res.status(200).json({
        jobId,
        status: 'QUEUED',
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
