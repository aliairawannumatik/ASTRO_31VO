import ZumMathPage from "@/pages/math-game-arena/umum/ZumMathPage";
import { PERKALIAN_ZUM_MATH_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PerkalianZumMathGamePage = () => (
  <ZumMathPage
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
    homePath="/menu"
    quizQuestions={PERKALIAN_ZUM_MATH_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PerkalianZumMathGamePage;
