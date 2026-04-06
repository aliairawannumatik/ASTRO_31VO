import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Pecahan 3/4 dapat dibaca sebagai ...",
    options: ["Tiga per empat", "Empat per tiga", "Tiga banding empat", "Empat banding tiga"],
    correctIndex: 0,
  },
  {
    question: "Pecahan yang senilai dengan 2/3 adalah ...",
    options: ["3/4", "4/6", "3/5", "5/6"],
    correctIndex: 1,
  },
  {
    question: "Manakah pecahan yang paling besar?",
    options: ["2/5", "3/7", "1/2", "4/9"],
    correctIndex: 2,
  },
  {
    question: "Pecahan senilai dengan 6/8 adalah ...",
    options: ["2/3", "3/4", "4/5", "5/6"],
    correctIndex: 1,
  },
  {
    question: "Urutkan pecahan berikut dari terkecil: 1/2, 2/5, 3/8, 3/4",
    options: ["3/8, 2/5, 1/2, 3/4", "2/5, 3/8, 1/2, 3/4", "3/4, 1/2, 2/5, 3/8", "1/2, 2/5, 3/4, 3/8"],
    correctIndex: 0,
  },
];

const ArtiPecahanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="ARTI PECAHAN, PECAHAN SENILAI & MEMBANDINGKAN PECAHAN"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default ArtiPecahanGamePage;
