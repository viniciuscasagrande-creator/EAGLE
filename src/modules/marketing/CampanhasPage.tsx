import React, { useState } from 'react';
import { mockMarketingCampaigns } from '@/services/api/mockSeedData';
import { MarketingCampaign } from '@/types/marketing';
import {
  Megaphone,
  Plus,
  Search,
  CheckCircle,
  Pause,
  Play,
  Download,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const CampanhasPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(mockMarketingCampaigns);
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('Conversão Feed & Reels');
  const [channel, setChannel] = useState<'META_ADS' | 'GOOGLE_ADS' | 'TIKTOK_ADS' | 'SPOTIFY_ADS'>('META_ADS');
  const [eventName, setEventName] = useState('Festival XYZ 2026');
  const [dailyBudget, setDailyBudget] = useState('150.00');
  const [submitting, setSubmitting] = useState(false);

  const toggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          setToastMessage(`Campanha "${c.name}" foi ${newStatus === 'ACTIVE' ? 'ativada' : 'pausada'} com sucesso.`);
          setTimeout(() => setToastMessage(null), 4000);
          return { ...c, status: newStatus as any };
        }
        return c;
      })
    );
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      name,
      channel,
      eventName,
      eventId: 'evt-xyz',
      budgetSpent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      attributedRevenue: 0,
      roas: 0,
      status: 'ACTIVE',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2026-12-31',
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    setIsModalOpen(false);
    setSubmitting(false);
    setToastMessage(`Nova campanha "${name}" criada e sincronizada com sucesso no canal ${channel}!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleExportCsv = () => {
    const headers = ['Campanha', 'Evento', 'Canal', 'Investimento (R$)', 'Cliques', 'CTR (%)', 'Conversões', 'Receita Atribuída (R$)', 'ROAS', 'Status'];
    const rows = filteredCampaigns.map((c) => [
      c.name,
      c.eventName,
      c.channel,
      c.budgetSpent.toFixed(2),
      c.clicks,
      `${c.ctr}%`,
      c.conversions,
      c.attributedRevenue.toFixed(2),
      `${c.roas}x`,
      c.status === 'ACTIVE' ? 'Ativa' : 'Pausada',
    ]);
    downloadCsv(headers, rows, `campanhas-midia-trafego-${new Date().toISOString().slice(0, 10)}.csv`);
    setToastMessage('Relatório de campanhas de tráfego exportado com sucesso (CSV)!');
    setTimeout(() => setToastMessage(null), 4000);
  };

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
      {toastMessage && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-blue-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Campanhas de Tráfego & Mídia Paga
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Meta Ads • Google Ads • TikTok • Spotify
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhamento de orçamento investido, custo por aquisição (CPA) e retorno sobre gasto em anúncios (ROAS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Campanha</span>
          </button>
        </div>
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
                    <button
                      onClick={() => toggleCampaignStatus(camp.id)}
                      title="Clique para alternar status (Ativar / Pausar)"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                        camp.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-700/40 text-slate-400 hover:bg-slate-700/70 border border-slate-600'
                      }`}
                    >
                      {camp.status === 'ACTIVE' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
                      <span>{camp.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Nova Campanha */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criar Nova Campanha de Tráfego</h3>
                  <p className="text-[11px] text-slate-400">Sincronização direta com a API do canal de anúncios</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Campanha *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Campanha Virada Lote 1 - Feed & Stories"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Canal de Mídia *</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="META_ADS">Meta Ads (Instagram & Facebook)</option>
                  <option value="GOOGLE_ADS">Google Ads (Search & Performance Max)</option>
                  <option value="TIKTOK_ADS">TikTok Ads (Spark & Feed)</option>
                  <option value="SPOTIFY_ADS">Spotify Ads (Áudio & CAPI)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Evento *</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Orçamento Diário (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(e.target.value)}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-1 text-slate-400">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Pixel DiskIngressos CAPI Vinculado</span>
                </div>
                <p className="text-[11px]">
                  Todos os eventos de InitiateCheckout e Purchase serão transmitidos com 100% de deduplicação e alta nota de correspondência (EMQ 9.2).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Publicando...' : 'Publicar Campanha'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
