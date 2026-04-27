import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "GRAFIK PERSAMAAN GARIS LURUS", path: "/lkpd/kelas-8/persamaan-garis-lurus/lkpd", icon: "📈" },
  { label: "GRADIEN (KEMIRINGAN GARIS)", path: "/lkpd/kelas-8/persamaan-garis-lurus/lkpd", icon: "📐" },
  { label: "MENENTUKAN PERSAMAAN GARIS LURUS", path: "/lkpd/kelas-8/persamaan-garis-lurus/lkpd", icon: "✏️" },
  { label: "HUBUNGAN 2 GARIS", path: "/lkpd/kelas-8/persamaan-garis-lurus/lkpd", icon: "↔️" },
  { label: "APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL", path: "/lkpd/kelas-8/persamaan-garis-lurus/lkpd", icon: "🏗️" },
];

const PersamaanGarisLurusMenuPage = () => (
  <MateriTopicPage
    title="LKPD PERSAMAAN GARIS LURUS"
    emoji="📈"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default PersamaanGarisLurusMenuPage;
