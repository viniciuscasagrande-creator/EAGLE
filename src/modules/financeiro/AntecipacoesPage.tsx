import React, { useState, useEffect } from 'react';
import { AdvanceRequest, EventWalletPosition } from '@/types/finance';
import { mockAdvanceRequests, mockWallets } from '@/services/api/mockSeedData';
import { CheckCircle, Clock, ShieldCheck, AlertTriangle, Plus } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { SolicitarAntecipacaoModal } from '@/components/modals/SolicitarAntecipacaoModal';

export const AntecipacoesPage: React.FC = () => {
  const [advances, setAdvances] = useState<AdvanceRequest[]>(mockAdvanceRequests);
  const [wallets, setWallets] = useState<EventWalletPosition[]>(mockWallets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    keeperAdapter.getEventWallets().then((w) => {
      if (w && w.length > 0) setWallets(w);
    }).catch(() => {});
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Antecipação</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <SolicitarAntecipacaoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallets={wallets}
        onConfirm={async (payload) => {
          const res = await keeperAdapter.requestAdvance('prod-01', payload.eventId, {
            requestedAmount: payload.requestedAmount,
          });
          setAdvances((prev) => [res, ...prev]);
          setSuccessMessage(`Solicitação ${res.advanceNumber} de ${formatCurrency(res.requestedAmount)} enviada com sucesso para análise no Keeper ERP.`);
          setTimeout(() => setSuccessMessage(null), 6000);
        }}
      />


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
