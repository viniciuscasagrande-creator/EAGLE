import React, { useState } from 'react';
import { X, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { EventWalletPosition } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

interface SolicitarAntecipacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: EventWalletPosition[];
  onConfirm: (payload: { eventId: string; requestedAmount: number }) => Promise<void>;
  initialAmount?: number;
  initialEventId?: string;
}

export const SolicitarAntecipacaoModal: React.FC<SolicitarAntecipacaoModalProps> = ({
  isOpen,
  onClose,
  wallets,
  onConfirm,
  initialAmount,
  initialEventId,
}) => {
  const [selectedEventId, setSelectedEventId] = useState(initialEventId || wallets[0]?.eventId || 'ev-101');
  const [amount, setAmount] = useState(initialAmount || 30000);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialEventId) setSelectedEventId(initialEventId);
      if (initialAmount) setAmount(initialAmount);
    }
  }, [isOpen, initialAmount, initialEventId]);

  if (!isOpen) return null;

  const currentWallet = wallets.find((w) => w.eventId === selectedEventId) || wallets[0];
  const maxAvailable = currentWallet
    ? Math.max(0, currentWallet.grossTicketSales * 0.7 - currentWallet.advancesPaidTotal)
    : 100000;

  const advanceFeeRate = 2.5; // 2.5%
  const feeCost = (amount * advanceFeeRate) / 100;
  const netDeposit = Math.max(0, amount - feeCost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (amount <= 0) {
      setError('Informe um valor maior que zero.');
      return;
    }
    if (amount > maxAvailable) {
      setError(`O valor solicitado excede o limite disponível para este evento (${formatCurrency(maxAvailable)}).`);
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm({
        eventId: selectedEventId,
        requestedAmount: Number(amount),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao solicitar antecipação no Keeper ERP.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Solicitar Antecipação de Recebíveis</h3>
            <p className="text-xs text-slate-400">
              Crédito rotativo oficial com análise do Comitê Keeper ERP
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Evento de Referência *</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              {wallets.map((w) => (
                <option key={w.eventId} value={w.eventId}>
                  {w.eventName} (Venda Bruta: {formatCurrency(w.grossTicketSales)})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#202124] border border-[#37393e] rounded-lg space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>Limite Máximo de Antecipação (70%):</span>
              <span className="font-bold text-emerald-400">{formatCurrency(maxAvailable)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Antecipações Ativas na Carteira:</span>
              <span>{formatCurrency(currentWallet?.advancesPaidTotal || 0)}</span>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Valor a Antecipar (R$) *</label>
            <input
              type="number"
              required
              min={1000}
              max={maxAvailable}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-1.5 text-slate-300">
            <div className="flex justify-between items-center">
              <span>Custo de Antecipação ({advanceFeeRate}%):</span>
              <span className="font-semibold text-rose-400">- {formatCurrency(feeCost)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-blue-500/20 text-white font-bold">
              <span>Líquido a ser Creditado:</span>
              <span className="text-emerald-400 font-mono text-sm">{formatCurrency(netDeposit)}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              A solicitação gerará uma chave de idempotência exclusiva e será encaminhada para homologação da tesouraria no Keeper ERP.
            </span>
          </div>

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white bg-[#202124] rounded-lg border border-[#37393e] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submetendo ao Keeper...' : 'Confirmar Solicitação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
