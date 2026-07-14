---
name: Numatik artifact setup
description: How .migration-backup is wired as a registered artifact; port/PATH gotchas that caused proxy failures; trilingual (id/en/ja) page pattern and progress.
---

## Fresh import / re-clone checklist
- After a fresh GitHub import (or any time node_modules is missing), two separate installs are needed: `pnpm install` at the workspace root (covers `artifacts/*`, `lib/*`), AND a separate `npm install` inside `.migration-backup/` — it is deliberately excluded from `pnpm-workspace.yaml`'s `packages:` list and uses its own npm-based scripts (`./node_modules/.bin/tsx`, `./node_modules/.bin/vite`), so pnpm install alone leaves it broken (`sh: tsx: No such file or directory`).
- No artifact is registered for this project (`listArtifacts()` returns empty, confirmed again on a later import) — screenshot via `externalUrl` on the repl's dev domain root, not the `appPreview` source (which requires a registered artifactDirName).
- Confirmed again on a later re-import: the two-install step above plus restarting `Numatik Web` and `Numatik API Server` is sufficient to get the app fully working again — no other config changes needed. `Numatik API Server` builds and starts cleanly on port 8080 even without `DATABASE_URL` set (only fails later if a DB-backed route is actually hit).

## Artifact wiring
- The `numatik` web artifact serves from `.migration-backup/` (not a fresh `artifacts/` dir) via the manually-configured `Numatik Web` workflow (`PORT=3001`). This is the one that actually works for previews/screenshots.
- The system periodically auto-re-registers duplicate workflows (`artifacts/numatik: web`, `Numatik API Server`, `artifacts/api-server: API Server`) that collide on the same ports and fail (`EADDRINUSE` / "Port already in use"). This is a recurring, harmless-so-far environment quirk — `Numatik Web` keeps running fine regardless. Not something the user has asked to fix; leave alone unless it starts affecting the working workflow.
- Route paths use a hyphen in "kelas-9" (e.g. `/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/<shape>`), even though the source directory is `kelas9` (no hyphen).

## Trilingual (id/en/ja) page pattern
Established across TabungPage.tsx, KerucutPage.tsx, and BolaPage.tsx:
- `useLanguage()` + `type Language` from `@/contexts/LanguageContext`.
- Page-level `pageTrans = { id: {title, subtitle}, en: {...}, ja: {...} }`, read as `const pt = pageTrans[language]` in the page component, rendered in the H1/subtitle.
- Per-slide translation objects (e.g. `slide1Trans`, `slide2Trans`) keyed by language, holding both plain strings and JSX nodes (for embedded `<strong>`/`<InlineMath>`), consumed inside a `getSections(language): Sec[]` function (not a module-level constant) so slide content re-renders on language change.
- SVG/animation sub-components must accept a `language: Language` prop and their own local `xTrans` object — hardcoding text inside these was a recurring bug class (KerucutPage) since they don't inherit page-level translation state automatically.
- Example-problem slides (`ExampleCard`, `unsurExamples`/`luasExamples`/`volExamples` etc.) follow a separate, later-stage translation pass with `get*Examples(language)` helpers and shared `toggleLabelsTrans`/prefix translation objects — historically done as its own increment, not bundled with the main content slides.

## Lesson: verify the user's named component against the actual render tree
When a user names a specific SVG/animation component to fix as part of a slide range, always grep for its actual `<ComponentName .../>` usage in the file before scoping work — do not trust the name-to-slide association from memory/description alone. Component names can be similar (e.g. `InteractiveHalfSphere3D` vs `HalfSphereTo3CirclesAnimation`) and get confused; some defined components turn out to be dead code (never rendered anywhere), similar to the earlier `gpExamples`-unused-data pattern. Flag the mismatch/dead code back to the user rather than guessing.

## BolaPage.tsx progress — COMPLETE (all live/rendered content trilingual)
- All 8 slides (Definisi, Unsur-unsur, Luas Permukaan, Volume, Kesimpulan, 3 example-problem slides) are now fully id/en/ja, including nav buttons, back-link, example-card show/hide toggle, level badges (MUDAH/SEDANG/SULIT → EASY/MEDIUM/HARD → 基本/標準/発展), and prefix badges.
- Applied the agreed KaTeX subscript scheme throughout (`L_l`, `V_b`, `d_a`, `r_b`, `r_{tb}`, `V_{tb}`, `V_o`, plus pseudo-vars `n` for kaleng-count and `H` for biaya/cost) — BlockMath/InlineMath formulas themselves are NOT translated/reformatted per language (kept in Indonesian-style numeral formatting, e.g. `3{,}14`, `1.808{,}64`) across id/en/ja; only surrounding prose and currency symbol (`Rp` for id, others for en/ja) are language-gated.
- The example-problem arrays (`unsurExamples`/`luasExamples`/`volExamples`) were converted from module-level consts to `get*Examples(language)` functions, mirroring TabungPage's pattern.
- Confirmed dead code (defined but never rendered anywhere in the file, so their hardcoded-Indonesian text is harmless): `UnsurBolaSVG`, `HalfSphereTo3CirclesAnimation`, `LuasBolaSVG`, `VolumeBolaSVG`, `SeparasiBolaSegitigaSVG`.
- Caught mid-task: `SphereFruitCutAnimation` and `WaterBolaAnimation` (used live in Slides 3–4) had hardcoded Indonesian button/status text not covered by the earlier "Slide 3/4 done" note — added a `language` prop to both and gated their text, confirming the general lesson above about animation sub-components not inheriting page-level language state automatically.
