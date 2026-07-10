---
name: PGL K8 trilingual complete
description: Lessons from wiring all 4 Kelas 8 Persamaan Garis Lurus materi-matematika pages (GradienPage, MenentukanPGLPage, Hubungan2GarisPage, GrafikPGLPage) to id/en/ja.
---

# K8 Persamaan Garis Lurus — Trilingual Wiring

## Files (all complete)
- `src/pages/materi-matematika/kelas8/persamaan-garis-lurus/GradienPage.tsx` ✅
- `src/pages/materi-matematika/kelas8/persamaan-garis-lurus/MenentukanPGLPage.tsx` ✅
- `src/pages/materi-matematika/kelas8/persamaan-garis-lurus/Hubungan2GarisPage.tsx` ✅
- `src/pages/materi-matematika/kelas8/persamaan-garis-lurus/GrafikPGLPage.tsx` ✅

## GrafikPGLPage key patterns

### Step array typing
InteractiveStepGraph `steps` prop from translation arrays must be cast:
```tsx
steps={(t.tp_ex1_steps as { label: string; desc: string }[]).map((s, i) => ({
  ...s,
  color: ["#94a3b8","#22d3ee","#a78bfa","#4ade80"][i],
  bg: ["rgba(148,163,184,0.08)","rgba(34,211,238,0.1)","rgba(167,139,250,0.1)","rgba(74,222,128,0.08)"][i],
}))}
```

### konsep_chips typing
```tsx
(t.konsep_chips as { label: string; warna: string; ket: string }[]).map(...)
```

### c2_tip_items typing
```tsx
(t.c2_tip_items as string[]).map((item, i) => <p key={i}>{item}</p>)
```

### Missing keys discovered during wiring
Several keys used in JSX were not yet in T_GRAFIK; they needed to be added to all 3 language blocks:
- `ex_label1`, `ex_label2` — example labels ("Contoh 1"/"Example 1"/"例 1")
- `c1_soal_a` — prefix before equation in contoh1 soal
- `c3_soal_b` (repurposed from long string → short "Dua garis"/"Two lines"/"2 直線")
- `c3_soal_dan`, `c3_soal_end` — split the contoh3 soal around InlineMath equations
- `c3_bantu2` — second helper-point label (same value as c3_bantu1)
- `c3_graf_dan` — "and"/"and"/"と" between ℓ₁ and ℓ₂ in graf title

**Why:** Some keys were added to T_GRAFIK in one session but the JSX was wired in the next; always grep for each new key before using it in JSX.

### Sub-component (MCQGrafik1)
MCQGrafik1 is defined inside GrafikPGLPage.tsx (not a separate file). It calls `useLanguage()` and `const t = T_GRAFIK[language]` at its own top level — consistent with the standard pattern for inlined sub-components.

## Hubungan2GarisPage — hardcoded strings found in TWO passes

First pass fixed the obvious: observation box labels, animation labels, slider labels, CoordSys labels, example step strings.

**Second pass (code review catch) fixed remaining:**
- Visual gallery card headers: `∥ SEJAJAR`, `⊥ TEGAK LURUS`, `✕ BERPOTONGAN` (lines ~786, ~799, ~814)
  → Keys: `vis_lbl_sejajar`, `vis_lbl_tegaklurus`, `vis_lbl_berpotongan`
- Example 3 inline verdict words: `TEGAK LURUS` / `SEJAJAR` inside JSX `<strong>` tags (lines ~955, ~959, ~963)
  → Keys: `c3_ver_perp`, `c3_ver_par`
- `ber_anim_perp_at` JA value was `"90°の角、交点"` → changed to `"交点は"` for natural word-order (coordinate appended after)
- Inline conjunction `"dan"` before ℓ₃ label → replaced with ternary `language === "id" ? "dan" : language === "ja" ? "と" : "and"`

**Why:** Inline badge/label text inside graphic containers is easy to miss — always search for ALL-CAPS Indonesian words (SEJAJAR, TEGAK LURUS, BERPOTONGAN) as a final check on any page with visual relationship diagrams.

## GradienPage SVG text labels
SVG `<text>` elements inside inline SVG illustrations need their own translation keys. Found "datar" and "tegak" inside positif/negatif slope illustrations.
→ Keys: `svgDatar` (id: "datar"/en: "run"/ja: "底辺"), `svgTegak` (id: "tegak"/en: "rise"/ja: "高さ")

## MenentukanPGLPage peta-rumus flowchart
The SVG flowchart (decision tree for choosing scenarios) had 6 hardcoded Indonesian strings rendered as SVG `<text>` elements. Each needed its own translation key.
→ Keys: `peta_infoGaris`, `peta_mDan1Titik`, `peta_2Titik`, `peta_titikGradien`, `peta_hitungM`, `peta_laluSk1`

**Why:** SVG text elements are invisible to a simple "grep for JSX string literals" scan because they look like `>Info Garis?</text>` not `>Info Garis?</p>`. Always scan SVG sections manually.
