import React, { useState } from 'react';
import { RecoveryOpportunity } from '@/types/remarketing';
import { formatCurrency } from '@/utils/formatters';
import { X, QrCode, Copy, Check, ShieldCheck } from 'lucide-react';

interface PixRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: RecoveryOpportunity | null;
}

export const PixRecoveryModal: React.FC<PixRecoveryModalProps> = ({
  isOpen,
  onClose,
  opportunity,
}) => {
  if (!isOpen || !opportunity) return null;

  const [copied, setCopied] = useState(false);
  const pixCode =
    opportunity.pixKey ||
    `00020126580014br.gov.bcb.pix0136${opportunity.id}-disk520400005303986540${opportunity.cartValue.toFixed(2)}5802BR5913DiskIngressos`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
        <div className="p-5 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Chave PIX de Recuperação
              </h3>
              <p className="text-[11px] text-slate-400">
                {opportunity.customerName} • {formatCurrency(opportunity.cartValue)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="bg-[#202124] p-3.5 rounded-lg border border-[#37393e] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Evento:</span>
              <span className="font-semibold text-white">{opportunity.eventName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Itens / Setor:</span>
              <span className="font-semibold text-white">{opportunity.itemsDescription}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">WhatsApp do Cliente:</span>
              <span className="font-mono text-emerald-400">{opportunity.customerPhone}</span>
            </div>
            <div className="pt-2 border-t border-[#37393e] flex justify-between items-center">
              <span className="font-bold text-white">Total a Pagar:</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                {formatCurrency(opportunity.cartValue)}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Código PIX Copia-e-Cola (Gerado pelo Gateway Oficial)
            </label>
            <div className="relative">
              <textarea
                readOnly
                rows={3}
                value={pixCode}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-slate-300 font-mono text-[11px] resize-none select-all focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Validade: 30 minutos</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-md'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Código Copiado!' : 'Copiar Chave PIX'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
