import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Pada bentuk aljabar 3x² + 5x - 7, yang merupakan koefisien dari x adalah ...",
    options: ["3", "5", "-7", "2"],
    correctIndex: 1,
  },
  {
    question: "Pada bentuk aljabar 4a + 2b - 9, yang merupakan konstanta adalah ...",
    options: ["4", "2", "-9", "a"],
    correctIndex: 2,
  },
  {
    question: "Berapa banyak suku pada bentuk aljabar 2x² - 3x + 4y - 1?",
    options: ["2 suku", "3 suku", "4 suku", "5 suku"],
    correctIndex: 2,
  },
  {
    question: "Pada bentuk aljabar 6p³ - 2p + 8, koefisien dari p³ adalah ...",
    options: ["-2", "6", "8", "3"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan suku-suku sejenis dari 3x + 2y - 5x + y?",
    options: ["3x dan 2y", "3x dan -5x", "2y dan -5x", "3x dan y"],
    correctIndex: 1,
  },
];

const PengertianUnsurGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR"
    backPath="/math-game-arena/kelas-7/aljabar"
    backLabel="Kembali ke Aljabar"
  />
);

export default PengertianUnsurGamePage;
