import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { CommercialOpportunity, CommercialClient, CommercialProposal } from '@/types/commercial';
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
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export const DashboardComercialPage: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [clients, setClients] = useState<CommercialClient[]>([]);
  const [proposals, setProposals] = useState<CommercialProposal[]>([]);

  useEffect(() => {
    keeperAdapter.getCommercialOpportunities().then(setOpportunities);
    keeperAdapter.getCommercialClients().then(setClients);
    keeperAdapter.getCommercialProposals().then(setProposals);
  }, []);

  const pipelineTotal = opportunities.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const corporateVolume = clients.reduce((acc, curr) => acc + curr.totalVolume, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Comercial do Produtor
          </h1>
          <p className="text-sm text-slate-400">
            Gestão comercial, negociações corporativas, propostas e parcerias estratégicas para os seus eventos
          </p>
        </div>

        <button
          onClick={() => navigate('/comercial/oportunidades')}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Pipeline em Negociação"
          value={formatCurrency(pipelineTotal)}
          subtitle={`${opportunities.length} oportunidades ativas`}
          icon={Target}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />

        <MetricKpiCard
          title="Faturamento Corporativo B2B"
          value={formatCurrency(corporateVolume)}
          subtitle="Empresas, convênios e agências"
          icon={Building}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />

        <MetricKpiCard
          title="Clientes Corporativos"
          value={`${clients.length} contas`}
          subtitle="Cadastros corporativos ativos"
          icon={Users}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />

        <MetricKpiCard
          title="Propostas Emitidas"
          value={`${proposals.length} propostas`}
          subtitle="Aguardando fechamento"
          icon={FileCheck}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
      </div>

      {/* Funnel Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Funil de Oportunidades & Vendas Corporativas
            </h3>
            <p className="text-xs text-slate-400">
              Acompanhamento de vendas em grupos, lotes fechados e camarotes empresariais
            </p>
          </div>
          <button
            onClick={() => navigate('/comercial/oportunidades')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Ver Funil Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/60">
          {opportunities.map((opp) => (
            <div key={opp.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-slate-200">{opp.title}</div>
                <div className="text-[11px] text-slate-400">
                  {opp.clientName} • {opp.eventName} • Responsável: {opp.assignedTo}
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-100 text-sm">{formatCurrency(opp.estimatedValue)}</div>
                <div className="text-[10px] text-amber-400 font-semibold">
                  {opp.stage.replace('_', ' ')} ({opp.probability}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
