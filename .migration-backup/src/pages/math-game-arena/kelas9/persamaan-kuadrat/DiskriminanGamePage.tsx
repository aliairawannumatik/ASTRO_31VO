import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Diskriminan (D) suatu persamaan kuadrat ax² + bx + c = 0 dirumuskan sebagai ...",
    options: ["D = b² + 4ac", "D = b² - 4ac", "D = 4ac - b²", "D = b + 4ac"],
    correctIndex: 1,
  },
  {
    question: "Jika D > 0, maka persamaan kuadrat memiliki ...",
    options: [
      "Dua akar real berbeda",
      "Dua akar real sama (kembar)",
      "Tidak ada akar real",
      "Satu akar real",
    ],
    correctIndex: 0,
  },
  {
    question: "Jika D < 0, maka persamaan kuadrat ...",
    options: [
      "Memiliki dua akar real",
      "Memiliki satu akar real",
      "Tidak memiliki akar real",
      "Memiliki tiga akar",
    ],
    correctIndex: 2,
  },
  {
    question: "Nilai diskriminan dari x² - 4x + 4 = 0 adalah ...",
    options: ["0", "8", "16", "-8"],
    correctIndex: 0,
  },
  {
    question: "Nilai diskriminan dari x² + x + 1 = 0 adalah ...",
    options: ["5", "3", "-3", "-5"],
    correctIndex: 2,
  },
];

const DiskriminanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="DISKRIMINAN"
    backPath="/math-game-arena/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Persamaan Kuadrat"
  />
);

export default DiskriminanGamePage;
