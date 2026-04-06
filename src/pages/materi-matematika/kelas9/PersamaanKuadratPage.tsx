import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BENTUK UMUM PERSAMAAN KUADRAT", path: "/materi-matematika/kelas-9/persamaan-kuadrat/bentuk-umum", icon: "📖" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pemfaktoran", icon: "✂️" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK", path: "/materi-matematika/kelas-9/persamaan-kuadrat/rumus-kuadratik", icon: "📐" },
  { label: "AKAR-AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pelengkap-kuadrat", icon: "🔩" },
  { label: "DISKRIMINAN", path: "/materi-matematika/kelas-9/persamaan-kuadrat/diskriminan", icon: "🔍" },
  { label: "MENYUSUN PERSAMAAN KUADRAT BARU", path: "/materi-matematika/kelas-9/persamaan-kuadrat/menyusun-persamaan-baru", icon: "✏️" },
  { label: "PENERAPAN PERSAMAAN KUADRAT PADA PERMASALAHAN KONTEKSTUAL", path: "/materi-matematika/kelas-9/persamaan-kuadrat/penerapan-kontekstual", icon: "🏗️" },
];

const PersamaanKuadratPage = () => (
  <MateriTopicPage
    title="PERSAMAAN KUADRAT (PENGAYAAN)"
    emoji="🔣"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default PersamaanKuadratPage;
