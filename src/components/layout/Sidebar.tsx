import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Megaphone,
  Repeat,
  DollarSign,
  BarChart3,
  HeadphonesIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Ticket,
  MapPin,
  ShoppingCart,
  Gift,
  ArrowLeft,
  Sparkles,
  Users,
  Target,
  FileText,
  Percent,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    eventos: true,
    financeiro: false,
    comercial: false,
    marketing: false,
    remarketing: false,
  });

  const { selectedEvent, clearSelectedEvent } = useEventContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-expand the active section based on current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/eventos')) {
      setOpenSubmenus((prev) => ({ ...prev, eventos: true }));
    } else if (path.startsWith('/comercial')) {
      setOpenSubmenus((prev) => ({ ...prev, comercial: true }));
    } else if (path.startsWith('/marketing')) {
      setOpenSubmenus((prev) => ({ ...prev, marketing: true }));
    } else if (path.startsWith('/remarketing')) {
      setOpenSubmenus((prev) => ({ ...prev, remarketing: true }));
    } else if (path.startsWith('/financeiro')) {
      setOpenSubmenus((prev) => ({ ...prev, financeiro: true }));
    }
  }, [location.pathname]);

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReturnToGeneral = () => {
    clearSelectedEvent();
    navigate('/eventos');
  };

  const getSubmenuLinkClass = (isActive: boolean) =>
    `block py-1.5 px-2.5 text-xs rounded-md transition ${
      isActive
        ? 'text-blue-400 font-semibold bg-[#283142] border-l-2 border-blue-500 pl-2'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#202126]'
    }`;

  const getLevel2LinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
        : 'text-slate-300 hover:bg-[#25262c] hover:text-white'
    }`;

  // Level 2 Menu: Specific to an active Event
  if (selectedEvent) {
    return (
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } transition-all duration-300 ease-in-out border-r border-[#2b2c31] bg-[#151515] flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-30 select-none`}
      >
        {/* Event Header Banner in Sidebar */}
        <div className="p-3 border-b border-slate-800/80 bg-blue-950/20">
          <button
            onClick={handleReturnToGeneral}
            className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 mb-2 w-full transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {!collapsed && <span>Central de Eventos</span>}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.name}
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-blue-500/40"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 truncate">
                  {selectedEvent.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{selectedEvent.city}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Level 2 Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {!collapsed && 'Navegação do Evento'}
          </div>

          <NavLink
            to={`/eventos/${selectedEvent.id}/dashboard`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Dashboard do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/ingressos`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <Ticket className="w-4 h-4 flex-shrink-0 text-cyan-400" />
            {!collapsed && <span>Ingressos & Lotes</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/mapa`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <MapPin className="w-4 h-4 flex-shrink-0 text-amber-400" />
            {!collapsed && <span>Mapa / Ocupação</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/vendas`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <ShoppingCart className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            {!collapsed && <span>Pedidos e Vendas</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/cortesias`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <Gift className="w-4 h-4 flex-shrink-0 text-purple-400" />
            {!collapsed && <span>Cortesias Emitidas</span>}
          </NavLink>

          <div className="pt-2 border-t border-[#2b2c31]" />

          <NavLink
            to={`/eventos/${selectedEvent.id}/financeiro`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <DollarSign className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            {!collapsed && <span>Financeiro do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/comercial`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <Briefcase className="w-4 h-4 flex-shrink-0 text-amber-400" />
            {!collapsed && <span>Comercial do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/marketing`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <Megaphone className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            {!collapsed && <span>Marketing do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/remarketing`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <Repeat className="w-4 h-4 flex-shrink-0 text-pink-400" />
            {!collapsed && <span>Remarketing do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/relatorios`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0 text-violet-400" />
            {!collapsed && <span>Relatórios do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/configuracoes`}
            className={({ isActive }) => getLevel2LinkClass(isActive)}
          >
            <Settings className="w-4 h-4 flex-shrink-0 text-slate-400" />
            {!collapsed && <span>Configurações</span>}
          </NavLink>
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    );
  }

  // Level 1 Menu: General Producer Navigation
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 ease-in-out border-r border-[#2b2c31] bg-[#151515] flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-30 select-none`}
    >
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* 1. DASHBOARD GERAL */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-blue-400" />
          {!collapsed && <span>Dashboard Geral</span>}
        </NavLink>

        {/* 2. EVENTOS */}
        <div>
          <button
            onClick={() => toggleSubmenu('eventos')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              location.pathname.startsWith('/eventos')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 flex-shrink-0 text-indigo-400" />
              {!collapsed && <span>Eventos</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openSubmenus.eventos ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {openSubmenus.eventos && !collapsed && (
            <div className="ml-7 mt-1 space-y-1 border-l border-[#37393e] pl-2">
              <NavLink
                to="/eventos"
                end
                className={() =>
                  getSubmenuLinkClass(location.pathname === '/eventos' && !location.search)
                }
              >
                Todos os Eventos
              </NavLink>
              <NavLink
                to="/eventos?status=ACTIVE"
                className={() =>
                  getSubmenuLinkClass(location.pathname === '/eventos' && location.search.includes('status=ACTIVE'))
                }
              >
                Eventos Ativos
              </NavLink>
              <NavLink
                to="/eventos?status=UPCOMING"
                className={() =>
                  getSubmenuLinkClass(location.pathname === '/eventos' && location.search.includes('status=UPCOMING'))
                }
              >
                Eventos Futuros
              </NavLink>
              <NavLink
                to="/eventos?status=COMPLETED"
                className={() =>
                  getSubmenuLinkClass(location.pathname === '/eventos' && location.search.includes('status=COMPLETED'))
                }
              >
                Eventos Encerrados
              </NavLink>
              <NavLink
                to="/eventos/novo"
                className={({ isActive }) =>
                  `block py-1.5 px-2.5 text-xs rounded-md font-medium transition ${
                    isActive
                      ? 'text-emerald-300 font-bold bg-[#1a382e] border-l-2 border-emerald-500 pl-2'
                      : 'text-emerald-400 hover:text-emerald-300 hover:bg-[#202126]'
                  }`
                }
              >
                + Criar Novo Evento
              </NavLink>
              <NavLink
                to="/eventos/comparar"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Comparar Resultados
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. COMERCIAL */}
        <div>
          <button
            onClick={() => toggleSubmenu('comercial')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              location.pathname.startsWith('/comercial')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-slate-300 hover:bg-[#25262c] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 flex-shrink-0 text-amber-400" />
              {!collapsed && <span>Comercial</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openSubmenus.comercial ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {openSubmenus.comercial && !collapsed && (
            <div className="ml-7 mt-1 space-y-1 border-l border-[#37393e] pl-2">
              <NavLink
                to="/comercial"
                end
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Dashboard Comercial
              </NavLink>
              <NavLink
                to="/comercial/clientes"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Central de Clientes
              </NavLink>
              <NavLink
                to="/comercial/oportunidades"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Oportunidades & Funil
              </NavLink>
              <NavLink
                to="/comercial/propostas"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Orçamentos & Propostas
              </NavLink>
              <NavLink
                to="/comercial/vendas-corporativas"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Vendas Corporativas & Grupos
              </NavLink>
              <NavLink
                to="/comercial/parceiros"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Parceiros & Convênios
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. MARKETING */}
        <div>
          <button
            onClick={() => toggleSubmenu('marketing')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              location.pathname.startsWith('/marketing')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-slate-300 hover:bg-[#25262c] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Megaphone className="w-4 h-4 flex-shrink-0 text-cyan-400" />
              {!collapsed && <span>Marketing</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openSubmenus.marketing ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {openSubmenus.marketing && !collapsed && (
            <div className="ml-7 mt-1 space-y-1 border-l border-[#37393e] pl-2">
              <NavLink
                to="/marketing"
                end
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Dashboard Marketing
              </NavLink>
              <NavLink
                to="/marketing/campanhas"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Campanhas & Anúncios
              </NavLink>
              <NavLink
                to="/marketing/integracoes"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Meta / Google / TikTok Ads
              </NavLink>
              <NavLink
                to="/marketing/publicos"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Públicos & Criativos
              </NavLink>
            </div>
          )}
        </div>

        {/* 5. REMARKETING */}
        <div>
          <button
            onClick={() => toggleSubmenu('remarketing')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              location.pathname.startsWith('/remarketing')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-slate-300 hover:bg-[#25262c] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Repeat className="w-4 h-4 flex-shrink-0 text-pink-400" />
              {!collapsed && <span>Remarketing</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openSubmenus.remarketing ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {openSubmenus.remarketing && !collapsed && (
            <div className="ml-7 mt-1 space-y-1 border-l border-[#37393e] pl-2">
              <NavLink
                to="/remarketing"
                end
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Dashboard Remarketing
              </NavLink>
              <NavLink
                to="/remarketing/carrinhos-abandonados"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Carrinhos Abandonados
              </NavLink>
              <NavLink
                to="/remarketing/campanhas"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Disparos WhatsApp & E-mail
              </NavLink>
              <NavLink
                to="/remarketing/consentimento"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Consentimento & LGPD
              </NavLink>
            </div>
          )}
        </div>

        {/* 6. FINANCEIRO */}
        <div>
          <button
            onClick={() => toggleSubmenu('financeiro')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              location.pathname.startsWith('/financeiro')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-slate-300 hover:bg-[#25262c] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              {!collapsed && <span>Financeiro</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openSubmenus.financeiro ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {openSubmenus.financeiro && !collapsed && (
            <div className="ml-7 mt-1 space-y-1 border-l border-[#37393e] pl-2">
              <NavLink
                to="/financeiro"
                end
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Dashboard Financeiro
              </NavLink>
              <NavLink
                to="/financeiro/carteiras"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Carteiras dos Eventos
              </NavLink>
              <NavLink
                to="/financeiro/extrato-ledger"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Extrato Oficial (Ledger)
              </NavLink>
              <NavLink
                to="/financeiro/taxas-retencoes"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Taxas & Retenções
              </NavLink>
              <NavLink
                to="/financeiro/repasses"
                className={({ isActive }) =>
                  `block py-1.5 px-2.5 text-xs rounded-md font-medium transition ${
                    isActive
                      ? 'text-emerald-300 font-bold bg-[#1a382e] border-l-2 border-emerald-500 pl-2'
                      : 'text-emerald-400 hover:text-emerald-300 hover:bg-[#202126]'
                  }`
                }
              >
                Solicitar Repasse
              </NavLink>
              <NavLink
                to="/financeiro/antecipacoes"
                className={({ isActive }) => getSubmenuLinkClass(isActive)}
              >
                Antecipações
              </NavLink>
            </div>
          )}
        </div>

        {/* 7. RELATÓRIOS */}
        <NavLink
          to="/relatorios"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`
          }
        >
          <BarChart3 className="w-4 h-4 flex-shrink-0 text-violet-400" />
          {!collapsed && <span>Relatórios Consolidados</span>}
        </NavLink>

        {/* 8. ATENDIMENTO E SUPORTE */}
        <NavLink
          to="/suporte"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`
          }
        >
          <HeadphonesIcon className="w-4 h-4 flex-shrink-0 text-rose-400" />
          {!collapsed && <span>Atendimento & Suporte</span>}
        </NavLink>

        {/* 9. CONFIGURAÇÕES */}
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`
          }
        >
          <Settings className="w-4 h-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Configurações</span>}
        </NavLink>
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
