import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BENTUK UMUM PERSAMAAN KUADRAT", path: "/lkpd/kelas-9/persamaan-kuadrat/bentuk-umum", icon: "📖" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN", path: "/lkpd/kelas-9/persamaan-kuadrat/pemfaktoran", icon: "✂️" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK", path: "/lkpd/kelas-9/persamaan-kuadrat/rumus-kuadratik", icon: "📐" },
  { label: "AKAR-AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT", path: "/lkpd/kelas-9/persamaan-kuadrat/pelengkap-kuadrat", icon: "🔩" },
  { label: "DISKRIMINAN", path: "/lkpd/kelas-9/persamaan-kuadrat/diskriminan", icon: "🔍" },
  { label: "MENYUSUN PERSAMAAN KUADRAT BARU", path: "/lkpd/kelas-9/persamaan-kuadrat/menyusun-baru", icon: "✏️" },
  { label: "PENERAPAN PERSAMAAN KUADRAT PADA PERMASALAHAN KONTEKSTUAL", path: "/lkpd/kelas-9/persamaan-kuadrat/penerapan-kontekstual", icon: "🏗️" },
];

const PersamaanKuadratMenuPage = () => (
  <MateriTopicPage
    title="LKPD PERSAMAAN KUADRAT (PENGAYAAN)"
    emoji="📐"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default PersamaanKuadratMenuPage;
