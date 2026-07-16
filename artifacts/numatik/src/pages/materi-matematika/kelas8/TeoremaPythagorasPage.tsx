import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "PEMBUKTIAN TEOREMA PYTHAGORAS DAN MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU", path: "/materi-matematika/kelas-8/teorema-pythagoras/pembuktian", icon: "📐" },
  { label: "TRIPLE PYTHAGORAS", path: "/materi-matematika/kelas-8/teorema-pythagoras/triple-pythagoras", icon: "🔺" },
  { label: "PYTHAGORAS DAN JENIS-JENIS SEGITIGA", path: "/materi-matematika/kelas-8/teorema-pythagoras/jenis-segitiga", icon: "🔶" },
  { label: "PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS", path: "/materi-matematika/kelas-8/teorema-pythagoras/sudut-khusus", icon: "⭐" },
  { label: "PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL", path: "/materi-matematika/kelas-8/teorema-pythagoras/masalah-kontekstual", icon: "🏗️" },
];

const subtopicsEn = [
  { label: "PROOF OF THE PYTHAGOREAN THEOREM & CALCULATING SIDE LENGTHS", path: "/materi-matematika/kelas-8/teorema-pythagoras/pembuktian", icon: "📐" },
  { label: "PYTHAGOREAN TRIPLES", path: "/materi-matematika/kelas-8/teorema-pythagoras/triple-pythagoras", icon: "🔺" },
  { label: "PYTHAGORAS AND TYPES OF TRIANGLES", path: "/materi-matematika/kelas-8/teorema-pythagoras/jenis-segitiga", icon: "🔶" },
  { label: "SIDE RATIOS OF SPECIAL RIGHT TRIANGLES", path: "/materi-matematika/kelas-8/teorema-pythagoras/sudut-khusus", icon: "⭐" },
  { label: "APPLYING THE PYTHAGOREAN THEOREM TO REAL-WORLD PROBLEMS", path: "/materi-matematika/kelas-8/teorema-pythagoras/masalah-kontekstual", icon: "🏗️" },
];

const subtopicsJa = [
  { label: "ピタゴラスの定理の証明と直角三角形の辺の長さの計算", path: "/materi-matematika/kelas-8/teorema-pythagoras/pembuktian", icon: "📐" },
  { label: "ピタゴラス数（ピタゴラストリプル）", path: "/materi-matematika/kelas-8/teorema-pythagoras/triple-pythagoras", icon: "🔺" },
  { label: "ピタゴラスと三角形の種類", path: "/materi-matematika/kelas-8/teorema-pythagoras/jenis-segitiga", icon: "🔶" },
  { label: "特殊な直角三角形の辺の比", path: "/materi-matematika/kelas-8/teorema-pythagoras/sudut-khusus", icon: "⭐" },
  { label: "ピタゴラスの定理の実生活への応用", path: "/materi-matematika/kelas-8/teorema-pythagoras/masalah-kontekstual", icon: "🏗️" },
];

const TeoremaPythagorasPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const kelas = language === "en" ? "Grade 8" : language === "ja" ? "8年生" : "Kelas 8";
  const backLabel = language === "en" ? "Back to Grade 8" : language === "ja" ? "8年生に戻る" : "Kembali ke Kelas 8";
  const title = language === "en" ? "PYTHAGOREAN THEOREM" : language === "ja" ? "ピタゴラスの定理" : "TEOREMA PYTHAGORAS";
  return (
    <MateriTopicPage
      title={title}
      emoji="📐"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={backLabel}
    />
  );
};

export default TeoremaPythagorasPage;
