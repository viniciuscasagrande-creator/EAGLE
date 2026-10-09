import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { Ticket, Plus, Tag, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { NovoLoteModal } from '@/components/modals/NovoLoteModal';


export const IngressosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, selectEventById, allEvents, addTicketTier } = useEventContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id && (!selectedEvent || selectedEvent.id !== id)) {
      selectEventById(id);
    }
  }, [id, selectedEvent, selectEventById]);

  const currentEvent = selectedEvent || allEvents.find((e) => e.id === id) || allEvents[0];

  if (!currentEvent) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum evento encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Ingressos, Lotes & Setores
          </h1>
          <p className="text-sm text-slate-400">
            {currentEvent.name} — Gestão de disponibilidade, preços e viradas de lote
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Configurar Novo Lote</span>
        </button>
      </div>

      <NovoLoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectors={currentEvent.sectors}
        onConfirm={async (tier) => {
          await addTicketTier(currentEvent.id, tier);
        }}
      />


      {/* Setores e Lotes Table Cards */}
      <div className="space-y-4">
        {currentEvent.sectors.map((sector) => (
          <div
            key={sector.id}
            className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md"
          >
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-md"
                  style={{ backgroundColor: sector.color }}
                />
                <div>
                  <h3 className="font-bold text-white text-base">{sector.name}</h3>
                  <div className="text-xs text-slate-400">
                    Capacidade Setor: {formatNumber(sector.totalCapacity)} un • Vendidos: {formatNumber(sector.soldCount)} un
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Taxa de Ocupação:</span>
                <span className="ml-2 font-bold text-blue-400 text-sm">
                  {formatPercent((sector.soldCount / sector.totalCapacity) * 100)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-[#37393e]">
                    <th className="pb-2 font-semibold">Lote</th>
                    <th className="pb-2 font-semibold">Valor Unitário</th>
                    <th className="pb-2 font-semibold">Cota Total</th>
                    <th className="pb-2 font-semibold">Emitidos</th>
                    <th className="pb-2 font-semibold">Saldo</th>
                    <th className="pb-2 font-semibold text-right">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#37393e]">
                  {sector.batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-[#25262c] transition">
                      <td className="py-3 font-medium text-slate-200">{batch.name}</td>
                      <td className="py-3 font-bold text-emerald-400">
                        {formatCurrency(batch.price)}
                      </td>
                      <td className="py-3 text-slate-300">{formatNumber(batch.totalQuantity)} un</td>
                      <td className="py-3 text-slate-300">{formatNumber(batch.soldQuantity)} un</td>
                      <td className="py-3 text-slate-300">{formatNumber(batch.availableQuantity)} un</td>
                      <td className="py-3 text-right">
                        {batch.status === 'SOLD_OUT' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Esgotado
                          </span>
                        )}
                        {batch.status === 'ACTIVE' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Vendas Ativas
                          </span>
                        )}
                        {batch.status === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/40 text-slate-400 border border-slate-700">
                            Aguardando Liberação
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
