---
name: Koordinat Cartesius K8 trilingual complete
description: All 6 Kelas 8 Koordinat Cartesius materi-matematika files audited and fixed for ID/EN/JA trilingual support; critical KaTeX pattern rule.
---

## Status: Complete (all 6 files fully trilingual)

Files under `src/pages/materi-matematika/kelas8/koordinat-cartesius/`:
1. `KoordinatCartesiusPage.tsx` — hub, was already trilingual ✅
2. `UnsurUnsurCartesiusPage.tsx` — already trilingual ✅
3. `PosisiRelatifTitikAcuanPage.tsx` — was trilingual but had KaTeX bug (fixed) ✅
4. `JarakTitikGarisPage.tsx` — already trilingual ✅
5. `PosisiRelatifGarisPage.tsx` — already trilingual ✅
6. `PosisiRelatifTitikDanGarisPage.tsx` — fully rewritten (~1100 lines) to add complete id/en/ja translations ✅

## Critical KaTeX rule (apply to all materi-matematika pages)

**Rule:** Never embed natural language text inside `\text{}` in a KaTeX/BlockMath formula. This creates hardcoded language (usually Indonesian) that does not respond to language switching.

**Wrong:**
```tsx
<BlockMath math="\text{Posisi B relatif terhadap A} = (x_2 - x_1,\ y_2 - y_1)" />
```

**Correct:** Put the label outside KaTeX using a translation key, keep only math inside BlockMath:
```tsx
<p className="font-body text-xs text-orange-200 mb-1">{t.rumusLabel}</p>
<BlockMath math="\Delta x = x_2 - x_1 \qquad \Delta y = y_2 - y_1" />
```

**Why:** KaTeX renders `\text{}` literally — it does not go through the translations object. Language switching has no effect on `\text{}` content.

**How to apply:** When writing or auditing any materi-matematika page, grep for `\\text\{` in BlockMath/InlineMath usages and verify no natural-language words appear inside.
