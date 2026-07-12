import { act, renderHook } from '@testing-library/react-native';

import {
  createInitialStressStats,
  updateVisibleStressStats,
  useVisiblePokemonStressStats,
} from '../useVisiblePokemonStressStats';

describe('updateVisibleStressStats', () => {
  it('only returns stats for visible ids', () => {
    const result = updateVisibleStressStats(
      {
        1: { hp: 10, attack: 20, defense: 30 },
        4: { hp: 40, attack: 50, defense: 60 },
      },
      [4],
    );

    expect(Object.keys(result)).toEqual(['4']);
    expect(result[4]).toBeDefined();
    expect(result[1]).toBeUndefined();
  });

  it('returns a fresh object, not the previous reference', () => {
    const previous = { 7: { hp: 50, attack: 50, defense: 50 } };
    const result = updateVisibleStressStats(previous, [7]);

    expect(result).not.toBe(previous);
  });

  it('seeds missing entries from createInitialStressStats', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const result = updateVisibleStressStats({}, [1]);

    expect(result[1]).toEqual(createInitialStressStats(1));
  });

  it('floors all stats at 1 after a very negative random draw', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const result = updateVisibleStressStats(
      { 1: { hp: 2, attack: 2, defense: 2 } },
      [1],
    );

    expect(result[1]).toEqual({ hp: 1, attack: 1, defense: 1 });
  });

  it('returns an empty object when visibleIds is empty', () => {
    const previous = { 1: { hp: 10, attack: 10, defense: 10 } };
    expect(updateVisibleStressStats(previous, [])).toEqual({});
  });
});

describe('createInitialStressStats', () => {
  it('produces deterministic values for a given id', () => {
    expect(createInitialStressStats(1)).toEqual({ hp: 62, attack: 63, defense: 66 });
    expect(createInitialStressStats(25)).toEqual({ hp: 70, attack: 75, defense: 45 });
  });
});

describe('useVisiblePokemonStressStats', () => {
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    randomSpy.mockRestore();
    jest.useRealTimers();
  });

  it('returns the seeded stats on initial render for every visible id', () => {
    const { result } = renderHook(() => useVisiblePokemonStressStats([25, 1], true));

    expect(result.current).toEqual({
      1: createInitialStressStats(1),
      25: createInitialStressStats(25),
    });
  });

  it('does not start an interval when disabled', () => {
    const { result } = renderHook(() => useVisiblePokemonStressStats([1], false));
    const initial = result.current;

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current).toBe(initial);
  });

  it('returns an empty object and starts no interval when visibleIds is empty', () => {
    const { result } = renderHook(() => useVisiblePokemonStressStats([], true));

    expect(result.current).toEqual({});

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current).toEqual({});
  });

  it('leaves stats unchanged when the random draw is neutral (delta 0)', () => {
    const { result } = renderHook(() => useVisiblePokemonStressStats([1, 25], true));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toEqual({
      1: createInitialStressStats(1),
      25: createInitialStressStats(25),
    });
  });

  it('increments stats on a positive random draw (delta +4/+3/+3)', () => {
    randomSpy.mockReturnValue(0.9);

    const { result } = renderHook(() => useVisiblePokemonStressStats([1], true));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    const seed = createInitialStressStats(1);
    expect(result.current[1]).toEqual({
      hp: seed.hp + 4,
      attack: seed.attack + 3,
      defense: seed.defense + 3,
    });
  });

  it('only writes stats for visible ids, never for ids in the previous map', () => {
    const { result } = renderHook(() => useVisiblePokemonStressStats([1, 2], true));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(Object.keys(result.current).sort()).toEqual(['1', '2']);
  });

  it('survives reordering visibleIds without losing updates', () => {
    const { result, rerender } = renderHook(
      ({ ids }: { ids: number[] }) => useVisiblePokemonStressStats(ids, true),
      { initialProps: { ids: [1, 2] } },
    );

    rerender({ ids: [2, 1] });

    randomSpy.mockReturnValue(0.9);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    const seed1 = createInitialStressStats(1);
    const seed2 = createInitialStressStats(2);
    expect(result.current[1]).toEqual({ hp: seed1.hp + 4, attack: seed1.attack + 3, defense: seed1.defense + 3 });
    expect(result.current[2]).toEqual({ hp: seed2.hp + 4, attack: seed2.attack + 3, defense: seed2.defense + 3 });
  });

  it('clears the interval on unmount and does not throw on further ticks', () => {
    const { unmount } = renderHook(() => useVisiblePokemonStressStats([1], true));

    unmount();

    expect(() => {
      jest.advanceTimersByTime(2000);
    }).not.toThrow();
  });

  it('clears the interval when enabled flips to false', () => {
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => useVisiblePokemonStressStats([1], enabled),
      { initialProps: { enabled: true } },
    );
    const seeded = result.current[1];

    rerender({ enabled: false });

    randomSpy.mockReturnValue(0.9);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current[1]).toEqual(seeded);
  });
});
