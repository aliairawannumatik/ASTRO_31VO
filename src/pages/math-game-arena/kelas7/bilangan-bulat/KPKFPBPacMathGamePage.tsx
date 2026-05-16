import PacMathPage from "@/pages/math-game-arena/umum/PacMathPage";
import { KPK_FPB_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBPacMathGamePage = () => (
  <PacMathPage
    topicLabel="KPK & FPB"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default KPKFPBPacMathGamePage;
