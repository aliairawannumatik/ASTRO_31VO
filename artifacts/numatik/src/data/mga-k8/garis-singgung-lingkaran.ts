import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "garis-singgung-lingkaran";
const PARENT_LABEL = "GARIS SINGGUNG LINGKARAN";

const PENGERTIAN_SIFAT: BaseQ[] = [
  { q: "Garis singgung lingkaran adalah garis yang menyentuh lingkaran di ... titik", opts: ["1", "2", "3", "tak terhingga"], correct: 0 },
  { q: "Garis singgung tegak lurus dengan ... lingkaran di titik singgung", opts: ["diameter", "jari-jari", "tali busur", "busur"], correct: 1 },
  { q: "Garis singgung dan jari-jari di titik singgung membentuk sudut ...", opts: ["45°", "60°", "90°", "180°"], correct: 2 },
  { q: "Dari satu titik di luar lingkaran dapat ditarik ... garis singgung", opts: ["1", "2", "3", "tak terhingga"], correct: 1 },
  { q: "Dua garis singgung dari satu titik luar memiliki panjang ...", opts: ["berbeda", "sama", "tegak lurus", "sejajar"], correct: 1 },
  { q: "Sudut antara garis singgung dan jari-jari = ... derajat", opts: ["30", "60", "90", "120"], correct: 2 },
  { q: "Garis singgung lingkaran berpotongan dengan lingkaran di ... titik", opts: ["1", "2", "3", "0"], correct: 0 },
  { q: "Untuk satu titik di dalam lingkaran, banyak garis singgung = ...", opts: ["0", "1", "2", "tak terhingga"], correct: 0 },
  { q: "Untuk titik di lingkaran, banyak garis singgung = ...", opts: ["0", "1", "2", "tak terhingga"], correct: 1 },
  { q: "Untuk titik di luar lingkaran, banyak garis singgung = ...", opts: ["0", "1", "2", "tak terhingga"], correct: 2 },
  { q: "Garis singgung dapat dibuat melalui ...", opts: ["pusat", "titik luar", "titik dalam", "diameter"], correct: 1 },
  { q: "Pada lingkaran, garis singgung tidak melewati ...", opts: ["pusat", "titik singgung", "tepi lingkaran", "lintasan"], correct: 0 },
];

const PANJANG_GS: BaseQ[] = [
  { q: "Jari-jari 3 cm, jarak titik luar ke pusat 5 cm. Panjang garis singgung = ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "r=5, OP=13. Panjang garis singgung = ...", opts: ["10", "11", "12", "13"], correct: 2 },
  { q: "r=6, OP=10. Panjang garis singgung = ...", opts: ["6", "7", "8", "9"], correct: 2 },
  { q: "r=8, OP=17. Panjang garis singgung = ...", opts: ["12", "13", "14", "15"], correct: 3 },
  { q: "r=9, OP=15. Panjang garis singgung = ...", opts: ["10", "11", "12", "13"], correct: 2 },
  { q: "r=12, OP=13. Panjang garis singgung = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "r=7, OP=25. Panjang garis singgung = ...", opts: ["20", "22", "24", "25"], correct: 2 },
  { q: "r=15, OP=17. Panjang garis singgung = ...", opts: ["6", "7", "8", "9"], correct: 2 },
  { q: "Rumus panjang garis singgung = √(...)", opts: ["OP²+r²", "OP²−r²", "OP+r", "OP×r"], correct: 1 },
  { q: "Jika r=4 dan panjang garis singgung 3, jarak OP = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Jika r=6 dan garis singgung 8, jarak OP = ...", opts: ["8", "9", "10", "12"], correct: 2 },
  { q: "r=5 dan garis singgung 12, jarak OP = ...", opts: ["10", "11", "12", "13"], correct: 3 },
];

const GSPL: BaseQ[] = [
  { q: "GSPL = Garis Singgung Persekutuan ...", opts: ["Dalam", "Luar", "Tengah", "Atas"], correct: 1 },
  { q: "Rumus GSPL = √(s² − (R−r)²) di mana s adalah ...", opts: ["jari-jari", "jarak pusat", "panjang busur", "luas"], correct: 1 },
  { q: "Jika s=5, R=4, r=1, GSPL = ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Jika s=10, R=6, r=2, GSPL = √(100−16) = ...", opts: ["√76", "√84", "√92", "√100"], correct: 1 },
  { q: "Jika s=13, R=5, r=0 (titik), GSPL = ...", opts: ["10", "11", "12", "13"], correct: 2 },
  { q: "Jika s=15, R=7, r=1, GSPL = √(225−36) = ...", opts: ["√189", "√209", "√225", "√169"], correct: 0 },
  { q: "Jika s=17, R=8, r=0, GSPL = ...", opts: ["13", "14", "15", "17"], correct: 2 },
  { q: "GSPL berlaku jika dua lingkaran ... satu sama lain", opts: ["berimpit", "bersinggungan dalam", "tidak berpotongan", "berpotongan"], correct: 2 },
  { q: "Pada GSPL, garis singgung berada di sisi ... lingkaran", opts: ["dalam", "luar", "tengah", "atas"], correct: 1 },
  { q: "Jika s=25, R=10, r=10, GSPL = ...", opts: ["20", "22", "25", "30"], correct: 2 },
  { q: "Jika s=10, R=3, r=3, GSPL = ...", opts: ["8", "9", "10", "12"], correct: 2 },
  { q: "Jika s=20, R=5, r=4, GSPL = √(400−1) ≈ ...", opts: ["18", "19", "20", "22"], correct: 1 },
];

const GSPD: BaseQ[] = [
  { q: "GSPD = Garis Singgung Persekutuan ...", opts: ["Dalam", "Luar", "Tengah", "Atas"], correct: 0 },
  { q: "Rumus GSPD = √(s² − (R+r)²)", opts: ["Benar", "Salah", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Jika s=10, R=3, r=4, GSPD = √(100−49) = ...", opts: ["√41", "√51", "√61", "√71"], correct: 1 },
  { q: "Jika s=13, R=5, r=4, GSPD = √(169−81) = ...", opts: ["√78", "√88", "√98", "√108"], correct: 1 },
  { q: "Jika s=15, R=4, r=5, GSPD = √(225−81) = ...", opts: ["12", "13", "14", "15"], correct: 0 },
  { q: "Jika s=17, R=8, r=7, GSPD = √(289−225) = ...", opts: ["6", "7", "8", "9"], correct: 2 },
  { q: "Jika s=25, R=10, r=10, GSPD = √(625−400) = ...", opts: ["13", "14", "15", "16"], correct: 2 },
  { q: "Jika s=20, R=6, r=4, GSPD = √(400−100) = ...", opts: ["√300", "√500", "20", "10"], correct: 0 },
  { q: "Pada GSPD, garis singgung melewati ... pusat lingkaran", opts: ["di luar", "di antara", "ke arah", "tegak lurus"], correct: 1 },
  { q: "GSPD ada jika dua lingkaran ...", opts: ["beririsan", "berimpit", "tidak beririsan", "berhimpit"], correct: 2 },
  { q: "Jika s=29, R=12, r=8, GSPD = √(841−400) = ...", opts: ["19", "20", "21", "22"], correct: 2 },
  { q: "Jika s=10, R=4, r=2, GSPD = √(100−36) = ...", opts: ["6", "7", "8", "9"], correct: 2 },
];

const SABUK_LILITAN: BaseQ[] = [
  { q: "Sabuk lilitan adalah penerapan dari konsep ...", opts: ["luas", "keliling lingkaran", "garis singgung & busur", "diameter"], correct: 2 },
  { q: "2 lingkaran sama r=7, jarak pusat 14. Panjang sabuk = (2×14) + (2π×7) ≈ ...", opts: ["44", "60", "72", "84"], correct: 2 },
  { q: "Sabuk yang melingkar 1 silinder r=7 (π=22/7), panjang = ...", opts: ["22", "44", "66", "88"], correct: 1 },
  { q: "Bagian sabuk yang lurus pada 2 silinder identik = ... × jarak pusat", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Bagian sabuk melingkar pada 2 silinder identik = keliling ... lingkaran", opts: ["½", "1", "2", "4"], correct: 1 },
  { q: "Sabuk untuk 3 silinder identik r=7 berbentuk segitiga, lengkungannya = keliling ...", opts: ["½ lingkaran", "1 lingkaran", "1.5 lingkaran", "2 lingkaran"], correct: 1 },
  { q: "Untuk 4 silinder dalam segi-empat, lengkungan total sabuk = ... lingkaran", opts: ["½", "1", "1.5", "2"], correct: 1 },
  { q: "Sabuk lilitan minimal pada 2 koin r=7, jarak pusat 14, lurus = ...", opts: ["14", "28", "42", "56"], correct: 1 },
  { q: "Sabuk minimal 2 lingkaran r=10, jarak 20, bagian lurus = ...", opts: ["20", "30", "40", "50"], correct: 2 },
  { q: "Sabuk minimal 2 lingkaran r=14 (π=22/7), bagian melengkung = ...", opts: ["44", "66", "88", "132"], correct: 2 },
  { q: "Sabuk untuk 1 silinder = ... × jari-jari × π", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Pada lilitan 3 silinder identik berbentuk segitiga sama sisi, sudut total lengkungan = ... derajat", opts: ["180", "270", "360", "540"], correct: 2 },
];

export const GARIS_SINGGUNG_LINGKARAN: SubmaterialEntryK8[] = [
  { slug: "pengertian-sifat", label: "PENGERTIAN & SIFAT GS LINGKARAN", emoji: "✏️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENGERTIAN_SIFAT) },
  { slug: "panjang-garis-singgung", label: "PANJANG GARIS SINGGUNG", emoji: "📏", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PANJANG_GS) },
  { slug: "gspl", label: "GS PERSEKUTUAN LUAR (GSPL)", emoji: "🔵", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(GSPL) },
  { slug: "gspd", label: "GS PERSEKUTUAN DALAM (GSPD)", emoji: "⚪", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(GSPD) },
  { slug: "sabuk-lilitan", label: "SABUK LILITAN MINIMAL", emoji: "🪢", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(SABUK_LILITAN) },
];
