import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Manakah yang merupakan PtLSV (Pertidaksamaan Linear Satu Variabel)?",
    options: ["2x = 5", "2x + 3 > 7", "x² < 4", "2x + y ≥ 5"],
    correctIndex: 1,
  },
  {
    question: "Penyelesaian dari x + 3 > 7 adalah ...",
    options: ["x > 4", "x < 4", "x > 10", "x < 10"],
    correctIndex: 0,
  },
  {
    question: "Penyelesaian dari 2x ≤ 8 adalah ...",
    options: ["x ≥ 4", "x ≤ 4", "x ≥ 16", "x ≤ 16"],
    correctIndex: 1,
  },
  {
    question: "Jika kedua ruas pertidaksamaan dibagi dengan bilangan negatif, maka tanda ketidaksamaannya ...",
    options: ["Tetap sama", "Dibalik", "Dihapus", "Digandakan"],
    correctIndex: 1,
  },
  {
    question: "Penyelesaian dari -3x < 15 adalah ...",
    options: ["x < -5", "x > -5", "x < 5", "x > 5"],
    correctIndex: 1,
  },
];

const PengertianPtLSVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN DAN PENYELESAIAN PtLSV"
    backPath="/math-game-arena/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke PLSV"
  />
);

export default PengertianPtLSVGamePage;
