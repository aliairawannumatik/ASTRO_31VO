import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "RUANG SAMPEL DAN TITIK SAMPEL", path: "/lkpd/kelas-9/peluang/ruang-sampel", icon: "🎯" },
  { label: "PELUANG EMPIRIK DAN FREKUENSI RELATIF", path: "/lkpd/kelas-9/peluang/peluang-empirik", icon: "📊" },
  { label: "PELUANG TEORETIK", path: "/lkpd/kelas-9/peluang/peluang-teoretik", icon: "🎲" },
  { label: "FREKUENSI HARAPAN", path: "/lkpd/kelas-9/peluang/frekuensi-harapan", icon: "📈" },
  { label: "KOMPLEMEN SUATU KEJADIAN", path: "/lkpd/kelas-9/peluang/komplemen", icon: "🔄" },
  { label: "PELUANG KEJADIAN MAJEMUK", path: "/lkpd/kelas-9/peluang/kejadian-majemuk", icon: "🔗" },
];

const PeluangMenuPage = () => (
  <MateriTopicPage
    title="LKPD PELUANG"
    emoji="🎲"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default PeluangMenuPage;
