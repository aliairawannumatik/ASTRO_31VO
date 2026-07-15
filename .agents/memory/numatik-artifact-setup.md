---
name: Numatik artifact setup
description: How .migration-backup is wired as a registered artifact; port/PATH gotchas that caused proxy failures; trilingual (id/en/ja) page pattern and progress.
---

## Fresh import / re-clone checklist
- After a fresh GitHub import (or any time node_modules is missing), two separate installs are needed: `pnpm install` at the workspace root (covers `artifacts/*`, `lib/*`), AND a separate `npm install` inside `.migration-backup/` — it is deliberately excluded from `pnpm-workspace.yaml`'s `packages:` list and uses its own npm-based scripts (`./node_modules/.bin/tsx`, `./node_modules/.bin/vite`), so pnpm install alone leaves it broken (`sh: tsx: No such file or directory`).
- No artifact is registered for this project (`listArtifacts()` returns empty, confirmed again on a later import) — screenshot via `externalUrl` on the repl's dev domain root, not the `appPreview` source (which requires a registered artifactDirName).
- Confirmed again on a later re-import: the two-install step above plus restarting `Numatik Web` and `Numatik API Server` is sufficient to get the app fully working again — no other config changes needed. `Numatik API Server` builds and starts cleanly on port 8080 even without `DATABASE_URL` set (only fails later if a DB-backed route is actually hit).

## Artifact wiring
- The `numatik` web artifact serves from `.migration-backup/` (not a fresh `artifacts/` dir). As of 2026-07-15 the project now has REAL registered artifacts (`numatik`, `api-server`, `mockup-sandbox`) with their own managed workflows (`artifacts/numatik: web`, `artifacts/api-server: API Server`) — these are now canonical. Use `Screenshot` with `appPreview`/`artifactDirName: "numatik"` instead of externalUrl now that the artifact exists.
- When artifacts first get registered, the OLD manually-configured workflows (`Numatik Web`, `Numatik API Server`) kept existing side-by-side and collided on the same ports (`EADDRINUSE`) with the new artifact-managed ones. Fix: `removeWorkflow` the old duplicates, then restart the `artifacts/...` ones. If a port is still stuck after removing the workflow config, an orphan process may still hold it (`lsof -i :<port>` then `kill -9 <pid>`) — restarting the workflow alone doesn't kill leftover processes from a previous failed run.
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

## Lesson: a file's self-reported "100% done" status can be stale — always grep-audit before trusting it
On 2026-07-15 a status claim of "TabungPage, KerucutPage, BolaPage, GabunganPage = 100% done" (including an earlier memory entry here saying BolaPage was COMPLETE) turned out to be wrong on re-audit: all 4 files have the trilingual *infrastructure* (useLanguage, pageTrans, levelLabel, ExampleCard with language prop) but each still has several hardcoded-Indonesian-only example-problem questions/answers (`<p>Sebuah ...`, `Diketahui:`, `Tentukan:`, `✅ Jawaban:` not wrapped in a `language === "id" ? ... : ...` ternary). Before trusting any "done" claim for these files, grep for `Sebuah|Diketahui|Tentukan|Jawaban` outside of a `language ===` conditional.

## BRSL (materi-matematika/kelas9) file status as of 2026-07-15 audit
- `BangunRuangSisiLengkungPage.tsx` (hub, 22→~60 lines) — DONE. Converted to the `subtopicsId/En/Ja` + ternary title/kelas/backLabel pattern (see `BilanganBerpangkatPage.tsx` for the canonical hub-page convention to copy).
- `PerubahanVolumePage.tsx` — DONE (fully trilingual incl. example problems, level badges, "SOAL"→Problem/問題 prefix, show/hide toggle).
- `TabungPage.tsx` (2909 lines) — PARTIAL. 9 example problems total, ~6 still have hardcoded-Indonesian question openers/"Diketahui:"; a couple of `✅ Jawaban:` conclusion lines not ternary-wrapped.
- `KerucutPage.tsx` (3250 lines) — PARTIAL, most work remaining. 9 example problems, 8 still hardcoded. Also has a separate interactive quiz component (fields `soal`, `headerSub`, `salahPrefix`, `periksaBtn`) that is 100% hardcoded Indonesian and not yet touched.
- `BolaPage.tsx` (2575 lines) — PARTIAL (despite earlier "COMPLETE" memory note, corrected above). 9 example problems, ~5 still have hardcoded question openers (basketball/mosque-dome/plastic-ball/aquarium examples etc.); scale calculator and slides 1-5 prose look done.
- `GabunganPage.tsx` (1114 lines, smallest) — DONE (2026-07-15). Re-check found all 5 examples were ALREADY id/en/ja-ternary-wrapped (the raw-grep "Sebuah/Diketahui/Jawaban" hits were inside the `id` branch, not unwrapped hardcode — same false-positive pattern as the BolaPage lesson above). Real bug found & fixed: 2 of the 5 examples (both `getVolExamples` ones) had EN/JA branches that copy-pasted the ID branch's `{,}`-decimal-comma KaTeX numerals unchanged instead of converting to `.`-decimal / `,`-thousands. Lesson: when auditing "is this example translated", check for stray `{,}` decimal separators inside EN/JA BlockMath strings, not just presence/absence of Indonesian prose.
- Note: `PerubahanVolumePage.tsx` filename also exists under `latihan-mandiri/kelas9/...` — always confirm menu context ("Buku Animasi Matematika" = materi-matematika) before editing.

## KerucutPage.tsx (materi-matematika) audit as of 2026-07-15 — status was worse than believed, but in the opposite direction
Prior belief (per user) was "8 of 9 examples + interactive quiz still hardcoded Indonesian." Actual grep audit found the OPPOSITE gap:
- All 9 example problems (gp/luas/vol × 3 levels each, via `gpExamplesTrans`/`luasExamplesTrans`/`volExamplesTrans` Record<Language,...>) are already fully translated id/en/ja, including correctly-converted number formats (comma-thousand/period-decimal for en/ja vs period-thousand/comma-decimal for id) — no stray `{,}` or leftover Indonesian prose found in en/ja branches.
- The interactive quiz (`UnsurSoalQuiz`, `soalUnsurTrans`, `unsurQuizUiTrans`) is also already fully translated via the same Record<Language,...> pattern.
- The REAL untranslated gap is the slide navigation chrome, which has zero language branching at all: `← Sebelumnya` / `Selanjutnya →` / `← Kembali ke Bangun Ruang Sisi Lengkung` hardcoded plain strings (no `language ===` check, no lookup table) near the end of the file, plus the word "Slide" in the slide-counter label.
- Lesson: don't trust a status claim in either direction (over- or under-stating hardcoded content) — grep-audit `Sebuah|Diketahui|Tentukan|Jawaban|{,}` AND separately check the non-content chrome (nav buttons, counters, back-links) since translation work tends to focus on question/example content and skip page furniture.
- Fixed 2026-07-15: the 4 nav-chrome strings (Previous/Next/Back-to-hub button labels + "Slide" counter word) converted to inline `language === "id" ? ... : language === "ja" ? ... : ...` ternaries (not a Record<Language,...> lookup, since it's only used once each) — this closes out KerucutPage.tsx as fully trilingual. Verified via `?lang=en`/`?lang=ja` query param screenshots.

## BRSL Kelas 9 — 100% COMPLETE as of 2026-07-15 (final verification passed)
All 6 files (hub `materi-matematika/kelas9/BangunRuangSisiLengkungPage.tsx` + Tabung/Kerucut/Bola/Gabungan/PerubahanVolume under the `bangun-ruang-sisi-lengkung/` subfolder) verified together:
- Full-project `tsc --noEmit` (run from `.migration-backup/`) — 0 errors.
- Grep for `SEBELUMNYA|SELANJUTNYA|KEMBALI|DIKETAHUI|DITANYA|JAWABAN|MUDAH|SEDANG|SULIT` across all 6 files — the only hits are `MUDAH/SEDANG/SULIT` used as internal level-metadata keys (`level: "MUDAH"`, and the `levelLabels` lookup table itself), never leaked as raw rendered text; `SEBELUMNYA/SELANJUTNYA/KEMBALI/DIKETAHUI/DITANYA/JAWABAN` had zero hits anywhere (already lowercase/mixed-case and properly branched).
- Hub page screenshot-verified in en ("CURVED SURFACE SOLIDS" + Cylinder/Cone/Sphere/Surface Area and Volume Changes of Curved Surface Solids/Combined Curved Surface Solids) and ja ("曲面体" + 円柱/円錐/球/曲面体の表面積・体積の変化/組み合わせ立体).
- Topic is closed; any future work on these files is a new increment, not a continuation of this trilingual pass.
