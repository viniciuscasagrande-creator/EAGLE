import React, { useState, useEffect } from 'react';
import { Producer } from '@/types/producer';
import { X, Building2, Percent, DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface EditarProdutoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  producer: Producer | null;
  onSave: (producerId: string, updates: Partial<Producer>) => void;
}

export const EditarProdutoraModal: React.FC<EditarProdutoraModalProps> = ({
  isOpen,
  onClose,
  producer,
  onSave,
}) => {
  const [commissionRate, setCommissionRate] = useState<number>(8.5);
  const [maxAdvanceLimit, setMaxAdvanceLimit] = useState<number>(400000);
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'INACTIVE'>('ACTIVE');
  const [kycStatus, setKycStatus] = useState<'VERIFIED' | 'PENDING' | 'REJECTED'>('VERIFIED');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (producer) {
      setCommissionRate(producer.commissionRate ?? 8.5);
      setMaxAdvanceLimit(producer.maxAdvanceLimit ?? 400000);
      setStatus(producer.status ?? 'ACTIVE');
      setKycStatus(producer.kycStatus ?? 'VERIFIED');
      setSavedSuccess(false);
    }
  }, [producer, isOpen]);

  if (!isOpen || !producer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(producer.id, {
      commissionRate,
      maxAdvanceLimit,
      status,
      kycStatus,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#141b2d] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Editar Condições Comerciais
              </h2>
              <p className="text-xs text-slate-400">
                {producer.name} • CNPJ: {producer.cnpj}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Condições comerciais atualizadas com sucesso no Keeper Core!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Taxa de Comissão DiskIngressos (Take Rate %)
            </label>
            <div className="relative">
              <Percent className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.1"
                min="1"
                max="25"
                required
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Percentual retido automaticamente pelo Ledger do Keeper a cada ingresso vendido.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Limite Máximo de Antecipação de Crédito (R$)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="1000"
                min="0"
                required
                value={maxAdvanceLimit}
                onChange={(e) => setMaxAdvanceLimit(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Teto global aprovado para operações de antecipação e fomento à produção.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Operacional
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-purple-500 transition"
              >
                <option value="ACTIVE">Ativo / Regular</option>
                <option value="SUSPENDED">Suspenso / Bloqueado</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Conformidade KYC & Compliance
              </label>
              <select
                value={kycStatus}
                onChange={(e) => setKycStatus(e.target.value as any)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-purple-500 transition"
              >
                <option value="VERIFIED">Verificado & Aprovado</option>
                <option value="PENDING">Pendente de Documentação</option>
                <option value="REJECTED">Rejeitado</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition cursor-pointer disabled:opacity-50"
            >
              Salvar Alterações Contratuais
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
