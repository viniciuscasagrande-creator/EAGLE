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
} from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';

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

  const toggleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : r
      )
    );
  };

  const totalRecovered = rules.reduce((acc, r) => acc + r.recoveredRevenue, 0);
  const totalSent = rules.reduce((acc, r) => acc + r.sentCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
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

        <button
          onClick={() => alert('Abrir criador de nova régua de disparo automatizado.')}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-pink-600/25 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Régua</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Recuperado</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalRecovered)}
          </div>
          <span className="text-[10px] text-emerald-400">Direto pelas réguas</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Mensagens Enviadas</span>
          <div className="text-xl font-extrabold text-blue-400 mt-1">
            {totalSent.toLocaleString()}
          </div>
          <span className="text-[10px] text-blue-400">WhatsApp & E-mail</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Abertura WhatsApp</span>
          <div className="text-xl font-extrabold text-slate-100 mt-1">
            94.2%
          </div>
          <span className="text-[10px] text-slate-400">Taxa de visualização</span>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Réguas Ativas</span>
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
            className="bg-[#141b2d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
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
                  <h3 className="text-sm font-bold text-slate-100">{rule.name}</h3>
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    rule.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {rule.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}
                </button>
                <button
                  onClick={() => alert(`Configurações da régua: ${rule.name}`)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Configurar Mensagem"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total Enviado:</span>
                <div className="text-sm font-bold text-slate-200 mt-0.5">
                  {rule.sentCount.toLocaleString()} disparos
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Taxa de Abertura:</span>
                <div className="text-sm font-bold text-teal-400 mt-0.5">
                  {rule.openedRate}%
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400">Ingressos Resgatados:</span>
                <div className="text-sm font-bold text-blue-400 mt-0.5">
                  {rule.recoveredCount} ingressos
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 font-semibold">Receita Resgatada:</span>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                  {formatCurrency(rule.recoveredRevenue)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
