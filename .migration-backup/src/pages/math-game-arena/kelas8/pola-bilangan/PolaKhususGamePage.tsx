import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Bilangan segitiga adalah bilangan yang dapat disusun membentuk segitiga. Bilangan segitiga ke-4 adalah ...",
    options: ["6", "8", "10", "12"],
    correctIndex: 2,
  },
  {
    question: "Pola bilangan persegi: 1, 4, 9, 16, ... Bilangan berikutnya adalah ...",
    options: ["20", "24", "25", "30"],
    correctIndex: 2,
  },
  {
    question: "Bilangan segitiga pertama adalah 1, 3, 6, 10, ... Suku ke-5 adalah ...",
    options: ["12", "13", "15", "18"],
    correctIndex: 2,
  },
  {
    question: "Pola bilangan persegi panjang: 2, 6, 12, 20, ... Suku berikutnya adalah ...",
    options: ["24", "28", "30", "32"],
    correctIndex: 2,
  },
  {
    question: "Pola bilangan yang setiap sukunya merupakan hasil kuadrat bilangan asli dimulai dari 1 disebut ...",
    options: ["Bilangan segitiga", "Bilangan persegi", "Bilangan prima", "Bilangan Fibonacci"],
    correctIndex: 1,
  },
];

const PolaKhususGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="POLA-POLA KHUSUS"
    backPath="/math-game-arena/kelas-8/pola-bilangan"
    backLabel="Kembali ke Pola Bilangan"
  />
);

export default PolaKhususGamePage;
