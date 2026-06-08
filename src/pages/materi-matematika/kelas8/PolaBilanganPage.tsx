import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN POLA, BARISAN BILANGAN DAN POLA-POLA KHUSUS", path: "/materi-matematika/kelas-8/pola-bilangan/pengertian-pola", icon: "📝" },
  { label: "POLA ARITMETIKA", path: "/materi-matematika/kelas-8/pola-bilangan/pola-aritmetika", icon: "➕" },
  { label: "POLA GEOMETRI", path: "/materi-matematika/kelas-8/pola-bilangan/pola-geometri", icon: "📐" },
];

const PolaBilanganPage = () => (
  <MateriTopicPage
    title="POLA BILANGAN"
    emoji="🔢"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-8"
    backLabel="Kembali ke Kelas 8"
  />
);

export default PolaBilanganPage;
