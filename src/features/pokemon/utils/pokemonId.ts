export function extractPokemonIdFromUrl(url: string): number {
  const match = /\/pokemon\/(\d+)\/?$/.exec(url);

  if (!match) {
    throw new Error(`Unable to extract Pokemon id from URL: ${url}`);
  }

  return Number.parseInt(match[1], 10);
}

export function formatPokemonId(id: number) {
  return `#${id.toString().padStart(4, '0')}`;
}

export function formatPokemonName(name: string) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
