import GalaksiTempurPage from "@/pages/math-game-arena/umum/GalaksiTempurPage";
import { PENJUMLAHAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";

const PenjumlahanGalaksiTempurGamePage = () => (
  <GalaksiTempurPage
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/menu"
    quizQuestions={PENJUMLAHAN_QUIZ}
  />
);

export default PenjumlahanGalaksiTempurGamePage;
