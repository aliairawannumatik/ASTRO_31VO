import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
import { PERKALIAN_SNAKE_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PerkalianSnakeMathGamePage = () => (
  <SnakeMathPage
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
    homePath="/menu"
    quizQuestions={PERKALIAN_SNAKE_QUIZ}
    quizIntervalMs={25_000}
  />
);

export default PerkalianSnakeMathGamePage;
