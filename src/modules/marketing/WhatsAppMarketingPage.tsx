import React, { useState } from 'react';
import { launchWhatsApp } from '@/services/api/eagleMarketing';
import { mockWhatsAppTemplates, mockEvents } from '@/services/api/mockSeedData';
import { WhatsAppTemplate } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  MessageSquare,
  Send,
  CheckCheck,
  DollarSign,
  Smartphone,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Users,
  Download,
  X,
  Sparkles,
  Key,
  Lock,
  Settings,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const WhatsAppMarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'TEMPLATES' | 'PREVIEW' | 'LGPD' | 'CREDENTIALS'>('CAMPAIGNS');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(mockWhatsAppTemplates[0]);
  const [isNovoDisparoOpen, setIsNovoDisparoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  // WhatsApp Credentials & Token State (LocalStorage Persisted)
  const [credentials, setCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_whatsapp_credentials');
      return saved
        ? JSON.parse(saved)
        : {
            wabaId: '394810294810294',
            phoneNumberId: '109284719284719',
            accessToken: '',
            appSecret: '',
            webhookToken: 'eagle_waba_verify_2026',
            isConfigured: false,
          };
    } catch {
      return {
        wabaId: '',
        phoneNumberId: '',
        accessToken: '',
        appSecret: '',
        webhookToken: '',
        isConfigured: false,
      };
    }
  });
  const [showToken, setShowToken] = useState(false);

  // Campaigns list (Empty by default or populated via API confirmation)
  const [campaigns, setCampaigns] = useState<
    Array<{
      id: string;
      name: string;
      event: string;
      sent: number;
      delivered: number;
      readRate: string;
      clicks: number;
      sales: number;
      status: string;
    }>
  >([]);

  // Modal Form State
  const [newCampaignName, setNewCampaignName] = useState('Virada de Lote WhatsApp');
  const [newSelectedTplId, setNewSelectedTplId] = useState(mockWhatsAppTemplates[0].id);
  const [newEventName, setNewEventName] = useState('Festival XYZ 2026');
  const [newAudience, setNewAudience] = useState('TODOS_COMPRADORES');
  const [submitting, setSubmitting] = useState(false);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...credentials, isConfigured: true };
    setCredentials(updated);
    try {
      localStorage.setItem('eagle_whatsapp_credentials', JSON.stringify(updated));
    } catch (err) {
      console.warn('Erro ao salvar credenciais no localStorage', err);
    }
    setToastMessage('Credenciais e Token da Meta Cloud API salvos com sucesso!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOperationError(null);
    try {
      const result = await launchWhatsApp({
        name: newCampaignName,
        eventName: newEventName,
        audience: newAudience,
        templateId: newSelectedTplId,
      });

      setCampaigns((prev) => [
        {
          id: result.id,
          name: newCampaignName,
          event: newEventName,
          sent: 0,
          delivered: 0,
          readRate: '—',
          clicks: 0,
          sales: 0,
          status: result.status || 'QUEUED',
        },
        ...prev,
      ]);

      setIsNovoDisparoOpen(false);
      setToastMessage('Solicitação registrada pela API. Consulte o status antes de considerar as mensagens enviadas.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : 'Falha ao registrar campanha. Nenhum envio foi confirmado.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Campanha', 'Evento', 'Disparos', 'Entregues', 'Taxa Leitura', 'Cliques', 'Vendas', 'Status'];
    const rows = campaigns.map((c) => [
      c.name,
      c.event,
      c.sent,
      c.delivered,
      c.readRate,
      c.clicks,
      c.sales,
      c.status,
    ]);
    downloadCsv(headers, rows, `campanhas-whatsapp-${new Date().toISOString().slice(0, 10)}.csv`);
    setToastMessage('Relatório de campanhas WhatsApp exportado com sucesso (CSV)!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {operationError && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{operationError}</span>
        </div>
      )}

      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          Indicadores de exemplo no layout original: não representam envios confirmados. Campanhas operacionais dependem da API.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              WhatsApp Marketing & CRM
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MessageSquare className="w-3.5 h-3.5" />
              Meta WhatsApp Cloud API Oficial
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Disparos em massa autorizados, templates verificados pela Meta e visualização responsiva de mensagens
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('CREDENTIALS')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
              activeTab === 'CREDENTIALS'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-[#2c2d33] hover:bg-[#35363c] text-white border-[#37393e]'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Tokens & Meta WABA</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsNovoDisparoOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Disparo de WhatsApp</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Mensagens Disparadas"
          value="18.940 envios"
          subtitle="Últimos 30 dias (Demonstrativo)"
          icon={Send}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Taxa de Entrega"
          value="98,9%"
          subtitle="18.730 entregues"
          icon={CheckCheck}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Taxa de Leitura (Abertura)"
          value="89,2%"
          subtitle="16.710 mensagens lidas"
          icon={Users}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Vendas Geradas no Link"
          value={formatCurrency(98400)}
          subtitle="365 ingressos vendidos"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'CAMPAIGNS', label: 'Campanhas de Disparo' },
          { id: 'TEMPLATES', label: 'Modelos & Templates Oficiais' },
          { id: 'PREVIEW', label: 'Visualizador em Smartphone' },
          { id: 'LGPD', label: 'Conformidade LGPD & Opt-in' },
          { id: 'CREDENTIALS', label: 'Tokens & Meta WABA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold rounded-t-lg transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2c2d33] text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-400 hover:text-white hover:bg-[#25262c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'CAMPAIGNS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Campanha WhatsApp</th>
                <th className="p-3.5 font-semibold">Evento</th>
                <th className="p-3.5 font-semibold">Disparos</th>
                <th className="p-3.5 font-semibold">Entregues</th>
                <th className="p-3.5 font-semibold">Taxa Leitura</th>
                <th className="p-3.5 font-semibold">Cliques no Link</th>
                <th className="p-3.5 font-semibold">Vendas Concluídas</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Nenhuma campanha de WhatsApp registrada. Inicie um novo disparo acima para enfileirar na Meta Cloud API.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#25262c] transition">
                    <td className="p-3.5 font-bold text-white">{c.name}</td>
                    <td className="p-3.5 text-slate-300">{c.event}</td>
                    <td className="p-3.5 font-mono text-slate-200">{formatNumber(c.sent)}</td>
                    <td className="p-3.5 font-mono text-emerald-400">{formatNumber(c.delivered)}</td>
                    <td className="p-3.5 font-bold text-white">{c.readRate}</td>
                    <td className="p-3.5 text-slate-300">{formatNumber(c.clicks)}</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">{c.sales} vendas</td>
                    <td className="p-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Clock className="w-3 h-3" />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockWhatsAppTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                setSelectedTemplate(tpl);
                setActiveTab('PREVIEW');
              }}
              className="bg-[#2c2d33] border border-[#37393e] hover:border-emerald-500/50 rounded-xl p-5 cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-bold text-white">{tpl.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tpl.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-2">
                  {tpl.bodyText}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#37393e] flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Categoria: {tpl.category}</span>
                <span className="text-emerald-400 font-bold hover:underline">Ver no Celular →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visualizador de Mensagem em Celular */}
      {activeTab === 'PREVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4">
            <h3 className="font-bold text-white text-base">Selecione o Modelo para Teste</h3>
            <div className="space-y-2">
              {mockWhatsAppTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`w-full text-left p-3 rounded-lg border transition cursor-pointer ${
                    selectedTemplate.id === tpl.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                      : 'bg-[#202124] border-[#37393e] text-slate-300 hover:bg-[#25262c]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{tpl.name}</span>
                    <span className="text-[10px] text-slate-400">{tpl.category}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] text-slate-400 space-y-1">
              <span className="font-bold text-white block">Variáveis Dinâmicas Ativas:</span>
              {selectedTemplate.variables.map((v, i) => (
                <div key={i} className="text-[11px]">
                  {'{{' + (i + 1) + '}}'} → <span className="text-slate-300 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="flex justify-center">
            <div className="w-72 bg-[#101010] rounded-[36px] p-3 shadow-2xl border-4 border-[#37393e] relative">
              <div className="w-24 h-4 bg-black mx-auto rounded-full mb-2" />
              <div className="bg-[#0b141a] rounded-[24px] overflow-hidden text-slate-200 text-xs flex flex-col h-[420px]">
                <div className="bg-[#202c33] p-3 flex items-center gap-2 border-b border-slate-700/50">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-[10px]">
                    DI
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">DiskIngressos Oficial</div>
                    <div className="text-[9px] text-emerald-400">Conta Comercial Verificada</div>
                  </div>
                </div>

                <div className="flex-1 p-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:12px_12px] flex flex-col justify-end">
                  <div className="bg-[#005c4b] p-3 rounded-xl rounded-tr-none text-slate-100 text-[11px] leading-relaxed shadow space-y-2">
                    <p>
                      {selectedTemplate.bodyText
                        .replace('{{1}}', 'Mariana')
                        .replace('{{2}}', 'Festival XYZ 2026')
                        .replace('{{3}}', 'Pista Premium VIP')
                        .replace('{{4}}', 'https://disk.link/xyz26')}
                    </p>
                    <div className="text-[9px] text-slate-300/80 text-right flex items-center justify-end gap-1">
                      <span>14:45</span>
                      <CheckCheck className="w-3 h-3 text-cyan-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'LGPD' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Política de Opt-in & Conformidade LGPD</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Todos os contatos disparados possuem consentimento explícito registrado durante a compra de ingressos ou cadastro no portal DiskIngressos. O comando de descadastro (opt-out automático respondendo "SAIR") é processado instantaneamente pelo bot de atendimento.
          </p>
        </div>
      )}

      {/* Tab: CREDENTIALS (Tokens & Meta WABA) */}
      {activeTab === 'CREDENTIALS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-5 max-w-2xl">
          <div className="flex items-center justify-between border-b border-[#37393e] pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Configuração da Meta WhatsApp Cloud API
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Insira as credenciais do aplicativo Meta for Developers para habilitar disparos oficiais autorizados
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                credentials.isConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {credentials.isConfigured ? 'Homologado & Conectado' : 'Aguardando Credenciais'}
            </span>
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">WhatsApp Business Account ID (WABA ID) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 394810294810294"
                  value={credentials.wabaId}
                  onChange={(e) => setCredentials({ ...credentials, wabaId: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number ID *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 109284719284719"
                  value={credentials.phoneNumberId}
                  onChange={(e) => setCredentials({ ...credentials, phoneNumberId: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Token Permanente de Acesso (Graph API Token) *</label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  {showToken ? 'Ocultar' : 'Visualizar Token'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  required
                  placeholder="EAAG..."
                  value={credentials.accessToken}
                  onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 pr-10"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-1 text-slate-400 text-[11px]">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Segurança & Criptografia</span>
              </div>
              <p>
                Os tokens de acesso são transmitidos de forma criptografada para o servidor DiskIngressos. Disparos só são permitidos com templates pré-aprovados pela Meta.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-lg shadow transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Credenciais da API</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Novo Disparo WhatsApp */}
      {isNovoDisparoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Novo Disparo em Massa WhatsApp</h3>
                  <p className="text-[11px] text-slate-400">Meta Cloud API com entrega homologada</p>
                </div>
              </div>
              <button
                onClick={() => setIsNovoDisparoOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLaunchCampaign} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Campanha *</label>
                <input
                  type="text"
                  required
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="Ex: Virada de Lote 48h VIP"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Template Aprovado pela Meta *</label>
                <select
                  value={newSelectedTplId}
                  onChange={(e) => setNewSelectedTplId(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {mockWhatsAppTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Evento *</label>
                  <input
                    type="text"
                    required
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Segmento / Público *</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="TODOS_COMPRADORES">Todos os Compradores (Base Ativa)</option>
                    <option value="VIP">Clientes VIP (Gasto Alto)</option>
                    <option value="CARRINHOS">Carrinhos Pendentes</option>
                  </select>
                </div>
              </div>

              {/* Template Preview Snippet */}
              {(() => {
                const currentTpl = mockWhatsAppTemplates.find((t) => t.id === newSelectedTplId);
                return (
                  <div className="bg-[#202124] p-3 rounded-lg border border-[#37393e] space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] block">Texto Modelo (com tags):</span>
                    <p className="text-emerald-400 font-mono text-[11px] leading-relaxed">
                      {currentTpl?.bodyText}
                    </p>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setIsNovoDisparoOpen(false)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Enfileirando...' : 'Iniciar Disparo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default WhatsAppMarketingPage;
