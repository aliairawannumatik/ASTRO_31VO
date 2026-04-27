import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN", path: "", icon: "📖" },
  { label: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN", path: "", icon: "📏" },
  { label: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)", path: "", icon: "↔️" },
  { label: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)", path: "", icon: "↕️" },
  { label: "SABUK LILITAN MINIMAL (PENERAPAN)", path: "", icon: "🌀" },
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
