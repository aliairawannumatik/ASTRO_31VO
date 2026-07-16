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
    title: "PEMBAGIAN BENTUK ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Kunci Pembagian: Cari Faktor yang Sama!",
    introPara: "Pembagian bentuk aljabar bekerja mirip seperti penyederhanaan pecahan biasa. Jika dua bentuk aljabar punya faktor yang sama, kita bisa saling mencoret faktor tersebut untuk menyederhanakan hasilnya.",
    introBox: "Contoh sederhana:",
    introBoxDesc: "karena faktor",
    introBoxDesc2: "ada di keduanya. Demikian pula",

    konsepTitle: "Ringkasan Intisari: Cara Membagi Aljabar",
    m1Title: "Metode 1: Pembagian Langsung (faktor persekutuan)",
    m1Desc: "Jika pembilang dan penyebut punya faktor yang sama, coret faktor tersebut.",
    m2Title: "Metode 2: Bagi Kurung (polinomial)",
    m2Desc: "Digunakan ketika pembagi merupakan suku dua. Caranya sama seperti pembagian bilangan bulat panjang.",
    m2Steps: "Langkah: bagi → kalikan → kurangi → turunkan → ulangi",
    catatan: "Catatan:",
    catatanDesc: "Jika hasil pembagian tidak habis, maka ada",
    catatanStrong: "sisa",
    catatanEnd: "Ditulis sebagai: hasil + sisa/pembagi.",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",
    result: "Hasil:",

    ex1Q: "Tentukan hasil:",
    ex1S: "Pisahkan dan sederhanakan setiap bagian:",

    ex2Q: "Bagi:",
    ex2Method: "PEMBAHASAN (Cara Bagi Kurung):",
    ex2Result: "habis dibagi",

    ex3Q: "Bagi",
    ex3Q2: "dengan",
    ex3Q3: "dan tentukan sisanya!",
    ex3Result: "sisa",
    ex3Note: "Artinya:",
  },
  en: {
    title: "DIVISION OF ALGEBRAIC EXPRESSIONS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "The Key to Division: Find the Common Factor!",
    introPara: "Dividing algebraic expressions works similarly to simplifying ordinary fractions. If two algebraic expressions share a common factor, we can cancel it to simplify the result.",
    introBox: "Simple example:",
    introBoxDesc: "because the factor",
    introBoxDesc2: "is in both. Similarly,",

    konsepTitle: "Key Summary: How to Divide Algebraic Expressions",
    m1Title: "Method 1: Direct Division (common factors)",
    m1Desc: "If the numerator and denominator share a common factor, cancel it.",
    m2Title: "Method 2: Polynomial Long Division",
    m2Desc: "Used when the divisor is a two-term expression. The process is the same as long division with integers.",
    m2Steps: "Steps: divide → multiply → subtract → bring down → repeat",
    catatan: "Note:",
    catatanDesc: "If the division does not divide evenly, there is a",
    catatanStrong: "remainder",
    catatanEnd: "Written as: quotient + remainder/divisor.",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",
    result: "Result:",

    ex1Q: "Find the result:",
    ex1S: "Separate and simplify each part:",

    ex2Q: "Divide:",
    ex2Method: "SOLUTION (Polynomial Long Division):",
    ex2Result: "divides evenly",

    ex3Q: "Divide",
    ex3Q2: "by",
    ex3Q3: "and find the remainder!",
    ex3Result: "remainder",
    ex3Note: "This means:",
  },
  ja: {
    title: "代数式の除法",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "除法の鍵：共通因数を見つけよう！",
    introPara: "代数式の除法は、通常の分数の簡略化と同じように機能します。2つの代数式が共通の因数を持つ場合、それをキャンセルして結果を簡略化できます。",
    introBox: "簡単な例：",
    introBoxDesc: "因数",
    introBoxDesc2: "が両方にあるためです。同様に、",

    konsepTitle: "要点まとめ：代数式の除法の方法",
    m1Title: "方法1：直接除法（共通因数）",
    m1Desc: "分子と分母に共通の因数があれば、それをキャンセルする。",
    m2Title: "方法2：多項式の長除法",
    m2Desc: "除数が二項式の場合に使用します。整数の長除法と同じ手順です。",
    m2Steps: "手順：割る → 掛ける → 引く → 下ろす → 繰り返す",
    catatan: "注意：",
    catatanDesc: "割り切れない場合は",
    catatanStrong: "余り",
    catatanEnd: "が出ます。商 + 余り/除数 と表します。",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",
    result: "結果：",

    ex1Q: "結果を求めなさい：",
    ex1S: "各部分を分けて簡略化する：",

    ex2Q: "割り算しなさい：",
    ex2Method: "解説（多項式の長除法）：",
    ex2Result: "割り切れる",

    ex3Q: "",
    ex3Q2: "で",
    ex3Q3: "を割り、余りを求めなさい！",
    ex3Result: "余り",
    ex3Note: "つまり：",
  },
};

const PembagianAljabarPage = () => {
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
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introPara}</p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    {t.introBox} <InlineMath math="8a \div 2a = 4" /> {t.introBoxDesc} <InlineMath math="2a" /> {t.introBoxDesc2} <InlineMath math="6xy \div 3y = 2x" />.
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
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.m1Title}</p>
                  <p className="font-body text-sm text-white/80">{t.m1Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2">
                    <BlockMath math="\frac{28a^5b^3}{-7a^4} = -4ab^3" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.m2Title}</p>
                  <p className="font-body text-sm text-white/80">{t.m2Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 mt-2 font-mono text-xs text-white/70">
                    <p>{t.m2Steps}</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.catatan}</strong> {t.catatanDesc} <strong>{t.catatanStrong}</strong>. {t.catatanEnd}
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
                    <p className="font-body text-sm text-white">{t.ex1Q} <InlineMath math="42x^7y^8z \div 6x^3y^8" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.ex1S}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{42x^7y^8z}{6x^3y^8} = \frac{42}{6} \cdot \frac{x^7}{x^3} \cdot \frac{y^8}{y^8} \cdot z" />
                        <BlockMath math="= 7 \cdot x^4 \cdot 1 \cdot z = 7x^4z" />
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
                    <p className="font-body text-sm text-white">{t.ex2Q} <InlineMath math="(x^2 + 8x + 12) \div (x + 6)" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.ex2Method}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 font-mono text-xs">
                        <p className="text-white/70">x + 2</p>
                        <p className="text-white/50">──────────────────</p>
                        <p className="text-white/70">x + 6 ) x² + 8x + 12</p>
                        <p className="text-white/70 ml-8">x² + 6x</p>
                        <p className="text-white/50 ml-8">────────</p>
                        <p className="text-white/70 ml-14">2x + 12</p>
                        <p className="text-white/70 ml-14">2x + 12</p>
                        <p className="text-white/50 ml-14">────────</p>
                        <p className="text-primary ml-20">0</p>
                      </div>
                      <p className="text-primary font-semibold">{t.result} <InlineMath math="x + 2" /> ({t.ex2Result})</p>
                    </div>
                  </div>
                </div>

                {/* Sulit — TYPO FIXED: 2x^3 → 2x^2 */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>
                    <span className="font-body font-semibold text-white">{t.example} 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.ex3Q} <InlineMath math="(2x^2 + 7x - 32)" /> {t.ex3Q2} <InlineMath math="(x - 3)" /> {t.ex3Q3}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 font-mono text-xs">
                        <p className="text-white/70">2x + 13</p>
                        <p className="text-white/50">──────────────────</p>
                        <p className="text-white/70">x - 3 ) 2x² + 7x - 32</p>
                        <p className="text-white/70 ml-8">2x² - 6x</p>
                        <p className="text-white/50 ml-8">────────</p>
                        <p className="text-white/70 ml-12">13x - 32</p>
                        <p className="text-white/70 ml-12">13x - 39</p>
                        <p className="text-white/50 ml-12">────────</p>
                        <p className="text-primary ml-20">7</p>
                      </div>
                      <p className="text-primary font-semibold">{t.result} <InlineMath math="2x + 13" /> {t.ex3Result} <InlineMath math="7" /></p>
                      <p className="text-white/60 text-xs">{t.ex3Note} <InlineMath math="(2x^2 + 7x - 32) = (x-3)(2x+13) + 7" /></p>
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

export default PembagianAljabarPage;
