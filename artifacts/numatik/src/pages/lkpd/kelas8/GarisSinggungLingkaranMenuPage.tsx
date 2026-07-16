import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN", path: "/lkpd/kelas-8/garis-singgung-lingkaran/lkpd", icon: "📖" },
  { label: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN", path: "/lkpd/kelas-8/garis-singgung-lingkaran/lkpd", icon: "📏" },
  { label: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)", path: "/lkpd/kelas-8/garis-singgung-lingkaran/lkpd", icon: "↔️" },
  { label: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)", path: "/lkpd/kelas-8/garis-singgung-lingkaran/lkpd", icon: "↕️" },
  { label: "SABUK LILITAN MINIMAL (PENERAPAN)", path: "/lkpd/kelas-8/garis-singgung-lingkaran/lkpd", icon: "🌀" },
];

const GarisSinggungLingkaranMenuPage = () => (
  <MateriTopicPage
    title="LKPD GARIS SINGGUNG LINGKARAN"
    emoji="🌀"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default GarisSinggungLingkaranMenuPage;
