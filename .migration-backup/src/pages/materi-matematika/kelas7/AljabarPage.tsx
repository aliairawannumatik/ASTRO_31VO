import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const AljabarPage = () => {
  const { language } = useLanguage();

  const translations = {
    id: {
      title: "ALJABAR",
      kelas: "Kelas 7",
      backLabel: "Kembali ke Kelas 7",
      subtopics: [
        "PENGERTIAN DAN UNSUR-UNSUR BENTUK ALJABAR",
        "PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR",
        "PERKALIAN BENTUK ALJABAR",
        "PEMBAGIAN BENTUK ALJABAR",
        "PEMANGKATAN BENTUK ALJABAR",
        "SUBSTITUSI BILANGAN PADA BENTUK ALJABAR",
        "FAKTORISASI BENTUK ALJABAR",
        "MENYEDERHANAKAN PECAHAN ALJABAR",
      ],
    },
    en: {
      title: "ALGEBRA",
      kelas: "Grade 7",
      backLabel: "Back to Grade 7",
      subtopics: [
        "UNDERSTANDING ALGEBRAIC EXPRESSIONS AND THEIR ELEMENTS",
        "ADDITION AND SUBTRACTION OF ALGEBRAIC EXPRESSIONS",
        "MULTIPLICATION OF ALGEBRAIC EXPRESSIONS",
        "DIVISION OF ALGEBRAIC EXPRESSIONS",
        "POWERS OF ALGEBRAIC EXPRESSIONS",
        "SUBSTITUTION IN ALGEBRAIC EXPRESSIONS",
        "FACTORIZATION OF ALGEBRAIC EXPRESSIONS",
        "SIMPLIFYING ALGEBRAIC FRACTIONS",
      ],
    },
    ja: {
      title: "代数",
      kelas: "中学1年",
      backLabel: "中学1年に戻る",
      subtopics: [
        "代数式とその要素の理解",
        "代数式の加法と減法",
        "代数式の乗法",
        "代数式の除法",
        "代数式のべき乗",
        "代数式への代入",
        "代数式の因数分解",
        "代数分数の簡略化",
      ],
    },
  };

  const c = translations[language];

  const subtopics = [
    { label: c.subtopics[0], path: "/materi-matematika/kelas-7/aljabar/pengertian-unsur", icon: "📝" },
    { label: c.subtopics[1], path: "/materi-matematika/kelas-7/aljabar/penjumlahan-pengurangan", icon: "➕" },
    { label: c.subtopics[2], path: "/materi-matematika/kelas-7/aljabar/perkalian", icon: "✖️" },
    { label: c.subtopics[3], path: "/materi-matematika/kelas-7/aljabar/pembagian", icon: "➗" },
    { label: c.subtopics[4], path: "/materi-matematika/kelas-7/aljabar/pemangkatan", icon: "⬆️" },
    { label: c.subtopics[5], path: "/materi-matematika/kelas-7/aljabar/substitusi", icon: "🔄" },
    { label: c.subtopics[6], path: "/materi-matematika/kelas-7/aljabar/faktorisasi", icon: "🔬" },
    { label: c.subtopics[7], path: "/materi-matematika/kelas-7/aljabar/operasi-pecahan", icon: "🔣" },
  ];

  return (
    <MateriTopicPage
      title={c.title}
      emoji="🔣"
      kelas={c.kelas}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={c.backLabel}
    />
  );
};

export default AljabarPage;
