import React, { useState, useMemo } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { HorizontalEventCard } from '@/components/cards/HorizontalEventCard';
import { EventItem } from '@/types/event';
import {
  Calendar,
  Plus,
  BarChart2,
  Search,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  Ticket,
  DollarSign,
  Grid,
  List,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export const CentralEventosPage: React.FC = () => {
  const { allEvents, selectEvent } = useEventContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'horizontal' | 'grid'>('horizontal');
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  // Filtered list
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      const matchesTab =
        activeTab === 'ALL' ||
        (activeTab === 'ACTIVE' && evt.status === 'ACTIVE') ||
        (activeTab === 'UPCOMING' && evt.status === 'UPCOMING') ||
        (activeTab === 'COMPLETED' && evt.status === 'COMPLETED');

      const matchesSearch =
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.code.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [allEvents, activeTab, searchQuery]);

  // Aggregated KPIs
  const stats = useMemo(() => {
    const totalGross = allEvents.reduce((acc, curr) => acc + curr.grossSales, 0);
    const totalSold = allEvents.reduce((acc, curr) => acc + curr.ticketsSold, 0);
    const activeCount = allEvents.filter((e) => e.status === 'ACTIVE').length;
    return { totalGross, totalSold, activeCount, count: allEvents.length };
  }, [allEvents]);

  const handleToggleCompare = (id: string) => {
    setComparingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Central de Eventos
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {filteredEvents.length} listados
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Painel comercial e operacional central para administração dos seus eventos na DiskIngressos
          </p>
        </div>

        <div className="flex items-center gap-3">
          {comparingIds.length > 1 && (
            <button
              onClick={() => navigate('/eventos/comparar')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow transition"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Comparar ({comparingIds.length})</span>
            </button>
          )}

          <button
            onClick={() => navigate('/eventos/novo')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Quick Overview Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total de Eventos</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-1">
            {stats.count}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">
            {stats.activeCount} eventos ativos no ar
          </div>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Vendas Totais</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {formatCurrency(stats.totalGross)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Faturamento acumulado geral
          </div>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ingressos Emitidos</span>
            <Ticket className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-1">
            {formatNumber(stats.totalSold)} un
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Todos os lotes e setores
          </div>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Conexão Keeper</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-1">
            Sincronizado
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Tempo real via Ledger
          </div>
        </div>
      </div>

      {/* Tabs and Filter Bar */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Todos os Eventos ({allEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'ACTIVE'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Ativos ({allEvents.filter((e) => e.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'UPCOMING'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Em Breve ({allEvents.filter((e) => e.status === 'UPCOMING').length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'COMPLETED'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Encerrados ({allEvents.filter((e) => e.status === 'COMPLETED').length})
          </button>
        </div>

        {/* Search Input & View Switch */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar evento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center border border-slate-800 rounded-lg p-0.5 bg-slate-900">
            <button
              onClick={() => setViewMode('horizontal')}
              className={`p-1.5 rounded ${
                viewMode === 'horizontal' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Cards Horizontais (Padrão)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grade de Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">Nenhum evento encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Não há eventos correspondentes aos filtros selecionados. Tente ajustar a busca ou cadastrar um novo evento.
          </p>
        </div>
      ) : viewMode === 'horizontal' ? (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <HorizontalEventCard
              key={event.id}
              event={event}
              onCompareToggle={handleToggleCompare}
              isComparing={comparingIds.includes(event.id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => {
                selectEvent(event);
                navigate(`/eventos/${event.id}/dashboard`);
              }}
              className="bg-[#141b2d] border border-slate-800 hover:border-blue-500/50 rounded-xl overflow-hidden cursor-pointer transition group"
            >
              <div className="h-40 relative">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                  {event.code}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-bold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
                  {event.name}
                </h4>
                <div className="text-xs text-slate-400">
                  {event.venue} • {event.dateStart}
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
