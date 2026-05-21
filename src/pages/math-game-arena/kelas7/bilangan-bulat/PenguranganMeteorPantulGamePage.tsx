import BrickBreakerPage from "@/pages/math-game-arena/umum/BrickBreakerPage";
import { PENGURANGAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_METEOR_PANTUL_QUIZ}
  />
);

export default PenguranganMeteorPantulGamePage;
