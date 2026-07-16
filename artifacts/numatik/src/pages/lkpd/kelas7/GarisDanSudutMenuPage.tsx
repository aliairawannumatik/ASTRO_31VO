import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "HUBUNGAN 2 GARIS", path: "/lkpd/kelas-7/garis-dan-sudut/lkpd", icon: "↔️" },
  { label: "SUDUT PELURUS, SUDUT PENYIKU DAN SUDUT BERTOLAK BELAKANG", path: "/lkpd/kelas-7/garis-dan-sudut/lkpd", icon: "📐" },
  { label: "SIFAT SUDUT DUA GARIS SEJAJAR JIKA DIPOTONG GARIS LAIN", path: "/lkpd/kelas-7/garis-dan-sudut/lkpd", icon: "📏" },
  { label: "JUMLAH SUDUT PADA SEGI BANYAK", path: "/lkpd/kelas-7/garis-dan-sudut/lkpd", icon: "🔺" },
];

const GarisDanSudutMenuPage = () => (
  <MateriTopicPage
    title="LKPD GARIS DAN SUDUT"
    emoji="📐"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default GarisDanSudutMenuPage;
