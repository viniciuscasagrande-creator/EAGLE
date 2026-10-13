import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ThumbsDown } from 'lucide-react';
import { CommercialOpportunity } from '@/types/commercial';
import { formatCurrency } from '@/utils/formatters';

interface MotivoPerdaModalProps {
  opportunity: CommercialOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (opportunityId: string, reason: string, notes?: string) => Promise<void>;
}

const LOSS_REASONS = [
  { id: 'PRECO_ELEVADO', label: 'Preço / Custo Elevado (Fora do Budget)' },
  { id: 'CONCORRENCIA', label: 'Fechou com Concorrente / Outro Evento' },
  { id: 'CANCELAMENTO_CLIENTE', label: 'Cliente Cancelou a Ação Corporativa' },
  { id: 'FALTA_APROVACAO_DIRETORIA', label: 'Diretoria / Comitê Reprovou a Verba' },
  { id: 'DATA_INCOMPATIVEL', label: 'Data do Evento Incompatível com a Empresa' },
  { id: 'SEM_RETORNO', label: 'Contato Esfriou / Sem Resposta após Proposta' },
  { id: 'OUTRO', label: 'Outro Motivo Específico' },
];

export const MotivoPerdaModal: React.FC<MotivoPerdaModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState(LOSS_REASONS[0].label);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullReason = additionalNotes.trim()
        ? `${selectedReason}: ${additionalNotes.trim()}`
        : selectedReason;
      await onConfirm(opportunity.id, fullReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#37393e] flex items-center justify-between bg-[#232429]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ThumbsDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Registrar Perda de Oportunidade</h3>
              <p className="text-[11px] text-slate-400">Qualificação para análise de churn e funil</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#35363c] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Opportunity Target Strip */}
        <div className="p-3.5 bg-[#202124] border-b border-[#37393e] text-xs space-y-1">
          <div className="text-white font-bold truncate">{opportunity.title}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{opportunity.clientName}</span>
            <span className="text-rose-400 font-bold">{formatCurrency(opportunity.estimatedValue)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Motivo Principal da Perda:
            </label>
            <div className="space-y-1.5">
              {LOSS_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${
                    selectedReason === r.label
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-[#202124] border-[#37393e] text-slate-300 hover:bg-[#25262c]'
                  }`}
                >
                  <input
                    type="radio"
                    name="lossReason"
                    value={r.label}
                    checked={selectedReason === r.label}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-rose-500"
                  />
                  <span className="text-xs">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Observações / Feedback do Cliente (Opcional):
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Ex: O cliente achou o valor da cota alto e optou por esperar a virada do semestre..."
              className="w-full bg-[#202124] text-xs text-white p-2.5 rounded-lg border border-[#37393e] focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-[#202124] hover:bg-[#35363c] text-slate-300 text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Confirmar Fechado / Perdido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
