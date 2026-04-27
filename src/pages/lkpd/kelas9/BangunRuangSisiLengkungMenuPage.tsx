import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "TABUNG", path: "", icon: "🥫" },
  { label: "KERUCUT", path: "", icon: "🍦" },
  { label: "BOLA", path: "", icon: "⚽" },
  { label: "PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG", path: "", icon: "📐" },
  { label: "BANGUN RUANG SISI LENGKUNG GABUNGAN", path: "", icon: "🔗" },
];

const BangunRuangSisiLengkungMenuPage = () => (
  <MateriTopicPage
    title="LKPD BANGUN RUANG SISI LENGKUNG"
    emoji="🥫"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default BangunRuangSisiLengkungMenuPage;
