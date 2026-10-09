import React, { useState } from 'react';
import {
  X,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Ticket,
  DollarSign,
  FileText,
  Star,
  Plus,
  Send,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { CommercialClient } from '@/types/commercial';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

interface ClienteDetalhesModalProps {
  client: CommercialClient | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateProposal?: (client: CommercialClient) => void;
  onUpdateClient?: (updated: Partial<CommercialClient>) => Promise<void>;
}

export const ClienteDetalhesModal: React.FC<ClienteDetalhesModalProps> = ({
  client,
  isOpen,
  onClose,
  onGenerateProposal,
  onUpdateClient,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  if (!isOpen || !client) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !onUpdateClient) return;
    setIsSavingNote(true);
    try {
      const existingNotes = client.notes || '';
      const timestamp = new Date().toLocaleDateString('pt-BR');
      const updatedNotes = existingNotes
        ? `${existingNotes}\n[${timestamp}] ${newNote.trim()}`
        : `[${timestamp}] ${newNote.trim()}`;
      await onUpdateClient({ notes: updatedNotes });
      setNewNote('');
    } finally {
      setIsSavingNote(false);
    }
  };

  const whatsappNumber = client.phone ? client.phone.replace(/\D/g, '') : '';
  const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(
    `Olá ${client.contactName}, tudo bem? Aqui é da equipe DiskIngressos.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#37393e] flex items-center justify-between bg-[#232429]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">{client.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#202124] text-amber-300 border border-[#37393e]">
                  {client.category}
                </span>
                {client.totalVolume > 10000 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400" />
                    Conta VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                CNPJ/CPF: {client.document} • Cidade: {client.city}
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#232429] border border-[#37393e] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Volume Total (LTV)</span>
              <span className="text-base font-extrabold text-emerald-400">{formatCurrency(client.totalVolume)}</span>
            </div>
            <div className="bg-[#232429] border border-[#37393e] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Pedidos Realizados</span>
              <span className="text-base font-extrabold text-white">{client.totalOrders} pedidos</span>
            </div>
            <div className="bg-[#232429] border border-[#37393e] p-3 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Última Compra</span>
              <span className="text-xs font-semibold text-slate-300">
                {client.lastPurchaseDate ? formatDateTime(client.lastPurchaseDate) : 'Sem registros recentes'}
              </span>
            </div>
          </div>

          {/* Contact & Company Details */}
          <div className="bg-[#202124] border border-[#37393e] rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Dados de Contato & Responsável</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[11px]">Contato Principal:</span>
                <span className="font-semibold text-white">{client.contactName}</span>
                {client.contactRole && <span className="text-slate-400 block text-[10px]">({client.contactRole})</span>}
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">E-mail Corporativo:</span>
                <a href={`mailto:${client.email}`} className="text-blue-400 hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{client.email}</span>
                </a>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Telefone / WhatsApp:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-white">{client.phone}</span>
                  {whatsappNumber && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Endereço / Sede:</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{client.address || client.city}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Segmentos & Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {(client.tags && client.tags.length > 0
                ? client.tags
                : ['Comprador Corporativo', 'Ingressos em Lote', 'Contrato Regular']
              ).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#202124] text-amber-300 border border-[#37393e]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CRM Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Histórico de Relacionamento & Anotações</h4>
            <div className="bg-[#202124] border border-[#37393e] rounded-lg p-3 max-h-36 overflow-y-auto text-slate-300 font-mono text-[11px] whitespace-pre-wrap">
              {client.notes || 'Nenhuma anotação registrada ainda.'}
            </div>

            {onUpdateClient && (
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar nova anotação comercial..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-[#202124] border border-[#37393e] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim() || isSavingNote}
                  className="px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] disabled:opacity-50 text-white font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Adicionar
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#37393e] flex items-center justify-between bg-[#232429]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            Fechar Ficha
          </button>

          <div className="flex items-center gap-2">
            {onGenerateProposal && (
              <button
                onClick={() => {
                  onGenerateProposal(client);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-lg shadow transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Gerar Nova Proposta para este Cliente</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
