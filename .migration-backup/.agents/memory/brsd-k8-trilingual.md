---
name: BRSD K8 trilingual
description: Status and rules for Bangun Ruang Sisi Datar Kelas 8 trilingual localization
---

## Files completed (this session)

- **BangunRuangSisiDatarPage.tsx** (hub) — fully wired; 3 separate subtopics arrays (Id/En/Ja) + useLanguage ternary for title/kelas/backLabel. Pattern matches TeoremaPythagorasPage.
- **RusukTigaPrismaAnimation.tsx** — PHASES/PRISMS defined inside component; useLanguage at top.
- **SisiTigaPrismaAnimation.tsx** — same pattern.
- **TitikSudutTigaPrismaAnimation.tsx** — same pattern.
- **JaringPrismaInteraktif.tsx** — `faceLabel(k, n)` helper translates "Alas/Base/底面", "Tutup/Lid/上面", "Sisi/Face/面 N". `typeLabel(n)` translates prism type. `tr` object holds all button/status/legend strings.
- **JaringLimasInteraktif.tsx** — same `faceLabel(k)` / `tr` / `typeLabel` pattern.
- **LimasPage.tsx** — surgical subscript fixes: r_a, R_a, L_s, L_a, L_k throughout.
- **PrismaPage.tsx** — surgical subscript fixes: L_a, L_s, t_t (trapezoid height), L_t (trapezoid area), V_t, V_w (water/air), L_m (miring).
- **BalokPage.tsx** — V_t fix (line 2188). Face labels DEPAN/BELAKANG etc. already correctly inside ID ternary branch — NOT a violation.
- **GabunganPage.tsx** — standardized subscript fixes: V_b, V_l, V_t, V_k, L_a, L_m, L_p in solution blocks.

## Remaining work in GabunganPage
Complex phrase subscripts not yet fixed (deferred — need JSX restructuring):
- `V_{\text{gabungan}}`, `L_{\text{gab}}`, `L_{\text{beririsan}}` — compound-concept labels
- `V_{\text{balok 1}}`, `V_{\text{balok 2}}` → need `V_{b_1}`, `V_{b_2}`
- `V_{\text{besar}}`, `V_{\text{yang dipotong}}`, `V_{\text{utuh}}` → move label to JSX
- `L_{\text{alas balok}}`, `L_{\text{sisi balok}}`, `L_{\text{sisi kubus}}`, `L_{\text{sisi miring}}` → JSX
- `L_{\text{balok tanpa tutup}}`, `L_{\text{selimut limas}}`, `L_{\text{terlihat}}` → JSX
- `t_{\text{prisma}}`, `V_{\text{prisma}}` → `t_p`, `V_p`

## Subscript shorthand rules (standardized)
L_a=alas, L_s=selimut/tegak, L_p=permukaan/total, V_t=total, V_b=balok, V_l=limas, V_k=kubus, K_k=kerangka, L_d=bidang diagonal, L_m=miring, V_w=air(water), L_t=trapesium area, t_t=trapesium height

**Why:** Indonesian words in \text{} subscripts break the language-neutral math notation contract; all 3 language renderings must show the same formula shape.

## Pattern rules
- `useLanguage()` called at TOP of exported default function — never at module level
- PHASES/PRISMS/faceLabel arrays/functions defined INSIDE component (they depend on `lang`)
- `\text{cm}`, `\text{m}`, `\text{m}^3`, `\text{liters}` are safe — leave untouched
- English subscripts like `_{\text{full}}`, `_{\text{paint}}`, `_{\text{base}}`, `_{\text{lateral}}` are acceptable
- Japanese subscripts like `_{\text{底面}}`, `_{\text{側面}}` in JA branches are acceptable
