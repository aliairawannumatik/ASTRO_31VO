import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "KALIMAT TERBUKA DAN TERTUTUP (PERNYATAAN)", path: "/materi-matematika/kelas-7/plsv-ptlsv/kalimat-terbuka-tertutup", icon: "📝" },
  { label: "PENGERTIAN PLSV, KESAMAAN, DAN PERNYATAAN EKUIVALEN", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-plsv", icon: "📖" },
  { label: "PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-plsv", icon: "✅" },
  { label: "MODEL MATEMATIKA DAN PENERAPAN PERSAMAAN PADA SOAL CERITA", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-plsv", icon: "🧮" },
  { label: "PENGERTIAN KETIDAKSAMAAN, PERTIDAKSAMAAN DAN PtLSV", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-ptlsv", icon: "📖" },
  { label: "PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-ptlsv", icon: "✅" },
  { label: "MODEL MATEMATIKA DAN PENERAPAN PERTIDAKSAMAAN PADA SOAL CERITA", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-ptlsv", icon: "🧮" },
];

const PLSVPtLSVPage = () => (
  <MateriTopicPage
    title="PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL"
    emoji="➗"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-7"
    backLabel="Kembali ke Kelas 7"
  />
);

export default PLSVPtLSVPage;
