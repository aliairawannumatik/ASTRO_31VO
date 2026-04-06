import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Manakah di antara bilangan berikut yang merupakan kelipatan persekutuan dari 4 dan 6 yang nilainya kurang dari 30?",
    options: ["24 dan 36", "8 dan 16", "12 dan 24", "12 dan 18"],
    correctIndex: 2,
  },
  {
    question: "Faktor persekutuan dari bilangan 18 dan 24 adalah ...",
    options: ["2, 3, 6, 8", "1, 2, 6, 9", "1, 2, 3, 6", "1, 2, 3, 4"],
    correctIndex: 2,
  },
  {
    question: "Berapakah nilai KPK dan FPB dari pasangan bilangan 36 dan 48?",
    options: [
      "KPK = 72; FPB = 6",
      "KPK = 108; FPB = 12",
      "KPK = 144; FPB = 6",
      "KPK = 144; FPB = 12",
    ],
    correctIndex: 3,
  },
  {
    question: "Lampu A menyala setiap 15 menit dan lampu B setiap 20 menit. Jika keduanya menyala bersamaan pukul 08.00, kapan keduanya menyala bersamaan kembali?",
    options: ["Pukul 09.00", "Pukul 09.20", "Pukul 10.00", "Pukul 08.35"],
    correctIndex: 0,
  },
  {
    question: "Ibu memiliki 30 buah jeruk dan 45 buah apel. Ibu ingin membagikannya ke kantong plastik dengan jumlah sama untuk setiap jenisnya. Berapa jumlah plastik paling banyak yang dibutuhkan Ibu?",
    options: ["30 kantong", "10 kantong", "15 kantong", "5 kantong"],
    correctIndex: 2,
  },
];

const KPKFPBGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KPK DAN FPB"
    backPath="/math-game-arena/kelas-7/bilangan-bulat"
    backLabel="Kembali ke Bilangan Bulat"
  />
);

export default KPKFPBGamePage;
