import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "bangun-ruang-sisi-datar";
const PARENT_LABEL = "BANGUN RUANG SISI DATAR";

const KUBUS: BaseQ[] = [
  { q: "Kubus mempunyai ... sisi", opts: ["4", "5", "6", "8"], correct: 2 },
  { q: "Kubus mempunyai ... rusuk", opts: ["8", "10", "12", "14"], correct: 2 },
  { q: "Kubus mempunyai ... titik sudut", opts: ["6", "7", "8", "10"], correct: 2 },
  { q: "Volume kubus dengan sisi s = ...", opts: ["s²", "s³", "6s²", "12s"], correct: 1 },
  { q: "Luas permukaan kubus = ...", opts: ["s²", "s³", "6s²", "12s"], correct: 2 },
  { q: "Volume kubus sisi 3 = ...", opts: ["9", "18", "27", "36"], correct: 2 },
  { q: "Volume kubus sisi 5 = ...", opts: ["25", "50", "100", "125"], correct: 3 },
  { q: "Luas permukaan kubus sisi 4 = ...", opts: ["48", "64", "96", "128"], correct: 2 },
  { q: "Volume kubus sisi 10 = ...", opts: ["100", "500", "1000", "10000"], correct: 2 },
  { q: "Luas permukaan kubus sisi 5 = ...", opts: ["100", "125", "150", "200"], correct: 2 },
  { q: "Diagonal sisi kubus s = ...", opts: ["s", "s√2", "s√3", "2s"], correct: 1 },
  { q: "Diagonal ruang kubus s = ...", opts: ["s", "s√2", "s√3", "2s"], correct: 2 },
];

const BALOK: BaseQ[] = [
  { q: "Balok memiliki ... sisi", opts: ["4", "5", "6", "8"], correct: 2 },
  { q: "Balok memiliki ... rusuk", opts: ["8", "10", "12", "14"], correct: 2 },
  { q: "Balok memiliki ... titik sudut", opts: ["6", "7", "8", "10"], correct: 2 },
  { q: "Volume balok p×l×t. Jika p=4, l=3, t=2, V = ...", opts: ["12", "18", "20", "24"], correct: 3 },
  { q: "Volume balok 5×4×3 = ...", opts: ["12", "30", "40", "60"], correct: 3 },
  { q: "Luas permukaan balok = 2(pl + pt + lt). Untuk 4×3×2 = ...", opts: ["28", "36", "52", "60"], correct: 2 },
  { q: "Volume balok 10×5×4 = ...", opts: ["100", "150", "200", "250"], correct: 2 },
  { q: "Volume balok 6×5×2 = ...", opts: ["30", "40", "50", "60"], correct: 3 },
  { q: "Volume balok 8×3×2 = ...", opts: ["24", "32", "40", "48"], correct: 3 },
  { q: "Luas permukaan balok 5×4×3 = 2(20+15+12) = ...", opts: ["40", "47", "94", "100"], correct: 2 },
  { q: "Volume balok 7×3×2 = ...", opts: ["21", "30", "42", "50"], correct: 2 },
  { q: "Luas permukaan balok 6×4×2 = 2(24+12+8) = ...", opts: ["44", "52", "88", "100"], correct: 2 },
];

const PRISMA: BaseQ[] = [
  { q: "Prisma segitiga memiliki ... sisi", opts: ["4", "5", "6", "8"], correct: 1 },
  { q: "Prisma segitiga memiliki ... rusuk", opts: ["6", "8", "9", "12"], correct: 2 },
  { q: "Prisma segitiga memiliki ... titik sudut", opts: ["4", "5", "6", "8"], correct: 2 },
  { q: "Volume prisma = ...", opts: ["luas alas", "luas alas × tinggi", "alas + tinggi", "alas / tinggi"], correct: 1 },
  { q: "Luas permukaan prisma = 2 × luas alas + ...", opts: ["luas selimut", "tinggi", "alas", "diameter"], correct: 0 },
  { q: "Volume prisma alas segitiga (½×4×3) tinggi 5 = ...", opts: ["20", "30", "40", "60"], correct: 1 },
  { q: "Volume prisma alas segitiga (½×6×4) tinggi 10 = ...", opts: ["60", "100", "120", "150"], correct: 2 },
  { q: "Volume prisma alas persegi sisi 5 tinggi 4 = ...", opts: ["20", "60", "80", "100"], correct: 3 },
  { q: "Prisma segiempat = ...", opts: ["kubus", "balok", "limas", "tabung"], correct: 1 },
  { q: "Volume prisma alas persegi sisi 3 tinggi 6 = ...", opts: ["18", "36", "54", "72"], correct: 2 },
  { q: "Volume prisma alas segitiga (½×8×5) tinggi 10 = ...", opts: ["100", "150", "200", "250"], correct: 2 },
  { q: "Prisma yang alasnya segi-n memiliki ... sisi total", opts: ["n", "n+1", "n+2", "2n"], correct: 2 },
];

const LIMAS: BaseQ[] = [
  { q: "Limas segiempat memiliki ... sisi", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Limas segiempat memiliki ... rusuk", opts: ["6", "7", "8", "10"], correct: 2 },
  { q: "Limas segiempat memiliki ... titik sudut", opts: ["4", "5", "6", "8"], correct: 1 },
  { q: "Limas segitiga memiliki ... sisi", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Limas segitiga memiliki ... titik sudut", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Volume limas = ⅓ × ...", opts: ["alas × tinggi", "luas alas × tinggi", "alas + tinggi", "alas / tinggi"], correct: 1 },
  { q: "Volume limas alas persegi 6×6 tinggi 5 = ⅓×36×5 = ...", opts: ["30", "60", "90", "120"], correct: 1 },
  { q: "Volume limas alas persegi 4×4 tinggi 6 = ⅓×16×6 = ...", opts: ["16", "24", "32", "48"], correct: 2 },
  { q: "Volume limas alas persegi 3×3 tinggi 9 = ⅓×9×9 = ...", opts: ["18", "21", "27", "36"], correct: 2 },
  { q: "Volume limas alas persegi 5×5 tinggi 6 = ⅓×25×6 = ...", opts: ["30", "40", "50", "60"], correct: 2 },
  { q: "Limas T.ABCD memiliki sisi tegak ... buah", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Volume limas alas 30 cm² tinggi 9 = ...", opts: ["60", "70", "80", "90"], correct: 3 },
];

const GABUNGAN: BaseQ[] = [
  { q: "Volume kubus 5 + balok 3×4×5 = 125 + 60 = ...", opts: ["165", "175", "185", "200"], correct: 2 },
  { q: "Kubus sisi 4 + kubus sisi 2 = 64 + 8 = ...", opts: ["64", "70", "72", "80"], correct: 2 },
  { q: "Balok 5×4×3 + kubus 2 = 60 + 8 = ...", opts: ["60", "65", "68", "72"], correct: 2 },
  { q: "Limas alas 3×3 t=6 + kubus 3 = 18+27 = ...", opts: ["35", "42", "45", "50"], correct: 2 },
  { q: "Volume balok 4×3×2 + balok 5×4×3 = 24+60 = ...", opts: ["72", "84", "96", "108"], correct: 1 },
  { q: "Kubus 6 + balok 6×6×2 = 216+72 = ...", opts: ["272", "288", "300", "312"], correct: 1 },
  { q: "Balok 10×5×2 + balok 5×5×2 = 100+50 = ...", opts: ["100", "120", "140", "150"], correct: 3 },
  { q: "Kubus 3 + prisma alas (½×3×4) t=5 = 27 + 30 = ...", opts: ["50", "53", "57", "60"], correct: 2 },
  { q: "Balok 6×4×2 + kubus 4 = 48+64 = ...", opts: ["100", "108", "112", "120"], correct: 2 },
  { q: "Volume rumah-rumahan = balok+limas. Balok 4×4×3, limas alas 4×4 t=3. Volume = 48+16 = ...", opts: ["56", "60", "64", "72"], correct: 2 },
  { q: "Balok 8×3×2 + balok 4×3×2 = 48+24 = ...", opts: ["60", "65", "70", "72"], correct: 3 },
  { q: "Kubus 5 + kubus 3 = 125+27 = ...", opts: ["140", "152", "160", "172"], correct: 1 },
];

const KONTEKSTUAL_BRSD: BaseQ[] = [
  { q: "Aquarium kubus sisi 30 cm. Volume = ... cm³", opts: ["9000", "18000", "27000", "36000"], correct: 2 },
  { q: "Bak air balok 100×50×80. Volume = ... cm³", opts: ["200000", "300000", "400000", "500000"], correct: 2 },
  { q: "Volume kotak 20×10×5 = ... cm³", opts: ["500", "1000", "1500", "2000"], correct: 1 },
  { q: "Sebuah peti kubus sisi 8 dm. Volume = ... dm³", opts: ["256", "384", "512", "640"], correct: 2 },
  { q: "Kotak balok 12×8×5. Volume = ... cm³", opts: ["320", "400", "480", "560"], correct: 2 },
  { q: "Akuarium balok 60×40×30. Volume = ... cm³", opts: ["52000", "62000", "72000", "82000"], correct: 2 },
  { q: "Rusuk kubus diketahui 7 cm. Luas permukaan = ... cm²", opts: ["196", "294", "343", "490"], correct: 1 },
  { q: "Kemasan susu kubus sisi 10 cm. Volume = ... cm³", opts: ["100", "1000", "10000", "100000"], correct: 1 },
  { q: "Sebuah kolam balok 5×3×2 m. Volume = ... m³", opts: ["20", "25", "30", "35"], correct: 2 },
  { q: "Sebuah peti balok 50×40×20 cm. Volume = ... cm³", opts: ["20000", "30000", "40000", "50000"], correct: 2 },
  { q: "Tenda kemah berbentuk prisma alas (½×4×3) m, panjang 5 m. Volume = ... m³", opts: ["20", "30", "40", "60"], correct: 1 },
  { q: "Atap rumah berbentuk limas alas 6×6, tinggi 4 m. Volume = ... m³", opts: ["24", "36", "48", "72"], correct: 2 },
];

export const BANGUN_RUANG_SISI_DATAR: SubmaterialEntryK8[] = [
  { slug: "kubus-game", label: "KUBUS", emoji: "🧊", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KUBUS) },
  { slug: "balok-game", label: "BALOK", emoji: "📦", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(BALOK) },
  { slug: "prisma-game", label: "PRISMA", emoji: "🔺", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PRISMA) },
  { slug: "limas-game", label: "LIMAS", emoji: "🔺", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(LIMAS) },
  { slug: "gabungan-game", label: "BRSD GABUNGAN", emoji: "🔗", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(GABUNGAN) },
  { slug: "kontekstual-game", label: "MASALAH KONTEKSTUAL BRSD", emoji: "🏠", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KONTEKSTUAL_BRSD) },
];
