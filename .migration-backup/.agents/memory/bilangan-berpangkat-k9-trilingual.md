---
name: Bilangan Berpangkat K9 trilingual complete
description: All 5 Kelas 9 Bilangan Berpangkat materi-matematika pages done with ID/EN/JA trilingual support.
---

## Scope
Files under `src/pages/materi-matematika/kelas9/bilangan-berpangkat/`:
- `BilanganBerpangkatPage.tsx` — hub, three subtopic arrays, useLanguage, trilingual title/kelas/backLabel
- `PengertianNotasiPangkatPage.tsx` — full translations object, BacteriaAnimation with `t` prop
- `SifatSifatOperasiPage.tsx` — full translations, 9-sifat table, KaTeX fixes
- `BentukAkarPage.tsx` — 6 sub-babs (Pengertian, HubunganPangkatPecahan, Penyederhanaan, Operasi, MerasionalkanPenyebut, AkarBertingkat)
- `NotasiIlmiahPage.tsx` — 4 sub-babs (BentukUmum, AturanPenulisan, Operasi, PenerapanNyata)

## Terminology (mandatory)
- Kelas 9 → Grade 9 / 中学3年
- Bilangan Berpangkat → Exponents & Powers / 累乗・指数
- Bentuk Akar → Radical Expressions / 根号の表現
- Notasi Ilmiah → Scientific Notation / 科学的記数法
- MUDAH/SEDANG/SULIT → Easy/Medium/Hard / 基本/標準/発展

## KaTeX rules applied
- Units inside BlockMath/InlineMath: use `\,\mathrm{kg}`, `\,\mathrm{m}`, `\,\mathrm{s}` — NEVER `\text{kg}` etc.
- Language words (karena, dengan, dan, genap/ganjil): split formula into multiple BlockMath + JSX `<p>` annotations
- `(\text{karena ...})` → remove from LaTeX, add `<p className="text-xs text-white/60">{t.karena} ...</p>` below the Dark block
- `(\text{dengan } a > b)` → add `<p className="font-body text-xs text-white/60 mt-1">{t.dengan} <InlineMath math="a > b" /></p>` after the formula

## Patterns
- Hub pattern: three separate `subtopicsId/En/Ja` arrays + `useLanguage()` — see TeoremaPythagorasPage
- Sub-page pattern: `const translations = {id:{}, en:{}, ja:{}}` at module level; `const t = translations[language as keyof typeof translations] ?? translations.id`
- Inline language switches (`language === "en" ? ... : language === "ja" ? ... : ...`) acceptable for long JSX prose blocks in ApplicationSections
