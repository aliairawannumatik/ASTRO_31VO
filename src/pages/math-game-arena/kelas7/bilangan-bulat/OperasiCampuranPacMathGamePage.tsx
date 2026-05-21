import PacMathPage from "@/pages/math-game-arena/umum/PacMathPage";
import { OPERASI_CAMPURAN_PAC_MATH_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const OperasiCampuranPacMathGamePage = () => (
  <PacMathPage
    topicLabel="OPERASI CAMPURAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
    homePath="/menu"
    quizQuestions={OPERASI_CAMPURAN_PAC_MATH_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default OperasiCampuranPacMathGamePage;
