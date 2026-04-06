import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Luas segitiga dengan alas 10 cm dan tinggi 8 cm adalah ...",
    options: ["30 cm²", "40 cm²", "50 cm²", "80 cm²"],
    correctIndex: 1,
  },
  {
    question: "Sebuah segitiga memiliki luas 60 cm² dan alasnya 12 cm. Tinggi segitiga tersebut adalah ...",
    options: ["8 cm", "10 cm", "12 cm", "15 cm"],
    correctIndex: 1,
  },
  {
    question: "Luas segitiga sama sisi dengan sisi 6 cm adalah ...",
    options: ["9√3 cm²", "18 cm²", "12√3 cm²", "36 cm²"],
    correctIndex: 0,
  },
  {
    question: "Segitiga siku-siku memiliki dua sisi tegak 9 cm dan 12 cm. Luasnya adalah ...",
    options: ["54 cm²", "108 cm²", "27 cm²", "48 cm²"],
    correctIndex: 0,
  },
  {
    question: "Sebuah taman berbentuk segitiga memiliki alas 20 m dan tinggi 15 m. Luas taman tersebut adalah ...",
    options: ["100 m²", "150 m²", "200 m²", "300 m²"],
    correctIndex: 1,
  },
];

const LuasSegitigaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="LUAS SEGITIGA"
    backPath="/math-game-arena/kelas-7/segitiga-dan-segiempat"
    backLabel="Kembali ke Segitiga & Segiempat"
  />
);

export default LuasSegitigaGamePage;
