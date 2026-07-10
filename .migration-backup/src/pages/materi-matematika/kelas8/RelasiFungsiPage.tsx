import MateriTopicPage from "@/components/MateriTopicPage";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "RELASI DAN FUNGSI",
    kelas: "Kelas 8",
    sub1: "PENGERTIAN RELASI DAN PENYAJIANNYA",
    sub2: "PENGERTIAN FUNGSI DAN PENYAJIANNYA",
    sub3: "MENENTUKAN BANYAK FUNGSI DAN KORESPONDENSI SATU-SATU",
    sub4: "NOTASI DAN RUMUS FUNGSI",
    sub5: "GRAFIK FUNGSI (PENGAYAAN)",
    back: "Kembali ke Kelas 8",
  },
  en: {
    title: "RELATIONS & FUNCTIONS",
    kelas: "Grade 8",
    sub1: "UNDERSTANDING RELATIONS AND THEIR REPRESENTATIONS",
    sub2: "UNDERSTANDING FUNCTIONS AND THEIR REPRESENTATIONS",
    sub3: "NUMBER OF FUNCTIONS AND ONE-TO-ONE CORRESPONDENCE",
    sub4: "FUNCTION NOTATION AND FORMULAS",
    sub5: "FUNCTION GRAPHS (ENRICHMENT)",
    back: "Back to Grade 8",
  },
  ja: {
    title: "関係と関数",
    kelas: "中学2年",
    sub1: "関係とその表し方",
    sub2: "関数とその表し方",
    sub3: "関数の個数と全単射",
    sub4: "関数の記法と式",
    sub5: "関数のグラフ（発展）",
    back: "中学2年に戻る",
  },
};

const RelasiFungsiPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const subtopics = [
    { label: t.sub1, path: "/materi-matematika/kelas-8/relasi-dan-fungsi/pengertian-relasi", icon: "🔗" },
    { label: t.sub2, path: "/materi-matematika/kelas-8/relasi-dan-fungsi/pengertian-fungsi", icon: "📈" },
    { label: t.sub3, path: "/materi-matematika/kelas-8/relasi-dan-fungsi/banyak-fungsi", icon: "🔢" },
    { label: t.sub4, path: "/materi-matematika/kelas-8/relasi-dan-fungsi/notasi-fungsi", icon: "📝" },
    { label: t.sub5, path: "/materi-matematika/kelas-8/relasi-dan-fungsi/grafik-fungsi", icon: "📊" },
  ];

  return (
    <MateriTopicPage
      title={t.title}
      emoji="🔗"
      kelas={t.kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={t.back}
    />
  );
};

export default RelasiFungsiPage;
