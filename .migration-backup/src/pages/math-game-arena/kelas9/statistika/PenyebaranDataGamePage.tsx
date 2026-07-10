import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Data: 5, 10, 15, 20, 25. Jangkauan (range) datanya adalah ...",
    options: ["15", "20", "10", "25"],
    correctIndex: 1,
  },
  {
    question: "Jangkauan = ...",
    options: [
      "Nilai terbesar + nilai terkecil",
      "Nilai terbesar - nilai terkecil",
      "Rata-rata data",
      "Q3 - Q1",
    ],
    correctIndex: 1,
  },
  {
    question: "Data: Q1 = 30, Q3 = 50. Jangkauan interkuartil (JIK) adalah ...",
    options: ["80", "40", "20", "10"],
    correctIndex: 2,
  },
  {
    question: "Simpangan kuartil (SK) = ...",
    options: ["Q3 - Q1", "½(Q3 - Q1)", "2(Q3 - Q1)", "Q3 + Q1"],
    correctIndex: 1,
  },
  {
    question: "Jika JIK suatu data = 12, maka simpangan kuartilnya adalah ...",
    options: ["12", "24", "6", "4"],
    correctIndex: 2,
  },
];

const PenyebaranDataGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="UKURAN PENYEBARAN DATA"
    backPath="/math-game-arena/kelas-9/statistika"
    backLabel="Kembali ke Statistika"
  />
);

export default PenyebaranDataGamePage;
