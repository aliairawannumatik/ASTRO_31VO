import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Garis yang menghubungkan titik sudut segitiga dengan titik tengah sisi yang berhadapan disebut ...",
    options: ["Garis bagi", "Garis tinggi", "Garis berat", "Garis sumbu"],
    correctIndex: 2,
  },
  {
    question: "Garis yang membagi suatu sudut segitiga menjadi dua bagian yang sama besar disebut ...",
    options: ["Garis berat", "Garis bagi", "Garis tinggi", "Garis tengah"],
    correctIndex: 1,
  },
  {
    question: "Garis yang tegak lurus dari titik sudut ke sisi yang berhadapan (atau perpanjangannya) disebut ...",
    options: ["Garis berat", "Garis bagi", "Garis tinggi", "Garis sumbu"],
    correctIndex: 2,
  },
  {
    question: "Titik potong ketiga garis berat suatu segitiga disebut ...",
    options: ["Inkenter", "Sirkumenter", "Sentroid", "Ortosentrum"],
    correctIndex: 2,
  },
  {
    question: "Titik potong ketiga garis bagi suatu segitiga disebut ...",
    options: ["Inkenter", "Sirkumenter", "Sentroid", "Ortosentrum"],
    correctIndex: 0,
  },
];

const GarisBeratBagiTinggiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="GARIS BERAT, BAGI DAN TINGGI SEGITIGA"
    backPath="/math-game-arena/kelas-7/segitiga-dan-segiempat"
    backLabel="Kembali ke Segitiga & Segiempat"
  />
);

export default GarisBeratBagiTinggiGamePage;
