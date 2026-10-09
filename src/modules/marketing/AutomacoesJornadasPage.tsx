import React, { useState } from 'react';
import { mockAutomationJourneys } from '@/services/api/mockSeedData';
import { AutomationJourney } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  GitFork,
  Zap,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Play,
  Pause,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const AutomacoesJornadasPage: React.FC = () => {
  const [journeys, setJourneys] = useState<AutomationJourney[]>(mockAutomationJourneys);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTrigger, setNewTrigger] = useState<'ABANDONED_CART' | 'EVENT_TMINUS_7D' | 'EVENT_TMINUS_24H' | 'LOT_CHANGE' | 'POST_PURCHASE'>('ABANDONED_CART');
  const [newChannel, setNewChannel] = useState<'WHATSAPP' | 'EMAIL' | 'SMS' | 'MULTICHANNEL'>('WHATSAPP');
  const [newDelay, setNewDelay] = useState(15);

  const handleToggleStatus = (id: string) => {
    setJourneys((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: j.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : j
      )
    );
  };

  const handleCreateJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: AutomationJourney = {
      id: `jrn-${Date.now()}`,
      name: newName,
      triggerType: newTrigger,
      channel: newChannel,
      delayMinutes: Number(newDelay),
      status: 'ACTIVE',
      executionsCount: 0,
      conversionRate: 0,
      recoveredRevenue: 0,
    };

    setJourneys([created, ...journeys]);
    setNewName('');
    setIsCreating(false);
  };

  const totalRecovered = journeys.reduce((acc, curr) => acc + curr.recoveredRevenue, 0);
  const totalExecutions = journeys.reduce((acc, curr) => acc + curr.executionsCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Automações & Jornadas de Marketing
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Piloto Automático 24/7
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Gatilhos baseados no comportamento do cliente para disparo automático no WhatsApp, E-mail e SMS
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-lg shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Fechar Construtor' : 'Criar Novo Fluxo Automático'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Jornadas Ativas"
          value={`${journeys.filter((j) => j.status === 'ACTIVE').length} fluxos`}
          subtitle="Em execução contínua"
          icon={GitFork}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <MetricKpiCard
          title="Disparos Automatizados"
          value={formatNumber(totalExecutions)}
          subtitle="Execuções sem ação manual"
          icon={Zap}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
        />
        <MetricKpiCard
          title="Taxa Média de Conversão"
          value="24,1%"
          subtitle="Resgates automáticos"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Receita Gerada no Piloto"
          value={formatCurrency(totalRecovered)}
          subtitle="Vendas salvas pelos robôs"
          icon={DollarSign}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
      </div>

      {/* Flow Builder Card (When open) */}
      {isCreating && (
        <div className="bg-[#2c2d33] border border-amber-500/40 rounded-xl p-5 shadow-xl animate-in fade-in duration-200">
          <h3 className="font-extrabold text-white text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Configurar Nova Régua / Jornada
          </h3>

          <form onSubmit={handleCreateJourney} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nome da Régua *</label>
              <input
                type="text"
                required
                placeholder="Ex: Resgate de Carrinho 30 Minutos"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Gatilho (Trigger)</label>
              <select
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value as any)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-medium"
              >
                <option value="ABANDONED_CART">Abandono de Carrinho</option>
                <option value="LOT_CHANGE">Alerta de Virada de Lote</option>
                <option value="EVENT_TMINUS_24H">24 Horas Antes do Show</option>
                <option value="POST_PURCHASE">Pós-Compra / Upsell VIP</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Canal de Envio</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as any)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-medium"
              >
                <option value="WHATSAPP">WhatsApp (Meta Cloud API)</option>
                <option value="EMAIL">E-mail Marketing</option>
                <option value="MULTICHANNEL">Multicanal (WhatsApp + E-mail)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Tempo de Espera (min)</label>
              <input
                type="number"
                min="0"
                value={newDelay}
                onChange={(e) => setNewDelay(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-bold"
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t border-[#37393e]">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
              >
                Salvar e Ativar Jornada
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Journeys List */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Jornadas e Réguas Cadastradas</h3>
          <span className="text-xs text-slate-400">{journeys.length} cadastradas</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Nome da Automação</th>
              <th className="p-3.5 font-semibold">Gatilho</th>
              <th className="p-3.5 font-semibold">Canal</th>
              <th className="p-3.5 font-semibold">Espera</th>
              <th className="p-3.5 font-semibold">Disparos</th>
              <th className="p-3.5 font-semibold">Conversão</th>
              <th className="p-3.5 font-semibold">Receita Resgatada</th>
              <th className="p-3.5 font-semibold text-right">Ação / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {journeys.map((j) => (
              <tr key={j.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-bold text-white">{j.name}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-amber-400 border border-[#37393e]">
                    {j.triggerType}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-slate-300">{j.channel}</td>
                <td className="p-3.5 text-slate-300">{j.delayMinutes} min</td>
                <td className="p-3.5 font-mono text-slate-200">{formatNumber(j.executionsCount)}</td>
                <td className="p-3.5 font-bold text-emerald-400">{j.conversionRate}%</td>
                <td className="p-3.5 font-extrabold text-white">{formatCurrency(j.recoveredRevenue)}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleToggleStatus(j.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      j.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {j.status === 'ACTIVE' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{j.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
