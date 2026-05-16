import ZumMathPage from "@/pages/math-game-arena/umum/ZumMathPage";
import { OPERASI_CAMPURAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const OperasiCampuranZumMathGamePage = () => (
  <ZumMathPage
    topicLabel="OPERASI CAMPURAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
    homePath="/menu"
    quizQuestions={OPERASI_CAMPURAN_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default OperasiCampuranZumMathGamePage;
