import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari (2x)²?",
    options: ["2x²", "4x", "4x²", "2x"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari (3a)³?",
    options: ["9a³", "27a³", "3a³", "27a"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari (x + 1)²?",
    options: ["x² + 1", "x² + x + 1", "x² + 2x + 1", "2x + 1"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari (2x - 3)²?",
    options: ["4x² - 9", "4x² + 9", "4x² - 12x + 9", "4x² + 12x + 9"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari (ab²)³?",
    options: ["a³b⁵", "a³b⁶", "ab⁶", "3a³b⁶"],
    correctIndex: 1,
  },
];

const PemangkatanAljabarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMANGKATAN BENTUK ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default PemangkatanAljabarGamePage;
