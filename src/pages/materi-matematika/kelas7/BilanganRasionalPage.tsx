import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/arti-pecahan", icon: "🔢" },
  { label: "PECAHAN CAMPURAN DAN PERSEN", path: "/materi-matematika/kelas-7/bilangan-rasional/pecahan-campuran", icon: "🔣" },
  { label: "PENJUMLAHAN DAN PENGURANGAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan", icon: "➕" },
  { label: "PERKALIAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian", icon: "✖️" },
  { label: "PEMBAGIAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian", icon: "➗" },
  { label: "BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/bentuk-desimal", icon: "📊" },
  { label: "PENJUMLAHAN DAN PENGURANGAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-desimal", icon: "➕" },
  { label: "PERKALIAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian-desimal", icon: "✖️" },
  { label: "PEMBAGIAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian-desimal", icon: "➗" },
  { label: "PEMBULATAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/pembulatan-desimal", icon: "🎯" },
];

const BilanganRasionalPage = () => (
  <MateriTopicPage
    title="BILANGAN RASIONAL"
    emoji="🔵"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-7"
    backLabel="Kembali ke Kelas 7"
  />
);

export default BilanganRasionalPage;
