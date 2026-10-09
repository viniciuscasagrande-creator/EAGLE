import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Users,
  Download,
} from 'lucide-react';
import { CorporateOrder, CorporateAttendee } from '@/types/commercial';

interface ImportarParticipantesModalProps {
  order: CorporateOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (attendees: CorporateAttendee[]) => Promise<void>;
}

export const ImportarParticipantesModal: React.FC<ImportarParticipantesModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [rawText, setRawText] = useState('');
  const [parsedList, setParsedList] = useState<CorporateAttendee[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleParse = (text: string) => {
    setRawText(text);
    setErrorMsg('');
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setParsedList([]);
      return;
    }

    const attendees: CorporateAttendee[] = [];
    const startIndex = lines[0].toLowerCase().includes('nome') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(/[,;\t]/).map((p) => p.trim());
      if (parts.length >= 2) {
        attendees.push({
          id: `att-${Date.now()}-${i}`,
          name: parts[0] || `Participante ${i}`,
          document: parts[1] || '000.000.000-00',
          email: parts[2] || 'colaborador@empresa.com.br',
          sector: parts[3] || order.sector,
          ticketCode: `TKT-${order.orderNumber.replace(/[^0-9]/g, '')}-${String(i).padStart(3, '0')}`,
          checkedIn: false,
        });
      }
    }

    setParsedList(attendees);
  };

  const handleLoadSample = () => {
    const sample = `Nome,CPF,Email,Setor
Juliana Prado,021.432.543-99,juliana.prado@renault.com.br,${order.sector}
Marcos Vinicius Santos,033.456.789-10,marcos.santos@renault.com.br,${order.sector}
Fernanda Lima Costa,044.567.890-21,fernanda.costa@renault.com.br,${order.sector}
Guilherme Rocha,055.678.901-32,guilherme.rocha@renault.com.br,${order.sector}
Beatriz Carvalho,066.789.012-43,beatriz.carvalho@renault.com.br,${order.sector}`;
    handleParse(sample);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParse(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (parsedList.length === 0) {
      setErrorMsg('Nenhum participante identificado na lista.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(parsedList);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#37393e] flex items-center justify-between bg-[#232429]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Importar Lista Nominal de Participantes</h3>
              <p className="text-xs text-slate-400">
                Pedido {order.orderNumber} • {order.companyName} ({order.ticketQuantity} ingressos)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#35363c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-300">
              Cole abaixo a planilha com os dados dos colaboradores ou envie um arquivo .csv (Nome, CPF, E-mail, Setor):
            </p>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
            >
              Preencher com Exemplo
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 px-3 py-2 bg-[#202124] hover:bg-[#35363c] text-white rounded-lg border border-[#37393e] cursor-pointer transition">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Carregar Arquivo CSV</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-[11px] text-slate-400">ou cole diretamente no campo abaixo</span>
          </div>

          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => handleParse(e.target.value)}
            placeholder="Nome, CPF, E-mail, Setor&#10;Mariana Silva, 123.456.789-00, mariana@empresa.com, Camarote&#10;Carlos Souza, 234.567.890-11, carlos@empresa.com, Camarote"
            className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-3 text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
          />

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {parsedList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Pré-visualização ({parsedList.length} identificados / {order.ticketQuantity} contratados)
                </span>
                {parsedList.length > order.ticketQuantity && (
                  <span className="text-[10px] text-amber-400 font-bold">
                    Aviso: quantidade acima do contratado no pedido!
                  </span>
                )}
              </div>

              <div className="border border-[#37393e] rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
                      <th className="p-2 font-semibold">Nome Completo</th>
                      <th className="p-2 font-semibold">CPF</th>
                      <th className="p-2 font-semibold">E-mail</th>
                      <th className="p-2 font-semibold">Setor</th>
                      <th className="p-2 font-semibold">Código E-Ticket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#37393e]">
                    {parsedList.map((att, idx) => (
                      <tr key={idx} className="hover:bg-[#25262c]">
                        <td className="p-2 font-bold text-white">{att.name}</td>
                        <td className="p-2 font-mono text-slate-400">{att.document}</td>
                        <td className="p-2 text-slate-300">{att.email}</td>
                        <td className="p-2 text-slate-400">{att.sector}</td>
                        <td className="p-2 font-mono text-emerald-400 font-semibold">{att.ticketCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#37393e] flex items-center justify-between bg-[#232429]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#202124] hover:bg-[#35363c] text-slate-300 text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={parsedList.length === 0 || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Gerando...' : `Confirmar e Emitir ${parsedList.length} E-Tickets Nominais`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
