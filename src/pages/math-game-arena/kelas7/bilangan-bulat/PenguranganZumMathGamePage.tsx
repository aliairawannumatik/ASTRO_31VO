import ZumMathPage from "@/pages/math-game-arena/umum/ZumMathPage";
import { PENGURANGAN_ZUM_MATH_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganZumMathGamePage = () => (
  <ZumMathPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_ZUM_MATH_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenguranganZumMathGamePage;
