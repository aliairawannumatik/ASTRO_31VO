import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

  const questions: QuizQuestion[] = [
    {
      question: "Hasil dari 5 + 3 × 2 adalah ...",
      options: ["16", "11", "13", "10"],
      correctIndex: 1,
    },
    {
      question: "Hasil dari (10 − 4) ÷ 2 adalah ...",
      options: ["3", "8", "5", "6"],
      correctIndex: 0,
    },
    {
      question: "Hasil dari 12 ÷ 3 × 2 adalah ...",
      options: ["8", "2", "4", "6"],
      correctIndex: 0,
    },
    {
      question: "Hasil dari 20 − 4 × 3 adalah ...",
      options: ["48", "8", "16", "12"],
      correctIndex: 1,
    },
    {
      question: "Hasil dari 6 + 18 ÷ 3 adalah ...",
      options: ["8", "10", "12", "14"],
      correctIndex: 2,
    },
    {
      question: "Hasil dari (−2) × 4 + 5 adalah ...",
      options: ["−3", "3", "−13", "13"],
      correctIndex: 0,
    },
  ];

  const OperasiCampuranMeteorGamePage = () => (
    <MeteorShootingGame
      questions={questions}
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
      backLabel="Kembali ke Pilihan Game"
      homePath="/menu"
    />
  );

  export default OperasiCampuranMeteorGamePage;
  