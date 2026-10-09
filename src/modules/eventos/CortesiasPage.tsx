import React from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { Gift, Plus, Users, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

export const CortesiasPage: React.FC = () => {
  const { selectedEvent } = useEventContext();

  if (!selectedEvent) return null;

  const mockCourtesies = [
    { id: 'c-1', guestName: 'Assessoria de Imprensa Banda X', email: 'imprensa@bandax.com', sector: 'Camarote Open Bar', qty: 10, authBy: 'Diretoria Produtor', issuedAt: '2026-10-04' },
    { id: 'c-2', guestName: 'Patrocinador Master Banco', email: 'marketing@banco.com.br', sector: 'Pista Premium VIP', qty: 50, authBy: 'Contrato Comercial', issuedAt: '2026-10-02' },
    { id: 'c-3', guestName: 'Apoiadores Culturais / Rádio FM', email: 'promo@radiocwb.fm.br', sector: 'Pista Geral', qty: 60, authBy: 'Permuta de Mídia', issuedAt: '2026-10-01' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Cortesias & Acessos Especiais
          </h1>
          <p className="text-sm text-slate-400">
            {selectedEvent.name} — Emissão e governança de cortesias e convites VIP
          </p>
        </div>

        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Emitir Nova Cortesia</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total de Cortesias Emitidas</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {formatNumber(selectedEvent.courtesiesCount)} un
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Limite contratual: 250 un
          </div>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Saldo Disponível para Cortesia</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatNumber(250 - selectedEvent.courtesiesCount)} un
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Conforme aprovação Disk
          </div>
        </div>

        <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Auditoria & Governança</div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">
            Rastreável
          </div>
          <div className="text-[11px] text-blue-400 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrado ao Keeper ERP
          </div>
        </div>
      </div>

      {/* Courtesies Table */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <th className="p-3.5 font-semibold">Beneficiário / Destinatário</th>
              <th className="p-3.5 font-semibold">Setor</th>
              <th className="p-3.5 font-semibold">Quantidade</th>
              <th className="p-3.5 font-semibold">Autorização / Motivo</th>
              <th className="p-3.5 font-semibold">Data Emissão</th>
              <th className="p-3.5 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {mockCourtesies.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <div className="font-semibold text-slate-200">{item.guestName}</div>
                  <div className="text-[11px] text-slate-400">{item.email}</div>
                </td>
                <td className="p-3.5 text-slate-300">{item.sector}</td>
                <td className="p-3.5 font-bold text-purple-400">{item.qty} un</td>
                <td className="p-3.5 text-slate-300">{item.authBy}</td>
                <td className="p-3.5 text-slate-400">{item.issuedAt}</td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    Emitido
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
