import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "UNSUR-UNSUR LINGKARAN", path: "/materi-matematika/kelas-8/lingkaran/unsur-unsur", icon: "⭕" },
  { label: "KELILING DAN LUAS LINGKARAN", path: "/materi-matematika/kelas-8/lingkaran/keliling-luas", icon: "📏" },
  { label: "KAITAN LINGKARAN DENGAN BANGUN DATAR LAINNYA", path: "/materi-matematika/kelas-8/lingkaran/kaitan-bangun-datar-lainnya", icon: "🔗" },
  { label: "LINGKARAN DALAM DAN LINGKARAN LUAR SEGITIGA (PENGAYAAN)", path: "/materi-matematika/kelas-8/lingkaran/kaitan-bangun-datar", icon: "📐" },
  { label: "PANJANG BUSUR DAN LUAS JURING", path: "/materi-matematika/kelas-8/lingkaran/busur-juring", icon: "🥧" },
  { label: "SUDUT PUSAT DAN SUDUT KELILING", path: "/materi-matematika/kelas-8/lingkaran/sudut-pusat-keliling", icon: "📐" },
  { label: "PENERAPAN KONSEP LINGKARAN PADA PERMASALAHAN KONTEKSTUAL", path: "/materi-matematika/kelas-8/lingkaran/penerapan-kontekstual", icon: "🏗️" },
];

const subtopicsByEn = [
  { label: "PARTS OF A CIRCLE", path: "/materi-matematika/kelas-8/lingkaran/unsur-unsur", icon: "⭕" },
  { label: "CIRCUMFERENCE & AREA OF A CIRCLE", path: "/materi-matematika/kelas-8/lingkaran/keliling-luas", icon: "📏" },
  { label: "CIRCLES & OTHER PLANE FIGURES", path: "/materi-matematika/kelas-8/lingkaran/kaitan-bangun-datar-lainnya", icon: "🔗" },
  { label: "INCIRCLE & CIRCUMCIRCLE OF A TRIANGLE (ENRICHMENT)", path: "/materi-matematika/kelas-8/lingkaran/kaitan-bangun-datar", icon: "📐" },
  { label: "ARC LENGTH & SECTOR AREA", path: "/materi-matematika/kelas-8/lingkaran/busur-juring", icon: "🥧" },
  { label: "CENTRAL ANGLE & INSCRIBED ANGLE", path: "/materi-matematika/kelas-8/lingkaran/sudut-pusat-keliling", icon: "📐" },
  { label: "APPLYING CIRCLE CONCEPTS TO REAL-WORLD PROBLEMS", path: "/materi-matematika/kelas-8/lingkaran/penerapan-kontekstual", icon: "🏗️" },
];

const subtopicsByJa = [
  { label: "円の各部名称", path: "/materi-matematika/kelas-8/lingkaran/unsur-unsur", icon: "⭕" },
  { label: "円周と円の面積", path: "/materi-matematika/kelas-8/lingkaran/keliling-luas", icon: "📏" },
  { label: "円と平面図形のつながり", path: "/materi-matematika/kelas-8/lingkaran/kaitan-bangun-datar-lainnya", icon: "🔗" },
  { label: "三角形の内接円と外接円（発展）", path: "/materi-matematika/kelas-8/lingkaran/kaitan-bangun-datar", icon: "📐" },
  { label: "弧の長さと扇形の面積", path: "/materi-matematika/kelas-8/lingkaran/busur-juring", icon: "🥧" },
  { label: "中心角と円周角", path: "/materi-matematika/kelas-8/lingkaran/sudut-pusat-keliling", icon: "📐" },
  { label: "円の概念を現実問題に応用する", path: "/materi-matematika/kelas-8/lingkaran/penerapan-kontekstual", icon: "🏗️" },
];

const titles  = { id: "LINGKARAN", en: "CIRCLE", ja: "円" };
const kelas   = { id: "Kelas 8", en: "Grade 8", ja: "中学2年" };
const backLabels = { id: "Kembali ke Kelas 8", en: "Back to Grade 8", ja: "中学2年に戻る" };

const LingkaranPage = () => {
  const { language } = useLanguage();
  const subtopics =
    language === "en" ? subtopicsByEn :
    language === "ja" ? subtopicsByJa :
    subtopicsById;
  return (
    <MateriTopicPage
      title={titles[language]}
      emoji="🔵"
      kelas={kelas[language]}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={backLabels[language]}
    />
  );
};

export default LingkaranPage;
