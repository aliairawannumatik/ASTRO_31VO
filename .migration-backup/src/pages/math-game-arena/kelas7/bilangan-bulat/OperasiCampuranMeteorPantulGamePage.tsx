import BrickBreakerPage from "@/pages/math-game-arena/umum/BrickBreakerPage";
import { OPERASI_CAMPURAN_METEOR_PANTUL_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const OperasiCampuranMeteorPantulGamePage = () => (
  <BrickBreakerPage
    topicLabel="OPERASI CAMPURAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
    homePath="/menu"
    quizQuestions={OPERASI_CAMPURAN_METEOR_PANTUL_QUIZ}
  />
);

export default OperasiCampuranMeteorPantulGamePage;
