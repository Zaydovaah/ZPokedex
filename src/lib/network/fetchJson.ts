import { z } from 'zod';

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function fetchJson<T>(
  url: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new HttpError(`Request failed with status ${response.status}`, response.status);
  }

  const payload: unknown = await response.json();
  return schema.parse(payload);
}
