import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN NOTASI PANGKAT", path: "/lkpd/kelas-9/bilangan-berpangkat/pengertian-notasi", icon: "📝" },
  { label: "SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT", path: "/lkpd/kelas-9/bilangan-berpangkat/sifat-operasi", icon: "⚡" },
  { label: "BENTUK AKAR", path: "/lkpd/kelas-9/bilangan-berpangkat/bentuk-akar", icon: "🌱" },
  { label: "NOTASI ILMIAH", path: "/lkpd/kelas-9/bilangan-berpangkat/notasi-ilmiah", icon: "🔬" },
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
