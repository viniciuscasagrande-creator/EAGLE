import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { CommercialOpportunity, CommercialClient, CommercialProposal, CorporateOrder } from '@/types/commercial';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Briefcase,
  Users,
  Target,
  FileCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Building,
  CheckCircle,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Award,
  Layers,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { useNavigate } from 'react-router-dom';
import { NovaOportunidadeModal } from '@/components/modals/NovaOportunidadeModal';
import { NovaPropostaModal } from '@/components/modals/NovaPropostaModal';
import { PropostaDetalhesModal } from '@/components/modals/PropostaDetalhesModal';
import { PipelineFunnelChart } from '@/components/charts/PipelineFunnelChart';
import { CommercialRevenueChart } from '@/components/charts/CommercialRevenueChart';
import { mockProducerCommercialSummaries } from '@/services/api/mockSeedData';
import {
  Radar,
  MessageSquare,
  Database,
  Megaphone,
  Zap,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const DashboardComercialPage: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [clients, setClients] = useState<CommercialClient[]>([]);
  const [proposals, setProposals] = useState<CommercialProposal[]>([]);
  const [corporateOrders, setCorporateOrders] = useState<CorporateOrder[]>([]);

  // Filter state
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('30D');

  // Modals state
  const [isOppModalOpen, setIsOppModalOpen] = useState(false);
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<CommercialProposal | null>(null);

  useEffect(() => {
    keeperAdapter.getCommercialOpportunities().then(setOpportunities);
    keeperAdapter.getCommercialClients().then(setClients);
    keeperAdapter.getCommercialProposals().then(setProposals);
    keeperAdapter.getCorporateOrders().then(setCorporateOrders);
  }, []);

  // Filter calculations
  const filteredOpps = opportunities.filter((o) => {
    if (selectedEvent === 'ALL') return true;
    return (o.eventName || '').toLowerCase().includes(selectedEvent.toLowerCase());
  });

  const pipelineTotal = filteredOpps
    .filter((o) => o.stage !== 'FECHADO_PERDIDO' && o.stage !== 'FECHADO_GANHO')
    .reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const closedWonTotal = filteredOpps
    .filter((o) => o.stage === 'FECHADO_GANHO')
    .reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const corporateVolume = corporateOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalClosed = closedWonTotal + corporateVolume;
  const targetMonthly = 350000;
  const progressPercent = Math.min(100, Math.round((totalClosed / targetMonthly) * 100));

  // Funnel stages counts & values
  const stagesCount = {
    PROSPECCAO: filteredOpps.filter((o) => o.stage === 'PROSPECCAO'),
    PROPOSTA_ENVIADA: filteredOpps.filter((o) => o.stage === 'PROPOSTA_ENVIADA'),
    NEGOCIACAO: filteredOpps.filter((o) => o.stage === 'NEGOCIACAO'),
    FECHADO_GANHO: filteredOpps.filter((o) => o.stage === 'FECHADO_GANHO'),
    FECHADO_PERDIDO: filteredOpps.filter((o) => o.stage === 'FECHADO_PERDIDO'),
  };

  const weightedPipeline = filteredOpps
    .filter((o) => o.stage !== 'FECHADO_PERDIDO' && o.stage !== 'FECHADO_GANHO')
    .reduce((acc, curr) => acc + (curr.estimatedValue * (curr.probability || 50)) / 100, 0);

  const totalDecided = stagesCount.FECHADO_GANHO.length + stagesCount.FECHADO_PERDIDO.length;
  const winRate = totalDecided > 0 ? Math.round((stagesCount.FECHADO_GANHO.length / totalDecided) * 100) : 66;
  const avgTicketB2b = totalClosed / Math.max(1, stagesCount.FECHADO_GANHO.length + corporateOrders.length);

  const funnelChartData = [
    {
      stage: 'PROSPECCAO',
      label: '1. Prospecção',
      amount: stagesCount.PROSPECCAO.reduce((acc, o) => acc + o.estimatedValue, 0),
      count: stagesCount.PROSPECCAO.length,
      color: '#60a5fa',
    },
    {
      stage: 'PROPOSTA_ENVIADA',
      label: '2. Proposta Enviada',
      amount: stagesCount.PROPOSTA_ENVIADA.reduce((acc, o) => acc + o.estimatedValue, 0),
      count: stagesCount.PROPOSTA_ENVIADA.length,
      color: '#818cf8',
    },
    {
      stage: 'NEGOCIACAO',
      label: '3. Negociação',
      amount: stagesCount.NEGOCIACAO.reduce((acc, o) => acc + o.estimatedValue, 0),
      count: stagesCount.NEGOCIACAO.length,
      color: '#fbbf24',
    },
    {
      stage: 'FECHADO_GANHO',
      label: '4. Ganho / Fechado',
      amount: stagesCount.FECHADO_GANHO.reduce((acc, o) => acc + o.estimatedValue, 0),
      count: stagesCount.FECHADO_GANHO.length,
      color: '#34d399',
    },
    {
      stage: 'FECHADO_PERDIDO',
      label: '5. Perdido',
      amount: stagesCount.FECHADO_PERDIDO.reduce((acc, o) => acc + o.estimatedValue, 0),
      count: stagesCount.FECHADO_PERDIDO.length,
      color: '#f87171',
    },
  ];

  const revenueMonthlyHistory = [
    { month: 'Mai/26', realized: 180000, target: 250000 },
    { month: 'Jun/26', realized: 240000, target: 280000 },
    { month: 'Jul/26', realized: 310000, target: 300000 },
    { month: 'Ago/26', realized: 290000, target: 320000 },
    { month: 'Set/26', realized: 340000, target: 330000 },
    { month: 'Out/26 (Atual)', realized: totalClosed, target: targetMonthly },
  ];

  const handleExportConsolidatedReport = () => {
    downloadCsv(
      'relatorio-comercial-consolidado',
      ['Tipo', 'Identificador / Titulo', 'Cliente / Empresa', 'Evento', 'Valor (R$)', 'Status / Etapa', 'Data'],
      [
        ...opportunities.map((o) => [
          'Oportunidade',
          o.title,
          o.clientName,
          o.eventName || '-',
          o.estimatedValue,
          o.stage,
          o.closeDate || '-',
        ]),
        ...proposals.map((p) => [
          'Proposta',
          p.proposalNumber,
          p.clientName,
          p.eventName,
          p.totalAmount,
          p.status,
          p.validUntil,
        ]),
        ...corporateOrders.map((c) => [
          'Pedido Corporativo',
          c.orderNumber,
          c.companyName,
          c.eventName,
          c.totalAmount,
          c.paymentStatus,
          c.createdAt,
        ]),
      ]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Dashboard Comercial & CRM
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Vendas B2B & Cotas
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Pipeline corporativo, acompanhamento de metas, orçamentos e performance de parcerias DiskIngressos.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportConsolidatedReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Relatório Consolidado (CSV)</span>
          </button>

          <button
            onClick={() => navigate('/comercial/produtores')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md shadow-purple-600/20 transition cursor-pointer"
          >
            <Radar className="w-4 h-4" />
            <span>Radar de Produtores & ERP</span>
          </button>

          <button
            onClick={() => setIsPropModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#232429] hover:bg-[#35363c] text-blue-400 hover:text-white text-xs font-bold rounded-lg border border-blue-500/30 transition cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Nova Proposta</span>
          </button>

          <button
            onClick={() => setIsOppModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-300">Filtro de Visão:</span>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-1.5 rounded-md border border-[#37393e] focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Todos os Eventos Cadastrados</option>
            <option value="Festival">Festival de Verão Curitiba 2026</option>
            <option value="Show ABC">Show Nacional ABC 2026</option>
            <option value="Stand-up">Stand-up Especial 2026</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-[#202124] p-1 rounded-lg border border-[#37393e]">
          {(['7D', '30D', '90D', 'SAFRA'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {period === '7D' ? '7 Dias' : period === '30D' ? '30 Dias' : period === '90D' ? 'Trimestre' : 'Safra Atual'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Pipeline em Aberto"
          value={formatCurrency(pipelineTotal)}
          subtitle={`${filteredOpps.filter((o) => o.stage !== 'FECHADO_PERDIDO' && o.stage !== 'FECHADO_GANHO').length} negócios em negociação`}
          icon={Target}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />

        <MetricKpiCard
          title="Faturamento Corporativo Fechado"
          value={formatCurrency(totalClosed)}
          subtitle="Contratos liquidados + ganhos"
          icon={Building}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />

        <MetricKpiCard
          title="Taxa de Conversão"
          value="48.5%"
          subtitle="Propostas convertidas em pedidos"
          icon={TrendingUp}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />

        <MetricKpiCard
          title="Clientes Atendidos"
          value={`${clients.length} contas`}
          subtitle="Empresas, conselhos e agências"
          icon={Users}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Sales Target Goal Card */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Meta Comercial B2B do Mês
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Alvo projetado para camarotes corporativos, cotas de apoiadores e compras em lote
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Realizado:</span>
              <span className="text-emerald-400 font-extrabold text-sm">{formatCurrency(totalClosed)}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] uppercase block">Meta Estabelecida:</span>
              <span className="text-white font-extrabold text-sm">{formatCurrency(targetMonthly)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-[#202124] rounded-full overflow-hidden p-0.5 border border-[#37393e]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>Progresso Atual: <strong className="text-white">{progressPercent}%</strong> atingido</span>
            <span>Faltam <strong className="text-amber-400">{formatCurrency(Math.max(0, targetMonthly - totalClosed))}</strong> para a meta</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Forecast Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Bar Chart */}
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Funil Visual de Conversão B2B</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Volume financeiro consolidado por etapa do pipeline comercial
              </p>
            </div>
            <button
              onClick={() => navigate('/comercial/oportunidades')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <PipelineFunnelChart data={funnelChartData} />

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Pipeline Total Bruto: <strong className="text-white">{formatCurrency(pipelineTotal)}</strong></span>
            <span className="text-emerald-400">Ganhos: {formatCurrency(closedWonTotal)}</span>
          </div>
        </div>

        {/* Revenue vs Target Trend & Forecast */}
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Evolução do Faturamento & Forecast</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Realizado nos últimos meses vs Meta oficial de R$ 350k
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Safra 2026
            </span>
          </div>

          <CommercialRevenueChart data={revenueMonthlyHistory} targetValue={targetMonthly} />

          {/* Forecast Indicators */}
          <div className="pt-3 border-t border-[#37393e] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
              <span className="text-[10px] text-slate-400 uppercase block">Pipeline Ponderado</span>
              <span className="text-emerald-400 font-extrabold font-mono text-xs">{formatCurrency(weightedPipeline)}</span>
            </div>
            <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
              <span className="text-[10px] text-slate-400 uppercase block">Taxa de Conversão</span>
              <span className="text-blue-400 font-extrabold font-mono text-xs">{winRate}%</span>
            </div>
            <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
              <span className="text-[10px] text-slate-400 uppercase block">Ticket Médio B2B</span>
              <span className="text-amber-400 font-extrabold font-mono text-xs">{formatCurrency(avgTicketB2b)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Radar 360º de Produtores & Atualizações Mais Recentes (Marketing, Vendas & ERP) */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#37393e]">
          <div>
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Radar 360º: Atualizações Mais Recentes dos Produtores (Marketing, Vendas & ERP)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                TEMPO REAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervisão de campanhas ativas, status dos lotes e módulos em uso do Keeper ERP para apoio proativo do time comercial.
            </p>
          </div>

          <button
            onClick={() => navigate('/comercial/produtores')}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Ver Radar Completo ({mockProducerCommercialSummaries.length} contas)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Producers Strip Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#202124] text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Produtora / Responsável</th>
                <th className="py-2.5 px-3">Evento & Status do Lote</th>
                <th className="py-2.5 px-3">Campanhas de Marketing</th>
                <th className="py-2.5 px-3">O que usa do Keeper ERP</th>
                <th className="py-2.5 px-3">Última Atualização</th>
                <th className="py-2.5 px-3 text-right">Contato Comercial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]/60 text-slate-300">
              {mockProducerCommercialSummaries.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#35363c]/50 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{prod.tradeName}</div>
                    <div className="text-[11px] text-slate-400">{prod.responsibleName}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-purple-300">{prod.topEventName}</div>
                    <div className="text-[11px] text-amber-300">{prod.currentLotStatus}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        prod.marketing.metaAdsActive
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        Meta ({prod.marketing.metaAdsCampaignsCount})
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        prod.marketing.ga4Connected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        GA4
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        prod.marketing.whatsappAutomationsActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        WhatsApp
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {prod.erp.keeperAdvanceActive && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Antecipação (R$ {(prod.erp.keeperAdvanceTotal / 1000).toFixed(0)}k)
                        </span>
                      )}
                      {prod.erp.automatedBordereauEnabled && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Borderô Auto
                        </span>
                      )}
                      {prod.erp.splitRulesConfigured && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Split
                        </span>
                      )}
                      {!prod.erp.keeperAdvanceActive && !prod.erp.automatedBordereauEnabled && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Apenas Vendas (Oferecer ERP)
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-[11px] text-slate-300 max-w-xs truncate">
                      <span className="font-bold text-amber-400">{prod.recentActivity[0]?.timestamp}:</span>{' '}
                      {prod.recentActivity[0]?.description}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        const cleanPhone = prod.contactPhone.replace(/\D/g, '');
                        window.open(`https://wa.me/55${cleanPhone}`, '_blank');
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Funnel Pipeline Visual Breakdown */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Etapas Detalhadas do Ciclo de Vendas</h3>
            <p className="text-xs text-slate-400">Visão consolidada por etapa do ciclo de vendas</p>
          </div>
          <button
            onClick={() => navigate('/comercial/oportunidades')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Funil Kanban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {[
            { key: 'PROSPECCAO', label: '1. Prospecção', color: 'border-blue-500 text-blue-400', list: stagesCount.PROSPECCAO },
            { key: 'PROPOSTA_ENVIADA', label: '2. Proposta Enviada', color: 'border-indigo-500 text-indigo-400', list: stagesCount.PROPOSTA_ENVIADA },
            { key: 'NEGOCIACAO', label: '3. Negociação', color: 'border-amber-500 text-amber-400', list: stagesCount.NEGOCIACAO },
            { key: 'FECHADO_GANHO', label: '4. Ganho / Fechado', color: 'border-emerald-500 text-emerald-400', list: stagesCount.FECHADO_GANHO },
            { key: 'FECHADO_PERDIDO', label: '5. Perdido', color: 'border-rose-500 text-rose-400', list: stagesCount.FECHADO_PERDIDO },
          ].map((st) => {
            const sum = st.list.reduce((acc, o) => acc + o.estimatedValue, 0);
            return (
              <div
                key={st.key}
                onClick={() => navigate('/comercial/oportunidades')}
                className={`bg-[#202124] border-t-2 ${st.color} border border-[#37393e] p-3 rounded-lg hover:bg-[#25262c] transition cursor-pointer`}
              >
                <span className="text-[11px] font-bold block">{st.label}</span>
                <div className="text-base font-extrabold text-white mt-1">
                  {formatCurrency(sum)}
                </div>
                <span className="text-[10px] text-slate-400">{st.list.length} oportunidades</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Proposals & Closers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-400" />
              <span>Propostas Comerciais Recentes</span>
            </h3>
            <button
              onClick={() => navigate('/comercial/propostas')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              Ver Todas
            </button>
          </div>

          <div className="divide-y divide-[#37393e]">
            {proposals.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProposal(p)}
                className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-[#25262c] px-2 rounded-md transition cursor-pointer"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-blue-400">{p.proposalNumber}</span>
                    <span>{p.clientName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {p.eventName} • {p.totalTickets} Ingressos
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-white font-mono">{formatCurrency(p.totalAmount)}</div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                      p.status === 'APROVADA'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : p.status === 'ENVIADA'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-[#202124] text-slate-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Closers Performance */}
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Performance dos Representantes Comerciais</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Curitiba & Região</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { name: 'Vinicius Casagrande', deals: 4, volume: 145000, conversion: '62%' },
              { name: 'Bruno Valente', deals: 3, volume: 103000, conversion: '55%' },
              { name: 'Ana Paula Dias', deals: 2, volume: 72000, conversion: '48%' },
            ].map((closer, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#202124] border border-[#37393e] rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400">
                    {closer.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{closer.name}</span>
                    <span className="text-[11px] text-slate-400">{closer.deals} negócios fechados • Conversão {closer.conversion}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-emerald-400 font-mono block">
                    {formatCurrency(closer.volume)}
                  </span>
                  <span className="text-[10px] text-slate-400">Faturamento atribuído</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <NovaOportunidadeModal
        isOpen={isOppModalOpen}
        onClose={() => setIsOppModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCommercialOpportunity(data);
          setOpportunities((prev) => [created, ...prev]);
        }}
      />

      <NovaPropostaModal
        isOpen={isPropModalOpen}
        onClose={() => setIsPropModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCommercialProposal(data);
          setProposals((prev) => [created, ...prev]);
        }}
      />

      <PropostaDetalhesModal
        proposal={selectedProposal}
        isOpen={Boolean(selectedProposal)}
        onClose={() => setSelectedProposal(null)}
        onUpdateStatus={async (status) => {
          if (selectedProposal) {
            const updated = await keeperAdapter.updateCommercialProposalStatus(selectedProposal.id, status);
            setProposals(updated);
            setSelectedProposal((prev) => (prev ? { ...prev, status } : null));
          }
        }}
        onConvertToCorporate={async (proposal) => {
          const order = await keeperAdapter.convertProposalToCorporateOrder(proposal.id);
          setCorporateOrders((prev) => [order, ...prev]);
          const updatedProps = await keeperAdapter.getCommercialProposals();
          setProposals(updatedProps);
        }}
      />
    </div>
  );
};
