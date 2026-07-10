import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "JUAL BELI, UNTUNG & RUGI", path: "/lkpd/kelas-7/aritmetika-sosial/jual-beli-untung-rugi", icon: "🛍️" },
  { label: "DISKON (POTONGAN HARGA)", path: "/lkpd/kelas-7/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "BRUTO, NETTO & TARA", path: "/lkpd/kelas-7/aritmetika-sosial/bruto-netto-tara", icon: "📦" },
  { label: "BUNGA TUNGGAL", path: "/lkpd/kelas-7/aritmetika-sosial/bunga-tunggal", icon: "🏦" },
  { label: "PAJAK PERTAMBAHAN NILAI (PPN)", path: "/lkpd/kelas-7/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "PAJAK PENGHASILAN (PPh)", path: "/lkpd/kelas-7/aritmetika-sosial/pph", icon: "💼" },
];

const AritmetikaSosialMenuPage = () => (
  <MateriTopicPage
    title="LKPD ARITMETIKA SOSIAL"
    emoji="💰"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default AritmetikaSosialMenuPage;
