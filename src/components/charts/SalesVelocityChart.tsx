import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SalesTimelinePoint } from '@/types/event';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface SalesVelocityChartProps {
  data: SalesTimelinePoint[];
}

export const SalesVelocityChart: React.FC<SalesVelocityChartProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'accumulated' | 'daily'>('accumulated');

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        Nenhum dado temporal de vendas disponível para este evento.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">
            Data: {point.label} ({point.date})
          </div>
          <div className="text-emerald-400 font-semibold">
            Venda Diária: {formatCurrency(point.dailyAmount)}
          </div>
          <div className="text-blue-400 font-semibold">
            Venda Acumulada: {formatCurrency(point.accumulatedAmount)}
          </div>
          <div className="text-slate-300">
            Ingressos Vendidos: {formatNumber(point.ticketsSold)} un
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Ritmo de Vendas & Evolução
          </h4>
          <p className="text-xs text-slate-400">
            Acompanhe o volume diário e o acumulado de faturamento do evento
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('accumulated')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === 'accumulated'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Curva Acumulada
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              viewMode === 'daily'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vendas Diárias
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {viewMode === 'accumulated' ? (
              <Area
                type="monotone"
                dataKey="accumulatedAmount"
                name="Faturamento Acumulado (R$)"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorAccumulated)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="dailyAmount"
                name="Faturamento Diário (R$)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorDaily)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
