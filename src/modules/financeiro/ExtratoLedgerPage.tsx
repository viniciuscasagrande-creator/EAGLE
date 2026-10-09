import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { FinancialLedgerEntry } from '@/types/finance';
import { ShieldCheck, Download, Search, Filter, Lock } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const ExtratoLedgerPage: React.FC = () => {
  const [entries, setEntries] = useState<FinancialLedgerEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    keeperAdapter.getLedgerEntries().then(setEntries);
  }, []);

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.orderNumber && e.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'ALL' || e.entryType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Extrato Financeiro Oficial (Keeper Ledger)
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Lock className="w-3 h-3" />
              Imutável & Auditado
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Registro cronológico oficial de todas as partidas contábeis e movimentações da sua conta
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition">
          <Download className="w-4 h-4" />
          <span>Exportar Extrato OFX/CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por descrição ou pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none"
        >
          <option value="ALL">Todos os Tipos de Lançamento</option>
          <option value="VENDA_INGRESSO">Vendas de Ingressos</option>
          <option value="TAXA_SERVICO_DISK">Taxas de Serviço Disk</option>
          <option value="REPASSE_PRODUTOR">Repasses ao Produtor</option>
          <option value="DESPESA_OPERACIONAL">Despesas Operacionais</option>
          <option value="ANTECIPACAO_PRODUTOR">Antecipações</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Data / Hora</th>
              <th className="p-3.5 font-semibold">Tipo</th>
              <th className="p-3.5 font-semibold">Descrição do Fato Financeiro</th>
              <th className="p-3.5 font-semibold">Evento / Referência</th>
              <th className="p-3.5 font-semibold text-right">Valor</th>
              <th className="p-3.5 font-semibold text-right">Saldo Resultante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-800/40">
                <td className="p-3.5 text-slate-400 whitespace-nowrap">
                  {formatDateTime(entry.createdAt)}
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300">
                    {entry.entryType}
                  </span>
                </td>
                <td className="p-3.5 font-medium text-slate-200">
                  {entry.description}
                  {entry.orderNumber && (
                    <span className="ml-2 font-mono text-[11px] text-blue-400 font-bold">
                      {entry.orderNumber}
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-slate-400">
                  {entry.eventName || '-'}
                </td>
                <td className="p-3.5 text-right font-bold text-sm">
                  <span
                    className={
                      entry.direction === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'
                    }
                  >
                    {entry.direction === 'CREDIT' ? '+' : '-'} {formatCurrency(entry.amount)}
                  </span>
                </td>
                <td className="p-3.5 text-right font-bold text-slate-200 text-sm">
                  {formatCurrency(entry.balanceAfter)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
