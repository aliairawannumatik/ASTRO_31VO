# Numatik

Numatik (Numerasi Aktif dengan Teknologi Informasi dan Komunikasi) is an educational numeracy app for students.

## Run & Operate

- **Frontend** — workflow `Numatik Web` starts the React/Vite app from `.migration-backup/` (`cd .migration-backup && PORT=5000 npm run dev`; Express serves on port 5000, Vite dev server runs internally on port 5001, Express proxies non-`/server` requests to Vite)
- **API server** — workflow `Numatik API Server` starts the separate Express 5 backend package (`PORT=8080 pnpm --filter @workspace/api-server run dev`); requires `DATABASE_URL`. Note: the live app currently talks to the Express server bundled inside `.migration-backup/server.ts` (port 3001), not yet this `@workspace/api-server` package — see Gotchas.
- Registered `artifact.toml` files exist for `numatik`, `api-server`, and `mockup-sandbox` under `artifacts/*/.replit-artifact/`, but on this import `listArtifacts()`/`listWorkflows()` came back empty — the artifact registration wasn't preserved across the GitHub import, so plain `configureWorkflow` workflows (`Numatik Web`, `Numatik API Server`) were created instead. If artifact-managed workflows (`artifacts/numatik: web`, etc.) ever appear in `listWorkflows()`, prefer those and remove the manual ones.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (needed for backend only)
- First-time setup after import: run `pnpm install` at the repo root (workspace packages) **and** `npm install` inside `.migration-backup/` separately — `.migration-backup` is a plain npm project with its own `node_modules`, not a pnpm workspace member, and its `node_modules` isn't committed.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The live Numatik frontend calls its own bundled Express server (`.migration-backup/server.ts`, port 3001) for `/api/chat`, not the `@workspace/api-server` workspace package. The two are separate backends; reconcile before assuming one API surface.
- The AI tutor chat endpoint (`/api/chat` in `.migration-backup/server.ts`) needs `GROQ_API_KEY`. Without it the endpoint returns a friendly 503 but the rest of the app works fine — this secret has not been set yet.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
