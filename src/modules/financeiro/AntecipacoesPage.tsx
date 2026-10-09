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
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
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

      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-blue-200">
            Governança de Antecipação de Recebíveis
          </div>
          <p className="text-slate-300 leading-relaxed">
            As antecipações dependem de análise de risco e liquidez pelo Comitê Financeiro DiskIngressos no Keeper ERP. Não são autorizadas antecipações automáticas sem homologação formal da tesouraria central.
          </p>
        </div>
      </div>

      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Código</th>
              <th className="p-3.5 font-semibold">Evento</th>
              <th className="p-3.5 font-semibold">Valor Solicitado</th>
              <th className="p-3.5 font-semibold">Taxa Antecipação</th>
              <th className="p-3.5 font-semibold">Líquido Depositado</th>
              <th className="p-3.5 font-semibold">Data Liquidação</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {advances.map((adv) => (
              <tr key={adv.id} className="hover:bg-slate-800/40">
                <td className="p-3.5 font-mono font-bold text-blue-400">{adv.advanceNumber}</td>
                <td className="p-3.5 font-semibold text-slate-200">{adv.eventName}</td>
                <td className="p-3.5 font-bold text-slate-100">{formatCurrency(adv.requestedAmount)}</td>
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
