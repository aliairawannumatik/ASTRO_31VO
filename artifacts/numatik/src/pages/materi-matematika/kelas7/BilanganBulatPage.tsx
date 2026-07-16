import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const BilanganBulatPage = () => {
  const { language } = useLanguage();

  const translations = {
    id: {
      title: "BILANGAN BULAT",
      kelas: "Kelas 7",
      backLabel: "Kembali ke Kelas 7",
      subtopics: [
        "PENJUMLAHAN BILANGAN BULAT",
        "PENGURANGAN BILANGAN BULAT",
        "PERKALIAN BILANGAN BULAT",
        "PEMBAGIAN BILANGAN BULAT",
        "OPERASI HITUNG CAMPURAN BILANGAN BULAT",
        "KPK DAN FPB",
      ],
    },
    en: {
      title: "INTEGERS",
      kelas: "Grade 7",
      backLabel: "Back to Grade 7",
      subtopics: [
        "ADDITION OF INTEGERS",
        "SUBTRACTION OF INTEGERS",
        "MULTIPLICATION OF INTEGERS",
        "DIVISION OF INTEGERS",
        "MIXED OPERATIONS WITH INTEGERS",
        "LCM AND GCD",
      ],
    },
    ja: {
      title: "整数",
      kelas: "中学1年",
      backLabel: "中学1年に戻る",
      subtopics: [
        "整数の加法",
        "整数の減法",
        "整数の乗法",
        "整数の除法",
        "整数の混合演算",
        "最小公倍数と最大公約数",
      ],
    },
  };

  const c = translations[language];

  const subtopics = [
    { label: c.subtopics[0], path: "/materi-matematika/kelas-7/bilangan-bulat/penjumlahan", icon: "➕" },
    { label: c.subtopics[1], path: "/materi-matematika/kelas-7/bilangan-bulat/pengurangan", icon: "➖" },
    { label: c.subtopics[2], path: "/materi-matematika/kelas-7/bilangan-bulat/perkalian", icon: "✖️" },
    { label: c.subtopics[3], path: "/materi-matematika/kelas-7/bilangan-bulat/pembagian", icon: "➗" },
    { label: c.subtopics[4], path: "/materi-matematika/kelas-7/bilangan-bulat/operasi-campuran", icon: "🔢" },
    { label: c.subtopics[5], path: "/materi-matematika/kelas-7/bilangan-bulat/kpk-fpb", icon: "🌐" },
  ];

  return (
    <MateriTopicPage
      title={c.title}
      emoji="🔢"
      kelas={c.kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={c.backLabel}
    />
  );
};

export default BilanganBulatPage;
