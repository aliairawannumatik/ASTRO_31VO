import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Dari 40 siswa, 25 menyukai matematika, 20 menyukai IPA, dan 10 menyukai keduanya. Berapa yang tidak menyukai keduanya?",
    options: ["3", "5", "7", "10"],
    correctIndex: 1,
  },
  {
    question: "Dari 30 siswa, 18 suka sepak bola, 15 suka basket, dan 8 suka keduanya. Berapa siswa yang tidak suka keduanya?",
    options: ["3", "5", "7", "9"],
    correctIndex: 1,
  },
  {
    question: "Jika n(A) = 15, n(B) = 12, n(A ∩ B) = 5, maka n(A ∪ B) adalah ...",
    options: ["20", "22", "24", "27"],
    correctIndex: 1,
  },
  {
    question: "Dari 50 orang, 30 suka teh, 25 suka kopi, dan 10 suka keduanya. Berapa yang tidak suka keduanya?",
    options: ["5", "10", "15", "20"],
    correctIndex: 0,
  },
  {
    question: "Rumus untuk mencari n(A ∪ B) adalah ...",
    options: ["n(A) + n(B)", "n(A) × n(B)", "n(A) + n(B) - n(A ∩ B)", "n(A) - n(A ∩ B)"],
    correctIndex: 2,
  },
];

const PemecahanMasalahHimpunanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMECAHAN MASALAH HIMPUNAN"
    backPath="/math-game-arena/kelas-7/himpunan"
    backLabel="Kembali ke Himpunan"
  />
);

export default PemecahanMasalahHimpunanGamePage;
