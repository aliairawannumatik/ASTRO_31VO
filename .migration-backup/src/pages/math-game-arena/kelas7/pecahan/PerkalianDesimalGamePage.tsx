import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 0,4 × 0,5?",
    options: ["0,09", "0,20", "0,45", "2,00"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 1,2 × 0,5?",
    options: ["0,06", "0,60", "6,00", "0,06"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 2,5 × 1,4?",
    options: ["2,50", "3,50", "3,75", "4,00"],
    correctIndex: 1,
  },
  {
    question: "Sebuah persegi panjang memiliki panjang 3,5 m dan lebar 2,4 m. Berapakah luasnya?",
    options: ["7,4 m²", "8,4 m²", "9,4 m²", "6,4 m²"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 0,25 × 0,8?",
    options: ["0,02", "0,20", "2,00", "0,33"],
    correctIndex: 1,
  },
];

const PerkalianDesimalGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERKALIAN BENTUK DESIMAL"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PerkalianDesimalGamePage;
