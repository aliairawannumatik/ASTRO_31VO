import GalaksiTempurPage from "@/pages/math-game-arena/umum/GalaksiTempurPage";
import { PENGURANGAN_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenguranganGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PENGURANGAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
    homePath="/menu"
    quizQuestions={PENGURANGAN_GALAKSI_QUIZ}
  />
);

export default PenguranganGalaksiTempurGamePage;
