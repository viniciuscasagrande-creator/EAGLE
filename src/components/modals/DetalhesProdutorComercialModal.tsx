import React from 'react';
import { ProducerCommercialSummary } from '@/types/commercial';
import {
  X,
  Building2,
  TrendingUp,
  Megaphone,
  Database,
  Ticket,
  DollarSign,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Zap,
  Calendar,
} from 'lucide-react';

interface DetalhesProdutorComercialModalProps {
  isOpen: boolean;
  onClose: () => void;
  producer: ProducerCommercialSummary | null;
  onOpenWhatsApp: (phone: string, text: string) => void;
}

export const DetalhesProdutorComercialModal: React.FC<DetalhesProdutorComercialModalProps> = ({
  isOpen,
  onClose,
  producer,
  onOpenWhatsApp,
}) => {
  if (!isOpen || !producer) return null;

  const presetPitch = `Olá ${producer.responsibleName}! Aqui é da equipe Comercial da DiskIngressos. Estive acompanhando o desempenho de ${producer.topEventName} e vi que vocês estão com ${producer.currentLotStatus}. Gostaríamos de apresentar nossas condições especiais de antecipação e impulsionamento de marketing. Podemos conversar hoje?`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#141b2d] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-extrabold text-xl">
              {producer.tradeName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-tight">
                  {producer.tradeName}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  producer.status === 'HIGH_GROWTH'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : producer.status === 'ATTENTION'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {producer.status === 'HIGH_GROWTH' ? 'ALTO CRESCIMENTO' : producer.status === 'ATTENTION' ? 'ATENÇÃO COMERCIAL' : 'ATIVO'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {producer.name} • CNPJ: {producer.cnpj}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Commercial Account Manager Strip */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Gerente de Contas DiskIngressos
              </span>
              <div className="text-xs font-bold text-purple-300">
                {producer.accountManagerDisk}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenWhatsApp(producer.contactPhone, presetPitch)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Comercial</span>
              </button>
            </div>
          </div>

          {/* Section 1: Sales Trajectory */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Status de Vendas & Ingressos
                </h3>
              </div>
              <span className="text-xs font-bold text-cyan-400">
                {producer.salesVelocityPerHour} tickets/hora
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">GMV no Mês:</span>
                <div className="text-sm font-extrabold text-white">
                  R$ {producer.grossSalesMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Ingressos Vendidos:</span>
                <div className="text-sm font-extrabold text-slate-200">
                  {producer.ticketsSoldMonth.toLocaleString('pt-BR')}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Eventos em Venda:</span>
                <div className="text-sm font-extrabold text-slate-200">
                  {producer.activeEventsCount} eventos
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Principal Evento:</span>
                <div className="text-xs font-bold text-purple-400 truncate">
                  {producer.topEventName}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Status do Lote Ativo:</span>
              <span className="font-semibold text-amber-300">{producer.currentLotStatus}</span>
            </div>
          </div>

          {/* Section 2: Marketing & Paid Media */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Campanhas de Marketing em Execução
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Investimento 30d: R$ {producer.marketing.metaAdsSpend30d.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                producer.marketing.metaAdsActive
                  ? 'bg-blue-500/10 border-blue-500/25 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <span className="text-[10px] font-bold">Meta Ads (FB/IG)</span>
                <div className="font-extrabold mt-1">
                  {producer.marketing.metaAdsActive ? `${producer.marketing.metaAdsCampaignsCount} ativas` : 'Inativo'}
                </div>
                {producer.marketing.metaAdsActive && (
                  <span className="text-[10px] text-emerald-400 font-bold mt-0.5">ROAS {producer.marketing.metaAdsRoas}x</span>
                )}
              </div>

              <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                producer.marketing.ga4Connected
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <span className="text-[10px] font-bold">Google GA4</span>
                <div className="font-extrabold mt-1">
                  {producer.marketing.ga4Connected ? 'Conectado' : 'Sem Tag'}
                </div>
                <span className="text-[10px] text-slate-400">Rastreio CAPI</span>
              </div>

              <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                producer.marketing.tiktokAdsActive
                  ? 'bg-pink-500/10 border-pink-500/25 text-pink-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <span className="text-[10px] font-bold">TikTok Ads</span>
                <div className="font-extrabold mt-1">
                  {producer.marketing.tiktokAdsActive ? 'Ativo' : 'Inativo'}
                </div>
                <span className="text-[10px] text-slate-400">Público Gen-Z</span>
              </div>

              <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                producer.marketing.whatsappAutomationsActive
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <span className="text-[10px] font-bold">WhatsApp Automação</span>
                <div className="font-extrabold mt-1">
                  {producer.marketing.whatsappAutomationsActive ? 'Ativo (Recuperação)' : 'Desativado'}
                </div>
                <span className="text-[10px] text-slate-400">Carrinho Abandonado</span>
              </div>
            </div>

            {/* Coupons Strip */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="text-slate-400">Cupons Promocionais Ativos:</span>
              <div className="flex flex-wrap gap-1.5">
                {producer.marketing.activeCoupons.map((coupon) => (
                  <span
                    key={coupon}
                    className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    {coupon}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Keeper ERP Usage */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Módulos em Uso do Keeper ERP
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Último Sync: {producer.erp.lastLedgerSync}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Antecipação de Recebíveis</span>
                <div className="font-extrabold text-amber-300 mt-1">
                  {producer.erp.keeperAdvanceActive
                    ? `R$ ${(producer.erp.keeperAdvanceTotal / 1000).toFixed(0)}k tomados`
                    : 'Não utiliza'}
                </div>
                <span className="text-[10px] text-slate-500">
                  Teto: R$ {(producer.erp.keeperAdvanceLimit / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Borderô Automatizado</span>
                <div className="font-extrabold text-slate-200 mt-1 flex items-center gap-1">
                  {producer.erp.automatedBordereauEnabled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Habilitado</span>
                    </>
                  ) : (
                    <span className="text-slate-500">Desabilitado</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">Fechamento D+2</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Split de Pagamentos</span>
                <div className="font-extrabold text-slate-200 mt-1 flex items-center gap-1">
                  {producer.erp.splitRulesConfigured ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Configurado</span>
                    </>
                  ) : (
                    <span className="text-slate-500">Conta Única</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">Divisão de Sócios</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Emissão NF-e Corp</span>
                <div className="font-extrabold text-slate-200 mt-1 flex items-center gap-1">
                  {producer.erp.nfeAutomatedDispatch ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Automática</span>
                    </>
                  ) : (
                    <span className="text-slate-500">Manual</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">Integração SEFAZ</span>
              </div>
            </div>
          </div>

          {/* Section 4: Recent Producer Updates Timeline */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Atualizações & Atividades Recentes do Produtor
            </h3>
            <div className="space-y-2">
              {producer.recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 flex-shrink-0 mt-0.5">
                    {act.timestamp}
                  </span>
                  <p className="text-slate-300 leading-relaxed">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="text-xs text-slate-400">
            Contato: <strong className="text-slate-200">{producer.responsibleName}</strong> ({producer.contactPhone})
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
