import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV", path: "", icon: "📖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK", path: "", icon: "📈" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI", path: "", icon: "🔄" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI", path: "", icon: "➖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN", path: "", icon: "🔀" },
  { label: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV", path: "", icon: "🧮" },
  { label: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV", path: "", icon: "✅" },
];

const SPLDVMenuPage = () => (
  <MateriTopicPage
    title="LKPD SISTEM PERSAMAAN LINEAR DUA VARIABEL"
    emoji="⚖️"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default SPLDVMenuPage;
