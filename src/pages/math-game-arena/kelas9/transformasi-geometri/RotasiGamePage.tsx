import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Titik A(3, 2) diputar 90° berlawanan arah jarum jam terhadap titik asal. Bayangannya adalah ...",
    options: ["(-2, 3)", "(2, -3)", "(-3, -2)", "(3, -2)"],
    correctIndex: 0,
  },
  {
    question: "Titik B(4, 1) diputar 180° terhadap titik asal. Bayangannya adalah ...",
    options: ["(1, 4)", "(-4, -1)", "(4, -1)", "(-1, 4)"],
    correctIndex: 1,
  },
  {
    question: "Titik C(2, 5) diputar 90° searah jarum jam terhadap titik asal. Bayangannya adalah ...",
    options: ["(-5, 2)", "(5, -2)", "(-2, -5)", "(5, 2)"],
    correctIndex: 1,
  },
  {
    question: "Rotasi 360° terhadap titik mana pun menghasilkan ...",
    options: [
      "Bayangan yang berputar balik",
      "Bayangan yang sama dengan titik asal",
      "Bayangan yang dicerminkan",
      "Bayangan yang diperbesar",
    ],
    correctIndex: 1,
  },
  {
    question: "Pusat rotasi adalah titik yang ...",
    options: [
      "Bergerak sejauh jarak rotasi",
      "Tidak berpindah saat rotasi",
      "Selalu berada di titik asal",
      "Berpindah ke bayangan bangun",
    ],
    correctIndex: 1,
  },
];

const RotasiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="ROTASI (PERPUTARAN)"
    backPath="/math-game-arena/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Transformasi Geometri"
  />
);

export default RotasiGamePage;
