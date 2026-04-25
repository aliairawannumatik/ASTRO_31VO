import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENJUMLAHAN BILANGAN BULAT", path: "/lkpd/kelas-7/bilangan-bulat/penjumlahan", icon: "➕" },
  { label: "PENGURANGAN BILANGAN BULAT", path: "/lkpd/kelas-7/bilangan-bulat/pengurangan", icon: "➖" },
  { label: "PERKALIAN BILANGAN BULAT", path: "/lkpd/kelas-7/bilangan-bulat/perkalian", icon: "✖️" },
  { label: "PEMBAGIAN BILANGAN BULAT", path: "/lkpd/kelas-7/bilangan-bulat/pembagian", icon: "➗" },
  { label: "OPERASI HITUNG CAMPURAN", path: "/lkpd/kelas-7/bilangan-bulat/operasi-campuran", icon: "🔢" },
  { label: "KPK DAN FPB", path: "/lkpd/kelas-7/bilangan-bulat/kpk-fpb", icon: "🌐" },
  { label: "GAME PESAWAT TEMBAK METEOR", path: "/lkpd/kelas-7/bilangan-bulat/pesawat-tembak-meteor", icon: "🚀" },
];

const BilanganBulatMenuPage = () => (
  <MateriTopicPage
    title="LKPD BILANGAN BULAT"
    emoji="🔢"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default BilanganBulatMenuPage;
