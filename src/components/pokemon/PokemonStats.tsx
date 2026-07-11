import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { StressStats } from '@/features/pokemon/api/pokemon.types';

type PokemonStatsProps = {
  stats?: StressStats;
};

function PokemonStatsComponent({ stats }: PokemonStatsProps) {
  const value = stats ?? { hp: 0, attack: 0, defense: 0 };

  return (
    <View style={styles.container}>
      <Text style={styles.stat}>HP {value.hp}</Text>
      <Text style={styles.stat}>ATK {value.attack}</Text>
      <Text style={styles.stat}>DEF {value.defense}</Text>
    </View>
  );
}

export const PokemonStats = memo(PokemonStatsComponent);

const styles = StyleSheet.create({
  container: {
    gap: 3,
  },
  stat: {
    color: '#101820',
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
  },
});
