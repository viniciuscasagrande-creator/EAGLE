import React, { useState } from 'react';
import { mockTikTokLogs } from '@/services/api/mockSeedData';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Video,
  Eye,
  TrendingUp,
  DollarSign,
  Radio,
  Server,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  Key,
  Zap,
  Play,
  X,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface TikTokCampaign {
  id: string;
  name: string;
  format: 'SPARK_ADS' | 'IN_FEED_VIDEO' | 'TOP_VIEW';
  spent: number;
  videoViews: number;
  ctr: number;
  ticketsSold: number;
  revenue: number;
  status: 'ACTIVE' | 'PAUSED';
}

const initialTikTokCampaigns: TikTokCampaign[] = [
  {
    id: 'tt-01',
    name: 'TikTok Spark Ads — Viral Lineup Teaser',
    format: 'SPARK_ADS',
    spent: 1800,
    videoViews: 194000,
    ctr: 3.2,
    ticketsSold: 84,
    revenue: 21840,
    status: 'ACTIVE',
  },
  {
    id: 'tt-02',
    name: 'In-Feed Video — Virada de Lote Urgente',
    format: 'IN_FEED_VIDEO',
    spent: 1420,
    videoViews: 128000,
    ctr: 2.8,
    ticketsSold: 62,
    revenue: 16120,
    status: 'ACTIVE',
  },
  {
    id: 'tt-03',
    name: 'TopView — Abertura Geral de Vendas',
    format: 'TOP_VIEW',
    spent: 900,
    videoViews: 62200,
    ctr: 4.1,
    ticketsSold: 36,
    revenue: 8840,
    status: 'ACTIVE',
  },
];

export const TikTokAdsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'LOGS' | 'AUDIENCES' | 'SETTINGS'>('CAMPAIGNS');
  const [campaigns, setCampaigns] = useState<TikTokCampaign[]>(initialTikTokCampaigns);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // TikTok Credentials & Token State
  const [tiktokSettings, setTiktokSettings] = useState({
    pixelId: 'TT-PIXEL-7749',
    accessToken: 'tt_act_9018482019482710394819028',
    advertiserId: 'ADV-7749102',
  });
  const [showToken, setShowToken] = useState(false);

  // New TikTok Campaign Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    format: 'SPARK_ADS' as TikTokCampaign['format'],
    budget: 120,
    sparkAdCode: 'tiktok_spark_99812',
  });

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Credenciais e Token da TikTok Events API salvos com sucesso!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTestEvent = () => {
    setToastMessage('Evento "CompletePayment" transmitido com sucesso via TikTok Events API! Resposta HTTP 200 OK');
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) return;

    const created: TikTokCampaign = {
      id: `tt-${Date.now()}`,
      name: newCampaign.name.trim(),
      format: newCampaign.format,
      spent: Number(newCampaign.budget),
      videoViews: 1450,
      ctr: 3.0,
      ticketsSold: 2,
      revenue: Number(newCampaign.budget) * 3.2,
      status: 'ACTIVE',
    };

    setCampaigns((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewCampaign({
      name: '',
      format: 'SPARK_ADS',
      budget: 120,
      sparkAdCode: '',
    });
    setToastMessage(`Campanha "${created.name}" publicada com sucesso no TikTok Ads Manager!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalViews = campaigns.reduce((acc, c) => acc + c.videoViews, 0);
  const totalTickets = campaigns.reduce((acc, c) => acc + c.ticketsSold, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl text-pink-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              TikTok Ads & Pixel
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Video className="w-3 h-3" />
              TikTok Events API Conectada
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Campanhas virais de vídeo, Spark Ads, retenção de público e transmissão de conversões via TikTok API
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] border border-[#37393e] text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-pink-400" />
            <span>Token & Pixel TikTok</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Campanha TikTok</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Investimento TikTok"
          value={formatCurrency(totalSpent)}
          subtitle="Campanhas de vídeo e Spark Ads"
          icon={DollarSign}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/10"
        />
        <MetricKpiCard
          title="Visualizações de Vídeo (6s)"
          value={formatNumber(totalViews)}
          subtitle="Taxa de retenção média 42%"
          icon={Eye}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
        />
        <MetricKpiCard
          title="Custo por Visualização (CPV)"
          value="R$ 0,011"
          subtitle="Alta eficiência de engajamento"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Ingressos Atribuídos"
          value={`${totalTickets} ingressos`}
          subtitle={formatCurrency(totalRevenue) + ' em faturamento'}
          icon={CheckCircle2}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'CAMPAIGNS', label: `Campanhas TikTok (${campaigns.length})` },
          { id: 'LOGS', label: 'Logs de Transmissão API' },
          { id: 'AUDIENCES', label: 'Públicos de Remarketing' },
          { id: 'SETTINGS', label: 'Configuração de Token & Pixel' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold rounded-t-lg transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2c2d33] text-pink-400 border-t-2 border-pink-500'
                : 'text-slate-400 hover:text-white hover:bg-[#25262c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: CAMPAIGNS */}
      {activeTab === 'CAMPAIGNS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Anúncios de Vídeo e Spark Ads</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Anúncio TikTok</span>
            </button>
          </div>

          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                  <th className="p-3.5 font-semibold">Campanha</th>
                  <th className="p-3.5 font-semibold">Formato</th>
                  <th className="p-3.5 font-semibold">Investimento</th>
                  <th className="p-3.5 font-semibold">Visualizações (6s)</th>
                  <th className="p-3.5 font-semibold">CTR Médio</th>
                  <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
                  <th className="p-3.5 font-semibold">Receita Atribuída</th>
                  <th className="p-3.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#37393e]">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-[#25262c] transition">
                    <td className="p-3.5 font-bold text-white">{camp.name}</td>
                    <td className="p-3.5 font-mono text-[11px] text-pink-400">{camp.format}</td>
                    <td className="p-3.5 font-semibold text-white">{formatCurrency(camp.spent)}</td>
                    <td className="p-3.5 text-slate-300">{formatNumber(camp.videoViews)}</td>
                    <td className="p-3.5 font-mono text-cyan-400">{camp.ctr}%</td>
                    <td className="p-3.5 font-bold text-white">{camp.ticketsSold}</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(camp.revenue)}</td>
                    <td className="p-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativa
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: LOGS */}
      {activeTab === 'LOGS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Horário</th>
                <th className="p-3.5 font-semibold">Evento Transmitido</th>
                <th className="p-3.5 font-semibold">Pixel ID</th>
                <th className="p-3.5 font-semibold">Status HTTP</th>
                <th className="p-3.5 font-semibold">Latência</th>
                <th className="p-3.5 font-semibold text-right">Payload Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {mockTikTokLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="p-3.5 font-mono font-bold text-pink-400">{log.eventName}</td>
                  <td className="p-3.5 font-mono text-slate-300">{log.pixelId}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{log.latencyMs} ms</td>
                  <td className="p-3.5 font-mono text-right text-slate-400">{log.payloadHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: AUDIENCES */}
      {activeTab === 'AUDIENCES' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-3">
          <h3 className="font-bold text-white text-sm">Públicos TikTok Criados</h3>
          <div className="divide-y divide-[#37393e]">
            {[
              { name: 'Espectadores 100% dos Vídeos Lineup Festival XYZ', size: '92.400 usuários' },
              { name: 'Visitantes que Clicaram no Link TikTok Bio', size: '14.200 usuários' },
              { name: 'Compradores de Ingressos (Custom Audience SHA-256)', size: '18.100 usuários' },
            ].map((a, i) => (
              <div key={i} className="py-3 flex justify-between items-center">
                <span className="font-bold text-white">{a.name}</span>
                <span className="font-mono text-emerald-400 font-bold">{a.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: SETTINGS (Configuração de Tokens e Pixel) */}
      {activeTab === 'SETTINGS' && (
        <form onSubmit={handleSaveCredentials} className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#37393e]">
            <div>
              <h3 className="font-bold text-white text-sm">Configuração TikTok Events API & Pixel</h3>
              <p className="text-slate-400">Insira seu Pixel ID e Token de Acesso da API de Eventos do TikTok</p>
            </div>
            <button
              type="button"
              onClick={handleTestEvent}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 rounded-lg font-semibold transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Testar Disparo</span>
            </button>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">TikTok Pixel ID *</label>
            <input
              type="text"
              required
              value={tiktokSettings.pixelId}
              onChange={(e) => setTiktokSettings({ ...tiktokSettings, pixelId: e.target.value })}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Access Token da Events API *</label>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-[11px] text-pink-400 hover:underline cursor-pointer"
              >
                {showToken ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              type={showToken ? 'text' : 'password'}
              required
              value={tiktokSettings.accessToken}
              onChange={(e) => setTiktokSettings({ ...tiktokSettings, accessToken: e.target.value })}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-pink-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Gerado no TikTok Events Manager &gt; Web Events &gt; Settings &gt; Generate Access Token.
            </p>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">ID do Anunciante (Advertiser ID)</label>
            <input
              type="text"
              value={tiktokSettings.advertiserId}
              onChange={(e) => setTiktokSettings({ ...tiktokSettings, advertiserId: e.target.value })}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Sincronização em tempo real com o motor DiskIngressos.</span>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg shadow transition cursor-pointer"
            >
              Salvar Token TikTok
            </button>
          </div>
        </form>
      )}

      {/* Modal: Criar Campanha TikTok */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Criar Campanha TikTok Ads</h3>
                <p className="text-xs text-slate-400">
                  Anúncios de vídeo nativos e Spark Ads com UTMs pré-configuradas
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome da Campanha *</label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Ex: Spark Ad — Lineup Oficial TikTok"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Formato de Anúncio</label>
                  <select
                    value={newCampaign.format}
                    onChange={(e) => setNewCampaign({ ...newCampaign, format: e.target.value as any })}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="SPARK_ADS">Spark Ads (Impulsionar post orgânico)</option>
                    <option value="IN_FEED_VIDEO">In-Feed Video</option>
                    <option value="TOP_VIEW">TopView (Primeira tela do app)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Orçamento Diário (R$) *</label>
                  <input
                    type="number"
                    required
                    min={30}
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Código de Autorização Spark Ad / Vídeo</label>
                <input
                  type="text"
                  value={newCampaign.sparkAdCode}
                  onChange={(e) => setNewCampaign({ ...newCampaign, sparkAdCode: e.target.value })}
                  placeholder="Ex: tiktok_spark_auth_token_992"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                  Rastreamento Automático TikTok
                </span>
                <p className="font-mono text-[10px] text-slate-400">
                  ?utm_source=tiktok&utm_medium=video&utm_campaign={newCampaign.name.toLowerCase().replace(/\s+/g, '_') || 'campanha'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white bg-[#202124] rounded-lg border border-[#37393e] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Publicar no TikTok Ads</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
