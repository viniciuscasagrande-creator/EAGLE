import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { PayoutRequest, EventWalletPosition } from '@/types/finance';
import { PayoutRequestModal } from '@/components/modals/PayoutRequestModal';
import {
  DollarSign,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatDate } from '@/utils/formatters';

export const SolicitacoesRepassePage: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [wallets, setWallets] = useState<EventWalletPosition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<EventWalletPosition | null>(null);

  useEffect(() => {
    keeperAdapter.getPayoutSchedules().then(setPayouts);
    keeperAdapter.getEventWallets().then((w) => {
      setWallets(w);
      if (w.length > 0) setSelectedWallet(w[0]);
    });
  }, []);

  const getStatusBadge = (status: PayoutRequest['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Liquidado via PIX
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            Programado no Keeper
          </span>
        );
      case 'UNDER_ANALYSIS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Em Análise Controladoria
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/40 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Solicitações de Repasse & Histórico
          </h1>
          <p className="text-sm text-slate-400">
            Controle de liquidação e acompanhamento das liberações bancárias autorizadas pela DiskIngressos
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedWallet || selectedWallet.balanceAvailable <= 0}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Solicitação de Repasse</span>
        </button>
      </div>

      {/* Payouts Workflow Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Passo 1</span>
          <div className="text-xs font-bold text-slate-200">1. Solicitação Produtor</div>
          <p className="text-[11px] text-slate-400">Produtor consulta saldo oficial e submete o valor desejado.</p>
        </div>
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Passo 2</span>
          <div className="text-xs font-bold text-slate-200">2. Análise Disk (Keeper)</div>
          <p className="text-[11px] text-slate-400">A Controladoria valida reservas de contingência e taxas.</p>
        </div>
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Passo 3</span>
          <div className="text-xs font-bold text-slate-200">3. Programação / Agendamento</div>
          <p className="text-[11px] text-slate-400">Operação agendada para envio à câmara bancária PIX/TED.</p>
        </div>
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Passo 4</span>
          <div className="text-xs font-bold text-slate-200">4. Confirmação no Ledger</div>
          <p className="text-[11px] text-slate-400">Débito registrado no livro contábil com comprovante.</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Identificador</th>
              <th className="p-3.5 font-semibold">Evento</th>
              <th className="p-3.5 font-semibold">Valor Solicitado</th>
              <th className="p-3.5 font-semibold">Destino Bancário</th>
              <th className="p-3.5 font-semibold">Data Solicitação</th>
              <th className="p-3.5 font-semibold">Data Prevista/Paga</th>
              <th className="p-3.5 font-semibold text-right">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payouts.map((req) => (
              <tr key={req.id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-blue-400">{req.scheduleNumber}</div>
                  {req.transactionHash && (
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                      hash: {req.transactionHash}
                    </div>
                  )}
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-slate-200">{req.eventName}</div>
                  <div className="text-[11px] text-slate-400">{req.notes || '-'}</div>
                </td>
                <td className="p-3.5 font-extrabold text-slate-100 text-sm">
                  {formatCurrency(req.amount)}
                </td>
                <td className="p-3.5 text-slate-300">
                  <div>{req.destinationBank || 'Itaú Unibanco'}</div>
                  <div className="text-[11px] text-slate-400 font-mono">PIX: {req.destinationPixKey}</div>
                </td>
                <td className="p-3.5 text-slate-400">{formatDateTime(req.requestedAt)}</td>
                <td className="p-3.5 text-slate-300">
                  {req.paidAt ? (
                    <span className="text-emerald-400 font-medium">{formatDateTime(req.paidAt)}</span>
                  ) : (
                    <span>{formatDate(req.scheduledDate)}</span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  {getStatusBadge(req.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWallet && (
        <PayoutRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wallet={selectedWallet}
          onSuccess={(newReq) => {
            setPayouts((prev) => [newReq, ...prev]);
          }}
        />
      )}
    </div>
  );
};
