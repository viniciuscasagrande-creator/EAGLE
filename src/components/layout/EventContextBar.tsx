import React from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, ExternalLink, Ticket, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export const EventContextBar: React.FC = () => {
  const { selectedEvent, clearSelectedEvent } = useEventContext();
  const navigate = useNavigate();

  if (!selectedEvent) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border-b border-blue-500/30 px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            clearSelectedEvent();
            navigate('/eventos');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
          <span>Voltar para Meus Eventos</span>
        </button>

        <div className="h-4 w-px bg-slate-700 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Você está operando:</span>
          <span className="text-xs md:text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-400" />
            {selectedEvent.name}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {selectedEvent.code}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="hidden lg:flex items-center gap-4 text-slate-300">
          <div>
            <span className="text-slate-400">Vendas: </span>
            <span className="font-semibold text-emerald-400">{formatCurrency(selectedEvent.grossSales)}</span>
          </div>
          <div>
            <span className="text-slate-400">Ocupação: </span>
            <span className="font-semibold text-blue-400">{formatPercent(selectedEvent.occupationRate)}</span>
          </div>
          <div>
            <span className="text-slate-400">Ingressos: </span>
            <span className="font-semibold text-slate-200">{selectedEvent.ticketsSold} / {selectedEvent.totalCapacity}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/eventos/${selectedEvent.id}/dashboard`)}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
        >
          <span>Painel Analítico</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
