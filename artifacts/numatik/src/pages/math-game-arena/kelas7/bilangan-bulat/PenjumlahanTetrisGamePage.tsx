import TetrisGamePage from "@/pages/math-game-arena/umum/TetrisGamePage";

import { PENJUMLAHAN_TETRIS_QUIZ } from "@/data/mga-k7-bilbul-quiz";
const PenjumlahanTetrisGamePage = () => (
  <TetrisGamePage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"

    quizQuestions={PENJUMLAHAN_TETRIS_QUIZ}
  />
);

export default PenjumlahanTetrisGamePage;
