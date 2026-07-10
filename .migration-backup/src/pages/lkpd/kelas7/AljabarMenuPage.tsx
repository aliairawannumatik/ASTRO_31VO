import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "PENGERTIAN & UNSUR ALJABAR", path: "/lkpd/kelas-7/aljabar/pengertian-unsur", icon: "🧩" },
  { label: "PENJUMLAHAN & PENGURANGAN ALJABAR", path: "/lkpd/kelas-7/aljabar/penjumlahan-pengurangan", icon: "➕" },
  { label: "PERKALIAN & PEMBAGIAN ALJABAR", path: "/lkpd/kelas-7/aljabar/perkalian-pembagian", icon: "✖️" },
  { label: "SUBSTITUSI BILANGAN", path: "/lkpd/kelas-7/aljabar/substitusi", icon: "🔁" },
  { label: "FAKTORISASI ALJABAR", path: "/lkpd/kelas-7/aljabar/faktorisasi", icon: "🧮" },
];

const AljabarMenuPage = () => (
  <MateriTopicPage
    title="LKPD ALJABAR"
    emoji="🧩"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default AljabarMenuPage;
