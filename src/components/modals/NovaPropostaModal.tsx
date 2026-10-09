import React, { useState } from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { CommercialProposal } from '@/types/commercial';

interface NovaPropostaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (proposal: Partial<CommercialProposal>) => Promise<void>;
}

export const NovaPropostaModal: React.FC<NovaPropostaModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [clientName, setClientName] = useState('');
  const [eventName, setEventName] = useState('Festival de Verão Curitiba 2026');
  const [totalTickets, setTotalTickets] = useState(100);
  const [totalAmount, setTotalAmount] = useState(35000);
  const [discountRate, setDiscountRate] = useState(10);
  const [validUntil, setValidUntil] = useState('2026-11-30');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        clientName,
        eventName,
        totalTickets: Number(totalTickets),
        totalAmount: Number(totalAmount),
        discountRate: Number(discountRate),
        validUntil,
      });
      onClose();
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nova Proposta Comercial</h3>
            <p className="text-xs text-slate-400">
              Emissão de orçamento formal para pacotes corporativos e cotas
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-slate-300 font-semibold block mb-1">Empresa / Razão Social *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Electrolux do Brasil S.A."
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-slate-300 font-semibold block mb-1">Evento Vinculado *</label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Quantidade de Ingressos *</label>
              <input
                type="number"
                required
                min={1}
                value={totalTickets}
                onChange={(e) => setTotalTickets(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Valor Total Líquido (R$) *</label>
              <input
                type="number"
                required
                min={100}
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Desconto Aplicado (%)</label>
              <input
                type="number"
                min={0}
                max={50}
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Validade da Proposta</label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
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
              <span>{submitting ? 'Gerando...' : 'Emitir Proposta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
