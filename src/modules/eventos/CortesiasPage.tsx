import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import {
  Gift,
  Plus,
  Users,
  CheckCircle,
  ShieldCheck,
  Download,
  Search,
  XCircle,
  Trash2,
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';
import { EmitirCortesiaModal } from '@/components/modals/EmitirCortesiaModal';
import { keeperAdapter } from '@/services/api/keeperAdapter';

export const CortesiasPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedEvent, selectEventById, allEvents, issueCourtesy } = useEventContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (id && (!selectedEvent || selectedEvent.id !== id)) {
      selectEventById(id);
    }
  }, [id, selectedEvent, selectEventById]);

  const currentEvent = selectedEvent || allEvents.find((e) => e.id === id) || allEvents[0];
  const [courtesies, setCourtesies] = useState<any[]>(() =>
    keeperAdapter.getCourtesies(currentEvent?.id)
  );

  useEffect(() => {
    if (currentEvent) {
      setCourtesies(keeperAdapter.getCourtesies(currentEvent.id));
    }
  }, [currentEvent]);

  if (!currentEvent) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum evento selecionado.
      </div>
    );
  }

  const handleRevoke = (courtesyId: string) => {
    setCourtesies((prev) => prev.filter((c) => c.id !== courtesyId));
  };

  const filteredCourtesies = courtesies.filter((c) =>
    (c.guestName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.sector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.authBy || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIssued = courtesies.reduce((acc, c) => acc + (c.qty || 0), 0);
  const quotaLimit = 250;
  const quotaRemaining = Math.max(0, quotaLimit - totalIssued);

  const handleExportCsv = () => {
    downloadCsv(
      `cortesias-vip-${currentEvent.code.toLowerCase()}`,
      ['Beneficiário / Destinatário', 'E-mail', 'Setor', 'Quantidade Ingressos', 'Autorizado por / Motivo', 'Data de Emissão'],
      filteredCourtesies.map((c) => [
        c.guestName,
        c.email,
        c.sector,
        c.qty,
        c.authBy,
        c.issuedAt,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Cortesias & Acessos Especiais
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {currentEvent.code}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {currentEvent.name} — Emissão e governança de cortesias e convites VIP
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Nova Cortesia</span>
          </button>
        </div>
      </div>

      <EmitirCortesiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectors={currentEvent.sectors}
        onConfirm={async (data) => {
          const created = await issueCourtesy(currentEvent.id, data);
          setCourtesies((prev) => [created, ...prev]);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <div className="text-xs text-slate-300 font-semibold uppercase">Total de Cortesias Emitidas</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {formatNumber(totalIssued)} un
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Limite contratual: {quotaLimit} un
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <div className="text-xs text-slate-300 font-semibold uppercase">Saldo Disponível para Cortesia</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatNumber(quotaRemaining)} un
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Cota remanescente homologada
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <div className="text-xs text-slate-300 font-semibold uppercase">Auditoria & Governança</div>
          <div className="text-2xl font-extrabold text-white mt-1">
            Rastreável
          </div>
          <div className="text-[11px] text-blue-400 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrado ao Keeper ERP
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar convidado, e-mail, setor ou autorizador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-purple-500"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Exibindo {filteredCourtesies.length} registros
        </span>
      </div>

      {/* Courtesies Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Beneficiário / Destinatário</th>
              <th className="p-3.5 font-semibold">Setor</th>
              <th className="p-3.5 font-semibold text-center">Quantidade</th>
              <th className="p-3.5 font-semibold">Autorização / Motivo</th>
              <th className="p-3.5 font-semibold">Data Emissão</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredCourtesies.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Nenhuma cortesia localizada para os critérios informados.
                </td>
              </tr>
            ) : (
              filteredCourtesies.map((item) => (
                <tr key={item.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{item.guestName}</div>
                    <div className="text-[11px] text-slate-400">{item.email}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{item.sector}</td>
                  <td className="p-3.5 font-bold text-purple-400 text-center">{item.qty} un</td>
                  <td className="p-3.5 text-slate-300">{item.authBy}</td>
                  <td className="p-3.5 text-slate-400">{item.issuedAt}</td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Emitido
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleRevoke(item.id)}
                      className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      title="Cancelar / Revogar Cortesia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
