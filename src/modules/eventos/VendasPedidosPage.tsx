import React, { useState } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { ShoppingCart, Search, Filter, Download, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const VendasPedidosPage: React.FC = () => {
  const { selectedEvent } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');

  if (!selectedEvent) return null;

  const orders = selectedEvent.recentOrders || [];
  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Pedidos & Vendas do Evento
          </h1>
          <p className="text-sm text-slate-400">
            {selectedEvent.name} — Consulta analítica de pedidos, compradores e confirmações financeiras
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition">
          <Download className="w-4 h-4" />
          <span>Exportar Relatório CSV/Excel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por pedido (#DI), nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Exibindo <span className="font-bold text-slate-200">{filteredOrders.length}</span> pedidos localizados
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Número do Pedido</th>
              <th className="p-3.5 font-semibold">Cliente / Comprador</th>
              <th className="p-3.5 font-semibold">Setor / Ingresso</th>
              <th className="p-3.5 font-semibold">Quantidade</th>
              <th className="p-3.5 font-semibold">Valor Bruto</th>
              <th className="p-3.5 font-semibold">Método</th>
              <th className="p-3.5 font-semibold">Data / Hora</th>
              <th className="p-3.5 font-semibold text-right">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Nenhum pedido encontrado para o critério pesquisado.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-mono font-bold text-blue-400">{order.orderNumber}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{order.sectorName}</td>
                  <td className="p-3.5 text-slate-200 font-medium">{order.itemsCount}x</td>
                  <td className="p-3.5 font-bold text-emerald-400">{formatCurrency(order.totalAmount)}</td>
                  <td className="p-3.5 text-slate-300">{order.paymentMethod}</td>
                  <td className="p-3.5 text-slate-400">{formatDateTime(order.createdAt)}</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Aprovado
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
