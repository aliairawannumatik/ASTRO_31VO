import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Manakah yang merupakan kalimat tertutup (pernyataan)?",
    options: ["x + 5 = 10", "2 + 3 = 5", "y - 7 = 0", "a × 2 = 6"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan kalimat terbuka?",
    options: ["Segitiga memiliki 3 sisi", "5 + 3 = 8", "n + 4 = 9", "Jakarta adalah ibukota Indonesia"],
    correctIndex: 2,
  },
  {
    question: "Kalimat 'x > 5' termasuk jenis kalimat ...",
    options: ["Pernyataan benar", "Pernyataan salah", "Kalimat terbuka", "Kalimat tertutup"],
    correctIndex: 2,
  },
  {
    question: "Pengganti variabel yang membuat '2x - 1 = 5' menjadi pernyataan benar adalah ...",
    options: ["x = 2", "x = 3", "x = 4", "x = 5"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan pernyataan bernilai benar?",
    options: ["3 + 4 = 8", "5 × 2 = 9", "4² = 16", "7 - 3 = 5"],
    correctIndex: 2,
  },
];

const KalimatTerbukaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KALIMAT TERBUKA DAN TERTUTUP"
    backPath="/math-game-arena/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke PLSV"
  />
);

export default KalimatTerbukaGamePage;
