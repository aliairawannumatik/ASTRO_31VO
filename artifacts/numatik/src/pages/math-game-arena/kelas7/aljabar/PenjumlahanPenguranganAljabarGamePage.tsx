import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari (3x + 5) + (2x - 3)?",
    options: ["5x + 2", "5x - 2", "5x + 8", "6x + 2"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari (4a + 3b) - (2a - b)?",
    options: ["2a + 2b", "2a + 4b", "6a + 4b", "6a + 2b"],
    correctIndex: 1,
  },
  {
    question: "Sederhanakan: 5x² - 3x + 2x² + 7x!",
    options: ["7x² + 4x", "3x² + 4x", "7x² - 10x", "3x² - 10x"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari (6m + 4n - 2) - (3m - 2n + 5)?",
    options: ["3m + 2n - 7", "3m + 6n - 7", "3m + 6n + 3", "9m + 2n - 7"],
    correctIndex: 1,
  },
  {
    question: "Jika p = 3x + 5 dan q = x - 2, berapakah nilai p + q?",
    options: ["4x + 3", "4x + 7", "2x + 3", "2x + 7"],
    correctIndex: 0,
  },
];

const PenjumlahanPenguranganAljabarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default PenjumlahanPenguranganAljabarGamePage;
