import GalaksiTempurPage from "@/pages/math-game-arena/umum/GalaksiTempurPage";
import { OPERASI_CAMPURAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const OperasiCampuranGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
    homePath="/menu"
    quizQuestions={OPERASI_CAMPURAN_QUIZ}
  />
);

export default OperasiCampuranGalaksiTempurGamePage;
