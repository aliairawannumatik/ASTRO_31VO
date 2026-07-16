import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "persamaan-kuadrat";
const PARENT_LABEL = "PERSAMAAN KUADRAT";

const BENTUK_UMUM: BaseQ[] = [
  { q: "Bentuk umum persamaan kuadrat ...", opts: ["ax+b=0", "ax²+bx+c=0", "ax³+b=0", "x+y=0"], correct: 1 },
  { q: "x²−5x+6=0. Nilai a = ...", opts: ["1", "−5", "6", "0"], correct: 0 },
  { q: "x²−5x+6=0. Nilai b = ...", opts: ["1", "−5", "5", "6"], correct: 1 },
  { q: "x²−5x+6=0. Nilai c = ...", opts: ["1", "5", "6", "−6"], correct: 2 },
  { q: "2x²+3x−5=0. Nilai a = ...", opts: ["1", "2", "3", "−5"], correct: 1 },
  { q: "Persamaan kuadrat memiliki pangkat tertinggi ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Manakah persamaan kuadrat?", opts: ["x+1=0", "x²+1=0", "x³+1=0", "2x+5=0"], correct: 1 },
  { q: "Pada ax²+bx+c=0, syarat agar disebut persamaan kuadrat: ...", opts: ["a=0", "a≠0", "b=0", "c=0"], correct: 1 },
  { q: "x²+4x=0. Nilai c = ...", opts: ["−4", "0", "1", "4"], correct: 1 },
  { q: "x²−9=0. Nilai b = ...", opts: ["−9", "0", "1", "9"], correct: 1 },
  { q: "3x²−2x+1=0. Nilai b = ...", opts: ["−2", "1", "2", "3"], correct: 0 },
  { q: "x²−x−2=0. Nilai c = ...", opts: ["−2", "−1", "1", "2"], correct: 0 },
];

const PEMFAKTORAN: BaseQ[] = [
  { q: "Faktor dari x²−5x+6 adalah ...", opts: ["(x−1)(x−6)", "(x−2)(x−3)", "(x+2)(x+3)", "(x−6)(x+1)"], correct: 1 },
  { q: "Akar dari x²−5x+6=0 adalah ...", opts: ["−2,3", "2,3", "1,6", "−1,−6"], correct: 1 },
  { q: "Faktor dari x²−9 adalah ...", opts: ["(x−3)(x+3)", "(x−9)(x+1)", "(x+3)²", "(x−3)²"], correct: 0 },
  { q: "Akar dari x²−9=0 adalah ...", opts: ["±1", "±3", "±9", "0,9"], correct: 1 },
  { q: "Faktor x²+5x+6 ...", opts: ["(x+2)(x+3)", "(x−2)(x−3)", "(x+1)(x+6)", "(x+5)(x+1)"], correct: 0 },
  { q: "Akar x²+5x+6=0 = ...", opts: ["−2,−3", "2,3", "−5,1", "5,−1"], correct: 0 },
  { q: "Faktor x²−4 = ...", opts: ["(x−2)(x+2)", "(x−2)²", "(x+2)²", "(x−4)(x+1)"], correct: 0 },
  { q: "Akar x²−4=0 = ...", opts: ["±2", "±4", "±1", "0,4"], correct: 0 },
  { q: "Faktor x²+x−2 = ...", opts: ["(x+2)(x−1)", "(x−2)(x+1)", "(x+1)(x−2)", "(x+2)(x+1)"], correct: 0 },
  { q: "Akar x²+x−2=0 = ...", opts: ["1,−2", "−1,2", "1,2", "−1,−2"], correct: 0 },
  { q: "Akar x²−x−6=0 = ...", opts: ["−2,3", "2,−3", "1,6", "−1,−6"], correct: 0 },
  { q: "Faktor x²−7x+10 = ...", opts: ["(x−2)(x−5)", "(x+2)(x+5)", "(x−1)(x−10)", "(x−5)(x+2)"], correct: 0 },
];

const RUMUS_KUADRATIK: BaseQ[] = [
  { q: "Rumus kuadratik (rumus abc) ...", opts: ["x = (−b±√(b²−4ac))/(2a)", "x = (b±√D)/2", "x = b/(2a)", "x = a/b"], correct: 0 },
  { q: "Akar x²−5x+6=0 dengan rumus abc = ...", opts: ["1,4", "2,3", "−2,−3", "3,4"], correct: 1 },
  { q: "x²+2x−3=0 → akar = ...", opts: ["1,−3", "−1,3", "1,3", "−1,−3"], correct: 0 },
  { q: "x²−x−6=0 → akar = ...", opts: ["−2,3", "2,−3", "1,6", "−1,−6"], correct: 0 },
  { q: "x²+5x+6=0 → akar = ...", opts: ["−2,−3", "2,3", "−5,1", "5,−1"], correct: 0 },
  { q: "x²−9=0 → akar dengan abc = ...", opts: ["±1", "±3", "±9", "0,9"], correct: 1 },
  { q: "x²+x−2=0 → akar = ...", opts: ["1,−2", "−1,2", "2,1", "−2,−1"], correct: 0 },
  { q: "Pada rumus abc, di bawah akar tertulis ...", opts: ["b²+4ac", "b²−4ac", "b+4ac", "b−4ac"], correct: 1 },
  { q: "Pada rumus abc, dibagi oleh ...", opts: ["a", "2a", "b", "2b"], correct: 1 },
  { q: "x²−4x+4=0 → akar = ...", opts: ["2", "−2", "±2", "4"], correct: 0 },
  { q: "x²−6x+8=0 → akar = ...", opts: ["2,4", "−2,−4", "1,8", "−1,−8"], correct: 0 },
  { q: "x²+4x+3=0 → akar = ...", opts: ["−1,−3", "1,3", "−1,3", "1,−3"], correct: 0 },
];

const PELENGKAP_KUADRAT: BaseQ[] = [
  { q: "Metode melengkapkan kuadrat sempurna mengubah x²+bx menjadi ...", opts: ["(x+b/2)² − (b/2)²", "(x+b)² − b", "(x−b/2)² + b/2", "(x+b)²"], correct: 0 },
  { q: "x²+6x = ...", opts: ["(x+3)² − 9", "(x+3)² + 9", "(x−3)² − 9", "(x+6)² − 36"], correct: 0 },
  { q: "x²+4x+4 = ...", opts: ["(x+2)²", "(x−2)²", "(x+4)²", "(x−4)²"], correct: 0 },
  { q: "x²−6x+9 = ...", opts: ["(x−3)²", "(x+3)²", "(x−6)²", "(x+6)²"], correct: 0 },
  { q: "(x+5)² = ...", opts: ["x²+10x+25", "x²+5x+25", "x²+25", "x²+10x"], correct: 0 },
  { q: "(x−4)² = ...", opts: ["x²−8x+16", "x²−4x+16", "x²+8x+16", "x²−16"], correct: 0 },
  { q: "x²+8x = ...", opts: ["(x+4)² − 16", "(x+4)² + 16", "(x+8)² − 64", "(x−4)² − 16"], correct: 0 },
  { q: "x²+10x = ...", opts: ["(x+5)² − 25", "(x+5)² + 25", "(x+10)² − 100", "(x−5)² − 25"], correct: 0 },
  { q: "Akar x²+6x+5=0 (lengkap kuadrat) = ...", opts: ["−1,−5", "1,5", "−1,5", "1,−5"], correct: 0 },
  { q: "Akar x²−4x+3=0 (lengkap kuadrat) = ...", opts: ["1,3", "−1,−3", "1,−3", "−1,3"], correct: 0 },
  { q: "x²+2x+1 = ...", opts: ["(x+1)²", "(x−1)²", "(x+2)²", "(x−2)²"], correct: 0 },
  { q: "x²−10x+25 = ...", opts: ["(x−5)²", "(x+5)²", "(x−10)²", "(x+10)²"], correct: 0 },
];

const DISKRIMINAN: BaseQ[] = [
  { q: "Diskriminan = ...", opts: ["b²−4ac", "b²+4ac", "ac−b²", "(b−4ac)²"], correct: 0 },
  { q: "Jika D > 0, akar ...", opts: ["sama", "real berbeda", "imajiner", "kembar"], correct: 1 },
  { q: "Jika D = 0, akar ...", opts: ["real berbeda", "kembar", "imajiner", "tidak ada"], correct: 1 },
  { q: "Jika D < 0, akar ...", opts: ["real berbeda", "kembar", "imajiner/tidak real", "0"], correct: 2 },
  { q: "x²−5x+6=0. D = ...", opts: ["1", "5", "12", "25"], correct: 0 },
  { q: "x²−4x+4=0. D = ...", opts: ["−16", "0", "8", "16"], correct: 1 },
  { q: "x²+x+1=0. D = ...", opts: ["−3", "0", "3", "5"], correct: 0 },
  { q: "x²−x−6=0. D = ...", opts: ["1", "23", "25", "−25"], correct: 2 },
  { q: "x²+2x+1=0. Jenis akar ...", opts: ["real berbeda", "kembar", "imajiner", "tidak ada"], correct: 1 },
  { q: "x²+3x+5=0. Jenis akar ...", opts: ["real berbeda", "kembar", "imajiner", "0"], correct: 2 },
  { q: "x²+5x+6=0. D = ...", opts: ["1", "−1", "5", "25"], correct: 0 },
  { q: "x²−6x+9=0. Jenis akar ...", opts: ["real berbeda", "kembar", "imajiner", "tidak ada"], correct: 1 },
];

const MENYUSUN_PERSAMAAN: BaseQ[] = [
  { q: "Persamaan kuadrat berakar 2 dan 3 ...", opts: ["x²−5x+6=0", "x²+5x+6=0", "x²−5x−6=0", "x²+5x−6=0"], correct: 0 },
  { q: "Berakar −2 dan −3 ...", opts: ["x²+5x+6=0", "x²−5x+6=0", "x²+5x−6=0", "x²−5x−6=0"], correct: 0 },
  { q: "Berakar 1 dan 4 ...", opts: ["x²−5x+4=0", "x²+5x+4=0", "x²−5x−4=0", "x²+5x−4=0"], correct: 0 },
  { q: "Berakar 0 dan 5 ...", opts: ["x²−5x=0", "x²+5x=0", "x²−5=0", "x²+5=0"], correct: 0 },
  { q: "Berakar 3 dan −2 ...", opts: ["x²−x−6=0", "x²+x−6=0", "x²−x+6=0", "x²+x+6=0"], correct: 0 },
  { q: "Berakar 4 dan −1 ...", opts: ["x²−3x−4=0", "x²+3x−4=0", "x²−3x+4=0", "x²+3x+4=0"], correct: 0 },
  { q: "Berakar 2 dan −2 ...", opts: ["x²−4=0", "x²+4=0", "x²−4x=0", "x²+4x=0"], correct: 0 },
  { q: "Berakar 1 dan 1 ...", opts: ["(x−1)²=0", "(x+1)²=0", "x²−1=0", "x²+1=0"], correct: 0 },
  { q: "Rumus PK dari akar p,q ...", opts: ["x²−(p+q)x+pq=0", "x²+(p+q)x+pq=0", "x²+(p+q)x−pq=0", "x²−(p+q)x−pq=0"], correct: 0 },
  { q: "Berakar 5 dan 6 ...", opts: ["x²−11x+30=0", "x²+11x+30=0", "x²−11x−30=0", "x²+11x−30=0"], correct: 0 },
  { q: "Berakar 7 dan 0 ...", opts: ["x²−7x=0", "x²+7x=0", "x²−7=0", "x²+7=0"], correct: 0 },
  { q: "Berakar −1 dan 6 ...", opts: ["x²−5x−6=0", "x²+5x−6=0", "x²−5x+6=0", "x²+5x+6=0"], correct: 0 },
];

const PENERAPAN: BaseQ[] = [
  { q: "Persegi luas 25 cm². Sisinya ...", opts: ["3 cm", "4 cm", "5 cm", "6 cm"], correct: 2 },
  { q: "Persegi luas 49 cm². Sisinya ...", opts: ["6 cm", "7 cm", "8 cm", "9 cm"], correct: 1 },
  { q: "Hasil kali dua bilangan = 12, jumlah=7. Bilangannya ...", opts: ["3,4", "2,6", "5,7", "1,12"], correct: 0 },
  { q: "Hasil kali = 6, jumlah = 5. Bilangannya ...", opts: ["1,6", "2,3", "3,2", "1,5"], correct: 1 },
  { q: "Persegi panjang luas 12 cm², lebar 3, panjang = ...", opts: ["3 cm", "4 cm", "5 cm", "6 cm"], correct: 1 },
  { q: "x² = 16 → x = ...", opts: ["±2", "±4", "±8", "±16"], correct: 1 },
  { q: "Selisih kuadrat dan bilangannya = 6. Pilih bilangan = ...", opts: ["3", "4", "5", "6"], correct: 0 },
  { q: "Bilangan kuadrat antara 16 dan 36 adalah ...", opts: ["20", "25", "30", "35"], correct: 1 },
  { q: "Persegi sisi 4 luasnya ...", opts: ["8", "12", "16", "20"], correct: 2 },
  { q: "Hasil kali = 8, selisih = 2. Bilangannya ...", opts: ["1,8", "2,4", "4,6", "2,6"], correct: 1 },
  { q: "Akar PK x²−25=0 ...", opts: ["±3", "±4", "±5", "±6"], correct: 2 },
  { q: "Persegi luas 100. Sisinya ...", opts: ["8", "9", "10", "12"], correct: 2 },
];

export const PERSAMAAN_KUADRAT: SubmaterialEntryK9[] = [
  { slug: "bentuk-umum", label: "BENTUK UMUM PERSAMAAN KUADRAT", emoji: "📝", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(BENTUK_UMUM) },
  { slug: "pemfaktoran", label: "PEMFAKTORAN", emoji: "✂️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PEMFAKTORAN) },
  { slug: "rumus-kuadratik", label: "RUMUS KUADRATIK (ABC)", emoji: "🧮", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(RUMUS_KUADRATIK) },
  { slug: "pelengkap-kuadrat", label: "MELENGKAPKAN KUADRAT", emoji: "🧩", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PELENGKAP_KUADRAT) },
  { slug: "diskriminan", label: "DISKRIMINAN & JENIS AKAR", emoji: "🔍", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(DISKRIMINAN) },
  { slug: "menyusun-persamaan", label: "MENYUSUN PERSAMAAN KUADRAT", emoji: "🛠️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MENYUSUN_PERSAMAAN) },
  { slug: "penerapan", label: "PENERAPAN PERSAMAAN KUADRAT", emoji: "🌍", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENERAPAN) },
];
