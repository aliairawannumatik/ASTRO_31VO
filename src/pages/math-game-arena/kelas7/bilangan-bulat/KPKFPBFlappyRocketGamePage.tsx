import FlappyRocketPage, { MQ } from "@/pages/math-game-arena/umum/FlappyRocketPage";

import { KPK_FPB_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "FPB(6, 9) = ?", opts: ["1", "2", "3", "6"], ans: 2 },
    { q: "KPK(3, 4) = ?", opts: ["7", "12", "6", "24"], ans: 1 },
    { q: "FPB(10, 15) = ?", opts: ["5", "10", "3", "15"], ans: 0 },
    { q: "KPK(2, 5) = ?", opts: ["5", "10", "7", "20"], ans: 1 },
    { q: "FPB(12, 18) = ?", opts: ["2", "4", "6", "9"], ans: 2 },
    { q: "KPK(4, 6) = ?", opts: ["10", "12", "24", "8"], ans: 1 },
    { q: "FPB(20, 30) = ?", opts: ["5", "10", "15", "20"], ans: 1 },
    { q: "KPK(6, 9) = ?", opts: ["3", "18", "27", "54"], ans: 1 },
  ];

  const KPKFPBFlappyRocketGamePage = () => (
    <FlappyRocketPage
      questions={questions}
      topicLabel="KPK DAN FPB"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
      homePath="/menu"

      quizQuestions={KPK_FPB_QUIZ}
    />
  );

  export default KPKFPBFlappyRocketGamePage;
  