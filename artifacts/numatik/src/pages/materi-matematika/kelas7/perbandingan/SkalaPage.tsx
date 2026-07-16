import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Map } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    title: "SKALA",
    subtitle: "Kelas 7 · Perbandingan · Materi Matematika",
    back: "← Kembali ke Perbandingan",
    introTitle: "Kenapa Kita Butuh Skala?",
    introBody: "Coba bayangkan kamu diminta menggambar peta Indonesia di selembar kertas A4. Mustahil menggambar sesuai ukuran aslinya, kan? Di sinilah skala berperan — ia memungkinkan kita merepresentasikan benda besar dalam ukuran yang jauh lebih kecil, atau benda kecil dalam ukuran yang lebih besar, tanpa mengubah proporsinya.",
    cat1Title: "Peta & Denah",
    cat1Body: "Wilayah luas jadi muat di kertas",
    cat2Title: "Arsitektur",
    cat2Body: "Denah rumah atau gedung",
    cat3Title: "Miniatur",
    cat3Body: "Maket, model, dan replika",
    introNote: "Penting: Skala selalu menyamakan satuan sebelum dibandingkan. Ubah dulu ke satuan yang sama (biasanya cm), baru hitung rasionya!",
    konsepTitle: "Ringkasan Intisari: Rumus Skala",
    konsepBody: "Skala adalah perbandingan antara ukuran pada gambar/peta dengan ukuran aslinya di dunia nyata. Secara matematis:",
    formulaTitle: "Rumus Dasar Skala:",
    sLabel: "= Skala (biasanya ditulis sebagai",
    jpLabel: "= Jarak/ukuran pada peta atau gambar",
    jsLabel: "= Jarak/ukuran sebenarnya di dunia nyata",
    findJs: "Mencari Jarak Sebenarnya:",
    findJp: "Mencari Jarak di Peta:",
    readNote: "Cara Baca Skala 1 : 500.000: Setiap 1 cm di peta = 500.000 cm (atau 5 km) di dunia nyata. Semakin besar angka di belakang titik dua, semakin kecil gambar dibanding aslinya.",
    luasTitle: "Konsep Khusus: Skala pada Luas",
    luasBody: "Ketika berurusan dengan luas (bukan panjang), skala harus dikuadratkan terlebih dahulu karena luas adalah hasil kali dua dimensi panjang.",
    luasFormulaTitle: "Rumus Skala untuk Luas:",
    findLs: "Mencari Luas Sebenarnya:",
    findLp: "Mencari Luas di Peta:",
    luasExample: "Contoh Singkat:",
    luasExQ: "Peta berskala 1:500. Luas taman di peta = 6 cm². Berapa luas sebenarnya?",
    contohTitle: "Contoh Soal dan Pembahasan",
    badgeMudah: "MUDAH",
    badgeSedang: "SEDANG",
    badgeSulit: "SULIT",
    pembahasan: "PEMBAHASAN:",
    langkah: "Langkah",
    diketahui: "Diketahui:",
    ubah: "Ubah dulu:",
    bagiana: "Bagian (a) – Mencari Skala:",
    bagianb: "Bagian (b) – Mencari Jarak di Denah:",
    bagianaLuas: "Bagian (a) – Mencari Luas Sebenarnya:",
    bagianbLuas: "Bagian (b) – Mencari Luas di Denah:",
    skalaDenah: "Skala denah =",
    jarakDenah: "Jarak di denah =",
    luasSebenarnya: "Luas lapangan sebenarnya =",
    luasDenah: "Luas lapangan futsal di denah =",
    c1Title: "Contoh 1 – Mencari Jarak Sebenarnya",
    c1Q: "Sebuah peta memiliki skala 1 : 2.000.000. Jarak antara Kota A dan Kota B pada peta tersebut adalah 4,5 cm. Berapa jarak sebenarnya kedua kota itu dalam kilometer?",
    c1Result: "Jarak sebenarnya Kota A ke Kota B = 90 km",
    c2Title: "Contoh 2 – Mencari Skala & Jarak di Peta",
    c2Q: "Jarak antara dua desa adalah 15 km. Pada sebuah denah wilayah, jarak keduanya digambar sepanjang 3 cm.\n(a) Tentukan skala denah tersebut!\n(b) Jika ada desa ketiga yang jaraknya 24 km dari desa pertama, berapa cm jaraknya di denah?",
    c2UbahA: "15 km = 15 × 100.000 cm = 1.500.000 cm",
    c2UbahB: "24 km = 2.400.000 cm",
    c2ResultA: "Skala denah = 1 : 500.000",
    c2ResultB: "Jarak di denah = 4,8 cm",
    c3Title: "Contoh 3 – Skala pada Luas",
    c3Q: "Sebuah denah lapangan olahraga menggunakan skala 1 : 1.000. Pada denah, luas lapangan tersebut adalah 12 cm².\n(a) Tentukan luas lapangan sebenarnya dalam m²!\n(b) Jika lapangan futsal di sebelahnya luasnya 800 m², berapa cm² luasnya di denah?",
    c3NoteA: "Skala panjang 1:1.000, maka skala luas = 1 : 1.000² = 1 : 1.000.000",
    c3NoteB: "800 m² = 800 × 10.000 = 8.000.000 cm²",
    c3ResultA: "Luas lapangan sebenarnya = 1.200 m²",
    c3ResultB: "Luas lapangan futsal di denah = 8 cm²",
  },
  en: {
    title: "SCALE",
    subtitle: "Grade 7 · Ratio · Mathematics",
    back: "← Back to Ratio",
    introTitle: "Why Do We Need Scale?",
    introBody: "Imagine being asked to draw a map of a country on an A4 sheet. It is impossible to draw it at actual size! This is where scale comes in — it lets us represent large objects in a much smaller size, or small objects in a larger size, without changing the proportions.",
    cat1Title: "Maps & Floor Plans",
    cat1Body: "Large areas fit on paper",
    cat2Title: "Architecture",
    cat2Body: "House or building blueprints",
    cat3Title: "Miniatures",
    cat3Body: "Scale models and replicas",
    introNote: "Important: Scale always requires the same units before comparing. Convert to the same unit (usually cm) first, then calculate the ratio!",
    konsepTitle: "Summary: Scale Formulas",
    konsepBody: "A scale is the ratio between the measurement on a drawing/map and the actual measurement in the real world. Mathematically:",
    formulaTitle: "Basic Scale Formula:",
    sLabel: "= Scale (usually written as",
    jpLabel: "= Distance/size on the map or drawing",
    jsLabel: "= Actual distance/size in the real world",
    findJs: "Finding the Actual Distance:",
    findJp: "Finding the Map Distance:",
    readNote: "Reading Scale 1 : 500,000: Every 1 cm on the map = 500,000 cm (or 5 km) in the real world. The larger the number after the colon, the smaller the drawing compared to reality.",
    luasTitle: "Special Concept: Scale for Area",
    luasBody: "When dealing with area (not length), the scale must be squared first, because area is the product of two length dimensions.",
    luasFormulaTitle: "Scale Formula for Area:",
    findLs: "Finding the Actual Area:",
    findLp: "Finding the Map Area:",
    luasExample: "Quick Example:",
    luasExQ: "Map scale 1:500. Area of park on map = 6 cm². What is the actual area?",
    contohTitle: "Examples and Solutions",
    badgeMudah: "EASY",
    badgeSedang: "MEDIUM",
    badgeSulit: "HARD",
    pembahasan: "SOLUTION:",
    langkah: "Step",
    diketahui: "Given:",
    ubah: "Convert first:",
    bagiana: "Part (a) – Finding the Scale:",
    bagianb: "Part (b) – Finding the Map Distance:",
    bagianaLuas: "Part (a) – Finding the Actual Area:",
    bagianbLuas: "Part (b) – Finding the Map Area:",
    skalaDenah: "Scale =",
    jarakDenah: "Map distance =",
    luasSebenarnya: "Actual field area =",
    luasDenah: "Futsal field area on map =",
    c1Title: "Example 1 – Finding the Actual Distance",
    c1Q: "A map has a scale of 1 : 2,000,000. The distance between City A and City B on the map is 4.5 cm. What is the actual distance between the two cities in kilometres?",
    c1Result: "Actual distance from City A to City B = 90 km",
    c2Title: "Example 2 – Finding the Scale & Map Distance",
    c2Q: "The distance between two villages is 15 km. On a regional map, this distance is drawn as 3 cm.\n(a) Find the scale of the map!\n(b) If a third village is 24 km from the first, how many cm is that on the map?",
    c2UbahA: "15 km = 15 × 100,000 cm = 1,500,000 cm",
    c2UbahB: "24 km = 2,400,000 cm",
    c2ResultA: "Scale = 1 : 500,000",
    c2ResultB: "Map distance = 4.8 cm",
    c3Title: "Example 3 – Scale for Area",
    c3Q: "A sports field floor plan uses a scale of 1 : 1,000. On the plan, the field area is 12 cm².\n(a) Find the actual area of the field in m²!\n(b) If the adjacent futsal field has an actual area of 800 m², what is its area on the plan in cm²?",
    c3NoteA: "Length scale 1:1,000, so area scale = 1 : 1,000² = 1 : 1,000,000",
    c3NoteB: "800 m² = 800 × 10,000 = 8,000,000 cm²",
    c3ResultA: "Actual field area = 1,200 m²",
    c3ResultB: "Futsal field area on plan = 8 cm²",
  },
  ja: {
    title: "縮尺",
    subtitle: "中学1年 · 比 · 数学",
    back: "← 比に戻る",
    introTitle: "なぜ縮尺が必要なの？",
    introBody: "A4用紙に地図を描くことを想像してください。実際のサイズで描くのは不可能です！ここで縮尺が役立ちます — 縮尺を使うと、大きなものを小さく、または小さなものを大きく、比率を変えずに表すことができます。",
    cat1Title: "地図・間取り図",
    cat1Body: "広い地域が紙に収まる",
    cat2Title: "建築",
    cat2Body: "住宅・建物の設計図",
    cat3Title: "模型",
    cat3Body: "スケールモデルとレプリカ",
    introNote: "重要：縮尺を計算する前に必ず単位を揃えます。同じ単位（通常はcm）に換算してから比を計算します！",
    konsepTitle: "まとめ：縮尺の公式",
    konsepBody: "縮尺とは、地図や図面上の寸法と実際の寸法の比率です。数学的には：",
    formulaTitle: "基本の縮尺公式：",
    sLabel: "= 縮尺（通常",
    jpLabel: "= 地図・図面上の距離・寸法",
    jsLabel: "= 実際の距離・寸法",
    findJs: "実際の距離を求める：",
    findJp: "地図上の距離を求める：",
    readNote: "縮尺 1：500,000 の読み方：地図上の1cm = 実際の500,000cm（= 5km）。コロンの後の数字が大きいほど、図は実物より小さくなります。",
    luasTitle: "特別な概念：面積の縮尺",
    luasBody: "長さではなく面積を扱うとき、縮尺を2乗する必要があります。面積は2つの長さの積だからです。",
    luasFormulaTitle: "面積の縮尺公式：",
    findLs: "実際の面積を求める：",
    findLp: "地図上の面積を求める：",
    luasExample: "簡単な例：",
    luasExQ: "縮尺1:500の地図。地図上の公園の面積 = 6cm²。実際の面積は？",
    contohTitle: "例題と解説",
    badgeMudah: "基本",
    badgeSedang: "標準",
    badgeSulit: "発展",
    pembahasan: "解説：",
    langkah: "ステップ",
    diketahui: "与えられた情報：",
    ubah: "まず換算：",
    bagiana: "(a) 縮尺を求める：",
    bagianb: "(b) 地図上の距離を求める：",
    bagianaLuas: "(a) 実際の面積を求める：",
    bagianbLuas: "(b) 地図上の面積を求める：",
    skalaDenah: "縮尺 =",
    jarakDenah: "地図上の距離 =",
    luasSebenarnya: "実際のグラウンド面積 =",
    luasDenah: "地図上のフットサルコート面積 =",
    c1Title: "例題1 – 実際の距離を求める",
    c1Q: "地図の縮尺が1：2,000,000です。地図上で都市Aと都市Bの距離は4.5cmです。実際の2都市間の距離は何kmですか？",
    c1Result: "都市Aから都市Bまでの実際の距離 = 90km",
    c2Title: "例題2 – 縮尺と地図上の距離を求める",
    c2Q: "2つの村の実際の距離は15kmです。地域の地図ではこの距離が3cmで描かれています。\n(a) 地図の縮尺を求めなさい。\n(b) 3番目の村が1番目の村から24km離れているとき、地図上では何cmですか？",
    c2UbahA: "15km = 15 × 100,000cm = 1,500,000cm",
    c2UbahB: "24km = 2,400,000cm",
    c2ResultA: "縮尺 = 1：500,000",
    c2ResultB: "地図上の距離 = 4.8cm",
    c3Title: "例題3 – 面積の縮尺",
    c3Q: "スポーツグラウンドの間取り図の縮尺は1：1,000です。図面上のグラウンドの面積は12cm²です。\n(a) 実際のグラウンドの面積をm²で求めなさい。\n(b) 隣接するフットサルコートの実際の面積が800m²のとき、図面上では何cm²ですか？",
    c3NoteA: "長さの縮尺が1:1,000なので、面積の縮尺 = 1：1,000² = 1：1,000,000",
    c3NoteB: "800m² = 800 × 10,000 = 8,000,000cm²",
    c3ResultA: "実際のグラウンド面積 = 1,200m²",
    c3ResultB: "図面上のフットサルコート面積 = 8cm²",
  },
};

const SkalaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "luas", "contoh"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.subtitle}
        </p>

        <div className="rounded-xl overflow-hidden mb-4 border border-white/10 shadow-lg animate-slide-up">
          <img
            src={"/images/image_1775455799668.png"}
            alt="Scale map illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* SECTION: PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                    <Map className="w-6 h-6 text-blue-300 mx-auto mb-1" />
                    <p className="font-body text-xs font-semibold text-blue-300">{t.cat1Title}</p>
                    <p className="font-body text-xs text-white/60 mt-1">{t.cat1Body}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <BookOpen className="w-6 h-6 text-green-300 mx-auto mb-1" />
                    <p className="font-body text-xs font-semibold text-green-300">{t.cat2Title}</p>
                    <p className="font-body text-xs text-white/60 mt-1">{t.cat2Body}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
                    <Target className="w-6 h-6 text-purple-300 mx-auto mb-1" />
                    <p className="font-body text-xs font-semibold text-purple-300">{t.cat3Title}</p>
                    <p className="font-body text-xs text-white/60 mt-1">{t.cat3Body}</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{language === "id" ? "Penting:" : language === "ja" ? "重要：" : "Important:"}</strong>{" "}
                    {t.introNote.replace(/^Penting: |^Important: |^重要：/, "")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: RINGKASAN INTISARI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("konsep")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.konsepTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  <strong className="text-primary">{language === "id" ? "Skala" : language === "ja" ? "縮尺" : "Scale"}</strong>{" "}
                  {t.konsepBody.replace(/^Skala |^A scale |^縮尺/, "")}
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">{t.formulaTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="S = \frac{J_p}{J_s}" />
                  </div>
                  <div className="mt-3 space-y-1 font-body text-sm text-white/70">
                    <p><InlineMath math="S" /> {t.sLabel} <InlineMath math="1 : n" />)</p>
                    <p><InlineMath math="J_p" /> {t.jpLabel}</p>
                    <p><InlineMath math="J_s" /> {t.jsLabel}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.findJs}</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="J_s = \frac{J_p}{S}" />
                    </div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.findJp}</p>
                    <div className="bg-slate-900/50 rounded p-2">
                      <BlockMath math="J_p = S \times J_s" />
                    </div>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">{t.readNote}</p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: SKALA LUAS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("luas")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{t.luasTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.luasBody}</p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-3">{t.luasFormulaTitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body text-xs text-white/60 mb-1">{t.findLs}</p>
                      <BlockMath math="L_s = \frac{L_p}{S^2}" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="font-body text-xs text-white/60 mb-1">{t.findLp}</p>
                      <BlockMath math="L_p = S^2 \times L_s" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white/60 mb-2 text-xs font-semibold">{t.luasExample}</p>
                  <p className="font-body text-sm text-white/80">{t.luasExQ}</p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2">
                    <BlockMath math="L_s = \frac{6 \text{ cm}^2}{(1/500)^2} = 6 \times 500^2 = 6 \times 250.000 = 1.500.000 \text{ cm}^2 = 150 \text{ m}^2" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION: CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.contohTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Contoh 1 - MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMudah}</span>
                    <span className="font-body font-semibold text-white">{t.c1Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.c1Q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.pembahasan}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.diketahui} <InlineMath math="S = \frac{1}{2.000.000}" />, <InlineMath math="J_p = 4{,}5 \text{ cm}" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="J_s = \frac{J_p}{S} = 4{,}5 \times 2.000.000 = 9.000.000 \text{ cm}" />
                        <BlockMath math="J_s = \frac{9.000.000}{100.000} = 90 \text{ km}" />
                      </div>
                      <p className="text-primary font-semibold">{t.c1Result}</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 - SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSedang}</span>
                    <span className="font-body font-semibold text-white">{t.c2Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white whitespace-pre-line">{t.c2Q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.bagiana}</strong></p>
                      <p>{t.ubah} <InlineMath math={language === "id" ? "J_s = 15 \\text{ km} = 15 \\times 100.000 \\text{ cm} = 1.500.000 \\text{ cm}" : "J_s = 15 \\text{ km} = 1{,}500{,}000 \\text{ cm}"} /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={language === "id" ? "S = \\frac{J_p}{J_s} = \\frac{3 \\text{ cm}}{1.500.000 \\text{ cm}} = \\frac{1}{500.000}" : "S = \\frac{J_p}{J_s} = \\frac{3 \\text{ cm}}{1{,}500{,}000 \\text{ cm}} = \\frac{1}{500{,}000}"} />
                      </div>
                      <p className="text-yellow-300"><strong>{t.c2ResultA}</strong></p>
                      <p><strong>{t.bagianb}</strong></p>
                      <p><InlineMath math={language === "id" ? "J_s = 24 \\text{ km} = 2.400.000 \\text{ cm}" : "J_s = 24 \\text{ km} = 2{,}400{,}000 \\text{ cm}"} /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={language === "id" ? "J_p = S \\times J_s = \\frac{1}{500.000} \\times 2.400.000 = 4{,}8 \\text{ cm}" : "J_p = S \\times J_s = \\frac{1}{500{,}000} \\times 2{,}400{,}000 = 4{.}8 \\text{ cm}"} />
                      </div>
                      <p className="text-primary font-semibold">{t.c2ResultB}</p>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeSulit}</span>
                    <span className="font-body font-semibold text-white">{t.c3Title}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white whitespace-pre-line">{t.c3Q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.pembahasan}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.bagianaLuas}</strong></p>
                      <p>{t.c3NoteA}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="L_s = L_p \times 1.000.000 = 12 \times 1.000.000 = 12.000.000 \text{ cm}^2" />
                        <BlockMath math="L_s = \frac{12.000.000}{10.000} = 1.200 \text{ m}^2" />
                      </div>
                      <p className="text-red-300"><strong>{t.c3ResultA}</strong></p>
                      <p><strong>{t.bagianbLuas}</strong></p>
                      <p>{t.c3NoteB}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="L_p = \frac{L_s}{1.000.000} = \frac{8.000.000}{1.000.000} = 8 \text{ cm}^2" />
                      </div>
                      <p className="text-primary font-semibold">{t.c3ResultB}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/perbandingan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkalaPage;
