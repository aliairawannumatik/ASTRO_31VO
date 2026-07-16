---
name: Numatik artifact setup
description: .migration-backup wiring, port gotchas, trilingual page pattern, Statistika materi translation status
---

## Environment / infra
- This project (`numatik`) has an `artifacts/numatik` directory but **no `artifact.toml`** — predates/bypasses the standard artifacts registration system. The `Screenshot` tool's `appPreview` mode cannot target it via `artifactDirName` ("Artifact not found").
- Runtime: `.migration-backup/package.json`'s `dev` script runs `tsx watch server.ts` (Express API) **and** `vite --port 5000` (frontend) concurrently. The workflow sets `PORT=3001`, which binds the Express API only; Vite always serves the actual SPA on port 5000 regardless of that env var. Port 3001 404s on frontend routes.
- Correct screenshot method for this project: `Screenshot` with `source.type: "externalUrl"` pointed at `https://$REPLIT_DEV_DOMAIN/<route>?lang=xx` (confirmed working). Get the live domain via `echo $REPLIT_DEV_DOMAIN` in shell first — do not guess/placeholder it.
- Route convention: URLs use hyphenated `kelas-9` (e.g. `/materi-matematika/kelas-9/statistika/kuartil`) even though the file-system path segment is `kelas9` (no hyphen) — confirmed via `App.tsx` route table.

## Trilingual (id/en/ja) page pattern
- Language context: `useLanguage()` from `@/contexts/LanguageContext`, exposes `language: "id"|"en"|"ja"`. Type import: `import type { Language } from "@/contexts/LanguageContext"`.
- Hub/list pages (e.g. `StatistikaPage.tsx`): build `subtopicsId/En/Ja` arrays + language-switched title/kelas/backLabel, feed into shared `MateriTopicPage` component.
- Content-heavy materi pages (e.g. `KuartilPage.tsx`, `PenyebaranDataPage.tsx`): use small trans dictionaries for repeated short UI strings (buttons, labels, headers), but for prose-heavy worked examples use inline ternary JSX blocks per language (`language === "id" ? (...) : language === "en" ? (...) : (...)`) rather than one flat dictionary — keeps structure/markup per-language readable.
- Interactive sub-components embedded in materi pages (e.g. `JangkauanAnimasi.tsx`, `JIKdanSKAnimasi.tsx`, `KuartilAnimasiMateri.tsx`) take a `language?: Language` prop (default `"id"`) and a `trans` dict covering every hardcoded UI string; animation/state logic stays untouched, only string literals get replaced with `t.xxx` lookups.
- KaTeX rule: `\text{}` in `BlockMath`/`InlineMath` must only contain non-italic label text, never language-specific prose annotations (units like "cm"/"orang"/"hari", or phrases like "posisi ... FK pertama ≥ ..."). Move such annotations to surrounding JSX, or use `\,\mathrm{}` for short unit labels (translated per language, e.g. id `\mathrm{orang}`, en `\mathrm{people}`, ja `\mathrm{人}`).
- Verification bar: `npx tsc --noEmit` in `.migration-backup` must report 0 errors after a rewrite, then screenshot `?lang=en` and `?lang=ja` via the externalUrl method above to visually confirm.

## Status (as of 2026-07-15)
All six Statistika materi pages confirmed trilingual and screenshot-verified:
- `StatistikaPage.tsx` (hub)
- `KuartilPage.tsx` ✅
- `PenyebaranDataPage.tsx` ✅ (plus embedded `JangkauanAnimasi.tsx`, `JIKdanSKAnimasi.tsx`)
- `PengantarStatistikaPage.tsx` ✅ (route: `/materi-matematika/kelas-9/statistika/pengantar`)
- `RataRataPage.tsx` ✅ (route: `/materi-matematika/kelas-9/statistika/rata-rata`)
- `MedianModusPage.tsx` ✅ (route: `/materi-matematika/kelas-9/statistika/median-modus`) — includes two embedded interactive animators (`MedianAnimator`, `ModusAnimator`) that each call `useLanguage()` directly (defined in the same file, so no `language` prop needed, same pattern as the calculator sub-components below). Sibling `latihan-mandiri/kelas9/statistika/MedianModusPage.tsx` (practice-exercise page) is a **separate file** and was intentionally left untouched — always double check whether "soal" in a request refers to worked examples in the materi page vs. the separate latihan-mandiri exercise file before assuming scope.

## Correct workflow to start
The only workflow that should run the app is `artifacts/numatik: web`. The manual `Numatik Web` and `Numatik API Server` workflows have been permanently removed — they conflicted on ports 5000/5001/8080. If the artifact fails, check for any manual workflows still running and stop/remove them first, then restart `artifacts/numatik: web`.

## Port architecture
Express is the public-facing server on PORT=5000 (injected by artifact system via `services.env.PORT = "5000"`). Vite dev server runs internally on port 5001 (`VITE_PORT=5001` in `services.env`). Express proxies all non-`/server` requests to Vite via http-proxy-middleware (including WebSocket HMR). This avoids the double-proxy 502 bug where Replit proxy → Vite proxy → Express caused POST bodies to fail.

**artifact.toml must have `PORT = "5000"` in `[services.env]` to match `localPort = 5000`.** If these disagree, Express binds the wrong port and the preview shows blank. Fix via `verifyAndReplaceArtifactToml`.

**Why this matters:** Artifact `api-server` claims `paths=["/api"]` at localPort 8080 (not running). Any fetch to `/api/*` from the browser returns 502. All .migration-backup server endpoints use `/server/*` prefix instead: `/server/pdf` (Puppeteer PDF), `/server/chat` (AI chat). Never use `/api/` for .migration-backup endpoints.

## Screenshot tool limitation (confirmed 2026-07-16)
The `externalUrl` Screenshot tool always catches the React Suspense loading screen (MEMUAT) for this app because the headless browser takes the snapshot before lazy chunks load. Use `npx tsc --noEmit` + code audit instead of screenshots to verify trilingual completeness. If the user reports "app not showing", check browser_console logs first — they confirm if the app is actually running (Vite connecting/connected messages + user interactions).

## Re-import setup (2026-07-15)
After a GitHub re-import, `node_modules` are wiped in both the pnpm workspace root and `.migration-backup` (its own plain-npm project, not committed). Fix: `pnpm install` at root **and** `npm install` inside `.migration-backup` separately, then restart both workflows.
- Curling `/api/chat` (or any `/api/*` POST/GET) against the external `$REPLIT_DEV_DOMAIN` root returns a plain 404 ("Cannot GET/POST ...") even though the identical request against `localhost:5000` correctly returns the expected 503 (missing `GROQ_API_KEY`) — an external-domain proxy quirk for this non-artifact-registered project, not an app bug. Don't chase it; verify real behavior via `localhost:<port>` curl or an actual browser Screenshot instead.
- A first `externalUrl` Screenshot right after workflow restart can catch the SPA mid-hydration (blank white page) even though `curl` shows 200 OK. Retake the screenshot before concluding the app is broken.

## Bola & Kerucut — 100% complete (2026-07-16)
Both `BolaPage.tsx` and `KerucutPage.tsx` (materi-matematika/kelas9/bangun-ruang-sisi-lengkung/) are 100% trilingual and tsc-clean as of this session. Confirmed via deep code audit (all Trans objects + example generators have complete id/en/ja keys). Screenshot tool catches loading screen for these pages consistently — verify via code audit + `npx tsc --noEmit` instead. No remaining work on these pages.

## Statistika Kelas 9 — 100% complete (2026-07-15)
`PenyajianDataPage.tsx` (materi-matematika, 2917 lines — largest page, 5 interactive builders incl. frequency table) is now trilingual and tsc-clean, confirmed via id/en/ja screenshots. This was the last Statistika Kelas 9 materi page; all 7 are now done. Delegated the full rewrite to a `general` subagent (large well-specified single-file task) — worked well; verify with `npx tsc --noEmit` and screenshots after it returns rather than re-reading the whole file yourself.

## Artifact auto-registration (2026-07-15)
Mid-session, the platform automatically added `artifact.toml`-based artifacts (`numatik` web, `api-server`, `mockup-sandbox`) and new `artifacts/*: ...` workflows, without any action from the agent. The pre-existing manual workflows (`Numatik Web`, `Numatik API Server`) kept running fine alongside the new (unstarted) artifact-managed ones — no immediate conflict. Don't assume you need to migrate workflows just because artifact-managed ones appear; only reconcile if the user's task actually touches run configuration.

Notes for future pages:
- Inline calculator sub-components (MeanCalculator, CombinedMeanCalculator) can call `useLanguage()` directly since they are defined in the same file — no need for a `language` prop.
- Calculator components with `useLanguage()` directly must rebuild their label strings at render time. The `groups` useState initial label should be language-neutral (e.g. `""`) or set outside state, not derived from `tc` (which is language-aware). Use the tc label only in display, or re-initialize labels on language change.
- Do not assume other materi pages elsewhere are trilingual without grepping for `useLanguage` first.
