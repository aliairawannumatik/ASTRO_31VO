import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "bilangan-berpangkat";
const PARENT_LABEL = "BILANGAN BERPANGKAT & BENTUK AKAR";

const PENGERTIAN_NOTASI: BaseQ[] = [
  { q: "2³ = ...", opts: ["6", "8", "9", "12"], correct: 1 },
  { q: "5² = ...", opts: ["10", "20", "25", "50"], correct: 2 },
  { q: "3⁴ = ...", opts: ["12", "27", "64", "81"], correct: 3 },
  { q: "Notasi 7 × 7 × 7 ditulis ...", opts: ["7²", "7³", "7⁴", "3⁷"], correct: 1 },
  { q: "Bilangan pokok pada 6⁵ adalah ...", opts: ["5", "6", "11", "30"], correct: 1 },
  { q: "Pangkat pada 4³ adalah ...", opts: ["3", "4", "7", "12"], correct: 0 },
  { q: "10² = ...", opts: ["20", "100", "200", "1000"], correct: 1 },
  { q: "1⁵⁰ = ...", opts: ["0", "1", "5", "50"], correct: 1 },
  { q: "0³ = ...", opts: ["0", "1", "3", "tidak terdefinisi"], correct: 0 },
  { q: "Bentuk perkalian dari 4³ adalah ...", opts: ["4+4+4", "4×3", "4×4×4", "3×3×3×3"], correct: 2 },
  { q: "9¹ = ...", opts: ["0", "1", "9", "10"], correct: 2 },
  { q: "2⁵ = ...", opts: ["10", "16", "25", "32"], correct: 3 },
];

const SIFAT_OPERASI: BaseQ[] = [
  { q: "2³ × 2² = ...", opts: ["2⁵", "2⁶", "4⁵", "4⁶"], correct: 0 },
  { q: "5⁶ : 5² = ...", opts: ["5³", "5⁴", "5⁸", "5¹²"], correct: 1 },
  { q: "(3²)³ = ...", opts: ["3⁵", "3⁶", "9⁵", "9⁶"], correct: 1 },
  { q: "(2 × 5)² = ...", opts: ["10", "25", "100", "1000"], correct: 2 },
  { q: "a⁴ × a³ = ...", opts: ["a⁷", "a¹²", "2a⁷", "a¹"], correct: 0 },
  { q: "x⁸ : x³ = ...", opts: ["x⁵", "x¹¹", "x²⁴", "x²"], correct: 0 },
  { q: "(x³)² = ...", opts: ["x⁵", "x⁶", "x⁹", "2x³"], correct: 1 },
  { q: "3² × 3³ = ...", opts: ["3⁵", "9⁵", "3⁶", "27"], correct: 0 },
  { q: "(2³)² = ...", opts: ["2⁵", "2⁶", "8²", "16"], correct: 1 },
  { q: "10⁴ : 10² = ...", opts: ["10⁶", "10²", "10⁸", "1"], correct: 1 },
  { q: "(ab)³ = ...", opts: ["a³b³", "a³b", "ab³", "3ab"], correct: 0 },
  { q: "a⁵ : a⁵ = ...", opts: ["0", "1", "a", "a¹⁰"], correct: 1 },
];

const BENTUK_AKAR: BaseQ[] = [
  { q: "√25 = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "√81 = ...", opts: ["7", "8", "9", "10"], correct: 2 },
  { q: "√16 + √9 = ...", opts: ["5", "7", "12", "25"], correct: 1 },
  { q: "√36 = ...", opts: ["4", "5", "6", "8"], correct: 2 },
  { q: "√49 = ...", opts: ["6", "7", "8", "9"], correct: 1 },
  { q: "√100 = ...", opts: ["8", "9", "10", "12"], correct: 2 },
  { q: "√64 = ...", opts: ["6", "7", "8", "9"], correct: 2 },
  { q: "√144 = ...", opts: ["10", "11", "12", "14"], correct: 2 },
  { q: "√4 × √9 = ...", opts: ["5", "6", "13", "36"], correct: 1 },
  { q: "√121 = ...", opts: ["10", "11", "12", "13"], correct: 1 },
  { q: "√1 = ...", opts: ["0", "1", "2", "tidak terdefinisi"], correct: 1 },
  { q: "√169 = ...", opts: ["12", "13", "14", "15"], correct: 1 },
];

const NOTASI_ILMIAH: BaseQ[] = [
  { q: "1.000 dalam notasi ilmiah = ...", opts: ["1×10²", "1×10³", "1×10⁴", "10×10²"], correct: 1 },
  { q: "10.000 dalam notasi ilmiah = ...", opts: ["1×10³", "1×10⁴", "10⁵", "10⁶"], correct: 1 },
  { q: "300 dalam notasi ilmiah = ...", opts: ["3×10¹", "3×10²", "3×10³", "30×10¹"], correct: 1 },
  { q: "0,01 dalam notasi ilmiah = ...", opts: ["1×10⁻¹", "1×10⁻²", "1×10⁻³", "10⁻¹"], correct: 1 },
  { q: "5.000 dalam notasi ilmiah = ...", opts: ["5×10²", "5×10³", "5×10⁴", "50×10²"], correct: 1 },
  { q: "100 dalam notasi ilmiah = ...", opts: ["1×10¹", "1×10²", "10×10¹", "1×10³"], correct: 1 },
  { q: "1.500 dalam notasi ilmiah = ...", opts: ["1,5×10²", "1,5×10³", "15×10²", "1,5×10⁴"], correct: 1 },
  { q: "0,001 = ...", opts: ["1×10⁻¹", "1×10⁻²", "1×10⁻³", "1×10⁻⁴"], correct: 2 },
  { q: "2,5×10² = ...", opts: ["25", "250", "2.500", "25.000"], correct: 1 },
  { q: "4×10³ = ...", opts: ["40", "400", "4.000", "40.000"], correct: 2 },
  { q: "60.000 dalam notasi ilmiah = ...", opts: ["6×10³", "6×10⁴", "6×10⁵", "60×10³"], correct: 1 },
  { q: "1×10⁶ = ...", opts: ["100.000", "1.000.000", "10.000.000", "100"], correct: 1 },
];

export const BILANGAN_BERPANGKAT: SubmaterialEntryK9[] = [
  { slug: "pengertian-notasi", label: "PENGERTIAN & NOTASI BILANGAN BERPANGKAT", emoji: "🔢", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENGERTIAN_NOTASI) },
  { slug: "sifat-operasi", label: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT", emoji: "⚙️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(SIFAT_OPERASI) },
  { slug: "bentuk-akar", label: "BENTUK AKAR", emoji: "√", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(BENTUK_AKAR) },
  { slug: "notasi-ilmiah", label: "NOTASI ILMIAH", emoji: "🔬", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(NOTASI_ILMIAH) },
];
