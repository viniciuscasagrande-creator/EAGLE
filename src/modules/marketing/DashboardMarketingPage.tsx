import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { MarketingCampaign } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { NovaCampanhaModal } from '@/components/modals/NovaCampanhaModal';
import {
  Megaphone,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Sparkles,
  CheckCircle,
  Plus,
  MessageSquare,
  Mail,
  Music2,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export const DashboardMarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [isNovaCampanhaModalOpen, setIsNovaCampanhaModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getMarketingCampaigns().then(setCampaigns);
  }, []);

  const totalSpent = campaigns.reduce((acc, curr) => acc + curr.budgetSpent, 0);
  const totalAttributed = campaigns.reduce((acc, curr) => acc + curr.attributedRevenue, 0);
  const totalClicks = campaigns.reduce((acc, curr) => acc + curr.clicks, 0);
  const averageRoas = totalSpent > 0 ? totalAttributed / totalSpent : 0;

  const handleCampaignCreated = (newCamp: MarketingCampaign) => {
    setCampaigns([newCamp, ...campaigns]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Video Quick Actions (00:06-00:35) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Dashboard de Marketing & Mídia
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Tráfego & Conversão Direta
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Performance de mídia, ROAS, conversões atribuídas e integração direta com Meta, Google, TikTok e Spotify
          </p>
        </div>

        {/* Action Buttons observed in video */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsNovaCampanhaModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-lg shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Campanha</span>
          </button>

          <button
            onClick={() => navigate('/marketing/whatsapp')}
            className="flex items-center gap-1.5 bg-[#2c2d33] hover:bg-[#37393e] text-slate-200 hover:text-white border border-[#37393e] text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => navigate('/marketing/email')}
            className="flex items-center gap-1.5 bg-[#2c2d33] hover:bg-[#37393e] text-slate-200 hover:text-white border border-[#37393e] text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>E-mail</span>
          </button>

          <button
            onClick={() => navigate('/marketing/campanhas-prontas')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-md transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campanhas Prontas</span>
          </button>

          <button
            onClick={() => navigate('/marketing/relatorios')}
            className="flex items-center gap-1.5 bg-[#2c2d33] hover:bg-[#37393e] text-slate-200 hover:text-white border border-[#37393e] text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
            <span>Relatórios</span>
          </button>
        </div>
      </div>

      {/* Spotify Ads & CAPI Banner (Observed in video 00:06-00:35) */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#2c2d33] to-[#2c2d33] border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Music2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">Spotify Ads & Conversions API (CAPI)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Novo Recurso
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Anuncie direto nas playlists do público do seu show e acompanhe as vendas no motor contábil da DiskIngressos.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/marketing/spotify-ads')}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex-shrink-0 cursor-pointer shadow-md"
        >
          <span>Acessar Painel Spotify</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards */}
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

      {/* Real Status Quick Widget (Video 00:06-00:35) */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-amber-400" />
          <div>
            <div className="font-bold text-white text-xs">Monitoramento do Status Real das Campanhas</div>
            <div className="text-[11px] text-slate-400">Meta Ads, Google Ads, TikTok Ads e Spotify CAPI</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            2 Veiculando
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            1 Sem entrega
          </span>
          <span className="flex items-center gap-1 text-blue-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            1 Em moderação
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            1 Rejeitada
          </span>

          <button
            onClick={() => navigate('/marketing/status-real')}
            className="ml-2 text-amber-400 hover:text-amber-300 font-bold hover:underline"
          >
            Ver Detalhes →
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Campanhas Autorizadas & Conectadas</h3>
          <span className="text-xs text-slate-400">{campaigns.length} campanhas ativas</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-blue-400 border border-[#37393e]">
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

      {/* Modal */}
      <NovaCampanhaModal
        isOpen={isNovaCampanhaModalOpen}
        onClose={() => setIsNovaCampanhaModalOpen(false)}
        onSuccess={handleCampaignCreated}
      />
    </div>
  );
};
