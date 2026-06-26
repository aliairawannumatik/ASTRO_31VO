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
    title: "PENJUMLAHAN DAN PENGURANGAN BENTUK ALJABAR",
    subtitle: "Kelas 7 · Aljabar · Materi Matematika",
    back: "Kembali ke Aljabar",

    introTitle: "Aturan Dasar: Hanya Suku Sejenis yang Bisa Digabung",
    introPara: "Menjumlahkan atau mengurangkan bentuk aljabar itu seperti menghitung buah. Kamu bisa menjumlahkan apel dengan apel, tapi tidak bisa langsung menjumlahkan apel dengan jeruk!",
    introBox: "Prinsip utama:",
    introBoxDesc: "Operasi penjumlahan dan pengurangan hanya bisa dilakukan pada",
    introBoxStrong: "suku-suku yang sejenis",
    introBoxEnd: "— yaitu suku dengan variabel dan pangkat yang sama.",

    konsepTitle: "Ringkasan Intisari: Cara Menyederhanakan",
    konsepPara: "Untuk menyederhanakan bentuk aljabar melalui penjumlahan/pengurangan, ikuti dua langkah berikut:",
    langkah: "Langkah-Langkah:",
    l1: "Kelompokkan suku-suku yang sejenis.",
    l2: "Gunakan sifat distributif untuk menggabungkan koefisiennya.",
    sifatTitle: "Sifat Distributif yang Dipakai:",
    contohCepat: "Contoh Cepat:",
    ingat: "Ingat!",
    ingatDesc: "Koefisien 1 tidak perlu ditulis. Jadi",
    ingatDesc2: "cukup ditulis",

    contohTitle: "Contoh Soal dan Pembahasan",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh",
    solution: "PEMBAHASAN:",
    step: "Langkah",
    result: "Hasil:",

    ex1Q: "Sederhanakan:",
    ex1S1: "Kelompokkan suku sejenis:",
    ex1S2: "Hitung masing-masing kelompok:",

    ex2Q: "Tentukan hasil dari",
    ex2S1: "Buka kurung (tanda + tidak mengubah tanda suku):",
    ex2S2: "Kelompokkan suku sejenis:",
    ex2S3: "Sederhanakan:",

    ex3Q: "Kurangkan",
    ex3Q2: "dari",
    ex3Q3: "kemudian sederhanakan hasilnya!",
    ex3S1a: "Ingat, "",
    ex3S1b: "dikurangkan dari",
    ex3S1c: "" artinya",
    ex3S2: "Jabarkan dengan sifat distributif:",
    ex3S3: "Kelompokkan dan sederhanakan:",
    ex3Final: "Hasil akhir:",
  },
  en: {
    title: "ADDITION AND SUBTRACTION OF ALGEBRAIC EXPRESSIONS",
    subtitle: "Grade 7 · Algebra · Math Animation Book",
    back: "Back to Algebra",

    introTitle: "The Main Rule: Only Like Terms Can Be Combined",
    introPara: "Adding or subtracting algebraic expressions is like counting fruit. You can add apples to apples, but you can't directly add apples to oranges!",
    introBox: "Main principle:",
    introBoxDesc: "Addition and subtraction can only be performed on",
    introBoxStrong: "like terms",
    introBoxEnd: "— terms with the same variable and the same exponent.",

    konsepTitle: "Key Summary: How to Simplify",
    konsepPara: "To simplify algebraic expressions through addition/subtraction, follow these two steps:",
    langkah: "Steps:",
    l1: "Group the like terms together.",
    l2: "Use the distributive property to combine the coefficients.",
    sifatTitle: "Distributive Property Used:",
    contohCepat: "Quick Example:",
    ingat: "Remember!",
    ingatDesc: "A coefficient of 1 doesn't need to be written. So",
    ingatDesc2: "is simply written as",

    contohTitle: "Examples and Solutions",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",
    result: "Result:",

    ex1Q: "Simplify:",
    ex1S1: "Group like terms:",
    ex1S2: "Calculate each group:",

    ex2Q: "Find the result of",
    ex2S1: "Expand the brackets (a + sign does not change the sign of terms):",
    ex2S2: "Group like terms:",
    ex2S3: "Simplify:",

    ex3Q: "Subtract",
    ex3Q2: "from",
    ex3Q3: "then simplify the result!",
    ex3S1a: "Remember, "",
    ex3S1b: "subtracted from",
    ex3S1c: "" means",
    ex3S2: "Expand using the distributive property:",
    ex3S3: "Group and simplify:",
    ex3Final: "Final result:",
  },
  ja: {
    title: "代数式の加法と減法",
    subtitle: "中学1年 · 代数 · 数学アニメーションブック",
    back: "代数に戻る",

    introTitle: "基本ルール：同類項だけをまとめることができる",
    introPara: "代数式の加法・減法は、果物を数えるようなものです。リンゴはリンゴと足せますが、リンゴとオレンジを直接足すことはできません！",
    introBox: "基本原則：",
    introBoxDesc: "加法と減法は",
    introBoxStrong: "同類項",
    introBoxEnd: "— つまり同じ変数と指数を持つ項にのみ適用できます。",

    konsepTitle: "要点まとめ：簡略化の方法",
    konsepPara: "代数式を加法・減法で簡略化するには、次の2つのステップに従ってください：",
    langkah: "手順：",
    l1: "同類項をグループ分けする。",
    l2: "分配法則を使って係数をまとめる。",
    sifatTitle: "使用する分配法則：",
    contohCepat: "クイック例：",
    ingat: "注意！",
    ingatDesc: "係数が1の場合は書く必要はありません。つまり",
    ingatDesc2: "は単に",

    contohTitle: "例題と解説",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",
    result: "結果：",

    ex1Q: "簡略化しなさい：",
    ex1S1: "同類項をグループ分けする：",
    ex1S2: "各グループを計算する：",

    ex2Q: "次の結果を求めなさい",
    ex2S1: "括弧を展開する（+記号は各項の符号を変えない）：",
    ex2S2: "同類項をグループ分けする：",
    ex2S3: "簡略化する：",

    ex3Q: "",
    ex3Q2: "から",
    ex3Q3: "を引いて、結果を簡略化しなさい！",
    ex3S1a: "注意：「",
    ex3S1b: "から",
    ex3S1c: "を引く」は",
    ex3S2: "分配法則を使って展開する：",
    ex3S3: "グループ分けして簡略化する：",
    ex3Final: "最終結果：",
  },
};

const PenjumlahanPenguranganPage = () => {
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
                    <strong>{t.introBox}</strong> {t.introBoxDesc} <strong>{t.introBoxStrong}</strong> {t.introBoxEnd}
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
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.konsepPara}</p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-green-300">{t.langkah}</p>
                  <p className="font-body text-sm text-white/80"><strong>1.</strong> {t.l1}</p>
                  <p className="font-body text-sm text-white/80"><strong>2.</strong> {t.l2}</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.sifatTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <BlockMath math="ab + ac = a(b + c)" />
                    <BlockMath math="ab - ac = a(b - c)" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.contohCepat}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="9p + 8q - 2q + 5p = (9+5)p + (8-2)q = 14p + 6q" />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.ingat}</strong> {t.ingatDesc} <InlineMath math="1 \cdot x" /> {t.ingatDesc2} <InlineMath math="x" />.
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
                    <p className="font-body text-sm text-white">{t.ex1Q} <InlineMath math="7a^3 - 8a^2 - 16a^3 + 11a^2 + 9" /></p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex1S1}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(7a^3 - 16a^3) + (-8a^2 + 11a^2) + 9" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex1S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= -9a^3 + 3a^2 + 9" />
                      </div>
                      <p className="text-primary font-semibold">{t.result} <InlineMath math="-9a^3 + 3a^2 + 9" /></p>
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
                    <p className="font-body text-sm text-white">{t.ex2Q} <InlineMath math="(12x^2 - 9x + 6) + (-7x^2 + 8x - 14)" />!</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex2S1}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="12x^2 - 9x + 6 - 7x^2 + 8x - 14" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex2S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="(12x^2 - 7x^2) + (-9x + 8x) + (6 - 14)" />
                      </div>
                      <p><strong>{t.step} 3:</strong> {t.ex2S3}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= 5x^2 - x - 8" />
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
                      {t.ex3Q} <InlineMath math="-4(2x + 3)" /> {t.ex3Q2} <InlineMath math="-5(x - 2)" />{language === "ja" ? t.ex3Q3 : ", " + t.ex3Q3}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.step} 1:</strong> {t.ex3S1a}<InlineMath math="A" />{t.ex3S1b} <InlineMath math="B" />{t.ex3S1c} <InlineMath math="B - A" />:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="-5(x-2) - [-4(2x+3)]" />
                      </div>
                      <p><strong>{t.step} 2:</strong> {t.ex3S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= -5x + 10 - (-8x - 12)" />
                        <BlockMath math="= -5x + 10 + 8x + 12" />
                      </div>
                      <p><strong>{t.step} 3:</strong> {t.ex3S3}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="= (-5x + 8x) + (10 + 12) = 3x + 22" />
                      </div>
                      <p className="text-primary font-semibold">{t.ex3Final} <InlineMath math="3x + 22" /></p>
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

export default PenjumlahanPenguranganPage;
