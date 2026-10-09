import React from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, Filter } from 'lucide-react';

export const RelatoriosMarketingPage: React.FC = () => {
  const reports = [
    { title: 'Relatório Completo de Mídia & ROAS Consolidado', desc: 'Dados consolidados Meta, Google, TikTok e Spotify.', format: 'CSV / XLSX' },
    { title: 'Demonstrativo de Atribuição por UTM e Origens', desc: 'Clicks, visitantes únicos, ingressos vendidos e receita por link.', format: 'CSV' },
    { title: 'Auditoria de Disparos WhatsApp Cloud API', desc: 'Taxas de entrega, leitura, descadastros e vendas convertidas.', format: 'PDF / XLSX' },
    { title: 'Desempenho de Promoters e Links de Afiliados', desc: 'Ranking de vendas por promoter e comissões devidas.', format: 'XLSX' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Relatórios & Exportações de Marketing
        </h1>
        <p className="text-sm text-slate-400">
          Exportação de dados analíticos auditados e demonstrativos gerenciais de tráfego e vendas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 hover:border-[#4a4c55] transition flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {rep.format}
                </span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{rep.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{rep.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#37393e] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Exportação instantânea</span>
              <button
                onClick={() => alert(`Iniciando download do relatório: ${rep.title}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202124] hover:bg-[#37393e] text-slate-200 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
