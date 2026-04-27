import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "DEFINISI KESEBANGUNAN DAN KEKONGRUENAN", path: "", icon: "📖" },
  { label: "MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN", path: "", icon: "📏" },
  { label: "SEGITIGA – SEGITIGA YANG SEBANGUN", path: "", icon: "🔺" },
  { label: "MENEMUKAN PERBANDINGAN/RASIO RUSUK-RUSUK SEGITIGA SIKU SIKU DENGAN KONSEP KESEBANGUNAN", path: "", icon: "↔️" },
  { label: "KEKONGRUENAN PADA BANGUN DATAR", path: "", icon: "🔷" },
];

const KesebangunanKekongruenanMenuPage = () => (
  <MateriTopicPage
    title="LKPD KESEBANGUNAN DAN KEKONGRUENAN"
    emoji="🔷"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/lkpd/kelas-9"
    backLabel="Kembali ke LKPD Kelas 9"
    contextLabel="LKPD"
  />
);

export default KesebangunanKekongruenanMenuPage;
