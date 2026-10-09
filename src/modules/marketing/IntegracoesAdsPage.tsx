import React, { useState } from 'react';
import {
  Share2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  ShieldCheck,
  Zap,
  Activity,
  Copy,
} from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

interface PixelIntegration {
  id: string;
  name: string;
  platform: 'META' | 'GOOGLE' | 'TIKTOK' | 'KWAI';
  pixelId: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ATTENTION';
  serverSideEnabled: boolean;
  lastEventReceived: string;
  trackedEventsCount: number;
}

const initialIntegrations: PixelIntegration[] = [
  {
    id: 'int-01',
    name: 'Meta Ads (Facebook & Instagram) Pixel + CAPI',
    platform: 'META',
    pixelId: '849201948201948',
    status: 'CONNECTED',
    serverSideEnabled: true,
    lastEventReceived: '2026-10-09T14:18:22',
    trackedEventsCount: 14250,
  },
  {
    id: 'int-02',
    name: 'Google Analytics 4 & Google Tag Manager (GTM)',
    platform: 'GOOGLE',
    pixelId: 'GTM-TX982LK / G-84729102',
    status: 'CONNECTED',
    serverSideEnabled: true,
    lastEventReceived: '2026-10-09T14:19:05',
    trackedEventsCount: 22890,
  },
  {
    id: 'int-03',
    name: 'TikTok Pixel Web & Events API',
    platform: 'TIKTOK',
    pixelId: 'C789B102948201',
    status: 'CONNECTED',
    serverSideEnabled: false,
    lastEventReceived: '2026-10-09T13:45:00',
    trackedEventsCount: 3120,
  },
];

export const IntegracoesAdsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<PixelIntegration[]>(initialIntegrations);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [configuringItem, setConfiguringItem] = useState<PixelIntegration | null>(null);

  // New Pixel Form State
  const [newPlatform, setNewPlatform] = useState<'META' | 'GOOGLE' | 'TIKTOK' | 'KWAI'>('META');
  const [newName, setNewName] = useState('Meta Pixel Secundário');
  const [newPixelId, setNewPixelId] = useState('849201948201948');
  const [newCapi, setNewCapi] = useState(true);

  const handleCreatePixel = (e: React.FormEvent) => {
    e.preventDefault();
    const newInt: PixelIntegration = {
      id: `int-${Date.now()}`,
      name: newName,
      platform: newPlatform,
      pixelId: newPixelId,
      status: 'CONNECTED',
      serverSideEnabled: newCapi,
      lastEventReceived: new Date().toISOString(),
      trackedEventsCount: 0,
    };
    setIntegrations((prev) => [newInt, ...prev]);
    setIsNewModalOpen(false);
    setToastMessage(`Pixel "${newName}" conectado e sincronizado com o motor de tracking DiskIngressos!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleTestEvent = (item: PixelIntegration) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              trackedEventsCount: i.trackedEventsCount + 1,
              lastEventReceived: new Date().toISOString(),
            }
          : i
      )
    );
    setToastMessage(`Disparo de teste "Purchase" transmitido com sucesso via CAPI para ${item.name}!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleCopyId = (pixelId: string) => {
    navigator.clipboard.writeText(pixelId);
    setToastMessage(`ID "${pixelId}" copiado para a área de transferência!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringItem) return;
    setIntegrations((prev) =>
      prev.map((i) => (i.id === configuringItem.id ? configuringItem : i))
    );
    setConfiguringItem(null);
    setToastMessage(`Configurações de ${configuringItem.name} atualizadas com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-blue-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Integrações de Pixels & Tags de Rastreamento
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Conversions API (CAPI) & GTM
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Conexão dos pixels oficiais para rastreamento de compras, checkout iniciado e visualizações de página.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Conectar Novo Pixel</span>
        </button>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-lg bg-[#2c2d33] border border-[#37393e] flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white">
            Rastreamento Híbrido: Navegador + Servidor (CAPI)
          </div>
          <p className="text-slate-300 leading-relaxed">
            O Portal do Produtor DiskIngressos envia eventos tanto via navegador quanto via servidor (Conversions API do Meta), garantindo precisão superior de atribuição mesmo com bloqueadores de anúncio e restrições de cookies do iOS 14+.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md flex flex-col justify-between space-y-4 hover:border-[#4a4c55] transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {item.platform}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Ativo & Conectado
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{item.name}</h3>

              <div className="mt-3 p-2.5 bg-[#232429] rounded-md border border-[#37393e] space-y-1 text-xs">
                <div className="text-[11px] text-slate-400">Identificador (ID do Pixel):</div>
                <div className="font-mono font-bold text-white flex items-center justify-between">
                  <span className="truncate">{item.pixelId}</span>
                  <button
                    onClick={() => handleCopyId(item.pixelId)}
                    className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Copiar ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Conversions API (Server-Side):</span>
                  <span className="font-bold text-emerald-400">
                    {item.serverSideEnabled ? 'Habilitado' : 'Apenas Client'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Eventos Capturados:</span>
                  <span className="font-bold text-white">{item.trackedEventsCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Último Disparo:</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {formatDateTime(item.lastEventReceived)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#37393e] flex items-center justify-between text-xs mt-3">
              <button
                onClick={() => setConfiguringItem(item)}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configurar</span>
              </button>
              <button
                onClick={() => handleTestEvent(item)}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Testar Disparo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Conectar Novo Pixel */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Conectar Novo Pixel / Tag</h3>
                  <p className="text-[11px] text-slate-400">Rastreamento Server-Side e Client</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePixel} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Plataforma *</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as any)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="META">Meta Ads (Facebook & Instagram)</option>
                  <option value="GOOGLE">Google Ads & GA4</option>
                  <option value="TIKTOK">TikTok Ads Pixel</option>
                  <option value="KWAI">Kwai Ads Pixel</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome de Identificação *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Meta Pixel Festival XYZ"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pixel ID ou Measurement ID *</label>
                <input
                  type="text"
                  required
                  value={newPixelId}
                  onChange={(e) => setNewPixelId(e.target.value)}
                  placeholder="Ex: 849201948201948 ou G-XXXXXXX"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="capiCheckbox"
                  checked={newCapi}
                  onChange={(e) => setNewCapi(e.target.checked)}
                  className="rounded border-[#37393e] bg-[#202124] text-blue-600 focus:ring-0"
                />
                <label htmlFor="capiCheckbox" className="text-slate-300 font-medium cursor-pointer">
                  Habilitar Conversions API Server-Side nativo
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Salvar & Conectar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Configurar Pixel */}
      {configuringItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Configurações de Pixel</h3>
                  <p className="text-[11px] text-slate-400">{configuringItem.name}</p>
                </div>
              </div>
              <button
                onClick={() => setConfiguringItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome do Rastreamento</label>
                <input
                  type="text"
                  required
                  value={configuringItem.name}
                  onChange={(e) => setConfiguringItem({ ...configuringItem, name: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pixel ID</label>
                <input
                  type="text"
                  required
                  value={configuringItem.pixelId}
                  onChange={(e) => setConfiguringItem({ ...configuringItem, pixelId: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editCapiCheckbox"
                  checked={configuringItem.serverSideEnabled}
                  onChange={(e) =>
                    setConfiguringItem({ ...configuringItem, serverSideEnabled: e.target.checked })
                  }
                  className="rounded border-[#37393e] bg-[#202124] text-blue-600 focus:ring-0"
                />
                <label htmlFor="editCapiCheckbox" className="text-slate-300 font-medium cursor-pointer">
                  Conversions API (CAPI) Ativo
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setConfiguringItem(null)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
