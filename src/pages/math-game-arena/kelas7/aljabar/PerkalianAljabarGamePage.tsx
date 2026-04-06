import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 3(2x + 5)?",
    options: ["5x + 8", "6x + 15", "6x + 5", "6x + 8"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari (x + 3)(x + 4)?",
    options: ["x² + 7x + 12", "x² + 12x + 7", "x² + 7x + 7", "x² + 12"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari -2(3x - 4)?",
    options: ["-6x - 8", "-6x + 8", "6x - 8", "6x + 8"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari (2a + 1)(a - 3)?",
    options: ["2a² - 5a - 3", "2a² + 5a - 3", "2a² - 5a + 3", "2a² + 5a + 3"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari 4x(x + 2y)?",
    options: ["4x² + 8xy", "4x² + 2y", "8x² + 4xy", "4x + 8xy"],
    correctIndex: 0,
  },
];

const PerkalianAljabarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERKALIAN BENTUK ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default PerkalianAljabarGamePage;
