import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/arti-pecahan", icon: "🔢" },
  { label: "PECAHAN CAMPURAN DAN PERSEN", path: "/materi-matematika/kelas-7/bilangan-rasional/pecahan-campuran", icon: "🔣" },
  { label: "PENJUMLAHAN DAN PENGURANGAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-pecahan", icon: "➕" },
  { label: "PERKALIAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian-pecahan", icon: "✖️" },
  { label: "PEMBAGIAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian-pecahan", icon: "➗" },
  { label: "BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/bentuk-desimal", icon: "📊" },
  { label: "PENJUMLAHAN DAN PENGURANGAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-bentuk-desimal", icon: "➕" },
  { label: "PERKALIAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian-bentuk-desimal", icon: "✖️" },
  { label: "PEMBAGIAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian-bentuk-desimal", icon: "➗" },
  { label: "PEMBULATAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/pembulatan-bentuk-desimal", icon: "🎯" },
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
