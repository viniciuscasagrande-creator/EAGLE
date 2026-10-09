import React, { useState, useEffect } from 'react';
import { AdvanceRequest } from '@/types/finance';
import { mockAdvanceRequests } from '@/services/api/mockSeedData';
import { CheckCircle, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const AntecipacoesPage: React.FC = () => {
  const [advances, setAdvances] = useState<AdvanceRequest[]>([]);

  useEffect(() => {
    // Carregar histórico oficial de antecipações
    setAdvances(mockAdvanceRequests);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Antecipações de Recebíveis
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Comitê de Crédito Keeper ERP
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Linha de crédito rotativo sobre saldo futuro de vendas de eventos com validação contábil central
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[#2c2d33] border border-[#37393e] flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white">
            Governança de Antecipação de Recebíveis
          </div>
          <p className="text-slate-300 leading-relaxed">
            As antecipações dependem de análise de risco e liquidez pelo Comitê Financeiro DiskIngressos no Keeper ERP. Não são autorizadas antecipações automáticas sem homologação formal da tesouraria central.
          </p>
        </div>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Código</th>
              <th className="p-3.5 font-semibold">Evento</th>
              <th className="p-3.5 font-semibold">Valor Solicitado</th>
              <th className="p-3.5 font-semibold">Taxa Antecipação</th>
              <th className="p-3.5 font-semibold">Líquido Depositado</th>
              <th className="p-3.5 font-semibold">Data Liquidação</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {advances.map((adv) => (
              <tr key={adv.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-mono font-bold text-blue-400">{adv.advanceNumber}</td>
                <td className="p-3.5 font-semibold text-white">{adv.eventName}</td>
                <td className="p-3.5 font-bold text-white">{formatCurrency(adv.requestedAmount)}</td>
                <td className="p-3.5 text-rose-400">
                  {adv.advanceFeeRate}% ({formatCurrency(adv.advanceFeeCost)})
                </td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(adv.netAmount)}</td>
                <td className="p-3.5 text-slate-400">{adv.paidAt ? formatDateTime(adv.paidAt) : '-'}</td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    {adv.status === 'PAID' ? 'Liquidado' : adv.status}
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
