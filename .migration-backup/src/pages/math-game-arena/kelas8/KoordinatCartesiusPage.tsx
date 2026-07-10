import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS", path: "/math-game-arena/kelas-8/koordinat-cartesius/unsur-unsur" },
  { name: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "/math-game-arena/kelas-8/koordinat-cartesius/jarak-titik" },
  { name: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS", path: "/math-game-arena/kelas-8/koordinat-cartesius/posisi-relatif" },
];

const KoordinatCartesiusPage = () => (
  <GameSubtopicPage
    title="KOORDINAT KARTESIUS"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="📍"
    kelasLabel="Kelas 8"
  />
);

export default KoordinatCartesiusPage;
