import React, { useState } from 'react';
import { CreditAdvanceRequest } from '@/types/producer';
import { X, ShieldAlert, CheckCircle2, XCircle, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

interface DecisaoAntecipacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: CreditAdvanceRequest | null;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const DecisaoAntecipacaoModal: React.FC<DecisaoAntecipacaoModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  const [decisionMode, setDecisionMode] = useState<'VIEW' | 'APPROVE' | 'REJECT'>('VIEW');
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [processed, setProcessed] = useState(false);

  if (!isOpen || !request) return null;

  const handleApprove = () => {
    onApprove(request.id, notes);
    setProcessed(true);
    setTimeout(() => {
      setProcessed(false);
      setDecisionMode('VIEW');
      onClose();
    }, 1200);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(request.id, rejectReason);
    setProcessed(true);
    setTimeout(() => {
      setProcessed(false);
      setDecisionMode('VIEW');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#141b2d] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-tight">
                  Comitê de Crédito DiskIngressos
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {request.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {request.producerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {processed && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Decisão do comitê registrada e sincronizada com o Ledger do Keeper ERP!</span>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400">Valor Solicitado Bruto:</span>
              <div className="text-base font-extrabold text-white">
                R$ {request.requestedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Líquido a Desembolsar:</span>
              <div className="text-base font-extrabold text-emerald-400">
                R$ {request.netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">Taxa de Deságio:</span>
              <div className="text-xs font-bold text-amber-400">
                {request.discountFeePercentage}% a.m.
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">Garantia Futura Livre:</span>
              <div className="text-xs font-bold text-cyan-400">
                R$ {request.availableBalanceFuture.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Event & Producer Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Eventos Vinculados como Garantia:</span>
              <span className="font-semibold text-slate-200">{request.eventNames.join(', ')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Chave PIX de Liquidação:</span>
              <span className="font-mono text-slate-300">{request.pixKey}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Classificação de Risco de Crédito:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                request.riskScore === 'LOW'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : request.riskScore === 'MEDIUM'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                RISCO {request.riskScore === 'LOW' ? 'BAIXO (Aprovável)' : request.riskScore === 'MEDIUM' ? 'MÉDIO' : 'ALTO'}
              </span>
            </div>
          </div>

          {/* Action Modes */}
          {decisionMode === 'APPROVE' && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <label className="block text-xs font-semibold text-emerald-300">
                Parecer de Aprovação e Instrução de Pagamento PIX:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Margem de ingressos confirmada. Aprovado para liquidação bancária imediata."
                className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDecisionMode('VIEW')}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30"
                >
                  Confirmar Aprovação
                </button>
              </div>
            </div>
          )}

          {decisionMode === 'REJECT' && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <label className="block text-xs font-semibold text-rose-300">
                Justificativa Formal de Recusa (visível à produtora):
              </label>
              <textarea
                rows={2}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Margem futura insuficiente ou volume de devoluções elevado nos últimos 15 dias."
                className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDecisionMode('VIEW')}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 disabled:opacity-50"
                >
                  Confirmar Recusa
                </button>
              </div>
            </div>
          )}

          {decisionMode === 'VIEW' && request.status === 'PENDING_APPROVAL' && (
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDecisionMode('REJECT')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Recusar Antecipação
              </button>
              <button
                type="button"
                onClick={() => setDecisionMode('APPROVE')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Aprovar & Liberar Repasse
              </button>
            </div>
          )}

          {request.status !== 'PENDING_APPROVAL' && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              Esta solicitação já foi concluída com status: <strong className="text-white">{request.status}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
