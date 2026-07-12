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

## Screenshot verification limitation on heavy pages
Some Numatik pages (e.g. KerucutPage, TabungPage — large files with 100+ KaTeX elements, mathjs, framer-motion, canvas animations) frequently fail to render in time for the externalUrl Screenshot tool: it captures either the "MEMUAT..." splash or a blank white frame, even after clearing Vite's dep-optimizer cache and confirming the server responds fast with no console/workflow errors. Root page also failed most attempts and only succeeded once.
**Why:** appears to be a screenshot-tool timing/headless-browser characteristic for this specific heavy dev-mode SPA, not a code bug — reproduces identically on pages that were never touched in a session.
**How to apply:** don't burn many retries chasing a screenshot on these pages. After a handful of attempts, fall back to code-level verification (tsc --noEmit, grep the source for expected translated strings, confirm HMR applies cleanly with no error in workflow logs) and report that visual screenshot capture was inconclusive for this specific heavy page. A `?slide=N` URL param was added to KerucutPage (materi-matematika variant) reading `useState(initialSlideFromQueryParam)` so specific slides can be deep-linked for screenshotting instead of always landing on slide 0 — apply the same pattern to other multi-slide pages if verification requires jumping past slide 1.

## Trilingual coverage gaps found in decorative SVG/canvas components
Slide content objects (e.g. `slideNTrans` with id/en/ja keys) are the primary translation layer and are usually done correctly, but several hand-drawn `<svg>`/`<canvas>` diagram components in KerucutPage (materi-matematika) render hardcoded Indonesian text with no `language` prop at all: `InteractiveCone3D` (used in Slide 1 — "Drag untuk memutar", "T (puncak)", "SELIMUT"/"ALAS" labels, "Kerucut 3D" button), and `LuasKerucutSVG`/`VolumeKerucutSVG` (Slide 5/6 diagrams — "SELIMUT"/"ALAS" labels). Contrast with `ConeNetAnimation`, `UnsurSVG`, `KerucutUnsurCountSVG`, `SelimutJuringAnimSVG`, which correctly take and use a `language` prop.
**Why:** these diagrams were likely built before the trilingual pass, or added without following the established `language` prop convention used elsewhere in the same file.
**How to apply:** when doing a trilingual pass on a slide, don't just check the surrounding prose — grep for the diagram component used in that slide's JSX and confirm it accepts and threads through a `language` prop. If it doesn't, that's a real gap even if the visible prose text was already translated. Fixed in KerucutPage (materi-matematika): `InteractiveCone3D`, `LuasKerucutSVG`, `VolumeKerucutSVG` now all take `language` — grep the exact component name before assuming a fix in one page/component means the same bug is fixed elsewhere.

## Re-import recovery is a repeatable recipe now
Confirmed on a second fresh import (2026-07-12): no `node_modules` anywhere, no registered artifacts/workflows. Recipe that works: `pnpm install` at workspace root + `npm install` inside `.migration-backup` (separate, both required), then start/restart the two plain `configureWorkflow` workflows (`Numatik Web` waiting on port 5000, `Numatik API Server` waiting on port 8080) — no artifact recreation needed since manual workflows already exist. `GROQ_API_KEY` still unset; AI tutor chat 503s but rest of app works. Root page screenshot succeeded on the 2nd `externalUrl` attempt after a blank first try — consistent with the known headless-timing quirk, not a real bug; don't over-retry, just try once or twice more before falling back to code-level checks.

## Remaining known subscript-convention debt in KerucutPage (materi-matematika)
Later slides beyond the initial 6 (worked example / practice problems, e.g. `L_{\text{selimut}}`, `V_{\text{pasir}}`, `r_{\text{pasir}}`, `t_{\text{pasir}}` in BlockMath) still use the old natural-language-word KaTeX subscript style, not yet converted to the `L_s`/`V_2`/`r_2`/`t_2`-style short Latin subscripts used in slides 1-6.
**Why:** trilingual/formula-convention passes have been done incrementally slide-by-slide; later slides haven't been reached yet.
**How to apply:** before assuming the whole file is convention-compliant, grep for `\text{` inside `BlockMath`/`InlineMath` across the whole file, not just the slide range just edited.
