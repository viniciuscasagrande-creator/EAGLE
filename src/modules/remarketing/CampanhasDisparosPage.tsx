import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  MessageCircle,
  Mail,
  Smartphone,
  CheckCircle,
  Clock,
  Sparkles,
  Settings2,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  X,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

interface TriggerRule {
  id: string;
  name: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  delayMinutes: number;
  discountOffer: string;
  status: 'ACTIVE' | 'PAUSED';
  sentCount: number;
  openedRate: number;
  recoveredCount: number;
  recoveredRevenue: number;
}

const initialRules: TriggerRule[] = [
  {
    id: 'rule-01',
    name: 'Disparo 1: Alerta Rápido com Link PIX',
    channel: 'WHATSAPP',
    delayMinutes: 15,
    discountOffer: 'Reserva garantida por 30 minutos',
    status: 'ACTIVE',
    sentCount: 1240,
    openedRate: 94.2,
    recoveredCount: 380,
    recoveredRevenue: 95000.0,
  },
  {
    id: 'rule-02',
    name: 'Disparo 2: Cupom Exclusivo 5% OFF',
    channel: 'EMAIL',
    delayMinutes: 120, // 2 horas
    discountOffer: 'Cupom VOLTA5 (Válido por 12h)',
    status: 'ACTIVE',
    sentCount: 860,
    openedRate: 52.8,
    recoveredCount: 145,
    recoveredRevenue: 36250.0,
  },
  {
    id: 'rule-03',
    name: 'Disparo 3: Última Chamada Lote Virando',
    channel: 'WHATSAPP',
    delayMinutes: 1440, // 24 horas
    discountOffer: 'Últimos ingressos do lote atual',
    status: 'ACTIVE',
    sentCount: 520,
    openedRate: 88.5,
    recoveredCount: 78,
    recoveredRevenue: 19500.0,
  },
];

export const CampanhasDisparosPage: React.FC = () => {
  const [rules, setRules] = useState<TriggerRule[]>(initialRules);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewRuleOpen, setIsNewRuleOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TriggerRule | null>(null);

  // Form State
  const [newRuleName, setNewRuleName] = useState('Disparo 4: Última Chamada VIP');
  const [newRuleChannel, setNewRuleChannel] = useState<'WHATSAPP' | 'EMAIL' | 'SMS'>('WHATSAPP');
  const [newRuleDelay, setNewRuleDelay] = useState(60);
  const [newRuleOffer, setNewRuleOffer] = useState('Cupom 10% OFF Exclusivo');
  const [submitting, setSubmitting] = useState(false);

  const toggleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          setToastMessage(`Régua "${r.name}" agora está ${next === 'ACTIVE' ? 'ativa' : 'pausada'}.`);
          setTimeout(() => setToastMessage(null), 4000);
          return { ...r, status: next };
        }
        return r;
      })
    );
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const newRule: TriggerRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      channel: newRuleChannel,
      delayMinutes: Number(newRuleDelay),
      discountOffer: newRuleOffer,
      status: 'ACTIVE',
      sentCount: 0,
      openedRate: 0,
      recoveredCount: 0,
      recoveredRevenue: 0,
    };

    setRules((prev) => [newRule, ...prev]);
    setIsNewRuleOpen(false);
    setSubmitting(false);
    setToastMessage(`Nova régua de automação "${newRuleName}" ativada com sucesso!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    setRules((prev) =>
      prev.map((r) => (r.id === editingRule.id ? editingRule : r))
    );
    setEditingRule(null);
    setToastMessage(`Configurações da régua "${editingRule.name}" salvas com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportCsv = () => {
    const headers = ['Régua', 'Canal', 'Tempo de Gatilho (min)', 'Oferta', 'Disparos Enviados', 'Taxa Abertura (%)', 'Ingressos Resgatados', 'Receita Recuperada (R$)', 'Status'];
    const rows = rules.map((r) => [
      r.name,
      r.channel,
      r.delayMinutes,
      r.discountOffer,
      r.sentCount,
      `${r.openedRate}%`,
      r.recoveredCount,
      r.recoveredRevenue.toFixed(2),
      r.status === 'ACTIVE' ? 'Ativa' : 'Pausada',
    ]);
    downloadCsv(headers, rows, `reguas-automacao-remarketing-${new Date().toISOString().slice(0, 10)}.csv`);
    setToastMessage('Relatório de réguas de remarketing exportado com sucesso (CSV)!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalRecovered = rules.reduce((acc, r) => acc + r.recoveredRevenue, 0);
  const totalSent = rules.reduce((acc, r) => acc + r.sentCount, 0);

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-pink-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Réguas de Automação & Disparos
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              WhatsApp Oficial & E-mail Transacional
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Configure réguas de reengajamento automatizado para resgatar compradores indecisos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsNewRuleOpen(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Régua</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Total Recuperado</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalRecovered)}
          </div>
          <span className="text-[10px] text-emerald-400">Direto pelas réguas</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Mensagens Enviadas</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {totalSent.toLocaleString()}
          </div>
          <span className="text-[10px] text-blue-400">WhatsApp & E-mail</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Abertura WhatsApp</span>
          <div className="text-xl font-extrabold text-white mt-1">
            94.2%
          </div>
          <span className="text-[10px] text-slate-400">Taxa de visualização</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Réguas Ativas</span>
          <div className="text-xl font-extrabold text-teal-400 mt-1">
            {rules.filter((r) => r.status === 'ACTIVE').length} de {rules.length}
          </div>
          <span className="text-[10px] text-teal-400">Automatizadas 24/7</span>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#37393e]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    rule.channel === 'WHATSAPP'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {rule.channel === 'WHATSAPP' ? (
                    <MessageCircle className="w-5 h-5" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{rule.name}</h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Gatilho: {rule.delayMinutes < 60 ? `${rule.delayMinutes} minutos após abandono` : `${rule.delayMinutes / 60} horas após abandono`}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">{rule.discountOffer}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleStatus(rule.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    rule.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-[#202124] text-slate-400 hover:text-white border border-[#37393e]'
                  }`}
                >
                  {rule.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}
                </button>
                <button
                  onClick={() => setEditingRule(rule)}
                  className="p-1.5 rounded-lg bg-[#202124] hover:bg-[#25262c] text-slate-300 hover:text-white border border-[#37393e] transition cursor-pointer"
                  title="Configurar Mensagem"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                <span className="text-slate-400">Total Enviado:</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {rule.sentCount.toLocaleString()} disparos
                </div>
              </div>

              <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                <span className="text-slate-400">Taxa de Abertura:</span>
                <div className="text-sm font-bold text-teal-400 mt-0.5">
                  {rule.openedRate}%
                </div>
              </div>

              <div className="p-3 bg-[#232429] rounded-lg border border-[#37393e]">
                <span className="text-slate-400">Ingressos Resgatados:</span>
                <div className="text-sm font-bold text-blue-400 mt-0.5">
                  {rule.recoveredCount} ingressos
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-semibold">Receita Resgatada:</span>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                  {formatCurrency(rule.recoveredRevenue)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Régua */}
      {isNewRuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criar Nova Régua de Disparo</h3>
                  <p className="text-[11px] text-slate-400">Automação de carrinho abandonado</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewRuleOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Régua *</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="Ex: Disparo Rápido 15 Minutos"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Canal *</label>
                  <select
                    value={newRuleChannel}
                    onChange={(e) => setNewRuleChannel(e.target.value as any)}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="WHATSAPP">WhatsApp Cloud API</option>
                    <option value="EMAIL">E-mail CRM</option>
                    <option value="SMS">SMS Transacional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tempo de Gatilho (min) *</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={newRuleDelay}
                    onChange={(e) => setNewRuleDelay(Number(e.target.value))}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Oferta / Mensagem Promocional *</label>
                <input
                  type="text"
                  required
                  value={newRuleOffer}
                  onChange={(e) => setNewRuleOffer(e.target.value)}
                  placeholder="Ex: Cupom 5% OFF ou Reserva por 30min"
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setIsNewRuleOpen(false)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Salvando...' : 'Ativar Régua'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Régua */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Configurar Régua</h3>
                  <p className="text-[11px] text-slate-400">{editingRule.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingRule(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Régua</label>
                <input
                  type="text"
                  required
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Canal</label>
                  <select
                    value={editingRule.channel}
                    onChange={(e) => setEditingRule({ ...editingRule, channel: e.target.value as any })}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gatilho (minutos)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingRule.delayMinutes}
                    onChange={(e) => setEditingRule({ ...editingRule, delayMinutes: Number(e.target.value) })}
                    className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Oferta / Benefício</label>
                <input
                  type="text"
                  required
                  value={editingRule.discountOffer}
                  onChange={(e) => setEditingRule({ ...editingRule, discountOffer: e.target.value })}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
