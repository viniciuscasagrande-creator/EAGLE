import React, { useState } from 'react';
import { MarketingCampaign } from '@/types/marketing';
import { mockEvents } from '@/services/api/mockSeedData';
import { X, Megaphone, Plus, Calendar, DollarSign, Target, CheckCircle2 } from 'lucide-react';

interface NovaCampanhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCamp: MarketingCampaign) => void;
}

export const NovaCampanhaModal: React.FC<NovaCampanhaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(mockEvents[0]?.id || '');
  const [channel, setChannel] = useState<'META_ADS' | 'GOOGLE_ADS' | 'TIKTOK_ADS' | 'SPOTIFY_ADS'>('META_ADS');
  const [budget, setBudget] = useState(1000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEvent = mockEvents.find((e) => e.id === selectedEventId) || mockEvents[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      name,
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      channel,
      status: 'ACTIVE',
      budgetSpent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      attributedRevenue: 0,
      roas: 0,
      startDate,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(newCamp);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200">
        <div className="p-5 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Criar Nova Campanha de Mídia
              </h3>
              <p className="text-[11px] text-slate-400">
                Veiculação programada vinculada ao inventário oficial de ingressos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Nome da Campanha *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Meta Ads - Lote 2 Conversão Stories"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Evento Associado *
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              {mockEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} — {evt.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Canal de Mídia / Plataforma
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'META_ADS', label: 'Meta Ads (Insta/Face)' },
                { id: 'GOOGLE_ADS', label: 'Google Ads (Search/PMax)' },
                { id: 'TIKTOK_ADS', label: 'TikTok Ads' },
                { id: 'SPOTIFY_ADS', label: 'Spotify Ads & CAPI' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setChannel(item.id as any)}
                  className={`p-2.5 rounded-lg border text-left font-semibold transition ${
                    channel === item.id
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                      : 'bg-[#202124] border-[#37393e] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">
                Orçamento Previsto (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg pl-9 pr-3 py-2 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">
                Data de Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Gravando...' : 'Cadastrar Campanha'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
