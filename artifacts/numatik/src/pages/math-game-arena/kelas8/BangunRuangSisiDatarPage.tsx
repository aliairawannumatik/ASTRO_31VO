import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "KUBUS", path: "/math-game-arena/kelas-8/bangun-ruang-sisi-datar/kubus-game" },
  { name: "BALOK", path: "/math-game-arena/kelas-8/bangun-ruang-sisi-datar/balok-game" },
  { name: "PRISMA", path: "/math-game-arena/kelas-8/bangun-ruang-sisi-datar/prisma-game" },
  { name: "LIMAS", path: "/math-game-arena/kelas-8/bangun-ruang-sisi-datar/limas-game" },
  { name: "BANGUN RUANG SISI DATAR GABUNGAN", path: "/math-game-arena/kelas-8/bangun-ruang-sisi-datar/gabungan-game" },
];

const BangunRuangSisiDatarPage = () => (
  <GameSubtopicPage
    title="BANGUN RUANG SISI DATAR"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="🧊"
    kelasLabel="Kelas 8"
  />
);

export default BangunRuangSisiDatarPage;
