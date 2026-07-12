import {
  readPokemonDetailCache,
  writePokemonDetailCache,
} from '../pokemonDetailCache';
import type { PokemonDetail } from '../../api/pokemon.types';
import { storage, writeJson } from '@/lib/storage/mmkv';

const baseDetail: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  artworkUrl: 'https://img.example/pikachu-art.png',
  spriteUrl: 'https://img.example/pikachu.png',
  types: ['electric'],
  stats: [{ name: 'hp', base: 35 }],
  moves: ['thunder-shock', 'quick-attack'],
  genus: 'Mouse Pokémon',
  description: 'When several of these POKéMON gather, their electricity could build and cause lightning storms.',
  evolution: ['pichu', 'pikachu', 'raichu'],
  cachedAt: 1_700_000_000,
};

const detailWithNullables: PokemonDetail = {
  ...baseDetail,
  id: 1,
  name: 'bulbasaur',
  artworkUrl: null,
  spriteUrl: null,
  genus: null,
  description: null,
  evolution: [],
};

beforeEach(() => {
  storage.clearAll();
});

describe('pokemonDetailCache', () => {
  it('round-trips a fully populated detail', () => {
    writePokemonDetailCache(baseDetail);
    expect(readPokemonDetailCache(25)).toEqual(baseDetail);
  });

  it('round-trips a detail with all nullable fields set to null', () => {
    writePokemonDetailCache(detailWithNullables);
    expect(readPokemonDetailCache(1)).toEqual(detailWithNullables);
  });

  it('does not let entries from different ids collide', () => {
    writePokemonDetailCache(baseDetail);
    expect(readPokemonDetailCache(26)).toBeNull();
  });

  it('returns null for an id that was never written', () => {
    expect(readPokemonDetailCache(999)).toBeNull();
  });

  it('returns null and removes the key when the stored payload fails the schema', () => {
    writeJson('pokemon-detail:42', { id: 42, name: 'broken' });

    expect(readPokemonDetailCache(42)).toBeNull();
    expect(storage.getString('pokemon-detail:42')).toBeUndefined();
  });
});
