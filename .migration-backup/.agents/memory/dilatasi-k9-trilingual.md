---
name: Dilatasi K9 trilingual complete
description: DilatasisPage.tsx (Kelas 9 Transformasi Geometri) fully trilingual — animations, soal/pembahasan, and rangkuman/tips/kesimpulan sections.
---

All sections of `src/pages/materi-matematika/kelas9/transformasi-geometri/DilatasisPage.tsx` are now trilingual (id/en/ja), including the Rangkuman Dilatasi table, Kurva Linear sub-table, Rumus Kunci cards, Tips & Trik, Perbandingan 4 Transformasi table, and Kesimpulan section.

**Why:** These sections were left in Indonesian only in an earlier pass; the rest of the page (animations, soal/pembahasan) was already done.

**How to apply:** When translating array-driven `.map()` render blocks (e.g. tip cards, comparison table rows, property grids) where the array previously used the Indonesian label text as the React `key`, switch the `key` to the array index instead once the label becomes a translated `dt.xxx` value — otherwise duplicate/changing keys across languages can cause key warnings or unnecessary remounts. Also, when a table row's styling depends on the *value* of a translated field (e.g. orientasi "Tetap"/"Berbalik"/"Berputar" driving text color), keep a separate untranslated `orientasiKey` field for the conditional and use the translated field only for display.
