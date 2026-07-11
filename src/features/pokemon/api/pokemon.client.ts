import { fetchJson } from '@/lib/network/fetchJson';

import {
  type EvolutionChainNode,
  evolutionChainResponseSchema,
  pokemonDetailResponseSchema,
  pokemonListResponseSchema,
  pokemonSpeciesResponseSchema,
} from './pokemon.schemas';
import type {
  EvolutionChainResponse,
  PokemonDetail,
  PokemonDetailResponse,
  PokemonListResponse,
  PokemonSpeciesResponse,
  PokemonSummary,
} from './pokemon.types';
import { extractPokemonIdFromUrl } from '../utils/pokemonId';
import { getOfficialArtworkUrl } from '../utils/pokemonSprites';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 30;

export function getPokemonListUrl(offset = 0) {
  return `${API_BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`;
}

export async function fetchPokemonPage(pageParam: string | null, signal?: AbortSignal) {
  const response = await fetchJson(
    pageParam ?? getPokemonListUrl(0),
    pokemonListResponseSchema,
    signal,
  );

  return normalizePokemonPage(response);
}

export async function fetchPokemonDetail(id: number, signal?: AbortSignal): Promise<PokemonDetail> {
  const detail = await fetchJson(
    `${API_BASE_URL}/pokemon/${id}`,
    pokemonDetailResponseSchema,
    signal,
  );
  const species = await fetchJson(detail.species.url, pokemonSpeciesResponseSchema, signal);
  const evolution = await fetchJson(
    species.evolution_chain.url,
    evolutionChainResponseSchema,
    signal,
  );

  return normalizePokemonDetail(detail, species, evolution);
}

export function normalizePokemonPage(response: PokemonListResponse) {
  return {
    next: response.next,
    items: response.results.map((pokemon): PokemonSummary => {
      const id = extractPokemonIdFromUrl(pokemon.url);

      return {
        id,
        name: pokemon.name,
        url: pokemon.url,
        artworkUrl: getOfficialArtworkUrl(id),
      };
    }),
  };
}

export function normalizePokemonDetail(
  detail: PokemonDetailResponse,
  species: PokemonSpeciesResponse,
  evolutionChain: EvolutionChainResponse,
): PokemonDetail {
  const englishDescription = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'en',
  );
  const englishGenus = species.genera.find((entry) => entry.language.name === 'en');

  return {
    id: detail.id,
    name: detail.name,
    height: detail.height,
    weight: detail.weight,
    artworkUrl: detail.sprites.other?.['official-artwork']?.front_default ?? null,
    spriteUrl: detail.sprites.front_default,
    types: detail.types
      .slice()
      .sort((left, right) => left.slot - right.slot)
      .map((slot) => slot.type.name),
    stats: detail.stats.map((stat) => ({
      name: stat.stat.name,
      base: stat.base_stat,
    })),
    moves: detail.moves.slice(0, 24).map((move) => move.move.name),
    genus: englishGenus?.genus ?? null,
    description: englishDescription
      ? englishDescription.flavor_text.replace(/\s+/g, ' ').trim()
      : null,
    evolution: flattenEvolutionChain(evolutionChain.chain),
    cachedAt: Date.now(),
  };
}

export function flattenEvolutionChain(node: EvolutionChainNode): string[] {
  return [node.species.name, ...node.evolves_to.flatMap((child) => flattenEvolutionChain(child))];
}
