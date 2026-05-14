import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS", path: "/materi-matematika/kelas-8/koordinat-cartesius/unsur-unsur", icon: "📊" },
  { label: "POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-acuan", icon: "📍" },
  { label: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "/materi-matematika/kelas-8/koordinat-cartesius/jarak-titik-garis", icon: "📏" },
  { label: "POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-garis", icon: "🗺️" },
];

const KoordinatCartesiusPage = () => (
  <MateriTopicPage
    title="KOORDINAT KARTESIUS"
    emoji="📊"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-8"
    backLabel="Kembali ke Kelas 8"
  />
);

export default KoordinatCartesiusPage;
