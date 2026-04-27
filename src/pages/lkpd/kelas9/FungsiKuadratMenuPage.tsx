import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BENTUK UMUM DAN KARAKTERISTIK GRAFIK", path: "", icon: "📖" },
  { label: "TITIK POTONG TERHADAP SUMBU-SUMBU", path: "", icon: "🎯" },
  { label: "SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)", path: "", icon: "🪞" },
  { label: "MENGGAMBAR GRAFIK FUNGSI KUADRAT", path: "", icon: "✏️" },
  { label: "MENYUSUN FUNGSI KUADRAT", path: "", icon: "🔧" },
  { label: "PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM)", path: "", icon: "🏆" },
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
