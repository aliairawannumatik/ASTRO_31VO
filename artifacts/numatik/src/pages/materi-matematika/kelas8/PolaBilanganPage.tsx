import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "PENGERTIAN POLA, BARISAN BILANGAN DAN POLA-POLA KHUSUS", path: "/materi-matematika/kelas-8/pola-bilangan/pengertian-pola", icon: "📝" },
  { label: "BARISAN DAN DERET ARITMETIKA", path: "/materi-matematika/kelas-8/pola-bilangan/pola-aritmetika", icon: "➕" },
  { label: "BARISAN DAN DERET GEOMETRI", path: "/materi-matematika/kelas-8/pola-bilangan/pola-geometri", icon: "📐" },
];

const subtopicsByEn = [
  { label: "NUMBER PATTERNS, SEQUENCES & SPECIAL PATTERNS", path: "/materi-matematika/kelas-8/pola-bilangan/pengertian-pola", icon: "📝" },
  { label: "ARITHMETIC SEQUENCES & SERIES", path: "/materi-matematika/kelas-8/pola-bilangan/pola-aritmetika", icon: "➕" },
  { label: "GEOMETRIC SEQUENCES & SERIES", path: "/materi-matematika/kelas-8/pola-bilangan/pola-geometri", icon: "📐" },
];

const subtopicsByJa = [
  { label: "数のパターン・数列と特殊パターン", path: "/materi-matematika/kelas-8/pola-bilangan/pengertian-pola", icon: "📝" },
  { label: "等差数列と等差級数", path: "/materi-matematika/kelas-8/pola-bilangan/pola-aritmetika", icon: "➕" },
  { label: "等比数列と等比級数", path: "/materi-matematika/kelas-8/pola-bilangan/pola-geometri", icon: "📐" },
];

const titles = { id: "POLA BILANGAN", en: "NUMBER PATTERNS", ja: "数の規則性" };
const kelas = { id: "Kelas 8", en: "Grade 8", ja: "中学2年" };
const backLabels = { id: "Kembali ke Kelas 8", en: "Back to Grade 8", ja: "中学2年に戻る" };

const PolaBilanganPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsByEn : language === "ja" ? subtopicsByJa : subtopicsById;
  return (
    <MateriTopicPage
      title={titles[language]}
      emoji="🔢"
      kelas={kelas[language]}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={backLabels[language]}
    />
  );
};

export default PolaBilanganPage;
