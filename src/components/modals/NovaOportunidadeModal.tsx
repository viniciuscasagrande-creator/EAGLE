import React, { useState } from 'react';
import { X, Target, DollarSign, CheckCircle2 } from 'lucide-react';
import { CommercialOpportunity } from '@/types/commercial';

interface NovaOportunidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (opportunity: Partial<CommercialOpportunity>) => Promise<void>;
}

export const NovaOportunidadeModal: React.FC<NovaOportunidadeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [eventName, setEventName] = useState('Festival de Verão Curitiba 2026');
  const [stage, setStage] = useState<CommercialOpportunity['stage']>('PROSPECCAO');
  const [estimatedValue, setEstimatedValue] = useState(30000);
  const [ticketsQuantity, setTicketsQuantity] = useState(50);
  const [probability, setProbability] = useState(30);
  const [closeDate, setCloseDate] = useState('2026-11-20');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        title,
        clientName,
        eventName,
        stage,
        estimatedValue: Number(estimatedValue),
        ticketsQuantity: Number(ticketsQuantity),
        probability: Number(probability),
        closeDate,
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
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nova Oportunidade Comercial</h3>
            <p className="text-xs text-slate-400">
              Pipeline de vendas em lote, cotas corporativas e patrocínios
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Título da Negociação *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Cota Patrocínio Master / Camarote Corporativo"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Empresa / Cliente *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Banco Santander S.A."
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
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
              <label className="text-slate-300 font-semibold block mb-1">Valor Estimado (R$) *</label>
              <input
                type="number"
                required
                min={100}
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Qtd. Ingressos Estimada</label>
              <input
                type="number"
                min={1}
                value={ticketsQuantity}
                onChange={(e) => setTicketsQuantity(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Etapa do Funil</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="PROSPECCAO">Prospecção</option>
                <option value="PROPOSTA_ENVIADA">Proposta Enviada</option>
                <option value="NEGOCIACAO">Negociação</option>
                <option value="FECHADO_GANHO">Fechado / Ganho</option>
                <option value="FECHADO_PERDIDO">Fechado / Perdido</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Probabilidade (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
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
              <span>{submitting ? 'Salvando...' : 'Adicionar Oportunidade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
