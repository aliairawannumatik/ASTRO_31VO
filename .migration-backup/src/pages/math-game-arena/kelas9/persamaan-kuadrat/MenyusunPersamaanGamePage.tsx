import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Persamaan kuadrat yang akar-akarnya 3 dan 5 adalah ...",
    options: ["x² + 8x + 15 = 0", "x² - 8x + 15 = 0", "x² - 8x - 15 = 0", "x² + 8x - 15 = 0"],
    correctIndex: 1,
  },
  {
    question: "Jika x₁ dan x₂ adalah akar-akar, maka persamaan kuadratnya adalah x² - ... x + ... = 0",
    options: [
      "(x₁ + x₂) dan (x₁ × x₂)",
      "(x₁ × x₂) dan (x₁ + x₂)",
      "(x₁ - x₂) dan (x₁ × x₂)",
      "(x₁ + x₂) dan (x₁ - x₂)",
    ],
    correctIndex: 0,
  },
  {
    question: "Persamaan kuadrat yang akar-akarnya -2 dan 6 adalah ...",
    options: ["x² + 4x - 12 = 0", "x² - 4x - 12 = 0", "x² - 4x + 12 = 0", "x² + 4x + 12 = 0"],
    correctIndex: 1,
  },
  {
    question: "Akar-akar suatu persamaan kuadrat adalah 4 dan 4. Persamaan kuadratnya adalah ...",
    options: ["x² + 8x + 16 = 0", "x² - 8x - 16 = 0", "x² - 8x + 16 = 0", "x² + 8x - 16 = 0"],
    correctIndex: 2,
  },
  {
    question: "Persamaan kuadrat yang akar-akarnya -3 dan -4 adalah ...",
    options: ["x² + 7x + 12 = 0", "x² - 7x + 12 = 0", "x² + 7x - 12 = 0", "x² - 7x - 12 = 0"],
    correctIndex: 0,
  },
];

const MenyusunPersamaanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENYUSUN PERSAMAAN KUADRAT BARU"
    backPath="/math-game-arena/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Persamaan Kuadrat"
  />
);

export default MenyusunPersamaanGamePage;
