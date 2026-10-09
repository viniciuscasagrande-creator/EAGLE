import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, producer, isKeeperConnected, logout } = useAuth();
  const { selectedEvent, allEvents, selectEvent, clearSelectedEvent } = useEventContext();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const filteredEvents = allEvents.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectEvent = (event: typeof allEvents[0]) => {
    selectEvent(event);
    setShowEventDropdown(false);
    navigate(`/eventos/${event.id}/dashboard`);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0e1424] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Context */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => {
            clearSelectedEvent();
            navigate('/dashboard');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            D
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-base font-sans">
                DiskIngressos
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRODUTOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Portal Operacional & Comercial
            </p>
          </div>
        </div>

        {/* Core connection status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
          <span
            className={`w-2 h-2 rounded-full ${
              isKeeperConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-[11px] text-slate-300 font-medium">
            {isKeeperConnected ? 'Keeper Core: Online' : 'Keeper Core: Standby'}
          </span>
        </div>
      </div>

      {/* Global Event Search & Selector */}
      <div className="flex-1 max-w-md mx-4 relative hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar eventos por nome, código (#EVT) ou local..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowEventDropdown(true);
            }}
            onFocus={() => setShowEventDropdown(true)}
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Quick event results dropdown */}
        {showEventDropdown && searchQuery && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#141b2d] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Eventos Encontrados ({filteredEvents.length})
            </div>
            {filteredEvents.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-400 text-center">
                Nenhum evento correspondente
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleSelectEvent(evt)}
                  className="px-3 py-2.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-800/50 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={evt.imageUrl}
                      alt={evt.name}
                      className="w-8 h-8 rounded-md object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-200">{evt.name}</div>
                      <div className="text-xs text-slate-400">{evt.venue} • {evt.dateStart}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    {evt.code}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Active Event Indicator / Clear Context Button */}
        {selectedEvent ? (
          <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-500/30 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <div className="text-xs">
              <span className="text-slate-400 hidden xl:inline">Evento Ativo: </span>
              <span className="font-semibold text-blue-200">{selectedEvent.name}</span>
            </div>
            <button
              onClick={() => {
                clearSelectedEvent();
                navigate('/eventos');
              }}
              className="ml-1 text-[11px] text-blue-400 hover:text-blue-200 hover:underline cursor-pointer"
            >
              Trocar
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/eventos')}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Todos os Eventos</span>
          </button>
        )}

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* Help Center */}
        <button
          onClick={() => navigate('/suporte')}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition hidden sm:block"
          title="Central de Ajuda e Suporte"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        {/* Producer & User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800/80 transition cursor-pointer"
          >
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name || 'Produtor'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {producer?.tradeName || producer?.name || 'Produtor Disk'}
              </div>
              <div className="text-[11px] text-slate-400">{user?.name || 'Usuário'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#141b2d] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-200">{producer?.name || 'Produtor DiskIngressos'}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  CNPJ: {producer?.cnpj || 'Não informado'}
                </div>
                <div className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Conta Oficial DiskIngressos
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/configuracoes');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  Configurações e Dados Cadastrais
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/financeiro/dados-bancarios');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  Dados Bancários & PIX
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair do Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
