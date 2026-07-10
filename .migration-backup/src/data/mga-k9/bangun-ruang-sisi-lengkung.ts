import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "bangun-ruang-sisi-lengkung";
const PARENT_LABEL = "BANGUN RUANG SISI LENGKUNG";

const TABUNG: BaseQ[] = [
  { q: "Tabung memiliki ... sisi", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Sisi alas dan tutup tabung berbentuk ...", opts: ["persegi", "lingkaran", "segitiga", "elips"], correct: 1 },
  { q: "Volume tabung r=7, t=10 (π=22/7) = ...", opts: ["770", "1.540", "2.310", "3.080"], correct: 1 },
  { q: "Volume tabung r=3, t=10, π=3,14 = ...", opts: ["94,2", "188,4", "282,6", "376,8"], correct: 2 },
  { q: "Luas alas tabung jari-jari 7 (π=22/7) = ...", opts: ["44", "77", "154", "308"], correct: 2 },
  { q: "Luas selimut tabung r=7, t=10 (π=22/7) = ...", opts: ["220", "440", "660", "880"], correct: 1 },
  { q: "Rumus volume tabung adalah ...", opts: ["πr²", "πr²t", "πrl", "(4/3)πr³"], correct: 1 },
  { q: "Rumus luas selimut tabung adalah ...", opts: ["πr²", "2πrt", "πrl", "4πr²"], correct: 1 },
  { q: "Tabung r=5, t=4, π=3,14. Volume = ...", opts: ["157", "314", "471", "628"], correct: 1 },
  { q: "Volume tabung r=10, t=10, π=3,14 = ...", opts: ["314", "1.570", "3.140", "31.400"], correct: 2 },
  { q: "Tinggi tabung biasa disimbolkan ...", opts: ["r", "t", "l", "s"], correct: 1 },
  { q: "Banyak sisi datar tabung adalah ...", opts: ["0", "1", "2", "3"], correct: 2 },
];

const KERUCUT: BaseQ[] = [
  { q: "Kerucut memiliki ... sisi", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Sisi alas kerucut berbentuk ...", opts: ["persegi", "lingkaran", "segitiga", "elips"], correct: 1 },
  { q: "Volume kerucut r=3, t=4, π=3,14 = ...", opts: ["12,56", "37,68", "75,36", "113,04"], correct: 1 },
  { q: "Rumus volume kerucut ...", opts: ["πr²t", "(1/3)πr²t", "πrl", "(4/3)πr³"], correct: 1 },
  { q: "Volume kerucut r=7, t=12 (π=22/7) = ...", opts: ["154", "308", "616", "1.232"], correct: 2 },
  { q: "Garis pelukis kerucut disimbolkan ...", opts: ["r", "t", "l", "s"], correct: 2 },
  { q: "Luas selimut kerucut r=3, l=5, π=3,14 = ...", opts: ["15,7", "31,4", "47,1", "62,8"], correct: 2 },
  { q: "Rumus luas selimut kerucut ...", opts: ["πr²", "2πrt", "πrl", "4πr²"], correct: 2 },
  { q: "Volume kerucut r=6, t=10, π=3,14 = ...", opts: ["188,4", "376,8", "565,2", "1.130,4"], correct: 1 },
  { q: "Banyak rusuk kerucut adalah ...", opts: ["0", "1", "2", "3"], correct: 1 },
  { q: "Banyak titik sudut kerucut adalah ...", opts: ["0", "1", "2", "3"], correct: 1 },
  { q: "Volume kerucut adalah ... dari volume tabung yang sama", opts: ["1/2", "1/3", "1/4", "1/6"], correct: 1 },
];

const BOLA: BaseQ[] = [
  { q: "Bola memiliki ... sisi", opts: ["0", "1", "2", "3"], correct: 1 },
  { q: "Rumus volume bola ...", opts: ["πr²", "πr²t", "(4/3)πr³", "4πr²"], correct: 2 },
  { q: "Rumus luas permukaan bola ...", opts: ["πr²", "2πr²", "4πr²", "πr²t"], correct: 2 },
  { q: "Volume bola r=3, π=3,14 = ...", opts: ["28,26", "37,68", "113,04", "150,72"], correct: 2 },
  { q: "Luas permukaan bola r=7 (π=22/7) = ...", opts: ["154", "308", "616", "1.232"], correct: 2 },
  { q: "Volume bola r=7 (π=22/7) = ...", opts: ["1.078", "1.437,33", "2.156", "4.312"], correct: 1 },
  { q: "Banyak rusuk bola adalah ...", opts: ["0", "1", "2", "3"], correct: 0 },
  { q: "Banyak titik sudut bola adalah ...", opts: ["0", "1", "2", "3"], correct: 0 },
  { q: "Bentuk bola seperti ...", opts: ["balon", "kotak", "kerucut", "tabung"], correct: 0 },
  { q: "Volume bola r=6, π=3,14 = ...", opts: ["452,16", "904,32", "1.808,64", "678,24"], correct: 2 },
  { q: "Luas permukaan bola r=14 (π=22/7) = ...", opts: ["616", "1.232", "1.848", "2.464"], correct: 3 },
  { q: "Volume bola r=1, π=3,14 ≈ ...", opts: ["1,33", "2,67", "4,19", "6,28"], correct: 2 },
];

const PERUBAHAN_LUAS_VOLUME: BaseQ[] = [
  { q: "Jika r tabung dikalikan 2, volume menjadi ... kali", opts: ["2", "4", "6", "8"], correct: 1 },
  { q: "Jika t tabung dikalikan 3, volume menjadi ... kali", opts: ["3", "6", "9", "12"], correct: 0 },
  { q: "Jika r bola dikalikan 2, volume menjadi ... kali", opts: ["2", "4", "6", "8"], correct: 3 },
  { q: "Jika r bola dikalikan 2, luas permukaan menjadi ... kali", opts: ["2", "4", "6", "8"], correct: 1 },
  { q: "Jika r kerucut dikalikan 2 dan t tetap, volume menjadi ... kali", opts: ["2", "4", "6", "8"], correct: 1 },
  { q: "Jika r tabung dikalikan 3, volume menjadi ... kali", opts: ["3", "6", "9", "27"], correct: 2 },
  { q: "Jika r dilipatgandakan 2, luas alas tabung menjadi ... kali", opts: ["2", "3", "4", "8"], correct: 2 },
  { q: "Jika r dan t tabung dikalikan 2, volume menjadi ... kali", opts: ["2", "4", "6", "8"], correct: 3 },
  { q: "Jika r bola dikalikan 3, volume menjadi ... kali", opts: ["3", "9", "18", "27"], correct: 3 },
  { q: "Jika r kerucut dikalikan 3 dan t tetap, volume menjadi ... kali", opts: ["3", "6", "9", "27"], correct: 2 },
  { q: "Jika r tabung dilipatkan ½, volume menjadi ... kali", opts: ["1/2", "1/4", "1/6", "1/8"], correct: 1 },
  { q: "Jika r bola dikalikan ½, volume menjadi ... kali", opts: ["1/2", "1/4", "1/6", "1/8"], correct: 3 },
];

const GABUNGAN: BaseQ[] = [
  { q: "Tabung di atas tabung lain disebut bangun ...", opts: ["tunggal", "gabungan", "campuran", "datar"], correct: 1 },
  { q: "Tabung r=3, t=4 + Kerucut r=3, t=3 (π=3,14). Volume tabung = ...", opts: ["56,52", "113,04", "169,56", "226,08"], correct: 1 },
  { q: "Volume kerucut r=3, t=3, π=3,14 = ...", opts: ["28,26", "37,68", "56,52", "84,78"], correct: 0 },
  { q: "Tabung r=7, t=10 + setengah bola r=7. Volume tabung (π=22/7) = ...", opts: ["770", "1.540", "2.310", "3.080"], correct: 1 },
  { q: "Volume setengah bola r=7 (π=22/7) = ...", opts: ["718,67", "1.078", "1.437,33", "2.156"], correct: 0 },
  { q: "Tabung tinggi 10, r=5 di atas tabung tinggi 5, r=5 (π=3,14). Volume total = ...", opts: ["589", "785", "1.177,5", "2.355"], correct: 2 },
  { q: "Bangun gabungan tabung+kerucut sering disebut bentuk ...", opts: ["es krim", "topi", "topi cone", "kotak"], correct: 2 },
  { q: "Untuk volume bangun gabungan kita ... volume tiap bagian", opts: ["jumlahkan", "kurangkan", "kalikan", "bagi"], correct: 0 },
  { q: "Volume tabung r=2, t=5, π=3,14 = ...", opts: ["31,4", "62,8", "94,2", "125,6"], correct: 1 },
  { q: "Volume bangun gabungan = volume tabung + volume ...", opts: ["balok", "kerucut/bola", "limas", "prisma"], correct: 1 },
  { q: "Setengah bola memiliki volume ... dari bola penuh", opts: ["1/4", "1/3", "1/2", "2/3"], correct: 2 },
  { q: "Volume kerucut r=2, t=3, π=3,14 = ...", opts: ["12,56", "18,84", "25,12", "37,68"], correct: 0 },
];

export const BANGUN_RUANG_SISI_LENGKUNG: SubmaterialEntryK9[] = [
  { slug: "tabung", label: "TABUNG", emoji: "🥫", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(TABUNG) },
  { slug: "kerucut", label: "KERUCUT", emoji: "🍦", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KERUCUT) },
  { slug: "bola", label: "BOLA", emoji: "⚽", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(BOLA) },
  { slug: "perubahan-luas-volume", label: "PERUBAHAN LUAS & VOLUME", emoji: "📈", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PERUBAHAN_LUAS_VOLUME) },
  { slug: "gabungan", label: "BANGUN GABUNGAN", emoji: "🧱", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(GABUNGAN) },
];
