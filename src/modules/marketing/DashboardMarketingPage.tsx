import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { MarketingCampaign } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { Megaphone, TrendingUp, Eye, MousePointer, DollarSign, Sparkles, CheckCircle, Plus } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export const DashboardMarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);

  useEffect(() => {
    keeperAdapter.getMarketingCampaigns().then(setCampaigns);
  }, []);

  const totalSpent = campaigns.reduce((acc, curr) => acc + curr.budgetSpent, 0);
  const totalAttributed = campaigns.reduce((acc, curr) => acc + curr.attributedRevenue, 0);
  const totalClicks = campaigns.reduce((acc, curr) => acc + curr.clicks, 0);
  const averageRoas = totalSpent > 0 ? (totalAttributed / totalSpent) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Marketing & Tráfego Pago
          </h1>
          <p className="text-sm text-slate-400">
            Performance de mídia, ROAS, conversões atribuídas e integração direta com Meta Ads e Google Ads
          </p>
        </div>

        <button
          onClick={() => navigate('/marketing/campanhas')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ver Todas as Campanhas</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Receita Atribuída"
          value={formatCurrency(totalAttributed)}
          subtitle="Vendas geradas por anúncios"
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />

        <MetricKpiCard
          title="Investimento em Mídia"
          value={formatCurrency(totalSpent)}
          subtitle="Orçamento executado"
          icon={Megaphone}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
        />

        <MetricKpiCard
          title="ROAS Médio Consolidado"
          value={`${averageRoas.toFixed(1)}x`}
          subtitle="Retorno sobre investimento"
          icon={TrendingUp}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />

        <MetricKpiCard
          title="Cliques Totais em Links"
          value={formatNumber(totalClicks)}
          subtitle="Tráfego direcionado aos eventos"
          icon={MousePointer}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e]">
          <h3 className="font-bold text-white text-sm">Campanhas Autorizadas & Conectadas</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Nome da Campanha</th>
              <th className="p-3.5 font-semibold">Canal</th>
              <th className="p-3.5 font-semibold">Evento</th>
              <th className="p-3.5 font-semibold">Investido</th>
              <th className="p-3.5 font-semibold">Conversões</th>
              <th className="p-3.5 font-semibold">Receita Atribuída</th>
              <th className="p-3.5 font-semibold">ROAS</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-bold text-white">{camp.name}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {camp.channel}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300">{camp.eventName}</td>
                <td className="p-3.5 font-semibold text-white">{formatCurrency(camp.budgetSpent)}</td>
                <td className="p-3.5 text-slate-300">{camp.conversions} vendas</td>
                <td className="p-3.5 font-bold text-emerald-400">{formatCurrency(camp.attributedRevenue)}</td>
                <td className="p-3.5 font-extrabold text-blue-400 font-mono">{camp.roas.toFixed(1)}x</td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    Ativa
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
