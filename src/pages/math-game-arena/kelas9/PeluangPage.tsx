import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "RUANG SAMPEL DAN TITIK SAMPEL", path: "/math-game-arena/kelas-9/peluang/ruang-sampel" },
  { name: "PELUANG EMPIRIK DAN FREKUENSI RELATIF", path: "/math-game-arena/kelas-9/peluang/peluang-empirik" },
  { name: "PELUANG TEORETIK", path: "/math-game-arena/kelas-9/peluang/peluang-teoretik" },
  { name: "FREKUENSI HARAPAN", path: "/math-game-arena/kelas-9/peluang/frekuensi-harapan" },
  { name: "KOMPLEMEN SUATU KEJADIAN", path: "/math-game-arena/kelas-9/peluang/komplemen" },
];

const PeluangPage = () => (
  <GameSubtopicPage
    title="PELUANG"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="🎲"
    kelasLabel="Kelas 9"
  />
);

export default PeluangPage;
