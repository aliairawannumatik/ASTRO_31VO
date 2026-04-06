import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari x/2 + x/3?",
    options: ["2x/5", "5x/6", "x/6", "x/5"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari (2a/3) - (a/6)?",
    options: ["a/2", "a/3", "a/6", "a/9"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari (x/2) × (4/x)?",
    options: ["4x", "4/x", "2", "4"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari (3x/4) ÷ (x/2)?",
    options: ["3/4", "3/2", "6x/4", "3x²/8"],
    correctIndex: 1,
  },
  {
    question: "Sederhanakan: (2x + 4)/2!",
    options: ["x + 2", "x + 4", "2x + 2", "x + 1"],
    correctIndex: 0,
  },
];

const OperasiPecahanAljabarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENYEDERHANAKAN PECAHAN ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default OperasiPecahanAljabarGamePage;
