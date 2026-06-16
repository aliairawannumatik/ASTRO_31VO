import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PEMBUKTIAN TEOREMA PYTHAGORAS DAN MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU", path: "/materi-matematika/kelas-8/teorema-pythagoras/pembuktian", icon: "📐" },
  { label: "TRIPLE PYTHAGORAS", path: "/materi-matematika/kelas-8/teorema-pythagoras/triple-pythagoras", icon: "🔺" },
  { label: "PYTHAGORAS DAN JENIS-JENIS SEGITIGA", path: "/materi-matematika/kelas-8/teorema-pythagoras/jenis-segitiga", icon: "🔶" },
  { label: "PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS", path: "/materi-matematika/kelas-8/teorema-pythagoras/sudut-khusus", icon: "⭐" },
  { label: "PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL", path: "/materi-matematika/kelas-8/teorema-pythagoras/masalah-kontekstual", icon: "🏗️" },
];

const TeoremaPythagorasPage = () => (
  <MateriTopicPage
    title="TEOREMA PYTHAGORAS"
    emoji="📐"
    kelas="Kelas 8"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-8"
    backLabel="Kembali ke Kelas 8"
  />
);

export default TeoremaPythagorasPage;
