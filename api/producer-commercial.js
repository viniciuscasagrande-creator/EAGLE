// Serverless Function para Vercel — Backend Oficial do Eagle One
// Módulo Comercial & CRM B2B

const inMemoryStore = {
  clients: [
    {
      id: 'cli-1',
      name: 'Grupo Renault do Brasil',
      tradeName: 'Renault Brasil',
      document: '02.456.789/0001-20',
      contactName: 'Fernanda Meirelles (RH & Endomarketing)',
      email: 'f.meirelles@renault.com.br',
      phone: '(41) 3380-2000',
      city: 'São José dos Pinhais / PR',
      category: 'EMPRESA',
      totalOrders: 4,
      totalVolume: 84000.0,
      lastPurchaseDate: '2026-10-04',
      producerId: 'prod-01',
    },
    {
      id: 'cli-2',
      name: 'Associação dos Magistrados do Paraná',
      tradeName: 'AMAPAR',
      document: '76.123.456/0001-88',
      contactName: 'Dra. Cláudia Silveira',
      email: 'convenios@amapar.org.br',
      phone: '(41) 3017-1000',
      city: 'Curitiba / PR',
      category: 'GRUPO',
      totalOrders: 6,
      totalVolume: 52000.0,
      lastPurchaseDate: '2026-09-22',
      producerId: 'prod-01',
    },
    {
      id: 'cli-3',
      name: 'Universidade Positivo / Cruzeiro do Sul',
      tradeName: 'UP Campus Ecoville',
      document: '01.998.776/0001-33',
      contactName: 'Prof. Lucas Guimarães (Diretório Acadêmico)',
      email: 'lucas.da@up.edu.br',
      phone: '(41) 3317-3000',
      city: 'Curitiba / PR',
      category: 'UNIVERSIDADE',
      totalOrders: 3,
      totalVolume: 42000.0,
      lastPurchaseDate: '2026-10-01',
      producerId: 'prod-01',
    },
  ],

  opportunities: [
    {
      id: 'opp-1',
      title: 'Lote Corporativo 250 Ingressos Festival XYZ',
      clientName: 'Grupo Renault do Brasil',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      stage: 'NEGOCIACAO',
      estimatedValue: 45000.0,
      ticketsQuantity: 250,
      assignedTo: 'Bruno Valente',
      probability: 80,
      closeDate: '2026-10-10',
      producerId: 'prod-01',
    },
    {
      id: 'opp-2',
      title: 'Convênio Exclusivo Servidores AMAPAR',
      clientName: 'Associação dos Magistrados do Paraná',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      stage: 'PROPOSTA_ENVIADA',
      estimatedValue: 32000.0,
      ticketsQuantity: 150,
      assignedTo: 'Ana Paula Dias',
      probability: 60,
      closeDate: '2026-10-11',
      producerId: 'prod-01',
    },
    {
      id: 'opp-3',
      title: 'Camarote Exclusivo Show ABC',
      clientName: 'Rede de Hotéis Slaviero',
      eventId: 'ev-102',
      eventName: 'Show Nacional ABC 2026',
      stage: 'FECHADO_GANHO',
      estimatedValue: 28000.0,
      ticketsQuantity: 80,
      assignedTo: 'Bruno Valente',
      probability: 100,
      closeDate: '2026-10-06',
      producerId: 'prod-01',
    },
  ],

  proposals: [
    {
      id: 'prop-1',
      proposalNumber: 'PROP-2026-081',
      clientName: 'Grupo Renault do Brasil',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      totalTickets: 250,
      totalAmount: 45000.0,
      status: 'APROVADA',
      createdAt: '2026-10-02',
      validUntil: '2026-10-15',
      producerId: 'prod-01',
    },
    {
      id: 'prop-2',
      proposalNumber: 'PROP-2026-082',
      clientName: 'Associação dos Magistrados do Paraná',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      totalTickets: 150,
      totalAmount: 32000.0,
      status: 'ENVIADA',
      createdAt: '2026-10-04',
      validUntil: '2026-10-18',
      producerId: 'prod-01',
    },
  ],

  corporateOrders: [
    {
      id: 'corp-1',
      orderNumber: '#CORP-8821',
      companyName: 'Grupo Renault do Brasil',
      cnpj: '02.456.789/0001-20',
      contactName: 'Fernanda Meirelles',
      eventName: 'Festival XYZ 2026',
      sector: 'Camarote Corporativo',
      ticketQuantity: 120,
      totalAmount: 48000.0,
      paymentTerm: 'Faturamento 28 DDL (Boleto Bancário)',
      paymentStatus: 'PAGO',
      invoiceIssued: true,
      producerId: 'prod-01',
      attendees: [],
    },
    {
      id: 'corp-2',
      orderNumber: '#CORP-8822',
      companyName: 'AMAPAR Benefícios',
      cnpj: '76.123.456/0001-88',
      contactName: 'Dra. Cláudia Silveira',
      eventName: 'Festival XYZ 2026',
      sector: 'Pista Premium VIP',
      ticketQuantity: 80,
      totalAmount: 22400.0,
      paymentTerm: 'PIX Direto Tesouraria',
      paymentStatus: 'PAGO',
      invoiceIssued: true,
      producerId: 'prod-01',
      attendees: [],
    },
  ],

  partners: [
    {
      id: 'part-01',
      name: 'OAB Subseção Curitiba',
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
      producerId: 'prod-01',
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
      producerId: 'prod-01',
      settlements: []
    },
  ],

  idempotencyKeys: new Set(),
};

export default async function handler(req, res) {
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

  try {
    // 1. Clientes Comerciais
    if (path === 'clientes' && req.method === 'GET') {
      let result = inMemoryStore.clients;
      if (producerId) {
        result = result.filter((c) => !c.producerId || c.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    if (path === 'clientes' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newClient = {
        id: `cli-${Date.now()}`,
        totalOrders: 0,
        totalVolume: 0,
        lastPurchaseDate: new Date().toISOString().slice(0, 10),
        producerId,
        ...body,
      };
      inMemoryStore.clients.unshift(newClient);
      return res.status(201).json(newClient);
    }

    // 2. Oportunidades Comerciais
    if (path === 'oportunidades' && req.method === 'GET') {
      let result = inMemoryStore.opportunities;
      if (producerId) {
        result = result.filter((o) => !o.producerId || o.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    if (path === 'oportunidades' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newOpp = {
        id: `opp-${Date.now()}`,
        stage: 'PROSPECCAO',
        probability: 30,
        producerId,
        ...body,
      };
      inMemoryStore.opportunities.unshift(newOpp);
      return res.status(201).json(newOpp);
    }

    if (path.startsWith('oportunidades/') && path.endsWith('/stage') && req.method === 'PATCH') {
      const parts = path.split('/');
      const oppId = decodeURIComponent(parts[1]);
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const opp = inMemoryStore.opportunities.find((o) => o.id === oppId);
      if (opp && body.stage) {
        opp.stage = body.stage;
        if (body.lossReason) opp.lossReason = body.lossReason;
      }
      return res.status(200).json(opp || { id: oppId, stage: body.stage });
    }

    // 3. Propostas Comerciais
    if (path === 'propostas' && req.method === 'GET') {
      let result = inMemoryStore.proposals;
      if (producerId) {
        result = result.filter((p) => !p.producerId || p.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    if (path === 'propostas' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newProp = {
        id: `prop-${Date.now()}`,
        proposalNumber: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
        status: 'ENVIADA',
        createdAt: new Date().toISOString().slice(0, 10),
        producerId,
        ...body,
      };
      inMemoryStore.proposals.unshift(newProp);
      return res.status(201).json(newProp);
    }

    // 4. Vendas Corporativas
    if (path === 'vendas-corporativas' && req.method === 'GET') {
      let result = inMemoryStore.corporateOrders;
      if (producerId) {
        result = result.filter((o) => !o.producerId || o.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    if (path === 'vendas-corporativas' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newOrder = {
        id: `corp-${Date.now()}`,
        orderNumber: `#CORP-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentStatus: 'EM_PROCESSAMENTO',
        producerId,
        attendees: [],
        ...body,
      };
      inMemoryStore.corporateOrders.unshift(newOrder);
      return res.status(201).json(newOrder);
    }

    // 5. Parceiros & Convênios
    if (path === 'parceiros' && req.method === 'GET') {
      let result = inMemoryStore.partners;
      if (producerId) {
        result = result.filter((p) => !p.producerId || p.producerId === producerId);
      }
      return res.status(200).json(result);
    }

    if (path === 'parceiros' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const newPartner = {
        id: `part-${Date.now()}`,
        ticketsSold: 0,
        grossSalesGenerated: 0,
        commissionEarned: 0,
        commissionPaid: 0,
        status: 'ACTIVE',
        settlements: [],
        producerId,
        ...body,
      };
      inMemoryStore.partners.unshift(newPartner);
      return res.status(201).json(newPartner);
    }

    return res.status(404).json({
      detail: `Rota comercial não encontrada: /comercial/${path}`,
    });
  } catch (err) {
    console.error('Erro na API producer-commercial:', err);
    return res.status(500).json({
      detail: 'Erro interno ao processar requisição comercial.',
      error: err.message,
    });
  }
}
