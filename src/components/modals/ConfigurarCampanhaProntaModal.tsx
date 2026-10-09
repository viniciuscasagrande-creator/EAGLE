import React, { useState } from 'react';
import { ReadyCampaignTemplate, ReadyCampaignInstance } from '@/types/marketing';
import { mockEvents } from '@/services/api/mockSeedData';
import { X, Sparkles, CheckCircle2, Calendar, DollarSign, Layers } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ConfigurarCampanhaProntaModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ReadyCampaignTemplate | null;
  onSuccess: (instance: ReadyCampaignInstance) => void;
}

export const ConfigurarCampanhaProntaModal: React.FC<ConfigurarCampanhaProntaModalProps> = ({
  isOpen,
  onClose,
  template,
  onSuccess,
}) => {
  if (!isOpen || !template) return null;

  const [selectedEventId, setSelectedEventId] = useState(mockEvents[0]?.id || '');
  const [budget, setBudget] = useState(template.suggestedBudgetMin);
  const [channels, setChannels] = useState<string[]>(template.channels);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState(template.expectedDurationDays);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEvent = mockEvents.find((e) => e.id === selectedEventId) || mockEvents[0];

  const handleToggleChannel = (chan: string) => {
    if (channels.includes(chan)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== chan));
      }
    } else {
      setChannels([...channels, chan]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const end = new Date(startDate);
    end.setDate(end.getDate() + Number(durationDays));

    const newInstance: ReadyCampaignInstance = {
      id: `camp-ready-${Date.now()}`,
      templateId: template.id,
      title: `${template.title} — ${selectedEvent.name}`,
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      channels,
      status: 'ACTIVE',
      budget: Number(budget),
      spent: 0,
      conversions: 0,
      revenue: 0,
      startDate,
      endDate: end.toISOString().split('T')[0],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(newInstance);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Estratégia Pré-Configurada
              </span>
              <h3 className="text-base font-extrabold text-white">
                Configurar {template.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Tagline & Desc */}
          <div className="bg-[#202124] p-3.5 rounded-lg border border-[#37393e]">
            <div className="font-semibold text-white mb-1">{template.tagline}</div>
            <p className="text-slate-400 leading-relaxed">{template.description}</p>
            <div className="mt-2 text-[11px] text-slate-300">
              <span className="text-slate-400">Público Indicado:</span> {template.targetAudience}
            </div>
          </div>

          {/* Event Selector */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Selecione o Evento Vinculado *
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-amber-500"
            >
              {mockEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} — {evt.city}/{evt.state} ({evt.dateStart})
                </option>
              ))}
            </select>
          </div>

          {/* Channel Checkboxes */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Canais de Disparo e Mídia
            </label>
            <div className="grid grid-cols-3 gap-2">
              {template.channels.map((chan) => (
                <button
                  type="button"
                  key={chan}
                  onClick={() => handleToggleChannel(chan)}
                  className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                    channels.includes(chan)
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-[#202124] border-[#37393e] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-[11px]">{chan}</span>
                  {channels.includes(chan) && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Orçamento Previsto (R$)</span>
                <span className="text-[10px] text-slate-400">
                  Sugerido: {formatCurrency(template.suggestedBudgetMin)} - {formatCurrency(template.suggestedBudgetMax)}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg pl-9 pr-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">
                Duração da Campanha (Dias)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Data de Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2 text-white font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Actions */}
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
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-lg shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Ativando...' : 'Ativar Estratégia de Campanha'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
