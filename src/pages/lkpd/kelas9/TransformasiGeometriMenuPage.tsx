import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "TRANSLASI (PERGESERAN)", path: "/lkpd/kelas-9/transformasi-geometri/translasi", icon: "➡️" },
  { label: "REFLEKSI (PENCERMINAN)", path: "/lkpd/kelas-9/transformasi-geometri/refleksi", icon: "🪞" },
  { label: "ROTASI (PERPUTARAN)", path: "/lkpd/kelas-9/transformasi-geometri/rotasi", icon: "🔄" },
  { label: "DILATASI (PERKALIAN/PERUBAHAN UKURAN)", path: "/lkpd/kelas-9/transformasi-geometri/dilatasi", icon: "🔭" },
];

const TransformasiGeometriMenuPage = () => (
  <MateriTopicPage
    title="LKPD TRANSFORMASI GEOMETRI"
    emoji="🔭"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default TransformasiGeometriMenuPage;
