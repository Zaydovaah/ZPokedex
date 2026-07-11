import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchPokemonDetail } from '../api/pokemon.client';
import type { DetailViewState } from '../api/pokemon.types';
import { readPokemonDetailCache, writePokemonDetailCache } from '../cache/pokemonDetailCache';

export function usePokemonDetail(id: number | null): DetailViewState {
  const cachedDetail = useMemo(() => (id ? readPokemonDetailCache(id) : null), [id]);

  const query = useQuery({
    queryKey: ['pokemon', 'detail', id],
    queryFn: async ({ signal }) => {
      if (!id) {
        throw new Error('Invalid Pokemon id.');
      }

      const detail = await fetchPokemonDetail(id, signal);
      writePokemonDetailCache(detail);
      return detail;
    },
    enabled: id !== null,
  });

  if (!id) {
    return {
      status: 'error',
      message: 'Invalid Pokemon id.',
      canRetry: false,
    };
  }

  if (query.data) {
    return {
      status: 'success',
      data: query.data,
      source: 'network',
      isRefreshing: query.isFetching,
    };
  }

  if (cachedDetail) {
    return {
      status: 'success',
      data: cachedDetail,
      source: 'cache',
      isRefreshing: query.isFetching,
    };
  }

  if (query.isPending) {
    return { status: 'loading' };
  }

  return {
    status: 'error',
    message: query.error instanceof Error ? query.error.message : 'Unable to load Pokemon detail.',
    canRetry: true,
  };
}
