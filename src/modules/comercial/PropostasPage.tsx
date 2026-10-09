import React, { useState, useEffect } from 'react';
import { CommercialProposal } from '@/types/commercial';
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
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovaPropostaModal } from '@/components/modals/NovaPropostaModal';

export const PropostasPage: React.FC = () => {
  const [proposals, setProposals] = useState<CommercialProposal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getCommercialProposals().then(setProposals);
  }, []);

  const handleUpdateStatus = async (id: string, status: CommercialProposal['status']) => {
    const updated = await keeperAdapter.updateCommercialProposalStatus(id, status);
    setProposals(updated);
  };


  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.proposalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            Enviada ao Cliente
          </span>
        );
      case 'RASCUNHO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#232429] text-slate-300 border border-[#37393e]">
            <Clock className="w-3 h-3" />
            Em Elaboração
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
                ['Número Proposta', 'Cliente', 'Evento', 'Ingressos', 'Desconto (%)', 'Valor Total (R$)', 'Validade', 'Status'],
                filteredProposals.map((p) => [
                  p.proposalNumber,
                  p.clientName,
                  p.eventName,
                  p.totalTickets,
                  p.discountRate,
                  p.totalAmount,
                  formatDate(p.validUntil),
                  p.status,
                ])
              );
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Proposta Comercial</span>
          </button>
        </div>
      </div>

      <NovaPropostaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCommercialProposal(data);
          setProposals((prev) => [created, ...prev]);
        }}
      />


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
              <th className="p-3.5 font-semibold">Tipo do Pacote</th>
              <th className="p-3.5 font-semibold text-right">Valor Total</th>
              <th className="p-3.5 font-semibold">Validade</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
              <th className="p-3.5 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredProposals.map((p) => (
              <tr key={p.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-mono font-bold text-blue-400">{p.proposalNumber}</td>
                <td className="p-3.5">
                  <div className="font-semibold text-white">{p.clientName}</div>
                  <div className="text-[11px] text-slate-400">{p.totalTickets} Ingressos</div>
                </td>
                <td className="p-3.5 text-slate-300">{p.eventName}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#232429] text-indigo-300 border border-[#37393e]">
                    {p.discountRate}% Desconto
                  </span>
                </td>
                <td className="p-3.5 text-right font-extrabold text-white">
                  {formatCurrency(p.totalAmount)}
                </td>
                <td className="p-3.5 text-slate-400">{formatDate(p.validUntil)}</td>
                <td className="p-3.5 text-right">{getStatusBadge(p.status)}</td>
                <td className="p-3.5 text-center">
                  <div className="flex items-center justify-center gap-1">
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
                    {p.status === 'ENVIADA' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'APROVADA')}
                          className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                          title="Aprovar Proposta"
                        >
                          <Check className="w-3 h-3" />
                          <span>Aprovar</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'RECUSADA')}
                          className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                          title="Recusar Proposta"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        downloadCsv(
                          `proposta-${p.proposalNumber.toLowerCase()}`,
                          ['Número Proposta', 'Cliente', 'Evento', 'Ingressos', 'Valor Total', 'Validade', 'Status'],
                          [[p.proposalNumber, p.clientName, p.eventName, p.totalTickets, p.totalAmount, formatDate(p.validUntil), p.status]]
                        );
                      }}
                      className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                      title="Baixar Arquivo da Proposta"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
