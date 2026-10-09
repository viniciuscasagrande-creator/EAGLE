import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { AdvanceRequest } from '@/types/finance';
import { DollarSign, Plus, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const AntecipacoesPage: React.FC = () => {
  const [advances, setAdvances] = useState<AdvanceRequest[]>([]);

  useEffect(() => {
    // Carregar antecipações
    setAdvances([
      {
        id: 'adv-1',
        advanceNumber: 'ANT-2026-012',
        eventId: 'ev-101',
        eventName: 'Festival XYZ 2026',
        producerId: 'prod-01',
        requestedAmount: 50000.0,
        advanceFeeRate: 2.5,
        advanceFeeCost: 1250.0,
        netAmount: 48750.0,
        status: 'PAID',
        requestedDate: '2026-09-25T11:00:00',
        authorizedBy: 'Carlos Eduardo (Comitê Disk)',
        paidAt: '2026-09-28T16:00:00',
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Antecipações de Recebíveis
          </h1>
          <p className="text-sm text-slate-400">
            Linha de crédito rotativo sobre saldo futuro de vendas de eventos com validação no Keeper
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
                    Pago
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
