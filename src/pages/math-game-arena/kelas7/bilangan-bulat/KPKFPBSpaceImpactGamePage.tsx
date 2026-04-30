import SpaceImpactPage, { MQ } from "@/pages/math-game-arena/umum/SpaceImpactPage";

import { KPK_FPB_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "FPB(8, 12)", ans: 4 },
    { q: "KPK(3, 4)", ans: 12 },
    { q: "FPB(15, 25)", ans: 5 },
    { q: "KPK(2, 5)", ans: 10 },
    { q: "FPB(9, 12)", ans: 3 },
    { q: "KPK(4, 6)", ans: 12 },
    { q: "FPB(18, 24)", ans: 6 },
    { q: "KPK(5, 10)", ans: 10 },
    { q: "FPB(6, 9)", ans: 3 },
    { q: "KPK(6, 8)", ans: 24 },
    { q: "FPB(10, 20)", ans: 10 },
    { q: "KPK(3, 7)", ans: 21 },
  ];

  const KPKFPBSpaceImpactGamePage = () => (
    <SpaceImpactPage
      questions={questions}
      topicLabel="KPK DAN FPB"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
      homePath="/menu"

      quizQuestions={KPK_FPB_QUIZ}
    />
  );

  export default KPKFPBSpaceImpactGamePage;
  