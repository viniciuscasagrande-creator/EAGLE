import React, { useState, useEffect } from 'react';
import { HeadphonesIcon, MessageSquare, Plus, CheckCircle, Clock } from 'lucide-react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovoChamadoModal } from '@/components/modals/NovoChamadoModal';

export const SuporteChamadosPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    keeperAdapter.getSupportTickets().then(setTickets);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Atendimento & Suporte ao Produtor
          </h1>
          <p className="text-sm text-slate-400">
            Canal direto com a equipe de operações e controladoria DiskIngressos
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Abrir Novo Chamado</span>
        </button>
      </div>

      <NovoChamadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createSupportTicket(data);
          setTickets((prev) => [created, ...prev]);
        }}
      />


      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Código Chamado</th>
              <th className="p-3.5 font-semibold">Assunto / Solicitação</th>
              <th className="p-3.5 font-semibold">Abertura</th>
              <th className="p-3.5 font-semibold">Última Atualização</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-mono font-bold text-blue-400">{t.id}</td>
                <td className="p-3.5 font-semibold text-white">{t.subject}</td>
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
