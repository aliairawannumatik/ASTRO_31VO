import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "GARIS BERAT, GARIS BAGI DAN GARIS TINGGI PADA SEGITIGA", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi", icon: "📏" },
  { label: "KELILING SEGITIGA DAN SEGIEMPAT", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/keliling", icon: "🔲" },
  { label: "LUAS SEGITIGA", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segitiga", icon: "🔺" },
  { label: "LUAS SEGIEMPAT", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segiempat", icon: "🔷" },
  { label: "KELILING DAN LUAS BANGUN TAK BERATURAN", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/bangun-tak-beraturan", icon: "🔶" },
];

const subtopicsByEn = [
  { label: "MEDIANS, ANGLE BISECTORS & ALTITUDES OF TRIANGLES", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi", icon: "📏" },
  { label: "PERIMETER OF TRIANGLES & QUADRILATERALS", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/keliling", icon: "🔲" },
  { label: "AREA OF TRIANGLES", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segitiga", icon: "🔺" },
  { label: "AREA OF QUADRILATERALS", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segiempat", icon: "🔷" },
  { label: "PERIMETER & AREA OF IRREGULAR SHAPES", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/bangun-tak-beraturan", icon: "🔶" },
];

const subtopicsByJa = [
  { label: "三角形の中線・二等分線・高さ", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/garis-berat-bagi-tinggi", icon: "📏" },
  { label: "三角形と四角形の周長", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/keliling", icon: "🔲" },
  { label: "三角形の面積", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segitiga", icon: "🔺" },
  { label: "四角形の面積", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/luas-segiempat", icon: "🔷" },
  { label: "不規則な図形の周長と面積", path: "/materi-matematika/kelas-7/segitiga-dan-segiempat/bangun-tak-beraturan", icon: "🔶" },
];

const titles = { id: "SEGITIGA DAN SEGIEMPAT", en: "TRIANGLES & QUADRILATERALS", ja: "三角形と四角形" };
const kelas = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabel = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const SegitigaSegiempatPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;

  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="🔺"
      kelas={kelas[lang]}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={backLabel[lang]}
    />
  );
};

export default SegitigaSegiempatPage;
