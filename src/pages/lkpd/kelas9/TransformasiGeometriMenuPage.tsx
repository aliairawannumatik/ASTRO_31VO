import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "TRANSLASI (PERGESERAN)", path: "", icon: "➡️" },
  { label: "REFLEKSI (PENCERMINAN)", path: "", icon: "🪞" },
  { label: "ROTASI (PERPUTARAN)", path: "", icon: "🔄" },
  { label: "DILATASI (PERKALIAN/PERUBAHAN UKURAN)", path: "", icon: "🔭" },
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
