import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "TRANSLASI (PERGESERAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/translasi", icon: "➡️" },
  { label: "REFLEKSI (PENCERMINAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/refleksi", icon: "🪞" },
  { label: "ROTASI (PERPUTARAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/rotasi", icon: "🔄" },
  { label: "DILATASI (PERKALIAN/PERUBAHAN UKURAN)", path: "/materi-matematika/kelas-9/transformasi-geometri/dilatasi", icon: "🔭" },
];

const subtopicsEn = [
  { label: "TRANSLATION (SHIFTING)", path: "/materi-matematika/kelas-9/transformasi-geometri/translasi", icon: "➡️" },
  { label: "REFLECTION (MIRRORING)", path: "/materi-matematika/kelas-9/transformasi-geometri/refleksi", icon: "🪞" },
  { label: "ROTATION (TURNING)", path: "/materi-matematika/kelas-9/transformasi-geometri/rotasi", icon: "🔄" },
  { label: "DILATION (RESIZING)", path: "/materi-matematika/kelas-9/transformasi-geometri/dilatasi", icon: "🔭" },
];

const subtopicsJa = [
  { label: "平行移動（ずらす）", path: "/materi-matematika/kelas-9/transformasi-geometri/translasi", icon: "➡️" },
  { label: "対称移動（鏡映）", path: "/materi-matematika/kelas-9/transformasi-geometri/refleksi", icon: "🪞" },
  { label: "回転移動（回す）", path: "/materi-matematika/kelas-9/transformasi-geometri/rotasi", icon: "🔄" },
  { label: "拡大・縮小（サイズ変更）", path: "/materi-matematika/kelas-9/transformasi-geometri/dilatasi", icon: "🔭" },
];

const TransformasiGeometriPage = () => {
  const { language } = useLanguage();
  const subtopics = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title =
    language === "en" ? "GEOMETRIC TRANSFORMATIONS" :
    language === "ja" ? "図形の変換" :
    "TRANSFORMASI GEOMETRI";
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
      emoji="🔄"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-9"
      backLabel={backLabel}
    />
  );
};

export default TransformasiGeometriPage;
