import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Gradien garis y = 3x + 5 adalah ...",
    options: ["5", "3", "8", "-3"],
    correctIndex: 1,
  },
  {
    question: "Gradien garis yang melalui titik (0, 0) dan (2, 6) adalah ...",
    options: ["2", "3", "6", "12"],
    correctIndex: 1,
  },
  {
    question: "Gradien garis y = -2x + 1 adalah ...",
    options: ["1", "2", "-2", "-1"],
    correctIndex: 2,
  },
  {
    question: "Garis horizontal (mendatar) memiliki gradien ...",
    options: ["1", "Tak terdefinisi", "0", "-1"],
    correctIndex: 2,
  },
  {
    question: "Gradien garis yang melalui titik A(1, 2) dan B(3, 8) adalah ...",
    options: ["2", "3", "4", "6"],
    correctIndex: 1,
  },
];

const GradienGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="GRADIEN (KEMIRINGAN GARIS)"
    backPath="/math-game-arena/kelas-8/persamaan-garis-lurus"
    backLabel="Kembali ke Persamaan Garis Lurus"
  />
);

export default GradienGamePage;
