import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { EventItem } from '@/types/event';
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  DoorOpen,
  Activity,
  Search,
  Download,
  ShieldCheck,
  ArrowLeft,
  Tv,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { formatNumber, formatDateTime } from '@/utils/formatters';

interface CheckinLogEntry {
  id: string;
  ticketCode: string;
  attendeeName: string;
  documentMasked: string;
  sectorName: string;
  gate: string;
  turnstile: string;
  checkedInAt: string;
  status: 'CONFIRMED' | 'DUPLICATE_ATTEMPT' | 'INVALID';
}

const mockInitialLogs: CheckinLogEntry[] = [
  {
    id: 'chk-1',
    ticketCode: 'TKT-8921-A',
    attendeeName: 'Mariana Silveira',
    documentMasked: '***.482.919-**',
    sectorName: 'Camarote Open Bar',
    gate: 'Portão B (VIP)',
    turnstile: 'Catraca 08',
    checkedInAt: '19:48:12',
    status: 'CONFIRMED',
  },
  {
    id: 'chk-2',
    ticketCode: 'TKT-7732-C',
    attendeeName: 'Carlos Eduardo Nogueira',
    documentMasked: '***.198.342-**',
    sectorName: 'Pista Premium',
    gate: 'Portão A (Principal)',
    turnstile: 'Catraca 03',
    checkedInAt: '19:47:55',
    status: 'CONFIRMED',
  },
  {
    id: 'chk-3',
    ticketCode: 'TKT-8921-A',
    attendeeName: 'Mariana Silveira (Tentativa Duplicada)',
    documentMasked: '***.482.919-**',
    sectorName: 'Camarote Open Bar',
    gate: 'Portão A (Principal)',
    turnstile: 'Catraca 01',
    checkedInAt: '19:47:10',
    status: 'DUPLICATE_ATTEMPT',
  },
  {
    id: 'chk-4',
    ticketCode: 'TKT-6541-B',
    attendeeName: 'Juliana Fagundes',
    documentMasked: '***.723.109-**',
    sectorName: 'Área VIP',
    gate: 'Portão B (VIP)',
    turnstile: 'Catraca 07',
    checkedInAt: '19:46:40',
    status: 'CONFIRMED',
  },
  {
    id: 'chk-5',
    ticketCode: 'TKT-3120-X',
    attendeeName: 'Rodrigo Brandão Lima',
    documentMasked: '***.841.562-**',
    sectorName: 'Pista Geral',
    gate: 'Portão C (Lateral)',
    turnstile: 'Catraca 12',
    checkedInAt: '19:45:18',
    status: 'CONFIRMED',
  },
];

export const PortariaCheckinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedEvent, selectEventById, allEvents } = useEventContext();

  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(selectedEvent);
  const [logs, setLogs] = useState<CheckinLogEntry[]>(mockInitialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    type: 'SUCCESS' | 'DUPLICATE' | 'INVALID';
    message: string;
    details?: string;
  } | null>(null);

  // Sync event
  useEffect(() => {
    if (id) {
      selectEventById(id);
      keeperAdapter.getEventById(id).then((evt) => {
        if (evt) setCurrentEvent(evt);
      }).catch(() => {});
    } else if (selectedEvent) {
      setCurrentEvent(selectedEvent);
    } else if (allEvents.length > 0) {
      setCurrentEvent(allEvents[0]);
    }
  }, [id, selectedEvent, allEvents]);

  const activeEvt = currentEvent || allEvents[0];
  const totalSold = activeEvt?.ticketsSold || 6840;
  const presentCount = Math.round(totalSold * 0.72) + logs.filter(l => l.status === 'CONFIRMED').length - 4;
  const absentCount = Math.max(0, totalSold - presentCount);
  const checkinRate = totalSold > 0 ? Math.round((presentCount / totalSold) * 100) : 0;

  // Simulator validation test
  const handleValidateTicket = (codeToTest?: string) => {
    const code = (codeToTest || scanInput).trim().toUpperCase();
    if (!code) return;

    if (code === 'TKT-VALID-999' || code.includes('VALID') || code === 'TKT-8844-OK') {
      const newEntry: CheckinLogEntry = {
        id: `chk-${Date.now()}`,
        ticketCode: code,
        attendeeName: 'Fernanda de Oliveira',
        documentMasked: '***.519.231-**',
        sectorName: 'Pista Premium',
        gate: 'Portão A (Principal)',
        turnstile: 'Catraca 04',
        checkedInAt: new Date().toLocaleTimeString('pt-BR'),
        status: 'CONFIRMED',
      };
      setLogs((prev) => [newEntry, ...prev]);
      setScanResult({
        type: 'SUCCESS',
        message: 'ACESSO LIBERADO — Ingresso Válido!',
        details: 'Participante: Fernanda de Oliveira • Pista Premium • Portão A',
      });
    } else if (code.includes('DUP') || code === 'TKT-8921-A' || code === 'TKT-DUPLICADO') {
      const dupEntry: CheckinLogEntry = {
        id: `chk-${Date.now()}`,
        ticketCode: code,
        attendeeName: 'Mariana Silveira (Tentativa Recusada)',
        documentMasked: '***.482.919-**',
        sectorName: 'Camarote Open Bar',
        gate: 'Portão A (Principal)',
        turnstile: 'Catraca 02',
        checkedInAt: new Date().toLocaleTimeString('pt-BR'),
        status: 'DUPLICATE_ATTEMPT',
      };
      setLogs((prev) => [dupEntry, ...prev]);
      setScanResult({
        type: 'DUPLICATE',
        message: 'ACESSO NEGADO — INGRESSO JÁ UTILIZADO!',
        details: 'Este QR Code já realizou check-in às 19:48:12 no Portão B (Catraca 08).',
      });
    } else {
      setScanResult({
        type: 'INVALID',
        message: 'ACESSO NEGADO — CÓDIGO INVÁLIDO OU CANCELADO!',
        details: `O código "${code}" não pertence a este evento ou foi estornado pelo Keeper ERP.`,
      });
    }

    setScanInput('');
  };

  const filteredLogs = logs.filter((l) =>
    l.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.sectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.gate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Código,Participante,Documento,Setor,Portao,Catraca,Horario,Status\n' +
      logs.map((l) => `${l.id},${l.ticketCode},"${l.attendeeName}",${l.documentMasked},"${l.sectorName}","${l.gate}","${l.turnstile}",${l.checkedInAt},${l.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `checkin_portaria_${activeEvt?.code || 'evento'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate(`/eventos/${activeEvt?.id}/dashboard`)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Voltar ao evento"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Monitor de Portaria & Check-in ao Vivo
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              14 CATRACAS ONLINE
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {activeEvt?.name} • Acompanhamento nominal dos acessos, validação de e-tickets e detecção de fraude
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/eventos/${activeEvt?.id}/telao`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            <span>Modo Telão</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white rounded-lg text-xs font-semibold border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Check-in</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Portaria Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Público Presente</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatNumber(presentCount)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            {checkinRate}% dos ingressos vendidos
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Ainda Não Entraram (No-Show)</span>
            <DoorOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2">
            {formatNumber(absentCount)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ingressos pendentes de validação
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Velocidade de Acesso</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-2">
            38 /min
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pico de 54 acessos/min às 19:30
          </div>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Auditoria Antifraude</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            99.8%
          </div>
          <div className="text-[11px] text-rose-400 font-semibold mt-1">
            1 tentativa duplicada barrada
          </div>
        </div>
      </div>

      {/* Gates Breakdown & Interactive QR Code Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gates status (5 cols) */}
        <div className="lg:col-span-5 bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#37393e] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-cyan-400" />
              Ocupação por Portão de Entrada
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">TODAS ONLINE</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Gate A */}
            <div className="p-3 bg-[#202124] border border-[#37393e] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Portão A — Principal (Pista & Arquibancada)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  Normal
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '51%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Catracas 01 a 06</span>
                <span className="text-white font-bold">2.482 acessos (51%)</span>
              </div>
            </div>

            {/* Gate B */}
            <div className="p-3 bg-[#202124] border border-[#37393e] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Portão B — Camarotes & VIP</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                  Fluxo Intenso
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Catracas 07 a 10</span>
                <span className="text-white font-bold">1.382 acessos (28%)</span>
              </div>
            </div>

            {/* Gate C */}
            <div className="p-3 bg-[#202124] border border-[#37393e] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Portão C — Pista Lateral & Imprensa</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  Normal
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '21%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Catracas 11 a 14</span>
                <span className="text-white font-bold">1.020 acessos (21%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Validation Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-[#2c2d33] border border-blue-500/30 rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#37393e] pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Simulador de Leitura de QR Code / Validador de Catraca
                </h3>
              </div>
              <span className="text-[10px] text-blue-400 font-mono font-bold">
                API KEEPER TOKEN VALIDATOR
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Digite o código do ingresso ou use os botões de simulação abaixo para testar cenários de validação instantânea na catraca:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleValidateTicket();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Ex: TKT-VALID-999 ou escaneie o código de barras..."
                className="flex-1 bg-[#202124] border border-[#37393e] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <ScanLine className="w-4 h-4" />
                <span>Validar</span>
              </button>
            </form>

            {/* Simulation Shortcuts */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 text-[11px]">Testar Cenários:</span>
              <button
                type="button"
                onClick={() => handleValidateTicket('TKT-VALID-999')}
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition cursor-pointer"
              >
                + Ingresso Válido
              </button>
              <button
                type="button"
                onClick={() => handleValidateTicket('TKT-DUPLICADO')}
                className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold transition cursor-pointer"
              >
                ! Ingresso Já Utilizado
              </button>
              <button
                type="button"
                onClick={() => handleValidateTicket('TKT-FAKE-000')}
                className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold transition cursor-pointer"
              >
                ? Ingresso Inexistente
              </button>
            </div>

            {/* Validation Feedback Result Box */}
            {scanResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1 animate-in fade-in duration-200 ${
                  scanResult.type === 'SUCCESS'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : scanResult.type === 'DUPLICATE'
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                    : 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scanResult.type === 'SUCCESS' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {scanResult.type === 'DUPLICATE' && <XCircle className="w-5 h-5 text-rose-400" />}
                  {scanResult.type === 'INVALID' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.details && (
                  <div className="text-[11px] text-slate-300 pt-0.5">
                    {scanResult.details}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#37393e] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Integração de Catracas: Henry, Control iD e Totens DiskIngressos</span>
            <span className="text-emerald-400 font-mono">Criptografia SHA-256</span>
          </div>
        </div>
      </div>

      {/* Nominal Check-in Log Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-[#37393e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Histórico de Acessos Recentes ({filteredLogs.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por participante, código ou portão..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                <th className="p-3 font-semibold">Código do Ingresso</th>
                <th className="p-3 font-semibold">Participante</th>
                <th className="p-3 font-semibold">Documento</th>
                <th className="p-3 font-semibold">Setor</th>
                <th className="p-3 font-semibold">Portão / Catraca</th>
                <th className="p-3 font-semibold">Horário</th>
                <th className="p-3 font-semibold text-right">Status do Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#37393e]">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3 font-mono font-bold text-blue-400">{entry.ticketCode}</td>
                  <td className="p-3 font-semibold text-white">{entry.attendeeName}</td>
                  <td className="p-3 font-mono text-slate-400">{entry.documentMasked}</td>
                  <td className="p-3 text-slate-300">{entry.sectorName}</td>
                  <td className="p-3 text-slate-300">
                    <span className="font-semibold">{entry.gate}</span>
                    <span className="text-slate-500 text-[11px] block">{entry.turnstile}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">{entry.checkedInAt}</td>
                  <td className="p-3 text-right">
                    {entry.status === 'CONFIRMED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        ACESSO LIBERADO
                      </span>
                    )}
                    {entry.status === 'DUPLICATE_ATTEMPT' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3" />
                        JÁ UTILIZADO
                      </span>
                    )}
                    {entry.status === 'INVALID' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        INVÁLIDO
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
