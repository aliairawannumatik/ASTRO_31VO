---
name: Numatik artifact setup
description: How the Numatik app (from .migration-backup) is wired into the pnpm workspace artifact system
---

## Setup

The Numatik app code lives in `.migration-backup/` (npm project, not a pnpm workspace package).

It is registered as a `kind = "web"` artifact at `artifacts/numatik/` with:
- `previewPath = "/"`
- `localPort = 5000` (Vite dev server, hardcoded via `--port 5000` in npm script)
- `[services.env] PORT = "3001"` — Express backend in server.ts reads `process.env.PORT || 3001`, must stay 3001 so it doesn't collide with Vite
- `run = "cd /home/runner/workspace/.migration-backup && npm run dev"`

**Why PORT=3001 not 18860:** The npm dev script hardcodes `vite --port 5000`, so Vite is always on 5000. Express reads PORT env var. If PORT is set to the artifact-assigned port (18860), Express grabs it and Vite stays on 5000 — proxy routes to Express, not Vite. Fix: set PORT=3001 (Express's own port) and localPort=5000 (Vite).

**Why absolute path:** Artifact workflow runs from a different working directory, so `cd .migration-backup` fails. Must use `/home/runner/workspace/.migration-backup`.

The scaffold files at `artifacts/numatik/src/` are unused stubs (from createArtifact bootstrap). Do not delete them — the artifact system expects them. The real app is entirely in `.migration-backup/`.

## GitHub re-import loses artifact registration

After a fresh GitHub import of this repo (2026-07-12), `artifacts/*/.replit-artifact/artifact.toml` files were present on disk (numatik, api-server, mockup-sandbox) but `listArtifacts()` and `listWorkflows()` both came back empty — the artifact-managed workflows referenced in this file (`artifacts/numatik: web`, `artifacts/api-server: API Server`) did not exist and `WorkflowsRestart`/`createArtifact` couldn't recreate them (createArtifact refuses when the slug directory already exists).

**Why:** artifact registration/workflow state lives outside the git-tracked files and isn't reconstructed automatically from `artifact.toml` on import.

**How to apply:** if this happens again, don't fight it — use the plain `configureWorkflow` callback to start the same dev commands directly (e.g. `cd .../.migration-backup && PORT=3001 npm run dev` waiting on port 5000; `PORT=8080 pnpm --filter @workspace/api-server run dev` waiting on port 8080). Screenshot via `externalUrl` against `$REPLIT_DEV_DOMAIN` instead of `appPreview` (which requires a registered artifact). If artifact-managed workflows later reappear in `listWorkflows()`, switch back to those and remove the manual ones.

## Fresh GitHub import also has no node_modules anywhere

A fresh import ships zero `node_modules` in both the pnpm workspace root and `.migration-backup` (separate npm project). Workflow failures show as `tsx: not found` / `vite: not found` (Numatik Web) and `Cannot find package 'esbuild'` (API server, which builds via `pnpm --filter @workspace/api-server`).

**Why:** git doesn't track node_modules; import doesn't auto-install either project since `.migration-backup` isn't part of the pnpm workspace.

**How to apply:** run `pnpm install` at the workspace root AND `npm install` inside `.migration-backup` separately before restarting workflows — one install does not cover the other.
