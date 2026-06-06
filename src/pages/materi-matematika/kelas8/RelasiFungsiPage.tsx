import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN RELASI DAN PENYAJIANNYA", path: "/materi-matematika/kelas-8/relasi-dan-fungsi/pengertian-relasi", icon: "🔗" },
  { label: "PENGERTIAN FUNGSI DAN PENYAJIANNYA", path: "/materi-matematika/kelas-8/relasi-dan-fungsi/pengertian-fungsi", icon: "📈" },
  { label: "MENENTUKAN BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU", path: "/materi-matematika/kelas-8/relasi-dan-fungsi/banyak-fungsi", icon: "🔢" },
  { label: "NOTASI DAN RUMUS FUNGSI", path: "/materi-matematika/kelas-8/relasi-dan-fungsi/notasi-fungsi", icon: "📝" },
  { label: "GRAFIK FUNGSI", path: "/materi-matematika/kelas-8/relasi-dan-fungsi/grafik-fungsi", icon: "📊" },
];

const RelasiFungsiPage = () => (
  <MateriTopicPage
    title="RELASI DAN FUNGSI"
    emoji="🔗"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-8"
    backLabel="Kembali ke Kelas 8"
  />
);

export default RelasiFungsiPage;
