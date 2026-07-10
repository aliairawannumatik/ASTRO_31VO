import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Fungsi kuadrat yang memiliki titik puncak (2, -3) dan membuka ke atas dengan a = 1 adalah ...",
    options: [
      "f(x) = (x-2)² - 3",
      "f(x) = (x+2)² - 3",
      "f(x) = (x-2)² + 3",
      "f(x) = -(x-2)² - 3",
    ],
    correctIndex: 0,
  },
  {
    question: "Fungsi kuadrat yang memotong sumbu-x di x = 1 dan x = 3, serta melewati titik (2, -1) adalah ...",
    options: [
      "f(x) = (x-1)(x-3)",
      "f(x) = -(x-1)(x-3)",
      "f(x) = (x+1)(x+3)",
      "f(x) = -(x+1)(x-3)",
    ],
    correctIndex: 1,
  },
  {
    question: "Menyusun fungsi kuadrat dapat dilakukan jika diketahui ...",
    options: [
      "Hanya satu titik pada grafik",
      "Titik puncak saja",
      "Titik puncak dan satu titik lain, atau akar-akarnya",
      "Nilai a saja",
    ],
    correctIndex: 2,
  },
  {
    question: "Grafik melewati (0,0), (1,1), dan (2,4). Fungsi kuadratnya adalah ...",
    options: ["f(x) = x²", "f(x) = x² + x", "f(x) = 2x²", "f(x) = x² - x"],
    correctIndex: 0,
  },
  {
    question: "Fungsi kuadrat dengan akar x = -2 dan x = 4, serta a = 1 adalah ...",
    options: [
      "f(x) = x² - 2x - 8",
      "f(x) = x² + 2x - 8",
      "f(x) = x² - 2x + 8",
      "f(x) = x² + 2x + 8",
    ],
    correctIndex: 0,
  },
];

const MenyusunFungsiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENYUSUN FUNGSI KUADRAT"
    backPath="/math-game-arena/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Fungsi Kuadrat"
  />
);

export default MenyusunFungsiGamePage;
