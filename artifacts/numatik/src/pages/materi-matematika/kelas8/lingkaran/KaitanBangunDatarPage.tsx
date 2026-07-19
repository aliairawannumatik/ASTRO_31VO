import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const translations = {
  id: {
    badge: "KELAS 8 · LINGKARAN · BUKU ANIMASI MATEMATIKA",
    h1: "LINGKARAN DALAM DAN\nLINGKARAN LUAR SEGITIGA",
    enrichment: "⭐ PENGAYAAN",
    subtitle: "Incircle · Circumcircle · Rumus Jari-Jari",
    svgIncircleAria: "Lingkaran dalam segitiga",
    svgCircumAria: "Lingkaran luar segitiga",
    introTitle: "🔗 Lingkaran dan Sahabat-Sahabatnya",
    introP: "Lingkaran bisa \"bersahabat\" dengan bangun datar lain dengan dua cara utama: Lingkaran Dalam — berada di dalam bangun dan menyinggung setiap sisinya, dan Lingkaran Luar — melingkupi bangun dan melewati setiap titik sudutnya.",
    introIn: "Lingkaran Dalam",
    introOut: "Lingkaran Luar",
    inLabel: "⭕ Lingkaran Dalam (Incircle)",
    inDesc: "Berada di dalam bangun datar, menyinggung semua sisi. Pusatnya disebut ",
    inDescEm: "incenter",
    outLabel: "🔴 Lingkaran Luar (Circumcircle)",
    outDesc: "Melingkupi bangun datar, melewati semua titik sudut. Pusatnya disebut ",
    outDescEm: "circumcenter",
    kaitanTitle: "📐 Lingkaran Dalam & Luar Segitiga",
    sec1Label: "1. Lingkaran Dalam Segitiga",
    sec1Desc: "Pusat lingkaran dalam = ",
    sec1Bold: "titik potong garis bagi sudut",
    sec1Sub: ". Lingkaran menyinggung ",
    sec1Sub2: "tepat di satu titik",
    sec1Sub3: " pada setiap sisi segitiga.",
    sec1FormulaNote: "L = luas segitiga, s = semi-perimeter (setengah keliling), a,b,c = panjang sisi",
    sec2Label: "2. Lingkaran Luar Segitiga",
    sec2Desc: "Pusat lingkaran luar = ",
    sec2Bold: "titik potong sumbu-sumbu sisi",
    sec2Sub: ". Semua ",
    sec2Sub2: "titik sudut segitiga",
    sec2Sub3: " berada tepat di tepi lingkaran.",
    sec2FormulaNote: "AB, AC, BC = panjang sisi-sisi segitiga, L = luas segitiga",
    sec2Tip: "💡 Ingat:",
    sec2TipBold: "Ingat:",
    sec2TipRest: " Untuk segitiga siku-siku, sisi miring = diameter lingkaran luar, sehingga ",
    sec2TipFormula: "R = \\frac{AB}{2}",
    c1Title: "✏️ Contoh 1 — Lingkaran Dalam Segitiga (Sedang)",
    c1Level: "🟡 Tingkat: Sedang",
    c1Q: "Segitiga siku-siku ABC dengan siku-siku di C memiliki ",
    c1Q2: " cm, ",
    c1Q3: " cm. Hitunglah jari-jari lingkaran dalam segitiga tersebut!",
    c1Sol: "📋 Pembahasan",
    c1s1: "Langkah 1:",
    c1s1T: "Cari sisi miring AB",
    c1s2: "Langkah 2:",
    c1s2T: "Hitung luas segitiga",
    c1s3: "Langkah 3:",
    c1s3T: "Hitung semi-perimeter",
    c1s4: "Langkah 4:",
    c1s4T: "Jari-jari lingkaran dalam",
    c1Result: "✅ Jari-jari lingkaran dalam = 2 cm",
    c2Title: "✏️ Contoh 2 — Lingkaran Luar Segitiga (Sulit)",
    c2Level: "🔴 Tingkat: Sulit",
    c2Q: "Segitiga ABC memiliki sisi ",
    c2Q2: " cm, ",
    c2Q3: " cm, ",
    c2Q4: " cm (segitiga siku-siku di C). Hitunglah jari-jari lingkaran luar segitiga tersebut!",
    c2Sol: "📋 Pembahasan",
    c2s1: "Langkah 1:",
    c2s1T: "Hitung luas segitiga",
    c2s2: "Langkah 2:",
    c2s2T: "Gunakan rumus lingkaran luar",
    c2Shortcut: "Cara cepat untuk segitiga siku-siku:",
    c2Result: "✅ Jari-jari lingkaran luar = 6,5 cm",
    rTitle: "📌 Rangkuman Sub-Bab",
    rIn: "⭕ Lingkaran Dalam Segitiga",
    rInB1: "• Menyinggung ketiga sisi (tegak lurus)",
    rInB2: "• Pusat = perpotongan garis bagi sudut",
    rInSub: "s = (a+b+c)/2",
    rOut: "🔴 Lingkaran Luar Segitiga",
    rOutB1: "• Melalui ketiga titik sudut",
    rOutB2: "• Pusat = perpotongan sumbu sisi",
    rOutSub: "Siku-siku: R = sisi miring / 2",
    tips: "🚀 Tips Astronot: Tiga sinyal GPS membentuk tiga lingkaran — posisimu ada di perpotongannya, persis seperti konsep circumcircle!",
    backBtn: "← Kembali ke Lingkaran",
  },
  en: {
    badge: "GRADE 8 · CIRCLE · MATH ANIMATION BOOK",
    h1: "INCIRCLE AND\nCIRCUMCIRCLE OF A TRIANGLE",
    enrichment: "⭐ ENRICHMENT",
    subtitle: "Incircle · Circumcircle · Radius Formulas",
    svgIncircleAria: "Incircle of a triangle",
    svgCircumAria: "Circumcircle of a triangle",
    introTitle: "🔗 Circles and Their Friends",
    introP: "A circle can \"befriend\" other shapes in two main ways: Incircle — inside the shape, tangent to every side, and Circumcircle — surrounding the shape, passing through every vertex.",
    introIn: "Incircle",
    introOut: "Circumcircle",
    inLabel: "⭕ Incircle",
    inDesc: "Inside the shape, tangent to all sides. Its center is called the ",
    inDescEm: "incenter",
    outLabel: "🔴 Circumcircle",
    outDesc: "Surrounding the shape, passing through all vertices. Its center is called the ",
    outDescEm: "circumcenter",
    kaitanTitle: "📐 Incircle & Circumcircle of a Triangle",
    sec1Label: "1. Incircle of a Triangle",
    sec1Desc: "Center of incircle = ",
    sec1Bold: "intersection of angle bisectors",
    sec1Sub: ". The circle is tangent to each side at ",
    sec1Sub2: "exactly one point",
    sec1Sub3: ".",
    sec1FormulaNote: "L = area of triangle, s = semi-perimeter (half the perimeter), a,b,c = side lengths",
    sec2Label: "2. Circumcircle of a Triangle",
    sec2Desc: "Center of circumcircle = ",
    sec2Bold: "intersection of perpendicular bisectors",
    sec2Sub: ". All ",
    sec2Sub2: "vertices of the triangle",
    sec2Sub3: " lie exactly on the circumcircle.",
    sec2FormulaNote: "AB, AC, BC = side lengths, L = area of triangle",
    sec2Tip: "💡 Remember:",
    sec2TipBold: "Remember:",
    sec2TipRest: " For a right triangle, the hypotenuse = diameter of the circumcircle, so ",
    sec2TipFormula: "R = \\frac{AB}{2}",
    c1Title: "✏️ Example 1 — Incircle of a Triangle (Medium)",
    c1Level: "🟡 Level: Medium",
    c1Q: "Right triangle ABC with right angle at C has ",
    c1Q2: " cm, ",
    c1Q3: " cm. Find the radius of the incircle!",
    c1Sol: "📋 Solution",
    c1s1: "Step 1:",
    c1s1T: "Find hypotenuse AB",
    c1s2: "Step 2:",
    c1s2T: "Calculate triangle area",
    c1s3: "Step 3:",
    c1s3T: "Calculate semi-perimeter",
    c1s4: "Step 4:",
    c1s4T: "Radius of incircle",
    c1Result: "✅ Incircle radius = 2 cm",
    c2Title: "✏️ Example 2 — Circumcircle of a Triangle (Hard)",
    c2Level: "🔴 Level: Hard",
    c2Q: "Triangle ABC has sides ",
    c2Q2: " cm, ",
    c2Q3: " cm, ",
    c2Q4: " cm (right triangle at C). Find the radius of the circumcircle!",
    c2Sol: "📋 Solution",
    c2s1: "Step 1:",
    c2s1T: "Calculate triangle area",
    c2s2: "Step 2:",
    c2s2T: "Apply circumcircle formula",
    c2Shortcut: "Shortcut for right triangle:",
    c2Result: "✅ Circumcircle radius = 6.5 cm",
    rTitle: "📌 Chapter Summary",
    rIn: "⭕ Incircle of Triangle",
    rInB1: "• Tangent to all three sides (perpendicular)",
    rInB2: "• Center = intersection of angle bisectors",
    rInSub: "s = (a+b+c)/2",
    rOut: "🔴 Circumcircle of Triangle",
    rOutB1: "• Passes through all three vertices",
    rOutB2: "• Center = intersection of perpendicular bisectors",
    rOutSub: "Right triangle: R = hypotenuse / 2",
    tips: "🚀 Astronaut Tip: Three GPS signals form three circles — your position is at their intersection, just like the circumcircle concept!",
    backBtn: "← Back to Circle",
  },
  ja: {
    badge: "中学2年 · 円 · 数学アニメーション",
    h1: "三角形の内接円と\n外接円",
    enrichment: "⭐ 発展",
    subtitle: "内接円 · 外接円 · 半径の公式",
    svgIncircleAria: "三角形の内接円",
    svgCircumAria: "三角形の外接円",
    introTitle: "🔗 円とその仲間たち",
    introP: "円は他の図形と2つの主な方法で「仲良し」になれます：内接円 — 図形の内側にあり、すべての辺に接する、そして外接円 — 図形を囲み、すべての頂点を通る。",
    introIn: "内接円",
    introOut: "外接円",
    inLabel: "⭕ 内接円（Incircle）",
    inDesc: "図形の内側にあり、すべての辺に接する。中心は ",
    inDescEm: "内心（incenter）",
    outLabel: "🔴 外接円（Circumcircle）",
    outDesc: "図形を囲み、すべての頂点を通る。中心は ",
    outDescEm: "外心（circumcenter）",
    kaitanTitle: "📐 三角形の内接円と外接円",
    sec1Label: "1. 三角形の内接円",
    sec1Desc: "内接円の中心 = ",
    sec1Bold: "三本の角の二等分線の交点",
    sec1Sub: "。円は各辺に ",
    sec1Sub2: "ちょうど1点で接する",
    sec1Sub3: "。",
    sec1FormulaNote: "L = 三角形の面積、s = 半周長（周長の半分）、a,b,c = 各辺の長さ",
    sec2Label: "2. 三角形の外接円",
    sec2Desc: "外接円の中心 = ",
    sec2Bold: "三本の辺の垂直二等分線の交点",
    sec2Sub: "。三角形の ",
    sec2Sub2: "すべての頂点",
    sec2Sub3: " が外接円上にある。",
    sec2FormulaNote: "AB, AC, BC = 辺の長さ、L = 三角形の面積",
    sec2Tip: "💡 覚えよう：",
    sec2TipBold: "覚えよう：",
    sec2TipRest: " 直角三角形の場合、斜辺 = 外接円の直径、つまり ",
    sec2TipFormula: "R = \\frac{AB}{2}",
    c1Title: "✏️ 例題1 — 内接円（標準）",
    c1Level: "🟡 レベル：標準",
    c1Q: "Cでの直角を持つ直角三角形ABCで ",
    c1Q2: " cm、",
    c1Q3: " cm。内接円の半径を求めなさい！",
    c1Sol: "📋 解説",
    c1s1: "ステップ1：",
    c1s1T: "斜辺ABを求める",
    c1s2: "ステップ2：",
    c1s2T: "三角形の面積を計算する",
    c1s3: "ステップ3：",
    c1s3T: "半周長を計算する",
    c1s4: "ステップ4：",
    c1s4T: "内接円の半径",
    c1Result: "✅ 内接円の半径 = 2 cm",
    c2Title: "✏️ 例題2 — 外接円（発展）",
    c2Level: "🔴 レベル：発展",
    c2Q: "三角形ABCの辺は ",
    c2Q2: " cm、",
    c2Q3: " cm、",
    c2Q4: " cm（Cで直角）。外接円の半径を求めなさい！",
    c2Sol: "📋 解説",
    c2s1: "ステップ1：",
    c2s1T: "三角形の面積を計算する",
    c2s2: "ステップ2：",
    c2s2T: "外接円の公式を使う",
    c2Shortcut: "直角三角形の近道：",
    c2Result: "✅ 外接円の半径 = 6.5 cm",
    rTitle: "📌 まとめ",
    rIn: "⭕ 三角形の内接円",
    rInB1: "• 三辺すべてに接する（垂直）",
    rInB2: "• 中心 = 角の二等分線の交点",
    rInSub: "s = (a+b+c)/2",
    rOut: "🔴 三角形の外接円",
    rOutB1: "• 三頂点すべてを通る",
    rOutB2: "• 中心 = 垂直二等分線の交点",
    rOutSub: "直角三角形：R = 斜辺 / 2",
    tips: "🚀 宇宙人のヒント：3つのGPS信号は3つの円を作ります — あなたの位置はその交点にあります。外接円の概念そのものです！",
    backBtn: "← 円に戻る",
  },
} as const;
type T = typeof translations.id;

/* ─── SVG: Incircle ──────────────────────────────────────── */
const LingkaranDalamSegitigaSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto" aria-label={t.svgIncircleAria}>
    <defs>
      <radialGradient id="incircleGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#4ade80" stopOpacity=".35" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity=".08" />
      </radialGradient>
      <style>{`
        @keyframes incirclePulse{0%,100%{stroke-opacity:.75;filter:drop-shadow(0 0 5px #4ade80) drop-shadow(0 0 12px rgba(74,222,128,.4));}50%{stroke-opacity:1;filter:drop-shadow(0 0 12px #4ade80) drop-shadow(0 0 28px rgba(74,222,128,.75));}}
        @keyframes tangentDot{0%,100%{r:4;opacity:.7;}50%{r:6;opacity:1;}}
        .ic-ring{animation:incirclePulse 2.4s ease-in-out infinite;}
        .t-dot{animation:tangentDot 2.4s ease-in-out infinite;}
      `}</style>
    </defs>
    <polygon points="140,22 240,198 40,198"
      fill="rgba(6,182,212,.12)" stroke="#06b6d4" strokeWidth="2.5" strokeLinejoin="round"/>
    <text x="140" y="15" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>
    <text x="250" y="208" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
    <text x="30"  y="208" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">C</text>
    <circle cx="140" cy="140" r="58" fill="url(#incircleGrad)"/>
    <circle cx="140" cy="140" r="58" fill="none" stroke="#4ade80" strokeWidth="2.5" className="ic-ring"/>
    <line x1="140" y1="140" x2="140" y2="198" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <line x1="140" y1="140" x2="89"  y2="111" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <line x1="140" y1="140" x2="191" y2="111" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 3" opacity=".8"/>
    <text x="147" y="175" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="105" y="122" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="172" y="122" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">r</text>
    <rect x="140" y="190" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".7"/>
    <g transform="rotate(-60 89 111)"><rect x="89" y="103" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".7"/></g>
    <g transform="rotate(60 191 111)"><rect x="183" y="103" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity=".7"/></g>
    <circle cx="140" cy="198" r="4.5" fill="#fbbf24" className="t-dot" style={{filter:'drop-shadow(0 0 5px #fbbf24)'}}/>
    <circle cx="89"  cy="111" r="4.5" fill="#fbbf24" className="t-dot" style={{filter:'drop-shadow(0 0 5px #fbbf24)'}}/>
    <circle cx="191" cy="111" r="4.5" fill="#fbbf24" className="t-dot" style={{filter:'drop-shadow(0 0 5px #fbbf24)'}}/>
    <circle cx="140" cy="140" r="4" fill="#4ade80" style={{filter:'drop-shadow(0 0 6px #4ade80)'}}/>
    <text x="148" y="137" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
  </svg>
);

/* ─── SVG: Circumcircle ──────────────────────────────────── */
const LingkaranLuarSegitigaSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 280 230" className="w-full max-w-xs mx-auto" aria-label={t.svgCircumAria}>
    <defs>
      <radialGradient id="circumGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#f97316" stopOpacity="0"   />
        <stop offset="80%"  stopColor="#f97316" stopOpacity=".06" />
        <stop offset="100%" stopColor="#f97316" stopOpacity=".22" />
      </radialGradient>
      <style>{`
        @keyframes circumPulse{0%,100%{stroke-opacity:.7;filter:drop-shadow(0 0 5px #f97316) drop-shadow(0 0 14px rgba(249,115,22,.4));}50%{stroke-opacity:1;filter:drop-shadow(0 0 14px #f97316) drop-shadow(0 0 32px rgba(249,115,22,.75));}}
        @keyframes vertexPulse{0%,100%{r:5;opacity:.8;}50%{r:7;opacity:1;}}
        .cc-ring{animation:circumPulse 2.6s ease-in-out infinite;}
        .v-dot{animation:vertexPulse 2.6s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="140" cy="108" r="80" fill="url(#circumGrad)"/>
    <circle cx="140" cy="108" r="80" fill="none" stroke="#f97316" strokeWidth="2.5" className="cc-ring"/>
    <polygon points="167,33 201,159 60,115"
      fill="rgba(251,191,36,.12)" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round"/>
    <text x="167" y="24"  fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>
    <text x="213" y="164" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
    <text x="48"  y="120" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">C</text>
    <line x1="140" y1="108" x2="167" y2="33"  stroke="#f97316" strokeWidth="1.4" strokeDasharray="5 3" opacity=".65"/>
    <line x1="140" y1="108" x2="201" y2="159" stroke="#f97316" strokeWidth="1.4" strokeDasharray="5 3" opacity=".65"/>
    <line x1="140" y1="108" x2="60"  y2="115" stroke="#f97316" strokeWidth="1.4" strokeDasharray="5 3" opacity=".65"/>
    <text x="157" y="75"  fill="#fb923c" fontSize="9" fontFamily="monospace" fontWeight="bold">R</text>
    <circle cx="167" cy="33"  r="5.5" fill="#fbbf24" className="v-dot" style={{filter:'drop-shadow(0 0 7px #fbbf24)'}}/>
    <circle cx="201" cy="159" r="5.5" fill="#fbbf24" className="v-dot" style={{filter:'drop-shadow(0 0 7px #fbbf24)'}}/>
    <circle cx="60"  cy="115" r="5.5" fill="#fbbf24" className="v-dot" style={{filter:'drop-shadow(0 0 7px #fbbf24)'}}/>
    <circle cx="140" cy="108" r="4" fill="#f97316" style={{filter:'drop-shadow(0 0 6px #f97316)'}}/>
    <text x="148" y="105" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="195" y="102" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".8">AB</text>
    <text x="112" y="148" fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".8">BC</text>
    <text x="93"  y="68"  fill="#fde68a" fontSize="9" fontFamily="monospace" opacity=".8">AC</text>
  </svg>
);

/* ─── Main Page ─────────────────────────────────────────── */
const KaitanBangunDatarPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const { isDark } = useTheme();

  const SH = ({
    icon, iconColor, title, gradFrom, borderColor,
  }: {
    icon: React.ReactNode; iconColor?: string; title: string;
    gradFrom?: string; borderColor?: string;
  }) => (
    <div
      className="w-full flex items-center px-5 py-4"
      style={{
        background: `linear-gradient(to right, ${gradFrom ?? "rgba(6,182,212,.12)"}, transparent)`,
        borderBottom: `1px solid ${borderColor ?? "rgba(6,182,212,.25)"}`,
      }}
    >
      <span className={iconColor}>{icon}</span>
      <span className={`font-body font-semibold ${isDark ? "text-white" : "text-gray-800"} ml-3`}>{title}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-body font-bold tracking-wide"
            style={{background:"rgba(168,85,247,.15)",border:"1px solid rgba(168,85,247,.4)",color:"#c084fc"}}>
            <BookOpen className="w-3.5 h-3.5"/> {t.badge}
          </div>
          <h1 className="font-display text-xl md:text-3xl font-bold mb-2 text-glow-cyan"
            style={{background:"linear-gradient(135deg,#22d3ee,#a78bfa,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            {t.h1.split("\n").map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br/>}</React.Fragment>)}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-bold mt-1"
            style={{background:"rgba(168,85,247,.2)",border:"1px solid rgba(168,85,247,.4)",color:"#c084fc"}}>
            {t.enrichment}
          </div>
          <p className="text-white/40 text-xs font-body mt-2">{t.subtitle}</p>
        </div>

        <div className="flex flex-col gap-5 animate-slide-up">

          {/* INTRO */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background: isDark ? "rgba(15,23,42,.7)" : "rgba(248,250,252,.95)", borderColor:"rgba(6,182,212,.25)",backdropFilter:"blur(12px)"}}>
            <SH icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400"
              title={t.introTitle}
              gradFrom="rgba(234,179,8,.12)" borderColor="rgba(234,179,8,.3)"/>
            <div className="px-5 pb-5 pt-4 space-y-4">
              <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} leading-relaxed`}>
                {t.introP.split(t.introIn)[0]}
                <strong className="text-green-300">{t.introIn}</strong>
                {t.introP.split(t.introIn)[1]?.split(t.introOut)[0]}
                <strong className="text-orange-300">{t.introOut}</strong>
                {t.introP.split(t.introIn)[1]?.split(t.introOut)[1]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl p-4 border"
                  style={{background:"linear-gradient(135deg,rgba(34,197,94,.15),rgba(6,182,212,.08))",borderColor:"rgba(34,197,94,.35)"}}>
                  <p className="text-green-300 text-sm font-bold mb-1">{t.inLabel}</p>
                  <p className={`${isDark ? "text-white/60" : "text-gray-600"} text-xs leading-relaxed`}>{t.inDesc}<em>{t.inDescEm}</em>.</p>
                </div>
                <div className="rounded-xl p-4 border"
                  style={{background:"linear-gradient(135deg,rgba(249,115,22,.15),rgba(251,191,36,.08))",borderColor:"rgba(249,115,22,.35)"}}>
                  <p className="text-orange-300 text-sm font-bold mb-1">{t.outLabel}</p>
                  <p className={`${isDark ? "text-white/60" : "text-gray-600"} text-xs leading-relaxed`}>{t.outDesc}<em>{t.outDescEm}</em>.</p>
                </div>
              </div>
            </div>
          </div>

          {/* KAITAN */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background: isDark ? "rgba(15,23,42,.7)" : "rgba(248,250,252,.95)", borderColor:"rgba(168,85,247,.25)",backdropFilter:"blur(12px)"}}>
            <SH icon={<Target className="w-5 h-5"/>} iconColor="text-violet-400"
              title={t.kaitanTitle}
              gradFrom="rgba(168,85,247,.12)" borderColor="rgba(168,85,247,.3)"/>
            <div className="px-5 pb-6 pt-4 space-y-8">

              {/* Incircle */}
              <div className="rounded-2xl overflow-hidden border"
                style={{background:"linear-gradient(135deg,rgba(34,197,94,.1),rgba(6,182,212,.06))",borderColor:"rgba(34,197,94,.3)"}}>
                <div className="px-4 pt-4 pb-1 flex items-center gap-2">
                  <span className="text-xl">🟢</span>
                  <p className="font-body text-base font-bold text-green-300">{t.sec1Label}</p>
                </div>
                <div className="px-4 pb-4">
                  <LingkaranDalamSegitigaSVG t={t} />
                  <div className="rounded-xl p-4 mt-2 space-y-2 border"
                    style={{background:"rgba(34,197,94,.08)",borderColor:"rgba(34,197,94,.2)"}}>
                    <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                      {t.sec1Desc}<strong className="text-green-300">{t.sec1Bold}</strong>
                      {t.sec1Sub}<strong className="text-yellow-300">{t.sec1Sub2}</strong>{t.sec1Sub3}
                    </p>
                    <BlockMath math="r = \dfrac{L_{\triangle}}{s} \qquad s = \dfrac{a+b+c}{2}" />
                    <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>{t.sec1FormulaNote}</p>
                  </div>
                </div>
              </div>

              {/* Circumcircle */}
              <div className="rounded-2xl overflow-hidden border"
                style={{background:"linear-gradient(135deg,rgba(249,115,22,.1),rgba(251,191,36,.06))",borderColor:"rgba(249,115,22,.3)"}}>
                <div className="px-4 pt-4 pb-1 flex items-center gap-2">
                  <span className="text-xl">🔴</span>
                  <p className="font-body text-base font-bold text-orange-300">{t.sec2Label}</p>
                </div>
                <div className="px-4 pb-4">
                  <LingkaranLuarSegitigaSVG t={t} />
                  <div className="rounded-xl p-4 mt-2 space-y-2 border"
                    style={{background:"rgba(249,115,22,.08)",borderColor:"rgba(249,115,22,.2)"}}>
                    <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                      {t.sec2Desc}<strong className="text-orange-300">{t.sec2Bold}</strong>
                      {t.sec2Sub}<strong className="text-yellow-300">{t.sec2Sub2}</strong>{t.sec2Sub3}
                    </p>
                    <BlockMath math="R = \dfrac{AB \times AC \times BC}{4 \times L_{\triangle}}" />
                    <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>{t.sec2FormulaNote}</p>
                    <div className="rounded-lg p-3 mt-1 border"
                      style={{background:"rgba(251,191,36,.08)",borderColor:"rgba(251,191,36,.25)"}}>
                      <p className={`${isDark ? "text-yellow-200" : "text-yellow-700"} text-xs`}>
                        💡 <strong>{t.sec2TipBold}</strong>{t.sec2TipRest}
                        <InlineMath math={t.sec2TipFormula}/>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CONTOH 1 */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background: isDark ? "rgba(15,23,42,.7)" : "rgba(248,250,252,.95)", borderColor:"rgba(34,197,94,.25)",backdropFilter:"blur(12px)"}}>
            <SH icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400"
              title={t.c1Title}
              gradFrom="rgba(34,197,94,.12)" borderColor="rgba(34,197,94,.3)"/>
            <div className="px-5 pb-5 pt-4 space-y-4">
              <div className="rounded-xl p-4 border"
                style={{background:"rgba(34,197,94,.1)",borderColor:"rgba(34,197,94,.35)"}}>
                <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c1Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.c1Q}<InlineMath math="AC = 5"/>{t.c1Q2}<InlineMath math="BC = 12"/>{t.c1Q3}
                </p>
              </div>
              <div className="rounded-xl p-4 space-y-3 border"
                style={{background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.95)", borderColor:"rgba(100,116,139,.35)"}}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.c1Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c1s1}</strong> {t.c1s1T}</p>
                <BlockMath math="AB = \sqrt{AC^2 + BC^2} = \sqrt{25 + 144} = \sqrt{169} = 13 \,\mathrm{cm}"/>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c1s2}</strong> {t.c1s2T}</p>
                <BlockMath math="L = \tfrac{1}{2} \times AC \times BC = \tfrac{1}{2} \times 5 \times 12 = 30 \,\mathrm{cm}^2"/>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c1s3}</strong> {t.c1s3T}</p>
                <BlockMath math="s = \dfrac{5 + 12 + 13}{2} = 15 \,\mathrm{cm}"/>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c1s4}</strong> {t.c1s4T}</p>
                <BlockMath math="r = \dfrac{L}{s} = \dfrac{30}{15} = 2 \,\mathrm{cm}"/>
                <div className="rounded-lg p-3 border" style={{background:"rgba(34,197,94,.1)",borderColor:"rgba(34,197,94,.35)"}}>
                  <p className="font-body text-sm text-green-300 text-center">{t.c1Result}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 2 */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background: isDark ? "rgba(15,23,42,.7)" : "rgba(248,250,252,.95)", borderColor:"rgba(249,115,22,.25)",backdropFilter:"blur(12px)"}}>
            <SH icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-orange-400"
              title={t.c2Title}
              gradFrom="rgba(249,115,22,.12)" borderColor="rgba(249,115,22,.3)"/>
            <div className="px-5 pb-5 pt-4 space-y-4">
              <div className="rounded-xl p-4 border"
                style={{background:"rgba(249,115,22,.1)",borderColor:"rgba(249,115,22,.35)"}}>
                <p className="text-orange-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c2Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.c2Q}<InlineMath math="AB = 13"/>{t.c2Q2}<InlineMath math="AC = 5"/>{t.c2Q3}<InlineMath math="BC = 12"/>{t.c2Q4}
                </p>
              </div>
              <div className="rounded-xl p-4 space-y-3 border"
                style={{background: isDark ? "rgba(15,23,42,.6)" : "rgba(241,245,249,.95)", borderColor:"rgba(100,116,139,.35)"}}>
                <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.c2Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c2s1}</strong> {t.c2s1T}</p>
                <BlockMath math="L = \tfrac{1}{2} \times AC \times BC = \tfrac{1}{2} \times 5 \times 12 = 30 \,\mathrm{cm}^2"/>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c2s2}</strong> {t.c2s2T}</p>
                <BlockMath math="R = \dfrac{AB \times AC \times BC}{4 \times L} = \dfrac{13 \times 5 \times 12}{4 \times 30}"/>
                <BlockMath math="R = \dfrac{780}{120} = 6{,}5 \,\mathrm{cm}"/>
                <p className={`font-body text-sm ${isDark ? "text-white/60" : "text-gray-500"} text-xs`}>
                  {t.c2Shortcut} <InlineMath math="R = \frac{AB}{2} = \frac{13}{2} = 6{,}5 \,\mathrm{cm}"/> ✓
                </p>
                <div className="rounded-lg p-3 border" style={{background:"rgba(249,115,22,.1)",borderColor:"rgba(249,115,22,.35)"}}>
                  <p className="font-body text-sm text-orange-300 text-center">{t.c2Result}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="rounded-2xl overflow-hidden border"
            style={{background: isDark ? "rgba(15,23,42,.7)" : "rgba(248,250,252,.95)", borderColor:"rgba(168,85,247,.25)",backdropFilter:"blur(12px)"}}>
            <SH icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400"
              title={t.rTitle}
              gradFrom="rgba(168,85,247,.12)" borderColor="rgba(168,85,247,.3)"/>
            <div className="px-5 pb-5 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 border space-y-2"
                  style={{background:"linear-gradient(135deg,rgba(34,197,94,.12),rgba(6,182,212,.06))",borderColor:"rgba(34,197,94,.3)"}}>
                  <p className="text-green-300 text-sm font-bold">{t.rIn}</p>
                  <div className={`${isDark ? "text-white/70" : "text-gray-600"} text-xs space-y-1`}>
                    <p>{t.rInB1}</p>
                    <p>{t.rInB2}</p>
                  </div>
                  <BlockMath math="r = \dfrac{L_\triangle}{s}"/>
                  <p className={`${isDark ? "text-white/40" : "text-gray-500"} text-[10px]`}>{t.rInSub}</p>
                </div>
                <div className="rounded-xl p-4 border space-y-2"
                  style={{background:"linear-gradient(135deg,rgba(249,115,22,.12),rgba(251,191,36,.06))",borderColor:"rgba(249,115,22,.3)"}}>
                  <p className="text-orange-300 text-sm font-bold">{t.rOut}</p>
                  <div className={`${isDark ? "text-white/70" : "text-gray-600"} text-xs space-y-1`}>
                    <p>{t.rOutB1}</p>
                    <p>{t.rOutB2}</p>
                  </div>
                  <BlockMath math="R = \dfrac{AB \cdot AC \cdot BC}{4L_\triangle}"/>
                  <p className={`${isDark ? "text-white/40" : "text-gray-500"} text-[10px]`}>{t.rOutSub}</p>
                </div>
              </div>
              <div className="rounded-xl p-3 border"
                style={{background:"rgba(251,191,36,.08)",borderColor:"rgba(251,191,36,.25)"}}>
                <p className={`font-body text-sm ${isDark ? "text-yellow-200" : "text-yellow-700"}`}>{t.tips}</p>
              </div>
            </div>
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KaitanBangunDatarPage;
