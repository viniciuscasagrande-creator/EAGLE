import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEventContext } from '@/contexts/EventContext';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { PayoutRequestModal } from '@/components/modals/PayoutRequestModal';
import { EventWalletPosition } from '@/types/finance';
import {
  Calendar,
  DollarSign,
  Ticket,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldAlert,
  Wallet,
  Clock,
  Sparkles,
  Building,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

export const DashboardGeralPage: React.FC = () => {
  const { producer, user, isKeeperConnected } = useAuth();
  const { allEvents, selectEvent } = useEventContext();
  const navigate = useNavigate();

  const [wallets, setWallets] = useState<EventWalletPosition[]>([]);
  const [selectedWalletForPayout, setSelectedWalletForPayout] = useState<EventWalletPosition | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getEventWallets().then((data) => {
      setWallets(data);
    });
  }, []);

  const totalGrossSales = allEvents.reduce((acc, curr) => acc + curr.grossSales, 0);
  const totalTicketsSold = allEvents.reduce((acc, curr) => acc + curr.ticketsSold, 0);
  const activeEventsCount = allEvents.filter((e) => e.status === 'ACTIVE').length;
  const upcomingEventsCount = allEvents.filter((e) => e.status === 'UPCOMING').length;
  const completedEventsCount = allEvents.filter((e) => e.status === 'COMPLETED').length;

  const handleOpenPayout = (wallet: EventWalletPosition) => {
    setSelectedWalletForPayout(wallet);
    setIsPayoutModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Context Header */}
      <div className="bg-gradient-to-r from-[#141b2d] via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              {producer.name}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
              CNPJ: {producer.cnpj}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Olá, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visão consolidada comercial e financeira dos seus eventos integrados ao Keeper Core DiskIngressos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/eventos/novo')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Evento</span>
          </button>

          <button
            onClick={() => navigate('/financeiro/repasses')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Solicitar Repasse</span>
          </button>
        </div>
      </div>

      {/* Row 1: Key Financial & Commercial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Faturamento Bruto Geral"
          value={formatCurrency(totalGrossSales)}
          subtitle={`${allEvents.length} eventos monitorados`}
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          trend={{ value: '18.5%', isPositive: true }}
        />

        <MetricKpiCard
          title="Saldo Disponível para Repasse"
          value={formatCurrency(producer.kpis.disponivel)}
          subtitle="Liberado pelo Keeper Financeiro"
          icon={Wallet}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />

        <MetricKpiCard
          title="Ingressos Vendidos Totais"
          value={formatNumber(totalTicketsSold)}
          subtitle={`${activeEventsCount} eventos ativos`}
          icon={Ticket}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />

        <MetricKpiCard
          title="Repasses Já Executados"
          value={formatCurrency(producer.kpis.emRepasse)}
          subtitle="Confirmados via PIX bancário"
          icon={CheckCircle}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10"
        />
      </div>

      {/* Row 2: Secondary Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#141b2d] border border-slate-800 rounded-xl p-4">
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Eventos Ativos</span>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{activeEventsCount}</div>
          <span className="text-[10px] text-emerald-400">Em venda agora</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Eventos Futuros</span>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{upcomingEventsCount}</div>
          <span className="text-[10px] text-blue-400">Aguardando abertura</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Eventos Encerrados</span>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{completedEventsCount}</div>
          <span className="text-[10px] text-slate-500">Histórico completo</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Saldo Projetado Total</span>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">
            {formatCurrency(producer.kpis.projetado)}
          </div>
          <span className="text-[10px] text-slate-400">Com base nas curvas de venda</span>
        </div>
      </div>

      {/* Row 3: Active Event Wallets & Fast Payout Action */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Posição das Carteiras dos Eventos (Keeper Motor Financeiro)
            </h3>
            <p className="text-xs text-slate-400">
              Valores apurados pelo núcleo financeiro oficial da DiskIngressos com segregação de taxas
            </p>
          </div>
          <button
            onClick={() => navigate('/financeiro/carteiras')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver Todas as Carteiras</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-900/40 p-2 rounded-xl transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-200 text-sm">{wallet.eventName}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {wallet.eventId}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {wallet.venue} • {wallet.date}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Vendas Brutas:</span>
                  <div className="font-bold text-slate-100">{formatCurrency(wallet.grossTicketSales)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Deduções Totais:</span>
                  <div className="font-bold text-rose-400">
                    - {formatCurrency(wallet.diskFeeTotal + wallet.spreadFeeTotal + wallet.expensesTotal)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Disponível p/ Repasse:</span>
                  <div className="font-extrabold text-emerald-400 text-sm">
                    {formatCurrency(wallet.balanceAvailable)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const evt = allEvents.find((e) => e.id === wallet.eventId);
                    if (evt) selectEvent(evt);
                    navigate(`/eventos/${wallet.eventId}/dashboard`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  Abrir Evento
                </button>
                <button
                  onClick={() => handleOpenPayout(wallet)}
                  disabled={wallet.balanceAvailable <= 0}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-xs font-bold text-white shadow transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Solicitar Repasse
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Top Performing Events Direct Access */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-100">
            Eventos em Destaque
          </h3>
          <button
            onClick={() => navigate('/eventos')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>Ver Todos os Eventos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={() => {
                selectEvent(event);
                navigate(`/eventos/${event.id}/dashboard`);
              }}
              className="bg-[#141b2d] border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-100 text-sm truncate group-hover:text-blue-400 transition-colors">
                    {event.name}
                  </h4>
                  <div className="text-xs text-slate-400 truncate">{event.venue}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Vendas:</span>
                  <div className="font-bold text-slate-100">{formatCurrency(event.grossSales)}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Ocupação:</span>
                  <div className="font-bold text-emerald-400">{event.occupationRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Request Modal */}
      {selectedWalletForPayout && (
        <PayoutRequestModal
          isOpen={isPayoutModalOpen}
          onClose={() => setIsPayoutModalOpen(false)}
          wallet={selectedWalletForPayout}
          onSuccess={(req) => {
            alert(`Solicitação de repasse ${req.scheduleNumber} no valor de ${formatCurrency(req.amount)} enviada com sucesso para análise do Keeper Financeiro.`);
          }}
        />
      )}
    </div>
  );
};
