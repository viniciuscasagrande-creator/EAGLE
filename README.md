# DiskIngressos — Portal do Produtor (EAGLE)

Portal web de alta performance e experiência premium desenvolvido exclusivamente para os produtores de eventos da **DiskIngressos**, integrado ao núcleo oficial **Keeper ERP**.

---

## 🚀 Como Executar em Desenvolvimento

### Pré-requisitos:
- Node.js 20+ ou 22+
- pnpm 10+ ou 12+

### 1. Instalar dependências (caso necessário)
```bash
pnpm install
```

### 2. Executar o servidor de desenvolvimento
```bash
pnpm dev
```
> O Portal abrirá automaticamente em `http://localhost:3001`.  
> O Keeper ERP roda por padrão na porta `3000` (Web) e `4000` (API REST). O proxy no `vite.config.ts` já encaminha `/api/v1` para `http://localhost:4000`.

### 3. Compilar para Produção (Typecheck + Vite Build)
```bash
pnpm build
```

---

## 🏛️ Destaques da Implementação

1. **Central de Eventos (Referência 1):** Cards horizontais modernos exibindo imagem de capa, código `#EVT`, faturamento bruto, ingressos vendidos, ingressos disponíveis, cortesias, barra dinâmica de taxa de ocupação e botão de administração direta.
2. **Dashboard Individual do Evento (Referência 2):** Painel inspirado no modelo Behance Ticket Dashboard com curva de velocidade de vendas (`recharts`), gráfico donut de canais de pagamento (PIX, Crédito à Vista, Parcelado, Boleto), ocupação por lote/setor, ticket médio, ponto de equilíbrio (*break-even*) e feed de pedidos em tempo real.
3. **Menu Lateral com 2 Níveis de Navegação:**
   - **Nível 1 (Geral do Produtor):** Dashboard Geral, Eventos, Comercial, Marketing, Remarketing, Financeiro, Relatórios, Suporte e Configurações.
   - **Nível 2 (Ambiente do Evento Selecionado):** Dashboard, Ingressos & Lotes, Mapa/Ocupação, Vendas & Pedidos, Cortesias, Financeiro do Evento, Comercial, Marketing, Remarketing e Configurações.
4. **Governança & Integração com o Keeper ERP:**
   - **Nenhum segundo Ledger:** Toda a informação de saldos, retenções e partidas dobradas consulta o serviço oficial do Keeper.
   - **Solicitação de Repasse com Idempotência:** O produtor solicita repasses validados contra o saldo disponível, que são enviados para análise e homologação da Controladoria Financeira no Keeper.
   - **Isolamento de Produtor:** Assinatura com JWT e cabeçalhos `x-tenant-id`, `x-producer-id`.
