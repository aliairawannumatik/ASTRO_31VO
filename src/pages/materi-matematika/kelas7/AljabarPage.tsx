import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR", path: "/materi-matematika/kelas-7/aljabar/pengertian-unsur", icon: "📝" },
  { label: "PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR", path: "/materi-matematika/kelas-7/aljabar/penjumlahan-pengurangan", icon: "➕" },
  { label: "PERKALIAN BENTUK ALJABAR", path: "/materi-matematika/kelas-7/aljabar/perkalian", icon: "✖️" },
  { label: "PEMBAGIAN BENTUK ALJABAR", path: "/materi-matematika/kelas-7/aljabar/pembagian", icon: "➗" },
  { label: "PEMANGKATAN BENTUK ALJABAR", path: "/materi-matematika/kelas-7/aljabar/pemangkatan", icon: "⬆️" },
  { label: "SUBSTITUSI BILANGAN PADA BENTUK ALJABAR", path: "/materi-matematika/kelas-7/aljabar/substitusi", icon: "🔄" },
  { label: "FAKTORISASI BENTUK ALJABAR", path: "/materi-matematika/kelas-7/aljabar/faktorisasi", icon: "🔬" },
  { label: "MENYEDERHANAKAN PECAHAN ALJABAR", path: "/materi-matematika/kelas-7/aljabar/operasi-pecahan", icon: "🔣" },
];

const AljabarPage = () => (
  <MateriTopicPage
    title="ALJABAR"
    emoji="🔣"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-7"
    backLabel="Kembali ke Kelas 7"
  />
);

export default AljabarPage;
