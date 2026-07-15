import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "TABUNG", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/tabung", icon: "🥫" },
  { label: "KERUCUT", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/kerucut", icon: "🍦" },
  { label: "BOLA", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/bola", icon: "⚽" },
  { label: "PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume", icon: "📐" },
  { label: "BANGUN RUANG SISI LENGKUNG GABUNGAN", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/gabungan", icon: "🔗" },
];

const subtopicsEn = [
  { label: "CYLINDER", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/tabung", icon: "🥫" },
  { label: "CONE", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/kerucut", icon: "🍦" },
  { label: "SPHERE", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/bola", icon: "⚽" },
  { label: "SURFACE AREA AND VOLUME CHANGES OF CURVED SURFACE SOLIDS", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume", icon: "📐" },
  { label: "COMBINED CURVED SURFACE SOLIDS", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/gabungan", icon: "🔗" },
];

const subtopicsJa = [
  { label: "円柱", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/tabung", icon: "🥫" },
  { label: "円錐", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/kerucut", icon: "🍦" },
  { label: "球", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/bola", icon: "⚽" },
  { label: "曲面体の表面積・体積の変化", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/perubahan-volume", icon: "📐" },
  { label: "組み合わせ立体", path: "/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung/gabungan", icon: "🔗" },
];

const BangunRuangSisiLengkungPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title =
    language === "en" ? "CURVED SURFACE SOLIDS" :
    language === "ja" ? "曲面体" :
    "BANGUN RUANG SISI LENGKUNG";
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
      emoji="🌐"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-9"
      backLabel={backLabel}
    />
  );
};

export default BangunRuangSisiLengkungPage;
