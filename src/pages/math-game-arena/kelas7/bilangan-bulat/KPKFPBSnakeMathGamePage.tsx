import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
  import type { GuruQuestion } from "@/hooks/useGuruQuiz";

  const QUESTIONS: GuruQuestion[] = [
    { question: "FPB dari 6 dan 9 adalah ...", options: ["1", "2", "3", "6"], correctIdx: 2 },
    { question: "KPK dari 3 dan 4 adalah ...", options: ["7", "12", "6", "24"], correctIdx: 1 },
    { question: "FPB dari 10 dan 15 adalah ...", options: ["5", "10", "3", "15"], correctIdx: 0 },
    { question: "KPK dari 2 dan 5 adalah ...", options: ["5", "10", "7", "20"], correctIdx: 1 },
    { question: "FPB dari 12 dan 18 adalah ...", options: ["2", "4", "6", "9"], correctIdx: 2 },
    { question: "KPK dari 4 dan 6 adalah ...", options: ["10", "12", "24", "8"], correctIdx: 1 },
    { question: "FPB dari 20 dan 30 adalah ...", options: ["5", "10", "15", "20"], correctIdx: 1 },
    { question: "KPK dari 6 dan 9 adalah ...", options: ["3", "18", "27", "54"], correctIdx: 1 },
    { question: "FPB dari 8 dan 12 adalah ...", options: ["2", "4", "6", "8"], correctIdx: 1 },
    { question: "KPK dari 5 dan 10 adalah ...", options: ["5", "10", "15", "50"], correctIdx: 1 },
    { question: "Faktor dari 6 adalah ...", options: ["1, 2, 3, 6", "2, 3", "1, 2, 6", "1, 6"], correctIdx: 0 },
    { question: "Kelipatan 4 yang kurang dari 20 adalah ...", options: ["4, 8, 12, 16", "4, 6, 8, 10", "1, 2, 4, 8", "8, 12, 16, 20"], correctIdx: 0 },
  ];

  const KPKFPBSnakeMathGamePage = () => (
    <SnakeMathPage
      topicLabel="KPK DAN FPB"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
      homePath="/menu"
      quizQuestions={QUESTIONS}
      quizIntervalMs={25_000}
    />
  );

  export default KPKFPBSnakeMathGamePage;
  