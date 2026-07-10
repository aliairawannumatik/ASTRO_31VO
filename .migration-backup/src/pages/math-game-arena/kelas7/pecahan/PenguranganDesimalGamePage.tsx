import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 0,9 - 0,35?",
    options: ["0,45", "0,55", "0,65", "0,50"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 2,5 - 1,25?",
    options: ["1,00", "1,15", "1,25", "1,35"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari 5,3 - 2,75?",
    options: ["2,35", "2,45", "2,55", "2,65"],
    correctIndex: 2,
  },
  {
    question: "Dani memiliki pita 3,5 m, dipotong 1,25 m. Sisa pita Dani adalah ...",
    options: ["2,15 m", "2,25 m", "2,35 m", "2,45 m"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 10 - 4,375?",
    options: ["5,525", "5,625", "5,725", "5,825"],
    correctIndex: 1,
  },
];

const PenguranganDesimalGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGURANGAN BENTUK DESIMAL"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PenguranganDesimalGamePage;
