import BrickBreakerPage from "@/pages/math-game-arena/umum/BrickBreakerPage";
import { KPK_FPB_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="KPK DAN FPB"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_METEOR_PANTUL_QUIZ}
  />
);

export default KPKFPBMeteorPantulGamePage;
