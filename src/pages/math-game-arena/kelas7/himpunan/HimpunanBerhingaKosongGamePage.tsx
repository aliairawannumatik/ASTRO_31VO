import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Himpunan yang tidak memiliki anggota disebut ...",
    options: ["Himpunan berhingga", "Himpunan tak hingga", "Himpunan kosong", "Himpunan semesta"],
    correctIndex: 2,
  },
  {
    question: "Lambang himpunan kosong adalah ...",
    options: ["{0}", "∅ atau {}", "{∞}", "{φ}"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan himpunan kosong?",
    options: ["{0}", "{bilangan prima genap > 2}", "{}", "A dan C benar"],
    correctIndex: 3,
  },
  {
    question: "Himpunan P = {x | x bilangan asli, x < 1}. Himpunan P adalah ...",
    options: ["Himpunan berhingga", "Himpunan kosong", "Himpunan tak hingga", "Himpunan semesta"],
    correctIndex: 1,
  },
  {
    question: "Himpunan Q = {1, 2, 3, ...} termasuk himpunan ...",
    options: ["Berhingga", "Kosong", "Tak hingga", "Bagian"],
    correctIndex: 2,
  },
];

const HimpunanBerhingaKosongGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="HIMPUNAN BERHINGGA, KOSONG DAN TAK HINGGA"
    backPath="/math-game-arena/kelas-7/himpunan"
    backLabel="Kembali ke Himpunan"
  />
);

export default HimpunanBerhingaKosongGamePage;
