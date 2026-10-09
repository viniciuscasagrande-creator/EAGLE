import React, { useState } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { mockEvents } from '@/services/api/mockSeedData';
import {
  Radio,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Plus,
  ExternalLink,
  Zap,
  Trash2,
  X,
  Key,
} from 'lucide-react';

interface PixelItem {
  id: string;
  name: string;
  platform: string;
  pixelId: string;
  status: string;
  events: string;
}

const initialPixels: PixelItem[] = [
  {
    id: 'px-1',
    name: 'Meta Pixel (Facebook/Instagram)',
    platform: 'Meta Ads',
    pixelId: '491029481902481',
    status: 'Ativo e Transmitindo',
    events: 'PageView, ViewContent, InitiateCheckout, Purchase',
  },
  {
    id: 'px-2',
    name: 'Google Tag Manager / GA4',
    platform: 'Google Analytics',
    pixelId: 'GTM-PX99021',
    status: 'Ativo e Transmitindo',
    events: 'page_view, begin_checkout, purchase',
  },
  {
    id: 'px-3',
    name: 'TikTok Ads Pixel',
    platform: 'TikTok Ads',
    pixelId: 'TT-PIXEL-7749',
    status: 'Ativo e Transmitindo',
    events: 'ViewContent, AddToCart, CompletePayment',
  },
];

export const PixelsConversoesPage: React.FC = () => {
  const { selectedEvent, selectEventById } = useEventContext();
  const [localEventId, setLocalEventId] = useState<string>(selectedEvent?.id || '');
  const [pixels, setPixels] = useState<PixelItem[]>(initialPixels);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Pixel Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPixel, setNewPixel] = useState({
    name: '',
    platform: 'Meta Ads',
    pixelId: '',
    capiToken: '',
    events: 'PageView, InitiateCheckout, Purchase',
  });

  const activeEvent = mockEvents.find((e) => e.id === (selectedEvent?.id || localEventId));

  const handleAddPixel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPixel.name.trim() || !newPixel.pixelId.trim()) return;

    const created: PixelItem = {
      id: `px-${Date.now()}`,
      name: newPixel.name.trim(),
      platform: newPixel.platform,
      pixelId: newPixel.pixelId.trim(),
      status: 'Ativo e Transmitindo',
      events: newPixel.events,
    };

    setPixels((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewPixel({
      name: '',
      platform: 'Meta Ads',
      pixelId: '',
      capiToken: '',
      events: 'PageView, InitiateCheckout, Purchase',
    });
    setToastMessage(`Pixel "${created.name}" configurado e ativado para ${activeEvent?.name || 'o evento'}!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleTestPixel = (px: PixelItem) => {
    setToastMessage(`Disparo de teste executado com sucesso para ${px.name} (ID: ${px.pixelId})! Status: 200 OK`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleRemovePixel = (id: string, name: string) => {
    if (window.confirm(`Deseja remover o pixel "${name}" deste evento?`)) {
      setPixels((prev) => prev.filter((p) => p.id !== id));
      setToastMessage(`Pixel "${name}" removido com sucesso.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Conversões & Pixels de Rastreamento
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Tags & Scripts do Evento
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Gerenciamento de tags do Meta Pixel, Google Tag Manager (GTM), TikTok Pixel, Spotify CAPI e X Ads
          </p>
        </div>

        {activeEvent && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Pixel</span>
          </button>
        )}
      </div>

      {/* Prompt to select event when not chosen */}
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
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-blue-500/40"
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
            {pixels.map((p) => (
              <div key={p.id} className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] text-blue-400 font-mono font-bold block">{p.platform}</span>
                      <span className="font-bold text-white text-sm">{p.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      {p.status}
                    </span>
                  </div>

                  <div className="font-mono text-slate-200 text-xs bg-[#202124] p-2.5 rounded-lg border border-[#37393e] flex items-center justify-between">
                    <span>ID: {p.pixelId}</span>
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    <span className="text-slate-300 font-semibold block mb-0.5">Gatilhos Ativos:</span>
                    <span className="text-slate-400">{p.events}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#37393e] flex items-center justify-between">
                  <button
                    onClick={() => handleTestPixel(p)}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Testar Disparo</span>
                  </button>

                  <button
                    onClick={() => handleRemovePixel(p.id, p.name)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition cursor-pointer"
                    title="Remover Pixel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#2c2d33] border border-[#37393e] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Todos os pixels respeitam o consentimento da LGPD registrado pelo usuário no checkout.
            </span>
            <span className="text-blue-400 font-mono">Deduplicação CAPI Ativa</span>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Novo Pixel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Adicionar Pixel / Tag de Conversão</h3>
                <p className="text-xs text-slate-400">
                  Vincule um novo pixel de rastreamento para {activeEvent?.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleAddPixel} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Plataforma de Mídia *</label>
                <select
                  value={newPixel.platform}
                  onChange={(e) => setNewPixel({ ...newPixel, platform: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                  <option value="Google Analytics">Google Tag Manager / GA4</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="Spotify Ads">Spotify Ads</option>
                  <option value="Kwai Ads">Kwai Ads</option>
                  <option value="Twitter/X Ads">Twitter / X Ads</option>
                  <option value="Pinterest Ads">Pinterest Ads</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Identificação / Nome do Pixel *</label>
                <input
                  type="text"
                  required
                  value={newPixel.name}
                  onChange={(e) => setNewPixel({ ...newPixel, name: e.target.value })}
                  placeholder="Ex: Pixel Secundário de Lançamento"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Pixel ID / Measurement ID *</label>
                <input
                  type="text"
                  required
                  value={newPixel.pixelId}
                  onChange={(e) => setNewPixel({ ...newPixel, pixelId: e.target.value })}
                  placeholder="Ex: 849201948201948 ou G-XXXXXXXXXX"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Token de Acesso Server-Side / CAPI (Opcional)</label>
                <input
                  type="password"
                  value={newPixel.capiToken}
                  onChange={(e) => setNewPixel({ ...newPixel, capiToken: e.target.value })}
                  placeholder="Token de autorização para eventos no servidor..."
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Gatilhos de Eventos Rastreados</label>
                <input
                  type="text"
                  value={newPixel.events}
                  onChange={(e) => setNewPixel({ ...newPixel, events: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white bg-[#202124] rounded-lg border border-[#37393e] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition"
                >
                  Salvar e Ativar Pixel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
