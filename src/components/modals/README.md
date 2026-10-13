# Catálogo de Componentes e Modais do Design System Eagle

Este diretório contém os modais operacionais da plataforma **Eagle / DiskIngressos**, organizados por domínio de negócio. Todos os modais seguem os padrões de design escuro (`#141b2d`), backdrop com desfoque (`backdrop-blur-sm`), tipografia padronizada e responsividade para desktop e dispositivos móveis.

---

## 1. Módulo Comercial & CRM B2B

| Modal | Arquivo | Rota / Origem | Finalidade / Props Principais |
| :--- | :--- | :--- | :--- |
| **Novo Cliente** | `NovoClienteModal.tsx` | `/comercial/clientes` | Cadastro de empresas, agências e grupos com CNPJ/CPF, telefone e e-mail. |
| **Dossiê do Cliente** | `ClienteDetalhesModal.tsx` | `/comercial/clientes` | Visualização 360º de faturamento corporativo acumulado e histórico de pedidos. |
| **Nova Oportunidade** | `NovaOportunidadeModal.tsx` | `/comercial/oportunidades` | Inclusão de deals no funil Kanban com probabilidade e previsão de receita. |
| **Detalhes do Deal** | `OportunidadeDetalhesModal.tsx` | `/comercial/oportunidades` | Gestão de etapas do funil, anotações comerciais e avanço de fase. |
| **Motivo de Perda** | `MotivoPerdaModal.tsx` | `/comercial/oportunidades` | Qualificação de descarte de oportunidades (Preço, Concorrência, Sem Budget). |
| **Nova Proposta** | `NovaPropostaModal.tsx` | `/comercial/propostas` | Elaboração de cotações com desconto progressivo, validade e parcelamento. |
| **Detalhes da Proposta** | `PropostaDetalhesModal.tsx` | `/comercial/propostas` | Visualização de proposta timbrada, exportação e envio de link via WhatsApp. |
| **Novo Pedido Corporativo** | `NovoPedidoCorporativoModal.tsx` | `/comercial/vendas-corporativas` | Emissão de ordens de venda B2B com faturamento a prazo e geração de NF-e. |
| **Detalhes do Pedido B2B** | `PedidoCorporativoDetalhesModal.tsx` | `/comercial/vendas-corporativas` | Status de pagamento, chave de NF-e e lote de ingressos corporativos. |
| **Importar Participantes** | `ImportarParticipantesModal.tsx` | `/comercial/vendas-corporativas` | Importação em massa de listas de colaboradores (CSV) para e-tickets nominais. |
| **Novo Parceiro** | `NovoParceiroModal.tsx` | `/comercial/parceiros` | Cadastro de promoters, influencers e convênios com comissão acordada. |
| **Detalhes do Parceiro** | `ParceiroDetalhesModal.tsx` | `/comercial/parceiros` | Saldo a liquidar de comissões, vendas geradas e liquidação via PIX. |
| **Dossiê 360º Produtor** | `DetalhesProdutorComercialModal.tsx` | `/comercial/produtores` | Raio-X do produtor: marketing ativo, tração de lotes e adoção Keeper ERP. |
| **Simulador de Crédito** | `SimuladorCreditoComercialModal.tsx` | `/comercial/produtores` | Simulação dinâmica de deságio e submissão direta ao Comitê de Crédito. |

---

## 2. Módulo de Marketing & Tráfego Pago

| Modal | Arquivo | Rota / Origem | Finalidade / Props Principais |
| :--- | :--- | :--- | :--- |
| **Nova Campanha** | `NovaCampanhaModal.tsx` | `/marketing/campanhas` | Criação de campanhas multicanais (Meta Ads, Google, TikTok) com orçamento. |
| **Configurar Playbook** | `ConfigurarCampanhaProntaModal.tsx` | `/marketing/campanhas-prontas` | Ativação rápida de receitas de marketing (Virada de Lote, Aquecimento). |
| **Novo Cupom** | `NovoCupomModal.tsx` | `/marketing/cupons` | Criação de vouchers promocionais (% ou R$) com limites de resgate e vigência. |
| **Novo Afiliado** | `NovoAfiliadoModal.tsx` | `/marketing/afiliados` | Parametrização de comissões e links parametrizados (UTMs) para parceiros. |
| **Disparo de E-mail** | `NovoEmailModal.tsx` | `/marketing/email` | Composição e agendamento de newsletters e comunicados para compradores. |
| **Conexão Spotify Ads** | `SpotifyConnectModal.tsx` | `/marketing/spotify-ads` | Vinculação com a API do Spotify for Artists e painel de anúncios de áudio. |

---

## 3. Módulo de Remarketing & Recuperação

| Modal | Arquivo | Rota / Origem | Finalidade / Props Principais |
| :--- | :--- | :--- | :--- |
| **Resgate via PIX** | `PixRecoveryModal.tsx` | `/remarketing/carrinhos` | Geração de link temporário com desconto e QR Code PIX copiado. |
| **Confirmar Resgate** | `ConfirmarVendaRecoveryModal.tsx` | `/remarketing/recuperacao-pagamento` | Conciliação manual de vendas recuperadas via atendimento assistido. |

---

## 4. Módulo Financeiro & Keeper ERP

| Modal | Arquivo | Rota / Origem | Finalidade / Props Principais |
| :--- | :--- | :--- | :--- |
| **Solicitar Repasse** | `PayoutRequestModal.tsx` | `/financeiro/repasses` | Pedido de transferência do saldo disponível para a conta bancária homologada. |
| **Solicitar Antecipação** | `SolicitarAntecipacaoModal.tsx` | `/financeiro/antecipacoes` | Antecipação de recebíveis de vendas futuras respeitando margem e spread. |

---

## 5. Módulo de Administração Master DiskIngressos

| Modal | Arquivo | Rota / Origem | Finalidade / Props Principais |
| :--- | :--- | :--- | :--- |
| **Editar Produtora** | `EditarProdutoraModal.tsx` | `/admin/produtoras` | Ajuste de Take Rate %, limite de antecipação e status de credenciamento. |
| **Decisão de Crédito** | `DecisaoAntecipacaoModal.tsx` | `/admin/antecipacoes` | Deliberação colegiada (Aprovar / Recusar) com notas do analista de risco. |

---

## 6. Módulo de Eventos & Operações

| Modal | Arquivo | Rota / Origem | Finalidade / Props Principais |
| :--- | :--- | :--- | :--- |
| **Novo Lote** | `NovoLoteModal.tsx` | `/eventos/:id/ingressos` | Criação de lotes por setor com quantidade, preço facial e validade. |
| **Emitir Cortesia** | `EmitirCortesiaModal.tsx` | `/eventos/:id/cortesias` | Emissão nominal de convites VIP (Imprensa, Artista, Patrocínio). |
| **Novo Chamado** | `NovoChamadoModal.tsx` | `/suporte` | Abertura de ticket de suporte operacional para a equipe DiskIngressos. |
| **Convidar Membro** | `ConvidarMembroModal.tsx` | `/configuracoes` | Envio de convite de acesso para colaboradores da produtora com papéis RBAC. |

---

## Padrões de Implementação

Todos os modais devem respeitar a seguinte assinatura padrão:

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Props adicionais de dados específicos...
}
```

- **Acessibilidade:** Fechamento com tecla `Esc` ou clique no backdrop exterior.
- **Prevenção de Scroll:** O body deve ter o overflow travado enquanto o modal estiver aberto.
- **Feedback Visual:** Botões de envio entram em estado `disabled` com indicador de carregamento durante operações assíncronas.
