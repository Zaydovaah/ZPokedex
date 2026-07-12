import {
  flattenEvolutionChain,
  normalizePokemonDetail,
  normalizePokemonPage,
} from '../pokemon.client';
import type {
  EvolutionChainResponse,
  PokemonDetailResponse,
  PokemonListResponse,
  PokemonSpeciesResponse,
} from '../pokemon.types';

describe('pokemon normalizers', () => {
  it('normalizes list entries into renderable summaries', () => {
    const response: PokemonListResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };

    expect(normalizePokemonPage(response).items[0]).toMatchObject({
      id: 1,
      name: 'bulbasaur',
      artworkUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    });
  });

  it('flattens recursive evolution chains', () => {
    expect(
      flattenEvolutionChain({
        species: { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon-species/172/' },
        evolves_to: [
          {
            species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
            evolves_to: [
              {
                species: { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon-species/26/' },
                evolves_to: [],
              },
            ],
          },
        ],
      }),
    ).toEqual(['pichu', 'pikachu', 'raichu']);
  });

  it('normalizes detail, species, and evolution responses', () => {
    const detail: PokemonDetailResponse = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        front_default: 'https://img.example/pikachu.png',
        other: {
          'official-artwork': {
            front_default: 'https://img.example/pikachu-art.png',
          },
        },
      },
      stats: [{ base_stat: 35, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } }],
      types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
      moves: [
        { move: { name: 'thunder-shock', url: 'https://pokeapi.co/api/v2/move/84/' } },
        { move: { name: 'quick-attack', url: 'https://pokeapi.co/api/v2/move/98/' } },
      ],
      species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
    };
    const species: PokemonSpeciesResponse = {
      id: 25,
      name: 'pikachu',
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
      flavor_text_entries: [
        {
          flavor_text: 'Stores electricity in its cheeks.',
          language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' },
        },
      ],
      genera: [
        {
          genus: 'Mouse Pokémon',
          language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' },
        },
      ],
    };
    const evolution: EvolutionChainResponse = {
      id: 10,
      chain: {
        species: { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon-species/172/' },
        evolves_to: [
          {
            species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
            evolves_to: [],
          },
        ],
      },
    };

    expect(normalizePokemonDetail(detail, species, evolution)).toMatchObject({
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      genus: 'Mouse Pokémon',
      evolution: ['pichu', 'pikachu'],
      moves: ['thunder-shock', 'quick-attack'],
    });
  });
});
