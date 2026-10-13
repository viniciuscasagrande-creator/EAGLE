import React, { useState } from 'react';
import { ProducerCommercialSummary } from '@/types/commercial';
import {
  X,
  Percent,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface SimuladorCreditoComercialModalProps {
  isOpen: boolean;
  onClose: () => void;
  producer: ProducerCommercialSummary | null;
  onSubmitToCreditCommittee: (request: any) => void;
  onSendWhatsApp: (phone: string, text: string) => void;
}

export const SimuladorCreditoComercialModal: React.FC<SimuladorCreditoComercialModalProps> = ({
  isOpen,
  onClose,
  producer,
  onSubmitToCreditCommittee,
  onSendWhatsApp,
}) => {
  const [requestedAmount, setRequestedAmount] = useState<number>(100000);
  const [discountRate, setDiscountRate] = useState<number>(3.2);
  const [monthsTerm, setMonthsTerm] = useState<number>(1);
  const [submittedToCommittee, setSubmittedToCommittee] = useState<boolean>(false);

  if (!isOpen || !producer) return null;

  const maxLimit = producer.erp.keeperAdvanceLimit || 400000;
  const currentUsed = producer.erp.keeperAdvanceTotal || 0;
  const availableLimit = Math.max(0, maxLimit - currentUsed);

  // Calculations
  const discountAmount = requestedAmount * (discountRate / 100) * monthsTerm;
  const netAmount = Math.max(0, requestedAmount - discountAmount);
  const diskIngressosRevenue = discountAmount;

  const handleSendWhatsAppPitch = () => {
    const pitch = `Olá ${producer.responsibleName}! Aqui é da equipe Comercial DiskIngressos. Conforme nosso acompanhamento das vendas do ${producer.topEventName}, simulamos uma linha de antecipação especial no Keeper ERP:\n\n` +
      `• Valor Solicitado: ${formatCurrency(requestedAmount)}\n` +
      `• Taxa de Deságio: ${discountRate}% a.m.\n` +
      `• Valor Líquido na Conta: ${formatCurrency(netAmount)}\n` +
      `• Prazo: ${monthsTerm} mês(es)\n` +
      `• Liberação via PIX Instantâneo D+0\n\n` +
      `Podemos aprovar e liberar hoje mesmo no Comitê de Crédito?`;

    onSendWhatsApp(producer.contactPhone, pitch);
  };

  const handleForwardToCommittee = () => {
    const newRequest = {
      id: `req-adv-${Date.now()}`,
      code: `ANT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      producerId: producer.id,
      producerName: producer.name,
      producerCnpj: producer.cnpj,
      requestedAmount,
      discountFeePercentage: discountRate,
      netAmount,
      availableBalanceFuture: availableLimit,
      eventIds: ['ev-101'],
      eventNames: [producer.topEventName],
      status: 'PENDING_APPROVAL',
      requestedAt: 'Agora mesmo',
      analystNotes: `Simulação pré-qualificada pelo Comercial para ${producer.responsibleName}. Margem de ingressos garantida.`,
      pixKey: producer.contactEmail,
      riskScore: 'LOW',
    };

    onSubmitToCreditCommittee(newRequest);
    setSubmittedToCommittee(true);
    setTimeout(() => {
      setSubmittedToCommittee(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#141b2d] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Simulador Comercial de Crédito & Antecipação
              </h2>
              <p className="text-xs text-slate-400">
                {producer.tradeName} • Linha Keeper ERP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {submittedToCommittee && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Solicitação enviada com sucesso para o Comitê de Crédito DiskIngressos!</span>
            </div>
          )}

          {/* Guarantee and Limits Card */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Limite Pré-Aprovado:</span>
              <div className="font-bold text-slate-200">{formatCurrency(maxLimit)}</div>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Margem Disponível:</span>
              <div className="font-bold text-emerald-400">{formatCurrency(availableLimit)}</div>
            </div>
          </div>

          {/* Amount Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <label className="text-slate-300">Valor Bruto da Antecipação (R$)</label>
              <span className="text-purple-400 font-extrabold text-sm">{formatCurrency(requestedAmount)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max={availableLimit || 300000}
              step="5000"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Rate and Term Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Taxa de Deságio (% a.m.)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={discountRate}
                onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Prazo Previsto do Evento
              </label>
              <select
                value={monthsTerm}
                onChange={(e) => setMonthsTerm(parseInt(e.target.value))}
                className="w-full bg-slate-900 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value={1}>30 dias (D+30)</option>
                <option value={2}>60 dias (D+60)</option>
                <option value={3}>90 dias (D+90)</option>
              </select>
            </div>
          </div>

          {/* Breakdown Results Strip */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Desconto de Deságio Retido:</span>
              <span className="font-bold text-amber-400 font-mono">- {formatCurrency(discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Receita Financeira DiskIngressos:</span>
              <span className="font-bold text-purple-300 font-mono">+ {formatCurrency(diskIngressosRevenue)}</span>
            </div>
            <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Líquido a Transferir ao Produtor:</span>
              <span className="text-base font-black text-emerald-400 font-mono">{formatCurrency(netAmount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleSendWhatsAppPitch}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enviar Proposta por WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleForwardToCommittee}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submeter ao Comitê de Crédito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
