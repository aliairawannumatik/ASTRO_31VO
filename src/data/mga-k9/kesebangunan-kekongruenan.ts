import type { SubmaterialEntryK9, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "kesebangunan-kekongruenan";
const PARENT_LABEL = "KESEBANGUNAN & KEKONGRUENAN";

const DEFINISI: BaseQ[] = [
  { q: "Dua bangun sebangun jika sisi-sisinya ...", opts: ["sama panjang", "sebanding", "sejajar", "berbeda"], correct: 1 },
  { q: "Dua bangun kongruen jika ...", opts: ["bentuk berbeda", "sama bentuk dan ukuran", "ukuran berbeda", "sudut berbeda"], correct: 1 },
  { q: "Simbol kesebangunan adalah ...", opts: ["≅", "∼", "=", "⊥"], correct: 1 },
  { q: "Simbol kekongruenan adalah ...", opts: ["≅", "∼", "≠", "∥"], correct: 0 },
  { q: "Dua bangun sebangun memiliki sudut yang ...", opts: ["berbeda", "sama besar", "siku-siku", "tumpul"], correct: 1 },
  { q: "Bangun yang sama persis disebut ...", opts: ["sebangun", "kongruen", "sejajar", "tegak lurus"], correct: 1 },
  { q: "Foto yang diperbesar dengan bentuk sama termasuk contoh ...", opts: ["kongruen", "sebangun", "sama sisi", "sejajar"], correct: 1 },
  { q: "Dua persegi pasti ...", opts: ["kongruen", "sebangun", "berbeda", "sama luas"], correct: 1 },
  { q: "Syarat kesebangunan: sudut sama dan sisi ...", opts: ["sama panjang", "sebanding", "sejajar", "tegak lurus"], correct: 1 },
  { q: "Dua segitiga kongruen pasti juga ...", opts: ["sebangun", "tidak sebangun", "berbeda", "sembarang"], correct: 0 },
  { q: "Dua lingkaran selalu ...", opts: ["kongruen", "sebangun", "berbeda", "tidak ada hubungan"], correct: 1 },
  { q: "Bangun yang sebangun belum tentu ...", opts: ["punya sudut sama", "kongruen", "punya sisi sebanding", "punya bentuk sama"], correct: 1 },
];

const MENGHITUNG_RUSUK: BaseQ[] = [
  { q: "Persegi sebangun: sisi 4 dan 8. Skala perbandingan = ...", opts: ["1:2", "2:1", "1:4", "4:1"], correct: 0 },
  { q: "Dua persegi panjang sebangun. Lebar 3 dan 9. Faktor skala = ...", opts: ["2", "3", "4", "6"], correct: 1 },
  { q: "Persegi sebangun: sisi 5 cm. Yang lebih besar 3× lipat. Sisi besar = ...", opts: ["8 cm", "10 cm", "15 cm", "20 cm"], correct: 2 },
  { q: "Dua segitiga sebangun. Sisi 6 dan 18. Skalanya ...", opts: ["1:2", "1:3", "2:3", "3:1"], correct: 1 },
  { q: "Segitiga sebangun. Sisi a=4, sisi sebanding 12. Faktor = ...", opts: ["2", "3", "4", "6"], correct: 1 },
  { q: "Persegi panjang sebangun. P=10 dan P'=20. L=4 maka L' = ...", opts: ["6", "8", "10", "12"], correct: 1 },
  { q: "Skala 1:5. Panjang asli 25 cm, panjang gambar = ...", opts: ["3 cm", "5 cm", "20 cm", "30 cm"], correct: 1 },
  { q: "Skala 1:100. Tinggi gedung pada gambar 5 cm, tinggi sebenarnya = ...", opts: ["5 m", "50 m", "500 m", "5 cm"], correct: 0 },
  { q: "Dua segitiga sebangun. Skala 1:4. Sisi kecil 3 cm, sisi besar = ...", opts: ["7 cm", "10 cm", "12 cm", "16 cm"], correct: 2 },
  { q: "Persegi sebangun. Sisi 6 dan 18. Perbandingan = ...", opts: ["1:2", "1:3", "2:3", "3:1"], correct: 1 },
  { q: "Foto skala 1:10. Lebar foto 8 cm, lebar asli = ...", opts: ["8 cm", "18 cm", "80 cm", "800 cm"], correct: 2 },
  { q: "Dua segitiga sebangun. Sisi 5 dan 15. Skalanya ...", opts: ["1:3", "1:5", "3:1", "3:5"], correct: 0 },
];

const SEGITIGA_SEBANGUN: BaseQ[] = [
  { q: "Dua segitiga sebangun jika sudut-sudutnya ...", opts: ["berbeda", "sama besar", "siku-siku", "tumpul"], correct: 1 },
  { q: "Syarat sebangun: sisi-sisi yang bersesuaian harus ...", opts: ["sama", "sebanding", "tegak lurus", "sejajar"], correct: 1 },
  { q: "Segitiga ABC ∼ DEF. Jika AB=4, DE=8, faktor skala = ...", opts: ["1/2", "2", "4", "8"], correct: 1 },
  { q: "Segitiga ABC ∼ DEF. AB/DE = 1/2. Maka BC/EF = ...", opts: ["1", "1/2", "2", "1/4"], correct: 1 },
  { q: "Pada segitiga sebangun, sudut yang bersesuaian ...", opts: ["selalu sama", "selalu berbeda", "tegak lurus", "sembarang"], correct: 0 },
  { q: "Segitiga ABC ∼ PQR. AB=3, PQ=9. Skala = ...", opts: ["1:2", "1:3", "1:6", "1:9"], correct: 1 },
  { q: "Segitiga ABC sama sisi sisi 4 sebangun dengan segitiga sama sisi sisi 12. Skala = ...", opts: ["1:2", "1:3", "1:4", "2:3"], correct: 1 },
  { q: "Segitiga sebangun ABC ∼ DEF. AB=2, DE=6, BC=4, maka EF = ...", opts: ["6", "8", "10", "12"], correct: 3 },
  { q: "Segitiga ABC ∼ DEF, sudut A=60°, maka sudut D = ...", opts: ["30°", "60°", "90°", "120°"], correct: 1 },
  { q: "Segitiga ABC ∼ DEF, AB=5, DE=10, AC=4, maka DF = ...", opts: ["6", "8", "10", "12"], correct: 1 },
  { q: "Pada segitiga sebangun, perbandingan sisi adalah ...", opts: ["sama", "tetap", "berubah", "nol"], correct: 1 },
  { q: "Segitiga ABC ∼ XYZ, AB=6, XY=2. Skala = ...", opts: ["1:3", "3:1", "1:6", "6:1"], correct: 1 },
];

const RASIO_RUSUK: BaseQ[] = [
  { q: "Rasio sisi 2:3. Sisi A=4, maka sisi B = ...", opts: ["5", "6", "7", "8"], correct: 1 },
  { q: "Rasio 1:5. Jika A=2, maka B = ...", opts: ["5", "7", "10", "15"], correct: 2 },
  { q: "Persegi panjang sebangun. P=8, P'=24. Rasio = ...", opts: ["1:2", "1:3", "2:3", "3:1"], correct: 1 },
  { q: "Segitiga sebangun. Rasio sisi 3:4. Sisi 6 maka pasangannya = ...", opts: ["6", "8", "10", "12"], correct: 1 },
  { q: "Persegi sebangun. Sisi 5 dan 15. Rasio = ...", opts: ["1:2", "1:3", "1:5", "3:1"], correct: 1 },
  { q: "Rasio 4:9. Bangun A=8, maka bangun B = ...", opts: ["12", "16", "18", "20"], correct: 2 },
  { q: "Rasio 2:5. Sisi besar = 20, sisi kecil = ...", opts: ["4", "5", "8", "10"], correct: 2 },
  { q: "Skala peta 1:1.000. Panjang di peta 5 cm, asli = ...", opts: ["50 m", "500 m", "5 km", "50 km"], correct: 0 },
  { q: "Rasio dua segitiga sebangun 3:5. Sisi kecil 6, sisi besar = ...", opts: ["8", "10", "12", "15"], correct: 1 },
  { q: "Rasio bangun A:B = 1:4. Jika A=3, B = ...", opts: ["7", "9", "12", "16"], correct: 2 },
  { q: "Rasio sisi sebanding 2:7. Sisi A=4, sisi B = ...", opts: ["7", "9", "12", "14"], correct: 3 },
  { q: "Rasio 3:8. Bangun B = 24, maka bangun A = ...", opts: ["6", "8", "9", "12"], correct: 2 },
];

const KEKONGRUENAN_BANGUN_DATAR: BaseQ[] = [
  { q: "Dua bangun datar kongruen jika ...", opts: ["bentuk berbeda", "ukuran berbeda", "bentuk dan ukuran sama", "warna sama"], correct: 2 },
  { q: "Persegi sisi 6 cm kongruen dengan persegi sisi ...", opts: ["3 cm", "6 cm", "9 cm", "12 cm"], correct: 1 },
  { q: "Pada bangun kongruen, sisi yang bersesuaian ...", opts: ["sama panjang", "berbeda", "sebanding", "tegak lurus"], correct: 0 },
  { q: "Pada bangun kongruen, sudut yang bersesuaian ...", opts: ["sama besar", "berbeda", "siku", "tumpul"], correct: 0 },
  { q: "Simbol kongruen adalah ...", opts: ["≅", "∼", "=", "≠"], correct: 0 },
  { q: "Dua segitiga kongruen jika ketiga sisinya ...", opts: ["sebanding", "sama panjang", "tegak lurus", "sejajar"], correct: 1 },
  { q: "Salah satu syarat kongruen segitiga adalah ...", opts: ["SSS", "AAA", "BBB", "CCC"], correct: 0 },
  { q: "Dua persegi panjang kongruen jika ...", opts: ["P sama", "L sama", "P dan L sama", "diagonal beda"], correct: 2 },
  { q: "Dua lingkaran kongruen jika jari-jarinya ...", opts: ["sama", "berbeda", "0", "tak terhingga"], correct: 0 },
  { q: "Bangun yang dipindah/dirotasi/dicerminkan tetap ...", opts: ["sebangun", "kongruen", "berbeda", "lebih kecil"], correct: 1 },
  { q: "Syarat kongruen segitiga selain SSS adalah ...", opts: ["SAS", "AAA", "SST", "TTT"], correct: 0 },
  { q: "Dua segitiga sama sisi kongruen jika sisinya ...", opts: ["berbeda", "sama panjang", "tegak lurus", "sejajar"], correct: 1 },
];

export const KESEBANGUNAN_KEKONGRUENAN: SubmaterialEntryK9[] = [
  { slug: "definisi", label: "DEFINISI KESEBANGUNAN & KEKONGRUENAN", emoji: "📐", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(DEFINISI) },
  { slug: "menghitung-rusuk", label: "MENGHITUNG PANJANG RUSUK", emoji: "📏", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(MENGHITUNG_RUSUK) },
  { slug: "segitiga-sebangun", label: "SEGITIGA SEBANGUN", emoji: "🔺", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(SEGITIGA_SEBANGUN) },
  { slug: "rasio-rusuk", label: "RASIO RUSUK BANGUN SEBANGUN", emoji: "⚖️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(RASIO_RUSUK) },
  { slug: "kekongruenan-bangun-datar", label: "KEKONGRUENAN BANGUN DATAR", emoji: "🟦", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(KEKONGRUENAN_BANGUN_DATAR) },
];
