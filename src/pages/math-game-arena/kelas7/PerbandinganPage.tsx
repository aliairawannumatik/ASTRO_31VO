import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PERBANDINGAN UMUM, SATUAN PEMBANDING DAN RASIO", path: "/math-game-arena/kelas-7/perbandingan/perbandingan-umum" },
  { name: "PERBANDINGAN BERTINGKAT", path: "/math-game-arena/kelas-7/perbandingan/perbandingan-bertingkat" },
  { name: "PERBANDINGAN SENILAI DAN BERBALIK NILAI", path: "/math-game-arena/kelas-7/perbandingan/perbandingan-senilai" },
  { name: "PERBANDINGAN CAMPURAN", path: "/math-game-arena/kelas-7/perbandingan/perbandingan-campuran" },
  { name: "SKALA", path: "/math-game-arena/kelas-7/perbandingan/skala" },
];

const PerbandinganPage = () => (
  <GameSubtopicPage title="PERBANDINGAN" subtopics={subtopics} icon="📐" />
);

export default PerbandinganPage;
