import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "GRAFIK PERSAMAAN GARIS LURUS", path: "/math-game-arena/kelas-8/persamaan-garis-lurus/grafik-pgl" },
  { name: "GRADIEN (KEMIRINGAN GARIS)", path: "/math-game-arena/kelas-8/persamaan-garis-lurus/gradien" },
  { name: "MENENTUKAN PERSAMAAN GARIS LURUS", path: "/math-game-arena/kelas-8/persamaan-garis-lurus/menentukan-pgl" },
  { name: "HUBUNGAN 2 GARIS", path: "/math-game-arena/kelas-8/persamaan-garis-lurus/hubungan-2-garis" },
  { name: "APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL", path: "/math-game-arena/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual" },
];

const PersamaanGarisLurusPage = () => (
  <GameSubtopicPage
    title="PERSAMAAN GARIS LURUS"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="📏"
    kelasLabel="Kelas 8"
  />
);

export default PersamaanGarisLurusPage;
