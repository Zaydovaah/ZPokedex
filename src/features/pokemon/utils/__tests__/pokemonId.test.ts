import { extractPokemonIdFromUrl, formatPokemonName } from '../pokemonId';

describe('pokemonId utilities', () => {
  it('extracts the numeric id from a PokéAPI pokemon URL', () => {
    expect(extractPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('throws when the URL is not a pokemon resource URL', () => {
    expect(() => extractPokemonIdFromUrl('https://pokeapi.co/api/v2/type/1/')).toThrow(
      'Unable to extract Pokemon id',
    );
  });

  it('formats hyphenated pokemon names', () => {
    expect(formatPokemonName('mr-mime')).toBe('Mr Mime');
  });
});
