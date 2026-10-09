import React, { useState } from 'react';
import {
  X,
  Building,
  Calendar,
  DollarSign,
  Ticket,
  FileCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Download,
  Users,
  QrCode,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { CorporateOrder, CorporateAttendee } from '@/types/commercial';
import { formatCurrency, formatDateTime, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { ImportarParticipantesModal } from './ImportarParticipantesModal';

interface PedidoCorporativoDetalhesModalProps {
  order: CorporateOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, updates: Partial<CorporateOrder>) => Promise<void>;
  onImportAttendees?: (orderId: string, attendees: CorporateAttendee[]) => Promise<void>;
}

export const PedidoCorporativoDetalhesModal: React.FC<PedidoCorporativoDetalhesModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onImportAttendees,
}) => {
  const [activeTab, setActiveTab] = useState<'billing' | 'attendees'>('billing');
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyBoleto = () => {
    if (!order.boletoDigitableLine) return;
    navigator.clipboard.writeText(order.boletoDigitableLine);
    setCopiedBoleto(true);
    setTimeout(() => setCopiedBoleto(false), 2000);
  };

  const handleCopyPix = () => {
    if (!order.pixCode) return;
    navigator.clipboard.writeText(order.pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleTogglePayment = async () => {
    if (!onUpdateStatus) return;
    setIsUpdating(true);
    try {
      const nextStatus = order.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
      await onUpdateStatus(order.id, { paymentStatus: nextStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const attendeesCount = order.attendees ? order.attendees.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#37393e] flex items-center justify-between bg-[#232429]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-400">{order.orderNumber}</span>
                <span className="text-white font-extrabold text-sm">{order.companyName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {order.paymentStatus === 'PAID' ? 'Liquidado' : 'Aguardando Pagamento'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                CNPJ: {order.cnpj} • Contato: {order.contactName} ({order.contactPhone || order.contactEmail || 'DiskIngressos Corp'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#35363c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-[#37393e] bg-[#232429] flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('billing')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'billing'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Faturamento, Boleto & NF-e</span>
          </button>

          <button
            onClick={() => setActiveTab('attendees')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'attendees'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Participantes Nominais ({attendeesCount}/{order.ticketQuantity})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Order Summary Strip */}
          <div className="grid grid-cols-4 gap-3 bg-[#202124] border border-[#37393e] p-3 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Evento</span>
              <span className="font-semibold text-white truncate block">{order.eventName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Setor / Tipo</span>
              <span className="font-semibold text-blue-400 truncate block">{order.sector}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Quantidade</span>
              <span className="font-bold text-white block">{order.ticketQuantity} Ingressos</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor Total</span>
              <span className="font-extrabold text-emerald-400 block">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {activeTab === 'billing' && (
            <div className="space-y-4">
              {/* Payment Status Switch Card */}
              <div className="bg-[#202124] border border-[#37393e] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Situação Financeira</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Condição: <strong className="text-white">{order.paymentTerm}</strong> • Vencimento:{' '}
                    <strong className="text-amber-400">{order.dueDate ? formatDate(order.dueDate) : 'Imediato'}</strong>
                  </p>
                </div>

                {onUpdateStatus && (
                  <button
                    onClick={handleTogglePayment}
                    disabled={isUpdating}
                    className={`px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{order.paymentStatus === 'PAID' ? 'Reabrir como Pendente' : 'Confirmar Liquidação / Pago'}</span>
                  </button>
                )}
              </div>

              {/* Boleto Bancário Box */}
              <div className="bg-[#202124] border border-[#37393e] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    <span>Boleto Bancário Faturado (DiskIngressos)</span>
                  </span>
                  <button
                    onClick={handleCopyBoleto}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition cursor-pointer"
                  >
                    {copiedBoleto ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBoleto ? 'Linha Copiada!' : 'Copiar Linha Digitável'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-[#17181c] rounded border border-[#37393e] font-mono text-[11px] text-slate-300 select-all break-all">
                  {order.boletoDigitableLine || '34191.79001 01043.510047 91020.150008 5 95000004800000'}
                </div>
              </div>

              {/* PIX Instantâneo Box */}
              <div className="bg-[#202124] border border-[#37393e] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Chave PIX Copia e Cola</span>
                  </span>
                  <button
                    onClick={handleCopyPix}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'PIX Copiado!' : 'Copiar Chave PIX'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-[#17181c] rounded border border-[#37393e] font-mono text-[10px] text-slate-400 select-all truncate">
                  {order.pixCode || '00020126580014br.gov.bcb.pix0136diskingressos-corp-chave-aleatoria520400005303986'}
                </div>
              </div>

              {/* Nota Fiscal NF-e */}
              <div className="bg-[#202124] border border-[#37393e] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Nota Fiscal de Serviços (NF-e):</span>
                    <span className="font-mono text-emerald-400 font-bold">{order.invoiceNumber || 'NFE-2026-8942'}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Autorizada SEFAZ
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Chave: {order.invoiceKey || '41261002434341000108550010000089421008420192'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const blob = new Blob([`DANFE / NOTA FISCAL ELETRÔNICA\nNúmero: ${order.invoiceNumber || '8942'}\nTomador: ${order.companyName}\nCNPJ: ${order.cnpj}\nValor Total: R$ ${order.totalAmount}\nEvento: ${order.eventName}\nEmitente: Disk Ingressos Entretenimento S.A.`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `danfe-${order.orderNumber.toLowerCase()}.txt`;
                    a.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar DANFE (PDF)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'attendees' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Colaboradores & Convidados Nominais
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ingressos emitidos individualmente com QR Code nominal
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {attendeesCount > 0 && (
                    <button
                      onClick={() => {
                        downloadCsv(
                          `participantes-${order.orderNumber.toLowerCase()}`,
                          ['Nome', 'Documento', 'E-mail', 'Setor', 'Código Ingresso'],
                          (order.attendees || []).map((a) => [a.name, a.document, a.email, a.sector, a.ticketCode || ''])
                        );
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202124] hover:bg-[#35363c] text-slate-300 text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar CSV</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Importar Lista Nominal (CSV)</span>
                  </button>
                </div>
              </div>

              {attendeesCount === 0 ? (
                <div className="text-center py-8 bg-[#202124] border border-[#37393e] rounded-lg space-y-2">
                  <Users className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-white font-bold text-xs">Nenhum participante nominal cadastrado</div>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    A empresa comprou {order.ticketQuantity} ingressos em lote. Importe a planilha de colaboradores para gerar os e-tickets com QR Code individual.
                  </p>
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition inline-flex items-center gap-1.5 mt-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Importar Planilha de Colaboradores</span>
                  </button>
                </div>
              ) : (
                <div className="border border-[#37393e] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                        <th className="p-3 font-semibold">Nome do Colaborador</th>
                        <th className="p-3 font-semibold">CPF</th>
                        <th className="p-3 font-semibold">E-mail</th>
                        <th className="p-3 font-semibold">Setor</th>
                        <th className="p-3 font-semibold text-right">Código do E-Ticket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#37393e]">
                      {(order.attendees || []).map((att) => (
                        <tr key={att.id} className="hover:bg-[#25262c]">
                          <td className="p-3 font-bold text-white">{att.name}</td>
                          <td className="p-3 font-mono text-slate-400">{att.document}</td>
                          <td className="p-3 text-slate-300">{att.email}</td>
                          <td className="p-3 text-slate-300">{att.sector}</td>
                          <td className="p-3 text-right font-mono text-emerald-400 font-bold">{att.ticketCode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#37393e] flex items-center justify-end bg-[#232429]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#202124] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>

      <ImportarParticipantesModal
        order={order}
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={async (attendees) => {
          if (onImportAttendees) {
            await onImportAttendees(order.id, attendees);
          }
        }}
      />
    </div>
  );
};
