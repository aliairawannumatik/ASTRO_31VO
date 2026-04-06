import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV", path: "/materi-matematika/kelas-8/spldv/definisi", icon: "📖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK", path: "/materi-matematika/kelas-8/spldv/metode-grafik", icon: "📈" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI", path: "/materi-matematika/kelas-8/spldv/metode-substitusi", icon: "🔄" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI", path: "/materi-matematika/kelas-8/spldv/metode-eliminasi", icon: "➖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN", path: "/materi-matematika/kelas-8/spldv/metode-campuran", icon: "🔀" },
  { label: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV", path: "/materi-matematika/kelas-8/spldv/model-spldv", icon: "🧮" },
  { label: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV", path: "/materi-matematika/kelas-8/spldv/penyelesaian-masalah", icon: "✅" },
];

const SPLDVPage = () => (
  <MateriTopicPage
    title="SISTEM PERSAMAAN LINEAR DUA VARIABEL"
    emoji="➕"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-8"
    backLabel="Kembali ke Kelas 8"
  />
);

export default SPLDVPage;
