import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR PADA DIAGRAM CARTESIUS", path: "/lkpd/kelas-8/koordinat-cartesius/lkpd", icon: "📊" },
  { label: "POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN", path: "/lkpd/kelas-8/koordinat-cartesius/lkpd", icon: "📍" },
  { label: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "/lkpd/kelas-8/koordinat-cartesius/lkpd", icon: "📏" },
  { label: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS", path: "/lkpd/kelas-8/koordinat-cartesius/lkpd", icon: "🗺️" },
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
