import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Akar-akar dari x² - 5x + 6 = 0 dengan pemfaktoran adalah ...",
    options: ["x = 2 dan x = 3", "x = -2 dan x = -3", "x = 1 dan x = 6", "x = -1 dan x = 6"],
    correctIndex: 0,
  },
  {
    question: "Faktor dari x² - 9 adalah ...",
    options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x+3)(x+3)", "(x-3)(x-3)"],
    correctIndex: 0,
  },
  {
    question: "Akar-akar dari x² + x - 6 = 0 adalah ...",
    options: ["x = 2 dan x = -3", "x = -2 dan x = 3", "x = 1 dan x = -6", "x = -1 dan x = 6"],
    correctIndex: 0,
  },
  {
    question: "Persamaan x² - 4x = 0 memiliki akar-akar ...",
    options: ["x = 0 dan x = 4", "x = 2 dan x = 2", "x = -4 dan x = 0", "x = 1 dan x = 4"],
    correctIndex: 0,
  },
  {
    question: "Akar-akar dari 2x² + 7x + 3 = 0 adalah ...",
    options: ["x = -3 dan x = -½", "x = 3 dan x = ½", "x = -3 dan x = ½", "x = 3 dan x = -½"],
    correctIndex: 0,
  },
];

const PemfaktoranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN"
    backPath="/math-game-arena/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Persamaan Kuadrat"
  />
);

export default PemfaktoranGamePage;
