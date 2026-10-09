import React from 'react';
import { Percent, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const TaxasRetencoesPage: React.FC = () => {
  const feeRules = [
    { id: '1', code: 'DISK_FEE', name: 'Taxa DiskIngressos', rate: '10,00%', payer: 'CLIENTE', basis: 'Valor do Ingresso', validFrom: '01/08/2026', status: 'Ativa' },
    { id: '2', code: 'SPREAD', name: 'Spread Financeiro (Cartão/PIX)', rate: '2,50%', payer: 'PRODUTOR', basis: 'Valor Bruto Venda', validFrom: '01/10/2026', status: 'Ativa' },
    { id: '3', code: 'RESERVA', name: 'Reserva de Contingência', rate: '10,00%', payer: 'RETENÇÃO', basis: 'Saldo da Carteira', validFrom: '01/09/2026', status: 'Ativa' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Taxas Contratuais & Retenções
        </h1>
        <p className="text-sm text-slate-400">
          Consulta das regras de MDR, spread, taxas administrativas e retenções homologadas no Keeper ERP
        </p>
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          As alíquotas e taxas são configuradas exclusivamente no Keeper pelo setor comercial e jurídico da DiskIngressos. O produtor pode consultar os percentuais vigentes para auditoria.
        </span>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Código Regra</th>
              <th className="p-3.5 font-semibold">Nome da Taxa</th>
              <th className="p-3.5 font-semibold">Alíquota / Valor</th>
              <th className="p-3.5 font-semibold">Responsável (Pagador)</th>
              <th className="p-3.5 font-semibold">Base de Cálculo</th>
              <th className="p-3.5 font-semibold">Vigência Inicial</th>
              <th className="p-3.5 font-semibold text-right">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {feeRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-mono font-bold text-blue-400">{rule.code}</td>
                <td className="p-3.5 font-semibold text-white">{rule.name}</td>
                <td className="p-3.5 font-bold text-emerald-400">{rule.rate}</td>
                <td className="p-3.5 text-slate-300">{rule.payer}</td>
                <td className="p-3.5 text-slate-300">{rule.basis}</td>
                <td className="p-3.5 text-slate-400">{rule.validFrom}</td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {rule.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
