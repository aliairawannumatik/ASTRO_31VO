import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "teorema-pythagoras";
const PARENT_LABEL = "TEOREMA PYTHAGORAS";

const PEMBUKTIAN: BaseQ[] = [
  { q: "Teorema Pythagoras berlaku pada segitiga ...", opts: ["sembarang", "sama kaki", "siku-siku", "tumpul"], correct: 2 },
  { q: "Rumus Pythagoras: c² = ...", opts: ["a+b", "a²+b²", "a×b", "a²−b²"], correct: 1 },
  { q: "Sisi terpanjang segitiga siku-siku disebut ...", opts: ["sisi siku", "hipotenusa/miring", "alas", "tinggi"], correct: 1 },
  { q: "Pada segitiga siku-siku, sisi miring berhadapan dengan sudut ...", opts: ["lancip", "siku-siku", "tumpul", "lurus"], correct: 1 },
  { q: "Pythagoras hanya berlaku pada bangun datar segitiga ...", opts: ["lancip", "siku-siku", "tumpul", "tumpul lancip"], correct: 1 },
  { q: "Jumlah sudut segitiga = ... derajat", opts: ["90", "120", "180", "360"], correct: 2 },
  { q: "Sudut siku-siku besarnya = ... derajat", opts: ["45", "60", "90", "180"], correct: 2 },
  { q: "Pada segitiga siku-siku, dua sisi siku-siku saling ...", opts: ["sejajar", "tegak lurus", "berimpit", "berpotongan miring"], correct: 1 },
  { q: "Dalam Pythagoras, kuadrat sisi miring = jumlah kuadrat ... sisi", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Notasi sisi siku-siku biasanya ...", opts: ["a, b", "c, d", "x, y", "p, q"], correct: 0 },
  { q: "Notasi sisi miring biasanya ...", opts: ["a", "b", "c", "d"], correct: 2 },
  { q: "Bukti visual Pythagoras menggunakan ... yang menempel", opts: ["lingkaran", "persegi", "segitiga", "trapesium"], correct: 1 },
];

const MENGHITUNG_PANJANG: BaseQ[] = [
  { q: "Sisi siku-siku 3 dan 4, sisi miring = ...", opts: ["5", "6", "7", "8"], correct: 0 },
  { q: "Sisi siku-siku 6 dan 8, sisi miring = ...", opts: ["8", "9", "10", "12"], correct: 2 },
  { q: "Sisi siku-siku 5 dan 12, sisi miring = ...", opts: ["10", "12", "13", "14"], correct: 2 },
  { q: "Sisi siku-siku 8 dan 15, sisi miring = ...", opts: ["15", "17", "19", "20"], correct: 1 },
  { q: "Sisi siku-siku 9 dan 12, sisi miring = ...", opts: ["13", "14", "15", "16"], correct: 2 },
  { q: "Sisi miring 13, satu sisi 5, sisi lain = ...", opts: ["10", "11", "12", "13"], correct: 2 },
  { q: "Sisi miring 10, satu sisi 6, sisi lain = ...", opts: ["6", "7", "8", "9"], correct: 2 },
  { q: "Sisi miring 25, satu sisi 7, sisi lain = ...", opts: ["20", "22", "24", "25"], correct: 2 },
  { q: "Sisi siku-siku 1 dan 1, sisi miring = ...", opts: ["1", "√2", "2", "√3"], correct: 1 },
  { q: "Sisi siku-siku 2 dan 2, sisi miring = ...", opts: ["2", "2√2", "4", "8"], correct: 1 },
  { q: "Diagonal persegi sisi 3 = ...", opts: ["3", "3√2", "6", "9"], correct: 1 },
  { q: "Diagonal persegi panjang 6×8 = ...", opts: ["8", "10", "12", "14"], correct: 1 },
];

const TRIPLE_PYTHAGORAS: BaseQ[] = [
  { q: "Triple Pythagoras yang paling kecil adalah ...", opts: ["1,2,3", "3,4,5", "5,6,7", "6,7,8"], correct: 1 },
  { q: "Apakah 5,12,13 triple Pythagoras?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Apakah 8,15,17 triple Pythagoras?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Apakah 7,24,25 triple Pythagoras?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Apakah 9,12,15 triple Pythagoras?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Apakah 6,8,10 triple Pythagoras?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Apakah 2,3,4 triple Pythagoras?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 1 },
  { q: "Triple 3,4,5 dikalikan 2 menjadi ...", opts: ["3,4,5", "6,8,10", "5,7,9", "4,6,8"], correct: 1 },
  { q: "Triple 5,12,13 dikalikan 2 menjadi ...", opts: ["10,24,26", "10,12,13", "5,24,26", "10,24,13"], correct: 0 },
  { q: "3,4,5 dikalikan 3 menjadi ...", opts: ["6,8,10", "9,12,15", "12,16,20", "3,4,5"], correct: 1 },
  { q: "Apakah 1,1,√2 triple Pythagoras?", opts: ["Ya (irasional)", "Tidak", "Salah", "Tidak ada"], correct: 0 },
  { q: "Manakah triple Pythagoras: 5,12,13 / 4,5,6 / 7,8,9 / 6,7,8?", opts: ["5,12,13", "4,5,6", "7,8,9", "6,7,8"], correct: 0 },
];

const JENIS_SEGITIGA: BaseQ[] = [
  { q: "Jika a²+b² = c², segitiga termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "sembarang"], correct: 1 },
  { q: "Jika a²+b² > c², segitiga termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak ada"], correct: 0 },
  { q: "Jika a²+b² < c², segitiga termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak ada"], correct: 2 },
  { q: "Segitiga 3,4,5 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "sembarang"], correct: 1 },
  { q: "Segitiga 6,8,10 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "sama sisi"], correct: 1 },
  { q: "Segitiga 4,5,6 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak mungkin"], correct: 0 },
  { q: "Segitiga 5,6,9 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak mungkin"], correct: 2 },
  { q: "Segitiga 5,12,13 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak ada"], correct: 1 },
  { q: "Segitiga 7,24,25 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak ada"], correct: 1 },
  { q: "Segitiga 8,15,17 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak ada"], correct: 1 },
  { q: "Segitiga 2,3,4 termasuk ...", opts: ["lancip", "siku-siku", "tumpul", "tidak ada"], correct: 2 },
  { q: "Untuk uji jenis segitiga, kuadratkan sisi ...", opts: ["sama", "terpanjang", "terpendek", "tengah"], correct: 1 },
];

const SUDUT_KHUSUS: BaseQ[] = [
  { q: "Pada segitiga siku-siku 30°-60°-90°, sisi terpendek adalah ...", opts: ["depan 30°", "depan 60°", "depan 90°", "tidak ada"], correct: 0 },
  { q: "Pada 30°-60°-90° dengan sisi pendek 1, sisi tengah = ...", opts: ["1", "√2", "√3", "2"], correct: 2 },
  { q: "Pada 30°-60°-90° dengan sisi pendek 1, sisi miring = ...", opts: ["1", "√2", "√3", "2"], correct: 3 },
  { q: "Pada segitiga siku-siku sama kaki (45°-45°-90°), perbandingan sisi = ...", opts: ["1:1:1", "1:1:√2", "1:2:3", "1:√3:2"], correct: 1 },
  { q: "Pada 45°-45°-90° dengan sisi 1, miring = ...", opts: ["1", "√2", "√3", "2"], correct: 1 },
  { q: "Pada 30°-60°-90° dengan sisi pendek 2, miring = ...", opts: ["2", "3", "4", "2√3"], correct: 2 },
  { q: "Pada 30°-60°-90° sisi pendek 4, sisi tengah = ...", opts: ["4", "4√3", "8", "8√3"], correct: 1 },
  { q: "Pada 45°-45°-90° dengan sisi 3, miring = ...", opts: ["3", "3√2", "6", "9"], correct: 1 },
  { q: "Pada 45°-45°-90° dengan sisi 5, miring = ...", opts: ["5", "5√2", "10", "25"], correct: 1 },
  { q: "Sin 30° = ...", opts: ["1/2", "√2/2", "√3/2", "1"], correct: 0 },
  { q: "Sin 45° = ...", opts: ["1/2", "√2/2", "√3/2", "1"], correct: 1 },
  { q: "Sin 60° = ...", opts: ["1/2", "√2/2", "√3/2", "1"], correct: 2 },
];

const PENERAPAN_KONTEKSTUAL: BaseQ[] = [
  { q: "Tangga 5 m, kaki tangga 3 m dari dinding. Tinggi dinding = ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Tangga 13 m, kaki 5 m dari dinding. Tinggi = ...", opts: ["10", "11", "12", "13"], correct: 2 },
  { q: "Layang berjalan utara 6 m lalu timur 8 m. Jarak terpendek = ...", opts: ["7", "8", "10", "12"], correct: 2 },
  { q: "Andi jalan 9 m timur, 12 m utara. Jarak terpendek = ...", opts: ["13", "14", "15", "16"], correct: 2 },
  { q: "Tinggi tiang 12 m, panjang bayangan 5 m. Jarak ujung tiang ke ujung bayangan = ...", opts: ["13", "14", "15", "17"], correct: 0 },
  { q: "Sebuah persegi panjang 8×6, panjang diagonalnya = ...", opts: ["10", "12", "14", "16"], correct: 0 },
  { q: "Diagonal persegi sisi 4 = ...", opts: ["4", "4√2", "8", "16"], correct: 1 },
  { q: "Tangga 25 m, jarak dasar tangga ke dinding 7 m. Tinggi tembok = ...", opts: ["20", "22", "24", "25"], correct: 2 },
  { q: "Mobil ke utara 24 km lalu timur 7 km. Jarak terpendek = ...", opts: ["23", "24", "25", "26"], correct: 2 },
  { q: "Pada layang-layang dengan sisi siku-siku 9 dan 12, panjang miring = ...", opts: ["13", "14", "15", "16"], correct: 2 },
  { q: "Tangga 17 m, dasar tangga 8 m dari tembok. Tinggi tembok = ...", opts: ["13", "14", "15", "16"], correct: 2 },
  { q: "Diagonal kotak 3×4: ...", opts: ["3", "4", "5", "7"], correct: 2 },
];

export const TEOREMA_PYTHAGORAS: SubmaterialEntryK8[] = [
  { slug: "pembuktian", label: "PEMBUKTIAN TEOREMA PYTHAGORAS", emoji: "📐", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PEMBUKTIAN) },
  { slug: "menghitung-panjang", label: "MENGHITUNG PANJANG SISI", emoji: "🔢", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MENGHITUNG_PANJANG) },
  { slug: "triple-pythagoras", label: "TRIPLE PYTHAGORAS", emoji: "🔺", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(TRIPLE_PYTHAGORAS) },
  { slug: "jenis-segitiga", label: "PYTHAGORAS & JENIS SEGITIGA", emoji: "📏", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(JENIS_SEGITIGA) },
  { slug: "sudut-khusus", label: "SUDUT KHUSUS (30°,45°,60°)", emoji: "🌟", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(SUDUT_KHUSUS) },
  { slug: "penerapan-kontekstual", label: "PENERAPAN KONTEKSTUAL", emoji: "🏗️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENERAPAN_KONTEKSTUAL) },
];
