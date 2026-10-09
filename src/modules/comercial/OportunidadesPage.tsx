import React, { useState, useEffect } from 'react';
import { CommercialOpportunity } from '@/types/commercial';
import {
  Target,
  Plus,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovaOportunidadeModal } from '@/components/modals/NovaOportunidadeModal';

const STAGES: { id: CommercialOpportunity['stage']; label: string }[] = [
  { id: 'PROSPECCAO', label: 'Prospecção' },
  { id: 'PROPOSTA_ENVIADA', label: 'Proposta Enviada' },
  { id: 'NEGOCIACAO', label: 'Negociação' },
  { id: 'FECHADO_GANHO', label: 'Fechado / Ganho' },
  { id: 'FECHADO_PERDIDO', label: 'Fechado / Perdido' },
];

export const OportunidadesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getCommercialOpportunities().then(setOpportunities);
  }, []);

  const handleMoveStage = async (id: string, newStage: CommercialOpportunity['stage']) => {
    const updated = await keeperAdapter.updateCommercialOpportunityStage(id, newStage);
    setOpportunities(updated);
  };

  const totalPipeline = opportunities
    .filter((o) => o.stage !== 'FECHADO_PERDIDO')
    .reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const weightedPipeline = opportunities
    .filter((o) => o.stage !== 'FECHADO_PERDIDO')
    .reduce((acc, curr) => acc + (curr.estimatedValue * curr.probability) / 100, 0);

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

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      <NovaOportunidadeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createCommercialOpportunity(data);
          setOpportunities((prev) => [created, ...prev]);
        }}
      />


      {/* Pipeline Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Total no Pipeline</span>
          <div className="text-xl font-extrabold text-white mt-1">
            {formatCurrency(totalPipeline)}
          </div>
          <span className="text-[10px] text-slate-400">Em todas as etapas ativas</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Pipeline Ponderado</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(weightedPipeline)}
          </div>
          <span className="text-[10px] text-emerald-400">Probabilidade real esperada</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Negócios no Funil</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {opportunities.length}
          </div>
          <span className="text-[10px] text-blue-400">Oportunidades mapeadas</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Taxa de Sucesso</span>
          <div className="text-xl font-extrabold text-teal-400 mt-1">
            68.4%
          </div>
          <span className="text-[10px] text-teal-400">Conversão histórica</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageOpps = opportunities.filter((o) => o.stage === stage.id);
          const stageTotal = stageOpps.reduce((acc, curr) => acc + curr.estimatedValue, 0);

          return (
            <div
              key={stage.id}
              className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#37393e] mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      stage.id === 'FECHADO_GANHO'
                        ? 'bg-emerald-400'
                        : stage.id === 'FECHADO_PERDIDO'
                        ? 'bg-rose-400'
                        : 'bg-blue-400'
                    }`}
                  />
                  <span className="text-xs font-bold text-white">{stage.label}</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#202124] text-slate-300">
                  {stageOpps.length}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 mb-2 font-mono">
                {formatCurrency(stageTotal)}
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3 bg-[#232429] hover:bg-[#25262c] border border-[#37393e] rounded-lg space-y-2 cursor-pointer transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="text-xs font-bold text-white leading-snug">
                        {opp.title}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">
                        {opp.probability}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{opp.clientName}</span>
                    </div>

                    <div className="pt-2 border-t border-[#37393e] flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white">
                        {formatCurrency(opp.estimatedValue)}
                      </span>
                      <div className="flex items-center gap-1">
                        {stage.id !== 'FECHADO_GANHO' && stage.id !== 'FECHADO_PERDIDO' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
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
    </div>
  );
};
