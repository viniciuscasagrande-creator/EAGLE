import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface PipelineStageData {
  stage: string;
  label: string;
  amount: number;
  count: number;
  color: string;
}

interface PipelineFunnelChartProps {
  data: PipelineStageData[];
}

export const PipelineFunnelChart: React.FC<PipelineFunnelChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#202124] border border-[#37393e] rounded-xl p-6 text-center text-slate-400 text-xs">
        Nenhum dado de funil comercial registrado no momento.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: PipelineStageData = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1 z-50">
          <div className="font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
          <div className="text-emerald-400 font-semibold">
            Volume Estimado: {formatCurrency(item.amount)}
          </div>
          <div className="text-slate-300">
            {formatNumber(item.count)} {item.count === 1 ? 'negócio' : 'negócios em andamento'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2b2d35" />
          <XAxis
            type="number"
            tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#37393e' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: '#37393e' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
