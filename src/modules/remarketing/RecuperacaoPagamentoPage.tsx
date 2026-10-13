import React, { useState, useEffect } from 'react';
import { eagleRecoveryApi } from '@/services/api/eagleRecovery';
import type { PaymentRecoveryItem } from '@/types/remarketing';
import { CreditCard, AlertTriangle, RefreshCw, CheckCircle2, Clock, Download, QrCode, X, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { PixRecoveryModal } from '@/components/modals/PixRecoveryModal';
import { RecoveryOpportunity } from '@/types/remarketing';
import { downloadCsv } from '@/utils/csvExport';

type PaymentRow = {
  id: string;
  order: string;
  customer: string;
  phone: string;
  email: string;
  method: string;
  issue: string;
  amount: number;
  event: string;
  time: string;
  status: string;
  eventId: string;
};

export const RecuperacaoPagamentoPage: React.FC = () => {
  const [selectedOpp, setSelectedOpp] = useState<RecoveryOpportunity | null>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [paymentIssues, setPaymentIssues] = useState<PaymentRow[]>([]);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);

  const refreshPayments = async () => {
    setLoadError('');
    try {
      const rows = await eagleRecoveryApi.listFailedPayments();
      if (Array.isArray(rows)) {
        setPaymentIssues(
          rows.map((p) => ({
            id: p.id,
            order: p.orderNumber,
            customer: p.customerName,
            phone: p.customerPhone,
            email: p.customerEmail,
            method: p.paymentMethod,
            issue: p.issueType,
            amount: p.amount,
            event: p.eventName,
            eventId: p.eventId,
            time: p.createdAt,
            status: p.status,
          }))
        );
      }
    } catch (e) {
      setPaymentIssues([]);
      setLoadError(e instanceof Error ? e.message : 'API indisponível');
    }
  };

  useEffect(() => {
    void refreshPayments();
  }, []);

  const handleOpenRecovery = async (p: PaymentRow) => {
    if (busy) return;
    setBusy(true);
    try {
      const pix = await eagleRecoveryApi.requestNewPix(p.id);
      if (!pix.paymentReference || !pix.pixCopyPaste || !pix.expiresAt) {
        throw new Error('Código PIX não confirmado pelo provedor');
      }

      const opp: RecoveryOpportunity = {
        id: p.id,
        customerName: p.customer,
        customerPhone: p.phone,
        customerEmail: p.email,
        eventId: p.eventId,
        eventName: p.event,
        utmSource: '',
        utmCampaign: '',
        itemsDescription: `Pedido ${p.order}`,
        ticketCount: 1,
        cartValue: p.amount,
        timeAgo: p.time,
        abandonedAt: new Date().toISOString(),
        status: 'EM_RESGATE',
        channel: 'WHATSAPP',
        pixKey: pix.pixCopyPaste,
      };

      setSelectedOpp(opp);
      setIsPixModalOpen(true);
      setToastMessage('Novo PIX retornado pelo serviço. Pagamento ainda não confirmado.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (e) {
      setToastMessage(`Não foi possível gerar PIX: ${e instanceof Error ? e.message : 'erro desconhecido'}`);
    } finally {
      setBusy(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ID Pedido',
      'Cliente',
      'Telefone',
      'E-mail',
      'Evento',
      'Forma de Pagamento',
      'Motivo da Falha',
      'Valor (R$)',
      'Tempo',
      'Status',
    ];
    const rows = paymentIssues.map((p) => [
      p.order,
      p.customer,
      p.phone,
      p.email,
      p.event,
      p.method,
      p.issue,
      (p.amount || 0).toFixed(2),
      p.time,
      p.status,
    ]);
    downloadCsv(headers, rows, `recuperacao-pagamentos-${new Date().toISOString().slice(0, 10)}.csv`);
    setToastMessage('Relatório de pagamentos recusados exportado com sucesso (CSV)!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-cyan-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loadError && (
        <div role="alert" className="border border-red-500/40 p-3 rounded-lg text-red-300 text-xs bg-red-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Consulta indisponível: {loadError}. Nenhum pagamento fictício será exibido.</span>
          </div>
          <button onClick={() => void refreshPayments()} className="underline text-red-400 hover:text-white cursor-pointer ml-2">
            Tentar novamente
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Recuperação de Pagamentos & Transações Recusadas
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Falhas de Cobrança
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhamento de pedidos recusados por operadoras, cartões com limite excedido e PIX não liquidados
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Pedido / Cliente</th>
              <th className="p-3.5 font-semibold">Evento</th>
              <th className="p-3.5 font-semibold">Forma de Pagamento</th>
              <th className="p-3.5 font-semibold">Motivo da Recusa</th>
              <th className="p-3.5 font-semibold">Valor</th>
              <th className="p-3.5 font-semibold">Tempo</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {paymentIssues.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Nenhuma transação recusada pendente de recuperação.
                </td>
              </tr>
            ) : (
              paymentIssues.map((p) => (
                <tr key={p.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{p.customer}</div>
                    <div className="font-mono text-slate-400 text-[11px]">{p.order} • {p.phone}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{p.event}</td>
                  <td className="p-3.5 font-mono text-slate-200">{p.method}</td>
                  <td className="p-3.5 text-rose-300">
                    <div className="flex items-center gap-1.5 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span>{p.issue}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-extrabold text-white text-sm">{formatCurrency(p.amount || 0)}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{p.time}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.status === 'Link PIX Gerado' || p.status === 'RECOVERED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.status === 'Em Contato' || p.status === 'RETRIEVING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => void handleOpenRecovery(p)}
                      disabled={busy}
                      className="flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition cursor-pointer text-xs shadow"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Novo Link PIX</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PixRecoveryModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        opportunity={selectedOpp}
      />
    </div>
  );
};
export default RecuperacaoPagamentoPage;
