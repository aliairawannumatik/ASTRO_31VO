import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
import { KPK_FPB_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="KPK DAN FPB"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default KPKFPBSnakeMathGamePage;
