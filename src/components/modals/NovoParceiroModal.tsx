import React, { useState } from 'react';
import { X, Handshake, CheckCircle2 } from 'lucide-react';

interface NovoParceiroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (partner: {
    name: string;
    category: string;
    couponCode: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    commissionRate: number;
  }) => Promise<void>;
}

export const NovoParceiroModal: React.FC<NovoParceiroModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Grêmio Corporativo');
  const [couponCode, setCouponCode] = useState('');
  const [discountType] = useState<'PERCENT'>('PERCENT');
  const [discountValue, setDiscountValue] = useState(15);
  const [commissionRate, setCommissionRate] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        name,
        category,
        couponCode: couponCode.toUpperCase().replace(/\s+/g, ''),
        discountType,
        discountValue: Number(discountValue),
        commissionRate: Number(commissionRate),
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
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cadastrar Parceiro / Convênio</h3>
            <p className="text-xs text-slate-400">
              Associação, conselho de classe ou clube de benefícios
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nome da Entidade / Parceiro *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Associação dos Servidores Municipais"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Categoria de Parceria *</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Grêmio Corporativo / Clube de Assinantes"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Código do Cupom de Desconto *</label>
            <input
              type="text"
              required
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Ex: CONVENIO15"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono uppercase focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Desconto (%)</label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Comissão (%)</label>
              <input
                type="number"
                min={0}
                max={30}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
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
              <span>{submitting ? 'Salvando...' : 'Cadastrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
