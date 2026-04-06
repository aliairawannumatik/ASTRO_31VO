import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "KUBUS", path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/kubus", icon: "🎲" },
  { label: "BALOK", path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/balok", icon: "📦" },
  { label: "PRISMA", path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/prisma", icon: "🔷" },
  { label: "LIMAS", path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/limas", icon: "🔺" },
  { label: "BANGUN RUANG SISI DATAR GABUNGAN", path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/gabungan", icon: "🔗" },
];

const BangunRuangSisiDatarPage = () => (
  <MateriTopicPage
    title="BANGUN RUANG SISI DATAR"
    emoji="📦"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-8"
    backLabel="Kembali ke Kelas 8"
  />
);

export default BangunRuangSisiDatarPage;
