import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PEMBUKTIAN TEOREMA PYTHAGORAS", path: "", icon: "📐" },
  { label: "MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU", path: "", icon: "📏" },
  { label: "TRIPLE PYTHAGORAS", path: "", icon: "🔺" },
  { label: "PYTHAGORAS DAN JENIS-JENIS SEGITIGA", path: "", icon: "🔶" },
  { label: "PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS", path: "", icon: "⭐" },
  { label: "PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL", path: "", icon: "🏗️" },
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
