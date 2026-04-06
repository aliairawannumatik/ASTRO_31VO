import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "RUANG SAMPEL DAN TITIK SAMPEL", path: "/materi-matematika/kelas-9/peluang/ruang-sampel", icon: "🎯" },
  { label: "PELUANG EMPIRIK DAN FREKUENSI RELATIF", path: "/materi-matematika/kelas-9/peluang/peluang-empirik", icon: "📊" },
  { label: "PELUANG TEORETIK", path: "/materi-matematika/kelas-9/peluang/peluang-teoretik", icon: "🎲" },
  { label: "FREKUENSI HARAPAN", path: "/materi-matematika/kelas-9/peluang/frekuensi-harapan", icon: "📈" },
  { label: "KOMPLEMEN SUATU KEJADIAN", path: "/materi-matematika/kelas-9/peluang/komplemen", icon: "🔄" },
];

const PeluangPage = () => (
  <MateriTopicPage
    title="PELUANG"
    emoji="🎲"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default PeluangPage;
