import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

  const questions: QuizQuestion[] = [
    {
      question: "Hasil dari 6 × 4 adalah ...",
      options: ["10", "24", "20", "−24"],
      correctIndex: 1,
    },
    {
      question: "Hasil dari (−3) × 5 adalah ...",
      options: ["15", "−15", "8", "−8"],
      correctIndex: 1,
    },
    {
      question: "Hasil dari (−4) × (−6) adalah ...",
      options: ["−24", "24", "−10", "10"],
      correctIndex: 1,
    },
    {
      question: "Hasil dari 7 × 0 adalah ...",
      options: ["7", "1", "0", "−7"],
      correctIndex: 2,
    },
    {
      question: "Hasil dari 2 × (−9) adalah ...",
      options: ["−18", "18", "−7", "7"],
      correctIndex: 0,
    },
    {
      question: "Sebuah lift turun 3 lantai sebanyak 4 kali. Total perpindahan adalah ...",
      options: ["+12 lantai", "−12 lantai", "−7 lantai", "+7 lantai"],
      correctIndex: 1,
    },
  ];

  const PerkalianMeteorGamePage = () => (
    <MeteorShootingGame
      questions={questions}
      topicLabel="PERKALIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
      backLabel="Kembali ke Pilihan Game"
      homePath="/menu"
    />
  );

  export default PerkalianMeteorGamePage;
  