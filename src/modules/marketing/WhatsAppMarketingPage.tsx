import React, { useState } from 'react';
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
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';

export const WhatsAppMarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'TEMPLATES' | 'PREVIEW' | 'LGPD'>('CAMPAIGNS');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(mockWhatsAppTemplates[0]);
  const [isNovoDisparoOpen, setIsNovoDisparoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState([
    {
      id: 'wa-01',
      name: 'Aviso Virada de Lote 48h VIP',
      event: 'Festival XYZ 2026',
      sent: 8420,
      delivered: 8380,
      readRate: '92,1%',
      clicks: 2150,
      sales: 184,
      status: 'Concluído',
    },
    {
      id: 'wa-02',
      name: 'Pré-Venda Exclusiva Clientes 2025',
      event: 'Festival XYZ 2026',
      sent: 4500,
      delivered: 4460,
      readRate: '88,4%',
      clicks: 1420,
      sales: 120,
      status: 'Concluído',
    },
    {
      id: 'wa-03',
      name: 'Resgate de Carrinho em 15 Minutos (Automação)',
      event: 'Show Nacional ABC 2026',
      sent: 1120,
      delivered: 1105,
      readRate: '94,6%',
      clicks: 410,
      sales: 61,
      status: 'Ativa / Em Execução',
    },
  ]);

  // Modal Form State
  const [newCampaignName, setNewCampaignName] = useState('Virada de Lote WhatsApp');
  const [newSelectedTplId, setNewSelectedTplId] = useState(mockWhatsAppTemplates[0].id);
  const [newEventName, setNewEventName] = useState('Festival XYZ 2026');
  const [newAudience, setNewAudience] = useState('TODOS_COMPRADORES');
  const [submitting, setSubmitting] = useState(false);
  const isMetaConfigured = keeperAdapter.isMetaCloudApiConfigured();

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await keeperAdapter.createWhatsAppCampaign({
        name: newCampaignName,
        event: newEventName,
        templateId: newSelectedTplId,
        audience: newAudience,
      });

      setCampaigns((prev) => [res.campaign, ...prev]);
      setIsNovoDisparoOpen(false);
      setToastMessage(res.message);
    } catch (err: any) {
      setToastMessage(err.message || 'Falha ao processar campanha de WhatsApp.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setToastMessage(null), 6000);
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
          subtitle="Últimos 30 dias"
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
              {campaigns.map((c) => (
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
                      <CheckCircle2 className="w-3 h-3" />
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
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

      {/* Visualizador de Mensagem em Celular (Vídeo 01:30-01:38) */}
      {activeTab === 'PREVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4">
            <h3 className="font-bold text-white text-base">Selecione o Modelo para Teste</h3>
            <div className="space-y-2">
              {mockWhatsAppTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
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
              {/* Camera Notch */}
              <div className="w-24 h-4 bg-black mx-auto rounded-full mb-2" />

              {/* Screen Canvas */}
              <div className="bg-[#0b141a] rounded-[24px] overflow-hidden text-slate-200 text-xs flex flex-col h-[420px]">
                {/* WhatsApp Chat Header */}
                <div className="bg-[#202c33] p-3 flex items-center gap-2 border-b border-slate-700/50">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-[10px]">
                    DI
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">DiskIngressos Oficial</div>
                    <div className="text-[9px] text-emerald-400">Conta Comercial Verificada</div>
                  </div>
                </div>

                {/* Chat Bubble Area */}
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

              {!isMetaConfigured && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Meta Cloud API em Homologação:</span>
                    Token CAPI ou WABA ID não estão configurados. A campanha será registrada como <strong>RASCUNHO</strong> e não realizará disparos reais nem tarifação até a ativação das credenciais oficiais.
                  </div>
                </div>
              )}

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
                  <span>{submitting ? 'Processando...' : isMetaConfigured ? 'Disparar na Meta Cloud API' : 'Salvar como Rascunho'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
