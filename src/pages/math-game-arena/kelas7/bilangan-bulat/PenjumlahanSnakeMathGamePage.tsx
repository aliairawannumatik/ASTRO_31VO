import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
import { PENJUMLAHAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenjumlahanSnakeMathGamePage;
