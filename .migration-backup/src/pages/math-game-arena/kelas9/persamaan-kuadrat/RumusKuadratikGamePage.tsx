import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus kuadratik (rumus abc) untuk mencari akar persamaan ax² + bx + c = 0 adalah ...",
    options: [
      "x = (-b ± √(b²-4ac)) / 2a",
      "x = (b ± √(b²-4ac)) / 2a",
      "x = (-b ± √(b²+4ac)) / 2a",
      "x = (-b ± √(4ac-b²)) / 2a",
    ],
    correctIndex: 0,
  },
  {
    question: "Gunakan rumus kuadratik untuk x² - 3x + 2 = 0. Nilainya adalah ...",
    options: ["x = 1 dan x = 2", "x = -1 dan x = -2", "x = 3 dan x = 1", "x = -3 dan x = 2"],
    correctIndex: 0,
  },
  {
    question: "Pada persamaan 2x² - 4x - 6 = 0, nilai b² - 4ac = ...",
    options: ["64", "32", "-32", "16"],
    correctIndex: 0,
  },
  {
    question: "Jika b² - 4ac = 0, maka persamaan kuadrat memiliki ...",
    options: [
      "Dua akar real berbeda",
      "Satu akar real (kembar)",
      "Tidak memiliki akar real",
      "Tiga akar real",
    ],
    correctIndex: 1,
  },
  {
    question: "Untuk x² + 2x - 8 = 0 dengan rumus kuadratik, diperoleh akar-akar ...",
    options: ["x = 2 dan x = -4", "x = -2 dan x = 4", "x = 4 dan x = 2", "x = -2 dan x = -4"],
    correctIndex: 0,
  },
];

const RumusKuadratikGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK"
    backPath="/math-game-arena/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Persamaan Kuadrat"
  />
);

export default RumusKuadratikGamePage;
