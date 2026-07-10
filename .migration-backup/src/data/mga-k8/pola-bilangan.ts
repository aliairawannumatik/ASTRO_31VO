import type { SubmaterialEntryK8, BaseQ } from "./types";
import { expandPool } from "./_helpers";

const PARENT_SLUG = "pola-bilangan";
const PARENT_LABEL = "POLA BILANGAN";

const PENGERTIAN_POLA: BaseQ[] = [
  { q: "Suku ke-5 dari pola 2, 4, 6, 8, ... adalah ...", opts: ["8", "10", "12", "14"], correct: 1 },
  { q: "Pola bilangan 1, 3, 5, 7, ... adalah pola bilangan ...", opts: ["genap", "ganjil", "prima", "kuadrat"], correct: 1 },
  { q: "Suku berikutnya dari 5, 10, 15, 20, ... adalah ...", opts: ["22", "23", "24", "25"], correct: 3 },
  { q: "Pola bilangan 2, 4, 6, 8, ... disebut pola bilangan ...", opts: ["ganjil", "genap", "prima", "segitiga"], correct: 1 },
  { q: "Suku ke-3 dari barisan 7, 14, 21, ... adalah ...", opts: ["7", "14", "21", "28"], correct: 2 },
  { q: "Bilangan berikutnya dari 1, 2, 3, 4, ... adalah ...", opts: ["4", "5", "6", "7"], correct: 1 },
  { q: "Suku ke-4 dari pola 3, 6, 9, ... adalah ...", opts: ["9", "10", "11", "12"], correct: 3 },
  { q: "Pola bilangan loncat 2 dimulai dari 0: 0, 2, 4, 6, ... Suku ke-5 = ...", opts: ["6", "8", "10", "12"], correct: 1 },
  { q: "Pola 10, 20, 30, 40, ... selisih antar suku adalah ...", opts: ["5", "10", "15", "20"], correct: 1 },
  { q: "Berapa banyak suku pada barisan 2, 4, 6, 8, 10?", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Suku ke-1 dari pola 4, 8, 12, ... adalah ...", opts: ["2", "4", "6", "8"], correct: 1 },
  { q: "Pola bilangan 1, 4, 7, 10, ... naik sebanyak ...", opts: ["2", "3", "4", "5"], correct: 1 },
];

const POLA_KHUSUS: BaseQ[] = [
  { q: "Bilangan segitiga ke-4 (1, 3, 6, 10, ...) adalah ...", opts: ["6", "10", "15", "21"], correct: 1 },
  { q: "Bilangan persegi ke-4 (1, 4, 9, ...) adalah ...", opts: ["12", "14", "16", "18"], correct: 2 },
  { q: "Pola persegi panjang: 2, 6, 12, 20, ... berikutnya ...", opts: ["28", "30", "32", "36"], correct: 1 },
  { q: "Bilangan Fibonacci: 1, 1, 2, 3, 5, ... berikutnya ...", opts: ["6", "7", "8", "9"], correct: 2 },
  { q: "Suku ke-5 bilangan segitiga (1, 3, 6, 10, 15, ...) = ...", opts: ["10", "15", "21", "28"], correct: 1 },
  { q: "Bilangan persegi: 1, 4, 9, 16, ... berikutnya ...", opts: ["20", "24", "25", "30"], correct: 2 },
  { q: "Pola Fibonacci: 1, 1, 2, 3, 5, 8, ... berikutnya ...", opts: ["11", "12", "13", "14"], correct: 2 },
  { q: "Suku ke-3 bilangan segitiga adalah ...", opts: ["3", "6", "10", "15"], correct: 1 },
  { q: "Suku ke-5 pola persegi (1, 4, 9, 16, ...) = ...", opts: ["20", "25", "30", "36"], correct: 1 },
  { q: "Pola bilangan kuadrat dimulai dari ...", opts: ["0", "1", "2", "4"], correct: 1 },
  { q: "Bilangan persegi panjang ke-3 (2, 6, 12, ...) = ...", opts: ["10", "12", "14", "20"], correct: 1 },
  { q: "Pola bilangan dengan rumus n² disebut ...", opts: ["segitiga", "persegi", "Fibonacci", "ganjil"], correct: 1 },
];

const POLA_ARITMETIKA: BaseQ[] = [
  { q: "Beda dari barisan 3, 7, 11, 15, ... adalah ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Suku ke-5 dari 2, 5, 8, 11, ... adalah ...", opts: ["13", "14", "15", "16"], correct: 1 },
  { q: "Beda dari 10, 7, 4, 1, ... adalah ...", opts: ["−3", "−2", "2", "3"], correct: 0 },
  { q: "Suku ke-4 dari 5, 9, 13, ... adalah ...", opts: ["15", "16", "17", "18"], correct: 2 },
  { q: "Suku pertama dari 8, 12, 16, ... adalah ...", opts: ["4", "8", "12", "16"], correct: 1 },
  { q: "Beda 2, 6, 10, 14, ... adalah ...", opts: ["2", "3", "4", "5"], correct: 2 },
  { q: "Suku ke-3 dari 7, 10, 13, ... adalah ...", opts: ["10", "13", "16", "19"], correct: 1 },
  { q: "Suku ke-6 dari 1, 4, 7, 10, ... adalah ...", opts: ["13", "14", "15", "16"], correct: 3 },
  { q: "Barisan 5, 10, 15, 20, ... bedanya ...", opts: ["3", "4", "5", "6"], correct: 2 },
  { q: "Rumus suku ke-n aritmetika: Un = a + (n−1)b. Jika a=2, b=3, U₃ = ...", opts: ["6", "8", "10", "12"], correct: 1 },
  { q: "Suku ke-5 dari 1, 3, 5, 7, ... adalah ...", opts: ["7", "8", "9", "10"], correct: 2 },
  { q: "Beda barisan 20, 17, 14, 11, ... adalah ...", opts: ["−3", "3", "−2", "2"], correct: 0 },
];

const POLA_GEOMETRI: BaseQ[] = [
  { q: "Rasio dari barisan 2, 4, 8, 16, ... adalah ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Suku ke-4 dari 3, 6, 12, ... adalah ...", opts: ["18", "21", "24", "27"], correct: 2 },
  { q: "Rasio dari 1, 3, 9, 27, ... adalah ...", opts: ["2", "3", "4", "5"], correct: 1 },
  { q: "Suku ke-5 dari 1, 2, 4, 8, ... adalah ...", opts: ["12", "14", "16", "18"], correct: 2 },
  { q: "Suku ke-3 dari 2, 6, 18, ... adalah ...", opts: ["12", "18", "24", "36"], correct: 1 },
  { q: "Rasio barisan 5, 10, 20, 40, ... adalah ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Suku ke-4 dari 1, 3, 9, ... adalah ...", opts: ["18", "21", "27", "30"], correct: 2 },
  { q: "Rasio 81, 27, 9, 3, ... adalah ...", opts: ["1/3", "1/2", "2", "3"], correct: 0 },
  { q: "Suku ke-5 dari 1, 2, 4, 8, 16, ... adalah ...", opts: ["12", "14", "16", "20"], correct: 2 },
  { q: "Rumus suku ke-n geometri: Un = a·r^(n−1). a=2, r=3, U₃ = ...", opts: ["12", "16", "18", "24"], correct: 2 },
  { q: "Barisan 4, 8, 16, 32, ... rasionya ...", opts: ["1", "2", "3", "4"], correct: 1 },
  { q: "Suku ke-4 dari barisan geometri 1, 5, 25, ... adalah ...", opts: ["100", "125", "150", "200"], correct: 1 },
];

export const POLA_BILANGAN: SubmaterialEntryK8[] = [
  { slug: "pengertian-pola", label: "PENGERTIAN POLA & BARISAN BILANGAN", emoji: "🔢", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(PENGERTIAN_POLA) },
  { slug: "pola-khusus", label: "POLA-POLA KHUSUS", emoji: "✨", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(POLA_KHUSUS) },
  { slug: "pola-aritmetika", label: "BARISAN DAN DERET ARITMETIKA", emoji: "➕", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(POLA_ARITMETIKA) },
  { slug: "pola-geometri", label: "BARISAN DAN DERET GEOMETRI", emoji: "✖️", parentSlug: PARENT_SLUG, parentLabel: PARENT_LABEL, questions: expandPool(POLA_GEOMETRI) },
];
