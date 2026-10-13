import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockEvents } from '@/services/api/mockSeedData';
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  Ticket,
  DollarSign,
  ArrowUpRight,
  Eye,
  Building2,
} from 'lucide-react';

export const EventosRedePage: React.FC = () => {
  const { switchProducer, switchProfile } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = mockEvents.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase()) ||
      (e.producerName && e.producerName.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenEventAsProducer = (eventId: string, producerId?: string) => {
    if (producerId) {
      switchProducer(producerId);
    }
    switchProfile('PRODUCER');
    navigate(`/eventos/${eventId}/dashboard`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Eventos da Rede DiskIngressos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {mockEvents.length} eventos cadastrados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervisão e auditoria consolidada de eventos publicados em todas as praças e produtoras.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar evento, cidade ou produtora..."
            className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/90 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-purple-500 transition cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Em Venda Ativa</option>
            <option value="UPCOMING">Lançamentos Futuros</option>
            <option value="COMPLETED">Encerrados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Evento & Local</th>
                <th className="py-3.5 px-4 font-bold">Produtora Responsável</th>
                <th className="py-3.5 px-4 font-bold">Data & Horário</th>
                <th className="py-3.5 px-4 font-bold">Vendas Brutas (GMV)</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/40 transition">
                  {/* Event Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={evt.imageUrl}
                        alt={evt.name}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-700 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{evt.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{evt.venue} • {evt.city}/{evt.state}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Producer */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">
                      {evt.producerName || 'ABC Produções & Eventos Ltda'}
                    </div>
                    <div className="text-[10px] text-purple-400 font-mono">
                      {evt.producerId || 'prod-01'}
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium">{evt.dateStart}</div>
                    <div className="text-[11px] text-slate-400">{evt.time}</div>
                  </td>

                  {/* GMV */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-400 font-mono">
                      R$ {(evt.grossSales || 150000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : evt.status === 'UPCOMING'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {evt.status === 'ACTIVE' ? 'EM VENDA' : evt.status === 'UPCOMING' ? 'FUTURO' : 'ENCERRADO'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEventAsProducer(evt.id, evt.producerId)}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition inline-flex items-center gap-1 cursor-pointer"
                      title="Abrir detalhes no painel do produtor"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Auditar</span>
                    </button>
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
