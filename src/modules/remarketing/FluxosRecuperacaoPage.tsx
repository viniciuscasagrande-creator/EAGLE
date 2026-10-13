import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  remarketingV5,
  type Journey,
  type JourneyStep,
  type JourneyStatus,
} from '@/services/api/eagleRemarketingV5';
import {
  GitFork,
  Clock,
  Zap,
  Plus,
  CheckCircle2,
  MessageSquare,
  Mail,
  AlertCircle,
  X,
  Layers,
  Power,
  RefreshCw,
} from 'lucide-react';

export const FluxosRecuperacaoPage: React.FC = () => {
  const { id: routeEventId } = useParams<{ id: string }>();
  const [data, setData] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(routeEventId || 'ev-101');
  const [channel, setChannel] = useState<JourneyStep['channel']>('WHATSAPP');
  const [templateId, setTemplateId] = useState('wa_cart_rescue_fast');
  const [delay, setDelay] = useState(15);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await remarketingV5.listJourneys(routeEventId);
      setData(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível carregar as jornadas do backend.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [routeEventId]);

  const save = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEvent = routeEventId || selectedEventId;
    if (!targetEvent) {
      setError('Selecione um evento para associar a jornada automatizada.');
      return;
    }
    if (!name.trim()) {
      setError('Informe um nome descritivo para a jornada.');
      return;
    }
    if (!templateId.trim()) {
      setError('Informe o ID do template aprovado no canal.');
      return;
    }
    if (!Number.isFinite(delay) || delay < 0) {
      setError('Informe um intervalo de tempo válido (minutos).');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await remarketingV5.createJourney({
        eventId: targetEvent,
        name: name.trim(),
        steps: [
          {
            delayMinutes: Number(delay),
            channel,
            templateId: templateId.trim(),
          },
        ],
      });
      setFormOpen(false);
      setName('');
      setTemplateId('wa_cart_rescue_fast');
      setDelay(15);
      showToast('Jornada criada com sucesso e persistida no backend!');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha no cadastro da jornada.');
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (id: string, currentStatus: JourneyStatus) => {
    const nextStatus: JourneyStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setBusy(true);
    setError('');
    try {
      await remarketingV5.updateJourneyStatus(id, nextStatus);
      showToast(
        nextStatus === 'ACTIVE'
          ? 'Jornada ativada no motor de remarketing!'
          : 'Jornada pausada temporariamente.'
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível alterar o estado da jornada.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div role="alert" className="p-3.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => void load()} className="text-red-400 hover:text-white underline cursor-pointer text-xs ml-2">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Réguas & Jornadas de Recuperação
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Automação Comportamental V5
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Jornadas persistidas no backend oficial. Disparos executados somente com consentimento LGPD e encerrados automaticamente após a compra.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#37393e] border border-[#37393e] text-slate-300 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
            title="Atualizar lista de jornadas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>

          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-purple-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Jornada</span>
          </button>
        </div>
      </div>

      {/* List of Journeys */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-[#2c2d33] border border-[#37393e] rounded-xl flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
          <p className="text-xs">Carregando jornadas ativas do backend...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl bg-[#2c2d33] border border-[#37393e] p-8 text-center text-slate-400 space-y-3">
          <Layers className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="font-semibold text-white">Nenhuma jornada cadastrada para este contexto.</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Crie sua primeira régua de automação para disparar lembretes via WhatsApp ou E-mail com verificação de consentimento e encerramento após o pagamento.
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeira Jornada</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((j) => (
            <div
              key={j.id}
              className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md transition hover:border-[#4a4c55]"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-extrabold text-base flex-shrink-0">
                  <GitFork className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-extrabold text-white text-base">{j.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-purple-300 border border-[#37393e]">
                      Evento: {j.eventId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        j.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : j.status === 'PAUSED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {j.status === 'ACTIVE' ? 'Ativa' : j.status === 'PAUSED' ? 'Pausada' : 'Rascunho'}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    {j.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="font-bold text-slate-400">Etapa {idx + 1}:</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-white">
                          {step.channel === 'WHATSAPP' ? (
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                          )}
                          {step.channel}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Após {step.delayMinutes} min
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-[11px] text-slate-400 bg-[#202124] px-1.5 py-0.2 rounded border border-[#37393e]">
                          {step.templateId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  disabled={busy}
                  onClick={() => void changeStatus(j.id, j.status)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs transition cursor-pointer disabled:opacity-50 ${
                    j.status === 'ACTIVE'
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{j.status === 'ACTIVE' ? 'Pausar Jornada' : 'Solicitar Ativação'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Nova Jornada */}
      {formOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Nova jornada"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-lg bg-[#2c2d33] border border-[#37393e] rounded-xl shadow-2xl overflow-hidden text-slate-200">
            <div className="p-5 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Criar Nova Jornada Automatizada</h3>
                  <p className="text-[11px] text-slate-400">Régua multicanal integrada ao motor de remarketing</p>
                </div>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#37393e] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={save} className="p-5 space-y-4 text-xs">
              {!routeEventId && (
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Evento Associado *</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full rounded-lg p-2.5 bg-[#202124] border border-[#37393e] text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ev-101">Festival XYZ 2026 (ev-101)</option>
                    <option value="ev-102">Show Nacional ABC 2026 (ev-102)</option>
                    <option value="ev-103">Réveillon Prime 2027 (ev-103)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Nome da Jornada *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Resgate Imediato Checkout VIP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg p-2.5 bg-[#202124] border border-[#37393e] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Canal de Disparo *</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as JourneyStep['channel'])}
                    className="w-full rounded-lg p-2.5 bg-[#202124] border border-[#37393e] text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="WHATSAPP">WhatsApp Oficial</option>
                    <option value="EMAIL">E-mail Transacional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Intervalo após Abandono *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      value={delay}
                      onChange={(e) => setDelay(Number(e.target.value))}
                      className="w-full rounded-lg p-2.5 bg-[#202124] border border-[#37393e] text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">minutos</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">ID do Template Homologado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: wa_cart_rescue_fast ou em_vip_offer"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full rounded-lg p-2.5 bg-[#202124] border border-[#37393e] text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Identificador do modelo previamente aprovado na Meta Cloud API ou serviço SMTP.
                </span>
              </div>

              <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{busy ? 'Salvando...' : 'Salvar Rascunho'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FluxosRecuperacaoPage;
