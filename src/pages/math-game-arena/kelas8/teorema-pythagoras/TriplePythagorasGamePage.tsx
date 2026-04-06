import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Triple Pythagoras adalah tiga bilangan bulat yang memenuhi a² + b² = c². Manakah yang merupakan triple Pythagoras?",
    options: ["3, 4, 6", "5, 12, 13", "6, 7, 8", "4, 6, 8"],
    correctIndex: 1,
  },
  {
    question: "Triple Pythagoras yang paling sederhana adalah ...",
    options: ["2, 3, 4", "3, 4, 5", "4, 5, 6", "5, 6, 7"],
    correctIndex: 1,
  },
  {
    question: "Kelipatan dari triple Pythagoras 3, 4, 5 yaitu 6, 8, 10 apakah juga triple Pythagoras?",
    options: ["Ya, karena 6² + 8² = 10²", "Tidak, karena bukan bilangan prima", "Ya, tapi hanya kebetulan", "Tidak, hanya 3,4,5 yang berlaku"],
    correctIndex: 0,
  },
  {
    question: "Pada triple Pythagoras 8, 15, 17, berlaku ...",
    options: ["8 + 15 = 17", "8² + 15² = 17²", "8 × 15 = 17²", "8² - 15² = 17²"],
    correctIndex: 1,
  },
  {
    question: "Apakah 9, 12, 15 merupakan triple Pythagoras?",
    options: ["Ya, karena 9² + 12² = 15²", "Tidak, karena bukan kelipatan 3,4,5", "Ya, karena semua ganjil", "Tidak, karena 9+12 ≠ 15"],
    correctIndex: 0,
  },
];

const TriplePythagorasGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="TRIPLE PYTHAGORAS"
    backPath="/math-game-arena/kelas-8/teorema-pythagoras"
    backLabel="Kembali ke Teorema Pythagoras"
  />
);

export default TriplePythagorasGamePage;
