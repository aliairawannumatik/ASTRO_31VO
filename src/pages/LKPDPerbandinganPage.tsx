import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PERBANDINGAN UMUM, SATUAN PEMBANDING DAN RASIO", path: "/lkpd/kelas-7/perbandingan/umum", icon: "⚖️" },
  { label: "PERBANDINGAN BERTINGKAT", path: "/coming-soon", icon: "📶" },
  { label: "PERBANDINGAN SENILAI DAN BERBALIK NILAI", path: "/coming-soon", icon: "🔄" },
  { label: "SKALA", path: "/coming-soon", icon: "🗺️" },
  { label: "PERBANDINGAN CAMPURAN", path: "/coming-soon", icon: "🔀" },
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