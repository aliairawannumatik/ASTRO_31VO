import MateriTopicPage from "@/components/MateriTopicPage";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "BILANGAN RASIONAL",
    kelas: "Kelas 7",
    backLabel: "Kembali ke Kelas 7",
    subtopics: [
      { label: "ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/arti-pecahan", icon: "🔢" },
      { label: "PECAHAN CAMPURAN DAN PERSEN", path: "/materi-matematika/kelas-7/bilangan-rasional/pecahan-campuran", icon: "🔣" },
      { label: "PENJUMLAHAN DAN PENGURANGAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan", icon: "➕" },
      { label: "PERKALIAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian", icon: "✖️" },
      { label: "PEMBAGIAN PECAHAN", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian", icon: "➗" },
      { label: "BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/bentuk-desimal", icon: "📊" },
      { label: "PENJUMLAHAN DAN PENGURANGAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-desimal", icon: "➕" },
      { label: "PERKALIAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian-desimal", icon: "✖️" },
      { label: "PEMBAGIAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian-desimal", icon: "➗" },
      { label: "PEMBULATAN BENTUK DESIMAL", path: "/materi-matematika/kelas-7/bilangan-rasional/pembulatan-desimal", icon: "🎯" },
    ],
  },
  en: {
    title: "RATIONAL NUMBERS",
    kelas: "Grade 7",
    backLabel: "Back to Grade 7",
    subtopics: [
      { label: "FRACTIONS: MEANING, EQUIVALENT & COMPARING", path: "/materi-matematika/kelas-7/bilangan-rasional/arti-pecahan", icon: "🔢" },
      { label: "MIXED NUMBERS AND PERCENTAGES", path: "/materi-matematika/kelas-7/bilangan-rasional/pecahan-campuran", icon: "🔣" },
      { label: "ADDITION AND SUBTRACTION OF FRACTIONS", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan", icon: "➕" },
      { label: "MULTIPLICATION OF FRACTIONS", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian", icon: "✖️" },
      { label: "DIVISION OF FRACTIONS", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian", icon: "➗" },
      { label: "DECIMAL FORM", path: "/materi-matematika/kelas-7/bilangan-rasional/bentuk-desimal", icon: "📊" },
      { label: "ADDITION AND SUBTRACTION OF DECIMALS", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-desimal", icon: "➕" },
      { label: "MULTIPLICATION OF DECIMALS", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian-desimal", icon: "✖️" },
      { label: "DIVISION OF DECIMALS", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian-desimal", icon: "➗" },
      { label: "ROUNDING DECIMALS", path: "/materi-matematika/kelas-7/bilangan-rasional/pembulatan-desimal", icon: "🎯" },
    ],
  },
  ja: {
    title: "有理数",
    kelas: "中学1年",
    backLabel: "中学1年に戻る",
    subtopics: [
      { label: "分数の意味・等価分数・大小比較", path: "/materi-matematika/kelas-7/bilangan-rasional/arti-pecahan", icon: "🔢" },
      { label: "帯分数とパーセント", path: "/materi-matematika/kelas-7/bilangan-rasional/pecahan-campuran", icon: "🔣" },
      { label: "分数の足し算と引き算", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan", icon: "➕" },
      { label: "分数の掛け算", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian", icon: "✖️" },
      { label: "分数の割り算", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian", icon: "➗" },
      { label: "小数の形", path: "/materi-matematika/kelas-7/bilangan-rasional/bentuk-desimal", icon: "📊" },
      { label: "小数の足し算と引き算", path: "/materi-matematika/kelas-7/bilangan-rasional/penjumlahan-pengurangan-desimal", icon: "➕" },
      { label: "小数の掛け算", path: "/materi-matematika/kelas-7/bilangan-rasional/perkalian-desimal", icon: "✖️" },
      { label: "小数の割り算", path: "/materi-matematika/kelas-7/bilangan-rasional/pembagian-desimal", icon: "➗" },
      { label: "小数の四捨五入", path: "/materi-matematika/kelas-7/bilangan-rasional/pembulatan-desimal", icon: "🎯" },
    ],
  },
};

const BilanganRasionalPage = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <MateriTopicPage
      title={t.title}
      emoji="🔵"
      kelas={t.kelas}
      subtopics={t.subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={t.backLabel}
    />
  );
};

export default BilanganRasionalPage;
