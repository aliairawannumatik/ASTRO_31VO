import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Langkah pertama menggambar grafik fungsi kuadrat y = x² - 2x - 3 adalah mencari ...",
    options: [
      "Nilai y saat x besar",
      "Titik puncak dan sumbu simetri",
      "Garis asimtot",
      "Semua nilai y untuk x negatif",
    ],
    correctIndex: 1,
  },
  {
    question: "Nilai f(0) dari f(x) = x² - 3x + 2 adalah ...",
    options: ["0", "1", "2", "3"],
    correctIndex: 2,
  },
  {
    question: "Titik puncak (vertex) dari f(x) = x² - 6x + 8 adalah ...",
    options: ["(3, -1)", "(-3, -1)", "(3, 1)", "(-3, 1)"],
    correctIndex: 0,
  },
  {
    question: "Grafik y = -x² + 4 memiliki nilai maksimum ...",
    options: ["-4", "0", "4", "2"],
    correctIndex: 2,
  },
  {
    question: "Grafik f(x) = (x-2)² - 1 memotong sumbu-x di ...",
    options: ["x = 1 dan x = 3", "x = 2 dan x = -2", "x = -1 dan x = 3", "x = 1 dan x = -3"],
    correctIndex: 0,
  },
];

const MenggambarGrafikGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENGGAMBAR GRAFIK FUNGSI KUADRAT"
    backPath="/math-game-arena/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Fungsi Kuadrat"
  />
);

export default MenggambarGrafikGamePage;
