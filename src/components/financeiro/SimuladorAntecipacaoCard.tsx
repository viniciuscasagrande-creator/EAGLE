import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Info, CheckCircle2, TrendingUp } from 'lucide-react';
import { EventWalletPosition } from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

interface SimuladorAntecipacaoCardProps {
  wallets: EventWalletPosition[];
  onOpenSolicitacao: (eventId: string, amount: number) => void;
}

export const SimuladorAntecipacaoCard: React.FC<SimuladorAntecipacaoCardProps> = ({
  wallets,
  onOpenSolicitacao,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    wallets[0]?.eventId || 'ev-101'
  );

  const currentWallet = wallets.find((w) => w.eventId === selectedEventId) || wallets[0];
  const maxAvailable = currentWallet
    ? Math.max(0, currentWallet.grossTicketSales * 0.7 - currentWallet.advancesPaidTotal)
    : 100000;

  const [simulatedAmount, setSimulatedAmount] = useState<number>(
    Math.min(50000, maxAvailable > 10000 ? Math.round(maxAvailable * 0.5) : maxAvailable)
  );

  // Financial rates & calculations
  const spreadRate = 2.5; // 2.5% Taxa de antecipação Keeper Core
  const contingencyRate = 10.0; // 10% Reserva de contingência retida temporariamente

  const spreadCost = (simulatedAmount * spreadRate) / 100;
  const contingencyHold = (simulatedAmount * contingencyRate) / 100;
  const netPixDeposit = Math.max(0, simulatedAmount - spreadCost - contingencyHold);

  const usagePercent = maxAvailable > 0 ? Math.min(100, Math.round((simulatedAmount / maxAvailable) * 100)) : 0;

  const presets = [
    { label: 'R$ 15.000', value: 15000 },
    { label: 'R$ 30.000', value: 30000 },
    { label: 'R$ 50.000', value: 50000 },
    { label: 'R$ 80.000', value: 80000 },
    { label: 'Máximo (70%)', value: maxAvailable },
  ];

  return (
    <div className="bg-[#2c2d33] border border-blue-500/30 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#37393e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Simulador Inteligente de Antecipação & Repasses
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Liquidação D+1 PIX
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calcule instantaneamente o impacto de taxas, spread e contingência antes de submeter ao Keeper ERP
            </p>
          </div>
        </div>

        {/* Event selector */}
        {wallets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Evento:</span>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                const nextWallet = wallets.find((w) => w.eventId === e.target.value);
                if (nextWallet) {
                  const newMax = Math.max(0, nextWallet.grossTicketSales * 0.7 - nextWallet.advancesPaidTotal);
                  if (simulatedAmount > newMax) setSimulatedAmount(newMax);
                }
              }}
              className="bg-[#202124] border border-[#37393e] text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {wallets.map((w) => (
                <option key={w.eventId} value={w.eventId}>
                  {w.eventName} (Saldo: {formatCurrency(w.grossTicketSales)})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Left column: Simulator controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Valor Desejado para Antecipar
            </label>
            <div className="text-right">
              <span className="text-xs text-slate-400">Limite elegível (70%): </span>
              <span className="text-xs font-bold text-emerald-400">{formatCurrency(maxAvailable)}</span>
            </div>
          </div>

          {/* Amount input & presets */}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              R$
            </div>
            <input
              type="number"
              min={1000}
              max={maxAvailable}
              step={500}
              value={simulatedAmount}
              onChange={(e) => setSimulatedAmount(Math.min(maxAvailable, Math.max(0, Number(e.target.value))))}
              className="w-full bg-[#202124] border border-[#37393e] rounded-xl pl-10 pr-4 py-2.5 text-white font-mono text-lg font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Interactive slider */}
          <div className="space-y-1 pt-1">
            <input
              type="range"
              min={1000}
              max={Math.max(1000, maxAvailable)}
              step={500}
              value={simulatedAmount}
              onChange={(e) => setSimulatedAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>R$ 1.000</span>
              <span>{usagePercent}% do limite disponível</span>
              <span>{formatCurrency(maxAvailable)}</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400">Atalhos rápidos:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setSimulatedAmount(Math.min(p.value, maxAvailable))}
                className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer font-medium ${
                  simulatedAmount === Math.min(p.value, maxAvailable)
                    ? 'bg-blue-600/30 border-blue-500/60 text-blue-300'
                    : 'bg-[#202124] border-[#37393e] text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Contingency note */}
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Regra de Contingência Keeper ERP (10%)</span>
            </div>
            <p>
              A reserva de contingência (10%) permanece provisionada na sua conta gráfica até a data do evento para cobertura de eventuais estornos ou cancelamentos, sendo liberada automaticamente na liquidação final.
            </p>
          </div>
        </div>

        {/* Right column: Financial decomposition & Action (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#202124] border border-[#37393e] rounded-xl p-4 md:p-5">
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-[#37393e] flex items-center justify-between">
              <span>Decomposição Financeira</span>
              <span className="text-emerald-400 font-mono text-[11px]">Auditado Keeper</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Valor Bruto Solicitado:</span>
                <span className="font-bold font-mono text-white">{formatCurrency(simulatedAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1">
                  Taxa Spread Keeper ({spreadRate}%):
                  <span title="Custo financeiro do adiantamento"><Info className="w-3 h-3 text-slate-500" /></span>
                </span>
                <span className="font-mono text-rose-400 font-semibold">- {formatCurrency(spreadCost)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1">
                  Retenção de Contingência ({contingencyRate}%):
                  <span title="Reserva devolvida após a realização do evento"><Info className="w-3 h-3 text-slate-500" /></span>
                </span>
                <span className="font-mono text-amber-400 font-semibold">- {formatCurrency(contingencyHold)}</span>
              </div>

              <div className="pt-3 border-t border-[#37393e] flex justify-between items-end">
                <div>
                  <div className="text-[11px] text-emerald-400 font-semibold">Líquido Depositado via PIX:</div>
                  <div className="text-[10px] text-slate-400">Previsão D+1 até às 10h00</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">
                    {formatCurrency(netPixDeposit)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 mt-4 border-t border-[#37393e]">
            <button
              onClick={() => onOpenSolicitacao(selectedEventId, simulatedAmount)}
              disabled={simulatedAmount <= 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition cursor-pointer group"
            >
              <span>Solicitar Antecipação deste Valor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
