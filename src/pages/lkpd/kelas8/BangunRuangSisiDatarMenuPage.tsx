import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "KUBUS", path: "", icon: "🎲" },
  { label: "BALOK", path: "", icon: "📦" },
  { label: "PRISMA", path: "", icon: "🔷" },
  { label: "LIMAS", path: "", icon: "🔺" },
  { label: "BANGUN RUANG SISI DATAR GABUNGAN", path: "", icon: "🔗" },
];

const BangunRuangSisiDatarMenuPage = () => (
  <MateriTopicPage
    title="LKPD BANGUN RUANG SISI DATAR"
    emoji="📦"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default BangunRuangSisiDatarMenuPage;
