import React, { useState } from 'react';
import { mockMarketingCampaigns } from '@/services/api/mockSeedData';
import { MarketingCampaign } from '@/types/marketing';
import {
  Megaphone,
  Plus,
  Search,
  CheckCircle,
  Pause,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const CampanhasPage: React.FC = () => {
  const [campaigns] = useState<MarketingCampaign[]>(mockMarketingCampaigns);
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'ALL' || c.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const totalSpent = campaigns.reduce((acc, c) => acc + c.budgetSpent, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.attributedRevenue, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const overallRoas = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Campanhas de Tráfego & Mídia Paga
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Meta Ads • Google Ads • TikTok
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhamento de orçamento investido, custo por aquisição (CPA) e retorno sobre gasto em anúncios (ROAS).
          </p>
        </div>

        <button
          onClick={() => alert('Abrir criador de anúncio integrado.')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Campanha</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Investimento Total</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatCurrency(totalSpent)}
          </div>
          <span className="text-[10px] text-slate-400">Verba consumida</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Receita Gerada (ROAS)</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">ROAS Médio: {overallRoas}x</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Ingressos Convertidos</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {formatNumber(totalConversions)} un
          </div>
          <span className="text-[10px] text-blue-400">Vendas via anúncios</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">CPA Médio</span>
          <div className="text-xl font-extrabold text-indigo-400 mt-1">
            {formatCurrency(totalSpent / (totalConversions || 1))}
          </div>
          <span className="text-[10px] text-indigo-400">Custo por ingresso vendido</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por campanha ou evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
        >
          <option value="ALL">Todas as Plataformas</option>
          <option value="META_ADS">Meta Ads (Instagram / Facebook)</option>
          <option value="GOOGLE_ADS">Google Ads (Search & YouTube)</option>
          <option value="TIKTOK_ADS">TikTok Ads</option>
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Campanha & Evento</th>
              <th className="p-3.5 font-semibold">Plataforma</th>
              <th className="p-3.5 font-semibold text-right">Gasto</th>
              <th className="p-3.5 font-semibold text-center">Cliques / CTR</th>
              <th className="p-3.5 font-semibold text-center">Conversões</th>
              <th className="p-3.5 font-semibold text-right">CPA</th>
              <th className="p-3.5 font-semibold text-right">Receita</th>
              <th className="p-3.5 font-semibold text-center">ROAS</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredCampaigns.map((camp) => {
              const cpa = camp.conversions > 0 ? camp.budgetSpent / camp.conversions : 0;
              return (
                <tr key={camp.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{camp.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{camp.eventName}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#232429] text-cyan-400 border border-[#37393e]">
                      {camp.channel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-white">
                    {formatCurrency(camp.budgetSpent)}
                  </td>
                  <td className="p-3.5 text-center text-slate-300">
                    <div>{formatNumber(camp.clicks)} clks</div>
                    <div className="text-[10px] text-slate-400 font-mono">{camp.ctr}% CTR</div>
                  </td>
                  <td className="p-3.5 text-center font-bold text-blue-400">
                    {camp.conversions} un
                  </td>
                  <td className="p-3.5 text-right text-slate-300 font-mono">
                    {formatCurrency(cpa)}
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-emerald-400">
                    {formatCurrency(camp.attributedRevenue)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="font-extrabold text-teal-400 font-mono text-sm">
                      {camp.roas}x
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        camp.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-700/40 text-slate-400'
                      }`}
                    >
                      {camp.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                      {camp.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
