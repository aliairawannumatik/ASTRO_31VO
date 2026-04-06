import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari operasi hitung berikut? 12 + 120 : 10 × (−5) = ...",
    options: ["72", "−48", "12", "−66"],
    correctIndex: 1,
  },
  {
    question: "Kompetisi 50 soal: benar +4, salah −2, kosong −1. Budi menjawab 44 soal dan benar 36 soal. Berapakah skor total Budi?",
    options: ["128", "144", "122", "118"],
    correctIndex: 2,
  },
  {
    question: "Suhu: Wina −7°C, Seoul −10°C, Baghdad 39°C, Surabaya 33°C. Manakah pernyataan selisih suhu yang benar?",
    options: [
      "Selisih Surabaya dan Wina adalah 39°C",
      "Selisih Baghdad dan Wina adalah 32°C",
      "Selisih Wina dan Seoul adalah −6°C",
      "Selisih Surabaya dan Seoul adalah 43°C",
    ],
    correctIndex: 3,
  },
  {
    question: "Suhu awal di Moskow adalah 11°C. Suhu turun 4°C setiap 15 menit. Berapakah suhu di sana setelah 1 jam?",
    options: ["−11°C", "−4°C", "−5°C", "7°C"],
    correctIndex: 2,
  },
  {
    question: "Berapakah hasil dari (30 − 45) : 3 × 6 = ...",
    options: ["−90", "15", "30", "−30"],
    correctIndex: 3,
  },
];

const OperasiCampuranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat"
    backLabel="Kembali ke Bilangan Bulat"
  />
);

export default OperasiCampuranGamePage;
