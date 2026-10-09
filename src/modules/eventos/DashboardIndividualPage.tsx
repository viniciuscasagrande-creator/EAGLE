import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
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
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Tv,
  ScanLine,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const DashboardIndividualPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, selectEventById, allEvents } = useEventContext();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventItem | null>(selectedEvent);
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      selectEventById(id);
      keeperAdapter
        .getEventById(id)
        .then((evt) => {
          if (evt) setEventData(evt);
        })
        .catch(() => {
          // Mantém o evento local selecionado
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const currentEvent = eventData || selectedEvent || allEvents[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            {currentEvent.name} — Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentEvent.venue} • {currentEvent.dateStart}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/eventos/${currentEvent.id}/telao`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Modo Telão (Live)</span>
          </button>

          <button
            onClick={() => navigate(`/eventos/${currentEvent.id}/portaria`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2c2d33] hover:bg-[#35363c] text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Portaria & Check-in</span>
          </button>

          <button
            onClick={() => navigate('/eventos')}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            Voltar aos eventos
          </button>
        </div>
      </div>

      {/* Print 2: Top 4 KPI Indicators */}
      <div className="eagle-dash-top">
        {[
          {
            label: 'Total de Vendas',
            value: formatCurrency(currentEvent.grossSales),
            Icon: DollarSign,
            color: '#55b597',
          },
          {
            label: 'Vendidos',
            value: formatNumber(currentEvent.ticketsSold),
            Icon: Ticket,
            color: '#65bacb',
          },
          {
            label: 'Cortesias',
            value: formatNumber(currentEvent.courtesiesCount),
            Icon: Gift,
            color: '#a6a5db',
          },
          {
            label: 'Restantes',
            value: formatNumber(currentEvent.ticketsAvailable),
            Icon: AlertCircle,
            color: '#569ee8',
          },
        ].map(({ label, value, Icon, color }) => (
          <div className="eagle-dash-stat" key={label}>
            <Icon size={34} strokeWidth={1.8} style={{ color }} />
            <div>
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Print 2: Ritmo de Vendas (Side Panel Indicators + Timeline Chart) */}
      <div className="eagle-dash-chart">
        <h2 className="text-lg font-bold mb-5 text-white">Ritmo de Vendas</h2>
        <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-5">
          <div className="space-y-6 xl:border-r border-[#46474c] pr-4">
            {[
              ['TICKET MÉDIO', formatCurrency(currentEvent.averageTicket)],
              ['PONTO DE EQUILÍBRIO', formatCurrency(currentEvent.breakEvenTarget)],
              ['META DE VENDAS', formatCurrency(currentEvent.salesGoalAmount)],
              ['PROJEÇÃO FINAL', formatCurrency(currentEvent.projectedGrossSales)],
            ].map(([a, b]) => (
              <div key={a}>
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">{a}</div>
                <div className="text-lg font-bold mt-1 text-white">{b}</div>
              </div>
            ))}
          </div>
          <div className="min-h-[280px]">
            <SalesVelocityChart data={currentEvent.timeline} />
          </div>
        </div>
      </div>

      {/* Row 3: Payment Methods & Sectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PaymentMethodsDonut data={currentEvent.paymentMethods} />
        <SectorProgressBars sectors={currentEvent.sectors} />
      </div>

      {/* Row 4: Recent Approved Orders Feed */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Últimos Pedidos Aprovados
              </h4>
              <p className="text-xs text-slate-400">
                Pedidos registrados para o evento
              </p>
            </div>
            <button
              onClick={() => navigate(`/eventos/${currentEvent.id}/vendas`)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
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
                <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400">
                        {ord.orderNumber}
                      </span>
                      <span className="font-medium text-slate-200">
                        {ord.customerName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ord.sectorName} • {ord.itemsCount}x ingresso(s) • {ord.paymentMethod}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-400">
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
            Conciliação financeira conferida no Keeper ERP
          </span>
        </div>
      </div>
    </div>
  );
};
