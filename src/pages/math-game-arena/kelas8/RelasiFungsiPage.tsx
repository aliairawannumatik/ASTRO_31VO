import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN RELASI DAN PENYAJIANNYA", path: "/math-game-arena/kelas-8/relasi-dan-fungsi/pengertian-relasi" },
  { name: "PENGERTIAN FUNGSI DAN PENYAJIANNYA", path: "/math-game-arena/kelas-8/relasi-dan-fungsi/pengertian-fungsi" },
  { name: "MENENTUKAN BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU", path: "/math-game-arena/kelas-8/relasi-dan-fungsi/banyak-fungsi" },
  { name: "NOTASI DAN RUMUS FUNGSI", path: "/math-game-arena/kelas-8/relasi-dan-fungsi/notasi-rumus" },
  { name: "GRAFIK FUNGSI", path: "/math-game-arena/kelas-8/relasi-dan-fungsi/grafik-fungsi" },
];

const RelasiFungsiPage = () => (
  <GameSubtopicPage
    title="RELASI DAN FUNGSI"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="📊"
    kelasLabel="Kelas 8"
  />
);

export default RelasiFungsiPage;
