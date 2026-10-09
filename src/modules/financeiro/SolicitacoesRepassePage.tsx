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
  RotateCw,
  Lock,
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatDate } from '@/utils/formatters';

export const SolicitacoesRepassePage: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [wallets, setWallets] = useState<EventWalletPosition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<EventWalletPosition | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const loadPayoutsAndWallets = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [p, w] = await Promise.all([
        keeperAdapter.getPayoutSchedules(),
        keeperAdapter.getEventWallets(),
      ]);
      setPayouts(p);
      setWallets(w);
      if (w.length > 0) setSelectedWallet(w[0]);
      setIsOffline(false);
      setLastSyncTime(new Date().toISOString());
    } catch (err: any) {
      setIsOffline(true);
      setErrorMessage(
        err.message || 'Serviço de repasses temporariamente indisponível no Keeper ERP.'
      );
      if (err.cachedData && Array.isArray(err.cachedData)) {
        setPayouts(err.cachedData);
        setLastSyncTime(err.lastConfirmedAt || null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayoutsAndWallets();
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#202124] text-slate-400 border border-[#37393e]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Solicitações de Repasse & Histórico
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold border ${
                isOffline
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {isOffline ? 'Keeper em Standby' : 'Keeper Conectado'}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Controle de liquidação e acompanhamento das liberações bancárias autorizadas pela DiskIngressos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPayoutsAndWallets}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white rounded-lg text-xs font-semibold border border-[#37393e] transition cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isOffline || !selectedWallet || selectedWallet.balanceAvailable <= 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Solicitação de Repasse</span>
          </button>
        </div>
      </div>

      {isOffline && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>Módulo de Repasses Offline / Standby</span>
              {lastSyncTime && (
                <span className="text-[11px] font-normal text-amber-400/80">
                  Última sincronização confirmada: {formatDateTime(lastSyncTime)}
                </span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {errorMessage}. Para evitar inconsistências bancárias, nenhum repasse pode ser solicitado até o restabelecimento do serviço contábil do Keeper ERP.
            </p>
          </div>
        </div>
      )}

      {/* Payouts Workflow Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Passo 1</span>
          <div className="text-xs font-bold text-white">1. Solicitação Produtor</div>
          <p className="text-[11px] text-slate-400">Produtor consulta saldo oficial e submete o valor desejado.</p>
        </div>
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Passo 2</span>
          <div className="text-xs font-bold text-white">2. Análise Disk (Keeper)</div>
          <p className="text-[11px] text-slate-400">A Controladoria valida reservas de contingência e taxas.</p>
        </div>
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Passo 3</span>
          <div className="text-xs font-bold text-white">3. Programação / Agendamento</div>
          <p className="text-[11px] text-slate-400">Operação agendada para envio à câmara bancária PIX/TED.</p>
        </div>
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Passo 4</span>
          <div className="text-xs font-bold text-white">4. Confirmação no Ledger</div>
          <p className="text-[11px] text-slate-400">Débito registrado no livro contábil com comprovante.</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        {payouts.length === 0 && !isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <Lock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            Nenhuma solicitação de repasse registrada.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Identificador</th>
                <th className="p-3.5 font-semibold">Evento</th>
                <th className="p-3.5 font-semibold">Valor Solicitado</th>
                <th className="p-3.5 font-semibold">Destino Bancário</th>
                <th className="p-3.5 font-semibold">Data Solicitação</th>
                <th className="p-3.5 font-semibold">Data Prevista/Paga</th>
                <th className="p-3.5 font-semibold text-right">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {payouts.map((req) => (
                <tr key={req.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-blue-400">{req.scheduleNumber}</div>
                    {req.transactionHash && (
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                        hash: {req.transactionHash}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{req.eventName}</div>
                    <div className="text-[11px] text-slate-400">{req.notes || '-'}</div>
                  </td>
                  <td className="p-3.5 font-extrabold text-white text-sm">
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
        )}
      </div>

      {selectedWallet && (
        <PayoutRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wallet={selectedWallet}
          onSuccess={() => {
            loadPayoutsAndWallets();
          }}
        />
      )}
    </div>
  );
};
