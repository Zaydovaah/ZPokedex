import { z } from 'zod';

import { readJson, storage, writeJson } from '../mmkv';

const pointSchema = z.object({ x: z.number(), y: z.number() });

beforeEach(() => {
  storage.clearAll();
});

describe('writeJson / readJson', () => {
  it('round-trips a value that passes the schema', () => {
    writeJson('point', { x: 1, y: 2 });
    expect(readJson('point', pointSchema)).toEqual({ x: 1, y: 2 });
  });

  it('returns null when the key is missing and does not call remove', () => {
    const removeSpy = jest.spyOn(storage, 'remove');

    expect(readJson('absent', pointSchema)).toBeNull();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('returns null and removes the key when JSON is malformed', () => {
    storage.set('broken', '{not valid json');
    const removeSpy = jest.spyOn(storage, 'remove');

    expect(readJson('broken', pointSchema)).toBeNull();
    expect(removeSpy).toHaveBeenCalledWith('broken');
    expect(storage.getString('broken')).toBeUndefined();
  });

  it('returns null and removes the key when the schema rejects the value', () => {
    storage.set('wrong-shape', JSON.stringify({ x: 'not-a-number', y: 2 }));
    const removeSpy = jest.spyOn(storage, 'remove');

    expect(readJson('wrong-shape', pointSchema)).toBeNull();
    expect(removeSpy).toHaveBeenCalledWith('wrong-shape');
    expect(storage.getString('wrong-shape')).toBeUndefined();
  });
});
