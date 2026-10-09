import React, { useState } from 'react';
import { Percent, Plus, Tag, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const CuponsMarketingPage: React.FC = () => {
  const coupons = [
    { code: 'VIPFESTIVAL10', discount: '10%', event: 'Festival XYZ 2026', uses: 245, maxUses: 500, revenue: 63700, status: 'Ativo' },
    { code: 'PREVENDA20', discount: 'R$ 20,00', event: 'Festival XYZ 2026', uses: 120, maxUses: 200, revenue: 31200, status: 'Ativo' },
    { code: 'PROMOFLASH', discount: '15%', event: 'Show Nacional ABC 2026', uses: 80, maxUses: 100, revenue: 12400, status: 'Esgotado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Cupons de Desconto & Ações Promocionais
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Gestão de Códigos
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Criação de cupons promocionais, limites de resgate por CPF e acompanhamento de receita gerada
          </p>
        </div>

        <button
          onClick={() => alert('Abrindo modal de novo cupom promocional...')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Cupom</span>
        </button>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Código do Cupom</th>
              <th className="p-3.5 font-semibold">Desconto</th>
              <th className="p-3.5 font-semibold">Evento Vinculado</th>
              <th className="p-3.5 font-semibold">Utilizações</th>
              <th className="p-3.5 font-semibold">Receita Gerada com Cupom</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {coupons.map((c, i) => (
              <tr key={i} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-mono font-extrabold text-amber-400">{c.code}</td>
                <td className="p-3.5 font-bold text-white">{c.discount}</td>
                <td className="p-3.5 text-slate-300">{c.event}</td>
                <td className="p-3.5 text-slate-200">
                  {c.uses} / {c.maxUses} ({Math.round((c.uses / c.maxUses) * 100)}%)
                </td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(c.revenue)}</td>
                <td className="p-3.5 text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Ativo'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
