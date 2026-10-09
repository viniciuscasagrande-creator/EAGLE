import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { ShoppingCart, Search, Filter, Download, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const VendasPedidosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, selectEventById, allEvents } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (id && (!selectedEvent || selectedEvent.id !== id)) {
      selectEventById(id);
    }
  }, [id, selectedEvent, selectEventById]);

  const currentEvent = selectedEvent || allEvents.find((e) => e.id === id) || allEvents[0];

  if (!currentEvent) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum evento selecionado.
      </div>
    );
  }

  const orders = currentEvent.recentOrders || [];
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Pedidos & Vendas do Evento
          </h1>
          <p className="text-sm text-slate-400">
            {currentEvent.name} — Consulta analítica de pedidos, compradores e confirmações financeiras
          </p>
        </div>

        <button
          onClick={() => alert('Exportando relatório em formato CSV...')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório CSV/Excel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por pedido (#DI), nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-300">
          Exibindo <span className="font-bold text-white">{filteredOrders.length}</span> pedidos localizados
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
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
          <tbody className="divide-y divide-[#37393e]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Nenhum pedido encontrado para o critério pesquisado.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5 font-mono font-bold text-blue-400">{order.orderNumber}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{order.sectorName}</td>
                  <td className="p-3.5 text-white font-medium">{order.itemsCount}x</td>
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
