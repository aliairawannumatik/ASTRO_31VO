import type { GuruQuestion } from "@/hooks/useGuruQuiz";

const fmt = (n: number) => (n < 0 ? `(${n})` : `${n}`);

const buildOptions = (correct: number): { options: string[]; correctIdx: number } => {
  const set = new Set<number>([correct]);
  while (set.size < 4) {
    const delta = (1 + Math.floor(Math.random() * 6)) * (Math.random() < 0.5 ? -1 : 1);
    set.add(correct + delta);
  }
  const arr = Array.from(set);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return { options: arr.map(String), correctIdx: arr.indexOf(correct) };
};

const makeAdd = (a: number, b: number): GuruQuestion => {
  const ans = a + b;
  const { options, correctIdx } = buildOptions(ans);
  return {
    question: `Hasil dari ${fmt(a)} + ${fmt(b)} adalah ...`,
    options,
    correctIdx,
  };
};

export const PENJUMLAHAN_QUIZ: GuruQuestion[] = [
  makeAdd(7, 5),
  makeAdd(-4, 9),
  makeAdd(8, -3),
  makeAdd(-6, -7),
  makeAdd(15, -8),
  makeAdd(-12, 5),
  makeAdd(-9, -11),
  makeAdd(20, -14),
  makeAdd(-18, 25),
  makeAdd(-7, 7),
  makeAdd(13, -13),
  makeAdd(-15, -10),
  makeAdd(22, -9),
  makeAdd(-25, 30),
  makeAdd(-8, -16),
  {
    question: "Pak Budi memiliki utang Rp 5.000 dan menambah utang Rp 3.000 lagi. Total utangnya dilambangkan dengan ...",
    options: ["−2.000", "−8.000", "+8.000", "+2.000"],
    correctIdx: 1,
  },
  {
    question: "Suhu mula-mula 6°C lalu turun 10°C. Suhu sekarang adalah ...",
    options: ["−4°C", "4°C", "16°C", "−16°C"],
    correctIdx: 0,
  },
  {
    question: "Bentuk yang setara dengan a + (−b) adalah ...",
    options: ["a + b", "a − b", "−a + b", "−a − b"],
    correctIdx: 1,
  },
  {
    question: "Sifat komutatif penjumlahan: a + b = ...",
    options: ["a − b", "b + a", "−a − b", "a × b"],
    correctIdx: 1,
  },
  {
    question: "Hasil dari 0 + (−9) adalah ...",
    options: ["9", "0", "−9", "−1"],
    correctIdx: 2,
  },
];

export const PENGURANGAN_QUIZ: GuruQuestion[] = [
  { question: "Hasil dari 9 − 4 adalah ...", options: ["3", "5", "-3", "-5"], correctIdx: 1 },
  { question: "Hasil dari 6 − 11 adalah ...", options: ["5", "-5", "17", "-17"], correctIdx: 1 },
  { question: "Hasil dari (−3) − 5 adalah ...", options: ["8", "-8", "2", "-2"], correctIdx: 1 },
  { question: "Hasil dari 8 − (−2) adalah ...", options: ["6", "10", "-6", "-10"], correctIdx: 1 },
  { question: "Hasil dari (−4) − (−9) adalah ...", options: ["-13", "13", "5", "-5"], correctIdx: 2 },
  { question: "Hasil dari 0 − 7 adalah ...", options: ["7", "-7", "0", "1"], correctIdx: 1 },
  { question: "Hasil dari 12 − 12 adalah ...", options: ["0", "24", "1", "-1"], correctIdx: 0 },
  { question: "Hasil dari (−6) − 4 adalah ...", options: ["10", "-10", "2", "-2"], correctIdx: 1 },
  { question: "Hasil dari 5 − (−5) adalah ...", options: ["10", "0", "-10", "5"], correctIdx: 0 },
  { question: "Suhu mula-mula 7°C lalu turun 12°C. Suhu sekarang adalah ...", options: ["-5°C", "5°C", "19°C", "-19°C"], correctIdx: 0 },
  { question: "Saldo Rp8.000 ditarik Rp10.000. Saldo akhir adalah ...", options: ["-Rp2.000", "Rp2.000", "Rp18.000", "-Rp18.000"], correctIdx: 0 },
  { question: "Sifat: a − b = a + ...", options: ["b", "-b", "0", "1"], correctIdx: 1 },
];

export const PERKALIAN_QUIZ: GuruQuestion[] = [
  { question: "Hasil dari 5 × 3 adalah ...", options: ["8", "15", "-15", "-8"], correctIdx: 1 },
  { question: "Hasil dari (−2) × 6 adalah ...", options: ["12", "-12", "8", "-8"], correctIdx: 1 },
  { question: "Hasil dari (−4) × (−5) adalah ...", options: ["20", "-20", "9", "-9"], correctIdx: 0 },
  { question: "Hasil dari 8 × 0 adalah ...", options: ["8", "0", "1", "-8"], correctIdx: 1 },
  { question: "Hasil dari 3 × (−7) adalah ...", options: ["21", "-21", "10", "-10"], correctIdx: 1 },
  { question: "Hasil dari (−1) × 9 adalah ...", options: ["9", "-9", "8", "-8"], correctIdx: 1 },
  { question: "Hasil dari 6 × 4 adalah ...", options: ["10", "24", "-24", "-10"], correctIdx: 1 },
  { question: "Hasil dari (−3) × (−3) adalah ...", options: ["9", "-9", "6", "-6"], correctIdx: 0 },
  { question: "Hasil dari 7 × 2 adalah ...", options: ["14", "9", "-14", "-9"], correctIdx: 0 },
  { question: "Sifat: positif × negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 1 },
  { question: "Sifat: negatif × negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 0 },
  { question: "Lift turun 3 lt sebanyak 4 kali. Total perpindahan ...", options: ["+12", "-12", "-7", "+7"], correctIdx: 1 },
];

export const PEMBAGIAN_QUIZ: GuruQuestion[] = [
  { question: "Hasil dari 10 ÷ 2 adalah ...", options: ["12", "5", "-5", "-12"], correctIdx: 1 },
  { question: "Hasil dari (−15) ÷ 5 adalah ...", options: ["3", "-3", "10", "-10"], correctIdx: 1 },
  { question: "Hasil dari (−24) ÷ (−6) adalah ...", options: ["4", "-4", "18", "-18"], correctIdx: 0 },
  { question: "Hasil dari 0 ÷ 8 adalah ...", options: ["8", "1", "0", "tak terdefinisi"], correctIdx: 2 },
  { question: "Hasil dari 9 ÷ 0 adalah ...", options: ["0", "9", "1", "tak terdefinisi"], correctIdx: 3 },
  { question: "Hasil dari (−12) ÷ 3 adalah ...", options: ["4", "-4", "-9", "9"], correctIdx: 1 },
  { question: "Hasil dari 21 ÷ 7 adalah ...", options: ["3", "14", "-3", "-14"], correctIdx: 0 },
  { question: "Hasil dari (−9) ÷ (−1) adalah ...", options: ["-9", "9", "0", "-1"], correctIdx: 1 },
  { question: "Hasil dari 18 ÷ (−3) adalah ...", options: ["6", "-6", "15", "-15"], correctIdx: 1 },
  { question: "Sifat: positif ÷ negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 1 },
  { question: "Sifat: negatif ÷ negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 0 },
  { question: "30 buah dibagi 6 anak. Setiap anak dapat ...", options: ["6", "5", "4", "3"], correctIdx: 1 },
];

export const OPERASI_CAMPURAN_QUIZ: GuruQuestion[] = [
  { question: "Hasil dari 4 + 6 × 2 adalah ...", options: ["20", "16", "12", "8"], correctIdx: 1 },
  { question: "Hasil dari (8 − 2) ÷ 3 adalah ...", options: ["2", "6", "4", "8"], correctIdx: 0 },
  { question: "Hasil dari 10 − 2 × 3 adalah ...", options: ["24", "4", "-4", "30"], correctIdx: 1 },
  { question: "Hasil dari 12 ÷ 4 + 5 adalah ...", options: ["3", "8", "12", "17"], correctIdx: 1 },
  { question: "Hasil dari 3 × (5 + 1) adalah ...", options: ["8", "16", "18", "15"], correctIdx: 2 },
  { question: "Hasil dari (−3) × 2 + 8 adalah ...", options: ["-2", "2", "14", "-14"], correctIdx: 1 },
  { question: "Hasil dari 15 − 9 ÷ 3 adalah ...", options: ["12", "2", "6", "8"], correctIdx: 0 },
  { question: "Hasil dari 20 ÷ 4 − 1 adalah ...", options: ["4", "5", "6", "3"], correctIdx: 0 },
  { question: "Urutan operasi yang benar adalah ...", options: ["+, −, ×, ÷", "×, ÷, +, −", "−, +, ÷, ×", "÷, ×, −, +"], correctIdx: 1 },
  { question: "Hasil dari 5 + 3 × 2 adalah ...", options: ["16", "11", "13", "10"], correctIdx: 1 },
  { question: "Hasil dari (10 − 4) × 2 adalah ...", options: ["12", "2", "16", "8"], correctIdx: 0 },
  { question: "Hasil dari 7 + 14 ÷ 2 adalah ...", options: ["10", "14", "21", "7"], correctIdx: 1 },
];

export const KPK_FPB_QUIZ: GuruQuestion[] = [
  { question: "FPB dari 6 dan 9 adalah ...", options: ["1", "2", "3", "6"], correctIdx: 2 },
  { question: "KPK dari 3 dan 4 adalah ...", options: ["7", "12", "6", "24"], correctIdx: 1 },
  { question: "FPB dari 10 dan 15 adalah ...", options: ["5", "10", "3", "15"], correctIdx: 0 },
  { question: "KPK dari 2 dan 5 adalah ...", options: ["5", "10", "7", "20"], correctIdx: 1 },
  { question: "FPB dari 12 dan 18 adalah ...", options: ["2", "4", "6", "9"], correctIdx: 2 },
  { question: "KPK dari 4 dan 6 adalah ...", options: ["10", "12", "24", "8"], correctIdx: 1 },
  { question: "FPB dari 20 dan 30 adalah ...", options: ["5", "10", "15", "20"], correctIdx: 1 },
  { question: "KPK dari 6 dan 9 adalah ...", options: ["3", "18", "27", "54"], correctIdx: 1 },
  { question: "FPB dari 8 dan 12 adalah ...", options: ["2", "4", "6", "8"], correctIdx: 1 },
  { question: "KPK dari 5 dan 10 adalah ...", options: ["5", "10", "15", "50"], correctIdx: 1 },
  { question: "Faktor dari 6 adalah ...", options: ["1, 2, 3, 6", "2, 3", "1, 2, 6", "1, 6"], correctIdx: 0 },
  { question: "Kelipatan 4 yang kurang dari 20 adalah ...", options: ["4, 8, 12, 16", "4, 6, 8, 10", "1, 2, 4, 8", "8, 12, 16, 20"], correctIdx: 0 },
];
