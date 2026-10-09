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
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  Clock,
  Mail,
} from 'lucide-react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { ConvidarMembroModal, TeamMember } from '@/components/modals/ConvidarMembroModal';

const initialTeam: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Vinícius Albuquerque (Você)',
    email: 'vinicius@produtora.com.br',
    role: 'ADMIN',
    roleLabel: 'Administrador Geral',
    permissions: ['Acesso total e irrestrito', 'Financeiro & Repasses', 'Comercial & Propostas', 'Marketing & Remarketing'],
    status: 'ACTIVE',
    invitedAt: '12/01/2024',
  },
  {
    id: 'usr-2',
    name: 'Mariana Costa',
    email: 'mariana.costa@produtora.com.br',
    role: 'FINANCEIRO',
    roleLabel: 'Gestor Financeiro',
    permissions: ['Visualizar saldos e carteiras', 'Solicitar repasses e antecipações', 'Extrato Keeper ERP'],
    status: 'ACTIVE',
    invitedAt: '15/02/2024',
  },
  {
    id: 'usr-3',
    name: 'Rodrigo Peixoto',
    email: 'rodrigo.p@produtora.com.br',
    role: 'COMERCIAL',
    roleLabel: 'Coordenador Comercial',
    permissions: ['Gerenciar clientes CRM', 'Emitir propostas comerciais', 'Vendas Corporativas'],
    status: 'ACTIVE',
    invitedAt: '03/03/2024',
  },
  {
    id: 'usr-4',
    name: 'Camila Duarte',
    email: 'camila.d@produtora.com.br',
    role: 'MARKETING',
    roleLabel: 'Analista de Marketing & CRM',
    permissions: ['Gerenciar campanhas Meta/Google', 'Automações WhatsApp/Email', 'Recuperação de Carrinhos'],
    status: 'ACTIVE',
    invitedAt: '18/03/2024',
  },
  {
    id: 'usr-5',
    name: 'Lucas Mendes',
    email: 'lucas.m@produtora.com.br',
    role: 'PORTARIA',
    roleLabel: 'Operador de Portaria & Acesso',
    permissions: ['Operar validação QR Code', 'Fluxo de Catracas', 'Check-in nominal'],
    status: 'PENDING',
    invitedAt: '08/04/2024',
  },
];

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

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [teamFeedback, setTeamFeedback] = useState<string | null>(null);

  const handleAddMember = (newMember: TeamMember) => {
    setTeamMembers((prev) => [newMember, ...prev]);
    setTeamFeedback(`Convite enviado com sucesso para ${newMember.email} com perfil de ${newMember.roleLabel}.`);
    setTimeout(() => setTeamFeedback(null), 5000);
  };

  const handleRevokeMember = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente revogar o acesso de "${name}" ao portal?`)) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      setTeamFeedback(`Acesso de ${name} revogado com sucesso.`);
      setTimeout(() => setTeamFeedback(null), 5000);
    }
  };

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

      {/* Gestão de Equipe & Permissões RBAC */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#37393e]">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Equipe da Produtora & Permissões RBAC
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {teamMembers.length} Colaboradores
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gerencie permissões segmentadas para operadores de bilheteria, comercial, financeiro e portaria
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Convidar Membro</span>
          </button>
        </div>

        {teamFeedback && (
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{teamFeedback}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3 font-semibold">Colaborador</th>
                <th className="p-3 font-semibold">Papel / Função</th>
                <th className="p-3 font-semibold">Escopo de Permissões</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3">
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {member.email}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        member.role === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : member.role === 'FINANCEIRO'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : member.role === 'COMERCIAL'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : member.role === 'MARKETING'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {member.roleLabel}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {member.permissions.slice(0, 2).map((perm, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700/70"
                        >
                          {perm}
                        </span>
                      ))}
                      {member.permissions.length > 2 && (
                        <span className="px-1 py-0.5 text-[10px] text-slate-400">
                          +{member.permissions.length - 2} mais
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {member.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                        <Clock className="w-3 h-3" />
                        Pendente (Convite)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {member.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleRevokeMember(member.id, member.name)}
                        className="text-xs text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded transition cursor-pointer"
                        title="Revogar Acesso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-[#37393e] text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Autenticação segura com 2FA obrigatório para permissões financeiras
          </span>
          <span className="text-slate-500 font-mono">Governança Keeper Core RBAC</span>
        </div>
      </div>

      {/* Modal Convidar Membro */}
      <ConvidarMembroModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
};
