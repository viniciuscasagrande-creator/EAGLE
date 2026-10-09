import React, { useState, useEffect } from 'react';
import { CorporateOrder, CorporateAttendee } from '@/types/commercial';
import {
  Building2,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Download,
  DollarSign,
  Ticket,
  FileCheck,
  Users,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovoPedidoCorporativoModal } from '@/components/modals/NovoPedidoCorporativoModal';
import { PedidoCorporativoDetalhesModal } from '@/components/modals/PedidoCorporativoDetalhesModal';
import { ImportarParticipantesModal } from '@/components/modals/ImportarParticipantesModal';

export const VendasCorporativasPage: React.FC = () => {
  const [orders, setOrders] = useState<CorporateOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CorporateOrder | null>(null);
  const [orderForImport, setOrderForImport] = useState<CorporateOrder | null>(null);

  useEffect(() => {
    keeperAdapter.getCorporateOrders().then(setOrders);
  }, []);

  const handleUpdateStatus = async (id: string, updates: Partial<CorporateOrder>) => {
    const updated = await keeperAdapter.updateCorporateOrderStatus(id, updates);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleImportAttendees = async (orderId: string, attendees: CorporateAttendee[]) => {
    const updated = await keeperAdapter.importCorporateAttendees(orderId, attendees);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              attendees: [...(prev.attendees || []), ...attendees],
            }
          : null
      );
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.cnpj || '').includes(searchTerm) ||
      (o.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.eventName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalB2bRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalB2bTickets = orders.reduce((acc, o) => acc + (o.ticketQuantity || 0), 0);
  const totalNominalAttendees = orders.reduce((acc, o) => acc + (o.attendees?.length || 0), 0);

  const handleExportFiscalReport = () => {
    downloadCsv(
      'relatorio-faturamento-corporativo-b2b',
      ['Número Pedido', 'Empresa / Razão Social', 'CNPJ', 'Contato', 'Evento', 'Setor', 'Qtd Ingressos', 'Valor Total (R$)', 'Condição', 'Status Pagamento', 'NF-e', 'Participantes Cadastrados'],
      filteredOrders.map((o) => [
        o.orderNumber,
        o.companyName,
        o.cnpj,
        o.contactName,
        o.eventName,
        o.sector,
        o.ticketQuantity,
        o.totalAmount,
        o.paymentTerm,
        o.paymentStatus,
        o.invoiceIssued ? 'Sim' : 'Não',
        o.attendees ? o.attendees.length : 0,
      ])
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Vendas Corporativas & Grupos B2B
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Vendas em Lote & Faturamento Direto
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Emissão de lotes fechados para empresas, faturamento com boleto a prazo e emissão de notas fiscais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFiscalReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Exportar Relatório Fiscal</span>
          </button>

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Pedido Corporativo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Faturamento B2B Total</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalB2bRevenue)}
          </div>
          <span className="text-[10px] text-slate-400">Contratos corporativos fechados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Ingressos em Lote</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {totalB2bTickets} un
          </div>
          <span className="text-[10px] text-blue-400">Contratados para colaboradores</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Credenciados Nominais</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {totalNominalAttendees} / {totalB2bTickets}
          </div>
          <span className="text-[10px] text-emerald-400">Participantes já identificados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Empresas Atendidas</span>
          <div className="text-xl font-extrabold text-purple-400 mt-1">
            {orders.length} empresas
          </div>
          <span className="text-[10px] text-purple-400">Contratos vigentes</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar empresa, CNPJ, pedido ou evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
        >
          <option value="ALL">Todos os Status de Pagamento</option>
          <option value="PAID">Liquidados (Pagos)</option>
          <option value="PENDING">Aguardando Pagamento</option>
          <option value="OVERDUE">Vencidos</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Pedido / Empresa</th>
              <th className="p-3.5 font-semibold">Contato Responsável</th>
              <th className="p-3.5 font-semibold">Evento & Setor</th>
              <th className="p-3.5 font-semibold text-center">Quantidade</th>
              <th className="p-3.5 font-semibold text-right">Valor Total</th>
              <th className="p-3.5 font-semibold">Condição</th>
              <th className="p-3.5 font-semibold text-center">NF-e</th>
              <th className="p-3.5 font-semibold text-center">Pagamento</th>
              <th className="p-3.5 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredOrders.map((order) => {
              const attendeesCount = order.attendees ? order.attendees.length : 0;
              return (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-[#25262c] transition cursor-pointer"
                >
                  <td className="p-3.5">
                    <div className="font-bold text-white">{order.companyName}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span className="text-blue-400 font-bold">{order.orderNumber}</span>
                      <span>•</span>
                      <span>{order.cnpj}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300">{order.contactName}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{order.eventName}</div>
                    <div className="text-[11px] text-slate-400">{order.sector}</div>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="font-bold text-blue-400 block">{order.ticketQuantity} un</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({attendeesCount} nominais)
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-emerald-400 text-sm font-mono">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="p-3.5 text-slate-300">{order.paymentTerm}</td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <FileCheck className="w-3.5 h-3.5" />
                      Emitida
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {order.paymentStatus === 'PAID' ? 'Liquidado' : 'Aguardando'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                        title="Ver Detalhes do Faturamento, Boleto & NF-e"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>

                      <button
                        onClick={() => setOrderForImport(order)}
                        className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                        title="Importar Lista Nominal de Participantes"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <NovoPedidoCorporativoModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCorporateOrder(data);
          setOrders((prev) => [created, ...prev]);
        }}
      />

      <PedidoCorporativoDetalhesModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        onImportAttendees={handleImportAttendees}
      />

      <ImportarParticipantesModal
        order={orderForImport}
        isOpen={Boolean(orderForImport)}
        onClose={() => setOrderForImport(null)}
        onConfirm={async (attendees) => {
          if (orderForImport) {
            await handleImportAttendees(orderForImport.id, attendees);
            setOrderForImport(null);
          }
        }}
      />
    </div>
  );
};
