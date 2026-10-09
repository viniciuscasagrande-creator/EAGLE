import React, { useState } from 'react';
import { mockUtmLinks, mockEvents } from '@/services/api/mockSeedData';
import { UtmLinkItem } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Link2,
  MousePointer,
  CheckCircle2,
  DollarSign,
  Copy,
  Check,
  TrendingUp,
  Clock,
  Camera,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const CentralUtmConversoesPage: React.FC = () => {
  const [links, setLinks] = useState<UtmLinkItem[]>(mockUtmLinks);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // UTM Generator State
  const [eventId, setEventId] = useState(mockEvents[0]?.id || '');
  const [source, setSource] = useState('instagram');
  const [medium, setMedium] = useState('stories');
  const [campaign, setCampaign] = useState('virada_lote');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const evt = mockEvents.find((e) => e.id === eventId) || mockEvents[0];
    const cleanUrl = `https://diskingressos.com.br/evento/${evt.code.toLowerCase()}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
    setGeneratedLink(cleanUrl);

    const newUtm: UtmLinkItem = {
      id: `utm-${Date.now()}`,
      eventId: evt.id,
      eventName: evt.name,
      title: `${source} — ${campaign}`,
      url: cleanUrl,
      utmSource: source,
      utmMedium: medium,
      utmCampaign: campaign,
      clicks: 0,
      visitors: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      createdAt: 'Hoje',
    };
    setLinks([newUtm, ...links]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalClicks = links.reduce((a, b) => a + b.clicks, 0);
  const totalConversions = links.reduce((a, b) => a + b.conversions, 0);
  const totalRevenue = links.reduce((a, b) => a + b.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Central UTM & Rastreamento de Conversões
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Rastreamento Granular de Vendas
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Criação de links parametrizados, funil por criativo e atribuição de receita direta no motor financeiro
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Links UTM Ativos"
          value={`${links.length} rastreados`}
          subtitle="Campanhas e bio social"
          icon={Link2}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Cliques Totais Registrados"
          value={formatNumber(totalClicks)}
          subtitle="Tráfego qualificado"
          icon={MousePointer}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Conversões em Vendas"
          value={`${formatNumber(totalConversions)} ingressos`}
          subtitle="Taxa média 4,72%"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Receita Atribuída a UTMs"
          value={formatCurrency(totalRevenue)}
          subtitle="Vendas comprovadas por link"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* UTM Generator Form */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md">
        <h3 className="font-extrabold text-white text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Gerador Inteligente de Link UTM DiskIngressos
        </h3>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Evento *</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            >
              {mockEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Origem (utm_source) *</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            >
              <option value="instagram">Instagram</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="influencer">Influenciador / Parceiro</option>
              <option value="email">E-mail Marketing</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Mídia (utm_medium) *</label>
            <input
              type="text"
              required
              placeholder="Ex: stories_paid, bio, cpc"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Campanha (utm_campaign) *</label>
            <input
              type="text"
              required
              placeholder="Ex: lancamento_lote1"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="md:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-lg shadow transition cursor-pointer"
            >
              Gerar & Salvar Link Parametrizado
            </button>
          </div>
        </form>

        {generatedLink && (
          <div className="mt-4 p-3 bg-[#202124] rounded-lg border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <span className="font-mono text-amber-300 truncate">{generatedLink}</span>
            <button
              onClick={() => handleCopy('new', generatedLink)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded flex items-center gap-1.5 transition flex-shrink-0"
            >
              {copiedId === 'new' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'new' ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Platform Drilldown Section (Instagram detail view as in video 01:51-02:05) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
            <Camera className="w-4 h-4" />
            <span>Desempenho da Origem: Instagram</span>
          </div>
          <p className="text-xs text-slate-400">
            Bio, Reels orgânicos e anúncios Stories pagos
          </p>
          <div className="pt-2 border-t border-[#37393e] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Cliques no Instagram:</span>
              <span className="font-bold text-white">22.670 cliques</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Conversões Confirmadas:</span>
              <span className="font-bold text-emerald-400">1.020 ingressos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Receita Total Instagram:</span>
              <span className="font-extrabold text-white">{formatCurrency(265200)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md space-y-2">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Distribuição de Vendas por Horário</span>
          </div>
          <div className="text-xs text-slate-400">Pico máximo registrado entre 18:00 e 22:00 (62% das compras).</div>
          <div className="pt-2 border-t border-[#37393e] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
              <div className="text-slate-400 text-[10px]">Manhã</div>
              <div className="font-bold text-white">14%</div>
            </div>
            <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
              <div className="text-slate-400 text-[10px]">Tarde</div>
              <div className="font-bold text-white">24%</div>
            </div>
            <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
              <div className="text-slate-400 text-[10px]">Noite</div>
              <div className="font-bold text-emerald-400">62% 🔥</div>
            </div>
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="font-bold text-white text-sm flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Oportunidades de Otimização</span>
            </div>
            <p className="text-xs text-slate-400">
              O link "Instagram Stories Feed" apresenta custo por clique 38% menor que o tráfego do Google Ads para este evento.
            </p>
          </div>
          <div className="text-[11px] text-amber-300 font-semibold bg-amber-500/10 p-2.5 rounded border border-amber-500/20">
            Recomendação: Aumentar orçamento de Stories Lote 2 em +20%.
          </div>
        </div>
      </div>

      {/* UTM Links Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Links Parametrizados Ativos</h3>
          <span className="text-xs text-slate-400">{links.length} URLs cadastradas</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Identificação do Link</th>
              <th className="p-3.5 font-semibold">Parâmetros UTM</th>
              <th className="p-3.5 font-semibold">Cliques</th>
              <th className="p-3.5 font-semibold">Visitantes</th>
              <th className="p-3.5 font-semibold">Conversões</th>
              <th className="p-3.5 font-semibold">Taxa</th>
              <th className="p-3.5 font-semibold">Receita Gerada</th>
              <th className="p-3.5 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5">
                  <div className="font-bold text-white">{link.title}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">{link.url}</div>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-amber-400 border border-[#37393e]">
                    {link.utmSource} / {link.utmMedium}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-slate-200">{formatNumber(link.clicks)}</td>
                <td className="p-3.5 font-mono text-slate-300">{formatNumber(link.visitors)}</td>
                <td className="p-3.5 font-bold text-white">{link.conversions}</td>
                <td className="p-3.5 font-bold text-emerald-400">{link.conversionRate}%</td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(link.revenue)}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleCopy(link.id, link.url)}
                    className="p-1.5 rounded-lg bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-300 hover:text-white transition cursor-pointer"
                    title="Copiar Link"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
