import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "RUANG SAMPEL DAN TITIK SAMPEL", path: "", icon: "🎯" },
  { label: "PELUANG EMPIRIK DAN FREKUENSI RELATIF", path: "", icon: "📊" },
  { label: "PELUANG TEORETIK", path: "", icon: "🎲" },
  { label: "FREKUENSI HARAPAN", path: "", icon: "📈" },
  { label: "KOMPLEMEN SUATU KEJADIAN", path: "", icon: "🔄" },
  { label: "PELUANG KEJADIAN MAJEMUK", path: "", icon: "🔗" },
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
