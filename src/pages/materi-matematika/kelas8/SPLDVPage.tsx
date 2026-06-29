import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const translations = {
  id: {
    title: "SISTEM PERSAMAAN LINEAR DUA VARIABEL",
    kelas: "Kelas 8",
    backLabel: "Kembali ke Kelas 8",
    subtopics: [
      { label: "DEFINISI DAN BENTUK UMUM SPLDV BESERTA KAITANNYA DENGAN PLDV", path: "/materi-matematika/kelas-8/spldv/definisi", icon: "📖" },
      { label: "PENYELESAIAN SPLDV DENGAN METODE GRAFIK", path: "/materi-matematika/kelas-8/spldv/metode-grafik", icon: "📈" },
      { label: "PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI", path: "/materi-matematika/kelas-8/spldv/metode-substitusi", icon: "🔄" },
      { label: "PENYELESAIAN SPLDV DENGAN METODE ELIMINASI", path: "/materi-matematika/kelas-8/spldv/metode-eliminasi", icon: "➖" },
      { label: "PENYELESAIAN SPLDV DENGAN METODE CAMPURAN", path: "/materi-matematika/kelas-8/spldv/metode-campuran", icon: "🔀" },
      { label: "MEMBUAT MODEL DARI PERMASALAHAN YANG BERKAITAN DENGAN SPLDV", path: "/materi-matematika/kelas-8/spldv/model-spldv", icon: "🧮" },
      { label: "PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV", path: "/materi-matematika/kelas-8/spldv/penyelesaian-masalah", icon: "✅" },
    ],
  },
  en: {
    title: "SYSTEM OF LINEAR EQUATIONS IN TWO VARIABLES",
    kelas: "Grade 8",
    backLabel: "Back to Grade 8",
    subtopics: [
      { label: "DEFINITION & GENERAL FORM OF SLETV AND ITS RELATION TO LETV", path: "/materi-matematika/kelas-8/spldv/definisi", icon: "📖" },
      { label: "SOLVING SLETV WITH THE GRAPHICAL METHOD", path: "/materi-matematika/kelas-8/spldv/metode-grafik", icon: "📈" },
      { label: "SOLVING SLETV WITH THE SUBSTITUTION METHOD", path: "/materi-matematika/kelas-8/spldv/metode-substitusi", icon: "🔄" },
      { label: "SOLVING SLETV WITH THE ELIMINATION METHOD", path: "/materi-matematika/kelas-8/spldv/metode-eliminasi", icon: "➖" },
      { label: "SOLVING SLETV WITH THE COMBINED METHOD", path: "/materi-matematika/kelas-8/spldv/metode-campuran", icon: "🔀" },
      { label: "MODELLING PROBLEMS RELATED TO SLETV", path: "/materi-matematika/kelas-8/spldv/model-spldv", icon: "🧮" },
      { label: "SOLVING REAL-WORLD PROBLEMS WITH SLETV", path: "/materi-matematika/kelas-8/spldv/penyelesaian-masalah", icon: "✅" },
    ],
  },
  ja: {
    title: "二元一次連立方程式",
    kelas: "中学2年",
    backLabel: "中学2年に戻る",
    subtopics: [
      { label: "二元一次連立方程式の定義・一般形と一元方程式との関係", path: "/materi-matematika/kelas-8/spldv/definisi", icon: "📖" },
      { label: "グラフ法による連立方程式の解法", path: "/materi-matematika/kelas-8/spldv/metode-grafik", icon: "📈" },
      { label: "代入法による連立方程式の解法", path: "/materi-matematika/kelas-8/spldv/metode-substitusi", icon: "🔄" },
      { label: "加減法による連立方程式の解法", path: "/materi-matematika/kelas-8/spldv/metode-eliminasi", icon: "➖" },
      { label: "代入法と加減法を組み合わせた解法", path: "/materi-matematika/kelas-8/spldv/metode-campuran", icon: "🔀" },
      { label: "連立方程式を使った数学モデルの作成", path: "/materi-matematika/kelas-8/spldv/model-spldv", icon: "🧮" },
      { label: "連立方程式を使った実問題の解法", path: "/materi-matematika/kelas-8/spldv/penyelesaian-masalah", icon: "✅" },
    ],
  },
};

const SPLDVPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <MateriTopicPage
      title={t.title}
      emoji="➕"
      kelas={t.kelas}
      subtopics={t.subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={t.backLabel}
    />
  );
};

export default SPLDVPage;
