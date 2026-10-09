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
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  Lock,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export const DashboardFinanceiroPage: React.FC = () => {
  const { producer } = useAuth();
  const navigate = useNavigate();

  const [wallets, setWallets] = useState<EventWalletPosition[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<FinancialLedgerEntry[]>([]);
  const [, setPayouts] = useState<PayoutRequest[]>([]);
  const [selectedWalletForPayout, setSelectedWalletForPayout] = useState<EventWalletPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isKeeperOffline, setIsKeeperOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const loadFinancialData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [w, l, p] = await Promise.all([
        keeperAdapter.getEventWallets(),
        keeperAdapter.getLedgerEntries(),
        keeperAdapter.getPayoutSchedules(),
      ]);
      setWallets(w);
      setLedgerEntries(l);
      setPayouts(p);
      setIsKeeperOffline(false);
      setLastSyncTime(new Date().toISOString());
    } catch (err: any) {
      setIsKeeperOffline(true);
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
    loadFinancialData();
  }, []);

  const totalBruto = wallets.reduce((acc, curr) => acc + curr.grossTicketSales, 0);
  const totalTaxasDisk = wallets.reduce((acc, curr) => acc + curr.diskFeeTotal, 0);
  const saldoDisponivel = producer?.kpis?.disponivel ?? wallets.reduce((acc, curr) => acc + curr.balanceAvailable, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Financeiro do Produtor
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold border ${
                isKeeperOffline
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {isKeeperOffline ? 'Keeper ERP: Standby / Offline' : 'Conexão Direta ao Keeper ERP'}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhamento de liquidação oficial, saldos apurados pelo motor DiskIngressos e solicitações de repasse.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadFinancialData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white rounded-lg text-xs font-semibold border border-[#37393e] transition cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sincronizar Keeper</span>
          </button>
        </div>
      </div>

      {/* Offline Alert Box */}
      {isKeeperOffline && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>Modo Resiliente Ativo (Keeper ERP Indisponível)</span>
              {lastSyncTime && (
                <span className="text-[11px] font-normal text-amber-400/80">
                  Última sincronização confirmada: {formatDateTime(lastSyncTime)}
                </span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {errorMessage || 'Não foi possível estabelecer contato com a API do Keeper ERP.'}{' '}
              Em estrito cumprimento às normas contábeis, o Portal do Produtor{' '}
              <strong>não simula saldos nem registra repasses offline</strong>. Novas operações financeiras permanecerão bloqueadas até a restauração do motor de liquidação.
            </p>
          </div>
        </div>
      )}

      {/* Governança Rule Banner */}
      <div className="p-4 rounded-lg bg-[#2c2d33] border border-[#37393e] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-white">
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
          value={formatCurrency(saldoDisponivel)}
          subtitle={isKeeperOffline ? 'Último saldo apurado' : 'Apto para solicitação de repasse'}
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
          value={formatCurrency(producer?.kpis?.emRepasse || 0)}
          subtitle="Liquidados via PIX"
          icon={CheckCircle2}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10"
        />
      </div>

      {/* Wallets Overview */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Carteiras dos Eventos
            </h3>
            <p className="text-xs text-slate-400">
              Posição líquida calculada pelo Keeper com reservas e deduções
            </p>
          </div>
          <button
            onClick={() => navigate('/financeiro/carteiras')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            Ver Detalhes
          </button>
        </div>

        {wallets.length === 0 && !isLoading ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Lock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            Nenhuma carteira financeira disponível no momento. Conexão ao Keeper aguardando sincronização.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                  <th className="p-3 font-semibold">Evento</th>
                  <th className="p-3 font-semibold">Vendas Brutas</th>
                  <th className="p-3 font-semibold">Taxa Disk</th>
                  <th className="p-3 font-semibold">Despesas Retidas</th>
                  <th className="p-3 font-semibold">Repasses Pagos</th>
                  <th className="p-3 font-semibold">Saldo Disponível</th>
                  <th className="p-3 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#37393e]">
                {wallets.map((wallet) => (
                  <tr key={wallet.id} className="hover:bg-[#25262c] transition">
                    <td className="p-3">
                      <div className="font-bold text-white">{wallet.eventName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{wallet.eventId}</div>
                    </td>
                    <td className="p-3 font-bold text-white">{formatCurrency(wallet.grossTicketSales)}</td>
                    <td className="p-3 text-rose-400 font-semibold">- {formatCurrency(wallet.diskFeeTotal)}</td>
                    <td className="p-3 text-rose-400 font-semibold">- {formatCurrency(wallet.expensesTotal)}</td>
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
                        disabled={isKeeperOffline || wallet.balanceAvailable <= 0}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Repasse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Ledger Entries */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Últimos Lançamentos no Livro Financeiro (FinancialLedger)
            </h3>
            <p className="text-xs text-slate-400">
              Partidas dobradas imutáveis espelhadas do Keeper Core
            </p>
          </div>
          <button
            onClick={() => navigate('/financeiro/extrato-ledger')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            Extrato Completo
          </button>
        </div>

        {ledgerEntries.length === 0 && !isLoading ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            Nenhum lançamento contábil recuperado do Keeper.
          </div>
        ) : (
          <div className="divide-y divide-[#37393e]">
            {ledgerEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-[#25262c] px-2 rounded-md transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{entry.description}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#202124] text-slate-300 border border-[#37393e]">
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
        )}
      </div>

      {selectedWalletForPayout && (
        <PayoutRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wallet={selectedWalletForPayout}
          onSuccess={(req) => {
            alert(`Solicitação ${req.scheduleNumber} submetida com sucesso ao Keeper Financeiro.`);
            loadFinancialData();
          }}
        />
      )}
    </div>
  );
};
