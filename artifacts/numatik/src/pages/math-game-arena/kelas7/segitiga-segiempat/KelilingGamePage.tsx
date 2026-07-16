import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Keliling segitiga dengan sisi 5 cm, 7 cm, dan 8 cm adalah ...",
    options: ["18 cm", "20 cm", "22 cm", "25 cm"],
    correctIndex: 1,
  },
  {
    question: "Keliling persegi dengan sisi 9 cm adalah ...",
    options: ["27 cm", "36 cm", "45 cm", "81 cm"],
    correctIndex: 1,
  },
  {
    question: "Keliling persegi panjang dengan panjang 12 cm dan lebar 8 cm adalah ...",
    options: ["38 cm", "40 cm", "44 cm", "96 cm"],
    correctIndex: 1,
  },
  {
    question: "Keliling belah ketupat dengan sisi 7 cm adalah ...",
    options: ["21 cm", "28 cm", "35 cm", "49 cm"],
    correctIndex: 1,
  },
  {
    question: "Sebuah segitiga sama sisi memiliki keliling 36 cm. Panjang sisi segitiga tersebut adalah ...",
    options: ["9 cm", "12 cm", "15 cm", "18 cm"],
    correctIndex: 1,
  },
];

const KelilingGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KELILING SEGITIGA DAN SEGIEMPAT"
    backPath="/math-game-arena/kelas-7/segitiga-dan-segiempat"
    backLabel="Kembali ke Segitiga & Segiempat"
  />
);

export default KelilingGamePage;
