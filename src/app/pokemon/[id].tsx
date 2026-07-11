import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { PokemonDetailHeader } from '@/components/pokemon/PokemonDetailHeader';
import { PokemonDetailSections } from '@/components/pokemon/PokemonDetailSections';
import { usePokemonDetail } from '@/features/pokemon/hooks/usePokemonDetail';

function parseRouteId(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const id = rawValue ? Number.parseInt(rawValue, 10) : Number.NaN;
  return Number.isFinite(id) && id > 0 ? id : null;
}

export default function PokemonDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = parseRouteId(params.id);
  const state = usePokemonDetail(id);

  if (state.status === 'loading') {
    return <LoadingState label="Loading Pokémon detail" />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <PokemonDetailHeader detail={state.data} source={state.source} />
      {state.isRefreshing ? (
        <View style={styles.refreshing}>
          <Text style={styles.refreshingText}>Refreshing live data</Text>
        </View>
      ) : null}
      <PokemonDetailSections detail={state.data} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7FAFC',
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  refreshing: {
    backgroundColor: '#FFF7ED',
    borderBottomColor: '#FED7AA',
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  refreshingText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
