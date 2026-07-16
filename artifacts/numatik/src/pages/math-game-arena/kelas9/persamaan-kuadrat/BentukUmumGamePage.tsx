import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Bentuk umum persamaan kuadrat adalah ...",
    options: ["ax + b = 0", "ax² + bx + c = 0", "ax³ + b = 0", "ax² = 0"],
    correctIndex: 1,
  },
  {
    question: "Pada persamaan 2x² - 5x + 3 = 0, nilai a, b, c berturut-turut adalah ...",
    options: ["2, 5, 3", "2, -5, 3", "-2, 5, 3", "2, -5, -3"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan persamaan kuadrat?",
    options: ["3x + 2 = 0", "x² + 4 = 0", "x³ - x = 0", "2x = 8"],
    correctIndex: 1,
  },
  {
    question: "Persamaan x² - 9 = 0 memiliki nilai a, b, c berturut-turut ...",
    options: ["1, 0, -9", "1, 9, 0", "1, -9, 0", "0, 0, -9"],
    correctIndex: 0,
  },
  {
    question: "Pada ax² + bx + c = 0, syarat a adalah ...",
    options: ["a = 0", "a > 0", "a ≠ 0", "a < 0"],
    correctIndex: 2,
  },
];

const BentukUmumGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BENTUK UMUM PERSAMAAN KUADRAT"
    backPath="/math-game-arena/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Persamaan Kuadrat"
  />
);

export default BentukUmumGamePage;
