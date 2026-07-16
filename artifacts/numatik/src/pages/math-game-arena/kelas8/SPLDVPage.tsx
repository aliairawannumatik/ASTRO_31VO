import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV", path: "/math-game-arena/kelas-8/spldv/definisi-spldv" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK", path: "/math-game-arena/kelas-8/spldv/metode-grafik" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI", path: "/math-game-arena/kelas-8/spldv/metode-substitusi" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI", path: "/math-game-arena/kelas-8/spldv/metode-eliminasi" },
  { name: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN", path: "/math-game-arena/kelas-8/spldv/metode-campuran" },
  { name: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV", path: "/math-game-arena/kelas-8/spldv/model-spldv" },
  { name: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV", path: "/math-game-arena/kelas-8/spldv/penyelesaian-masalah" },
];

const SPLDVPage = () => (
  <GameSubtopicPage
    title="SISTEM PERSAMAAN LINEAR DUA VARIABEL"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-8"
    backLabel="Kembali ke Kelas 8"
    icon="⚖️"
    kelasLabel="Kelas 8"
  />
);

export default SPLDVPage;
