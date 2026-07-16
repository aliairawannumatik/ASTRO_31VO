import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Umur Ani 5 tahun lebih tua dari Budi. Jika umur Ani 17 tahun, model matematikanya adalah ...",
    options: ["x - 5 = 17", "x + 5 = 17", "5x = 17", "x/5 = 17"],
    correctIndex: 1,
  },
  {
    question: "Sebuah persegi panjang memiliki panjang (2x + 3) cm dan lebar 4 cm. Jika kelilingnya 30 cm, maka nilai x adalah ...",
    options: ["3", "4", "5", "6"],
    correctIndex: 0,
  },
  {
    question: "Jumlah dua bilangan berurutan adalah 25. Jika bilangan pertama adalah x, persamaannya adalah ...",
    options: ["x + x = 25", "x + (x+1) = 25", "2x + 1 = 25", "x(x+1) = 25"],
    correctIndex: 1,
  },
  {
    question: "Dua bilangan berurutan berjumlah 25. Bilangan yang lebih kecil adalah ...",
    options: ["10", "11", "12", "13"],
    correctIndex: 2,
  },
  {
    question: "Harga 3 buku adalah Rp 15.000. Model matematika harga 1 buku (x) adalah ...",
    options: ["3 + x = 15.000", "3 - x = 15.000", "3x = 15.000", "x/3 = 15.000"],
    correctIndex: 2,
  },
];

const ModelMatematikaPLSVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MODEL MATEMATIKA DAN PENERAPAN PLSV"
    backPath="/math-game-arena/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke PLSV"
  />
);

export default ModelMatematikaPLSVGamePage;
