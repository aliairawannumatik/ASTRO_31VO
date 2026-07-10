import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "UNSUR-UNSUR LINGKARAN", path: "/math-game-arena/kelas-8/lingkaran/unsur-unsur" },
  { name: "KELILING DAN LUAS LINGKARAN", path: "/math-game-arena/kelas-8/lingkaran/keliling-luas" },
  { name: "KAITAN LINGKARAN DENGAN BANGUN DATAR LAINNYA", path: "/math-game-arena/kelas-8/lingkaran/kaitan-bangun-datar" },
  { name: "PANJANG BUSUR DAN LUAS JURING", path: "/math-game-arena/kelas-8/lingkaran/busur-juring" },
  { name: "SUDUT PUSAT DAN SUDUT KELILING", path: "/math-game-arena/kelas-8/lingkaran/sudut-pusat-keliling" },
  { name: "PENERAPAN KONSEP LINGKARAN PADA PERMASALAHAN KONTEKSTUAL", path: "/math-game-arena/kelas-8/lingkaran/penerapan-kontekstual" },
];

const LingkaranPage = () => (
  <GameSubtopicPage
    title="LINGKARAN"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="⭕"
    kelasLabel="Kelas 8"
  />
);

export default LingkaranPage;
