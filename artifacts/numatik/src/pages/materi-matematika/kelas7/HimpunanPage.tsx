import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "PENGERTIAN DAN KEANGGOTAAN SUATU HIMPUNAN", path: "/materi-matematika/kelas-7/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "MENYATAKAN SUATU HIMPUNAN, HIMPUNAN KOSONG DAN HIMPUNAN SEMESTA", path: "/materi-matematika/kelas-7/himpunan/jenis-himpunan", icon: "📂" },
  { label: "OPERASI HIMPUNAN DI ATAS DIAGRAM VENN", path: "/materi-matematika/kelas-7/himpunan/operasi-himpunan", icon: "🔗" },
  { label: "DIAGRAM VENN", path: "/materi-matematika/kelas-7/himpunan/diagram-venn", icon: "🔵" },
  { label: "PEMECAHAN MASALAH YANG BERKAITAN DENGAN HIMPUNAN", path: "/materi-matematika/kelas-7/himpunan/pemecahan-masalah", icon: "💡" },
];

const subtopicsByEn = [
  { label: "DEFINITION AND MEMBERSHIP OF A SET", path: "/materi-matematika/kelas-7/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "STATING A SET, EMPTY SET AND UNIVERSAL SET", path: "/materi-matematika/kelas-7/himpunan/jenis-himpunan", icon: "📂" },
  { label: "SET OPERATIONS ON VENN DIAGRAMS", path: "/materi-matematika/kelas-7/himpunan/operasi-himpunan", icon: "🔗" },
  { label: "VENN DIAGRAM", path: "/materi-matematika/kelas-7/himpunan/diagram-venn", icon: "🔵" },
  { label: "PROBLEM SOLVING RELATED TO SETS", path: "/materi-matematika/kelas-7/himpunan/pemecahan-masalah", icon: "💡" },
];

const subtopicsByJa = [
  { label: "集合の定義と要素", path: "/materi-matematika/kelas-7/himpunan/pengertian-keanggotaan", icon: "👥" },
  { label: "集合の表し方・空集合・全体集合", path: "/materi-matematika/kelas-7/himpunan/jenis-himpunan", icon: "📂" },
  { label: "ベン図上の集合の演算", path: "/materi-matematika/kelas-7/himpunan/operasi-himpunan", icon: "🔗" },
  { label: "ベン図", path: "/materi-matematika/kelas-7/himpunan/diagram-venn", icon: "🔵" },
  { label: "集合を使った問題解決", path: "/materi-matematika/kelas-7/himpunan/pemecahan-masalah", icon: "💡" },
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
