import React from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, Calendar, Filter } from 'lucide-react';

export const RelatoriosConsolidadosPage: React.FC = () => {
  const reportsList = [
    { title: 'Relatório Consolidado de Vendas & Ingressos', desc: 'Analítico por evento, lote, setor, canal e forma de pagamento.', format: 'XLSX / CSV' },
    { title: 'Demonstrativo Financeiro do Produtor (DRE do Evento)', desc: 'Vendas brutas, comissões Disk, despesas retidas e valor líquido.', format: 'PDF / XLSX' },
    { title: 'Extrato Oficial do Livro Financeiro (Ledger)', desc: 'Lançamentos contábeis de partidas dobradas e histórico de repasses.', format: 'OFX / CSV' },
    { title: 'Relatório de Atribuição de Marketing & ROAS', desc: 'Investimento em anúncios vs faturamento comprovado por campanha.', format: 'CSV' },
    { title: 'Relatório de Cortesias & Acessos VIP', desc: 'Listagem de convidados, autorizações e ocupação de cotas.', format: 'PDF' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Central de Relatórios & Exportações
          </h1>
          <p className="text-sm text-slate-400">
            Exportação de dados auditados e demonstrativos gerenciais oficiais da DiskIngressos
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
                onClick={() => alert(`Gerando ${rep.title}... Download iniciado.`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Gerar Arquivo</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
