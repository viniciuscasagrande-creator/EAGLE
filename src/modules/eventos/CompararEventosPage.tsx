import React, { useState, useEffect } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Ticket,
  Target,
  Users,
  Award,
  Download,
  Plus,
  X,
  Zap,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const CompararEventosPage: React.FC = () => {
  const { allEvents, selectEvent } = useEventContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const idsParam = searchParams.get('ids');
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (idsParam) {
      return idsParam.split(',').filter(Boolean);
    }
    return allEvents.slice(0, 3).map((e) => e.id);
  });

  const eventsToCompare = allEvents.filter((e) => selectedIds.includes(e.id));

  // Determine top performers
  const highestSalesEvent = [...eventsToCompare].sort((a, b) => (b.grossSales || 0) - (a.grossSales || 0))[0];
  const highestOccupancyEvent = [...eventsToCompare].sort((a, b) => (b.occupationRate || 0) - (a.occupationRate || 0))[0];
  const highestSpeedEvent = [...eventsToCompare].sort((a, b) => (b.salesVelocityPerHour || 0) - (a.salesVelocityPerHour || 0))[0];

  const handleRemove = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleAdd = (id: string) => {
    if (!selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleExportComparison = () => {
    downloadCsv(
      'comparativo-desempenho-eventos',
      ['Código', 'Evento', 'Local', 'Cidade', 'Ingressos Vendidos', 'Capacidade', 'Taxa Ocupação (%)', 'Faturamento Bruto (R$)', 'Ticket Médio (R$)', 'Velocidade (un/h)'],
      eventsToCompare.map((e) => [
        e.code,
        e.name,
        e.venue,
        e.city,
        e.ticketsSold,
        e.totalCapacity,
        e.occupationRate,
        e.grossSales,
        e.averageTicket,
        e.salesVelocityPerHour,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/eventos')}
            className="p-2 rounded-lg bg-[#2c2d33] border border-[#37393e] text-slate-300 hover:text-white hover:bg-[#35363c] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Comparador de Desempenho de Eventos
            </h1>
            <p className="text-sm text-slate-400">
              Análise comparativa cruzada de velocidade de vendas, ticket médio, ocupação e metas atingidas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {eventsToCompare.length > 0 && (
            <button
              onClick={handleExportComparison}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Exportar Comparativo (CSV)</span>
            </button>
          )}

          {/* Add Event Selector */}
          {selectedIds.length < allEvents.length && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) handleAdd(e.target.value);
              }}
              className="bg-[#202124] text-xs text-white px-3 py-2 rounded-lg border border-[#37393e] focus:outline-none"
            >
              <option value="">+ Adicionar Evento para Comparar</option>
              {allEvents
                .filter((e) => !selectedIds.includes(e.id))
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {eventsToCompare.length === 0 ? (
        <div className="p-12 text-center bg-[#2c2d33] border border-[#37393e] rounded-lg text-slate-400 space-y-2">
          <Target className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="text-white font-bold text-sm">Nenhum evento selecionado para comparação</div>
          <p className="text-xs text-slate-400">Selecione eventos pelo seletor acima ou volte à Central de Eventos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {eventsToCompare.map((event) => {
            const isTopSales = highestSalesEvent?.id === event.id && eventsToCompare.length > 1;
            const isTopOccupancy = highestOccupancyEvent?.id === event.id && eventsToCompare.length > 1;
            const isTopSpeed = highestSpeedEvent?.id === event.id && eventsToCompare.length > 1;

            return (
              <div
                key={event.id}
                className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md flex flex-col justify-between space-y-4 hover:border-[#4a4c55] transition relative"
              >
                {selectedIds.length > 1 && (
                  <button
                    onClick={() => handleRemove(event.id)}
                    className="absolute top-3 right-3 p-1 rounded-full bg-black/60 text-slate-400 hover:text-white transition cursor-pointer z-10"
                    title="Remover da comparação"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white font-bold">
                      {event.code}
                    </span>
                    {isTopSales && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow">
                        <Award className="w-3 h-3" />
                        Maior Faturamento
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base leading-tight">{event.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{event.venue} • {event.dateStart}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#37393e] text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Faturamento Bruto:</span>
                    <span className="font-extrabold text-emerald-400 text-sm font-mono">
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
                    <span className={`font-bold ${isTopOccupancy ? 'text-emerald-400 font-extrabold' : 'text-blue-400'}`}>
                      {formatPercent(event.occupationRate)}
                      {isTopOccupancy && ' ★'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Ticket Médio:</span>
                    <span className="font-bold text-slate-200 font-mono">
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
                    <span className="text-slate-400">Velocidade de Vendas:</span>
                    <span className={`font-bold flex items-center gap-1 ${isTopSpeed ? 'text-amber-400' : 'text-slate-300'}`}>
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{event.salesVelocityPerHour} un/h</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    selectEvent(event);
                    navigate(`/eventos/${event.id}/dashboard`);
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition cursor-pointer"
                >
                  Abrir Dashboard do Evento
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
