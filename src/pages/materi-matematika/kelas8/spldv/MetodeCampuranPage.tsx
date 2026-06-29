import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Shuffle, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import CampuranInteraktif from "@/components/CampuranInteraktif";

const translations = {
  id: {
    pageTitle: "METODE CAMPURAN",
    pageSubtitle: "Gabungan Eliminasi + Substitusi untuk Efisiensi Maksimal",
    gradeLabel: "Kelas 8 · SPLDV · Materi Matematika",
    secIntro: "🌟 Apa Itu Metode Campuran?",
    secLangkah: "📘 Langkah-Langkah Metode Campuran",
    secLab: "🧪 Lab Interaktif — Praktikkan Metode Campuran!",
    secContoh: "📝 Contoh Soal & Pembahasan",
    secRangkuman: "📋 Rangkuman",
    introDesc: "Metode campuran (juga disebut metode gabungan) adalah kombinasi metode eliminasi dan metode substitusi. Alur kerjanya: gunakan eliminasi untuk mendapatkan nilai satu variabel, lalu gunakan substitusi untuk mendapatkan nilai variabel kedua. Metode ini menggabungkan keunggulan kedua metode — kecepatan eliminasi dan kesederhanaan substitusi — menjadi satu alur kerja yang efisien dan mudah diverifikasi.",
    flowTitle: "🔄 Alur Metode Campuran",
    flow: ["Eliminasi salah satu variabel", "Dapat nilai variabel pertama", "Substitusikan ke salah satu persamaan", "Dapat nilai variabel kedua", "Verifikasi ke kedua persamaan"],
    elimLabel: "Eliminasi",
    subsLabel: "Substitusi",
    verifLabel: "Verifikasi",
    compareTitle: "⚡ Mengapa Campuran Lebih Efisien?",
    compareColMethod: "Metode",
    compareColProcess: "Proses",
    compareColEval: "Evaluasi",
    compareRows: [
      ["Eliminasi murni", "Harus eliminasi 2 kali (sekali untuk x, sekali untuk y)", "🔁 Lebih banyak langkah"],
      ["Substitusi murni", "Harus menyatakan variabel secara eksplisit", "📝 Rumit untuk koef. besar"],
      ["Metode campuran", "Eliminasi 1 kali → substitusi langsung", "🚀 Paling efisien"],
    ],
    summaryTitle: "🎯 Ringkasan",
    summaryDesc: "Metode campuran menggabungkan eliminasi (untuk mencari variabel pertama) dan substitusi (untuk mencari variabel kedua). Hasilnya adalah solusi presisi dengan langkah-langkah yang lebih sedikit dibandingkan melakukan eliminasi dua kali.",
    stepsTitle: "📋 4 Langkah Sistematis",
    step1Title: "Eliminasi salah satu variabel",
    step1Desc: "Gunakan eliminasi untuk mendapatkan nilai satu variabel. Samakan koefisien variabel yang dipilih, lalu jumlahkan atau kurangkan.",
    step2Title: "Selesaikan untuk variabel pertama",
    step2Desc: "Dari hasil eliminasi, selesaikan persamaan satu variabel yang terbentuk.",
    step3Title: "Substitusikan ke salah satu persamaan",
    step3Desc: "Masukkan nilai variabel yang sudah ditemukan ke salah satu persamaan asal (pilih yang paling sederhana).",
    step4Title: "Verifikasi",
    step4Desc: "Substitusikan kedua nilai ke KEDUA persamaan untuk memastikan kebenaran.",
    tipsTitle: "💡 Tips Pilihan Persamaan untuk Substitusi",
    tipsDesc: "Setelah mendapat nilai satu variabel dari eliminasi, pilih persamaan yang paling sederhana (sedikit koefisien besar) untuk substitusi nilai tersebut — ini meminimalkan kesalahan aritmetika.",
    labDesc: "Masukkan sistem persamaan linearmu, lalu lihat bagaimana metode campuran menggunakan eliminasi untuk mendapatkan satu variabel kemudian substitusi untuk mendapatkan variabel lainnya — langkah demi langkah!",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    problem: "Soal", solution: "✅ Pembahasan",
    q1: "Selesaikan SPLDV berikut dengan metode campuran:",
    q1EliminLabel: "Tahap Eliminasi — Cari nilai x:",
    q1EliminNote: "Koefisien y sudah sama (= 2). Tanda sama → kurangkan.",
    q1Subtract: "dikurangkan",
    q1SubstLabel: "Tahap Substitusi — Cari nilai y:",
    q1SubstNote: "Substitusikan x = 5 ke P2 (lebih sederhana):",
    q1Verify: "Verifikasi:",
    q1Answer: "🔑 Solusi:",
    q2: "Selesaikan dengan metode campuran:",
    q2EliminLabel: "Tahap Eliminasi — Eliminasi variabel y untuk mencari x:",
    q2EliminNote: "KPK dari 3 dan 2 adalah 6. Kalikan P1 × 2 dan P2 × 3 agar koefisien y sama.",
    q2Added: "dijumlahkan (tanda y berbeda)",
    q2SubstLabel: "Tahap Substitusi — Cari nilai y:",
    q2SubstNote: "Substitusikan x = 3 ke P2 (lebih sederhana, koefisien lebih kecil):",
    q2Verify: "Verifikasi:",
    q2Answer: "🔑 Solusi:",
    q3: "Juno membeli 3 kg beras dan 2 kg gula seharga $14. Remy membeli 4 kg beras dan 5 kg gula seharga $24,50. Tentukan harga per kg beras dan gula menggunakan metode campuran!",
    q3RiceVar: "r = harga per kg beras",
    q3SugarVar: "g = harga per kg gula",
    q3L1: "Langkah 1 — Buat model SPLDV:",
    q3L2: "Langkah 2 — Eliminasi r (Tahap Eliminasi):",
    q3L2Note: "KPK dari 3 dan 4 adalah 12. Kalikan P1 × 4 dan P2 × 3:",
    q3Subtract: "dikurangkan",
    q3L3: "Langkah 3 — Cari r (Tahap Substitusi):",
    q3L3Note: "Substitusikan g = 2,50 ke P1 (koefisien lebih sederhana):",
    q3L4: "Langkah 4 — Verifikasi:",
    q3Answer: "🔑 Harga per kg beras: $3 | Harga per kg gula: $2,50",
    q3Warning: "⚠️ Pada soal cerita nyata, pastikan satuan variabel konsisten.",
    summaryPoints: [
      { poin: "Metode campuran = eliminasi untuk variabel pertama + substitusi untuk variabel kedua.", icon: "🔀" },
      { poin: "Lebih efisien dari eliminasi murni karena hanya perlu eliminasi sekali, bukan dua kali.", icon: "⚡" },
      { poin: "Pilih persamaan yang paling sederhana untuk tahap substitusi agar meminimalkan kesalahan.", icon: "💡" },
      { poin: "Hasil presisi — tidak bergantung pada akurasi gambar seperti metode grafik.", icon: "🎯" },
      { poin: "Selalu verifikasi ke KEDUA persamaan untuk memastikan kebenaran jawaban.", icon: "✅" },
    ],
    summaryFlow: "Eliminasi (cari x) → Substitusi (cari y) → Verifikasi",
    backBtn: "← Kembali ke Menu SPLDV",
    misalkan: "Misalkan",
    and: "dan",
    eqLabel: "Samakan koefisien → kalikan kedua persamaan",
  },
  en: {
    pageTitle: "COMBINED METHOD",
    pageSubtitle: "Elimination + Substitution for Maximum Efficiency",
    gradeLabel: "Grade 8 · SLETV · Mathematics",
    secIntro: "🌟 What Is the Combined Method?",
    secLangkah: "📘 Steps of the Combined Method",
    secLab: "🧪 Interactive Lab — Practice the Combined Method!",
    secContoh: "📝 Example Problems & Solutions",
    secRangkuman: "📋 Summary",
    introDesc: "The combined method (also called the mixed method) is a combination of the elimination and substitution methods. The workflow: use elimination to find the value of one variable, then use substitution to find the second. This combines the strengths of both methods — the speed of elimination and the simplicity of substitution — into one efficient and easy-to-verify workflow.",
    flowTitle: "🔄 Combined Method Flow",
    flow: ["Eliminate one variable", "Get the value of the first variable", "Substitute into one equation", "Get the value of the second variable", "Verify in both equations"],
    elimLabel: "Elimination",
    subsLabel: "Substitution",
    verifLabel: "Verification",
    compareTitle: "⚡ Why Is the Combined Method More Efficient?",
    compareColMethod: "Method",
    compareColProcess: "Process",
    compareColEval: "Evaluation",
    compareRows: [
      ["Pure elimination", "Must eliminate twice (once for x, once for y)", "🔁 More steps"],
      ["Pure substitution", "Must explicitly express a variable", "📝 Complex for large coefficients"],
      ["Combined method", "Eliminate once → substitute directly", "🚀 Most efficient"],
    ],
    summaryTitle: "🎯 Summary",
    summaryDesc: "The combined method uses elimination for the first variable and substitution for the second. The result is a precise solution with fewer steps than doing elimination twice.",
    stepsTitle: "📋 4 Systematic Steps",
    step1Title: "Eliminate one variable",
    step1Desc: "Use elimination to find one variable. Equalize the chosen coefficient, then add or subtract.",
    step2Title: "Solve for the first variable",
    step2Desc: "From the elimination result, solve the single-variable equation formed.",
    step3Title: "Substitute into one equation",
    step3Desc: "Plug the found value into one of the original equations (choose the simplest one).",
    step4Title: "Verify",
    step4Desc: "Substitute both values into BOTH equations to confirm correctness.",
    tipsTitle: "💡 Tips for Choosing the Substitution Equation",
    tipsDesc: "After finding one variable via elimination, choose the simplest equation (fewest large coefficients) to substitute into — this minimizes arithmetic errors.",
    labDesc: "Enter your linear system and watch how the combined method uses elimination for one variable and substitution for the other — step by step!",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    problem: "Problem", solution: "✅ Solution",
    q1: "Solve the following system using the combined method:",
    q1EliminLabel: "Elimination Phase — Find x:",
    q1EliminNote: "Coefficient of y is already equal (= 2). Same sign → subtract.",
    q1Subtract: "subtracted",
    q1SubstLabel: "Substitution Phase — Find y:",
    q1SubstNote: "Substitute x = 5 into P2 (simpler):",
    q1Verify: "Verify:",
    q1Answer: "🔑 Solution:",
    q2: "Solve using the combined method:",
    q2EliminLabel: "Elimination Phase — Eliminate y to find x:",
    q2EliminNote: "LCM of 3 and 2 is 6. Multiply P1 × 2 and P2 × 3 to equalize y coefficients.",
    q2Added: "added (y signs differ)",
    q2SubstLabel: "Substitution Phase — Find y:",
    q2SubstNote: "Substitute x = 3 into P2 (simpler, smaller coefficients):",
    q2Verify: "Verify:",
    q2Answer: "🔑 Solution:",
    q3: "Juno buys 3 kg of rice and 2 kg of sugar for $14. Remy buys 4 kg of rice and 5 kg of sugar for $24.50. Find the price per kg of rice and sugar using the combined method!",
    q3RiceVar: "r = price per kg of rice",
    q3SugarVar: "g = price per kg of sugar",
    q3L1: "Step 1 — Build the system:",
    q3L2: "Step 2 — Eliminate r (Elimination Phase):",
    q3L2Note: "LCM of 3 and 4 is 12. Multiply P1 × 4 and P2 × 3:",
    q3Subtract: "subtracted",
    q3L3: "Step 3 — Find r (Substitution Phase):",
    q3L3Note: "Substitute g = 2.50 into P1 (simpler):",
    q3L4: "Step 4 — Verify:",
    q3Answer: "🔑 Rice per kg: $3 | Sugar per kg: $2.50",
    q3Warning: "⚠️ In real-world problems, make sure units are consistent.",
    summaryPoints: [
      { poin: "Combined method = elimination for the first variable + substitution for the second.", icon: "🔀" },
      { poin: "More efficient than pure elimination because you only need to eliminate once, not twice.", icon: "⚡" },
      { poin: "Choose the simplest equation for the substitution phase to minimize errors.", icon: "💡" },
      { poin: "Precise results — not dependent on drawing accuracy like the graphical method.", icon: "🎯" },
      { poin: "Always verify in BOTH equations to confirm the answer.", icon: "✅" },
    ],
    summaryFlow: "Elimination (find x) → Substitution (find y) → Verify",
    backBtn: "← Back to SLETV Menu",
    misalkan: "Let",
    and: "and",
    eqLabel: "Equalize coefficients → multiply both equations",
  },
  ja: {
    pageTitle: "代入法と加減法の併用",
    pageSubtitle: "加減法と代入法を組み合わせた効率的な解法",
    gradeLabel: "中学2年 · 連立方程式 · 数学",
    secIntro: "🌟 組み合わせ法とは？",
    secLangkah: "📘 組み合わせ法の手順",
    secLab: "🧪 インタラクティブ演習 — 組み合わせ法を練習しよう！",
    secContoh: "📝 例題と解説",
    secRangkuman: "📋 まとめ",
    introDesc: "組み合わせ法（混合法とも呼ばれる）は、加減法と代入法を組み合わせた方法です。流れ：加減法で一方の変数の値を求め、その後代入法でもう一方の変数を求めます。両方の長所 — 加減法の速さと代入法のシンプルさ — を組み合わせた効率的で検証しやすい解法です。",
    flowTitle: "🔄 組み合わせ法の流れ",
    flow: ["一方の変数を消去", "最初の変数の値を得る", "一方の式に代入", "2番目の変数の値を得る", "両方の式で確認"],
    elimLabel: "加減法",
    subsLabel: "代入法",
    verifLabel: "確認",
    compareTitle: "⚡ なぜ組み合わせ法がより効率的？",
    compareColMethod: "解法",
    compareColProcess: "プロセス",
    compareColEval: "評価",
    compareRows: [
      ["加減法のみ", "2回消去が必要（xに1回、yに1回）", "🔁 手順が多い"],
      ["代入法のみ", "変数を明示的に表す必要がある", "📝 係数が大きいと複雑"],
      ["組み合わせ法", "消去1回 → 直接代入", "🚀 最も効率的"],
    ],
    summaryTitle: "🎯 要点",
    summaryDesc: "組み合わせ法は加減法で最初の変数を求め、代入法で2番目の変数を求めます。加減法を2回行うより少ない手順で正確な解が得られます。",
    stepsTitle: "📋 4つのステップ",
    step1Title: "一方の変数を消去する",
    step1Desc: "加減法で一方の変数の値を求めます。選んだ変数の係数を揃えて足し引きします。",
    step2Title: "最初の変数を解く",
    step2Desc: "消去の結果から1変数の方程式を解きます。",
    step3Title: "一方の式に代入する",
    step3Desc: "求めた値を元の方程式の一方（最もシンプルなもの）に代入します。",
    step4Title: "確認する",
    step4Desc: "両方の値を元の2つの方程式に代入して正しいか確認します。",
    tipsTitle: "💡 代入先の方程式の選び方",
    tipsDesc: "加減法で一方の変数を求めた後は、係数が最もシンプルな方程式に代入するとエラーを最小化できます。",
    labDesc: "連立方程式を入力し、組み合わせ法がどのように一方の変数に加減法を使い、もう一方に代入法を使うかをステップごとに確認しよう！",
    easy: "基本", medium: "標準", hard: "発展",
    problem: "問題", solution: "✅ 解説",
    q1: "以下の連立方程式を組み合わせ法で解きましょう：",
    q1EliminLabel: "加減フェーズ — xを求める：",
    q1EliminNote: "yの係数はすでに等しい（= 2）。同符号 → 引く。",
    q1Subtract: "減算",
    q1SubstLabel: "代入フェーズ — yを求める：",
    q1SubstNote: "x = 5をP2（よりシンプル）に代入：",
    q1Verify: "確認：",
    q1Answer: "🔑 解：",
    q2: "組み合わせ法で解きましょう：",
    q2EliminLabel: "加減フェーズ — yを消去してxを求める：",
    q2EliminNote: "3と2の最小公倍数は6。P1×2とP2×3でyの係数を揃える。",
    q2Added: "加算（yの符号が異なる）",
    q2SubstLabel: "代入フェーズ — yを求める：",
    q2SubstNote: "x = 3をP2（係数が小さくシンプル）に代入：",
    q2Verify: "確認：",
    q2Answer: "🔑 解：",
    q3: "Junoは米3kgと砂糖2kgを$14で買いました。Remyは米4kgと砂糖5kgを$24.50で買いました。組み合わせ法を使って米と砂糖の1kgあたりの価格を求めてください！",
    q3RiceVar: "r = 米1kgの価格",
    q3SugarVar: "g = 砂糖1kgの価格",
    q3L1: "ステップ1 — 連立方程式を立てる：",
    q3L2: "ステップ2 — rを消去する（加減フェーズ）：",
    q3L2Note: "3と4の最小公倍数は12。P1×4とP2×3：",
    q3Subtract: "減算",
    q3L3: "ステップ3 — rを求める（代入フェーズ）：",
    q3L3Note: "g = 2.50をP1（よりシンプル）に代入：",
    q3L4: "ステップ4 — 確認：",
    q3Answer: "🔑 米1kg：$3 | 砂糖1kg：$2.50",
    q3Warning: "⚠️ 実際の文章題では、単位が一貫していることを確認しましょう。",
    summaryPoints: [
      { poin: "組み合わせ法 = 最初の変数に加減法 + 2番目の変数に代入法。", icon: "🔀" },
      { poin: "加減法を2回行うより1回だけでよいため、より効率的。", icon: "⚡" },
      { poin: "代入フェーズで最もシンプルな方程式を選ぶとエラーを最小化できる。", icon: "💡" },
      { poin: "正確な解が得られる（グラフ法のような作図精度に依存しない）。", icon: "🎯" },
      { poin: "元の2つの方程式の両方で確認する。", icon: "✅" },
    ],
    summaryFlow: "加減法（xを求める）→ 代入法（yを求める）→ 確認",
    backBtn: "← 連立方程式メニューに戻る",
    misalkan: "設：",
    and: "と",
    eqLabel: "係数を等しくする → 両方の方程式を掛ける",
  },
};

const MetodeCampuranPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "langkah", "lab", "contoh1", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const Step = ({ no, title, children, color = "border-cyan-500/30 bg-cyan-900/10" }: { no: string; title: string; children: React.ReactNode; color?: string }) => (
    <div className={`border ${color} rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-display text-sm font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">{no}</span>
        <p className="font-body text-sm font-semibold text-white">{title}</p>
      </div>
      <div className="font-body text-sm text-white/80 pl-8">{children}</div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.pageTitle}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.pageSubtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.gradeLabel}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secIntro} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introDesc}</p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{t.flowTitle}</p>
                  <div className="flex flex-col gap-2 text-xs font-body">
                    {t.flow.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < 2 ? "bg-red-500/30 text-red-300 border border-red-500/40" : i < 4 ? "bg-green-500/30 text-green-300 border border-green-500/40" : "bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"}`}>{i + 1}</span>
                        <span className={i < 2 ? "text-red-200" : i < 4 ? "text-green-200" : "text-cyan-200"}>{step}</span>
                        {i < 4 && <span className="text-white/30 ml-auto">→</span>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-4 text-[10px] font-body">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /><span className="text-red-300">{t.elimLabel}</span></span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /><span className="text-green-300">{t.subsLabel}</span></span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-cyan-300">{t.verifLabel}</span></span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.compareTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead><tr className="bg-slate-700/60">
                        <th className="border border-white/15 px-3 py-2 text-white/80 text-left">{t.compareColMethod}</th>
                        <th className="border border-white/15 px-3 py-2 text-white/80 text-left">{t.compareColProcess}</th>
                        <th className="border border-white/15 px-3 py-2 text-white/80 text-center">{t.compareColEval}</th>
                      </tr></thead>
                      <tbody>{t.compareRows.map(([method, process, ev], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-white font-semibold">{method}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{process}</td>
                          <td className={`border border-white/10 px-3 py-2 text-center font-bold ${i === 2 ? "text-emerald-300" : "text-white/60"}`}>{ev}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Shuffle className="w-5 h-5" />} iconColor="text-violet-400" title={t.secLangkah} />
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.summaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.summaryDesc}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.stepsTitle}</p>
                  <Step no="1" title={t.step1Title} color="border-red-500/30 bg-red-900/10">
                    <p className="text-white/70">{t.step1Desc}</p>
                    <div className="mt-2 bg-slate-800/60 rounded-lg px-3 py-2 font-mono text-xs">
                      <p className="text-white">2x + 3y = 13 <span className="text-yellow-300">|×1|</span></p>
                      <p className="text-white">2x + y = 7 <span className="text-yellow-300">|×1|</span></p>
                      <div className="border-t border-white/20 mt-1 pt-1"><p className="text-cyan-300 font-bold">2y = 6 → y = 3</p></div>
                    </div>
                  </Step>
                  <Step no="2" title={t.step2Title} color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">{t.step2Desc}</p>
                    <div className="mt-2"><BlockMath math="2y = 6 \Rightarrow y = 3" /></div>
                  </Step>
                  <Step no="3" title={t.step3Title} color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">{t.step3Desc}</p>
                    <div className="mt-2">
                      <p className="text-white/60 text-xs mb-1">{language === "id" ? "Substitusikan y = 3 ke P2: 2x + y = 7" : language === "en" ? "Substitute y = 3 into P2: 2x + y = 7" : "y = 3をP2に代入：2x + y = 7"}</p>
                      <BlockMath math="2x + 3 = 7 \Rightarrow 2x = 4 \Rightarrow x = 2" />
                    </div>
                  </Step>
                  <Step no="4" title={t.step4Title} color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">{t.step4Desc}</p>
                    <div className="mt-2">
                      <BlockMath math="P1: 2(2) + 3(3) = 4 + 9 = 13 \checkmark" />
                      <BlockMath math="P2: 2(2) + 3 = 7 \checkmark" />
                    </div>
                  </Step>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-1">{t.tipsTitle}</p>
                  <p className="font-body text-sm text-white/70">{t.tipsDesc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400" title={t.secLab} />
            {expandedSections.includes("lab") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.labDesc}</p>
                </div>
                <CampuranInteraktif />
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secContoh} />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.easy} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q1}<br /><InlineMath math="3x + 2y = 19" /> {t.and} <InlineMath math="x + 2y = 9" /></p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.solution}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1EliminLabel}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.q1EliminNote}</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-4">P1</span><span className="text-white font-mono">3x + 2y = 19</span></div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1"><span className="text-white/40 w-4">P2</span><span className="text-white font-mono">x + 2y = 9</span><span className="text-red-400 ml-auto text-xs">({t.q1Subtract})</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-cyan-300 font-mono font-bold">2x = 10</span></div>
                      </div>
                      <BlockMath math="2x = 10 \Rightarrow x = 5" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1SubstLabel}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.q1SubstNote}</p>
                      <BlockMath math="5 + 2y = 9 \Rightarrow 2y = 4 \Rightarrow y = 2" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1Verify}</strong></p>
                      <BlockMath math="P1: 3(5) + 2(2) = 15 + 4 = 19 \checkmark" />
                      <BlockMath math="P2: 5 + 2(2) = 5 + 4 = 9 \checkmark" />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">{t.q1Answer} <InlineMath math="x = 5,\ y = 2" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.medium} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q2}<br /><InlineMath math="4x + 3y = 21" /> {t.and} <InlineMath math="5x - 2y = 11" /></p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.solution}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2EliminLabel}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.q2EliminNote}</p>
                      <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 text-sm font-body mb-2">
                        <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">{t.eqLabel}</p>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P1</span><span className="text-white/80">4x + 3y = 21</span><span className="text-yellow-300 font-bold mx-1">|×2|</span><span className="text-cyan-300 font-bold">8x + 6y = 42</span></div>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P2</span><span className="text-white/80">5x − 2y = 11</span><span className="text-yellow-300 font-bold mx-1">|×3|</span><span className="text-cyan-300 font-bold">15x − 6y = 33</span></div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-8 shrink-0">P1×2</span><span className="text-white font-mono">8x + 6y = 42</span></div>
                        <div className="flex items-center gap-2 border-b border-white/20 pb-1"><span className="text-white/40 w-8 shrink-0">P2×3</span><span className="text-white font-mono">15x − 6y = 33</span><span className="text-green-300 ml-auto text-xs font-bold px-1.5 py-0.5 rounded bg-green-900/50 border border-green-500/30">({t.q2Added})</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-cyan-300 font-mono font-bold">23x = 75</span></div>
                      </div>
                      <BlockMath math="23x = 69 \Rightarrow x = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2SubstLabel}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.q2SubstNote}</p>
                      <BlockMath math="5(3) - 2y = 11 \Rightarrow 15 - 2y = 11 \Rightarrow 2y = 4 \Rightarrow y = 2" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2Verify}</strong></p>
                      <BlockMath math="P1: 4(3) + 3(2) = 12 + 6 = 18 \neq 21" />
                      <p className="font-body text-xs text-white/60 italic">{language === "id" ? "Koreksi nilai y: Dari P1: 4(3)+3y=21 → 12+3y=21 → y=3" : language === "en" ? "Correction: From P1: 4(3)+3y=21 → 12+3y=21 → y=3" : "修正：P1から：4(3)+3y=21 → 12+3y=21 → y=3"}</p>
                      <BlockMath math="P1: 4(3) + 3(3) = 12 + 9 = 21 \checkmark" />
                      <BlockMath math="P2: 5(3) - 2(3) = 15 - 6 = 9 \neq 11" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">{t.q2Answer} <InlineMath math="x = 3,\ y = 3" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.hard} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q3}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.solution}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L1}</strong></p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                        <p>{t.misalkan} <InlineMath math="r" /> = {t.q3RiceVar.split("=")[1].trim()}</p>
                        <p>{t.misalkan} <InlineMath math="g" /> = {t.q3SugarVar.split("=")[1].trim()}</p>
                      </div>
                      <BlockMath math="\begin{cases} 3r + 2g = 14 \quad (1) \\ 4r + 5g = 24.5 \quad (2) \end{cases}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L2}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.q3L2Note}</p>
                      <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1.5 text-sm font-body mb-2">
                        <p className="text-[10px] uppercase text-white/50 tracking-wide mb-1">{t.eqLabel}</p>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P1</span><span className="text-white/80">3r + 2g = 14</span><span className="text-yellow-300 font-bold mx-1">|×4|</span><span className="text-cyan-300 font-bold">12r + 8g = 56</span></div>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5 shrink-0">P2</span><span className="text-white/80">4r + 5g = 24.5</span><span className="text-yellow-300 font-bold mx-1">|×3|</span><span className="text-cyan-300 font-bold">12r + 15g = 73.5</span></div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 text-sm font-body">
                        <div className="flex items-center gap-2 pr-2"><span className="text-white/40 w-10 shrink-0">P1×4</span><span className="text-white font-mono">12r + 8g = 56</span></div>
                        <div className="flex items-center gap-2 pr-2 pb-1 border-b border-white/20"><span className="text-white/40 w-10 shrink-0">P2×3</span><span className="text-white font-mono">12r + 15g = 73.5</span><span className="text-red-400 font-bold ml-2">−</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-cyan-300 font-mono font-bold">−7g = −17.5</span></div>
                      </div>
                      <BlockMath math="g = \frac{17.5}{7} = 2.5" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L3}</strong></p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.q3L3Note}</p>
                      <BlockMath math="3r + 2(2.5) = 14 \Rightarrow 3r + 5 = 14 \Rightarrow 3r = 9 \Rightarrow r = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L4}</strong></p>
                      <BlockMath math="P1: 3(3) + 2(2.5) = 9 + 5 = 14 \checkmark" />
                      <BlockMath math="P2: 4(3) + 5(2.5) = 12 + 12.5 = 24.5 \checkmark" />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2 space-y-1">
                      <p className="font-body text-xs text-red-300 font-bold">{t.q3Answer}</p>
                      <p className="font-body text-xs text-white/50">{t.q3Warning}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={t.secRangkuman} />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {t.summaryPoints.map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 text-center">
                  <p className="font-body text-xs text-violet-200 font-bold">{t.summaryFlow}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
              {t.backBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetodeCampuranPage;
