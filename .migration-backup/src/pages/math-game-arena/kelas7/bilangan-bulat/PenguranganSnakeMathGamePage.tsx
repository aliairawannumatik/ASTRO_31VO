import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
import { PENGURANGAN_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PenguranganSnakeMathGamePage;
