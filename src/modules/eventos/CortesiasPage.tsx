import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { Gift, Plus, Users, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { EmitirCortesiaModal } from '@/components/modals/EmitirCortesiaModal';
import { keeperAdapter } from '@/services/api/keeperAdapter';

export const CortesiasPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, selectEventById, allEvents, issueCourtesy } = useEventContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id && (!selectedEvent || selectedEvent.id !== id)) {
      selectEventById(id);
    }
  }, [id, selectedEvent, selectEventById]);

  const currentEvent = selectedEvent || allEvents.find((e) => e.id === id) || allEvents[0];
  const [courtesies, setCourtesies] = useState<any[]>(() =>
    keeperAdapter.getCourtesies(currentEvent?.id)
  );

  useEffect(() => {
    if (currentEvent) {
      setCourtesies(keeperAdapter.getCourtesies(currentEvent.id));
    }
  }, [currentEvent]);

  if (!currentEvent) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum evento selecionado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Cortesias & Acessos Especiais
          </h1>
          <p className="text-sm text-slate-400">
            {currentEvent.name} — Emissão e governança de cortesias e convites VIP
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir Nova Cortesia</span>
        </button>
      </div>

      <EmitirCortesiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectors={currentEvent.sectors}
        onConfirm={async (data) => {
          const created = await issueCourtesy(currentEvent.id, data);
          setCourtesies((prev) => [created, ...prev]);
        }}
      />


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4">
          <div className="text-xs text-slate-300">Total de Cortesias Emitidas</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {formatNumber(currentEvent.courtesiesCount)} un
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Limite contratual: 250 un
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4">
          <div className="text-xs text-slate-300">Saldo Disponível para Cortesia</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatNumber(250 - currentEvent.courtesiesCount)} un
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Conforme aprovação Disk
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4">
          <div className="text-xs text-slate-300">Auditoria & Governança</div>
          <div className="text-2xl font-extrabold text-white mt-1">
            Rastreável
          </div>
          <div className="text-[11px] text-blue-400 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrado ao Keeper ERP
          </div>
        </div>
      </div>

      {/* Courtesies Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Beneficiário / Destinatário</th>
              <th className="p-3.5 font-semibold">Setor</th>
              <th className="p-3.5 font-semibold">Quantidade</th>
              <th className="p-3.5 font-semibold">Autorização / Motivo</th>
              <th className="p-3.5 font-semibold">Data Emissão</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {courtesies.map((item) => (
              <tr key={item.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5">
                  <div className="font-semibold text-white">{item.guestName}</div>
                  <div className="text-[11px] text-slate-400">{item.email}</div>
                </td>
                <td className="p-3.5 text-slate-300">{item.sector}</td>
                <td className="p-3.5 font-bold text-purple-400">{item.qty} un</td>
                <td className="p-3.5 text-slate-300">{item.authBy}</td>
                <td className="p-3.5 text-slate-400">{item.issuedAt}</td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    Emitido
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
