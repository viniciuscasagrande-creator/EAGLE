import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Send,
  MessageSquare,
  Building,
  Calendar,
  Ticket,
  DollarSign,
  CheckCircle2,
  FileCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CommercialProposal } from '@/types/commercial';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PropostaDetalhesModalProps {
  proposal: CommercialProposal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (status: CommercialProposal['status']) => Promise<void>;
  onConvertToCorporate?: (proposal: CommercialProposal) => Promise<void>;
}

export const PropostaDetalhesModal: React.FC<PropostaDetalhesModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onUpdateStatus,
  onConvertToCorporate,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [converting, setConverting] = useState(false);

  if (!isOpen || !proposal) return null;

  const publicUrl = `https://diskingressos.com.br/proposta/${proposal.publicToken || proposal.proposalNumber.toLowerCase()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, segue a Proposta Comercial nº ${proposal.proposalNumber} para o evento ${proposal.eventName}.\n\nTotal de Ingressos: ${proposal.totalTickets}\nValor Total: ${formatCurrency(proposal.totalAmount)}\nValidade: ${formatDate(proposal.validUntil)}\n\nConsulte a proposta formal na íntegra:\n${publicUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Proposta Comercial ${proposal.proposalNumber} - DiskIngressos - ${proposal.eventName}`);
    const body = encodeURIComponent(
      `Prezados,\n\nEncaminhamos em anexo os termos da proposta comercial nº ${proposal.proposalNumber} referente ao lote corporativo para o evento ${proposal.eventName}.\n\nValor Proposto: ${formatCurrency(proposal.totalAmount)}\nQuantidade de Ingressos: ${proposal.totalTickets}\nValidade da Proposta: ${formatDate(proposal.validUntil)}\n\nLink oficial da proposta:\n${publicUrl}\n\nFicamos à disposição para esclarecimentos.\nDiskIngressos Corporativo`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleConvert = async () => {
    if (!onConvertToCorporate) return;
    setConverting(true);
    try {
      await onConvertToCorporate(proposal);
      onClose();
    } finally {
      setConverting(false);
    }
  };

  const unitPrice = proposal.totalTickets > 0 ? proposal.totalAmount / proposal.totalTickets : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Header Actions (hidden on print) */}
        <div className="p-4 border-b border-[#37393e] flex items-center justify-between bg-[#232429] print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
              {proposal.proposalNumber}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                proposal.status === 'APROVADA'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : proposal.status === 'ENVIADA'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : proposal.status === 'RECUSADA'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-[#202124] text-slate-300 border border-[#37393e]'
              }`}
            >
              {proposal.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202124] hover:bg-[#35363c] text-slate-300 hover:text-white text-xs font-semibold border border-[#37393e] transition cursor-pointer"
              title="Copiar Link da Proposta"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-400 text-xs font-semibold transition cursor-pointer"
              title="Enviar no WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-400 text-xs font-semibold transition cursor-pointer"
              title="Enviar por E-mail"
            >
              <Send className="w-3.5 h-3.5" />
              <span>E-mail</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202124] hover:bg-[#35363c] text-white text-xs font-semibold border border-[#37393e] transition cursor-pointer"
              title="Imprimir ou Salvar PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#35363c] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs bg-[#202124] print:bg-white print:text-black">
          {/* Document Header */}
          <div className="border-b border-[#37393e] pb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black text-amber-400 tracking-tight">DiskIngressos</span>
                <span className="text-xs font-bold text-slate-400">| Portal do Produtor</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Divisão Comercial de Vendas Corporativas & Cotas de Patrocínio
              </p>
              <p className="text-[10px] text-slate-500">
                Disk Ingressos Entretenimento S.A. • CNPJ 07.892.412/0001-34
              </p>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold text-white block">{proposal.proposalNumber}</span>
              <span className="text-[11px] text-slate-400 block">Emitido em: {formatDate(proposal.createdAt)}</span>
              <span className="text-[11px] text-amber-400 font-semibold block">
                Válido até: {formatDate(proposal.validUntil)}
              </span>
            </div>
          </div>

          {/* Client & Event Info Box */}
          <div className="grid grid-cols-2 gap-4 bg-[#2c2d33] border border-[#37393e] p-4 rounded-lg print:border-slate-300 print:bg-slate-50">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Cliente / Solicitante:</span>
              <span className="text-sm font-bold text-white block">{proposal.clientName}</span>
              <span className="text-slate-400 text-[11px]">Conta Corporativa Cadastrada</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Evento Destino:</span>
              <span className="text-sm font-bold text-blue-400 block">{proposal.eventName}</span>
              <span className="text-slate-400 text-[11px]">Reserva de Lote / Setor Oficial</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Detalhamento da Cota / Ingressos</h4>
            <div className="border border-[#37393e] rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                    <th className="p-3 font-semibold">Descrição do Setor / Pacote</th>
                    <th className="p-3 font-semibold text-center">Quantidade</th>
                    <th className="p-3 font-semibold text-right">Valor Unitário</th>
                    <th className="p-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#37393e]">
                  <tr>
                    <td className="p-3 font-medium text-white">
                      <div>Lote Corporativo Exclusivo • {proposal.eventName}</div>
                      <div className="text-[10px] text-slate-400">Acesso exclusivo com credenciamento direto e suporte de portaria</div>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{proposal.totalTickets} un</td>
                    <td className="p-3 text-right font-mono text-slate-300">{formatCurrency(unitPrice)}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {formatCurrency(proposal.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 bg-[#2c2d33] border border-[#37393e] p-3 rounded-lg">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Subtotal Bruto:</span>
                <span className="font-mono text-slate-300">
                  {formatCurrency((proposal.totalAmount * (100 + proposal.discountRate)) / 100)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 text-[11px] font-semibold">
                <span>Desconto Aplicado ({proposal.discountRate}%):</span>
                <span className="font-mono">
                  - {formatCurrency(((proposal.totalAmount * (100 + proposal.discountRate)) / 100) - proposal.totalAmount)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#37393e] flex justify-between text-white font-extrabold text-sm">
                <span>Valor Final Líquido:</span>
                <span className="text-emerald-400 font-mono">{formatCurrency(proposal.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Commercial Terms & Conditions */}
          <div className="bg-[#2c2d33] border border-[#37393e] p-4 rounded-lg space-y-2 text-[11px] text-slate-400">
            <h5 className="font-bold text-white uppercase text-[10px]">Condições Comerciais & Pagamento:</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>{proposal.paymentTerms || 'Faturamento a prazo em até 15 dias corridos mediante aprovação cadastral e emissão de NF-e.'}</li>
              <li>A emissão dos e-tickets corporativos será liberada imediatamente após a confirmação do pagamento ou assinatura do pedido.</li>
              <li>Garantia de reserva do lote válida impreterivelmente até {formatDate(proposal.validUntil)}.</li>
              <li>{proposal.notes || 'Incluso suporte prioritário na entrada e credenciais digitais nominais.'}</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions (hidden on print) */}
        <div className="p-4 border-t border-[#37393e] flex items-center justify-between bg-[#232429] print:hidden">
          <div className="flex items-center gap-2">
            {proposal.status !== 'APROVADA' && onUpdateStatus && (
              <button
                onClick={() => onUpdateStatus('APROVADA')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar como Aprovada</span>
              </button>
            )}

            {proposal.status === 'APROVADA' && !proposal.corporateOrderId && onConvertToCorporate && (
              <button
                onClick={handleConvert}
                disabled={converting}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>{converting ? 'Convertendo...' : 'Converter em Pedido Corporativo'}</span>
              </button>
            )}

            {proposal.corporateOrderId && (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                Pedido Corporativo Gerado ({proposal.corporateOrderId})
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
