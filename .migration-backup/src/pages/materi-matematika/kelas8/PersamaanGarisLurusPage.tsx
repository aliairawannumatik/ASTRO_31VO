import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const PersamaanGarisLurusPage = () => {
  const { language } = useLanguage();

  const isEN = language === "en";
  const isJA = language === "ja";

  const title = isEN ? "EQUATION OF A LINE" : isJA ? "直線の方程式" : "PERSAMAAN GARIS LURUS";
  const kelas = isEN ? "Grade 8" : isJA ? "中学2年" : "Kelas 8";
  const backLabel = isEN ? "Back to Grade 8" : isJA ? "中学2年に戻る" : "Kembali ke Kelas 8";

  const subtopics = isEN
    ? [
        { label: "GRAPH OF A LINE", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/grafik", icon: "📈" },
        { label: "GRADIENT / SLOPE", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/gradien", icon: "📐" },
        { label: "RELATIONSHIP BETWEEN TWO LINES", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/hubungan-2-garis", icon: "↔️" },
        { label: "FINDING THE EQUATION OF A LINE", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/menentukan-pgl", icon: "✏️" },
        { label: "REAL-WORLD APPLICATIONS", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual", icon: "🏗️" },
      ]
    : isJA
    ? [
        { label: "直線のグラフ", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/grafik", icon: "📈" },
        { label: "傾き（グラジエン）", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/gradien", icon: "📐" },
        { label: "2直線の関係", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/hubungan-2-garis", icon: "↔️" },
        { label: "直線の方程式の求め方", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/menentukan-pgl", icon: "✏️" },
        { label: "文章問題への応用", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual", icon: "🏗️" },
      ]
    : [
        { label: "GRAFIK PERSAMAAN GARIS LURUS", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/grafik", icon: "📈" },
        { label: "GRADIEN (KEMIRINGAN GARIS)", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/gradien", icon: "📐" },
        { label: "HUBUNGAN 2 GARIS", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/hubungan-2-garis", icon: "↔️" },
        { label: "MENENTUKAN PERSAMAAN GARIS LURUS", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/menentukan-pgl", icon: "✏️" },
        { label: "APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL", path: "/materi-matematika/kelas-8/persamaan-garis-lurus/aplikasi-kontekstual", icon: "🏗️" },
      ];

  return (
    <MateriTopicPage
      title={title}
      emoji="📏"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={backLabel}
    />
  );
};

export default PersamaanGarisLurusPage;
