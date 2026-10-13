import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { EventWalletPosition, FinancialLedgerEntry, PayoutRequest } from '@/types/finance';
import { Producer } from '@/types/producer';

export const FINANCIAL_KEYS = {
  all: ['finance'] as const,
  wallets: () => [...FINANCIAL_KEYS.all, 'wallets'] as const,
  ledger: (producerId?: string, eventId?: string) => [...FINANCIAL_KEYS.all, 'ledger', { producerId, eventId }] as const,
  payouts: () => [...FINANCIAL_KEYS.all, 'payouts'] as const,
  producerOverview: (producerId: string) => [...FINANCIAL_KEYS.all, 'producer', producerId] as const,
};

/**
 * Hook para consulta reativa das carteiras de eventos com cache do React Query
 */
export function useEventWalletsQuery() {
  return useQuery<EventWalletPosition[], Error>({
    queryKey: FINANCIAL_KEYS.wallets(),
    queryFn: () => keeperAdapter.getEventWallets(),
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
}

/**
 * Hook para consulta de extrato financeiro (Ledger)
 */
export function useFinancialLedgerQuery(producerId?: string, eventId?: string) {
  return useQuery<FinancialLedgerEntry[], Error>({
    queryKey: FINANCIAL_KEYS.ledger(producerId, eventId),
    queryFn: () => keeperAdapter.getLedgerEntries({ producerId, eventId }),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para consulta de solicitações e liquidação de repasses
 */
export function usePayoutSchedulesQuery() {
  return useQuery<PayoutRequest[], Error>({
    queryKey: FINANCIAL_KEYS.payouts(),
    queryFn: () => keeperAdapter.getPayoutSchedules(),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para consulta dos dados e KPIs do Produtor no Keeper ERP
 */
export function useProducerOverviewQuery(producerId = 'prod-01') {
  return useQuery<Producer, Error>({
    queryKey: FINANCIAL_KEYS.producerOverview(producerId),
    queryFn: () => keeperAdapter.getProducerOverview(producerId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
