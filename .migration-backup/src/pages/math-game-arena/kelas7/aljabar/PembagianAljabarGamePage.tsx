import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 8x² ÷ 4x?",
    options: ["2x", "4x", "2x²", "4x²"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari 12a³b ÷ 3ab?",
    options: ["4a²", "4ab", "4a", "9a²"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari (6x² + 9x) ÷ 3x?",
    options: ["2x + 3", "3x + 9", "2x² + 3", "6x + 3"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari 15m²n ÷ 5mn?",
    options: ["3mn", "3m", "10m", "3n"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari (10x³ - 5x²) ÷ 5x²?",
    options: ["2x - 1", "2x + 1", "5x - 1", "2x² - 1"],
    correctIndex: 0,
  },
];

const PembagianAljabarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMBAGIAN BENTUK ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default PembagianAljabarGamePage;
