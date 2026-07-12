import '@testing-library/react-native';

jest.mock('react-native-mmkv', () => {
  const values = new Map<string, string>();

  return {
    createMMKV: () => ({
      getString: (key: string) => values.get(key),
      set: (key: string, value: string) => values.set(key, value),
      remove: (key: string) => values.delete(key),
      clearAll: () => values.clear(),
    }),
  };
});
