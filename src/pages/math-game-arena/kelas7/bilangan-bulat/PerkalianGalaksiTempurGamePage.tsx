import GalaksiTempurPage from "@/pages/math-game-arena/umum/GalaksiTempurPage";
import { PERKALIAN_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PerkalianGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
    homePath="/menu"
    quizQuestions={PERKALIAN_GALAKSI_QUIZ}
  />
);

export default PerkalianGalaksiTempurGamePage;
