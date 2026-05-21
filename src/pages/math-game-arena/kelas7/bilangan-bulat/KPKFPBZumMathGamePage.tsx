import ZumMathPage from "@/pages/math-game-arena/umum/ZumMathPage";
import { KPK_FPB_ZUM_MATH_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBZumMathGamePage = () => (
  <ZumMathPage
    topicLabel="KPK & FPB"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_ZUM_MATH_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default KPKFPBZumMathGamePage;
