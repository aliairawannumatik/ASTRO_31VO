import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Apa yang dimaksud dengan barisan bilangan?",
    options: ["Kumpulan bilangan acak", "Bilangan yang tersusun dengan aturan tertentu", "Bilangan prima saja", "Bilangan genap saja"],
    correctIndex: 1,
  },
  {
    question: "Bilangan berikutnya dari barisan 2, 4, 6, 8, ... adalah ...",
    options: ["9", "10", "11", "12"],
    correctIndex: 1,
  },
  {
    question: "Pola dari barisan 1, 4, 9, 16, ... adalah ...",
    options: ["Bilangan kelipatan 3", "Bilangan ganjil", "Bilangan kuadrat", "Bilangan prima"],
    correctIndex: 2,
  },
  {
    question: "Suku ke-5 dari barisan 3, 6, 9, 12, ... adalah ...",
    options: ["14", "15", "16", "18"],
    correctIndex: 1,
  },
  {
    question: "Barisan 1, 1, 2, 3, 5, 8, ... adalah contoh barisan ...",
    options: ["Aritmetika", "Geometri", "Fibonacci", "Kuadrat"],
    correctIndex: 2,
  },
];

const PengertianPolaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN POLA DAN BARISAN BILANGAN"
    backPath="/math-game-arena/kelas-8/pola-bilangan"
    backLabel="Kembali ke Pola Bilangan"
  />
);

export default PengertianPolaGamePage;
