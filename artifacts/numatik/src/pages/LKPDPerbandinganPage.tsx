import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PERBANDINGAN UMUM, SATUAN PEMBANDING DAN RASIO", path: "/lkpd/kelas-7/perbandingan/umum", icon: "⚖️" },
  { label: "PERBANDINGAN BERTINGKAT", path: "/lkpd/kelas-7/perbandingan/bertingkat", icon: "📶" },
  { label: "PERBANDINGAN SENILAI DAN BERBALIK NILAI", path: "/lkpd/kelas-7/perbandingan/senilai-berbalik", icon: "🔄" },
  { label: "SKALA", path: "/lkpd/kelas-7/perbandingan/skala", icon: "🗺️" },
  { label: "PERBANDINGAN CAMPURAN", path: "/lkpd/kelas-7/perbandingan/campuran", icon: "🔀" },
];

const LKPDPerbandinganPage = () => (
  <MateriTopicPage
    title="LKPD PERBANDINGAN"
    emoji="⚖️"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default LKPDPerbandinganPage;