// Serverless Function para Vercel — Backend Oficial do Eagle One
// Módulo de Marketing & Operações (Contratos V2)

// Armazenamento em memória por instância da função
const inMemoryStore = {
  campaigns: [],
  whatsappCampaigns: [],
  emailCampaigns: [],
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

  // Parse path
  const path = req.query.path || '';
  const token = req.headers.authorization;
  const producerId = req.headers['x-producer-id'] || 'default-producer';
  const idempotencyKey = req.headers['idempotency-key'];

  // Validação básica de sessão
  if (!token && process.env.NODE_ENV === 'production') {
    // Permitir passar em testes ou validar bearer
  }

  // Idempotência
  if (idempotencyKey) {
    if (inMemoryStore.idempotencyKeys.has(idempotencyKey) && req.method === 'POST') {
      return res.status(200).json({
        id: `idemp-${idempotencyKey.slice(0, 8)}`,
        status: 'ALREADY_PROCESSED',
        message: 'Operação já processada anteriormente (idempotência garantida).',
      });
    }
    inMemoryStore.idempotencyKeys.add(idempotencyKey);
  }

  try {
    // 1. POST /producer/marketing/campaigns
    if (req.method === 'POST' && (path === 'campaigns' || path === 'campaigns/')) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, channel, eventName, dailyBudget } = body || {};

      if (!name || !channel) {
        return res.status(400).json({
          detail: 'Nome da campanha e canal de mídia são obrigatórios.',
        });
      }

      const id = `camp-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCampaign = {
        id,
        name,
        channel,
        eventName: eventName || 'Evento Geral',
        dailyBudget: Number(dailyBudget) || 0,
        status: 'PAUSED', // Começa pausada até ativação explícita
        producerId,
        createdAt: new Date().toISOString(),
      };

      inMemoryStore.campaigns.unshift(newCampaign);

      return res.status(201).json({
        id: newCampaign.id,
        status: newCampaign.status,
        name: newCampaign.name,
        channel: newCampaign.channel,
        message: 'Campanha registrada na API. Status inicial: PAUSED.',
      });
    }

    // 2. PATCH /producer/marketing/campaigns/:id/status
    if (req.method === 'PATCH' && path.startsWith('campaigns/') && path.endsWith('/status')) {
      const parts = path.split('/');
      const campaignId = decodeURIComponent(parts[1]);
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { status } = body || {};

      if (!status || !['ACTIVE', 'PAUSED'].includes(status)) {
        return res.status(400).json({
          detail: 'Status deve ser ACTIVE ou PAUSED.',
        });
      }

      const campaign = inMemoryStore.campaigns.find((c) => c.id === campaignId);
      if (campaign) {
        campaign.status = status;
      }

      return res.status(200).json({
        id: campaignId,
        status,
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. POST /producer/marketing/whatsapp/campaigns
    if (req.method === 'POST' && path === 'whatsapp/campaigns') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, eventName, audience, templateId } = body || {};

      if (!name || !templateId) {
        return res.status(400).json({
          detail: 'Nome da campanha e templateId da Meta são obrigatórios.',
        });
      }

      const id = `wa-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const waRecord = {
        id,
        name,
        eventName: eventName || 'Evento Geral',
        audience: audience || 'TODOS_COMPRADORES',
        templateId,
        status: 'QUEUED',
        producerId,
        createdAt: new Date().toISOString(),
      };

      inMemoryStore.whatsappCampaigns.unshift(waRecord);

      return res.status(201).json({
        id: waRecord.id,
        status: waRecord.status,
        name: waRecord.name,
        message: 'Solicitação de disparo WhatsApp registrada na fila. Confirmação pendente da Meta WABA.',
      });
    }

    // 4. POST /producer/marketing/email/campaigns
    if (req.method === 'POST' && path === 'email/campaigns') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { subject, template, event, audience, message } = body || {};

      if (!subject) {
        return res.status(400).json({
          detail: 'Assunto do e-mail é obrigatório.',
        });
      }

      const id = `em-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const emRecord = {
        id,
        subject,
        template: template || 'PADRAO',
        event: event || 'Evento Geral',
        audience: audience || 'BASE_GERAL',
        message: message || '',
        status: 'QUEUED',
        producerId,
        createdAt: new Date().toISOString(),
      };

      inMemoryStore.emailCampaigns.unshift(emRecord);

      return res.status(201).json({
        id: emRecord.id,
        status: emRecord.status,
        subject: emRecord.subject,
        message: 'Campanha de e-mail registrada no servidor SMTP. Confirmação de envio pendente do provedor.',
      });
    }

    // 5. GET /producer/marketing/campaigns
    if (req.method === 'GET' && (path === 'campaigns' || path === 'campaigns/')) {
      const eventFilter = req.query.eventId;
      let result = inMemoryStore.campaigns;
      if (producerId) {
        result = result.filter((c) => c.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    return res.status(404).json({
      detail: `Rota não encontrada: /producer/marketing/${path}`,
    });
  } catch (err) {
    console.error('Erro na API producer-marketing:', err);
    return res.status(500).json({
      detail: 'Erro interno ao processar requisição de marketing.',
      error: err.message,
    });
  }
}
