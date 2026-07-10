import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 1/4 + 1/2?",
    options: ["2/6", "3/4", "2/4", "1/6"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 2/3 + 1/6?",
    options: ["3/9", "5/6", "4/6", "3/6"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 1 1/2 + 2 1/4?",
    options: ["3 1/4", "3 3/4", "4 1/4", "3 1/2"],
    correctIndex: 1,
  },
  {
    question: "Pak Budi membeli 3/4 kg gula dan 1/2 kg tepung. Berapa total belanjaannya?",
    options: ["4/6 kg", "5/4 kg", "1 1/4 kg", "1 kg"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari 3/8 + 5/6?",
    options: ["29/24", "8/14", "8/24", "15/24"],
    correctIndex: 0,
  },
];

const PenjumlahanPecahanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENJUMLAHAN PECAHAN"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PenjumlahanPecahanGamePage;
