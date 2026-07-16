import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGANTAR STATISTIKA DAN PENGUMPULAN DATA", path: "/lkpd/kelas-9/statistika/pengantar-statistika", icon: "📚" },
  { label: "PENYAJIAN DATA", path: "/lkpd/kelas-9/statistika/penyajian-data", icon: "📊" },
  { label: "UKURAN PEMUSATAN DATA (RATA-RATA DAN RATA-RATA GABUNGAN)", path: "/lkpd/kelas-9/statistika/rata-rata", icon: "➕" },
  { label: "UKURAN PEMUSATAN DATA (MEDIAN DAN MODUS)", path: "/lkpd/kelas-9/statistika/median-modus", icon: "🎯" },
  { label: "UKURAN LETAK DATA (KUARTIL)", path: "/lkpd/kelas-9/statistika/kuartil", icon: "📐" },
  { label: "UKURAN PENYEBARAN DATA (JANGKAUAN, JANGKAUAN INTERKUARTIL, SIMPANGAN KUARTIL)", path: "/lkpd/kelas-9/statistika/jangkauan-simpangan", icon: "📉" },
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
