import React, { useState } from 'react';
import { X, Award, CheckCircle2 } from 'lucide-react';

interface NovoAfiliadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (affiliate: {
    name: string;
    code: string;
    commissionRate: number;
  }) => Promise<void>;
}

export const NovoAfiliadoModal: React.FC<NovoAfiliadoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [commissionRate, setCommissionRate] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        name,
        code: code.toUpperCase().replace(/\s+/g, ''),
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
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cadastrar Promoter / Afiliado</h3>
            <p className="text-xs text-slate-400">
              Rastreamento de vendas e comissionamento por link exclusivo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nome do Promoter / Canal *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Beatriz Promoter Curitiba"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Código de Rastreio Único *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: BIAPROMO"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono uppercase focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Comissão por Ingresso Vendido (%)</label>
            <input
              type="number"
              required
              min={1}
              max={30}
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Salvando...' : 'Cadastrar Promoter'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
