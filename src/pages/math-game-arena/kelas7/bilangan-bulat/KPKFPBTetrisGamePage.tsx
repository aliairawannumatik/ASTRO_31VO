import TetrisGamePage from "@/pages/math-game-arena/umum/TetrisGamePage";

import { KPK_FPB_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const KPKFPBTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="KPK DAN FPB"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
      homePath="/menu"

      quizQuestions={KPK_FPB_QUIZ}
    />
  );

  export default KPKFPBTetrisGamePage;
  