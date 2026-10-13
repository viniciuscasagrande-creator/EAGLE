import React, { useEffect, useState } from 'react';
import { remarketingApi } from '@/services/api/remarketing';
import { mockEvents } from '@/services/api/mockSeedData';
import { AbandonedCart } from '@/types/marketing';
import { useEventContext } from '@/contexts/EventContext';
import {
  ShoppingCart,
  Send,
  MessageCircle,
  Mail,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  CheckCircle2,
  X,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const CarrinhosAbandonadosPage: React.FC = () => {
  const { selectedEvent, selectEventById } = useEventContext();
  const [selectedEventId, setSelectedEventId] = useState<string>(selectedEvent?.id || 'ev-101');
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const refreshCarts = async () => {
    try {
      const data = await remarketingApi.listCarts();
      if (!Array.isArray(data)) throw new Error('Resposta inválida da API');
      setCarts(data as AbandonedCart[]);
      setRequestError(null);
    } catch (error) {
      setCarts([]);
      setRequestError(error instanceof Error ? error.message : 'Consulta indisponível');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshCarts();
  }, []);

  const activeEvent = mockEvents.find((e) => e.id === selectedEventId);

  const filteredCarts = carts.filter((c) => {
    const matchesEvent = selectedEventId === 'ALL' || c.eventId === selectedEventId;
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.recoveryStatus === statusFilter;
    return matchesEvent && matchesSearch && matchesStatus;
  });

  const totalAbandonedAmount = carts.reduce((acc, c) => acc + (c.cartValue || 0), 0);
  const recoveredCarts = carts.filter((c) => c.recoveryStatus === 'RECOVERED');
  const totalRecoveredAmount = recoveredCarts.reduce((acc, c) => acc + (c.cartValue || 0), 0);

  const handleSendRecovery = async (cart: AbandonedCart) => {
    if (sending) return;
    setSending(true);
    try {
      const result = await remarketingApi.recoverCart(cart.id);
      if (!result?.jobId) throw new Error('API não confirmou o agendamento');
      setToastMessage(`Recuperação agendada: ${result.jobId}. Aguardando retorno do canal.`);
      await refreshCarts();
      setTimeout(() => setToastMessage(null), 5000);
    } catch (error) {
      setToastMessage(
        `Não foi possível agendar a recuperação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    } finally {
      setSending(false);
    }
  };

  const handleBulkRecovery = async () => {
    const ids = filteredCarts.filter((c) => c.recoveryStatus === 'PENDING').map((c) => c.id);
    if (!ids.length || sending) return;
    setSending(true);
    try {
      const result = await remarketingApi.recoverBatch(ids);
      if (!result?.jobId) throw new Error('API não confirmou o lote');
      setToastMessage(`Lote ${result.jobId} aceito para processamento (${result.acceptedCount}). Envio não confirmado.`);
      await refreshCarts();
      setTimeout(() => setToastMessage(null), 5000);
    } catch (error) {
      setToastMessage(`Falha ao agendar lote: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setSending(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Cliente',
      'E-mail',
      'Telefone',
      'Evento',
      'Setor',
      'Qtd Ingressos',
      'Valor (R$)',
      'Data Abandono',
      'Status',
    ];
    const rows = filteredCarts.map((c) => [
      c.id,
      c.customerName,
      c.customerEmail,
      c.customerPhone,
      c.eventName,
      c.sectorName,
      c.ticketsCount,
      (c.cartValue || 0).toFixed(2),
      c.abandonedAt,
      c.recoveryStatus,
    ]);
    downloadCsv(headers, rows, `carrinhos-abandonados-${new Date().toISOString().slice(0, 10)}.csv`);
    setToastMessage('Relatório de carrinhos abandonados exportado com sucesso (CSV)!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getRecoveryBadge = (status: AbandonedCart['recoveryStatus']) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Recuperado
          </span>
        );
      case 'RECOVERY_SENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            Mensagem Enviada
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pendente Disparo
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Expirado
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#202124] text-slate-400 border border-[#37393e]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div role="status" className="p-3 text-xs text-slate-300 bg-[#202124] rounded-lg border border-[#37393e] flex items-center gap-2">
          <Clock className="w-4 h-4 animate-spin text-amber-400" />
          <span>Carregando carrinhos do servidor...</span>
        </div>
      )}

      {requestError && (
        <div role="alert" className="p-3 rounded-lg border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Falha ao consultar carrinhos reais: {requestError}</span>
          </div>
          <button className="underline ml-2 text-rose-400 hover:text-white cursor-pointer" onClick={() => void refreshCarts()}>
            Tentar novamente
          </button>
        </div>
      )}

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Central de Carrinhos Abandonados
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Recuperação Ativa & Conversão
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Acompanhe usuários que iniciaram o checkout de ingressos mas não concluíram o pagamento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#35363c] text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleBulkRecovery}
            disabled={sending}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{sending ? 'Processando Lote...' : 'Disparar Recuperação em Massa'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Total Abandonado</span>
          <div className="text-xl font-extrabold text-rose-400 mt-1">
            {formatCurrency(totalAbandonedAmount)}
          </div>
          <span className="text-[10px] text-slate-400">{carts.length} carrinhos registrados</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Receita Recuperada</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalRecoveredAmount)}
          </div>
          <span className="text-[10px] text-emerald-400">Convertidos pós-disparo</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Taxa de Resgate</span>
          <div className="text-xl font-extrabold text-teal-400 mt-1">
            {carts.length > 0 ? ((recoveredCarts.length / carts.length) * 100).toFixed(1) : '0.0'}%
          </div>
          <span className="text-[10px] text-teal-400">Eficiência de recuperação</span>
        </div>

        <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-4 shadow-md">
          <span className="text-[11px] text-slate-300 font-semibold uppercase">Ticket Médio Perdido</span>
          <div className="text-xl font-extrabold text-slate-200 mt-1">
            {formatCurrency(carts.length > 0 ? totalAbandonedAmount / carts.length : 0)}
          </div>
          <span className="text-[10px] text-slate-400">Por checkout abandonado</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por comprador, e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#202124] text-xs text-white pl-8 pr-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Event Filter */}
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              if (e.target.value !== 'ALL') {
                selectEventById(e.target.value);
              }
            }}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-pink-500 font-medium"
          >
            <option value="ALL">Todos os Eventos</option>
            {mockEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#202124] text-xs text-white px-3 py-2 rounded-md border border-[#37393e] focus:outline-none focus:border-pink-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value="PENDING">Pendentes de Disparo</option>
            <option value="RECOVERY_SENT">Disparo Realizado</option>
            <option value="RECOVERED">Recuperados com Sucesso</option>
            <option value="EXPIRED">Expirados</option>
          </select>

          {(searchTerm || statusFilter !== 'ALL' || selectedEventId !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setSelectedEventId('ALL');
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#202124] rounded-md transition cursor-pointer"
              title="Limpar filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Abandoned Carts Table or Empty State */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Comprador & Contato</th>
              <th className="p-3.5 font-semibold">Evento & Setor</th>
              <th className="p-3.5 font-semibold text-center">Ingressos</th>
              <th className="p-3.5 font-semibold text-right">Valor do Carrinho</th>
              <th className="p-3.5 font-semibold">Momento do Abandono</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-right">Ação Imediata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredCarts.length > 0 ? (
              filteredCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-[#25262c] transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{cart.customerName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-emerald-400 font-mono">
                        <MessageCircle className="w-3 h-3" />
                        {cart.customerPhone}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {cart.customerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{cart.eventName}</div>
                    <div className="text-[11px] text-slate-400">{cart.sectorName}</div>
                  </td>
                  <td className="p-3.5 text-center font-bold text-blue-400">
                    {cart.ticketsCount} un
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-rose-400 text-sm">
                    {formatCurrency(cart.cartValue || 0)}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {formatDateTime(cart.abandonedAt)}
                  </td>
                  <td className="p-3.5 text-center">
                    {getRecoveryBadge(cart.recoveryStatus)}
                  </td>
                  <td className="p-3.5 text-right">
                    {cart.recoveryStatus !== 'RECOVERED' ? (
                      <button
                        onClick={() => handleSendRecovery(cart)}
                        disabled={sending}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        Convertido ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center border border-slate-700">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Nenhum carrinho abandonado encontrado</h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        {activeEvent
                          ? `Não constam checkouts abandonados pendentes para "${activeEvent.name}" nos critérios selecionados.`
                          : 'Nenhum checkout pendente atende aos filtros de busca atuais.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                        setSelectedEventId('ALL');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      Exibir Todos os Eventos
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CarrinhosAbandonadosPage;
