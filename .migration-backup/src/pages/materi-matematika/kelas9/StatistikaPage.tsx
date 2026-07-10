import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGANTAR STATISTIKA, PENGUMPULAN DATA DAN PENYAJIAN DATA", path: "/materi-matematika/kelas-9/statistika/pengantar", icon: "📚" },
  { label: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)", path: "/materi-matematika/kelas-9/statistika/rata-rata", icon: "➕" },
  { label: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)", path: "/materi-matematika/kelas-9/statistika/median-modus", icon: "🎯" },
  { label: "UKURAN LETAK DATA (KUARTIL)", path: "/materi-matematika/kelas-9/statistika/kuartil", icon: "📐" },
  { label: "UKURAN PENYEBARAN DATA (JANGKAUAN, JANGKAUAN INTERKUARTIL, SIMPANGAN KUARTIL)", path: "/materi-matematika/kelas-9/statistika/penyebaran-data", icon: "📉" },
];

const StatistikaPage = () => (
  <MateriTopicPage
    title="STATISTIKA"
    emoji="📊"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default StatistikaPage;
