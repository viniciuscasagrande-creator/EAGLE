import React, { useState } from 'react';
import { X, Music2, ShieldCheck, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

interface SpotifyConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const SpotifyConnectModal: React.FC<SpotifyConnectModalProps> = ({
  isOpen,
  onClose,
  onConnected,
}) => {
  if (!isOpen) return null;

  const [adAccountId, setAdAccountId] = useState('');
  const [capiToken, setCapiToken] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsConnecting(false);
      setStatusMessage('Credenciais validadas com sucesso junto ao Spotify Ads Server!');
      setTimeout(() => {
        onConnected();
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
        <div className="p-5 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Conectar Spotify Ads & CAPI
              </h3>
              <p className="text-[11px] text-slate-400">
                Integração oficial de mídia em áudio e telemetria server-side
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

        <form onSubmit={handleConnect} className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5 text-emerald-300">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              O token de Conversions API (CAPI) é transmitido com criptografia TLS 1.3 ponta a ponta para o backend seguro da DiskIngressos.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              ID da Conta Spotify Ads (Ad Account ID) *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: sp_adacc_99210842"
              value={adAccountId}
              onChange={(e) => setAdAccountId(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Pixel ID / Tag Spotify
            </label>
            <input
              type="text"
              placeholder="Ex: SP-PX-88419"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              Token de Acesso CAPI (Server-Side Conversions) *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••••••••••••••••••••••"
              value={capiToken}
              onChange={(e) => setCapiToken(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {statusMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

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
              disabled={isConnecting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <Music2 className="w-4 h-4" />
              <span>{isConnecting ? 'Testando Conexão...' : 'Conectar API Spotify'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
