import React from 'react';
import { HeadphonesIcon, MessageSquare, Plus, CheckCircle, Clock } from 'lucide-react';

export const SuporteChamadosPage: React.FC = () => {
  const tickets = [
    { id: 'CH-902', subject: 'Liberação de lote extra Pista Premium Festival XYZ', status: 'EM_ATENDIMENTO', created: '08/10/2026', lastUpdate: 'Hoje às 10:15' },
    { id: 'CH-871', subject: 'Ajuste de chave PIX cadastrada para repasses', status: 'CONCLUIDO', created: '28/09/2026', lastUpdate: '29/09/2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Atendimento & Suporte ao Produtor
          </h1>
          <p className="text-sm text-slate-400">
            Canal direto com a equipe de operações e controladoria DiskIngressos
          </p>
        </div>

        <button
          onClick={() => alert('Abrindo formulário de chamado oficial com a equipe DiskIngressos...')}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Abrir Novo Chamado</span>
        </button>
      </div>

      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Código Chamado</th>
              <th className="p-3.5 font-semibold">Assunto / Solicitação</th>
              <th className="p-3.5 font-semibold">Abertura</th>
              <th className="p-3.5 font-semibold">Última Atualização</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/40">
                <td className="p-3.5 font-mono font-bold text-blue-400">{t.id}</td>
                <td className="p-3.5 font-semibold text-slate-200">{t.subject}</td>
                <td className="p-3.5 text-slate-400">{t.created}</td>
                <td className="p-3.5 text-slate-400">{t.lastUpdate}</td>
                <td className="p-3.5 text-right">
                  {t.status === 'CONCLUIDO' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Resolvido
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      Em Atendimento
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
