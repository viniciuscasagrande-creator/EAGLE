import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  GitCompareArrows,
  List,
  Grid2X2,
  Plus,
  Search,
  Download,
  Ticket,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useEventContext } from '@/contexts/EventContext';
import { HorizontalEventCard } from '@/components/cards/HorizontalEventCard';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const CentralEventosPage: React.FC = () => {
  const { allEvents, selectEvent } = useEventContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get('status');
  const [tab, setTab] = useState<'ACTIVE' | 'INACTIVE' | 'ALL' | 'UPCOMING' | 'COMPLETED'>(
    (statusParam as any) || 'ACTIVE'
  );

  useEffect(() => {
    if (statusParam) {
      setTab(statusParam as any);
    }
  }, [statusParam]);

  const [view, setView] = useState<'horizontal' | 'grid'>('horizontal');
  const [search, setSearch] = useState('');
  const [comparison, setComparison] = useState<string[]>([]);

  const handleTabChange = (newTab: 'ACTIVE' | 'INACTIVE' | 'ALL' | 'UPCOMING' | 'COMPLETED') => {
    setTab(newTab);
    if (newTab === 'ALL') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status: newTab });
    }
  };

  const events = useMemo(() =>
    allEvents.filter((e) => {
      let ok = true;
      if (tab === 'ACTIVE') ok = e.status === 'ACTIVE' || e.status === 'UPCOMING';
      else if (tab === 'UPCOMING') ok = e.status === 'UPCOMING';
      else if (tab === 'COMPLETED') ok = e.status === 'PAUSED' || e.status === 'CANCELLED';
      else if (tab === 'INACTIVE') ok = e.status !== 'ACTIVE' && e.status !== 'UPCOMING';

      const matchesSearch = [e.name, e.venue, e.code, e.city].some((v) =>
        (v || '').toLowerCase().includes(search.toLowerCase())
      );

      return ok && matchesSearch;
    }),
    [allEvents, tab, search]
  );

  const toggle = (id: string) =>
    setComparison((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const totalGrossSales = allEvents.reduce((acc, e) => acc + (e.grossSales || 0), 0);
  const totalTicketsSold = allEvents.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);
  const averageOccupancy =
    allEvents.length > 0
      ? allEvents.reduce((acc, e) => acc + (e.occupationRate || 0), 0) / allEvents.length
      : 0;

  const handleExportEvents = () => {
    downloadCsv(
      'central-eventos-diskingressos',
      ['Código', 'Nome do Evento', 'Local / Venue', 'Cidade / UF', 'Data Início', 'Ingressos Vendidos', 'Capacidade Total', 'Taxa Ocupação (%)', 'Faturamento Bruto (R$)', 'Status'],
      events.map((e) => [
        e.code,
        e.name,
        e.venue,
        `${e.city}/${e.state || 'PR'}`,
        e.dateStart,
        e.ticketsSold,
        e.totalCapacity,
        e.occupationRate,
        e.grossSales,
        e.status,
      ])
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Toolbar */}
      <div className="eagle-events-toolbar">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Central de Eventos</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Visão unificada de vendas, ocupação e indicadores operacionais dos seus eventos
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => comparison.length >= 2 && navigate(`/eventos/comparar?ids=${comparison.join(',')}`)}
            disabled={comparison.length < 2}
            className="eagle-toolbar-button disabled:opacity-50 cursor-pointer"
            title="Selecione dois ou mais eventos para comparar"
          >
            <GitCompareArrows size={18} />
            <span>Comparar {comparison.length > 0 ? `(${comparison.length})` : ''}</span>
          </button>

          <button
            onClick={() => setView((v) => (v === 'horizontal' ? 'grid' : 'horizontal'))}
            className="eagle-toolbar-button cursor-pointer"
          >
            {view === 'horizontal' ? <List size={18} /> : <Grid2X2 size={18} />}
            <span>{view === 'horizontal' ? 'Horizontal' : 'Grade'}</span>
          </button>

          <div className="inline-flex rounded-lg border border-[#37393e] overflow-hidden">
            {(['ACTIVE', 'UPCOMING', 'COMPLETED', 'ALL'] as const).map((x) => (
              <button
                key={x}
                onClick={() => handleTabChange(x)}
                className={`px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  tab === x
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#202124] text-slate-300 hover:bg-[#2c2d33]'
                }`}
              >
                {x === 'ACTIVE'
                  ? 'Ativos'
                  : x === 'UPCOMING'
                  ? 'Futuros'
                  : x === 'COMPLETED'
                  ? 'Encerrados'
                  : 'Todos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Eventos Listados</span>
          <div className="text-xl font-extrabold text-white mt-0.5">{events.length} eventos</div>
          <span className="text-[10px] text-emerald-400 font-semibold">
            {allEvents.filter((e) => e.status === 'ACTIVE' || e.status === 'UPCOMING').length} em vendas ativas
          </span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Ingressos Vendidos</span>
          <div className="text-xl font-extrabold text-blue-400 mt-0.5">{formatNumber(totalTicketsSold)} un</div>
          <span className="text-[10px] text-blue-400">Total acumulado na plataforma</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Faturamento Consolidado</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{formatCurrency(totalGrossSales)}</div>
          <span className="text-[10px] text-slate-400">Vendas brutas de bilheteria</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Taxa Média de Ocupação</span>
          <div className="text-xl font-extrabold text-teal-400 mt-0.5">{formatPercent(averageOccupancy)}</div>
          <span className="text-[10px] text-teal-400">Capacidade ocupada</span>
        </div>
      </div>

      {/* Filter and New Event */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <label className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, local, código ou cidade..."
            className="w-full bg-[#202124] border border-[#37393e] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportEvents}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => navigate('/eventos/novo')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="p-12 text-center bg-[#2c2d33] border border-[#37393e] rounded-lg text-slate-400 space-y-2">
          <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="text-white font-bold text-sm">Nenhum evento encontrado</div>
          <p className="text-xs text-slate-400">Ajuste o filtro de status ou cadastre um novo evento.</p>
        </div>
      ) : (
        <div
          className={
            view === 'horizontal'
              ? 'eagle-events-grid'
              : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
          }
        >
          {events.map((e) =>
            view === 'horizontal' ? (
              <HorizontalEventCard
                key={e.id}
                event={e}
                onCompareToggle={toggle}
                isComparing={comparison.includes(e.id)}
              />
            ) : (
              <button
                key={e.id}
                onClick={() => {
                  selectEvent(e);
                  navigate(`/eventos/${e.id}/dashboard`);
                }}
                className="bg-[#2c2d33] text-left rounded-lg overflow-hidden border border-[#37393e] hover:border-blue-500 transition cursor-pointer group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={e.imageUrl}
                    alt={e.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white font-bold">
                    {e.code}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                    {formatPercent(e.occupationRate)}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="font-bold text-white text-sm">{e.name}</div>
                  <div className="text-xs text-slate-400">{e.venue} • {e.city}</div>
                  <div className="pt-2 border-t border-[#37393e] flex items-center justify-between text-xs">
                    <span className="text-slate-400">{formatNumber(e.ticketsSold)} ingressos</span>
                    <span className="font-extrabold text-emerald-400 font-mono">{formatCurrency(e.grossSales)}</span>
                  </div>
                </div>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
