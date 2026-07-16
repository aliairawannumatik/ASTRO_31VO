import BrickBreakerPage from "@/pages/math-game-arena/umum/BrickBreakerPage";
import { PEMBAGIAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PembagianMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="PEMBAGIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
    homePath="/menu"
    quizQuestions={PEMBAGIAN_METEOR_PANTUL_QUIZ}
  />
);

export default PembagianMeteorPantulGamePage;
