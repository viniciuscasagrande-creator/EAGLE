# INTEGRAÇÃO KEEPER ERP × PORTAL DO PRODUTOR DISKINGRESSOS

> **Documento de Arquitetura, Mapeamento de APIs e Guia de Integração Oficial**  
> **Data:** Outubro/2026 | **Status:** Homologado para Desenvolvimento

---

## 1. Princípios Arquiteturais Obrigatórios

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CORE CENTRAL DISKINGRESSOS (KEEPER)                  │
│       PostgreSQL 16 (15 Schemas) │ Prisma ORM │ Partidas Dobradas      │
│  Eventos · Pedidos · Vendas · Contratos · Ledger · Permissões RBAC     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ APIs REST Versionadas (api/v1)
                                    │ Eventos de Domínio / Webhooks
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│          KEEPER ERP           │       │      PORTAL DO PRODUTOR       │
│    (Sistema Interno Disk)     │       │     (Novo Sistema React)      │
├───────────────────────────────┤       ├───────────────────────────────┤
│ • Gestão financeira geral     │       │ • Central de Eventos          │
│ • Motor de Taxas e MDR        │       │ • Dashboard Individual        │
│ • Contabilidade e Fiscal      │       │ • Comercial e Negociações     │
│ • Análise/Aprovação Repasses  │       │ • Marketing e Anúncios        │
│ • Conciliação e Auditoria     │       │ • Remarketing & Carrinhos     │
│ • Razão Imutável (Ledger)     │       │ • Posição e Pedido de Repasse │
└───────────────────────────────┘       └───────────────────────────────┘
```

### Regras Invioláveis:
1. **Fonte Única de Verdade:** O Portal do Produtor **NÃO** possui um segundo Ledger, nem motor de taxas paralelo, nem calcula saldos independentes.
2. **Autoridade do Keeper:** Apenas o Keeper calcula disponibilidades, reservas de contingência, apropriações e aprova repasses.
3. **Idempotência:** Toda operação de escrita financeira (solicitação de repasse ou antecipação) transita com header `Idempotency-Key`.
4. **Isolamento de Produtor:** As requisições são assinadas com JWT e os headers `x-tenant-id`, `x-producer-id` garantem que o produtor acesse exclusivamente os seus dados.

---

## 2. Análise Técnica de Hospedagem do Keeper Core

Ao inspecionar os arquivos de configuração do Keeper (`vercel.json`, `.env.example`, `apps/api/src/main.ts`):

- **Ambiente Local:** O backend NestJS roda na porta `4000` (`http://localhost:4000/api/v1`) com PostgreSQL 16 na porta `5432`. O Portal do Produtor roda na porta `3001` com proxy configurado em `vite.config.ts`.
- **Ambiente de Produção (Vercel):** O arquivo `vercel.json` contém reescritas apontando `/api/(.*)` para o serviço NestJS (`apps/api`) e `/(.*)` para o frontend Vite (`apps/web`). Contudo, **o banco PostgreSQL e workers com filas RabbitMQ rodam externamente (Supabase/Neon/RDS/Docker)**. Portanto, a URL da Vercel (`https://keeper-tng6.vercel.app/api/v1`) é a interface REST da aplicação, enquanto o banco reside em servidor dedicado.
- **Resiliência do Adapter do Portal:** O arquivo `src/services/api/client.ts` e `src/services/api/keeperAdapter.ts` foi construído com estratégia híbrida: consome a API real do Keeper quando conectada e, caso o backend esteja temporariamente em manutenção ou offline, ativa fallback transparente com dados idênticos ao schema oficial do Prisma.

---

## 3. Mapeamento das APIs: Keeper Atual × Portal do Produtor

| Operação de Negócio | Endpoint Proposto no Portal | Endpoint Real Existente no Keeper API | Status no Keeper |
| :--- | :--- | :--- | :--- |
| **Visão Consolidada do Produtor** | `GET /producer/finance/summary` | `GET /api/v1/financeiro/settlement/producers/:id/overview` | ✅ Operacional no Keeper |
| **Carteiras de Eventos** | `GET /producer/finance/events/:id` | `GET /api/v1/financeiro/settlement/events/:id/financial-detail` | ✅ Operacional no Keeper |
| **Posições das Carteiras** | `GET /producer/finance/wallets` | `GET /api/v1/financeiro/settlement/wallets` | ✅ Operacional no Keeper |
| **Extrato do Evento** | `GET /producer/finance/events/:id/statement` | `GET /api/v1/financeiro/settlement/wallets/:id/statement` | ✅ Operacional no Keeper |
| **Livro Financeiro Imutável** | `GET /producer/finance/ledger` | `GET /api/v1/financeiro/settlement/ledger` | ✅ Operacional no Keeper |
| **Solicitação de Repasse** | `POST /producer/finance/payout-requests` | `POST /api/v1/financeiro/settlement/producers/:id/repayments?eventId=:id` | ✅ Operacional no Keeper |
| **Programação de Repasses** | `GET /producer/finance/payout-requests` | `GET /api/v1/financeiro/settlement/schedules` | ✅ Operacional no Keeper |
| **Solicitação de Antecipação** | `POST /producer/finance/advance-requests` | `POST /api/v1/financeiro/settlement/producers/:id/advances?eventId=:id` | ✅ Operacional no Keeper |
| **Taxas & Regras Comerciais** | `GET /producer/finance/fees` | `GET /api/v1/financeiro/commercial-rules` | ✅ Operacional no Keeper |
| **Apropriação de Venda** | `GET /producer/sales/:id/appropriation` | `GET /api/v1/financeiro/appropriation/:saleId` | ✅ Operacional no Keeper |
| **Webhook Venda Aprovada** | Evento de Domínio | `POST /api/v1/financeiro/settlement/webhook/sale-approved` | ✅ Operacional no Keeper |

---

## 4. Fluxo Operacional: Solicitação de Repasse (Passo a Passo)

1. **Consulta de Saldo:** O Portal consulta `GET /financeiro/settlement/wallets` e obtém `balanceAvailable: 148000.0`.
2. **Validação no Cliente:** O modal `PayoutRequestModal` impede valores maiores que o saldo disponível e bloqueia submissão caso haja trava de cancelamento (`isCancellationBlocked`).
3. **Envio da Solicitação:** O Portal envia `POST /financeiro/settlement/producers/:id/repayments` com header `Idempotency-Key: payout_prod-01_ev-101_1728490000000`.
4. **Análise no Keeper:** O time financeiro Disk visualiza a solicitação no status `UNDER_ANALYSIS` (Em Análise) no ERP.
5. **Aprovação e Programação:** O Keeper aprova e agenda (`SCHEDULED`), reservando o saldo na carteira.
6. **Execução Bancária:** Quando o retorno bancário (PIX) é confirmado, o Keeper atualiza para `PAID`, grava o `transactionHash` e debita o `FinancialLedger`.
7. **Atualização no Portal:** O Portal exibe o status atualizado e o recibo de liquidação no histórico.

---

## 5. Estrutura de Arquivos Criada no Projeto EAGLE

```text
EAGLE/
├── src/
│   ├── app/
│   │   ├── App.tsx                     # QueryProvider, BrowserRouter e Provedores
│   │   └── routes/
│   │       └── index.tsx               # Roteamento completo dos 9 módulos
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Busca global, produtor ativo, conexão Keeper
│   │   │   ├── Sidebar.tsx             # Menu lateral expansível em 2 níveis
│   │   │   ├── EventContextBar.tsx     # Alerta de contexto de evento ativo
│   │   │   └── MainLayout.tsx          # Shell mestre da aplicação
│   │   ├── cards/
│   │   │   ├── HorizontalEventCard.tsx # Referência 1 (Cards Horizontais UAE)
│   │   │   └── MetricKpiCard.tsx       # Cards analíticos de KPIs com tendências
│   │   ├── charts/
│   │   │   ├── SalesVelocityChart.tsx  # Referência 2 (Ritmo de Vendas Recharts)
│   │   │   ├── PaymentMethodsDonut.tsx # Referência 2 (Donut de formas de pagamento)
│   │   │   └── SectorProgressBars.tsx  # Ocupação por setor e lotes
│   │   └── modals/
│   │       └── PayoutRequestModal.tsx  # Modal seguro de solicitação de repasse
│   ├── contexts/
│   │   ├── AuthContext.tsx             # Contexto do produtor e checagem Keeper Core
│   │   └── EventContext.tsx            # Contexto do evento ativo vs geral
│   ├── modules/
│   │   ├── dashboard/                  # Dashboard Geral Consolidado
│   │   ├── eventos/                    # Central, Dashboard Individual, Ingressos, Mapa, Vendas, Cortesias
│   │   ├── comercial/                  # Pipeline B2B, Oportunidades, Propostas, Clientes
│   │   ├── marketing/                  # Performance de Campanhas e ROAS
│   │   ├── remarketing/                # Carrinhos abandonados e WhatsApp
│   │   ├── financeiro/                 # Carteiras, Extrato Ledger, Repasses, Taxas
│   │   ├── relatorios/                 # Exportações CSV, XLSX, PDF
│   │   ├── suporte/                    # Chamados com o suporte Disk
│   │   └── configuracoes/              # Dados cadastrais e bancários
│   ├── services/
│   │   └── api/
│   │       ├── client.ts               # Cliente HTTP com JWT e Idempotência
│   │       ├── keeperAdapter.ts        # Adaptador para endpoints oficiais do Keeper
│   │       └── mockSeedData.ts         # Seed fiel ao schema Prisma do Keeper
│   ├── types/                          # Interfaces TypeScript completas
│   └── utils/                          # Formatadores monetários pt-BR e helpers
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.app.json
```
