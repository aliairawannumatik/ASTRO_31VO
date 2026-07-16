import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)",
    subtitle: "Kelas 8 · Garis Singgung Lingkaran · Materi Matematika",
    back: "← Kembali ke Garis Singgung Lingkaran",
    sec_intro: "🌟 Garis yang Melintas di Antara Dua Lingkaran",
    sec_rumus: "📐 Rumus Panjang GSPD",
    sec_beda: "🔍 Perbedaan GSPL vs GSPD",
    sec_contoh1: "✏️ Contoh 1 — Hitung Panjang GSPD (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Cari Jari-Jari dari GSPD (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — GSPL dan GSPD Bersamaan (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    intro_p: "Berbeda dari GSPL yang melewati sisi luar, Garis Singgung Persekutuan Dalam (GSPD) adalah garis yang melewati area di antara dua lingkaran. Garis ini menyinggung kedua lingkaran, tapi melintas di sela-sela mereka — sehingga kedua lingkaran berada di sisi yang berlawanan dari garis tersebut.",
    intro_bold: "Garis Singgung Persekutuan Dalam (GSPD)",
    intro_area: "area di antara dua lingkaran",
    intro_side: "sisi yang berlawanan",
    intro_analogy: "💡 Analogi: Bayangkan dua ember berbeda ukuran. GSPD adalah tali yang melingkar seperti huruf \"X\" di antara keduanya — menyinggung sisi dalam kedua ember.",
    intisari: "🎯 Ringkasan Intisari",
    intisari_desc: "Pada GSPD, garis memotong segmen O₁O₂ di titik S. Dengan konstruksi segitiga bantu, panjang GSPD menggunakan penjumlahan jari-jari (bukan selisih seperti GSPL).",
    intisari_bold: "penjumlahan",
    var_legend: "📋 Keterangan Variabel",
    l_dalam: "Panjang GSPD",
    d_var: "Jarak antar pusat",
    Rr_var: "Jumlah jari-jari",
    syarat: "⚠️ Syarat GSPD ada: dua lingkaran tidak bersinggungan atau saling berpotongan. Jika maka GSPD tidak ada.",
    syarat_bold: "d > R + r",
    syarat_none: "tidak ada",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    beda_aspek: "Aspek",
    beda_gspl: "GSPL",
    beda_gspd: "GSPD",
    c1_problem: "Dua lingkaran berjari-jari 9 cm dan 6 cm, berjarak pusat 25 cm. Hitung panjang GSPD!",
    c1_check: "Cek syarat: d = 25 > R + r = 15 ✓. Diketahui: R=9, r=6, d=25.",
    c1_ans: "✅ Panjang GSPD = 20 cm.",
    c2_problem: "Dua lingkaran sama besar (R = r) memiliki jarak pusat 26 cm. Panjang GSPD = 24 cm. Tentukan jari-jari masing-masing lingkaran!",
    c2_step1: "Karena R = r, maka R + r = 2R.",
    c2_ans: "✅ Jari-jari masing-masing lingkaran = 5 cm.",
    c3_problem: "Dua lingkaran berjari-jari R = 10 cm dan r = 6 cm. Panjang GSPL = 4√21 cm. Tentukan panjang GSPD!",
    c3_step1: "Langkah 1: Cari jarak pusat d dari rumus GSPL.",
    c3_step2: "Langkah 2: Hitung GSPD.",
    c3_ans: "✅ Panjang GSPD = 4√6 cm ≈ 9,80 cm.",
    sum1: "• GSPD: garis bersilang yang menyinggung dua lingkaran — kedua lingkaran di sisi berlawanan.",
    sum2: "• Syarat ada: d > R+r. • GSPD ≠ GSPL: gunakan (R+r) bukan (R−r).",
    sum_bold1: "GSPD",
    sum_bold2: "berlawanan",
    sum_bold3: "(R+r)",
    tabel: [
      { aspek: "Posisi lingkaran", gspl: "Sisi yang sama", gspd: "Sisi berlawanan" },
      { aspek: "Garis melintas", gspl: "Di luar kedua lingkaran", gspd: "Di antara dua lingkaran" },
      { aspek: "Bentuk", gspl: "Tidak bersilang (///)", gspd: "Bersilang (X)" },
      { aspek: "Rumus", gspl: "√(d² − (R−r)²)", gspd: "√(d² − (R+r)²)" },
      { aspek: "Syarat ada", gspl: "d > |R−r|", gspd: "d > R+r" },
      { aspek: "Jumlah garis", gspl: "2 garis", gspd: "2 garis" },
    ],
  },
  en: {
    title: "INTERNAL COMMON TANGENT (ICT)",
    subtitle: "Grade 8 · Circle Tangent Lines · Math Book",
    back: "← Back to Circle Tangent Lines",
    sec_intro: "🌟 The Line That Crosses Between Two Circles",
    sec_rumus: "📐 ICT Length Formula",
    sec_beda: "🔍 Difference: ECT vs ICT",
    sec_contoh1: "✏️ Example 1 — Calculate ICT Length (Easy)",
    sec_contoh2: "✏️ Example 2 — Find Radius from ICT (Medium)",
    sec_contoh3: "✏️ Example 3 — ECT and ICT Together (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    intro_p: "Unlike the External Common Tangent (ECT) which passes outside, the Internal Common Tangent (ICT) passes through the area between two circles. It touches both circles but crosses through the gap between them — so both circles are on opposite sides of the line.",
    intro_bold: "Internal Common Tangent (ICT)",
    intro_area: "area between the two circles",
    intro_side: "opposite sides",
    intro_analogy: "💡 Analogy: Imagine two buckets of different sizes. The ICT is like a rope crossing in an \"X\" shape between them — touching the inner side of each bucket.",
    intisari: "🎯 Key Summary",
    intisari_desc: "For an ICT, the line cuts segment O₁O₂ at point S. Using the auxiliary triangle construction, the ICT length uses the sum of radii (unlike the ECT which uses the difference).",
    intisari_bold: "sum",
    var_legend: "📋 Variable Legend",
    l_dalam: "ICT length",
    d_var: "Distance between centers",
    Rr_var: "Sum of radii",
    syarat: "⚠️ ICT exists when: the two circles do not intersect or touch each other. If then no ICT exists.",
    syarat_bold: "d > R + r",
    syarat_none: "no ICT exists",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    beda_aspek: "Aspect",
    beda_gspl: "ECT",
    beda_gspd: "ICT",
    c1_problem: "Two circles with radii 9 cm and 6 cm have centers 25 cm apart. Calculate the ICT length!",
    c1_check: "Check condition: d = 25 > R + r = 15 ✓. Given: R=9, r=6, d=25.",
    c1_ans: "✅ ICT length = 20 cm.",
    c2_problem: "Two congruent circles (R = r) have their centers 26 cm apart. ICT length = 24 cm. Find the radius of each circle!",
    c2_step1: "Since R = r, then R + r = 2R.",
    c2_ans: "✅ Radius of each circle = 5 cm.",
    c3_problem: "Two circles have radii R = 10 cm and r = 6 cm. ECT length = 4√21 cm. Find the ICT length!",
    c3_step1: "Step 1: Find center distance d from the ECT formula.",
    c3_step2: "Step 2: Calculate the ICT.",
    c3_ans: "✅ ICT length = 4√6 cm ≈ 9.80 cm.",
    sum1: "• ICT: crossing line tangent to two circles — both circles on opposite sides.",
    sum2: "• Condition: d > R+r. • ICT ≠ ECT: use (R+r) not (R−r).",
    sum_bold1: "ICT",
    sum_bold2: "opposite sides",
    sum_bold3: "(R+r)",
    tabel: [
      { aspek: "Circle position", gspl: "Same side", gspd: "Opposite sides" },
      { aspek: "Line passes", gspl: "Outside both circles", gspd: "Between the circles" },
      { aspek: "Shape", gspl: "Non-crossing (///)", gspd: "Crossing (X)" },
      { aspek: "Formula", gspl: "√(d² − (R−r)²)", gspd: "√(d² − (R+r)²)" },
      { aspek: "Condition", gspl: "d > |R−r|", gspd: "d > R+r" },
      { aspek: "Number of lines", gspl: "2 lines", gspd: "2 lines" },
    ],
  },
  ja: {
    title: "内接共通接線 (GSPD)",
    subtitle: "中学2年 · 円の接線 · 数学テキスト",
    back: "← 円の接線に戻る",
    sec_intro: "🌟 2つの円の間を通る直線",
    sec_rumus: "📐 内接共通接線の長さの公式",
    sec_beda: "🔍 外接共通接線と内接共通接線の違い",
    sec_contoh1: "✏️ 例題1 — 内接共通接線の長さ（基本）",
    sec_contoh2: "✏️ 例題2 — 半径を求める（標準）",
    sec_contoh3: "✏️ 例題3 — 外接・内接共通接線の組み合わせ（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    intro_p: "外接共通接線が外側を通るのとは異なり、内接共通接線 (GSPD)は2つの円の間の領域を通ります。両方の円に接しますが、すき間を横断するため、両方の円は直線の反対側に位置します。",
    intro_bold: "内接共通接線 (GSPD)",
    intro_area: "2つの円の間の領域",
    intro_side: "反対側",
    intro_analogy: "💡 例え：異なる大きさの2つのバケツを想像してください。内接共通接線はその間で「X」字型に交差するロープのようなものです。",
    intisari: "🎯 要点まとめ",
    intisari_desc: "内接共通接線では、直線が線分O₁O₂を点Sで切断します。補助三角形の構成を使うと、長さは半径の和を使います（外接は差）。",
    intisari_bold: "和",
    var_legend: "📋 変数の説明",
    l_dalam: "内接共通接線の長さ",
    d_var: "中心間の距離",
    Rr_var: "半径の和",
    syarat: "⚠️ 内接共通接線の存在条件：2つの円が交わったり接したりしないこと。なら内接共通接線は存在しない。",
    syarat_bold: "d > R + r",
    syarat_none: "存在しない",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解説",
    beda_aspek: "観点",
    beda_gspl: "外接共通接線",
    beda_gspd: "内接共通接線",
    c1_problem: "半径9 cmと6 cmの2つの円の中心間距離が25 cmです。内接共通接線の長さを求めなさい！",
    c1_check: "条件確認：d = 25 > R + r = 15 ✓。既知：R=9、r=6、d=25。",
    c1_ans: "✅ 内接共通接線の長さ = 20 cm。",
    c2_problem: "同じ大きさの2つの円（R = r）の中心間距離が26 cmです。内接共通接線の長さ = 24 cm。各円の半径を求めなさい！",
    c2_step1: "R = r なので、R + r = 2R。",
    c2_ans: "✅ 各円の半径 = 5 cm。",
    c3_problem: "半径R = 10 cm、r = 6 cmの2つの円があります。外接共通接線の長さ = 4√21 cm。内接共通接線の長さを求めなさい！",
    c3_step1: "ステップ1：外接共通接線の公式から中心間距離dを求める。",
    c3_step2: "ステップ2：内接共通接線を計算する。",
    c3_ans: "✅ 内接共通接線の長さ = 4√6 cm ≈ 9.80 cm。",
    sum1: "• 内接共通接線：2つの円に接するX字型の直線 — 両円は反対側。",
    sum2: "• 条件：d > R+r。• 内接 ≠ 外接：(R+r) を使う（(R−r) ではない）。",
    sum_bold1: "内接共通接線",
    sum_bold2: "反対側",
    sum_bold3: "(R+r)",
    tabel: [
      { aspek: "円の位置", gspl: "同じ側", gspd: "反対側" },
      { aspek: "直線の経路", gspl: "両円の外側", gspd: "2つの円の間" },
      { aspek: "形状", gspl: "交差なし (///)", gspd: "交差 (X)" },
      { aspek: "公式", gspl: "√(d² − (R−r)²)", gspd: "√(d² − (R+r)²)" },
      { aspek: "存在条件", gspl: "d > |R−r|", gspd: "d > R+r" },
      { aspek: "本数", gspl: "2本", gspd: "2本" },
    ],
  },
};

type TranslationKey = keyof typeof translations.id;

/* ── SVG: GSPD diagram ── */
const GSPDSVG = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto my-2" aria-label="Internal common tangent">
    <defs>
      <style>{`
        @keyframes gspdGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #f97316);}50%{stroke-opacity:0.4;filter:none;}}
        .gspd{animation:gspdGlow 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="85" cy="110" r="58" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="85" cy="110" r="4" fill="#3b82f6"/>
    <text x="70" y="107" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">O₁</text>
    <circle cx="255" cy="110" r="40" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="255" cy="110" r="4" fill="#a855f7"/>
    <text x="260" y="107" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">O₂</text>
    <circle cx="172" cy="110" r="4" fill="#22c55e"/>
    <text x="168" y="127" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold">S</text>
    <line x1="60" y1="168" x2="280" y2="52" stroke="#f97316" strokeWidth="3" className="gspd"/>
    <line x1="60" y1="52" x2="280" y2="168" stroke="#f97316" strokeWidth="3" className="gspd"/>
    <circle cx="75" cy="161" r="4" fill="#fbbf24"/>
    <text x="58" y="158" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₃</text>
    <circle cx="269" cy="59" r="4" fill="#fbbf24"/>
    <text x="272" y="55" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₁</text>
    <circle cx="75" cy="59" r="4" fill="#fbbf24"/>
    <text x="58" y="55" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₄</text>
    <circle cx="269" cy="161" r="4" fill="#fbbf24"/>
    <text x="272" y="158" fill="#fbbf24" fontSize="9" fontFamily="monospace">T₂</text>
    <line x1="85" y1="110" x2="255" y2="110" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
    <text x="170" y="105" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">d</text>
    <rect x="5" y="190" width="330" height="18" rx="4" fill="rgba(30,41,59,0.9)" stroke="#334155"/>
    <text x="170" y="203" fill="#f97316" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">l_dalam = √(d² − (R + r)²)</text>
  </svg>
);

/* ── SVG: Comparison GSPL vs GSPD ── */
const KomparasiSVG = () => (
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto my-2" aria-label="Comparison ECT vs ICT">
    <g>
      <circle cx="55" cy="80" r="35" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5"/>
      <circle cx="140" cy="80" r="22" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
      <line x1="30" y1="45" x2="162" y2="58" stroke="#fbbf24" strokeWidth="2.5"/>
      <line x1="30" y1="115" x2="162" y2="102" stroke="#fbbf24" strokeWidth="2.5"/>
      <text x="96" y="148" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">GSPL (///)</text>
      <rect x="18" y="5" width="156" height="18" rx="4" fill="rgba(30,41,59,0.8)" stroke="#334155"/>
      <text x="96" y="18" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">same side</text>
    </g>
    <line x1="180" y1="10" x2="180" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    <g>
      <circle cx="215" cy="80" r="35" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5"/>
      <circle cx="300" cy="80" r="22" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
      <line x1="190" y1="50" x2="322" y2="110" stroke="#f97316" strokeWidth="2.5"/>
      <line x1="190" y1="110" x2="322" y2="50" stroke="#f97316" strokeWidth="2.5"/>
      <text x="256" y="148" fill="#f97316" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">GSPD (X)</text>
      <rect x="188" y="5" width="136" height="18" rx="4" fill="rgba(30,41,59,0.8)" stroke="#334155"/>
      <text x="256" y="18" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">opposite sides</text>
    </g>
  </svg>
);

const GSPDPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] as Record<TranslationKey, string>;
  const tabel = translations[language].tabel;

  const [open, setOpen] = useState<string[]>(["intro", "rumus", "beda", "contoh1", "contoh2", "contoh3", "rangkuman"]);

  const toggle = (id: string) => {
    playPopSound();
    setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_intro} />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro_p.split(t.intro_bold)[0]}
                  <strong className="text-orange-300">{t.intro_bold}</strong>
                  {t.intro_p.split(t.intro_bold)[1]?.split(t.intro_area)[0]}
                  <strong className="text-cyan-300">{t.intro_area}</strong>
                  {t.intro_p.split(t.intro_area)[1]?.split(t.intro_side)[0]}
                  <strong className="text-yellow-300">{t.intro_side}</strong>
                  {t.intro_p.split(t.intro_side)[1]}
                </p>
                <GSPDSVG />
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-orange-200">{t.intro_analogy}</p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title={t.sec_rumus} />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-1">{t.intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.intisari_desc.split(t.intisari_bold)[0]}
                    <strong className="text-cyan-300">{t.intisari_bold}</strong>
                    {t.intisari_desc.split(t.intisari_bold)[1]}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-3">
                    <BlockMath math="l_{dalam} = \sqrt{d^2 - (R + r)^2}" />
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-2">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.var_legend}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-orange-900/40 rounded-lg p-2 text-center">
                      <p className="text-orange-300 font-bold"><InlineMath math="l_{dalam}" /></p>
                      <p className="text-white/60">{t.l_dalam}</p>
                    </div>
                    <div className="bg-purple-900/40 rounded-lg p-2 text-center">
                      <p className="text-purple-300 font-bold"><InlineMath math="d" /></p>
                      <p className="text-white/60">{t.d_var}</p>
                    </div>
                    <div className="bg-blue-900/40 rounded-lg p-2 text-center">
                      <p className="text-blue-300 font-bold"><InlineMath math="R+r" /></p>
                      <p className="text-white/60">{t.Rr_var}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-red-200">
                    {t.syarat.split(t.syarat_bold)[0]}
                    <strong className="text-red-300"><InlineMath math="d > R + r" /></strong>
                    {t.syarat.split(t.syarat_bold)[1]?.split(t.syarat_none)[0]}
                    <strong>{t.syarat_none}</strong>
                    {t.syarat.split(t.syarat_none)[1]}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERBEDAAN GSPL vs GSPD */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="beda" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_beda} />
            {open.includes("beda") && (
              <div className="px-5 pb-5 space-y-4">
                <KomparasiSVG />
                <div className="overflow-x-auto rounded-xl border border-slate-600">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-slate-800/80">
                        <th className="px-4 py-3 text-left text-white font-bold">{t.beda_aspek}</th>
                        <th className="px-4 py-3 text-left text-yellow-300 font-bold">{t.beda_gspl}</th>
                        <th className="px-4 py-3 text-left text-orange-300 font-bold">{t.beda_gspd}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabel.map(({ aspek, gspl, gspd }, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}>
                          <td className="px-4 py-2 text-white/70 font-bold">{aspek}</td>
                          <td className="px-4 py-2 text-yellow-200">{gspl}</td>
                          <td className="px-4 py-2 text-orange-200">{gspd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title={t.sec_contoh1} />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.easy}</p>
                  <p className="font-body text-sm text-white/90">{t.c1_problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">{t.c1_check}</p>
                  <BlockMath math="l_{dalam} = \sqrt{d^2 - (R+r)^2} = \sqrt{25^2 - (9+6)^2}" />
                  <BlockMath math="= \sqrt{625 - 225} = \sqrt{400}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="l_{dalam} = 20 \mathrm{\ cm}" />
                    <p className="font-body text-sm text-green-300 text-center mt-1">{t.c1_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_contoh2} />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.medium}</p>
                  <p className="font-body text-sm text-white/90">{t.c2_problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">{t.c2_step1}</p>
                  <BlockMath math="l_{dalam}^2 = d^2 - (2R)^2" />
                  <BlockMath math="24^2 = 26^2 - 4R^2" />
                  <BlockMath math="576 = 676 - 4R^2 \Rightarrow 4R^2 = 100 \Rightarrow R^2 = 25" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="R = r = 5 \mathrm{\ cm}" />
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">{t.c2_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.sec_contoh3} />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.hard}</p>
                  <p className="font-body text-sm text-white/90">{t.c3_problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80"><strong>{t.c3_step1}</strong></p>
                  <BlockMath math="l_{luar}^2 = d^2 - (R-r)^2" />
                  <BlockMath math="(4\sqrt{21})^2 = d^2 - (10-6)^2" />
                  <BlockMath math="336 = d^2 - 16 \Rightarrow d^2 = 352" />
                  <p className="font-body text-sm text-white/80"><strong>{t.c3_step2}</strong></p>
                  <BlockMath math="l_{dalam} = \sqrt{d^2 - (R+r)^2} = \sqrt{352 - (10+6)^2}" />
                  <BlockMath math="= \sqrt{352 - 256} = \sqrt{96} = 4\sqrt{6} \mathrm{\ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="l_{dalam} = 4\sqrt{6} \approx 9{,}80 \mathrm{\ cm}" />
                    <p className="font-body text-sm text-red-200 text-center mt-1">{t.c3_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec_rangkuman} />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">
                    • <strong className="text-orange-300">{t.sum_bold1}</strong>
                    {t.sum1.replace(`• ${t.sum_bold1}`, "").split(t.sum_bold2)[0]}
                    <strong className="text-cyan-300">{t.sum_bold2}</strong>
                    {t.sum1.split(t.sum_bold2)[1]}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-2"><BlockMath math="l_{dalam} = \sqrt{d^2 - (R+r)^2}" /></div>
                  <p className="font-body text-sm text-white/80 mt-2">
                    {t.sum2.split(t.sum_bold3)[0]}
                    <strong className="text-orange-300">{t.sum_bold3}</strong>
                    {t.sum2.split(t.sum_bold3)[1]}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSPDPage;
