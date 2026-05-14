import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV", path: "/lkpd/kelas-8/spldv/lkpd", icon: "📖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK", path: "/lkpd/kelas-8/spldv/lkpd", icon: "📈" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI", path: "/lkpd/kelas-8/spldv/lkpd", icon: "🔄" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI", path: "/lkpd/kelas-8/spldv/metode-eliminasi", icon: "➖" },
  { label: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN", path: "/lkpd/kelas-8/spldv/lkpd", icon: "🔀" },
  { label: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV", path: "/lkpd/kelas-8/spldv/lkpd", icon: "🧮" },
  { label: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV", path: "/lkpd/kelas-8/spldv/lkpd", icon: "✅" },
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
