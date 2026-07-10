import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Titik A(3, 5) dicerminkan terhadap sumbu-x. Bayangan A adalah ...",
    options: ["(-3, 5)", "(3, -5)", "(-3, -5)", "(5, 3)"],
    correctIndex: 1,
  },
  {
    question: "Titik B(-2, 4) dicerminkan terhadap sumbu-y. Bayangan B adalah ...",
    options: ["(-2, -4)", "(2, -4)", "(2, 4)", "(-4, 2)"],
    correctIndex: 2,
  },
  {
    question: "Titik C(4, 3) dicerminkan terhadap garis y = x. Bayangan C adalah ...",
    options: ["(4, 3)", "(3, 4)", "(-4, -3)", "(-3, -4)"],
    correctIndex: 1,
  },
  {
    question: "Titik D(5, -2) dicerminkan terhadap titik asal (0,0). Bayangan D adalah ...",
    options: ["(5, 2)", "(-5, 2)", "(-5, -2)", "(2, -5)"],
    correctIndex: 1,
  },
  {
    question: "Pencerminan mempertahankan ...",
    options: [
      "Posisi bangun",
      "Orientasi bangun",
      "Bentuk dan ukuran bangun",
      "Koordinat bangun",
    ],
    correctIndex: 2,
  },
];

const RefleksiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="REFLEKSI (PENCERMINAN)"
    backPath="/math-game-arena/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Transformasi Geometri"
  />
);

export default RefleksiGamePage;
