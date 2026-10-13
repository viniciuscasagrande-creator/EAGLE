import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  Send,
  Download,
  AlertCircle,
} from 'lucide-react';

interface BatchPayout {
  id: string;
  batchCode: string;
  producerName: string;
  cnpj: string;
  amount: number;
  scheduledDate: string;
  pixKey: string;
  status: 'SCHEDULED' | 'PAID' | 'PROCESSING';
  settlementHash?: string;
}

export const RepassesGlobaisPage: React.FC = () => {
  const { availableProducers } = useAuth();
  const [payouts, setPayouts] = useState<BatchPayout[]>([
    {
      id: 'pay-001',
      batchCode: 'REM-2026-1014-01',
      producerName: 'ABC Produções & Eventos Ltda',
      cnpj: '12.345.678/0001-90',
      amount: 150000.0,
      scheduledDate: '14/10/2026',
      pixKey: 'financeiro@abcproducoes.com.br',
      status: 'SCHEDULED',
    },
    {
      id: 'pay-002',
      batchCode: 'REM-2026-1014-02',
      producerName: 'Opus Entretenimento Sul Ltda',
      cnpj: '45.678.901/0001-23',
      amount: 90000.0,
      scheduledDate: '14/10/2026',
      pixKey: '45.678.901/0001-23',
      status: 'SCHEDULED',
    },
    {
      id: 'pay-003',
      batchCode: 'REM-2026-1010-08',
      producerName: 'Live Nation Brasil Produções S.A.',
      cnpj: '98.765.432/0001-10',
      amount: 450000.0,
      scheduledDate: '10/10/2026',
      pixKey: '98.765.432/0001-10',
      status: 'PAID',
      settlementHash: 'E984712039481230491823471029348123',
    },
    {
      id: 'pay-004',
      batchCode: 'REM-2026-1008-04',
      producerName: 'Seven Entretenimento & Gastronomia Ltda',
      cnpj: '33.222.111/0001-55',
      amount: 40000.0,
      scheduledDate: '08/10/2026',
      pixKey: 'contato@seveneventos.com.br',
      status: 'PAID',
      settlementHash: 'F128371928371928371928371928371923',
    },
  ]);

  const [dispatchedBatch, setDispatchedBatch] = useState<string | null>(null);

  const handleDisburse = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: 'PAID',
            settlementHash: `PIX-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
          };
        }
        return p;
      })
    );
    setDispatchedBatch(id);
    setTimeout(() => setDispatchedBatch(null), 2500);
  };

  const totalScheduled = payouts
    .filter((p) => p.status === 'SCHEDULED')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPaid = payouts
    .filter((p) => p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Central Global de Repasses & Liquidação Keeper
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervisão e disparo de remessas financeiras bancárias e transferências PIX aos produtores.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-400">Total Programado para Liquidação</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            R$ {totalScheduled.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Lotes aguardando disparo</p>
        </div>

        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-400">Liquidado nos Últimos 7 Dias</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-500 mt-0.5">Comprovantes contábeis arquivados</p>
        </div>

        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-400">Conector SPI / BACEN</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">ONLINE</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Latência média: 140ms</p>
        </div>
      </div>

      {dispatchedBatch && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Remessa PIX transmitida ao Banco Central com liquidação instantânea no Keeper Core!</span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Lote de Remessa</th>
                <th className="py-3.5 px-4 font-bold">Produtora Beneficiária</th>
                <th className="py-3.5 px-4 font-bold">Chave PIX Cadastrada</th>
                <th className="py-3.5 px-4 font-bold">Data Programada</th>
                <th className="py-3.5 px-4 font-bold">Valor do Repasse</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {p.batchCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200">{p.producerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.cnpj}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {p.pixKey}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {p.scheduledDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-emerald-400 font-mono">
                      R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {p.status === 'PAID' ? 'LIQUIDADO' : 'PROGRAMADO'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === 'SCHEDULED' ? (
                      <button
                        onClick={() => handleDisburse(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Liquidar PIX</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">
                        {p.settlementHash}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
