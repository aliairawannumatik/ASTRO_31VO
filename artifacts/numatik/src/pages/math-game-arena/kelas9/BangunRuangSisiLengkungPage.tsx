import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "TABUNG", path: "/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/tabung" },
  { name: "KERUCUT", path: "/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/kerucut" },
  { name: "BOLA", path: "/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/bola" },
  { name: "PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG", path: "/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/perubahan-luas-volume" },
  { name: "BANGUN RUANG SISI LENGKUNG GABUNGAN", path: "/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung/gabungan" },
];

const BangunRuangSisiLengkungPage = () => (
  <GameSubtopicPage
    title="BANGUN RUANG SISI LENGKUNG"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="🌐"
    kelasLabel="Kelas 9"
  />
);

export default BangunRuangSisiLengkungPage;
