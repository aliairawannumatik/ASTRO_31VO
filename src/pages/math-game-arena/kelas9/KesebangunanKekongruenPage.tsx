import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "DEFINISI KESEBANGUNAN DAN KEKONGRUENAN", path: "/math-game-arena/kelas-9/kesebangunan-kekongruenan/definisi" },
  { name: "MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN", path: "/math-game-arena/kelas-9/kesebangunan-kekongruenan/menghitung-rusuk" },
  { name: "SEGITIGA – SEGITIGA YANG SEBANGUN", path: "/math-game-arena/kelas-9/kesebangunan-kekongruenan/segitiga-sebangun" },
  { name: "RASIO RUSUK SEGITIGA SIKU-SIKU DENGAN KONSEP KESEBANGUNAN", path: "/math-game-arena/kelas-9/kesebangunan-kekongruenan/rasio-rusuk" },
  { name: "KEKONGRUENAN PADA BANGUN DATAR", path: "/math-game-arena/kelas-9/kesebangunan-kekongruenan/kekongruenan-bangun-datar" },
];

const KesebangunanKekongruenPage = () => (
  <GameSubtopicPage
    title="KESEBANGUNAN DAN KEKONGRUENAN"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="📐"
    kelasLabel="Kelas 9"
  />
);

export default KesebangunanKekongruenPage;
