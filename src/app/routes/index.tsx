import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Auth
import { LoginPage } from '@/modules/auth/LoginPage';

// Module 1: Dashboard Geral
import { DashboardGeralPage } from '@/modules/dashboard/DashboardGeralPage';

// Module 2: Eventos
import { CentralEventosPage } from '@/modules/eventos/CentralEventosPage';
import { DashboardIndividualPage } from '@/modules/eventos/DashboardIndividualPage';
import { IngressosPage } from '@/modules/eventos/IngressosPage';
import { MapaOcupacaoPage } from '@/modules/eventos/MapaOcupacaoPage';
import { VendasPedidosPage } from '@/modules/eventos/VendasPedidosPage';
import { CortesiasPage } from '@/modules/eventos/CortesiasPage';
import { NovoEventoPage } from '@/modules/eventos/NovoEventoPage';
import { CompararEventosPage } from '@/modules/eventos/CompararEventosPage';

// Module 3: Comercial & CRM
import { DashboardComercialPage } from '@/modules/comercial/DashboardComercialPage';
import { ClientesPage } from '@/modules/comercial/ClientesPage';
import { OportunidadesPage } from '@/modules/comercial/OportunidadesPage';
import { PropostasPage } from '@/modules/comercial/PropostasPage';
import { VendasCorporativasPage } from '@/modules/comercial/VendasCorporativasPage';
import { ParceirosPage } from '@/modules/comercial/ParceirosPage';

// Module 4: Marketing & Mídia Paga (Mapeamento Completo do Vídeo)
import { DashboardMarketingPage } from '@/modules/marketing/DashboardMarketingPage';
import { CampanhasPage } from '@/modules/marketing/CampanhasPage';
import { CampanhasProntasPage } from '@/modules/marketing/CampanhasProntasPage';
import { StatusRealCampanhasPage } from '@/modules/marketing/StatusRealCampanhasPage';
import { MetaAdsPage } from '@/modules/marketing/MetaAdsPage';
import { GoogleAnalytics4Page } from '@/modules/marketing/GoogleAnalytics4Page';
import { TikTokAdsPage } from '@/modules/marketing/TikTokAdsPage';
import { SpotifyAdsPage } from '@/modules/marketing/SpotifyAdsPage';
import { WhatsAppMarketingPage } from '@/modules/marketing/WhatsAppMarketingPage';
import { EmailMarketingPage } from '@/modules/marketing/EmailMarketingPage';
import { AutomacoesJornadasPage } from '@/modules/marketing/AutomacoesJornadasPage';
import { CentralUtmConversoesPage } from '@/modules/marketing/CentralUtmConversoesPage';
import { AnalyticsMarketingPage } from '@/modules/marketing/AnalyticsMarketingPage';
import { CuponsMarketingPage } from '@/modules/marketing/CuponsMarketingPage';
import { AfiliadosMarketingPage } from '@/modules/marketing/AfiliadosMarketingPage';
import { PixelsConversoesPage } from '@/modules/marketing/PixelsConversoesPage';
import { AtribuicaoMulticanalPage } from '@/modules/marketing/AtribuicaoMulticanalPage';
import { RelatoriosMarketingPage } from '@/modules/marketing/RelatoriosMarketingPage';
import { IntegracoesAdsPage } from '@/modules/marketing/IntegracoesAdsPage';
import { PublicosCriativosPage } from '@/modules/marketing/PublicosCriativosPage';

// Module 5: Remarketing & Recuperação (Mapeamento Completo do Vídeo)
import { HubRemarketingPage } from '@/modules/remarketing/HubRemarketingPage';
import { DashboardRemarketingPage } from '@/modules/remarketing/DashboardRemarketingPage';
import { CarrinhosAbandonadosPage } from '@/modules/remarketing/CarrinhosAbandonadosPage';
import { WhatsAppRemarketingPage } from '@/modules/remarketing/WhatsAppRemarketingPage';
import { EmailRemarketingPage } from '@/modules/remarketing/EmailRemarketingPage';
import { FluxosRecuperacaoPage } from '@/modules/remarketing/FluxosRecuperacaoPage';
import { RecuperacaoPagamentoPage } from '@/modules/remarketing/RecuperacaoPagamentoPage';
import { ClientesInativosPage } from '@/modules/remarketing/ClientesInativosPage';
import { RelatoriosRemarketingPage } from '@/modules/remarketing/RelatoriosRemarketingPage';
import { CampanhasDisparosPage } from '@/modules/remarketing/CampanhasDisparosPage';
import { ConsentimentoLgpdPage } from '@/modules/remarketing/ConsentimentoLgpdPage';

// Module 6: Financeiro & Keeper ERP
import { DashboardFinanceiroPage } from '@/modules/financeiro/DashboardFinanceiroPage';
import { CarteirasEventosPage } from '@/modules/financeiro/CarteirasEventosPage';
import { ExtratoLedgerPage } from '@/modules/financeiro/ExtratoLedgerPage';
import { TaxasRetencoesPage } from '@/modules/financeiro/TaxasRetencoesPage';
import { SolicitacoesRepassePage } from '@/modules/financeiro/SolicitacoesRepassePage';
import { AntecipacoesPage } from '@/modules/financeiro/AntecipacoesPage';

// Modules 7, 8, 9: Relatórios, Suporte, Configurações
import { RelatoriosConsolidadosPage } from '@/modules/relatorios/RelatoriosConsolidadosPage';
import { SuporteChamadosPage } from '@/modules/suporte/SuporteChamadosPage';
import { ConfiguracoesProdutorPage } from '@/modules/configuracoes/ConfiguracoesProdutorPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota Pública de Autenticação */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Protegidas por Autenticação Real */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Raiz & Dashboard Geral */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardGeralPage />} />

          {/* Módulo 2: Eventos */}
          <Route path="/eventos" element={<CentralEventosPage />} />
          <Route path="/eventos/novo" element={<NovoEventoPage />} />
          <Route path="/eventos/comparar" element={<CompararEventosPage />} />
          <Route path="/eventos/:id/dashboard" element={<DashboardIndividualPage />} />
          <Route path="/eventos/:id/ingressos" element={<IngressosPage />} />
          <Route path="/eventos/:id/mapa" element={<MapaOcupacaoPage />} />
          <Route path="/eventos/:id/vendas" element={<VendasPedidosPage />} />
          <Route path="/eventos/:id/cortesias" element={<CortesiasPage />} />
          <Route path="/eventos/:id/financeiro" element={<DashboardFinanceiroPage />} />
          <Route path="/eventos/:id/comercial" element={<DashboardComercialPage />} />
          <Route path="/eventos/:id/marketing" element={<DashboardMarketingPage />} />
          <Route path="/eventos/:id/remarketing" element={<HubRemarketingPage />} />
          <Route path="/eventos/:id/relatorios" element={<RelatoriosConsolidadosPage />} />
          <Route path="/eventos/:id/configuracoes" element={<ConfiguracoesProdutorPage />} />

          {/* Módulo 3: Comercial & CRM */}
          <Route path="/comercial" element={<DashboardComercialPage />} />
          <Route path="/comercial/clientes" element={<ClientesPage />} />
          <Route path="/comercial/oportunidades" element={<OportunidadesPage />} />
          <Route path="/comercial/propostas" element={<PropostasPage />} />
          <Route path="/comercial/vendas-corporativas" element={<VendasCorporativasPage />} />
          <Route path="/comercial/parceiros" element={<ParceirosPage />} />

          {/* Módulo 4: Marketing & Mídia Paga (Hierarquia do Vídeo) */}
          <Route path="/marketing" element={<DashboardMarketingPage />} />
          <Route path="/marketing/campanhas" element={<CampanhasPage />} />
          <Route path="/marketing/campanhas-prontas" element={<CampanhasProntasPage />} />
          <Route path="/marketing/status-real" element={<StatusRealCampanhasPage />} />
          <Route path="/marketing/meta-ads" element={<MetaAdsPage />} />
          <Route path="/marketing/ga4" element={<GoogleAnalytics4Page />} />
          <Route path="/marketing/tiktok-ads" element={<TikTokAdsPage />} />
          <Route path="/marketing/spotify-ads" element={<SpotifyAdsPage />} />
          <Route path="/marketing/whatsapp" element={<WhatsAppMarketingPage />} />
          <Route path="/marketing/email" element={<EmailMarketingPage />} />
          <Route path="/marketing/automacoes" element={<AutomacoesJornadasPage />} />
          <Route path="/marketing/cupons" element={<CuponsMarketingPage />} />
          <Route path="/marketing/utm-links" element={<CentralUtmConversoesPage />} />
          <Route path="/marketing/afiliados" element={<AfiliadosMarketingPage />} />
          <Route path="/marketing/pixels" element={<PixelsConversoesPage />} />
          <Route path="/marketing/atribuicao" element={<AtribuicaoMulticanalPage />} />
          <Route path="/marketing/relatorios" element={<RelatoriosMarketingPage />} />
          <Route path="/marketing/analytics" element={<AnalyticsMarketingPage />} />
          <Route path="/marketing/integracoes" element={<IntegracoesAdsPage />} />
          <Route path="/marketing/publicos" element={<PublicosCriativosPage />} />

          {/* Módulo 5: Remarketing & Conversão (Hierarquia do Vídeo) */}
          <Route path="/remarketing" element={<HubRemarketingPage />} />
          <Route path="/remarketing/dashboard" element={<DashboardRemarketingPage />} />
          <Route path="/remarketing/carrinhos" element={<CarrinhosAbandonadosPage />} />
          <Route path="/remarketing/carrinhos-abandonados" element={<CarrinhosAbandonadosPage />} />
          <Route path="/remarketing/whatsapp" element={<WhatsAppRemarketingPage />} />
          <Route path="/remarketing/email" element={<EmailRemarketingPage />} />
          <Route path="/remarketing/fluxos" element={<FluxosRecuperacaoPage />} />
          <Route path="/remarketing/recuperacao-pagamento" element={<RecuperacaoPagamentoPage />} />
          <Route path="/remarketing/clientes-inativos" element={<ClientesInativosPage />} />
          <Route path="/remarketing/relatorios" element={<RelatoriosRemarketingPage />} />
          <Route path="/remarketing/campanhas" element={<CampanhasDisparosPage />} />
          <Route path="/remarketing/consentimento" element={<ConsentimentoLgpdPage />} />

          {/* Módulo 6: Financeiro & Conexão Keeper Core */}
          <Route path="/financeiro" element={<DashboardFinanceiroPage />} />
          <Route path="/financeiro/carteiras" element={<CarteirasEventosPage />} />
          <Route path="/financeiro/extrato-ledger" element={<ExtratoLedgerPage />} />
          <Route path="/financeiro/taxas-retencoes" element={<TaxasRetencoesPage />} />
          <Route path="/financeiro/repasses" element={<SolicitacoesRepassePage />} />
          <Route path="/financeiro/antecipacoes" element={<AntecipacoesPage />} />
          <Route path="/financeiro/dados-bancarios" element={<ConfiguracoesProdutorPage />} />

          {/* Módulo 7: Relatórios Consolidados */}
          <Route path="/relatorios" element={<RelatoriosConsolidadosPage />} />

          {/* Módulo 8: Atendimento & Suporte */}
          <Route path="/suporte" element={<SuporteChamadosPage />} />

          {/* Módulo 9: Configurações Gerais */}
          <Route path="/configuracoes" element={<ConfiguracoesProdutorPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};
