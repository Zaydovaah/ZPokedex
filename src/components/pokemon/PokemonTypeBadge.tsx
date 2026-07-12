import { StyleSheet, Text } from 'react-native';

const typeColors: Record<string, string> = {
  bug: '#8CB230',
  dark: '#58575F',
  dragon: '#0F6AC0',
  electric: '#EED535',
  fairy: '#ED6EC7',
  fighting: '#D04164',
  fire: '#FD7D24',
  flying: '#748FC9',
  ghost: '#556AAE',
  grass: '#62B957',
  ground: '#DD7748',
  ice: '#61CEC0',
  normal: '#9DA0AA',
  poison: '#A552CC',
  psychic: '#EA5D60',
  rock: '#BAAB82',
  steel: '#417D9A',
  water: '#4A90DA',
};

export function PokemonTypeBadge({ type }: { type: string }) {
  return (
    <Text style={[styles.badge, { backgroundColor: typeColors[type] ?? '#718096' }]}>
      {type.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
