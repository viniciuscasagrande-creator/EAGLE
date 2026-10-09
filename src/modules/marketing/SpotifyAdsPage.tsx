import React, { useState } from 'react';
import { SpotifyConnectModal } from '@/components/modals/SpotifyConnectModal';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Music2,
  Headphones,
  MousePointer,
  DollarSign,
  TrendingUp,
  Radio,
  CheckCircle2,
  Settings,
  Plus,
  X,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const SpotifyAdsPage: React.FC = () => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'CAPI' | 'SETTINGS'>('CAMPAIGNS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Spotify Ads & Conversões CAPI
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Music2 className="w-3.5 h-3.5" />
              Mídia em Áudio Ativa
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Campanhas em streaming de música, alcance segmentado por gênero musical e telemetria de conversão CAPI
          </p>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Configurar Spotify CAPI</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Ouvintes Únicos Atingidos"
          value="84.200 ouvintes"
          subtitle="Segmentação rock/pop/eletrônico"
          icon={Headphones}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Audições Completas (100%)"
          value="98,4% retenção"
          subtitle="Áudio sem opção de pular"
          icon={Music2}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Cliques no Companion Banner"
          value="2.840 cliques"
          subtitle="Taxa de clique 3,37%"
          icon={MousePointer}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Conversões via CAPI Áudio"
          value={formatCurrency(38900)}
          subtitle="92 ingressos confirmados"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'CAMPAIGNS', label: 'Campanhas de Áudio' },
          { id: 'CAPI', label: 'Telemetria Conversions API (CAPI)' },
          { id: 'SETTINGS', label: 'Configurações da Conexão' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold rounded-t-lg transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2c2d33] text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-400 hover:text-white hover:bg-[#25262c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'CAMPAIGNS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Campanha Spotify</th>
                <th className="p-3.5 font-semibold">Gêneros / Segmento</th>
                <th className="p-3.5 font-semibold">Investido</th>
                <th className="p-3.5 font-semibold">Audições de Áudio</th>
                <th className="p-3.5 font-semibold">Cliques no Banner</th>
                <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
                <th className="p-3.5 font-semibold">Receita CAPI</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {[
                {
                  name: 'Spotify Audio Ad — Playlist Festival XYZ 2026',
                  genre: 'Rock / Indie / Pop Brasil',
                  spent: 2400,
                  audioPlays: 88400,
                  clicks: 2840,
                  tickets: 92,
                  revenue: 38900,
                  status: 'Ativa',
                },
              ].map((c, i) => (
                <tr key={i} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5 font-bold text-white">{c.name}</td>
                  <td className="p-3.5 text-slate-300">{c.genre}</td>
                  <td className="p-3.5 font-semibold text-white">{formatCurrency(c.spent)}</td>
                  <td className="p-3.5 text-slate-300">{formatNumber(c.audioPlays)}</td>
                  <td className="p-3.5 text-slate-300">{formatNumber(c.clicks)}</td>
                  <td className="p-3.5 font-bold text-white">{c.tickets}</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(c.revenue)}</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'CAPI' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#37393e]">
            <div>
              <h3 className="font-bold text-white text-sm">Spotify Conversions API Server-Side</h3>
              <p className="text-slate-400">Atribuição de ouvintes que escutaram o spot de áudio e compraram ingressos</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Conexão CAPI: 100% OK
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e]">
              <div className="text-slate-400 font-semibold mb-1">Janela de Atribuição de Áudio</div>
              <div className="text-base font-bold text-white">7 dias pós-audição</div>
              <div className="text-[11px] text-slate-400 mt-1">Deduplicado com Meta e Google</div>
            </div>
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e]">
              <div className="text-slate-400 font-semibold mb-1">Eventos Disparados</div>
              <div className="text-base font-bold text-emerald-400">ViewContent, Purchase</div>
              <div className="text-[11px] text-slate-400 mt-1">Via CAPI Backend Node.js</div>
            </div>
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e]">
              <div className="text-slate-400 font-semibold mb-1">ROAS Atribuído ao Áudio</div>
              <div className="text-base font-bold text-blue-400 font-mono">16,2x</div>
              <div className="text-[11px] text-slate-400 mt-1">R$ 38.900 gerados</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <h3 className="font-bold text-white text-sm">Credenciais Spotify Ads</h3>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">ID da Conta Spotify Ads</label>
            <input
              type="text"
              readOnly
              value="sp_adacc_99210842"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Pixel Tag Spotify</label>
            <input
              type="text"
              readOnly
              value="SP-PX-88419"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold"
          >
            <span>Reconfigurar credenciais / token CAPI</span>
          </button>
        </div>
      )}

      {/* Spotify Connect Modal */}
      <SpotifyConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnected={() => {
          setIsConnectModalOpen(false);
          setToastMessage('Spotify Ads & CAPI reconectado com sucesso!');
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />
    </div>
  );
};
