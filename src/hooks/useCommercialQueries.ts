import { useQuery } from '@tanstack/react-query';
import { keeperAdapter } from '@/services/api/keeperAdapter';
import { CommercialClient, CommercialOpportunity, CommercialProposal } from '@/types/commercial';

export const COMMERCIAL_KEYS = {
  all: ['commercial'] as const,
  clients: () => [...COMMERCIAL_KEYS.all, 'clients'] as const,
  opportunities: () => [...COMMERCIAL_KEYS.all, 'opportunities'] as const,
  proposals: () => [...COMMERCIAL_KEYS.all, 'proposals'] as const,
};

export function useCommercialClientsQuery() {
  return useQuery<CommercialClient[], Error>({
    queryKey: COMMERCIAL_KEYS.clients(),
    queryFn: () => keeperAdapter.getCommercialClients(),
    staleTime: 1000 * 60 * 3,
  });
}

export function useCommercialOpportunitiesQuery() {
  return useQuery<CommercialOpportunity[], Error>({
    queryKey: COMMERCIAL_KEYS.opportunities(),
    queryFn: () => keeperAdapter.getCommercialOpportunities(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCommercialProposalsQuery() {
  return useQuery<CommercialProposal[], Error>({
    queryKey: COMMERCIAL_KEYS.proposals(),
    queryFn: () => keeperAdapter.getCommercialProposals(),
    staleTime: 1000 * 60 * 2,
  });
}
