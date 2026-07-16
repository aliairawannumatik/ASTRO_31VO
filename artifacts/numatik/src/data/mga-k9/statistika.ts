import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "statistika";
const PARENT_LABEL = "STATISTIKA";

const PENGANTAR: BaseQ[] = [
  { q: "Statistika adalah ilmu yang mempelajari ...", opts: ["bilangan", "data", "geometri", "aljabar"], correct: 1 },
  { q: "Pengumpulan, pengolahan, dan penyajian disebut ...", opts: ["aritmatika", "statistika", "geometri", "logika"], correct: 1 },
  { q: "Data yang berupa angka disebut data ...", opts: ["kualitatif", "kuantitatif", "tunggal", "campuran"], correct: 1 },
  { q: "Data yang berupa kata disebut data ...", opts: ["kualitatif", "kuantitatif", "tunggal", "kelompok"], correct: 0 },
  { q: "Populasi adalah ...", opts: ["sebagian data", "seluruh objek", "ukuran tengah", "tabel"], correct: 1 },
  { q: "Sampel adalah ...", opts: ["sebagian populasi", "seluruh data", "ukuran tengah", "diagram"], correct: 0 },
  { q: "Contoh data kuantitatif: ...", opts: ["warna", "tinggi badan", "hobi", "merek"], correct: 1 },
  { q: "Contoh data kualitatif: ...", opts: ["nilai", "berat", "warna favorit", "umur"], correct: 2 },
  { q: "Mean disebut juga ...", opts: ["modus", "median", "rata-rata", "kuartil"], correct: 2 },
  { q: "Modus adalah data yang ...", opts: ["di tengah", "paling sering", "rata-rata", "tertinggi"], correct: 1 },
  { q: "Median adalah nilai ...", opts: ["paling sering", "tengah", "rata-rata", "paling besar"], correct: 1 },
  { q: "Datum tunggal: 5,7,9,11. Banyak data = ...", opts: ["3", "4", "5", "6"], correct: 1 },
];

const PENYAJIAN_DATA: BaseQ[] = [
  { q: "Penyajian data dengan baris dan kolom disebut ...", opts: ["diagram", "tabel", "grafik", "kurva"], correct: 1 },
  { q: "Diagram berbentuk lingkaran disebut diagram ...", opts: ["batang", "garis", "lingkaran", "gambar"], correct: 2 },
  { q: "Diagram untuk menunjukkan perubahan dari waktu ke waktu adalah ...", opts: ["batang", "garis", "lingkaran", "gambar"], correct: 1 },
  { q: "Diagram batang menunjukkan ... dengan ...", opts: ["data dengan persentase", "frekuensi dengan batang", "data dengan gambar", "data dengan kurva"], correct: 1 },
  { q: "Total persentase pada diagram lingkaran = ...", opts: ["50%", "100%", "180%", "360%"], correct: 1 },
  { q: "Total derajat pada diagram lingkaran = ...", opts: ["90°", "180°", "270°", "360°"], correct: 3 },
  { q: "Pada diagram lingkaran, 25% sama dengan ...", opts: ["45°", "90°", "180°", "270°"], correct: 1 },
  { q: "Pada diagram lingkaran, 50% sama dengan ...", opts: ["90°", "180°", "270°", "360°"], correct: 1 },
  { q: "Diagram yang menggunakan gambar disebut diagram ...", opts: ["batang", "garis", "lingkaran", "gambar/piktogram"], correct: 3 },
  { q: "Sumbu horizontal pada diagram batang biasanya menunjukkan ...", opts: ["frekuensi", "kategori", "warna", "waktu"], correct: 1 },
  { q: "Sumbu vertikal diagram batang biasanya menunjukkan ...", opts: ["kategori", "frekuensi", "warna", "tema"], correct: 1 },
  { q: "Diagram garis cocok untuk data ...", opts: ["kategorikal", "berkelanjutan/waktu", "warna", "tetap"], correct: 1 },
];

const RATA_RATA: BaseQ[] = [
  { q: "Rata-rata 4, 6, 8 = ...", opts: ["5", "6", "7", "8"], correct: 1 },
  { q: "Rata-rata 2, 4, 6, 8 = ...", opts: ["4", "5", "6", "7"], correct: 1 },
  { q: "Rata-rata 5, 5, 5 = ...", opts: ["3", "5", "10", "15"], correct: 1 },
  { q: "Rata-rata 3, 5, 7, 9, 11 = ...", opts: ["6", "7", "8", "9"], correct: 1 },
  { q: "Rata-rata 10, 20, 30 = ...", opts: ["15", "20", "25", "30"], correct: 1 },
  { q: "Rumus rata-rata = jumlah data dibagi ...", opts: ["frekuensi", "banyak data", "modus", "median"], correct: 1 },
  { q: "Rata-rata 1, 2, 3, 4 = ...", opts: ["2", "2,5", "3", "3,5"], correct: 1 },
  { q: "Rata-rata 6, 6, 6, 6 = ...", opts: ["6", "12", "24", "0"], correct: 0 },
  { q: "Rata-rata 5 dan 15 = ...", opts: ["5", "10", "15", "20"], correct: 1 },
  { q: "Rata-rata 0, 0, 6 = ...", opts: ["0", "2", "3", "6"], correct: 1 },
  { q: "Rata-rata nilai 7, 8, 9 = ...", opts: ["7", "8", "9", "10"], correct: 1 },
  { q: "Rata-rata 12, 14, 16 = ...", opts: ["12", "13", "14", "15"], correct: 2 },
];

const MEDIAN_MODUS: BaseQ[] = [
  { q: "Median dari 3, 5, 7 = ...", opts: ["3", "5", "7", "15"], correct: 1 },
  { q: "Median dari 2, 4, 6, 8 = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Modus dari 2, 3, 3, 4, 5 = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Modus dari 1, 1, 2, 3 = ...", opts: ["1", "2", "3", "4"], correct: 0 },
  { q: "Median dari 4, 6, 8, 10, 12 = ...", opts: ["4", "6", "8", "10"], correct: 2 },
  { q: "Modus 5, 5, 7, 7, 7, 9 = ...", opts: ["5", "7", "9", "tidak ada"], correct: 1 },
  { q: "Median dari 1, 3, 5, 7, 9 = ...", opts: ["3", "5", "7", "25"], correct: 1 },
  { q: "Modus dari 4, 4, 5, 5, 6 = ...", opts: ["4", "5", "4 dan 5", "6"], correct: 2 },
  { q: "Median dari 10, 20, 30, 40 = ...", opts: ["20", "25", "30", "35"], correct: 1 },
  { q: "Modus dari 8, 8, 8, 9 = ...", opts: ["8", "9", "tidak ada", "8 dan 9"], correct: 0 },
  { q: "Untuk data ganjil, median = nilai ke- ...", opts: ["pertama", "tengah", "terakhir", "kedua"], correct: 1 },
  { q: "Untuk data genap, median = ...", opts: ["nilai tengah", "rata-rata 2 nilai tengah", "nilai pertama", "nilai terakhir"], correct: 1 },
];

const KUARTIL: BaseQ[] = [
  { q: "Kuartil membagi data menjadi ... bagian", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Q2 sama dengan ...", opts: ["modus", "median", "mean", "kuartil 1"], correct: 1 },
  { q: "Q1 disebut juga kuartil ...", opts: ["bawah", "tengah", "atas", "akhir"], correct: 0 },
  { q: "Q3 disebut juga kuartil ...", opts: ["bawah", "tengah", "atas", "awal"], correct: 2 },
  { q: "Banyak kuartil yang ada adalah ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Q2 dari 1, 2, 3, 4, 5 = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Q1 dari 1, 2, 3, 4, 5 = ...", opts: ["1", "1,5", "2", "2,5"], correct: 1 },
  { q: "Q3 dari 1, 2, 3, 4, 5 = ...", opts: ["3", "3,5", "4", "4,5"], correct: 3 },
  { q: "Q1 dari 2, 4, 6, 8, 10, 12, 14, 16 = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Q3 dari 2, 4, 6, 8, 10, 12, 14, 16 = ...", opts: ["10", "11", "12", "13"], correct: 3 },
  { q: "Median = ... persen data berada di bawahnya", opts: ["25%", "50%", "75%", "100%"], correct: 1 },
  { q: "Jangkauan antar kuartil = ...", opts: ["Q3 + Q1", "Q3 − Q1", "Q3 × Q1", "Q3 : Q1"], correct: 1 },
];

const PENYEBARAN_DATA: BaseQ[] = [
  { q: "Jangkauan = nilai ... − nilai ...", opts: ["max − min", "min − max", "rata + min", "rata − max"], correct: 0 },
  { q: "Jangkauan 2, 4, 6, 8, 10 = ...", opts: ["6", "7", "8", "10"], correct: 2 },
  { q: "Jangkauan 5, 8, 12, 15 = ...", opts: ["3", "7", "10", "15"], correct: 2 },
  { q: "Jangkauan antarkuartil = ...", opts: ["Q1 + Q3", "Q3 − Q1", "Q2 − Q1", "Q3 + Q2"], correct: 1 },
  { q: "Simpangan kuartil = ½ × ...", opts: ["jangkauan", "Q3 − Q1", "Q3 + Q1", "median"], correct: 1 },
  { q: "Jangkauan 10, 20, 30, 40, 50 = ...", opts: ["20", "30", "40", "50"], correct: 2 },
  { q: "Jangkauan 1, 2, 3 = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Semakin besar jangkauan berarti data ...", opts: ["seragam", "menyebar luas", "berkumpul", "kosong"], correct: 1 },
  { q: "Simpangan kuartil dari Q1=4 dan Q3=12 = ...", opts: ["2", "4", "6", "8"], correct: 1 },
  { q: "Jangkauan antarkuartil dari Q1=10, Q3=20 = ...", opts: ["5", "10", "15", "30"], correct: 1 },
  { q: "Jangkauan data 7, 9, 11, 15 = ...", opts: ["4", "6", "8", "10"], correct: 2 },
  { q: "Simpangan kuartil dari Q1=2, Q3=10 = ...", opts: ["2", "3", "4", "6"], correct: 2 },
];

export const STATISTIKA: SubmaterialEntryK9[] = [
  { slug: "pengantar", label: "PENGANTAR STATISTIKA", emoji: "📊", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENGANTAR) },
  { slug: "penyajian-data", label: "PENYAJIAN DATA", emoji: "📈", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENYAJIAN_DATA) },
  { slug: "rata-rata", label: "RATA-RATA (MEAN)", emoji: "➗", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(RATA_RATA) },
  { slug: "median-modus", label: "MEDIAN & MODUS", emoji: "📏", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MEDIAN_MODUS) },
  { slug: "kuartil", label: "KUARTIL", emoji: "🟦", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KUARTIL) },
  { slug: "penyebaran-data", label: "PENYEBARAN DATA", emoji: "📉", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENYEBARAN_DATA) },
];
