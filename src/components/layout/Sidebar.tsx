import React, { useState } from 'react';
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

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReturnToGeneral = () => {
    clearSelectedEvent();
    navigate('/eventos');
  };

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
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Dashboard do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/ingressos`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <Ticket className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Ingressos & Lotes</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/mapa`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Mapa / Ocupação</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/vendas`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <ShoppingCart className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Pedidos e Vendas</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/cortesias`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <Gift className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Cortesias Emitidas</span>}
          </NavLink>

          <div className="pt-2 border-t border-slate-800/80" />

          <NavLink
            to={`/eventos/${selectedEvent.id}/financeiro`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <DollarSign className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            {!collapsed && <span>Financeiro do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/comercial`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <Briefcase className="w-4 h-4 flex-shrink-0 text-amber-400" />
            {!collapsed && <span>Comercial do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/marketing`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <Megaphone className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            {!collapsed && <span>Marketing do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/remarketing`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <Repeat className="w-4 h-4 flex-shrink-0 text-pink-400" />
            {!collapsed && <span>Remarketing do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/relatorios`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Relatórios do Evento</span>}
          </NavLink>

          <NavLink
            to={`/eventos/${selectedEvent.id}/configuracoes`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`
            }
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
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
            <div className="ml-7 mt-1 space-y-1 border-l border-slate-800 pl-2">
              <NavLink
                to="/eventos"
                end
                className={({ isActive }) =>
                  `block py-1.5 px-2 text-xs rounded transition ${
                    isActive ? 'text-blue-400 font-semibold bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                Todos os Eventos
              </NavLink>
              <NavLink
                to="/eventos?status=ACTIVE"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Eventos Ativos
              </NavLink>
              <NavLink
                to="/eventos?status=UPCOMING"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Eventos Futuros
              </NavLink>
              <NavLink
                to="/eventos?status=COMPLETED"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Eventos Encerrados
              </NavLink>
              <NavLink
                to="/eventos/novo"
                className="block py-1.5 px-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                + Criar Novo Evento
              </NavLink>
              <NavLink
                to="/eventos/comparar"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
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
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
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
            <div className="ml-7 mt-1 space-y-1 border-l border-slate-800 pl-2">
              <NavLink
                to="/comercial"
                end
                className={({ isActive }) =>
                  `block py-1.5 px-2 text-xs rounded transition ${
                    isActive ? 'text-blue-400 font-semibold bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                Dashboard Comercial
              </NavLink>
              <NavLink
                to="/comercial/clientes"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Central de Clientes
              </NavLink>
              <NavLink
                to="/comercial/oportunidades"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Oportunidades & Funil
              </NavLink>
              <NavLink
                to="/comercial/propostas"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Orçamentos & Propostas
              </NavLink>
              <NavLink
                to="/comercial/vendas-corporativas"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Vendas Corporativas & Grupos
              </NavLink>
              <NavLink
                to="/comercial/parceiros"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
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
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
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
            <div className="ml-7 mt-1 space-y-1 border-l border-slate-800 pl-2">
              <NavLink
                to="/marketing"
                end
                className={({ isActive }) =>
                  `block py-1.5 px-2 text-xs rounded transition ${
                    isActive ? 'text-blue-400 font-semibold bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                Dashboard Marketing
              </NavLink>
              <NavLink
                to="/marketing/campanhas"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Campanhas & Anúncios
              </NavLink>
              <NavLink
                to="/marketing/integracoes"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Meta / Google / TikTok Ads
              </NavLink>
              <NavLink
                to="/marketing/publicos"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
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
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
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
            <div className="ml-7 mt-1 space-y-1 border-l border-slate-800 pl-2">
              <NavLink
                to="/remarketing"
                end
                className={({ isActive }) =>
                  `block py-1.5 px-2 text-xs rounded transition ${
                    isActive ? 'text-blue-400 font-semibold bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                Dashboard Remarketing
              </NavLink>
              <NavLink
                to="/remarketing/carrinhos-abandonados"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Carrinhos Abandonados
              </NavLink>
              <NavLink
                to="/remarketing/campanhas"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Disparos WhatsApp & E-mail
              </NavLink>
              <NavLink
                to="/remarketing/consentimento"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
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
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
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
            <div className="ml-7 mt-1 space-y-1 border-l border-slate-800 pl-2">
              <NavLink
                to="/financeiro"
                end
                className={({ isActive }) =>
                  `block py-1.5 px-2 text-xs rounded transition ${
                    isActive ? 'text-blue-400 font-semibold bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                Dashboard Financeiro
              </NavLink>
              <NavLink
                to="/financeiro/carteiras"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Carteiras dos Eventos
              </NavLink>
              <NavLink
                to="/financeiro/extrato-ledger"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Extrato Oficial (Ledger)
              </NavLink>
              <NavLink
                to="/financeiro/taxas-retencoes"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Taxas & Retenções
              </NavLink>
              <NavLink
                to="/financeiro/repasses"
                className="block py-1.5 px-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                Solicitar Repasse
              </NavLink>
              <NavLink
                to="/financeiro/antecipacoes"
                className="block py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 transition"
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
