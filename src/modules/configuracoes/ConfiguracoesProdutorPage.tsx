import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building,
  Shield,
  Key,
  Bell,
  CheckCircle2,
  Save,
  Activity,
  Server,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { keeperAdapter } from '@/services/api/keeperAdapter';

export const ConfiguracoesProdutorPage: React.FC = () => {
  const { producer } = useAuth();
  const [settings, setSettings] = useState({
    webhookUrl: 'https://api.produtor.com.br/webhooks/diskingressos',
    emailDailySummary: true,
    whatsappSaleAlert: true,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [healthResult, setHealthResult] = useState<{
    status: 'ONLINE' | 'OFFLINE';
    latencyMs: number;
    url: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    keeperAdapter.getProducerSettings().then((res) => {
      if (res?.notifications) {
        setSettings({
          webhookUrl: res.notifications.webhookUrl || '',
          emailDailySummary: res.notifications.emailDailySummary ?? true,
          whatsappSaleAlert: res.notifications.whatsappSaleAlert ?? true,
        });
      }
    });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await keeperAdapter.updateProducerSettings({ notifications: settings });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setHealthResult(null);
    try {
      const res = await keeperAdapter.testKeeperConnection();
      setHealthResult(res);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Configurações & Governança do Produtor
        </h1>
        <p className="text-sm text-slate-400">
          Dados da organização, credenciais financeiras, webhooks e diagnóstico de conectividade com o Keeper Core ERP
        </p>
      </div>

      {/* Diagnóstico da Conexão com Keeper Core */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#37393e]">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-white text-sm">
                Conectividade com Keeper Core API
              </h3>
              <p className="text-xs text-slate-400">
                Verifique em tempo real a latência e o status do motor financeiro e contábil central
              </p>
            </div>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? 'Testando Ping...' : 'Testar Conexão Keeper'}</span>
          </button>
        </div>

        {healthResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 ${
              healthResult.status === 'ONLINE'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}
          >
            {healthResult.status === 'ONLINE' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold">
                  Status: {healthResult.status === 'ONLINE' ? 'ONLINE (Conectado)' : 'OFFLINE / STANDBY'}
                </span>
                <span className="font-mono text-[11px] font-bold">
                  Latência: {healthResult.latencyMs}ms
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Endpoint: {healthResult.url}
              </div>
              {healthResult.error && (
                <div className="text-[11px] text-amber-400 font-semibold">
                  Detalhe: {healthResult.error} (Modo de resiliência e auditoria de dados ativo).
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dados da Empresa Produtora */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-6 shadow-md space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#37393e]">
          <Building className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">
            Dados da Empresa Produtora
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Razão Social</label>
            <input
              type="text"
              readOnly
              value={producer.name}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nome Fantasia</label>
            <input
              type="text"
              readOnly
              value={producer.tradeName || producer.name}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">CNPJ</label>
            <input
              type="text"
              readOnly
              value={producer.cnpj}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">E-mail Financeiro</label>
            <input
              type="text"
              readOnly
              value={producer.email}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#37393e] space-y-4">
          <h4 className="font-bold text-white text-sm">Dados Bancários para Liquidação PIX</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Banco</label>
              <input
                type="text"
                readOnly
                value={producer.bankName}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Agência e Conta</label>
              <input
                type="text"
                readOnly
                value={`${producer.agency} / ${producer.account}`}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Chave PIX Oficial</label>
              <input
                type="text"
                readOnly
                value={producer.pixKey}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Webhooks e Notificações */}
      <form onSubmit={handleSaveSettings} className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-6 shadow-md space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#37393e]">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">
            Notificações & Webhooks
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">URL de Webhook (Eventos de Venda em Tempo Real)</label>
            <input
              type="url"
              value={settings.webhookUrl}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              placeholder="https://seu-sistema.com/webhook/diskingressos"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailDailySummary}
                onChange={(e) => setSettings({ ...settings, emailDailySummary: e.target.checked })}
                className="rounded bg-[#202124] border-[#37393e] text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-white font-semibold block">Relatório diário por e-mail</span>
                <span className="text-slate-400 text-[11px]">Receba o fechamento de vendas consolidado às 23:59</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.whatsappSaleAlert}
                onChange={(e) => setSettings({ ...settings, whatsappSaleAlert: e.target.checked })}
                className="rounded bg-[#202124] border-[#37393e] text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-white font-semibold block">Alertas de virada de lote no WhatsApp</span>
                <span className="text-slate-400 text-[11px]">Notificação instantânea quando um lote atingir 90% de ocupação</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-[#37393e] flex items-center justify-between">
          {saveSuccess ? (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Preferências salvas com sucesso!
            </span>
          ) : (
            <span className="text-xs text-slate-400">As configurações são sincronizadas com sua conta de produtor.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Preferências</span>
          </button>
        </div>
      </form>
    </div>
  );
};
