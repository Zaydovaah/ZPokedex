import { StyleSheet, Text, View } from 'react-native';

import type { PokemonDetail } from '@/features/pokemon/api/pokemon.types';
import { formatPokemonName } from '@/features/pokemon/utils/pokemonId';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function PokemonDetailSections({ detail }: { detail: PokemonDetail }) {

  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      {detail.description ? (
        <Section title="Overview">
          <Text style={styles.body}>{detail.description}</Text>
          <View style={styles.measurements}>
            <Metric label="Height" value={`${(detail.height / 10).toFixed(1)} m`} />
            <Metric label="Weight" value={`${(detail.weight / 10).toFixed(1)} kg`} />
          </View>
        </Section>
      ) : null}

      <Section title="Base Stats">
        <View style={styles.stats}>
          {detail.stats.map((stat) => (
            <View key={stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{stat.name.toUpperCase()}</Text>
              <View style={styles.statTrack}>
                <View style={[styles.statFill, { width: `${Math.min(stat.base, 160) / 1.6}%` }]} />
              </View>
              <Text style={styles.statValue}>{stat.base}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Evolution">
        <View style={styles.chips}>
          {detail.evolution.map((name) => (
            <Text key={name} style={styles.chip}>
              {formatPokemonName(name)}
            </Text>
          ))}
        </View>
      </Section>

      <Section title="Moves">
        <View style={styles.chips}>
          {detail.moves.map((move) => (
            <Text key={move} style={styles.move}>
              {formatPokemonName(move)}
            </Text>
          ))}
        </View>
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    padding: 18,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  sectionTitle: {
    color: '#101820',
    fontSize: 17,
    fontWeight: '900',
  },
  body: {
    color: '#4A5568',
    fontSize: 14,
    lineHeight: 21,
  },
  measurements: {
    flexDirection: 'row',
    gap: 10,
  },
  metric: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    flex: 1,
    padding: 12,
  },
  metricLabel: {
    color: '#718096',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#101820',
    fontSize: 18,
    fontWeight: '900',
  },
  stats: {
    gap: 9,
  },
  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  statName: {
    color: '#4A5568',
    fontSize: 11,
    fontWeight: '900',
    width: 86,
  },
  statTrack: {
    backgroundColor: '#EDF2F7',
    borderRadius: 999,
    flex: 1,
    height: 9,
    overflow: 'hidden',
  },
  statFill: {
    backgroundColor: '#E40273',
    borderRadius: 999,
    height: '100%',
  },
  statValue: {
    color: '#101820',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    textAlign: 'right',
    width: 34,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FCE8F3',
    borderColor: '#F4A7D0',
    borderRadius: 8,
    borderWidth: 1,
    color: '#B10057',
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  move: {
    backgroundColor: '#F7FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    color: '#2D3748',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
});
