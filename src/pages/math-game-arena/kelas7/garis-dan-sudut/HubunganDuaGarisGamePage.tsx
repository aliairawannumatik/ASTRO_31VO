import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Dua garis yang tidak pernah berpotongan dan memiliki jarak tetap disebut ...",
    options: ["Garis berpotongan", "Garis sejajar", "Garis bersilang", "Garis berimpit"],
    correctIndex: 1,
  },
  {
    question: "Dua garis yang terletak pada bidang yang berbeda dan tidak berpotongan disebut ...",
    options: ["Garis sejajar", "Garis berimpit", "Garis bersilang", "Garis tegak lurus"],
    correctIndex: 2,
  },
  {
    question: "Dua garis berpotongan membentuk sudut siku-siku. Kedua garis tersebut disebut ...",
    options: ["Garis sejajar", "Garis berimpit", "Garis tegak lurus", "Garis bersilang"],
    correctIndex: 2,
  },
  {
    question: "Simbol yang digunakan untuk menyatakan dua garis sejajar adalah ...",
    options: ["⊥", "∥", "≅", "∠"],
    correctIndex: 1,
  },
  {
    question: "Jika garis k // garis l dan garis m memotong garis k dan l, maka garis m disebut ...",
    options: ["Garis sejajar", "Garis transversal", "Garis berimpit", "Garis normal"],
    correctIndex: 1,
  },
];

const HubunganDuaGarisGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="HUBUNGAN DUA GARIS"
    backPath="/math-game-arena/kelas-7/garis-dan-sudut"
    backLabel="Kembali ke Garis & Sudut"
  />
);

export default HubunganDuaGarisGamePage;
