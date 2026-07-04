import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

/* ── translations ── */
const translations = {
  id: {
    title: "GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)",
    subtitle: "Kelas 8 · Garis Singgung Lingkaran · Materi Matematika",
    back: "← Kembali ke Garis Singgung Lingkaran",
    sec_intro: "🌟 Dua Lingkaran Bersama Satu Garis",
    sec_rumus: "📐 Rumus Panjang GSPL",
    sec_contoh1: "✏️ Contoh 1 — Hitung Panjang GSPL (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Cari Jarak Pusat dari Panjang GSPL (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — GSPL dengan Rasio Jari-Jari (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    intro_p: "Bayangkan dua roda gigi yang berputar! Ada garis yang bisa menyinggung keduanya sekaligus dari sisi luar. Inilah",
    intro_bold: "Garis Singgung Persekutuan Luar (GSPL)",
    intro_p2: "— garis yang menyinggung dua lingkaran berbeda, dan kedua lingkaran berada di",
    intro_side: "sisi yang sama",
    intro_p3: "dari garis tersebut.",
    intro_tip: "💡 Ciri khas GSPL: Kedua lingkaran terletak di sisi yang",
    intro_same: "sama",
    intro_tip2: "relatif terhadap garis singgung. Pada umumnya terdapat",
    intro_2gspl: "2 GSPL",
    intro_tip3: "untuk sepasang lingkaran yang tidak saling bertumpuk.",
    intisari: "🎯 Ringkasan Intisari",
    intisari_desc: "Panjang GSPL dihitung menggunakan Teorema Pythagoras pada segitiga bantu. Jika",
    intisari_R: "= jari-jari lingkaran besar,",
    intisari_r: "= jari-jari lingkaran kecil, dan",
    intisari_d: "= jarak antar pusat, maka:",
    deriv_title: "📋 Penurunan Rumus",
    deriv_p1: "Buat garis dari",
    deriv_p2: "sejajar GSPL ke radius",
    deriv_p3: ". Terbentuk persegi panjang dan segitiga siku-siku dengan:",
    deriv_hyp: "• Hipotenusa =",
    deriv_leg: "• Kaki = selisih jari-jari",
    deriv_side: "• Sisi lain = panjang GSPL",
    syarat: "⚠️ Syarat GSPL ada:",
    syarat_bold: "d > |R − r|",
    syarat_p: "(dua lingkaran tidak saling berada di dalam satu sama lain). Jika",
    syarat_eq: "d = |R−r|",
    syarat_1: ", hanya ada 1 GSPL. Jika",
    syarat_lt: "d < |R−r|",
    syarat_none: ", tidak ada GSPL.",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1_problem: "Dua lingkaran berjari-jari 10 cm dan 4 cm. Jarak antara kedua pusatnya adalah 17 cm. Hitung panjang GSPL!",
    c1_given: "Diketahui:",
    c1_unit: "cm",
    c1_ans: "✅ Panjang GSPL ≈ 15,91 cm.",
    c2_problem: "Dua lingkaran berjari-jari 8 cm dan 3 cm memiliki GSPL sepanjang 12 cm. Tentukan jarak antara kedua pusat lingkaran!",
    c2_given: "Diketahui:",
    c2_find: "Dicari:",
    c2_from: "Dari rumus GSPL:",
    c2_ans: "✅ Jarak kedua pusat = 13 cm.",
    c3_problem: "Dua lingkaran memiliki perbandingan jari-jari",
    c3_problem2: ". Jarak antar pusatnya 20 cm dan panjang GSPL-nya 16 cm. Tentukan nilai",
    c3_let: "Misalkan",
    c3_and: "dan",
    c3_from: "Dari rumus GSPL:",
    c3_ans: "✅ Jari-jari lingkaran besar = 18 cm, lingkaran kecil = 6 cm.",
    sum1: "• GSPL: garis yang menyinggung dua lingkaran dari sisi",
    sum_bold1: "luar",
    sum1b: "(kedua lingkaran di sisi yang sama).",
    sum2: "• Syarat ada:",
    sum_cond: "d > |R−r|",
    sum3: ". Jumlah GSPL = 2 (jika lingkaran tidak saling dalam).",
    /* SVG labels */
    svg_aria_main: "Garis singgung persekutuan luar",
    svg_d_label: "d (jarak pusat)",
    svg_top: "GSPL atas",
    svg_bottom: "GSPL bawah",
    svg_aria_kon: "Konstruksi GSPL",
    svg_kon_label: "Konstruksi: Lingkaran bantu jari-jari (R-r) di O₁",
    svg_syarat: "Syarat ada GSPL: d > R - r (dua lingkaran tidak berdalam)",
  },
  en: {
    title: "EXTERNAL COMMON TANGENT (ECT)",
    subtitle: "Grade 8 · Circle Tangent Lines · Math Book",
    back: "← Back to Circle Tangent Lines",
    sec_intro: "🌟 Two Circles, One Shared Line",
    sec_rumus: "📐 ECT Length Formula",
    sec_contoh1: "✏️ Example 1 — Calculate ECT Length (Easy)",
    sec_contoh2: "✏️ Example 2 — Find Center Distance from ECT Length (Medium)",
    sec_contoh3: "✏️ Example 3 — ECT with Radius Ratio (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    intro_p: "Imagine two spinning gears! There is a line that can be tangent to both from the outside. This is the",
    intro_bold: "External Common Tangent (ECT)",
    intro_p2: "— a line tangent to two different circles, with both circles on the",
    intro_side: "same side",
    intro_p3: "of the line.",
    intro_tip: "💡 Key feature of ECT: Both circles lie on the",
    intro_same: "same",
    intro_tip2: "side relative to the tangent line. In general there are",
    intro_2gspl: "2 ECTs",
    intro_tip3: "for a pair of non-overlapping circles.",
    intisari: "🎯 Key Summary",
    intisari_desc: "The ECT length is calculated using the Pythagorean Theorem on an auxiliary triangle. If",
    intisari_R: "= radius of the larger circle,",
    intisari_r: "= radius of the smaller circle, and",
    intisari_d: "= distance between centers, then:",
    deriv_title: "📋 Derivation",
    deriv_p1: "Draw a line from",
    deriv_p2: "parallel to the ECT to the radius of",
    deriv_p3: ". A rectangle and right triangle are formed with:",
    deriv_hyp: "• Hypotenuse =",
    deriv_leg: "• Leg = difference of radii",
    deriv_side: "• Other side = ECT length",
    syarat: "⚠️ ECT exists when:",
    syarat_bold: "d > |R − r|",
    syarat_p: "(the two circles are not inside each other). If",
    syarat_eq: "d = |R−r|",
    syarat_1: ", there is only 1 ECT. If",
    syarat_lt: "d < |R−r|",
    syarat_none: ", no ECT exists.",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1_problem: "Two circles have radii 10 cm and 4 cm. The distance between their centers is 17 cm. Find the ECT length!",
    c1_given: "Given:",
    c1_unit: "cm",
    c1_ans: "✅ ECT length ≈ 15.91 cm.",
    c2_problem: "Two circles with radii 8 cm and 3 cm have an ECT of length 12 cm. Find the distance between the two centers!",
    c2_given: "Given:",
    c2_find: "Find:",
    c2_from: "From the ECT formula:",
    c2_ans: "✅ Distance between centers = 13 cm.",
    c3_problem: "Two circles have radius ratio",
    c3_problem2: ". The center distance is 20 cm and the ECT length is 16 cm. Find the values of",
    c3_let: "Let",
    c3_and: "and",
    c3_from: "From the ECT formula:",
    c3_ans: "✅ Larger circle radius = 18 cm, smaller circle radius = 6 cm.",
    sum1: "• ECT: a line tangent to two circles from the",
    sum_bold1: "outside",
    sum1b: "(both circles on the same side).",
    sum2: "• Condition:",
    sum_cond: "d > |R−r|",
    sum3: ". Number of ECTs = 2 (if circles are not inside each other).",
    /* SVG labels */
    svg_aria_main: "External common tangent (ECT)",
    svg_d_label: "d (center distance)",
    svg_top: "ECT top",
    svg_bottom: "ECT bottom",
    svg_aria_kon: "ECT construction",
    svg_kon_label: "Construction: Auxiliary circle radius (R\u2212r) at O\u2081",
    svg_syarat: "ECT exists when: d > R \u2212 r (circles not inside each other)",
  },
  ja: {
    title: "外接共通接線 (GSPL)",
    subtitle: "中学2年 · 円の接線 · 数学",
    back: "← 円の接線に戻る",
    sec_intro: "🌟 2つの円を結ぶ一本の直線",
    sec_rumus: "📐 外接共通接線の長さの公式",
    sec_contoh1: "✏️ 例題1 — 外接共通接線の長さを求める（易しい）",
    sec_contoh2: "✏️ 例題2 — 外接共通接線から中心間距離を求める（普通）",
    sec_contoh3: "✏️ 例題3 — 半径の比と外接共通接線（難しい）",
    sec_rangkuman: "📌 まとめ",
    intro_p: "2つの歯車が回転していることを想像してください！両方の外側から同時に接する直線があります。これが",
    intro_bold: "外接共通接線 (GSPL)",
    intro_p2: "— 2つの異なる円に接する直線で、両円が直線に対して",
    intro_side: "同じ側",
    intro_p3: "にあります。",
    intro_tip: "💡 外接共通接線の特徴：両円は接線に対して",
    intro_same: "同じ側",
    intro_tip2: "に位置します。重なり合わない2円には通常",
    intro_2gspl: "2本の外接共通接線",
    intro_tip3: "があります。",
    intisari: "🎯 要点まとめ",
    intisari_desc: "外接共通接線の長さは補助三角形でピタゴラスの定理を用いて計算します。",
    intisari_R: "= 大きい円の半径、",
    intisari_r: "= 小さい円の半径、",
    intisari_d: "= 中心間距離 のとき：",
    deriv_title: "📋 公式の導出",
    deriv_p1: "",
    deriv_p2: "から外接共通接線に平行な補助線を",
    deriv_p3: "の半径に引くと、長方形と直角三角形が形成されます：",
    deriv_hyp: "• 斜辺 =",
    deriv_leg: "• 一辺 = 半径の差",
    deriv_side: "• 残りの辺 = 外接共通接線の長さ",
    syarat: "⚠️ 外接共通接線が存在する条件：",
    syarat_bold: "d > |R − r|",
    syarat_p: "（2つの円が互いの内側にない）。",
    syarat_eq: "d = |R−r|",
    syarat_1: "のとき接線は1本。",
    syarat_lt: "d < |R−r|",
    syarat_none: "のとき外接共通接線は存在しない。",
    easy: "🟢 難易度：易しい",
    medium: "🟡 難易度：普通",
    hard: "🔴 難易度：難しい",
    discussion: "📋 解法",
    c1_problem: "半径10 cmと4 cmの2つの円があり、中心間の距離は17 cmです。外接共通接線の長さを求めなさい！",
    c1_given: "与えられた値：",
    c1_unit: "cm",
    c1_ans: "✅ 外接共通接線の長さ ≈ 15.91 cm。",
    c2_problem: "半径8 cmと3 cmの2つの円の外接共通接線の長さが12 cmです。2つの中心間の距離を求めなさい！",
    c2_given: "与えられた値：",
    c2_find: "求めるもの：",
    c2_from: "外接共通接線の公式から：",
    c2_ans: "✅ 中心間距離 = 13 cm。",
    c3_problem: "2つの円の半径の比が",
    c3_problem2: "、中心間距離は20 cm、外接共通接線の長さは16 cmです。",
    c3_let: "R = 3k、r = k とおく。",
    c3_and: "",
    c3_from: "外接共通接線の公式から：",
    c3_ans: "✅ 大きい円の半径 = 18 cm、小さい円の半径 = 6 cm。",
    sum1: "• 外接共通接線 (GSPL)：2円の",
    sum_bold1: "外側",
    sum1b: "から接する直線（両円が同じ側にある）。",
    sum2: "• 存在条件：",
    sum_cond: "d > |R−r|",
    sum3: "。外接共通接線の数 = 2（一方が他方の内側にない場合）。",
    /* SVG labels */
    svg_aria_main: "外接共通接線 (GSPL)",
    svg_d_label: "d（中心間距離）",
    svg_top: "GSPL 上",
    svg_bottom: "GSPL 下",
    svg_aria_kon: "外接共通接線の構成",
    svg_kon_label: "補助円の半径 (R\u2212r) を O\u2081 に",
    svg_syarat: "GSPLの存在条件：d > R \u2212 r（一方が他方の内側にない）",
  },
} as const;

type Lang = keyof typeof translations;

/* ── SVG: External common tangent (GSPL) diagram ── */
const GSPLSVG = ({ t }: { t: typeof translations[Lang] }) => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-2" aria-label={t.svg_aria_main}>
    <defs>
      <style>{`
        @keyframes gsplGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #fbbf24);}50%{stroke-opacity:0.4;filter:none;}}
        .gspl{animation:gsplGlow 2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Circle 1 (larger, R) */}
    <circle cx="85" cy="110" r="60" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="85" cy="110" r="4" fill="#3b82f6"/>
    <text x="70" y="107" fill="#60a5fa" fontSize="12" fontFamily="monospace" fontWeight="bold">O₁</text>
    {/* Circle 2 (smaller, r) */}
    <circle cx="255" cy="120" r="38" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="255" cy="120" r="4" fill="#a855f7"/>
    <text x="260" y="117" fill="#c084fc" fontSize="12" fontFamily="monospace" fontWeight="bold">O₂</text>
    {/* Upper tangent line */}
    <line x1="60" y1="50" x2="233" y2="82" stroke="#fbbf24" strokeWidth="3" className="gspl"/>
    {/* Lower tangent line */}
    <line x1="60" y1="170" x2="233" y2="158" stroke="#fbbf24" strokeWidth="3" className="gspl"/>
    {/* Center-to-center line */}
    <line x1="85" y1="110" x2="255" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
    {/* Radii labels */}
    <text x="78" y="145" fill="#60a5fa" fontSize="10" fontFamily="monospace">R</text>
    <text x="252" y="152" fill="#c084fc" fontSize="10" fontFamily="monospace">r</text>
    {/* Distance label */}
    <text x="160" y="126" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svg_d_label}</text>
    {/* Tangent line labels */}
    <text x="145" y="40" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t.svg_top}</text>
    <text x="145" y="185" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t.svg_bottom}</text>
    {/* Formula (math notation — no natural language) */}
    <rect x="5" y="3" width="330" height="22" rx="5" fill="rgba(30,41,59,0.9)" stroke="#334155" strokeWidth="1"/>
    <text x="170" y="18" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">l = √(d² − (R − r)²)</text>
  </svg>
);

/* ── SVG: Proof construction for GSPL ── */
const GSPLKonstruksiSVG = ({ t }: { t: typeof translations[Lang] }) => (
  <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto my-2" aria-label={t.svg_aria_kon}>
    <defs>
      <style>{`@keyframes conGlow{0%,100%{opacity:1;}50%{opacity:0.3;}}.cong{animation:conGlow 2s ease-in-out infinite;}`}</style>
    </defs>
    {/* Circle 1 */}
    <circle cx="85" cy="115" r="60" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="2"/>
    <circle cx="85" cy="115" r="3" fill="#3b82f6"/>
    <text x="70" y="112" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">O₁</text>
    {/* Circle 2 */}
    <circle cx="255" cy="125" r="38" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="2"/>
    <circle cx="255" cy="125" r="3" fill="#a855f7"/>
    <text x="260" y="122" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">O₂</text>
    {/* Auxiliary circle (R-r) centered at O1 */}
    <circle cx="85" cy="115" r="22" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3"/>
    <text x="95" y="97" fill="#4ade80" fontSize="8" fontFamily="monospace">R-r</text>
    {/* O1 to O2 line */}
    <line x1="85" y1="115" x2="255" y2="125" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
    <text x="170" y="132" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">d</text>
    {/* External tangent line */}
    <line x1="85" y1="93" x2="255" y2="87" stroke="#fbbf24" strokeWidth="2.5" className="cong"/>
    <text x="170" y="82" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">l</text>
    {/* Construction label */}
    <text x="170" y="200" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svg_kon_label}</text>
    <rect x="5" y="5" width="330" height="20" rx="4" fill="rgba(30,41,59,0.9)" stroke="#334155"/>
    <text x="170" y="18" fill="#eab308" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t.svg_syarat}</text>
  </svg>
);

const GSPLPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as Lang] ?? translations.id;

  const [open, setOpen] = useState<string[]>(["intro", "rumus", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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
                  {t.intro_p}{" "}
                  <strong className="text-yellow-300">{t.intro_bold}</strong>{" "}
                  {t.intro_p2}{" "}
                  <strong className="text-cyan-300">{t.intro_side}</strong>{" "}
                  {t.intro_p3}
                </p>
                <GSPLSVG t={t} />
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.intro_tip}{" "}
                    <strong className="text-yellow-300">{t.intro_same}</strong>{" "}
                    {t.intro_tip2}{" "}
                    <strong className="text-cyan-300">{t.intro_2gspl}</strong>{" "}
                    {t.intro_tip3}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_rumus} />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.intisari_desc}{" "}
                    <InlineMath math="R" /> {t.intisari_R}{" "}
                    <InlineMath math="r" /> {t.intisari_r}{" "}
                    <InlineMath math="d" /> {t.intisari_d}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-3">
                    <BlockMath math="l_{luar} = \sqrt{d^2 - (R - r)^2}" />
                  </div>
                </div>
                <GSPLKonstruksiSVG t={t} />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.deriv_title}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.deriv_p1}{" "}<InlineMath math="O_2" />{" "}{t.deriv_p2}{" "}<InlineMath math="O_1" />{t.deriv_p3}
                  </p>
                  <p className="font-body text-sm text-white/80">{t.deriv_hyp} <InlineMath math="d = O_1O_2"/></p>
                  <p className="font-body text-sm text-white/80">{t.deriv_leg} <InlineMath math="R - r"/></p>
                  <p className="font-body text-sm text-white/80">{t.deriv_side} <InlineMath math="l_{luar}"/></p>
                  <BlockMath math="d^2 = (R-r)^2 + l_{luar}^2" />
                  <BlockMath math="\therefore l_{luar} = \sqrt{d^2 - (R-r)^2}" />
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-orange-200">
                    {t.syarat}{" "}
                    <strong>{t.syarat_bold}</strong>{" "}
                    {t.syarat_p}{" "}
                    <InlineMath math="d = |R-r|"/>{t.syarat_1}{" "}
                    <InlineMath math="d < |R-r|"/>{t.syarat_none}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 — MUDAH / EASY / 易しい */}
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
                  <p className="font-body text-sm text-white/80">
                    {t.c1_given} <InlineMath math="R = 10"/> {t.c1_unit}, <InlineMath math="r = 4"/> {t.c1_unit}, <InlineMath math="d = 17"/> {t.c1_unit}.
                  </p>
                  <BlockMath math="l_{luar} = \sqrt{d^2 - (R-r)^2} = \sqrt{17^2 - (10-4)^2}" />
                  <BlockMath math="= \sqrt{289 - 36} = \sqrt{253}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="l_{luar} = \sqrt{253} \approx 15{,}91\ \mathrm{cm}" />
                    <p className="font-body text-sm text-green-300 text-center mt-1">{t.c1_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 — SEDANG / MEDIUM / 普通 */}
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
                  <p className="font-body text-sm text-white/80">
                    {t.c2_given} <InlineMath math="R = 8"/> {t.c1_unit}, <InlineMath math="r = 3"/> {t.c1_unit}, <InlineMath math="l_{luar} = 12"/> {t.c1_unit}. {t.c2_find} <InlineMath math="d"/>.
                  </p>
                  <p className="font-body text-sm text-white/80">{t.c2_from}</p>
                  <BlockMath math="l_{luar}^2 = d^2 - (R-r)^2" />
                  <BlockMath math="12^2 = d^2 - (8-3)^2" />
                  <BlockMath math="144 = d^2 - 25 \Rightarrow d^2 = 169" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="d = \sqrt{169} = 13\ \mathrm{cm}" />
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">{t.c2_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 — SULIT / HARD / 難しい */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.sec_contoh3} />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.hard}</p>
                  <p className="font-body text-sm text-white/90">
                    {t.c3_problem} <InlineMath math="R : r = 3 : 1"/>{t.c3_problem2} <InlineMath math="R"/> {language !== "ja" && <>{t.c3_and} <InlineMath math="r"/>!</>}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">
                    {language === "ja"
                      ? t.c3_let
                      : <>{t.c3_let} <InlineMath math="R = 3k"/> {t.c3_and} <InlineMath math="r = k"/>.</>
                    }
                  </p>
                  <p className="font-body text-sm text-white/80">{t.c3_from}</p>
                  <BlockMath math="l_{luar}^2 = d^2 - (R-r)^2" />
                  <BlockMath math="16^2 = 20^2 - (3k-k)^2" />
                  <BlockMath math="256 = 400 - (2k)^2" />
                  <BlockMath math="4k^2 = 144 \Rightarrow k^2 = 36 \Rightarrow k = 6" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="R = 3 \times 6 = 18\ \mathrm{cm},\quad r = 6\ \mathrm{cm}" />
                    <p className="font-body text-sm text-red-200 text-center mt-1">{t.c3_ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN / SUMMARY / まとめ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec_rangkuman} />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">
                    {t.sum1}{" "}
                    <strong className="text-yellow-300">{t.sum_bold1}</strong>{" "}
                    {t.sum1b}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 mt-2">
                    <BlockMath math="l_{luar} = \sqrt{d^2 - (R-r)^2}" />
                  </div>
                  <p className="font-body text-sm text-white/80 mt-2">
                    {t.sum2}{" "}
                    <InlineMath math="d > |R-r|"/>{t.sum3}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSPLPage;
