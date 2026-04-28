import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "peluang";
const PARENT_LABEL = "PELUANG";

const RUANG_SAMPEL: BaseQ[] = [
  { q: "Ruang sampel pelemparan koin adalah ...", opts: ["{A}", "{G}", "{A,G}", "{1,2}"], correct: 2 },
  { q: "Banyak titik sampel pelemparan dadu = ...", opts: ["2", "4", "6", "12"], correct: 2 },
  { q: "Banyak titik sampel 1 koin = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Ruang sampel dadu = ...", opts: ["{1..6}", "{1..10}", "{1..5}", "{0..6}"], correct: 0 },
  { q: "Banyak titik sampel 2 koin = ...", opts: ["2", "3", "4", "6"], correct: 2 },
  { q: "Banyak titik sampel pelemparan 2 dadu = ...", opts: ["12", "24", "36", "48"], correct: 2 },
  { q: "n(S) untuk 1 dadu = ...", opts: ["3", "4", "5", "6"], correct: 3 },
  { q: "n(S) untuk 3 koin = ...", opts: ["3", "6", "8", "9"], correct: 2 },
  { q: "Titik sampel adalah ...", opts: ["semua hasil", "1 hasil", "rata-rata", "modus"], correct: 1 },
  { q: "Ruang sampel adalah ...", opts: ["1 hasil", "himpunan semua hasil", "data terbesar", "kuartil"], correct: 1 },
  { q: "Ruang sampel kartu remi (tanpa joker) = ...", opts: ["48", "50", "52", "54"], correct: 2 },
  { q: "Banyak titik sampel pelemparan 1 koin dan 1 dadu = ...", opts: ["6", "8", "10", "12"], correct: 3 },
];

const PELUANG_EMPIRIK: BaseQ[] = [
  { q: "Peluang empirik = frekuensi muncul ÷ ...", opts: ["banyak hasil", "banyak percobaan", "ruang sampel", "modus"], correct: 1 },
  { q: "Dari 100 lemparan koin, sisi A muncul 60×. Peluang empirik A = ...", opts: ["0,4", "0,5", "0,6", "0,7"], correct: 2 },
  { q: "Dari 50 lemparan koin, G muncul 25×. Peluang empirik G = ...", opts: ["0,25", "0,5", "0,75", "1"], correct: 1 },
  { q: "Dari 10 lemparan dadu, mata 6 muncul 2×. Peluang empirik = ...", opts: ["0,1", "0,2", "0,3", "0,5"], correct: 1 },
  { q: "Peluang empirik bernilai antara ...", opts: ["−1 dan 0", "0 dan 1", "1 dan 2", "0 dan 100"], correct: 1 },
  { q: "Frekuensi relatif = ...", opts: ["jumlah percobaan", "frekuensi ÷ banyak percobaan", "modus", "kuartil"], correct: 1 },
  { q: "20 lemparan dadu, mata 1 muncul 4×. Peluang empirik = ...", opts: ["0,1", "0,2", "0,3", "0,5"], correct: 1 },
  { q: "100 lemparan dadu, mata 5 muncul 20×. Peluang empirik = ...", opts: ["0,1", "0,2", "0,3", "0,5"], correct: 1 },
  { q: "Peluang empirik koin G = 0,4. Dari 50 lemparan G muncul ... kali", opts: ["10", "15", "20", "25"], correct: 2 },
  { q: "Banyaknya percobaan disimbolkan ...", opts: ["n(K)", "n(S)", "f", "n"], correct: 3 },
  { q: "Dari 200 lemparan koin, A muncul 100×. Peluang empirik = ...", opts: ["0,25", "0,5", "0,75", "1"], correct: 1 },
  { q: "Peluang empirik makin akurat jika percobaan ...", opts: ["sedikit", "banyak", "tidak ada", "1×"], correct: 1 },
];

const PELUANG_TEORETIK: BaseQ[] = [
  { q: "Peluang teoretik = n(K) ÷ ...", opts: ["frekuensi", "n(S)", "f relatif", "rata-rata"], correct: 1 },
  { q: "Peluang muncul mata genap dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 2 },
  { q: "Peluang muncul mata ≥4 dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 2 },
  { q: "Peluang muncul A pada lemparan 1 koin = ...", opts: ["0", "1/4", "1/2", "1"], correct: 2 },
  { q: "Peluang muncul mata 1 dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 0 },
  { q: "Peluang teoretik bernilai antara ...", opts: ["−1 dan 0", "0 dan 1", "0 dan 100", "1 dan 6"], correct: 1 },
  { q: "Peluang muncul mata ganjil dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 2 },
  { q: "Peluang muncul mata kelipatan 3 dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 1 },
  { q: "Peluang muncul mata > 6 dadu = ...", opts: ["0", "1/6", "1/2", "1"], correct: 0 },
  { q: "Peluang muncul mata ≤ 6 dadu = ...", opts: ["0", "1/6", "1/2", "1"], correct: 3 },
  { q: "Peluang kartu hati dari 52 kartu = ...", opts: ["1/2", "1/3", "1/4", "1/13"], correct: 2 },
  { q: "Peluang muncul mata prima dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 2 },
];

const FREKUENSI_HARAPAN: BaseQ[] = [
  { q: "Frekuensi harapan = peluang × ...", opts: ["banyak data", "banyak percobaan", "modus", "rata-rata"], correct: 1 },
  { q: "Koin dilempar 100×. Fh muncul A = ...", opts: ["25", "50", "75", "100"], correct: 1 },
  { q: "Dadu dilempar 60×. Fh mata 6 = ...", opts: ["6", "10", "15", "20"], correct: 1 },
  { q: "Dadu dilempar 30×. Fh mata genap = ...", opts: ["10", "15", "20", "25"], correct: 1 },
  { q: "Dadu dilempar 36×. Fh mata 1 = ...", opts: ["3", "6", "9", "12"], correct: 1 },
  { q: "Koin dilempar 50×. Fh G = ...", opts: ["20", "25", "30", "50"], correct: 1 },
  { q: "Dadu dilempar 12×. Fh mata ganjil = ...", opts: ["3", "4", "6", "8"], correct: 2 },
  { q: "Dadu dilempar 60×. Fh mata <3 = ...", opts: ["10", "15", "20", "30"], correct: 2 },
  { q: "Dadu dilempar 18×. Fh mata 2 = ...", opts: ["2", "3", "4", "6"], correct: 1 },
  { q: "Koin dilempar 200×. Fh A = ...", opts: ["50", "100", "150", "200"], correct: 1 },
  { q: "Dadu dilempar 24×. Fh mata kelipatan 3 = ...", opts: ["4", "6", "8", "12"], correct: 2 },
  { q: "Dadu dilempar 90×. Fh mata 5 = ...", opts: ["10", "15", "20", "30"], correct: 1 },
];

const KOMPLEMEN: BaseQ[] = [
  { q: "Peluang komplemen kejadian K = ...", opts: ["P(K)", "1 − P(K)", "P(K)+1", "P(K)×2"], correct: 1 },
  { q: "Jika P(K)=0,3, maka P(Kᶜ) = ...", opts: ["0,3", "0,5", "0,7", "1"], correct: 2 },
  { q: "Jika P(A)=1/4, maka P(Aᶜ) = ...", opts: ["1/4", "2/4", "3/4", "4/4"], correct: 2 },
  { q: "Jika P(B)=0,8, maka P(Bᶜ) = ...", opts: ["0,1", "0,2", "0,3", "0,4"], correct: 1 },
  { q: "P(K) + P(Kᶜ) = ...", opts: ["0", "0,5", "1", "2"], correct: 2 },
  { q: "Peluang bukan mata 6 dadu = ...", opts: ["1/6", "2/6", "5/6", "6/6"], correct: 2 },
  { q: "Peluang bukan A pada koin = ...", opts: ["0", "1/4", "1/2", "1"], correct: 2 },
  { q: "Peluang bukan mata ganjil dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 2 },
  { q: "Jika P(K)=0,5, maka P(Kᶜ) = ...", opts: ["0,25", "0,5", "0,75", "1"], correct: 1 },
  { q: "Peluang bukan mata genap dadu = ...", opts: ["1/6", "2/6", "3/6", "4/6"], correct: 2 },
  { q: "Jika P(A)=2/5, maka P(Aᶜ) = ...", opts: ["1/5", "2/5", "3/5", "4/5"], correct: 2 },
  { q: "Peluang bukan kartu hati dari 52 kartu = ...", opts: ["1/4", "2/4", "3/4", "1"], correct: 2 },
];

const KEJADIAN_MAJEMUK: BaseQ[] = [
  { q: "Kejadian majemuk = gabungan dua atau lebih ...", opts: ["data", "kejadian", "rata-rata", "median"], correct: 1 },
  { q: "P(A∪B) = P(A) + P(B) − P(A∩B). Ini berlaku untuk kejadian ...", opts: ["saling lepas", "umum", "tunggal", "kosong"], correct: 1 },
  { q: "Jika A dan B saling lepas, P(A∩B) = ...", opts: ["0", "0,5", "1", "P(A)·P(B)"], correct: 0 },
  { q: "Jika A dan B saling bebas, P(A∩B) = ...", opts: ["0", "P(A)+P(B)", "P(A)·P(B)", "1"], correct: 2 },
  { q: "P(A)=1/2, P(B)=1/3, A&B bebas. P(A∩B) = ...", opts: ["1/4", "1/5", "1/6", "1/9"], correct: 2 },
  { q: "Pelemparan dua koin: peluang AA = ...", opts: ["1/2", "1/3", "1/4", "1/8"], correct: 2 },
  { q: "Pelemparan dua koin: peluang minimal 1 A = ...", opts: ["1/4", "1/2", "3/4", "1"], correct: 2 },
  { q: "Dua dadu: peluang jumlah=7 = ...", opts: ["1/6", "1/9", "1/12", "1/36"], correct: 0 },
  { q: "Dua dadu: peluang dua-duanya 6 = ...", opts: ["1/6", "1/12", "1/18", "1/36"], correct: 3 },
  { q: "P(A)+P(B), A&B saling lepas memberi ...", opts: ["P(A∪B)", "P(A∩B)", "P(A)·P(B)", "0"], correct: 0 },
  { q: "Pelemparan koin & dadu: peluang A & 6 = ...", opts: ["1/4", "1/6", "1/8", "1/12"], correct: 3 },
  { q: "P(A)=0,4, P(B)=0,5 saling lepas. P(A∪B) = ...", opts: ["0,2", "0,5", "0,7", "0,9"], correct: 3 },
];

export const PELUANG: SubmaterialEntryK9[] = [
  { slug: "ruang-sampel", label: "RUANG SAMPEL & TITIK SAMPEL", emoji: "🎲", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(RUANG_SAMPEL) },
  { slug: "peluang-empirik", label: "PELUANG EMPIRIK", emoji: "📊", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PELUANG_EMPIRIK) },
  { slug: "peluang-teoretik", label: "PELUANG TEORETIK", emoji: "🎯", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PELUANG_TEORETIK) },
  { slug: "frekuensi-harapan", label: "FREKUENSI HARAPAN", emoji: "🔮", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(FREKUENSI_HARAPAN) },
  { slug: "komplemen", label: "KOMPLEMEN KEJADIAN", emoji: "🔁", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KOMPLEMEN) },
  { slug: "kejadian-majemuk", label: "PELUANG KEJADIAN MAJEMUK", emoji: "🎰", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KEJADIAN_MAJEMUK) },
];
