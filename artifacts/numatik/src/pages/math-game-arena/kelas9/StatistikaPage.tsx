import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGANTAR STATISTIKA, PENGUMPULAN DATA DAN PENYAJIAN DATA", path: "/math-game-arena/kelas-9/statistika/pengantar" },
  { name: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)", path: "/math-game-arena/kelas-9/statistika/rata-rata" },
  { name: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)", path: "/math-game-arena/kelas-9/statistika/median-modus" },
  { name: "UKURAN LETAK DATA (KUARTIL)", path: "/math-game-arena/kelas-9/statistika/kuartil" },
  { name: "UKURAN PENYEBARAN DATA (JANGKAUAN, JIK, SIMPANGAN KUARTIL)", path: "/math-game-arena/kelas-9/statistika/penyebaran-data" },
];

const StatistikaPage = () => (
  <GameSubtopicPage
    title="STATISTIKA"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="📊"
    kelasLabel="Kelas 9"
  />
);

export default StatistikaPage;
