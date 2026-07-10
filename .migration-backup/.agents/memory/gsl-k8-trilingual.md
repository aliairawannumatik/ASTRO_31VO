---
name: Garis Singgung Lingkaran K8 trilingual complete
description: All 6 K8 Garis Singgung Lingkaran files audited/fixed with id/en/ja translations.
---

## Status
All 6 files in `src/pages/materi-matematika/kelas8/garis-singgung-lingkaran/` are trilingual:
- PengertianPage.tsx ✅ (pre-existing)
- MenghitungPanjangPage.tsx ✅ (pre-existing)
- GSPDPage.tsx ✅ (pre-existing)
- SabukLilitanPage.tsx ✅ (pre-existing)
- GarisSinggungLingkaranPage.tsx ✅ (fixed — was hardcoded ID)
- GSPLPage.tsx ✅ (rewritten from scratch — was 0% trilingual)

Hub page (`GarisSinggungLingkaranPage.tsx`) follows TeoremaPythagorasPage.tsx pattern:
- Three subtopic arrays (subtopicsId / subtopicsEn / subtopicsJa)
- titles / kelas / backLabels objects keyed by language
- useLanguage() in component body

## Key terminology (GSPL)
- ID: "Garis Singgung Persekutuan Luar (GSPL)"
- EN: "External Common Tangent (ECT)"
- JA: "外接共通接線 (GSPL)"
- Both circles on the same side / 両円が同じ側にある
- Formula: l = √(d² − (R−r)²) — identical across languages

## Rules confirmed
- KaTeX `\text{}` must NOT contain natural language — use `\mathrm{cm}` for units
- SVG components receive `t` prop (full translations object) for aria-label + in-SVG text translation
- SVG formula bar uses math-only notation (no natural language inside SVG text)
- `?lang=en` and `?lang=ja` URL params work for testing without code changes
