import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { EventWalletPosition } from '@/types/finance';
import { PayoutRequestModal } from '@/components/modals/PayoutRequestModal';
import { Wallet, DollarSign, ShieldAlert, ArrowRight, Layers, FileText } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export const CarteirasEventosPage: React.FC = () => {
  const [wallets, setWallets] = useState<EventWalletPosition[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<EventWalletPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getEventWallets().then(setWallets);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Carteiras dos Eventos
          </h1>
          <p className="text-sm text-slate-400">
            Segregação patrimonial e analítica por evento, calculada pelo motor central Keeper
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-[#141b2d] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-100">{wallet.eventName}</h3>
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
                  disabled={wallet.balanceAvailable <= 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  Solicitar Repasse
                </button>
              </div>
            </div>

            {/* Balances Decomposition Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Vendas Brutas:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">
                  {formatCurrency(wallet.grossTicketSales)}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Taxa Disk Retida:</span>
                <div className="text-sm font-bold text-rose-400 mt-0.5">
                  - {formatCurrency(wallet.diskFeeTotal)}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Spread Financeiro:</span>
                <div className="text-sm font-bold text-rose-400 mt-0.5">
                  - {formatCurrency(wallet.spreadFeeTotal)}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Despesas Autorizadas:</span>
                <div className="text-sm font-bold text-rose-400 mt-0.5">
                  - {formatCurrency(wallet.expensesTotal)}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Repasses Já Pagos:</span>
                <div className="text-sm font-bold text-blue-400 mt-0.5">
                  {formatCurrency(wallet.repaymentsPaidTotal)}
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 font-semibold">Disponível Repasse:</span>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                  {formatCurrency(wallet.balanceAvailable)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedWallet && (
        <PayoutRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wallet={selectedWallet}
          onSuccess={() => {
            alert('Solicitação de repasse enviada com sucesso!');
          }}
        />
      )}
    </div>
  );
};
