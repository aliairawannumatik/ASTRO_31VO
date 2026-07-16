import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Selesaikan: 3x - 4 > 5",
    options: ["x > 2", "x > 3", "x < 3", "x > 9"],
    correctIndex: 1,
  },
  {
    question: "Selesaikan: 2x + 1 ≤ 9",
    options: ["x ≤ 3", "x ≤ 4", "x ≤ 5", "x ≤ 10"],
    correctIndex: 1,
  },
  {
    question: "Selesaikan: 5 - 2x ≥ -3",
    options: ["x ≥ 4", "x ≤ 4", "x ≥ -4", "x ≤ -4"],
    correctIndex: 1,
  },
  {
    question: "Selesaikan: 4x + 3 < 19",
    options: ["x < 3", "x < 4", "x < 5", "x < 16"],
    correctIndex: 1,
  },
  {
    question: "Himpunan penyelesaian dari 2x - 3 > 7 untuk x bilangan bulat positif adalah ...",
    options: ["{5, 6, 7, ...}", "{6, 7, 8, ...}", "{4, 5, 6, ...}", "{1, 2, 3, ...}"],
    correctIndex: 1,
  },
];

const PenyelesaianPtLSVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL"
    backPath="/math-game-arena/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke PLSV"
  />
);

export default PenyelesaianPtLSVGamePage;
