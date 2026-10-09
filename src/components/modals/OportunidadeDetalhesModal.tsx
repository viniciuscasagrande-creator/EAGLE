import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  Building,
  Calendar,
  DollarSign,
  Ticket,
  User,
  ArrowRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { CommercialOpportunity } from '@/types/commercial';
import { formatCurrency } from '@/utils/formatters';

interface OportunidadeDetalhesModalProps {
  opportunity: CommercialOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<CommercialOpportunity>) => Promise<void>;
  onConvertToProposal?: (opp: CommercialOpportunity) => void;
}

const STAGES: { id: CommercialOpportunity['stage']; label: string; color: string }[] = [
  { id: 'PROSPECCAO', label: 'Prospecção', color: 'bg-blue-500' },
  { id: 'PROPOSTA_ENVIADA', label: 'Proposta Enviada', color: 'bg-indigo-500' },
  { id: 'NEGOCIACAO', label: 'Negociação', color: 'bg-amber-500' },
  { id: 'FECHADO_GANHO', label: 'Fechado / Ganho', color: 'bg-emerald-500' },
  { id: 'FECHADO_PERDIDO', label: 'Fechado / Perdido', color: 'bg-rose-500' },
];

export const OportunidadeDetalhesModal: React.FC<OportunidadeDetalhesModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSave,
  onConvertToProposal,
}) => {
  const [title, setTitle] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [ticketsQuantity, setTicketsQuantity] = useState(0);
  const [stage, setStage] = useState<CommercialOpportunity['stage']>('PROSPECCAO');
  const [probability, setProbability] = useState(50);
  const [assignedTo, setAssignedTo] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lossReason, setLossReason] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setTitle(opportunity.title);
      setEstimatedValue(opportunity.estimatedValue);
      setTicketsQuantity(opportunity.ticketsQuantity || 50);
      setStage(opportunity.stage);
      setProbability(opportunity.probability);
      setAssignedTo(opportunity.assignedTo);
      setCloseDate(opportunity.closeDate || new Date().toISOString().split('T')[0]);
      setNotes(opportunity.notes || '');
      setLossReason(opportunity.lossReason || '');
    }
  }, [opportunity]);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title,
        estimatedValue: Number(estimatedValue),
        ticketsQuantity: Number(ticketsQuantity),
        stage,
        probability: stage === 'FECHADO_GANHO' ? 100 : stage === 'FECHADO_PERDIDO' ? 0 : Number(probability),
        assignedTo,
        closeDate,
        notes,
        lossReason: stage === 'FECHADO_PERDIDO' ? lossReason : undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#37393e] flex items-center justify-between bg-[#232429]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Editar Negócio / Oportunidade</h3>
              <p className="text-xs text-slate-400">
                {opportunity.clientName} • {opportunity.eventName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#35363c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Stage Selector Pills */}
          <div>
            <label className="text-slate-300 font-semibold block mb-2">Etapa Atual do Pipeline *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STAGES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    setStage(s.id);
                    if (s.id === 'FECHADO_GANHO') setProbability(100);
                    if (s.id === 'FECHADO_PERDIDO') setProbability(0);
                  }}
                  className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                    stage === s.id
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-[#202124] border-[#37393e] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{s.label}</span>
                  {stage === s.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Loss Reason (if lost) */}
          {stage === 'FECHADO_PERDIDO' && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 space-y-1.5 animate-in fade-in">
              <label className="text-rose-300 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Motivo da Perda do Negócio *</span>
              </label>
              <select
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className="w-full bg-[#202124] border border-rose-500/40 rounded-lg p-2 text-white focus:outline-none"
                required
              >
                <option value="">Selecione o motivo...</option>
                <option value="Preço acima do orçamento">Preço acima do orçamento do cliente</option>
                <option value="Optou por outro evento/concorrente">Optou por outro evento/concorrente</option>
                <option value="Cancelamento de verba interna corporativa">Cancelamento de verba interna corporativa</option>
                <option value="Data ou local incompatível">Data ou local incompatível</option>
                <option value="Sem retorno do cliente / Lead frio">Sem retorno do cliente / Lead frio</option>
                <option value="Outro motivo">Outro motivo</option>
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Título da Negociação *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Values & Probability */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Valor Estimado (R$) *</label>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Ingressos Previstos</label>
              <input
                type="number"
                min={1}
                value={ticketsQuantity}
                onChange={(e) => setTicketsQuantity(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Probabilidade</label>
                <span className="font-mono text-emerald-400 font-bold">{probability}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                disabled={stage === 'FECHADO_GANHO' || stage === 'FECHADO_PERDIDO'}
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Assigned & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Responsável Comercial *</label>
              <input
                type="text"
                required
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Previsão de Fechamento</label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Anotações do Deal / Próximos Passos</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Reunião agendada com diretoria de compras na quinta-feira..."
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#37393e] flex items-center justify-between">
            {onConvertToProposal && stage !== 'FECHADO_PERDIDO' ? (
              <button
                type="button"
                onClick={() => {
                  onConvertToProposal(opportunity);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#232429] hover:bg-[#35363c] text-indigo-300 hover:text-white rounded-lg border border-indigo-500/30 transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Emitir Proposta Formal</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-[#202124] hover:bg-[#35363c] text-slate-300 text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
