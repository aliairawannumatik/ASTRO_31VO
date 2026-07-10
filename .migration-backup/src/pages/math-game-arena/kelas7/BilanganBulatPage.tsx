import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENJUMLAHAN BILANGAN BULAT", path: "/math-game-arena/kelas-7/bilangan-bulat/penjumlahan" },
  { name: "PENGURANGAN BILANGAN BULAT", path: "/math-game-arena/kelas-7/bilangan-bulat/pengurangan" },
  { name: "PERKALIAN BILANGAN BULAT", path: "/math-game-arena/kelas-7/bilangan-bulat/perkalian" },
  { name: "PEMBAGIAN BILANGAN BULAT", path: "/math-game-arena/kelas-7/bilangan-bulat/pembagian" },
  { name: "OPERASI HITUNG CAMPURAN BILANGAN BULAT", path: "/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran" },
  { name: "KPK DAN FPB", path: "/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb" },
];

const BilanganBulatPage = () => (
  <GameSubtopicPage title="BILANGAN BULAT" subtopics={subtopics} icon="🔢" />
);

export default BilanganBulatPage;
