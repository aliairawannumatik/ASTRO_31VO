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
All three Statistika materi pages now confirmed trilingual and verified via screenshot: `StatistikaPage.tsx` (hub), `KuartilPage.tsx`, `PenyebaranDataPage.tsx` (plus its embedded `JangkauanAnimasi.tsx` and `JIKdanSKAnimasi.tsx`). Do not assume other materi pages elsewhere in the app are trilingual without grepping for `useLanguage` first — prior claims about translation status were unreliable and required a fresh audit.
