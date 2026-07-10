import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const PLSVPtLSVPage = () => {
  const { language } = useLanguage();

  const content = {
    id: {
      title: "PERSAMAAN DAN PERTIDAKSAMAAN LINEAR SATU VARIABEL",
      kelas: "Kelas 7",
      backLabel: "Kembali ke Kelas 7",
      subtopics: [
        { label: "KALIMAT TERBUKA DAN TERTUTUP (PERNYATAAN)", path: "/materi-matematika/kelas-7/plsv-ptlsv/kalimat-terbuka-tertutup", icon: "📝" },
        { label: "PENGERTIAN PLSV, KESAMAAN, DAN PERNYATAAN EKUIVALEN", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-plsv", icon: "📖" },
        { label: "PENYELESAIAN PERSAMAAN LINEAR SATU VARIABEL", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-plsv", icon: "✅" },
        { label: "MODEL MATEMATIKA DAN PENERAPAN PERSAMAAN PADA SOAL CERITA", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-plsv", icon: "🧮" },
        { label: "PENGERTIAN KETIDAKSAMAAN, PERTIDAKSAMAAN DAN PtLSV", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-ptlsv", icon: "📖" },
        { label: "PENYELESAIAN PERTIDAKSAMAAN LINEAR SATU VARIABEL", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-ptlsv", icon: "✅" },
        { label: "MODEL MATEMATIKA DAN PENERAPAN PERTIDAKSAMAAN PADA SOAL CERITA", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-ptlsv", icon: "🧮" },
      ],
    },
    en: {
      title: "LINEAR EQUATIONS AND INEQUALITIES IN ONE VARIABLE",
      kelas: "Grade 7",
      backLabel: "Back to Grade 7",
      subtopics: [
        { label: "OPEN AND CLOSED SENTENCES (STATEMENTS)", path: "/materi-matematika/kelas-7/plsv-ptlsv/kalimat-terbuka-tertutup", icon: "📝" },
        { label: "LINEAR EQUATION IN ONE VARIABLE, EQUALITY & EQUIVALENT EQUATIONS", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-plsv", icon: "📖" },
        { label: "SOLVING A LINEAR EQUATION IN ONE VARIABLE", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-plsv", icon: "✅" },
        { label: "MATHEMATICAL MODELS AND WORD PROBLEMS (EQUATIONS)", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-plsv", icon: "🧮" },
        { label: "INEQUALITY AND LINEAR INEQUALITY IN ONE VARIABLE", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-ptlsv", icon: "📖" },
        { label: "SOLVING A LINEAR INEQUALITY IN ONE VARIABLE", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-ptlsv", icon: "✅" },
        { label: "MATHEMATICAL MODELS AND WORD PROBLEMS (INEQUALITIES)", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-ptlsv", icon: "🧮" },
      ],
    },
    ja: {
      title: "一元一次方程式と一元一次不等式",
      kelas: "中学1年",
      backLabel: "中学1年に戻る",
      subtopics: [
        { label: "開いた文と閉じた文（命題）", path: "/materi-matematika/kelas-7/plsv-ptlsv/kalimat-terbuka-tertutup", icon: "📝" },
        { label: "一元一次方程式・等式・同値方程式", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-plsv", icon: "📖" },
        { label: "一元一次方程式の解き方", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-plsv", icon: "✅" },
        { label: "数学的モデルと文章題（方程式）", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-plsv", icon: "🧮" },
        { label: "不等号と一元一次不等式", path: "/materi-matematika/kelas-7/plsv-ptlsv/pengertian-ptlsv", icon: "📖" },
        { label: "一元一次不等式の解き方", path: "/materi-matematika/kelas-7/plsv-ptlsv/penyelesaian-ptlsv", icon: "✅" },
        { label: "数学的モデルと文章題（不等式）", path: "/materi-matematika/kelas-7/plsv-ptlsv/model-matematika-ptlsv", icon: "🧮" },
      ],
    },
  };

  const t = content[language];

  return (
    <MateriTopicPage
      title={t.title}
      emoji="➗"
      kelas={t.kelas}
      subtopics={t.subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={t.backLabel}
    />
  );
};

export default PLSVPtLSVPage;
