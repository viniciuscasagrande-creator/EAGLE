import React, { useState } from 'react';
import { mockProducerCommercialSummaries } from '@/services/api/mockSeedData';
import { ProducerCommercialSummary } from '@/types/commercial';
import { DetalhesProdutorComercialModal } from '@/components/modals/DetalhesProdutorComercialModal';
import {
  Radar,
  Building2,
  Search,
  Filter,
  TrendingUp,
  Megaphone,
  Database,
  Ticket,
  DollarSign,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  Zap,
  Layers,
  Percent,
  Clock,
} from 'lucide-react';

export const RadarProdutoresComercialPage: React.FC = () => {
  const [summaries, setSummaries] = useState<ProducerCommercialSummary[]>(mockProducerCommercialSummaries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProducer, setSelectedProducer] = useState<ProducerCommercialSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = summaries.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tradeName.toLowerCase().includes(search.toLowerCase()) ||
      p.cnpj.includes(search) ||
      p.topEventName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalGmv = summaries.reduce((acc, p) => acc + p.grossSalesMonth, 0);
  const producersWithMarketing = summaries.filter((p) => p.marketing.metaAdsActive || p.marketing.tiktokAdsActive).length;
  const producersWithErp = summaries.filter((p) => p.erp.keeperAdvanceActive || p.erp.automatedBordereauEnabled).length;
  const attentionCount = summaries.filter((p) => p.status === 'ATTENTION').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast(`WhatsApp aberto para contato comercial com a produtora!`);
  };

  const handleOfferCredit = (producer: ProducerCommercialSummary) => {
    const pitch = `Olá ${producer.responsibleName}! Identificamos que o Lote do ${producer.topEventName} está com excelente tração. Liberamos uma linha de antecipação pré-aprovada de até R$ ${(producer.erp.keeperAdvanceLimit / 1000).toFixed(0)}k no Keeper ERP com taxa especial de 3.2% a.m. Gostaria de simular a liberação hoje?`;
    handleOpenWhatsApp(producer.contactPhone, pitch);
  };

  const handleOfferMarketing = (producer: ProducerCommercialSummary) => {
    const pitch = `Olá ${producer.responsibleName}! Nossa equipe de inteligência identificou oportunidade para acelerar a virada de lote do ${producer.topEventName}. Podemos ativar um pacote de impulsionamento e automação de remarketing da DiskIngressos para vocês?`;
    handleOpenWhatsApp(producer.contactPhone, pitch);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Radar Comercial 360º de Produtores & ERP
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Radar className="w-3.5 h-3.5 animate-spin" />
              <span>Inteligência Ativa</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhamento em tempo real de campanhas de marketing, velocidade de vendas de lotes e adoção do Keeper ERP pelas produtoras.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">GMV Monitorado (30d)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            R$ {(totalGmv / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            {summaries.length} contas ativas monitoradas
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Produtoras com Marketing Ativo</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-300 mt-2">
            {producersWithMarketing} de {summaries.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Meta Ads, GA4 ou TikTok ativos
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Adoção do Keeper ERP</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300 mt-2">
            {producersWithErp} de {summaries.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Utilizando antecipação ou borderô
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Oportunidades de Apoio</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {attentionCount} conta(s)
          </div>
          <div className="text-[11px] text-amber-300 mt-1 font-semibold">
            Requerem contato proativo
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtora, CNPJ ou evento principal..."
            className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todas ({summaries.length})
          </button>
          <button
            onClick={() => setStatusFilter('HIGH_GROWTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'HIGH_GROWTH'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Alto Crescimento
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'ACTIVE'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Regulares
          </button>
          <button
            onClick={() => setStatusFilter('ATTENTION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'ATTENTION'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Atenção Comercial ({attentionCount})
          </button>
        </div>
      </div>

      {/* Producer Intelligence 360º Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-extrabold text-purple-400 text-lg flex-shrink-0">
                  {prod.tradeName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white leading-tight">
                      {prod.tradeName}
                    </h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prod.status === 'HIGH_GROWTH'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : prod.status === 'ATTENTION'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {prod.status === 'HIGH_GROWTH' ? 'ALTO CRESCIMENTO' : prod.status === 'ATTENTION' ? 'OPORTUNIDADE COMERCIAL' : 'REGULAR'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {prod.responsibleName} • {prod.contactPhone}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500">GMV no Mês</span>
                <div className="text-base font-extrabold text-emerald-400">
                  R$ {prod.grossSalesMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {prod.ticketsSoldMonth.toLocaleString('pt-BR')} ingressos
                </div>
              </div>
            </div>

            {/* Event & Current Lot Strip */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Principal Evento em Venda:</span>
                <div className="font-bold text-purple-300 mt-0.5">{prod.topEventName}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Status do Lote:</span>
                <div className="font-semibold text-amber-300 mt-0.5">{prod.currentLotStatus}</div>
              </div>
            </div>

            {/* Dual Badges Strip: Marketing vs ERP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Marketing Channels */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-slate-300">
                    <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Marketing em Ação</span>
                  </div>
                  {prod.marketing.metaAdsActive ? (
                    <span className="text-[10px] text-emerald-400 font-bold">ROAS {prod.marketing.metaAdsRoas}x</span>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-bold">Pausado</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.marketing.metaAdsActive
                      ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    Meta Ads ({prod.marketing.metaAdsCampaignsCount})
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.marketing.ga4Connected
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    GA4
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.marketing.whatsappAutomationsActive
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    WhatsApp Auto
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.marketing.tiktokAdsActive
                      ? 'bg-pink-500/10 text-pink-300 border border-pink-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    TikTok Ads
                  </span>
                </div>
              </div>

              {/* ERP Keeper Usage */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-slate-300">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    <span>Uso Keeper ERP</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Sync D+0</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.erp.keeperAdvanceActive
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    Antecipação (R$ {(prod.erp.keeperAdvanceTotal / 1000).toFixed(0)}k)
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.erp.automatedBordereauEnabled
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    Borderô Auto
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.erp.splitRulesConfigured
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    Split Contábil
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.erp.nfeAutomatedDispatch
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    NF-e Auto
                  </span>
                </div>
              </div>
            </div>

            {/* Most Recent Activity Highlight */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <div className="truncate text-slate-300">
                <span className="font-bold text-slate-200">
                  {prod.recentActivity[0]?.timestamp}:
                </span>{' '}
                {prod.recentActivity[0]?.description}
              </div>
            </div>

            {/* Action Bar for Commercial Team */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedProducer(prod);
                  setIsModalOpen(true);
                }}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Dossiê 360º</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                {!prod.marketing.metaAdsActive && (
                  <button
                    onClick={() => handleOfferMarketing(prod)}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Oferecer Marketing</span>
                  </button>
                )}

                {prod.erp.keeperAdvanceActive && prod.erp.keeperAdvanceTotal < prod.erp.keeperAdvanceLimit && (
                  <button
                    onClick={() => handleOfferCredit(prod)}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Percent className="w-3 h-3" />
                    <span>Propor Crédito ERP</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    handleOpenWhatsApp(
                      prod.contactPhone,
                      `Olá ${prod.responsibleName}! Aqui é da equipe Comercial DiskIngressos. Acompanhamos o ótimo desempenho do ${prod.topEventName} (${prod.currentLotStatus}) e gostaríamos de agendar um papo rápido de alinhamento.`
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      <DetalhesProdutorComercialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        producer={selectedProducer}
        onOpenWhatsApp={handleOpenWhatsApp}
      />
    </div>
  );
};
