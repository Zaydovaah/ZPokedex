import { z } from 'zod';

const namedApiResourceSchema = z.object({
  name: z.string(),
  url: z.url(),
});

export const pokemonListResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.url().nullable(),
  previous: z.url().nullable(),
  results: z.array(namedApiResourceSchema),
});

export const pokemonDetailResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  height: z.number().int().nonnegative(),
  weight: z.number().int().nonnegative(),
  sprites: z.object({
    front_default: z.url().nullable(),
    other: z
      .object({
        'official-artwork': z
          .object({
            front_default: z.url().nullable(),
          })
          .optional(),
      })
      .optional(),
  }),
  stats: z.array(
    z.object({
      base_stat: z.number().int().nonnegative(),
      stat: namedApiResourceSchema,
    }),
  ),
  types: z.array(
    z.object({
      slot: z.number().int().positive(),
      type: namedApiResourceSchema,
    }),
  ),
  moves: z.array(
    z.object({
      move: namedApiResourceSchema,
    }),
  ),
  species: namedApiResourceSchema,
});

export const pokemonSpeciesResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  evolution_chain: z.object({
    url: z.url(),
  }),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: namedApiResourceSchema,
    }),
  ),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: namedApiResourceSchema,
    }),
  ),
});

export type EvolutionChainNode = {
  species: z.infer<typeof namedApiResourceSchema>;
  evolves_to: EvolutionChainNode[];
};

const evolutionChainNodeSchema: z.ZodType<EvolutionChainNode> = z.lazy(() =>
  z.object({
    species: namedApiResourceSchema,
    evolves_to: z.array(evolutionChainNodeSchema),
  }),
);

export const evolutionChainResponseSchema = z.object({
  id: z.number().int().positive(),
  chain: evolutionChainNodeSchema,
});

export const pokemonSummarySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  url: z.url(),
  artworkUrl: z.url(),
});

export const pokemonStatSchema = z.object({
  name: z.string(),
  base: z.number().int().nonnegative(),
});

export const pokemonDetailSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  height: z.number().int().nonnegative(),
  weight: z.number().int().nonnegative(),
  artworkUrl: z.url().nullable(),
  spriteUrl: z.url().nullable(),
  types: z.array(z.string()),
  stats: z.array(pokemonStatSchema),
  moves: z.array(z.string()),
  genus: z.string().nullable(),
  description: z.string().nullable(),
  evolution: z.array(z.string()),
  cachedAt: z.number().int().positive(),
});
