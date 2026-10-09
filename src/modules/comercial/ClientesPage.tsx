import React, { useState } from 'react';
import { mockCommercialClients } from '@/services/api/mockSeedData';
import { CommercialClient } from '@/types/commercial';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  Ticket,
  DollarSign,
  Building,
  Star,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const ClientesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredClients = mockCommercialClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.document.includes(searchTerm);
    const matchesCategory = categoryFilter === 'ALL' || client.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalSpentAll = mockCommercialClients.reduce((acc, c) => acc + c.totalVolume, 0);
  const totalOrdersAll = mockCommercialClients.reduce((acc, c) => acc + c.totalOrders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Central de Clientes & Compradores
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Comercial & CRM
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Base unificada de compradores dos seus eventos, perfil de consumo, LTV e histórico de ingressos.
          </p>
        </div>

        <button
          onClick={() => alert('Base de clientes exportada em formato CSV.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Base (CSV)</span>
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total de Clientes</span>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            {mockCommercialClients.length}
          </div>
          <span className="text-[10px] text-emerald-400">Compradores e parceiros</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Pedidos Registrados</span>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            {totalOrdersAll}
          </div>
          <span className="text-[10px] text-blue-400">Compras corporativas e individuais</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Volume Faturado (LTV)</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalSpentAll)}
          </div>
          <span className="text-[10px] text-slate-400">Receita total gerada</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Ticket Médio Geral</span>
          <div className="text-xl font-extrabold text-indigo-400 mt-1">
            {formatCurrency(totalSpentAll / (mockCommercialClients.length || 1))}
          </div>
          <span className="text-[10px] text-indigo-400">Por cliente cadastrado</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none"
        >
          <option value="ALL">Todas as Categorias</option>
          <option value="EMPRESA">Empresas</option>
          <option value="AGENCIA">Agências</option>
          <option value="GRUPO">Grupos</option>
          <option value="UNIVERSIDADE">Universidades</option>
          <option value="OUTROS">Outros</option>
        </select>
      </div>

      {/* Clients Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Cliente / Razão Social</th>
              <th className="p-3.5 font-semibold">Documento</th>
              <th className="p-3.5 font-semibold">Cidade</th>
              <th className="p-3.5 font-semibold text-center">Pedidos</th>
              <th className="p-3.5 font-semibold text-right">Total Investido (LTV)</th>
              <th className="p-3.5 font-semibold">Última Compra</th>
              <th className="p-3.5 font-semibold text-right">Categoria</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    {client.name}
                    {client.totalVolume > 10000 && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {client.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {client.phone}
                    </span>
                  </div>
                </td>
                <td className="p-3.5 font-mono text-slate-300">{client.document}</td>
                <td className="p-3.5 text-slate-300">{client.city}</td>
                <td className="p-3.5 text-center font-bold text-blue-400">
                  {client.totalOrders} ped
                </td>
                <td className="p-3.5 text-right font-extrabold text-emerald-400 text-sm">
                  {formatCurrency(client.totalVolume)}
                </td>
                <td className="p-3.5 text-slate-400">
                  {client.lastPurchaseDate ? formatDateTime(client.lastPurchaseDate) : '-'}
                </td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {client.category}
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
