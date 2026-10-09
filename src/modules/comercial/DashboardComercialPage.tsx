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

      {/* Funnel Pipeline Visual Breakdown */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Distribuição do Funil de Vendas</h3>
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
