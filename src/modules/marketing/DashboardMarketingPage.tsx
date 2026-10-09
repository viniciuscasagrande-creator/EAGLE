import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { MarketingCampaign } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { Megaphone, TrendingUp, Eye, MousePointer, DollarSign, Sparkles, CheckCircle } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

export const DashboardMarketingPage: React.FC = () => {
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
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Marketing & Tráfego Pago
          </h1>
          <p className="text-sm text-slate-400">
            Performance de mídia, ROAS, conversões atribuídas e integração direta com Meta Ads e Google Ads
          </p>
        </div>
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
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-sm">Campanhas Autorizadas & Conectadas</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
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
          <tbody className="divide-y divide-slate-800/60">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-200">{camp.name}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {camp.channel}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300">{camp.eventName}</td>
                <td className="p-3.5 font-semibold text-slate-200">{formatCurrency(camp.budgetSpent)}</td>
                <td className="p-3.5 text-slate-200">{camp.conversions} vendas</td>
                <td className="p-3.5 font-bold text-emerald-400">{formatCurrency(camp.attributedRevenue)}</td>
                <td className="p-3.5 font-extrabold text-blue-400">{camp.roas}x</td>
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
