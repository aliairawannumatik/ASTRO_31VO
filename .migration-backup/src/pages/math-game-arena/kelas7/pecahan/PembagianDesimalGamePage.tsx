import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 0,8 ÷ 0,4?",
    options: ["0,2", "2", "0,32", "20"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 1,5 ÷ 0,5?",
    options: ["0,3", "3", "0,75", "30"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 3,6 ÷ 1,2?",
    options: ["2", "3", "0,3", "30"],
    correctIndex: 1,
  },
  {
    question: "Kain sepanjang 5,4 m dipotong menjadi bagian-bagian 0,9 m. Berapa banyak potongan yang dihasilkan?",
    options: ["4 potong", "5 potong", "6 potong", "7 potong"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari 7,2 ÷ 2,4?",
    options: ["3,0", "2,5", "3,5", "4,0"],
    correctIndex: 0,
  },
];

const PembagianDesimalGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMBAGIAN BENTUK DESIMAL"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PembagianDesimalGamePage;
