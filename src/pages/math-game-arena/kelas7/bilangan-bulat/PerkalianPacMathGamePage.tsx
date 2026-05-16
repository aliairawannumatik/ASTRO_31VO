import PacMathPage from "@/pages/math-game-arena/umum/PacMathPage";
import { PERKALIAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PerkalianPacMathGamePage = () => (
  <PacMathPage
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
    homePath="/menu"
    quizQuestions={PERKALIAN_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PerkalianPacMathGamePage;
