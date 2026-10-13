import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreditAdvanceRequest } from '@/types/producer';
import { DecisaoAntecipacaoModal } from '@/components/modals/DecisaoAntecipacaoModal';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingDown,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const ComiteCreditoAntecipacoesPage: React.FC = () => {
  const { creditRequests, approveCreditRequest, rejectCreditRequest } = useAuth();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<CreditAdvanceRequest | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const filtered = creditRequests.filter((req) => {
    const matchSearch =
      req.producerName.toLowerCase().includes(search.toLowerCase()) ||
      req.code.toLowerCase().includes(search.toLowerCase()) ||
      req.eventNames.some((e) => e.toLowerCase().includes(search.toLowerCase()));

    const matchTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && req.status === 'PENDING_APPROVAL') ||
      (activeTab === 'APPROVED' && req.status === 'APPROVED') ||
      (activeTab === 'REJECTED' && req.status === 'REJECTED');

    return matchSearch && matchTab;
  });

  const pendingCount = creditRequests.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const approvedTotal = creditRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((acc, r) => acc + r.requestedAmount, 0);

  const handleOpenDecision = (request: CreditAdvanceRequest) => {
    setSelectedRequest(request);
    setIsDecisionModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Comitê de Crédito & Antecipações Globais
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {pendingCount} pendentes de análise
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Análise colegiada de antecipação com conferência de saldo futuro garantido no Ledger do Keeper ERP.
          </p>
        </div>
      </div>

      {/* Summary Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-400">Solicitações Pendentes</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Exigem deliberação do comitê</p>
        </div>

        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-400">Volume Aprovado no Mês</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            R$ {approvedTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-500 mt-0.5">Taxa de deságio média: 3.2% a.m.</p>
        </div>

        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 shadow-lg">
          <span className="text-xs text-slate-400">Índice de Inadimplência da Rede</span>
          <div className="text-2xl font-black text-white mt-1">0.00%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">100% garantido por vendas futuras no Ledger</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'PENDING'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pendentes ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aprovadas</span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'REJECTED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Recusadas</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todas ({creditRequests.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código ou produtora..."
            className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-3 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Credit Requests Table */}
      <div className="rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Código & Data</th>
                <th className="py-3.5 px-4 font-bold">Produtora Solicitante</th>
                <th className="py-3.5 px-4 font-bold">Valor Bruto</th>
                <th className="py-3.5 px-4 font-bold">Taxa / Líquido</th>
                <th className="py-3.5 px-4 font-bold">Colateral no Keeper</th>
                <th className="py-3.5 px-4 font-bold">Risco</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white">{req.code}</div>
                    <div className="text-[11px] text-slate-400">{req.requestedAt}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200">{req.producerName}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      Eventos: {req.eventNames.join(', ')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-white">
                      R$ {req.requestedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-400">
                      R$ {req.netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-amber-400">Deságio: {req.discountFeePercentage}%</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-cyan-300 font-mono">
                      R$ {req.availableBalanceFuture.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500">Saldo futuro retido</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.riskScore === 'LOW'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : req.riskScore === 'MEDIUM'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {req.riskScore === 'LOW' ? 'BAIXO' : req.riskScore === 'MEDIUM' ? 'MÉDIO' : 'ALTO'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      req.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                        : req.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    }`}>
                      {req.status === 'PENDING_APPROVAL'
                        ? 'AGUARDANDO COMITÊ'
                        : req.status === 'APPROVED'
                        ? 'APROVADA'
                        : 'RECUSADA'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenDecision(req)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition cursor-pointer"
                    >
                      {req.status === 'PENDING_APPROVAL' ? 'Julgar' : 'Detalhes'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      <DecisaoAntecipacaoModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        request={selectedRequest}
        onApprove={approveCreditRequest}
        onReject={rejectCreditRequest}
      />
    </div>
  );
};
