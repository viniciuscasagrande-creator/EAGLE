import React, { useState, useEffect } from 'react';
import { Users, Award, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovoAfiliadoModal } from '@/components/modals/NovoAfiliadoModal';

export const AfiliadosMarketingPage: React.FC = () => {
  const [promoters, setPromoters] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getAffiliates().then(setPromoters);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Afiliados, Comissões & Promoters
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Rede de Divulgação
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Rastreamento de links exclusivos por promoter e controle auditado de comissões por vendas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Promoter</span>
        </button>
      </div>

      <NovoAfiliadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createAffiliate(data);
          setPromoters((prev) => [created, ...prev]);
        }}
      />


      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Promoter / Afiliado</th>
              <th className="p-3.5 font-semibold">Código Exclusivo</th>
              <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
              <th className="p-3.5 font-semibold">Volume Comercial</th>
              <th className="p-3.5 font-semibold">Comissão Devida</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {promoters.map((p, i) => (
              <tr key={i} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-bold text-white">{p.name}</td>
                <td className="p-3.5 font-mono text-purple-400">{p.code}</td>
                <td className="p-3.5 font-bold text-slate-200">{p.salesCount} ingressos</td>
                <td className="p-3.5 font-extrabold text-white">{formatCurrency(p.totalVolume)}</td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(p.commission)}</td>
                <td className="p-3.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.status}
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
