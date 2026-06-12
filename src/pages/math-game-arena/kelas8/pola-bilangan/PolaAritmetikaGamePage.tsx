import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Barisan aritmetika adalah barisan yang selisih antara dua suku berurutan selalu ...",
    options: ["Berubah-ubah", "Sama (tetap)", "Bertambah", "Berkurang"],
    correctIndex: 1,
  },
  {
    question: "Pada barisan 5, 8, 11, 14, ... beda (b) adalah ...",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
  },
  {
    question: "Suku ke-10 dari barisan aritmetika 2, 5, 8, 11, ... adalah ...",
    options: ["27", "29", "30", "32"],
    correctIndex: 1,
  },
  {
    question: "Rumus suku ke-n dari barisan aritmetika adalah ...",
    options: ["Un = a + (n+1)b", "Un = a + (n-1)b", "Un = a × b^n", "Un = a + nb"],
    correctIndex: 1,
  },
  {
    question: "Suku pertama barisan aritmetika adalah 3 dan bedanya 4. Suku ke-7 adalah ...",
    options: ["25", "27", "28", "31"],
    correctIndex: 1,
  },
];

const PolaAritmetikaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BARISAN DAN DERET ARITMETIKA"
    backPath="/math-game-arena/kelas-8/pola-bilangan"
    backLabel="Kembali ke Pola Bilangan"
  />
);

export default PolaAritmetikaGamePage;
