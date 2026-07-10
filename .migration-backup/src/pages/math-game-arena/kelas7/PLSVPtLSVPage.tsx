import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "KALIMAT TERBUKA DAN TERTUTUP (PERNYATAAN)", path: "/math-game-arena/kelas-7/plsv-ptlsv/kalimat-terbuka" },
  { name: "PENGERTIAN PLSV, KESAMAAN, DAN PERNYATAAAN EKUIVALEN", path: "/math-game-arena/kelas-7/plsv-ptlsv/pengertian-plsv" },
  { name: "PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL", path: "/math-game-arena/kelas-7/plsv-ptlsv/penyelesaian-plsv" },
  { name: "MODEL MATEMATIKA DAN PENERAPAN PERSAMAAN PADA SOAL CERITA", path: "/math-game-arena/kelas-7/plsv-ptlsv/model-matematika-plsv" },
  { name: "PENGERTIAN KETIDAKSAMAAN, PERTIDAKSAMAAN DAN PtLSV", path: "/math-game-arena/kelas-7/plsv-ptlsv/pengertian-ptlsv" },
  { name: "PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/math-game-arena/kelas-7/plsv-ptlsv/penyelesaian-ptlsv" },
  { name: "MODEL MATEMATIKA DAN PENERAPAN PERTIDAKSAMAAN PADA SOAL CERITA", path: "/math-game-arena/kelas-7/plsv-ptlsv/model-matematika-ptlsv" },
];

const PLSVPtLSVPage = () => (
  <GameSubtopicPage
    title="PERSAMAAN & PERTIDAKSAMAAN"
    subtopics={subtopics}
    icon="⚖️"
  />
);

export default PLSVPtLSVPage;
