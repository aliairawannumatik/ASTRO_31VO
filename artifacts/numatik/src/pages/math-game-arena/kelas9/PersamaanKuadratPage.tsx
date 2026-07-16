import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "BENTUK UMUM PERSAMAAN KUADRAT", path: "/math-game-arena/kelas-9/persamaan-kuadrat/bentuk-umum" },
  { name: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN", path: "/math-game-arena/kelas-9/persamaan-kuadrat/pemfaktoran" },
  { name: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK", path: "/math-game-arena/kelas-9/persamaan-kuadrat/rumus-kuadratik" },
  { name: "AKAR-AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT", path: "/math-game-arena/kelas-9/persamaan-kuadrat/pelengkap-kuadrat" },
  { name: "DISKRIMINAN", path: "/math-game-arena/kelas-9/persamaan-kuadrat/diskriminan" },
  { name: "MENYUSUN PERSAMAAN KUADRAT BARU", path: "/math-game-arena/kelas-9/persamaan-kuadrat/menyusun-persamaan" },
  { name: "PENERAPAN PERSAMAAN KUADRAT PADA PERMASALAHAN KONTEKSTUAL", path: "/math-game-arena/kelas-9/persamaan-kuadrat/penerapan" },
];

const PersamaanKuadratPage = () => (
  <GameSubtopicPage
    title="PERSAMAAN KUADRAT (PENGAYAAN)"
    subtopics={subtopics}
    backPath="/math-game-arena/kelas-9"
    backLabel="Kembali ke Kelas 9"
    icon="📈"
    kelasLabel="Kelas 9"
  />
);

export default PersamaanKuadratPage;
