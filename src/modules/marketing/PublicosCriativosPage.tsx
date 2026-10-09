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
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
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
            onClick={() => alert('Criar novo público personalizado a partir da base DiskIngressos.')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Público</span>
          </button>
        ) : (
          <button
            onClick={() => alert('Fazer upload de nova peça criativa.')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enviar Criativo</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('AUDIENCES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'AUDIENCES'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Públicos & Audiências ({mockAudiences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CREATIVES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'CREATIVES'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Biblioteca de Criativos ({mockCreatives.length})</span>
        </button>
      </div>

      {/* Tab 1: Audiences Content */}
      {activeTab === 'AUDIENCES' && (
        <div className="space-y-4">
          <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="p-3.5 font-semibold">Nome do Público</th>
                  <th className="p-3.5 font-semibold">Tipo</th>
                  <th className="p-3.5 font-semibold text-center">Tamanho Estimado</th>
                  <th className="p-3.5 font-semibold">Sincronizado com</th>
                  <th className="p-3.5 font-semibold">Última Atualização</th>
                  <th className="p-3.5 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockAudiences.map((aud) => (
                  <tr key={aud.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-100">
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
                        onClick={() => alert(`Sincronizando ${aud.name} com Meta Ads e Google Ads...`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold rounded-lg border border-slate-700 transition"
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
          {mockCreatives.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#141b2d] border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
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
                <h4 className="text-xs font-bold text-slate-100 leading-snug">
                  {asset.title}
                </h4>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{asset.dimensions}</span>
                  <span className="font-mono text-blue-400">{asset.eventName}</span>
                </div>
              </div>

              <div className="p-3 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <button
                  onClick={() => alert(`Download de ${asset.title} iniciado.`)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo</span>
                </button>
                <button
                  onClick={() => alert('Link de compartilhamento copiado!')}
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
