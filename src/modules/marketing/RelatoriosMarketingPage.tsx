import React, { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle2, X } from 'lucide-react';
import { downloadCsv } from '@/utils/csvExport';

export const RelatoriosMarketingPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reports = [
    {
      id: 'roas',
      title: 'Relatório Completo de Mídia & ROAS Consolidado',
      desc: 'Dados consolidados Meta, Google, TikTok e Spotify.',
      format: 'CSV / XLSX',
      generate: () => {
        const headers = ['Canal de Mídia', 'Impressões', 'Cliques', 'CTR (%)', 'Investimento (R$)', 'Conversões', 'Receita Atribuída (R$)', 'ROAS'];
        const rows = [
          ['Meta Ads (Instagram & Facebook)', '240.000', '18.400', '7,66%', '7550.00', '320', '70530.00', '9.34x'],
          ['Google Ads (Search & PMax)', '115.000', '12.100', '10,52%', '4800.00', '195', '44700.00', '9.31x'],
          ['WhatsApp Marketing Cloud API', '48.500', '31.200', '64,32%', '850.00', '520', '98400.00', '115.76x'],
          ['TikTok Ads (Vídeos & Spark)', '310.000', '15.600', '5,03%', '4120.00', '210', '46800.00', '11.35x'],
          ['Spotify Ads (Áudio Streaming)', '92.000', '5.400', '5,86%', '2400.00', '140', '38900.00', '16.20x'],
        ];
        return { headers, rows, filename: 'relatorio-roas-multicanal.csv' };
      },
    },
    {
      id: 'utm',
      title: 'Demonstrativo de Atribuição por UTM e Origens',
      desc: 'Clicks, visitantes únicos, ingressos vendidos e receita por link.',
      format: 'CSV',
      generate: () => {
        const headers = ['UTM Campaign', 'UTM Source', 'UTM Medium', 'Cliques Únicos', 'Pedidos Concluídos', 'Taxa Conversão (%)', 'Receita (R$)'];
        const rows = [
          ['festival_xyz_lote1', 'instagram', 'bio_link', '14.200', '412', '2,90%', '98.880,00'],
          ['festival_xyz_stories', 'instagram', 'story_link', '9.850', '280', '2,84%', '67.200,00'],
          ['google_search_curitiba', 'google', 'cpc', '11.400', '340', '2,98%', '81.600,00'],
          ['whatsapp_virada_lote', 'whatsapp', 'direct', '8.900', '520', '5,84%', '124.800,00'],
          ['influencer_pedro', 'tiktok', 'bio_link', '6.300', '145', '2,30%', '34.800,00'],
        ];
        return { headers, rows, filename: 'atribuicao-utm-origens.csv' };
      },
    },
    {
      id: 'whatsapp_audit',
      title: 'Auditoria de Disparos WhatsApp Cloud API',
      desc: 'Taxas de entrega, leitura, descadastros e vendas convertidas.',
      format: 'PDF / XLSX',
      generate: () => {
        const headers = ['ID Disparo', 'Campanha', 'Template', 'Destinatários', 'Entregues', 'Lidos', 'Conversões', 'Receita (R$)'];
        const rows = [
          ['DISP-901', 'Virada Lote 1 - VIPs', 'aviso_virada_lote_v1', '12.450', '12.380 (99,4%)', '11.890 (95,5%)', '480', '115.200,00'],
          ['DISP-902', 'Lançamento Lineup Oficial', 'lineup_oficial_2026', '18.900', '18.750 (99,2%)', '17.200 (91,0%)', '390', '93.600,00'],
          ['DISP-903', 'Alerta 24h Encerramento', 'ultimas_horas_v2', '8.400', '8.360 (99,5%)', '7.980 (95,0%)', '310', '74.400,00'],
        ];
        return { headers, rows, filename: 'auditoria-disparos-whatsapp.csv' };
      },
    },
    {
      id: 'afiliados',
      title: 'Desempenho de Promoters e Links de Afiliados',
      desc: 'Ranking de vendas por promoter e comissões devidas.',
      format: 'XLSX',
      generate: () => {
        const headers = ['Promoter / Afiliado', 'Código Cupom', 'Ingressos Vendidos', 'Receita Total (R$)', 'Comissão Devida (R$)', 'Status Pagamento'];
        const rows = [
          ['Lucas Andrade (Curitiba Club)', 'LUCAS10', '184', '44.160,00', '4.416,00', 'Aguardando Fechamento'],
          ['Camila Borges (Festas PR)', 'CAMILA10', '142', '34.080,00', '3.408,00', 'Aguardando Fechamento'],
          ['Rodrigo Lima Eventos', 'RODRIGO5', '98', '23.520,00', '2.352,00', 'Pago'],
          ['Agência Pulse Marketing', 'PULSEVIP', '76', '18.240,00', '1.824,00', 'Pago'],
        ];
        return { headers, rows, filename: 'desempenho-promoters-afiliados.csv' };
      },
    },
  ];

  const handleDownload = (rep: typeof reports[0]) => {
    const data = rep.generate();
    downloadCsv(data.headers, data.rows, data.filename);
    setToastMessage(`Relatório "${rep.title}" gerado e baixado com sucesso!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Relatórios & Exportações de Marketing
        </h1>
        <p className="text-sm text-slate-400">
          Exportação de dados analíticos auditados e demonstrativos gerenciais de tráfego e vendas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
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
                onClick={() => handleDownload(rep)}
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
