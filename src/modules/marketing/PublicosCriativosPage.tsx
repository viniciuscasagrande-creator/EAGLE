import React, { useState } from 'react';
import {
  Users,
  Image,
  Plus,
  Search,
  Download,
  Share2,
  RefreshCw,
  ExternalLink,
  Film,
  FileImage,
  Layers,
  Upload,
  CheckCircle2,
  X,
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

interface Audience {
  id: string;
  name: string;
  type: 'BUYERS' | 'ABANDONED_CART' | 'LOOKALIKE' | 'WEBSITE_VISITORS';
  size: number;
  syncedWith: string[];
  lastSync: string;
}

interface CreativeAsset {
  id: string;
  title: string;
  format: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  dimensions: string;
  eventName: string;
  thumbnailUrl: string;
  downloadUrl: string;
}

const mockAudiences: Audience[] = [
  {
    id: 'aud-1',
    name: 'Compradores de Edições Anteriores (2024-2026)',
    type: 'BUYERS',
    size: 24500,
    syncedWith: ['Meta Ads', 'Google Ads'],
    lastSync: 'Há 2 horas',
  },
  {
    id: 'aud-2',
    name: 'Lookalike 1% - Compradores VIP e Alta Frequência',
    type: 'LOOKALIKE',
    size: 1450000,
    syncedWith: ['Meta Ads'],
    lastSync: 'Ontem',
  },
  {
    id: 'aud-3',
    name: 'Abandonadores de Checkout - Últimos 14 Dias',
    type: 'ABANDONED_CART',
    size: 1820,
    syncedWith: ['Meta Ads', 'TikTok Ads'],
    lastSync: 'Há 15 minutos',
  },
  {
    id: 'aud-4',
    name: 'Visitantes da Página Oficial do Evento',
    type: 'WEBSITE_VISITORS',
    size: 68000,
    syncedWith: ['Google Ads', 'Meta Ads'],
    lastSync: 'Tempo Real',
  },
];

const mockCreatives: CreativeAsset[] = [
  {
    id: 'cr-1',
    title: 'Flyer Oficial de Divulgação (Feed Instagram)',
    format: 'IMAGE',
    dimensions: '1080x1080 px (1:1)',
    eventName: 'Festival XYZ 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    downloadUrl: '#',
  },
  {
    id: 'cr-2',
    title: 'Story Oficial Line-up Confirmado',
    format: 'IMAGE',
    dimensions: '1080x1920 px (9:16)',
    eventName: 'Festival XYZ 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    downloadUrl: '#',
  },
  {
    id: 'cr-3',
    title: 'Vídeo Teaser Oficial de Abertura de Vendas',
    format: 'VIDEO',
    dimensions: '1080x1920 px (Reels/TikTok)',
    eventName: 'Festival XYZ 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
    downloadUrl: '#',
  },
];

export const PublicosCriativosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'AUDIENCES' | 'CREATIVES'>('AUDIENCES');
  const [audiences, setAudiences] = useState<Audience[]>(mockAudiences);
  const [creatives, setCreatives] = useState<CreativeAsset[]>(mockCreatives);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Audience Modal State
  const [isNewAudienceOpen, setIsNewAudienceOpen] = useState(false);
  const [audName, setAudName] = useState('Público Compradores VIP 2026');
  const [audType, setAudType] = useState<Audience['type']>('BUYERS');
  const [syncMeta, setSyncMeta] = useState(true);
  const [syncGoogle, setSyncGoogle] = useState(true);

  // Upload Creative Modal State
  const [isUploadCreativeOpen, setIsUploadCreativeOpen] = useState(false);
  const [creativeTitle, setCreativeTitle] = useState('Anúncio Carrossel Ingressos');
  const [creativeFormat, setCreativeFormat] = useState<CreativeAsset['format']>('IMAGE');
  const [creativeDim, setCreativeDim] = useState('1080x1080');

  const handleCreateAudience = (e: React.FormEvent) => {
    e.preventDefault();
    const synced = [];
    if (syncMeta) synced.push('Meta Ads');
    if (syncGoogle) synced.push('Google Ads');

    const newAud: Audience = {
      id: `aud-${Date.now()}`,
      name: audName,
      type: audType,
      size: audType === 'LOOKALIKE' ? 1200000 : 4250,
      syncedWith: synced.length > 0 ? synced : ['Meta Ads'],
      lastSync: 'Agora mesmo',
    };
    setAudiences((prev) => [newAud, ...prev]);
    setIsNewAudienceOpen(false);
    setToastMessage(`Público "${audName}" gerado a partir do banco DiskIngressos e enviado aos canais!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleUploadCreative = (e: React.FormEvent) => {
    e.preventDefault();
    const newCr: CreativeAsset = {
      id: `cr-${Date.now()}`,
      title: creativeTitle,
      format: creativeFormat,
      dimensions: creativeDim,
      eventName: 'Festival XYZ 2026',
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
      downloadUrl: '#',
    };
    setCreatives((prev) => [newCr, ...prev]);
    setIsUploadCreativeOpen(false);
    setToastMessage(`Peça criativa "${creativeTitle}" adicionada à biblioteca de mídia!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleSyncAudience = (aud: Audience) => {
    setAudiences((prev) =>
      prev.map((a) => (a.id === aud.id ? { ...a, lastSync: 'Agora mesmo' } : a))
    );
    setToastMessage(`Sincronização de ${aud.name} concluída com sucesso com Meta Ads e Google Ads!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadAsset = (asset: CreativeAsset) => {
    setToastMessage(`Download de "${asset.title}" (${asset.dimensions}) iniciado!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyShareLink = (asset: CreativeAsset) => {
    navigator.clipboard.writeText(`https://cdn.diskingressos.com.br/assets/${asset.id}`);
    setToastMessage(`Link de compartilhamento de "${asset.title}" copiado para a área de transferência!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold">✓</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-cyan-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Públicos Segmentados & Biblioteca de Criativos
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Audiências Personalizadas & Peças de Mídia
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Exportação de bases de compradores para Meta/Google Ads e central de download de materiais gráficos.
          </p>
        </div>

        {activeTab === 'AUDIENCES' ? (
          <button
            onClick={() => setIsNewAudienceOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Público</span>
          </button>
        ) : (
          <button
            onClick={() => setIsUploadCreativeOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enviar Criativo</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#37393e] pb-2">
        <button
          onClick={() => setActiveTab('AUDIENCES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'AUDIENCES'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-[#25262c]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Públicos & Audiências ({mockAudiences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CREATIVES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'CREATIVES'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-[#25262c]'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Biblioteca de Criativos ({mockCreatives.length})</span>
        </button>
      </div>

      {/* Tab 1: Audiences Content */}
      {activeTab === 'AUDIENCES' && (
        <div className="space-y-4">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                  <th className="p-3.5 font-semibold">Nome do Público</th>
                  <th className="p-3.5 font-semibold">Tipo</th>
                  <th className="p-3.5 font-semibold text-center">Tamanho Estimado</th>
                  <th className="p-3.5 font-semibold">Sincronizado com</th>
                  <th className="p-3.5 font-semibold">Última Atualização</th>
                  <th className="p-3.5 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#37393e]">
                {audiences.map((aud) => (
                  <tr key={aud.id} className="hover:bg-[#25262c] transition">
                    <td className="p-3.5 font-bold text-white">
                      {aud.name}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {aud.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-extrabold text-emerald-400 text-sm">
                      {formatNumber(aud.size)}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {aud.syncedWith.join(', ')}
                    </td>
                    <td className="p-3.5 text-slate-400">{aud.lastSync}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleSyncAudience(aud)}
                        className="px-2.5 py-1 bg-[#202124] hover:bg-[#25262c] text-blue-400 text-xs font-semibold rounded-md border border-[#37393e] transition cursor-pointer"
                      >
                        Sincronizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Creatives Content */}
      {activeTab === 'CREATIVES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creatives.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md flex flex-col justify-between hover:border-[#4a4c55] transition"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                  {asset.format}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-white leading-snug">
                  {asset.title}
                </h4>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{asset.dimensions}</span>
                  <span className="font-mono text-blue-400">{asset.eventName}</span>
                </div>
              </div>

              <div className="p-3 border-t border-[#37393e] bg-[#232429] flex items-center justify-between">
                <button
                  onClick={() => handleDownloadAsset(asset)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo</span>
                </button>
                <button
                  onClick={() => handleCopyShareLink(asset)}
                  title="Copiar link de compartilhamento"
                  className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar Novo Público */}
      {isNewAudienceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criar Novo Público Personalizado</h3>
                  <p className="text-[11px] text-slate-400">Extração segura de compradores DiskIngressos</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewAudienceOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAudience} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome do Público *</label>
                <input
                  type="text"
                  required
                  value={audName}
                  onChange={(e) => setAudName(e.target.value)}
                  placeholder="Ex: Compradores VIP 2026"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Critério de Segmentação *</label>
                <select
                  value={audType}
                  onChange={(e) => setAudType(e.target.value as any)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="BUYERS">Compradores de Edições Anteriores (Base Geral)</option>
                  <option value="ABANDONED_CART">Visitantes que Abandonaram o Carrinho</option>
                  <option value="LOOKALIKE">Público Semelhante (Lookalike 1%)</option>
                  <option value="WEBSITE_VISITORS">Visitantes dos Últimos 30 Dias</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">Sincronização com Canais</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncMeta}
                      onChange={(e) => setSyncMeta(e.target.checked)}
                      className="rounded border-[#37393e] bg-[#202124] text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Meta Ads Custom Audiences</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncGoogle}
                      onChange={(e) => setSyncGoogle(e.target.checked)}
                      className="rounded border-[#37393e] bg-[#202124] text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Google Ads Customer Match</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setIsNewAudienceOpen(false)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Gerar Público</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Upload Criativo */}
      {isUploadCreativeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Enviar Nova Peça Criativa</h3>
                  <p className="text-[11px] text-slate-400">Armazenamento em CDN DiskIngressos</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadCreativeOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadCreative} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título da Peça *</label>
                <input
                  type="text"
                  required
                  value={creativeTitle}
                  onChange={(e) => setCreativeTitle(e.target.value)}
                  placeholder="Ex: Teaser 15s Stories Lineup"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Formato *</label>
                  <select
                    value={creativeFormat}
                    onChange={(e) => setCreativeFormat(e.target.value as any)}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="IMAGE">Imagem Estática</option>
                    <option value="VIDEO">Vídeo / Teaser</option>
                    <option value="CAROUSEL">Carrossel de Lotes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dimensões *</label>
                  <input
                    type="text"
                    required
                    value={creativeDim}
                    onChange={(e) => setCreativeDim(e.target.value)}
                    placeholder="Ex: 1080x1920"
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-[#37393e] rounded-lg p-6 text-center text-slate-400 space-y-2">
                <Upload className="w-8 h-8 mx-auto text-blue-400" />
                <p className="font-semibold text-white">Arraste seus arquivos JPG, PNG ou MP4</p>
                <p className="text-[11px] text-slate-500">Tamanho máximo: 100MB</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setIsUploadCreativeOpen(false)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Enviar Arquivo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
