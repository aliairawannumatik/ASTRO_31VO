import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN POLA DAN BARISAN BILANGAN", path: "/lkpd/kelas-8/pola-bilangan/lkpd", icon: "📝" },
  { label: "POLA-POLA KHUSUS", path: "/lkpd/kelas-8/pola-bilangan/lkpd", icon: "⭐" },
  { label: "BARISAN DAN DERET ARITMETIKA", path: "/lkpd/kelas-8/pola-bilangan/lkpd", icon: "➕" },
  { label: "BARISAN DAN DERET GEOMETRI", path: "/lkpd/kelas-8/pola-bilangan/lkpd", icon: "📐" },
];

const PolaBilanganMenuPage = () => (
  <MateriTopicPage
    title="LKPD POLA BILANGAN"
    emoji="🔢"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default PolaBilanganMenuPage;
