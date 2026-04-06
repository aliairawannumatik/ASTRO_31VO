import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "BENTUK UMUM DAN KARAKTERISTIK GRAFIK", path: "/math-game-arena/kelas-9/fungsi-kuadrat/bentuk-umum-karakteristik" },
  { name: "TITIK POTONG TERHADAP SUMBU-SUMBU", path: "/math-game-arena/kelas-9/fungsi-kuadrat/titik-potong" },
  { name: "SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)", path: "/math-game-arena/kelas-9/fungsi-kuadrat/sumbu-simetri" },
  { name: "MENGGAMBAR GRAFIK FUNGSI KUADRAT", path: "/math-game-arena/kelas-9/fungsi-kuadrat/menggambar-grafik" },
  { name: "MENYUSUN FUNGSI KUADRAT", path: "/math-game-arena/kelas-9/fungsi-kuadrat/menyusun-fungsi" },
  { name: "PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM)", path: "/math-game-arena/kelas-9/fungsi-kuadrat/penerapan" },
];

const FungsiKuadratPage = () => (
  <GameSubtopicPage
    title="FUNGSI KUADRAT (PENGAYAAN)"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="📉"
    kelasLabel="Kelas 9"
  />
);

export default FungsiKuadratPage;
