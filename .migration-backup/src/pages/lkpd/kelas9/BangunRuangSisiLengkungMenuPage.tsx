import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "TABUNG", path: "/lkpd/kelas-9/bangun-ruang-sisi-lengkung/tabung", icon: "🥫" },
  { label: "KERUCUT", path: "/lkpd/kelas-9/bangun-ruang-sisi-lengkung/kerucut", icon: "🍦" },
  { label: "BOLA", path: "/lkpd/kelas-9/bangun-ruang-sisi-lengkung/bola", icon: "⚽" },
  { label: "PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG", path: "/lkpd/kelas-9/bangun-ruang-sisi-lengkung/perubahan-luas-volume", icon: "📐" },
  { label: "BANGUN RUANG SISI LENGKUNG GABUNGAN", path: "/lkpd/kelas-9/bangun-ruang-sisi-lengkung/gabungan", icon: "🔗" },
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
