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
    title: "MODEL MATEMATIKA & PENERAPAN PLSV",
    subtitle: "Kelas 7 · PLSV & PtLSV · Materi Matematika",
    back: "Kembali ke PLSV & PtLSV",
    introTitle: "Dari Cerita ke Persamaan",
    introBody: "Salah satu kegunaan terbesar PLSV adalah menyelesaikan",
    introBodyH: "masalah nyata dalam kehidupan sehari-hari",
    introBodyEnd: ". Caranya adalah dengan mengubah masalah cerita menjadi bentuk persamaan matematika — inilah yang disebut",
    introBodyH2: "model matematika",
    introBodyEnd2: ".",
    introBox: "Contoh: \"Usia Alex 5 tahun lebih tua dari Sam. Jika jumlah usia mereka 35 tahun, berapa usia masing-masing?\" → Ini bisa diubah menjadi persamaan dan diselesaikan!",
    modelTitle: "Apa Itu Model Matematika?",
    modelDef: "adalah representasi atau terjemahan dari suatu masalah nyata ke dalam bentuk ekspresi atau persamaan matematika. Dengan model matematika, masalah yang tampak rumit bisa diselesaikan secara sistematis.",
    modelDefH: "Model matematika",
    kwTitle: "Kata kunci yang sering muncul dalam soal cerita:",
    kwCol1: "Kata Kunci",
    kwCol2: "Simbol Matematika",
    kw1: "Jumlah, total, seluruh",
    kw2: "Kurang, selisih, sisa",
    kw3: "Kali, perkalian, lipat",
    kw4: "Bagi, per, rata-rata",
    kw5: "Sama dengan, adalah, hasilnya",
    kw6: "Bilangan yang dicari",
    kw6val: "x atau variabel lain",
    stepsTitle: "Langkah-Langkah Menyelesaikan Soal Cerita PLSV",
    step1: "Baca dan pahami soal",
    step1b: "— Identifikasi apa yang diketahui dan apa yang ditanya.",
    step2: "Tentukan variabel",
    step2b: "— Misalkan bilangan atau besaran yang belum diketahui dengan",
    step2c: "(atau huruf lain).",
    step3: "Buat model matematika",
    step3b: "— Terjemahkan informasi dalam soal menjadi PLSV.",
    step4: "Selesaikan persamaan",
    step4b: "— Cari nilai variabel.",
    step5: "Tafsirkan jawaban",
    step5b: "— Kembalikan nilai variabel ke konteks soal dan buat kesimpulan.",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    example: "Contoh Soal",
    solution: "PEMBAHASAN:",
    step: "Langkah",
    verify: "Verifikasi:",
    c1Q: "Sebuah bilangan jika ditambah 17 hasilnya 30. Tentukan bilangan tersebut!",
    c1s1: "Misalkan bilangan tersebut =",
    c1s2: "Model matematika:",
    c1s3: "Selesaikan:",
    c1s4: "Jadi bilangan yang dimaksud adalah",
    c2Q: "Usia Ayah sekarang adalah 3 kali usia Jordan. Selisih usia mereka adalah 28 tahun. Berapakah usia Ayah dan Jordan sekarang?",
    c2s1: "Misalkan usia Jordan =",
    c2s1b: "tahun, maka usia Ayah =",
    c2s1c: "tahun.",
    c2s2: "Model matematika (selisih usia):",
    c2s3: "Selesaikan:",
    c2s4: "Usia Jordan =",
    c2s4b: "tahun, Usia Ayah =",
    c2s4c: "= ",
    c2s4d: "tahun.",
    c2verify: "Selisih =",
    c3Q: "Sebuah toko buku menjual dua jenis pensil. Pensil merek A harganya Rp2.000 lebih mahal dari pensil merek B. Seorang siswa membeli 3 pensil A dan 5 pensil B dengan total Rp22.000. Berapakah harga masing-masing pensil?",
    c3s1: "Misalkan harga pensil B =",
    c3s1b: "rupiah",
    c3s1c: "Maka harga pensil A =",
    c3s1d: "rupiah",
    c3s2: "Model matematika:",
    c3s3: "Selesaikan:",
    c3s4b: "Harga pensil B =",
    c3s4c: "Harga pensil A =",
    hp: "HP =",
  },
  en: {
    title: "MATHEMATICAL MODELS AND WORD PROBLEMS (EQUATIONS)",
    subtitle: "Grade 7 · PLSV & PtLSV · Mathematics",
    back: "Back to PLSV & PtLSV",
    introTitle: "From Story to Equation",
    introBody: "One of the greatest uses of a linear equation is to solve",
    introBodyH: "real-world problems",
    introBodyEnd: ". The key is to translate the word problem into a mathematical equation — this is called a",
    introBodyH2: "mathematical model",
    introBodyEnd2: ".",
    introBox: "Example: \"Alex is 5 years older than Sam. If the sum of their ages is 35, how old is each?\" → This can be turned into an equation and solved!",
    modelTitle: "What Is a Mathematical Model?",
    modelDef: "is a representation or translation of a real-world problem into a mathematical expression or equation. With a mathematical model, seemingly complex problems can be solved systematically.",
    modelDefH: "A mathematical model",
    kwTitle: "Keywords commonly found in word problems:",
    kwCol1: "Keyword",
    kwCol2: "Mathematical Symbol",
    kw1: "Sum, total, altogether",
    kw2: "Minus, difference, remainder",
    kw3: "Times, product, multiplied",
    kw4: "Divided by, per, average",
    kw5: "Equals, is, results in",
    kw6: "The unknown number",
    kw6val: "x or another variable",
    stepsTitle: "Steps for Solving Word Problems with Linear Equations",
    step1: "Read and understand the problem",
    step1b: "— Identify what is given and what is asked.",
    step2: "Define the variable",
    step2b: "— Let the unknown be",
    step2c: "(or another letter).",
    step3: "Build the mathematical model",
    step3b: "— Translate the information in the problem into a linear equation.",
    step4: "Solve the equation",
    step4b: "— Find the value of the variable.",
    step5: "Interpret the answer",
    step5b: "— Return the variable value to the context of the problem and state a conclusion.",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    example: "Example",
    solution: "SOLUTION:",
    step: "Step",
    verify: "Verification:",
    c1Q: "A number when added to 17 gives 30. Find the number!",
    c1s1: "Let the number =",
    c1s2: "Mathematical model:",
    c1s3: "Solve:",
    c1s4: "So the number is",
    c2Q: "A father's age is 3 times Jordan's age. The difference in their ages is 28 years. How old are the father and Jordan now?",
    c2s1: "Let Jordan's age =",
    c2s1b: "years, so the father's age =",
    c2s1c: "years.",
    c2s2: "Mathematical model (age difference):",
    c2s3: "Solve:",
    c2s4: "Jordan's age =",
    c2s4b: "years, Father's age =",
    c2s4c: "= ",
    c2s4d: "years.",
    c2verify: "Difference =",
    c3Q: "A stationery shop sells two types of pencils. Pencil brand A costs $2 more than pencil brand B. A student buys 3 pencils of brand A and 5 pencils of brand B for a total of $22. What is the price of each pencil?",
    c3s1: "Let the price of pencil B =",
    c3s1b: "dollars",
    c3s1c: "So the price of pencil A =",
    c3s1d: "dollars",
    c3s2: "Mathematical model:",
    c3s3: "Solve:",
    c3s4b: "Price of pencil B =",
    c3s4c: "Price of pencil A =",
    hp: "SS =",
  },
  ja: {
    title: "数学的モデルと文章題（方程式）",
    subtitle: "中学1年 · 一元一次方程式と不等式 · 数学",
    back: "一元一次方程式・不等式に戻る",
    introTitle: "文章から方程式へ",
    introBody: "一元一次方程式の最大の活用場面は",
    introBodyH: "現実の問題を解くこと",
    introBodyEnd: "です。文章問題を数学の方程式に翻訳する作業を",
    introBodyH2: "数学的モデル化",
    introBodyEnd2: "といいます。",
    introBox: "例：「Alexの年齢はSamより5歳上。2人の年齢の合計が35歳なら、それぞれ何歳？」→ これを方程式にして解くことができます！",
    modelTitle: "数学的モデルとは",
    modelDef: "は、現実の問題を数学的な式や方程式に置き換えたものです。数学的モデルを使えば、複雑に見える問題も体系的に解けます。",
    modelDefH: "数学的モデル",
    kwTitle: "文章題によく出るキーワード：",
    kwCol1: "キーワード",
    kwCol2: "数学記号",
    kw1: "合計、全部で、和",
    kw2: "引く、差、残り",
    kw3: "掛ける、積、倍",
    kw4: "割る、あたり、平均",
    kw5: "等しい、は、結果は",
    kw6: "求める数",
    kw6val: "x などの変数",
    stepsTitle: "文章題を一元一次方程式で解く手順",
    step1: "問題を読んで理解する",
    step1b: "— わかっていることと求めることを確認する。",
    step2: "変数を設定する",
    step2b: "— 未知の数を",
    step2c: "（または他の文字）で表す。",
    step3: "数学的モデルを作る",
    step3b: "— 問題の情報を一元一次方程式に翻訳する。",
    step4: "方程式を解く",
    step4b: "— 変数の値を求める。",
    step5: "答えを解釈する",
    step5b: "— 変数の値を問題の文脈に戻して結論を述べる。",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    example: "例題",
    solution: "解説：",
    step: "ステップ",
    verify: "確認：",
    c1Q: "ある数に17を加えると30になる。その数を求めなさい。",
    c1s1: "求める数を",
    c1s2: "数学的モデル：",
    c1s3: "解く：",
    c1s4: "よって、求める数は",
    c2Q: "父の年齢はJordanの年齢の3倍である。2人の年齢の差は28歳である。父とJordanの現在の年齢を求めなさい。",
    c2s1: "Jordanの年齢を",
    c2s1b: "歳とすると、父の年齢は",
    c2s1c: "歳。",
    c2s2: "数学的モデル（年齢の差）：",
    c2s3: "解く：",
    c2s4: "Jordanの年齢 =",
    c2s4b: "歳、父の年齢 =",
    c2s4c: "= ",
    c2s4d: "歳。",
    c2verify: "差 =",
    c3Q: "文房具店が2種類の鉛筆を販売している。鉛筆Aは鉛筆Bより$2高い。ある生徒が鉛筆Aを3本、鉛筆Bを5本、合計$22で購入した。それぞれの鉛筆の値段を求めなさい。",
    c3s1: "鉛筆Bの値段を",
    c3s1b: "ドルとする",
    c3s1c: "鉛筆Aの値段は",
    c3s1d: "ドル",
    c3s2: "数学的モデル：",
    c3s3: "解く：",
    c3s4b: "鉛筆Bの値段 =",
    c3s4c: "鉛筆Aの値段 =",
    hp: "解集合 =",
  },
};

const ModelMatematikaPLSVPage = () => {
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

  const isJa = language === "ja";
  const isEn = language === "en";

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
                  {t.introBody} <strong className="text-primary">{t.introBodyH}</strong>{t.introBodyEnd} <strong className="text-primary">{t.introBodyH2}</strong>{t.introBodyEnd2}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.introBox}
                  </p>
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
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-blue-300">{t.modelDefH}</strong> {t.modelDef}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-white mb-2">{t.kwTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body text-white/80">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 pr-3 text-primary">{t.kwCol1}</th>
                          <th className="text-left py-2 text-primary">{t.kwCol2}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">{t.kw1}</td><td className="py-1"><InlineMath math="+" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">{t.kw2}</td><td className="py-1"><InlineMath math="-" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">{t.kw3}</td><td className="py-1"><InlineMath math="\times" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">{t.kw4}</td><td className="py-1"><InlineMath math="\div" /></td></tr>
                        <tr className="border-b border-white/10"><td className="py-1 pr-3">{t.kw5}</td><td className="py-1"><InlineMath math="=" /></td></tr>
                        <tr><td className="py-1 pr-3">{t.kw6}</td><td className="py-1">{t.kw6val}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Langkah-langkah */}
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
                      { label: t.step2, body: `${t.step2b} `, extra: <InlineMath math="x" />, after: ` ${t.step2c}` },
                      { label: t.step3, body: t.step3b },
                      { label: t.step4, body: t.step4b },
                      { label: t.step5, body: t.step5b },
                    ].map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="bg-green-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">{i + 1}</span>
                        <p>
                          <strong className="text-green-300">{s.label}</strong> {s.body}
                          {s.extra}{s.after}
                        </p>
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
                    <p><strong>{t.step} 3:</strong> {t.c1s2}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="x + 17 = 30" />
                    </div>
                    <p><strong>{t.step} 4:</strong> {t.c1s3}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="x = 30 - 17 = 13" />
                    </div>
                    <p><strong>{t.step} 5:</strong> {t.c1s4} <strong className="text-green-400">13</strong>.</p>
                    <p>{t.verify} <InlineMath math="13 + 17 = 30" /> ✓</p>
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
                    <p><strong>{t.step} 1 & 2:</strong> {t.c2s1} <InlineMath math="x" /> {t.c2s1b} <InlineMath math="3x" /> {t.c2s1c}</p>
                    <p><strong>{t.step} 3:</strong> {t.c2s2}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="3x - x = 28" />
                    </div>
                    <p><strong>{t.step} 4:</strong> {t.c2s3}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      <BlockMath math="2x = 28" />
                      <BlockMath math="x = 14" />
                    </div>
                    <p>
                      <strong>{t.step} 5:</strong> {t.c2s4} <strong className="text-green-400">14 {isJa ? "歳" : isEn ? "years" : "tahun"}</strong>{", "}
                      {t.c2s4b} <InlineMath math="3 \times 14" /> {t.c2s4c}<strong className="text-green-400">42 {isJa ? "歳" : isEn ? "years" : "tahun"}</strong>{t.c2s4d}
                    </p>
                    <p>{t.verify} {t.c2verify} <InlineMath math="42 - 14 = 28" /> ✓</p>
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
                      <p>{t.c3s1c} <InlineMath math={language === "id" ? "(x + 2000)" : "(x + 2)"} /> {t.c3s1d}</p>
                    </div>
                    <p><strong>{t.step} 3:</strong> {t.c3s2}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      {language === "id"
                        ? <BlockMath math="3(x + 2000) + 5x = 22000" />
                        : <BlockMath math="3(x + 2) + 5x = 22" />
                      }
                    </div>
                    <p><strong>{t.step} 4:</strong> {t.c3s3}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1">
                      {language === "id" ? (
                        <>
                          <BlockMath math="3x + 6000 + 5x = 22000" />
                          <BlockMath math="8x = 22000 - 6000 = 16000" />
                          <BlockMath math="x = 2000" />
                        </>
                      ) : (
                        <>
                          <BlockMath math="3x + 6 + 5x = 22" />
                          <BlockMath math="8x = 22 - 6 = 16" />
                          <BlockMath math="x = 2" />
                        </>
                      )}
                    </div>
                    <p><strong>{t.step} 5:</strong></p>
                    <div className="bg-slate-900/50 rounded p-3">
                      {language === "id" ? (
                        <>
                          <p>{t.c3s4b} <strong className="text-green-400">Rp2.000</strong></p>
                          <p>{t.c3s4c} <InlineMath math="2000 + 2000" /> = <strong className="text-green-400">Rp4.000</strong></p>
                        </>
                      ) : (
                        <>
                          <p>{t.c3s4b} <strong className="text-green-400">$2</strong></p>
                          <p>{t.c3s4c} <InlineMath math="2 + 2" /> = <strong className="text-green-400">$4</strong></p>
                        </>
                      )}
                    </div>
                    {language === "id"
                      ? <p>{t.verify} <InlineMath math="3(4000) + 5(2000) = 12000 + 10000 = 22000" /> ✓</p>
                      : <p>{t.verify} <InlineMath math="3(4) + 5(2) = 12 + 10 = 22" /> ✓</p>
                    }
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

export default ModelMatematikaPLSVPage;
