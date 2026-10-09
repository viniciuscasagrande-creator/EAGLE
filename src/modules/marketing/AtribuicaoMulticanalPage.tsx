import React, { useState } from 'react';
import { GitCompare, Layers, TrendingUp, HelpCircle } from 'lucide-react';

export const AtribuicaoMulticanalPage: React.FC = () => {
  const [model, setModel] = useState<'LAST_TOUCH' | 'FIRST_TOUCH' | 'LINEAR' | 'DATA_DRIVEN'>('DATA_DRIVEN');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Modelos de Atribuição Multicanal
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Cross-Channel Attribution
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Comparativo de peso das conversões entre primeiro toque, último toque e inteligência de dados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {[
          { id: 'DATA_DRIVEN', label: 'Baseado em Dados (Recomendado)', desc: 'Distribui o crédito de acordo com a influência real de cada canal' },
          { id: 'LAST_TOUCH', label: 'Último Clique (Last Touch)', desc: '100% do crédito vai para o canal finalizador da compra' },
          { id: 'FIRST_TOUCH', label: 'Primeiro Toque (First Touch)', desc: '100% do crédito vai para o canal que atraiu o visitante' },
          { id: 'LINEAR', label: 'Linear', desc: 'Divide igualmente o valor da venda entre todos os pontos de contato' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setModel(m.id as any)}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              model === m.id
                ? 'bg-blue-500/10 border-blue-500/40 text-blue-300 font-bold'
                : 'bg-[#2c2d33] border-[#37393e] text-slate-400 hover:text-white'
            }`}
          >
            <div>
              <div className="text-white font-bold mb-1">{m.label}</div>
              <p className="text-[11px] text-slate-400 font-normal leading-relaxed">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-6 shadow-md text-xs space-y-4">
        <h3 className="font-bold text-white text-base">Resultado do Modelo Selecionado: {model}</h3>
        <p className="text-slate-300 leading-relaxed">
          No modelo selecionado, o <strong>Instagram Stories</strong> é responsável por iniciar 46% das jornadas de compra, enquanto o <strong>WhatsApp</strong> atua como acelerador final em 34% dos fechamentos de ingressos.
        </p>
      </div>
    </div>
  );
};
