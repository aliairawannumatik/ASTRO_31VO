import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "fungsi-kuadrat";
const PARENT_LABEL = "FUNGSI KUADRAT";

const BENTUK_UMUM_KARAKTERISTIK: BaseQ[] = [
  { q: "Bentuk umum fungsi kuadrat ...", opts: ["f(x)=ax+b", "f(x)=ax²+bx+c", "f(x)=ax³+b", "f(x)=a/x"], correct: 1 },
  { q: "Grafik fungsi kuadrat berbentuk ...", opts: ["garis lurus", "lingkaran", "parabola", "elips"], correct: 2 },
  { q: "f(x)=x²−4x+3. Nilai a = ...", opts: ["1", "−4", "3", "0"], correct: 0 },
  { q: "f(x)=x²−4x+3. Nilai b = ...", opts: ["1", "−4", "4", "3"], correct: 1 },
  { q: "f(x)=x²−4x+3. Nilai c = ...", opts: ["1", "3", "−3", "−4"], correct: 1 },
  { q: "Jika a > 0, parabola terbuka ke ...", opts: ["atas", "bawah", "kiri", "kanan"], correct: 0 },
  { q: "Jika a < 0, parabola terbuka ke ...", opts: ["atas", "bawah", "kiri", "kanan"], correct: 1 },
  { q: "f(x)=2x²−3x+1. Nilai a = ...", opts: ["1", "2", "−3", "−1"], correct: 1 },
  { q: "Pangkat tertinggi pada fungsi kuadrat ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "f(x)=−x²+5. Parabola terbuka ke ...", opts: ["atas", "bawah", "kiri", "kanan"], correct: 1 },
  { q: "f(x)=x²+1. Nilai b = ...", opts: ["−1", "0", "1", "2"], correct: 1 },
  { q: "f(x)=3x²+2x. Nilai c = ...", opts: ["−2", "0", "2", "3"], correct: 1 },
];

const TITIK_POTONG: BaseQ[] = [
  { q: "Titik potong dengan sumbu-y dari f(x)=x²−5x+6 ...", opts: ["(0,0)", "(0,5)", "(0,6)", "(0,−6)"], correct: 2 },
  { q: "Titik potong sumbu-x dari f(x)=x²−5x+6 ...", opts: ["(2,0)(3,0)", "(−2,0)(−3,0)", "(1,0)(6,0)", "(0,2)(0,3)"], correct: 0 },
  { q: "Titik potong sumbu-y dari f(x)=x²+3 ...", opts: ["(0,0)", "(0,3)", "(0,−3)", "(3,0)"], correct: 1 },
  { q: "Titik potong sumbu-x dari f(x)=x²−9 ...", opts: ["(±1,0)", "(±3,0)", "(±9,0)", "(0,±3)"], correct: 1 },
  { q: "Titik potong sumbu-y dari f(x)=2x²+5 ...", opts: ["(0,2)", "(0,5)", "(0,−5)", "(2,0)"], correct: 1 },
  { q: "Untuk mencari titik potong sumbu-x, set f(x) = ...", opts: ["1", "0", "−1", "x"], correct: 1 },
  { q: "Untuk mencari titik potong sumbu-y, set x = ...", opts: ["0", "1", "−1", "f(x)"], correct: 0 },
  { q: "Titik potong sumbu-y f(x)=x²−4x ...", opts: ["(0,0)", "(0,4)", "(0,−4)", "(4,0)"], correct: 0 },
  { q: "Titik potong sumbu-x f(x)=x²−4x ...", opts: ["(0,0)(4,0)", "(2,0)(3,0)", "(−2,0)(2,0)", "(0,4)(0,0)"], correct: 0 },
  { q: "Titik potong sumbu-x f(x)=x²−1 ...", opts: ["(±1,0)", "(±2,0)", "(0,±1)", "(0,0)"], correct: 0 },
  { q: "f(x)=x²+2x. Titik potong sumbu-y ...", opts: ["(0,0)", "(0,2)", "(0,−2)", "(2,0)"], correct: 0 },
  { q: "f(x)=x²−6x+8. Titik potong sumbu-x ...", opts: ["(2,0)(4,0)", "(1,0)(8,0)", "(−2,0)(−4,0)", "(0,2)(0,4)"], correct: 0 },
];

const SUMBU_SIMETRI: BaseQ[] = [
  { q: "Rumus sumbu simetri parabola ...", opts: ["x = a/b", "x = −b/(2a)", "x = b/(2a)", "x = c/a"], correct: 1 },
  { q: "f(x)=x²−4x+3. Sumbu simetri x = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "f(x)=x²−4x+3. Titik puncak ...", opts: ["(2,−1)", "(2,1)", "(−2,−1)", "(2,3)"], correct: 0 },
  { q: "f(x)=x²−6x+5. Sumbu simetri x = ...", opts: ["2", "3", "5", "6"], correct: 1 },
  { q: "f(x)=x²−6x+5. Titik puncak ...", opts: ["(3,−4)", "(3,4)", "(−3,4)", "(3,5)"], correct: 0 },
  { q: "f(x)=x². Sumbu simetri x = ...", opts: ["−1", "0", "1", "2"], correct: 1 },
  { q: "f(x)=x². Titik puncak ...", opts: ["(0,0)", "(1,0)", "(0,1)", "(1,1)"], correct: 0 },
  { q: "f(x)=−x²+4. Titik puncak ...", opts: ["(0,4)", "(0,−4)", "(4,0)", "(−4,0)"], correct: 0 },
  { q: "f(x)=x²+2x+1. Sumbu simetri x = ...", opts: ["−1", "0", "1", "2"], correct: 0 },
  { q: "f(x)=x²+2x+1. Titik puncak ...", opts: ["(−1,0)", "(1,0)", "(0,1)", "(−1,1)"], correct: 0 },
  { q: "f(x)=2x²−8x+1. Sumbu simetri x = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Jika a>0, titik puncak adalah titik ...", opts: ["minimum", "maksimum", "tengah", "asal"], correct: 0 },
];

const MENGGAMBAR_GRAFIK: BaseQ[] = [
  { q: "Untuk menggambar grafik fungsi kuadrat dimulai dengan mencari ...", opts: ["sumbu simetri", "luas", "keliling", "kuadran"], correct: 0 },
  { q: "Bentuk grafik fungsi kuadrat adalah ...", opts: ["garis", "parabola", "lingkaran", "elips"], correct: 1 },
  { q: "f(x)=x². Grafik membuka ke ...", opts: ["atas", "bawah", "kiri", "kanan"], correct: 0 },
  { q: "f(x)=−x². Grafik membuka ke ...", opts: ["atas", "bawah", "kiri", "kanan"], correct: 1 },
  { q: "Pada grafik f(x)=x²−4, titik puncak ...", opts: ["(0,−4)", "(0,4)", "(4,0)", "(−4,0)"], correct: 0 },
  { q: "Pada grafik f(x)=x²+1, titik puncak ...", opts: ["(0,−1)", "(0,0)", "(0,1)", "(1,0)"], correct: 2 },
  { q: "f(0) dari f(x)=x²−2x+1 ...", opts: ["−1", "0", "1", "2"], correct: 2 },
  { q: "f(1) dari f(x)=x²−2x+1 ...", opts: ["−1", "0", "1", "2"], correct: 1 },
  { q: "f(2) dari f(x)=x²−2x+1 ...", opts: ["−1", "0", "1", "2"], correct: 2 },
  { q: "Grafik fungsi kuadrat melewati titik puncak dan ...", opts: ["1 titik", "2 titik", "3 titik", "tak hingga"], correct: 3 },
  { q: "f(x)=x²+2x. f(−1) = ...", opts: ["−2", "−1", "0", "1"], correct: 1 },
  { q: "f(x)=x²−1. f(0) = ...", opts: ["−1", "0", "1", "2"], correct: 0 },
];

const MENYUSUN_FUNGSI: BaseQ[] = [
  { q: "Fungsi kuadrat berakar 1 dan 3 (a=1) ...", opts: ["x²−4x+3", "x²+4x+3", "x²−4x−3", "x²+4x−3"], correct: 0 },
  { q: "Fungsi kuadrat berakar 2 dan 4 (a=1) ...", opts: ["x²−6x+8", "x²+6x+8", "x²−6x−8", "x²+6x−8"], correct: 0 },
  { q: "Berakar 0 dan 5 (a=1) ...", opts: ["x²−5x", "x²+5x", "x²−5", "x²+5"], correct: 0 },
  { q: "Berakar −1 dan 1 (a=1) ...", opts: ["x²−1", "x²+1", "x²−2", "x²+2"], correct: 0 },
  { q: "Berakar −2 dan 3 (a=1) ...", opts: ["x²−x−6", "x²+x−6", "x²−x+6", "x²+x+6"], correct: 0 },
  { q: "Bentuk f(x)=a(x−p)(x−q) dengan p,q akar. Jika p=2, q=5, a=1 ...", opts: ["(x−2)(x−5)", "(x+2)(x+5)", "(x−2)(x+5)", "(x+2)(x−5)"], correct: 0 },
  { q: "f(x) berakar 1 dan 1 (a=1) ...", opts: ["(x−1)²", "(x+1)²", "(x−1)(x+1)", "x²−1"], correct: 0 },
  { q: "Berakar −3 dan 0 (a=1) ...", opts: ["x²+3x", "x²−3x", "x²+3", "x²−3"], correct: 0 },
  { q: "Berakar 2 dan −5 (a=1) ...", opts: ["x²+3x−10", "x²−3x−10", "x²+3x+10", "x²−3x+10"], correct: 0 },
  { q: "Berakar −1 dan −4 (a=1) ...", opts: ["x²+5x+4", "x²−5x+4", "x²+5x−4", "x²−5x−4"], correct: 0 },
  { q: "Berakar 3 dan 4 (a=1) ...", opts: ["x²−7x+12", "x²+7x+12", "x²−7x−12", "x²+7x−12"], correct: 0 },
  { q: "Berakar ±2 (a=1) ...", opts: ["x²−4", "x²+4", "x²−2", "x²+2"], correct: 0 },
];

const PENERAPAN: BaseQ[] = [
  { q: "Tinggi maksimum bola dengan h(t)=−t²+4t+1 dicapai pada t = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "h(t)=−t²+6t. Tinggi maks dicapai pada t = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "f(x)=−x²+8x. Nilai maksimum = ...", opts: ["8", "16", "24", "32"], correct: 1 },
  { q: "f(x)=x²−4x+1. Nilai minimum = ...", opts: ["−4", "−3", "1", "4"], correct: 1 },
  { q: "f(x)=−x²+4. Nilai maks = ...", opts: ["−4", "0", "2", "4"], correct: 3 },
  { q: "f(x)=x²+1. Nilai minimum = ...", opts: ["−1", "0", "1", "2"], correct: 2 },
  { q: "f(x)=−x²+10x. Nilai maks dicapai pada x = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "f(x)=−x²+10x. Nilai maks = ...", opts: ["20", "25", "30", "50"], correct: 1 },
  { q: "Tinggi maks bola h(t)=−t²+2t+3, t maks = ...", opts: ["0", "1", "2", "3"], correct: 1 },
  { q: "h(t)=−t²+2t+3. Tinggi maks = ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Persegi panjang K=20 cm. Luas maks = ...", opts: ["20", "25", "50", "100"], correct: 1 },
  { q: "f(x)=x². Nilai minimum = ...", opts: ["−1", "0", "1", "2"], correct: 1 },
];

export const FUNGSI_KUADRAT: SubmaterialEntryK9[] = [
  { slug: "bentuk-umum-karakteristik", label: "BENTUK UMUM & KARAKTERISTIK", emoji: "📐", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(BENTUK_UMUM_KARAKTERISTIK) },
  { slug: "titik-potong", label: "TITIK POTONG SUMBU", emoji: "✂️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(TITIK_POTONG) },
  { slug: "sumbu-simetri", label: "SUMBU SIMETRI & TITIK PUNCAK", emoji: "📍", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(SUMBU_SIMETRI) },
  { slug: "menggambar-grafik", label: "MENGGAMBAR GRAFIK", emoji: "📈", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MENGGAMBAR_GRAFIK) },
  { slug: "menyusun-fungsi", label: "MENYUSUN FUNGSI KUADRAT", emoji: "🛠️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MENYUSUN_FUNGSI) },
  { slug: "penerapan", label: "PENERAPAN NILAI MAKS/MIN", emoji: "🌍", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENERAPAN) },
];
