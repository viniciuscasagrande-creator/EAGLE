import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Repeat,
  ShoppingCart,
  MessageSquare,
  Mail,
  GitFork,
  CreditCard,
  UserX,
  FileSpreadsheet,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const HubRemarketingPage: React.FC = () => {
  const navigate = useNavigate();

  const recoveryHubCards = [
    {
      title: 'Dashboard de Recuperação',
      desc: 'Visão consolidada de taxas de abandono, carrinhos convertidos e receita resgatada.',
      route: '/remarketing/dashboard',
      icon: Repeat,
      iconColor: 'text-pink-400',
      badge: 'Painel Geral',
    },
    {
      title: 'Carrinhos Abandonados',
      desc: 'Fila analítica de checkouts interrompidos com filtros por evento e setor de ingresso.',
      route: '/remarketing/carrinhos',
      icon: ShoppingCart,
      iconColor: 'text-amber-400',
      badge: 'Operacional',
    },
    {
      title: 'WhatsApp Remarketing',
      desc: 'Disparo direto de mensagens personalizadas, geração de Chave PIX e confirmação de venda.',
      route: '/remarketing/whatsapp',
      icon: MessageSquare,
      iconColor: 'text-emerald-400',
      badge: 'Alta Conversão 🔥',
    },
    {
      title: 'E-mail Remarketing',
      desc: 'Sequências automáticas de e-mail com contagem regressiva e reserva de lote.',
      route: '/remarketing/email',
      icon: Mail,
      iconColor: 'text-blue-400',
      badge: 'Automação',
    },
    {
      title: 'Fluxos & Réguas de Recuperação',
      desc: 'Configuração de intervalos de disparo (15 minutos, 2 horas e 24 horas antes do lote).',
      route: '/remarketing/fluxos',
      icon: GitFork,
      iconColor: 'text-purple-400',
      badge: 'Jornadas',
    },
    {
      title: 'Recuperação de Pagamento',
      desc: 'Tratamento de PIX expirado, recusas de cartão no antifraude e boletos em aberto.',
      route: '/remarketing/recuperacao-pagamento',
      icon: CreditCard,
      iconColor: 'text-cyan-400',
      badge: 'Financeiro',
    },
    {
      title: 'Clientes Inativos & Churn',
      desc: 'Reativação de público que não compra ingressos há mais de 180 dias.',
      route: '/remarketing/clientes-inativos',
      icon: UserX,
      iconColor: 'text-rose-400',
      badge: 'Retenção',
    },
    {
      title: 'Relatórios de Resgate',
      desc: 'Exportação detalhada de vendas recuperadas com auditoria e conciliação bancária.',
      route: '/remarketing/relatorios',
      icon: FileSpreadsheet,
      iconColor: 'text-indigo-400',
      badge: 'Exportações',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Hub de Remarketing & Recuperação de Vendas
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Central de Resgate
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Módulos integrados para converter carrinhos abandonados, reativar clientes e recuperar pagamentos recusados
          </p>
        </div>
      </div>

      {/* Global Recovery KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Potencial em Carrinhos"
          value={formatCurrency(184200)}
          subtitle="Checkouts pendentes de resgate"
          icon={ShoppingCart}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <MetricKpiCard
          title="Receita Já Recuperada"
          value={formatCurrency(68450)}
          subtitle="Resgates convertidos em vendas"
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Taxa de Eficiência de Resgate"
          value="37,1%"
          subtitle="Média histórica do produtor"
          icon={TrendingUp}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Tempo Médio de Resgate"
          value="24 minutos"
          subtitle="Tempo ágil via WhatsApp"
          icon={Clock}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* 8 Access Cards Grid (Video 02:16-02:20) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recoveryHubCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              className="bg-[#2c2d33] border border-[#37393e] hover:border-pink-500/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg bg-[#202124] ${card.iconColor} border border-[#37393e]`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#202124] text-slate-300 border border-[#37393e]">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base group-hover:text-pink-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#37393e] flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-pink-400 transition">
                <span>Acessar Módulo</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
