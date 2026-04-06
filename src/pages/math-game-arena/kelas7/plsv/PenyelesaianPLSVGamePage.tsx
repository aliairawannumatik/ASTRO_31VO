import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Selesaikan: 3x + 5 = 17",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correctIndex: 1,
  },
  {
    question: "Selesaikan: 2x - 7 = 3",
    options: ["x = 4", "x = 5", "x = 6", "x = 7"],
    correctIndex: 1,
  },
  {
    question: "Selesaikan: 5 - 2x = -9",
    options: ["x = 5", "x = 6", "x = 7", "x = 8"],
    correctIndex: 2,
  },
  {
    question: "Selesaikan: 4(x - 3) = 12",
    options: ["x = 5", "x = 6", "x = 7", "x = 8"],
    correctIndex: 1,
  },
  {
    question: "Selesaikan: (x + 3)/2 = 5",
    options: ["x = 5", "x = 6", "x = 7", "x = 8"],
    correctIndex: 2,
  },
];

const PenyelesaianPLSVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL"
    backPath="/math-game-arena/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke PLSV"
  />
);

export default PenyelesaianPLSVGamePage;
