import React, { useState, useEffect } from 'react';
import { CommercialOpportunity } from '@/types/commercial';
import {
  Target,
  Plus,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Filter,
  Search,
  User,
  MoreVertical,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovaOportunidadeModal } from '@/components/modals/NovaOportunidadeModal';
import { OportunidadeDetalhesModal } from '@/components/modals/OportunidadeDetalhesModal';
import { NovaPropostaModal } from '@/components/modals/NovaPropostaModal';

const STAGES: { id: CommercialOpportunity['stage']; label: string; dotColor: string }[] = [
  { id: 'PROSPECCAO', label: 'Prospecção', dotColor: 'bg-blue-400' },
  { id: 'PROPOSTA_ENVIADA', label: 'Proposta Enviada', dotColor: 'bg-indigo-400' },
  { id: 'NEGOCIACAO', label: 'Negociação', dotColor: 'bg-amber-400' },
  { id: 'FECHADO_GANHO', label: 'Fechado / Ganho', dotColor: 'bg-emerald-400' },
  { id: 'FECHADO_PERDIDO', label: 'Fechado / Perdido', dotColor: 'bg-rose-400' },
];

export const OportunidadesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [repFilter, setRepFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');

  // Modals state
  const [isNewOppModalOpen, setIsNewOppModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<CommercialOpportunity | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [oppForProposal, setOppForProposal] = useState<CommercialOpportunity | null>(null);

  useEffect(() => {
    keeperAdapter.getCommercialOpportunities().then(setOpportunities);
  }, []);

  const handleMoveStage = async (
    id: string,
    newStage: CommercialOpportunity['stage'],
    lossReason?: string
  ) => {
    const updated = await keeperAdapter.updateCommercialOpportunityStage(id, newStage, lossReason);
    setOpportunities(updated);
  };

  const filteredOpps = opportunities.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.eventName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRep = repFilter === 'ALL' || o.assignedTo === repFilter;
    const matchesEvent = eventFilter === 'ALL' || (o.eventName || '').includes(eventFilter);

    return matchesSearch && matchesRep && matchesEvent;
  });

  const totalPipeline = filteredOpps
    .filter((o) => o.stage !== 'FECHADO_PERDIDO' && o.stage !== 'FECHADO_GANHO')
    .reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const weightedPipeline = filteredOpps
    .filter((o) => o.stage !== 'FECHADO_PERDIDO' && o.stage !== 'FECHADO_GANHO')
    .reduce((acc, curr) => acc + (curr.estimatedValue * curr.probability) / 100, 0);

  const closedWonTotal = filteredOpps
    .filter((o) => o.stage === 'FECHADO_GANHO')
    .reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const handleExportPipeline = () => {
    downloadCsv(
      'funil-oportunidades-comercial',
      ['Título', 'Cliente', 'Evento', 'Etapa', 'Valor Estimado (R$)', 'Probabilidade (%)', 'Responsável', 'Previsão Fechamento', 'Motivo da Perda'],
      filteredOpps.map((o) => [
        o.title,
        o.clientName,
        o.eventName || '-',
        o.stage,
        o.estimatedValue,
        o.probability,
        o.assignedTo,
        o.closeDate || '-',
        o.lossReason || '-',
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
              Oportunidades & Funil Comercial
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Pipeline de Patrocínio & Cotas
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhamento de vendas corporativas, cotas de patrocínio e camarotes fechados.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPipeline}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Exportar Funil (CSV)</span>
          </button>

          <button
            onClick={() => setIsNewOppModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* Pipeline Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Total no Pipeline Ativo</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatCurrency(totalPipeline)}
          </div>
          <span className="text-[10px] text-slate-400">Em prospecção e negociação</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Pipeline Ponderado</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(weightedPipeline)}
          </div>
          <span className="text-[10px] text-emerald-400">Pela probabilidade das etapas</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Total Ganho / Fechado</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {formatCurrency(closedWonTotal)}
          </div>
          <span className="text-[10px] text-blue-400">Contratos convertidos</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Taxa de Conversão</span>
          <div className="text-xl font-extrabold text-teal-400 mt-1">
            68.4%
          </div>
          <span className="text-[10px] text-teal-400">Histórico de fechamento</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por negócio, cliente ou evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
          >
            <option value="ALL">Todos os Representantes</option>
            <option value="Vinicius Casagrande">Vinicius Casagrande</option>
            <option value="Bruno Valente">Bruno Valente</option>
            <option value="Ana Paula Dias">Ana Paula Dias</option>
          </select>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
          >
            <option value="ALL">Todos os Eventos</option>
            <option value="Festival">Festival XYZ / Festival de Verão</option>
            <option value="Show ABC">Show Nacional ABC 2026</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageOpps = filteredOpps.filter((o) => o.stage === stage.id);
          const stageTotal = stageOpps.reduce((acc, curr) => acc + curr.estimatedValue, 0);

          return (
            <div
              key={stage.id}
              className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col min-w-[240px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#37393e] mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                  <span className="text-xs font-bold text-white">{stage.label}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#202124] text-slate-300">
                  {stageOpps.length}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 mb-3 font-mono font-bold">
                {formatCurrency(stageTotal)}
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className="p-3 bg-[#232429] hover:bg-[#25262c] border border-[#37393e] rounded-lg space-y-2.5 cursor-pointer transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="text-xs font-bold text-white leading-snug hover:text-blue-400 transition">
                        {opp.title}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono flex-shrink-0">
                        {opp.probability}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 flex-shrink-0 text-slate-500" />
                      <span className="truncate">{opp.clientName}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 truncate">
                      {opp.eventName} • {opp.assignedTo}
                    </div>

                    {opp.lossReason && stage.id === 'FECHADO_PERDIDO' && (
                      <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300">
                        Motivo: {opp.lossReason}
                      </div>
                    )}

                    {/* Card Footer Actions */}
                    <div
                      className="pt-2 border-t border-[#37393e] flex items-center justify-between text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="font-extrabold text-white">
                        {formatCurrency(opp.estimatedValue)}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Quick Proposal Action */}
                        {stage.id !== 'FECHADO_PERDIDO' && (
                          <button
                            onClick={() => {
                              setOppForProposal(opp);
                              setIsProposalModalOpen(true);
                            }}
                            className="p-1 rounded hover:bg-[#35363c] text-indigo-400 hover:text-white transition cursor-pointer"
                            title="Emitir Proposta Formal"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Stage Step Forward */}
                        {stage.id !== 'FECHADO_GANHO' && stage.id !== 'FECHADO_PERDIDO' && (
                          <button
                            onClick={() => {
                              const nextStage =
                                stage.id === 'PROSPECCAO'
                                  ? 'PROPOSTA_ENVIADA'
                                  : stage.id === 'PROPOSTA_ENVIADA'
                                  ? 'NEGOCIACAO'
                                  : 'FECHADO_GANHO';
                              handleMoveStage(opp.id, nextStage);
                            }}
                            className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white text-[10px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                            title="Avançar para a próxima etapa"
                          >
                            <span>Avançar</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <NovaOportunidadeModal
        isOpen={isNewOppModalOpen}
        onClose={() => setIsNewOppModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCommercialOpportunity(data);
          setOpportunities((prev) => [created, ...prev]);
        }}
      />

      <OportunidadeDetalhesModal
        opportunity={selectedOpp}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        onSave={async (updates) => {
          if (selectedOpp) {
            const updated = await keeperAdapter.updateCommercialOpportunity(selectedOpp.id, updates);
            setOpportunities(updated);
          }
        }}
        onConvertToProposal={(opp) => {
          setOppForProposal(opp);
          setIsProposalModalOpen(true);
        }}
      />

      <NovaPropostaModal
        isOpen={isProposalModalOpen}
        onClose={() => {
          setIsProposalModalOpen(false);
          setOppForProposal(null);
        }}
        onConfirm={async (data) => {
          await keeperAdapter.createCommercialProposal({
            ...data,
            clientName: oppForProposal ? oppForProposal.clientName : data.clientName,
            eventName: oppForProposal?.eventName || data.eventName,
            totalAmount: oppForProposal ? oppForProposal.estimatedValue : data.totalAmount,
            totalTickets: oppForProposal?.ticketsQuantity || data.totalTickets,
          });
          setIsProposalModalOpen(false);
          setOppForProposal(null);
        }}
      />
    </div>
  );
};
