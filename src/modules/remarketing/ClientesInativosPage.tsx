import React from 'react';
import { UserX, RefreshCw, Mail, MessageSquare, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const ClientesInativosPage: React.FC = () => {
  const inactives = [
    { name: 'Ana Paula Rocha', email: 'anapaula@gmail.com', phone: '(41) 99881-1200', lastPurchase: 'Festival XYZ 2025 (há 360 dias)', totalEvents: 3, totalSpent: 1250 },
    { name: 'Gabriel Torres', email: 'gtorres@outlook.com', phone: '(41) 98711-2290', lastPurchase: 'Show Nacional ABC 2025 (há 280 dias)', totalEvents: 2, totalSpent: 640 },
    { name: 'Juliana Silveira', email: 'juliana.s@uol.com.br', phone: '(41) 99233-4411', lastPurchase: 'Festival XYZ 2024 (há 490 dias)', totalEvents: 4, totalSpent: 2100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Clientes Inativos & Prevenção de Churn
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Reativação de Base
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Público que comprou em edições anteriores mas não interagiu nos últimos 180 dias
          </p>
        </div>

        <button
          onClick={() => alert('Iniciando régua de reativação para clientes inativos...')}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Disparar Oferta de Reativação</span>
        </button>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Cliente</th>
              <th className="p-3.5 font-semibold">Última Compra</th>
              <th className="p-3.5 font-semibold">Total de Eventos</th>
              <th className="p-3.5 font-semibold">Volume Histórico</th>
              <th className="p-3.5 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {inactives.map((item, i) => (
              <tr key={i} className="hover:bg-[#25262c] transition">
                <td className="p-3.5">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400">{item.email} • {item.phone}</div>
                </td>
                <td className="p-3.5 text-slate-300">{item.lastPurchase}</td>
                <td className="p-3.5 font-bold text-white">{item.totalEvents} edições</td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(item.totalSpent)}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => alert(`Enviando convite VIP exclusivo para ${item.name}...`)}
                    className="px-3 py-1.5 bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-200 text-xs font-bold rounded-lg transition"
                  >
                    Reativar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
