import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Persamaan garis lurus berbentuk y = mx + c. Huruf 'm' menyatakan ...",
    options: ["Titik potong sumbu Y", "Titik potong sumbu X", "Gradien (kemiringan)", "Konstanta"],
    correctIndex: 2,
  },
  {
    question: "Garis y = 3x + 2 memotong sumbu Y di titik ...",
    options: ["(0, 3)", "(2, 0)", "(0, 2)", "(3, 0)"],
    correctIndex: 2,
  },
  {
    question: "Garis y = 2x - 4 memotong sumbu X di titik ...",
    options: ["(0, -4)", "(2, 0)", "(4, 0)", "(-4, 0)"],
    correctIndex: 1,
  },
  {
    question: "Titik (1, 5) terletak pada garis y = 2x + 3 karena ...",
    options: ["5 = 2(1) + 3 = 5 ✓", "5 = 2(3) + 1", "5 ≠ 2(1) + 3", "1 = 2(5) + 3"],
    correctIndex: 0,
  },
  {
    question: "Garis y = -x + 4 memotong sumbu X di titik ...",
    options: ["(0, 4)", "(4, 0)", "(-4, 0)", "(0, -4)"],
    correctIndex: 1,
  },
];

const GrafikPGLGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="GRAFIK PERSAMAAN GARIS LURUS"
    backPath="/math-game-arena/kelas-8/persamaan-garis-lurus"
    backLabel="Kembali ke Persamaan Garis Lurus"
  />
);

export default GrafikPGLGamePage;
