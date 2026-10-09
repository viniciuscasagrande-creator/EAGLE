import React, { useState } from 'react';
import { CreditCard, AlertTriangle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const RecuperacaoPagamentoPage: React.FC = () => {
  const paymentIssues = [
    {
      id: 'pay-01',
      order: 'PED-90812',
      customer: 'Carlos Eduardo Mendes',
      phone: '(41) 98844-3321',
      method: 'Cartão de Crédito',
      issue: 'Bloqueio Antifraude / Cartão Não Autorizado',
      amount: 520.0,
      event: 'Festival XYZ 2026',
      time: 'Há 18 min',
      status: 'Pendente',
    },
    {
      id: 'pay-02',
      order: 'PED-90760',
      customer: 'Tatiane Cristina Prado',
      phone: '(41) 99122-8877',
      method: 'PIX Copia e Cola',
      issue: 'PIX Expirado sem Pagamento em 15 minutos',
      amount: 260.0,
      event: 'Festival XYZ 2026',
      time: 'Há 42 min',
      status: 'Em Contato',
    },
    {
      id: 'pay-03',
      order: 'PED-90510',
      customer: 'Roberto Fagundes',
      phone: '(41) 98455-9090',
      method: 'Boleto Bancário',
      issue: 'Vencimento Ultrapassado',
      amount: 840.0,
      event: 'Festival XYZ 2026',
      time: 'Há 2h',
      status: 'Pendente',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Recuperação de Pagamentos & Transações Recusadas
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Falhas de Cobrança
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhamento de pedidos recusados por operadoras, cartões com limite excedido e PIX não liquidados
          </p>
        </div>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Pedido / Cliente</th>
              <th className="p-3.5 font-semibold">Evento</th>
              <th className="p-3.5 font-semibold">Forma de Pagamento</th>
              <th className="p-3.5 font-semibold">Motivo da Recusa</th>
              <th className="p-3.5 font-semibold">Valor</th>
              <th className="p-3.5 font-semibold">Tempo</th>
              <th className="p-3.5 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {paymentIssues.map((p) => (
              <tr key={p.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5">
                  <div className="font-bold text-white">{p.customer}</div>
                  <div className="font-mono text-slate-400 text-[11px]">{p.order} • {p.phone}</div>
                </td>
                <td className="p-3.5 text-slate-300">{p.event}</td>
                <td className="p-3.5 font-mono text-slate-200">{p.method}</td>
                <td className="p-3.5 text-rose-300">
                  <div className="flex items-center gap-1.5 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>{p.issue}</span>
                  </div>
                </td>
                <td className="p-3.5 font-extrabold text-white text-sm">{formatCurrency(p.amount)}</td>
                <td className="p-3.5 text-slate-400 font-mono text-[11px]">{p.time}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => alert(`Gerando novo link de cobrança alternativo para ${p.customer}...`)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition cursor-pointer text-xs"
                  >
                    Novo Link
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
