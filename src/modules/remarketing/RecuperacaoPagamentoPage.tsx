import React, { useState } from 'react';
import { CreditCard, AlertTriangle, RefreshCw, CheckCircle2, Clock, Download, QrCode, X } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { PixRecoveryModal } from '@/components/modals/PixRecoveryModal';
import { RecoveryOpportunity } from '@/types/remarketing';
import { downloadCsv } from '@/utils/csvExport';

export const RecuperacaoPagamentoPage: React.FC = () => {
  const [selectedOpp, setSelectedOpp] = useState<RecoveryOpportunity | null>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [paymentIssues, setPaymentIssues] = useState([
    {
      id: 'pay-01',
      order: 'PED-90812',
      customer: 'Carlos Eduardo Mendes',
      phone: '(41) 98844-3321',
      email: 'carlos.mendes@uol.com.br',
      method: 'Cartão de Crédito',
      issue: 'Bloqueio Antifraude / Cartão Não Autorizado',
      amount: 520.0,
      event: 'Festival XYZ 2026',
      time: 'Há 18 min',
      status: 'Pendente',
    },
    {
      id: 'pay-02',
      order: 'PED-90760',
      customer: 'Tatiane Cristina Prado',
      phone: '(41) 99122-8877',
      email: 'tatiane.prado@gmail.com',
      method: 'PIX Copia e Cola',
      issue: 'PIX Expirado sem Pagamento em 15 minutos',
      amount: 260.0,
      event: 'Festival XYZ 2026',
      time: 'Há 42 min',
      status: 'Em Contato',
    },
    {
      id: 'pay-03',
      order: 'PED-90510',
      customer: 'Roberto Fagundes',
      phone: '(41) 98455-9090',
      email: 'roberto.f@corp.com.br',
      method: 'Boleto Bancário',
      issue: 'Vencimento Ultrapassado',
      amount: 840.0,
      event: 'Festival XYZ 2026',
      time: 'Há 2h',
      status: 'Pendente',
    },
  ]);

  const handleOpenRecovery = (p: typeof paymentIssues[0]) => {
    const opp: RecoveryOpportunity = {
      id: p.id,
      customerName: p.customer,
      customerPhone: p.phone,
      customerEmail: p.email,
      eventId: 'evt-xyz',
      eventName: p.event,
      utmSource: 'recuperacao_gateway',
      utmCampaign: 'falha_cobranca',
      itemsDescription: `Pedido ${p.order} (${p.method})`,
      ticketCount: 2,
      cartValue: p.amount,
      timeAgo: p.time,
      abandonedAt: new Date().toISOString(),
      status: 'EM_RESGATE',
      channel: 'WHATSAPP',
    };
    setSelectedOpp(opp);
    setIsPixModalOpen(true);

    // Update status to "Link Enviado"
    setPaymentIssues((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: 'Link PIX Gerado' } : item))
    );
    setToastMessage(`Chave PIX e novo link gerados com sucesso para ${p.customer}!`);
    setTimeout(() => setToastMessage(null), 5000);
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
      p.amount.toFixed(2),
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
            {paymentIssues.map((p) => (
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
                <td className="p-3.5 font-extrabold text-white text-sm">{formatCurrency(p.amount)}</td>
                <td className="p-3.5 text-slate-400 font-mono text-[11px]">{p.time}</td>
                <td className="p-3.5 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                      p.status === 'Link PIX Gerado'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : p.status === 'Em Contato'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleOpenRecovery(p)}
                    className="flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition cursor-pointer text-xs shadow"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Novo Link PIX</span>
                  </button>
                </td>
              </tr>
            ))}
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
