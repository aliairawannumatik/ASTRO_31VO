import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BENTUK UMUM DAN KARAKTERISTIK GRAFIK", path: "bentuk-umum-karakteristik", icon: "📖" },
  { label: "TITIK POTONG TERHADAP SUMBU-SUMBU", path: "titik-potong", icon: "🎯" },
  { label: "SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)", path: "sumbu-simetri-puncak", icon: "🪞" },
  { label: "MENGGAMBAR GRAFIK FUNGSI KUADRAT", path: "menggambar-grafik", icon: "✏️" },
  { label: "MENYUSUN FUNGSI KUADRAT", path: "menyusun-fungsi", icon: "🔧" },
  { label: "PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM)", path: "penerapan-maks-min", icon: "🏆" },
];

const FungsiKuadratMenuPage = () => (
  <MateriTopicPage
    title="LKPD FUNGSI KUADRAT (PENGAYAAN)"
    emoji="📈"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default FungsiKuadratMenuPage;
