import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN", path: "/math-game-arena/kelas-7/bilangan-rasional/arti-pecahan" },
  { name: "PECAHAN CAMPURAN DAN PERSEN", path: "/math-game-arena/kelas-7/bilangan-rasional/pecahan-campuran" },
  { name: "PENJUMLAHAN PECAHAN", path: "/math-game-arena/kelas-7/bilangan-rasional/penjumlahan-pecahan" },
  { name: "PENGURANGAN PECAHAN", path: "/math-game-arena/kelas-7/bilangan-rasional/pengurangan-pecahan" },
  { name: "PERKALIAN PECAHAN", path: "/math-game-arena/kelas-7/bilangan-rasional/perkalian-pecahan" },
  { name: "PEMBAGIAN PECAHAN", path: "/math-game-arena/kelas-7/bilangan-rasional/pembagian-pecahan" },
  { name: "BENTUK DESIMAL", path: "/math-game-arena/kelas-7/bilangan-rasional/bentuk-desimal" },
  { name: "PENJUMLAHAN BENTUK DESIMAL", path: "/math-game-arena/kelas-7/bilangan-rasional/penjumlahan-desimal" },
  { name: "PENGURANGAN BENTUK DESIMAL", path: "/math-game-arena/kelas-7/bilangan-rasional/pengurangan-desimal" },
  { name: "PERKALIAN BENTUK DESIMAL", path: "/math-game-arena/kelas-7/bilangan-rasional/perkalian-desimal" },
  { name: "PEMBAGIAN BENTUK DESIMAL", path: "/math-game-arena/kelas-7/bilangan-rasional/pembagian-desimal" },
  { name: "PEMBULATAN BENTUK DESIMAL", path: "/math-game-arena/kelas-7/bilangan-rasional/pembulatan-desimal" },
];

const BilanganRasionalPage = () => (
  <GameSubtopicPage title="PECAHAN" subtopics={subtopics} icon="🧮" />
);

export default BilanganRasionalPage;
