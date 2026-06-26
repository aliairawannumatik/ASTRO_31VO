import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    title: "PERKALIAN BENTUK ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Mengalikan Bentuk Aljabar: Bayangkan Persegi Panjang!",
    introPara: "Perkalian aljabar bisa dipahami lewat konsep luas persegi panjang. Jika panjangnya",
    introPara2: "dan lebarnya",
    introPara3: "maka luasnya adalah",
    introPara4: "Luas ini bisa dijabarkan menjadi",
    introBox: "Proses mengubah bentuk perkalian menjadi bentuk penjumlahan disebut",
    introBoxStrong: "menjabarkan",
    introBoxEnd: "Caranya menggunakan",
    introBoxEnd2: "sifat distributif",

    konsepTitle: "Ringkasan Intisari: Jenis-Jenis Perkalian",
    jenis1Title: "1. Perkalian Suku Tunggal",
    jenis1Desc: "Kalikan koefisien dengan koefisien, pangkatkan variabel yang sama:",
    jenis2Title: "2. Suku Tunggal × Suku Dua/Tiga",
    jenis2Desc: "Gunakan sifat distributif — kalikan setiap suku di dalam kurung:",
    jenis3Title: "3. Suku Dua × Suku Dua",
    jenis3Desc: "Setiap suku di kiri dikalikan dengan setiap suku di kanan (FOIL):",
    foilTips: "Tips FOIL:",
    foilDesc: "First (suku pertama × pertama), Outer (luar × luar), Inner (dalam × dalam), Last (terakhir × terakhir).",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",
    result: "Hasil:",

    ex1Q: "Jabarkan:",
    ex1S: "Kalikan",
    ex1S2: "ke setiap suku dalam kurung:",

    ex2Q: "Jabarkan:",
    ex2S: "Gunakan hukum distributif —",
    ex2S2: "diuraikan:",

    ex3Q: "Jabarkan dan sederhanakan:",
    ex3S1: "Distribusikan suku pertama",
    ex3S2: "Distribusikan suku kedua",
    ex3S3: "Jumlahkan dan sederhanakan:",
    ex3Note: "(ini adalah selisih dua kubik!)",
  },
  en: {
    title: "MULTIPLICATION OF ALGEBRAIC EXPRESSIONS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "Multiplying Algebraic Expressions: Picture a Rectangle!",
    introPara: "Algebraic multiplication can be understood through the concept of rectangle area. If the length is",
    introPara2: "and the width is",
    introPara3: "the area is",
    introPara4: "This area can be expanded to",
    introBox: "The process of changing a product form into a sum form is called",
    introBoxStrong: "expanding",
    introBoxEnd: "It uses the",
    introBoxEnd2: "distributive property",

    konsepTitle: "Key Summary: Types of Multiplication",
    jenis1Title: "1. Single Term Multiplication",
    jenis1Desc: "Multiply coefficients by coefficients, and apply exponent rules for the same variables:",
    jenis2Title: "2. Single Term × Two/Three Terms",
    jenis2Desc: "Use the distributive property — multiply every term inside the brackets:",
    jenis3Title: "3. Two Terms × Two Terms",
    jenis3Desc: "Every term on the left is multiplied by every term on the right (FOIL):",
    foilTips: "FOIL Tips:",
    foilDesc: "First (first × first), Outer (outer × outer), Inner (inner × inner), Last (last × last).",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",
    result: "Result:",

    ex1Q: "Expand:",
    ex1S: "Multiply",
    ex1S2: "by every term inside the brackets:",

    ex2Q: "Expand:",
    ex2S: "Use the distributive law —",
    ex2S2: "is distributed:",

    ex3Q: "Expand and simplify:",
    ex3S1: "Distribute the first term",
    ex3S2: "Distribute the second term",
    ex3S3: "Add and simplify:",
    ex3Note: "(this is a difference of two cubes!)",
  },
  ja: {
    title: "代数式の乗法",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "代数式の乗法：長方形をイメージしよう！",
    introPara: "代数式の乗法は、長方形の面積の概念で理解できます。縦の長さが",
    introPara2: "、横の長さが",
    introPara3: "のとき、面積は",
    introPara4: "この面積を展開すると",
    introBox: "積の形を和の形に変える過程を",
    introBoxStrong: "展開",
    introBoxEnd: "といいます。方法は",
    introBoxEnd2: "分配法則",

    konsepTitle: "要点まとめ：乗法の種類",
    jenis1Title: "1. 単項式どうしの乗法",
    jenis1Desc: "係数は係数どうしで掛け算し、同じ変数は指数法則を使う：",
    jenis2Title: "2. 単項式 × 二項式・三項式",
    jenis2Desc: "分配法則を使い、括弧内のすべての項に掛け算する：",
    jenis3Title: "3. 二項式 × 二項式",
    jenis3Desc: "左辺の各項を右辺の各項に掛け算する（FOIL）：",
    foilTips: "FOILのヒント：",
    foilDesc: "First（最初×最初）、Outer（外×外）、Inner（内×内）、Last（最後×最後）。",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",
    result: "結果：",

    ex1Q: "展開しなさい：",
    ex1S: "",
    ex1S2: "を括弧内の各項に掛け算する：",

    ex2Q: "展開しなさい：",
    ex2S: "分配法則を使う —",
    ex2S2: "を展開する：",

    ex3Q: "展開して簡略化しなさい：",
    ex3S1: "第1項を分配する",
    ex3S2: "第2項を分配する",
    ex3S3: "足し合わせて簡略化する：",
    ex3Note: "（これは二つの立方数の差！）",
  },
};

const PerkalianAljabarPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep", "contoh"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const commutativeMath =
    language === "en"
      ? "a \\times b = ab \\quad \\text{(commutative property)}"
      : language === "ja"
      ? "a \\times b = ab \\quad \\text{（交換法則）}"
      : "a \\times b = ab \\quad \\text{(sifat komutatif)}";

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

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Intro */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introPara} <InlineMath math="(x + 4)" /> {t.introPara2} <InlineMath math="x" />{t.introPara3} <InlineMath math="x(x+4)" />. {t.introPara4} <InlineMath math="x^2 + 4x" />.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    {t.introBox} <strong>{t.introBoxStrong}</strong>. {t.introBoxEnd} <strong>{t.introBoxEnd2}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Konsep */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("konsep")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.konsepTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.jenis1Title}</p>
                  <p className="font-body text-sm text-white/80 mb-2">{t.jenis1Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={commutativeMath} />
                    <BlockMath math="3m \times (-4m^2n) \times 2np = 24m^3n^2p" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.jenis2Title}</p>
                  <p className="font-body text-sm text-white/80 mb-2">{t.jenis2Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="x(x + k) = x^2 + kx" />
                    <BlockMath math="x(x + y + k) = x^2 + xy + kx" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.jenis3Title}</p>
                  <p className="font-body text-sm text-white/80 mb-2">{t.jenis3Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="(a+b)(c+d) = ac + ad + bc + bd" />
                    <BlockMath math="(x+2)(x+5) = x^2 + 7x + 10" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.foilTips}</strong> {t.foilDesc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.contohTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* Mudah */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>
                    <span className="font-body font-semibold text-white">{t.example} 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.ex1Q} <InlineMath math="4x(x^2 + 2xy - 3y^2)" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.ex1S} <InlineMath math="4x" /> {t.ex1S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="4x \cdot x^2 + 4x \cdot 2xy + 4x \cdot (-3y^2)" />
                        <BlockMath math="= 4x^3 + 8x^2y - 12xy^2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sedang */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>
                    <span className="font-body font-semibold text-white">{t.example} 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.ex2Q} <InlineMath math="(3x - 4)(2x + 5)" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.ex2S} <InlineMath math="(3x - 4)" /> {t.ex2S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 3x(2x + 5) + (-4)(2x + 5)" />
                        <BlockMath math="= 6x^2 + 15x - 8x - 20" />
                        <BlockMath math="= 6x^2 + 7x - 20" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sulit */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                    <span className="font-body font-semibold text-white">{t.example} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.ex3Q} <InlineMath math="(2x - 3)(4x^2 + 6x + 9)" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex3S1} <InlineMath math="2x" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="2x(4x^2 + 6x + 9) = 8x^3 + 12x^2 + 18x" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex3S2} <InlineMath math="-3" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-3(4x^2 + 6x + 9) = -12x^2 - 18x - 27" />
                      </div>
                      <p><strong>{t.step} 3:</strong> {t.ex3S3}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="8x^3 + 12x^2 + 18x - 12x^2 - 18x - 27 = 8x^3 - 27" />
                      </div>
                      <p className="text-primary font-semibold">{t.result} <InlineMath math="8x^3 - 27" /> {t.ex3Note}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/aljabar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianAljabarPage;
