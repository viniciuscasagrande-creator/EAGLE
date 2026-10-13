import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Percent,
  Calendar,
  Key,
  Database,
  CheckCircle2,
  Lock,
  Server,
  Zap,
} from 'lucide-react';

export const ConfiguracoesPlataformaPage: React.FC = () => {
  const [defaultTakeRate, setDefaultTakeRate] = useState(8.5);
  const [maxAdvanceRatio, setMaxAdvanceRatio] = useState(70);
  const [pixDisbursementSchedule, setPixDisbursementSchedule] = useState('D+0');
  const [creditCardDisbursementSchedule, setCreditCardDisbursementSchedule] = useState('D+30');
  const [keeperWebhookUrl, setKeeperWebhookUrl] = useState('https://api.keeper.diskingressos.com.br/v1/webhooks/settlement');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Configurações Gerais da Plataforma DiskIngressos
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Parâmetros operacionais globais, taxas de serviço, políticas de risco e integração com o Keeper Core.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Configurações globais salvas e sincronizadas em toda a rede!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Financial & Commercial Parameters */}
        <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Percent className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Parâmetros Comerciais Padrão</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Taxa de Serviço Padrão da Plataforma (Take Rate Base %)
              </label>
              <input
                type="number"
                step="0.1"
                value={defaultTakeRate}
                onChange={(e) => setDefaultTakeRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Aplicada por padrão a novos cadastros de produtoras sem contrato customizado.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Teto de Antecipação sobre Garantia Futura (%)
              </label>
              <input
                type="number"
                step="5"
                max="90"
                value={maxAdvanceRatio}
                onChange={(e) => setMaxAdvanceRatio(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Limite percentual máximo liberável para antecipação sobre o saldo futuro retido no Keeper.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Liquidation Schedules */}
        <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Prazos de Liquidação Financeira</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Prazo de Liquidação PIX
              </label>
              <select
                value={pixDisbursementSchedule}
                onChange={(e) => setPixDisbursementSchedule(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value="D+0">D+0 (Instantâneo)</option>
                <option value="D+1">D+1 (Próximo dia útil)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Prazo de Liquidação Cartão de Crédito
              </label>
              <select
                value={creditCardDisbursementSchedule}
                onChange={(e) => setCreditCardDisbursementSchedule(e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value="D+14">D+14 dias</option>
                <option value="D+30">D+30 dias (Padrão de Mercado)</option>
                <option value="D+POST">D+2 dias após o encerramento do evento</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Keeper Core Connection */}
        <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Integração Keeper ERP Core</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CONEXÃO ATIVA
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              URL do Webhook de Liquidação e Split Contábil
            </label>
            <input
              type="url"
              value={keeperWebhookUrl}
              onChange={(e) => setKeeperWebhookUrl(e.target.value)}
              className="w-full bg-slate-900/90 text-xs text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Criptografia mTLS & Assinatura HMAC SHA-256 habilitadas</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Todas as ordens de pagamento aos produtores exigem confirmação assinada pelo servidor Keeper.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition cursor-pointer"
          >
            Salvar Parâmetros da Plataforma
          </button>
        </div>
      </form>
    </div>
  );
};
