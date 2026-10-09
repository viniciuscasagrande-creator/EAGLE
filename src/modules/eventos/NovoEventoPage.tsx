import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Ticket, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export const NovoEventoPage: React.FC = () => {
  const navigate = useNavigate();
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Evento "${form.name}" cadastrado com sucesso! Encaminhado para homologação e criação da carteira oficial no Keeper ERP.`);
    navigate('/eventos');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/eventos')}
          className="p-2 rounded-lg bg-[#2c2d33] border border-[#37393e] text-slate-300 hover:text-white hover:bg-[#35363c] transition"
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
                placeholder="Ex: Pedreira Paulo Leminski"
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
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
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
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
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
            className="px-4 py-2 rounded-lg bg-[#202124] border border-[#37393e] text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            Salvar e Enviar para Homologação
          </button>
        </div>
      </form>
    </div>
  );
};
