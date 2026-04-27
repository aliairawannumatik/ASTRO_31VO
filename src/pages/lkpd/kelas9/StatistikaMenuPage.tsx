import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGANTAR STATISTIKA DAN PENGUMPULAN DATA", path: "", icon: "📚" },
  { label: "PENYAJIAN DATA", path: "", icon: "📊" },
  { label: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)", path: "", icon: "➕" },
  { label: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)", path: "", icon: "🎯" },
  { label: "UKURAN LETAK DATA (KUARTIL)", path: "", icon: "📐" },
  { label: "UKURAN PENYEBARAN DATA (JANGKAUAN, JANGKAUAN INTERKUARTIL, SIMPANGAN KUARTIL)", path: "", icon: "📉" },
];

const StatistikaMenuPage = () => (
  <MateriTopicPage
    title="LKPD STATISTIKA"
    emoji="📊"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default StatistikaMenuPage;
