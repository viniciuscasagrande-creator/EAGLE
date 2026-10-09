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
  const [integrations] = useState<PixelIntegration[]>(initialIntegrations);

  return (
    <div className="space-y-6">
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
          onClick={() => alert('Abrir assistente de configuração de novo Pixel / Tag.')}
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
                    onClick={() => {
                      navigator.clipboard.writeText(item.pixelId);
                      alert('ID copiado para a área de transferência!');
                    }}
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

            <div className="pt-3 border-t border-[#37393e] flex items-center justify-between text-xs">
              <button
                onClick={() => alert(`Configurações de integração para ${item.name}`)}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configurar</span>
              </button>
              <button
                onClick={() => alert(`Testando disparo de evento de teste para ${item.name}... Evento de teste enviado com sucesso!`)}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Testar Disparo</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
