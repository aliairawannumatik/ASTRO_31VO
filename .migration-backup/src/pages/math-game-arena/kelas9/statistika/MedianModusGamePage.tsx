import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Data: 3, 5, 7, 9, 11. Median dari data tersebut adalah ...",
    options: ["5", "7", "9", "6"],
    correctIndex: 1,
  },
  {
    question: "Data: 4, 6, 8, 10, 12, 14. Median dari data tersebut adalah ...",
    options: ["8", "9", "10", "11"],
    correctIndex: 1,
  },
  {
    question: "Data: 2, 4, 4, 6, 8, 8, 8, 10. Modus dari data ini adalah ...",
    options: ["4", "6", "8", "10"],
    correctIndex: 2,
  },
  {
    question: "Data: 5, 7, 9, 7, 5, 3, 5. Modus datanya adalah ...",
    options: ["7", "3", "9", "5"],
    correctIndex: 3,
  },
  {
    question: "Nilai tengah dari data yang telah diurutkan disebut ...",
    options: ["Modus", "Mean", "Median", "Kuartil"],
    correctIndex: 2,
  },
];

const MedianModusGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)"
    backPath="/math-game-arena/kelas-9/statistika"
    backLabel="Kembali ke Statistika"
  />
);

export default MedianModusGamePage;
