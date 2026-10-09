import React, { useState, useEffect } from 'react';
import { CommercialProposal, CorporateOrder } from '@/types/commercial';
import {
  FileText,
  Plus,
  Download,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Check,
  Eye,
  Copy,
  FileCheck,
  TrendingUp,
  Building,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovaPropostaModal } from '@/components/modals/NovaPropostaModal';
import { PropostaDetalhesModal } from '@/components/modals/PropostaDetalhesModal';
import { useNavigate } from 'react-router-dom';

export const PropostasPage: React.FC = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<CommercialProposal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<CommercialProposal | null>(null);

  useEffect(() => {
    keeperAdapter.getCommercialProposals().then(setProposals);
  }, []);

  const handleUpdateStatus = async (id: string, status: CommercialProposal['status']) => {
    const updated = await keeperAdapter.updateCommercialProposalStatus(id, status);
    setProposals(updated);
  };

  const handleDuplicate = async (id: string) => {
    const cloned = await keeperAdapter.duplicateCommercialProposal(id);
    setProposals((prev) => [cloned, ...prev]);
  };

  const handleConvertToCorporate = async (proposal: CommercialProposal) => {
    await keeperAdapter.convertProposalToCorporateOrder(proposal.id);
    const updatedProps = await keeperAdapter.getCommercialProposals();
    setProposals(updatedProps);
    navigate('/comercial/vendas-corporativas');
  };

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.proposalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmountAll = proposals.reduce((acc, p) => acc + p.totalAmount, 0);
  const approvedProposals = proposals.filter((p) => p.status === 'APROVADA');
  const approvedAmount = approvedProposals.reduce((acc, p) => acc + p.totalAmount, 0);
  const pendingProposals = proposals.filter((p) => p.status === 'ENVIADA' || p.status === 'RASCUNHO');
  const pendingAmount = pendingProposals.reduce((acc, p) => acc + p.totalAmount, 0);

  const getStatusBadge = (status: CommercialProposal['status']) => {
    switch (status) {
      case 'APROVADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Aprovada
          </span>
        );
      case 'ENVIADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Send className="w-3 h-3" />
            Enviada
          </span>
        );
      case 'RASCUNHO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#232429] text-slate-300 border border-[#37393e]">
            <Clock className="w-3 h-3" />
            Rascunho
          </span>
        );
      case 'RECUSADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Recusada
          </span>
        );
      case 'EXPIRADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#202124] text-slate-400 border border-[#37393e]">
            Expirada
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#202124] text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Orçamentos & Propostas Comerciais
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Cotas & Vendas Corporativas
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Emissão de propostas comerciais formais para empresas, pacotes corporativos e cotas de patrocinadores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              downloadCsv(
                'propostas-comerciais',
                ['Número Proposta', 'Cliente', 'Evento', 'Ingressos', 'Desconto (%)', 'Valor Total (R$)', 'Validade', 'Status', 'Pedido Vinculado'],
                filteredProposals.map((p) => [
                  p.proposalNumber,
                  p.clientName,
                  p.eventName,
                  p.totalTickets,
                  p.discountRate,
                  p.totalAmount,
                  formatDate(p.validUntil),
                  p.status,
                  p.corporateOrderId || 'Não gerado',
                ])
              );
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Proposta Comercial</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Total Emitido</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatCurrency(totalAmountAll)}
          </div>
          <span className="text-[10px] text-slate-400">{proposals.length} propostas no total</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Propostas Aprovadas</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(approvedAmount)}
          </div>
          <span className="text-[10px] text-emerald-400">{approvedProposals.length} propostas convertidas</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Aguardando Fechamento</span>
          <div className="text-xl font-extrabold text-amber-400 mt-1">
            {formatCurrency(pendingAmount)}
          </div>
          <span className="text-[10px] text-amber-400">{pendingProposals.length} propostas abertas</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Taxa de Aceite</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {proposals.length > 0 ? `${Math.round((approvedProposals.length / proposals.length) * 100)}%` : '0%'}
          </div>
          <span className="text-[10px] text-blue-400">Conversão de orçamentos</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou evento..."
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
          <option value="ALL">Todos os Status</option>
          <option value="APROVADA">Aprovadas</option>
          <option value="ENVIADA">Enviadas</option>
          <option value="RASCUNHO">Em Elaboração</option>
          <option value="RECUSADA">Recusadas</option>
          <option value="EXPIRADA">Expiradas</option>
        </select>
      </div>

      {/* Proposals Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Número Proposta</th>
              <th className="p-3.5 font-semibold">Cliente / Empresa</th>
              <th className="p-3.5 font-semibold">Evento Relacionado</th>
              <th className="p-3.5 font-semibold text-center">Desconto</th>
              <th className="p-3.5 font-semibold text-right">Valor Total</th>
              <th className="p-3.5 font-semibold">Validade</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-center">Ações Operacionais</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredProposals.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelectedProposal(p)}
                className="hover:bg-[#25262c] transition cursor-pointer"
              >
                <td className="p-3.5 font-mono font-bold text-blue-400">{p.proposalNumber}</td>
                <td className="p-3.5">
                  <div className="font-semibold text-white">{p.clientName}</div>
                  <div className="text-[11px] text-slate-400">{p.totalTickets} Ingressos</div>
                </td>
                <td className="p-3.5 text-slate-300">{p.eventName}</td>
                <td className="p-3.5 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#232429] text-indigo-300 border border-[#37393e]">
                    {p.discountRate}% Desconto
                  </span>
                </td>
                <td className="p-3.5 text-right font-extrabold text-white font-mono">
                  {formatCurrency(p.totalAmount)}
                </td>
                <td className="p-3.5 text-slate-400">{formatDate(p.validUntil)}</td>
                <td className="p-3.5 text-center">{getStatusBadge(p.status)}</td>
                <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5">
                    {/* View Button */}
                    <button
                      onClick={() => setSelectedProposal(p)}
                      className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                      title="Ver Proposta Oficial / Imprimir"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(p.id)}
                      className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                      title="Duplicar Proposta"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Convert to Corporate Order */}
                    {p.status === 'APROVADA' && !p.corporateOrderId && (
                      <button
                        onClick={() => handleConvertToCorporate(p)}
                        className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Gerar Pedido Corporativo"
                      >
                        <FileCheck className="w-3 h-3" />
                        <span>Faturar</span>
                      </button>
                    )}

                    {/* Send to client */}
                    {p.status === 'RASCUNHO' && (
                      <button
                        onClick={() => handleUpdateStatus(p.id, 'ENVIADA')}
                        className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Enviar ao Cliente"
                      >
                        <Send className="w-3 h-3" />
                        <span>Enviar</span>
                      </button>
                    )}

                    {/* Quick Approve / Reject for ENVIADA */}
                    {p.status === 'ENVIADA' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'APROVADA')}
                          className="p-1.5 rounded hover:bg-emerald-500/20 text-emerald-400 transition cursor-pointer"
                          title="Aprovar Proposta"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'RECUSADA')}
                          className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="Recusar Proposta"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <NovaPropostaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCommercialProposal(data);
          setProposals((prev) => [created, ...prev]);
        }}
      />

      <PropostaDetalhesModal
        proposal={selectedProposal}
        isOpen={Boolean(selectedProposal)}
        onClose={() => setSelectedProposal(null)}
        onUpdateStatus={async (status) => {
          if (selectedProposal) {
            const updated = await keeperAdapter.updateCommercialProposalStatus(selectedProposal.id, status);
            setProposals(updated);
            setSelectedProposal((prev) => (prev ? { ...prev, status } : null));
          }
        }}
        onConvertToCorporate={handleConvertToCorporate}
      />
    </div>
  );
};
