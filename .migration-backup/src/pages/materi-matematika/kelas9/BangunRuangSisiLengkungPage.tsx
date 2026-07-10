import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "TABUNG", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/tabung", icon: "🥫" },
  { label: "KERUCUT", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/kerucut", icon: "🍦" },
  { label: "BOLA", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/bola", icon: "⚽" },
  { label: "PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume", icon: "📐" },
  { label: "BANGUN RUANG SISI LENGKUNG GABUNGAN", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/gabungan", icon: "🔗" },
];

const BangunRuangSisiLengkungPage = () => (
  <MateriTopicPage
    title="BANGUN RUANG SISI LENGKUNG"
    emoji="🌐"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default BangunRuangSisiLengkungPage;
