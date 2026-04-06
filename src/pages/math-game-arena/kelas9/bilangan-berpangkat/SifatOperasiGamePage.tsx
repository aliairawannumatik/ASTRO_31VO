import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari 2³ × 2⁴?",
    options: ["2⁷", "2¹²", "4⁷", "2⁶"],
    correctIndex: 0,
  },
  {
    question: "Berapakah hasil dari 5⁶ ÷ 5²?",
    options: ["5³", "5⁸", "5⁴", "1⁴"],
    correctIndex: 2,
  },
  {
    question: "Berapakah nilai dari (3²)³?",
    options: ["3⁵", "3⁶", "9³", "3⁸"],
    correctIndex: 1,
  },
  {
    question: "Berapakah nilai dari (2 × 5)³?",
    options: ["2³ + 5³", "2³ × 5³", "10 × 3", "6³"],
    correctIndex: 1,
  },
  {
    question: "Berapakah hasil dari (4/2)²?",
    options: ["4", "2", "8", "6"],
    correctIndex: 0,
  },
];

const SifatOperasiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT"
    backPath="/math-game-arena/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Bilangan Berpangkat"
  />
);

export default SifatOperasiGamePage;
