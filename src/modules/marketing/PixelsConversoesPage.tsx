import React, { useState } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { mockEvents } from '@/services/api/mockSeedData';
import { Radio, AlertCircle, CheckCircle2, ShieldCheck, Plus, ExternalLink } from 'lucide-react';

export const PixelsConversoesPage: React.FC = () => {
  const { selectedEvent, selectEventById } = useEventContext();
  const [localEventId, setLocalEventId] = useState<string>(selectedEvent?.id || '');

  const activeEvent = mockEvents.find((e) => e.id === (selectedEvent?.id || localEventId));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Conversões & Pixels de Rastreamento
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Tags & Scripts
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Gerenciamento de tags do Meta Pixel, Google Tag Manager (GTM), TikTok Pixel e Twitter/X Ads
          </p>
        </div>
      </div>

      {/* Video 02:06-02:08 requirement: Prompt to select event when not chosen */}
      {!activeEvent ? (
        <div className="bg-[#2c2d33] border border-amber-500/40 rounded-xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Selecione um Evento para Continuar</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Os pixels e disparos de conversão são associados individualmente a cada bilheteria oficial. Escolha o evento abaixo para visualizar as tags ativas.
            </p>
          </div>
          <div className="max-w-xs mx-auto">
            <select
              value={localEventId}
              onChange={(e) => {
                setLocalEventId(e.target.value);
                selectEventById(e.target.value);
              }}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="">Selecione um evento...</option>
              {mockEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} — {ev.city}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={activeEvent.imageUrl}
                alt={activeEvent.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Evento Selecionado</span>
                <div className="font-bold text-white text-sm">{activeEvent.name}</div>
              </div>
            </div>

            <select
              value={activeEvent.id}
              onChange={(e) => {
                setLocalEventId(e.target.value);
                selectEventById(e.target.value);
              }}
              className="bg-[#202124] border border-[#37393e] rounded-lg p-2 text-xs text-white"
            >
              {mockEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  Trocar Evento: {ev.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pixels List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { name: 'Meta Pixel (Facebook/Instagram)', id: '491029481902481', status: 'Ativo e Transmitindo', events: 'PageView, ViewContent, InitiateCheckout, Purchase' },
              { name: 'Google Tag Manager / GA4', id: 'GTM-PX99021', status: 'Ativo e Transmitindo', events: 'page_view, begin_checkout, purchase' },
              { name: 'TikTok Ads Pixel', id: 'TT-PIXEL-7749', status: 'Ativo e Transmitindo', events: 'ViewContent, AddToCart, CompletePayment' },
            ].map((p, i) => (
              <div key={i} className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.status}
                  </span>
                </div>
                <div className="font-mono text-slate-300 text-xs bg-[#202124] p-2 rounded border border-[#37393e]">
                  ID: {p.id}
                </div>
                <div className="text-slate-400 text-[11px]">
                  <span className="text-slate-300 font-semibold">Gatilhos Ativos:</span> {p.events}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
