import ZumMathPage from "@/pages/math-game-arena/umum/ZumMathPage";
import { PENJUMLAHAN_ZUM_MATH_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanZumMathGamePage = () => (
  <ZumMathPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_ZUM_MATH_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenjumlahanZumMathGamePage;
