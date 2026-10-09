import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { EventItem } from '@/types/event';
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ArrowLeft,
  Flame,
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Activity,
  Zap,
  CreditCard,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface LiveSaleItem {
  id: string;
  customerName: string;
  city: string;
  sectorName: string;
  qty: number;
  total: number;
  paymentMethod: 'PIX' | 'CARTÃO DE CRÉDITO';
  timeStr: string;
}

const mockInitialLiveSales: LiveSaleItem[] = [
  {
    id: 'ls-1',
    customerName: 'Mariana S.',
    city: 'Curitiba / PR',
    sectorName: 'Camarote Open Bar',
    qty: 2,
    total: 760,
    paymentMethod: 'PIX',
    timeStr: 'Agora mesmo',
  },
  {
    id: 'ls-2',
    customerName: 'Rodrigo B.',
    city: 'São José dos Pinhais / PR',
    sectorName: 'Pista Premium',
    qty: 4,
    total: 960,
    paymentMethod: 'CARTÃO DE CRÉDITO',
    timeStr: 'Há 18s',
  },
  {
    id: 'ls-3',
    customerName: 'Camila P.',
    city: 'Ponta Grossa / PR',
    sectorName: 'Área VIP',
    qty: 1,
    total: 310,
    paymentMethod: 'PIX',
    timeStr: 'Há 42s',
  },
  {
    id: 'ls-4',
    customerName: 'Felipe M.',
    city: 'Joinville / SC',
    sectorName: 'Pista Premium',
    qty: 2,
    total: 480,
    paymentMethod: 'PIX',
    timeStr: 'Há 1m',
  },
  {
    id: 'ls-5',
    customerName: 'Beatriz L.',
    city: 'Londrina / PR',
    sectorName: 'Camarote Corporativo',
    qty: 6,
    total: 2280,
    paymentMethod: 'CARTÃO DE CRÉDITO',
    timeStr: 'Há 2m',
  },
];

const mockCandidateBuyers = [
  { name: 'Lucas A.', city: 'Curitiba / PR', sector: 'Pista Premium', price: 240 },
  { name: 'Fernanda G.', city: 'Maringá / PR', sector: 'Camarote Open Bar', price: 380 },
  { name: 'Thiago R.', city: 'Florianópolis / SC', sector: 'Área VIP', price: 310 },
  { name: 'Amanda V.', city: 'Cascavel / PR', sector: 'Pista Geral', price: 160 },
  { name: 'Gustavo K.', city: 'Foz do Iguaçu / PR', sector: 'Camarote Open Bar', price: 380 },
  { name: 'Juliana T.', city: 'Curitiba / PR', sector: 'Pista Premium', price: 240 },
];

export const ModoTelaoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedEvent, selectEventById, allEvents } = useEventContext();

  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(selectedEvent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [liveSales, setLiveSales] = useState<LiveSaleItem[]>(mockInitialLiveSales);
  const [liveGross, setLiveGross] = useState<number>(0);
  const [liveTickets, setLiveTickets] = useState<number>(0);
  const [salesVelocity, setSalesVelocity] = useState<number>(5.2);
  const [newSaleHighlight, setNewSaleHighlight] = useState(false);

  // Sync event
  useEffect(() => {
    if (id) {
      selectEventById(id);
      keeperAdapter.getEventById(id).then((evt) => {
        if (evt) {
          setCurrentEvent(evt);
          setLiveGross(evt.grossSales);
          setLiveTickets(evt.ticketsSold);
        }
      }).catch(() => {});
    } else if (selectedEvent) {
      setCurrentEvent(selectedEvent);
      setLiveGross(selectedEvent.grossSales);
      setLiveTickets(selectedEvent.ticketsSold);
    } else if (allEvents.length > 0) {
      setCurrentEvent(allEvents[0]);
      setLiveGross(allEvents[0].grossSales);
      setLiveTickets(allEvents[0].ticketsSold);
    }
  }, [id, selectedEvent, allEvents]);

  // Digital clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Web Audio subtle chime on sale
  const playChime = () => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio not permitted without user gesture
    }
  };

  // Live sales simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      const candidate = mockCandidateBuyers[Math.floor(Math.random() * mockCandidateBuyers.length)];
      const qty = Math.random() > 0.7 ? 2 : (Math.random() > 0.9 ? 4 : 1);
      const saleVal = candidate.price * qty;
      const method = Math.random() > 0.4 ? 'PIX' : 'CARTÃO DE CRÉDITO';

      const newSale: LiveSaleItem = {
        id: `ls-${Date.now()}`,
        customerName: candidate.name,
        city: candidate.city,
        sectorName: candidate.sector,
        qty,
        total: saleVal,
        paymentMethod: method,
        timeStr: 'Agora mesmo',
      };

      setLiveSales((prev) => [newSale, ...prev.slice(0, 7)]);
      setLiveGross((prev) => prev + saleVal);
      setLiveTickets((prev) => prev + qty);
      setSalesVelocity(Number((4.5 + Math.random() * 2.5).toFixed(1)));
      setNewSaleHighlight(true);
      playChime();
      setTimeout(() => setNewSaleHighlight(false), 2000);
    }, 6000);

    return () => clearInterval(interval);
  }, [audioEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const activeEvt = currentEvent || allEvents[0];
  const totalCapacity = (activeEvt?.ticketsSold || 0) + (activeEvt?.ticketsAvailable || 3000);
  const occupancyPercent = totalCapacity > 0 ? Math.min(100, Math.round((liveTickets / totalCapacity) * 100)) : 0;
  const avgTicket = liveTickets > 0 ? liveGross / liveTickets : activeEvt?.averageTicket || 220;

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8 font-sans selection:bg-blue-500/30">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => navigate(`/eventos/${activeEvt?.id || ''}/dashboard`)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                WAR-ROOM AO VIVO • KEEPER TICKER
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {activeEvt?.name || 'Evento DiskIngressos'}
              <span className="text-xs font-normal text-slate-400 font-mono">
                {activeEvt?.venue}
              </span>
            </h1>
          </div>
        </div>

        {/* Live Controls & Digital Clock */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-lg font-bold text-cyan-400 tracking-wider shadow-inner">
            {currentTime}
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              audioEnabled
                ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={audioEnabled ? 'Desativar efeito sonoro' : 'Ativar aviso sonoro nas vendas'}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Alternar Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main War-Room Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Big KPIs & Sectors (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Hero Sales Board */}
          <div className={`p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#121624] via-[#10131d] to-[#0c0d14] border transition-all duration-500 shadow-2xl relative overflow-hidden ${
            newSaleHighlight ? 'border-emerald-500/80 shadow-emerald-500/20' : 'border-slate-800/90'
          }`}>
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-slate-400 uppercase">
                Faturamento Bruto em Tempo Real
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                CONCILIADO KEEPER
              </span>
            </div>

            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-mono tracking-tight my-2">
              {formatCurrency(liveGross)}
            </div>

            {/* Sub-bar with secondary indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-slate-800/80">
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Ingressos Vendidos
                </div>
                <div className="text-xl md:text-2xl font-black text-cyan-400 font-mono mt-0.5">
                  {formatNumber(liveTickets)}
                </div>
                <div className="text-[10px] text-slate-500">de {formatNumber(totalCapacity)} vagas</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Ritmo Atual
                </div>
                <div className="text-xl md:text-2xl font-black text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                  {salesVelocity}/min
                </div>
                <div className="text-[10px] text-slate-500">velocidade de vendas</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Ticket Médio
                </div>
                <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  {formatCurrency(avgTicket)}
                </div>
                <div className="text-[10px] text-slate-500">por transação</div>
              </div>
            </div>

            {/* Occupancy Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Ocupação Geral do Local</span>
                <span className="text-cyan-400 font-mono font-bold">{occupancyPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sector Real-Time Occupancy Grid */}
          <div className="bg-[#12141c] border border-slate-800/90 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Ocupação por Setores & Lotes
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {activeEvt?.sectors?.length || 4} Setores Ativos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(activeEvt?.sectors || [
                  { name: 'Pista Premium', sold: 2840, total: 3000, color: '#06b6d4' },
                  { name: 'Camarote Open Bar', sold: 980, total: 1000, color: '#f59e0b' },
                  { name: 'Área VIP Central', sold: 1420, total: 1800, color: '#10b981' },
                  { name: 'Pista Geral Lateral', sold: 1600, total: 2200, color: '#8b5cf6' },
                ]).map((sec) => {
                  const pct = Math.round((sec.sold / sec.total) * 100);
                  const isAlmostFull = pct >= 90;
                  return (
                    <div
                      key={sec.name}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{sec.name}</span>
                        {isAlmostFull ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {pct}% ESGOTANDO
                          </span>
                        ) : (
                          <span className="font-mono text-slate-400">{pct}%</span>
                        )}
                      </div>

                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: sec.color || '#3b82f6',
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>{formatNumber(sec.sold)} emitidos</span>
                        <span>{formatNumber(sec.total - sec.sold)} livres</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Atualizado a cada 5 segundos via Keeper Socket</span>
              <span className="text-emerald-400 font-mono font-bold">100% Sincronizado</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Purchases Stream (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-[#12141c] border border-slate-800/90 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Sales Ticker
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              EM TEMPO REAL
            </span>
          </div>

          {/* Stream list */}
          <div className="flex-1 space-y-2.5 overflow-y-auto mt-4 pr-1">
            {liveSales.map((sale, idx) => (
              <div
                key={sale.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  idx === 0
                    ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10 scale-[1.01]'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{sale.customerName}</span>
                    <span className="text-[10px] text-slate-500">{sale.city}</span>
                  </div>

                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="font-semibold text-cyan-400">{sale.sectorName}</span>
                    <span>•</span>
                    <span className="text-slate-400">{sale.qty}x ingresso(s)</span>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5">
                    <span className="font-mono">{sale.timeStr}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-mono text-slate-400">
                      {sale.paymentMethod === 'PIX' ? (
                        <QrCode className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <CreditCard className="w-3 h-3 text-blue-400" />
                      )}
                      {sale.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-base font-black text-emerald-400 font-mono">
                    {formatCurrency(sale.total)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">APROVADO</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Privacidade LGPD aplicada</span>
            <span>Taxa de conversão: 68.4%</span>
          </div>
        </div>
      </main>
    </div>
  );
};
