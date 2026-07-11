import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'zpokedex-cache' });

export function readJson<T>(key: string, fallbackSchema: { parse: (value: unknown) => T }): T | null {
  const rawValue = storage.getString(key);

  if (!rawValue) {
    return null;
  }

  try {
    return fallbackSchema.parse(JSON.parse(rawValue) as unknown);
  } catch {
    storage.remove(key);
    return null;
  }
}

export function writeJson<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}
