import React, { useState } from 'react';
import {
  mockReadyCampaignTemplates,
  mockEvents,
} from '@/services/api/mockSeedData';
import { ReadyCampaignTemplate, ReadyCampaignInstance } from '@/types/marketing';
import { ConfigurarCampanhaProntaModal } from '@/components/modals/ConfigurarCampanhaProntaModal';
import {
  Sparkles,
  Zap,
  Target,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const CampanhasProntasPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReadyCampaignTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'TODAS' | 'CONVERSAO' | 'LANCAMENTO' | 'RETENCAO' | 'REENGAGEMENT'>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [activatedCampaigns, setActivatedCampaigns] = useState<ReadyCampaignInstance[]>([
    {
      id: 'inst-1',
      templateId: 'rc-1',
      title: 'Acelerar Vendas — Festival XYZ 2026',
      eventId: 'ev-101',
      eventName: 'Festival XYZ 2026',
      channels: ['WHATSAPP', 'INSTAGRAM', 'EMAIL'],
      status: 'ACTIVE',
      budget: 1200,
      spent: 840,
      conversions: 62,
      revenue: 16120.0,
      startDate: '05/10/2026',
      endDate: '08/10/2026',
    },
  ]);

  const handleOpenConfig = (tpl: ReadyCampaignTemplate) => {
    setSelectedTemplate(tpl);
    setIsModalOpen(true);
  };

  const handleConfigSuccess = (newInstance: ReadyCampaignInstance) => {
    setActivatedCampaigns((prev) => [newInstance, ...prev]);
  };

  const filteredTemplates = mockReadyCampaignTemplates.filter((tpl) => {
    const matchesTab = activeTab === 'TODAS' || tpl.category === activeTab;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Campanhas Prontas & Estratégias Pré-Configuradas
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              8 Modelos Validados
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Playbooks prontos de aquisição, aceleração e retenção de público com distribuição multicanal automática
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#2c2d33] border border-[#37393e] rounded-lg p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'TODAS', label: 'Todas as Estratégias' },
            { id: 'CONVERSAO', label: 'Conversão & Urgência' },
            { id: 'LANCAMENTO', label: 'Lançamento de Evento' },
            { id: 'RETENCAO', label: 'Recuperação de Carrinho' },
            { id: 'REENGAGEMENT', label: 'Reativação de Compradores' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#37393e]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] border border-[#37393e] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 8 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-[#2c2d33] border border-[#37393e] hover:border-amber-500/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {tpl.tagline}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tpl.expectedDurationDays} dias
                </span>
              </div>

              <h3 className="font-extrabold text-white text-base group-hover:text-amber-400 transition-colors">
                {tpl.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>

              {/* Channels badges */}
              <div className="mt-3.5">
                <div className="text-[10px] font-semibold text-slate-400 mb-1.5">Canais Inclusos:</div>
                <div className="flex flex-wrap gap-1">
                  {tpl.channels.map((chan) => (
                    <span
                      key={chan}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-slate-300 border border-[#37393e]"
                    >
                      {chan}
                    </span>
                  ))}
                </div>
              </div>

              {/* Audience & Budget Info */}
              <div className="mt-4 pt-3 border-t border-[#37393e] space-y-1.5 text-[11px]">
                <div className="text-slate-400">
                  <span className="text-slate-300 font-semibold">Público:</span> {tpl.targetAudience}
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-300 font-semibold">Investimento Sugerido:</span>{' '}
                  <span className="text-emerald-400 font-bold">
                    {formatCurrency(tpl.suggestedBudgetMin)} - {formatCurrency(tpl.suggestedBudgetMax)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenConfig(tpl)}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#202124] hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-[#37393e] hover:border-amber-500 font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer group-hover:bg-amber-500 group-hover:text-slate-950"
            >
              <span>Configurar Campanha</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Activated Ready Campaigns Table (Video 00:42-00:50) */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">
              Campanhas Prontas Ativadas no Evento
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {activatedCampaigns.length} campanha(s) em execução
          </span>
        </div>

        {activatedCampaigns.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhuma campanha pronta ativada no momento. Selecione uma estratégia acima e clique em "Configurar Campanha".
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Estratégia & Evento</th>
                <th className="p-3.5 font-semibold">Canais</th>
                <th className="p-3.5 font-semibold">Período</th>
                <th className="p-3.5 font-semibold">Orçamento</th>
                <th className="p-3.5 font-semibold">Executado</th>
                <th className="p-3.5 font-semibold">Conversões</th>
                <th className="p-3.5 font-semibold">Receita Gerada</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {activatedCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{camp.title}</div>
                    <div className="text-[11px] text-slate-400">{camp.eventName}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex gap-1">
                      {camp.channels.map((c) => (
                        <span key={c} className="px-1.5 py-0.5 rounded text-[10px] bg-[#202124] text-slate-300 border border-[#37393e]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                    {camp.startDate} a {camp.endDate}
                  </td>
                  <td className="p-3.5 font-bold text-white">{formatCurrency(camp.budget)}</td>
                  <td className="p-3.5 text-slate-300">{formatCurrency(camp.spent)}</td>
                  <td className="p-3.5 font-semibold text-white">{camp.conversions} vendas</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(camp.revenue)}</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Ativa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <ConfigurarCampanhaProntaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
        onSuccess={handleConfigSuccess}
      />
    </div>
  );
};
