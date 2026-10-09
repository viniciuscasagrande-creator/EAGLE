import React from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { downloadCsv } from '@/utils/csvExport';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export const RelatoriosConsolidadosPage: React.FC = () => {
  const handleGenerateReport = async (title: string) => {
    if (title.includes('Vendas')) {
      const events = await keeperAdapter.getEvents();
      const rows = events.map((e) => [
        e.code,
        e.name,
        e.venue,
        e.city,
        e.dateStart,
        e.ticketsSold,
        e.totalCapacity,
        e.grossSales,
        `${e.occupationRate}%`,
        e.status,
      ]);
      downloadCsv(
        'relatorio-consolidado-vendas',
        ['Código', 'Evento', 'Local', 'Cidade', 'Data', 'Ingressos Vendidos', 'Capacidade', 'Faturamento Bruto (R$)', 'Taxa de Ocupação', 'Status'],
        rows
      );
    } else if (title.includes('DRE') || title.includes('Financeiro')) {
      const wallets = await keeperAdapter.getEventWallets();
      const rows = wallets.map((w) => [
        w.eventName,
        w.venue,
        w.grossTicketSales,
        w.diskFeeTotal,
        w.spreadFeeTotal,
        w.advanceFeeTotal,
        w.repaymentsPaidTotal,
        w.balanceAvailable,
        w.blockedBalance,
        w.status,
      ]);
      downloadCsv(
        'demonstrativo-financeiro-dre',
        ['Evento', 'Local', 'Venda Bruta (R$)', 'Taxa Disk (R$)', 'Spread Gateway (R$)', 'Custo Antecipação (R$)', 'Repasses Pagos (R$)', 'Saldo Disponível (R$)', 'Saldo Bloqueado (R$)', 'Status'],
        rows
      );
    } else if (title.includes('Ledger')) {
      const entries = await keeperAdapter.getLedgerEntries();
      const rows = entries.map((l) => [
        l.id,
        l.entryType,
        l.direction,
        l.amount,
        l.balanceAfter,
        l.description,
        formatDateTime(l.createdAt),
      ]);
      downloadCsv(
        'extrato-oficial-ledger',
        ['ID Lançamento', 'Tipo de Partida', 'Direção', 'Valor (R$)', 'Saldo Após (R$)', 'Histórico Descritivo', 'Data/Hora'],
        rows
      );
    } else if (title.includes('Marketing')) {
      const campaigns = await keeperAdapter.getMarketingCampaigns();
      const rows = campaigns.map((c) => [
        c.name,
        c.eventName,
        c.channel,
        c.budgetSpent,
        c.impressions,
        c.clicks,
        `${c.ctr}%`,
        c.conversions,
        c.attributedRevenue,
        `${c.roas}x`,
        c.status,
      ]);
      downloadCsv(
        'relatorio-marketing-roas',
        ['Campanha', 'Evento', 'Canal', 'Investimento (R$)', 'Impressões', 'Cliques', 'CTR', 'Conversões', 'Receita Atribuída (R$)', 'ROAS', 'Status'],
        rows
      );
    } else if (title.includes('Cortesias')) {
      const courtesies = keeperAdapter.getCourtesies();
      const rows = courtesies.map((c: any) => [
        c.id,
        c.guestName,
        c.email,
        c.sector,
        c.qty,
        c.authBy,
        c.issuedAt,
      ]);
      downloadCsv(
        'relatorio-cortesias-vip',
        ['ID Cortesia', 'Beneficiário / Convidado', 'E-mail', 'Setor', 'Qtd Ingressos', 'Autorizado por', 'Data Emissão'],
        rows
      );
    }
  };

  const reportsList = [
    { title: 'Relatório Consolidado de Vendas & Ingressos', desc: 'Analítico por evento, lote, setor, canal e forma de pagamento.', format: 'CSV' },
    { title: 'Demonstrativo Financeiro do Produtor (DRE do Evento)', desc: 'Vendas brutas, comissões Disk, despesas retidas e valor líquido.', format: 'CSV' },
    { title: 'Extrato Oficial do Livro Financeiro (Ledger)', desc: 'Lançamentos contábeis de partidas dobradas e histórico de repasses.', format: 'CSV' },
    { title: 'Relatório de Atribuição de Marketing & ROAS', desc: 'Investimento em anúncios vs faturamento comprovado por campanha.', format: 'CSV' },
    { title: 'Relatório de Cortesias & Acessos VIP', desc: 'Listagem de convidados, autorizações e ocupação de cotas.', format: 'CSV' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Central de Relatórios & Exportações
          </h1>
          <p className="text-sm text-slate-400">
            Exportação de dados auditados e demonstrativos gerenciais oficiais da DiskIngressos em formato aberto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((rep, idx) => (
          <div
            key={idx}
            className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-5 hover:border-[#4a4c55] transition flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {rep.format}
                </span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-sm">{rep.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{rep.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#37393e] flex items-center justify-end">
              <button
                onClick={() => handleGenerateReport(rep.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Arquivo</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
