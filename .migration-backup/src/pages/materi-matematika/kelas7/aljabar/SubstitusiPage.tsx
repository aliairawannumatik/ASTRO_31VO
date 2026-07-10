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
    title: "SUBSTITUSI BILANGAN PADA BENTUK ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Substitusi: Tukar Huruf dengan Angka!",
    introPara: "Variabel dalam bentuk aljabar bisa diganti dengan bilangan tertentu. Proses penggantian ini disebut",
    introStrong: "substitusi",
    introPara2: ". Ini sangat berguna saat kita menggunakan rumus dalam fisika, kimia, atau soal cerita.",
    introBox: "Contoh: Rumus jarak",
    introBox2: ". Jika",
    introBox3: "km/jam dan",
    introBox4: "jam, maka",
    introBox5: "km. Itulah substitusi!",

    konsepTitle: "Ringkasan Intisari: Cara Melakukan Substitusi",
    langkahTitle: "Langkah-Langkah Substitusi:",
    l1: "Tulis ulang bentuk aljabar aslinya.",
    l2: "Ganti setiap variabel dengan nilai yang diberikan.",
    l3: "Hitung hasil operasinya dengan urutan: kurung → pangkat → kali/bagi → tambah/kurang.",
    notasiTitle: "Perhatikan Arti Notasi:",
    n1: "artinya",
    n2: "artinya",
    n3: "artinya",
    tips: "Tips Efisien:",
    tipsDesc: "Jika ada suku-suku sejenis, sederhanakan dulu sebelum mensubstitusi agar perhitungannya lebih mudah!",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",

    ex1Q: "Jika",
    ex1Q2: "dan",
    ex1Q3: ", tentukan nilai dari",
    ex1S: "Ganti",
    ex1S2: "dan",

    ex2Q: "Jika",
    ex2Q2: "dan",
    ex2Q3: ", tentukan nilai dari",
    ex2S1: "Hitung bagian dalam kurung:",
    ex2S2: "Substitusikan:",

    ex3Q: "Sederhanakan dulu, lalu substitusikan",
    ex3Q2: "dan",
    ex3Q3: "ke dalam bentuk:",
    ex3S1: "Sederhanakan dengan mengelompokkan suku sejenis:",
    ex3S2: "Substitusikan",
  },
  en: {
    title: "SUBSTITUTION IN ALGEBRAIC EXPRESSIONS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "Substitution: Replace Letters with Numbers!",
    introPara: "Variables in an algebraic expression can be replaced with specific numbers. This replacement process is called",
    introStrong: "substitution",
    introPara2: ". It is very useful when we apply formulas in physics, chemistry, or word problems.",
    introBox: "Example: The distance formula",
    introBox2: ". If",
    introBox3: "km/h and",
    introBox4: "hours, then",
    introBox5: "km. That's substitution!",

    konsepTitle: "Key Summary: How to Substitute",
    langkahTitle: "Steps for Substitution:",
    l1: "Rewrite the original algebraic expression.",
    l2: "Replace each variable with the given value.",
    l3: "Calculate following the order of operations: brackets → exponents → multiply/divide → add/subtract.",
    notasiTitle: "Understand the Notation:",
    n1: "means",
    n2: "means",
    n3: "means",
    tips: "Efficient Tip:",
    tipsDesc: "If there are like terms, simplify them first before substituting to make the calculation easier!",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",

    ex1Q: "If",
    ex1Q2: "and",
    ex1Q3: ", find the value of",
    ex1S: "Substitute",
    ex1S2: "and",

    ex2Q: "If",
    ex2Q2: "and",
    ex2Q3: ", find the value of",
    ex2S1: "Calculate the values inside the brackets:",
    ex2S2: "Substitute:",

    ex3Q: "Simplify first, then substitute",
    ex3Q2: "and",
    ex3Q3: "into the expression:",
    ex3S1: "Simplify by grouping like terms:",
    ex3S2: "Substitute",
  },
  ja: {
    title: "代数式への代入",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "代入：文字を数値に置き換えよう！",
    introPara: "代数式の変数は特定の数値に置き換えることができます。この置き換えの過程を",
    introStrong: "代入",
    introPara2: "といいます。物理・化学の公式や文章問題でとても役立ちます。",
    introBox: "例：距離の公式",
    introBox2: "。",
    introBox3: "km/hで",
    introBox4: "時間のとき、",
    introBox5: "km。これが代入です！",

    konsepTitle: "要点まとめ：代入の方法",
    langkahTitle: "代入の手順：",
    l1: "元の代数式をそのまま書く。",
    l2: "各変数を与えられた値に置き換える。",
    l3: "演算の順序で計算する：括弧 → 指数 → 掛け算・割り算 → 足し算・引き算。",
    notasiTitle: "表記の意味に注意：",
    n1: "は",
    n2: "は",
    n3: "は",
    tips: "効率的なヒント：",
    tipsDesc: "同類項があれば、代入する前に先にまとめると計算が簡単になります！",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",

    ex1Q: "",
    ex1Q2: "、",
    ex1Q3: "のとき、次の値を求めなさい：",
    ex1S: "",
    ex1S2: "と",

    ex2Q: "",
    ex2Q2: "、",
    ex2Q3: "のとき、次の値を求めなさい：",
    ex2S1: "括弧の中の値を計算する：",
    ex2S2: "代入する：",

    ex3Q: "まず簡略化してから、",
    ex3Q2: "と",
    ex3Q3: "を次の式に代入しなさい：",
    ex3S1: "同類項をグループ分けして簡略化する：",
    ex3S2: "代入する。",
  },
};

const SubstitusiPage = () => {
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
                  {t.introPara} <strong className="text-primary">{t.introStrong}</strong>{t.introPara2}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    {t.introBox} <InlineMath math="s = v \times t" />{t.introBox2} {language === "ja" ? <><InlineMath math="v = 68" />{t.introBox3}<InlineMath math="t = 1{,}5" />{t.introBox4}<InlineMath math="s = 68 \times 1{,}5 = 102" />{t.introBox5}</> : <><InlineMath math="v = 68" /> {t.introBox3} <InlineMath math="t = 1{,}5" /> {t.introBox4} <InlineMath math="s = 68 \times 1{,}5 = 102" /> {t.introBox5}</>}
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

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-green-300">{t.langkahTitle}</p>
                  <p className="font-body text-sm text-white/80"><strong>1.</strong> {t.l1}</p>
                  <p className="font-body text-sm text-white/80"><strong>2.</strong> {t.l2}</p>
                  <p className="font-body text-sm text-white/80"><strong>3.</strong> {t.l3}</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.notasiTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-sm text-white/70">
                    <p><InlineMath math="4ab" /> {t.n1} <InlineMath math="4 \times a \times b" /></p>
                    <p><InlineMath math="ab^2" /> {t.n2} <InlineMath math="a \times b \times b" /></p>
                    <p><InlineMath math="(ab)^2" /> {t.n3} <InlineMath math="(ab) \times (ab) = a^2b^2" /></p>
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
                    <p className="font-body text-sm text-white">
                      {t.ex1Q} <InlineMath math="a = 5" /> {t.ex1Q2} <InlineMath math="b = -4" />{t.ex1Q3} <InlineMath math="2ab + 3b^2" />!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>{t.ex1S} <InlineMath math="a = 5" /> {t.ex1S2} <InlineMath math="b = -4" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="2(5)(-4) + 3(-4)^2" />
                        <BlockMath math="= 2 \times 5 \times (-4) + 3 \times 16" />
                        <BlockMath math="= -40 + 48 = 8" />
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
                    <p className="font-body text-sm text-white">
                      {t.ex2Q} <InlineMath math="p = 6" />{t.ex2Q2} <InlineMath math="q = -3" />{t.ex2Q2} <InlineMath math="r = -4" />{t.ex2Q3} <InlineMath math="(p + 5q)^2 - (qr)^2" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex2S1}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="p + 5q = 6 + 5(-3) = 6 - 15 = -9" />
                        <BlockMath math="qr = (-3)(-4) = 12" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex2S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(-9)^2 - (12)^2 = 81 - 144 = -63" />
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
                      {t.ex3Q} <InlineMath math="x = 8" /> {t.ex3Q2} <InlineMath math="y = -12" /> {t.ex3Q3}
                    </p>
                    <div className="mt-2">
                      <BlockMath math="9x^3 - 21y + 16x^2 + 30y - 18x^2 - 20y" />
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex3S1}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="9x^3 + (16x^2 - 18x^2) + (-21y + 30y - 20y)" />
                        <BlockMath math="= 9x^3 - 2x^2 - 11y" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex3S2} <InlineMath math="x = 8" />, <InlineMath math="y = -12" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 9(8)^3 - 2(8)^2 - 11(-12)" />
                        <BlockMath math="= 9(512) - 2(64) + 132" />
                        <BlockMath math="= 4608 - 128 + 132 = 4612" />
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

export default SubstitusiPage;
