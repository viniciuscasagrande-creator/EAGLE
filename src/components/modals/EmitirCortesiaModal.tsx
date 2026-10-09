import React, { useState } from 'react';
import { X, Gift, CheckCircle2 } from 'lucide-react';
import { TicketSector } from '@/types/event';

interface EmitirCortesiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectors: TicketSector[];
  onConfirm: (courtesy: {
    guestName: string;
    email: string;
    sector: string;
    qty: number;
    authBy: string;
  }) => Promise<void>;
}

export const EmitirCortesiaModal: React.FC<EmitirCortesiaModalProps> = ({
  isOpen,
  onClose,
  sectors,
  onConfirm,
}) => {
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState(sectors[0]?.name || 'Pista Premium VIP');
  const [qty, setQty] = useState(2);
  const [authBy, setAuthBy] = useState('Diretoria Executiva');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        guestName,
        email,
        sector,
        qty: Number(qty),
        authBy,
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
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Emitir Cortesia VIP</h3>
            <p className="text-xs text-slate-400">
              Governança de ingressos cortesia e acessos autorizados
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nome do Convidado / Entidade *</label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Ex: João da Silva / TV Gazeta"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">E-mail para Envio do Ingresso *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="convidado@empresa.com.br"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Setor Autorizado *</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
              >
                {sectors.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Quantidade de Ingressos *</label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Autorizado por / Justificativa *</label>
            <input
              type="text"
              required
              value={authBy}
              onChange={(e) => setAuthBy(e.target.value)}
              placeholder="Ex: Contrato Patrocínio / Diretoria"
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
              <span>{submitting ? 'Emitindo...' : 'Emitir Cortesia'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
