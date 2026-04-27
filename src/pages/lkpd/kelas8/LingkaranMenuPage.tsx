import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "UNSUR-UNSUR LINGKARAN", path: "", icon: "⭕" },
  { label: "KELILING DAN LUAS LINGKARAN", path: "", icon: "📏" },
  { label: "KAITAN LINGKARAN DENGAN BANGUN DATAR LAINNYA", path: "", icon: "🔗" },
  { label: "PANJANG BUSUR DAN LUAS JURING", path: "", icon: "🥧" },
  { label: "SUDUT PUSAT DAN SUDUT KELILING", path: "", icon: "📐" },
  { label: "PENERAPAN KONSEP LINGKARAN PADA PERMASALAHAN KONTEKSTUAL", path: "", icon: "🏗️" },
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
