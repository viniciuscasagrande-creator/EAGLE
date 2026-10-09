# ESPECIFICAÇÃO DE DESENVOLVIMENTO — PORTAL DO PRODUTOR DISKINGRESSOS

> **Diretiva de Projeto:** Este documento destina-se exclusivamente ao VS Code do **NOVO PORTAL DO PRODUTOR** (Projeto `EAGLE`), sem aplicar modificações no repositório do Keeper ERP.

---

## 1. OBJETIVO DO NOVO PROJETO

Construir o **Portal do Produtor da DiskIngressos**, uma aplicação web independente desenvolvida em **React + TypeScript + Vite**, projetada como a interface oficial de operação comercial, gestão de eventos, marketing, remarketing e acompanhamento financeiro dos produtores.

### Regra de Ouro da Arquitetura:
- **O KEEPER ERP É A AUTORIDADE CENTRAL:** O Keeper (`keeper-tng6.vercel.app`) é o ERP administrativo central da DiskIngressos, detentor do Livro Financeiro Imutável (`contabil.journal_entries`, `financeiro.financial_ledgers`), motor de cálculo de taxas, regras de MDR, retenções de contingência e aprovação bancária de repasses.
- **NENHUM LEDGER PARALELO:** O Portal do Produtor **NÃO** calcula saldos de forma autônoma, não recria o motor de taxas e não possui banco financeiro próprio. Toda a informação financeira exibida é consultada dos serviços centrais oficiais via API.
- **PROJETO VERCEL SEPARADO:** O Portal do Produtor terá repositório próprio no GitHub e projeto independente na Vercel, mantendo o deploy do Keeper inalterado.

---

## 2. STACK TECNOLÓGICA (FRONTEND)

- **Framework:** React 19 / 18 com TypeScript
- **Bundler:** Vite
- **Roteamento:** React Router v6 / v7 com `BrowserRouter` e layout persistente
- **Estilização:** Tailwind CSS (Dark theme executivo com paleta Slate, Brand Blue DiskIngressos `#2563eb`, Emerald `#10b981`, Amber `#f59e0b`)
- **Ícones:** Lucide React
- **Gráficos:** Recharts (curvas de vendas acumuladas/diárias e donut de métodos de pagamento)
- **Gerenciamento de Estado de API:** TanStack Query (`@tanstack/react-query`)
- **Deploy:** Vercel (com `vercel.json` configurado para rewrites SPA)

---

## 3. ARQUITETURA DE NAVEGAÇÃO (DOIS NÍVEIS)

### Nível 1: Menu Geral do Produtor (Visão Consolidada de Todos os Eventos)
Acessível logo após o login:
1. **DASHBOARD GERAL:** Faturamento bruto consolidado, saldo disponível para repasse no Keeper, total de ingressos emitidos, repasses pagos e destaques de eventos.
2. **EVENTOS:**
   - *Todos os Eventos* (Cards horizontais no estilo UAE Ticketing)
   - *Eventos Ativos*
   - *Eventos Futuros*
   - *Eventos Encerrados*
   - *Criar Novo Evento*
   - *Comparar Resultados*
3. **COMERCIAL:**
   - *Dashboard Comercial*
   - *Central de Clientes Corporativos*
   - *Oportunidades & Funil B2B*
   - *Orçamentos & Propostas*
   - *Vendas Corporativas & Grupos*
   - *Parceiros & Convênios*
4. **MARKETING:**
   - *Dashboard Marketing*
   - *Campanhas & Anúncios*
   - *Integrações (Meta Ads, Google Ads, TikTok Ads)*
   - *Públicos & Criativos*
5. **REMARKETING:**
   - *Dashboard Remarketing*
   - *Carrinhos Abandonados*
   - *Disparos WhatsApp & E-mail*
   - *Consentimento & Conformidade LGPD*
6. **FINANCEIRO:**
   - *Dashboard Financeiro*
   - *Carteiras dos Eventos (`EventWallet`)*
   - *Extrato Oficial do Livro Contábil (`FinancialLedger`)*
   - *Taxas & Retenções Contratuais*
   - *Solicitar Repasse (com validação de saldo)*
   - *Histórico de Repasses*
   - *Antecipações de Recebíveis*
7. **RELATÓRIOS:** Exportações analíticas em XLSX, CSV e PDF.
8. **ATENDIMENTO & SUPORTE:** Abertura e histórico de chamados operacionais.
9. **CONFIGURAÇÕES:** Dados cadastrais da empresa produtora e chave PIX oficial homologada.

---

### Nível 2: Menu Interno de um Evento Selecionado
Ativado quando o produtor clica em **"Administrar"** em qualquer evento:
- Banner superior com nome do evento, local, código `#EVT` e botão `"← Voltar para Meus Eventos"`.
- Submenus contextuais dedicados àquele evento:
  - **Dashboard do Evento:** 6 KPIs analíticos (Vendas, Ingressos, Cortesias, Restantes, Ticket Médio, Break-even), curva de velocidade de vendas (`SalesVelocityChart`), donut de formas de pagamento (`PaymentMethodsDonut`), barras de ocupação por setor/lote (`SectorProgressBars`) e feed de pedidos em tempo real.
  - **Ingressos & Lotes:** Gestão de cotas, preços unitários e viradas de lote.
  - **Mapa / Ocupação:** Visão gráfica de áreas (Pista Premium, Camarotes, Pista Geral).
  - **Pedidos e Vendas:** Tabela de pedidos com busca por número `#DI` ou comprador.
  - **Cortesias Emitidas:** Gestão de convites VIP e cotas autorizadas.
  - **Financeiro do Evento:** Saldo líquido específico da carteira do evento.
  - **Comercial do Evento:** Vendas corporativas e convênios daquele evento.
  - **Marketing do Evento:** Campanhas e UTMs direcionadas.
  - **Remarketing do Evento:** Carrinhos abandonados específicos.
  - **Relatórios do Evento:** Extrato analítico do evento.
  - **Configurações do Evento:** Dados e parâmetros operacionais.

---

## 4. FLUXO FINANCEIRO SEGURO (SOLICITAÇÃO DE REPASSE)

1. **Consulta Oficial:** O produtor visualiza o saldo disponível em `wallet.balanceAvailable`, calculado pelo Keeper.
2. **Validação no Cliente:** O modal impede valores acima do disponível e bloqueia submissão caso a carteira possua trava de cancelamento (`isCancellationBlocked`).
3. **Envio da Solicitação:** O Portal envia `POST /api/v1/financeiro/settlement/producers/:id/repayments` com header `Idempotency-Key` único para impedir duplicação.
4. **Análise no Keeper:** A equipe Disk visualiza a solicitação no status `UNDER_ANALYSIS` no ERP.
5. **Aprovação e Programação:** O Keeper aprova e agenda (`SCHEDULED`).
6. **Confirmação Bancária:** Após o envio via PIX, o Keeper avança para `PAID` e registra o `transactionHash`.
7. **Atualização no Portal:** O produtor visualiza a confirmação em seu histórico.

---

## 5. CONTRATOS DE INTEGRAÇÃO COM O KEEPER (APIs OFICIAIS)

O Portal do Produtor consome os seguintes endpoints já mapeados no Keeper:

| Recurso | Método & Rota no Keeper API | Finalidade |
| :--- | :--- | :--- |
| **Resumo Consolidado** | `GET /api/v1/financeiro/settlement/producers/:id/overview` | Posição financeira e KPIs globais do produtor |
| **Detalhe do Evento** | `GET /api/v1/financeiro/settlement/events/:id/financial-detail` | Decomposição financeira e taxas aplicadas ao evento |
| **Carteiras de Eventos** | `GET /api/v1/financeiro/settlement/wallets` | Consulta posições de todas as carteiras do produtor |
| **Extrato do Evento** | `GET /api/v1/financeiro/settlement/wallets/:id/statement` | Extrato contábil de movimentações da carteira |
| **Livro Financeiro (Ledger)**| `GET /api/v1/financeiro/settlement/ledger` | Partidas dobradas oficiais do Razão |
| **Solicitar Repasse** | `POST /api/v1/financeiro/settlement/producers/:id/repayments` | Criação de solicitação com `Idempotency-Key` |
| **Histórico de Repasses** | `GET /api/v1/financeiro/settlement/schedules` | Programação e comprovantes de liquidação PIX |
| **Solicitar Antecipação** | `POST /api/v1/financeiro/settlement/producers/:id/advances` | Solicitação de antecipação sobre saldo futuro |
| **Regras Comerciais / MDR** | `GET /api/v1/financeiro/commercial-rules` | Consulta de taxas contratuais vigentes |

---

## 6. CONFIGURAÇÃO DE DEPLOY NA VERCEL

### Arquivo `vercel.json` (Raiz do Projeto):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Variáveis de Ambiente no Projeto da Vercel:
```env
VITE_KEEPER_API_URL=https://keeper-tng6.vercel.app/api/v1
```

### Configurações de Build na Vercel:
- **Framework:** `Vite`
- **Root Directory:** `./`
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`
