import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 3/4 ÷ 1/2?",
    options: ["3/8", "3/2", "6/4", "1 1/2"],
    correctIndex: 3,
  },
  {
    question: "Berapakah hasil dari 2/3 ÷ 4/9?",
    options: ["3/2", "8/27", "1 1/2", "2/4"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari 5/6 ÷ 5/12?",
    options: ["25/72", "2", "1/2", "5/3"],
    correctIndex: 1,
  },
  {
    question: "Tali sepanjang 3/4 m dipotong menjadi bagian-bagian 1/8 m. Berapa banyak potongan yang dihasilkan?",
    options: ["4 potong", "5 potong", "6 potong", "8 potong"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari 1 1/4 ÷ 5/8?",
    options: ["1 1/2", "2", "2 1/2", "3"],
    correctIndex: 1,
  },
];

const PembagianPecahanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMBAGIAN PECAHAN"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PembagianPecahanGamePage;
