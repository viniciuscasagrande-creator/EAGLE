import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Modules
import { DashboardGeralPage } from '@/modules/dashboard/DashboardGeralPage';
import { CentralEventosPage } from '@/modules/eventos/CentralEventosPage';
import { DashboardIndividualPage } from '@/modules/eventos/DashboardIndividualPage';
import { IngressosPage } from '@/modules/eventos/IngressosPage';
import { MapaOcupacaoPage } from '@/modules/eventos/MapaOcupacaoPage';
import { VendasPedidosPage } from '@/modules/eventos/VendasPedidosPage';
import { CortesiasPage } from '@/modules/eventos/CortesiasPage';
import { NovoEventoPage } from '@/modules/eventos/NovoEventoPage';
import { CompararEventosPage } from '@/modules/eventos/CompararEventosPage';

import { DashboardComercialPage } from '@/modules/comercial/DashboardComercialPage';
import { DashboardMarketingPage } from '@/modules/marketing/DashboardMarketingPage';
import { DashboardRemarketingPage } from '@/modules/remarketing/DashboardRemarketingPage';

import { DashboardFinanceiroPage } from '@/modules/financeiro/DashboardFinanceiroPage';
import { CarteirasEventosPage } from '@/modules/financeiro/CarteirasEventosPage';
import { ExtratoLedgerPage } from '@/modules/financeiro/ExtratoLedgerPage';
import { TaxasRetencoesPage } from '@/modules/financeiro/TaxasRetencoesPage';
import { SolicitacoesRepassePage } from '@/modules/financeiro/SolicitacoesRepassePage';
import { AntecipacoesPage } from '@/modules/financeiro/AntecipacoesPage';

import { RelatoriosConsolidadosPage } from '@/modules/relatorios/RelatoriosConsolidadosPage';
import { SuporteChamadosPage } from '@/modules/suporte/SuporteChamadosPage';
import { ConfiguracoesProdutorPage } from '@/modules/configuracoes/ConfiguracoesProdutorPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
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
        <Route path="/eventos/:id/remarketing" element={<DashboardRemarketingPage />} />
        <Route path="/eventos/:id/relatorios" element={<RelatoriosConsolidadosPage />} />
        <Route path="/eventos/:id/configuracoes" element={<ConfiguracoesProdutorPage />} />

        {/* Módulo 3: Comercial */}
        <Route path="/comercial" element={<DashboardComercialPage />} />
        <Route path="/comercial/*" element={<DashboardComercialPage />} />

        {/* Módulo 4: Marketing */}
        <Route path="/marketing" element={<DashboardMarketingPage />} />
        <Route path="/marketing/*" element={<DashboardMarketingPage />} />

        {/* Módulo 5: Remarketing */}
        <Route path="/remarketing" element={<DashboardRemarketingPage />} />
        <Route path="/remarketing/*" element={<DashboardRemarketingPage />} />

        {/* Módulo 6: Financeiro */}
        <Route path="/financeiro" element={<DashboardFinanceiroPage />} />
        <Route path="/financeiro/carteiras" element={<CarteirasEventosPage />} />
        <Route path="/financeiro/extrato-ledger" element={<ExtratoLedgerPage />} />
        <Route path="/financeiro/taxas-retencoes" element={<TaxasRetencoesPage />} />
        <Route path="/financeiro/repasses" element={<SolicitacoesRepassePage />} />
        <Route path="/financeiro/antecipacoes" element={<AntecipacoesPage />} />
        <Route path="/financeiro/dados-bancarios" element={<ConfiguracoesProdutorPage />} />

        {/* Módulo 7: Relatórios */}
        <Route path="/relatorios" element={<RelatoriosConsolidadosPage />} />

        {/* Módulo 8: Atendimento & Suporte */}
        <Route path="/suporte" element={<SuporteChamadosPage />} />

        {/* Módulo 9: Configurações */}
        <Route path="/configuracoes" element={<ConfiguracoesProdutorPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
