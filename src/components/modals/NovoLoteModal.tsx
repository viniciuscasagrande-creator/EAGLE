import React, { useState } from 'react';
import { X, Ticket, Layers, DollarSign, CheckCircle2 } from 'lucide-react';
import { TicketSector } from '@/types/event';

interface NovoLoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectors: TicketSector[];
  onConfirm: (tier: {
    sectorId: string;
    batchName: string;
    price: number;
    totalQuantity: number;
  }) => Promise<void>;
}

export const NovoLoteModal: React.FC<NovoLoteModalProps> = ({
  isOpen,
  onClose,
  sectors,
  onConfirm,
}) => {
  const [sectorId, setSectorId] = useState(sectors[0]?.id || '');
  const [batchName, setBatchName] = useState('Lote 2 (Geral)');
  const [price, setPrice] = useState(140);
  const [totalQuantity, setTotalQuantity] = useState(500);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        sectorId: sectorId || sectors[0]?.id,
        batchName,
        price: Number(price),
        totalQuantity: Number(totalQuantity),
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
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Configurar Novo Lote</h3>
            <p className="text-xs text-slate-400">
              Abertura de nova cota comercial e virada de lote
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Setor do Evento *</label>
            <select
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Atual: {s.soldCount}/{s.totalCapacity} un)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nome do Lote *</label>
            <input
              type="text"
              required
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="Ex: Lote 2 - Promocional"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Preço Unitário (R$) *</label>
              <input
                type="number"
                required
                min={1}
                step={0.5}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Quantidade de Ingressos *</label>
              <input
                type="number"
                required
                min={10}
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-[#202124] border border-[#37393e] rounded-lg text-slate-300 text-[11px] flex justify-between">
            <span>Faturamento potencial do lote:</span>
            <span className="font-bold text-emerald-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price * totalQuantity)}
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
              <span>{submitting ? 'Salvando...' : 'Criar Lote'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
