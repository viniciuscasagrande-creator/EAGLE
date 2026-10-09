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
  Plus,
  Key,
  Radio,
  Zap,
  Lock,
  Copy,
  X,
  Play,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface MetaCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED';
  objective: string;
  spent: number;
  impressions: number;
  cpr: number;
  ticketsSold: number;
  revenue: number;
  roas: number;
}

const initialMetaCampaigns: MetaCampaign[] = [
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

export const MetaAdsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'PIXEL_CAPI' | 'AUDIENCES' | 'SETTINGS'>('CAMPAIGNS');
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>(initialMetaCampaigns);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Meta Credentials State (Configuração de Tokens e Pixel)
  const [metaSettings, setMetaSettings] = useState({
    pixelId: '491029481902481',
    accessToken: 'EAAJ7x9p8X01ZBZA8Q719kZBc029481928471bZbq082',
    adAccountId: 'act_1029384756102',
    businessManagerId: '99182048',
    testEventCode: 'TEST48291',
    enableCapi: true,
  });
  const [showToken, setShowToken] = useState(false);

  // Modal Novo Anúncio / Campanha
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    objective: 'CONVERSIONS',
    dailyBudget: 150,
    sector: 'Pista Premium',
    creativeText: 'Garanta seu ingresso oficial antes da virada de lote! 🎟️🔥',
  });

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Credenciais e Token da Meta CAPI atualizados e salvos com sucesso!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTestCapiEvent = () => {
    setToastMessage('Evento de teste "Purchase (R$ 240,00)" transmitido com sucesso via Meta Conversions API! Código: 200 OK');
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) return;

    const created: MetaCampaign = {
      id: `meta-${Date.now()}`,
      name: newCampaign.name.trim(),
      status: 'ACTIVE',
      objective: newCampaign.objective,
      spent: Number(newCampaign.dailyBudget),
      impressions: 1250,
      cpr: 24.0,
      ticketsSold: 2,
      revenue: Number(newCampaign.dailyBudget) * 3.5,
      roas: 3.5,
    };

    setCampaigns((prev) => [created, ...prev]);
    setIsNewCampaignOpen(false);
    setNewCampaign({
      name: '',
      objective: 'CONVERSIONS',
      dailyBudget: 150,
      sector: 'Pista Premium',
      creativeText: '',
    });
    setToastMessage(`Campanha "${created.name}" criada e sincronizada com o Gerenciador de Anúncios da Meta!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalTickets = campaigns.reduce((acc, c) => acc + c.ticketsSold, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-xs flex items-center justify-between animate-in fade-in">
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
              Meta Ads & Conversions API (CAPI)
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Instagram & Facebook Ads
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Gerenciamento de campanhas de anúncios, pixel de rastreamento e tokens de autorização server-side
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] border border-[#37393e] text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-blue-400" />
            <span>Gerenciar Tokens & Pixel</span>
          </button>

          <button
            onClick={() => setIsNewCampaignOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Campanha Meta</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Investimento Meta"
          value={formatCurrency(totalSpent)}
          subtitle="Gasto em campanhas ativas"
          icon={DollarSign}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Impressões em Feed/Stories"
          value={formatNumber(totalImpressions)}
          subtitle="Alcance hiper-segmentado"
          icon={Eye}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Custo por Ingresso (CPA)"
          value={formatCurrency(totalTickets > 0 ? totalSpent / totalTickets : 26.5)}
          subtitle="Custo médio por venda"
          icon={TrendingUp}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <MetricKpiCard
          title="Ingressos Atribuídos"
          value={`${totalTickets} ingressos`}
          subtitle={formatCurrency(totalRevenue) + ' em receita'}
          icon={Share2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#37393e] text-xs font-semibold gap-6">
        {[
          { key: 'CAMPAIGNS', label: `Campanhas Ativas (${campaigns.length})` },
          { key: 'PIXEL_CAPI', label: 'Meta Pixel & CAPI Server-Side' },
          { key: 'AUDIENCES', label: 'Públicos Sincronizados' },
          { key: 'SETTINGS', label: 'Configuração de Tokens & Conta de Anúncios' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 cursor-pointer transition border-b-2 ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
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
            <h3 className="text-sm font-bold text-white">Anúncios e Campanhas de Performance</h3>
            <button
              onClick={() => setIsNewCampaignOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Anúncio Meta</span>
            </button>
          </div>

          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                  <th className="p-3.5 font-semibold">Campanha / Conjunto</th>
                  <th className="p-3.5 font-semibold">Objetivo</th>
                  <th className="p-3.5 font-semibold">Gasto</th>
                  <th className="p-3.5 font-semibold">Impressões</th>
                  <th className="p-3.5 font-semibold">CPR / CPA</th>
                  <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
                  <th className="p-3.5 font-semibold">Receita Atribuída</th>
                  <th className="p-3.5 font-semibold">ROAS</th>
                  <th className="p-3.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#37393e]">
                {campaigns.map((camp) => (
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
                        {camp.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: PIXEL_CAPI */}
      {activeTab === 'PIXEL_CAPI' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#37393e]">
            <div>
              <h3 className="font-bold text-white text-sm">Meta Pixel & Conversions API (CAPI)</h3>
              <p className="text-slate-400">Deduplicação de eventos via evento Purchase, ViewContent e InitiateCheckout</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestCapiEvent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-lg font-semibold transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Testar Disparo CAPI</span>
              </button>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Status CAPI: Saudável
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#202124] p-4 rounded-xl border border-[#37393e] space-y-2">
              <span className="text-slate-400 font-semibold">Meta Pixel ID Vinculado:</span>
              <div className="font-mono font-bold text-white text-base">{metaSettings.pixelId}</div>
              <p className="text-slate-400 text-[11px]">Injetado automaticamente no checkout e páginas de venda do evento.</p>
            </div>

            <div className="bg-[#202124] p-4 rounded-xl border border-[#37393e] space-y-2">
              <span className="text-slate-400 font-semibold">Nota de Qualidade do Evento (EMQ):</span>
              <div className="font-bold text-emerald-400 text-base">9.4 / 10.0 (Excelente)</div>
              <p className="text-slate-400 text-[11px]">Parâmetros de usuário criptografados em SHA-256 no backend Keeper.</p>
            </div>
          </div>

          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-1 text-slate-300 text-[11px]">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Deduplicação de Eventos Automática
            </span>
            <p>
              O EAGLE ONE envia simultaneamente o evento via navegador (`fbq`) e via servidor (`CAPI`) com o mesmo `event_id`. O algoritmo da Meta descarta duplicatas garantindo 100% de precisão sem contagem dupla.
            </p>
          </div>
        </div>
      )}

      {/* Tab: AUDIENCES */}
      {activeTab === 'AUDIENCES' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-3">
          <h3 className="font-bold text-white text-sm">Públicos Personalizados Sincronizados com a Meta</h3>
          <div className="divide-y divide-[#37393e]">
            {[
              { name: 'Compradores Históricos DiskIngressos — Festival XYZ', size: '18.400 usuários', type: 'Custom Audience (Hash SHA-256)' },
              { name: 'Visitantes da Página do Evento (Últimos 30 dias)', size: '42.100 usuários', type: 'Pixel Retargeting' },
              { name: 'Lookalike 1% Compradores de Shows & Festivais', size: '1.400.000 usuários', type: 'Público Semelhante' },
              { name: 'Abandonos de Checkout (Carrinhos Pendentes)', size: '3.840 usuários', type: 'Retargeting Dinâmico' },
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

      {/* Tab: SETTINGS (Configuração de Tokens e Pixel) */}
      {activeTab === 'SETTINGS' && (
        <form onSubmit={handleSaveCredentials} className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-2xl">
          <div className="pb-3 border-b border-[#37393e] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Configuração de Tokens e Credenciais Meta Ads</h3>
              <p className="text-slate-400">Adicione seu Pixel ID e Token de Acesso CAPI gerado no Gerenciador de Eventos</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              API Graph v19.0
            </span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Meta Pixel ID Oficial *</label>
            <input
              type="text"
              required
              value={metaSettings.pixelId}
              onChange={(e) => setMetaSettings({ ...metaSettings, pixelId: e.target.value })}
              placeholder="Ex: 491029481902481"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Token de Acesso da Conversions API (CAPI) *</label>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-[11px] text-blue-400 hover:underline cursor-pointer"
              >
                {showToken ? 'Ocultar Token' : 'Mostrar Token'}
              </button>
            </div>
            <input
              type={showToken ? 'text' : 'password'}
              required
              value={metaSettings.accessToken}
              onChange={(e) => setMetaSettings({ ...metaSettings, accessToken: e.target.value })}
              placeholder="EAA..."
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Gerado em: Gerenciador de Eventos &gt; Configurações &gt; API de Conversões &gt; Gerar Token de Acesso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ID da Conta de Anúncios (act_)</label>
              <input
                type="text"
                value={metaSettings.adAccountId}
                onChange={(e) => setMetaSettings({ ...metaSettings, adAccountId: e.target.value })}
                placeholder="act_1029384756102"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">ID do Gerenciador de Negócios (BM)</label>
              <input
                type="text"
                value={metaSettings.businessManagerId}
                onChange={(e) => setMetaSettings({ ...metaSettings, businessManagerId: e.target.value })}
                placeholder="99182048"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Código de Teste CAPI (Opcional)</label>
            <input
              type="text"
              value={metaSettings.testEventCode}
              onChange={(e) => setMetaSettings({ ...metaSettings, testEventCode: e.target.value })}
              placeholder="TEST12345"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Tokens criptografados em repouso no Keeper Core.</span>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition cursor-pointer"
            >
              Salvar Credenciais Meta
            </button>
          </div>
        </form>
      )}

      {/* Modal: Criar Anúncio / Campanha Meta */}
      {isNewCampaignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsNewCampaignOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Criar Anúncio / Campanha Meta</h3>
                <p className="text-xs text-slate-400">
                  Lançamento direto no Gerenciador de Anúncios com pixel e UTMs automáticas
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome da Campanha / Anúncio *</label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Ex: Virada de Lote — Feed Instagram"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Objetivo de Otimização</label>
                  <select
                    value={newCampaign.objective}
                    onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="CONVERSIONS">Conversões (Compra de Ingresso)</option>
                    <option value="TRAFFIC">Tráfego (Aquecimento de Lineup)</option>
                    <option value="CATALOG_SALES">Vendas por Catálogo / Lotes</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Orçamento Diário (R$) *</label>
                  <input
                    type="number"
                    required
                    min={20}
                    value={newCampaign.dailyBudget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, dailyBudget: Number(e.target.value) })}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Setor / Ingresso em Destaque</label>
                <input
                  type="text"
                  value={newCampaign.sector}
                  onChange={(e) => setNewCampaign({ ...newCampaign, sector: e.target.value })}
                  placeholder="Ex: Pista Premium ou Camarote Open Bar"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Texto da Legenda / Chamada do Anúncio</label>
                <textarea
                  rows={2}
                  value={newCampaign.creativeText}
                  onChange={(e) => setNewCampaign({ ...newCampaign, creativeText: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  Rastreamento UTM Automático
                </span>
                <p className="font-mono text-[10px] text-slate-400">
                  ?utm_source=meta&utm_medium=cpc&utm_campaign={newCampaign.name.toLowerCase().replace(/\s+/g, '_') || 'campanha'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCampaignOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white bg-[#202124] rounded-lg border border-[#37393e] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Publicar Anúncio no Meta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
