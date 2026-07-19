import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical, Microscope, Joystick } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import SudutPusatProofAnim from "@/components/SudutPusatProofAnim";
import SudutPusatInteraktif from "@/components/SudutPusatInteraktif";

/* ─── Translations ─────────────────────────────────────── */
const translations = {
  id: {
    h1: "SUDUT PUSAT DAN SUDUT KELILING",
    subtitle: "Kelas 8 · Lingkaran · Buku Animasi Matematika",
    backBtn: "← Kembali ke Lingkaran",
    // SVG aria-labels
    svgCentralAria: "Sudut pusat lingkaran",
    svgCompareAria: "Perbandingan sudut pusat dan sudut keliling",
    svgDiameterAria: "Sudut keliling menghadap diameter = 90 derajat",
    // SVG text labels
    svgCentralLabel: "Sudut Pusat ∠AOB = α (titik sudut di pusat O)",
    svgCentralSub: "menghadap busur AB",
    svgAlphaPusat: "α (pusat)",
    svgBetaKeliling: "β (keliling)",
    svgCompareNote: "∠AOB (pusat) = 2 × ∠ACB (keliling)",
    svgDiamNote: "AB = diameter → ∠ACB = 90°",
    // Intro section
    introTitle: "📡 Sudut dari Pusat vs Tepi Lingkaran",
    introP: "Bayangkan kamu nonton konser di sebuah arena melingkar. Orang yang berdiri di tengah panggung (pusat) punya pandangan 360°. Tapi orang yang duduk di pinggir (keliling)? Pandangannya hanya setengah dari orang di pusat! Itulah inti dari hubungan sudut pusat dan sudut keliling.",
    introPusat: "tengah panggung (pusat)",
    introKeliling: "pinggir (keliling)",
    centralLabel: "⭐ SUDUT PUSAT",
    centralDesc: "Titik sudutnya di pusat O. Kedua kakinya adalah jari-jari.",
    centralDescBold: "pusat O",
    inscribedLabel: "🔵 SUDUT KELILING",
    inscribedDesc: "Titik sudutnya di tepi lingkaran. Kedua kakinya adalah tali busur.",
    inscribedDescBold: "tepi lingkaran",
    // Teorema section
    teoremaTitle: "📐 Teorema Sudut Pusat dan Sudut Keliling",
    teoremasummaryTitle: "🎯 Ringkasan Intisari",
    teoremaSummaryP: "Ada dua teorema kunci yang harus kamu hafal untuk menguasai topik ini!",
    t1Title: "📌 Teorema 1: Hubungan Sudut Pusat & Sudut Keliling",
    t1P: "Jika sudut pusat dan sudut keliling menghadap busur yang sama, maka:",
    t1Bold: "menghadap busur yang sama",
    t1FormulaLabel: "Sudut Pusat = 2 × Sudut Keliling",
    t2Title: "📌 Teorema 2: Sudut Keliling Menghadap Diameter",
    t2P: "Jika sudut keliling menghadap busur setengah lingkaran (diameternya), maka:",
    t2Note: "Ini adalah teorema Thales yang terkenal!",
    t3Title: "📌 Teorema 3: Sudut Keliling Menghadap Busur yang Sama",
    t3P: "Semua sudut keliling yang menghadap busur yang sama memiliki besar yang sama:",
    // Animasi sections
    anim1Title: "🔬 Animasi 1 — Mengapa Sudut Pusat = 2× Sudut Keliling?",
    anim1Desc: "Ikuti langkah demi langkah pembuktian geometri mengapa sudut pusat selalu tepat 2 kali sudut keliling. Tekan Selanjutnya untuk melanjutkan setiap tahap.",
    anim1Bold1: "langkah demi langkah",
    anim1Bold2: "Selanjutnya",
    anim2Title: "🕹️ Animasi 2 — Eksplorasi Interaktif",
    anim2Desc: "Geser slider untuk mengubah besar busur (sudut pusat), dan seret titik C ke sembarang posisi di busur besar — lihat bagaimana sudut keliling selalu tepat setengahnya!",
    anim2Bold1: "Geser slider",
    anim2Bold2: "seret titik C",
    // Contoh 1
    c1Title: "✏️ Contoh 1 — Mencari Sudut Keliling (Mudah)",
    c1Level: "🟢 Tingkat: Mudah",
    c1Q: "Diketahui sudut pusat menghadap busur AB yang sama. Tentukan besar",
    c1Q2: "!",
    c1Sol: "📋 Pembahasan",
    c1Method: "Gunakan teorema: Sudut keliling = ½ × Sudut pusat (menghadap busur yang sama)",
    c1Check: "✅ Besar",
    c1Check2: ".",
    // Contoh 2
    c2Title: "✏️ Contoh 2 — Sudut Gabungan (Sedang)",
    c2Level: "🟡 Tingkat: Sedang",
    c2Q: "Titik A, B, C, D berada pada lingkaran dengan pusat O. Jika",
    c2Q2: "dan",
    c2Q3: ", tentukan besar sudut pusat",
    c2Q4: "!",
    c2Sol: "📋 Pembahasan",
    c2P: "∠ABD dan ∠ACD keduanya adalah sudut keliling yang menghadap busur AD yang sama. Karena nilainya sama (35° = 35°), ini membuktikan teorema 3 bahwa sudut keliling yang menghadap busur sama adalah sama besar.",
    c2Step: "Sudut pusat = 2 × sudut keliling:",
    c2Check: "✅ Besar",
    c2Check2: ".",
    // Contoh 3
    c3Title: "✏️ Contoh 3 — Segiempat Siklis (Sulit)",
    c3Level: "🔴 Tingkat: Sulit",
    c3Q: "Segiempat ABCD bertulis dalam lingkaran (segiempat siklis). Jika",
    c3Q2: "dan",
    c3Q3: ", tentukan nilai x dan besar",
    c3Q4: "serta",
    c3Q5: "!",
    c3Sol: "📋 Pembahasan",
    c3Cyclic: "Sifat segiempat siklis: sudut yang berhadapan saling berpelurus (jumlahnya 180°).",
    c3AngleLabel: "Besar sudut:",
    c3Check: "Cek:",
    c3Result: "✅ x = 35°,",
    c3Result2: ",",
    c3Result3: ".",
    // Rangkuman
    rangkTitle: "📌 Rangkuman Sub-Bab",
    rT1: "Sudut Pusat (titik O)",
    rT1rest: "= 2 × Sudut Keliling (titik di lingkaran) jika menghadap busur yang sama.",
    rT2: "Teorema Thales:",
    rT2rest: "Sudut keliling yang menghadap diameter = 90°.",
    rT3: "Teorema 3:",
    rT3rest: "Semua sudut keliling menghadap busur sama → besar sama.",
    rSiklis: "Segiempat Siklis:",
    rSiklisRest: "Sudut berhadapan saling berpelurus (jumlah = 180°).",
    tips: "🚀 Tips Astronot: Teorema Thales digunakan oleh insinyur untuk memastikan antenna receiver radio berbentuk setengah lingkaran — sudut penerimaannya selalu tepat 90° dari pemancar!",
  },
  en: {
    h1: "CENTRAL ANGLE & INSCRIBED ANGLE",
    subtitle: "Grade 8 · Circle · Math Animation Book",
    backBtn: "← Back to Circle",
    svgCentralAria: "Central angle of a circle",
    svgCompareAria: "Comparison of central and inscribed angles",
    svgDiameterAria: "Inscribed angle facing diameter = 90 degrees",
    svgCentralLabel: "Central Angle ∠AOB = α (vertex at center O)",
    svgCentralSub: "facing arc AB",
    svgAlphaPusat: "α (central)",
    svgBetaKeliling: "β (inscribed)",
    svgCompareNote: "∠AOB (central) = 2 × ∠ACB (inscribed)",
    svgDiamNote: "AB = diameter → ∠ACB = 90°",
    introTitle: "📡 Angle from Center vs Circle Edge",
    introP: "Imagine you're watching a concert in a circular arena. Someone standing at the center of the stage has a 360° view. But someone sitting at the edge? Their view is only half of the center person's! That's the essence of the relationship between central and inscribed angles.",
    introPusat: "center of the stage (center)",
    introKeliling: "edge (circumference)",
    centralLabel: "⭐ CENTRAL ANGLE",
    centralDesc: "Its vertex is at center O. Its two sides are radii.",
    centralDescBold: "center O",
    inscribedLabel: "🔵 INSCRIBED ANGLE",
    inscribedDesc: "Its vertex is on the circle edge. Its two sides are chords.",
    inscribedDescBold: "circle edge",
    teoremaTitle: "📐 Central Angle and Inscribed Angle Theorems",
    teoremasummaryTitle: "🎯 Key Summary",
    teoremaSummaryP: "There are two key theorems you must master for this topic!",
    t1Title: "📌 Theorem 1: Central Angle & Inscribed Angle Relationship",
    t1P: "If a central angle and an inscribed angle face the same arc, then:",
    t1Bold: "face the same arc",
    t1FormulaLabel: "Central Angle = 2 × Inscribed Angle",
    t2Title: "📌 Theorem 2: Inscribed Angle Facing a Diameter",
    t2P: "If an inscribed angle faces a semicircle arc (the diameter), then:",
    t2Note: "This is the famous Thales' theorem!",
    t3Title: "📌 Theorem 3: Inscribed Angles Facing the Same Arc",
    t3P: "All inscribed angles facing the same arc have equal measures:",
    anim1Title: "🔬 Animation 1 — Why is Central Angle = 2× Inscribed Angle?",
    anim1Desc: "Follow step by step the geometric proof of why the central angle is always exactly 2 times the inscribed angle. Press Next to advance each stage.",
    anim1Bold1: "step by step",
    anim1Bold2: "Next",
    anim2Title: "🕹️ Animation 2 — Interactive Exploration",
    anim2Desc: "Slide the slider to change the arc size (central angle), and drag point C to any position on the major arc — see how the inscribed angle is always exactly half!",
    anim2Bold1: "Slide the slider",
    anim2Bold2: "drag point C",
    c1Title: "✏️ Example 1 — Finding the Inscribed Angle (Easy)",
    c1Level: "🟢 Level: Easy",
    c1Q: "Given central angle facing the same arc AB. Find",
    c1Q2: "!",
    c1Sol: "📋 Solution",
    c1Method: "Apply the theorem: Inscribed angle = ½ × Central angle (facing the same arc)",
    c1Check: "✅",
    c1Check2: ".",
    c2Title: "✏️ Example 2 — Combined Angles (Medium)",
    c2Level: "🟡 Level: Medium",
    c2Q: "Points A, B, C, D lie on a circle with center O. If",
    c2Q2: "and",
    c2Q3: ", find the central angle",
    c2Q4: "!",
    c2Sol: "📋 Solution",
    c2P: "Both ∠ABD and ∠ACD are inscribed angles facing the same arc AD. Since they are equal (35° = 35°), this confirms Theorem 3 that inscribed angles facing the same arc are equal.",
    c2Step: "Central angle = 2 × inscribed angle:",
    c2Check: "✅",
    c2Check2: ".",
    c3Title: "✏️ Example 3 — Cyclic Quadrilateral (Hard)",
    c3Level: "🔴 Level: Hard",
    c3Q: "Quadrilateral ABCD is inscribed in a circle (cyclic quadrilateral). If",
    c3Q2: "and",
    c3Q3: ", find x and the values of",
    c3Q4: "and",
    c3Q5: "!",
    c3Sol: "📋 Solution",
    c3Cyclic: "Property of cyclic quadrilateral: opposite angles are supplementary (sum = 180°).",
    c3AngleLabel: "Angle values:",
    c3Check: "Check:",
    c3Result: "✅ x = 35°,",
    c3Result2: ",",
    c3Result3: ".",
    rangkTitle: "📌 Chapter Summary",
    rT1: "Central Angle (point O)",
    rT1rest: "= 2 × Inscribed Angle (point on circle) if facing the same arc.",
    rT2: "Thales' Theorem:",
    rT2rest: "Inscribed angle facing a diameter = 90°.",
    rT3: "Theorem 3:",
    rT3rest: "All inscribed angles facing the same arc → equal measure.",
    rSiklis: "Cyclic Quadrilateral:",
    rSiklisRest: "Opposite angles are supplementary (sum = 180°).",
    tips: "🚀 Astronaut Tip: Thales' theorem is used by engineers to ensure semicircular radio antenna receivers — the reception angle is always exactly 90° from the transmitter!",
  },
  ja: {
    h1: "中心角と円周角",
    subtitle: "中学2年 · 円 · 数学アニメーション",
    backBtn: "← 円に戻る",
    svgCentralAria: "円の中心角",
    svgCompareAria: "中心角と円周角の比較",
    svgDiameterAria: "直径に対する円周角 = 90度",
    svgCentralLabel: "中心角 ∠AOB = α（頂点は中心O）",
    svgCentralSub: "弧ABに対する",
    svgAlphaPusat: "α（中心角）",
    svgBetaKeliling: "β（円周角）",
    svgCompareNote: "∠AOB（中心角）= 2 × ∠ACB（円周角）",
    svgDiamNote: "AB = 直径 → ∠ACB = 90°",
    introTitle: "📡 中心からの角度と円の端からの角度",
    introP: "円形のアリーナでコンサートを観ていると想像してください。ステージの中央に立つ人は360°の視野を持っています。でも端（円周）に座る人は？その視野は中央の人の半分だけです！これが中心角と円周角の関係の本質です。",
    introPusat: "ステージの中央（中心）",
    introKeliling: "端（円周）",
    centralLabel: "⭐ 中心角",
    centralDesc: "頂点は中心Oにあります。二辺は半径です。",
    centralDescBold: "中心O",
    inscribedLabel: "🔵 円周角",
    inscribedDesc: "頂点は円周上にあります。二辺は弦です。",
    inscribedDescBold: "円周上",
    teoremaTitle: "📐 中心角と円周角の定理",
    teoremasummaryTitle: "🎯 重要まとめ",
    teoremaSummaryP: "このトピックをマスターするために覚えるべき2つの重要な定理があります！",
    t1Title: "📌 定理1：中心角と円周角の関係",
    t1P: "中心角と円周角が同じ弧に向き合う場合：",
    t1Bold: "同じ弧に向き合う",
    t1FormulaLabel: "中心角 = 2 × 円周角",
    t2Title: "📌 定理2：直径に対する円周角",
    t2P: "円周角が半円弧（直径）に向き合う場合：",
    t2Note: "これはタレスの定理として有名です！",
    t3Title: "📌 定理3：同じ弧に対する円周角",
    t3P: "同じ弧に向き合うすべての円周角は等しい：",
    anim1Title: "🔬 アニメーション1 — 中心角 = 2× 円周角はなぜ？",
    anim1Desc: "中心角がなぜ常に円周角の2倍になるかを、幾何学的証明を段階的に追ってください。次へを押して各段階を進めてください。",
    anim1Bold1: "段階的に",
    anim1Bold2: "次へ",
    anim2Title: "🕹️ アニメーション2 — インタラクティブ探索",
    anim2Desc: "スライダーを動かして弧の大きさ（中心角）を変え、点Cを大きな弧の任意の場所にドラッグしてください — 円周角が常にちょうど半分になることを確認しましょう！",
    anim2Bold1: "スライダーを動かして",
    anim2Bold2: "点Cをドラッグ",
    c1Title: "✏️ 例題1 — 円周角を求める（基本）",
    c1Level: "🟢 レベル：基本",
    c1Q: "同じ弧ABに向き合う中心角が与えられています。",
    c1Q2: "を求めなさい！",
    c1Sol: "📋 解説",
    c1Method: "定理を使う：円周角 = ½ × 中心角（同じ弧に向き合う場合）",
    c1Check: "✅",
    c1Check2: "。",
    c2Title: "✏️ 例題2 — 複合角（標準）",
    c2Level: "🟡 レベル：標準",
    c2Q: "点A、B、C、Dは中心Oを持つ円上にあります。",
    c2Q2: "かつ",
    c2Q3: "のとき、中心角",
    c2Q4: "を求めなさい！",
    c2Sol: "📋 解説",
    c2P: "∠ABDと∠ACDはどちらも同じ弧ADに向き合う円周角です。値が等しい（35° = 35°）ことで、同じ弧に対する円周角は等しいという定理3が確認されます。",
    c2Step: "中心角 = 2 × 円周角：",
    c2Check: "✅",
    c2Check2: "。",
    c3Title: "✏️ 例題3 — 円に内接する四角形（発展）",
    c3Level: "🔴 レベル：発展",
    c3Q: "四角形ABCDが円に内接しています（円に内接する四角形）。",
    c3Q2: "かつ",
    c3Q3: "のとき、xの値と",
    c3Q4: "および",
    c3Q5: "を求めなさい！",
    c3Sol: "📋 解説",
    c3Cyclic: "円に内接する四角形の性質：対角の和は180°（対角は補角）。",
    c3AngleLabel: "各角の値：",
    c3Check: "確認：",
    c3Result: "✅ x = 35°、",
    c3Result2: "、",
    c3Result3: "。",
    rangkTitle: "📌 まとめ",
    rT1: "中心角（点O）",
    rT1rest: "= 2 × 円周角（円周上の点）、同じ弧に向き合う場合。",
    rT2: "タレスの定理：",
    rT2rest: "直径に向き合う円周角 = 90°。",
    rT3: "定理3：",
    rT3rest: "同じ弧に向き合うすべての円周角 → 等しい。",
    rSiklis: "円に内接する四角形：",
    rSiklisRest: "対角は補角（和 = 180°）。",
    tips: "🚀 宇宙人のヒント：タレスの定理は、半円形の無線アンテナレシーバーが常に送信機から90°の受信角を持つことを保証するためにエンジニアに使用されています！",
  },
} as const;
type T = typeof translations.id;

/* ─── SVG Components ─────────────────────────────────────── */
const SudutPusatSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto my-2" aria-label={t.svgCentralAria}>
    <defs>
      <style>{`
        @keyframes arcPulse{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #f59e0b);}50%{stroke-opacity:0.3;filter:none;}}
        .ap{animation:arcPulse 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="140" cy="110" r="85" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="140" cy="110" r="4" fill="#f59e0b"/>
    <text x="145" y="107" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">O</text>
    <line x1="140" y1="110" x2="225" y2="110" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="140" y1="110" x2="140" y2="25" stroke="#22c55e" strokeWidth="2.5"/>
    <path d="M225,110 A85,85 0 0,0 140,25" fill="none" stroke="#f59e0b" strokeWidth="4" className="ap"/>
    <path d="M140,110 m30,0 a30,30 0 0,0 -30,-30" fill="none" stroke="#fbbf24" strokeWidth="2"/>
    <text x="175" y="98" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">α</text>
    <circle cx="225" cy="110" r="5" fill="#22c55e"/>
    <circle cx="140" cy="25" r="5" fill="#22c55e"/>
    <text x="230" y="115" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="143" y="20" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <rect x="20" y="175" width="240" height="36" rx="6" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1"/>
    <text x="140" y="192" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">{t.svgCentralLabel}</text>
    <text x="140" y="206" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svgCentralSub}</text>
  </svg>
);

const SudutKelilingVsPusatSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 300 250" className="w-full max-w-sm mx-auto my-2" aria-label={t.svgCompareAria}>
    <defs>
      <style>{`
        @keyframes fadeToggle{0%,45%{opacity:1;}50%,95%{opacity:0.2;}100%{opacity:1;}}
        .ft1{animation:fadeToggle 3s ease-in-out infinite;}
        .ft2{animation:fadeToggle 3s ease-in-out infinite 1.5s;}
      `}</style>
    </defs>
    <circle cx="150" cy="120" r="90" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <circle cx="150" cy="120" r="4" fill="#f59e0b"/>
    <text x="155" y="117" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <circle cx="240" cy="120" r="5" fill="#22c55e"/>
    <text x="246" y="125" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <circle cx="150" cy="30" r="5" fill="#22c55e"/>
    <text x="155" y="27" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <circle cx="80" cy="185" r="5" fill="#a855f7"/>
    <text x="68" y="200" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <line x1="150" y1="120" x2="240" y2="120" stroke="#f59e0b" strokeWidth="2.5" className="ft1"/>
    <line x1="150" y1="120" x2="150" y2="30" stroke="#f59e0b" strokeWidth="2.5" className="ft1"/>
    <line x1="80" y1="185" x2="240" y2="120" stroke="#a855f7" strokeWidth="2.5" className="ft2"/>
    <line x1="80" y1="185" x2="150" y2="30" stroke="#a855f7" strokeWidth="2.5" className="ft2"/>
    <path d="M240,120 A90,90 0 0,0 150,30" fill="none" stroke="#06b6d4" strokeWidth="3"/>
    <text x="220" y="62" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" className="ft1">{t.svgAlphaPusat}</text>
    <text x="100" y="175" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold" className="ft2">{t.svgBetaKeliling}</text>
    <text x="150" y="235" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svgCompareNote}</text>
    <text x="150" y="248" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">α = 2β  →  β = α/2</text>
  </svg>
);

const SudutDiameterSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-2" aria-label={t.svgDiameterAria}>
    <defs>
      <style>{`@keyframes rightAnglePulse{0%,100%{stroke:#fff;opacity:1;}50%{stroke:#fbbf24;opacity:0.6;}}.rap{animation:rightAnglePulse 2s ease-in-out infinite;}`}</style>
    </defs>
    <circle cx="130" cy="100" r="80" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <line x1="50" y1="100" x2="210" y2="100" stroke="#22c55e" strokeWidth="2.5"/>
    <circle cx="50" cy="100" r="5" fill="#22c55e"/>
    <circle cx="210" cy="100" r="5" fill="#22c55e"/>
    <circle cx="130" cy="100" r="4" fill="#f59e0b"/>
    <text x="135" y="97" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="38" y="97" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="215" y="97" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <circle cx="130" cy="20" r="5" fill="#a855f7"/>
    <text x="135" y="18" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <line x1="50" y1="100" x2="130" y2="20" stroke="#a855f7" strokeWidth="2.5"/>
    <line x1="210" y1="100" x2="130" y2="20" stroke="#a855f7" strokeWidth="2.5"/>
    <polyline points="130,20 118,20 118,30 130,30" fill="none" className="rap" strokeWidth="1.8"/>
    <text x="90" y="65" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">90°</text>
    <text x="130" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svgDiamNote}</text>
  </svg>
);

/* ─── Main Page ─────────────────────────────────────── */
const SudutPusatKelilingPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const { isDark } = useTheme();

  const SectionHeader = ({ icon, iconColor, title }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <span className={iconColor}>{icon}</span>
      <span className={`font-body font-semibold ${isDark ? "text-white" : "text-gray-800"} ml-3`}>{title}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.h1}</h1>
        <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center mb-6 font-body`}>{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introTitle} />
            <div className="px-5 pb-5 space-y-4">
              <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} leading-relaxed`}>
                {t.introP.split(t.introPusat)[0]}
                <strong className="text-yellow-300">{t.introPusat}</strong>
                {t.introP.split(t.introPusat)[1]?.split(t.introKeliling)[0]}
                <strong className="text-purple-300">{t.introKeliling}</strong>
                {t.introP.split(t.introPusat)[1]?.split(t.introKeliling)[1]}
              </p>
              <SudutPusatSVG t={t} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`${isDark ? "bg-yellow-900/30" : "bg-yellow-50"} border border-yellow-500/30 rounded-lg p-3`}>
                  <p className="font-body text-xs font-bold text-yellow-300">{t.centralLabel}</p>
                  <p className={`font-body text-xs ${isDark ? "text-white/70" : "text-gray-700"} mt-1`}>
                    {t.centralDesc.split(t.centralDescBold)[0]}
                    <strong>{t.centralDescBold}</strong>
                    {t.centralDesc.split(t.centralDescBold)[1]}
                  </p>
                </div>
                <div className={`${isDark ? "bg-purple-900/30" : "bg-purple-50"} border border-purple-500/30 rounded-lg p-3`}>
                  <p className="font-body text-xs font-bold text-purple-300">{t.inscribedLabel}</p>
                  <p className={`font-body text-xs ${isDark ? "text-white/70" : "text-gray-700"} mt-1`}>
                    {t.inscribedDesc.split(t.inscribedDescBold)[0]}
                    <strong>{t.inscribedDescBold}</strong>
                    {t.inscribedDesc.split(t.inscribedDescBold)[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TEOREMA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.teoremaTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.teoremasummaryTitle}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.teoremaSummaryP}</p>
              </div>

              <SudutKelilingVsPusatSVG t={t} />

              <div className={`${isDark ? "bg-yellow-900/30" : "bg-yellow-50"} border border-yellow-500/40 rounded-xl p-4`}>
                <p className="font-body text-sm font-bold text-yellow-300 mb-2">{t.t1Title}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} mb-2`}>
                  {t.t1P.split(t.t1Bold)[0]}
                  <strong className="text-cyan-300">{t.t1Bold}</strong>
                  {t.t1P.split(t.t1Bold)[1]}
                </p>
                <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-gray-500"} mb-1 font-mono`}>{t.t1FormulaLabel}:</p>
                <BlockMath math="\angle AOB = 2 \times \angle ACB" />
              </div>

              <SudutDiameterSVG t={t} />

              <div className={`${isDark ? "bg-green-900/30" : "bg-green-50"} border border-green-500/40 rounded-xl p-4`}>
                <p className="font-body text-sm font-bold text-green-300 mb-2">{t.t2Title}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} mb-2`}>{t.t2P}</p>
                <BlockMath math="\angle ACB = 90°" />
                <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.t2Note}</p>
              </div>

              <div className={`${isDark ? "bg-purple-900/30" : "bg-purple-50"} border border-purple-500/40 rounded-xl p-4`}>
                <p className="font-body text-sm font-bold text-purple-300 mb-2">{t.t3Title}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} mb-2`}>{t.t3P}</p>
                <BlockMath math="\angle ACB = \angle ADB = \angle AEB" />
              </div>
            </div>
          </div>

          {/* ANIMASI 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              icon={<Microscope className="w-5 h-5" />}
              iconColor="text-cyan-400"
              title={t.anim1Title}
            />
            <div className="px-4 pb-4">
              <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-lg px-4 py-2.5 mb-3">
                <p className={`font-body text-xs ${isDark ? "text-cyan-200/80" : "text-cyan-700"} leading-relaxed`}>
                  <strong className="text-cyan-300">{t.anim1Bold1}</strong>
                  {t.anim1Desc.split(t.anim1Bold1)[1]?.split(t.anim1Bold2)[0]}
                  <strong className={isDark ? "text-white/80" : "text-gray-700"}>{t.anim1Bold2}</strong>
                  {t.anim1Desc.split(t.anim1Bold2)[1]}
                </p>
              </div>
              <SudutPusatProofAnim />
            </div>
          </div>

          {/* ANIMASI 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              icon={<Joystick className="w-5 h-5" />}
              iconColor="text-purple-400"
              title={t.anim2Title}
            />
            <div className="px-4 pb-4">
              <div className="bg-purple-500/8 border border-purple-500/20 rounded-lg px-4 py-2.5 mb-3">
                <p className={`font-body text-xs ${isDark ? "text-purple-200/80" : "text-purple-700"} leading-relaxed`}>
                  <strong className="text-amber-300">{t.anim2Bold1}</strong>
                  {t.anim2Desc.split(t.anim2Bold1)[1]?.split(t.anim2Bold2)[0]}
                  <strong className="text-purple-300">{t.anim2Bold2}</strong>
                  {t.anim2Desc.split(t.anim2Bold2)[1]}
                </p>
              </div>
              <SudutPusatInteraktif />
            </div>
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title={t.c1Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className={`${isDark ? "bg-green-900/30" : "bg-green-50"} border border-green-500/40 rounded-xl p-4`}>
                <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c1Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.c1Q} <InlineMath math="\angle AOB = 110°"/>. {t.c1Q2.replace("!", "")} <InlineMath math="\angle ACB"/>{t.c1Q2.includes("!") ? "!" : ""}
                </p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c1Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c1Method}</p>
                <BlockMath math="\angle ACB = \frac{1}{2} \times \angle AOB" />
                <BlockMath math="\angle ACB = \frac{1}{2} \times 110° = 55°" />
                <div className={`${isDark ? "bg-green-900/30" : "bg-green-50"} border border-green-500/40 rounded-lg p-3`}>
                  <p className="font-body text-sm text-green-300 text-center">{t.c1Check} <InlineMath math="\angle ACB = \textbf{55°}"/>{t.c1Check2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title={t.c2Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className={`${isDark ? "bg-yellow-900/30" : "bg-yellow-50"} border border-yellow-500/40 rounded-xl p-4`}>
                <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c2Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.c2Q} <InlineMath math="\angle ABD = 35°"/> {t.c2Q2} <InlineMath math="\angle ACD = 35°"/>{t.c2Q3} <InlineMath math="\angle AOD"/>{t.c2Q4}
                </p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c2Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c2P}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c2Step}</p>
                <BlockMath math="\angle AOD = 2 \times \angle ABD = 2 \times 35° = 70°" />
                <div className={`${isDark ? "bg-yellow-900/30" : "bg-yellow-50"} border border-yellow-500/40 rounded-lg p-3`}>
                  <p className={`font-body text-sm ${isDark ? "text-yellow-200" : "text-yellow-700"} text-center`}>{t.c2Check} <InlineMath math="\angle AOD = \textbf{70°}"/>{t.c2Check2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.c3Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className={`${isDark ? "bg-red-900/30" : "bg-red-50"} border border-red-500/40 rounded-xl p-4`}>
                <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c3Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.c3Q} <InlineMath math="\angle A = 3x + 10°"/> {t.c3Q2} <InlineMath math="\angle C = 2x - 5°"/>{t.c3Q3} <InlineMath math="\angle A"/> {t.c3Q4} <InlineMath math="\angle C"/>{t.c3Q5}
                </p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c3Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c3Cyclic}</p>
                <BlockMath math="\angle A + \angle C = 180°" />
                <BlockMath math="(3x + 10°) + (2x - 5°) = 180°" />
                <BlockMath math="5x + 5° = 180°" />
                <BlockMath math="5x = 175° \Rightarrow x = 35°" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c3AngleLabel}</p>
                <BlockMath math="\angle A = 3(35°) + 10° = 115°" />
                <BlockMath math="\angle C = 2(35°) - 5° = 65°" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c3Check} <InlineMath math="115° + 65° = 180° ✓"/></p>
                <div className={`${isDark ? "bg-red-900/30" : "bg-red-50"} border border-red-500/40 rounded-lg p-3`}>
                  <p className={`font-body text-sm ${isDark ? "text-red-200" : "text-red-700"} text-center`}>
                    {t.c3Result} <InlineMath math="\angle A = \textbf{115°}"/>{t.c3Result2} <InlineMath math="\angle C = \textbf{65°}"/>{t.c3Result3}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.rangkTitle} />
            <div className="px-5 pb-5 space-y-3">
              <div className={`${isDark ? "bg-violet-900/30" : "bg-violet-50"} border border-violet-500/30 rounded-xl p-4 space-y-2`}>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• <strong className="text-yellow-500">{t.rT1}</strong> {t.rT1rest}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• <strong className="text-green-600">{t.rT2}</strong> {t.rT2rest}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• <strong className="text-purple-600">{t.rT3}</strong> {t.rT3rest}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• <strong className="text-cyan-600">{t.rSiklis}</strong> {t.rSiklisRest}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
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

export default SudutPusatKelilingPage;
