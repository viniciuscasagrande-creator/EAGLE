import React, { useState } from 'react';
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
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

interface CorporateOrder {
  id: string;
  orderNumber: string;
  companyName: string;
  cnpj: string;
  contactName: string;
  eventName: string;
  ticketQuantity: number;
  sector: string;
  totalAmount: number;
  paymentTerm: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  invoiceIssued: boolean;
  createdAt: string;
}

const mockCorporateOrders: CorporateOrder[] = [
  {
    id: 'corp-01',
    orderNumber: 'CORP-2026-001',
    companyName: 'Banco Regional Sul S.A.',
    cnpj: '03.882.190/0001-44',
    contactName: 'Mariana Duarte (RH & Benefícios)',
    eventName: 'Festival XYZ 2026',
    ticketQuantity: 150,
    sector: 'Camarote Corporativo Premium',
    totalAmount: 45000.0,
    paymentTerm: 'Faturamento 15 dias',
    paymentStatus: 'PAID',
    invoiceIssued: true,
    createdAt: '2026-09-18T10:30:00',
  },
  {
    id: 'corp-02',
    orderNumber: 'CORP-2026-002',
    companyName: 'Tech Solutions Curitiba Ltda',
    cnpj: '18.441.200/0001-99',
    contactName: 'Rodrigo Silveira (Marketing)',
    eventName: 'Festival XYZ 2026',
    ticketQuantity: 80,
    sector: 'Área VIP Open Bar',
    totalAmount: 24000.0,
    paymentTerm: 'Boleto 30 dias',
    paymentStatus: 'PENDING',
    invoiceIssued: true,
    createdAt: '2026-09-29T14:15:00',
  },
  {
    id: 'corp-03',
    orderNumber: 'CORP-2026-003',
    companyName: 'Associação dos Magistrados do PR',
    cnpj: '76.120.345/0001-12',
    contactName: 'Fernanda Lopes (Diretoria Social)',
    eventName: 'Stand-up Comedy Gala',
    ticketQuantity: 60,
    sector: 'Platéia A Central',
    totalAmount: 9600.0,
    paymentTerm: 'PIX PJ à Vista',
    paymentStatus: 'PAID',
    invoiceIssued: true,
    createdAt: '2026-10-02T16:45:00',
  },
];

export const VendasCorporativasPage: React.FC = () => {
  const [orders] = useState<CorporateOrder[]>(mockCorporateOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) =>
    o.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.cnpj.includes(searchTerm)
  );

  const totalB2bRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalB2bTickets = orders.reduce((acc, o) => acc + o.ticketQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
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

        <button
          onClick={() => alert('Abrir modal de novo pedido corporativo B2B.')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Pedido Corporativo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Faturamento B2B Total</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalB2bRevenue)}
          </div>
          <span className="text-[10px] text-slate-400">Vendas corporativas</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Ingressos em Lote</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {totalB2bTickets} un
          </div>
          <span className="text-[10px] text-blue-400">Para colaboradores/convidados</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Empresas Atendidas</span>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            {orders.length} empresas
          </div>
          <span className="text-[10px] text-slate-400">Contratos vigentes</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Ticket Médio B2B</span>
          <div className="text-xl font-extrabold text-purple-400 mt-1">
            {formatCurrency(totalB2bRevenue / (orders.length || 1))}
          </div>
          <span className="text-[10px] text-purple-400">Por pedido corporativo</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar empresa, CNPJ ou pedido..."
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
              <th className="p-3.5 font-semibold">Pedido / Empresa</th>
              <th className="p-3.5 font-semibold">Contato Responsável</th>
              <th className="p-3.5 font-semibold">Evento & Setor</th>
              <th className="p-3.5 font-semibold text-center">Quantidade</th>
              <th className="p-3.5 font-semibold text-right">Valor Total</th>
              <th className="p-3.5 font-semibold">Condição</th>
              <th className="p-3.5 font-semibold text-center">NF-e</th>
              <th className="p-3.5 font-semibold text-right">Pagamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <div className="font-bold text-slate-100">{order.companyName}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                    <span className="text-blue-400 font-bold">{order.orderNumber}</span>
                    <span>•</span>
                    <span>{order.cnpj}</span>
                  </div>
                </td>
                <td className="p-3.5 text-slate-300">{order.contactName}</td>
                <td className="p-3.5">
                  <div className="font-semibold text-slate-200">{order.eventName}</div>
                  <div className="text-[11px] text-slate-400">{order.sector}</div>
                </td>
                <td className="p-3.5 text-center font-bold text-blue-400">
                  {order.ticketQuantity} un
                </td>
                <td className="p-3.5 text-right font-extrabold text-emerald-400 text-sm">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="p-3.5 text-slate-300">{order.paymentTerm}</td>
                <td className="p-3.5 text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <FileCheck className="w-3.5 h-3.5" />
                    Emitida
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {order.paymentStatus === 'PAID' ? 'Liquidado' : 'Aguardando'}
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
