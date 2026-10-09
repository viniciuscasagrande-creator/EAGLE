import React, { useState } from 'react';
import { mockRecoveryOpportunities } from '@/services/api/mockSeedData';
import { RecoveryOpportunity } from '@/types/remarketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { PixRecoveryModal } from '@/components/modals/PixRecoveryModal';
import { ConfirmarVendaRecoveryModal } from '@/components/modals/ConfirmarVendaRecoveryModal';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  DollarSign,
  QrCode,
  Send,
  Zap,
  Filter,
  Check,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const WhatsAppRemarketingPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<RecoveryOpportunity[]>(mockRecoveryOpportunities);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ABERTO' | 'EM_RESGATE' | 'RECUPERADO'>('ALL');

  // Modals state
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [selectedPixOpp, setSelectedPixOpp] = useState<RecoveryOpportunity | null>(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedConfirmOpp, setSelectedConfirmOpp] = useState<RecoveryOpportunity | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPIs calculations
  const openCount = opportunities.filter((o) => o.status === 'ABERTO').length;
  const inRescueCount = opportunities.filter((o) => o.status === 'EM_RESGATE').length;
  const potentialRecoverable = opportunities
    .filter((o) => o.status === 'ABERTO' || o.status === 'EM_RESGATE')
    .reduce((acc, curr) => acc + curr.cartValue, 0);
  const recoveredRevenue = opportunities
    .filter((o) => o.status === 'RECUPERADO')
    .reduce((acc, curr) => acc + curr.cartValue, 0);

  // Filtered List
  const filteredList = opportunities.filter((o) => {
    if (activeFilter === 'ALL') return true;
    return o.status === activeFilter;
  });

  // Action: Resgatar (Send personalized recovery WhatsApp)
  const handleRescueSingle = (opp: RecoveryOpportunity) => {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === opp.id
          ? {
              ...item,
              status: 'EM_RESGATE',
              lastActionNote: `Mensagem enviada às ${new Date().toLocaleTimeString().slice(0, 5)}`,
              timeAgo: 'agora mesmo',
            }
          : item
      )
    );
    showToast(`Mensagem de recuperação enviada com sucesso para ${opp.customerName}!`);
  };

  // Action: Batch process queue (Processar Fila de Resgate)
  const handleProcessQueue = () => {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.status === 'ABERTO'
          ? {
              ...item,
              status: 'EM_RESGATE',
              lastActionNote: `Disparo em lote às ${new Date().toLocaleTimeString().slice(0, 5)}`,
              timeAgo: 'agora mesmo',
            }
          : item
      )
    );
    showToast('Fila de resgate processada! Todas as oportunidades abertas receberam a mensagem com link oficial.');
  };

  // Action: Open PIX Key Modal
  const handleOpenPix = (opp: RecoveryOpportunity) => {
    setSelectedPixOpp(opp);
    setPixModalOpen(true);
  };

  // Action: Open Confirm Sale Modal
  const handleOpenConfirm = (opp: RecoveryOpportunity) => {
    setSelectedConfirmOpp(opp);
    setConfirmModalOpen(true);
  };

  // Callback when sale is confirmed in modal
  const handleSaleConfirmed = (updated: RecoveryOpportunity) => {
    setOpportunities((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    showToast(`Venda de ${formatCurrency(updated.cartValue)} confirmada e conciliada no Ledger do evento!`);
  };

  const getStatusBadge = (status: RecoveryOpportunity['status']) => {
    switch (status) {
      case 'ABERTO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Aberto
          </span>
        );
      case 'EM_RESGATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Send className="w-3 h-3" />
            Em Resgate
          </span>
        );
      case 'RECUPERADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Recuperado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              WhatsApp Remarketing — Fila de Recuperação
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Operacional em Tempo Real
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Gestão ativa de carrinhos interrompidos, envio de chave PIX instantânea e confirmação de vendas
          </p>
        </div>

        {/* Batch Process Button from Video (02:24-02:34) */}
        <button
          onClick={handleProcessQueue}
          disabled={openCount === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Processar Fila de Resgate ({openCount})</span>
        </button>
      </div>

      {/* 4 KPIs from Video (02:24-02:34) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Oportunidades Abertas"
          value={`${openCount} carrinhos`}
          subtitle="Aguardando primeiro contato"
          icon={Clock}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <MetricKpiCard
          title="Em Recuperação"
          value={`${inRescueCount} em andamento`}
          subtitle="Mensagem de resgate enviada"
          icon={MessageSquare}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Potencial Recuperável"
          value={formatCurrency(potentialRecoverable)}
          subtitle="Valor total dos carrinhos ativos"
          icon={DollarSign}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Receita Já Recuperada"
          value={formatCurrency(recoveredRevenue)}
          subtitle="Vendas confirmadas e faturadas"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
      </div>

      {/* Filter Tabs matching the video */}
      <div className="flex items-center justify-between gap-3 bg-[#2c2d33] border border-[#37393e] rounded-xl p-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 font-semibold px-2">Visualizar:</span>
          {[
            { id: 'ALL', label: `Todos (${opportunities.length})` },
            { id: 'ABERTO', label: `Abertos (${openCount})` },
            { id: 'EM_RESGATE', label: `Em Resgate (${inRescueCount})` },
            { id: 'RECUPERADO', label: `Recuperados (${opportunities.filter((o) => o.status === 'RECUPERADO').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#37393e]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dense Recovery Table matching video 02:24-02:34 */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Oportunidades de Recuperação Ativas</h3>
          <span className="text-xs text-slate-400">{filteredList.length} registro(s)</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Cliente / WhatsApp</th>
              <th className="p-3.5 font-semibold">Evento & UTM Origem</th>
              <th className="p-3.5 font-semibold">Itens do Carrinho</th>
              <th className="p-3.5 font-semibold">Valor</th>
              <th className="p-3.5 font-semibold">Tempo Decorrido</th>
              <th className="p-3.5 font-semibold">Status</th>
              <th className="p-3.5 font-semibold text-right">Ações Operacionais</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredList.map((opp) => (
              <tr key={opp.id} className="hover:bg-[#25262c] transition">
                {/* Client info */}
                <td className="p-3.5">
                  <div className="font-bold text-white">{opp.customerName}</div>
                  <div className="font-mono text-emerald-400 text-[11px]">{opp.customerPhone}</div>
                </td>

                {/* Event & UTM */}
                <td className="p-3.5">
                  <div className="font-semibold text-slate-200">{opp.eventName}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {opp.utmSource} • {opp.utmCampaign}
                  </div>
                </td>

                {/* Items */}
                <td className="p-3.5">
                  <div className="text-slate-300">{opp.itemsDescription}</div>
                  <div className="text-[11px] text-slate-400">{opp.ticketCount} ingresso(s)</div>
                </td>

                {/* Value */}
                <td className="p-3.5">
                  <div className="font-extrabold text-white text-sm">
                    {formatCurrency(opp.cartValue)}
                  </div>
                </td>

                {/* Time Ago */}
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {opp.timeAgo}
                  </span>
                  {opp.lastActionNote && (
                    <div className="text-[10px] text-blue-400 truncate max-w-[140px]">
                      {opp.lastActionNote}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="p-3.5">{getStatusBadge(opp.status)}</td>

                {/* Actions: Resgatar, Chave PIX, Confirmar Venda */}
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {opp.status !== 'RECUPERADO' && (
                      <button
                        onClick={() => handleRescueSingle(opp)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Enviar mensagem personalizada de resgate via WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>Resgatar</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenPix(opp)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Copiar código PIX para envio rápido"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>Chave Pix</span>
                    </button>

                    {opp.status !== 'RECUPERADO' && (
                      <button
                        onClick={() => handleOpenConfirm(opp)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                        title="Conferir pagamento no Keeper e marcar como recuperada"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirmar Venda</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PIX Modal */}
      <PixRecoveryModal
        isOpen={pixModalOpen}
        onClose={() => setPixModalOpen(false)}
        opportunity={selectedPixOpp}
      />

      {/* Confirm Sale Modal */}
      <ConfirmarVendaRecoveryModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        opportunity={selectedConfirmOpp}
        onConfirmed={handleSaleConfirmed}
      />
    </div>
  );
};
