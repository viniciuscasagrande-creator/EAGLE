import React from 'react';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Share2,
  DollarSign,
  Download,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export const AnalyticsMarketingPage: React.FC = () => {
  const channels = [
    { name: 'Meta Ads (Instagram & Facebook)', share: 44.5, spent: 7550, revenue: 70530, roas: 9.34, color: 'bg-blue-500' },
    { name: 'Google Ads (Search & PMax)', share: 28.2, spent: 4800, revenue: 44700, roas: 9.31, color: 'bg-emerald-500' },
    { name: 'WhatsApp Marketing & Disparos', share: 15.6, spent: 850, revenue: 98400, roas: 115.7, color: 'bg-green-500' },
    { name: 'TikTok Ads (Vídeos & Spark)', share: 8.1, spent: 4120, revenue: 46800, roas: 11.35, color: 'bg-pink-500' },
    { name: 'Spotify Ads (Áudio Streaming)', share: 3.6, spent: 2400, revenue: 38900, roas: 16.2, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Analytics de Marketing & Performance
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Atribuição Multicanal Consolidada
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Comparativo de investimento, receita atribuída por canal de mídia e ranking de campanhas por ROAS
          </p>
        </div>

        <button
          onClick={() => alert('Exportando relatório analítico de marketing (CSV/PDF)...')}
          className="flex items-center gap-2 bg-[#2c2d33] hover:bg-[#37393e] border border-[#37393e] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Faturamento Total Mídia"
          value={formatCurrency(299330)}
          subtitle="Atribuído a campanhas digitais"
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Investimento Total"
          value={formatCurrency(19720)}
          subtitle="Orçamento executado em ads"
          icon={TrendingUp}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="ROAS Geral Consolidado"
          value="15,1x"
          subtitle="R$ 15,18 para cada R$ 1,00"
          icon={BarChart3}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Participação em Vendas"
          value="59,8%"
          subtitle="Das vendas totais do evento"
          icon={PieChart}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Channel Share Comparison */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md space-y-4">
        <h3 className="font-bold text-white text-sm">Distribuição de Receita por Canal de Mídia</h3>
        <div className="space-y-3">
          {channels.map((ch, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white">{ch.name}</span>
                <span className="text-slate-300 font-bold">{ch.share}% ({formatCurrency(ch.revenue)})</span>
              </div>
              <div className="w-full h-2.5 bg-[#202124] rounded-full overflow-hidden">
                <div className={`h-full ${ch.color}`} style={{ width: `${ch.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns Ranking Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Ranking de Eficiência de Mídia (ROAS)</h3>
          <span className="text-xs text-slate-400">Classificação por retorno sobre investimento</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Canal de Aquisição</th>
              <th className="p-3.5 font-semibold">Gasto Mídia</th>
              <th className="p-3.5 font-semibold">Receita Atribuída</th>
              <th className="p-3.5 font-semibold">ROAS Contábil</th>
              <th className="p-3.5 font-semibold text-right">Eficiência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {channels.map((ch, idx) => (
              <tr key={idx} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-bold text-white">{ch.name}</td>
                <td className="p-3.5 text-slate-300">{formatCurrency(ch.spent)}</td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(ch.revenue)}</td>
                <td className="p-3.5 font-mono font-bold text-blue-400">{ch.roas.toFixed(1)}x</td>
                <td className="p-3.5 text-right">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Altamente Positivo
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
