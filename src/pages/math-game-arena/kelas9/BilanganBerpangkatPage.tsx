import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PENGERTIAN DAN NOTASI PANGKAT", path: "/math-game-arena/kelas-9/bilangan-berpangkat/pengertian-notasi" },
  { name: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT", path: "/math-game-arena/kelas-9/bilangan-berpangkat/sifat-operasi" },
  { name: "BENTUK AKAR", path: "/math-game-arena/kelas-9/bilangan-berpangkat/bentuk-akar" },
  { name: "NOTASI ILMIAH", path: "/math-game-arena/kelas-9/bilangan-berpangkat/notasi-ilmiah" },
];

const BilanganBerpangkatPage = () => (
  <GameSubtopicPage
    title="BILANGAN BERPANGKAT"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="🔢"
    kelasLabel="Kelas 9"
  />
);

export default BilanganBerpangkatPage;
