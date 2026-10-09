import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Layers, MapPin, Pencil, GitCompareArrows } from 'lucide-react';
import { EventItem } from '@/types/event';
import { useEventContext } from '@/contexts/EventContext';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

interface Props {
  event: EventItem;
  onCompareToggle?: (id: string) => void;
  isComparing?: boolean;
}

export const HorizontalEventCard: React.FC<Props> = ({
  event,
  onCompareToggle,
  isComparing,
}) => {
  const navigate = useNavigate();
  const { selectEvent } = useEventContext();

  const open = () => {
    selectEvent(event);
    navigate(`/eventos/${event.id}/dashboard`);
  };

  const metrics = [
    ['Total (R$)', formatCurrency(event.grossSales)],
    ['Vendas', formatNumber(event.ticketsSold)],
    ['Disponível', formatNumber(event.ticketsAvailable)],
    ['Cortesia', formatNumber(event.courtesiesCount)],
    ['Ocupação', formatPercent(event.occupationRate)],
  ];

  return (
    <article className="eagle-event-card">
      <div className="relative overflow-hidden">
        <img
          src={event.imageUrl}
          alt={`Cartaz do evento ${event.name}`}
          className="eagle-event-poster"
        />
        <span className="absolute bottom-2 left-2 bg-black/80 rounded px-2 text-sm text-white font-mono">
          {event.code}
        </span>
      </div>
      <div className="eagle-event-content">
        <div className="eagle-event-main">
          <button
            onClick={open}
            className="text-white text-left font-bold text-lg leading-tight hover:text-blue-400 cursor-pointer"
          >
            {event.name}
          </button>
          <p className="mt-2 flex gap-1.5 items-center text-xs text-slate-300">
            <MapPin size={17} className="text-blue-300 flex-shrink-0" />
            <span>{event.venue} — {event.city}/{event.state}</span>
          </p>
          <div className="eagle-event-metrics">
            {metrics.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <div className="eagle-event-metric-label">{label}</div>
                <div className="eagle-event-metric-number break-words">{value}</div>
                <div className="eagle-event-metric-line" />
              </div>
            ))}
          </div>
        </div>
        <div className="eagle-event-footer">
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <CalendarDays size={15} className="text-slate-400" />
            {event.dateStart} {event.time}
          </span>
          <div className="flex gap-3 items-center">
            <button
              title="Administrar evento"
              aria-label={`Administrar ${event.name}`}
              onClick={open}
              className="hover:text-blue-400 cursor-pointer transition text-slate-300"
            >
              <Pencil size={18} />
            </button>
            <button
              title="Visualizar detalhes"
              aria-label={`Detalhes de ${event.name}`}
              onClick={open}
              className="hover:text-blue-400 cursor-pointer transition text-slate-300"
            >
              <Layers size={19} />
            </button>
            {onCompareToggle && (
              <button
                aria-label={`Comparar ${event.name}`}
                title="Selecionar para comparar"
                onClick={() => onCompareToggle(event.id)}
                className={`cursor-pointer transition ${
                  isComparing ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'
                }`}
              >
                <GitCompareArrows size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
