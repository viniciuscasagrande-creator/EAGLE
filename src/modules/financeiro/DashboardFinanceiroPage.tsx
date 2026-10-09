import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { EventWalletPosition, FinancialLedgerEntry, PayoutRequest } from '@/types/finance';
import { PayoutRequestModal } from '@/components/modals/PayoutRequestModal';
import {
  DollarSign,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export const DashboardFinanceiroPage: React.FC = () => {
  const { producer } = useAuth();
  const navigate = useNavigate();

  const [wallets, setWallets] = useState<EventWalletPosition[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<FinancialLedgerEntry[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [selectedWalletForPayout, setSelectedWalletForPayout] = useState<EventWalletPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getEventWallets().then(setWallets);
    keeperAdapter.getLedgerEntries().then(setLedgerEntries);
    keeperAdapter.getPayoutSchedules().then(setPayouts);
  }, []);

  const totalDisponivel = wallets.reduce((acc, curr) => acc + curr.balanceAvailable, 0);
  const totalBruto = wallets.reduce((acc, curr) => acc + curr.grossTicketSales, 0);
  const totalTaxasDisk = wallets.reduce((acc, curr) => acc + curr.diskFeeTotal, 0);
  const totalDespesas = wallets.reduce((acc, curr) => acc + curr.expensesTotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Financeiro do Produtor
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Conexão Direta ao Keeper ERP
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhamento de liquidação oficial, saldos apurados pelo motor DiskIngressos e solicitações de repasse.
          </p>
        </div>

        <button
          onClick={() => {
            if (wallets.length > 0) {
              setSelectedWalletForPayout(wallets[0]);
              setIsModalOpen(true);
            }
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-700/20 transition cursor-pointer"
        >
          <DollarSign className="w-4 h-4" />
          <span>Nova Solicitação de Repasse</span>
        </button>
      </div>

      {/* Governança Rule Banner */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-blue-200">
            Regra Central de Arquitetura Financeira DiskIngressos
          </div>
          <p className="text-slate-300 leading-relaxed">
            O Portal do Produtor consome diretamente os saldos e lançamentos do <strong>Keeper Ledger Oficial</strong>. O Portal não calcula taxas ou saldos de forma independente; qualquer alteração de status ou aprovação de repasse é gerida e homologada pela Controladoria Financeira no Keeper.
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Saldo Disponível Consolidado"
          value={formatCurrency(producer.kpis.disponivel)}
          subtitle="Apto para solicitação de repasse"
          icon={Wallet}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />

        <MetricKpiCard
          title="Vendas Brutas Totais"
          value={formatCurrency(totalBruto)}
          subtitle="Recebido pela DiskIngressos"
          icon={DollarSign}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />

        <MetricKpiCard
          title="Taxas DiskIngressos Retidas"
          value={formatCurrency(totalTaxasDisk)}
          subtitle="Conforme contratos comerciais"
          icon={TrendingDown}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10"
        />

        <MetricKpiCard
          title="Repasses Já Executados"
          value={formatCurrency(producer.kpis.emRepasse)}
          subtitle="Liquidados via PIX"
          icon={CheckCircle2}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10"
        />
      </div>

      {/* Wallets Overview */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Carteiras dos Eventos
            </h3>
            <p className="text-xs text-slate-400">
              Posição líquida calculada pelo Keeper com reservas e deduções
            </p>
          </div>
          <button
            onClick={() => navigate('/financeiro/carteiras')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            Ver Detalhes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">Evento</th>
                <th className="p-3 font-semibold">Vendas Brutas</th>
                <th className="p-3 font-semibold">Taxa Disk</th>
                <th className="p-3 font-semibold">Despesas Retidas</th>
                <th className="p-3 font-semibold">Repasses Pagos</th>
                <th className="p-3 font-semibold">Saldo Disponível</th>
                <th className="p-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {wallets.map((wallet) => (
                <tr key={wallet.id} className="hover:bg-slate-900/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-200">{wallet.eventName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{wallet.eventId}</div>
                  </td>
                  <td className="p-3 font-bold text-slate-200">{formatCurrency(wallet.grossTicketSales)}</td>
                  <td className="p-3 text-rose-400">- {formatCurrency(wallet.diskFeeTotal)}</td>
                  <td className="p-3 text-rose-400">- {formatCurrency(wallet.expensesTotal)}</td>
                  <td className="p-3 text-slate-300">{formatCurrency(wallet.repaymentsPaidTotal)}</td>
                  <td className="p-3 font-extrabold text-emerald-400 text-sm">
                    {formatCurrency(wallet.balanceAvailable)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedWalletForPayout(wallet);
                        setIsModalOpen(true);
                      }}
                      disabled={wallet.balanceAvailable <= 0}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition disabled:opacity-40 cursor-pointer"
                    >
                      Repasse
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Ledger Entries */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Últimos Lançamentos no Livro Financeiro (FinancialLedger)
            </h3>
            <p className="text-xs text-slate-400">
              Partidas dobradas imutáveis espelhadas do Keeper Core
            </p>
          </div>
          <button
            onClick={() => navigate('/financeiro/extrato-ledger')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            Extrato Completo
          </button>
        </div>

        <div className="divide-y divide-slate-800/60">
          {ledgerEntries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{entry.description}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                    {entry.entryType}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {entry.eventName} • {formatDateTime(entry.createdAt)}
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-bold ${
                    entry.direction === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {entry.direction === 'CREDIT' ? '+' : '-'} {formatCurrency(entry.amount)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Saldo após: {formatCurrency(entry.balanceAfter)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedWalletForPayout && (
        <PayoutRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wallet={selectedWalletForPayout}
          onSuccess={(req) => {
            alert(`Solicitação ${req.scheduleNumber} submetida ao Keeper Financeiro.`);
          }}
        />
      )}
    </div>
  );
};
