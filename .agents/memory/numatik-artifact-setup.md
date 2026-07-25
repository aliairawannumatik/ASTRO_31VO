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

## Soal 7 formula var pattern
When a KaTeX formula contains a language-specific word (e.g. `\text{jarak}`), use a locale key for the word and interpolate it into the math string:
```tsx
<InlineMath math={`\\mathrm{${t('...q7.formulaVar')}} = ...`} />
```
Replace `\text{}` with `\mathrm{}` for units; use interpolated `formulaVar` key for natural-language variable names.

## Aljabar index page pattern (AljabarPage.tsx)
- Uses `subtopicsConfig` (outside component) with `key`, visual props only — no `label`/`desc`.
- Inside component: `subtopics = subtopicsConfig.map(s => ({ ...s, label: t(\`practice.aljabar.subtopics.${s.key}.label\`), desc: t(...) }))`.
- Locale keys: `practice.aljabar.subtopics.<key>.label` / `.desc` for 8 keys: `pengertianUnsur`, `penjumlahanPengurangan`, `perkalian`, `pembagian`, `pemangkatan`, `substitusi`, `faktorisasi`, `pecahanAljabar`.
- All 3 locale files now have `practice.aljabar` section; `pengertianUnsur` soal keys also added.
- `enrichmentNoteDesc` in AljabarPage footer is still hardcoded Indonesian — intentionally deferred.

## Aljabar sub-page trilingual pattern (PengertianUnsurAljabarPage — "cards di luar" variant)
- Converted `cards` array from outside-component (dark-only hardcode) to inside page component with `isDark` ternary.
- Added `import { useTheme }` and `const { isDark } = useTheme()` to page.
- Each `SoalX` converted from arrow shorthand `() => (...)` to function body `() => { const { t } = useTranslation(); return (...); }`.
- `Trans` used for SoalTiga (q3.desc) with named components `n`, `boxes`, `marbles` → `<strong className="text-cyan-300" />`.
- SoalDua uses split `introPre` / `introPost` keys flanking an inline `<InlineMath>` (math formula stays hardcoded, only surrounding prose translated).
- Locale key prefix: `practice.aljabar.pengertianUnsur.q{1|2|3}.*`.

## Aljabar sub-page 2 trilingual pattern (PenjumlahanPenguranganAljabarPage — "cards di dalam" variant)
- Cards sudah di dalam page & `isDark` sudah ada — tidak perlu restrukturisasi.
- Pattern SoalEmpat (multi-InlineMath dalam satu kalimat): split ke 5 key: `introPre`, `introBetween`, `introMid`, `introAnd`, `introEnd`; tiap key mengelilingi satu `<InlineMath>`.
- Pattern SoalLima (kalimat 1 = Trans dengan `<pass>` + `<weight>`, kalimat 2 = split biasa + `<InlineMath>`): gunakan `{' '}` spacer antara Trans dan teks lanjutan.
- SVG `<text>` yang berisi label bahasa alami (bukan rumus): gunakan `{t(...)}` sebagai child langsung — valid di SVG.
- `q4.introPre` untuk bahasa Jepang = `""` (string kosong) karena struktur kalimat JA menempatkan formula lebih dulu.
- Locale keys ditambahkan ke `practice.aljabar.penjumlahanPengurangan.*` di ketiga file locale.

## PLSV & PtLSV topic — cards di luar pattern
- Index + 7 sub-pages all have "cards di luar" structure needing refactor.
- **PenyelesaianPLSVPage.tsx (sub-page 3) — Bagian 1**: SoalSatu/Dua/Tiga trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.plsvPtlsv.penyelesaianPLSV`. 89 total questions across 6 cards. Cards moved inside page component (done once for full file). All 6 card tags + title1/title2/badge translated. q1/q2 instructions use Trans (1 component `a` each — amber/yellow). q3 instruction is plain t() (no styled spans). SoalEmpat/Lima/Enam still arrow shorthand — left for Bagian 2. SoalLima has 5 sub-sections A–E (word problem in E with rectangle diagram).
- **PengertianPLSVPage.tsx (sub-page 2)**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.plsvPtlsv.pengertianPLSV`. 3 essay questions. "cards di luar" restructured. All 3 SoalX items are pure math grids (no item-level text keys needed). Trans used for all 3 instructions (q1: 1 component `a`=amber; q2: 2 components `a`=yellow/`b`=lime; q3: 2 components `a`=green/`b`=rose). q2 itemHint ("persamaan / kesamaan?") uses plain t(). q3 connector ("dan") uses plain t(). h1 split across title1+title2 keys. EN uses "LEOV" (Linear Equation in One Variable) abbreviation.
- **KalimatTerbukaTertutupPage.tsx (sub-page 1)**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.plsvPtlsv.kalimatTerbukaTertutup`. 5 essay questions. "cards di luar" restructured: cards moved inside page component, all SoalX converted from arrow shorthand to function bodies. Trans used for q2.instruction (3 styled spans: a=amber terbuka, b=emerald benar, c=rose salah). Split-key patterns: q2 items d,e,h,i use Pre/Mid/End flanking InlineMath; q3 item a uses Pre/Suffix flanking n; q5 item a uses Mid/Suffix flanking two math expressions. q4/q5 instrPre/instrSuffix wrap a hardcoded bold number-set span. JA q4/q5 instrPre="変数が ", instrSuffix=" の中から選ぶとき、各開いた文の解を求めなさい！". No useTheme needed (no SVG color switching). 6 sub-pages remaining.

## Perbandingan sub-page pattern (flat soal, no cards/tags/isDark)
- Structure: single card, dividers per soal, no cards/tags arrays, no useTheme needed.
- Soals 1–6: plain `t('practice.perbandingan.perbandinganUmum.qN')` strings.
- Soal 7: two `m<sup>2</sup>` — split into `q7.pre` / `<sup>2</sup>` / `q7.mid` / `<sup>2</sup>` / `q7.end`.
- Soal 8, 10: InlineMath in middle — split `qN.pre` + `<InlineMath>` + `qN.post`.
- Soal 9: InlineMath + `cm<sup>3</sup>` — split `q9.pre` + `<InlineMath>` + `q9.mid` + `<sup>3</sup>` + `q9.end`.
- Locale keys under `practice.perbandingan.<subtopicKey>.*`; inject via node script reading/writing JSON.
- Reference: `PerbandinganUmumPage.tsx` (done July 2026).

## Translation progress
- Kelas 8 PGL pages (GrafikPGLPage, MenentukanPGLPage): dark-mode color fixes applied July 2026.
- PrismaPage.tsx: Pass 1 (JSX classNames) + Pass 2 (all SVG colors) complete — fully theme-clean.
- Kelas 9 Kesebangunan: trilingual support incomplete (task proposed).
- **Kelas 7 Bilangan Bulat (all 6 exercise sub-pages + index)**: Fully trilingual (id/en/ja) as of July 2026. Pattern is proven and ready to replicate to other Kelas 7 topics.
- **Kelas 7 Aljabar — PerkalianAljabarPage.tsx (sub-page 3)** + **PembagianAljabarPage.tsx (sub-page 4)**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.aljabar.perkalian`. 8 essay questions. "cards di dalam" variant — no restructuring needed. SoalDelapan uses `introPre`/`introBetween`/`introEnd` split flanking two InlineMath (spaces in key strings for ID/EN; no spaces for JA). SoalTujuh: `q7.patternWord` before `<AlgExpr math={hint} />`. Tags for math-universal notation (Monomial×Monomial etc.) also translated per lang.
- **Kelas 7 Pecahan — ArtiPecahanSenilaiMembandingkanPage.tsx + BilanganRasionalPage.tsx (index)**: Fully trilingual (id/en/ja) as of July 2026. New JSX-soal pattern documented below.
- **Kelas 7 Pecahan — PecahanCampuranPersenPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.pecahanCampuran`. 10 essay questions. Uses Trans for q4.itemA (two fraction components: frac1, frac2) and q5.instruction (one fraction component: frac). itemBSuffix pattern used for q8 item b (InlineMath + translated suffix).
- **Kelas 7 Pecahan — PenjumlahanPecahanPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.penjumlahanPecahan`. 9 essay questions. Shared `calcInstruction` key reused across soals 1,2,4,5,6. InstructionBanner uses Trans with `<strong>` component. Soal 3 conclusion uses Trans with `<a>/<b>` components for styled letters. Soals 8 and 9 use Trans with f1/f2/f3 fraction components. Screenshot verified in Indonesian. 7 remaining Pecahan sub-pages still need trilingual treatment.
- **Kelas 7 Pecahan — PerkalianPecahanPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.perkalianPecahan`. 6 essay questions. InstructionBanner uses Trans with `<strong>`. Soal 1–3 pure math grids (no text, arrow shorthand OK). Soal 4 uses `t()` for distributive property instruction. Soals 5 & 6 use Trans with f1/f2 components for inline fraction math. Tags moved inside page component. TypeScript 0 errors verified. 5 remaining Pecahan sub-pages still need trilingual treatment.
- **Kelas 7 Pecahan — PembagianPecahanPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.pembagianPecahan`. 8 essay questions. No InstructionBanner. Shared `calcInstruction` key reused for Soal 2 & 8 ("Hitunglah hasil operasi pecahan berikut!"). Soals 3–6 contextual: use Trans with f1/f2 components. Soals 1 & 7 use t() for instruction + pure math grid. Tags moved inside page component. Screenshot verified in Indonesian. 4 remaining Pecahan sub-pages still need trilingual treatment.
- **Kelas 7 Pecahan — BentukDesimalPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.bentukDesimal`. 8 essay questions. No inline math in prose (all fractions use F component in grid). Key patterns: q2.hint and q4.hint for inline helper text spans; q6.digitHint uses i18next interpolation `{{digit}}` for the variable digit number; q7/q8 item texts in nested items.a/b/c keys. Tags moved inside page component. Screenshot verified in Indonesian.
- **Kelas 7 Pecahan — PembagianDesimalPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.pembagianDesimal`. 8 essay questions. Uses Trans for q4 (strong + InlineMath), q6 (strong + InlineMath), q7 (strong). formulaVar locale key for `\mathrm{jarak}` in q7 formula. instructionMid2 pattern for q2 (3 numbers: ÷5, ÷50, ÷5.000).
- **Kelas 7 Pecahan — PembulatanDesimalPage.tsx**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.pecahan.pembulatanDesimal`. 8 essay questions. Uses Trans for q1,q2,q5,q6,q7 (strong only), q8 (strong + m1 + m2 InlineMath). instructionPre/Post split for q3 (with typed "three"|"two"|"one" item keys) and q4 (with "two"|"three" item keys). JA instructionPre is "" (empty) for q3 and q4 — grammar puts math before verb. `useTheme` retained for isDark gradient switching. ALL 10 Pecahan sub-pages now fully trilingual.
- **Kelas 7 Aljabar — MenyederhanakanPecahanAljabarPage.tsx (sub-page 8, TERAKHIR)**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.aljabar.menyederhanakanPecahan`. File hanya punya 4 SoalX (bukan 20) karena tiap soal berisi grid multi-soal. Semua 4 selesai dalam 1 sesi (tidak perlu Bagian 2). "cards di luar" — cards dipindah ke dalam component, SoalX dikonversi ke function body. Instruksi soal 1–4 semuanya teks murni (tanpa InlineMath), paling sederhana dari semua page. Topik Aljabar Kelas 7 LENGKAP (index + 8 sub-halaman semua trilingual).
- **Kelas 7 Aljabar — FaktorisasiAljabarPage.tsx (sub-page 7)**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.aljabar.faktorisasi`. 8 essay questions. "cards di luar" — restructured: cards moved inside component, all SoalX converted from arrow shorthand to function bodies. Tags array uses t() for tag strings. q4 & q6 use introPre/introMid/introEnd flanking two InlineMath (ax²+bx+c and a=1/a≠1). q5 & q7 use introPre/introMid flanking one InlineMath. q8 contextual items: 8a uses itemAPre/itemAPost; 8b uses itemBPre/itemBMid/itemBEnd flanking two InlineMath; 8c uses itemCPre/itemCMid/itemCEnd flanking n and n+1. JA q4/q6 introPre="次の" so math follows immediately. No useTheme needed (no dark/light SVG color switching). 1 sub-page remaining: MenyederhanakanPecahanAljabar (sub-page 8).
- **Kelas 7 Aljabar — SubstitusiBilanganAljabarPage.tsx (sub-page 6)**: Fully trilingual (id/en/ja) as of July 2026. Locale key prefix: `practice.aljabar.substitusi`. 8 essay questions. "cards di dalam" — no restructuring needed (isDark/useTheme already inside component). 41 t() calls total (37 static + 4 template). Split patterns: q1 introPre/introEnd flanking 1 InlineMath; q3 & q5 introPre/introSep/introAnd/introEnd flanking 3 InlineMath each; q6 introPre/introMid1/introMid2/introMid3/bold/introEnd flanking h, t, formula math + strong text; q7 introPre/introMid1/introMid2/introEnd flanking x, (3x-5), W; q8 introPre/introMid/introEnd flanking n and formula. SVG natural-language labels translated: q6.svgLabel ("gedung"), q7.svgLabel ("KARGO"). q2 keterangan strings moved to locale keys k1–k4.
- **BilanganRasionalPage (Kelas 7 Pecahan index)**: Already fully trilingual — uses dynamic `t('practice.pecahan.subtopics.${key}.label/desc')` for all 10 subtopics. All 10 keys present in all 3 locale files. No changes needed.

## JSX-soal trilingual pattern (Pecahan pages — different from Bilangan Bulat)
Pecahan soal components are JSX components (not data arrays). Key differences:
- Change each `SoalX` from arrow shorthand `() => (...)` to function body `() => { const { t } = useTranslation(); return (...); }` — hooks can't be called in shorthand bodies.
- Move the `cards` array (which contains tag labels) **inside** the page component so it can call `t()` for tag strings.
- For inline math symbols inside prose text (e.g. `<InlineMath math=">" /> atau <InlineMath math="<" />`), use `<Trans i18nKey="..." components={{ gt: <InlineMath math=">" />, lt: <InlineMath math="<" /> }} />` — import `Trans` from `react-i18next`.
- Locale keys live under `practice.pecahan.<pageKey>.*` (e.g. `practice.pecahan.artiSenilai.q5.instruction`).
- Index page (BilanganRasionalPage): rename `subtopics` const to `subtopicsConfig` (remove `label`/`desc`, add `key`), then derive `subtopics` inside component with `subtopicsConfig.map(s => ({ ...s, label: t(...), desc: t(...) }))`.
- Reference file: `artifacts/numatik/src/pages/latihan-mandiri/kelas7/pecahan/ArtiPecahanSenilaiMembandingkanPage.tsx`
