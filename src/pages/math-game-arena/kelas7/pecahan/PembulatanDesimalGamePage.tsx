import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah 3,467 dibulatkan ke satu desimal?",
    options: ["3,4", "3,5", "3,6", "3,7"],
    correctIndex: 1,
  },
  {
    question: "Berapakah 7,845 dibulatkan ke dua desimal?",
    options: ["7,84", "7,85", "7,86", "7,80"],
    correctIndex: 1,
  },
  {
    question: "Berapakah 12,35 dibulatkan ke satuan terdekat?",
    options: ["12", "13", "12,5", "12,3"],
    correctIndex: 0,
  },
  {
    question: "Berapakah 0,675 dibulatkan ke dua tempat desimal?",
    options: ["0,67", "0,68", "0,70", "0,65"],
    correctIndex: 1,
  },
  {
    question: "Tinggi Budi 1,654 m. Dibulatkan ke satu desimal menjadi ...",
    options: ["1,5 m", "1,6 m", "1,7 m", "1,65 m"],
    correctIndex: 1,
  },
];

const PembulatanDesimalGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMBULATAN BENTUK DESIMAL"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PembulatanDesimalGamePage;
