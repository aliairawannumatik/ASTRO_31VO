import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "HUBUNGAN 2 GARIS", path: "/materi-matematika/kelas-7/garis-dan-sudut/hubungan-dua-garis", icon: "↔️" },
  { label: "SUDUT PELURUS, SUDUT PENYIKU DAN SUDUT BERTOLAK BELAKANG", path: "/materi-matematika/kelas-7/garis-dan-sudut/sudut-pelurus-penyiku-bertolak", icon: "📐" },
  { label: "SIFAT SUDUT DUA GARIS SEJAJAR JIKA DIPOTONG GARIS LAIN", path: "/materi-matematika/kelas-7/garis-dan-sudut/sifat-sudut-sejajar", icon: "📏" },
  { label: "JUMLAH SUDUT PADA SEGI BANYAK", path: "/materi-matematika/kelas-7/garis-dan-sudut/jumlah-sudut-segi-banyak", icon: "🔺" },
];

const GarisDanSudutPage = () => (
  <MateriTopicPage
    title="GARIS DAN SUDUT"
    emoji="📐"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-7"
    backLabel="Kembali ke Kelas 7"
  />
);

export default GarisDanSudutPage;
