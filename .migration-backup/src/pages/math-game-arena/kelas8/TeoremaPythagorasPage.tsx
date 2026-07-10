import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "PEMBUKTIAN TEOREMA PYTHAGORAS", path: "/math-game-arena/kelas-8/teorema-pythagoras/pembuktian" },
  { name: "MENGHITUNG PANJANG SEGITIGA SIKU-SIKU", path: "/math-game-arena/kelas-8/teorema-pythagoras/menghitung-panjang" },
  { name: "TRIPLE PYTHAGORAS", path: "/math-game-arena/kelas-8/teorema-pythagoras/triple-pythagoras" },
  { name: "PYTHAGORAS DAN JENIS-JENIS SEGITIGA", path: "/math-game-arena/kelas-8/teorema-pythagoras/jenis-segitiga" },
  { name: "PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS", path: "/math-game-arena/kelas-8/teorema-pythagoras/sudut-khusus" },
  { name: "PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL", path: "/math-game-arena/kelas-8/teorema-pythagoras/penerapan-kontekstual" },
];

const TeoremaPythagorasPage = () => (
  <GameSubtopicPage
    title="TEOREMA PYTHAGORAS"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="📐"
    kelasLabel="Kelas 8"
  />
);

export default TeoremaPythagorasPage;
