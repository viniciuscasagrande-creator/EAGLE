import React, { useState, useEffect } from 'react';
import {
  HeadphonesIcon,
  MessageSquare,
  Plus,
  CheckCircle,
  Clock,
  Search,
  Download,
  Send,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { NovoChamadoModal } from '@/components/modals/NovoChamadoModal';
import { downloadCsv } from '@/utils/csvExport';

interface SupportMessage {
  id: string;
  sender: 'PRODUCER' | 'SUPPORT';
  senderName: string;
  message: string;
  timestamp: string;
}

export const SuporteChamadosPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');

  // Local simulated messages per ticket
  const [ticketMessages, setTicketMessages] = useState<Record<string, SupportMessage[]>>({
    'TKT-101': [
      { id: '1', sender: 'PRODUCER', senderName: 'Produtor', message: 'Gostaria de solicitar a liberação de mais 50 cortesias para o evento Festival XYZ.', timestamp: '08/10/2026 14:20' },
      { id: '2', sender: 'SUPPORT', senderName: 'Controladoria DiskIngressos', message: 'Olá! Solicitação recebida. O saldo de cortesias contratuais foi expandido e já se encontra liberado.', timestamp: '08/10/2026 15:45' }
    ]
  });

  useEffect(() => {
    keeperAdapter.getSupportTickets().then(setTickets);
  }, []);

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'PRODUCER',
      senderName: 'Produtor',
      message: replyText.trim(),
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setTicketMessages((prev) => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), newMsg],
    }));

    setReplyText('');
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'CONCLUIDO' } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev: any) => ({ ...prev, status: 'CONCLUIDO' }));
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      (t.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    downloadCsv(
      'chamados-suporte-produtor',
      ['Código', 'Assunto', 'Abertura', 'Última Atualização', 'Status'],
      filteredTickets.map((t) => [t.id, t.subject, t.created, t.lastUpdate, t.status])
    );
  };

  const currentMessages = selectedTicket ? ticketMessages[selectedTicket.id] || [
    {
      id: 'init-1',
      sender: 'PRODUCER',
      senderName: 'Produtor',
      message: selectedTicket.subject,
      timestamp: selectedTicket.created,
    },
    {
      id: 'init-2',
      sender: 'SUPPORT',
      senderName: 'Suporte DiskIngressos',
      message: 'Recebemos seu chamado. Um analista da nossa equipe de operações está verificando sua solicitação.',
      timestamp: selectedTicket.lastUpdate,
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Atendimento & Suporte ao Produtor
          </h1>
          <p className="text-sm text-slate-400">
            Canal direto com a equipe de operações, bilheteria e controladoria DiskIngressos
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Abrir Novo Chamado</span>
          </button>
        </div>
      </div>

      <NovoChamadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async (data) => {
          const created = await keeperAdapter.createSupportTicket(data);
          setTickets((prev) => [created, ...prev]);
        }}
      />

      {/* Filter Toolbar */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código ou assunto do chamado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none"
        >
          <option value="ALL">Todos os Status</option>
          <option value="EM_ANDAMENTO">Em Atendimento</option>
          <option value="CONCLUIDO">Resolvidos / Concluídos</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Código Chamado</th>
              <th className="p-3.5 font-semibold">Assunto / Solicitação</th>
              <th className="p-3.5 font-semibold">Abertura</th>
              <th className="p-3.5 font-semibold">Última Atualização</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredTickets.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="hover:bg-[#25262c] transition cursor-pointer"
              >
                <td className="p-3.5 font-mono font-bold text-blue-400">{t.id}</td>
                <td className="p-3.5 font-semibold text-white">{t.subject}</td>
                <td className="p-3.5 text-slate-400">{t.created}</td>
                <td className="p-3.5 text-slate-400">{t.lastUpdate}</td>
                <td className="p-3.5 text-center">
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

      {/* Ticket Conversation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#37393e] bg-[#232429] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-400">{selectedTicket.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedTicket.status === 'CONCLUIDO'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {selectedTicket.status === 'CONCLUIDO' ? 'Resolvido' : 'Em Atendimento'}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mt-1">{selectedTicket.subject}</h3>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              {currentMessages.map((msg: SupportMessage) => {
                const isProducer = msg.sender === 'PRODUCER';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isProducer ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[85%] p-3 rounded-lg leading-relaxed ${
                        isProducer
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-[#202124] border border-[#37393e] text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input & Actions */}
            <div className="p-4 border-t border-[#37393e] bg-[#232429] space-y-2">
              {selectedTicket.status !== 'CONCLUIDO' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply(selectedTicket.id);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Escreva sua resposta para o suporte DiskIngressos..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-[#202124] border border-[#37393e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center text-xs text-emerald-400 py-1 font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Este chamado foi concluído e arquivado com sucesso.</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-[#37393e]">
                {selectedTicket.status !== 'CONCLUIDO' && (
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    Marcar como Resolvido
                  </button>
                )}
                <div />
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-3 py-1.5 bg-[#202124] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
