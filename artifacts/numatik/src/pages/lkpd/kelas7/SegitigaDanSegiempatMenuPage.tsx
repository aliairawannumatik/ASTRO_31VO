import MateriTopicPage from "@/components/MateriTopicPage";

const subtopics = [
  { label: "GARIS BERAT, GARIS BAGI DAN GARIS TINGGI PADA SEGITIGA", path: "/lkpd/kelas-7/segitiga-dan-segiempat/lkpd", icon: "📏" },
  { label: "KELILING SEGITIGA DAN SEGIEMPAT", path: "/lkpd/kelas-7/segitiga-dan-segiempat/lkpd", icon: "🔲" },
  { label: "LUAS SEGITIGA", path: "/lkpd/kelas-7/segitiga-dan-segiempat/lkpd", icon: "🔺" },
  { label: "LUAS SEGIEMPAT", path: "/lkpd/kelas-7/segitiga-dan-segiempat/lkpd", icon: "🔷" },
  { label: "KELILING DAN LUAS BANGUN TAK BERATURAN", path: "/lkpd/kelas-7/segitiga-dan-segiempat/lkpd", icon: "🔶" },
];

const SegitigaDanSegiempatMenuPage = () => (
  <MateriTopicPage
    title="LKPD SEGITIGA DAN SEGIEMPAT"
    emoji="🔺"
    kelas="Kelas 7"
    subtopics={subtopics}
    backPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
    contextLabel="LKPD"
  />
);

export default SegitigaDanSegiempatMenuPage;
