import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PaymentBreakdown } from '@/types/event';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

interface PaymentMethodsDonutProps {
  data: PaymentBreakdown[];
}

export const PaymentMethodsDonut: React.FC<PaymentMethodsDonutProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        Nenhum dado de pagamento registrado.
      </div>
    );
  }

  const totalAmount = data.reduce((acc, curr) => acc + curr.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: PaymentBreakdown = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-100 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
          <div className="text-emerald-400 font-semibold">{formatCurrency(item.amount)}</div>
          <div className="text-slate-400">
            {formatNumber(item.count)} transações ({formatPercent(item.percentage)})
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div className="mb-2">
        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
          Formas de Pagamento
        </h4>
        <p className="text-xs text-slate-400">
          Distribuição dos canais de liquidação utilizados pelos clientes
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-2">
        <div className="w-44 h-44 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 font-medium uppercase">Total</span>
            <span className="text-xs font-bold text-slate-100">
              R$ {(totalAmount / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="flex-1 w-full space-y-2">
          {data.map((item) => (
            <div
              key={item.method}
              className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/80"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 font-medium truncate">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-100">{formatCurrency(item.amount)}</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                  ({formatPercent(item.percentage)})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
