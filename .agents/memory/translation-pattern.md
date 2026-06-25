---
name: Translation pattern for Bilangan Bulat Kelas 7
description: How i18n (id/en/ja) is implemented across the Bilangan Bulat pages
---

All pages under `src/pages/materi-matematika/kelas7/bilangan-bulat/` use the same pattern:

1. Import `useLanguage` from `@/contexts/LanguageContext` in every component that needs translated text.
2. In the main page component, define a large `translations = { id: {...}, en: {...}, ja: {...} }` object inline with all string keys. Assign `const c = translations[language]`.
3. Sub-components (SVGs, calculators) call `useLanguage()` directly and build their own inline string maps or ternary chains.
4. Arrays (rules, tips) live inside the translations object per language.

**Why:** Keeps all strings co-located with their component; avoids a shared i18n file becoming a bottleneck.

**How to apply:** When adding a new page or sub-component, follow PerkalianPage or PenguranganPage as reference.

Completed pages: PerkalianPage ✅, PenguranganPage ✅, PenjumlahanPage ✅
