// Serverless Function para Vercel — Backend Oficial do Eagle One
// Módulo de Remarketing & Recuperação Operacional (Contratos V3)

// Armazenamento em memória por instância da função
const inMemoryStore = {
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

  const path = req.query.path || '';
  const token = req.headers.authorization;
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
    // 1. GET /producer/remarketing/carts
    if (req.method === 'GET' && (path === 'carts' || path === 'carts/')) {
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

    // 4. GET /producer/remarketing/rules
    if (req.method === 'GET' && (path === 'rules' || path === 'rules/')) {
      return res.status(200).json(inMemoryStore.rules);
    }

    // 5. POST /producer/remarketing/rules
    if (req.method === 'POST' && (path === 'rules' || path === 'rules/')) {
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
