import React, { useState, useEffect } from 'react';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { AbandonedCart } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import { Repeat, ShoppingCart, MessageSquare, ShieldCheck, CheckCircle2, Clock, Plus } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export const DashboardRemarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState<AbandonedCart[]>([]);

  useEffect(() => {
    keeperAdapter.getAbandonedCarts().then(setCarts);
  }, []);

  const totalCartValue = carts.reduce((acc, curr) => acc + curr.cartValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Remarketing & Recuperação de Carrinhos
          </h1>
          <p className="text-sm text-slate-400">
            Jornadas automatizadas de WhatsApp e E-mail com estrito respeito à LGPD e consentimento
          </p>
        </div>

        <button
          onClick={() => navigate('/remarketing/carrinhos-abandonados')}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Ver Fila de Carrinhos</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Valor em Carrinhos Abandonados"
          value={formatCurrency(totalCartValue)}
          subtitle="Potencial de recuperação"
          icon={ShoppingCart}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/10"
        />

        <MetricKpiCard
          title="Taxa de Conversão Remarketing"
          value="24.8%"
          subtitle="Recuperados com sucesso"
          icon={Repeat}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />

        <MetricKpiCard
          title="Disparos via WhatsApp"
          value="1.420 msgs"
          subtitle="Dentro dos termos do cliente"
          icon={MessageSquare}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10"
        />

        <MetricKpiCard
          title="Privacidade & LGPD"
          value="100% Conforme"
          subtitle="Opt-in verificado"
          icon={ShieldCheck}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e]">
          <h3 className="font-bold text-white text-sm">Fila de Carrinhos Elegíveis para Recuperação</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#232429] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Cliente</th>
              <th className="p-3.5 font-semibold">Contato</th>
              <th className="p-3.5 font-semibold">Evento / Setor</th>
              <th className="p-3.5 font-semibold">Valor Carrinho</th>
              <th className="p-3.5 font-semibold">Abandono em</th>
              <th className="p-3.5 font-semibold text-right">Status Recuperação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {carts.map((cart) => (
              <tr key={cart.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5 font-bold text-white">{cart.customerName}</td>
                <td className="p-3.5 text-slate-400">
                  <div>{cart.customerPhone}</div>
                  <div className="text-[11px] text-slate-400">{cart.customerEmail}</div>
                </td>
                <td className="p-3.5 text-slate-300">
                  <div className="font-medium text-white">{cart.eventName}</div>
                  <div className="text-[11px] text-slate-400">{cart.sectorName} ({cart.ticketsCount} un)</div>
                </td>
                <td className="p-3.5 font-extrabold text-emerald-400">{formatCurrency(cart.cartValue)}</td>
                <td className="p-3.5 text-slate-400">{formatDateTime(cart.abandonedAt)}</td>
                <td className="p-3.5 text-right">
                  {cart.recoveryStatus === 'RECOVERED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Recuperado
                    </span>
                  )}
                  {cart.recoveryStatus === 'RECOVERY_SENT' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Clock className="w-3 h-3" />
                      Notificado
                    </span>
                  )}
                  {cart.recoveryStatus === 'PENDING' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      Fila Disparo
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
