import TetrisGamePage from "@/pages/math-game-arena/umum/TetrisGamePage";

import { PEMBAGIAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const PembagianTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="PEMBAGIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
      homePath="/menu"

      quizQuestions={PEMBAGIAN_TETRIS_QUIZ}
    />
  );

  export default PembagianTetrisGamePage;
  