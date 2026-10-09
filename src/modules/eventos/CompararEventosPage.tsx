import React from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Ticket, Target, Users } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

export const CompararEventosPage: React.FC = () => {
  const { allEvents, selectEvent } = useEventContext();
  const navigate = useNavigate();

  // Compare the first 3 events
  const eventsToCompare = allEvents.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/eventos')}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Comparador de Desempenho de Eventos
          </h1>
          <p className="text-sm text-slate-400">
            Análise comparativa cruzada de velocidade de vendas, ticket médio, ocupação e metas atingidas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {eventsToCompare.map((event) => (
          <div
            key={event.id}
            className="bg-[#141b2d] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="h-32 rounded-xl overflow-hidden relative mb-3">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white font-bold">
                  {event.code}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base">{event.name}</h3>
              <p className="text-xs text-slate-400">{event.venue} • {event.dateStart}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Faturamento Bruto:</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {formatCurrency(event.grossSales)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ingressos Vendidos:</span>
                <span className="font-bold text-slate-200">
                  {formatNumber(event.ticketsSold)} / {formatNumber(event.totalCapacity)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Taxa de Ocupação:</span>
                <span className="font-bold text-blue-400">
                  {formatPercent(event.occupationRate)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ticket Médio:</span>
                <span className="font-bold text-slate-200">
                  {formatCurrency(event.averageTicket)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ponto de Equilíbrio:</span>
                <span className="font-bold text-purple-400">
                  {formatPercent(event.breakEvenAchievedRate)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ritmo de Vendas:</span>
                <span className="font-bold text-amber-300">
                  {event.salesVelocityPerHour} un/h
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                selectEvent(event);
                navigate(`/eventos/${event.id}/dashboard`);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Abrir Dashboard do Evento
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
