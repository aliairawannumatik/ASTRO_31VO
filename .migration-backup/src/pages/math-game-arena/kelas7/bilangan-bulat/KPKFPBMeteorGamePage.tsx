import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

  const questions: QuizQuestion[] = [
    {
      question: "FPB dari 8 dan 12 adalah ...",
      options: ["2", "4", "6", "8"],
      correctIndex: 1,
    },
    {
      question: "KPK dari 4 dan 6 adalah ...",
      options: ["8", "10", "12", "24"],
      correctIndex: 2,
    },
    {
      question: "FPB dari 18 dan 24 adalah ...",
      options: ["3", "6", "9", "12"],
      correctIndex: 1,
    },
    {
      question: "KPK dari 5 dan 10 adalah ...",
      options: ["5", "10", "15", "50"],
      correctIndex: 1,
    },
    {
      question: "FPB dari 15 dan 25 adalah ...",
      options: ["3", "5", "10", "15"],
      correctIndex: 1,
    },
    {
      question: "Lampu A menyala tiap 6 menit, lampu B tiap 8 menit. Setelah berapa menit menyala bersama lagi?",
      options: ["12", "16", "24", "48"],
      correctIndex: 2,
    },
  ];

  const KPKFPBMeteorGamePage = () => (
    <MeteorShootingGame
      questions={questions}
      topicLabel="KPK DAN FPB"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
      backLabel="Kembali ke Pilihan Game"
      homePath="/menu"
    />
  );

  export default KPKFPBMeteorGamePage;
  