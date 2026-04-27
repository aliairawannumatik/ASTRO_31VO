import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN NOTASI PANGKAT", path: "", icon: "📝" },
  { label: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT", path: "", icon: "⚡" },
  { label: "BENTUK AKAR", path: "", icon: "🌱" },
  { label: "NOTASI ILMIAH", path: "", icon: "🔬" },
];

const BilanganBerpangkatMenuPage = () => (
  <MateriTopicPage
    title="LKPD BILANGAN BERPANGKAT"
    emoji="⚡"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default BilanganBerpangkatMenuPage;
