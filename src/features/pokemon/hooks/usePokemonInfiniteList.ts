import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPokemonPage, getPokemonListUrl } from '../api/pokemon.client';

export function usePokemonInfiniteList() {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'infinite-list'],
    queryFn: ({ pageParam, signal }) => fetchPokemonPage(pageParam, signal),
    initialPageParam: getPokemonListUrl(0),
    getNextPageParam: (lastPage) => lastPage.next,
  });
}
