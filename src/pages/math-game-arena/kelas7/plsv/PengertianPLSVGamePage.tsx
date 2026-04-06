import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Manakah yang merupakan PLSV (Persamaan Linear Satu Variabel)?",
    options: ["x² + 3 = 7", "2x + 3 = 7", "2x + 3y = 7", "x² - y = 5"],
    correctIndex: 1,
  },
  {
    question: "Persamaan 3x + 2 = 11 memiliki penyelesaian ...",
    options: ["x = 2", "x = 3", "x = 4", "x = 5"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan persamaan ekuivalen dengan 2x = 6?",
    options: ["x = 2", "x = 3", "x = 4", "x = 6"],
    correctIndex: 1,
  },
  {
    question: "Jika 5x - 3 = 12, maka nilai x adalah ...",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
  },
  {
    question: "Sifat kesamaan yang digunakan untuk menyelesaikan x + 7 = 15 adalah ...",
    options: ["Menambah kedua ruas dengan 7", "Mengurangi kedua ruas dengan 7", "Mengalikan kedua ruas dengan 7", "Membagi kedua ruas dengan 7"],
    correctIndex: 1,
  },
];

const PengertianPLSVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN PLSV DAN KESAMAAN"
    backPath="/math-game-arena/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke PLSV"
  />
);

export default PengertianPLSVGamePage;
