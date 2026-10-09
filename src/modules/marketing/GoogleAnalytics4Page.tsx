import React, { useState } from 'react';
import { mockGa4Events } from '@/services/api/mockSeedData';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  BarChart,
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  Radio,
  Smartphone,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const GoogleAnalytics4Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FUNNEL' | 'EVENTS_LOG' | 'SETTINGS'>('OVERVIEW');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Google Analytics 4 — Todos os Eventos
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className="w-3 h-3 animate-pulse" />
              Stream GA4 Ativo
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Monitoramento de tráfego, funil de checkout, atribuição de canais e logs de telemetria em tempo real
          </p>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] px-3.5 py-2 rounded-lg text-xs flex items-center gap-2">
          <span className="text-slate-400">Measurement ID:</span>
          <span className="font-mono font-bold text-amber-400">G-78X889021B</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Visitantes Ativos Agora"
          value="142 online"
          subtitle="Navegando no checkout"
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Eventos de Conversão"
          value="1.240 compras"
          subtitle="Eventos purchase confirmados"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Taxa de Conversão da Loja"
          value="3,84%"
          subtitle="Sessões convertidas em venda"
          icon={Activity}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Receita GA4 Atribuída"
          value={formatCurrency(312450)}
          subtitle="E-commerce enhancement"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'OVERVIEW', label: 'Tráfego & Origens' },
          { id: 'FUNNEL', label: 'Funil de Compra' },
          { id: 'EVENTS_LOG', label: 'Eventos em Tempo Real (Logs)' },
          { id: 'SETTINGS', label: 'Propriedade GA4' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold rounded-t-lg transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2c2d33] text-amber-400 border-t-2 border-amber-500'
                : 'text-slate-400 hover:text-white hover:bg-[#25262c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md">
            <h3 className="font-bold text-white text-sm mb-3">Principais Origens de Tráfego (GA4)</h3>
            <div className="space-y-3 text-xs">
              {[
                { source: 'instagram / cpc', users: 18450, conversions: 640, rev: 166400 },
                { source: 'google / cpc', users: 12200, conversions: 490, rev: 127400 },
                { source: 'direct / none', users: 8900, conversions: 210, rev: 54600 },
                { source: 'tiktok / video_link', users: 7400, conversions: 140, rev: 36400 },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-[#202124] border border-[#37393e]">
                  <div>
                    <div className="font-mono font-bold text-white">{item.source}</div>
                    <div className="text-[11px] text-slate-400">{formatNumber(item.users)} sessões</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-emerald-400">{formatCurrency(item.rev)}</div>
                    <div className="text-[11px] text-slate-400">{item.conversions} vendas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-sm mb-3">Dispositivos & Tecnologia</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-bold text-white">Dispositivos Móveis (Mobile)</div>
                      <div className="text-[11px] text-slate-400">iOS e Android</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white text-sm">84,2%</span>
                    <div className="text-[11px] text-slate-400">39.520 acessos</div>
                  </div>
                </div>

                <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="font-bold text-white">Computadores (Desktop)</div>
                      <div className="text-[11px] text-slate-400">Windows e macOS</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white text-sm">15,8%</span>
                    <div className="text-[11px] text-slate-400">7.420 acessos</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs">
              💡 91% das conversões em vendas ocorrem em menos de 4 minutos no celular via PIX.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'FUNNEL' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4">
          <h3 className="font-bold text-white text-sm">Funil de Conversão de E-commerce (GA4)</h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e]">
              <div className="text-slate-400 font-semibold mb-1">1. Visualização do Evento</div>
              <div className="text-xl font-extrabold text-white">46.940</div>
              <div className="text-[11px] text-slate-400 mt-1">100% dos visitantes</div>
            </div>
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e]">
              <div className="text-slate-400 font-semibold mb-1">2. Seleção de Ingressos</div>
              <div className="text-xl font-extrabold text-blue-400">12.450</div>
              <div className="text-[11px] text-blue-300 mt-1">26,5% do total</div>
            </div>
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e]">
              <div className="text-slate-400 font-semibold mb-1">3. Início de Checkout</div>
              <div className="text-xl font-extrabold text-amber-400">4.120</div>
              <div className="text-[11px] text-amber-300 mt-1">33,1% do anterior</div>
            </div>
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e]">
              <div className="text-slate-400 font-semibold mb-1">4. Compra Concluída</div>
              <div className="text-xl font-extrabold text-emerald-400">1.802</div>
              <div className="text-[11px] text-emerald-300 mt-1">43,7% do checkout</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EVENTS_LOG' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
          <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Últimos Eventos de Telemetria Recebidos</h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Ao Vivo
            </span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Horário</th>
                <th className="p-3.5 font-semibold">Nome do Evento GA4</th>
                <th className="p-3.5 font-semibold">User Pseudo ID</th>
                <th className="p-3.5 font-semibold">Página / Rota</th>
                <th className="p-3.5 font-semibold">Dispositivo</th>
                <th className="p-3.5 font-semibold">Origem / Mídia</th>
                <th className="p-3.5 font-semibold text-right">Valor Atribuído</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {mockGa4Events.map((ev) => (
                <tr key={ev.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5 font-mono text-slate-400">{ev.timestamp}</td>
                  <td className="p-3.5 font-mono font-bold text-amber-400">{ev.eventName}</td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{ev.userPseudoId}</td>
                  <td className="p-3.5 text-slate-300">{ev.pageLocation}</td>
                  <td className="p-3.5 uppercase font-mono text-slate-400 text-[10px]">{ev.deviceCategory}</td>
                  <td className="p-3.5 font-mono text-blue-400">{ev.sourceMedium}</td>
                  <td className="p-3.5 text-right font-extrabold text-emerald-400">
                    {ev.value ? formatCurrency(ev.value) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <h3 className="font-bold text-white text-sm">Configuração da Propriedade Google Analytics 4</h3>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">ID da Métrica (Measurement ID)</label>
            <input
              type="text"
              readOnly
              value="G-78X889021B"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Protocolo de Medição API Secret</label>
            <input
              type="password"
              readOnly
              value="••••••••••••••••••••••••"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
};
