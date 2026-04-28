import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "lingkaran";
const PARENT_LABEL = "LINGKARAN";

const UNSUR_LINGKARAN: BaseQ[] = [
  { q: "Garis lurus dari pusat ke tepi lingkaran disebut ...", opts: ["diameter", "jari-jari", "tali busur", "busur"], correct: 1 },
  { q: "Garis lurus melalui pusat dengan ujung di tepi lingkaran disebut ...", opts: ["jari-jari", "diameter", "tali busur", "apotema"], correct: 1 },
  { q: "Hubungan jari-jari (r) dan diameter (d): d = ...", opts: ["r", "2r", "r/2", "r²"], correct: 1 },
  { q: "Tali busur adalah ...", opts: ["garis dari pusat", "garis hubung 2 titik di tepi", "garis lengkung", "diameter"], correct: 1 },
  { q: "Bagian lengkung lingkaran disebut ...", opts: ["tali busur", "busur", "juring", "tembereng"], correct: 1 },
  { q: "Daerah yang dibatasi 2 jari-jari dan busur disebut ...", opts: ["juring", "tembereng", "diameter", "tali busur"], correct: 0 },
  { q: "Daerah yang dibatasi tali busur dan busur disebut ...", opts: ["juring", "tembereng", "apotema", "diameter"], correct: 1 },
  { q: "Pusat lingkaran biasanya dilambangkan ...", opts: ["A", "P", "O", "X"], correct: 2 },
  { q: "Diameter sama dengan ... × jari-jari", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Jari-jari = ... × diameter", opts: ["1", "2", "1/2", "1/4"], correct: 2 },
  { q: "Lingkaran dengan diameter 10 cm, jari-jari = ... cm", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Lingkaran dengan jari-jari 7 cm, diameter = ... cm", opts: ["10", "12", "14", "16"], correct: 2 },
];

const KELILING_LUAS: BaseQ[] = [
  { q: "Rumus keliling lingkaran adalah ...", opts: ["πr", "2πr", "πr²", "4πr"], correct: 1 },
  { q: "Rumus luas lingkaran adalah ...", opts: ["πr", "2πr", "πr²", "πd"], correct: 2 },
  { q: "Nilai π yang sering dipakai adalah ...", opts: ["2", "3", "3.14", "4"], correct: 2 },
  { q: "Keliling lingkaran r=7, π=22/7 adalah ...", opts: ["22", "44", "49", "154"], correct: 1 },
  { q: "Luas lingkaran r=7, π=22/7 adalah ...", opts: ["22", "44", "49", "154"], correct: 3 },
  { q: "Keliling lingkaran r=14, π=22/7 adalah ...", opts: ["44", "66", "88", "132"], correct: 2 },
  { q: "Luas lingkaran r=14, π=22/7 adalah ...", opts: ["196", "308", "616", "924"], correct: 2 },
  { q: "Keliling lingkaran r=10, π=3.14 adalah ...", opts: ["31.4", "62.8", "100", "314"], correct: 1 },
  { q: "Luas lingkaran r=10, π=3.14 adalah ...", opts: ["31.4", "62.8", "100", "314"], correct: 3 },
  { q: "Keliling lingkaran d=14, π=22/7 adalah ...", opts: ["22", "44", "88", "154"], correct: 1 },
  { q: "Luas lingkaran r=21, π=22/7 adalah ...", opts: ["1386", "1320", "1260", "1156"], correct: 0 },
  { q: "Diameter lingkaran 28 cm, kelilingnya (π=22/7) = ...", opts: ["44", "66", "88", "132"], correct: 2 },
];

const KAITAN_BANGUN_DATAR: BaseQ[] = [
  { q: "Persegi dengan sisi sama dengan diameter lingkaran. Jika sisi=14, jari-jari = ...", opts: ["5", "6", "7", "10"], correct: 2 },
  { q: "Lingkaran tepat di dalam persegi sisi 10. Diameter = ...", opts: ["5", "10", "15", "20"], correct: 1 },
  { q: "Lingkaran luar persegi sisi 1, diagonalnya = diameter = ...", opts: ["1", "√2", "2", "√3"], correct: 1 },
  { q: "Persegi dengan sisi 10, lingkaran dalamnya berjari-jari ...", opts: ["3", "4", "5", "10"], correct: 2 },
  { q: "Luas persegi sisi 14 = ...", opts: ["49", "98", "196", "256"], correct: 2 },
  { q: "Selisih luas persegi sisi 14 dan luas lingkaran r=7 (π=22/7) = ...", opts: ["28", "32", "42", "54"], correct: 2 },
  { q: "Lingkaran luar segitiga sama sisi: pusatnya disebut ...", opts: ["fokus", "titik berat", "circumcenter", "incenter"], correct: 2 },
  { q: "Lingkaran dalam segitiga: pusatnya disebut ...", opts: ["incenter", "circumcenter", "fokus", "asimtot"], correct: 0 },
  { q: "Persegi panjang 8×6, diagonalnya (Pythagoras) = ...", opts: ["10", "12", "14", "16"], correct: 0 },
  { q: "Jari-jari lingkaran luar persegi panjang 6×8 (½ diagonal) = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Luas daerah persegi sisi 7 yang tidak ditutupi lingkaran r=3.5 (π=22/7) = ...", opts: ["10.5", "12.25", "14.5", "21"], correct: 0 },
  { q: "Lingkaran dalam persegi sisi 14, jari-jari = ...", opts: ["5", "6", "7", "10"], correct: 2 },
];

const BUSUR_JURING: BaseQ[] = [
  { q: "Panjang busur = (sudut/360°) × ...", opts: ["luas lingkaran", "keliling lingkaran", "diameter", "jari-jari"], correct: 1 },
  { q: "Luas juring = (sudut/360°) × ...", opts: ["luas lingkaran", "keliling lingkaran", "diameter", "jari-jari"], correct: 0 },
  { q: "Panjang busur 90° dengan keliling 360 = ...", opts: ["60", "75", "90", "120"], correct: 2 },
  { q: "Panjang busur 180° dengan keliling 360 = ...", opts: ["90", "150", "180", "270"], correct: 2 },
  { q: "Luas juring 90° dengan luas lingkaran 360 = ...", opts: ["60", "75", "90", "120"], correct: 2 },
  { q: "Luas juring 60° dengan luas lingkaran 360 = ...", opts: ["30", "60", "90", "120"], correct: 1 },
  { q: "Panjang busur 60° dengan keliling 36 = ...", opts: ["3", "6", "9", "12"], correct: 1 },
  { q: "Sudut juring setengah lingkaran = ... derajat", opts: ["90", "120", "180", "270"], correct: 2 },
  { q: "Sudut juring seperempat lingkaran = ... derajat", opts: ["45", "60", "90", "120"], correct: 2 },
  { q: "Panjang busur 120° dengan keliling 36 = ...", opts: ["6", "9", "12", "15"], correct: 2 },
  { q: "Luas juring 120° dengan luas 36 = ...", opts: ["6", "9", "12", "15"], correct: 2 },
  { q: "Sudut pusat untuk busur ¾ lingkaran = ... derajat", opts: ["180", "240", "270", "300"], correct: 2 },
];

const SUDUT_PUSAT_KELILING: BaseQ[] = [
  { q: "Sudut pusat = ... × sudut keliling pada busur yang sama", opts: ["1/2", "1", "2", "3"], correct: 2 },
  { q: "Sudut keliling = ... × sudut pusat pada busur yang sama", opts: ["1/2", "1", "2", "3"], correct: 0 },
  { q: "Jika sudut pusat 80°, sudut keliling = ... derajat", opts: ["20", "30", "40", "60"], correct: 2 },
  { q: "Jika sudut keliling 30°, sudut pusat = ... derajat", opts: ["15", "30", "45", "60"], correct: 3 },
  { q: "Sudut keliling pada diameter = ... derajat", opts: ["45", "60", "90", "180"], correct: 2 },
  { q: "Sudut keliling menghadap busur 100° (sudut pusat) = ... derajat", opts: ["25", "50", "75", "100"], correct: 1 },
  { q: "Sudut pusat 60°, sudut keliling = ...", opts: ["20", "30", "40", "60"], correct: 1 },
  { q: "Sudut pusat 120°, sudut keliling = ...", opts: ["30", "60", "90", "120"], correct: 1 },
  { q: "Sudut keliling 45°, sudut pusat = ...", opts: ["45", "60", "75", "90"], correct: 3 },
  { q: "Sudut pusat 180°, sudut keliling = ...", opts: ["45", "60", "75", "90"], correct: 3 },
  { q: "Sudut keliling 60°, sudut pusat = ...", opts: ["60", "90", "120", "180"], correct: 2 },
  { q: "Sudut pusat 200°, sudut keliling = ...", opts: ["50", "75", "100", "150"], correct: 2 },
];

const PENERAPAN_LINGKARAN: BaseQ[] = [
  { q: "Roda berdiameter 70 cm. Keliling (π=22/7) = ...", opts: ["44", "110", "154", "220"], correct: 3 },
  { q: "Kolam lingkaran r=7 m, kelilingnya = ... m (π=22/7)", opts: ["22", "44", "49", "154"], correct: 1 },
  { q: "Luas pizza r=14 cm (π=22/7) = ... cm²", opts: ["44", "88", "308", "616"], correct: 3 },
  { q: "Roda berkeliling 88 cm berputar 50 kali. Jarak total = ... cm", opts: ["1750", "2500", "4400", "8800"], correct: 2 },
  { q: "Tutup tabung r=7, luasnya = ... (π=22/7)", opts: ["22", "44", "154", "308"], correct: 2 },
  { q: "Lingkaran r=21, kelilingnya = ... (π=22/7)", opts: ["66", "88", "132", "176"], correct: 2 },
  { q: "Lingkaran r=21, luasnya = ... (π=22/7)", opts: ["616", "924", "1386", "1521"], correct: 2 },
  { q: "Sebuah jam dinding berdiameter 28 cm. Keliling = ... (π=22/7)", opts: ["44", "66", "88", "132"], correct: 2 },
  { q: "Pizza r=10 cm dipotong 4 sama besar, luas tiap potong (π=3.14) = ...", opts: ["31.4", "62.8", "78.5", "100"], correct: 2 },
  { q: "Lapangan lingkaran r=14, ditanami rumput. Luas rumput = ... (π=22/7)", opts: ["88", "154", "308", "616"], correct: 3 },
  { q: "Roda r=21 cm berputar 1 kali = ... cm jarak", opts: ["66", "88", "132", "176"], correct: 2 },
  { q: "Donat dengan diameter 14 dan lubang diameter 7. Luas donat (π=22/7) = ...", opts: ["77", "115.5", "154", "192.5"], correct: 1 },
];

export const LINGKARAN: SubmaterialEntryK8[] = [
  { slug: "unsur-unsur", label: "UNSUR-UNSUR LINGKARAN", emoji: "⭕", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(UNSUR_LINGKARAN) },
  { slug: "keliling-luas", label: "KELILING & LUAS LINGKARAN", emoji: "📏", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KELILING_LUAS) },
  { slug: "kaitan-bangun-datar", label: "KAITAN DGN BANGUN DATAR", emoji: "🔷", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KAITAN_BANGUN_DATAR) },
  { slug: "busur-juring", label: "PANJANG BUSUR & LUAS JURING", emoji: "🥧", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(BUSUR_JURING) },
  { slug: "sudut-pusat-keliling", label: "SUDUT PUSAT & KELILING", emoji: "🎯", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(SUDUT_PUSAT_KELILING) },
  { slug: "penerapan-kontekstual", label: "PENERAPAN KONTEKSTUAL", emoji: "🚲", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENERAPAN_LINGKARAN) },
];
