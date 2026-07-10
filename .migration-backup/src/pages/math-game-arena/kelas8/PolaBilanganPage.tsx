import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN POLA DAN BARISAN BILANGAN", path: "/math-game-arena/kelas-8/pola-bilangan/pengertian-pola" },
  { name: "POLA-POLA KHUSUS", path: "/math-game-arena/kelas-8/pola-bilangan/pola-khusus" },
  { name: "BARISAN DAN DERET ARITMETIKA", path: "/math-game-arena/kelas-8/pola-bilangan/pola-aritmetika" },
  { name: "BARISAN DAN DERET GEOMETRI", path: "/math-game-arena/kelas-8/pola-bilangan/pola-geometri" },
];

const PolaBilanganPage = () => (
  <GameSubtopicPage
    title="POLA BILANGAN"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="🔢"
    kelasLabel="Kelas 8"
  />
);

export default PolaBilanganPage;
