---
name: Pola Bilangan K8 trilingual
description: Completion record and lessons for Kelas 8 Pola Bilangan materi-matematika trilingual (ID/EN/JA) translation task.
---

## Status
All 6 files in `src/pages/materi-matematika/kelas8/pola-bilangan/` are now fully trilingual.

## Files — what was done
- `ArcDifferenceAnimation.tsx` — was already correct with `buildPatterns(lang)` accepting `language` prop.
- `PolaBilanganPage.tsx` (hub) — was already correct with `useLanguage()` and id/en/ja subtopics.
- `PengertianPolaPage.tsx` — was already correct with full `translations = {id,en,ja}`.
- `PolaAritmetikaPage.tsx` — **rewritten**: full translations object, `ArithmeticArcPanel` now accepts `constantDiffLabel` prop for translated bottom text.
- `PolaKhususPage.tsx` — **rewritten**: full translations object + fixed bug where `<ArcDifferenceAnimation />` was missing `language={language}` prop.
- `PolaGeometriPage.tsx` — **rewritten**: full translations object, new `GeometricArcPanel` component (shows ×ratio arcs instead of +diff arcs).

## Pattern used (consistent across all files)
```
const translations = { id: {...}, en: {...}, ja: {...} };
// In component:
const { language } = useLanguage();
const t = translations[language];
```

**Why:** Matches the established pattern from PengertianPolaPage.tsx and all Kelas 7 materi-matematika pages.

## Key terminology (id/en/ja)
- Suku ke-n / nth term / 第n項
- Beda / Common difference / 公差
- Rasio / Common ratio / 公比
- MUDAH/SEDANG/SULIT → EASY/MEDIUM/HARD → 基本/標準/発展
- Kelas 8 → Grade 8 → 中学2年
- Langkah → Step → ステップ
- Pembahasan → Solution → 解説

## App.tsx route note
Line 1606: `/materi-matematika/kelas-8/pola-bilangan/pola-khusus` mistakenly routes to `PengertianPolaMMK8Page` (pre-existing issue, not part of this task's scope). PolaKhususMMK8Page was never imported in App.tsx for materi-matematika routes.
