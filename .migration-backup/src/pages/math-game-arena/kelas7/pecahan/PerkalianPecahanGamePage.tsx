import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 2/3 × 3/4?",
    options: ["5/7", "6/12", "1/2", "2/4"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari 1/2 × 4/5?",
    options: ["2/5", "5/10", "4/10", "3/5"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari 1 1/2 × 2/3?",
    options: ["1/1", "2/3", "3/4", "1"],
    correctIndex: 3,
  },
  {
    question: "Sebuah kebun memiliki panjang 3/4 km dan lebar 2/3 km. Berapakah luas kebun itu?",
    options: ["5/12 km²", "1/2 km²", "6/7 km²", "7/12 km²"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 5/6 × 3/10?",
    options: ["8/16", "1/4", "2/5", "15/60"],
    correctIndex: 1,
  },
];

const PerkalianPecahanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERKALIAN PECAHAN"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PerkalianPecahanGamePage;
