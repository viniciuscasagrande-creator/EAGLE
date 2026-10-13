import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Producer } from '@/types/producer';
import { EditarProdutoraModal } from '@/components/modals/EditarProdutoraModal';
import {
  Building2,
  Search,
  Filter,
  ArrowUpRight,
  Edit,
  ShieldCheck,
  Plus,
  Phone,
  Mail,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const GestaoProdutorasPage: React.FC = () => {
  const { availableProducers, switchProfile, switchProducer, updateProducerContract } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProducerForEdit, setSelectedProducerForEdit] = useState<Producer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtered = availableProducers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.tradeName && p.tradeName.toLowerCase().includes(search.toLowerCase())) ||
      p.cnpj.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEdit = (producer: Producer) => {
    setSelectedProducerForEdit(producer);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (producerId: string, updates: Partial<Producer>) => {
    updateProducerContract(producerId, updates);
  };

  const handleImpersonate = (producerId: string) => {
    switchProducer(producerId);
    switchProfile('PRODUCER');
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Gestão Global de Produtoras
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {availableProducers.length} cadastradas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervisão de contas, parâmetros contratuais de comissão, limites de crédito e conciliação bancária.
          </p>
        </div>

        <button
          onClick={() => alert('Formulário de onboarding de nova produtora homologado no Keeper Core. Envie o convite cadastral por e-mail.')}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Produtora</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por produtora, CNPJ ou e-mail..."
            className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/90 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-purple-500 transition cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Apenas Ativas</option>
            <option value="SUSPENDED">Suspensas</option>
            <option value="INACTIVE">Inativas</option>
          </select>
        </div>
      </div>

      {/* Producers Table */}
      <div className="rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Produtora / Empresa</th>
                <th className="py-3.5 px-4 font-bold">CNPJ & Contato</th>
                <th className="py-3.5 px-4 font-bold">Take Rate</th>
                <th className="py-3.5 px-4 font-bold">Teto Antecipação</th>
                <th className="py-3.5 px-4 font-bold">Saldo Disponível</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 flex-shrink-0">
                        {prod.tradeName ? prod.tradeName.charAt(0) : 'P'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">
                          {prod.tradeName || prod.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {prod.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CNPJ & Contact */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-300">{prod.cnpj}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{prod.email}</span>
                    </div>
                  </td>

                  {/* Take Rate */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {prod.commissionRate || 8.5}%
                    </span>
                  </td>

                  {/* Max Advance Limit */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">
                      R$ {(prod.maxAdvanceLimit || 400000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500">Limite homologado</div>
                  </td>

                  {/* Available Balance */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-emerald-400">
                      R$ {prod.kpis.disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Em antecipação: R$ {prod.kpis.emAntecipacao.toLocaleString('pt-BR')}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prod.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {prod.status === 'ACTIVE' ? 'ATIVA' : 'SUSPENSA'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Editar Condições Comerciais"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleImpersonate(prod.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition inline-flex items-center gap-1"
                        title="Abrir Portal do Produtor com os dados desta produtora"
                      >
                        <span>Acessar</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Producer Modal */}
      <EditarProdutoraModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        producer={selectedProducerForEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
