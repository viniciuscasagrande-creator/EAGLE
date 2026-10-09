import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  DollarSign,
  Ticket,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useEventContext } from '@/contexts/EventContext';
import { EventItem } from '@/types/event';

export const NovoEventoPage: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, selectEvent } = useEventContext();
  const [loading, setLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<EventItem | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'SHOW',
    venue: '',
    city: 'Curitiba',
    state: 'PR',
    dateStart: '',
    time: '20:00',
    totalCapacity: 2000,
    salesGoal: 250000,
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const event = await createEvent({
        name: form.name,
        venue: form.venue,
        city: form.city,
        state: form.state,
        dateStart: form.dateStart,
        time: form.time,
        imageUrl: form.imageUrl,
        totalCapacity: Number(form.totalCapacity),
        salesGoalAmount: Number(form.salesGoal),
      });
      selectEvent(event);
      setCreatedEvent(event);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/eventos')}
          className="p-2 rounded-lg bg-[#2c2d33] border border-[#37393e] text-slate-300 hover:text-white hover:bg-[#35363c] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Criar Novo Evento
          </h1>
          <p className="text-sm text-slate-400">
            Cadastre as informações preliminares para homologação comercial e abertura de vendas
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-6 shadow-md space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-[#37393e] pb-2">
            1. Dados Gerais do Evento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="text-slate-300 font-semibold block mb-1">Nome do Evento *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Festival de Verão Curitiba 2026"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Categoria *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SHOW">Show / Concerto</option>
                <option value="FESTIVAL">Festival Musical</option>
                <option value="TEATRO">Teatro / Espetáculo</option>
                <option value="STANDUP">Stand-up Comedy</option>
                <option value="CORPORATIVO">Congresso / Corporativo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-[#37393e] pb-2">
            2. Local & Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Local / Venue *</label>
              <input
                type="text"
                required
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="Ex: Pedreira Paulo Leminski / Live Curitiba"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Cidade / Estado *</label>
              <input
                type="text"
                required
                value={`${form.city} / ${form.state}`}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Data de Realização *</label>
              <input
                type="date"
                required
                value={form.dateStart}
                onChange={(e) => setForm({ ...form, dateStart: e.target.value })}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-[#37393e] pb-2">
            3. Capacidade & Metas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Capacidade Total Estimada (Ingressos) *</label>
              <input
                type="number"
                min="50"
                required
                value={form.totalCapacity}
                onChange={(e) => setForm({ ...form, totalCapacity: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Meta de Faturamento Bruto (R$) *</label>
              <input
                type="number"
                min="1000"
                required
                value={form.salesGoal}
                onChange={(e) => setForm({ ...form, salesGoal: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#232429] border border-[#37393e] rounded-lg text-xs text-slate-300 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            Ao submeter o cadastro preliminar, o evento é enviado para validação comercial e criação da carteira financeira oficial no Keeper ERP da DiskIngressos.
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#37393e]">
          <button
            type="button"
            onClick={() => navigate('/eventos')}
            className="px-4 py-2 rounded-lg bg-[#202124] border border-[#37393e] text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            {loading ? 'Cadastrando Evento...' : 'Salvar e Enviar para Homologação'}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {createdEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">Evento Cadastrado com Sucesso!</h3>
              <p className="text-xs text-slate-400">
                O evento <strong className="text-white">{createdEvent.name}</strong> foi registrado e a carteira financeira foi provisionada.
              </p>
            </div>

            <div className="p-3 bg-[#202124] rounded-lg border border-[#37393e] text-xs text-left space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Código Oficial:</span>
                <span className="font-mono font-bold text-blue-400">{createdEvent.code}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Capacidade Total:</span>
                <span className="font-bold text-white">{createdEvent.totalCapacity} ingressos</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate(`/eventos/${createdEvent.id}/ingressos`)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                Configurar Ingressos & Lotes
              </button>

              <button
                onClick={() => navigate(`/eventos/${createdEvent.id}/dashboard`)}
                className="w-full py-2.5 bg-[#202124] hover:bg-[#35363c] text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-[#37393e] transition cursor-pointer"
              >
                Abrir Dashboard do Evento
              </button>

              <button
                onClick={() => navigate('/eventos')}
                className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
              >
                Voltar à Central de Eventos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
