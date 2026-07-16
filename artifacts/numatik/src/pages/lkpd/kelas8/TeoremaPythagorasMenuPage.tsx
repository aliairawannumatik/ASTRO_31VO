import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PEMBUKTIAN TEOREMA PYTHAGORAS", path: "/lkpd/kelas-8/teorema-pythagoras/lkpd", icon: "📐" },
  { label: "MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU", path: "/lkpd/kelas-8/teorema-pythagoras/lkpd", icon: "📏" },
  { label: "TRIPLE PYTHAGORAS", path: "/lkpd/kelas-8/teorema-pythagoras/lkpd", icon: "🔺" },
  { label: "PYTHAGORAS DAN JENIS-JENIS SEGITIGA", path: "/lkpd/kelas-8/teorema-pythagoras/lkpd", icon: "🔶" },
  { label: "PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS", path: "/lkpd/kelas-8/teorema-pythagoras/lkpd", icon: "⭐" },
  { label: "PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL", path: "/lkpd/kelas-8/teorema-pythagoras/lkpd", icon: "🏗️" },
];

const TeoremaPythagorasMenuPage = () => (
  <MateriTopicPage
    title="LKPD TEOREMA PYTHAGORAS"
    emoji="📐"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/lkpd/kelas-8"
    backLabel="Kembali ke LKPD Kelas 8"
    contextLabel="LKPD"
  />
);

export default TeoremaPythagorasMenuPage;
