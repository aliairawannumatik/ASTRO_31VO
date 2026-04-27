import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN RELASI DAN PENYAJIANNYA", path: "", icon: "🔗" },
  { label: "PENGERTIAN FUNGSI DAN PENYAJIANNYA", path: "", icon: "📈" },
  { label: "MENENTUKAN BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU", path: "", icon: "🔢" },
  { label: "NOTASI DAN RUMUS FUNGSI", path: "", icon: "📝" },
  { label: "GRAFIK FUNGSI", path: "", icon: "📊" },
];

const RelasiFungsiMenuPage = () => (
  <MateriTopicPage
    title="LKPD RELASI DAN FUNGSI"
    emoji="🔗"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default RelasiFungsiMenuPage;
