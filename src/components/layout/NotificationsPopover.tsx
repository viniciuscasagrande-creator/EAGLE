import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Flame,
  AlertTriangle,
  DollarSign,
  Briefcase,
  Ticket,
  ShieldCheck,
  X,
  ScanLine,
} from 'lucide-react';
import { AppNotification, NotificationCategory } from '@/types/notification';

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Virada de Lote Iminente',
    message: 'Setor Pista VIP atingiu 92% da cota. Virada automática programada para as 23:59.',
    category: 'URGENTE',
    timestamp: 'Há 5 minutos',
    read: false,
    actionUrl: '/eventos/ev-101/ingressos',
    actionLabel: 'Ver Lotes',
  },
  {
    id: 'notif-2',
    title: 'Proposta Corporativa Aprovada',
    message: 'Renault do Brasil aprovou a proposta #PROP-890 no valor de R$ 48.000 (120 camarotes).',
    category: 'COMERCIAL',
    timestamp: 'Há 22 minutos',
    read: false,
    actionUrl: '/comercial/propostas',
    actionLabel: 'Abrir Proposta',
  },
  {
    id: 'notif-3',
    title: 'Repasse PIX Liquidado',
    message: 'Repasse no valor de R$ 142.500,00 foi compensado e conciliado pelo Keeper ERP.',
    category: 'FINANCEIRO',
    timestamp: 'Há 1 hora',
    read: false,
    actionUrl: '/financeiro/repasses',
    actionLabel: 'Ver Extrato',
  },
  {
    id: 'notif-4',
    title: '8 Carrinhos Abandonados Recentes',
    message: 'Potencial recuperável de R$ 6.420 nos últimos 30 min. Disparar régua de WhatsApp.',
    category: 'VENDAS',
    timestamp: 'Há 2 horas',
    read: true,
    actionUrl: '/remarketing/carrinhos',
    actionLabel: 'Recuperar Agora',
  },
  {
    id: 'notif-5',
    title: 'Fluxo Intenso na Portaria',
    message: 'Portão B (Camarotes) registrou pico de 42 check-ins/min. 88% das catracas operando.',
    category: 'PORTARIA',
    timestamp: 'Há 3 horas',
    read: true,
    actionUrl: '/eventos/ev-101/portaria',
    actionLabel: 'Painel Portaria',
  },
  {
    id: 'notif-6',
    title: 'Antecipação Homologada',
    message: 'Comitê de Crédito Keeper ERP homologou a antecipação #ANT-2024-889 de R$ 35.000.',
    category: 'FINANCEIRO',
    timestamp: 'Há 5 horas',
    read: true,
    actionUrl: '/financeiro/antecipacoes',
    actionLabel: 'Ver Detalhes',
  },
];

export const NotificationsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setIsOpen(false);
    if (item.actionUrl) {
      navigate(item.actionUrl);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'UNREAD') return !n.read;
    return n.category === selectedCategory;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'URGENTE':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'FINANCEIRO':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'COMERCIAL':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'PORTARIA':
        return <ScanLine className="w-4 h-4 text-indigo-400" />;
      case 'VENDAS':
      default:
        return <Ticket className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
        title="Central de Alertas e Notificações"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#1a1c23] border border-slate-700/90 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 pb-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Central de Alertas</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {unreadCount} novas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            {[
              { id: 'ALL', label: 'Todas' },
              { id: 'UNREAD', label: `Não Lidas (${unreadCount})` },
              { id: 'URGENTE', label: 'Urgente' },
              { id: 'VENDAS', label: 'Vendas' },
              { id: 'FINANCEIRO', label: 'Financeiro' },
              { id: 'COMERCIAL', label: 'Comercial' },
              { id: 'PORTARIA', label: 'Portaria' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">Tudo em dia!</p>
                <p className="text-[11px]">Nenhuma notificação encontrada nesta categoria.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-800/70 transition cursor-pointer flex items-start gap-3 relative ${
                    !notif.read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/60 flex-shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-semibold truncate ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      {notif.actionLabel && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300">
                          <span>{notif.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}

                      {!notif.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          title="Marcar como lida"
                          className="text-[10px] text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-700/50 transition cursor-pointer ml-auto"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Sincronização em tempo real</span>
            <span className="text-emerald-500 font-mono">Keeper Feed: Online</span>
          </div>
        </div>
      )}
    </div>
  );
};
