import React, { useState } from 'react';
import { X, UserPlus, Shield, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'FINANCEIRO' | 'COMERCIAL' | 'MARKETING' | 'PORTARIA';
  roleLabel: string;
  permissions: string[];
  status: 'ACTIVE' | 'PENDING';
  invitedAt: string;
}

interface ConvidarMembroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: TeamMember) => void;
}

const roleDefaults: Record<
  TeamMember['role'],
  { label: string; permissions: string[] }
> = {
  ADMIN: {
    label: 'Administrador Geral',
    permissions: [
      'Acesso total e irrestrito',
      'Financeiro & Repasses',
      'Comercial & Propostas',
      'Marketing & Remarketing',
      'Portaria & Check-in',
      'Gestão de Equipe',
    ],
  },
  FINANCEIRO: {
    label: 'Gestor Financeiro',
    permissions: [
      'Visualizar saldos e carteiras',
      'Solicitar repasses e antecipações',
      'Conferência de extrato e conciliação Keeper',
      'Relatórios financeiros consolidados',
    ],
  },
  COMERCIAL: {
    label: 'Coordenador Comercial',
    permissions: [
      'Gerenciar clientes e oportunidades CRM',
      'Emitir propostas comerciais e contratos',
      'Acompanhar vendas corporativas e faturamento',
    ],
  },
  MARKETING: {
    label: 'Analista de Marketing & CRM',
    permissions: [
      'Gerenciar campanhas multicanais (Meta, Google, TikTok)',
      'Configurar automações e disparos WhatsApp/Email',
      'Recuperação de carrinhos abandonados',
      'Criação de cupons e rastreamento UTM',
    ],
  },
  PORTARIA: {
    label: 'Operador de Portaria & Acesso',
    permissions: [
      'Operar leitor de QR Code e validação de ingressos',
      'Visualizar fluxo de catracas e ocupação em tempo real',
      'Check-in nominal de participantes',
    ],
  },
};

export const ConvidarMembroModal: React.FC<ConvidarMembroModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('COMERCIAL');
  const [customPermissions, setCustomPermissions] = useState<string[]>(
    roleDefaults['COMERCIAL'].permissions
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: TeamMember['role']) => {
    setRole(newRole);
    setCustomPermissions(roleDefaults[newRole].permissions);
  };

  const handleTogglePermission = (perm: string) => {
    if (customPermissions.includes(perm)) {
      setCustomPermissions(customPermissions.filter((p) => p !== perm));
    } else {
      setCustomPermissions([...customPermissions, perm]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Informe o nome do colaborador.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newMember: TeamMember = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        roleLabel: roleDefaults[role].label,
        permissions: customPermissions,
        status: 'PENDING',
        invitedAt: new Date().toLocaleDateString('pt-BR'),
      };

      onAddMember(newMember);
      setSubmitting(false);
      setName('');
      setEmail('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Convidar Membro para a Equipe</h3>
            <p className="text-xs text-slate-400">
              Controle de acesso granular por papel (RBAC) com autenticação de dois fatores
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Beatriz Albuquerque"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">E-mail Corporativo *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="beatriz@produtora.com.br"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Papel / Perfil de Acesso *</label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as TeamMember['role'])}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ADMIN">Administrador Geral (Acesso Total)</option>
              <option value="FINANCEIRO">Gestor Financeiro (Saldos, Repasses e Keeper)</option>
              <option value="COMERCIAL">Coordenador Comercial (CRM, Propostas e Vendas Corporativas)</option>
              <option value="MARKETING">Analista de Marketing & CRM (Campanhas e Remarketing)</option>
              <option value="PORTARIA">Operador de Portaria & Acesso (Check-in e Catracas)</option>
            </select>
          </div>

          {/* Granular Permissions Checkbox list */}
          <div className="p-3 bg-[#202124] border border-[#37393e] rounded-xl space-y-2">
            <span className="font-semibold text-slate-300 block">
              Permissões Atribuídas a este Papel:
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {roleDefaults[role].permissions.map((perm) => (
                <label key={perm} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={customPermissions.includes(perm)}
                    onChange={() => handleTogglePermission(perm)}
                    className="rounded bg-[#2c2d33] border-[#37393e] text-blue-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-slate-400 flex items-start gap-2">
            <Key className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Um link seguro de ativação com token criptográfico de 72h será enviado ao e-mail informado para criação de senha com 2FA.
            </span>
          </div>

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white bg-[#202124] rounded-lg border border-[#37393e] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Enviando convite...' : 'Enviar Convite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
