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
    title: "FAKTORISASI BENTUK ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Faktorisasi: Kebalikan dari Menjabarkan",
    introPara: "Kalau menjabarkan mengubah perkalian menjadi penjumlahan, maka",
    introStrong: "faktorisasi",
    introPara2: "adalah kebalikannya — mengubah penjumlahan kembali menjadi perkalian faktor-faktor.",
    introKunci: "Kunci: cari",
    introKunciStrong: "faktor persekutuan terbesar (FPT)",
    introKunciEnd: "dari semua suku!",
    arrowMath: "\\underbrace{ab + ac}_{\\text{penjumlahan}} \\xrightarrow{\\text{faktorisasi}} \\underbrace{a(b+c)}_{\\text{perkalian}}",

    konsepTitle: "Ringkasan Intisari: Teknik-Teknik Faktorisasi",
    t1Title: "1. Faktorisasi dengan Hukum Distributif",
    t1Desc: "Keluarkan faktor persekutuan terbesar:",
    t2Title: "2. Faktorisasi Selisih Dua Kuadrat",
    t3Title: "3. Faktorisasi",
    t3Desc: "Cari dua bilangan yang",
    t3Desc2: "jumlahnya",
    t3Desc3: "= b dan",
    t3Desc4: "perkaliannya",
    t3Desc5: "= c:",
    t3Note: "(karena 3 + 4 = 7 dan 3 × 4 = 12)",
    catatan: "Catatan:",
    catatanDesc: "Dalam faktorisasi, selalu gunakan",
    catatanStrong: "FPT",
    catatanEnd: "(faktor persekutuan terbesar) agar suku di dalam kurung tidak lagi punya faktor bersama.",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",
    verifikasi: "Verifikasi:",

    ex1Q: "Faktorkan:",
    ex1S: "Cari FPT dari",
    ex1SFPT: "FPT =",

    ex2Q: "Faktorkan selengkapnya:",
    ex2S1: "Keluarkan FPT = 5:",
    ex2S2: "Faktorkan selisih dua kuadrat:",

    ex3Q: "Faktorkan:",
    ex3S1: "Cari dua bilangan yang jumlahnya",
    ex3S1b: "dan perkaliannya",
    ex3S2: "Kandidat:",
    ex3S3: "Cek:",
    ex3S4: "Tulis dalam bentuk faktor:",
  },
  en: {
    title: "FACTORIZATION OF ALGEBRAIC EXPRESSIONS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "Factorization: The Reverse of Expanding",
    introPara: "If expanding changes a product into a sum, then",
    introStrong: "factorization",
    introPara2: "is the reverse — changing a sum back into a product of factors.",
    introKunci: "Key: find the",
    introKunciStrong: "greatest common factor (GCF)",
    introKunciEnd: "of all terms!",
    arrowMath: "\\underbrace{ab + ac}_{\\text{sum}} \\xrightarrow{\\text{factoring}} \\underbrace{a(b+c)}_{\\text{product}}",

    konsepTitle: "Key Summary: Factorization Techniques",
    t1Title: "1. Factorization Using the Distributive Law",
    t1Desc: "Factor out the greatest common factor:",
    t2Title: "2. Difference of Two Squares",
    t3Title: "3. Factorization of",
    t3Desc: "Find two numbers whose",
    t3Desc2: "sum",
    t3Desc3: "= b and whose",
    t3Desc4: "product",
    t3Desc5: "= c:",
    t3Note: "(because 3 + 4 = 7 and 3 × 4 = 12)",
    catatan: "Note:",
    catatanDesc: "In factorization, always use the",
    catatanStrong: "GCF",
    catatanEnd: "(greatest common factor) so that the terms inside the brackets share no more common factors.",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",
    verifikasi: "Verification:",

    ex1Q: "Factorize:",
    ex1S: "Find the GCF of",
    ex1SFPT: "GCF =",

    ex2Q: "Factorize completely:",
    ex2S1: "Factor out GCF = 5:",
    ex2S2: "Factorize the difference of two squares:",

    ex3Q: "Factorize:",
    ex3S1: "Find two numbers whose sum is",
    ex3S1b: "and product is",
    ex3S2: "Candidates:",
    ex3S3: "Check:",
    ex3S4: "Write in factored form:",
  },
  ja: {
    title: "代数式の因数分解",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "因数分解：展開の逆操作",
    introPara: "展開が積を和に変えるとすれば、",
    introStrong: "因数分解",
    introPara2: "はその逆 — 和を再び因数の積に変えることです。",
    introKunci: "鍵：すべての項の",
    introKunciStrong: "最大公約数（GCF）",
    introKunciEnd: "を見つけること！",
    arrowMath: "\\underbrace{ab + ac}_{\\text{和}} \\xrightarrow{\\text{因数分解}} \\underbrace{a(b+c)}_{\\text{積}}",

    konsepTitle: "要点まとめ：因数分解のテクニック",
    t1Title: "1. 分配法則による因数分解",
    t1Desc: "最大公約数を括り出す：",
    t2Title: "2. 二乗の差の因数分解",
    t3Title: "3.",
    t3Desc: "2つの数を探す。その",
    t3Desc2: "和",
    t3Desc3: "= b、",
    t3Desc4: "積",
    t3Desc5: "= c：",
    t3Note: "（3 + 4 = 7 かつ 3 × 4 = 12 のため）",
    catatan: "注意：",
    catatanDesc: "因数分解では必ず",
    catatanStrong: "最大公約数（GCF）",
    catatanEnd: "を使い、括弧内の各項がこれ以上共通因数を持たないようにする。",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",
    verifikasi: "確認：",

    ex1Q: "因数分解しなさい：",
    ex1S: "の最大公約数を求める",
    ex1SFPT: "GCF =",

    ex2Q: "完全に因数分解しなさい：",
    ex2S1: "GCF = 5 を括り出す：",
    ex2S2: "二乗の差を因数分解する：",

    ex3Q: "因数分解しなさい：",
    ex3S1: "和が",
    ex3S1b: "で積が",
    ex3S2: "候補：",
    ex3S3: "確認：",
    ex3S4: "因数形式で書く：",
  },
};

const FaktorisasiPage = () => {
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
                  {t.introPara} <strong className="text-primary">{t.introStrong}</strong> {t.introPara2}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="bg-slate-900/50 rounded p-3">
                    {/* \text{} translated per language via t.arrowMath */}
                    <BlockMath math={t.arrowMath} />
                  </div>
                  <p className="font-body text-xs text-cyan-200 mt-2">{t.introKunci} <strong>{t.introKunciStrong}</strong> {t.introKunciEnd}</p>
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
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.t1Title}</p>
                  <p className="font-body text-sm text-white/80 mb-2">{t.t1Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-1">
                    <BlockMath math="4a + 8 = 4(a + 2)" />
                    <BlockMath math="9p^3 + 15p^5 = 3p^3(3 + 5p^2)" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.t2Title}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="x^2 - y^2 = (x + y)(x - y)" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.t3Title} <InlineMath math="x^2 + bx + c" /></p>
                  <p className="font-body text-sm text-white/80 mb-2">
                    {t.t3Desc} <strong>{t.t3Desc2}</strong> {t.t3Desc3} <strong>{t.t3Desc4}</strong> {t.t3Desc5}
                  </p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="x^2 + 7x + 12 = (x + 3)(x + 4)" />
                    <p className="text-xs text-white/60">{t.t3Note}</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.catatan}</strong> {t.catatanDesc} <strong>{t.catatanStrong}</strong> {t.catatanEnd}
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
                    <p className="font-body text-sm text-white">{t.ex1Q} <InlineMath math="4x^2y + 6xy^2 - 8x^2y^2" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex1S} <InlineMath math="4x^2y, 6xy^2, 8x^2y^2" /> → {t.ex1SFPT} <InlineMath math="2xy" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 2xy(2x) + 2xy(3y) - 2xy(4xy)" />
                        <BlockMath math="= 2xy(2x + 3y - 4xy)" />
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
                    <p className="font-body text-sm text-white">{t.ex2Q} <InlineMath math="5m^2 - 5n^2" /></p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex2S1}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="5m^2 - 5n^2 = 5(m^2 - n^2)" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex2S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 5(m + n)(m - n)" />
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
                    <p className="font-body text-sm text-white">{t.ex3Q} <InlineMath math="x^2 - 10x + 21" /></p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex3S1} <InlineMath math="-10" /> {t.ex3S1b} <InlineMath math="21" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.ex3S2} <InlineMath math="-3" /> {language === "ja" ? "と" : language === "en" ? "and" : "dan"} <InlineMath math="-7" /></p>
                        <p>{t.ex3S3} <InlineMath math="(-3) + (-7) = -10" /> ✓</p>
                        <p>{t.ex3S3} <InlineMath math="(-3) \times (-7) = 21" /> ✓</p>
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex3S4}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="x^2 - 10x + 21 = (x - 3)(x - 7)" />
                      </div>
                      <p><strong>{t.verifikasi}</strong> <InlineMath math="(x-3)(x-7) = x^2 - 7x - 3x + 21 = x^2 - 10x + 21" /> ✓</p>
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

export default FaktorisasiPage;
