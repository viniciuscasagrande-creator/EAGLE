import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { EventWalletPosition } from '@/types/finance';
import { PayoutRequestModal } from '@/components/modals/PayoutRequestModal';
import { AlertTriangle, RotateCw, Lock } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const CarteirasEventosPage: React.FC = () => {
  const [wallets, setWallets] = useState<EventWalletPosition[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<EventWalletPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const loadWallets = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await keeperAdapter.getEventWallets();
      setWallets(data);
      setIsOffline(false);
      setLastSyncTime(new Date().toISOString());
    } catch (err: any) {
      setIsOffline(true);
      setErrorMessage(
        err.message || 'Serviço financeiro temporariamente indisponível no Keeper ERP.'
      );
      if (err.cachedData && Array.isArray(err.cachedData)) {
        setWallets(err.cachedData);
        setLastSyncTime(err.lastConfirmedAt || null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Carteiras dos Eventos
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
            Segregação patrimonial e analítica por evento, calculada pelo motor central Keeper
          </p>
        </div>

        <button
          onClick={loadWallets}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white rounded-lg text-xs font-semibold border border-[#37393e] transition cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Atualizar Carteiras</span>
        </button>
      </div>

      {isOffline && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>Sincronização com Keeper ERP Offline</span>
              {lastSyncTime && (
                <span className="text-[11px] font-normal text-amber-400/80">
                  Última sincronização confirmada: {formatDateTime(lastSyncTime)}
                </span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {errorMessage}. Por conformidade regulatória, solicitações de repasse permanecem bloqueadas enquanto o serviço não for restabelecido.
            </p>
          </div>
        </div>
      )}

      {wallets.length === 0 && !isLoading ? (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-12 text-center text-slate-400 text-xs">
          <Lock className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="font-semibold text-slate-300 mb-1">Nenhuma carteira financeira disponível</p>
          <p>Não foi possível carregar as posições patrimoniais a partir do Keeper Core.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 md:p-6 shadow-md space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#37393e]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{wallet.eventName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {wallet.eventId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {wallet.venue} • {wallet.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedWallet(wallet);
                      setIsModalOpen(true);
                    }}
                    disabled={isOffline || wallet.balanceAvailable <= 0}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg shadow transition cursor-pointer"
                  >
                    Solicitar Repasse
                  </button>
                </div>
              </div>

              {/* Balances Decomposition Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                  <span className="text-slate-400">Vendas Brutas:</span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {formatCurrency(wallet.grossTicketSales)}
                  </div>
                </div>

                <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                  <span className="text-slate-400">Taxa Disk Retida:</span>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    - {formatCurrency(wallet.diskFeeTotal)}
                  </div>
                </div>

                <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                  <span className="text-slate-400">Spread Financeiro:</span>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    - {formatCurrency(wallet.spreadFeeTotal)}
                  </div>
                </div>

                <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                  <span className="text-slate-400">Despesas Autorizadas:</span>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    - {formatCurrency(wallet.expensesTotal)}
                  </div>
                </div>

                <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                  <span className="text-slate-400">Repasses Já Pagos:</span>
                  <div className="text-sm font-bold text-blue-400 mt-0.5">
                    {formatCurrency(wallet.repaymentsPaidTotal)}
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/30">
                  <span className="text-emerald-400 font-semibold">Disponível Repasse:</span>
                  <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                    {formatCurrency(wallet.balanceAvailable)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWallet && (
        <PayoutRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wallet={selectedWallet}
          onSuccess={(req) => {
            alert(`Solicitação ${req.scheduleNumber} registrada com sucesso.`);
            loadWallets();
          }}
        />
      )}
    </div>
  );
};
