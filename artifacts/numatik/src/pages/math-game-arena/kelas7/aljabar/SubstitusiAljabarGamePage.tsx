import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Jika x = 3, berapakah nilai dari 2x + 5?",
    options: ["10", "11", "12", "13"],
    correctIndex: 1,
  },
  {
    question: "Jika a = 2 dan b = -1, berapakah nilai dari 3a - 2b?",
    options: ["4", "6", "8", "10"],
    correctIndex: 2,
  },
  {
    question: "Jika x = 4, berapakah nilai dari x² - 3x + 2?",
    options: ["4", "6", "8", "10"],
    correctIndex: 1,
  },
  {
    question: "Jika p = -2, berapakah nilai dari p³ + 5p?",
    options: ["-18", "-8", "18", "-2"],
    correctIndex: 0,
  },
  {
    question: "Jika m = 3 dan n = 2, berapakah nilai dari 2m² - mn + n?",
    options: ["12", "14", "16", "18"],
    correctIndex: 2,
  },
];

const SubstitusiAljabarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SUBSTITUSI BILANGAN PADA BENTUK ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default SubstitusiAljabarGamePage;
