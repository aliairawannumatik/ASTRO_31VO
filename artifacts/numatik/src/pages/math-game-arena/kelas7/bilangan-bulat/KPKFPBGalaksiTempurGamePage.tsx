import GalaksiTempurPage from "@/pages/math-game-arena/umum/GalaksiTempurPage";
import { KPK_FPB_GALAKSI_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const KPKFPBGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="KPK DAN FPB"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
    homePath="/menu"
    quizQuestions={KPK_FPB_GALAKSI_QUIZ}
  />
);

export default KPKFPBGalaksiTempurGamePage;
