import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Jika P(A) = 0,3, maka P(A') (komplemen A) adalah ...",
    options: ["0,3", "0,7", "1,3", "0"],
    correctIndex: 1,
  },
  {
    question: "Rumus komplemen suatu kejadian adalah ...",
    options: [
      "P(A') = P(A)",
      "P(A') = P(A) - 1",
      "P(A') = 1 - P(A)",
      "P(A') = 1 + P(A)",
    ],
    correctIndex: 2,
  },
  {
    question: "Peluang siswa tidak lulus ujian = 0,15. Peluang siswa lulus ujian adalah ...",
    options: ["0,15", "0,85", "0,5", "0,75"],
    correctIndex: 1,
  },
  {
    question: "P(A) + P(A') selalu sama dengan ...",
    options: ["0", "0,5", "1", "2"],
    correctIndex: 2,
  },
  {
    question: "Komplemen kejadian A adalah ...",
    options: [
      "Kejadian A itu sendiri",
      "Semua kejadian yang termasuk A",
      "Kejadian yang tidak termasuk A",
      "Kejadian dengan peluang 0",
    ],
    correctIndex: 2,
  },
];

const KomplemenGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KOMPLEMEN SUATU KEJADIAN"
    backPath="/math-game-arena/kelas-9/peluang"
    backLabel="Kembali ke Peluang"
  />
);

export default KomplemenGamePage;
