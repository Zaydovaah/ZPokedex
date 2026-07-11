# ZPokedex

Expo React Native Pokédex built for the senior React Native technical test in `docs/requirements.md`.

## What Is Implemented

- Infinite Pokémon grid backed by PokéAPI.
- Runtime API validation with Zod at the fetch boundary.
- TanStack Query for server state and pagination.
- Zustand runtime store for visible Pokémon IDs.
- Visible-card battle stat simulation every 500ms.
- AppState and route-aware pausing for the stat stream.
- Detail route at `/pokemon/[id]` with types, base stats, moves, species text, and evolution chain.
- MMKV detail cache for offline fallback after a successful detail load.
- NativeWind, Expo Router, FlashList, strict TypeScript, Jest Expo, and React Native Testing Library setup.

## Requirements

- Node.js compatible with Expo SDK 56.
- npm.
- For native MMKV testing on device/simulator, use a development build. Web works through MMKV's web implementation.

## Setup

```bash
npm install
npm run web -- --port 8081
```

Change port `8081` may already be used by another project, so change it as needed.

## Verification

```bash
npm run typecheck
npm run lint
npm run test
```

Current verification status:

- `npm run typecheck`: passing.
- `npm run lint`: passing.
- `npm run test`: passing, 9 tests.
- Expo web bundle: verified with HTTP `200 OK` on `http://localhost:8081`.

## Architecture

```text
src/app/                    Expo Router routes
src/components/pokemon/     Grid, cards, stats, detail UI
src/features/pokemon/api/   PokéAPI client, Zod schemas, normalizers
src/features/pokemon/cache/ MMKV detail cache
src/features/pokemon/hooks/ Query and stress-stream hooks
src/features/pokemon/state/ Zustand runtime store
src/lib/                    Query client, storage, lifecycle, fetch helpers
```

The API layer exposes normalized app types only. Raw PokéAPI shapes stay isolated in `src/features/pokemon/api`.

## Offline Strategy

Detail data is cached in MMKV after a successful validated network response. If the detail query fails later, the detail hook serves the cached normalized record and marks the UI source as `cache`.

## Performance Strategy

The grid tracks visible Pokémon via FlashList viewability callbacks. The 500ms simulation only computes stats for visible IDs, and the stat display is isolated in a memoized component so slow-changing card identity data does not need broad updates.
