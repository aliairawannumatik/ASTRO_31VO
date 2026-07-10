import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Replace, FlaskConical } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import SubstitusiInteraktif from "@/components/SubstitusiInteraktif";

const translations = {
  id: {
    pageTitle: "METODE SUBSTITUSI",
    pageSubtitle: 'Selesaikan SPLDV dengan Teknik "Penggantian" Variabel',
    gradeLabel: "Kelas 8 · SPLDV · Materi Matematika",
    secIntro: "🌟 Ide Dasar Metode Substitusi",
    secLangkah: "📘 Langkah-Langkah Metode Substitusi",
    secLab: "🧪 Lab Interaktif — Coba Soalmu Sendiri!",
    secContoh: "📝 Contoh Soal & Pembahasan",
    secRangkuman: "📋 Rangkuman",
    introDesc: 'Kata "substitusi" artinya penggantian. Ide utamanya: dari salah satu persamaan, kita nyatakan satu variabel dalam bentuk variabel lain (misalnya y dalam fungsi x), lalu kita "masukkan" (substitusikan) ekspresi tersebut ke persamaan kedua. Hasilnya: persamaan kedua berubah menjadi persamaan dengan satu variabel saja, yang bisa langsung diselesaikan!',
    introHighlight1: "penggantian",
    introAdvantage: "Keunggulan Substitusi:",
    introAdvantageDesc: "Hasilnya presisi — tidak bergantung pada akurasi gambar seperti metode grafik. Metode ini paling efektif ketika salah satu persamaan sudah ada variabel dengan koefisien 1 (mudah dinyatakan).",
    flowLabel: "🔄 Alur Metode Substitusi",
    summaryTitle: "🎯 Ringkasan Intisari",
    summaryDesc: "Metode substitusi mengubah SPLDV (dua persamaan, dua variabel) menjadi persamaan linear satu variabel dengan cara menggantikan salah satu variabel menggunakan ekspresi dari persamaan lain.",
    stepsTitle: "📋 4 Langkah Sistematis",
    step1Title: "Pilih persamaan yang paling sederhana",
    step1Desc: "Pilih salah satu persamaan, lalu nyatakan satu variabel dalam variabel lainnya. Lebih mudah jika ada variabel dengan koefisien 1.",
    step2Title: "Substitusikan ke persamaan lain",
    step2Desc: "Gantikan variabel yang sudah dinyatakan tadi ke persamaan satunya. Persamaan baru hanya akan mengandung satu variabel.",
    step2Note: "Masukkan",
    step2Into: "ke",
    step3Title: "Selesaikan persamaan satu variabel",
    step3Desc: "Sederhanakan dan selesaikan untuk mendapatkan nilai variabel pertama.",
    step4Title: "Cari nilai variabel kedua & verifikasi",
    step4Desc: "Substitusikan nilai yang ditemukan ke ekspresi dari Langkah 1 untuk mendapatkan variabel kedua. Verifikasi ke kedua persamaan!",
    tipsTitle: "💡 Tips Memilih Variabel yang Tepat",
    tipsColSituation: "Situasi",
    tipsColStrategy: "Strategi Terbaik",
    tipsRows: [
      ["Ada variabel berkoefisien 1", "Nyatakan variabel tersebut → paling mudah"],
      ["Semua koefisien sama", "Pilih variabel apa saja, prosesnya setara"],
      ["Koefisien besar semua", "Pertimbangkan metode eliminasi"],
    ],
    labDesc: "Masukkan sistem persamaan linear dua variabel milikmu, pilih persamaan & variabel yang ingin dinyatakan, lalu tekan ▶ Selesaikan — setiap langkah akan muncul satu per satu secara otomatis!",
    easy: "MUDAH",
    medium: "SEDANG",
    hard: "SULIT",
    problem: "Soal",
    solution: "✅ Pembahasan",
    q1: "Selesaikan SPLDV berikut dengan metode substitusi:",
    q1Step1: "Substitusi",
    q1Step1b: "ke",
    q1Step2: "Langkah 2 — Cari y:",
    q1Step3: "Langkah 3 — Verifikasi:",
    q1Answer: "Solusi:",
    q2: "Selesaikan dengan metode substitusi:",
    q2L1: "Langkah 1 — Nyatakan variabel dari Persamaan 2:",
    q2L1Note: "Persamaan 2: koefisien x dan y keduanya 1, pilih nyatakan x:",
    q2L2: "Langkah 2 — Substitusikan (*) ke Persamaan 1:",
    q2L3: "Langkah 3 — Cari x:",
    q2L4: "Langkah 4 — Verifikasi:",
    q2Tip: "Solusi: Kunci: pilih persamaan yang lebih mudah dinyatakan (koefisien lebih kecil) untuk langkah pertama.",
    q3: "Sebuah toko menjual 2 jenis tiket bioskop: reguler dan VIP. Seorang pelanggan membeli 3 tiket reguler dan 2 tiket VIP seharga $21. Pelanggan lain membeli 1 tiket reguler dan 4 tiket VIP seharga $27. Gunakan metode substitusi untuk menentukan harga masing-masing tiket!",
    q3Ticket: "x = harga tiket reguler",
    q3VIP: "y = harga tiket VIP",
    q3L1: "Langkah 1 — Buat model SPLDV:",
    q3L2: "Langkah 2 — Nyatakan x dari Persamaan 2 (koefisien x = 1, paling mudah):",
    q3L3: "Langkah 3 — Substitusikan (*) ke Persamaan 1:",
    q3L4: "Langkah 4 — Cari x:",
    q3L5: "Langkah 5 — Verifikasi:",
    q3Answer: "🔑 Harga tiket reguler: $30 | Harga tiket VIP: $60",
    q3Warning: "⚠️ Pada soal cerita, selalu cek apakah jawaban masuk akal — harga tidak mungkin negatif!",
    summaryPoints: [
      { poin: "Metode substitusi: nyatakan satu variabel dari satu persamaan, lalu gantikan ke persamaan lain.", icon: "🔄" },
      { poin: "Pilih persamaan dengan variabel berkoefisien 1 untuk langkah penyataan variabel — ini mempermudah perhitungan.", icon: "💡" },
      { poin: "Setelah mendapat nilai satu variabel, substitusikan kembali untuk mendapat variabel kedua.", icon: "🔢" },
      { poin: "Metode ini memberikan hasil yang presisi (tidak perlu gambar grafik).", icon: "🎯" },
      { poin: "Selalu verifikasi solusi ke KEDUA persamaan awal untuk memastikan jawabannya benar.", icon: "✅" },
    ],
    summaryFlowLabel: "Alur Singkat Metode Substitusi",
    backBtn: "← Kembali ke Menu SPLDV",
    misalkan: "Misalkan",
  },
  en: {
    pageTitle: "SUBSTITUTION METHOD",
    pageSubtitle: "Solve Systems of Linear Equations by Variable Substitution",
    gradeLabel: "Grade 8 · SLETV · Mathematics",
    secIntro: "🌟 Core Idea of the Substitution Method",
    secLangkah: "📘 Steps of the Substitution Method",
    secLab: "🧪 Interactive Lab — Try Your Own Problem!",
    secContoh: "📝 Example Problems & Solutions",
    secRangkuman: "📋 Summary",
    introDesc: 'The word "substitution" means replacement. The main idea: from one equation, express one variable in terms of the other (e.g., y as a function of x), then "plug in" (substitute) that expression into the second equation. The result: the second equation becomes a single-variable equation that can be solved directly!',
    introHighlight1: "replacement",
    introAdvantage: "Advantage of Substitution:",
    introAdvantageDesc: "Results are precise — not dependent on drawing accuracy like the graphical method. Most effective when one equation already has a variable with coefficient 1.",
    flowLabel: "🔄 Substitution Method Flow",
    summaryTitle: "🎯 Key Summary",
    summaryDesc: "The substitution method converts a system of two equations (two variables) into a single-variable linear equation by replacing one variable with an expression from the other equation.",
    stepsTitle: "📋 4 Systematic Steps",
    step1Title: "Choose the simplest equation",
    step1Desc: "Pick one equation and express one variable in terms of the other. Easiest when a variable has coefficient 1.",
    step2Title: "Substitute into the other equation",
    step2Desc: "Replace the expressed variable in the other equation. The new equation will contain only one variable.",
    step2Note: "Substitute",
    step2Into: "into",
    step3Title: "Solve the single-variable equation",
    step3Desc: "Simplify and solve to find the value of the first variable.",
    step4Title: "Find the second variable & verify",
    step4Desc: "Substitute the found value back into the expression from Step 1 to get the second variable. Verify in both equations!",
    tipsTitle: "💡 Tips for Choosing the Right Variable",
    tipsColSituation: "Situation",
    tipsColStrategy: "Best Strategy",
    tipsRows: [
      ["A variable has coefficient 1", "Express that variable → easiest"],
      ["All coefficients equal", "Choose any variable; the process is equivalent"],
      ["All coefficients large", "Consider the elimination method"],
    ],
    labDesc: "Enter your system of linear equations, choose the equation & variable to express, then press ▶ Solve — each step will appear one by one automatically!",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    problem: "Problem",
    solution: "✅ Solution",
    q1: "Solve the following system using the substitution method:",
    q1Step1: "Substituting",
    q1Step1b: "into",
    q1Step2: "Step 2 — Find y:",
    q1Step3: "Step 3 — Verify:",
    q1Answer: "Solution:",
    q2: "Solve using the substitution method:",
    q2L1: "Step 1 — Express a variable from Equation 2:",
    q2L1Note: "Equation 2: both x and y have coefficient 1; choose to express x:",
    q2L2: "Step 2 — Substitute (*) into Equation 1:",
    q2L3: "Step 3 — Find x:",
    q2L4: "Step 4 — Verify:",
    q2Tip: "Solution: Key tip: choose the equation that is easier to express (smaller coefficient) for the first step.",
    q3: "A cinema sells 2 types of tickets: regular and VIP. One customer buys 3 regular tickets and 2 VIP tickets for $21. Another customer buys 1 regular ticket and 4 VIP tickets for $27. Use the substitution method to find the price of each ticket!",
    q3Ticket: "x = price of a regular ticket",
    q3VIP: "y = price of a VIP ticket",
    q3L1: "Step 1 — Build the system:",
    q3L2: "Step 2 — Express x from Equation 2 (coefficient of x = 1, easiest):",
    q3L3: "Step 3 — Substitute (*) into Equation 1:",
    q3L4: "Step 4 — Find x:",
    q3L5: "Step 5 — Verify:",
    q3Answer: "🔑 Regular ticket: $30 | VIP ticket: $60",
    q3Warning: "⚠️ In word problems, always check that the answer is reasonable — prices cannot be negative!",
    summaryPoints: [
      { poin: "Substitution method: express one variable from one equation, then substitute into the other.", icon: "🔄" },
      { poin: "Choose the equation with a variable of coefficient 1 — this simplifies the calculation.", icon: "💡" },
      { poin: "After finding one variable, substitute back to find the second variable.", icon: "🔢" },
      { poin: "This method gives precise results (no drawing required).", icon: "🎯" },
      { poin: "Always verify the solution in BOTH original equations.", icon: "✅" },
    ],
    summaryFlowLabel: "Substitution Method Quick Flow",
    backBtn: "← Back to SLETV Menu",
    misalkan: "Let",
  },
  ja: {
    pageTitle: "代入法",
    pageSubtitle: "変数の「置き換え」による連立方程式の解法",
    gradeLabel: "中学2年 · 連立方程式 · 数学",
    secIntro: "🌟 代入法の基本的なアイデア",
    secLangkah: "📘 代入法の手順",
    secLab: "🧪 インタラクティブ演習 — 自分の問題を試そう！",
    secContoh: "📝 例題と解説",
    secRangkuman: "📋 まとめ",
    introDesc: "「代入」とは置き換えのことです。基本的なアイデア：一方の方程式から一方の変数を他の変数で表し（例えばxを使ってyを表す）、その式を他方の方程式に代入します。結果：2番目の方程式が1変数の方程式になり、直接解くことができます！",
    introHighlight1: "置き換え",
    introAdvantage: "代入法の利点：",
    introAdvantageDesc: "グラフ法のような作図の精度に依存せず、正確な解が得られます。一方の方程式に係数1の変数がある場合に最も効果的です。",
    flowLabel: "🔄 代入法のフロー",
    summaryTitle: "🎯 要点まとめ",
    summaryDesc: "代入法は、一方の変数を他方の方程式の式で置き換えることで、2変数連立方程式を1変数の一次方程式に変換する手法です。",
    stepsTitle: "📋 4つのステップ",
    step1Title: "最も簡単な方程式を選ぶ",
    step1Desc: "一方の方程式を選び、一方の変数を他の変数で表します。係数が1の変数があると簡単です。",
    step2Title: "もう一方の方程式に代入する",
    step2Desc: "表した変数をもう一方の方程式に代入します。新しい方程式は1変数のみになります。",
    step2Note: "代入：",
    step2Into: "を",
    step3Title: "1変数の方程式を解く",
    step3Desc: "整理して最初の変数の値を求めます。",
    step4Title: "2番目の変数を求めて検証する",
    step4Desc: "求めた値をステップ1の式に代入して2番目の変数を求めます。両方の方程式で確認しましょう！",
    tipsTitle: "💡 変数の選び方のコツ",
    tipsColSituation: "状況",
    tipsColStrategy: "最適な戦略",
    tipsRows: [
      ["係数が1の変数がある", "その変数を表す → 最も簡単"],
      ["すべての係数が同じ", "どの変数でも同等"],
      ["すべての係数が大きい", "加減法を検討する"],
    ],
    labDesc: "連立方程式を入力し、表したい方程式と変数を選んで ▶ 解く を押してください — 各ステップが自動的に順番に表示されます！",
    easy: "基本",
    medium: "標準",
    hard: "発展",
    problem: "問題",
    solution: "✅ 解説",
    q1: "以下の連立方程式を代入法で解きましょう：",
    q1Step1: "代入：",
    q1Step1b: "を",
    q1Step2: "ステップ2 — yを求める：",
    q1Step3: "ステップ3 — 確認：",
    q1Answer: "解：",
    q2: "代入法で解きましょう：",
    q2L1: "ステップ1 — 方程式2から変数を表す：",
    q2L1Note: "方程式2：xとyの係数がともに1なので、xを表すことにする：",
    q2L2: "ステップ2 — (*)を方程式1に代入：",
    q2L3: "ステップ3 — xを求める：",
    q2L4: "ステップ4 — 確認：",
    q2Tip: "解：ポイント：係数が小さく表しやすい方程式を最初に選びましょう。",
    q3: "映画館では2種類のチケットを販売しています：通常席とVIP席。ある客は通常席3枚とVIP席2枚を$21で購入しました。別の客は通常席1枚とVIP席4枚を$27で購入しました。代入法でそれぞれの価格を求めてください！",
    q3Ticket: "x = 通常席チケット1枚の価格",
    q3VIP: "y = VIP席チケット1枚の価格",
    q3L1: "ステップ1 — 連立方程式を作る：",
    q3L2: "ステップ2 — 方程式2からxを表す（xの係数=1、最も簡単）：",
    q3L3: "ステップ3 — (*)を方程式1に代入：",
    q3L4: "ステップ4 — xを求める：",
    q3L5: "ステップ5 — 確認：",
    q3Answer: "🔑 通常席：$30 | VIP席：$60",
    q3Warning: "⚠️ 文章題では、答えが合理的かどうかを確認しましょう — 価格が負になることはあり得ません！",
    summaryPoints: [
      { poin: "代入法：一方の式から変数を表し、もう一方の方程式に代入する。", icon: "🔄" },
      { poin: "係数が1の変数がある方程式を選ぶと計算が楽になる。", icon: "💡" },
      { poin: "一方の変数の値が分かったら、代入してもう一方を求める。", icon: "🔢" },
      { poin: "この方法は正確な解が得られる（グラフ作図不要）。", icon: "🎯" },
      { poin: "元の2つの方程式の両方に代入して答えを確認する。", icon: "✅" },
    ],
    summaryFlowLabel: "代入法の流れ（簡略版）",
    backBtn: "← 連立方程式メニューに戻る",
    misalkan: "設：",
  },
};

const MetodeSubstitusiPage = () => {
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

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {true ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const Step = ({ no, title, children, color = "border-cyan-500/30 bg-cyan-900/10" }: {
    no: string; title: string; children: React.ReactNode; color?: string;
  }) => (
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

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secIntro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introDesc}</p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{t.flowLabel}</p>
                  <div className="flex flex-col gap-2 text-xs font-body">
                    {[
                      { from: language === "id" ? "SPLDV (2 persamaan, 2 variabel)" : language === "en" ? "System (2 equations, 2 variables)" : "連立方程式（2式、2変数）", to: language === "id" ? "Nyatakan y = f(x) dari salah satu persamaan" : language === "en" ? "Express y = f(x) from one equation" : "一方の式からy = f(x)を表す", color: "bg-slate-800/60" },
                      { from: language === "id" ? "Substitusikan y = f(x) ke persamaan lain" : language === "en" ? "Substitute y = f(x) into the other equation" : "y = f(x)をもう一方の式に代入", to: language === "id" ? "Dapat persamaan 1 variabel: ax = b" : language === "en" ? "Get 1-variable equation: ax = b" : "1変数の方程式 ax = b を得る", color: "bg-slate-700/60" },
                      { from: language === "id" ? "Selesaikan: x = b/a" : language === "en" ? "Solve: x = b/a" : "解く：x = b/a", to: language === "id" ? "Substitusikan x ke y = f(x) untuk dapat y" : language === "en" ? "Substitute x into y = f(x) to find y" : "xをy = f(x)に代入してyを求める", color: "bg-slate-600/60" },
                      { from: language === "id" ? "Solusi SPLDV: (x, y)" : language === "en" ? "Solution: (x, y)" : "解：(x, y)", to: language === "id" ? "Verifikasi ke kedua persamaan!" : language === "en" ? "Verify in both equations!" : "両方の式で確認！", color: "bg-cyan-900/40" },
                    ].map(({ from, to, color }, i) => (
                      <div key={i} className={`${color} border border-white/10 rounded-lg px-3 py-2`}>
                        <p className="text-white/60">{i + 1}. {from}</p>
                        <p className="text-cyan-300 mt-0.5">→ {to}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.introAdvantage}</strong> {t.introAdvantageDesc}</p>
                </div>
              </div>
            )}
          </div>

          {/* LANGKAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Replace className="w-5 h-5" />} iconColor="text-green-400" title={t.secLangkah} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.summaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.summaryDesc}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.stepsTitle}</p>
                  <Step no="1" title={t.step1Title} color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">{t.step1Desc}</p>
                    <div className="mt-2">
                      <BlockMath math="x + y = 5 \Rightarrow y = 5 - x" />
                    </div>
                  </Step>
                  <Step no="2" title={t.step2Title} color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">{t.step2Desc}</p>
                    <div className="mt-2">
                      <p className="text-white/60 text-xs mb-1">{t.step2Note} <InlineMath math="y = 5 - x" /> {t.step2Into} <InlineMath math="2x + 3y = 11" /></p>
                      <BlockMath math="2x + 3(5 - x) = 11" />
                    </div>
                  </Step>
                  <Step no="3" title={t.step3Title} color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">{t.step3Desc}</p>
                    <div className="mt-2">
                      <BlockMath math="2x + 15 - 3x = 11 \Rightarrow -x = -4 \Rightarrow x = 4" />
                    </div>
                  </Step>
                  <Step no="4" title={t.step4Title} color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">{t.step4Desc}</p>
                    <div className="mt-2">
                      <BlockMath math="y = 5 - 4 = 1 \quad \Rightarrow \quad (x, y) = (4, 1)" />
                    </div>
                  </Step>
                </div>
                <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300">{t.tipsTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-yellow-900/40">
                          <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200 text-left">{t.tipsColSituation}</th>
                          <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200 text-left">{t.tipsColStrategy}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.tipsRows.map(([situasi, strategi], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-1 text-white/70">{situasi}</td>
                            <td className="border border-white/10 px-3 py-1 text-cyan-300">{strategi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* LAB */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-violet-400" title={t.secLab} />
            {expandedSections.includes("lab") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-3">
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.labDesc}</p>
                </div>
                <SubstitusiInteraktif />
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secContoh} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.easy} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {t.q1}<br />
                      <InlineMath math="y = 2x" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="x + y = 9" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.solution}</p>
                    <p className="font-body text-sm text-white/80">
                      {language === "id" ? "Persamaan 1 sudah berbentuk" : language === "en" ? "Equation 1 is already in the form" : "方程式1はすでに"} <InlineMath math="y = 2x" /> {language === "id" ? "— langsung substitusikan ke Persamaan 2!" : language === "en" ? "— substitute directly into Equation 2!" : "の形 — 直接方程式2に代入！"}
                    </p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1Step1} <InlineMath math="y = 2x" /> {t.q1Step1b} <InlineMath math="x + y = 9" />:</strong></p>
                      <BlockMath math="x + 2x = 9" />
                      <BlockMath math="3x = 9" />
                      <BlockMath math="x = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1Step2}</strong></p>
                      <BlockMath math="y = 2x = 2(3) = 6" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q1Step3}</strong></p>
                      <BlockMath math="P1: 6 = 2(3) = 6 \checkmark" />
                      <BlockMath math="P2: 3 + 6 = 9 \checkmark" />
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">🔑 {t.q1Answer} <InlineMath math="x = 3,\ y = 6" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.medium} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.problem} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">
                      {t.q2}<br />
                      <InlineMath math="3x + 2y = 16" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="x - y = 2" />
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.solution}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2L1}</strong></p>
                      <p className="font-body text-xs text-white/60">{t.q2L1Note}</p>
                      <BlockMath math="x = y + 2 \quad \cdots (*)" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2L2}</strong></p>
                      <BlockMath math="3(y + 2) + 2y = 16" />
                      <BlockMath math="3y + 6 + 2y = 16" />
                      <BlockMath math="5y = 10" />
                      <BlockMath math="y = 2" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2L3}</strong></p>
                      <BlockMath math="x = y + 2 = 2 + 2 = 4" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q2L4}</strong></p>
                      <BlockMath math="P1: 3(4) + 2(2) = 12 + 4 = 16 \checkmark" />
                      <BlockMath math="P2: 4 - 2 = 2 \checkmark" />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">💡 {t.q2Tip} <InlineMath math="x = 4,\ y = 2" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — SULIT */}
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
                        <p>{t.misalkan} <InlineMath math="x" /> = {t.q3Ticket.split("=")[1].trim()}</p>
                        <p>{t.misalkan} <InlineMath math="y" /> = {t.q3VIP.split("=")[1].trim()}</p>
                      </div>
                      <BlockMath math="\begin{cases} 3x + 2y = 21 \quad (1) \\ x + 4y = 27 \quad\ (2) \end{cases}" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L2}</strong></p>
                      <BlockMath math="x = 27 - 4y \quad \cdots (*)" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L3}</strong></p>
                      <BlockMath math="3(27 - 4y) + 2y = 21" />
                      <BlockMath math="81 - 12y + 2y = 21" />
                      <BlockMath math="-10y = 21 - 81" />
                      <BlockMath math="-10y = -60" />
                      <BlockMath math="y = 6" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L4}</strong></p>
                      <BlockMath math="x = 27 - 4(6) = 27 - 24 = 3" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1"><strong>{t.q3L5}</strong></p>
                      <BlockMath math="P1: 3(3) + 2(6) = 9 + 12 = 21 \checkmark" />
                      <BlockMath math="P2: 3 + 4(6) = 3 + 24 = 27 \checkmark" />
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

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={t.secRangkuman} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {t.summaryPoints.map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-2 space-y-1 text-xs font-body">
                  <p className="text-green-300 font-bold text-center">{t.summaryFlowLabel}</p>
                  <BlockMath math="x - y = c_2 \;\Rightarrow\; x = y + c_2 \;\Rightarrow\; \text{substitute into P1} \;\Rightarrow\; \text{solve for } y" />
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

export default MetodeSubstitusiPage;
