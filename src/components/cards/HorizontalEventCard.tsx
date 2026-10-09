import React from 'react';
import { EventItem } from '@/types/event';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  DollarSign,
  Gift,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

interface HorizontalEventCardProps {
  event: EventItem;
  onCompareToggle?: (eventId: string) => void;
  isComparing?: boolean;
}

export const HorizontalEventCard: React.FC<HorizontalEventCardProps> = ({
  event,
  onCompareToggle,
  isComparing,
}) => {
  const { selectEvent } = useEventContext();
  const navigate = useNavigate();

  const handleAdminister = () => {
    selectEvent(event);
    navigate(`/eventos/${event.id}/dashboard`);
  };

  const getStatusBadge = (status: EventItem['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ativo
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Em Breve
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Encerrado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#141b2d] border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 md:p-5 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/10 group flex flex-col xl:flex-row xl:items-center justify-between gap-5">
      {/* Event Cover & Basic Info */}
      <div className="flex items-start gap-4 flex-1 min-w-[280px]">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/60 shadow-md">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-1.5 left-1.5">
            <span className="px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono font-bold text-white border border-white/10">
              {event.code}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getStatusBadge(event.status)}
            <span className="text-[11px] text-slate-400 font-medium">
              ID: {event.id}
            </span>
          </div>

          <h3
            onClick={handleAdminister}
            className="text-base sm:text-lg font-bold text-slate-100 hover:text-blue-400 cursor-pointer truncate transition-colors"
          >
            {event.name}
          </h3>

          <div className="space-y-1 mt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{event.venue} — {event.city}/{event.state}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {event.dateStart} {event.dateEnd ? `a ${event.dateEnd}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {event.time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row (matching UAE Ticketing Reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex items-center gap-4 xl:gap-6 py-3 xl:py-0 border-y xl:border-y-0 border-slate-800/80">
        {/* Total Gross Sales */}
        <div className="xl:min-w-[120px]">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            Vendas Brutas
          </div>
          <div className="text-sm sm:text-base font-extrabold text-slate-100 mt-0.5">
            {formatCurrency(event.grossSales)}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            {event.salesVelocityPerHour > 0 ? `${event.salesVelocityPerHour} vendas/h` : 'Encerrado'}
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="xl:min-w-[110px]">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Ticket className="w-3 h-3 text-blue-400" />
            Vendidos
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
            {formatNumber(event.ticketsSold)}
            <span className="text-xs text-slate-500 font-normal"> / {formatNumber(event.totalCapacity)}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Meta: {formatCurrency(event.salesGoalAmount)}
          </div>
        </div>

        {/* Available Tickets */}
        <div className="xl:min-w-[100px]">
          <div className="text-[11px] text-slate-400 font-medium">Disponíveis</div>
          <div className="text-sm sm:text-base font-bold text-amber-300 mt-0.5">
            {formatNumber(event.ticketsAvailable)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Gift className="w-3 h-3 text-purple-400" />
            {event.courtesiesCount} cortesias
          </div>
        </div>

        {/* Occupation Rate with Progress Bar */}
        <div className="xl:min-w-[130px]">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Ocupação</span>
            <span className="font-bold text-slate-200">{formatPercent(event.occupationRate)}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                event.occupationRate >= 90
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : event.occupationRate >= 50
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${Math.min(event.occupationRate, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Capacidade Total: {formatNumber(event.totalCapacity)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 xl:min-w-[160px]">
        {onCompareToggle && (
          <button
            onClick={() => onCompareToggle(event.id)}
            className={`p-2 rounded-lg text-xs border transition ${
              isComparing
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Comparar evento"
          >
            Comparar
          </button>
        )}

        <button
          onClick={handleAdminister}
          className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all cursor-pointer"
        >
          <span>Administrar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
