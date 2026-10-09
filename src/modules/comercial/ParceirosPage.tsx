import React, { useState, useEffect } from 'react';

import {
  Handshake,
  Plus,
  Search,
  Tag,
  Percent,
  TrendingUp,
  DollarSign,
  Ticket,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface CommercialPartner {
  id: string;
  name: string;
  category: string;
  couponCode: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  commissionRate: number;
  ticketsSold: number;
  grossSalesGenerated: number;
  commissionEarned: number;
  status: 'ACTIVE' | 'PAUSED';
}

const mockPartners: CommercialPartner[] = [
  {
    id: 'part-01',
    name: 'OAB Seção Paraná',
    category: 'Conselho de Classe Profissional',
    couponCode: 'OABPR20',
    discountType: 'PERCENT',
    discountValue: 20,
    commissionRate: 5,
    ticketsSold: 420,
    grossSalesGenerated: 63000.0,
    commissionEarned: 3150.0,
    status: 'ACTIVE',
  },
  {
    id: 'part-02',
    name: 'Clube Gazeta do Povo',
    category: 'Clube de Assinantes & Benefícios',
    couponCode: 'CLUBEGAZETA',
    discountType: 'PERCENT',
    discountValue: 15,
    commissionRate: 0,
    ticketsSold: 680,
    grossSalesGenerated: 102000.0,
    commissionEarned: 0,
    status: 'ACTIVE',
  },
  {
    id: 'part-03',
    name: 'Associação dos Funcionários da Copel',
    category: 'Grêmio Corporativo',
    couponCode: 'COPELIANOS',
    discountType: 'PERCENT',
    discountValue: 25,
    commissionRate: 3,
    ticketsSold: 310,
    grossSalesGenerated: 46500.0,
    commissionEarned: 1395.0,
    status: 'ACTIVE',
  },
];

import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovoParceiroModal } from '@/components/modals/NovoParceiroModal';

export const ParceirosPage: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getPartners().then(setPartners);
  }, []);

  const filteredPartners = partners.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalGrossPartner = partners.reduce((acc, p) => acc + (p.grossSalesGenerated || 0), 0);
  const totalTicketsPartner = partners.reduce((acc, p) => acc + (p.ticketsSold || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Parceiros, Convênios & Afiliados
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Descontos Exclusivos & Rastreabilidade
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Parcerias com grêmios, sindicatos, associações e clubes de benefícios para impulsionar a venda de ingressos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Parceiro</span>
        </button>
      </div>

      <NovoParceiroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createPartner(data);
          setPartners((prev) => [created, ...prev]);
        }}
      />


      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Vendas via Convênios</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalGrossPartner)}
          </div>
          <span className="text-[10px] text-emerald-400">Faturamento gerado</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Ingressos com Desconto</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {totalTicketsPartner} un
          </div>
          <span className="text-[10px] text-blue-400">Comprados por afiliados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Parceiros Ativos</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {partners.length} entidades
          </div>
          <span className="text-[10px] text-slate-400">Convênios cadastrados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Comissões Devidas</span>
          <div className="text-xl font-extrabold text-indigo-400 mt-1">
            {formatCurrency(partners.reduce((acc, p) => acc + p.commissionEarned, 0))}
          </div>
          <span className="text-[10px] text-indigo-400">Acumulado do período</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar parceiro, cupom ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Parceiro / Convênio</th>
              <th className="p-3.5 font-semibold">Cupom Oficial</th>
              <th className="p-3.5 font-semibold text-center">Desconto</th>
              <th className="p-3.5 font-semibold text-center">Comissão</th>
              <th className="p-3.5 font-semibold text-center">Ingressos Vendidos</th>
              <th className="p-3.5 font-semibold text-right">Faturamento Gerado</th>
              <th className="p-3.5 font-semibold text-right">Comissão a Pagar</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredPartners.map((partner) => (
              <tr key={partner.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5">
                  <div className="font-bold text-white">{partner.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{partner.category}</div>
                </td>
                <td className="p-3.5 font-mono font-bold text-blue-400">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {partner.couponCode}
                  </span>
                </td>
                <td className="p-3.5 text-center font-bold text-emerald-400">
                  {partner.discountValue}% OFF
                </td>
                <td className="p-3.5 text-center text-slate-300">
                  {partner.commissionRate > 0 ? `${partner.commissionRate}%` : 'Sem comissão'}
                </td>
                <td className="p-3.5 text-center font-bold text-blue-400">
                  {partner.ticketsSold} un
                </td>
                <td className="p-3.5 text-right font-extrabold text-emerald-400 text-sm">
                  {formatCurrency(partner.grossSalesGenerated)}
                </td>
                <td className="p-3.5 text-right font-bold text-white">
                  {formatCurrency(partner.commissionEarned)}
                </td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ativo
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
