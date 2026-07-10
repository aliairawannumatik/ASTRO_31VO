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
    title: "MENYEDERHANAKAN PECAHAN ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Pecahan Aljabar: Prinsipnya Sama dengan Pecahan Biasa",
    introPara: "Pecahan aljabar adalah pecahan yang pembilang atau penyebutnya (atau keduanya) memuat bentuk aljabar. Contoh:",
    introBox: "Penting!",
    introBoxDesc: "Penyebut pecahan aljabar",
    introBoxStrong: "tidak boleh nol",
    introBoxEnd: ". Jadi jika penyebutnya",
    introBoxEnd2: ", maka",

    konsepTitle: "Ringkasan Intisari: Operasi pada Pecahan Aljabar",
    op1Title: "1. Menyederhanakan Pecahan Aljabar",
    op1Desc: "Faktorkan pembilang dan penyebut, lalu coret faktor yang sama:",
    op2Title: "2. Penjumlahan & Pengurangan",
    op2Desc: "Samakan penyebut terlebih dahulu (cari KPK penyebut):",
    op3Title: "3. Perkalian & Pembagian",
    tips: "Tips:",
    tipsDesc: "Selalu faktorkan pembilang dan penyebut dulu sebelum melakukan operasi — seringkali ada faktor yang bisa disederhanakan terlebih dahulu!",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",
    result: "Hasil:",
    syarat: "Syarat:",

    ex1Q: "Sederhanakan:",
    ex1S: "Faktorkan pembilang dengan FPT = 4:",

    ex2Q: "Sederhanakan:",
    ex2S1: "Faktorkan pembilang:",
    ex2S2: "Faktorkan penyebut:",
    ex2S3: "Coret faktor yang sama",

    ex3Q: "Hitunglah:",
    ex3S1: "Kedua penyebut berbeda, KPK-nya adalah",
    ex3S2: "Gabungkan pembilang:",
  },
  en: {
    title: "SIMPLIFYING ALGEBRAIC FRACTIONS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "Algebraic Fractions: Same Principle as Ordinary Fractions",
    introPara: "An algebraic fraction is a fraction where the numerator or denominator (or both) contains an algebraic expression. Examples:",
    introBox: "Important!",
    introBoxDesc: "The denominator of an algebraic fraction",
    introBoxStrong: "cannot be zero",
    introBoxEnd: ". So if the denominator is",
    introBoxEnd2: ", then",

    konsepTitle: "Key Summary: Operations on Algebraic Fractions",
    op1Title: "1. Simplifying an Algebraic Fraction",
    op1Desc: "Factor the numerator and denominator, then cancel the common factor:",
    op2Title: "2. Addition & Subtraction",
    op2Desc: "First find a common denominator (LCM of the denominators):",
    op3Title: "3. Multiplication & Division",
    tips: "Tips:",
    tipsDesc: "Always factor the numerator and denominator before performing operations — there is often a factor that can be cancelled first!",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",
    result: "Result:",
    syarat: "Condition:",

    ex1Q: "Simplify:",
    ex1S: "Factor the numerator using GCF = 4:",

    ex2Q: "Simplify:",
    ex2S1: "Factor the numerator:",
    ex2S2: "Factor the denominator:",
    ex2S3: "Cancel the common factor",

    ex3Q: "Calculate:",
    ex3S1: "The two denominators are different; the LCM is",
    ex3S2: "Combine the numerators:",
  },
  ja: {
    title: "代数分数の簡略化",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "代数分数：通常の分数と同じ原則",
    introPara: "代数分数とは、分子または分母（またはその両方）に代数式を含む分数のことです。例：",
    introBox: "重要！",
    introBoxDesc: "代数分数の分母は",
    introBoxStrong: "ゼロであってはいけない",
    introBoxEnd: "。つまり分母が",
    introBoxEnd2: "ならば、",

    konsepTitle: "要点まとめ：代数分数の演算",
    op1Title: "1. 代数分数の簡略化",
    op1Desc: "分子と分母を因数分解し、共通因数をキャンセルする：",
    op2Title: "2. 加法と減法",
    op2Desc: "まず共通分母を見つける（分母の最小公倍数）：",
    op3Title: "3. 乗法と除法",
    tips: "ヒント：",
    tipsDesc: "演算を行う前に必ず分子と分母を因数分解しよう — 先にキャンセルできる因数があることが多い！",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",
    result: "結果：",
    syarat: "条件：",

    ex1Q: "簡略化しなさい：",
    ex1S: "最大公約数 = 4 で分子を因数分解する：",

    ex2Q: "簡略化しなさい：",
    ex2S1: "分子を因数分解する：",
    ex2S2: "分母を因数分解する：",
    ex2S3: "共通因数をキャンセルする",

    ex3Q: "計算しなさい：",
    ex3S1: "2つの分母が異なるため、最小公倍数は",
    ex3S2: "分子をまとめる：",
  },
};

const OperasiPecahanPage = () => {
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
                  {t.introPara} <InlineMath math="\dfrac{3}{2a}" />, <InlineMath math="\dfrac{m+2}{8}" />, <InlineMath math="\dfrac{x-5}{2x+y}" />.
                </p>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-orange-200">
                    <strong>{t.introBox}</strong> {t.introBoxDesc} <strong>{t.introBoxStrong}</strong>{t.introBoxEnd} <InlineMath math="(a - 3)" />{t.introBoxEnd2} <InlineMath math="a \neq 3" />.
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
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.op1Title}</p>
                  <p className="font-body text-sm text-white/80 mb-2">{t.op1Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\frac{x^2 + 4x}{x^2 - 16} = \frac{x(x+4)}{(x+4)(x-4)} = \frac{x}{x-4}" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.op2Title}</p>
                  <p className="font-body text-sm text-white/80 mb-2">{t.op2Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="\frac{a}{b} + \frac{c}{b} = \frac{a+c}{b}" />
                    <BlockMath math="\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.op3Title}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}" />
                    <BlockMath math="\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c} = \frac{ad}{bc}" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tips}</strong> {t.tipsDesc}
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
                    <p className="font-body text-sm text-white">{t.ex1Q} <InlineMath math="\dfrac{4a - 12b}{8}" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.ex1S}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{4(a - 3b)}{8} = \frac{a - 3b}{2}" />
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
                    <p className="font-body text-sm text-white">{t.ex2Q} <InlineMath math="\dfrac{m^2 + m - 6}{2m^2 + 6m}" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex2S1} <InlineMath math="m^2 + m - 6 = (m+3)(m-2)" /></p>
                      <p><strong>{t.step} 2:</strong> {t.ex2S2} <InlineMath math="2m^2 + 6m = 2m(m+3)" /></p>
                      <p><strong>{t.step} 3:</strong> {t.ex2S3} <InlineMath math="(m+3)" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{(m+3)(m-2)}{2m(m+3)} = \frac{m-2}{2m}" />
                      </div>
                      <p className="text-white/60 text-xs">{t.syarat} <InlineMath math="m \neq 0" /> {language === "ja" ? "かつ" : language === "en" ? "and" : "dan"} <InlineMath math="m \neq -3" /></p>
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
                      {t.ex3Q} <InlineMath math="\dfrac{3}{x+2} + \dfrac{5}{x-3}" />
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex3S1} <InlineMath math="(x+2)(x-3)" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{3(x-3)}{(x+2)(x-3)} + \frac{5(x+2)}{(x+2)(x-3)}" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex3S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= \frac{3x - 9 + 5x + 10}{(x+2)(x-3)}" />
                        <BlockMath math="= \frac{8x + 1}{(x+2)(x-3)}" />
                      </div>
                      <p className="text-primary font-semibold">{t.result} <InlineMath math="\dfrac{8x+1}{(x+2)(x-3)}" /></p>
                      <p className="text-white/60 text-xs">{t.syarat} <InlineMath math="x \neq -2" /> {language === "ja" ? "かつ" : language === "en" ? "and" : "dan"} <InlineMath math="x \neq 3" /></p>
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

export default OperasiPecahanPage;
