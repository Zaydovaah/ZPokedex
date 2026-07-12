import { pokemonListResponseSchema } from '../pokemon.schemas';

describe('pokemon schemas', () => {
  it('accepts valid list payloads', () => {
    expect(() =>
      pokemonListResponseSchema.parse({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      }),
    ).not.toThrow();
  });

  it('rejects malformed list payloads', () => {
    expect(() =>
      pokemonListResponseSchema.parse({
        count: '1',
        next: null,
        previous: null,
        results: [{ name: 'bulbasaur' }],
      }),
    ).toThrow();
  });
});
