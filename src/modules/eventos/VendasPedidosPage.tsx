import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  X,
  CreditCard,
  QrCode,
  DollarSign,
  Ticket,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const VendasPedidosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, selectEventById, allEvents } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === 'ALL' || o.paymentMethod.toLowerCase().includes(paymentFilter.toLowerCase());

    const matchesSector =
      sectorFilter === 'ALL' || (o.sectorName || '').toLowerCase().includes(sectorFilter.toLowerCase());

    return matchesSearch && matchesPayment && matchesSector;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalItems = orders.reduce((acc, o) => acc + (o.itemsCount || 0), 0);
  const avgTicket = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Pedidos & Vendas do Evento
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentEvent.code}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {currentEvent.name} — Consulta analítica de pedidos, compradores e confirmações financeiras
          </p>
        </div>

        <button
          onClick={() => {
            downloadCsv(
              `pedidos-${currentEvent.code.toLowerCase()}`,
              ['Número Pedido', 'Comprador', 'E-mail', 'Setor', 'Qtd Ingressos', 'Valor Total (R$)', 'Forma de Pagamento', 'Status', 'Data/Hora'],
              filteredOrders.map((o) => [
                o.orderNumber,
                o.customerName,
                o.customerEmail,
                o.sectorName,
                o.itemsCount,
                o.totalAmount,
                o.paymentMethod,
                o.status,
                formatDateTime(o.createdAt),
              ])
            );
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total de Pedidos</span>
          <div className="text-xl font-extrabold text-white mt-0.5">{orders.length} pedidos</div>
          <span className="text-[10px] text-emerald-400">100% liquidados e confirmados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Ingressos Vendidos</span>
          <div className="text-xl font-extrabold text-blue-400 mt-0.5">{totalItems} un</div>
          <span className="text-[10px] text-blue-400">Emissão oficial</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Faturamento nos Pedidos</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{formatCurrency(totalRevenue)}</div>
          <span className="text-[10px] text-slate-400">Transacionado no gateway</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3.5 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Ticket Médio por Pedido</span>
          <div className="text-xl font-extrabold text-indigo-400 mt-0.5">{formatCurrency(avgTicket)}</div>
          <span className="text-[10px] text-indigo-400">Média geral</span>
        </div>
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

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
          >
            <option value="ALL">Todas as Formas de Pagamento</option>
            <option value="PIX">PIX</option>
            <option value="Cartão">Cartão de Crédito</option>
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
          >
            <option value="ALL">Todos os Setores</option>
            {currentEvent.sectors.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
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
              <th className="p-3.5 font-semibold text-center">Quantidade</th>
              <th className="p-3.5 font-semibold text-right">Valor Bruto</th>
              <th className="p-3.5 font-semibold">Método</th>
              <th className="p-3.5 font-semibold">Data / Hora</th>
              <th className="p-3.5 font-semibold text-center">Situação</th>
              <th className="p-3.5 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  Nenhum pedido encontrado para o critério pesquisado.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-[#25262c] transition cursor-pointer"
                >
                  <td className="p-3.5 font-mono font-bold text-blue-400">{order.orderNumber}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{order.sectorName}</td>
                  <td className="p-3.5 text-white font-bold text-center">{order.itemsCount}x</td>
                  <td className="p-3.5 font-extrabold text-emerald-400 text-right font-mono">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#202124] text-slate-200 border border-[#37393e]">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{formatDateTime(order.createdAt)}</td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Aprovado
                    </span>
                  </td>
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                      title="Ver Comprovante e Detalhes"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 text-xs">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#37393e] pb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-sm font-bold text-blue-400">{selectedOrder.orderNumber}</span>
                <h3 className="text-sm font-extrabold text-white">Transação Confirmada</h3>
              </div>
            </div>

            <div className="bg-[#202124] border border-[#37393e] rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Comprador:</span>
                <span className="font-bold text-white">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">E-mail:</span>
                <span className="text-slate-300 font-mono">{selectedOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evento:</span>
                <span className="text-white font-medium">{currentEvent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Setor:</span>
                <span className="text-blue-400 font-medium">{selectedOrder.sectorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantidade de Ingressos:</span>
                <span className="text-white font-bold">{selectedOrder.itemsCount} ingressos</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#37393e]">
                <span className="text-slate-300 font-bold">Valor Total Pago:</span>
                <span className="text-emerald-400 font-extrabold font-mono text-sm">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de Pagamento:</span>
                <span className="text-slate-200">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data e Hora da Aprovação:</span>
                <span className="text-slate-400">{formatDateTime(selectedOrder.createdAt)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#202124] hover:bg-[#35363c] text-white font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
