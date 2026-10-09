import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { keeperAdapter } from '@/services/api/keeperAdapter';

interface NovoEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    subject: string;
    template: string;
    event: string;
    audience: string;
    message: string;
  }) => Promise<void>;
}

export const NovoEmailModal: React.FC<NovoEmailModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const isSmtp = keeperAdapter.isSmtpConfigured();
  const [subject, setSubject] = useState('Últimas Vagas para o Festival de Verão Curitiba 2026!');
  const [template, setTemplate] = useState('VIRADA_LOTE');
  const [event, setEvent] = useState('Festival de Verão Curitiba 2026');
  const [audience, setAudience] = useState('TODOS_COMPRADORES');
  const [message, setMessage] = useState(
    'Olá [Nome]! O lote atual está quase esgotado. Garanta seu ingresso com preço promocional antes da virada oficial!'
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        subject,
        template,
        event,
        audience,
        message,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Novo Disparo de E-mail Marketing</h3>
            <p className="text-xs text-slate-400">
              Servidor SMTP homologado DiskIngressos com conformidade LGPD
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Assunto do E-mail *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Não fique de fora! Virada de lote amanhã"
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Modelo de Template *</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="VIRADA_LOTE">Aviso de Virada de Lote</option>
                <option value="LANCAMENTO">Abertura de Vendas</option>
                <option value="CUPOM_VIP">Oferta com Cupom VIP</option>
                <option value="NEWSLETTER">Newsletter Mensal</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Público Alvo / Segmento *</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="TODOS_COMPRADORES">Todos os Compradores (Base Geral)</option>
                <option value="COMPRADORES_VIP">Compradores VIP (LTV Alto)</option>
                <option value="CARRINHOS">Visitantes com Intenção de Compra</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Evento Vinculado *</label>
            <input
              type="text"
              required
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Corpo da Mensagem (com tags dinâmicas) *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {!isSmtp && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Servidor de Envio em Homologação:</span>
                Provedor SMTP/SendGrid não autenticado para disparos em massa. A mensagem será salva como <strong>RASCUNHO</strong> e não realizará envios reais até a validação do serviço.
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white bg-[#202124] rounded-lg border border-[#37393e] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Processando...' : isSmtp ? 'Iniciar Disparo SMTP' : 'Salvar como Rascunho'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
