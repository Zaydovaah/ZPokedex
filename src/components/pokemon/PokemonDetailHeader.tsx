import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import type { PokemonDetail } from '@/features/pokemon/api/pokemon.types';
import { formatPokemonId, formatPokemonName } from '@/features/pokemon/utils/pokemonId';

import { PokemonTypeBadge } from './PokemonTypeBadge';

type PokemonDetailHeaderProps = {
  detail: PokemonDetail;
  source: 'network' | 'cache';
};

export function PokemonDetailHeader({ detail, source }: PokemonDetailHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text style={styles.number}>{formatPokemonId(detail.id)}</Text>
        <Text style={styles.name}>{formatPokemonName(detail.name)}</Text>
        {detail.genus ? <Text style={styles.genus}>{detail.genus}</Text> : null}
        <View style={styles.types}>
          {detail.types.map((type) => (
            <PokemonTypeBadge key={type} type={type} />
          ))}
        </View>
        {source === 'cache' ? <Text style={styles.cache}>Offline cache</Text> : null}
      </View>
      <Image
        accessibilityLabel={formatPokemonName(detail.name)}
        contentFit="contain"
        source={{ uri: detail.artworkUrl ?? detail.spriteUrl ?? undefined }}
        style={styles.image}
        transition={160}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 18,
  },
  copy: {
    flex: 1,
    gap: 7,
  },
  number: {
    color: '#E40273',
    fontSize: 13,
    fontWeight: '900',
  },
  name: {
    color: '#101820',
    fontSize: 30,
    fontWeight: '900',
  },
  genus: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '700',
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cache: {
    color: '#B10057',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  image: {
    height: 142,
    width: 142,
  },
});
