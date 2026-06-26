import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "PERBANDINGAN UMUM, SATUAN PEMBANDING & RASIO", path: "/materi-matematika/kelas-7/perbandingan/umum", icon: "⚖️" },
  { label: "PERBANDINGAN BERTINGKAT", path: "/materi-matematika/kelas-7/perbandingan/bertingkat", icon: "📶" },
  { label: "PERBANDINGAN SENILAI & BERBALIK NILAI", path: "/materi-matematika/kelas-7/perbandingan/senilai", icon: "🔄" },
  { label: "SKALA", path: "/materi-matematika/kelas-7/perbandingan/skala", icon: "🗺️" },
  { label: "PERBANDINGAN CAMPURAN (PENGAYAAN)", path: "/materi-matematika/kelas-7/perbandingan/campuran", icon: "🔀" },
];

const subtopicsByEn = [
  { label: "RATIO: DEFINITION, UNITS & COMPARISON", path: "/materi-matematika/kelas-7/perbandingan/umum", icon: "⚖️" },
  { label: "COMPOUND RATIO", path: "/materi-matematika/kelas-7/perbandingan/bertingkat", icon: "📶" },
  { label: "DIRECT & INVERSE PROPORTION", path: "/materi-matematika/kelas-7/perbandingan/senilai", icon: "🔄" },
  { label: "SCALE", path: "/materi-matematika/kelas-7/perbandingan/skala", icon: "🗺️" },
  { label: "COMBINED PROPORTION (ENRICHMENT)", path: "/materi-matematika/kelas-7/perbandingan/campuran", icon: "🔀" },
];

const subtopicsByJa = [
  { label: "比：定義・単位・比較", path: "/materi-matematika/kelas-7/perbandingan/umum", icon: "⚖️" },
  { label: "複合比", path: "/materi-matematika/kelas-7/perbandingan/bertingkat", icon: "📶" },
  { label: "正比例と反比例", path: "/materi-matematika/kelas-7/perbandingan/senilai", icon: "🔄" },
  { label: "縮尺", path: "/materi-matematika/kelas-7/perbandingan/skala", icon: "🗺️" },
  { label: "複合比（発展）", path: "/materi-matematika/kelas-7/perbandingan/campuran", icon: "🔀" },
];

const titles = { id: "PERBANDINGAN", en: "RATIO", ja: "比" };
const kelas = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabel = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const PerbandinganPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;

  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="⚖️"
      kelas={kelas[lang]}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={backLabel[lang]}
    />
  );
};

export default PerbandinganPage;
