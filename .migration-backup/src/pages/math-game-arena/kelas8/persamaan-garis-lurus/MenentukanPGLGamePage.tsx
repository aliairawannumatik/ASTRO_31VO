import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Persamaan garis dengan gradien 2 dan melalui titik (0, 3) adalah ...",
    options: ["y = 2x - 3", "y = 3x + 2", "y = 2x + 3", "y = -2x + 3"],
    correctIndex: 2,
  },
  {
    question: "Persamaan garis melalui titik (1, 4) dengan gradien 3 adalah ...",
    options: ["y = 3x + 1", "y = 3x - 1", "y = 3x + 4", "y = x + 3"],
    correctIndex: 0,
  },
  {
    question: "Persamaan garis melalui titik (0, 0) dan (2, 4) adalah ...",
    options: ["y = x", "y = 2x", "y = 4x", "y = x + 2"],
    correctIndex: 1,
  },
  {
    question: "Persamaan garis dengan gradien -1 dan melalui titik (0, 5) adalah ...",
    options: ["y = -x + 5", "y = x - 5", "y = -x - 5", "y = x + 5"],
    correctIndex: 0,
  },
  {
    question: "Garis sejajar sumbu X yang melalui titik (3, 4) persamaannya adalah ...",
    options: ["x = 3", "y = 3", "x = 4", "y = 4"],
    correctIndex: 3,
  },
];

const MenentukanPGLGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENENTUKAN PERSAMAAN GARIS LURUS"
    backPath="/math-game-arena/kelas-8/persamaan-garis-lurus"
    backLabel="Kembali ke Persamaan Garis Lurus"
  />
);

export default MenentukanPGLGamePage;
