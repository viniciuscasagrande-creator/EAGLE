import React, { useState } from 'react';
import {
  X,
  Handshake,
  Tag,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  Ticket,
  Calendar,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { CommercialPartner, PartnerSettlement } from '@/types/commercial';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface ParceiroDetalhesModalProps {
  partner: CommercialPartner | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: 'ACTIVE' | 'PAUSED') => Promise<void>;
  onSettleCommission?: (id: string, amount: number, notes?: string) => Promise<void>;
}

export const ParceiroDetalhesModal: React.FC<ParceiroDetalhesModalProps> = ({
  partner,
  isOpen,
  onClose,
  onUpdateStatus,
  onSettleCommission,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState('');
  const [settlementNotes, setSettlementNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSettlementForm, setShowSettlementForm] = useState(false);

  if (!isOpen || !partner) return null;

  const partnerLink = `https://diskingressos.com.br/evento/festival-2026?cupom=${partner.couponCode}&utm_source=parceiro&utm_medium=afiliado&utm_campaign=${partner.couponCode.toLowerCase()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(partnerLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(partner.couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleToggleStatus = async () => {
    if (!onUpdateStatus) return;
    const nextStatus = partner.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    await onUpdateStatus(partner.id, nextStatus);
  };

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSettleCommission || !settlementAmount) return;
    setIsSubmitting(true);
    try {
      await onSettleCommission(partner.id, Number(settlementAmount), settlementNotes);
      setSettlementAmount('');
      setSettlementNotes('');
      setShowSettlementForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commissionEarned = partner.commissionEarned || 0;
  const commissionPaid = partner.commissionPaid || 0;
  const balanceToPay = Math.max(0, commissionEarned - commissionPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#37393e] flex items-center justify-between bg-[#232429]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">{partner.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    partner.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {partner.status === 'ACTIVE' ? 'Ativo' : 'Pausado'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {partner.category || 'Parceiro / Convênio'} • {partner.contactName || 'Contato Institucional'}
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* UTM & Coupon Box */}
          <div className="bg-[#202124] border border-[#37393e] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-blue-400" />
                <span>Cupom & Link de Rastreabilidade</span>
              </h4>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCoupon}
                  className="px-2.5 py-1 rounded bg-[#2c2d33] hover:bg-[#35363c] text-blue-400 font-bold border border-[#37393e] flex items-center gap-1 cursor-pointer transition"
                >
                  {copiedCoupon ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoupon ? 'Copiado' : partner.couponCode}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">Link de Divulgação Oficial com UTM:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={partnerLink}
                  className="flex-1 bg-[#17181c] border border-[#37393e] rounded-lg px-3 py-2 text-white font-mono text-[11px] select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance KPIs */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#202124] border border-[#37393e] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Ingressos Vendidos</span>
              <span className="text-base font-extrabold text-blue-400">{partner.ticketsSold || 0} un</span>
            </div>
            <div className="bg-[#202124] border border-[#37393e] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Faturamento Gerado</span>
              <span className="text-base font-extrabold text-emerald-400">
                {formatCurrency(partner.grossSalesGenerated || 0)}
              </span>
            </div>
            <div className="bg-[#202124] border border-[#37393e] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Comissão Devida Total</span>
              <span className="text-base font-extrabold text-white">{formatCurrency(commissionEarned)}</span>
            </div>
            <div className="bg-[#202124] border border-[#37393e] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Saldo a Liquidar</span>
              <span className="text-base font-extrabold text-amber-400">{formatCurrency(balanceToPay)}</span>
            </div>
          </div>

          {/* Commission Settlement Box */}
          <div className="bg-[#202124] border border-[#37393e] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Acerto de Contas & Pagamento de Comissão</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Taxa de comissão acordada: <strong className="text-white">{partner.commissionRate || 0}%</strong> sobre vendas líquidas
                </p>
              </div>

              {balanceToPay > 0 && !showSettlementForm && (
                <button
                  onClick={() => {
                    setSettlementAmount(String(balanceToPay));
                    setShowSettlementForm(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Registrar Pagamento de Comissão</span>
                </button>
              )}
            </div>

            {/* Settle Form */}
            {showSettlementForm && (
              <form onSubmit={handleSettle} className="bg-[#17181c] p-3 rounded-lg border border-[#37393e] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Valor do Pagamento (R$) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={balanceToPay}
                      step="0.01"
                      value={settlementAmount}
                      onChange={(e) => setSettlementAmount(e.target.value)}
                      className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Observações / Comprovante PIX</label>
                    <input
                      type="text"
                      placeholder="Ex: Pago via PIX banco Itaú"
                      value={settlementNotes}
                      onChange={(e) => setSettlementNotes(e.target.value)}
                      className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSettlementForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#202124] text-slate-300 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {isSubmitting ? 'Salvando...' : 'Confirmar Baixa do Pagamento'}
                  </button>
                </div>
              </form>
            )}

            {/* Settlements History */}
            {partner.settlements && partner.settlements.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Histórico de Quitações Anteriores</span>
                <div className="border border-[#37393e] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-[#232429] text-slate-400 border-b border-[#37393e]">
                        <th className="p-2">Data</th>
                        <th className="p-2">Recibo</th>
                        <th className="p-2">Descrição</th>
                        <th className="p-2 text-right">Valor Pago</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#37393e]">
                      {partner.settlements.map((s) => (
                        <tr key={s.id}>
                          <td className="p-2 text-slate-300">{formatDate(s.date)}</td>
                          <td className="p-2 font-mono text-blue-400">{s.receiptNumber}</td>
                          <td className="p-2 text-slate-400">{s.notes}</td>
                          <td className="p-2 text-right font-bold text-emerald-400">{formatCurrency(s.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#37393e] flex items-center justify-between bg-[#232429]">
          {onUpdateStatus && (
            <button
              onClick={handleToggleStatus}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                partner.status === 'ACTIVE'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {partner.status === 'ACTIVE' ? 'Pausar Convênio Temporariamente' : 'Reativar Convênio'}
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#202124] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
