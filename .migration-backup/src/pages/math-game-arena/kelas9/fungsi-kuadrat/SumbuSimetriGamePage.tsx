import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus sumbu simetri dari f(x) = ax² + bx + c adalah ...",
    options: ["x = b/2a", "x = -b/2a", "x = -b/a", "x = b/a"],
    correctIndex: 1,
  },
  {
    question: "Sumbu simetri dari f(x) = x² - 6x + 5 adalah ...",
    options: ["x = 3", "x = -3", "x = 6", "x = -6"],
    correctIndex: 0,
  },
  {
    question: "Koordinat titik puncak dari f(x) = x² - 4x + 3 adalah ...",
    options: ["(2, -1)", "(-2, 1)", "(2, 1)", "(-2, -1)"],
    correctIndex: 0,
  },
  {
    question: "Pada f(x) = 2x² + 8x + 6, sumbu simetrinya adalah ...",
    options: ["x = 2", "x = -2", "x = 4", "x = -4"],
    correctIndex: 1,
  },
  {
    question: "Nilai minimum f(x) = x² - 4x + 7 adalah ...",
    options: ["3", "7", "4", "1"],
    correctIndex: 0,
  },
];

const SumbuSimetriGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SUMBU SIMETRI DAN TITIK PUNCAK"
    backPath="/math-game-arena/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Fungsi Kuadrat"
  />
);

export default SumbuSimetriGamePage;
