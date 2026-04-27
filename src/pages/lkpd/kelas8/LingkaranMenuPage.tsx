import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR LINGKARAN", path: "/lkpd/kelas-8/lingkaran/lkpd", icon: "⭕" },
  { label: "KELILING DAN LUAS LINGKARAN", path: "/lkpd/kelas-8/lingkaran/lkpd", icon: "📏" },
  { label: "KAITAN LINGKARAN DENGAN BANGUN DATAR LAINNYA", path: "/lkpd/kelas-8/lingkaran/lkpd", icon: "🔗" },
  { label: "PANJANG BUSUR DAN LUAS JURING", path: "/lkpd/kelas-8/lingkaran/lkpd", icon: "🥧" },
  { label: "SUDUT PUSAT DAN SUDUT KELILING", path: "/lkpd/kelas-8/lingkaran/lkpd", icon: "📐" },
  { label: "PENERAPAN KONSEP LINGKARAN PADA PERMASALAHAN KONTEKSTUAL", path: "/lkpd/kelas-8/lingkaran/lkpd", icon: "🏗️" },
];

const LingkaranMenuPage = () => (
  <MateriTopicPage
    title="LKPD LINGKARAN"
    emoji="⭕"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default LingkaranMenuPage;
