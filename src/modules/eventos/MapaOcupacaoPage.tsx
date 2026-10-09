import React from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { MapPin, Users, Info, Eye, Layers } from 'lucide-react';
import { formatNumber, formatPercent } from '@/utils/formatters';

export const MapaOcupacaoPage: React.FC = () => {
  const { selectedEvent } = useEventContext();

  if (!selectedEvent) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Mapa & Ocupação do Espaço
        </h1>
        <p className="text-sm text-slate-400">
          {selectedEvent.name} — {selectedEvent.venue} ({selectedEvent.city}/{selectedEvent.state})
        </p>
      </div>

      {/* Visual Arena Representation */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-slate-100 text-base">
              Visão Esquematizada do Local
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500" /> Pista Premium (83%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-pink-500" /> Camarote VIP (85%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-500" /> Pista Geral (48%)
            </span>
          </div>
        </div>

        {/* Stage & Venue Layout Box */}
        <div className="max-w-3xl mx-auto space-y-4 my-8">
          {/* Stage */}
          <div className="w-3/4 mx-auto py-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-center rounded-xl border border-slate-500 text-xs font-bold text-white uppercase tracking-widest shadow-lg shadow-black/40">
            PALCO PRINCIPAL / STAGE
          </div>

          {/* Premium Area */}
          <div className="w-4/5 mx-auto p-4 bg-indigo-950/40 border-2 border-dashed border-indigo-500/60 rounded-xl text-center space-y-1">
            <div className="text-xs font-bold text-indigo-300 uppercase">
              Área Pista Premium VIP (1.250 / 1.500 ocupados - 83.3%)
            </div>
            <div className="text-[11px] text-slate-400">
              Acesso exclusivo frontal ao palco
            </div>
          </div>

          {/* Lateral Camarotes and Main Floor */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-1 p-3 bg-pink-950/40 border-2 border-dashed border-pink-500/60 rounded-xl text-center text-xs space-y-1">
              <div className="font-bold text-pink-300">Camarote A</div>
              <div className="text-[10px] text-slate-400">Open Bar</div>
              <div className="font-bold text-white text-[11px]">340 / 400</div>
            </div>

            <div className="col-span-3 p-6 bg-teal-950/30 border-2 border-dashed border-teal-500/60 rounded-xl text-center space-y-2">
              <div className="text-xs font-bold text-teal-300 uppercase">
                Pista Geral (1.320 / 2.700 ocupados - 48.8%)
              </div>
              <div className="text-[11px] text-slate-400">
                Acesso principal com bares e praça de alimentação
              </div>
            </div>

            <div className="col-span-1 p-3 bg-pink-950/40 border-2 border-dashed border-pink-500/60 rounded-xl text-center text-xs space-y-1">
              <div className="font-bold text-pink-300">Camarote B</div>
              <div className="text-[10px] text-slate-400">Open Bar</div>
              <div className="font-bold text-white text-[11px]">340 / 400</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>
            Para eventos com mapa de assentos numerados (teatros, arenas com cadeiras marcadas), a integração sincroniza os bloqueios e reservas em tempo real com a bilheteria oficial DiskIngressos.
          </span>
        </div>
      </div>
    </div>
  );
};
