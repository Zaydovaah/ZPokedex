import { FlashList, type ListRenderItemInfo, type ViewToken } from '@shopify/flash-list';
import { usePathname } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import type { PokemonSummary } from '@/features/pokemon/api/pokemon.types';
import { usePokemonInfiniteList } from '@/features/pokemon/hooks/usePokemonInfiniteList';
import { useVisiblePokemonStressStats } from '@/features/pokemon/hooks/useVisiblePokemonStressStats';
import { usePokemonRuntimeStore } from '@/features/pokemon/state/pokemonRuntimeStore';
import { useAppActive } from '@/lib/lifecycle/useAppActive';

import { PokemonCard } from './PokemonCard';

export function PokemonGrid() {
  const query = usePokemonInfiniteList();
  const pathname = usePathname();
  const isFocused = pathname === '/';
  const appActive = useAppActive();
  const { width } = useWindowDimensions();
  const visiblePokemonIds = usePokemonRuntimeStore((state) => state.visiblePokemonIds);
  const setVisiblePokemonIds = usePokemonRuntimeStore((state) => state.setVisiblePokemonIds);

  const columns = width >= 900 ? 4 : width >= 620 ? 3 : 2;
  const pokemon = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const statsById = useVisiblePokemonStressStats(
    visiblePokemonIds,
    isFocused && appActive && visiblePokemonIds.length > 0,
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PokemonSummary>) => (
      <View style={styles.cell}>
        <PokemonCard pokemon={item} stats={statsById[item.id]} />
      </View>
    ),
    [statsById],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<PokemonSummary>[] }) => {
      setVisiblePokemonIds(
        viewableItems
          .filter((token) => token.isViewable)
          .map((token) => token.item.id)
          .filter((id, index, ids) => ids.indexOf(id) === index),
      );
    },
    [setVisiblePokemonIds],
  );

  const fetchNextPage = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  if (query.isPending) {
    return <LoadingState label="Loading ZPokédex" />;
  }

  if (query.isError) {
    return (
      <ErrorState
        message={query.error instanceof Error ? query.error.message : 'PokéAPI is unavailable.'}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <FlashList
      contentContainerStyle={styles.content}
      data={pokemon}
      drawDistance={900}
      extraData={statsById}
      key={columns}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={<EmptyState label="No Pokémon found." />}
      ListFooterComponent={
        query.isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color="#E84D3D" />
          </View>
        ) : null
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ZPokedex</Text>
          <Text style={styles.title}>Combat Grid</Text>
          <Text style={styles.subtitle}>
            Visible Pokémon receive simulated battle stat updates every 500ms.
          </Text>
        </View>
      }
      numColumns={columns}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.65}
      onViewableItemsChanged={onViewableItemsChanged}
      renderItem={renderItem}
      viewabilityConfig={{ itemVisiblePercentThreshold: 45 }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 12,
    paddingBottom: 28,
  },
  cell: {
    padding: 6,
  },
  header: {
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 18,
  },
  eyebrow: {
    color: '#E84D3D',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#101820',
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: '#4A5568',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
  },
});
