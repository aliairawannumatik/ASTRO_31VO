import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Nilai ujian: 60, 70, 80, 90, 100. Rata-ratanya adalah ...",
    options: ["75", "80", "85", "90"],
    correctIndex: 1,
  },
  {
    question: "Rata-rata 5 bilangan adalah 20. Jika satu bilangan lagi ditambahkan dan rata-rata menjadi 22, bilangan tersebut adalah ...",
    options: ["30", "32", "28", "34"],
    correctIndex: 1,
  },
  {
    question: "Kelompok A terdiri dari 10 siswa dengan rata-rata nilai 75. Kelompok B terdiri dari 20 siswa dengan rata-rata 85. Rata-rata gabungannya adalah ...",
    options: ["80", "81,67", "82,5", "83"],
    correctIndex: 1,
  },
  {
    question: "Data: 5, 8, 10, 12, 15. Rata-ratanya adalah ...",
    options: ["9", "10", "11", "12"],
    correctIndex: 1,
  },
  {
    question: "Rumus rata-rata (mean) adalah ...",
    options: [
      "Jumlah data × banyak data",
      "Jumlah data ÷ banyak data",
      "Nilai tengah data",
      "Nilai yang paling sering muncul",
    ],
    correctIndex: 1,
  },
];

const RataRataGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="UKURAN PEMUSATAN DATA (RATA-RATA)"
    backPath="/math-game-arena/kelas-9/statistika"
    backLabel="Kembali ke Statistika"
  />
);

export default RataRataGamePage;
