import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS", path: "/materi-matematika/kelas-8/koordinat-cartesius/unsur-unsur", icon: "📊" },
  { label: "POSISI RELATIF TITIK TERHADAP SEMBARANG TITIK ACUAN DAN SUATU GARIS", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-dan-garis", icon: "📍" },
  { label: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "/materi-matematika/kelas-8/koordinat-cartesius/jarak-titik-garis", icon: "📏" },
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
