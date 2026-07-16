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
    title: "PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN",
    subtitle: "Kelas 8 · Garis Singgung Lingkaran · Materi Matematika",
    back: "← Kembali ke Garis Singgung Lingkaran",
    sec_intro: "🌟 Garis yang Hanya Menyentuh Sekali",
    sec_definisi: "📐 Definisi Garis Singgung Lingkaran",
    sec_sifat: "🔬 Sifat-Sifat Garis Singgung Lingkaran",
    sec_contoh1: "✏️ Contoh 1 — Identifikasi Garis Singgung (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Sifat Dua Garis Singgung dari Titik Luar (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — Segitiga dan Garis Singgung (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    intro_p: "Pernahkah kamu melihat roda sepeda yang menyentuh tanah? Tanah adalah garis singgung bagi roda — menyentuh tepat di satu titik, tidak menembus ke dalam! Konsep inilah yang kita pelajari: sebuah garis yang hanya menyentuh lingkaran di tepat satu titik, lalu pergi lagi.",
    intro_bold1: "garis singgung",
    intro_bold2: "tepat satu titik",
    intro_tip: "Ada tiga kemungkinan posisi garis terhadap lingkaran: tidak berpotongan (0 titik), singgung (1 titik), atau memotong/sekans (2 titik). Yang kita fokuskan adalah yang tengah —",
    intro_tip_bold: "singgung",
    def_summary: "adalah garis lurus yang memotong lingkaran di tepat satu titik. Titik pertemuan itu disebut titik singgung (T). Di titik ini, jari-jari lingkaran dan garis singgung selalu saling tegak lurus (90°).",
    def_bold: "Garis singgung lingkaran",
    term_O: "Pusat lingkaran",
    term_T: "Titik singgung",
    term_r: "Jari-jari lingkaran",
    term_label: "📋 Istilah-Istilah Penting",
    intisari: "🎯 Ringkasan Intisari",
    sifat1_title: "Tegak Lurus terhadap Jari-jari",
    sifat1_desc: "Di titik singgung T, jari-jari OT selalu tegak lurus (⊥) dengan garis singgung. Artinya sudut OTl = 90°.",
    sifat2_title: "Dua Garis Singgung dari Satu Titik Luar",
    sifat2_desc: "Dari titik P di luar lingkaran, selalu bisa ditarik tepat dua garis singgung ke lingkaran.",
    sifat3_title: "Panjang Garis Singgung Sama",
    sifat3_desc: "Kedua garis singgung dari titik luar yang sama selalu memiliki panjang yang sama (simetri).",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1_problem: "Lingkaran berpusat di O dengan jari-jari 5 cm. Garis menyentuh lingkaran di titik T. Jika OT = 5 cm, apakah garis tersebut adalah garis singgung lingkaran? Berapa besar sudut antara OT dan garis tersebut?",
    c1_step1: "Cek: OT = jari-jari = 5 cm → T adalah titik pada lingkaran ✓",
    c1_step2: "Jika garis hanya menyentuh di titik T, maka berdasarkan sifat garis singgung:",
    c1_ans: "✅ Ya, garis tersebut adalah garis singgung. Sudut antara OT dan garis adalah 90° (tegak lurus).",
    c2_problem: "Dari titik P di luar lingkaran O, ditarik dua garis singgung yang menyinggung di titik A dan B. Jika PA = 3x − 2 cm dan PB = x + 6 cm, tentukan panjang PA!",
    c2_step1: "Gunakan sifat: dua garis singgung dari titik luar yang sama mempunyai panjang sama.",
    c2_ans: "✅ Panjang PA = PB = 10 cm.",
    c3_problem: "Segitiga ABC mempunyai lingkaran dalam yang menyinggung sisi AB di P, sisi BC di Q, dan sisi AC di R. Diketahui AB = 10 cm, BC = 8 cm, AC = 7 cm. Tentukan panjang AP!",
    c3_let: "Misalkan: AP = AR = x, BP = BQ = y, CQ = CR = z.",
    c3_from: "Dari panjang sisi-sisi segitiga:",
    c3_sum: "Jumlahkan ketiga persamaan:",
    c3_find: "Untuk mencari x: kurangkan persamaan 2 dari jumlah total:",
    c3_ans: "✅ Panjang AP = 4,5 cm.",
    sum1: "• menyentuh lingkaran di tepat 1 titik (titik singgung T).",
    sum2: "• Di titik singgung, jari-jari OT ⊥ garis singgung (sudut 90°).",
    sum3: "• Dari titik luar P, ada dua garis singgung dengan panjang sama:",
    sum_label1: "Garis singgung",
    sum_label2: "sudut 90°",
    tip_text: "Prinsip \"garis singgung tegak lurus jari-jari\" digunakan dalam desain roda gigi mesin dan orbit satelit — orbit lingkar selalu tegak lurus terhadap gaya gravitasi (jari-jari)!",
    tip_label: "🚀 Tips Astronot:",
    svg_tangent: "Garis Singgung (1 titik)",
    svg_secant: "Garis Potong (2 titik)",
    svg_no: "Tidak memotong",
    svg_pts0: "(0 titik potong)",
    svg_gsing: "Garis Singgung",
    svg_pts1: "(1 titik singgung)",
    svg_potong: "Garis Potong/Sekans",
    svg_pts2: "(2 titik potong)",
  },
  en: {
    title: "DEFINITION AND PROPERTIES OF CIRCLE TANGENT LINES",
    subtitle: "Grade 8 · Circle Tangent Lines · Math Book",
    back: "← Back to Circle Tangent Lines",
    sec_intro: "🌟 The Line That Touches Only Once",
    sec_definisi: "📐 Definition of a Circle Tangent Line",
    sec_sifat: "🔬 Properties of Circle Tangent Lines",
    sec_contoh1: "✏️ Example 1 — Identifying a Tangent Line (Easy)",
    sec_contoh2: "✏️ Example 2 — Two Tangents from an External Point (Medium)",
    sec_contoh3: "✏️ Example 3 — Triangle and Tangent Lines (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    intro_p: "Have you ever seen a bicycle wheel touching the ground? The ground acts as the tangent line to the wheel — it touches at exactly one point without going through! This is the concept we study: a line that only touches a circle at exactly one point, then moves away.",
    intro_bold1: "tangent line",
    intro_bold2: "exactly one point",
    intro_tip: "There are three possible positions of a line with respect to a circle: no intersection (0 points), tangent (1 point), or secant (2 points). We focus on the middle one —",
    intro_tip_bold: "tangent",
    def_summary: "is a straight line that intersects a circle at exactly one point. That meeting point is called the point of tangency (T). At this point, the radius and the tangent line are always perpendicular (90°).",
    def_bold: "A circle tangent line",
    term_O: "Center of circle",
    term_T: "Point of tangency",
    term_r: "Radius of circle",
    term_label: "📋 Key Terms",
    intisari: "🎯 Key Summary",
    sifat1_title: "Perpendicular to the Radius",
    sifat1_desc: "At the point of tangency T, the radius OT is always perpendicular (⊥) to the tangent line. So the angle OTl = 90°.",
    sifat2_title: "Two Tangents from One External Point",
    sifat2_desc: "From an external point P, exactly two tangent lines can always be drawn to the circle.",
    sifat3_title: "Equal Tangent Lengths",
    sifat3_desc: "Both tangent lines from the same external point always have equal length (symmetry).",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1_problem: "A circle centered at O has radius 5 cm. A line touches the circle at point T. If OT = 5 cm, is this line a tangent to the circle? What is the angle between OT and the line?",
    c1_step1: "Check: OT = radius = 5 cm → T is a point on the circle ✓",
    c1_step2: "If the line touches only at T, then by the tangent property:",
    c1_ans: "✅ Yes, the line is a tangent. The angle between OT and the line is 90° (perpendicular).",
    c2_problem: "From external point P, two tangent lines are drawn to circle O touching at A and B. If PA = 3x − 2 cm and PB = x + 6 cm, find the length of PA!",
    c2_step1: "Use the property: two tangents from the same external point have equal length.",
    c2_ans: "✅ PA = PB = 10 cm.",
    c3_problem: "Triangle ABC has an inscribed circle that is tangent to side AB at P, side BC at Q, and side AC at R. Given AB = 10 cm, BC = 8 cm, AC = 7 cm. Find the length of AP!",
    c3_let: "Let: AP = AR = x, BP = BQ = y, CQ = CR = z.",
    c3_from: "From the side lengths of the triangle:",
    c3_sum: "Add all three equations:",
    c3_find: "To find x: subtract equation 2 from the total sum:",
    c3_ans: "✅ AP = 4.5 cm.",
    sum1: "• touches the circle at exactly 1 point (point of tangency T).",
    sum2: "• At the point of tangency, radius OT ⊥ tangent line (90°).",
    sum3: "• From external point P, there are two tangent lines of equal length:",
    sum_label1: "A tangent line",
    sum_label2: "90°",
    tip_text: "The \"tangent perpendicular to radius\" principle is used in gear design and satellite orbits — a circular orbit is always perpendicular to the gravitational force (radius)!",
    tip_label: "🚀 Astronaut Tip:",
    svg_tangent: "Tangent Line (1 point)",
    svg_secant: "Secant Line (2 points)",
    svg_no: "No intersection",
    svg_pts0: "(0 intersection points)",
    svg_gsing: "Tangent Line",
    svg_pts1: "(1 tangent point)",
    svg_potong: "Secant Line",
    svg_pts2: "(2 intersection points)",
  },
  ja: {
    title: "円の接線の定義と性質",
    subtitle: "中学2年 · 円の接線 · 数学テキスト",
    back: "← 円の接線に戻る",
    sec_intro: "🌟 1点だけ触れる直線",
    sec_definisi: "📐 円の接線の定義",
    sec_sifat: "🔬 円の接線の性質",
    sec_contoh1: "✏️ 例題1 — 接線の識別（基本）",
    sec_contoh2: "✏️ 例題2 — 外部点からの2本の接線（標準）",
    sec_contoh3: "✏️ 例題3 — 三角形と接線（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    intro_p: "自転車の車輪が地面に触れている場面を見たことはありますか？地面は車輪に対する接線として機能します — ちょうど1点だけで触れており、内側に貫通しません！これが今学ぶ概念です：円に1点だけ接する直線です。",
    intro_bold1: "接線",
    intro_bold2: "ちょうど1点",
    intro_tip: "直線と円の位置関係には3通りあります：交点なし（0点）、接線（1点）、割線（2点）。注目するのは中間の —",
    intro_tip_bold: "接線",
    def_summary: "とは、円をちょうど1点で交わる直線です。その交点を接点（T）といいます。この点では、半径と接線は常に垂直（90°）です。",
    def_bold: "円の接線",
    term_O: "円の中心",
    term_T: "接点",
    term_r: "円の半径",
    term_label: "📋 重要用語",
    intisari: "🎯 要点まとめ",
    sifat1_title: "半径に対して垂直",
    sifat1_desc: "接点Tにおいて、半径OTは常に接線と垂直（⊥）です。つまり角OTl = 90°です。",
    sifat2_title: "外部点からの2本の接線",
    sifat2_desc: "円の外部の点Pから、円へちょうど2本の接線を引くことができます。",
    sifat3_title: "接線の長さは等しい",
    sifat3_desc: "同じ外部点からの2本の接線の長さは常に等しいです（対称性）。",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解説",
    c1_problem: "中心Oで半径5 cmの円があります。直線lが円を点Tで接しています。OT = 5 cmのとき、この直線lは接線ですか？OTと直線lのなす角を求めなさい。",
    c1_step1: "確認：OT = 半径 = 5 cm → Tは円上の点 ✓",
    c1_step2: "直線lがTのみで接するなら、接線の性質より：",
    c1_ans: "✅ はい、直線lは接線です。OTと直線lのなす角は90°（垂直）です。",
    c2_problem: "外部点PからのA、B点で接する2本の接線があります。PA = 3x − 2 cm、PB = x + 6 cmのとき、PAの長さを求めなさい。",
    c2_step1: "性質を使う：同じ外部点からの2本の接線の長さは等しい。",
    c2_ans: "✅ PA = PB = 10 cm。",
    c3_problem: "三角形ABCの内接円が辺ABをP、辺BCをQ、辺ACをRで接しています。AB = 10 cm、BC = 8 cm、AC = 7 cmのとき、APの長さを求めなさい。",
    c3_let: "設定：AP = AR = x、BP = BQ = y、CQ = CR = z。",
    c3_from: "三角形の各辺の長さより：",
    c3_sum: "3式を加える：",
    c3_find: "xを求める：合計から式2を引く：",
    c3_ans: "✅ AP = 4.5 cm。",
    sum1: "• 円にちょうど1点（接点T）で接する。",
    sum2: "• 接点では、半径OT ⊥ 接線（90°）。",
    sum3: "• 外部点Pから等しい長さの接線が2本：",
    sum_label1: "接線",
    sum_label2: "90°",
    tip_text: "「接線は半径に垂直」の原理は歯車設計や衛星軌道に使われています — 円軌道は常に重力（半径方向）に垂直です！",
    tip_label: "🚀 宇宙飛行士のヒント：",
    svg_tangent: "接線（1点）",
    svg_secant: "割線（2点）",
    svg_no: "交点なし",
    svg_pts0: "（交点0個）",
    svg_gsing: "接線",
    svg_pts1: "（接点1個）",
    svg_potong: "割線",
    svg_pts2: "（交点2個）",
  },
};

type TranslationKey = keyof typeof translations.id;

const PengertianPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] as Record<TranslationKey, string>;

  const [open, setOpen] = useState<string[]>(["intro", "definisi", "sifat", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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

  /* ── SVG: Circle with tangent line touching at one point ── */
  const TangentBasicSVG = () => (
    <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto my-2" aria-label={t.sec_definisi}>
      <defs>
        <style>{`
          @keyframes tangentPulse{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 6px #fbbf24);}50%{stroke-opacity:0.4;filter:none;}}
          @keyframes dotPulse{0%,100%{r:6;}50%{r:4;}}
          .tang{animation:tangentPulse 2s ease-in-out infinite;}
          .tdot{animation:dotPulse 2s ease-in-out infinite;}
        `}</style>
      </defs>
      <circle cx="120" cy="100" r="65" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2.5"/>
      <circle cx="120" cy="100" r="4" fill="#22c55e"/>
      <text x="125" y="96" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
      <line x1="120" y1="100" x2="185" y2="100" stroke="#22c55e" strokeWidth="1.8" strokeDasharray="5 3"/>
      <text x="147" y="94" fill="#4ade80" fontSize="10" fontFamily="monospace">r</text>
      <circle cx="185" cy="100" r="5" fill="#fbbf24" className="tdot"/>
      <text x="190" y="94" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">T</text>
      <polyline points="185,100 185,88 173,88" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
      <line x1="185" y1="20" x2="185" y2="180" stroke="#fbbf24" strokeWidth="3" className="tang"/>
      <text x="152" y="115" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" opacity="0.7">90°</text>
      <line x1="50" y1="40" x2="220" y2="160" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5"/>
      <circle cx="80" cy="61" r="3" fill="#94a3b8" opacity="0.6"/>
      <circle cx="173" cy="141" r="3" fill="#94a3b8" opacity="0.6"/>
      <rect x="10" y="168" width="120" height="28" rx="5" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1"/>
      <line x1="18" y1="178" x2="38" y2="178" stroke="#fbbf24" strokeWidth="2.5"/>
      <text x="44" y="181" fill="#fbbf24" fontSize="8" fontFamily="monospace">{t.svg_tangent}</text>
      <line x1="18" y1="190" x2="38" y2="190" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3"/>
      <text x="44" y="193" fill="#94a3b8" fontSize="8" fontFamily="monospace">{t.svg_secant}</text>
    </svg>
  );

  /* ── SVG: Three cases ── */
  const TigaKasusSVG = () => (
    <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-2" aria-label={t.sec_intro}>
      <defs>
        <style>{`@keyframes caseGlow{0%,100%{opacity:1;}50%{opacity:0.4;}}.cg{animation:caseGlow 2.2s ease-in-out infinite;}`}</style>
      </defs>
      <g>
        <circle cx="55" cy="80" r="40" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2"/>
        <line x1="10" y1="30" x2="100" y2="30" stroke="#ef4444" strokeWidth="2.5"/>
        <text x="55" y="135" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svg_no}</text>
        <text x="55" y="147" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svg_pts0}</text>
      </g>
      <g>
        <circle cx="160" cy="80" r="40" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
        <line x1="115" y1="40" x2="205" y2="40" stroke="#fbbf24" strokeWidth="2.5" className="cg"/>
        <circle cx="160" cy="40" r="4" fill="#fbbf24"/>
        <text x="160" y="135" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t.svg_gsing}</text>
        <text x="160" y="147" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svg_pts1}</text>
      </g>
      <g>
        <circle cx="265" cy="80" r="40" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2"/>
        <line x1="220" y1="55" x2="310" y2="105" stroke="#f97316" strokeWidth="2.5"/>
        <circle cx="234" cy="62" r="4" fill="#f97316"/>
        <circle cx="296" cy="98" r="4" fill="#f97316"/>
        <text x="265" y="135" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svg_potong}</text>
        <text x="265" y="147" fill="#f97316" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svg_pts2}</text>
      </g>
    </svg>
  );

  /* ── SVG: Properties — radius perpendicular ── */
  const SifatTegakLurusSVG = () => (
    <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-2" aria-label={t.sec_sifat}>
      <defs>
        <style>{`
          @keyframes radGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22c55e);}50%{stroke-opacity:0.3;filter:none;}}
          .rg{animation:radGlow 1.8s ease-in-out infinite;}
        `}</style>
      </defs>
      <circle cx="100" cy="110" r="70" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="2"/>
      <circle cx="100" cy="110" r="4" fill="#22c55e"/>
      <text x="88" y="107" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
      <line x1="100" y1="110" x2="170" y2="110" stroke="#22c55e" strokeWidth="2.5" className="rg"/>
      <text x="130" y="104" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>
      <circle cx="170" cy="110" r="5" fill="#fbbf24"/>
      <text x="175" y="107" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">T</text>
      <polyline points="170,110 170,97 157,97" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.8" opacity="0.9"/>
      <text x="145" y="128" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.8">90°</text>
      <line x1="170" y1="30" x2="170" y2="190" stroke="#fbbf24" strokeWidth="3"/>
      <circle cx="230" cy="110" r="4" fill="#f97316"/>
      <text x="236" y="114" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">P</text>
      <line x1="170" y1="110" x2="230" y2="110" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5 3"/>
      <text x="100" y="20" fill="#eab308" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">OT ⊥ l</text>
    </svg>
  );

  const sifat_data = [
    { num: 1, color: "blue", title: t.sifat1_title, desc: t.sifat1_desc, formula: "OT \\perp l" },
    { num: 2, color: "green", title: t.sifat2_title, desc: t.sifat2_desc, formula: "PT_1 = PT_2" },
    { num: 3, color: "orange", title: t.sifat3_title, desc: t.sifat3_desc, formula: "|PT_1| = |PT_2|" },
  ];

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
                  {t.intro_p.split(t.intro_bold1)[0]}
                  <strong className="text-cyan-300">{t.intro_bold1}</strong>
                  {t.intro_p.split(t.intro_bold1)[1]?.split(t.intro_bold2)[0]}
                  <strong className="text-yellow-300">{t.intro_bold2}</strong>
                  {t.intro_p.split(t.intro_bold2)[1]}
                </p>
                <TigaKasusSVG />
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    💡 <strong>{t.intro_tip}</strong> <strong className="text-yellow-300">{t.intro_tip_bold}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DEFINISI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="definisi" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_definisi} />
            {open.includes("definisi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">{t.def_bold}</strong> {t.def_summary}
                  </p>
                </div>
                <TangentBasicSVG />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.term_label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-green-900/40 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold">O</p>
                      <p className="text-white/60 mt-1">{t.term_O}</p>
                    </div>
                    <div className="bg-yellow-900/40 border border-yellow-500/20 rounded-lg p-2 text-center">
                      <p className="text-yellow-300 font-bold">T</p>
                      <p className="text-white/60 mt-1">{t.term_T}</p>
                    </div>
                    <div className="bg-orange-900/40 border border-orange-500/20 rounded-lg p-2 text-center">
                      <p className="text-orange-300 font-bold">r</p>
                      <p className="text-white/60 mt-1">{t.term_r}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIFAT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sifat" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.sec_sifat} />
            {open.includes("sifat") && (
              <div className="px-5 pb-5 space-y-4">
                <SifatTegakLurusSVG />
                <div className="space-y-3">
                  {sifat_data.map(({ num, color, title, desc, formula }) => (
                    <div key={num} className={`flex gap-3 bg-${color}-900/30 border border-${color}-500/30 rounded-lg p-3`}>
                      <span className={`bg-${color}-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5`}>{num}</span>
                      <div>
                        <p className="font-body text-sm font-bold text-white">{title}</p>
                        <p className="font-body text-xs text-white/60 mt-1">{desc}</p>
                        <div className="mt-2"><InlineMath math={formula} /></div>
                      </div>
                    </div>
                  ))}
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
                  <p className="font-body text-sm text-white/80">{t.c1_step1}</p>
                  <p className="font-body text-sm text-white/80">{t.c1_step2}</p>
                  <BlockMath math="\angle OTl = 90°" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">{t.c1_ans}</p>
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
                  <BlockMath math="PA = PB" />
                  <BlockMath math="3x - 2 = x + 6" />
                  <BlockMath math="2x = 8 \Rightarrow x = 4" />
                  <BlockMath math="PA = 3(4) - 2 = 10 \mathrm{\ cm}" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">{t.c2_ans}</p>
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
                  <p className="font-body text-sm text-white/80">{t.c3_let}</p>
                  <p className="font-body text-sm text-white/80">{t.c3_from}</p>
                  <BlockMath math="x + y = AB = 10" />
                  <BlockMath math="y + z = BC = 8" />
                  <BlockMath math="x + z = AC = 7" />
                  <p className="font-body text-sm text-white/80">{t.c3_sum}</p>
                  <BlockMath math="2(x + y + z) = 25 \Rightarrow x + y + z = 12{,}5" />
                  <p className="font-body text-sm text-white/80">{t.c3_find}</p>
                  <BlockMath math="x = (x+y+z) - (y+z) = 12{,}5 - 8 = 4{,}5 \mathrm{\ cm}" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">{t.c3_ans}</p>
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
                  <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">{t.sum_label1}</strong> {t.sum1}</p>
                  <p className="font-body text-sm text-white/80">{t.sum2.replace("sudut 90°", "").trimEnd()} <InlineMath math="OT \perp l" /> (<strong className="text-green-300">{t.sum_label2}</strong>).</p>
                  <p className="font-body text-sm text-white/80">{t.sum3} <InlineMath math="PT_1 = PT_2" />.</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.tip_label} {t.tip_text}
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

export default PengertianPage;
