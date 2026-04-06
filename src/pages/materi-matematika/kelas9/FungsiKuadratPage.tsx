import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BENTUK UMUM DAN KARAKTERISTIK GRAFIK", path: "/materi-matematika/kelas-9/fungsi-kuadrat/bentuk-umum-karakteristik", icon: "📖" },
  { label: "TITIK POTONG TERHADAP SUMBU-SUMBU", path: "/materi-matematika/kelas-9/fungsi-kuadrat/titik-potong", icon: "🎯" },
  { label: "SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)", path: "/materi-matematika/kelas-9/fungsi-kuadrat/sumbu-simetri", icon: "🪞" },
  { label: "MENGGAMBAR GRAFIK FUNGSI KUADRAT", path: "/materi-matematika/kelas-9/fungsi-kuadrat/menggambar-grafik", icon: "✏️" },
  { label: "MENYUSUN FUNGSI KUADRAT", path: "/materi-matematika/kelas-9/fungsi-kuadrat/menyusun-fungsi", icon: "🔧" },
  { label: "PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM)", path: "/materi-matematika/kelas-9/fungsi-kuadrat/penerapan-nilai-maks-min", icon: "🏆" },
];

const FungsiKuadratPage = () => (
  <MateriTopicPage
    title="FUNGSI KUADRAT (PENGAYAAN)"
    emoji="📈"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default FungsiKuadratPage;
