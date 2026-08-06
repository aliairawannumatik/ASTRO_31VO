---
name: TKA Latihan 2 pembahasan
description: How PembahasanCard was integrated into TKALatihan2Page for Q1–10, and the data file pattern for future TKA pembahasan work.
---

## What was done
- Created `artifacts/numatik/src/data/pembahasan/tkaLatihan2.ts` with `Pembahasan` records for keys 1–10.
- Added `import PembahasanCard` and `import { tkaLatihan2Pembahasan }` to `TKALatihan2Page.tsx`.
- Placed `<PembahasanCard pembahasanKey="tka2-qN" pembahasan={tkaLatihan2Pembahasan[N]} />` immediately after each MCQ / ComplexMCQ / BenarSalah component inside the question card, before the closing `</div></div></div>`.

## Integration pattern for TKA pages
```tsx
import PembahasanCard from "@/components/PembahasanCard";
import { tkaLatihanXPembahasan } from "@/data/pembahasan/tkaLatihanX";
// inside JSX, after each MCQ/ComplexMCQ/BenarSalah:
<PembahasanCard pembahasanKey="tkaX-qN" pembahasan={tkaLatihanXPembahasan[N]} />
```

## Data file structure
Each key in the Record<number, Pembahasan> must supply:
- `jawaban` — correct answer text (including letter for MCQ, or summary for complex types)
- `konsepTrik` — short concept/trick explanation
- `stepByStep` — newline-separated calculation steps (supports $LaTeX$ inline)
- `tips` — exam tips / traps to avoid
- `kesimpulan` — one-sentence conclusion

**Why:** `PembahasanCard` renders `$...$` as InlineMath via its `renderWithLatex` helper — no JSX needed in the data file.

## Q11–30 still pending
Q11–30 in TKALatihan2Page have NO pembahasan yet. Topics:
- Q11–12: keripik singkong (fungsi biaya, B(x)=3000x+40000, harga jual Rp7000)
- Q13–15: paket internet TelkomIndo vs IndosatOreo
- Q16–18: lomba memindahkan air — volume tabung, π=22/7
- Q19–21: festival budaya (Pythagoras, cermin sumbu-y, juring lingkaran r=14 sudut=90°)
- Q22–24: barang pokok (aljabar, fungsi diskon piecewise)
- Q25–30: Timnas AFF 2026 (peluang, frekuensi relatif, statistika)

## Note on Q7 units
The problem text says "Rp1,2 triliun" but the answer is Rp40.000/KK/bulan. This only works if the intended value is Rp1,2 miliar (1.200.000.000 / 30.000 = 40.000). The pembahasan uses "Rp1.200.000.000" to avoid confusion while matching the correct answer.
