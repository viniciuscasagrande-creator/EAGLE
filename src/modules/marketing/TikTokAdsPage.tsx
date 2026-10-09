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
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const TikTokAdsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'LOGS' | 'AUDIENCES' | 'SETTINGS'>('CAMPAIGNS');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              TikTok Ads & Pixel — Todos os Eventos
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Video className="w-3 h-3" />
              TikTok Events API Conectada
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Campanhas virais de vídeo, retenção do público jovem e transmissão de conversões via TikTok Events API
          </p>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] px-3.5 py-2 rounded-lg text-xs flex items-center gap-2">
          <span className="text-slate-400">Pixel ID TikTok:</span>
          <span className="font-mono font-bold text-pink-400">TT-PIXEL-7749</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Investimento TikTok"
          value={formatCurrency(4120)}
          subtitle="Campanhas de vídeo e Spark Ads"
          icon={DollarSign}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/10"
        />
        <MetricKpiCard
          title="Visualizações de Vídeo (6s)"
          value={formatNumber(384200)}
          subtitle="Taxa de retenção 42%"
          icon={Eye}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
        />
        <MetricKpiCard
          title="Custo por Visualização (CPV)"
          value="R$ 0,011"
          subtitle="Eficiência de engajamento"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Ingressos Atribuídos"
          value="182 ingressos"
          subtitle={formatCurrency(46800) + ' em faturamento'}
          icon={CheckCircle2}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'CAMPAIGNS', label: 'Campanhas TikTok' },
          { id: 'LOGS', label: 'Logs de Transmissão API' },
          { id: 'AUDIENCES', label: 'Públicos de Remarketing' },
          { id: 'SETTINGS', label: 'Configurações de Pixel' },
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

      {activeTab === 'CAMPAIGNS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Campanha TikTok</th>
                <th className="p-3.5 font-semibold">Formato</th>
                <th className="p-3.5 font-semibold">Investido</th>
                <th className="p-3.5 font-semibold">Visualizações</th>
                <th className="p-3.5 font-semibold">Cliques no Link</th>
                <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
                <th className="p-3.5 font-semibold">Receita Atribuída</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {[
                { name: 'TikTok Vídeos Lineup Festival XYZ', format: 'In-Feed Video', spent: 2600, views: 245000, clicks: 6800, tickets: 118, rev: 30680, status: 'Ativa' },
                { name: 'Spark Ads — Reels de Artista Confirmado', format: 'Spark Ads', spent: 1520, views: 139200, clicks: 3000, tickets: 64, rev: 16120, status: 'Ativa' },
              ].map((c, i) => (
                <tr key={i} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5 font-bold text-white">{c.name}</td>
                  <td className="p-3.5 font-mono text-slate-300">{c.format}</td>
                  <td className="p-3.5 font-semibold text-white">{formatCurrency(c.spent)}</td>
                  <td className="p-3.5 text-slate-300">{formatNumber(c.views)}</td>
                  <td className="p-3.5 text-slate-300">{formatNumber(c.clicks)}</td>
                  <td className="p-3.5 font-bold text-white">{c.tickets}</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(c.rev)}</td>
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

      {activeTab === 'LOGS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
          <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Logs de Transmissão da TikTok Events API (Server-Side)</h3>
            <span className="text-xs text-emerald-400">Latência média: 71ms</span>
          </div>

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

      {activeTab === 'AUDIENCES' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-3">
          <h3 className="font-bold text-white text-sm">Públicos TikTok Criados</h3>
          <div className="divide-y divide-[#37393e]">
            {[
              { name: 'Espectadores 100% dos Vídeos Lineup Festival XYZ', size: '92.400 usuários' },
              { name: 'Visitantes que Clicaram no Link TikTok Bio', size: '14.200 usuários' },
            ].map((a, i) => (
              <div key={i} className="py-3 flex justify-between items-center">
                <span className="font-bold text-white">{a.name}</span>
                <span className="font-mono text-emerald-400 font-bold">{a.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <h3 className="font-bold text-white text-sm">Configuração TikTok Events API</h3>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Access Token da Events API</label>
            <input
              type="password"
              readOnly
              value="••••••••••••••••••••••••••••••••••••••••"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
};
