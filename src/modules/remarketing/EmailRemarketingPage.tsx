import React, { useEffect, useState } from 'react';
import { Mail, RefreshCw, AlertCircle, Clock, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { eagleRecoveryApi, type EmailMetrics, type EmailTemplate } from '@/services/api/eagleRecovery';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';

export const EmailRemarketingPage: React.FC = () => {
  const [data, setData] = useState<EmailMetrics | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [metrics, rows] = await Promise.all([
        eagleRecoveryApi.emailMetrics(),
        eagleRecoveryApi.emailTemplates(),
      ]);
      setData(metrics);
      setTemplates(Array.isArray(rows) ? rows : []);
    } catch (e) {
      setData(null);
      setTemplates([]);
      setError(e instanceof Error ? e.message : 'API indisponível');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            Disparos automáticos e templates confirmados pelo serviço de campanhas
          </p>
        </div>

        <button
          onClick={() => void refresh()}
          disabled={loading}
          className="flex gap-2 items-center rounded-lg px-4 py-2 bg-[#2c2d33] hover:bg-[#37393e] border border-[#37393e] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Atualizando...' : 'Atualizar Dados'}</span>
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-lg p-3 border border-red-500/40 text-red-300 text-xs bg-red-500/10 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>API indisponível: {error}. Os indicadores não foram substituídos por dados fictícios.</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricKpiCard
          title="E-mails Enviados"
          value={data ? formatNumber(data.sent) : 'Indisponível'}
          subtitle="Disparos confirmados"
          icon={Mail}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Entregues com Sucesso"
          value={data ? formatNumber(data.delivered) : 'Indisponível'}
          subtitle={data && data.sent > 0 ? `${((data.delivered / data.sent) * 100).toFixed(1)}% de entrega` : 'Taxa de entrega'}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Carrinhos Recuperados"
          value={data ? `${formatNumber(data.recovered)} un` : 'Indisponível'}
          subtitle="Vendas salvas"
          icon={TrendingUp}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Receita Recuperada"
          value={data ? formatCurrency(data.recoveredAmount) : 'Indisponível'}
          subtitle="Faturamento resgatado"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </section>

      {/* Templates Section */}
      <section className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#37393e] pb-3">
          <h2 className="flex items-center gap-2 font-bold text-white text-sm">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Templates de Recuperação de Carrinho</span>
          </h2>
          <span className="text-xs text-slate-400">{templates.length} template(s) retornado(s)</span>
        </div>

        {!templates.length ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Nenhum template de e-mail retornado pelo serviço.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {templates.map((t) => (
              <div key={t.id} className="bg-[#202124] rounded-lg p-4 border border-[#37393e] space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white text-xs">{t.name}</p>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t.status === 'ACTIVE' ? 'Ativo' : 'Pausado'}
                  </span>
                </div>
                <p className="text-slate-300 text-xs italic">"{t.subject}"</p>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-[#37393e] flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Gatilho de disparo: {t.delayMinutes} minutos após o checkout abandonado</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default EmailRemarketingPage;
