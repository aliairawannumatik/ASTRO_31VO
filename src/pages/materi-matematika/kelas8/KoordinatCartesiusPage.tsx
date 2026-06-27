import MateriTopicPage from "@/components/MateriTopicPage";
import { useLanguage } from "@/contexts/LanguageContext";

const KoordinatCartesiusPage = () => {
  const { language } = useLanguage();

  const data = {
    id: {
      title: "KOORDINAT KARTESIUS",
      kelas: "Kelas 8",
      backLabel: "Kembali ke Kelas 8",
      subtopics: [
        { label: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS", path: "/materi-matematika/kelas-8/koordinat-cartesius/unsur-unsur", icon: "📊" },
        { label: "POSISI RELATIF TITIK TERHADAP SEMBARANG TITIK ACUAN DAN SUATU GARIS", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-dan-garis", icon: "📍" },
        { label: "POSISI RELATIF TITIK TERHADAP TITIK ACUAN", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-acuan", icon: "🎯" },
        { label: "POSISI RELATIF TITIK TERHADAP SUATU GARIS", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-garis", icon: "📐" },
        { label: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS", path: "/materi-matematika/kelas-8/koordinat-cartesius/jarak-titik-garis", icon: "📏" },
      ],
    },
    en: {
      title: "CARTESIAN COORDINATES",
      kelas: "Grade 8",
      backLabel: "Back to Grade 8",
      subtopics: [
        { label: "ELEMENTS OF THE CARTESIAN DIAGRAM", path: "/materi-matematika/kelas-8/koordinat-cartesius/unsur-unsur", icon: "📊" },
        { label: "RELATIVE POSITION OF A POINT TO A REFERENCE POINT AND LINE", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-dan-garis", icon: "📍" },
        { label: "RELATIVE POSITION OF A POINT TO A REFERENCE POINT", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-acuan", icon: "🎯" },
        { label: "RELATIVE POSITION OF A POINT TO A LINE", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-garis", icon: "📐" },
        { label: "DISTANCE BETWEEN TWO POINTS AND POINT-TO-LINE DISTANCE", path: "/materi-matematika/kelas-8/koordinat-cartesius/jarak-titik-garis", icon: "📏" },
      ],
    },
    ja: {
      title: "直交座標",
      kelas: "中学2年",
      backLabel: "中学2年に戻る",
      subtopics: [
        { label: "直交座標の要素", path: "/materi-matematika/kelas-8/koordinat-cartesius/unsur-unsur", icon: "📊" },
        { label: "基準点と直線に対する点の相対位置", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-dan-garis", icon: "📍" },
        { label: "基準点に対する点の相対位置", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-titik-acuan", icon: "🎯" },
        { label: "直線に対する点の相対位置", path: "/materi-matematika/kelas-8/koordinat-cartesius/posisi-relatif-garis", icon: "📐" },
        { label: "2点間の距離と点から直線までの距離", path: "/materi-matematika/kelas-8/koordinat-cartesius/jarak-titik-garis", icon: "📏" },
      ],
    },
  };

  const d = data[language];

  return (
    <MateriTopicPage
      title={d.title}
      emoji="📊"
      kelas={d.kelas}
      subtopics={d.subtopics}
      backPath="/materi-matematika/kelas-8"
      backLabel={d.backLabel}
    />
  );
};

export default KoordinatCartesiusPage;
