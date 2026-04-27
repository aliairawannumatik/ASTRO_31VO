import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "KUBUS", path: "/lkpd/kelas-8/bangun-ruang-sisi-datar/kubus", icon: "🎲" },
  { label: "BALOK", path: "/lkpd/kelas-8/bangun-ruang-sisi-datar/balok", icon: "📦" },
  { label: "PRISMA", path: "/lkpd/kelas-8/bangun-ruang-sisi-datar/prisma", icon: "🔷" },
  { label: "LIMAS", path: "/lkpd/kelas-8/bangun-ruang-sisi-datar/limas", icon: "🔺" },
  { label: "BANGUN RUANG SISI DATAR GABUNGAN", path: "/lkpd/kelas-8/bangun-ruang-sisi-datar/gabungan", icon: "🔗" },
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
