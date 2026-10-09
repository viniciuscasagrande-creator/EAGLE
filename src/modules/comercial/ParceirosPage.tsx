import React, { useState } from 'react';
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
    discountValue: 15,
    commissionRate: 3,
    ticketsSold: 195,
    grossSalesGenerated: 29250.0,
    commissionEarned: 877.5,
    status: 'ACTIVE',
  },
];

export const ParceirosPage: React.FC = () => {
  const [partners] = useState<CommercialPartner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGrossPartner = partners.reduce((acc, p) => acc + p.grossSalesGenerated, 0);
  const totalTicketsPartner = partners.reduce((acc, p) => acc + p.ticketsSold, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Parceiros Comerciais & Convênios
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Clubes de Vantagens & Afiliados
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Gestão de convênios com associações, empresas e clubes de benefícios com cupons dedicados.
          </p>
        </div>

        <button
          onClick={() => alert('Abrir cadastro de novo convênio ou parceiro comercial.')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Parceiro</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Vendas via Convênios</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalGrossPartner)}
          </div>
          <span className="text-[10px] text-emerald-400">Faturamento gerado</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Ingressos com Desconto</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {totalTicketsPartner} un
          </div>
          <span className="text-[10px] text-blue-400">Comprados por afiliados</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Parceiros Ativos</span>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            {partners.length} entidades
          </div>
          <span className="text-[10px] text-slate-400">Convênios cadastrados</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Comissões Devidas</span>
          <div className="text-xl font-extrabold text-indigo-400 mt-1">
            {formatCurrency(partners.reduce((acc, p) => acc + p.commissionEarned, 0))}
          </div>
          <span className="text-[10px] text-indigo-400">Acumulado do período</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar parceiro, cupom ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
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
          <tbody className="divide-y divide-slate-800/60">
            {filteredPartners.map((partner) => (
              <tr key={partner.id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <div className="font-bold text-slate-100">{partner.name}</div>
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
                <td className="p-3.5 text-right font-bold text-slate-200">
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
