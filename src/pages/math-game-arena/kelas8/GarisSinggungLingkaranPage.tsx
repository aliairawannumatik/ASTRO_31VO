import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN", path: "/math-game-arena/kelas-8/garis-singgung-lingkaran/pengertian-sifat" },
  { name: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN", path: "/math-game-arena/kelas-8/garis-singgung-lingkaran/panjang-garis-singgung" },
  { name: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)", path: "/math-game-arena/kelas-8/garis-singgung-lingkaran/gspl" },
  { name: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)", path: "/math-game-arena/kelas-8/garis-singgung-lingkaran/gspd" },
  { name: "SABUK LILITAN MINIMAL (PENERAPAN)", path: "/math-game-arena/kelas-8/garis-singgung-lingkaran/sabuk-lilitan" },
];

const GarisSinggungLingkaranPage = () => (
  <GameSubtopicPage
    title="GARIS SINGGUNG LINGKARAN"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="🔵"
    kelasLabel="Kelas 8"
  />
);

export default GarisSinggungLingkaranPage;
