import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "TRANSLASI (PERGESERAN)", path: "/math-game-arena/kelas-9/transformasi-geometri/translasi" },
  { name: "REFLEKSI (PENCERMINAN)", path: "/math-game-arena/kelas-9/transformasi-geometri/refleksi" },
  { name: "ROTASI (PERPUTARAN)", path: "/math-game-arena/kelas-9/transformasi-geometri/rotasi" },
  { name: "DILATASI (PERKALIAN/PERUBAHAN UKURAN)", path: "/math-game-arena/kelas-9/transformasi-geometri/dilatasi" },
];

const TransformasiGeometriPage = () => (
  <GameSubtopicPage
    title="TRANSFORMASI GEOMETRI"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="🔄"
    kelasLabel="Kelas 9"
  />
);

export default TransformasiGeometriPage;
