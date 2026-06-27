import { useLanguage } from "@/contexts/LanguageContext";
import MateriTopicPage from "@/components/MateriTopicPage";

const subtopicsById = [
  { label: "JUAL BELI, UNTUNG DAN RUGI", path: "/materi-matematika/kelas-7/aritmetika-sosial/jual-beli-untung-rugi", icon: "💹" },
  { label: "DISKON", path: "/materi-matematika/kelas-7/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "BRUTO, NETTO DAN TARA", path: "/materi-matematika/kelas-7/aritmetika-sosial/bruto-netto-tara", icon: "⚖️" },
  { label: "BUNGA TUNGGAL", path: "/materi-matematika/kelas-7/aritmetika-sosial/bunga-tunggal", icon: "💰" },
  { label: "PAJAK PERTAMBAHAN NILAI (PPN)", path: "/materi-matematika/kelas-7/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "PAJAK PENGHASILAN (PPH)", path: "/materi-matematika/kelas-7/aritmetika-sosial/pph", icon: "📋" },
];

const subtopicsByEn = [
  { label: "BUYING & SELLING — PROFIT AND LOSS", path: "/materi-matematika/kelas-7/aritmetika-sosial/jual-beli-untung-rugi", icon: "💹" },
  { label: "DISCOUNT", path: "/materi-matematika/kelas-7/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "GROSS, NET AND TARE", path: "/materi-matematika/kelas-7/aritmetika-sosial/bruto-netto-tara", icon: "⚖️" },
  { label: "SIMPLE INTEREST", path: "/materi-matematika/kelas-7/aritmetika-sosial/bunga-tunggal", icon: "💰" },
  { label: "VALUE ADDED TAX (VAT)", path: "/materi-matematika/kelas-7/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "INCOME TAX", path: "/materi-matematika/kelas-7/aritmetika-sosial/pph", icon: "📋" },
];

const subtopicsByJa = [
  { label: "売買・利益と損失", path: "/materi-matematika/kelas-7/aritmetika-sosial/jual-beli-untung-rugi", icon: "💹" },
  { label: "割引", path: "/materi-matematika/kelas-7/aritmetika-sosial/diskon", icon: "🏷️" },
  { label: "総量・純量・風袋", path: "/materi-matematika/kelas-7/aritmetika-sosial/bruto-netto-tara", icon: "⚖️" },
  { label: "単利", path: "/materi-matematika/kelas-7/aritmetika-sosial/bunga-tunggal", icon: "💰" },
  { label: "消費税（VAT）", path: "/materi-matematika/kelas-7/aritmetika-sosial/ppn", icon: "🧾" },
  { label: "所得税", path: "/materi-matematika/kelas-7/aritmetika-sosial/pph", icon: "📋" },
];

const titles = { id: "ARITMETIKA SOSIAL", en: "SOCIAL ARITHMETIC", ja: "社会算数" };
const kelasMap = { id: "Kelas 7", en: "Grade 7", ja: "中学1年" };
const backLabelMap = { id: "Kembali ke Kelas 7", en: "Back to Grade 7", ja: "中学1年に戻る" };

const AritmetikaSosialPage = () => {
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const subtopics = lang === "en" ? subtopicsByEn : lang === "ja" ? subtopicsByJa : subtopicsById;
  return (
    <MateriTopicPage
      title={titles[lang]}
      emoji="💰"
      kelas={kelasMap[lang]}
      subtopics={subtopics}
      backPath="/materi-matematika/kelas-7"
      backLabel={backLabelMap[lang]}
    />
  );
};

export default AritmetikaSosialPage;
