import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah nilai dari √49?",
    options: ["6", "7", "8", "9"],
    correctIndex: 1,
  },
  {
    question: "Berapakah nilai dari √81?",
    options: ["7", "8", "9", "10"],
    correctIndex: 2,
  },
  {
    question: "Berapakah nilai dari ∛27?",
    options: ["2", "3", "4", "9"],
    correctIndex: 1,
  },
  {
    question: "Sederhanakan √50 = ...",
    options: ["5√2", "2√5", "10√5", "25√2"],
    correctIndex: 0,
  },
  {
    question: "Berapakah nilai dari √16 + √25?",
    options: ["9", "√41", "11", "√81"],
    correctIndex: 0,
  },
];

const BentukAkarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BENTUK AKAR"
    backPath="/math-game-arena/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Bilangan Berpangkat"
  />
);

export default BentukAkarGamePage;
