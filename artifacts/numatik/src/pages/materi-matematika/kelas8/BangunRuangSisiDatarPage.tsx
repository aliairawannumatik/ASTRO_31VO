import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsId = [
  { label: "KUBUS",                              path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/kubus",    icon: "🎲" },
  { label: "BALOK",                              path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/balok",    icon: "📦" },
  { label: "PRISMA",                             path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/prisma",   icon: "🔷" },
  { label: "LIMAS",                              path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/limas",    icon: "🔺" },
  { label: "BANGUN RUANG SISI DATAR GABUNGAN",   path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/gabungan",icon: "🔗" },
];

const subtopicsEn = [
  { label: "CUBE",                    path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/kubus",    icon: "🎲" },
  { label: "CUBOID",                  path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/balok",    icon: "📦" },
  { label: "PRISM",                   path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/prisma",   icon: "🔷" },
  { label: "PYRAMID",                 path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/limas",    icon: "🔺" },
  { label: "COMPOUND SOLID FIGURES",  path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/gabungan",icon: "🔗" },
];

const subtopicsJa = [
  { label: "立方体",       path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/kubus",    icon: "🎲" },
  { label: "直方体",       path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/balok",    icon: "📦" },
  { label: "角柱",         path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/prisma",   icon: "🔷" },
  { label: "角錐",         path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/limas",    icon: "🔺" },
  { label: "複合立体図形", path: "/materi-matematika/kelas-8/bangun-ruang-sisi-datar/gabungan",icon: "🔗" },
];

const BangunRuangSisiDatarPage = () => {
  const { language } = useLanguage();
  const subtopics  = language === "en" ? subtopicsEn : language === "ja" ? subtopicsJa : subtopicsId;
  const title      = language === "en" ? "SOLID FIGURES WITH FLAT FACES" : language === "ja" ? "平面で囲まれた立体" : "BANGUN RUANG SISI DATAR";
  const kelas      = language === "en" ? "Grade 8" : language === "ja" ? "中学2年" : "Kelas 8";
  const backLabel  = language === "en" ? "Back to Grade 8" : language === "ja" ? "中学2年に戻る" : "Kembali ke Kelas 8";
  return (
    <MateriTopicPage
      title={title}
      emoji="📦"
      kelas={kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={backLabel}
    />
  );
};

export default BangunRuangSisiDatarPage;
