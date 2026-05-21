import PacMathPage from "@/pages/math-game-arena/umum/PacMathPage";
import { PENJUMLAHAN_PAC_MATH_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanPacMathGamePage = () => (
  <PacMathPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_PAC_MATH_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenjumlahanPacMathGamePage;
