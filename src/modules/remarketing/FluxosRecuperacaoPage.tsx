import React, { useState } from 'react';
import { GitFork, Clock, Zap, Plus, CheckCircle2, MessageSquare, Mail } from 'lucide-react';

export const FluxosRecuperacaoPage: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Régua Imediata (15 Minutos)',
      channel: 'WhatsApp',
      desc: 'Disparo de mensagem amigável informando que os ingressos foram reservados temporariamente no setor escolhido.',
      recoveryRate: '28,4%',
      status: 'Ativa',
    },
    {
      step: 2,
      title: 'Régua Intermediária (2 Horas)',
      channel: 'E-mail Marketing',
      desc: 'E-mail com o resumo do carrinho, foto do setor e botão direto para pagamento via PIX ou Cartão.',
      recoveryRate: '14,2%',
      status: 'Ativa',
    },
    {
      step: 3,
      title: 'Régua de Escassez (24 Horas)',
      channel: 'WhatsApp & SMS',
      desc: 'Aviso de virada de lote iminente ou liberação da reserva caso a compra não seja concluída.',
      recoveryRate: '8,9%',
      status: 'Ativa',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Réguas & Fluxos de Recuperação
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Automação Comportamental
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Definição de intervalos e canais para abordagem gradual do cliente sem sobrecarregar com mensagens repetitivas
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <div
            key={s.step}
            className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-extrabold text-base flex-shrink-0">
                {s.step}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">{s.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-purple-300 border border-[#37393e]">
                    Canal: {s.channel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">{s.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs flex-shrink-0">
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Taxa de Resgate</span>
                <span className="font-extrabold text-emerald-400 text-sm">{s.recoveryRate}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
