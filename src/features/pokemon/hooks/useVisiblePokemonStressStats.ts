import { useEffect, useMemo, useState } from 'react';

import type { StressStats } from '../api/pokemon.types';

type StressStatsById = Record<number, StressStats>;

export function createInitialStressStats(id: number): StressStats {
  return {
    hp: 45 + ((id * 17) % 80),
    attack: 40 + ((id * 23) % 90),
    defense: 35 + ((id * 31) % 85),
  };
}

export function updateVisibleStressStats(
  previous: StressStatsById,
  visibleIds: number[],
): StressStatsById {
  const nextStats: StressStatsById = {};

  visibleIds.forEach((id) => {
    const current = previous[id] ?? createInitialStressStats(id);
    nextStats[id] = {
      hp: Math.max(1, current.hp + Math.floor(Math.random() * 9) - 4),
      attack: Math.max(1, current.attack + Math.floor(Math.random() * 7) - 3),
      defense: Math.max(1, current.defense + Math.floor(Math.random() * 7) - 3),
    };
  });

  return nextStats;
}

export function useVisiblePokemonStressStats(
  visibleIds: number[],
  enabled: boolean,
): StressStatsById {
  const stableVisibleIds = useMemo(() => [...visibleIds].sort((left, right) => left - right), [
    visibleIds,
  ]);
  const [stats, setStats] = useState<StressStatsById>({});

  useEffect(() => {
    if (!enabled || stableVisibleIds.length === 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setStats((previous) => updateVisibleStressStats(previous, stableVisibleIds));
    }, 500);

    return () => clearInterval(interval);
  }, [enabled, stableVisibleIds]);

  return useMemo(() => {
    const visibleStats: StressStatsById = {};

    stableVisibleIds.forEach((id) => {
      visibleStats[id] = stats[id] ?? createInitialStressStats(id);
    });

    return visibleStats;
  }, [stableVisibleIds, stats]);
}
