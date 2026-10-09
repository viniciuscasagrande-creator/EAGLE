import React from 'react';
import { TicketSector } from '@/types/event';
import { formatNumber, formatPercent } from '@/utils/formatters';

interface SectorProgressBarsProps {
  sectors: TicketSector[];
}

export const SectorProgressBars: React.FC<SectorProgressBarsProps> = ({ sectors }) => {
  if (!sectors || sectors.length === 0) {
    return (
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 text-center text-slate-400 text-xs">
        Nenhum setor ou lote cadastrado para este evento.
      </div>
    );
  }

  return (
    <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
          Ocupação por Setor & Lote
        </h4>
        <p className="text-xs text-slate-400">
          Acompanhamento da capacidade e esgotamento por área do evento
        </p>
      </div>

      <div className="space-y-4">
        {sectors.map((sector) => {
          const rate = (sector.soldCount / sector.totalCapacity) * 100;
          return (
            <div key={sector.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-md"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="font-bold text-slate-200">{sector.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-100">{formatNumber(sector.soldCount)}</span>
                  <span className="text-slate-500"> / {formatNumber(sector.totalCapacity)} un</span>
                  <span className="text-blue-400 font-semibold ml-2">({formatPercent(rate)})</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: sector.color,
                    width: `${Math.min(rate, 100)}%`,
                  }}
                />
              </div>

              {/* Batches badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sector.batches.map((batch) => (
                  <span
                    key={batch.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                      batch.status === 'SOLD_OUT'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : batch.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-slate-700/30 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span>{batch.name}: R$ {batch.price}</span>
                    <span className="opacity-75">
                      ({batch.status === 'SOLD_OUT' ? 'Esgotado' : `${batch.soldQuantity}/${batch.totalQuantity}`})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
