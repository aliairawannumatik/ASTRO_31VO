---
name: Numatik artifact setup
description: How .migration-backup is wired as a registered artifact; port/PATH gotchas that caused proxy failures; trilingual (id/en/ja) page pattern and progress.
---

## Fresh import / re-clone checklist
- After a fresh GitHub import (or any time node_modules is missing), two separate installs are needed: `pnpm install` at the workspace root (covers `artifacts/*`, `lib/*`), AND a separate `npm install` inside `.migration-backup/` — it is deliberately excluded from `pnpm-workspace.yaml`'s `packages:` list and uses its own npm-based scripts (`./node_modules/.bin/tsx`, `./node_modules/.bin/vite`), so pnpm install alone leaves it broken (`sh: tsx: No such file or directory`).
- No artifact is registered for this project (`listArtifacts()` returns empty, confirmed again on a later import) — screenshot via `externalUrl` on the repl's dev domain root, not the `appPreview` source (which requires a registered artifactDirName).

## Artifact wiring
- The `numatik` web artifact serves from `.migration-backup/` (not a fresh `artifacts/` dir) via the manually-configured `Numatik Web` workflow (`PORT=3001`). This is the one that actually works for previews/screenshots.
- The system periodically auto-re-registers duplicate workflows (`artifacts/numatik: web`, `Numatik API Server`, `artifacts/api-server: API Server`) that collide on the same ports and fail (`EADDRINUSE` / "Port already in use"). This is a recurring, harmless-so-far environment quirk — `Numatik Web` keeps running fine regardless. Not something the user has asked to fix; leave alone unless it starts affecting the working workflow.
- Route paths use a hyphen in "kelas-9" (e.g. `/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/<shape>`), even though the source directory is `kelas9` (no hyphen).

## Trilingual (id/en/ja) page pattern
Established across TabungPage.tsx, KerucutPage.tsx, and (partially) BolaPage.tsx:
- `useLanguage()` + `type Language` from `@/contexts/LanguageContext`.
- Page-level `pageTrans = { id: {title, subtitle}, en: {...}, ja: {...} }`, read as `const pt = pageTrans[language]` in the page component, rendered in the H1/subtitle.
- Per-slide translation objects (e.g. `slide1Trans`, `slide2Trans`) keyed by language, holding both plain strings and JSX nodes (for embedded `<strong>`/`<InlineMath>`), consumed inside a `getSections(language): Sec[]` function (not a module-level constant) so slide content re-renders on language change.
- SVG/animation sub-components must accept a `language: Language` prop and their own local `xTrans` object — hardcoding text inside these was a recurring bug class (KerucutPage) since they don't inherit page-level translation state automatically.
- Example-problem slides (`ExampleCard`, `unsurExamples`/`luasExamples`/`volExamples` etc.) follow a separate, later-stage translation pass with `get*Examples(language)` helpers and shared `toggleLabelsTrans`/prefix translation objects — historically done as its own increment, not bundled with the main content slides.

## Lesson: verify the user's named component against the actual render tree
When a user names a specific SVG/animation component to fix as part of a slide range, always grep for its actual `<ComponentName .../>` usage in the file before scoping work — do not trust the name-to-slide association from memory/description alone. Component names can be similar (e.g. `InteractiveHalfSphere3D` vs `HalfSphereTo3CirclesAnimation`) and get confused; some defined components turn out to be dead code (never rendered anywhere), similar to the earlier `gpExamples`-unused-data pattern. Flag the mismatch/dead code back to the user rather than guessing.

## BolaPage.tsx progress
- Trilingual work done so far: page title/subtitle, Slide 1 (Definisi Bola), Slide 2 (Unsur-unsur Bola), and the two SVG components actually used there (`InteractiveSphere3D`, `InteractiveHalfSphere3D`).
- Confirmed dead code (defined but never rendered anywhere in the file): `UnsurBolaSVG`, `HalfSphereTo3CirclesAnimation`, `LuasBolaSVG`, `VolumeBolaSVG`, `SeparasiBolaSegitigaSVG`. `SphereFruitCutAnimation` and `WaterBolaAnimation` are used, but in Slides 3–4 (Luas Permukaan / Volume), not yet translated.
- Still pending (not yet started): Slides 3–8 (Luas Permukaan, Volume, Kesimpulan, 3 example-problem slides), plus a KaTeX `\text{}` cleanup with an already-agreed subscript scheme (`L_{\text{bola}}→L_b`, `V_{\text{bola}}→V_b`, `d_{\text{alas}}→d_a`, `L_{\text{lengkung}}→L_l`, `r_{\text{bola}}→r_b`, `r_{\text{tab}}→r_{tb}`, `V_{\text{tab}}→V_{tb}`, `V_{\text{tumpah}}→V_o`) and two pseudo-variable-name replacements (`\text{Kaleng}→n`, `\text{Biaya}→H`, keeping "Rp" for id and "$" for en/ja).
</content>
