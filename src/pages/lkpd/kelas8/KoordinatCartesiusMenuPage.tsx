import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR PADA DIAGRAM CARTESIUS", path: "", icon: "📊" },
  { label: "POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN", path: "", icon: "📍" },
  { label: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "", icon: "📏" },
  { label: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS", path: "", icon: "🗺️" },
];

const KoordinatCartesiusMenuPage = () => (
  <MateriTopicPage
    title="LKPD KOORDINAT CARTESIUS"
    emoji="📊"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default KoordinatCartesiusMenuPage;
