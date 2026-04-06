import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "HUBUNGAN 2 GARIS", path: "/math-game-arena/kelas-7/garis-dan-sudut/hubungan-2-garis" },
  { name: "SUDUT PELURUS, SUDUT PENYIKU DAN SUDUT BERTOLAK BELAKANG", path: "/math-game-arena/kelas-7/garis-dan-sudut/sudut-pelurus-penyiku" },
  { name: "SIFAT SUDUT DUA GARIS SEJAJAR JIKA DIPOTONG GARIS LAIN", path: "/math-game-arena/kelas-7/garis-dan-sudut/sifat-sudut-sejajar" },
  { name: "JUMLAH SUDUT PADA SEGI BANYAK", path: "/math-game-arena/kelas-7/garis-dan-sudut/jumlah-sudut-segibanyak" },
];

const GarisDanSudutPage = () => (
  <GameSubtopicPage title="GARIS DAN SUDUT" subtopics={subtopics} icon="📏" />
);

export default GarisDanSudutPage;
