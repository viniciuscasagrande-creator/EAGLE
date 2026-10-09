import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import {
  Ticket,
  Plus,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Download,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
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
        Nenhum evento selecionado.
      </div>
    );
  }

  const totalCapacity = currentEvent.sectors.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalSold = currentEvent.sectors.reduce((acc, s) => acc + s.soldCount, 0);
  const totalAvailable = Math.max(0, totalCapacity - totalSold);

  const potentialRevenue = currentEvent.sectors.reduce(
    (acc, s) =>
      acc +
      s.batches.reduce((bAcc, b) => bAcc + b.totalQuantity * b.price, 0),
    0
  );

  const handleExportLots = () => {
    downloadCsv(
      `lotes-ingressos-${currentEvent.code.toLowerCase()}`,
      ['Setor', 'Nome do Lote', 'Preço Unitário (R$)', 'Quantidade Total', 'Vendidos', 'Disponíveis', 'Status'],
      currentEvent.sectors.flatMap((s) =>
        s.batches.map((b) => [
          s.name,
          b.name,
          b.price,
          b.totalQuantity,
          b.soldQuantity,
          b.availableQuantity,
          b.status,
        ])
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Ingressos, Lotes & Setores
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentEvent.code}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {currentEvent.name} — Gestão de disponibilidade, preços e viradas de lote
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLots}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Exportar Lotes (CSV)</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Configurar Novo Lote</span>
          </button>
        </div>
      </div>

      <NovoLoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectors={currentEvent.sectors}
        onConfirm={async (tier) => {
          await addTicketTier(currentEvent.id, tier);
        }}
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Capacidade Total</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatNumber(totalCapacity)} un
          </div>
          <span className="text-[10px] text-slate-400">Em todos os setores</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Ingressos Vendidos</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {formatNumber(totalSold)} un
          </div>
          <span className="text-[10px] text-blue-400">
            {totalCapacity > 0 ? formatPercent((totalSold / totalCapacity) * 100) : '0%'} de ocupação
          </span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Saldo Disponível</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatNumber(totalAvailable)} un
          </div>
          <span className="text-[10px] text-emerald-400">Disponível para venda</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Potencial de Bilheteria</span>
          <div className="text-xl font-extrabold text-purple-400 mt-1">
            {formatCurrency(potentialRevenue)}
          </div>
          <span className="text-[10px] text-purple-400">Projeção 100% dos lotes</span>
        </div>
      </div>

      {/* Setores e Lotes Table Cards */}
      <div className="space-y-5">
        {currentEvent.sectors.map((sector) => {
          const occupancy = sector.totalCapacity > 0 ? (sector.soldCount / sector.totalCapacity) * 100 : 0;
          return (
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
                      Capacidade Setor: {formatNumber(sector.totalCapacity)} un • Vendidos:{' '}
                      {formatNumber(sector.soldCount)} un
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Taxa de Ocupação:</span>
                    <span className="ml-2 font-bold text-blue-400 text-sm">
                      {formatPercent(occupancy)}
                    </span>
                  </div>

                  <div className="w-28 h-2 bg-[#202124] rounded-full overflow-hidden border border-[#37393e]">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, occupancy)}%` }}
                    />
                  </div>
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
                        <td className="py-3 font-bold text-emerald-400 font-mono">
                          {formatCurrency(batch.price)}
                        </td>
                        <td className="py-3 text-slate-300 font-mono">{formatNumber(batch.totalQuantity)} un</td>
                        <td className="py-3 text-slate-300 font-mono">{formatNumber(batch.soldQuantity)} un</td>
                        <td className="py-3 text-slate-300 font-mono">{formatNumber(batch.availableQuantity)} un</td>
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
          );
        })}
      </div>
    </div>
  );
};
