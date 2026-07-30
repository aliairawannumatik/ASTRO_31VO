import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "PENGERTIAN, KEANGGOTAAN SUATU HIMPUNAN DAN MACAM-MACAM HIMPUNAN", path: "/materi-matematika/kelas-7/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "OPERASI HIMPUNAN, DIAGRAM VENN DAN PEMECAHAN MASALAH KONTEKSTUAL YANG BERKAITAN DENGAN HIMPUNAN", path: "/materi-matematika/kelas-7/himpunan/operasi-himpunan", icon: "🔗" },
];

const subtopicsByEn = [
  { label: "DEFINITION, MEMBERSHIP OF A SET AND TYPES OF SETS", path: "/materi-matematika/kelas-7/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "SET OPERATIONS, VENN DIAGRAM AND CONTEXTUAL PROBLEM SOLVING RELATED TO SETS", path: "/materi-matematika/kelas-7/himpunan/operasi-himpunan", icon: "🔗" },
];

const subtopicsByJa = [
  { label: "集合の定義・要素・集合の種類", path: "/materi-matematika/kelas-7/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "集合の演算・ベン図・集合を使った文脈的な問題解決", path: "/materi-matematika/kelas-7/himpunan/operasi-himpunan", icon: "🔗" },
];

const titles   = { id: "HIMPUNAN", en: "SETS", ja: "集合" };
const kelas    = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabel = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const HimpunanPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;

  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="🔷"
      kelas={kelas[lang]}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={backLabel[lang]}
    />
  );
};

export default HimpunanPage;
