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
    title: "PEMANGKATAN BENTUK ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Pangkat = Perkalian Berulang",
    introPara: "Pemangkatan artinya mengalikan sebuah bentuk aljabar dengan dirinya sendiri sebanyak pangkat kali. Misalnya",
    hatiHati: "Hati-hati! Perhatikan letak pangkat:",
    hati1: "→ hanya",
    hati1b: "yang dikuadratkan =",
    hati2: "→ seluruh",
    hati2b: "dikuadratkan =",
    hati3: "Jadi",
    hati3b: "!",

    konsepTitle: "Ringkasan Intisari: Rumus dan Segitiga Pascal",
    rumusTitle: "Rumus Pengkuadratan Suku Dua:",
    pascalTitle: "Segitiga Pascal untuk Koefisien:",
    pascalNote: "Pangkat dari",
    pascalNote2: "turun, pangkat dari",
    pascalNote3: "naik.",
    kubikTitle: "Contoh Pangkat 3:",

    tips: "Tips:",
    tipsDesc: "Untuk pangkat negatif",
    tipsDesc2: ", tanda berganti-ganti: +, −, +, −, ... mulai dari suku pertama.",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",

    ex1Q: "Tentukan:",
    ex1S: "Pangkatkan seluruh bagian di dalam kurung:",

    ex2Q: "Jabarkan:",
    ex2S: "Gunakan rumus",
    ex2Swith: "dengan",

    ex3Q: "Jabarkan",
    ex3Q2: "menggunakan Segitiga Pascal!",
    ex3S1: "Koefisien untuk pangkat 3 dari Segitiga Pascal:",
    ex3S2: "Terapkan pola dengan",
    ex3S3: "Hitung masing-masing suku:",
  },
  en: {
    title: "POWERS OF ALGEBRAIC EXPRESSIONS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "Exponent = Repeated Multiplication",
    introPara: "Raising to a power means multiplying an algebraic expression by itself as many times as the exponent indicates. For example,",
    hatiHati: "Caution! Pay attention to where the exponent is placed:",
    hati1: "→ only",
    hati1b: "is squared =",
    hati2: "→ the entire",
    hati2b: "is squared =",
    hati3: "So",
    hati3b: "!",

    konsepTitle: "Key Summary: Formulas and Pascal's Triangle",
    rumusTitle: "Squaring a Binomial:",
    pascalTitle: "Pascal's Triangle for Coefficients:",
    pascalNote: "The power of",
    pascalNote2: "decreases, the power of",
    pascalNote3: "increases.",
    kubikTitle: "Example for Power of 3:",

    tips: "Tips:",
    tipsDesc: "For the negative form",
    tipsDesc2: ", the signs alternate: +, −, +, −, ... starting from the first term.",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",

    ex1Q: "Find:",
    ex1S: "Raise every part inside the brackets to the power:",

    ex2Q: "Expand:",
    ex2S: "Use the formula",
    ex2Swith: "with",

    ex3Q: "Expand",
    ex3Q2: "using Pascal's Triangle!",
    ex3S1: "Coefficients for power 3 from Pascal's Triangle:",
    ex3S2: "Apply the pattern with",
    ex3S3: "Calculate each term:",
  },
  ja: {
    title: "代数式のべき乗",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "べき乗 = 繰り返しの乗算",
    introPara: "べき乗とは、代数式を指数の回数だけ自分自身に掛け算することです。例えば、",
    hatiHati: "注意！指数の位置に気をつけよう：",
    hati1: "→",
    hati1b: "だけが2乗される =",
    hati2: "→",
    hati2b: "全体が2乗される =",
    hati3: "つまり",
    hati3b: "！",

    konsepTitle: "要点まとめ：公式とパスカルの三角形",
    rumusTitle: "二項式の2乗の公式：",
    pascalTitle: "係数のためのパスカルの三角形：",
    pascalNote: "",
    pascalNote2: "の指数は下がり、",
    pascalNote3: "の指数は上がる。",
    kubikTitle: "3乗の例：",

    tips: "ヒント：",
    tipsDesc: "負の形",
    tipsDesc2: "では、符号が交互に変わる：+、−、+、−、... 第1項から始まる。",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",

    ex1Q: "求めなさい：",
    ex1S: "括弧内の全部分をべき乗する：",

    ex2Q: "展開しなさい：",
    ex2S: "公式",
    ex2Swith: "を使う。ここで",

    ex3Q: "",
    ex3Q2: "をパスカルの三角形を使って展開しなさい！",
    ex3S1: "パスカルの三角形から3乗の係数：",
    ex3S2: "パターンを適用する。",
    ex3S3: "各項を計算する：",
  },
};

const PemangkatanAljabarPage = () => {
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

  const pascalALabel = language === "en" ? "a" : language === "ja" ? "a" : "a";
  const pascalBLabel = language === "en" ? "b" : language === "ja" ? "b" : "b";

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
                  {t.introPara} <InlineMath math="(4a)^2 = 4a \times 4a = 16a^2" />.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.hatiHati}</p>
                  <p className="font-body text-sm text-white/80"><InlineMath math="3a^2" /> {t.hati1} <InlineMath math="a" /> {t.hati1b} <InlineMath math="3 \times a \times a" /></p>
                  <p className="font-body text-sm text-white/80"><InlineMath math="(3a)^2" /> {t.hati2} <InlineMath math="3a" /> {t.hati2b} <InlineMath math="9a^2" /></p>
                  <p className="font-body text-sm text-red-300 font-semibold">{t.hati3} <InlineMath math="3a^2 \neq (3a)^2" />{t.hati3b}</p>
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
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">{t.rumusTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <BlockMath math="(a + b)^2 = a^2 + 2ab + b^2" />
                    <BlockMath math="(a - b)^2 = a^2 - 2ab + b^2" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.pascalTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3 font-mono text-xs text-center text-white/70 space-y-1">
                    <p>1</p>
                    <p>1  1</p>
                    <p>1  2  1  {language === "en" ? "→ for power 2" : language === "ja" ? "→ 2乗用" : "→ untuk pangkat 2"}</p>
                    <p>1  3  3  1  {language === "en" ? "→ for power 3" : language === "ja" ? "→ 3乗用" : "→ untuk pangkat 3"}</p>
                    <p>1  4  6  4  1  {language === "en" ? "→ for power 4" : language === "ja" ? "→ 4乗用" : "→ untuk pangkat 4"}</p>
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">
                    {t.pascalNote} <InlineMath math={pascalALabel} /> {t.pascalNote2} <InlineMath math={pascalBLabel} /> {t.pascalNote3}
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.kubikTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3" />
                    <BlockMath math="(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tips}</strong> {t.tipsDesc} <InlineMath math="(a-b)^n" />{t.tipsDesc2}
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
                    <p className="font-body text-sm text-white">{t.ex1Q} <InlineMath math="(-15m^4n^3)^2" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.ex1S}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(-15m^4n^3)^2 = (-15)^2 \cdot (m^4)^2 \cdot (n^3)^2" />
                        <BlockMath math="= 225m^8n^6" />
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
                    <p className="font-body text-sm text-white">{t.ex2Q} <InlineMath math="(5x^2 - 2x)^2" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.ex2S} <InlineMath math="(a-b)^2 = a^2 - 2ab + b^2" /> {t.ex2Swith} <InlineMath math="a = 5x^2" />, <InlineMath math="b = 2x" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(5x^2)^2 - 2(5x^2)(2x) + (2x)^2" />
                        <BlockMath math="= 25x^4 - 20x^3 + 4x^2" />
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
                      {t.ex3Q} <InlineMath math="(3x - 2y)^3" /> {t.ex3Q2}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex3S1} <strong>1, 3, 3, 1</strong></p>
                      <p><strong>{t.step} 2:</strong> {t.ex3S2} <InlineMath math="a = 3x" />, <InlineMath math="b = -2y" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="1(3x)^3 + 3(3x)^2(-2y) + 3(3x)(-2y)^2 + 1(-2y)^3" />
                      </div>
                      <p><strong>{t.step} 3:</strong> {t.ex3S3}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 27x^3 + 3(9x^2)(-2y) + 3(3x)(4y^2) + (-8y^3)" />
                        <BlockMath math="= 27x^3 - 54x^2y + 36xy^2 - 8y^3" />
                      </div>
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

export default PemangkatanAljabarPage;
