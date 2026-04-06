import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENJUMLAHAN BILANGAN BULAT", path: "/materi-matematika/kelas-7/bilangan-bulat/penjumlahan", icon: "➕" },
  { label: "PENGURANGAN BILANGAN BULAT", path: "/materi-matematika/kelas-7/bilangan-bulat/pengurangan", icon: "➖" },
  { label: "PERKALIAN BILANGAN BULAT", path: "/materi-matematika/kelas-7/bilangan-bulat/perkalian", icon: "✖️" },
  { label: "PEMBAGIAN BILANGAN BULAT", path: "/materi-matematika/kelas-7/bilangan-bulat/pembagian", icon: "➗" },
  { label: "OPERASI HITUNG CAMPURAN BILANGAN BULAT", path: "/materi-matematika/kelas-7/bilangan-bulat/operasi-campuran", icon: "🔢" },
  { label: "KPK DAN FPB", path: "/materi-matematika/kelas-7/bilangan-bulat/kpk-fpb", icon: "🌐" },
];

const BilanganBulatPage = () => (
  <MateriTopicPage
    title="BILANGAN BULAT"
    emoji="🔢"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-7"
    backLabel="Kembali ke Kelas 7"
  />
);

export default BilanganBulatPage;
