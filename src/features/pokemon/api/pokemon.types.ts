import type { z } from 'zod';

import type {
  evolutionChainResponseSchema,
  pokemonDetailResponseSchema,
  pokemonDetailSchema,
  pokemonListResponseSchema,
  pokemonSpeciesResponseSchema,
  pokemonSummarySchema,
} from './pokemon.schemas';

export type PokemonListResponse = z.infer<typeof pokemonListResponseSchema>;
export type PokemonDetailResponse = z.infer<typeof pokemonDetailResponseSchema>;
export type PokemonSpeciesResponse = z.infer<typeof pokemonSpeciesResponseSchema>;
export type EvolutionChainResponse = z.infer<typeof evolutionChainResponseSchema>;
export type PokemonSummary = z.infer<typeof pokemonSummarySchema>;
export type PokemonDetail = z.infer<typeof pokemonDetailSchema>;

export type DetailViewState =
  | { status: 'loading' }
  | { status: 'success'; data: PokemonDetail; source: 'network' | 'cache'; isRefreshing: boolean }
  | { status: 'error'; message: string; canRetry: boolean };

export type StressStats = {
  hp: number;
  attack: number;
  defense: number;
};
