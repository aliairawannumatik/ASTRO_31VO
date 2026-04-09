import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PERBANDINGAN UMUM, SATUAN PEMBANDING DAN RASIO", path: "/materi-matematika/kelas-7/perbandingan/umum", icon: "⚖️" },
  { label: "PERBANDINGAN BERTINGKAT", path: "/materi-matematika/kelas-7/perbandingan/bertingkat", icon: "📶" },
  { label: "PERBANDINGAN SENILAI DAN BERBALIK NILAI", path: "/materi-matematika/kelas-7/perbandingan/senilai", icon: "🔄" },
  { label: "SKALA", path: "/materi-matematika/kelas-7/perbandingan/skala", icon: "🗺️" },
  { label: "PERBANDINGAN CAMPURAN", path: "/materi-matematika/kelas-7/perbandingan/campuran", icon: "🔀" },
];

const PerbandinganPage = () => (
  <MateriTopicPage
    title="PERBANDINGAN"
    emoji="⚖️"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-7"
    backLabel="Kembali ke Kelas 7"
  />
);

export default PerbandinganPage;
