import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Lock,
  Eye,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

interface ConsentRecord {
  id: string;
  userName: string;
  document: string;
  email: string;
  whatsappOptIn: boolean;
  emailOptIn: boolean;
  ipAddress: string;
  consentedAt: string;
  policyVersion: string;
}

const mockConsentRecords: ConsentRecord[] = [
  {
    id: 'cs-01',
    userName: 'Mariana Souza Lima',
    document: '***.482.109-**',
    email: 'mariana.souza@gmail.com',
    whatsappOptIn: true,
    emailOptIn: true,
    ipAddress: '187.54.120.45',
    consentedAt: '2026-10-09T11:20:00',
    policyVersion: 'v2.4',
  },
  {
    id: 'cs-02',
    userName: 'Carlos Eduardo Mendes',
    document: '***.931.204-**',
    email: 'carlos.mendes@uol.com.br',
    whatsappOptIn: false,
    emailOptIn: true,
    ipAddress: '177.18.99.12',
    consentedAt: '2026-10-09T09:45:00',
    policyVersion: 'v2.4',
  },
  {
    id: 'cs-03',
    userName: 'Beatriz Fagundes',
    document: '***.228.409-**',
    email: 'beatriz.fagundes@outlook.com',
    whatsappOptIn: true,
    emailOptIn: false,
    ipAddress: '201.88.14.77',
    consentedAt: '2026-10-08T18:10:00',
    policyVersion: 'v2.4',
  },
  {
    id: 'cs-04',
    userName: 'Fernando Henrique Rocha',
    document: '***.774.192-**',
    email: 'fernando.rocha@corp.com.br',
    whatsappOptIn: true,
    emailOptIn: true,
    ipAddress: '189.12.55.90',
    consentedAt: '2026-10-08T14:30:00',
    policyVersion: 'v2.4',
  },
];

export const ConsentimentoLgpdPage: React.FC = () => {
  const [records] = useState<ConsentRecord[]>(mockConsentRecords);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Consentimento & Conformidade LGPD
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Lei 13.709/2018 Auditada
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Trilha de auditoria oficial de consentimento dos compradores para disparos de remarketing e promoções.
          </p>
        </div>

        <button
          onClick={() => alert('Exportando trilha completa de auditoria LGPD (PDF/CSV assinado)...')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Trilha de Auditoria</span>
        </button>
      </div>

      {/* Governança LGPD Banner */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-blue-200">
            Auditoria Jurídica & Termos Ativos
          </div>
          <p className="text-slate-300 leading-relaxed">
            Todas as mensagens automáticas de recuperação de carrinho e campanhas comerciais cumprem integralmente a LGPD. O comprador pode revogar o consentimento (Opt-out) a qualquer momento clicando no link descadastrar contido no rodapé de cada mensagem.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Opt-in WhatsApp</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            89.4%
          </div>
          <span className="text-[10px] text-emerald-400">Consentimento expresso</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Opt-in E-mail</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            92.8%
          </div>
          <span className="text-[10px] text-blue-400">Boletins e avisos</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Versão do Termo</span>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            v2.4
          </div>
          <span className="text-[10px] text-slate-400">Vigente e homologado</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Revogações (Opt-out)</span>
          <div className="text-xl font-extrabold text-slate-300 mt-1">
            0.6%
          </div>
          <span className="text-[10px] text-slate-400">Baixo índice de recusa</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail do titular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Titular dos Dados</th>
              <th className="p-3.5 font-semibold">Documento Mascarado</th>
              <th className="p-3.5 font-semibold text-center">Opt-in WhatsApp</th>
              <th className="p-3.5 font-semibold text-center">Opt-in E-mail</th>
              <th className="p-3.5 font-semibold">IP de Registro</th>
              <th className="p-3.5 font-semibold">Data / Hora Consentimento</th>
              <th className="p-3.5 font-semibold text-right">Versão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRecords.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <div className="font-bold text-slate-100">{rec.userName}</div>
                  <div className="text-[11px] text-slate-400">{rec.email}</div>
                </td>
                <td className="p-3.5 font-mono text-slate-400">{rec.document}</td>
                <td className="p-3.5 text-center">
                  {rec.whatsappOptIn ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Autorizado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" />
                      Não Autorizado
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-center">
                  {rec.emailOptIn ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Autorizado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" />
                      Não Autorizado
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-slate-400">{rec.ipAddress}</td>
                <td className="p-3.5 text-slate-300">{formatDateTime(rec.consentedAt)}</td>
                <td className="p-3.5 text-right font-mono font-bold text-blue-400">
                  {rec.policyVersion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
