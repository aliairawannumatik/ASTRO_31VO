import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Sebuah koin dilempar 100 kali dan muncul gambar 40 kali. Frekuensi relatif munculnya gambar adalah ...",
    options: ["0,5", "0,4", "0,6", "40"],
    correctIndex: 1,
  },
  {
    question: "Peluang empirik diperoleh berdasarkan ...",
    options: [
      "Perhitungan teori probabilitas",
      "Hasil percobaan nyata yang dilakukan",
      "Jumlah kemungkinan kejadian",
      "Rumus matematika murni",
    ],
    correctIndex: 1,
  },
  {
    question: "Dadu dilempar 60 kali, muncul angka 3 sebanyak 12 kali. Frekuensi relatifnya adalah ...",
    options: ["1/5", "1/6", "1/4", "1/3"],
    correctIndex: 0,
  },
  {
    question: "Semakin banyak percobaan dilakukan, peluang empirik akan mendekati ...",
    options: [
      "Peluang teoretik",
      "Angka 0",
      "Angka 1",
      "Jumlah percobaan",
    ],
    correctIndex: 0,
  },
  {
    question: "Frekuensi relatif = ...",
    options: [
      "Frekuensi kejadian × jumlah percobaan",
      "Frekuensi kejadian ÷ jumlah percobaan",
      "Jumlah percobaan ÷ frekuensi kejadian",
      "Frekuensi kejadian + jumlah percobaan",
    ],
    correctIndex: 1,
  },
];

const PeluangEmpirikGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PELUANG EMPIRIK DAN FREKUENSI RELATIF"
    backPath="/math-game-arena/kelas-9/peluang"
    backLabel="Kembali ke Peluang"
  />
);

export default PeluangEmpirikGamePage;
