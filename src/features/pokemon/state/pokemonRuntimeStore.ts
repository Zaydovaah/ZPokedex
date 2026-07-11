import { create } from 'zustand';

type PokemonRuntimeState = {
  visiblePokemonIds: number[];
  setVisiblePokemonIds: (ids: number[]) => void;
};

export const usePokemonRuntimeStore = create<PokemonRuntimeState>((set) => ({
  visiblePokemonIds: [],
  setVisiblePokemonIds: (ids) => set({ visiblePokemonIds: ids }),
}));
