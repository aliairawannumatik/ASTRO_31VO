import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Faktorisasi dari 6x + 9 adalah ...",
    options: ["3(2x + 3)", "2(3x + 9)", "6(x + 3)", "3(2x + 9)"],
    correctIndex: 0,
  },
  {
    question: "Faktorisasi dari x² - 9 adalah ...",
    options: ["(x + 3)(x + 3)", "(x - 3)(x - 3)", "(x + 3)(x - 3)", "(x + 9)(x - 1)"],
    correctIndex: 2,
  },
  {
    question: "Faktorisasi dari x² + 5x + 6 adalah ...",
    options: ["(x + 1)(x + 6)", "(x + 2)(x + 3)", "(x + 5)(x + 1)", "(x + 2)(x + 6)"],
    correctIndex: 1,
  },
  {
    question: "Faktorisasi dari 4a² - 16 adalah ...",
    options: ["4(a + 2)(a - 2)", "4(a - 2)²", "2(a + 4)(a - 4)", "4(a² - 4)"],
    correctIndex: 0,
  },
  {
    question: "Faktorisasi dari 12xy - 8x² adalah ...",
    options: ["4x(3y - 2x)", "4xy(3 - 2x)", "4x(3y + 2x)", "2x(6y - 4x)"],
    correctIndex: 0,
  },
];

const FaktorisasiAljabarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="FAKTORISASI BENTUK ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default FaktorisasiAljabarGamePage;
