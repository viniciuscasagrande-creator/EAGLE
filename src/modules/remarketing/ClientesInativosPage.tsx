import React, { useState } from 'react';
import { UserX, RefreshCw, Mail, MessageSquare, DollarSign, Calendar, Download, CheckCircle2, X, Send, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const ClientesInativosPage: React.FC = () => {
  const [inactives, setInactives] = useState([
    {
      id: 'ina-01',
      name: 'Ana Paula Rocha',
      email: 'anapaula@gmail.com',
      phone: '(41) 99881-1200',
      lastPurchase: 'Festival XYZ 2025 (há 360 dias)',
      totalEvents: 3,
      totalSpent: 1250,
      status: 'Pendente',
    },
    {
      id: 'ina-02',
      name: 'Gabriel Torres',
      email: 'gtorres@outlook.com',
      phone: '(41) 98711-2290',
      lastPurchase: 'Show Nacional ABC 2025 (há 280 dias)',
      totalEvents: 2,
      totalSpent: 640,
      status: 'Pendente',
    },
    {
      id: 'ina-03',
      name: 'Juliana Silveira',
      email: 'juliana.s@uol.com.br',
      phone: '(41) 99233-4411',
      lastPurchase: 'Festival XYZ 2024 (há 490 dias)',
      totalEvents: 4,
      totalSpent: 2100,
      status: 'Pendente',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState('VOLTA15');
  const [selectedChannel, setSelectedChannel] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleReactivateSingle = (id: string, name: string) => {
    setInactives((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Convite VIP Enviado' } : item))
    );
    setToastMessage(`Convite VIP com cupom de reativação enviado com sucesso para ${name}!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleTriggerBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setInactives((prev) =>
      prev.map((item) => ({ ...item, status: `Disparado (${selectedCoupon})` }))
    );
    setIsModalOpen(false);
    setSubmitting(false);
    setToastMessage(
      `Régua de reativação com cupom ${selectedCoupon} disparada com sucesso para ${inactives.length} clientes via ${selectedChannel}!`
    );
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleExportCsv = () => {
    const headers = ['Cliente', 'E-mail', 'Telefone', 'Última Compra', 'Edições Compradas', 'Volume Gasto (R$)', 'Status'];
    const rows = inactives.map((item) => [
      item.name,
      item.email,
      item.phone,
      item.lastPurchase,
      item.totalEvents,
      item.totalSpent.toFixed(2),
      item.status,
    ]);
    downloadCsv(headers, rows, `clientes-inativos-churn-${new Date().toISOString().slice(0, 10)}.csv`);
    setToastMessage('Lista de clientes inativos exportada com sucesso (CSV)!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Clientes Inativos & Prevenção de Churn
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Reativação de Base
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Público que comprou em edições anteriores mas não interagiu nos últimos 180 dias
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Disparar Oferta de Reativação</span>
          </button>
        </div>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Cliente</th>
              <th className="p-3.5 font-semibold">Última Compra</th>
              <th className="p-3.5 font-semibold">Total de Eventos</th>
              <th className="p-3.5 font-semibold">Volume Histórico</th>
              <th className="p-3.5 font-semibold text-center">Status</th>
              <th className="p-3.5 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {inactives.map((item) => (
              <tr key={item.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400">{item.email} • {item.phone}</div>
                </td>
                <td className="p-3.5 text-slate-300">{item.lastPurchase}</td>
                <td className="p-3.5 font-bold text-white">{item.totalEvents} edições</td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(item.totalSpent)}</td>
                <td className="p-3.5 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status.includes('Enviado') || item.status.includes('Disparado')
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleReactivateSingle(item.id, item.name)}
                    className="px-3 py-1.5 bg-[#202124] hover:bg-[#37393e] border border-[#37393e] text-slate-200 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Reativar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Disparar Oferta de Reativação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-md shadow-2xl overflow-hidden text-slate-200">
            <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Disparo de Reativação em Massa</h3>
                  <p className="text-[11px] text-slate-400">Régua de reconquista para compradores inativos</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#37393e] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriggerBulk} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cupom de Desconto Incentivo</label>
                <select
                  value={selectedCoupon}
                  onChange={(e) => setSelectedCoupon(e.target.value)}
                  className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="VOLTA15">VOLTA15 — 15% OFF em qualquer evento</option>
                  <option value="SAUDADES20">SAUDADES20 — 20% OFF para compras acima de R$ 200</option>
                  <option value="VIPDISKINGRESSOS">VIPDISKINGRESSOS — Isenção de taxa de conveniência</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Canal de Disparo</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setSelectedChannel('WHATSAPP')}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                      selectedChannel === 'WHATSAPP'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'bg-[#202124] border-[#37393e] text-slate-400'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-bold">WhatsApp Oficial</span>
                  </label>

                  <label
                    onClick={() => setSelectedChannel('EMAIL')}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                      selectedChannel === 'EMAIL'
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                        : 'bg-[#202124] border-[#37393e] text-slate-400'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="font-bold">E-mail CRM</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] space-y-1.5 text-slate-300">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Estimativa de Alcance</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {inactives.length} clientes inativos qualificados com compras anteriores registradas no motor DiskIngressos.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#37393e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#202124] hover:bg-[#37393e] text-slate-300 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Disparando...' : 'Iniciar Disparo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
