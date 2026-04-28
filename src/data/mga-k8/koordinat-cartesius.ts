import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "koordinat-cartesius";
const PARENT_LABEL = "KOORDINAT CARTESIUS";

const UNSUR_UNSUR: BaseQ[] = [
  { q: "Sumbu mendatar pada koordinat Cartesius disebut sumbu ...", opts: ["X", "Y", "Z", "O"], correct: 0 },
  { q: "Sumbu tegak pada koordinat Cartesius disebut sumbu ...", opts: ["X", "Y", "Z", "O"], correct: 1 },
  { q: "Titik pusat koordinat memiliki koordinat ...", opts: ["(1,1)", "(0,0)", "(1,0)", "(0,1)"], correct: 1 },
  { q: "Titik (3, 4) memiliki absis ...", opts: ["3", "4", "7", "12"], correct: 0 },
  { q: "Titik (3, 4) memiliki ordinat ...", opts: ["3", "4", "7", "12"], correct: 1 },
  { q: "Titik (−2, 5) berada di kuadran ke-...", opts: ["I", "II", "III", "IV"], correct: 1 },
  { q: "Titik (4, −3) berada di kuadran ke-...", opts: ["I", "II", "III", "IV"], correct: 3 },
  { q: "Titik (5, 7) berada di kuadran ke-...", opts: ["I", "II", "III", "IV"], correct: 0 },
  { q: "Titik (−3, −4) berada di kuadran ke-...", opts: ["I", "II", "III", "IV"], correct: 2 },
  { q: "Banyak kuadran pada koordinat Cartesius adalah ...", opts: ["2", "3", "4", "6"], correct: 2 },
  { q: "Titik dengan ordinat 0 berada pada sumbu ...", opts: ["X", "Y", "diagonal", "asimtot"], correct: 0 },
  { q: "Titik dengan absis 0 berada pada sumbu ...", opts: ["X", "Y", "diagonal", "asimtot"], correct: 1 },
];

const JARAK_TITIK: BaseQ[] = [
  { q: "Jarak titik (3, 0) ke titik asal adalah ... satuan", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Jarak titik (0, 5) ke titik asal adalah ... satuan", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Jarak titik (4, 0) ke sumbu Y adalah ... satuan", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Jarak titik (0, 7) ke sumbu X adalah ... satuan", opts: ["5", "6", "7", "8"], correct: 2 },
  { q: "Jarak titik A(2, 3) ke titik B(2, 7) adalah ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Jarak titik P(1, 2) ke titik Q(5, 2) adalah ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Jarak titik (−3, 0) ke titik asal adalah ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Jarak titik (3, 4) ke titik asal adalah ...", opts: ["3", "4", "5", "7"], correct: 2 },
  { q: "Jarak titik A(0, 0) ke B(6, 8) adalah ...", opts: ["8", "10", "12", "14"], correct: 1 },
  { q: "Titik C(5, 5) berjarak ke sumbu X sebesar ...", opts: ["3", "4", "5", "10"], correct: 2 },
  { q: "Jarak titik (8, 0) ke (3, 0) adalah ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Jarak antara dua titik (1,1) dan (4,5) = ... (rumus phytagoras)", opts: ["3", "4", "5", "6"], correct: 2 },
];

const POSISI_RELATIF: BaseQ[] = [
  { q: "Titik (3, 0) berada di ...", opts: ["sumbu X positif", "sumbu Y positif", "kuadran II", "kuadran III"], correct: 0 },
  { q: "Titik (0, −4) berada di ...", opts: ["sumbu X positif", "sumbu Y positif", "sumbu X negatif", "sumbu Y negatif"], correct: 3 },
  { q: "Titik (2, 3) terletak di kanan/kiri sumbu Y? Jawab: ...", opts: ["kanan", "kiri", "atas", "bawah"], correct: 0 },
  { q: "Titik (−5, 2) terletak di kanan/kiri sumbu Y? Jawab: ...", opts: ["kanan", "kiri", "atas", "bawah"], correct: 1 },
  { q: "Titik (3, 5) terletak di atas/bawah sumbu X?", opts: ["atas", "bawah", "kiri", "kanan"], correct: 0 },
  { q: "Titik (3, −5) terletak di atas/bawah sumbu X?", opts: ["atas", "bawah", "kiri", "kanan"], correct: 1 },
  { q: "Titik (4, 4) berjarak sama dari sumbu X dan Y? (Y/T)", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Sebuah garis horizontal melewati titik (1, 3). Persamaan garisnya y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Sebuah garis vertikal melewati titik (4, 2). Persamaan garisnya x = ...", opts: ["1", "2", "3", "4"], correct: 3 },
  { q: "Titik (5, 0) berada pada garis ...", opts: ["x = 0", "y = 0", "x = 5", "y = 5"], correct: 1 },
  { q: "Posisi titik (−2, 3) terhadap titik (1, 3) adalah ...", opts: ["sebelah kanan", "sebelah kiri", "di atas", "di bawah"], correct: 1 },
  { q: "Titik (0, 0) disebut ...", opts: ["asimtot", "fokus", "titik asal", "titik puncak"], correct: 2 },
];

export const KOORDINAT_CARTESIUS: SubmaterialEntryK8[] = [
  { slug: "unsur-unsur", label: "UNSUR-UNSUR DIAGRAM CARTESIUS", emoji: "📍", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(UNSUR_UNSUR) },
  { slug: "jarak-titik", label: "JARAK ANTAR DUA TITIK & TITIK KE GARIS", emoji: "📏", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(JARAK_TITIK) },
  { slug: "posisi-relatif", label: "POSISI RELATIF TITIK TERHADAP GARIS", emoji: "🧭", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(POSISI_RELATIF) },
];
