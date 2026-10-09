import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { SalesVelocityChart } from '@/components/charts/SalesVelocityChart';
import { PaymentMethodsDonut } from '@/components/charts/PaymentMethodsDonut';
import { SectorProgressBars } from '@/components/charts/SectorProgressBars';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { EventItem } from '@/types/event';
import {
  DollarSign,
  Ticket,
  Gift,
  AlertCircle,
  TrendingUp,
  Target,
  Clock,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

export const DashboardIndividualPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, selectEventById, allEvents } = useEventContext();
  const navigate = useNavigate();

  const [dateFilter, setDateFilter] = useState<'HOJE' | '7D' | '30D' | 'ALL'>('ALL');
  const [eventData, setEventData] = useState<EventItem | null>(selectedEvent);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      selectEventById(id);
      keeperAdapter.getEventById(id).then((evt) => {
        if (evt) setEventData(evt);
        setIsLoading(false);
      });
    }
  }, [id]);

  const currentEvent = eventData || selectedEvent || allEvents[0];

  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <img
              src={currentEvent.imageUrl}
              alt={currentEvent.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-2 ring-blue-500/30 flex-shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {currentEvent.code}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Evento Ativo • DiskIngressos
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                {currentEvent.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
                <span>{currentEvent.venue}</span>
                <span>•</span>
                <span>{currentEvent.city}/{currentEvent.state}</span>
                <span>•</span>
                <span>{currentEvent.dateStart} às {currentEvent.time}</span>
              </p>
            </div>
          </div>

          {/* Quick Period Filter & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setDateFilter('HOJE')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  dateFilter === 'HOJE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setDateFilter('7D')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  dateFilter === '7D' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setDateFilter('30D')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  dateFilter === '30D' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30 Dias
              </button>
              <button
                onClick={() => setDateFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  dateFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tudo
              </button>
            </div>

            <button
              onClick={() => navigate(`/eventos/${currentEvent.id}/relatorios`)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <button
              onClick={() => navigate(`/eventos/${currentEvent.id}/financeiro`)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Financeiro do Evento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Key Performance Metrics (matching Behance Ticket Dashboard Style) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Sales */}
        <MetricKpiCard
          title="Vendas Totais"
          value={formatCurrency(currentEvent.grossSales)}
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          trend={{ value: '14.2%', isPositive: true }}
        />

        {/* Tickets Sold */}
        <MetricKpiCard
          title="Ingressos Vendidos"
          value={formatNumber(currentEvent.ticketsSold)}
          subtitle={`Capacidade: ${formatNumber(currentEvent.totalCapacity)}`}
          icon={Ticket}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          progress={{
            percentage: currentEvent.occupationRate,
            label: 'Ocupação',
          }}
        />

        {/* Tickets Remaining */}
        <MetricKpiCard
          title="Disponibilidade"
          value={formatNumber(currentEvent.ticketsAvailable)}
          subtitle="Ingressos em aberto"
          icon={AlertCircle}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />

        {/* Courtesies */}
        <MetricKpiCard
          title="Cortesias Emitidas"
          value={formatNumber(currentEvent.courtesiesCount)}
          subtitle="Acessos especiais / VIP"
          icon={Gift}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />

        {/* Average Ticket */}
        <MetricKpiCard
          title="Ticket Médio"
          value={formatCurrency(currentEvent.averageTicket)}
          icon={TrendingUp}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
          trend={{ value: '4.8%', isPositive: true }}
        />

        {/* Break-even / Equilibrium Point */}
        <MetricKpiCard
          title="Ponto de Equilíbrio"
          value={formatPercent(currentEvent.breakEvenAchievedRate)}
          icon={Target}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10"
          progress={{
            percentage: Math.min(currentEvent.breakEvenAchievedRate, 100),
            label: `Alvo: ${formatCurrency(currentEvent.breakEvenTarget)}`,
          }}
        />
      </div>

      {/* Row 2: Secondary Indicators Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#141b2d] border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Velocidade de Vendas</span>
            <div className="text-base font-bold text-slate-100">
              {currentEvent.salesVelocityPerHour} ingressos / hora
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Meta de Faturamento</span>
            <div className="text-base font-bold text-slate-100">
              {formatCurrency(currentEvent.salesGoalAmount)}{' '}
              <span className="text-xs font-semibold text-emerald-400">
                ({currentEvent.salesGoalAchievedRate}% atingida)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Projeção Final Estimada</span>
            <div className="text-base font-bold text-emerald-400">
              {formatCurrency(currentEvent.projectedGrossSales)}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Sales Velocity Curve & Payment Methods Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesVelocityChart data={currentEvent.timeline} />
        </div>
        <div>
          <PaymentMethodsDonut data={currentEvent.paymentMethods} />
        </div>
      </div>

      {/* Row 4: Sectors Occupation & Recent Orders Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sectors & Lots */}
        <SectorProgressBars sectors={currentEvent.sectors} />

        {/* Real-time Orders Feed */}
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  Últimos Pedidos Aprovados
                </h4>
                <p className="text-xs text-slate-400">
                  Feed de vendas em tempo real via motor oficial DiskIngressos
                </p>
              </div>
              <button
                onClick={() => navigate(`/eventos/${currentEvent.id}/vendas`)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Ver Todos</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {currentEvent.recentOrders.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Nenhum pedido recente registrado.
                </div>
              ) : (
                currentEvent.recentOrders.map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs font-medium text-slate-200">
                          {ord.customerName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {ord.sectorName} • {ord.itemsCount}x ingresso(s) • {ord.paymentMethod}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">
                        {formatCurrency(ord.totalAmount)}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Aprovado
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Apropriação contábil registrada no Keeper Ledger
            </span>
            <span className="text-slate-500 font-mono">Webhook ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
