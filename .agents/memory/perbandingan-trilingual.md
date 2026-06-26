---
name: Perbandingan Kelas 7 trilingual
description: Notes on completing ID/EN/JA for all 6 Perbandingan Kelas 7 files
---

All 6 files complete as of this session.

**Files done:**
- PerbandinganPage.tsx (hub) — MateriTopicPage does NOT auto-translate subtopic labels; hub must import useLanguage and pass one of three language-specific subtopic arrays.
- PerbandinganUmumPage.tsx — Names: Miyu/Arvinza → Jamie/Quinn, Bayu/Citra → Drew/Sage, Dafa/Rani → Reed/Blair. Currency Rp→$ in EN/JA.
- PerbandinganBertingkatPage.tsx — Names: Adi/Beni/Candra → Taylor/Riley/Casey; Anto/Budi/Cepi → Devon/Parker/Cameron. Currency Rp→$ in EN/JA.
- PerbandinganSenilaiPage.tsx — No character names. Animation components (SenilaiAnimasi, BerbalikAnimasi) refactored to accept label props for i18n. Currency Rp→$ in EN/JA.
- PerbandinganCampuranPage.tsx — No names, no currency. Work Formula table translated. Formula stays in LaTeX.
- SkalaPage.tsx — No names, no currency. Map scale + area scale formulas translated. Image `/images/image_1775455799668.png` kept as-is.

**Why MateriTopicPage hub needs special handling:**
MateriTopicPage renders `subtopic.label` directly — there is no language prop per subtopic. Hub pages must build separate arrays per language and select based on `useLanguage()`.

**Animation component pattern:**
Sub-components that render language-sensitive strings must receive them as props (not read useLanguage themselves) when defined in the same file as the page. This keeps translation logic centralized in the translations object.
