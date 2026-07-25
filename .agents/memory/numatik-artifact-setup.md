---
name: Numatik artifact setup
description: Key wiring details, port quirks, and coding patterns for the Numatik math-education pnpm artifact.
---

## Runtime wiring
- Source of truth: **`artifacts/numatik/src/`** — only edit here.
- Workflow `artifacts/numatik: web` runs `pnpm --filter @workspace/numatik run dev` from `artifacts/numatik/`; Vite binds on `PORT=5000` directly (no Express proxy).
- First-time setup: `pnpm install` at workspace root (not `npm install` in `.migration-backup/`).
- `.migration-backup/` is gitignored but its files are **already tracked** in git (committed before gitignore rule). Do not treat it as the active source; it is dead code.
- `listArtifacts()` returns empty after GitHub import — artifact registration is not preserved. Workflow is manually configured via `configureWorkflow` to match `artifact.toml` intent.
- **Artifact.toml** at `artifacts/numatik/.replit-artifact/artifact.toml` has `id = "artifacts/numatik"`, kind = "web", previewPath = "/", PORT=5000. This is correct — do not modify.

## Languages
- App uses **i18n (react-i18next)** with 3 locales: `id` (Indonesian), `en` (English), `ja` (Japanese).
- Locale files: `artifacts/numatik/src/locales/{id,en,ja}.json`
- Language key stored in localStorage as `numatik_language`.
- **NOT Malay** — earlier memory note was wrong. Third language is Japanese (`ja`).

## Theme system
- Hook: `import { useTheme } from "@/contexts/ThemeContext"` → `const { isDark } = useTheme()`
- Sub-components defined **outside** the main page component can call `useTheme()` directly (they're React components) as long as they are written as proper function bodies (`() => { ... }`, not arrow `() => (...)` shorthand — the shorthand cannot contain hook calls).
- Reference files: `RangkumanSection.tsx`, `DiskriminanPage.tsx`, `PolaKhususPage.tsx`.

## Light-mode color mapping (dark → light)
| Dark class/value | Light equivalent |
|---|---|
| `bg-slate-800/60` | `bg-gray-100` |
| `bg-slate-800/50` | `bg-white/80` |
| `bg-slate-900/60` | `bg-white/90` |
| `bg-slate-900/50` | `bg-gray-100` |
| `bg-slate-700/40` | `bg-gray-50` |
| `bg-slate-700/60` | `bg-gray-200` |
| SVG bg `rgba(15,23,42,0.7)` | `rgba(241,245,249,0.9)` |
| SVG bg `rgba(6,12,30,0.97)` | `rgba(248,250,252,0.97)` |
| SVG bg `rgba(6,12,30,0.95)` | `rgba(248,250,252,0.95)` |
| SVG grid `#1e293b` | `#cbd5e1` |
| SVG grid `#0f1f3d` | `#cbd5e1` |
| SVG axis `#475569` | `#64748b` |
| SVG text `#64748b` | `#475569` |
| SVG text `#4b5563` | `#6b7280` |
| SVG text `#3d5275` | `#64748b` |
| Table alt row 1 `bg-slate-800/30` | `bg-blue-50/50` |
| Table alt row 2 `bg-slate-700/20` | `bg-gray-50` |

## Known scope gotcha
When using replaceAll on SVG stroke patterns, the same pattern string can appear in both a sub-component scope AND the main page component. Verify with grep after replacement that ISG-local variables (e.g. `isgGridMain`, `isgAxisS`) are NOT referenced outside InteractiveStepGraph. Fix: replace those occurrences with direct `isDark ? "..." : "..."` expressions.

## Trilingual exercise page pattern (Latihan Mandiri)
For exercise pages under `src/pages/latihan-mandiri/`:
- Define `QUESTIONS_BY_LANG: Record<"id"|"en"|"ja", Question[]>` **outside** the component (safe as a constant, no hooks).
- Inside component: `const { t, i18n } = useTranslation(); const lang = (["id","en","ja"].includes(i18n.language) ? i18n.language : "en") as "id"|"en"|"ja"; const questions = QUESTIONS_BY_LANG[lang];`
- UI strings (page title, subtitle, back button) go in locale JSON under `practice.<topicKey>.*`.
- Reference: all 6 Bilangan Bulat pages are done and can be used as templates.

## Locale key pattern for topic exercise pages
Add under `practice.<topicKey>` in all 3 locale files:
- `title` — topic page heading
- `soalTotal` — "48 Questions Total · UN / TKA / ANBK"
- `enrichmentNoteDesc` — enrichment note body text
- `pageSubtitle` — "Grade 7 · Integers · Self-Practice"
- `backTo` — back button text
- `subtopics.<subtopicKey>.label` / `.desc` — subtopic cards
- `pageTitles.<subtopicKey>` — exercise page h1

## SVG color mapping (PrismaPage / water-animation pattern)
| Dark SVG value | Light SVG value |
|---|---|
| wireframe face `rgba(30,41,59,0.8)` | `rgba(241,245,249,0.9)` |
| wireframe face `rgba(30,41,59,0.5)` | `rgba(241,245,249,0.7)` |
| structural stroke `#334155` | `#94a3b8` |
| bg face fill `#0f172a` opacity 0.22 | `rgba(241,245,249,0.9)` opacity 1 |
| bg face fill `#0f172a` opacity 0.15 | `rgba(241,245,249,0.9)` opacity 1 |
| top cap `#0f172a` (isFull conditional) | `rgba(241,245,249,0.9)` opacity 1 |
| gauge bar bg `#0f172a` | `rgba(241,245,249,0.9)` |
| formula text `#e0e7ff` | `#1e293b` |
- Dimension labels `#94a3b8` (slate-400) and bright hue fills are visible on both themes — leave unchanged.
- `fill="white"` inside `<mask>` elements is SVG semantic — do not change.
- Bright face-color fills (#ef4444, #eab308, #3b82f6, etc.) are fine on both themes.
- `stroke="rgba(255,255,255,0.5)"` on bright-colored rotating 3D polygons is intentional (BalokPage same pattern).

## Translation progress
- Kelas 8 PGL pages (GrafikPGLPage, MenentukanPGLPage): dark-mode color fixes applied July 2026.
- PrismaPage.tsx: Pass 1 (JSX classNames) + Pass 2 (all SVG colors) complete — fully theme-clean.
- Kelas 9 Kesebangunan: trilingual support incomplete (task proposed).
- **Kelas 7 Bilangan Bulat (all 6 exercise sub-pages + index)**: Fully trilingual (id/en/ja) as of July 2026. Pattern is proven and ready to replicate to other Kelas 7 topics.
- **Kelas 7 Pecahan — ArtiPecahanSenilaiMembandingkanPage.tsx + BilanganRasionalPage.tsx (index)**: Fully trilingual (id/en/ja) as of July 2026. New JSX-soal pattern documented below.
- **Kelas 7 Pecahan — PecahanCampuranPersenPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.pecahanCampuran`. 10 essay questions. Uses Trans for q4.itemA (two fraction components: frac1, frac2) and q5.instruction (one fraction component: frac). itemBSuffix pattern used for q8 item b (InlineMath + translated suffix).
- **Kelas 7 Pecahan — PenjumlahanPecahanPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.penjumlahanPecahan`. 9 essay questions. Shared `calcInstruction` key reused across soals 1,2,4,5,6. InstructionBanner uses Trans with `<strong>` component. Soal 3 conclusion uses Trans with `<a>/<b>` components for styled letters. Soals 8 and 9 use Trans with f1/f2/f3 fraction components. Screenshot verified in Indonesian. 7 remaining Pecahan sub-pages still need trilingual treatment.
- **Kelas 7 Pecahan — PerkalianPecahanPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.perkalianPecahan`. 6 essay questions. InstructionBanner uses Trans with `<strong>`. Soal 1–3 pure math grids (no text, arrow shorthand OK). Soal 4 uses `t()` for distributive property instruction. Soals 5 & 6 use Trans with f1/f2 components for inline fraction math. Tags moved inside page component. TypeScript 0 errors verified. 5 remaining Pecahan sub-pages still need trilingual treatment.
- **Kelas 7 Pecahan — PembagianPecahanPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.pembagianPecahan`. 8 essay questions. No InstructionBanner. Shared `calcInstruction` key reused for Soal 2 & 8 ("Hitunglah hasil operasi pecahan berikut!"). Soals 3–6 contextual: use Trans with f1/f2 components. Soals 1 & 7 use t() for instruction + pure math grid. Tags moved inside page component. Screenshot verified in Indonesian. 5 remaining Pecahan sub-pages still need trilingual treatment.

## JSX-soal trilingual pattern (Pecahan pages — different from Bilangan Bulat)
Pecahan soal components are JSX components (not data arrays). Key differences:
- Change each `SoalX` from arrow shorthand `() => (...)` to function body `() => { const { t } = useTranslation(); return (...); }` — hooks can't be called in shorthand bodies.
- Move the `cards` array (which contains tag labels) **inside** the page component so it can call `t()` for tag strings.
- For inline math symbols inside prose text (e.g. `<InlineMath math=">" /> atau <InlineMath math="<" />`), use `<Trans i18nKey="..." components={{ gt: <InlineMath math=">" />, lt: <InlineMath math="<" /> }} />` — import `Trans` from `react-i18next`.
- Locale keys live under `practice.pecahan.<pageKey>.*` (e.g. `practice.pecahan.artiSenilai.q5.instruction`).
- Index page (BilanganRasionalPage): rename `subtopics` const to `subtopicsConfig` (remove `label`/`desc`, add `key`), then derive `subtopics` inside component with `subtopicsConfig.map(s => ({ ...s, label: t(...), desc: t(...) }))`.
- Reference file: `artifacts/numatik/src/pages/latihan-mandiri/kelas7/pecahan/ArtiPecahanSenilaiMembandingkanPage.tsx`
