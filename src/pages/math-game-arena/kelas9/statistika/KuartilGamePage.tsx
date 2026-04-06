import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Data: 2, 4, 6, 8, 10, 12, 14. Kuartil tengah (Q2) adalah ...",
    options: ["6", "8", "10", "7"],
    correctIndex: 1,
  },
  {
    question: "Data: 1, 3, 5, 7, 9, 11, 13, 15. Kuartil bawah (Q1) adalah ...",
    options: ["3", "4", "5", "2"],
    correctIndex: 1,
  },
  {
    question: "Data: 10, 20, 30, 40, 50, 60, 70. Kuartil atas (Q3) adalah ...",
    options: ["50", "55", "60", "65"],
    correctIndex: 2,
  },
  {
    question: "Jangkauan interkuartil (JIK) = ...",
    options: ["Q3 - Q1", "Q2 - Q1", "Q3 - Q2", "Q3 + Q1"],
    correctIndex: 0,
  },
  {
    question: "Q2 dari suatu data sama dengan ...",
    options: ["Mean", "Median", "Modus", "Jangkauan"],
    correctIndex: 1,
  },
];

const KuartilGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="UKURAN LETAK DATA (KUARTIL)"
    backPath="/math-game-arena/kelas-9/statistika"
    backLabel="Kembali ke Statistika"
  />
);

export default KuartilGamePage;
