import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "BENTUK UMUM PERSAMAAN KUADRAT", path: "/materi-matematika/kelas-9/persamaan-kuadrat/bentuk-umum", icon: "📖" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN PEMFAKTORAN", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pemfaktoran", icon: "✂️" },
  { label: "MENENTUKAN AKAR-AKAR PERSAMAAN KUADRAT DENGAN RUMUS KUADRATIK", path: "/materi-matematika/kelas-9/persamaan-kuadrat/rumus-kuadratik", icon: "📐" },
  { label: "AKAR-AKAR PERSAMAAN KUADRAT DENGAN PELENGKAP KUADRAT", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pelengkap-kuadrat", icon: "🔩" },
  { label: "DISKRIMINAN", path: "/materi-matematika/kelas-9/persamaan-kuadrat/diskriminan", icon: "🔍" },
  { label: "MENYUSUN PERSAMAAN KUADRAT BARU", path: "/materi-matematika/kelas-9/persamaan-kuadrat/menyusun-baru", icon: "✏️" },
  { label: "PENERAPAN PERSAMAAN KUADRAT PADA PERMASALAHAN KONTEKSTUAL", path: "/materi-matematika/kelas-9/persamaan-kuadrat/penerapan-kontekstual", icon: "🏗️" },
];

const subtopicsEn = [
  { label: "GENERAL FORM OF A QUADRATIC EQUATION", path: "/materi-matematika/kelas-9/persamaan-kuadrat/bentuk-umum", icon: "📖" },
  { label: "SOLVING QUADRATIC EQUATIONS BY FACTORING", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pemfaktoran", icon: "✂️" },
  { label: "SOLVING QUADRATIC EQUATIONS USING THE QUADRATIC FORMULA", path: "/materi-matematika/kelas-9/persamaan-kuadrat/rumus-kuadratik", icon: "📐" },
  { label: "SOLVING QUADRATIC EQUATIONS BY COMPLETING THE SQUARE", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pelengkap-kuadrat", icon: "🔩" },
  { label: "DISCRIMINANT", path: "/materi-matematika/kelas-9/persamaan-kuadrat/diskriminan", icon: "🔍" },
  { label: "FORMING NEW QUADRATIC EQUATIONS", path: "/materi-matematika/kelas-9/persamaan-kuadrat/menyusun-baru", icon: "✏️" },
  { label: "CONTEXTUAL APPLICATIONS OF QUADRATIC EQUATIONS", path: "/materi-matematika/kelas-9/persamaan-kuadrat/penerapan-kontekstual", icon: "🏗️" },
];

const subtopicsJa = [
  { label: "二次方程式の一般形", path: "/materi-matematika/kelas-9/persamaan-kuadrat/bentuk-umum", icon: "📖" },
  { label: "因数分解による解法", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pemfaktoran", icon: "✂️" },
  { label: "二次方程式の解の公式による解法", path: "/materi-matematika/kelas-9/persamaan-kuadrat/rumus-kuadratik", icon: "📐" },
  { label: "平方完成による解法", path: "/materi-matematika/kelas-9/persamaan-kuadrat/pelengkap-kuadrat", icon: "🔩" },
  { label: "判別式", path: "/materi-matematika/kelas-9/persamaan-kuadrat/diskriminan", icon: "🔍" },
  { label: "新しい二次方程式の作成", path: "/materi-matematika/kelas-9/persamaan-kuadrat/menyusun-baru", icon: "✏️" },
  { label: "二次方程式の文脈的応用", path: "/materi-matematika/kelas-9/persamaan-kuadrat/penerapan-kontekstual", icon: "🏗️" },
];

const PersamaanKuadratPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title =
    language === "en" ? "QUADRATIC EQUATIONS (ENRICHMENT)" :
    language === "ja" ? "二次方程式（発展）" :
    "PERSAMAAN KUADRAT (PENGAYAAN)";
  const kelas =
    language === "en" ? "Grade 9" :
    language === "ja" ? "中学3年" :
    "Kelas 9";
  const backLabel =
    language === "en" ? "Back to Grade 9" :
    language === "ja" ? "中学3年に戻る" :
    "Kembali ke Kelas 9";

  return (
    <MateriTopicPage
      title={title}
      emoji="🔣"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-9"
      backLabel={backLabel}
    />
  );
};

export default PersamaanKuadratPage;
