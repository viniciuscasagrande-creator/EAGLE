import React, { useState } from 'react';
import { mockEmailTemplates } from '@/services/api/mockSeedData';
import { EmailTemplate } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Mail,
  Send,
  Eye,
  MousePointer,
  DollarSign,
  UserX,
  Plus,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const EmailMarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'TEMPLATES' | 'LGPD'>('CAMPAIGNS');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              E-mail Marketing & Automações CRM
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Mail className="w-3.5 h-3.5" />
              Servidor SMTP Dedicado DiskIngressos
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Campanhas de newsletter, contagem regressiva de virada de lote e recuperação de vendas via e-mail transacional
          </p>
        </div>

        <button
          onClick={() => alert('Abrindo modal de novo envio de e-mail marketing...')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Disparo de E-mail</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="E-mails Disparados"
          value="64.200 envios"
          subtitle="Taxa de entregabilidade 99,2%"
          icon={Send}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Taxa Média de Abertura"
          value="34,8%"
          subtitle="22.340 leituras únicas"
          icon={Eye}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Taxa de Cliques (CTR)"
          value="8,42%"
          subtitle="5.405 cliques nos links"
          icon={MousePointer}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
        <MetricKpiCard
          title="Receita Gerada por E-mail"
          value={formatCurrency(142600)}
          subtitle="540 ingressos convertidos"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#37393e] pb-1 text-xs">
        {[
          { id: 'CAMPAIGNS', label: 'Campanhas Disparadas' },
          { id: 'TEMPLATES', label: 'Modelos & Pré-visualização' },
          { id: 'LGPD', label: 'Conformidade LGPD & Descadastros' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-bold rounded-t-lg transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2c2d33] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-white hover:bg-[#25262c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'CAMPAIGNS' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
                <th className="p-3.5 font-semibold">Assunto do E-mail</th>
                <th className="p-3.5 font-semibold">Evento</th>
                <th className="p-3.5 font-semibold">Enviados</th>
                <th className="p-3.5 font-semibold">Taxa Abertura</th>
                <th className="p-3.5 font-semibold">Taxa Clique</th>
                <th className="p-3.5 font-semibold">Ingressos Vendidos</th>
                <th className="p-3.5 font-semibold">Receita Atribuída</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {[
                {
                  subject: '⚠️ Últimas 48 horas de Lote 1 para o Festival XYZ',
                  event: 'Festival XYZ 2026',
                  sent: 32000,
                  openRate: '38,2%',
                  clickRate: '9,8%',
                  tickets: 280,
                  revenue: 72800,
                  status: 'Concluído',
                },
                {
                  subject: '💥 Saiu o Lineup Oficial do Festival XYZ! Ingressos Abertos',
                  event: 'Festival XYZ 2026',
                  sent: 24500,
                  openRate: '33,5%',
                  clickRate: '7,6%',
                  tickets: 195,
                  revenue: 50700,
                  status: 'Concluído',
                },
                {
                  subject: 'Seus ingressos para o Show Nacional continuam reservados!',
                  event: 'Show Nacional ABC',
                  sent: 7700,
                  openRate: '31,0%',
                  clickRate: '6,4%',
                  tickets: 65,
                  revenue: 19100,
                  status: 'Concluído',
                },
              ].map((c, i) => (
                <tr key={i} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5 font-bold text-white">{c.subject}</td>
                  <td className="p-3.5 text-slate-300">{c.event}</td>
                  <td className="p-3.5 font-mono text-slate-200">{formatNumber(c.sent)}</td>
                  <td className="p-3.5 font-bold text-emerald-400">{c.openRate}</td>
                  <td className="p-3.5 font-bold text-blue-400">{c.clickRate}</td>
                  <td className="p-3.5 font-bold text-white">{c.tickets}</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(c.revenue)}</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockEmailTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {tpl.category}
                </span>
                <h3 className="font-extrabold text-white text-base mt-2">{tpl.name}</h3>
                <div className="mt-3 p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-1.5 text-xs">
                  <div className="text-slate-400 font-semibold">Assunto:</div>
                  <div className="font-bold text-white text-[11px]">{tpl.subject}</div>
                  <div className="text-slate-400 font-semibold pt-1 border-t border-[#37393e]">Prévia:</div>
                  <div className="text-slate-300 text-[11px]">{tpl.previewText}</div>
                </div>
              </div>

              <button
                onClick={() => alert(`Pré-visualizando e-mail template: ${tpl.name}`)}
                className="mt-4 w-full py-2 bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-200 text-xs font-bold rounded-lg transition"
              >
                Visualizar Prévia HTML
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'LGPD' && (
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4 max-w-xl">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Gestão de Descadastros & Reputação de Domínio</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Nossos disparos contam com suporte a SPF, DKIM e DMARC com alinhamento de 100%. Todo e-mail contém rodapé com link direto de opt-out (um clique para descadastrar), mantendo a taxa de spam abaixo de 0,02%.
          </p>
          <div className="flex items-center justify-between p-3 bg-[#202124] rounded-lg border border-[#37393e]">
            <span className="text-slate-400">Taxa de Descadastro (Unsubscribe):</span>
            <span className="font-bold text-emerald-400">0,14% (Excelente)</span>
          </div>
        </div>
      )}
    </div>
  );
};
