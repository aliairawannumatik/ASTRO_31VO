import TetrisGamePage from "@/pages/math-game-arena/umum/TetrisGamePage";

import { OPERASI_CAMPURAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const OperasiCampuranTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
      homePath="/menu"

      quizQuestions={OPERASI_CAMPURAN_QUIZ}
    />
  );

  export default OperasiCampuranTetrisGamePage;
  