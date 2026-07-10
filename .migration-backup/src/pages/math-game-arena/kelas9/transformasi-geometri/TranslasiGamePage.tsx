import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Titik A(2, 3) ditranslasikan oleh T(4, -1). Koordinat bayangan A adalah ...",
    options: ["(6, 2)", "(6, 4)", "(-2, 4)", "(2, -3)"],
    correctIndex: 0,
  },
  {
    question: "Titik B(-3, 5) ditranslasikan oleh T(-2, 3). Koordinat bayangan B adalah ...",
    options: ["(-1, 2)", "(-5, 8)", "(1, 8)", "(-1, 8)"],
    correctIndex: 1,
  },
  {
    question: "Translasi memiliki sifat ...",
    options: [
      "Mengubah ukuran bangun",
      "Mengubah orientasi bangun",
      "Mempertahankan bentuk dan ukuran bangun",
      "Memutarkan bangun",
    ],
    correctIndex: 2,
  },
  {
    question: "Titik P(5, -2) setelah translasi menjadi P'(1, 3). Vektor translasinya adalah ...",
    options: ["(4, 5)", "(-4, 5)", "(6, -5)", "(-4, -5)"],
    correctIndex: 1,
  },
  {
    question: "Segitiga dengan titik-titik (0,0), (3,0), (0,4) ditranslasikan oleh (2,1). Titik bayangan (3,0) adalah ...",
    options: ["(5, 0)", "(5, 1)", "(3, 1)", "(1, -1)"],
    correctIndex: 1,
  },
];

const TranslasiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="TRANSLASI (PERGESERAN)"
    backPath="/math-game-arena/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Transformasi Geometri"
  />
);

export default TranslasiGamePage;
