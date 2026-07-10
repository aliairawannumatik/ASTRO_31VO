import TetrisGamePage from "@/pages/math-game-arena/umum/TetrisGamePage";

import { PERKALIAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const PerkalianTetrisGamePage = () => (
    <TetrisGamePage
      topicLabel="PERKALIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
      homePath="/menu"

      quizQuestions={PERKALIAN_TETRIS_QUIZ}
    />
  );

  export default PerkalianTetrisGamePage;
  