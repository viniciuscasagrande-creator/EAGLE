import React, { useState } from 'react';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Share2,
  DollarSign,
  TrendingUp,
  Eye,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
  Settings,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const MetaAdsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'PIXEL_CAPI' | 'AUDIENCES' | 'SETTINGS'>('CAMPAIGNS');

  const metaCampaigns = [
    {
      id: 'meta-01',
      name: 'Festival XYZ — Meta Conversão Lote 2',
      status: 'ACTIVE',
      objective: 'CONVERSIONS',
      spent: 4500.0,
      impressions: 148200,
      cpr: 28.5,
      ticketsSold: 158,
      revenue: 41080.0,
      roas: 9.1,
    },
    {
      id: 'meta-02',
      name: 'Retargeting Instagram Stories — Ingressos',
      status: 'ACTIVE',
      objective: 'CATALOG_SALES',
      spent: 1850.0,
      impressions: 42300,
      cpr: 19.8,
      ticketsSold: 93,
      revenue: 24180.0,
      roas: 13.0,
    },
    {
      id: 'meta-03',
      name: 'Show Nacional ABC — Aquecimento de Lineup',
      status: 'ACTIVE',
      objective: 'TRAFFIC',
      spent: 1200.0,
      impressions: 68900,
      cpr: 35.2,
      ticketsSold: 34,
      revenue: 5270.0,
      roas: 4.4,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Meta Ads & Conversions API (CAPI)
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Instagram & Facebook
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Métricas de mídia paga, atribuição de ingressos por pixel e integração server-side CAPI da Meta
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Server className="w-3.5 h-3.5" />
            <span>CAPI Gateway Ativo (100% deduplicado)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Investimento Meta"
          value={formatCurrency(7550)}
          subtitle="Gasto nos últimos 30 dias"
          icon={DollarSign}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Impressões em Feed/Stories"
          value={formatNumber(259400)}
          subtitle="Alcance hiper-segmentado"
          icon={Eye}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Custo por Ingressos (CPA)"
          value="R$ 26,49"
          subtitle="Custo médio por venda"
          icon={TrendingUp}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <MetricKpiCard
          title="Ingressos Atribuídos"
          value="285 ingressos"
          subtitle={formatCurrency(70530) + ' em receita'}
          icon={Share2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'CAMPAIGNS', label: 'Campanhas Vinculadas' },
          { id: 'PIXEL_CAPI', label: 'Pixel & CAPI Server-Side' },
          { id: 'AUDIENCES', label: 'Públicos Personalizados' },
          { id: 'SETTINGS', label: 'Configurações de Conta' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold rounded-t-lg transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2c2d33] text-blue-400 border-t-2 border-blue-500'
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
                <th className="p-3.5 font-semibold">Nome da Campanha Meta</th>
                <th className="p-3.5 font-semibold">Objetivo</th>
                <th className="p-3.5 font-semibold">Investido</th>
                <th className="p-3.5 font-semibold">Impressões</th>
                <th className="p-3.5 font-semibold">CPR / CPA</th>
                <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
                <th className="p-3.5 font-semibold">Receita Atribuída</th>
                <th className="p-3.5 font-semibold">ROAS</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {metaCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5 font-bold text-white">{camp.name}</td>
                  <td className="p-3.5 text-slate-300 font-mono text-[11px]">{camp.objective}</td>
                  <td className="p-3.5 font-semibold text-white">{formatCurrency(camp.spent)}</td>
                  <td className="p-3.5 text-slate-300">{formatNumber(camp.impressions)}</td>
                  <td className="p-3.5 font-mono text-amber-400">{formatCurrency(camp.cpr)}</td>
                  <td className="p-3.5 font-bold text-white">{camp.ticketsSold}</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(camp.revenue)}</td>
                  <td className="p-3.5 font-bold text-blue-400 font-mono">{camp.roas}x</td>
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
      )}

      {activeTab === 'PIXEL_CAPI' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#37393e]">
            <div>
              <h3 className="font-bold text-white text-sm">Meta Pixel & Conversions API (CAPI)</h3>
              <p className="text-slate-400">Deduplicação de eventos via evento Purchase e ViewContent</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Status CAPI: Saudável
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e] space-y-2">
              <span className="text-slate-400 font-semibold">Meta Pixel ID Oficial:</span>
              <div className="font-mono font-bold text-white text-sm">491029481902481</div>
              <p className="text-slate-400 text-[11px]">Injetado automaticamente no checkout de todos os eventos da produtora.</p>
            </div>

            <div className="bg-[#202124] p-4 rounded-lg border border-[#37393e] space-y-2">
              <span className="text-slate-400 font-semibold">Nota de Qualidade do Evento (EMQ):</span>
              <div className="font-bold text-emerald-400 text-sm">9.4 / 10.0 (Excelente)</div>
              <p className="text-slate-400 text-[11px]">Parâmetros de usuário criptografados em SHA-256 no backend.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AUDIENCES' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-3">
          <h3 className="font-bold text-white text-sm">Públicos Personalizados Sincronizados</h3>
          <div className="divide-y divide-[#37393e]">
            {[
              { name: 'Compradores Históricos DiskIngressos — Festival XYZ', size: '18.400 usuários', type: 'Custom Audience (Hash SHA-256)' },
              { name: 'Visitantes da Página do Evento (30 dias)', size: '42.100 usuários', type: 'Pixel Retargeting' },
              { name: 'Lookalike 1% Compradores de Shows', size: '1.400.000 usuários', type: 'Público Semelhante' },
            ].map((aud, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{aud.name}</div>
                  <div className="text-[11px] text-slate-400">{aud.type}</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold">{aud.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <h3 className="font-bold text-white text-sm">Conta de Anúncios Vinculada</h3>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">ID da Conta de Anúncios (act_)</label>
            <input
              type="text"
              readOnly
              value="act_1029384756102"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Gerenciador de Negócios (Business Manager)</label>
            <input
              type="text"
              readOnly
              value="ABC Produções BM (ID: 99182048)"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
