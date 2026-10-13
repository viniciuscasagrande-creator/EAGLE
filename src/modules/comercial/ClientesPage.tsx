import React, { useState, useEffect } from 'react';
import { CommercialClient, CommercialProposal } from '@/types/commercial';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  Ticket,
  DollarSign,
  Building,
  Star,
  Plus,
  Eye,
  FileText,
  Filter,
  ArrowUpDown,
  MessageSquare,
  LayoutGrid,
  List,
  MapPin,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovoClienteModal } from '@/components/modals/NovoClienteModal';
import { ClienteDetalhesModal } from '@/components/modals/ClienteDetalhesModal';
import { NovaPropostaModal } from '@/components/modals/NovaPropostaModal';

export const ClientesPage: React.FC = () => {
  const [clients, setClients] = useState<CommercialClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [ltvFilter, setLtvFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'volume' | 'orders' | 'name'>('volume');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Modals state
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<CommercialClient | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [clientForProposal, setClientForProposal] = useState<CommercialClient | null>(null);

  useEffect(() => {
    keeperAdapter.getCommercialClients().then(setClients);
  }, []);

  const filteredClients = clients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document.includes(searchTerm) ||
        (client.city || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'ALL' || client.category === categoryFilter;

      let matchesLtv = true;
      if (ltvFilter === 'VIP') matchesLtv = client.totalVolume >= 10000;
      else if (ltvFilter === 'KEY') matchesLtv = client.totalVolume >= 50000;
      else if (ltvFilter === 'LOW') matchesLtv = client.totalVolume < 10000;

      return matchesSearch && matchesCategory && matchesLtv;
    })
    .sort((a, b) => {
      if (sortBy === 'volume') return b.totalVolume - a.totalVolume;
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      return a.name.localeCompare(b.name);
    });

  const totalSpentAll = clients.reduce((acc, c) => acc + c.totalVolume, 0);
  const totalOrdersAll = clients.reduce((acc, c) => acc + c.totalOrders, 0);

  const handleExportFullBase = () => {
    downloadCsv(
      'clientes-comercial-diskingressos',
      ['Nome / Razão Social', 'Documento', 'Contato', 'Cargo', 'E-mail', 'Telefone', 'Categoria', 'Cidade', 'Pedidos', 'LTV Total (R$)', 'Última Compra', 'Tags'],
      filteredClients.map((c) => [
        c.name,
        c.document,
        c.contactName,
        c.contactRole || '-',
        c.email,
        c.phone,
        c.category,
        c.city,
        c.totalOrders,
        c.totalVolume,
        c.lastPurchaseDate || '-',
        (c.tags || []).join('; '),
      ])
    );
  };

  const handleExportMailing = () => {
    downloadCsv(
      'mailing-corporativo-clientes',
      ['Nome da Empresa', 'Nome do Contato', 'E-mail', 'Telefone', 'Categoria', 'LTV (R$)'],
      filteredClients.map((c) => [
        c.name,
        c.contactName,
        c.email,
        c.phone,
        c.category,
        c.totalVolume,
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
              Central de Clientes & Compradores
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Comercial & CRM
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Base unificada de compradores dos seus eventos, perfil de consumo, LTV e histórico de ingressos.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportMailing}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
            title="Exportar lista de contatos para mala direta / email"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Exportar Mailing</span>
          </button>

          <button
            onClick={handleExportFullBase}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Exportar Base (CSV)</span>
          </button>

          <button
            onClick={() => setIsNewClientModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Total de Clientes</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {clients.length}
          </div>
          <span className="text-[10px] text-emerald-400">Compradores e parceiros cadastrados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Pedidos Registrados</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {totalOrdersAll}
          </div>
          <span className="text-[10px] text-blue-400">Compras corporativas e individuais</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Volume Faturado (LTV)</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalSpentAll)}
          </div>
          <span className="text-[10px] text-slate-400">Receita total gerada</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Ticket Médio Geral</span>
          <div className="text-xl font-extrabold text-indigo-400 mt-1">
            {formatCurrency(totalSpentAll / (clients.length || 1))}
          </div>
          <span className="text-[10px] text-indigo-400">Por cliente cadastrado</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, CNPJ ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="EMPRESA">Empresas</option>
            <option value="AGENCIA">Agências</option>
            <option value="GRUPO">Grupos</option>
            <option value="UNIVERSIDADE">Universidades</option>
            <option value="OUTROS">Outros</option>
          </select>

          <select
            value={ltvFilter}
            onChange={(e) => setLtvFilter(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
          >
            <option value="ALL">Qualquer Valor (LTV)</option>
            <option value="VIP">Clientes VIP (&gt; R$ 10.000)</option>
            <option value="KEY">Key Accounts (&gt; R$ 50.000)</option>
            <option value="LOW">Iniciantes (&lt; R$ 10.000)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
          >
            <option value="volume">Ordenar por Maior LTV</option>
            <option value="orders">Ordenar por Mais Pedidos</option>
            <option value="name">Ordenar por Nome (A-Z)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#202124] p-1 rounded-md border border-[#37393e]">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded transition ${
                viewMode === 'cards' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Grade de Cards CRM"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Tabela Detalhada"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Render View: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const whatsapp = client.phone ? client.phone.replace(/\D/g, '') : '';
            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="bg-[#2c2d33] hover:bg-[#30323a] border border-[#37393e] rounded-xl p-4 shadow-md flex flex-col justify-between space-y-3 cursor-pointer transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-xs flex-shrink-0">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                          <span>{client.name}</span>
                          {client.totalVolume > 10000 && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                          )}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">{client.document}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#202124] text-amber-300 border border-[#37393e]">
                      {client.category}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="font-semibold text-white">{client.contactName}</span>
                      {client.contactRole && <span className="text-slate-400 text-[10px]">({client.contactRole})</span>}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{client.city}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#37393e] grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Investido (LTV)</span>
                    <span className="text-emerald-400 font-extrabold font-mono text-xs">{formatCurrency(client.totalVolume)}</span>
                  </div>
                  <div className="bg-[#202124] p-2 rounded border border-[#37393e]">
                    <span className="text-[10px] text-slate-400 uppercase block">Pedidos</span>
                    <span className="text-white font-extrabold font-mono text-xs">{client.totalOrders} compras</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#37393e] flex items-center justify-between gap-1 text-xs" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    {whatsapp && (
                      <a
                        href={`https://wa.me/55${whatsapp}?text=${encodeURIComponent(
                          `Olá ${client.contactName}, tudo bem? Aqui é da equipe comercial DiskIngressos.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-xs font-bold transition flex items-center gap-1"
                        title="Abrir WhatsApp com este cliente"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <a
                      href={`mailto:${client.email}`}
                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white transition"
                      title="Enviar E-mail"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setClientForProposal(client);
                      setIsProposalModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#202124] hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold border border-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Nova Proposta</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Clients Table */
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Cliente / Razão Social</th>
                <th className="p-3.5 font-semibold">Documento</th>
                <th className="p-3.5 font-semibold">Cidade</th>
                <th className="p-3.5 font-semibold text-center">Pedidos</th>
                <th className="p-3.5 font-semibold text-right">Total Investido (LTV)</th>
                <th className="p-3.5 font-semibold">Última Compra</th>
                <th className="p-3.5 font-semibold text-center">Categoria</th>
                <th className="p-3.5 font-semibold text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {filteredClients.map((client) => {
                const whatsapp = client.phone ? client.phone.replace(/\D/g, '') : '';
                return (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="hover:bg-[#25262c] transition cursor-pointer"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {client.name}
                        {client.totalVolume > 10000 && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{client.document}</td>
                    <td className="p-3.5 text-slate-300">{client.city}</td>
                    <td className="p-3.5 text-center font-bold text-white">
                      {client.totalOrders}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-emerald-400">
                      {formatCurrency(client.totalVolume)}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {client.lastPurchaseDate ? formatDateTime(client.lastPurchaseDate) : '-'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#232429] text-amber-300 border border-[#37393e]">
                        {client.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-white transition cursor-pointer"
                          title="Ver Ficha Completa do Cliente"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                        </button>

                        <button
                          onClick={() => {
                            setClientForProposal(client);
                            setIsProposalModalOpen(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-amber-400 transition cursor-pointer"
                          title="Gerar Proposta Comercial para este Cliente"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {whatsapp && (
                          <a
                            href={`https://wa.me/55${whatsapp}?text=${encodeURIComponent(
                              `Olá ${client.contactName}, tudo bem? Aqui é da DiskIngressos.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-[#35363c] text-slate-300 hover:text-emerald-400 transition cursor-pointer"
                            title="Chamar no WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <NovoClienteModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCommercialClient(data);
          setClients((prev) => [created, ...prev]);
        }}
      />

      <ClienteDetalhesModal
        client={selectedClient}
        isOpen={Boolean(selectedClient)}
        onClose={() => setSelectedClient(null)}
        onGenerateProposal={(cli) => {
          setClientForProposal(cli);
          setIsProposalModalOpen(true);
        }}
        onUpdateClient={async (updates) => {
          if (selectedClient) {
            const updated = await keeperAdapter.updateCommercialClient(selectedClient.id, updates);
            setClients(updated);
            setSelectedClient((prev) => (prev ? { ...prev, ...updates } : null));
          }
        }}
      />

      <NovaPropostaModal
        isOpen={isProposalModalOpen}
        initialData={
          clientForProposal
            ? { clientName: clientForProposal.name }
            : undefined
        }
        onClose={() => {
          setIsProposalModalOpen(false);
          setClientForProposal(null);
        }}
        onConfirm={async (data) => {
          await keeperAdapter.createCommercialProposal({
            ...data,
            clientName: clientForProposal ? clientForProposal.name : data.clientName,
            clientId: clientForProposal ? clientForProposal.id : undefined,
          });
          setIsProposalModalOpen(false);
          setClientForProposal(null);
        }}
      />
    </div>
  );
};
