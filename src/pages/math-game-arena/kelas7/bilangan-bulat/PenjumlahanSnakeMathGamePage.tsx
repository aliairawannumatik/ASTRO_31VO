import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
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

const make = (a: number, b: number): GuruQuestion => {
  const ans = a + b;
  const { options, correctIdx } = buildOptions(ans);
  return {
    question: `Hasil dari ${fmt(a)} + ${fmt(b)} adalah ...`,
    options,
    correctIdx,
  };
};

const PENJUMLAHAN_QUESTIONS: GuruQuestion[] = [
  make(7, 5),
  make(-4, 9),
  make(8, -3),
  make(-6, -7),
  make(15, -8),
  make(-12, 5),
  make(-9, -11),
  make(20, -14),
  make(-18, 25),
  make(-7, 7),
  make(13, -13),
  make(-15, -10),
  make(22, -9),
  make(-25, 30),
  make(-8, -16),
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

const PenjumlahanSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_QUESTIONS}
    quizIntervalMs={25_000}
  />
);

export default PenjumlahanSnakeMathGamePage;
