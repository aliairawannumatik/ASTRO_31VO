import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BENTUK UMUM PERSAMAAN KUADRAT", path: "", icon: "📖" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN", path: "", icon: "✂️" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK", path: "", icon: "📐" },
  { label: "AKAR-AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT", path: "", icon: "🔩" },
  { label: "DISKRIMINAN", path: "", icon: "🔍" },
  { label: "MENYUSUN PERSAMAAN KUADRAT BARU", path: "", icon: "✏️" },
  { label: "PENERAPAN PERSAMAAN KUADRAT PADA PERMASALAHAN KONTEKSTUAL", path: "", icon: "🏗️" },
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
