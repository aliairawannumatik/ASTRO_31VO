import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Titik potong grafik y = x² - 4 dengan sumbu-x (y = 0) adalah ...",
    options: ["x = 2 dan x = -2", "x = 4 dan x = -4", "x = 0 dan x = 4", "x = 2 saja"],
    correctIndex: 0,
  },
  {
    question: "Titik potong grafik y = x² + 3x + 2 dengan sumbu-y (x = 0) adalah ...",
    options: ["(0, 1)", "(0, 2)", "(0, 3)", "(0, 0)"],
    correctIndex: 1,
  },
  {
    question: "Untuk mencari titik potong dengan sumbu-x, kita substitusikan ...",
    options: ["x = 0", "y = 0", "x = 1", "y = 1"],
    correctIndex: 1,
  },
  {
    question: "Titik potong grafik y = 2x² - 8 dengan sumbu-x adalah ...",
    options: ["(2, 0) dan (-2, 0)", "(4, 0) dan (-4, 0)", "(2, 0) saja", "(8, 0)"],
    correctIndex: 0,
  },
  {
    question: "Grafik y = x² + 4 tidak memotong sumbu-x karena ...",
    options: [
      "Koefisien x² = 0",
      "Nilai diskriminan < 0",
      "Nilai c = 4",
      "Grafik membuka ke bawah",
    ],
    correctIndex: 1,
  },
];

const TitikPotongGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="TITIK POTONG TERHADAP SUMBU-SUMBU"
    backPath="/math-game-arena/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Fungsi Kuadrat"
  />
);

export default TitikPotongGamePage;
