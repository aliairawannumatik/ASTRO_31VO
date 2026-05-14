import GalaksiTempurPage from "@/pages/math-game-arena/umum/GalaksiTempurPage";
import { PEMBAGIAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PembagianGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PEMBAGIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
    homePath="/menu"
    quizQuestions={PEMBAGIAN_QUIZ}
  />
);

export default PembagianGalaksiTempurGamePage;
