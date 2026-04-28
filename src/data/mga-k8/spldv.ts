import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "spldv";
const PARENT_LABEL = "SPLDV";

const DEFINISI_SPLDV: BaseQ[] = [
  { q: "SPLDV singkatan dari ...", opts: ["Sistem Persamaan Linear Dua Variabel", "Sistem Pertidaksamaan Linear Dua Variabel", "Soal Persamaan Linear", "Sistem Persamaan Lurus"], correct: 0 },
  { q: "Bentuk umum PLDV adalah ...", opts: ["ax+b=0", "ax+by=c", "ax²+bx+c=0", "x+y"], correct: 1 },
  { q: "SPLDV terdiri dari ... persamaan linear dua variabel", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Berapa banyak variabel pada SPLDV?", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Manakah PLDV: 2x+3y=6?", opts: ["Ya", "Bukan", "Mungkin", "Tidak tahu"], correct: 0 },
  { q: "Manakah BUKAN PLDV: x²+y=5?", opts: ["PLDV", "Bukan PLDV", "PLSV", "Tidak tahu"], correct: 1 },
  { q: "Penyelesaian SPLDV berupa pasangan (x, y) yang ...", opts: ["memenuhi salah satu", "memenuhi keduanya", "kosong", "tidak ada"], correct: 1 },
  { q: "Pada PLDV ax+by=c, pangkat tertinggi variabel adalah ...", opts: ["0", "1", "2", "3"], correct: 1 },
  { q: "Berapa banyak penyelesaian SPLDV pada umumnya?", opts: ["0", "1", "2", "tak hingga"], correct: 1 },
  { q: "Apakah x=1, y=2 penyelesaian dari x+y=3?", opts: ["Ya", "Tidak", "Mungkin", "Salah"], correct: 0 },
  { q: "Apakah x=2, y=3 penyelesaian dari 2x+y=7?", opts: ["Ya", "Tidak", "Mungkin", "Salah"], correct: 0 },
  { q: "Bentuk x+y=5 termasuk ...", opts: ["PLSV", "PLDV", "PtLSV", "Persamaan kuadrat"], correct: 1 },
];

const METODE_GRAFIK: BaseQ[] = [
  { q: "Pada metode grafik, penyelesaian SPLDV adalah titik ...", opts: ["puncak", "potong dua garis", "asal", "tengah"], correct: 1 },
  { q: "Untuk menggambar grafik PLDV diperlukan minimal ... titik", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Garis x+y=4 memotong sumbu X di titik ...", opts: ["(0,4)", "(4,0)", "(2,0)", "(0,2)"], correct: 1 },
  { q: "Garis x+y=4 memotong sumbu Y di titik ...", opts: ["(0,4)", "(4,0)", "(2,0)", "(0,2)"], correct: 0 },
  { q: "Garis 2x+y=6 memotong sumbu X di ...", opts: ["(2,0)", "(3,0)", "(4,0)", "(6,0)"], correct: 1 },
  { q: "Garis 2x+y=6 memotong sumbu Y di ...", opts: ["(0,3)", "(0,4)", "(0,5)", "(0,6)"], correct: 3 },
  { q: "Jika dua garis berpotongan pada (1,2), maka penyelesaian SPLDV adalah ...", opts: ["x=1,y=2", "x=2,y=1", "x=0,y=0", "x=1,y=1"], correct: 0 },
  { q: "Jika dua garis sejajar, banyak penyelesaian SPLDV adalah ...", opts: ["1", "0", "tak hingga", "2"], correct: 1 },
  { q: "Jika dua garis berimpit, banyak penyelesaian SPLDV adalah ...", opts: ["0", "1", "2", "tak hingga"], correct: 3 },
  { q: "Garis x = 3 berbentuk ...", opts: ["horizontal", "vertikal", "miring", "lingkaran"], correct: 1 },
  { q: "Garis y = 5 berbentuk ...", opts: ["horizontal", "vertikal", "miring", "lingkaran"], correct: 0 },
  { q: "Penyelesaian dari x=2, y=3 adalah titik ...", opts: ["(0,0)", "(2,3)", "(3,2)", "(2,2)"], correct: 1 },
];

const METODE_SUBSTITUSI: BaseQ[] = [
  { q: "Substitusi artinya ...", opts: ["mengganti", "menambah", "mengurangi", "mengalikan"], correct: 0 },
  { q: "Pada SPLDV x+y=5 dan x=2, maka y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Pada x=3 dan x+y=7, y = ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Pada y=2 dan 2x+y=8, x = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Pada y=x dan x+y=6, x = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Pada y=2x dan x+y=6, x = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Pada x+y=10 dan x=4, maka y = ...", opts: ["4", "5", "6", "7"], correct: 2 },
  { q: "Jika x=5 dan x−y=2, maka y = ...", opts: ["1", "2", "3", "5"], correct: 2 },
  { q: "Jika y=4 dan x+y=10, maka x = ...", opts: ["4", "5", "6", "7"], correct: 2 },
  { q: "Pada x=y dan x+y=8, x = ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Substitusi y=x+1 ke x+y=7 menghasilkan x = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Pada y=3x dan x+y=8, x = ...", opts: ["1", "2", "3", "4"], correct: 1 },
];

const METODE_ELIMINASI: BaseQ[] = [
  { q: "Eliminasi artinya ...", opts: ["menggandakan", "menghilangkan variabel", "menambah", "mengurangi"], correct: 1 },
  { q: "x+y=5 dan x−y=1, jumlahkan: 2x = ...", opts: ["4", "5", "6", "10"], correct: 2 },
  { q: "Dari soal di atas, x = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "x+y=5 dan x−y=1, kurangkan: 2y = ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Dari soal di atas, y = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "x+y=8 dan x−y=2, jumlahkan: 2x = ...", opts: ["6", "8", "10", "12"], correct: 2 },
  { q: "Dari soal di atas, x = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "x+y=10 dan x−y=4, x = ...", opts: ["5", "6", "7", "8"], correct: 2 },
  { q: "x+y=10 dan x−y=4, y = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "2x+y=7 dan 2x−y=3, kurangkan: 2y = ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Dari soal di atas, y = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "x+2y=8 dan x+y=5, kurangkan: y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
];

const METODE_CAMPURAN: BaseQ[] = [
  { q: "Metode campuran adalah gabungan ...", opts: ["grafik & substitusi", "substitusi & eliminasi", "eliminasi & grafik", "semua metode"], correct: 1 },
  { q: "Eliminasi y dari x+y=5 dan x−y=1: x = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Substitusi x=3 ke x+y=5: y = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "x+y=7 dan x−y=3, x = ...", opts: ["4", "5", "6", "7"], correct: 1 },
  { q: "Dari soal di atas, y = ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "x+y=12 dan x−y=4, x = ...", opts: ["6", "7", "8", "10"], correct: 2 },
  { q: "Dari soal di atas, y = ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Pada SPLDV, untuk efisien gunakan eliminasi lalu ...", opts: ["grafik", "substitusi", "kalkulator", "tebakan"], correct: 1 },
  { q: "x+y=6 dan x−y=0, x = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Dari soal di atas, y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Eliminasi y dari 2x+y=8 dan x+y=5: x = ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Substitusi x=3 ke 2x+y=8: y = ...", opts: ["1", "2", "3", "4"], correct: 1 },
];

const MODEL_SPLDV: BaseQ[] = [
  { q: "Misal harga 1 buku = x dan 1 pensil = y. 2 buku + 3 pensil = Rp10.000 ditulis ...", opts: ["2x+3y=10000", "x+y=10000", "3x+2y=10000", "5xy=10000"], correct: 0 },
  { q: "Umur Andi (x) ditambah Budi (y) = 30. Tulis ...", opts: ["x−y=30", "x+y=30", "xy=30", "x/y=30"], correct: 1 },
  { q: "Selisih dua bilangan x dan y = 5. Tulis ...", opts: ["x+y=5", "x−y=5", "xy=5", "x²=5"], correct: 1 },
  { q: "Jumlah 2 angka adalah 7, ditulis ...", opts: ["x+y=7", "x−y=7", "xy=7", "x/y=7"], correct: 0 },
  { q: "Harga 3 mangga + 2 jeruk = Rp9.000, ditulis ...", opts: ["3x+2y=9000", "5xy=9000", "x+y=9000", "2x+3y=9000"], correct: 0 },
  { q: "Bilangan x sama dengan dua kali y, ditulis ...", opts: ["x=2y", "y=2x", "x=y/2", "x+y=2"], correct: 0 },
  { q: "Andi punya x apel dan y jeruk, total 10 buah. Tulis ...", opts: ["x−y=10", "x+y=10", "xy=10", "x/y=10"], correct: 1 },
  { q: "Jika 1 baju = x dan 1 celana = y. 2 baju + 1 celana = Rp80.000 ...", opts: ["2x+y=80000", "x+2y=80000", "2xy=80000", "x+y=80000"], correct: 0 },
  { q: "Jumlah uang Ali (x) dan Bagas (y) Rp50.000 ditulis ...", opts: ["x−y=50000", "x+y=50000", "xy=50000", "x²=50000"], correct: 1 },
  { q: "Kerbau 4 kaki, ayam 2 kaki. Total kaki = 4x+2y. Jika x kerbau dan y ayam, jumlah kepala = ...", opts: ["x−y", "x+y", "xy", "2x+y"], correct: 1 },
  { q: "Sebuah toko jual buku x dan pensil y. Total 5 barang ditulis ...", opts: ["x+y=5", "x−y=5", "xy=5", "5x+y=0"], correct: 0 },
  { q: "Bila a + b = 10 dan a = 2b, model SPLDV nya menggunakan ... persamaan", opts: ["1", "2", "3", "4"], correct: 1 },
];

const PENYELESAIAN_MASALAH: BaseQ[] = [
  { q: "x+y=10 dan x=y, maka x = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "x+y=12 dan x=2y, maka y = ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "x+y=8 dan x−y=2, maka x = ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Dari soal di atas, y = ...", opts: ["1", "2", "3", "4"], correct: 2 },
  { q: "Harga 1 apel x dan 1 jeruk y. 2x+y=12 dan x+y=8, maka x = ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Dari soal di atas, y = ...", opts: ["3", "4", "5", "6"], correct: 1 },
  { q: "Jumlah 2 bilangan = 20, selisih = 4. Bilangan terbesar = ...", opts: ["10", "11", "12", "13"], correct: 2 },
  { q: "Dari soal di atas, bilangan terkecil = ...", opts: ["6", "7", "8", "9"], correct: 2 },
  { q: "Jumlah umur 2 anak 25, selisih 5. Umur tertua = ...", opts: ["13", "15", "17", "20"], correct: 1 },
  { q: "Dari soal di atas, umur termuda = ...", opts: ["8", "9", "10", "11"], correct: 2 },
  { q: "Andi beli 2 buku dan 1 pensil Rp14.000. 1 buku Rp5.000. Harga 1 pensil = ...", opts: ["Rp2.000", "Rp3.000", "Rp4.000", "Rp5.000"], correct: 2 },
  { q: "x+y=6 dan x=y, maka x+y nya = 6, x = ...", opts: ["2", "3", "4", "5"], correct: 1 },
];

export const SPLDV: SubmaterialEntryK8[] = [
  { slug: "definisi-spldv", label: "DEFINISI & BENTUK UMUM SPLDV", emoji: "📝", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(DEFINISI_SPLDV) },
  { slug: "metode-grafik", label: "METODE GRAFIK", emoji: "📉", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(METODE_GRAFIK) },
  { slug: "metode-substitusi", label: "METODE SUBSTITUSI", emoji: "🔄", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(METODE_SUBSTITUSI) },
  { slug: "metode-eliminasi", label: "METODE ELIMINASI", emoji: "❌", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(METODE_ELIMINASI) },
  { slug: "metode-campuran", label: "METODE CAMPURAN", emoji: "🌀", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(METODE_CAMPURAN) },
  { slug: "model-spldv", label: "MEMBUAT MODEL SPLDV", emoji: "🧩", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MODEL_SPLDV) },
  { slug: "penyelesaian-masalah", label: "PENYELESAIAN MASALAH SPLDV", emoji: "💡", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENYELESAIAN_MASALAH) },
];
