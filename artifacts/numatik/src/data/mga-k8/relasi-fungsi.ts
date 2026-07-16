import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "relasi-dan-fungsi";
const PARENT_LABEL = "RELASI DAN FUNGSI";

const PENGERTIAN_RELASI: BaseQ[] = [
  { q: "Hubungan antara anggota himpunan A dengan anggota himpunan B disebut ...", opts: ["Fungsi", "Relasi", "Domain", "Range"], correct: 1 },
  { q: "Penyajian relasi yang menggunakan panah disebut ...", opts: ["diagram panah", "diagram batang", "tabel", "grafik"], correct: 0 },
  { q: "Penyajian relasi (a,b) disebut ...", opts: ["diagram panah", "himpunan pasangan berurutan", "diagram Kartesius", "grafik"], correct: 1 },
  { q: "Pada relasi A→B, A disebut ...", opts: ["Range", "Domain", "Kodomain", "Fungsi"], correct: 1 },
  { q: "Pada relasi A→B, B disebut ...", opts: ["Domain", "Range", "Kodomain", "Fungsi"], correct: 2 },
  { q: "Banyaknya cara menyajikan relasi adalah ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Diagram yang menggambarkan relasi pada bidang Kartesius disebut ...", opts: ["panah", "Cartesius", "batang", "lingkaran"], correct: 1 },
  { q: "Relasi 'lebih besar dari' menghubungkan ... dengan ...", opts: ["bilangan & bilangan", "huruf & angka", "garis & titik", "warna & bentuk"], correct: 0 },
  { q: "Pada A={1,2} dan B={a,b}, banyak relasi mungkin ada ... pasangan", opts: ["2", "4", "6", "8"], correct: 1 },
  { q: "Anggota himpunan asal disebut ...", opts: ["Range", "Domain", "Kodomain", "Hasil"], correct: 1 },
  { q: "Anggota himpunan kawan disebut ...", opts: ["Range", "Domain", "Kodomain", "Asal"], correct: 2 },
  { q: "Hasil dari relasi disebut ...", opts: ["Domain", "Range/Hasil", "Kodomain", "Asal"], correct: 1 },
];

const PENGERTIAN_FUNGSI: BaseQ[] = [
  { q: "Fungsi adalah relasi yang setiap anggota domain dipasangkan dengan ... anggota kodomain.", opts: ["banyak", "tepat satu", "dua", "tidak ada"], correct: 1 },
  { q: "Setiap fungsi adalah relasi. (B/S)", opts: ["Benar", "Salah", "Mungkin", "Tidak"], correct: 0 },
  { q: "Setiap relasi adalah fungsi. (B/S)", opts: ["Benar", "Salah", "Mungkin", "Tidak"], correct: 1 },
  { q: "Notasi fungsi: f: A → B berarti ...", opts: ["f memetakan A ke B", "B ke A", "A=B", "A≠B"], correct: 0 },
  { q: "Domain dari f(x) = 2x adalah ...", opts: ["semua bilangan real", "{0}", "{1,2,3}", "kosong"], correct: 0 },
  { q: "Pada f: A→B, A disebut ...", opts: ["Range", "Kodomain", "Domain", "Fungsi"], correct: 2 },
  { q: "Pada f: A→B, B disebut ...", opts: ["Range", "Kodomain", "Domain", "Fungsi"], correct: 1 },
  { q: "Range f adalah himpunan ...", opts: ["semua x", "semua y", "semua hasil pemetaan", "domain"], correct: 2 },
  { q: "Apakah relasi {(1,2),(1,3)} merupakan fungsi?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 1 },
  { q: "Apakah relasi {(1,2),(2,2),(3,2)} merupakan fungsi?", opts: ["Ya", "Tidak", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Fungsi yang setiap anggota berpasangan tepat satu disebut ...", opts: ["fungsi biasa", "korespondensi satu-satu", "relasi", "bukan fungsi"], correct: 1 },
  { q: "Sinonim dari fungsi adalah ...", opts: ["pemetaan", "perbandingan", "rasio", "skala"], correct: 0 },
];

const BANYAK_FUNGSI: BaseQ[] = [
  { q: "Banyak fungsi dari A={a,b} ke B={1,2}: 2² = ...", opts: ["2", "4", "6", "8"], correct: 1 },
  { q: "Banyak fungsi dari A={a} ke B={1,2,3}: 3¹ = ...", opts: ["1", "2", "3", "6"], correct: 2 },
  { q: "Banyak fungsi dari A={a,b,c} ke B={1,2}: 2³ = ...", opts: ["6", "8", "9", "12"], correct: 1 },
  { q: "Korespondensi satu-satu mungkin jika n(A) ... n(B)", opts: ["<", ">", "=", "≠"], correct: 2 },
  { q: "Banyak korespondensi satu-satu dari A={a,b} ke B={1,2}: 2! = ...", opts: ["1", "2", "4", "6"], correct: 1 },
  { q: "Banyak korespondensi satu-satu dari A={a,b,c} ke B={1,2,3}: 3! = ...", opts: ["3", "4", "6", "9"], correct: 2 },
  { q: "Rumus banyak fungsi dari A ke B = ...", opts: ["n(B)^n(A)", "n(A)^n(B)", "n(A)·n(B)", "n(A)+n(B)"], correct: 0 },
  { q: "Rumus banyak korespondensi satu-satu dari A ke B (n(A)=n(B)=n) = ...", opts: ["n²", "n!", "2n", "n+n"], correct: 1 },
  { q: "Banyak fungsi dari A={a,b} ke B={1,2,3}: 3² = ...", opts: ["6", "8", "9", "12"], correct: 2 },
  { q: "Banyak fungsi dari A={a,b,c,d} ke B={1,2}: 2⁴ = ...", opts: ["8", "12", "16", "24"], correct: 2 },
  { q: "4! = ...", opts: ["12", "20", "24", "30"], correct: 2 },
  { q: "5! = ...", opts: ["100", "110", "120", "150"], correct: 2 },
];

const NOTASI_RUMUS: BaseQ[] = [
  { q: "Jika f(x) = 2x + 3, maka f(2) = ...", opts: ["5", "6", "7", "8"], correct: 2 },
  { q: "Jika f(x) = 3x − 1, maka f(4) = ...", opts: ["10", "11", "12", "13"], correct: 1 },
  { q: "Jika f(x) = x + 5, maka f(10) = ...", opts: ["10", "12", "15", "18"], correct: 2 },
  { q: "Jika f(x) = x², maka f(3) = ...", opts: ["6", "8", "9", "12"], correct: 2 },
  { q: "Jika f(x) = 2x, maka f(0) = ...", opts: ["0", "1", "2", "4"], correct: 0 },
  { q: "Jika f(x) = x − 2, maka f(7) = ...", opts: ["3", "4", "5", "9"], correct: 2 },
  { q: "Jika f(x) = 4x, maka f(5) = ...", opts: ["10", "15", "20", "25"], correct: 2 },
  { q: "f(x) = x + 3. Berapa f(−1)?", opts: ["−2", "1", "2", "4"], correct: 2 },
  { q: "f(x) = 2x − 5. Berapa f(3)?", opts: ["1", "2", "3", "5"], correct: 0 },
  { q: "Jika f(x) = 3x + 2, dan f(a) = 8, maka a = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Jika f(x) = 5 − x, maka f(2) = ...", opts: ["1", "2", "3", "5"], correct: 2 },
  { q: "f(x) = 6x. Berapa f(1)?", opts: ["1", "5", "6", "7"], correct: 2 },
];

const GRAFIK_FUNGSI: BaseQ[] = [
  { q: "Grafik fungsi linear berbentuk ...", opts: ["lingkaran", "garis lurus", "parabola", "elips"], correct: 1 },
  { q: "Untuk menggambar grafik fungsi linear minimal diperlukan ... titik", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Grafik f(x) = x melewati titik ...", opts: ["(0,1)", "(1,1)", "(1,2)", "(2,1)"], correct: 1 },
  { q: "Grafik f(x) = 2x melewati titik (1, ...)", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Grafik f(x) = x + 1 melewati titik (0, ...)", opts: ["0", "1", "2", "3"], correct: 1 },
  { q: "Grafik f(x) = 3 berbentuk garis ...", opts: ["miring", "horizontal", "vertikal", "lingkaran"], correct: 1 },
  { q: "Untuk f(x)=x², titik puncak parabola di ...", opts: ["(0,0)", "(1,0)", "(0,1)", "(1,1)"], correct: 0 },
  { q: "Grafik f(x) = x − 2 memotong sumbu Y di ...", opts: ["(0,−2)", "(0,2)", "(2,0)", "(−2,0)"], correct: 0 },
  { q: "Grafik f(x) = x + 3 memotong sumbu Y di ...", opts: ["(0,3)", "(3,0)", "(0,−3)", "(0,1)"], correct: 0 },
  { q: "Grafik f(x) = 2x + 1 memotong sumbu Y di ...", opts: ["(0,1)", "(1,0)", "(0,2)", "(2,0)"], correct: 0 },
  { q: "Pada f(x) = x, jika x = 5 maka y = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Pada f(x) = 2x − 1, jika x = 3 maka y = ...", opts: ["3", "4", "5", "6"], correct: 2 },
];

export const RELASI_FUNGSI: SubmaterialEntryK8[] = [
  { slug: "pengertian-relasi", label: "PENGERTIAN RELASI & PENYAJIAN", emoji: "🔗", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENGERTIAN_RELASI) },
  { slug: "pengertian-fungsi", label: "PENGERTIAN FUNGSI & PENYAJIAN", emoji: "🧠", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENGERTIAN_FUNGSI) },
  { slug: "banyak-fungsi", label: "BANYAK FUNGSI & KORESPONDENSI 1-1", emoji: "🔁", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(BANYAK_FUNGSI) },
  { slug: "notasi-rumus", label: "NOTASI & RUMUS FUNGSI", emoji: "✍️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(NOTASI_RUMUS) },
  { slug: "grafik-fungsi", label: "GRAFIK FUNGSI", emoji: "📈", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(GRAFIK_FUNGSI) },
];
