# ZPokedex

ZPokedex is an Expo SDK 56 React Native Pokédex built for the senior technical test described in `docs/requirements.md`.

It combines file-based navigation, typed API validation, paginated data loading, visible-card stress updates, a detail route, and a local offline cache strategy.

## Delivery status

This repository is set up as a deployment-ready Expo application handoff.
The codebase is verified by the project scripts, and the README below is intended to serve as the operational documentation for running, explaining, and releasing the app.

## What is implemented

- Infinite Pokémon grid backed by PokéAPI
- Runtime API validation with Zod at the fetch boundary
- TanStack Query for paginated list loading and cached server state
- Zustand runtime store for visible Pokémon IDs
- Visible-card battle stat simulation every 500 ms
- AppState-aware and route-aware pausing for the stat stream
- Detail route at `/pokemon/[id]` with types, base stats, moves, species text, and evolution chain
- MMKV-backed detail cache for offline fallback after a successful detail load
- NativeWind, Expo Router, FlashList, strict TypeScript, Jest Expo, and React Native Testing Library setup

## App architecture

The project is organized into a few clear layers:

```text
src/app/                    Expo Router entry and routes
src/components/pokemon/     Grid, cards, stats, and detail UI
src/features/pokemon/api/   PokéAPI client, Zod schemas, and normalizers
src/features/pokemon/cache/ MMKV detail cache
src/features/pokemon/hooks/ Query and stress-stream hooks
src/features/pokemon/state/ Zustand runtime store
src/lib/                    Query client, lifecycle, fetch, and storage helpers
```

The architectural intent is straightforward:

- `src/features/pokemon/api/` owns the external API boundary and schema validation.
- `src/features/pokemon/hooks/` owns query orchestration and runtime behavior.
- `src/components/pokemon/` owns UI rendering and visual composition.
- `src/lib/` owns shared infrastructure such as storage, query configuration, and lifecycle detection.

## Runtime flow

The app works like this:

1. The root Expo Router layout boots the application shell.
2. The home screen renders the infinite Pokémon grid.
3. React Query fetches paginated Pokémon records from PokéAPI.
4. Zod validates the network payload before the app trusts it.
5. The normalized records are passed into the grid UI.
6. FlashList tracks visible cards and updates the visible-ID runtime store.
7. The visible-card stress hook updates only the currently visible Pokémon stats every 500 ms.
8. When a user opens a detail route, the details hook fetches the additional data and caches the normalized result locally.
9. If the network later fails, the detail screen falls back to MMKV cache and surfaces the cached view state.

## Requirements

- Node.js compatible with Expo SDK 56
- npm
- For native MMKV validation on a device or simulator, use a development build
- Web runs through the MMKV web implementation

## Setup

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run web -- --port 8082
```

If port `8082` is already in use, choose another free port.

Run the Android app:

```bash
npx expo run:android
```

Run the iOS app:

```bash
npx expo run:ios
```

## Verification

The following checks are the project’s supported verification commands:

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
```

Verified status from the current workspace:

- `npm run typecheck`: passing with exit code `0`
- `npm run lint`: passing with exit code `0`
- `npm test -- --runInBand`: passing with `7/7` suites and `38/38` tests
- Web runtime check: `HTTP/1.1 200 OK` from `http://localhost:8082`

## Offline strategy

Detail data is cached in MMKV after a successful validated network response.
If the detail query later fails, the detail hook serves the cached normalized record and marks the UI source as `cache`.

This gives the app an explicit offline fallback path for the details experience without weakening the network boundary validation.

## Performance strategy

The grid tracks visible Pokémon through FlashList viewability callbacks and keeps the state update surface extremely small.
Only the currently visible Pokémon IDs are fed into the stress simulation loop, which means the app avoids broad global stat churn while still delivering the requested behavior.

The stat display is separated from slower identity data so the UI can stay responsive while the list is large and actively scrolling.

## Testing strategy

The repo includes focused unit coverage for:

- Zod validation boundaries
- API normalization logic
- MMKV cache behavior
- lifecycle handling and active-state awareness
- visible-card stress simulation behavior

## Deployment checklist

Before final release, the following should be completed:

1. Publish the repository to a public GitHub URL.
2. Confirm the Expo app metadata in `app.json` is correct for the target package and release identity.
3. Test a native development build on Android and/or iOS.
4. Confirm that MMKV works correctly on the actual native target being used for release testing.
5. Validate the app against the production network conditions expected for the final deployment.
6. Keep the README and architecture notes updated whenever the repo changes.

## Known project constraints

- Expo Go is not the ideal target for validating all native module behavior.
- MMKV is best exercised from a development build on a native device or simulator.
- PokéAPI is an external dependency, so runtime availability and payload shape changes should be considered when releasing.
- The app is designed for a responsive list experience and should be tested on real hardware for final release confidence.

## Summary

ZPokedex is a clean Expo Router + React Query + Zod + MMKV implementation with a strong runtime contract and a deliberate performance strategy.
The repo is already passing the key verification commands, and the README now documents the project in a deployable handoff style.

