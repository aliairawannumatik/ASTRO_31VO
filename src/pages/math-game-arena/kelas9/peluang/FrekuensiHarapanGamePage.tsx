import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Sebuah dadu dilempar 120 kali. Frekuensi harapan muncul angka 6 adalah ...",
    options: ["10", "20", "30", "60"],
    correctIndex: 1,
  },
  {
    question: "Rumus frekuensi harapan adalah ...",
    options: [
      "fh = P(A) + n",
      "fh = P(A) × n",
      "fh = P(A) ÷ n",
      "fh = n ÷ P(A)",
    ],
    correctIndex: 1,
  },
  {
    question: "Peluang hujan pada suatu hari adalah 0,3. Dari 200 hari, frekuensi harapan hari hujan adalah ...",
    options: ["30", "60", "90", "120"],
    correctIndex: 1,
  },
  {
    question: "Sebuah koin dilempar 80 kali. Frekuensi harapan muncul angka adalah ...",
    options: ["20", "40", "60", "80"],
    correctIndex: 1,
  },
  {
    question: "Frekuensi harapan menunjukkan ...",
    options: [
      "Hasil percobaan yang pasti terjadi",
      "Perkiraan banyaknya suatu kejadian akan muncul dalam n percobaan",
      "Peluang kejadian terjadi",
      "Banyak percobaan yang harus dilakukan",
    ],
    correctIndex: 1,
  },
];

const FrekuensiHarapanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="FREKUENSI HARAPAN"
    backPath="/math-game-arena/kelas-9/peluang"
    backLabel="Kembali ke Peluang"
  />
);

export default FrekuensiHarapanGamePage;
