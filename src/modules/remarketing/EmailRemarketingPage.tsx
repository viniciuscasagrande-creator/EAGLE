import React from 'react';
import { Mail, Clock, CheckCircle2, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { formatCurrency } from '@/utils/formatters';

export const EmailRemarketingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              E-mail Remarketing — Recuperação Transacional
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Automação de Checkout
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Disparos automáticos com resumo do pedido, contagem regressiva de reserva e botão 1-clique para PIX
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="E-mails de Abandono Enviados"
          value="4.120 disparos"
          subtitle="Últimos 30 dias"
          icon={Mail}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Taxa de Abertura"
          value="52,4%"
          subtitle="Alta intenção de compra"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Carrinhos Recuperados"
          value="680 vendas"
          subtitle="16,5% de conversão"
          icon={CheckCircle2}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Receita Salva por E-mail"
          value={formatCurrency(176800)}
          subtitle="Vendas concluídas"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4">
        <h3 className="font-bold text-white text-base">Templates Ativos de Recuperação de Carrinho</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#202124] p-4 rounded-xl border border-[#37393e] space-y-2">
            <span className="text-slate-400 font-semibold text-[11px]">Disparo 1 (2 Horas após o abandono)</span>
            <div className="font-bold text-white text-sm">"Seus ingressos para o Festival XYZ continuam reservados"</div>
            <p className="text-slate-400 text-xs">Apresenta os setores selecionados, valor total e opção de gerar PIX com 1 clique.</p>
          </div>
          <div className="bg-[#202124] p-4 rounded-xl border border-[#37393e] space-y-2">
            <span className="text-slate-400 font-semibold text-[11px]">Disparo 2 (24 Horas após o abandono)</span>
            <div className="font-bold text-white text-sm">"Última chamada: liberação da reserva do seu ingresso"</div>
            <p className="text-slate-400 text-xs">Gatilho de urgência com contador regressivo antes do retorno do ingresso ao lote público.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
