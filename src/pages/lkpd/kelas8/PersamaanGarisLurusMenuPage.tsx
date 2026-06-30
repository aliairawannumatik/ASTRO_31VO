import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "BUKU ANIMASI: PERSAMAAN GARIS LURUS", path: "/lkpd/kelas-8/persamaan-garis-lurus/buku-animasi", icon: "🎬" },
  { label: "GRAFIK PERSAMAAN GARIS LURUS", path: "/lkpd/kelas-8/persamaan-garis-lurus/lkpd", icon: "📈" },
  { label: "GRADIEN (KEMIRINGAN GARIS)", path: "/lkpd/kelas-8/persamaan-garis-lurus/gradien", icon: "📐" },
  { label: "MENENTUKAN PERSAMAAN GARIS LURUS", path: "/lkpd/kelas-8/persamaan-garis-lurus/menentukan-pgl", icon: "✏️" },
  { label: "HUBUNGAN 2 GARIS", path: "/lkpd/kelas-8/persamaan-garis-lurus/hubungan-2-garis", icon: "↔️" },
  { label: "APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL", path: "/lkpd/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual", icon: "🏗️" },
];

const PersamaanGarisLurusMenuPage = () => (
  <MateriTopicPage
    title="LKPD PERSAMAAN GARIS LURUS"
    emoji="📈"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default PersamaanGarisLurusMenuPage;
