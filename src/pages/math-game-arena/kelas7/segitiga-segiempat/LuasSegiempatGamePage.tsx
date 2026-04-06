import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Luas persegi dengan sisi 9 cm adalah ...",
    options: ["36 cm²", "72 cm²", "81 cm²", "18 cm²"],
    correctIndex: 2,
  },
  {
    question: "Luas persegi panjang dengan panjang 15 cm dan lebar 8 cm adalah ...",
    options: ["100 cm²", "120 cm²", "90 cm²", "46 cm²"],
    correctIndex: 1,
  },
  {
    question: "Luas trapesium dengan sisi sejajar 8 cm dan 12 cm serta tinggi 6 cm adalah ...",
    options: ["54 cm²", "60 cm²", "72 cm²", "48 cm²"],
    correctIndex: 1,
  },
  {
    question: "Luas belah ketupat dengan diagonal-diagonal 10 cm dan 8 cm adalah ...",
    options: ["30 cm²", "40 cm²", "50 cm²", "80 cm²"],
    correctIndex: 1,
  },
  {
    question: "Sebuah lantai berbentuk persegi panjang berukuran 6 m × 4 m akan dipasangi ubin 30 cm × 30 cm. Berapa banyak ubin yang dibutuhkan?",
    options: ["240 ubin", "266 ubin", "266 ubin", "267 ubin"],
    correctIndex: 0,
  },
];

const LuasSegiempatGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="LUAS SEGIEMPAT"
    backPath="/math-game-arena/kelas-7/segitiga-dan-segiempat"
    backLabel="Kembali ke Segitiga & Segiempat"
  />
);

export default LuasSegiempatGamePage;
