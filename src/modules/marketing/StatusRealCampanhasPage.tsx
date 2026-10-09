import React, { useState } from 'react';
import { mockAdRealStatus } from '@/services/api/mockSeedData';
import { AdRealStatusItem } from '@/types/marketing';
import { MetricKpiCard } from '@/components/cards/MetricKpiCard';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const StatusRealCampanhasPage: React.FC = () => {
  const [items, setItems] = useState<AdRealStatusItem[]>(mockAdRealStatus);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Hoje às 14:48');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText('Agora mesmo');
    }, 1200);
  };

  const countDelivering = items.filter((i) => i.deliveryStatus === 'DELIVERING').length;
  const countNoDelivery = items.filter((i) => i.deliveryStatus === 'ACTIVE_NO_DELIVERY').length;
  const countInReview = items.filter((i) => i.deliveryStatus === 'IN_REVIEW').length;
  const countRejected = items.filter((i) => i.deliveryStatus === 'REJECTED').length;

  const filteredItems = items.filter((i) =>
    filterPlatform === 'ALL' ? true : i.platform === filterPlatform
  );

  const getStatusBadge = (status: AdRealStatusItem['deliveryStatus']) => {
    switch (status) {
      case 'DELIVERING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Veiculando
          </span>
        );
      case 'ACTIVE_NO_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Ativa sem Entrega
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-3 h-3" />
            Em Moderação
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Problemas / Rejeitada
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Status Real das Campanhas nas Redes
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Meta • Google • TikTok • Spotify
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Auditoria em tempo real de entrega de mídia, saúde de anúncios, moderações e rejeições
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 bg-[#2c2d33] hover:bg-[#37393e] text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-[#37393e] shadow transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
          <span>{isSyncing ? 'Sincronizando com APIs...' : 'Sincronizar com Plataformas'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricKpiCard
          title="Veiculando (Ativas)"
          value={countDelivering.toString()}
          subtitle="Entregando impressões normalmente"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <MetricKpiCard
          title="Ativa sem Entrega"
          value={countNoDelivery.toString()}
          subtitle="Verificar lances ou público restrito"
          icon={Clock}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <MetricKpiCard
          title="Em Moderação / Análise"
          value={countInReview.toString()}
          subtitle="Aguardando liberação da plataforma"
          icon={Activity}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricKpiCard
          title="Problemas / Rejeitadas"
          value={countRejected.toString()}
          subtitle="Exige correção de criativo ou texto"
          icon={XCircle}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10"
        />
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto bg-[#2c2d33] border border-[#37393e] p-2 rounded-lg text-xs">
        <span className="text-slate-400 font-semibold px-2">Filtrar Canal:</span>
        {[
          { id: 'ALL', label: 'Todas as Redes' },
          { id: 'META_ADS', label: 'Meta Ads' },
          { id: 'GOOGLE_ADS', label: 'Google Ads' },
          { id: 'TIKTOK_ADS', label: 'TikTok Ads' },
          { id: 'SPOTIFY_ADS', label: 'Spotify Ads' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPlatform(tab.id)}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
              filterPlatform === tab.id
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#37393e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Real Status Table */}
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-[#232429] border-b border-[#37393e] flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Monitoramento de Entregas & Telemetria</h3>
          <span className="text-xs text-slate-400">Última sincronização: {lastSyncText}</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#202124] text-slate-300 border-b border-[#37393e]">
              <th className="p-3.5 font-semibold">Plataforma</th>
              <th className="p-3.5 font-semibold">Nome da Campanha</th>
              <th className="p-3.5 font-semibold">Estrutura</th>
              <th className="p-3.5 font-semibold">Orçamento Diário</th>
              <th className="p-3.5 font-semibold">Saúde</th>
              <th className="p-3.5 font-semibold">Status Real de Entrega</th>
              <th className="p-3.5 font-semibold">Detalhes & Alertas da Rede</th>
              <th className="p-3.5 font-semibold text-right">Última Leitura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#37393e]">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-[#25262c] transition">
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#202124] text-blue-400 border border-[#37393e]">
                    {item.platform}
                  </span>
                </td>
                <td className="p-3.5 font-bold text-white">{item.campaignName}</td>
                <td className="p-3.5 text-slate-300">
                  {item.adSetCount} cj / {item.adCount} anúncios
                </td>
                <td className="p-3.5 font-bold text-slate-200">{formatCurrency(item.dailyBudget)}/dia</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-[#202124] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          item.healthScore > 80
                            ? 'bg-emerald-500'
                            : item.healthScore > 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.healthScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{item.healthScore}%</span>
                  </div>
                </td>
                <td className="p-3.5">{getStatusBadge(item.deliveryStatus)}</td>
                <td className="p-3.5">
                  {item.issueDetail ? (
                    <div className="text-[11px] text-rose-300 flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                      <span>{item.issueDetail}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Nenhum problema detectado</span>
                  )}
                </td>
                <td className="p-3.5 text-right text-slate-400 font-mono text-[11px]">
                  {item.lastSyncAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
