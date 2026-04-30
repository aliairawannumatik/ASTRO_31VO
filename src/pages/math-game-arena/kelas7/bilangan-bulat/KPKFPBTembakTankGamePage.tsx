import BattleTankPage, { MQ } from "@/pages/math-game-arena/umum/BattleTankPage";

import { KPK_FPB_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "FPB(4, 8) = ...", opts: ["4", "2", "8", "1"], ans: 0 },
    { q: "KPK(2, 3) = ...", opts: ["6", "5", "9", "1"], ans: 0 },
    { q: "FPB(9, 12) = ...", opts: ["3", "9", "12", "1"], ans: 0 },
    { q: "KPK(4, 5) = ...", opts: ["20", "9", "10", "5"], ans: 0 },
    { q: "FPB(14, 21) = ...", opts: ["7", "3", "21", "14"], ans: 0 },
    { q: "KPK(3, 5) = ...", opts: ["15", "8", "5", "30"], ans: 0 },
    { q: "FPB(16, 24) = ...", opts: ["8", "4", "16", "2"], ans: 0 },
    { q: "KPK(6, 8) = ...", opts: ["24", "14", "16", "48"], ans: 0 },
    { q: "FPB(5, 10) = ...", opts: ["5", "10", "1", "15"], ans: 0 },
    { q: "KPK(2, 7) = ...", opts: ["14", "9", "7", "21"], ans: 0 },
    { q: "FPB(6, 18) = ...", opts: ["6", "3", "18", "2"], ans: 0 },
    { q: "KPK(4, 10) = ...", opts: ["20", "14", "40", "10"], ans: 0 },
  ];

  const KPKFPBTembakTankGamePage = () => (
    <BattleTankPage
      questions={questions}
      topicLabel="KPK DAN FPB · Tembak tank dengan jawaban benar!"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
      homePath="/menu"

      quizQuestions={KPK_FPB_QUIZ}
    />
  );

  export default KPKFPBTembakTankGamePage;
  