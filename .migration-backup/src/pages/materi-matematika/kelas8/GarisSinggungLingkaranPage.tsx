import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/pengertian", icon: "📖" },
  { label: "MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/menghitung-panjang", icon: "📏" },
  { label: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/gspl", icon: "↔️" },
  { label: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/gspd", icon: "↕️" },
  { label: "SABUK LILITAN MINIMAL (PENERAPAN)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/sabuk-lilitan", icon: "🌀" },
];

const subtopicsEn = [
  { label: "PROPERTIES OF CIRCLE TANGENT LINES", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/pengertian", icon: "📖" },
  { label: "CALCULATING TANGENT LINE LENGTH FROM AN EXTERNAL POINT", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/menghitung-panjang", icon: "📏" },
  { label: "EXTERNAL COMMON TANGENT (ECT)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/gspl", icon: "↔️" },
  { label: "INTERNAL COMMON TANGENT (ICT)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/gspd", icon: "↕️" },
  { label: "MINIMUM BELT WRAP LENGTH (APPLICATION)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/sabuk-lilitan", icon: "🌀" },
];

const subtopicsJa = [
  { label: "接線の定義と性質", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/pengertian", icon: "📖" },
  { label: "外部の点からの接線の長さの計算", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/menghitung-panjang", icon: "📏" },
  { label: "外接共通接線 (GSPL)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/gspl", icon: "↔️" },
  { label: "内接共通接線 (GSPD)", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/gspd", icon: "↕️" },
  { label: "最小巻き付け長さ（応用）", path: "/materi-matematika/kelas-8/garis-singgung-lingkaran/sabuk-lilitan", icon: "🌀" },
];

const titles    = { id: "GARIS SINGGUNG LINGKARAN", en: "CIRCLE TANGENT LINES", ja: "円の接線" };
const kelas     = { id: "Kelas 8", en: "Grade 8", ja: "中学2年" };
const backLabels = { id: "Kembali ke Kelas 8", en: "Back to Grade 8", ja: "中学2年に戻る" };

const GarisSinggungLingkaranPage = () => {
  const { language } = useLanguage();
  const subtopics =
    language === "en" ? subtopicsEn :
    language === "ja" ? subtopicsJa :
    subtopicsId;
  return (
    <MateriTopicPage
      title={titles[language]}
      emoji="⭕"
      kelas={kelas[language]}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={backLabels[language]}
    />
  );
};

export default GarisSinggungLingkaranPage;
