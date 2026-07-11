import { pokemonDetailSchema } from '../api/pokemon.schemas';
import type { PokemonDetail } from '../api/pokemon.types';
import { readJson, writeJson } from '@/lib/storage/mmkv';

function getDetailCacheKey(id: number) {
  return `pokemon-detail:${id}`;
}

export function readPokemonDetailCache(id: number): PokemonDetail | null {
  return readJson(getDetailCacheKey(id), pokemonDetailSchema);
}

export function writePokemonDetailCache(detail: PokemonDetail): void {
  writeJson(getDetailCacheKey(detail.id), detail);
}
