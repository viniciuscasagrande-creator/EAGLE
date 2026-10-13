import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface RevenueDataPoint {
  month: string;
  realized: number;
  target: number;
}

interface CommercialRevenueChartProps {
  data: RevenueDataPoint[];
  targetValue?: number;
}

export const CommercialRevenueChart: React.FC<CommercialRevenueChartProps> = ({
  data,
  targetValue = 350000,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#202124] border border-[#37393e] rounded-xl p-6 text-center text-slate-400 text-xs">
        Sem histórico temporal suficiente.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point: RevenueDataPoint = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 z-50">
          <div className="font-bold text-slate-100 border-b border-slate-800 pb-1">
            Competência: {point.month}
          </div>
          <div className="text-emerald-400 font-semibold">
            Realizado B2B: {formatCurrency(point.realized)}
          </div>
          <div className="text-amber-400 font-medium">
            Meta Mês: {formatCurrency(point.target)}
          </div>
          <div className="text-slate-400 text-[10px]">
            Atingimento: {Math.round((point.realized / (point.target || 1)) * 100)}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRealized" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2b2d35" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#37393e' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#37393e' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={targetValue}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{
              value: `Meta: R$ ${(targetValue / 1000).toFixed(0)}k`,
              fill: '#f59e0b',
              fontSize: 10,
              position: 'insideTopRight',
            }}
          />
          <Area
            type="monotone"
            dataKey="realized"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRealized)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
