import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah hasil dari −20 : (−4) = ...",
    options: ["−80", "−5", "4", "5"],
    correctIndex: 3,
  },
  {
    question: "Tentukan hasil dari 15 : 0 = ...",
    options: ["15", "0", "Tidak terdefinisi", "1"],
    correctIndex: 2,
  },
  {
    question: "Hitunglah hasil dari [(−12) : 3] : (−2) = ...",
    options: ["−2", "−8", "2", "8"],
    correctIndex: 2,
  },
  {
    question: "Tentukan hasil dari [0 × (−5)] : [10 + (−8)] = ...",
    options: ["0", "−5", "2", "Tidak terdefinisi"],
    correctIndex: 0,
  },
  {
    question: "Ada 25 orang siswa yang akan pergi berkemah. Jika satu tenda maksimal diisi oleh 6 orang, berapa minimal tenda yang harus disewa?",
    options: ["5", "3", "4", "6"],
    correctIndex: 0,
  },
];

const PembagianGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMBAGIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat"
    backLabel="Kembali ke Bilangan Bulat"
  />
);

export default PembagianGamePage;
