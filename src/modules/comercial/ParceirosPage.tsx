import React, { useState, useEffect } from 'react';
import { CommercialPartner } from '@/types/commercial';
import {
  Handshake,
  Plus,
  Search,
  Tag,
  Percent,
  TrendingUp,
  DollarSign,
  Ticket,
  ExternalLink,
  Download,
  Copy,
  Check,
  Eye,
  CreditCard,
  Filter,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovoParceiroModal } from '@/components/modals/NovoParceiroModal';
import { ParceiroDetalhesModal } from '@/components/modals/ParceiroDetalhesModal';

export const ParceirosPage: React.FC = () => {
  const [partners, setPartners] = useState<CommercialPartner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);

  // Modals state
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<CommercialPartner | null>(null);

  useEffect(() => {
    keeperAdapter.getPartners().then(setPartners);
  }, []);

  const handleUpdateStatus = async (id: string, status: 'ACTIVE' | 'PAUSED') => {
    const updated = await keeperAdapter.updatePartnerStatus(id, status);
    setPartners(updated);
    if (selectedPartner && selectedPartner.id === id) {
      setSelectedPartner((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleSettleCommission = async (id: string, amount: number, notes?: string) => {
    const updated = await keeperAdapter.settlePartnerCommission(id, amount, notes);
    setPartners(updated);
    if (selectedPartner && selectedPartner.id === id) {
      const currentPaid = selectedPartner.commissionPaid || 0;
      setSelectedPartner((prev) =>
        prev
          ? {
              ...prev,
              commissionPaid: currentPaid + amount,
            }
          : null
      );
    }
  };

  const handleCopyLink = (p: CommercialPartner) => {
    const link = `https://diskingressos.com.br/evento/festival-2026?cupom=${p.couponCode}&utm_source=parceiro&utm_campaign=${p.couponCode.toLowerCase()}`;
    navigator.clipboard.writeText(link);
    setCopiedCouponId(p.id);
    setTimeout(() => setCopiedCouponId(null), 2000);
  };

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalGrossPartner = partners.reduce((acc, p) => acc + (p.grossSalesGenerated || 0), 0);
  const totalTicketsPartner = partners.reduce((acc, p) => acc + (p.ticketsSold || 0), 0);
  const totalCommissionEarned = partners.reduce((acc, p) => acc + (p.commissionEarned || 0), 0);
  const totalCommissionPaid = partners.reduce((acc, p) => acc + (p.commissionPaid || 0), 0);
  const totalBalanceDue = Math.max(0, totalCommissionEarned - totalCommissionPaid);

  const handleExportPartners = () => {
    downloadCsv(
      'parceiros-convenios-comercial',
      ['Nome da Entidade / Parceiro', 'Categoria', 'Cupom Oficial', 'Desconto (%)', 'Comissão (%)', 'Ingressos Vendidos', 'Faturamento Gerado (R$)', 'Comissão Devida (R$)', 'Comissão Liquidada (R$)', 'Saldo a Pagar (R$)', 'Status'],
      filteredPartners.map((p) => [
        p.name,
        p.category || '-',
        p.couponCode,
        p.discountValue || p.discountPct || 0,
        p.commissionRate || 0,
        p.ticketsSold || 0,
        p.grossSalesGenerated || 0,
        p.commissionEarned || 0,
        p.commissionPaid || 0,
        Math.max(0, (p.commissionEarned || 0) - (p.commissionPaid || 0)),
        p.status,
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
              Parceiros, Convênios & Afiliados
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Descontos Exclusivos & Rastreabilidade
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Parcerias com conselhos profissionais, associações e sindicatos para impulsionar a venda de ingressos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPartners}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsNewPartnerModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Parceiro</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Vendas via Convênios</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalGrossPartner)}
          </div>
          <span className="text-[10px] text-emerald-400">Faturamento bruto gerado</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Ingressos com Desconto</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {totalTicketsPartner} un
          </div>
          <span className="text-[10px] text-blue-400">Comprados por afiliados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Parceiros Ativos</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {partners.filter((p) => p.status === 'ACTIVE').length} / {partners.length}
          </div>
          <span className="text-[10px] text-slate-400">Convênios vigentes</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Comissões a Liquidar</span>
          <div className="text-xl font-extrabold text-amber-400 mt-1">
            {formatCurrency(totalBalanceDue)}
          </div>
          <span className="text-[10px] text-amber-400">Saldo de comissões pendente</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar parceiro, cupom ou categoria..."
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
          <option value="ACTIVE">Apenas Ativos</option>
          <option value="PAUSED">Pausados</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Parceiro / Convênio</th>
              <th className="p-3.5 font-semibold">Cupom Oficial</th>
              <th className="p-3.5 font-semibold text-center">Desconto</th>
              <th className="p-3.5 font-semibold text-center">Comissão</th>
              <th className="p-3.5 font-semibold text-center">Ingressos Vendidos</th>
              <th className="p-3.5 font-semibold text-right">Faturamento Gerado</th>
              <th className="p-3.5 font-semibold text-right">Saldo Comissão</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredPartners.map((partner) => {
              const balance = Math.max(0, (partner.commissionEarned || 0) - (partner.commissionPaid || 0));
              return (
                <tr
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className="hover:bg-[#25262c] transition cursor-pointer"
                >
                  <td className="p-3.5">
                    <div className="font-bold text-white">{partner.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{partner.category}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-blue-400">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {partner.couponCode}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-emerald-400">
                    {partner.discountValue || partner.discountPct || 15}% OFF
                  </td>
                  <td className="p-3.5 text-center text-slate-300">
                    {(partner.commissionRate || 0) > 0 ? `${partner.commissionRate}%` : 'Sem comissão'}
                  </td>
                  <td className="p-3.5 text-center font-bold text-blue-400">
                    {partner.ticketsSold || 0} un
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-emerald-400 text-sm font-mono">
                    {formatCurrency(partner.grossSalesGenerated || 0)}
                  </td>
                  <td className="p-3.5 text-right font-mono">
                    <span className="font-bold text-white block">{formatCurrency(balance)}</span>
                    <span className="text-[10px] text-slate-400">de {formatCurrency(partner.commissionEarned || 0)}</span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        partner.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {partner.status === 'ACTIVE' ? 'Ativo' : 'Pausado'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedPartner(partner)}
                        className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                        title="Ver Detalhes do Parceiro & Quitações"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>

                      <button
                        onClick={() => handleCopyLink(partner)}
                        className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-emerald-400 transition cursor-pointer"
                        title="Copiar Link de Divulgação Oficial com UTM"
                      >
                        {copiedCouponId === partner.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
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
      <NovoParceiroModal
        isOpen={isNewPartnerModalOpen}
        onClose={() => setIsNewPartnerModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createPartner(data);
          setPartners((prev) => [created, ...prev]);
        }}
      />

      <ParceiroDetalhesModal
        partner={selectedPartner}
        isOpen={Boolean(selectedPartner)}
        onClose={() => setSelectedPartner(null)}
        onUpdateStatus={handleUpdateStatus}
        onSettleCommission={handleSettleCommission}
      />
    </div>
  );
};
