import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 3/4 - 1/4?",
    options: ["2/0", "1/2", "2/4", "4/4"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 5/6 - 1/3?",
    options: ["4/3", "4/6", "1/2", "1/3"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari 2 3/4 - 1 1/2?",
    options: ["1 3/4", "1 1/4", "1 1/2", "1 3/8"],
    correctIndex: 1,
  },
  {
    question: "Ani memiliki 7/8 meter pita. Ia menggunakan 1/4 meter. Sisa pita Ani adalah ...",
    options: ["5/8 m", "6/4 m", "3/4 m", "6/8 m"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari 5/6 - 3/8?",
    options: ["2/2", "11/24", "2/6", "13/24"],
    correctIndex: 3,
  },
];

const PenguranganPecahanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGURANGAN PECAHAN"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PenguranganPecahanGamePage;
