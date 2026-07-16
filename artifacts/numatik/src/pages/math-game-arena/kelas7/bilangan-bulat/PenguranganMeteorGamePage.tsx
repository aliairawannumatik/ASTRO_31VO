import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

  const questions: QuizQuestion[] = [
    {
      question: "Hasil dari 12 − 5 adalah ...",
      options: ["7", "17", "−7", "8"],
      correctIndex: 0,
    },
    {
      question: "Hasil dari 8 − 15 adalah ...",
      options: ["7", "−7", "−23", "23"],
      correctIndex: 1,
    },
    {
      question: "Hasil dari (−6) − 9 adalah ...",
      options: ["3", "−3", "15", "−15"],
      correctIndex: 3,
    },
    {
      question: "Hasil dari 10 − (−4) adalah ...",
      options: ["6", "−6", "14", "−14"],
      correctIndex: 2,
    },
    {
      question: "Hasil dari (−7) − (−3) adalah ...",
      options: ["−4", "4", "10", "−10"],
      correctIndex: 0,
    },
    {
      question: "Suhu mula-mula 5°C lalu turun 9°C. Suhu sekarang adalah ...",
      options: ["−4°C", "14°C", "4°C", "−14°C"],
      correctIndex: 0,
    },
  ];

  const PenguranganMeteorGamePage = () => (
    <MeteorShootingGame
      questions={questions}
      topicLabel="PENGURANGAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
      backLabel="Kembali ke Pilihan Game"
      homePath="/menu"
    />
  );

  export default PenguranganMeteorGamePage;
  