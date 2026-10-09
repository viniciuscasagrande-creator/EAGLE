import React, { useState } from 'react';
import { X, Tag, CheckCircle2 } from 'lucide-react';

interface NovoCupomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (coupon: {
    code: string;
    discount: string;
    event: string;
    maxUses: number;
  }) => Promise<void>;
}

export const NovoCupomModal: React.FC<NovoCupomModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('15%');
  const [event, setEvent] = useState('Festival de Verão Curitiba 2026');
  const [maxUses, setMaxUses] = useState(200);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        code: code.toUpperCase().replace(/\s+/g, ''),
        discount,
        event,
        maxUses: Number(maxUses),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Criar Cupom Promocional</h3>
            <p className="text-xs text-slate-400">
              Desconto percentual ou valor fixo para conversão imediata
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Código do Cupom *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: FESTIVALVIP20"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Desconto Oferecido *</label>
            <input
              type="text"
              required
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Ex: 15% ou R$ 25,00"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Evento Vinculado *</label>
            <input
              type="text"
              required
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Limite Máximo de Resgates *</label>
            <input
              type="number"
              required
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
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
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Salvando...' : 'Criar Cupom'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
