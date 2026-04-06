import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "DEFINISI KESEBANGUNAN DAN KEKONGRUENAN", path: "/materi-matematika/kelas-9/kesebangunan-kekongruenan/definisi", icon: "📖" },
  { label: "MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN", path: "/materi-matematika/kelas-9/kesebangunan-kekongruenan/menghitung-panjang-rusuk", icon: "📏" },
  { label: "SEGITIGA – SEGITIGA YANG SEBANGUN", path: "/materi-matematika/kelas-9/kesebangunan-kekongruenan/segitiga-sebangun", icon: "🔺" },
  { label: "MENEMUKAN PERBANDINGAN/RASIO RUSUK-RUSUK SEGITIGA SIKU SIKU DENGAN KONSEP KESEBANGUNAN", path: "/materi-matematika/kelas-9/kesebangunan-kekongruenan/perbandingan-rusuk-siku-siku", icon: "↔️" },
  { label: "KEKONGRUENAN PADA BANGUN DATAR", path: "/materi-matematika/kelas-9/kesebangunan-kekongruenan/kekongruenan-bangun-datar", icon: "🔷" },
];

const KesebangunanKekongruenPage = () => (
  <MateriTopicPage
    title="KESEBANGUNAN DAN KEKONGRUENAN"
    emoji="🔷"
    kelas="Kelas 9"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-9"
    backLabel="Kembali ke Kelas 9"
  />
);

export default KesebangunanKekongruenPage;
