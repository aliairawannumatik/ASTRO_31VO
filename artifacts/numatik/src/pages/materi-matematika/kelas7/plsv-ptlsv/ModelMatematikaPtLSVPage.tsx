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
    title: "MODEL MATEMATIKA & PENERAPAN PtLSV",
    subtitle: "Kelas 7 · PLSV & PtLSV · Materi Matematika",
    back: "Kembali ke PLSV & PtLSV",
    introTitle: "Pertidaksamaan dalam Kehidupan Nyata",
    introBody: "PtLSV sangat berguna untuk memodelkan masalah nyata yang melibatkan",
    introBodyH: "batasan atau rentang nilai",
    introBodyEnd: ". Contohnya: batas minimum, kapasitas maksimum, syarat kelulusan, anggaran belanja, dan lain-lain.",
    introBox: "Contoh situasi: \"Kamu hanya punya uang Rp50.000. Kamu ingin membeli beberapa buku seharga Rp12.000 per buku. Paling banyak berapa buku yang bisa kamu beli?\" → Ini adalah masalah PtLSV!",
    modelTitle: "Model Matematika untuk PtLSV",
    modelBody: "Model matematika PtLSV dibuat dengan cara yang sama seperti PLSV, namun menggunakan tanda pertidaksamaan. Tanda yang tepat bergantung pada konteks soal.",
    kwTitle: "Kata kunci → Tanda Pertidaksamaan:",
    kwCol1: "Kata Kunci dalam Soal",
    kwCol2: "Tanda",
    kw1: "lebih dari, melebihi, di atas",
    kw2: "kurang dari, di bawah, tidak sampai",
    kw3: "paling sedikit, minimal, sekurang-kurangnya, tidak kurang dari",
    kw4: "paling banyak, maksimal, tidak lebih dari, tidak melebihi",
    stepsTitle: "Langkah-Langkah Menyelesaikan Soal Cerita PtLSV",
    step1: "Baca dan pahami soal",
    step1b: "— Cari tahu apa yang diketahui dan apa yang ditanya.",
    step2: "Tentukan variabel",
    step2b: "— Misalkan besaran yang dicari dengan variabel.",
    step3: "Buat model PtLSV",
    step3b: "— Perhatikan kata kunci untuk menentukan tanda pertidaksamaan yang tepat.",
    step4: "Selesaikan pertidaksamaan",
    step4b: "— Hati-hati saat mengali/membagi dengan bilangan negatif!",
    step5: "Tafsirkan jawaban",
    step5b: "— Kembalikan ke konteks soal. Ingat, variabel sering bernilai bulat positif dalam soal cerita!",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh Soal",
    solution: "PEMBAHASAN:",
    step: "Langkah",
    verify: "Verifikasi:",
    c1Q: "Sebuah lift memiliki kapasitas maksimum 480 kg. Berat rata-rata satu orang dewasa adalah 60 kg. Paling banyak berapa orang yang dapat masuk lift sekaligus?",
    c1s1: "Misalkan jumlah orang =",
    c1s2: "Model PtLSV (\"paling banyak\" →",
    c1s2b: "):",
    c1s3: "Selesaikan:",
    c1s4: "Paling banyak",
    c1s4b: "8 orang",
    c1s4c: "yang dapat masuk lift.",
    c2Q: "Nilai ujian matematika Morgan pada tiga ulangan pertama adalah 70, 75, dan 80. Berapa nilai minimal yang harus Morgan dapatkan pada ulangan keempat agar rata-ratanya tidak kurang dari 78?",
    c2s1: "Misalkan nilai ulangan ke-4 =",
    c2s2: "Rata-rata 4 ulangan \"tidak kurang dari 78\" →",
    c2s3: "Selesaikan:",
    c2s4: "Morgan harus mendapatkan nilai",
    c2s4b: "minimal 87",
    c2s4c: "pada ulangan ke-4.",
    c3Q: "Seorang pedagang memiliki modal Rp150.000. Ia ingin membeli dua jenis barang: barang A seharga Rp8.000 per unit dan barang B seharga Rp5.000 per unit. Ia sudah pasti membeli 10 unit barang B. Berapa paling banyak unit barang A yang dapat ia beli tanpa melebihi modalnya?",
    c3s1: "Misalkan jumlah barang A =",
    c3s1b: "unit",
    c3s1c: "Jumlah barang B = 10 unit (sudah pasti)",
    c3s2: "Total pengeluaran tidak boleh melebihi modal:",
    c3s3: "Selesaikan:",
    c3s4: "Karena",
    c3s4b: "harus bilangan bulat dan",
    c3s4c: ", maka paling banyak pedagang dapat membeli",
    c3s4d: "12 unit barang A",
    c3s4e: ".",
    c3verify: "Verifikasi:",
    currency: { budget: "Rp150.000", a: "Rp8.000", b: "Rp5.000", hint: "Rp12.000", pocket: "Rp50.000" },
    liftUnit: "orang",
  },
  en: {
    title: "MATHEMATICAL MODELS AND WORD PROBLEMS (INEQUALITIES)",
    subtitle: "Grade 7 · PLSV & PtLSV · Mathematics",
    back: "Back to PLSV & PtLSV",
    introTitle: "Inequalities in Real Life",
    introBody: "Linear inequalities are extremely useful for modelling real-world problems that involve",
    introBodyH: "limits or ranges of values",
    introBodyEnd: ". Examples: minimum requirements, maximum capacities, passing grades, spending budgets, and more.",
    introBox: "Example situation: \"You only have $50. You want to buy some books that cost $12 each. At most, how many books can you buy?\" → This is a linear inequality problem!",
    modelTitle: "Mathematical Model for Linear Inequalities",
    modelBody: "A mathematical model for a linear inequality is built the same way as for an equation, but uses an inequality sign. The correct sign depends on the context of the problem.",
    kwTitle: "Keywords → Inequality Signs:",
    kwCol1: "Keyword in Problem",
    kwCol2: "Sign",
    kw1: "more than, exceeds, above",
    kw2: "less than, below, does not reach",
    kw3: "at least, minimum, no less than",
    kw4: "at most, maximum, no more than, does not exceed",
    stepsTitle: "Steps for Solving Word Problems with Linear Inequalities",
    step1: "Read and understand the problem",
    step1b: "— Find what is given and what is asked.",
    step2: "Define the variable",
    step2b: "— Let the unknown be represented by a variable.",
    step3: "Build the inequality model",
    step3b: "— Pay attention to keywords to choose the correct inequality sign.",
    step4: "Solve the inequality",
    step4b: "— Be careful when multiplying/dividing by a negative number!",
    step5: "Interpret the answer",
    step5b: "— Return to the context. Remember, variables in word problems are usually positive whole numbers!",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",
    verify: "Verification:",
    c1Q: "A lift has a maximum capacity of 480 kg. The average weight of one adult is 60 kg. At most, how many people can enter the lift at one time?",
    c1s1: "Let the number of people =",
    c1s2: "Inequality model (\"at most\" →",
    c1s2b: "):",
    c1s3: "Solve:",
    c1s4: "At most",
    c1s4b: "8 people",
    c1s4c: "can enter the lift.",
    c2Q: "Morgan's math test scores for the first three tests were 70, 75, and 80. What is the minimum score Morgan needs on the fourth test so that the average is no less than 78?",
    c2s1: "Let the 4th test score =",
    c2s2: "Average of 4 tests \"no less than 78\" →",
    c2s3: "Solve:",
    c2s4: "Morgan must score at least",
    c2s4b: "87",
    c2s4c: "on the fourth test.",
    c3Q: "A trader has a budget of $150. They want to buy two types of goods: item A at $8 per unit and item B at $5 per unit. They will definitely buy 10 units of item B. At most, how many units of item A can they buy without exceeding their budget?",
    c3s1: "Let the number of item A =",
    c3s1b: "units",
    c3s1c: "Number of item B = 10 units (fixed)",
    c3s2: "Total spending must not exceed the budget:",
    c3s3: "Solve:",
    c3s4: "Since",
    c3s4b: "must be a whole number and",
    c3s4c: ", the trader can buy at most",
    c3s4d: "12 units of item A",
    c3s4e: ".",
    c3verify: "Verification:",
    currency: { budget: "$150", a: "$8", b: "$5", hint: "$12", pocket: "$50" },
    liftUnit: "people",
  },
  ja: {
    title: "数学的モデルと文章題（不等式）",
    subtitle: "中学1年 · 一元一次方程式と不等式 · 数学",
    back: "一元一次方程式・不等式に戻る",
    introTitle: "日常生活の中の不等式",
    introBody: "一元一次不等式は、",
    introBodyH: "制約や範囲がある",
    introBodyEnd: "現実の問題をモデル化するのに非常に役立ちます。例：最低条件、最大容量、合格ライン、購入予算など。",
    introBox: "例：「あなたは$50しか持っていません。1冊$12の本を何冊か買いたいです。最大で何冊買えますか？」→ これが一元一次不等式の問題です！",
    modelTitle: "PtLSVの数学的モデル",
    modelBody: "不等式の数学的モデルは方程式と同じ手順で作りますが、不等号を使います。適切な不等号は問題の文脈によって決まります。",
    kwTitle: "キーワード → 不等号：",
    kwCol1: "問題のキーワード",
    kwCol2: "記号",
    kw1: "より多い、超える、以上（超過）",
    kw2: "より少ない、未満、届かない",
    kw3: "少なくとも、最低、～以上（以上）",
    kw4: "最大で、多くとも、～を超えない",
    stepsTitle: "不等式を使った文章題の解き方",
    step1: "問題を読んで理解する",
    step1b: "— わかっていることと求めることを確認する。",
    step2: "変数を設定する",
    step2b: "— 未知の量を変数で表す。",
    step3: "不等式モデルを作る",
    step3b: "— キーワードを見て、適切な不等号を選ぶ。",
    step4: "不等式を解く",
    step4b: "— 負の数で割ったり掛けたりするときは不等号の向きに注意！",
    step5: "答えを解釈する",
    step5b: "— 問題の文脈に戻して答えをまとめる。文章題では変数は正の整数になることが多い！",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",
    verify: "確認：",
    c1Q: "あるエレベーターの最大積載量は480kgです。大人1人の平均体重は60kgとします。最大で何人が同時にエレベーターに乗れますか？",
    c1s1: "乗れる人数を",
    c1s2: "不等式モデル（「最大で」→",
    c1s2b: "）：",
    c1s3: "解く：",
    c1s4: "最大",
    c1s4b: "8人",
    c1s4c: "が同時に乗れます。",
    c2Q: "Morganの数学のテスト3回分の点数は70点、75点、80点でした。4回目のテストで何点以上取れば、平均点が78点以上になりますか？",
    c2s1: "4回目のテストの点数を",
    c2s2: "4回の平均「78点以上」→",
    c2s3: "解く：",
    c2s4: "Morganは4回目のテストで",
    c2s4b: "87点以上",
    c2s4c: "取る必要があります。",
    c3Q: "ある商人の予算は$150です。2種類の商品を購入したいと思っています：商品Aは1個$8、商品Bは1個$5です。商品Bはすでに10個買うことが決まっています。予算を超えずに商品Aを最大何個買えますか？",
    c3s1: "商品Aの個数を",
    c3s1b: "個とする",
    c3s1c: "商品Bの個数 = 10個（確定）",
    c3s2: "合計支出が予算を超えないこと：",
    c3s3: "解く：",
    c3s4: "",
    c3s4b: "は整数でなければならず、",
    c3s4c: "なので、商人が買える商品Aの最大個数は",
    c3s4d: "12個",
    c3s4e: "です。",
    c3verify: "確認：",
    currency: { budget: "$150", a: "$8", b: "$5", hint: "$12", pocket: "$50" },
    liftUnit: "人",
  },
};

const ModelMatematikaPtLSVPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "model", "langkah", "contoh1", "contoh2", "contoh3"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const isId = language === "id";
  const isJa = language === "ja";

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

          {/* Pengantar */}
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
                  {t.introBody} <strong className="text-primary">{t.introBodyH}</strong>{t.introBodyEnd}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">{t.introBox}</p>
                </div>
              </div>
            )}
          </div>

          {/* Model Matematika */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("model")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{t.modelTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.modelBody}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-3">{t.kwTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-4 text-primary">{t.kwCol1}</th>
                          <th className="text-left py-2 text-primary">{t.kwCol2}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10"><td className="py-2 pr-4">{t.kw1}</td><td className="py-2"><InlineMath math=">" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-2 pr-4">{t.kw2}</td><td className="py-2"><InlineMath math="<" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-2 pr-4">{t.kw3}</td><td className="py-2"><InlineMath math="\geq" /></td></tr>
                        <tr><td className="py-2 pr-4">{t.kw4}</td><td className="py-2"><InlineMath math="\leq" /></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Langkah */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("langkah")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.stepsTitle}</span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <div className="space-y-3 font-body text-sm text-white/80">
                    {[
                      { label: t.step1, body: t.step1b },
                      { label: t.step2, body: t.step2b },
                      { label: t.step3, body: t.step3b },
                      { label: t.step4, body: t.step4b },
                      { label: t.step5, body: t.step5b },
                    ].map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">{i + 1}</span>
                        <p><strong className="text-green-300">{s.label}</strong> {s.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 1 - Easy */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh1")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded mr-2">{t.easy}</span>
                  {t.example} 1
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.c1Q}</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1 & 2:</strong> {t.c1s1} <InlineMath math="x" /></p>
                    <p><strong>{t.step} 3:</strong> {t.c1s2} <InlineMath math="\leq" />{t.c1s2b}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="60x \leq 480" />
                    </div>
                    <p><strong>{t.step} 4:</strong> {t.c1s3}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="x \leq \frac{480}{60} = 8" />
                    </div>
                    <p><strong>{t.step} 5:</strong> {t.c1s4} <strong className="text-green-400">{t.c1s4b}</strong> {t.c1s4c}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 2 - Medium */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh2")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded mr-2">{t.medium}</span>
                  {t.example} 2
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.c2Q}</p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1 & 2:</strong> {t.c2s1} <InlineMath math="x" /></p>
                    <p><strong>{t.step} 3:</strong> {t.c2s2} <InlineMath math="\geq 78" /></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\frac{70 + 75 + 80 + x}{4} \geq 78" />
                    </div>
                    <p><strong>{t.step} 4:</strong> {t.c2s3}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <BlockMath math="\frac{225 + x}{4} \geq 78" />
                      <BlockMath math="225 + x \geq 312" />
                      <BlockMath math="x \geq 87" />
                    </div>
                    <p>
                      <strong>{t.step} 5:</strong> {t.c2s4} <strong className="text-green-400">{t.c2s4b}</strong> {t.c2s4c}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contoh 3 - Hard */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("contoh3")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded mr-2">{t.hard}</span>
                  {t.example} 3
                </span>
              </div>
              <ChevronUp className="w-5 h-5 text-primary" />
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm text-white">{t.c3Q}</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <p><strong>{t.step} 1 & 2:</strong></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p>{t.c3s1} <InlineMath math="x" /> {t.c3s1b}</p>
                      <p>{t.c3s1c}</p>
                    </div>
                    <p><strong>{t.step} 3:</strong> {t.c3s2}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      {isId
                        ? <BlockMath math="8000x + 5000(10) \leq 150000" />
                        : <BlockMath math="8x + 5(10) \leq 150" />
                      }
                    </div>
                    <p><strong>{t.step} 4:</strong> {t.c3s3}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      {isId ? (
                        <>
                          <BlockMath math="8000x + 50000 \leq 150000" />
                          <BlockMath math="8000x \leq 100000" />
                          <BlockMath math="x \leq \frac{100000}{8000} = 12{,}5" />
                        </>
                      ) : (
                        <>
                          <BlockMath math="8x + 50 \leq 150" />
                          <BlockMath math="8x \leq 100" />
                          <BlockMath math="x \leq \frac{100}{8} = 12{,}5" />
                        </>
                      )}
                    </div>
                    <p>
                      <strong>{t.step} 5:</strong>{" "}
                      {isJa ? (
                        <>
                          <InlineMath math="x" />{t.c3s4b}<InlineMath math="x \leq 12{,}5" />{t.c3s4c}<strong className="text-green-400">{t.c3s4d}</strong>{t.c3s4e}
                        </>
                      ) : (
                        <>
                          {t.c3s4} <InlineMath math="x" /> {t.c3s4b} <InlineMath math="x \leq 12{,}5" />{t.c3s4c} <strong className="text-green-400">{t.c3s4d}</strong>{t.c3s4e}
                        </>
                      )}
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      {isId
                        ? <p>{t.c3verify} <InlineMath math="8000(12) + 5000(10) = 96000 + 50000 = 146000 \leq 150000" /> ✓</p>
                        : <p>{t.c3verify} <InlineMath math="8(12) + 5(10) = 96 + 50 = 146 \leq 150" /> ✓</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/plsv-ptlsv"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMatematikaPtLSVPage;
