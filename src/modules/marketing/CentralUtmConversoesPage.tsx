import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
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
  Filter,
  Sparkles,
  Plus,
  Search,
  Download,
  ExternalLink,
  QrCode,
  Share2,
  Zap,
  BarChart3,
  Activity,
  Trash2,
  Megaphone,
  Globe,
  Camera,
  Radio,
  MessageSquare,
  Mail,
  Users,
  Target,
  Layers,
  FileText,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
  Eye,
  ShoppingCart,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface UtmPreset {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'tiktok' | 'spotify' | 'whatsapp' | 'email' | 'influencer' | 'organic';
  icon: React.ElementType;
  color: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  coupon?: string;
}

const UTM_PRESETS: UtmPreset[] = [
  {
    id: 'meta_stories',
    name: 'Meta Stories Patrocinado',
    platform: 'meta',
    icon: Camera,
    color: '#e1306c',
    source: 'meta_ads',
    medium: 'stories_paid',
    campaign: 'virada_lote2',
    content: 'video_urgencia_15s',
  },
  {
    id: 'meta_feed',
    name: 'Meta Feed / Carrossel',
    platform: 'meta',
    icon: Camera,
    color: '#1877f2',
    source: 'meta_ads',
    medium: 'feed_carrossel',
    campaign: 'lineup_atracoes',
    content: 'carrossel_artistas',
  },
  {
    id: 'google_search',
    name: 'Google Ads Pesquisa Fundo Funil',
    platform: 'google',
    icon: Search,
    color: '#4285f4',
    source: 'google_ads',
    medium: 'cpc',
    campaign: 'pesquisa_marca',
    term: 'ingressos festival xyz oficial',
  },
  {
    id: 'tiktok_spark',
    name: 'TikTok Spark Ads Viral',
    platform: 'tiktok',
    icon: Zap,
    color: '#00f2fe',
    source: 'tiktok_ads',
    medium: 'spark_ad',
    campaign: 'viral_revelacao',
    content: 'creator_duet',
  },
  {
    id: 'spotify_audio',
    name: 'Spotify Audio Spot 30s',
    platform: 'spotify',
    icon: Radio,
    color: '#1db954',
    source: 'spotify_ads',
    medium: 'audio_spot',
    campaign: 'playlist_brasil',
    content: 'spot_30s_locutor',
  },
  {
    id: 'whatsapp_vip',
    name: 'WhatsApp Disparo Base VIP',
    platform: 'whatsapp',
    icon: MessageSquare,
    color: '#25d366',
    source: 'whatsapp',
    medium: 'broadcast_vip',
    campaign: 'pre_venda_lote_promocional',
  },
  {
    id: 'email_carrinho',
    name: 'E-mail Resgate de Carrinho 1h',
    platform: 'email',
    icon: Mail,
    color: '#ea4335',
    source: 'email',
    medium: 'automation',
    campaign: 'recuperacao_carrinho',
    coupon: 'VOLTE10',
  },
  {
    id: 'influencer_cupom',
    name: 'Influenciador com Cupom',
    platform: 'influencer',
    icon: Users,
    color: '#f59e0b',
    source: 'influencer',
    medium: 'stories_parceiro',
    campaign: 'parceria_creator',
    coupon: 'CREATOR10',
  },
  {
    id: 'bio_organic',
    name: 'Link Oficial Bio Instagram',
    platform: 'organic',
    icon: Globe,
    color: '#a855f7',
    source: 'instagram',
    medium: 'bio',
    campaign: 'bio_principal',
  },
];

const PLATFORM_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  meta: {
    label: 'Meta Ads',
    color: '#38bdf8',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    icon: Camera,
  },
  google: {
    label: 'Google Ads',
    color: '#60a5fa',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: Search,
  },
  tiktok: {
    label: 'TikTok Ads',
    color: '#22d3ee',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: Zap,
  },
  spotify: {
    label: 'Spotify Ads',
    color: '#4ade80',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: Radio,
  },
  whatsapp: {
    label: 'WhatsApp',
    color: '#34d399',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: MessageSquare,
  },
  email: {
    label: 'E-mail Marketing',
    color: '#f87171',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: Mail,
  },
  influencer: {
    label: 'Influenciadores',
    color: '#fbbf24',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: Users,
  },
  organic: {
    label: 'Orgânico & Bio',
    color: '#c084fc',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: Globe,
  },
};

export const CentralUtmConversoesPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { selectedEvent } = useEventContext();
  const activeEventId = id || selectedEvent?.id;

  // Local storage links persistence
  const [links, setLinks] = useState<UtmLinkItem[]>(() => {
    try {
      const saved = localStorage.getItem('eagle_utm_links_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return mockUtmLinks;
  });

  useEffect(() => {
    try {
      localStorage.setItem('eagle_utm_links_v2', JSON.stringify(links));
    } catch (err) {
      console.warn('Failed to persist UTM links', err);
    }
  }, [links]);

  // Filters
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>(activeEventId || 'ALL');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChartTab, setActiveChartTab] = useState<'timeline' | 'roas_bars' | 'pie_share' | 'funnel'>('timeline');

  // Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [formEventId, setFormEventId] = useState(activeEventId || mockEvents[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formPlatform, setFormPlatform] = useState<UtmLinkItem['adPlatform']>('meta');
  const [formSource, setFormSource] = useState('meta_ads');
  const [formMedium, setFormMedium] = useState('stories_paid');
  const [formCampaign, setFormCampaign] = useState('virada_lote2');
  const [formContent, setFormContent] = useState('');
  const [formTerm, setFormTerm] = useState('');
  const [formCoupon, setFormCoupon] = useState('');
  const [formAdSpend, setFormAdSpend] = useState<string>('5000');

  // Live URL and Modals
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalLink, setQrModalLink] = useState<UtmLinkItem | null>(null);
  const [testPingModalLink, setTestPingModalLink] = useState<UtmLinkItem | null>(null);
  const [pingStatus, setPingStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const [pingLog, setPingLog] = useState<any>(null);

  // Synchronize active event
  useEffect(() => {
    if (activeEventId) {
      setSelectedEventFilter(activeEventId);
      setFormEventId(activeEventId);
    }
  }, [activeEventId]);

  // Compute live URL preview
  const liveUrlPreview = useMemo(() => {
    const evt = mockEvents.find((e) => e.id === formEventId) || mockEvents[0];
    const baseDomain = 'https://diskingressos.com.br/evento';
    const slug = evt?.code ? evt.code.toLowerCase() : 'evento-oficial';

    const params = new URLSearchParams();
    if (formSource) params.set('utm_source', formSource.trim());
    if (formMedium) params.set('utm_medium', formMedium.trim());
    if (formCampaign) params.set('utm_campaign', formCampaign.trim());
    if (formContent) params.set('utm_content', formContent.trim());
    if (formTerm) params.set('utm_term', formTerm.trim());
    if (formCoupon) params.set('coupon', formCoupon.trim().toUpperCase());

    return `${baseDomain}/${slug}?${params.toString()}`;
  }, [formEventId, formSource, formMedium, formCampaign, formContent, formTerm, formCoupon]);

  const liveShortUrlPreview = useMemo(() => {
    const slug = (formCampaign || 'campanha').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 12);
    return `https://disk.link/${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [formCampaign]);

  // Apply preset
  const handleApplyPreset = (preset: UtmPreset) => {
    setFormPlatform(preset.platform);
    setFormSource(preset.source);
    setFormMedium(preset.medium);
    setFormCampaign(preset.campaign);
    setFormContent(preset.content || '');
    setFormTerm(preset.term || '');
    setFormCoupon(preset.coupon || '');
    setFormTitle(preset.name);
    if (!isGeneratorOpen) setIsGeneratorOpen(true);
  };

  // Submit new UTM Link
  const handleCreateUtm = (e: React.FormEvent) => {
    e.preventDefault();
    const evt = mockEvents.find((e) => e.id === formEventId) || mockEvents[0];
    const spendNum = parseFloat(formAdSpend) || 0;

    const newUtm: UtmLinkItem = {
      id: `utm-${Date.now()}`,
      eventId: evt.id,
      eventName: evt.name,
      title: formTitle.trim() || `${formPlatform?.toUpperCase()} — ${formCampaign}`,
      url: liveUrlPreview,
      shortUrl: liveShortUrlPreview,
      utmSource: formSource,
      utmMedium: formMedium,
      utmCampaign: formCampaign,
      utmContent: formContent || undefined,
      utmTerm: formTerm || undefined,
      coupon: formCoupon ? formCoupon.toUpperCase() : undefined,
      adPlatform: formPlatform,
      adSpend: spendNum,
      roas: spendNum > 0 ? 0 : undefined,
      clicks: 0,
      visitors: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    setLinks([newUtm, ...links]);
    setFormTitle('');
    setFormContent('');
    setFormTerm('');
    setFormCoupon('');
    setIsGeneratorOpen(false);
  };

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Delete UTM
  const handleDeleteLink = (id: string) => {
    if (confirm('Tem certeza que deseja remover este link de rastreamento?')) {
      setLinks(links.filter((l) => l.id !== id));
    }
  };

  // Filtered links
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // Event filter
      if (selectedEventFilter !== 'ALL' && link.eventId !== selectedEventFilter) {
        return false;
      }
      // Platform filter
      if (selectedPlatformFilter !== 'ALL') {
        const linkPlatform = link.adPlatform || (link.utmSource.includes('insta') ? 'meta' : 'organic');
        if (linkPlatform !== selectedPlatformFilter) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = link.title.toLowerCase().includes(q);
        const matchUrl = link.url.toLowerCase().includes(q);
        const matchSource = link.utmSource.toLowerCase().includes(q);
        const matchCamp = link.utmCampaign.toLowerCase().includes(q);
        const matchEvent = link.eventName.toLowerCase().includes(q);
        const matchCoupon = link.coupon?.toLowerCase().includes(q);
        if (!matchTitle && !matchUrl && !matchSource && !matchCamp && !matchEvent && !matchCoupon) {
          return false;
        }
      }
      return true;
    });
  }, [links, selectedEventFilter, selectedPlatformFilter, searchQuery]);

  // Aggregate KPI metrics
  const totals = useMemo(() => {
    const clicks = filteredLinks.reduce((a, b) => a + b.clicks, 0);
    const visitors = filteredLinks.reduce((a, b) => a + b.visitors, 0);
    const conversions = filteredLinks.reduce((a, b) => a + b.conversions, 0);
    const revenue = filteredLinks.reduce((a, b) => a + b.revenue, 0);
    const adSpend = filteredLinks.reduce((a, b) => a + (b.adSpend || 0), 0);
    const avgCr = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const roas = adSpend > 0 ? revenue / adSpend : 0;

    return { clicks, visitors, conversions, revenue, adSpend, avgCr, roas, count: filteredLinks.length };
  }, [filteredLinks]);

  // Platform aggregation
  const platformStats = useMemo(() => {
    const map: Record<
      string,
      { platform: string; label: string; clicks: number; conversions: number; revenue: number; adSpend: number }
    > = {
      meta: { platform: 'meta', label: 'Meta Ads', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
      google: { platform: 'google', label: 'Google Ads', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
      tiktok: { platform: 'tiktok', label: 'TikTok Ads', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
      spotify: { platform: 'spotify', label: 'Spotify Ads', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
      whatsapp: { platform: 'whatsapp', label: 'WhatsApp', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
      email: { platform: 'email', label: 'E-mail', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
      influencer: { platform: 'influencer', label: 'Influenciadores', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
      organic: { platform: 'organic', label: 'Orgânico & Bio', clicks: 0, conversions: 0, revenue: 0, adSpend: 0 },
    };

    filteredLinks.forEach((link) => {
      let p = link.adPlatform || 'organic';
      if (link.utmSource.includes('instagram') || link.utmSource.includes('meta')) p = 'meta';
      if (!map[p]) p = 'organic';
      map[p].clicks += link.clicks;
      map[p].conversions += link.conversions;
      map[p].revenue += link.revenue;
      map[p].adSpend += link.adSpend || 0;
    });

    return Object.values(map);
  }, [filteredLinks]);

  // Chart data: 14 days temporal evolution
  const timelineChartData = useMemo(() => {
    const days = [
      { date: '01/10', label: '01 Out', clicks: 2450, checkout: 680, sales: 85, revenue: 22100 },
      { date: '02/10', label: '02 Out', clicks: 3100, checkout: 890, sales: 120, revenue: 31200 },
      { date: '03/10', label: '03 Out', clicks: 2890, checkout: 790, sales: 110, revenue: 28600 },
      { date: '04/10', label: '04 Out', clicks: 4200, checkout: 1150, sales: 165, revenue: 42900 },
      { date: '05/10', label: '05 Out', clicks: 5800, checkout: 1680, sales: 245, revenue: 63700 },
      { date: '06/10', label: '06 Out', clicks: 6400, checkout: 1820, sales: 290, revenue: 75400 },
      { date: '07/10', label: '07 Out', clicks: 7100, checkout: 2050, sales: 340, revenue: 88400 },
      { date: '08/10', label: '08 Out', clicks: 5900, checkout: 1720, sales: 280, revenue: 72800 },
      { date: '09/10', label: '09 Out', clicks: 6800, checkout: 1980, sales: 330, revenue: 85800 },
      { date: '10/10', label: '10 Out', clicks: 8200, checkout: 2390, sales: 410, revenue: 106600 },
      { date: '11/10', label: '11 Out', clicks: 9400, checkout: 2750, sales: 480, revenue: 124800 },
      { date: '12/10', label: '12 Out', clicks: 8900, checkout: 2600, sales: 440, revenue: 114400 },
      { date: '13/10', label: '13 Out', clicks: 10500, checkout: 3100, sales: 530, revenue: 137800 },
      { date: '14/10', label: 'Hoje', clicks: 11800, checkout: 3450, sales: 590, revenue: 153400 },
    ];
    return days;
  }, []);

  // Pie chart data for traffic / revenue share
  const pieChartData = useMemo(() => {
    return platformStats
      .filter((p) => p.revenue > 0)
      .map((p) => ({
        name: p.label,
        value: p.revenue,
        color: PLATFORM_CONFIG[p.platform]?.color || '#94a3b8',
        clicks: p.clicks,
        conversions: p.conversions,
      }));
  }, [platformStats]);

  // Export CSV Handler
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Evento',
      'Título',
      'Plataforma',
      'Origem (utm_source)',
      'Mídia (utm_medium)',
      'Campanha (utm_campaign)',
      'Conteúdo (utm_content)',
      'Termo (utm_term)',
      'Cupom',
      'URL Completa',
      'Link Curto',
      'Cliques',
      'Visitantes',
      'Vendas',
      'Taxa Conversão (%)',
      'Receita (R$)',
      'Investimento (R$)',
      'ROAS',
      'Data Criação',
    ];

    const rows = filteredLinks.map((l) => [
      l.id,
      `"${l.eventName.replace(/"/g, '""')}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      l.adPlatform || 'N/A',
      l.utmSource,
      l.utmMedium,
      l.utmCampaign,
      l.utmContent || '',
      l.utmTerm || '',
      l.coupon || '',
      `"${l.url}"`,
      l.shortUrl || '',
      l.clicks,
      l.visitors,
      l.conversions,
      l.conversionRate,
      l.revenue.toFixed(2),
      (l.adSpend || 0).toFixed(2),
      (l.roas || 0).toFixed(2),
      l.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `disk_utm_relatorio_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Test Ping Execution
  const handleExecutePing = () => {
    if (!testPingModalLink) return;
    setPingStatus('SENDING');
    setTimeout(() => {
      setPingStatus('SUCCESS');
      setPingLog({
        endpoint: 'https://telemetry.diskingressos.com.br/v1/pixel/collect',
        status: 200,
        latencyMs: 38,
        timestamp: new Date().toISOString(),
        payload: {
          event: 'PageView_Checkout_Ping',
          utm_source: testPingModalLink.utmSource,
          utm_medium: testPingModalLink.utmMedium,
          utm_campaign: testPingModalLink.utmCampaign,
          utm_content: testPingModalLink.utmContent || null,
          platform: testPingModalLink.adPlatform,
          eventId: testPingModalLink.eventId,
          clientIp: '189.102.45.12',
          userAgent: 'DiskIngressos Webhook Tester 2.0',
        },
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Central UTM & Rastreamento Multicanal de Conversões
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Atribuição Direta de Vendas
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Painel unificado com telemetria de anúncios (Meta Ads, Google, TikTok, Spotify, WhatsApp, E-mail e Afiliados)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-[#202124] hover:bg-[#2c2d33] border border-[#37393e] text-slate-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsGeneratorOpen(!isGeneratorOpen)}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>{isGeneratorOpen ? 'Ocultar Construtor' : 'Criar Novo Link UTM'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricKpiCard
          title="Links Ativos"
          value={`${totals.count} links`}
          subtitle="Campanhas & Bio"
          icon={Link2}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Cliques Registrados"
          value={formatNumber(totals.clicks)}
          subtitle={`${formatNumber(totals.visitors)} únicos`}
          icon={MousePointer}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Ingressos Vendidos"
          value={`${formatNumber(totals.conversions)} un`}
          subtitle={`Taxa média ${totals.avgCr.toFixed(2)}%`}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Receita Atribuída"
          value={formatCurrency(totals.revenue)}
          subtitle="Vendas rastreadas"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <MetricKpiCard
          title="Investimento Mídia"
          value={formatCurrency(totals.adSpend)}
          subtitle="Ad spend reportado"
          icon={TrendingUp}
          iconColor="text-sky-400"
          iconBg="bg-sky-500/10"
        />
        <MetricKpiCard
          title="ROAS Consolidado"
          value={`${totals.roas.toFixed(2)}x`}
          subtitle="Retorno / investimento"
          icon={Target}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/10"
        />
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-[#202124] border border-[#37393e] rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Presets Rápidos de Campanhas (Criar com 1 Clique)</span>
          </div>
          <span className="text-[11px] text-slate-400">Padrões DiskIngressos recomendados</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {UTM_PRESETS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className="p-2.5 rounded-lg bg-[#2c2d33] hover:bg-[#37393e] border border-[#37393e] hover:border-slate-500 text-left transition flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: `${p.color}25`, color: p.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-[11px] leading-tight line-clamp-1">{p.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.source}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* UTM Generator Form (Collapsible) */}
      {isGeneratorOpen && (
        <div className="bg-[#2c2d33] border border-amber-500/30 rounded-xl p-5 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#37393e]">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Construtor Inteligente de Parâmetros UTM DiskIngressos
            </h3>
            <button
              onClick={() => setIsGeneratorOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateUtm} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Evento Destino *</label>
                <select
                  value={formEventId}
                  onChange={(e) => setFormEventId(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {mockEvents.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título de Identificação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Stories Promoção Início de Semana"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Canal de Mídia / Plataforma *</label>
                <select
                  value={formPlatform}
                  onChange={(e) => {
                    const p = e.target.value as any;
                    setFormPlatform(p);
                    if (p === 'meta') setFormSource('meta_ads');
                    if (p === 'google') setFormSource('google_ads');
                    if (p === 'tiktok') setFormSource('tiktok_ads');
                    if (p === 'spotify') setFormSource('spotify_ads');
                    if (p === 'whatsapp') setFormSource('whatsapp');
                    if (p === 'email') setFormSource('email');
                    if (p === 'influencer') setFormSource('influencer');
                    if (p === 'organic') setFormSource('instagram');
                  }}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="meta">Meta Ads (Instagram & Facebook)</option>
                  <option value="google">Google Ads (Search, Display & YouTube)</option>
                  <option value="tiktok">TikTok Ads (Spark Ads & Video)</option>
                  <option value="spotify">Spotify Ads (Audio Stream)</option>
                  <option value="whatsapp">WhatsApp (Grupos & Disparos)</option>
                  <option value="email">E-mail Marketing & Automação</option>
                  <option value="influencer">Influenciador / Parceiro</option>
                  <option value="organic">Orgânico / Bio / Site Oficial</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Investimento Previsto (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 2500"
                  value={formAdSpend}
                  onChange={(e) => setFormAdSpend(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">utm_source (Origem) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: meta_ads, google_ads"
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-mono text-xs focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">utm_medium (Mídia) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: stories_paid, cpc, banner"
                  value={formMedium}
                  onChange={(e) => setFormMedium(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-mono text-xs focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">utm_campaign (Campanha) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: virada_lote, blackfriday"
                  value={formCampaign}
                  onChange={(e) => setFormCampaign(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-mono text-xs focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">utm_content (Criativo / Versão)</label>
                <input
                  type="text"
                  placeholder="Ex: video_15s_dj, card_estatico"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-mono text-xs focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">utm_term ou Cupom Opcional</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    placeholder="utm_term"
                    value={formTerm}
                    onChange={(e) => setFormTerm(e.target.value)}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-mono text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Cupom"
                    value={formCoupon}
                    onChange={(e) => setFormCoupon(e.target.value.toUpperCase())}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Live URL Preview */}
            <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  URL Parametrizada Completa:
                </span>
                <span className="font-mono text-slate-400">DiskIngressos Gateway</span>
              </div>
              <div className="font-mono text-amber-300 break-all select-all text-xs bg-[#17181c] p-2.5 rounded border border-[#37393e]">
                {liveUrlPreview}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Link Curto:</span>
                  <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {liveShortUrlPreview}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy('preview_full', liveUrlPreview)}
                    className="px-3 py-1.5 bg-[#2c2d33] hover:bg-[#37393e] text-slate-200 font-bold rounded flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedId === 'preview_full' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'preview_full' ? 'Copiado!' : 'Copiar URL'}</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-1.5 rounded shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Salvar & Rastrear Link</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Platform Performance Cards Grid (All Ads Channels) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            Performance Consolidada por Plataforma de Anúncio
          </h2>
          <span className="text-xs text-slate-400">Dados integrados com atribuição em tempo real</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platformStats.map((p) => {
            const cfg = PLATFORM_CONFIG[p.platform] || PLATFORM_CONFIG.organic;
            const Icon = cfg.icon;
            const cr = p.clicks > 0 ? (p.conversions / p.clicks) * 100 : 0;
            const roas = p.adSpend > 0 ? p.revenue / p.adSpend : 0;

            return (
              <div
                key={p.platform}
                onClick={() => setSelectedPlatformFilter(selectedPlatformFilter === p.platform ? 'ALL' : p.platform)}
                className={`p-4 rounded-xl bg-[#2c2d33] border transition cursor-pointer shadow-md flex flex-col justify-between ${
                  selectedPlatformFilter === p.platform ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-[#37393e] hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${cfg.bg} ${cfg.border} border`}>
                        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                      </div>
                      <span className="font-extrabold text-white text-xs">{p.label}</span>
                    </div>
                    {roas > 0 && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {roas.toFixed(1)}x ROAS
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 my-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Receita:</span>
                      <span className="font-extrabold text-emerald-400">{formatCurrency(p.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Vendas:</span>
                      <span className="font-bold text-white">{formatNumber(p.conversions)} ingressos</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Cliques:</span>
                      <span className="font-mono text-slate-300">{formatNumber(p.clicks)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#37393e] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Conv. Rate: <strong className="text-slate-200">{cr.toFixed(2)}%</strong></span>
                  {p.adSpend > 0 ? (
                    <span className="text-slate-400">Gasto: <strong className="text-slate-200">{formatCurrency(p.adSpend)}</strong></span>
                  ) : (
                    <span className="text-purple-400 font-semibold">Sem Custo</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#37393e]">
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Gráficos de Telemetria & Conversão de Tráfego
            </h3>
            <p className="text-xs text-slate-400">
              Acompanhamento do funil de cliques, checkouts iniciados e vendas confirmadas
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#202124] p-1 rounded-lg border border-[#37393e] text-xs">
            <button
              onClick={() => setActiveChartTab('timeline')}
              className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${
                activeChartTab === 'timeline'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Evolução Temporal
            </button>
            <button
              onClick={() => setActiveChartTab('roas_bars')}
              className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${
                activeChartTab === 'roas_bars'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Receita vs Investimento
            </button>
            <button
              onClick={() => setActiveChartTab('pie_share')}
              className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${
                activeChartTab === 'pie_share'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Share por Canal
            </button>
            <button
              onClick={() => setActiveChartTab('funnel')}
              className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${
                activeChartTab === 'funnel'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Funil de Vendas
            </button>
          </div>
        </div>

        {/* Tab 1: Timeline Area Chart */}
        {activeChartTab === 'timeline' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span>Tráfego diário dos últimos 14 dias (Cliques, Sessões de Checkout e Pedidos Convertidos)</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Cliques</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Checkouts</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Vendas</span>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCheckout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#37393e" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#17181c] border border-[#37393e] p-3 rounded-lg shadow-xl text-xs space-y-1.5">
                            <div className="font-extrabold text-white border-b border-[#37393e] pb-1">{label} ({data.date})</div>
                            <div className="text-blue-400 font-semibold">Cliques: {formatNumber(data.clicks)}</div>
                            <div className="text-amber-400 font-semibold">Checkouts: {formatNumber(data.checkout)}</div>
                            <div className="text-emerald-400 font-bold">Vendas: {formatNumber(data.sales)} ({formatCurrency(data.revenue)})</div>
                            <div className="text-slate-400 text-[10px]">Taxa Conversão: {((data.sales / data.clicks) * 100).toFixed(2)}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" name="Cliques" />
                  <Area type="monotone" dataKey="checkout" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCheckout)" name="Checkouts" />
                  <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" name="Vendas" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Revenue vs Ad Spend BarChart */}
        {activeChartTab === 'roas_bars' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span>Comparativo de Receita Atribuída vs Investimento em Mídia por Canal (R$)</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Receita Gerada</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span> Investimento Mídia</span>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformStats.filter((p) => p.revenue > 0 || p.adSpend > 0)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#37393e" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const roas = data.adSpend > 0 ? (data.revenue / data.adSpend).toFixed(2) : 'Orgânico';
                        return (
                          <div className="bg-[#17181c] border border-[#37393e] p-3 rounded-lg shadow-xl text-xs space-y-1.5">
                            <div className="font-extrabold text-white border-b border-[#37393e] pb-1">{label}</div>
                            <div className="text-emerald-400 font-bold">Receita: {formatCurrency(data.revenue)}</div>
                            <div className="text-rose-400 font-semibold">Investimento: {formatCurrency(data.adSpend)}</div>
                            <div className="text-amber-400 font-extrabold">ROAS: {roas}{data.adSpend > 0 ? 'x' : ''}</div>
                            <div className="text-slate-300">Vendas: {formatNumber(data.conversions)} ingressos</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="adSpend" name="Investimento" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: Pie / Share Donut Chart */}
        {activeChartTab === 'pie_share' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#2c2d33" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        const pct = totals.revenue > 0 ? ((item.value / totals.revenue) * 100).toFixed(1) : 0;
                        return (
                          <div className="bg-[#17181c] border border-[#37393e] p-3 rounded-lg shadow-xl text-xs space-y-1">
                            <div className="font-extrabold text-white">{item.name}</div>
                            <div className="text-emerald-400 font-bold">{formatCurrency(item.value)} ({pct}%)</div>
                            <div className="text-slate-400">{item.conversions} ingressos vendidos</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Participação de Vendas por Origem de Tráfego
              </h4>
              <div className="divide-y divide-[#37393e] text-xs">
                {pieChartData.map((item) => {
                  const pct = totals.revenue > 0 ? ((item.value / totals.revenue) * 100).toFixed(1) : 0;
                  return (
                    <div key={item.name} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-200">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-white">{formatCurrency(item.value)}</span>
                        <span className="ml-2 text-slate-400 font-mono text-[11px]">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Funnel View */}
        {activeChartTab === 'funnel' && (
          <div className="space-y-4 py-2">
            <div className="text-xs text-slate-400">
              Taxa de passagem entre etapas do funil de conversão rastreado pelas tags UTM
            </div>

            <div className="space-y-3">
              {/* Stage 1 */}
              <div className="bg-[#202124] p-3 rounded-lg border border-[#37393e]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-white">1. Cliques em Links UTM & Campanhas</span>
                  </div>
                  <span className="font-mono font-extrabold text-blue-400">{formatNumber(totals.clicks)} cliques (100%)</span>
                </div>
                <div className="w-full bg-[#17181c] h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-full"></div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="bg-[#202124] p-3 rounded-lg border border-[#37393e]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white">2. Visitantes Únicos na Página do Evento</span>
                  </div>
                  <span className="font-mono font-extrabold text-purple-400">
                    {formatNumber(totals.visitors)} visitantes ({totals.clicks > 0 ? ((totals.visitors / totals.clicks) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-[#17181c] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${totals.clicks > 0 ? (totals.visitors / totals.clicks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="bg-[#202124] p-3 rounded-lg border border-[#37393e]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">3. Início de Checkout / Seleção de Lote</span>
                  </div>
                  <span className="font-mono font-extrabold text-amber-400">
                    {formatNumber(Math.round(totals.conversions * 4.2))} sessões ({totals.clicks > 0 ? (((totals.conversions * 4.2) / totals.clicks) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-[#17181c] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, totals.clicks > 0 ? ((totals.conversions * 4.2) / totals.clicks) * 100 : 0)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stage 4 */}
              <div className="bg-[#202124] p-3 rounded-lg border border-[#37393e]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">4. Ingressos Pagos & Faturados (Conversão Final)</span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-400">
                    {formatNumber(totals.conversions)} ingressos ({totals.avgCr.toFixed(2)}%)
                  </span>
                </div>
                <div className="w-full bg-[#17181c] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, totals.avgCr * 4)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar for Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-4 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Platform Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedPlatformFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                selectedPlatformFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-[#202124] text-slate-300 hover:text-white border border-[#37393e]'
              }`}
            >
              <span>Todos os Canais</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">{links.length}</span>
            </button>

            {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const count = links.filter((l) => (l.adPlatform || 'organic') === key).length;
              const isSelected = selectedPlatformFilter === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlatformFilter(isSelected ? 'ALL' : key)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow'
                      : 'bg-[#202124] text-slate-300 hover:text-white border-[#37393e]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? '#000' : cfg.color }} />
                  <span>{cfg.label}</span>
                  {count > 0 && <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por link, criativo, UTM ou cupom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Event Scope Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#37393e] text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filtrar por Evento:
          </span>
          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
            className="bg-[#202124] border border-[#37393e] rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Todos os Eventos ({mockEvents.length})</option>
            {mockEvents.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          {selectedEventFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedEventFilter('ALL')}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              Limpar filtro
            </button>
          )}

          <div className="ml-auto text-xs text-slate-400">
            Exibindo <strong>{filteredLinks.length}</strong> de <strong>{links.length}</strong> links
          </div>
        </div>
      </div>

      {/* UTM Links Granular Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm">Links Parametrizados & Atribuição de Vendas</h3>
            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-mono">
              {filteredLinks.length} registros
            </span>
          </div>
          <span className="text-xs text-slate-400">Clique nos botões de ação para copiar URL ou QR Code</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Canal & Título do Link</th>
                <th className="p-3.5 font-semibold">Parâmetros UTM</th>
                <th className="p-3.5 font-semibold">Cliques / Uniq</th>
                <th className="p-3.5 font-semibold">Vendas</th>
                <th className="p-3.5 font-semibold">Taxa Conv.</th>
                <th className="p-3.5 font-semibold">Receita Atribuída</th>
                <th className="p-3.5 font-semibold">Investimento / ROAS</th>
                <th className="p-3.5 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Nenhum link UTM encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const cfg = PLATFORM_CONFIG[link.adPlatform || 'organic'] || PLATFORM_CONFIG.organic;
                  const Icon = cfg.icon;
                  const roas = link.adSpend && link.adSpend > 0 ? (link.revenue / link.adSpend).toFixed(2) : null;

                  return (
                    <tr key={link.id} className="hover:bg-[#25262c] transition group">
                      <td className="p-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 rounded-lg ${cfg.bg} ${cfg.border} border flex-shrink-0 mt-0.5`}>
                            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{link.title}</span>
                              {link.coupon && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Cupom: {link.coupon}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5" title={link.url}>
                              {link.url}
                            </div>
                            {link.shortUrl && (
                              <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                                <span>{link.shortUrl}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-amber-400 border border-[#37393e]">
                            {link.utmSource} / {link.utmMedium}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                            camp: {link.utmCampaign}
                          </div>
                          {link.utmContent && (
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[160px]">
                              cont: {link.utmContent}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 font-mono">
                        <div className="text-white font-bold">{formatNumber(link.clicks)}</div>
                        <div className="text-[10px] text-slate-400">{formatNumber(link.visitors)} únicos</div>
                      </td>

                      <td className="p-3.5 font-bold text-white">
                        {formatNumber(link.conversions)} <span className="text-[11px] text-slate-400 font-normal">un</span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            link.conversionRate >= 5
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : link.conversionRate >= 2
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {link.conversionRate.toFixed(2)}%
                        </span>
                      </td>

                      <td className="p-3.5 font-extrabold text-emerald-400">
                        {formatCurrency(link.revenue)}
                      </td>

                      <td className="p-3.5">
                        {link.adSpend && link.adSpend > 0 ? (
                          <div>
                            <div className="text-slate-300 font-semibold">{formatCurrency(link.adSpend)}</div>
                            <div className="text-amber-400 font-extrabold text-[11px]">{roas}x ROAS</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Orgânico</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(link.id, link.url)}
                            className="p-1.5 rounded-lg bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-300 hover:text-white transition cursor-pointer"
                            title="Copiar URL Completa"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {link.shortUrl && (
                            <button
                              onClick={() => handleCopy(`short-${link.id}`, link.shortUrl!)}
                              className="p-1.5 rounded-lg bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-300 hover:text-white transition cursor-pointer"
                              title="Copiar Link Curto (disk.link)"
                            >
                              {copiedId === `short-${link.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => setQrModalLink(link)}
                            className="p-1.5 rounded-lg bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-300 hover:text-white transition cursor-pointer"
                            title="Gerar QR Code para Impressos / Telão"
                          >
                            <QrCode className="w-3.5 h-3.5 text-purple-400" />
                          </button>

                          <button
                            onClick={() => {
                              setTestPingModalLink(link);
                              setPingStatus('IDLE');
                              setPingLog(null);
                            }}
                            className="p-1.5 rounded-lg bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-300 hover:text-white transition cursor-pointer"
                            title="Testar Ping / Webhook de Telemetria"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-1.5 rounded-lg bg-[#202124] hover:bg-rose-950/40 border border-[#37393e] hover:border-rose-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="Remover Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#37393e] pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-400" />
                QR Code para Flyers & Telão
              </h3>
              <button onClick={() => setQrModalLink(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl mx-auto w-52 h-52 flex flex-col items-center justify-center shadow-inner">
              {/* Stylized QR Code SVG */}
              <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
                <rect x="5" y="5" width="25" height="25" fill="#000" rx="3" />
                <rect x="10" y="10" width="15" height="15" fill="#fff" rx="2" />
                <rect x="13" y="13" width="9" height="9" fill="#000" rx="1" />

                <rect x="70" y="5" width="25" height="25" fill="#000" rx="3" />
                <rect x="75" y="10" width="15" height="15" fill="#fff" rx="2" />
                <rect x="78" y="13" width="9" height="9" fill="#000" rx="1" />

                <rect x="5" y="70" width="25" height="25" fill="#000" rx="3" />
                <rect x="10" y="75" width="15" height="15" fill="#fff" rx="2" />
                <rect x="13" y="78" width="9" height="9" fill="#000" rx="1" />

                <circle cx="50" cy="50" r="8" fill="#f59e0b" />
                <rect x="36" y="12" width="6" height="6" fill="#000" />
                <rect x="46" y="8" width="8" height="6" fill="#000" />
                <rect x="58" y="15" width="6" height="8" fill="#000" />
                <rect x="35" y="35" width="8" height="8" fill="#000" />
                <rect x="65" y="40" width="8" height="6" fill="#000" />
                <rect x="35" y="65" width="6" height="8" fill="#000" />
                <rect x="48" y="72" width="12" height="6" fill="#000" />
                <rect x="68" y="68" width="8" height="12" fill="#000" />
                <rect x="80" y="50" width="6" height="10" fill="#000" />
              </svg>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-extrabold text-white">{qrModalLink.title}</div>
              <div className="font-mono text-[11px] text-amber-300 break-all">{qrModalLink.shortUrl || qrModalLink.url}</div>
              <p className="text-[11px] text-slate-400 pt-1">
                Aponte a câmera do celular para simular o redirecionamento com todos os parâmetros UTM ativos.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleCopy('modal_qr', qrModalLink.shortUrl || qrModalLink.url)}
                className="flex-1 py-2 bg-[#202124] hover:bg-[#37393e] border border-[#37393e] rounded-lg text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {copiedId === 'modal_qr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'modal_qr' ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
              <button
                onClick={() => setQrModalLink(null)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-extrabold transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Ping Webhook Modal */}
      {testPingModalLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#37393e] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-white text-sm">
                  Simulador de Telemetria & Teste de Disparo
                </h3>
              </div>
              <button onClick={() => setTestPingModalLink(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-1">
                <div className="text-slate-400">Link em Teste:</div>
                <div className="font-bold text-white">{testPingModalLink.title}</div>
                <div className="font-mono text-amber-300 break-all text-[11px]">{testPingModalLink.url}</div>
              </div>

              <p className="text-slate-400 text-xs">
                Este teste simula uma requisição HTTP direta ao coletor de eventos DiskIngressos Telemetry Engine, validando se os pixels e a atribuição de vendas registrarão este link sem falhas.
              </p>

              {pingStatus === 'SUCCESS' && pingLog && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Status 200 OK — Telemetria Recebida com Sucesso
                    </span>
                    <span className="font-mono">{pingLog.latencyMs}ms</span>
                  </div>
                  <pre className="font-mono text-[10px] text-slate-300 bg-[#17181c] p-2.5 rounded overflow-x-auto border border-[#37393e]">
                    {JSON.stringify(pingLog.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#37393e]">
              <button
                onClick={() => setTestPingModalLink(null)}
                className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 font-bold rounded-lg text-xs transition"
              >
                Fechar
              </button>

              <button
                onClick={handleExecutePing}
                disabled={pingStatus === 'SENDING'}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs transition flex items-center gap-1.5 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${pingStatus === 'SENDING' ? 'animate-spin' : ''}`} />
                <span>{pingStatus === 'SENDING' ? 'Disparando Ping...' : 'Disparar Ping de Teste'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CentralUtmConversoesPage;
