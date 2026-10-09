import React, { useState } from 'react';
import { Download, FileSpreadsheet, Repeat, CheckCircle2, X } from 'lucide-react';
import { downloadCsv } from '@/utils/csvExport';

export const RelatoriosRemarketingPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reports = [
    {
      id: 'carrinhos',
      title: 'Relatório Analítico de Carrinhos Recuperados',
      desc: 'Detalhamento de checkouts recuperados, ticket médio e canal de disparo.',
      format: 'CSV / XLSX',
      generate: () => {
        const headers = ['ID Pedido', 'Cliente', 'Telefone', 'Evento', 'Setor', 'Valor Carrinho (R$)', 'Canal Resgate', 'Tempo Recuperação', 'Status'];
        const rows = [
          ['PED-9821', 'Camila Silveira', '(41) 98765-4321', 'Festival XYZ 2026', 'Pista Premium', '520,00', 'WhatsApp Oficial', '14 min', 'Recuperado'],
          ['PED-9818', 'Rodrigo Fagundes', '(41) 99123-9988', 'Festival XYZ 2026', 'Camarote Open Bar', '1.040,00', 'WhatsApp Oficial', '28 min', 'Recuperado'],
          ['PED-9804', 'Fernanda Lima', '(41) 99888-1234', 'Show Nacional ABC', 'VIP Área', '460,00', 'E-mail CRM', '1h 12min', 'Recuperado'],
          ['PED-9799', 'Lucas Alcantara', '(41) 98455-7766', 'Festival XYZ 2026', 'Pista Meia', '260,00', 'WhatsApp Oficial', '9 min', 'Recuperado'],
        ];
        return { headers, rows, filename: 'carrinhos-recuperados-analitico.csv' };
      },
    },
    {
      id: 'whatsapp_remkt',
      title: 'Auditoria de Disparos WhatsApp Remarketing',
      desc: 'Logs de mensagens, tempos de resposta e confirmação de PIX.',
      format: 'CSV',
      generate: () => {
        const headers = ['ID Disparo', 'Destinatário', 'Telefone', 'Template Utilizado', 'Data/Hora Envio', 'Status Entrega', 'Chave PIX Gerada', 'Tempo Até Pagamento'];
        const rows = [
          ['WH-DISP-401', 'Camila Silveira', '(41) 98765-4321', 'resgate_carrinho_pix_v2', '2026-10-09 11:34:10', 'Entregue e Lido', 'Sim (Copia e Cola)', '8 min'],
          ['WH-DISP-402', 'Rodrigo Fagundes', '(41) 99123-9988', 'resgate_carrinho_pix_v2', '2026-10-09 10:15:22', 'Entregue e Lido', 'Sim (Copia e Cola)', '19 min'],
          ['WH-DISP-403', 'Tatiane Cristina Prado', '(41) 99122-8877', 'falha_cartao_troca_pix', '2026-10-09 09:40:05', 'Entregue', 'Sim (Copia e Cola)', 'Pendente'],
        ];
        return { headers, rows, filename: 'auditoria-disparos-remarketing-whatsapp.csv' };
      },
    },
    {
      id: 'eficiencia_reguas',
      title: 'Demonstrativo de Eficiência por Régua de Disparo',
      desc: 'Comparativo de conversão das réguas de 15min, 2h e 24h.',
      format: 'PDF / XLSX',
      generate: () => {
        const headers = ['Gatilho / Régua', 'Janela de Tempo', 'Carrinhos Impactados', 'Resgates Concluídos', 'Taxa Conversão (%)', 'Receita Salva (R$)'];
        const rows = [
          ['Régua Imediata (Alerta PIX)', '15 minutos após abandono', '420', '189', '45,0%', '82.450,00'],
          ['Régua Média (Aviso de Lote)', '2 horas após abandono', '230', '68', '29,5%', '31.200,00'],
          ['Régua Final (Última Chamada)', '24 horas com cupom 5%', '140', '26', '18,5%', '11.800,00'],
        ];
        return { headers, rows, filename: 'eficiencia-reguas-remarketing.csv' };
      },
    },
    {
      id: 'transacoes_keeper',
      title: 'Relatório de Transações e Pagamentos Conciliados',
      desc: 'Validação de identificadores bancários junto ao Ledger Keeper.',
      format: 'XLSX',
      generate: () => {
        const headers = ['ID Transação', 'ID Keeper Ledger', 'Cliente', 'Forma Pagamento', 'Valor Bruto (R$)', 'Taxa Gateway (R$)', 'Valor Líquido Produtor (R$)', 'Data Liquidação'];
        const rows = [
          ['TX-10091', 'LEDGER-KEEPER-8812', 'Camila Silveira', 'PIX Instantâneo', '520,00', '10,40', '509,60', '2026-10-09'],
          ['TX-10092', 'LEDGER-KEEPER-8813', 'Rodrigo Fagundes', 'PIX Instantâneo', '1.040,00', '20,80', '1.019,20', '2026-10-09'],
          ['TX-10093', 'LEDGER-KEEPER-8814', 'Lucas Alcantara', 'PIX Instantâneo', '260,00', '5,20', '254,80', '2026-10-09'],
        ];
        return { headers, rows, filename: 'transacoes-conciliadas-keeper.csv' };
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
        <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-pink-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Relatórios & Auditoria de Remarketing
        </h1>
        <p className="text-sm text-slate-400">
          Exportação de relatórios auditados de carrinhos recuperados e reconciliação contábil com o Keeper ERP
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
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20">
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
                <Download className="w-3.5 h-3.5 text-pink-400" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
