import BrickBreakerPage from "@/pages/math-game-arena/umum/BrickBreakerPage";
import { PENJUMLAHAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_METEOR_PANTUL_QUIZ}
  />
);

export default PenjumlahanMeteorPantulGamePage;
