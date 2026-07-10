import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Melengkapi kuadrat sempurna pada x² + 6x adalah dengan menambahkan ...",
    options: ["3", "6", "9", "12"],
    correctIndex: 2,
  },
  {
    question: "x² + 8x + ? = (x + 4)². Nilai ? adalah ...",
    options: ["4", "8", "16", "64"],
    correctIndex: 2,
  },
  {
    question: "Selesaikan x² + 4x - 12 = 0 dengan melengkapi kuadrat. Akarnya adalah ...",
    options: ["x = 2 dan x = -6", "x = -2 dan x = 6", "x = 4 dan x = -3", "x = -4 dan x = 3"],
    correctIndex: 0,
  },
  {
    question: "x² - 10x + ? = (x - 5)². Nilai ? adalah ...",
    options: ["5", "10", "25", "100"],
    correctIndex: 2,
  },
  {
    question: "Nilai yang perlu ditambahkan untuk melengkapi x² + bx menjadi kuadrat sempurna adalah ...",
    options: ["b/2", "(b/2)²", "b²", "2b"],
    correctIndex: 1,
  },
];

const PelengkapKuadratGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT"
    backPath="/math-game-arena/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Persamaan Kuadrat"
  />
);

export default PelengkapKuadratGamePage;
