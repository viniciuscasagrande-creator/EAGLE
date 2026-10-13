import React from 'react';
import { Sparkles } from 'lucide-react';

export const RouteLoadingFallback: React.FC = () => {
  return (
    <div className="flex-1 w-full min-h-[400px] flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Ring */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-ping absolute" />
        
        {/* Central Logo Box */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl z-10">
          🦅
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Carregando Módulo...
        </p>
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Otimização dinâmica DiskIngressos</span>
        </p>
      </div>

      {/* Subtle Skeleton Bar */}
      <div className="w-36 h-1 rounded-full bg-slate-800 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-pulse" />
      </div>
    </div>
  );
};
