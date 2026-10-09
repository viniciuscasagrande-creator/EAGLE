import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { EventWalletPosition, PayoutRequest } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';
import { X, DollarSign, ShieldAlert, CheckCircle2, Building, AlertTriangle } from 'lucide-react';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: EventWalletPosition;
  onSuccess: (newRequest: PayoutRequest) => void;
}

export const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onSuccess,
}) => {
  const { producer } = useAuth();
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const requestedAmount = parseFloat(amountStr) || 0;
  const isExceeded = requestedAmount > wallet.balanceAvailable;
  const isValid = requestedAmount > 0 && !isExceeded;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const producerId = producer?.id || (typeof window !== 'undefined' ? localStorage.getItem('producer_id') : null) || 'prod-01';

    try {
      const res = await keeperAdapter.requestPayout(producerId, wallet.eventId, {
        amount: requestedAmount,
        paymentMethod: 'PIX',
        notes,
      });

      onSuccess(res);
      onClose();
    } catch (err: any) {
      // Regra de auditoria: NUNCA simular repasse silenciosamente em caso de erro!
      setErrorMsg(
        `Falha na comunicação com o Keeper ERP: ${err.message || 'Erro de rede ou recusa pelo motor contábil'}. A solicitação NÃO foi registrada. Nenhuma alteração foi realizada em seu saldo.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] w-full max-w-lg rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#37393e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Solicitar Repasse Financeiro
              </h3>
              <p className="text-xs text-slate-400">
                {wallet.eventName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#35363c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Official Keeper Balances Summary */}
          <div className="bg-[#232429] rounded-lg p-3.5 border border-[#37393e] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Vendas Brutas Acumuladas:</span>
              <span className="font-semibold text-white">{formatCurrency(wallet.grossTicketSales)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Deduções Oficiais (Taxas + Despesas):</span>
              <span className="font-semibold text-rose-400">
                - {formatCurrency(wallet.diskFeeTotal + wallet.spreadFeeTotal + wallet.expensesTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Repasses Já Executados:</span>
              <span className="font-semibold text-slate-300">
                - {formatCurrency(wallet.repaymentsPaidTotal)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#37393e] flex justify-between items-center text-sm">
              <span className="font-bold text-white">Saldo Disponível para Repasse:</span>
              <span className="font-extrabold text-emerald-400 text-base">
                {formatCurrency(wallet.balanceAvailable)}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Valor Solicitado (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="10"
                max={wallet.balanceAvailable}
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0,00"
                className={`w-full bg-[#202124] text-white font-bold text-lg pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none transition-all ${
                  isExceeded
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-[#37393e] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
            </div>
            {isExceeded && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                O valor solicitado excede o saldo disponível de {formatCurrency(wallet.balanceAvailable)}.
              </p>
            )}
          </div>

          {/* Destination Account info */}
          <div className="p-3 bg-[#232429] border border-[#37393e] rounded-lg text-xs space-y-1">
            <div className="font-bold text-blue-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              Conta Bancária e Chave PIX Cadastrada
            </div>
            <div className="text-slate-300">
              {producer?.bankName || 'Itaú Unibanco S.A.'} • Agência: {producer?.agency || '0422'} • Conta: {producer?.account || '88120-1'}
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Chave PIX: {producer?.pixKey || producer?.email || 'financeiro@abcproducoes.com.br'}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Observações ou Justificativa (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Liberação programada conforme contrato para pagamento de fornecedor..."
              className="w-full bg-[#202124] text-xs text-white p-3 rounded-lg border border-[#37393e] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 p-2.5 bg-[#202124] rounded-lg border border-[#37393e]">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Atenção:</strong> Por governança da DiskIngressos, as solicitações são analisadas e autorizadas pela Controladoria Financeira no Keeper ERP antes do envio à câmara bancária.
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 animate-in fade-in duration-200">
              <div className="font-bold text-rose-200 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                Erro na Solicitação de Repasse
              </div>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#37393e] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submetendo ao Keeper...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enviar Solicitação ao Keeper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
