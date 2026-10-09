import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricKpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  progress?: {
    percentage: number;
    label?: string;
  };
}

export const MetricKpiCard: React.FC<MetricKpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-500/10',
  trend,
  progress,
}) => {
  return (
    <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} border border-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend || progress) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          {trend && (
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`font-semibold ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400">vs período anterior</span>
            </div>
          )}

          {progress && (
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>{progress.label || 'Progresso'}</span>
                <span className="font-bold text-slate-200">{progress.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {subtitle && !trend && !progress && (
            <div className="text-xs text-slate-400">{subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
};
