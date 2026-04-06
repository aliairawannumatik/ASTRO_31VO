import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Tentukan nilai dari 18 − 42 = ...",
    options: ["−24", "−60", "24", "60"],
    correctIndex: 0,
  },
  {
    question: "Tentukan nilai dari −12 − 24 = ...",
    options: ["−12", "36", "−36", "12"],
    correctIndex: 2,
  },
  {
    question: "Tentukan nilai dari −9 − (−21) = ...",
    options: ["−30", "12", "−12", "30"],
    correctIndex: 1,
  },
  {
    question: "32 + (−16) − (−11) = ...",
    options: ["5", "37", "27", "−5"],
    correctIndex: 2,
  },
  {
    question: "Sebuah logam dipanaskan hingga 1.150°C lalu didinginkan mendadak hingga −25°C. Berapa selisih suhu antara kondisi awal dan setelah didinginkan?",
    options: ["1.125°C", "1.150°C", "1.175°C", "1.200°C"],
    correctIndex: 2,
  },
];

const PenguranganGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat"
    backLabel="Kembali ke Bilangan Bulat"
  />
);

export default PenguranganGamePage;
