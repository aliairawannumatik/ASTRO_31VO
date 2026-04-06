import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "TRANSLASI (PERGESERAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/translasi", icon: "➡️" },
  { label: "REFLEKSI (PENCERMINAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/refleksi", icon: "🪞" },
  { label: "ROTASI (PERPUTARAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/rotasi", icon: "🔄" },
  { label: "DILATASI (PERKALIAN/PERUBAHAN UKURAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/dilatasi", icon: "🔭" },
];

const TransformasiGeometriPage = () => (
  <MateriTopicPage
    title="TRANSFORMASI GEOMETRI"
    emoji="🔄"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default TransformasiGeometriPage;
