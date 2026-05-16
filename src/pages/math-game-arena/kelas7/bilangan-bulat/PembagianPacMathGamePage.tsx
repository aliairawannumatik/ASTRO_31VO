import PacMathPage from "@/pages/math-game-arena/umum/PacMathPage";
import { PEMBAGIAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PembagianPacMathGamePage = () => (
  <PacMathPage
    topicLabel="PEMBAGIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
    homePath="/menu"
    quizQuestions={PEMBAGIAN_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PembagianPacMathGamePage;
