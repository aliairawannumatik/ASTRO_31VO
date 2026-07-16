import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "KALIMAT TERBUKA & TERTUTUP", path: "/lkpd/kelas-7/plsv-ptlsv/kalimat-terbuka-tertutup", icon: "💬" },
  { label: "PENGERTIAN PLSV", path: "/lkpd/kelas-7/plsv-ptlsv/pengertian-plsv", icon: "🎯" },
  { label: "PENYELESAIAN PLSV", path: "/lkpd/kelas-7/plsv-ptlsv/penyelesaian-plsv", icon: "⚖️" },
  { label: "MODEL MATEMATIKA PLSV", path: "/lkpd/kelas-7/plsv-ptlsv/model-matematika-plsv", icon: "🧠" },
  { label: "PENGERTIAN PtLSV", path: "/lkpd/kelas-7/plsv-ptlsv/pengertian-ptlsv", icon: "🚦" },
  { label: "PENYELESAIAN PtLSV", path: "/lkpd/kelas-7/plsv-ptlsv/penyelesaian-ptlsv", icon: "🪜" },
  { label: "MODEL MATEMATIKA PtLSV", path: "/lkpd/kelas-7/plsv-ptlsv/model-matematika-ptlsv", icon: "🛒" },
];

const PLSVPtLSVMenuPage = () => (
  <MateriTopicPage
    title="LKPD PLSV & PtLSV"
    emoji="⚖️"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default PLSVPtLSVMenuPage;
