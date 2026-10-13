import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  DollarSign,
  Building2,
  Ticket,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export const DashboardAdminMasterPage: React.FC = () => {
  const { platformKpis, availableProducers, creditRequests, switchProfile, switchProducer } = useAuth();
  const navigate = useNavigate();

  const pendingAdvances = creditRequests.filter((r) => r.status === 'PENDING_APPROVAL');

  // Chart data: GMV by Producer
  const producerGmvData = availableProducers.map((p) => ({
    name: p.tradeName || p.name.split(' ')[0],
    faturamento: (p.totalGrossSales || 2000000) / 1000,
    eventos: p.totalEventsCount || 10,
    taxa: p.commissionRate || 8.5,
  }));

  // Chart data: Monthly Network GMV (R$ em Milhares)
  const networkTrendData = [
    { mes: 'Mai', realizado: 4800, meta: 4500 },
    { mes: 'Jun', realizado: 5600, meta: 5000 },
    { mes: 'Jul', realizado: 7100, meta: 6200 },
    { mes: 'Ago', realizado: 8400, meta: 7500 },
    { mes: 'Set', realizado: 9200, meta: 8800 },
    { mes: 'Out (Atual)', realizado: 10400, meta: 9500 },
  ];

  const handleImpersonate = (producerId: string) => {
    switchProducer(producerId);
    switchProfile('PRODUCER');
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Environment Alert */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xl shadow-lg shadow-purple-500/10">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Painel Master DiskIngressos
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                ADMIN PLATAFORMA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervisão global multi-produtores, comitê de crédito e liquidação integrada ao Keeper Core.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              switchProfile('PRODUCER');
              navigate('/dashboard');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Ver Portal do Produtor</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Primary Global KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">GMV Global da Rede</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            R$ {(platformKpis.totalGmv / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            +18.4% vs mês anterior
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Take Rate DiskIngressos</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300 mt-2">
            R$ {(platformKpis.platformTakeRateRevenue / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Receita líquida com média de <strong>8.5%</strong>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Produtoras Ativas</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {platformKpis.activeProducersCount}
          </div>
          <div className="text-[11px] text-blue-400 mt-1 font-semibold">
            {platformKpis.activeEventsCount} eventos em venda ativa
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ingressos Emitidos (30d)</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-2">
            {platformKpis.ticketsSold30d.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Ticket médio: <strong>R$ {platformKpis.averageTicketValue.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Urgent Operational Alerts Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pending Advance Committee Alert */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">
                {pendingAdvances.length} Antecipações Aguardando Comitê de Crédito
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Total solicitado: R$ {pendingAdvances.reduce((acc, c) => acc + c.requestedAmount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/antecipacoes')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Analisar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Payment Channels Strip */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-emerald-400">PIX Instantâneo: 68%</span>
              <span className="text-blue-400">Cartão de Crédito: 32%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[68%]" />
              <div className="h-full bg-blue-500 w-[32%]" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500">Liquidação</span>
            <div className="text-xs font-mono font-bold text-emerald-400">D+0 PIX / D+30 CC</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Network Trend */}
        <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Evolução do GMV da Plataforma</h3>
              <p className="text-xs text-slate-400">Faturamento mensal consolidado (R$ Milhares)</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              AUDITADO KEEPER
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252b3b" />
                <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(value: any) => [`R$ ${value}k`, '']}
                />
                <Area type="monotone" dataKey="realizado" name="GMV Realizado" stroke="#a855f7" strokeWidth={2.5} fill="url(#gmvGradient)" />
                <Area type="monotone" dataKey="meta" name="Meta de Vendas" stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Producer Distribution */}
        <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Top Produtoras por Volume</h3>
              <p className="text-xs text-slate-400">Faturamento acumulado em R$ Milhares</p>
            </div>
            <button
              onClick={() => navigate('/admin/produtoras')}
              className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center gap-1 font-semibold"
            >
              Ver todas ({availableProducers.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={producerGmvData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252b3b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(value: any) => [`R$ ${value}k`, 'Faturamento']}
                />
                <Bar dataKey="faturamento" name="Faturamento" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-Producer Fast Impersonate Table */}
      <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Produtoras Cadastradas na Plataforma</h3>
            <p className="text-xs text-slate-400">
              Acesso rápido para auditoria e navegação como o produtor selecionado.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/produtoras')}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
          >
            Gerenciar Produtoras
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Produtora / Razão Social</th>
                <th className="py-3 px-4 font-semibold">CNPJ</th>
                <th className="py-3 px-4 font-semibold">Take Rate</th>
                <th className="py-3 px-4 font-semibold">Status KYC</th>
                <th className="py-3 px-4 font-semibold">Saldo Disponível</th>
                <th className="py-3 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {availableProducers.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{prod.tradeName || prod.name}</div>
                    <div className="text-[11px] text-slate-400">{prod.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{prod.cnpj}</td>
                  <td className="py-3 px-4 font-bold text-purple-400">
                    {prod.commissionRate || 8.5}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      VERIFICADO
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    R$ {(prod.kpis.disponivel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleImpersonate(prod.id)}
                      className="px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition inline-flex items-center gap-1.5"
                    >
                      <span>Acessar como Produtora</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
