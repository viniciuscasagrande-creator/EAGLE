import React from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { Ticket, Plus, Tag, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

export const IngressosPage: React.FC = () => {
  const { selectedEvent } = useEventContext();

  if (!selectedEvent) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Ingressos, Lotes & Setores
          </h1>
          <p className="text-sm text-slate-400">
            {selectedEvent.name} — Gestão de disponibilidade, preços e viradas de lote
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Configurar Novo Lote</span>
        </button>
      </div>

      {/* Setores e Lotes Table Cards */}
      <div className="space-y-4">
        {selectedEvent.sectors.map((sector) => (
          <div
            key={sector.id}
            className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-md"
                  style={{ backgroundColor: sector.color }}
                />
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{sector.name}</h3>
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
                  <tr className="text-slate-400 border-b border-slate-800/80">
                    <th className="pb-2 font-semibold">Lote</th>
                    <th className="pb-2 font-semibold">Valor Unitário</th>
                    <th className="pb-2 font-semibold">Cota Total</th>
                    <th className="pb-2 font-semibold">Emitidos</th>
                    <th className="pb-2 font-semibold">Saldo</th>
                    <th className="pb-2 font-semibold text-right">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {sector.batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-slate-900/40">
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
