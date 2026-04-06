import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "JUAL BELI, UNTUNG DAN RUGI", path: "/materi-matematika/kelas-7/aritmetika-sosial/jual-beli-untung-rugi", icon: "💹" },
  { label: "DISKON", path: "/materi-matematika/kelas-7/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "BRUTO, NETTO DAN TARA", path: "/materi-matematika/kelas-7/aritmetika-sosial/bruto-netto-tara", icon: "⚖️" },
  { label: "BUNGA TUNGGAL", path: "/materi-matematika/kelas-7/aritmetika-sosial/bunga-tunggal", icon: "💰" },
  { label: "PAJAK PERTAMBAHAN NILAI (PPN)", path: "/materi-matematika/kelas-7/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "PAJAK PENGHASILAN (PPH)", path: "/materi-matematika/kelas-7/aritmetika-sosial/pph", icon: "📋" },
];

const AritmetikaSosialPage = () => (
  <MateriTopicPage
    title="ARITMETIKA SOSIAL"
    emoji="💰"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/materi-matematika/kelas-7"
    backLabel="Kembali ke Kelas 7"
  />
);

export default AritmetikaSosialPage;
