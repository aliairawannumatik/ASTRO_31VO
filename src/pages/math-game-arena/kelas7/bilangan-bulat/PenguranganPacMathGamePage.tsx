import PacMathPage from "@/pages/math-game-arena/umum/PacMathPage";
import { PENGURANGAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganPacMathGamePage = () => (
  <PacMathPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenguranganPacMathGamePage;
