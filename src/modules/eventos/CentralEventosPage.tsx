import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, GitCompareArrows, List, Grid2X2, Plus, Search } from 'lucide-react';
import { useEventContext } from '@/contexts/EventContext';
import { HorizontalEventCard } from '@/components/cards/HorizontalEventCard';

export const CentralEventosPage: React.FC = () => {
  const { allEvents, selectEvent } = useEventContext();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'ACTIVE' | 'INACTIVE' | 'ALL'>('ACTIVE');
  const [view, setView] = useState<'horizontal' | 'grid'>('horizontal');
  const [search, setSearch] = useState('');
  const [comparison, setComparison] = useState<string[]>([]);

  const events = useMemo(() =>
    allEvents.filter((e) => {
      const ok =
        tab === 'ALL' ||
        (tab === 'ACTIVE' && (e.status === 'ACTIVE' || e.status === 'UPCOMING')) ||
        (tab === 'INACTIVE' && e.status !== 'ACTIVE' && e.status !== 'UPCOMING');
      return (
        ok &&
        [e.name, e.venue, e.code].some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      );
    }),
    [allEvents, tab, search]
  );

  const toggle = (id: string) =>
    setComparison((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <div className="space-y-5">
      {/* Print 1 Toolbar */}
      <div className="eagle-events-toolbar">
        <h1 className="text-2xl font-bold text-white">Eventos</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => comparison.length >= 2 && navigate('/eventos/comparar')}
            disabled={comparison.length < 2}
            className="eagle-toolbar-button disabled:opacity-60"
            title="Selecione dois eventos para comparar"
          >
            <GitCompareArrows size={19} />
            Comparar {comparison.length > 0 ? `(${comparison.length})` : ''}
          </button>
          <button
            onClick={() => setView((v) => (v === 'horizontal' ? 'grid' : 'horizontal'))}
            className="eagle-toolbar-button"
          >
            {view === 'horizontal' ? <List size={19} /> : <Grid2X2 size={19} />}
            {view === 'horizontal' ? 'Horizontal' : 'Grade'}
          </button>
          <div className="inline-flex">
            {(['ACTIVE', 'INACTIVE', 'ALL'] as const).map((x) => (
              <button
                key={x}
                onClick={() => setTab(x)}
                className={`eagle-toolbar-button rounded-none first:rounded-l-md last:rounded-r-md ${
                  tab === x ? 'active' : ''
                }`}
              >
                <CalendarDays size={18} />
                {x === 'ACTIVE' ? 'Ativos' : x === 'INACTIVE' ? 'Inativos' : 'Todos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and New Event */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <label className="relative max-w-sm flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full bg-[#2c2d33] border border-[#44464e] rounded-md pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </label>
        <button
          onClick={() => navigate('/eventos/novo')}
          className="eagle-toolbar-button bg-blue-600 hover:bg-blue-500 text-white border-blue-500 transition cursor-pointer"
        >
          <Plus size={17} />
          Novo Evento
        </button>
      </div>

      {/* Events Grid (2 columns in desktop) */}
      {events.length === 0 ? (
        <div className="p-12 text-center bg-[#2c2d33] rounded-md text-slate-400">
          Nenhum evento encontrado.
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
                className="bg-[#2c2d33] text-left rounded-md overflow-hidden border border-[#35363c] hover:border-blue-500 transition cursor-pointer"
              >
                <img src={e.imageUrl} alt={e.name} className="w-full h-48 object-cover" />
                <div className="p-4 font-bold text-white">{e.name}</div>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
