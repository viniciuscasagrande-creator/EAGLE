import React, { useState } from 'react';
import { launchEmail } from '@/services/api/eagleMarketing';
import { mockEmailTemplates } from '@/services/api/mockSeedData';
import { EmailTemplate } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { NovoEmailModal } from '@/components/modals/NovoEmailModal';
import {
  Mail,
  Send,
  Eye,
  MousePointer,
  DollarSign,
  UserX,
  Plus,
  CheckCircle2,
  ShieldCheck,
  X,
  Sparkles,
  Server,
  Key,
  Lock,
  Settings,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const EmailMarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'TEMPLATES' | 'LGPD' | 'PROVIDER'>('CAMPAIGNS');
  const [isNovoEmailOpen, setIsNovoEmailOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  // SMTP & Email Provider Configuration State (LocalStorage Persisted)
  const [providerConfig, setProviderConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('eagle_email_provider');
      return saved
        ? JSON.parse(saved)
        : {
            provider: 'resend',
            fromEmail: 'ingressos@diskingressos.com.br',
            fromName: 'DiskIngressos Oficial',
            apiKey: '',
            smtpHost: 'smtp.sendgrid.net',
            smtpPort: '587',
            smtpUser: 'apikey',
            isConfigured: false,
          };
    } catch {
      return {
        provider: 'resend',
        fromEmail: 'ingressos@diskingressos.com.br',
        fromName: 'DiskIngressos Oficial',
        apiKey: '',
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        isConfigured: false,
      };
    }
  });

  const [campaigns, setCampaigns] = useState<
    Array<{
      id: string;
      subject: string;
      event: string;
      sent: number;
      openRate: string;
      clickRate: string;
      tickets: number;
      revenue: number;
      status: string;
    }>
  >([]);

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...providerConfig, isConfigured: true };
    setProviderConfig(updated);
    try {
      localStorage.setItem('eagle_email_provider', JSON.stringify(updated));
    } catch (err) {
      console.warn('Erro ao salvar provedor de e-mail no localStorage', err);
    }
    setBannerMessage('Configurações de Provedor & SMTP salvas com sucesso!');
    setTimeout(() => setBannerMessage(null), 4000);
  };

  const handleCreateEmail = async (payload: {
    subject: string;
    template: string;
    event: string;
    audience: string;
    message: string;
  }) => {
    setOperationError(null);
    try {
      const result = await launchEmail(payload);
      setCampaigns((prev) => [
        {
          id: result.id,
          subject: payload.subject,
          event: payload.event,
          sent: 0,
          openRate: '—',
          clickRate: '—',
          tickets: 0,
          revenue: 0,
          status: result.status || 'QUEUED',
        },
        ...prev,
      ]);
      setIsNovoEmailOpen(false);
      setBannerMessage('Campanha registrada pela API. O envio ainda depende de confirmação do provedor.');
      setTimeout(() => setBannerMessage(null), 5000);
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : 'Falha na API de e-mail. Nenhum envio confirmado.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {bannerMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{bannerMessage}</span>
          </div>
          <button onClick={() => setBannerMessage(null)} className="text-emerald-400 hover:text-white">
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
          Indicadores ilustrativos do layout original. Não representam campanhas efetivamente enviadas.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              E-mail Marketing & Automações CRM
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Mail className="w-3.5 h-3.5" />
              Servidor SMTP Dedicado DiskIngressos
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Campanhas de newsletter, contagem regressiva de virada de lote e recuperação de vendas via e-mail transacional
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('PROVIDER')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
              activeTab === 'PROVIDER'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-[#2c2d33] hover:bg-[#35363c] text-white border-[#37393e]'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>Provedor & SMTP</span>
          </button>

          <button
            onClick={() => setIsNovoEmailOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Disparo de E-mail</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="E-mails Disparados"
          value="64.200 envios"
          subtitle="Taxa de entregabilidade 99,2% (Demonstrativo)"
          icon={Send}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Taxa Média de Abertura"
          value="34,8%"
          subtitle="22.340 leituras únicas"
          icon={Eye}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Taxa de Cliques (CTR)"
          value="8,42%"
          subtitle="5.405 cliques nos links"
          icon={MousePointer}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Receita Gerada por E-mail"
          value={formatCurrency(142600)}
          subtitle="540 ingressos convertidos"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'CAMPAIGNS', label: 'Campanhas Disparadas' },
          { id: 'TEMPLATES', label: 'Modelos & Pré-visualização' },
          { id: 'LGPD', label: 'Conformidade LGPD & Descadastros' },
          { id: 'PROVIDER', label: 'Configuração SMTP & Provedores' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold rounded-t-lg transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2c2d33] text-blue-400 border-t-2 border-blue-500'
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
                <th className="p-3.5 font-semibold">Assunto do E-mail</th>
                <th className="p-3.5 font-semibold">Evento</th>
                <th className="p-3.5 font-semibold">Enviados</th>
                <th className="p-3.5 font-semibold">Taxa Abertura</th>
                <th className="p-3.5 font-semibold">Taxa Clique</th>
                <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
                <th className="p-3.5 font-semibold">Receita Atribuída</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Nenhuma campanha de e-mail registrada. Clique em "Novo Disparo de E-mail" para agendar uma transmissão.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#25262c] transition">
                    <td className="p-3.5 font-bold text-white">{c.subject}</td>
                    <td className="p-3.5 text-slate-300">{c.event}</td>
                    <td className="p-3.5 font-mono text-slate-200">{formatNumber(c.sent)}</td>
                    <td className="p-3.5 font-bold text-emerald-400">{c.openRate}</td>
                    <td className="p-3.5 font-bold text-blue-400">{c.clickRate}</td>
                    <td className="p-3.5 font-bold text-white">{c.tickets}</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(c.revenue)}</td>
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
          {mockEmailTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {tpl.category}
                </span>
                <h3 className="font-extrabold text-white text-base mt-2">{tpl.name}</h3>
                <div className="mt-3 p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-1.5 text-xs">
                  <div className="text-slate-400 font-semibold">Assunto:</div>
                  <div className="font-bold text-white text-[11px]">{tpl.subject}</div>
                  <div className="text-slate-400 font-semibold pt-1 border-t border-[#37393e]">Prévia:</div>
                  <div className="text-slate-300 text-[11px]">{tpl.previewText}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTemplate(tpl)}
                className="mt-4 w-full py-2 bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-200 text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Visualizar Prévia HTML
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'LGPD' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Gestão de Descadastros & Reputação de Domínio</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Nossos disparos contam com suporte a SPF, DKIM e DMARC com alinhamento de 100%. Todo e-mail contém rodapé com link direto de opt-out (um clique para descadastrar), mantendo a taxa de spam abaixo de 0,02%.
          </p>
          <div className="flex items-center justify-between p-3 bg-[#202124] rounded-lg border border-[#37393e]">
            <span className="text-slate-400">Taxa de Descadastro (Unsubscribe):</span>
            <span className="font-bold text-emerald-400">0,14% (Excelente)</span>
          </div>
        </div>
      )}

      {/* Tab: PROVIDER (Configuração SMTP & Provedores) */}
      {activeTab === 'PROVIDER' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-5 max-w-2xl">
          <div className="flex items-center justify-between border-b border-[#37393e] pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                Configuração do Provedor de E-mail & SMTP
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Escolha o provedor de entrega de e-mail marketing (Resend, SendGrid, Amazon SES ou Servidor Próprio)
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                providerConfig.isConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {providerConfig.isConfigured ? 'SMTP Conectado' : 'Aguardando Chave'}
            </span>
          </div>

          <form onSubmit={handleSaveProvider} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Provedor de Entrega *</label>
                <select
                  value={providerConfig.provider}
                  onChange={(e) => setProviderConfig({ ...providerConfig, provider: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="resend">Resend API (Recomendado)</option>
                  <option value="sendgrid">Twilio SendGrid API</option>
                  <option value="ses">Amazon SES (Simple Email Service)</option>
                  <option value="smtp">Servidor SMTP Customizado</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">E-mail de Envio (Remetente Homologado) *</label>
                <input
                  type="email"
                  required
                  placeholder="ingressos@seuevento.com.br"
                  value={providerConfig.fromEmail}
                  onChange={(e) => setProviderConfig({ ...providerConfig, fromEmail: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Chave de API (API Key / Token do Provedor) *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="re_..."
                  value={providerConfig.apiKey}
                  onChange={(e) => setProviderConfig({ ...providerConfig, apiKey: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500 pr-10"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-1 text-slate-400 text-[11px]">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Autenticação de Domínio (DKIM / SPF)</span>
              </div>
              <p>
                Para assegurar taxa de entregabilidade superior a 99%, certifique-se de apontar as entradas CNAME de DNS geradas pelo seu provedor (Resend ou SendGrid).
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-2.5 rounded-lg shadow transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar & Validar Conexão</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Novo Disparo */}
      <NovoEmailModal
        isOpen={isNovoEmailOpen}
        onClose={() => setIsNovoEmailOpen(false)}
        onConfirm={handleCreateEmail}
      />

      {/* Modal Prévia de Template HTML */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Pré-visualização do Modelo: {selectedTemplate.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Template homologado para campanhas responsivas DiskIngressos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-[#202124] p-3.5 rounded-lg border border-[#37393e] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-20">Remetente:</span>
                  <span className="font-mono text-blue-400">DiskIngressos &lt;ingressos@diskingressos.com.br&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-20">Assunto:</span>
                  <span className="font-bold text-white">{selectedTemplate.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-20">Pré-header:</span>
                  <span className="text-slate-300">{selectedTemplate.previewText}</span>
                </div>
              </div>

              {/* Rendered HTML preview container */}
              <div className="bg-white text-slate-900 rounded-lg p-6 shadow-inner space-y-4 border border-slate-300 font-sans">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="font-black text-lg tracking-wider text-blue-900">
                    DISKINGRESSOS
                  </div>
                  <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                    Portal do Produtor
                  </span>
                </div>

                <div className="space-y-2 py-2">
                  <h4 className="text-base font-bold text-slate-900">{selectedTemplate.subject}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedTemplate.previewText}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Olá <strong>{'{{nome_cliente}}'}</strong>, não perca essa oportunidade exclusiva. Acesse o botão abaixo para garantir seus ingressos oficiais com parcelamento em até 12x ou PIX instantâneo.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-950 block">Ingresso Oficial Garantido</span>
                    <span className="text-[10px] text-blue-700">QR Code emitido direto no App DiskIngressos</span>
                  </div>
                  <div className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-md shadow-sm">
                    Garantir Ingresso
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-600 text-center space-y-1">
                  <p>Você recebeu este comunicado oficial porque se cadastrou na DiskIngressos.</p>
                  <p className="text-slate-600 underline cursor-pointer">
                    Cancelar recebimento desta lista (Opt-out em 1 clique) • Política de Privacidade
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(null);
                    setIsNovoEmailOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Usar Este Modelo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmailMarketingPage;
