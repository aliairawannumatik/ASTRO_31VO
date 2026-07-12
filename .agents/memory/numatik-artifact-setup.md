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
