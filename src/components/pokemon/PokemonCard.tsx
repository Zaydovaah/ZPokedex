import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PokemonSummary, StressStats } from '@/features/pokemon/api/pokemon.types';
import { formatPokemonId, formatPokemonName } from '@/features/pokemon/utils/pokemonId';

import { PokemonStats } from './PokemonStats';

type PokemonCardProps = {
  pokemon: PokemonSummary;
  stats?: StressStats;
};

function PokemonCardComponent({ pokemon, stats }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.header}>
          <Text style={styles.number}>{formatPokemonId(pokemon.id)}</Text>
          <Text numberOfLines={1} style={styles.name}>
            {formatPokemonName(pokemon.name)}
          </Text>
        </View>
        <Image
          accessibilityLabel={formatPokemonName(pokemon.name)}
          contentFit="contain"
          recyclingKey={String(pokemon.id)}
          source={{ uri: pokemon.artworkUrl }}
          style={styles.image}
          transition={120}
        />
        <PokemonStats stats={stats} />
      </Pressable>
    </Link>
  );
}

export const PokemonCard = memo(PokemonCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    minHeight: 214,
    padding: 12,
  },
  pressed: {
    opacity: 0.72,
  },
  header: {
    gap: 2,
  },
  number: {
    color: '#718096',
    fontSize: 11,
    fontWeight: '800',
  },
  name: {
    color: '#101820',
    fontSize: 16,
    fontWeight: '900',
  },
  image: {
    alignSelf: 'center',
    height: 112,
    width: '100%',
  },
});
