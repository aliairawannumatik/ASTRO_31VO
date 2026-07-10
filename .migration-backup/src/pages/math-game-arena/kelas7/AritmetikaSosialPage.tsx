import GameSubtopicPage from "@/components/GameSubtopicPage";

const subtopics = [
  { name: "JUAL BELI, UNTUNG DAN RUGI", path: "/math-game-arena/kelas-7/aritmetika-sosial/jual-beli-untung-rugi" },
  { name: "DISKON", path: "/math-game-arena/kelas-7/aritmetika-sosial/diskon" },
  { name: "BRUTO, NETTO DAN TARA", path: "/math-game-arena/kelas-7/aritmetika-sosial/bruto-netto-tara" },
  { name: "BUNGA TUNGGAL", path: "/math-game-arena/kelas-7/aritmetika-sosial/bunga-tunggal" },
  { name: "PAJAK PERTAMBAHAN NILAI (PPN)", path: "/math-game-arena/kelas-7/aritmetika-sosial/ppn" },
  { name: "PAJAK PENGHASILAN (PPh)", path: "/math-game-arena/kelas-7/aritmetika-sosial/pph" },
];

const AritmetikaSosialPage = () => (
  <GameSubtopicPage title="ARITMETIKA SOSIAL" subtopics={subtopics} icon="💰" />
);

export default AritmetikaSosialPage;
