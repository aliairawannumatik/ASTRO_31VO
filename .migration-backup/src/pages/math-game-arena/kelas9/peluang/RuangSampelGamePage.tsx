import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Sebuah dadu dilempar sekali. Banyak anggota ruang sampelnya adalah ...",
    options: ["2", "4", "6", "12"],
    correctIndex: 2,
  },
  {
    question: "Sebuah koin dilempar sekali. Ruang sampelnya adalah ...",
    options: ["{A}", "{G}", "{A, G}", "{A, G, A}"],
    correctIndex: 2,
  },
  {
    question: "Dua koin dilempar bersamaan. Banyak anggota ruang sampelnya adalah ...",
    options: ["2", "3", "4", "6"],
    correctIndex: 2,
  },
  {
    question: "Ruang sampel adalah ...",
    options: [
      "Hasil dari satu percobaan",
      "Himpunan semua hasil yang mungkin dari suatu percobaan",
      "Kejadian yang paling mungkin terjadi",
      "Satu titik sampel saja",
    ],
    correctIndex: 1,
  },
  {
    question: "Satu koin dan satu dadu dilempar bersamaan. Banyak anggota ruang sampelnya adalah ...",
    options: ["6", "8", "10", "12"],
    correctIndex: 3,
  },
];

const RuangSampelGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="RUANG SAMPEL DAN TITIK SAMPEL"
    backPath="/math-game-arena/kelas-9/peluang"
    backLabel="Kembali ke Peluang"
  />
);

export default RuangSampelGamePage;
