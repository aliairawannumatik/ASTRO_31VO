import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "ARTI PECAHAN & PECAHAN SENILAI", path: "/lkpd/kelas-7/bilangan-rasional/arti-pecahan", icon: "🍕" },
  { label: "PECAHAN CAMPURAN", path: "/lkpd/kelas-7/bilangan-rasional/pecahan-campuran", icon: "🍰" },
  { label: "PENJUMLAHAN & PENGURANGAN PECAHAN", path: "/lkpd/kelas-7/bilangan-rasional/penjumlahan-pengurangan", icon: "➕" },
  { label: "PERKALIAN PECAHAN", path: "/lkpd/kelas-7/bilangan-rasional/perkalian", icon: "✖️" },
  { label: "PEMBAGIAN PECAHAN", path: "/lkpd/kelas-7/bilangan-rasional/pembagian", icon: "➗" },
  { label: "BENTUK DESIMAL", path: "/lkpd/kelas-7/bilangan-rasional/bentuk-desimal", icon: "🔢" },
  { label: "OPERASI BENTUK DESIMAL", path: "/lkpd/kelas-7/bilangan-rasional/operasi-desimal", icon: "🧮" },
];

const BilanganRasionalMenuPage = () => (
  <MateriTopicPage
    title="LKPD PECAHAN"
    emoji="🍕"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default BilanganRasionalMenuPage;
