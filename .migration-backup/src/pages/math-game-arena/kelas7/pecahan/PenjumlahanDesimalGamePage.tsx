import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 0,5 + 0,35?",
    options: ["0,85", "0,80", "0,90", "0,55"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari 1,25 + 0,75?",
    options: ["1,90", "2,00", "1,95", "2,25"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 3,4 + 1,65?",
    options: ["4,95", "5,05", "5,15", "5,10"],
    correctIndex: 1,
  },
  {
    question: "Budi membeli 1,5 kg apel dan 0,75 kg jeruk. Berat total buah yang dibeli adalah ...",
    options: ["2,20 kg", "2,25 kg", "2,15 kg", "2,30 kg"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari 2,08 + 1,7 + 0,25?",
    options: ["3,93", "4,03", "3,83", "4,13"],
    correctIndex: 1,
  },
];

const PenjumlahanDesimalGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENJUMLAHAN BENTUK DESIMAL"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PenjumlahanDesimalGamePage;
