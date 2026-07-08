import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import GrafikSPLDVInteraktif from "@/components/GrafikSPLDVInteraktif";

const translations = {
  id: {
    pageTitle: "METODE GRAFIK",
    pageSubtitle: "Selesaikan SPLDV dengan Menggambar Dua Garis",
    gradeLabel: "Kelas 8 · SPLDV · Materi Matematika",
    secIntro: "🌟 Ide Dasar Metode Grafik",
    secLangkah: "📘 Langkah-Langkah Metode Grafik",
    secLab: "🖊️ Lab Interaktif: Gambar Garis & Temukan Solusi SPLDV",
    secContoh: "📝 Contoh Soal & Pembahasan",
    secRangkuman: "📋 Rangkuman",
    introDesc: "Setiap PLDV bisa digambar sebagai sebuah garis lurus di bidang koordinat Kartesius. Karena SPLDV memiliki dua PLDV, kita akan menggambar dua garis. Solusi SPLDV adalah titik potong kedua garis tersebut — koordinat titik itulah nilai x dan y yang memenuhi kedua persamaan!",
    introCards: [
      { icon: "1️⃣", title: "Gambar Garis 1", desc: "Buat tabel nilai untuk persamaan pertama, plot titik-titiknya, sambungkan jadi garis." },
      { icon: "2️⃣", title: "Gambar Garis 2", desc: "Ulangi langkah yang sama untuk persamaan kedua dengan warna garis yang berbeda." },
      { icon: "3️⃣", title: "Cari Titik Potong", desc: "Koordinat titik potong kedua garis adalah solusi (x, y) dari SPLDV." },
    ],
    introTip: "Keunggulan & Kelemahan: Metode grafik sangat intuitif dan visual, tapi hasilnya kurang akurat jika koordinat titik potong bukan bilangan bulat. Untuk solusi presisi, gunakan metode substitusi atau eliminasi.",
    summaryTitle: "🎯 Ringkasan Intisari",
    summaryDesc: "Kunci metode grafik adalah menemukan dua titik yang berada di setiap garis, lalu menyambungkannya. Cara paling mudah: cari titik potong dengan sumbu-x (saat y = 0) dan titik potong dengan sumbu-y (saat x = 0).",
    axisIntTitle: "📍 Cara Menentukan Dua Titik pada Garis",
    axisXTitle: "Titik Potong Sumbu-x",
    axisXDesc: "Substitusikan y = 0 ke persamaan, cari nilai x",
    axisXPoint: "Titik:",
    axisYTitle: "Titik Potong Sumbu-y",
    axisYDesc: "Substitusikan x = 0 ke persamaan, cari nilai y",
    axisYPoint: "Titik:",
    graphTypesTitle: "📊 Kemungkinan Hasil Grafik SPLDV",
    graphTypes: [
      { title: "Berpotongan (1 solusi)", color: "border-green-500/30 bg-green-900/10", labelColor: "text-green-300", desc: "Dua garis bertemu di satu titik → solusi tunggal (x, y)" },
      { title: "Sejajar (Tidak ada solusi)", color: "border-red-500/30 bg-red-900/10", labelColor: "text-red-300", desc: "Dua garis tidak pernah bertemu → SPLDV tidak memiliki solusi" },
      { title: "Berimpit (Tak hingga solusi)", color: "border-yellow-500/30 bg-yellow-900/10", labelColor: "text-yellow-300", desc: "Dua garis saling menumpuk → setiap titik di garis adalah solusi" },
    ],
    labDesc: "Ketik langsung persamaan SPLDV di kotak Garis 1 dan Garis 2, atau seret titik-titik secara manual, lalu gambar kedua garis untuk menemukan solusinya. Titik potong kedua garis adalah penyelesaian SPLDV!",
    graphLabel: "Grafik Penyelesaian SPLDV",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    q1: "Selesaikan SPLDV berikut dengan metode grafik:",
    q1Pts1: "Titik: (0, 4) dan (4, 0)",
    q1Pts2: "Titik: (0, 0) dan (4, 4)",
    q1Solution: "Dari grafik, kedua garis berpotongan di titik",
    q1Verify: "Verifikasi:",
    q1Answer: "🔑 Solusi SPLDV:",
    q2: "Selesaikan dengan metode grafik:",
    q2P1Points: ["Jika x = 0: y = 6 → (0, 6)", "Jika y = 0: x = 3 → (3, 0)"],
    q2P2Points: ["Jika x = 0: y = 3 → (0, 3)", "Jika y = 0: x = 6 → (6, 0)"],
    q2Intersection: "Titik potong kedua garis:",
    q2Verify: "Verifikasi:",
    q2Note: "💡 Solusi: x = 2, y = 2. Meskipun kedua persamaan berbeda, mereka bertemu di titik yang sama!",
    q3: "Selesaikan SPLDV berikut dengan metode grafik:",
    q3P1Label: "Persamaan 1:",
    q3P1Points: ["Jika x = 0: 2y = 6 → y = 3 → (0, 3)", "Jika y = 0: x = 6 → (6, 0)"],
    q3P2Label: "Persamaan 2:",
    q3P2Points: ["Jika x = 0: 2y = 10 → y = 5 → (0, 5)", "Jika x = 6: 6 + 2y = 10 → y = 2 → (6, 2)"],
    q3GraphTitle: "📊 Grafik Kedua Persamaan",
    q3ParallelLabel: "⟺ Garis Sejajar",
    q3ParallelNote: "Kedua garis tidak berpotongan — selalu sejajar sepanjang bidang koordinat.",
    q3GradientTitle: "🔍 Mengapa kedua garis sejajar? Ubah ke bentuk",
    q3P1Grad: "gradien m = −1/2, titik potong sumbu-y = 3",
    q3P2Grad: "gradien m = −1/2, titik potong sumbu-y = 5",
    q3GradSame: "Gradien kedua garis:",
    q3GradSameLabel: "→ SAMA",
    q3GradDiff: "Konstanta (y-intercept):",
    q3GradDiffLabel: "→ BERBEDA",
    q3Conclusion: "∅ SPLDV Tidak Memiliki Penyelesaian!",
    q3ConclusionDesc: "Karena gradien sama tetapi konstanta berbeda, kedua garis sejajar dan tidak pernah berpotongan. Tidak ada pasangan (x, y) yang memenuhi kedua persamaan secara bersamaan.",
    summaryPoints: [
      { poin: "Metode grafik menyelesaikan SPLDV dengan menggambar dua garis lurus di koordinat Kartesius.", icon: "📊" },
      { poin: "Setiap PLDV digambar dengan menentukan minimal 2 titik — paling mudah: titik potong sumbu-x (y=0) dan sumbu-y (x=0).", icon: "📍" },
      { poin: "Solusi SPLDV adalah koordinat titik potong kedua garis: (x, y).", icon: "🎯" },
      { poin: "Jika gradien berbeda → berpotongan (1 solusi). Gradien sama, konstanta beda → sejajar (tidak ada solusi). Keduanya sama → berimpit (tak hingga solusi).", icon: "📐" },
      { poin: "Selalu verifikasi solusi dengan mensubstitusikan ke KEDUA persamaan.", icon: "✅" },
    ],
    backBtn: "← Kembali ke Menu SPLDV",
    contoh: "Contoh Soal",
  },
  en: {
    pageTitle: "GRAPHICAL METHOD",
    pageSubtitle: "Solve Systems of Linear Equations by Drawing Two Lines",
    gradeLabel: "Grade 8 · SLETV · Mathematics",
    secIntro: "🌟 Core Idea of the Graphical Method",
    secLangkah: "📘 Steps of the Graphical Method",
    secLab: "🖊️ Interactive Lab: Draw Lines & Find the SLETV Solution",
    secContoh: "📝 Example Problems & Solutions",
    secRangkuman: "📋 Summary",
    introDesc: "Every linear equation can be drawn as a straight line in the Cartesian coordinate plane. Since a system has two equations, we draw two lines. The solution is the intersection point — those coordinates are the x and y values that satisfy both equations!",
    introCards: [
      { icon: "1️⃣", title: "Draw Line 1", desc: "Make a value table for the first equation, plot the points, connect them into a line." },
      { icon: "2️⃣", title: "Draw Line 2", desc: "Repeat the same steps for the second equation with a different line color." },
      { icon: "3️⃣", title: "Find the Intersection", desc: "The coordinates of the intersection point are the solution (x, y) of the system." },
    ],
    introTip: "Strengths & Weaknesses: The graphical method is intuitive and visual, but less accurate when the intersection is not at integer coordinates. For precise solutions, use substitution or elimination.",
    summaryTitle: "🎯 Key Summary",
    summaryDesc: "The key to the graphical method is finding two points on each line and connecting them. The easiest way: find the x-intercept (when y = 0) and the y-intercept (when x = 0).",
    axisIntTitle: "📍 Finding Two Points on a Line",
    axisXTitle: "x-intercept",
    axisXDesc: "Substitute y = 0 into the equation, find x",
    axisXPoint: "Point:",
    axisYTitle: "y-intercept",
    axisYDesc: "Substitute x = 0 into the equation, find y",
    axisYPoint: "Point:",
    graphTypesTitle: "📊 Possible Graphical Outcomes",
    graphTypes: [
      { title: "Intersecting (1 solution)", color: "border-green-500/30 bg-green-900/10", labelColor: "text-green-300", desc: "Two lines meet at one point → unique solution (x, y)" },
      { title: "Parallel (No solution)", color: "border-red-500/30 bg-red-900/10", labelColor: "text-red-300", desc: "Two lines never meet → the system has no solution" },
      { title: "Coincident (Infinitely many solutions)", color: "border-yellow-500/30 bg-yellow-900/10", labelColor: "text-yellow-300", desc: "Lines overlap completely → every point on the line is a solution" },
    ],
    labDesc: "Type the system equations directly in the Line 1 and Line 2 boxes, or drag the points manually, then draw both lines to find the solution. The intersection is the SLETV solution!",
    graphLabel: "Graph of the System",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    q1: "Solve the following system using the graphical method:",
    q1Pts1: "Points: (0, 4) and (4, 0)",
    q1Pts2: "Points: (0, 0) and (4, 4)",
    q1Solution: "From the graph, the two lines intersect at",
    q1Verify: "Verify:",
    q1Answer: "🔑 Solution:",
    q2: "Solve using the graphical method:",
    q2P1Points: ["If x = 0: y = 6 → (0, 6)", "If y = 0: x = 3 → (3, 0)"],
    q2P2Points: ["If x = 0: y = 3 → (0, 3)", "If y = 0: x = 6 → (6, 0)"],
    q2Intersection: "Intersection point:",
    q2Verify: "Verify:",
    q2Note: "💡 Solution: x = 2, y = 2. Even though the equations differ, they meet at the same point!",
    q3: "Solve the following system using the graphical method:",
    q3P1Label: "Equation 1:",
    q3P1Points: ["If x = 0: 2y = 6 → y = 3 → (0, 3)", "If y = 0: x = 6 → (6, 0)"],
    q3P2Label: "Equation 2:",
    q3P2Points: ["If x = 0: 2y = 10 → y = 5 → (0, 5)", "If x = 6: 6 + 2y = 10 → y = 2 → (6, 2)"],
    q3GraphTitle: "📊 Graph of Both Equations",
    q3ParallelLabel: "⟺ Parallel Lines",
    q3ParallelNote: "The two lines do not intersect — they are always parallel across the coordinate plane.",
    q3GradientTitle: "🔍 Why are the lines parallel? Convert to",
    q3P1Grad: "slope m = −1/2, y-intercept = 3",
    q3P2Grad: "slope m = −1/2, y-intercept = 5",
    q3GradSame: "Both slopes:",
    q3GradSameLabel: "→ EQUAL",
    q3GradDiff: "y-intercepts:",
    q3GradDiffLabel: "→ DIFFERENT",
    q3Conclusion: "∅ No Solution!",
    q3ConclusionDesc: "Because the slopes are equal but the y-intercepts differ, the lines are parallel and never meet. No pair (x, y) satisfies both equations simultaneously.",
    summaryPoints: [
      { poin: "The graphical method solves a system by drawing two lines in the Cartesian plane.", icon: "📊" },
      { poin: "Each equation is drawn using at least 2 points — easiest: x-intercept (y=0) and y-intercept (x=0).", icon: "📍" },
      { poin: "The system's solution is the coordinates of the intersection of both lines: (x, y).", icon: "🎯" },
      { poin: "Different slopes → intersecting (1 solution). Same slope, different intercept → parallel (no solution). Both same → coincident (infinitely many).", icon: "📐" },
      { poin: "Always verify the solution by substituting into BOTH equations.", icon: "✅" },
    ],
    backBtn: "← Back to SLETV Menu",
    contoh: "Example",
  },
  ja: {
    pageTitle: "グラフ法",
    pageSubtitle: "2本の直線を描いて連立方程式を解く",
    gradeLabel: "中学2年 · 連立方程式 · 数学",
    secIntro: "🌟 グラフ法の基本的なアイデア",
    secLangkah: "📘 グラフ法の手順",
    secLab: "🖊️ インタラクティブ演習：直線を描いて連立方程式の解を見つけよう",
    secContoh: "📝 例題と解説",
    secRangkuman: "📋 まとめ",
    introDesc: "各一次方程式は座標平面上の直線として描けます。連立方程式には2本の方程式があるので2本の直線を描きます。解は2本の直線の交点の座標 — それが両方の方程式を満たすxとyの値です！",
    introCards: [
      { icon: "1️⃣", title: "直線1を描く", desc: "1番目の方程式の値の表を作り、点を打ち、直線で結ぶ。" },
      { icon: "2️⃣", title: "直線2を描く", desc: "2番目の方程式についても同じ手順を繰り返す（別の色で）。" },
      { icon: "3️⃣", title: "交点を見つける", desc: "2本の直線の交点の座標が連立方程式の解(x, y)。" },
    ],
    introTip: "長所と短所：グラフ法は直感的でビジュアルだが、交点が整数でない場合は精度が落ちる。正確な解には代入法や加減法を使おう。",
    summaryTitle: "🎯 要点まとめ",
    summaryDesc: "グラフ法のカギは各直線上の2点を見つけてつなぐこと。最も簡単：x軸との交点(y=0のとき)とy軸との交点(x=0のとき)。",
    axisIntTitle: "📍 直線上の2点の求め方",
    axisXTitle: "x切片",
    axisXDesc: "方程式にy = 0を代入してxを求める",
    axisXPoint: "点：",
    axisYTitle: "y切片",
    axisYDesc: "方程式にx = 0を代入してyを求める",
    axisYPoint: "点：",
    graphTypesTitle: "📊 グラフの交わり方の種類",
    graphTypes: [
      { title: "交わる（解が1つ）", color: "border-green-500/30 bg-green-900/10", labelColor: "text-green-300", desc: "2本の直線が1点で交わる → 唯一解(x, y)" },
      { title: "平行（解なし）", color: "border-red-500/30 bg-red-900/10", labelColor: "text-red-300", desc: "2本の直線が交わらない → 連立方程式に解なし" },
      { title: "一致（無数に解あり）", color: "border-yellow-500/30 bg-yellow-900/10", labelColor: "text-yellow-300", desc: "2本の直線が重なる → 直線上の全ての点が解" },
    ],
    labDesc: "直線1と直線2のボックスに連立方程式を直接入力するか点を手動でドラッグして、2本の直線を描いて解を見つけよう。交点が連立方程式の解！",
    graphLabel: "連立方程式のグラフ",
    easy: "基本", medium: "標準", hard: "発展",
    q1: "以下の連立方程式をグラフ法で解きましょう：",
    q1Pts1: "点：(0, 4) と (4, 0)",
    q1Pts2: "点：(0, 0) と (4, 4)",
    q1Solution: "グラフから、2本の直線の交点は",
    q1Verify: "確認：",
    q1Answer: "🔑 解：",
    q2: "グラフ法で解きましょう：",
    q2P1Points: ["x = 0のとき：y = 6 → (0, 6)", "y = 0のとき：x = 3 → (3, 0)"],
    q2P2Points: ["x = 0のとき：y = 3 → (0, 3)", "y = 0のとき：x = 6 → (6, 0)"],
    q2Intersection: "交点：",
    q2Verify: "確認：",
    q2Note: "💡 解：x = 2, y = 2。方程式が異なっていても同じ点で交わっている！",
    q3: "以下の連立方程式をグラフ法で解きましょう：",
    q3P1Label: "方程式1：",
    q3P1Points: ["x = 0のとき：2y = 6 → y = 3 → (0, 3)", "y = 0のとき：x = 6 → (6, 0)"],
    q3P2Label: "方程式2：",
    q3P2Points: ["x = 0のとき：2y = 10 → y = 5 → (0, 5)", "x = 6のとき：6 + 2y = 10 → y = 2 → (6, 2)"],
    q3GraphTitle: "📊 2本の方程式のグラフ",
    q3ParallelLabel: "⟺ 平行な直線",
    q3ParallelNote: "2本の直線は交わらない — 座標平面上でずっと平行。",
    q3GradientTitle: "🔍 なぜ平行？",
    q3P1Grad: "傾き m = −1/2、y切片 = 3",
    q3P2Grad: "傾き m = −1/2、y切片 = 5",
    q3GradSame: "両方の傾き：",
    q3GradSameLabel: "→ 等しい",
    q3GradDiff: "y切片：",
    q3GradDiffLabel: "→ 異なる",
    q3Conclusion: "∅ 解なし！",
    q3ConclusionDesc: "傾きが等しくy切片が異なるため、2本の直線は平行で交わらない。両方の方程式を同時に満たすペア(x, y)は存在しない。",
    summaryPoints: [
      { poin: "グラフ法は座標平面に2本の直線を描いて連立方程式を解く方法。", icon: "📊" },
      { poin: "各方程式は最低2点を使って描く — 最も簡単：x切片(y=0)とy切片(x=0)。", icon: "📍" },
      { poin: "連立方程式の解は2本の直線の交点の座標：(x, y)。", icon: "🎯" },
      { poin: "傾きが異なる → 交わる（1解）。傾きが同じでy切片が違う → 平行（解なし）。両方同じ → 一致（無数の解）。", icon: "📐" },
      { poin: "解は必ず元の2本の方程式両方で確認すること。", icon: "✅" },
    ],
    backBtn: "← 連立方程式メニューに戻る",
    contoh: "例題",
  },
};

const MetodeGrafikPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "lab", "intro", "langkah", "contoh1", "rangkuman",
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

  const GraphSVG = ({ lines, intersection, label }: {
    lines: { points: [number, number][]; color: string; name: string }[];
    intersection?: [number, number];
    label?: string;
  }) => {
    const W = 220; const H = 180; const pad = 30; const xRange = 8; const yRange = 8;
    const toSVG2 = (x: number, y: number): [number, number] => [
      pad + (x / xRange) * (W - 2 * pad),
      H - pad - (y / yRange) * (H - 2 * pad),
    ];
    const ticks = [0, 2, 4, 6, 8];
    const svgBg    = isDark ? "#0f172a" : "#f8fafc";
    const gridLine = isDark ? "#334155" : "#e2e8f0";
    const axisLine = isDark ? "#475569" : "#94a3b8";
    const tickFill = isDark ? "#64748b" : "#64748b";
    const labelFill = isDark ? "#94a3b8" : "#64748b";
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto">
        <rect x={0} y={0} width={W} height={H} fill={svgBg} rx="4" />
        {ticks.map((tick) => {
          const [sx] = toSVG2(tick, 0); const [, sy] = toSVG2(0, tick);
          return (
            <g key={tick}>
              <line x1={sx} y1={pad} x2={sx} y2={H - pad} stroke={gridLine} strokeWidth="0.5" />
              <line x1={pad} y1={sy} x2={W - pad} y2={sy} stroke={gridLine} strokeWidth="0.5" />
              {tick > 0 && <text x={sx} y={H - pad + 12} textAnchor="middle" fill={tickFill} fontSize="8">{tick}</text>}
              {tick > 0 && <text x={pad - 8} y={sy + 3} textAnchor="end" fill={tickFill} fontSize="8">{tick}</text>}
            </g>
          );
        })}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke={axisLine} strokeWidth="1.5" />
        <line x1={pad} y1={H - pad} x2={pad} y2={pad} stroke={axisLine} strokeWidth="1.5" />
        <text x={W - pad + 4} y={H - pad + 4} fill={labelFill} fontSize="9">x</text>
        <text x={pad - 3} y={pad - 4} fill={labelFill} fontSize="9">y</text>
        {lines.map(({ points, color, name }) => {
          const svgPoints = points.map(([x, y]) => toSVG2(x, y));
          return (
            <g key={name}>
              <polyline points={svgPoints.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
              {svgPoints[svgPoints.length - 1] && (
                <text x={svgPoints[svgPoints.length - 1][0] + 3} y={svgPoints[svgPoints.length - 1][1] - 3} fill={color} fontSize="8" fontWeight="bold">{name}</text>
              )}
            </g>
          );
        })}
        {intersection && (() => {
          const [ix, iy] = toSVG2(intersection[0], intersection[1]);
          return (
            <g>
              <circle cx={ix} cy={iy} r="5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <text x={ix + 7} y={iy - 5} fill="#fbbf24" fontSize="8" fontWeight="bold">({intersection[0]},{intersection[1]})</text>
            </g>
          );
        })()}
        {label && <text x={W / 2} y={14} textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>}
      </svg>
    );
  };

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {t.introCards.map(({ icon, title, desc }) => (
                    <div key={title} className="border border-cyan-500/30 bg-cyan-900/20 rounded-xl p-3 text-center">
                      <p className="text-2xl mb-1">{icon}</p>
                      <p className="font-display text-sm font-bold text-white mb-1">{title}</p>
                      <p className="font-body text-xs text-white/60">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.introTip.split(":")[0]}:</strong> {t.introTip.split(":").slice(1).join(":")}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-blue-400" title={t.secLangkah} />
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.summaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.summaryDesc}</p>
                </div>
                <div className="bg-slate-800/60 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide">{t.axisIntTitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-3">
                      <p className="text-cyan-300 font-bold mb-1">{t.axisXTitle}</p>
                      <p className="text-white/70 text-xs">{t.axisXDesc}</p>
                      <div className="mt-2"><BlockMath math="ax + b(0) = c \Rightarrow x = \frac{c}{a}" /></div>
                      <p className="text-cyan-200/60 text-xs text-center">{t.axisXPoint} <InlineMath math="\left(\frac{c}{a},\ 0\right)" /></p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-3">
                      <p className="text-green-300 font-bold mb-1">{t.axisYTitle}</p>
                      <p className="text-white/70 text-xs">{t.axisYDesc}</p>
                      <div className="mt-2"><BlockMath math="a(0) + by = c \Rightarrow y = \frac{c}{b}" /></div>
                      <p className="text-green-200/60 text-xs text-center">{t.axisYPoint} <InlineMath math="\left(0,\ \frac{c}{b}\right)" /></p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.graphTypesTitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {t.graphTypes.map(({ title, color, labelColor, desc }) => (
                      <div key={title} className={`border ${color} rounded-xl p-3 text-center`}>
                        <p className={`font-display text-xs font-bold mb-2 ${labelColor}`}>{title}</p>
                        <p className="font-body text-xs text-white/60">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="lab" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.secLab} />
            {expandedSections.includes("lab") && (
              <div className="px-4 pb-5 space-y-3">
                <p className="font-body text-xs text-white/55 leading-relaxed">
                  {t.labDesc}
                </p>
                <GrafikSPLDVInteraktif />
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
                    <p className="font-body text-sm font-semibold text-white">{t.contoh} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q1}<br /><InlineMath math="x + y = 4" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="x - y = 0" /></p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">✅ {language === "id" ? "Pembahasan" : language === "en" ? "Solution" : "解説"}</p>
                    <div>
                      <p className="font-body text-sm font-semibold text-cyan-300 mb-2">P1: <InlineMath math="x + y = 4" /></p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse mx-auto">
                          <thead><tr className="bg-cyan-900/40">
                            <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200"><InlineMath math="x" /></th>
                            <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">0</th>
                            <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">4</th>
                          </tr></thead>
                          <tbody><tr>
                            <td className="border border-white/10 px-4 py-1 text-cyan-200 font-bold"><InlineMath math="y" /></td>
                            <td className="border border-white/10 px-4 py-1 text-center text-white">4</td>
                            <td className="border border-white/10 px-4 py-1 text-center text-white">0</td>
                          </tr></tbody>
                        </table>
                      </div>
                      <p className="font-body text-xs text-center text-cyan-300/60 mt-1">{t.q1Pts1}</p>
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-violet-300 mb-2">P2: <InlineMath math="x - y = 0" /> → <InlineMath math="x = y" /></p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse mx-auto">
                          <thead><tr className="bg-violet-900/40">
                            <th className="border border-violet-500/30 px-4 py-1 text-violet-200"><InlineMath math="x" /></th>
                            <th className="border border-violet-500/30 px-4 py-1 text-violet-200">0</th>
                            <th className="border border-violet-500/30 px-4 py-1 text-violet-200">4</th>
                          </tr></thead>
                          <tbody><tr>
                            <td className="border border-white/10 px-4 py-1 text-violet-200 font-bold"><InlineMath math="y" /></td>
                            <td className="border border-white/10 px-4 py-1 text-center text-white">0</td>
                            <td className="border border-white/10 px-4 py-1 text-center text-white">4</td>
                          </tr></tbody>
                        </table>
                      </div>
                      <p className="font-body text-xs text-center text-violet-300/60 mt-1">{t.q1Pts2}</p>
                    </div>
                    <div className={`${isDark ? "bg-slate-800/40 border-yellow-500/20" : "bg-gray-50 border-yellow-400/40"} border rounded-xl p-3`}>
                      <GraphSVG
                        lines={[{ points: [[0, 4], [4, 0]], color: "#22d3ee", name: "P1" }, { points: [[0, 0], [6, 6]], color: "#a78bfa", name: "P2" }]}
                        intersection={[2, 2]}
                        label={t.graphLabel}
                      />
                    </div>
                    <p className="font-body text-sm text-white/80">{t.q1Solution} <InlineMath math="(2, 2)" />.</p>
                    <p className="font-body text-sm text-white/80">{t.q1Verify}</p>
                    <BlockMath math="P1: 2 + 2 = 4 \checkmark \qquad P2: 2 - 2 = 0 \checkmark" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">{t.q1Answer} <InlineMath math="x = 2,\ y = 2" /></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.medium} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.contoh} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q2}<br /><InlineMath math="2x + y = 6" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="x + 2y = 6" /></p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ {language === "id" ? "Pembahasan" : language === "en" ? "Solution" : "解説"}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="font-body text-sm font-semibold text-cyan-300 mb-2">P1: <InlineMath math="2x + y = 6" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          {t.q2P1Points.map((p) => <p key={p}>{p}</p>)}
                        </div>
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-violet-300 mb-2">P2: <InlineMath math="x + 2y = 6" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          {t.q2P2Points.map((p) => <p key={p}>{p}</p>)}
                        </div>
                      </div>
                    </div>
                    <div className={`${isDark ? "bg-slate-800/40 border-yellow-500/20" : "bg-gray-50 border-yellow-400/40"} border rounded-xl p-3`}>
                      <GraphSVG
                        lines={[{ points: [[0, 6], [3, 0]], color: "#22d3ee", name: "P1" }, { points: [[0, 3], [6, 0]], color: "#a78bfa", name: "P2" }]}
                        intersection={[2, 2]}
                        label={t.graphLabel}
                      />
                    </div>
                    <p className="font-body text-sm text-white/80">{t.q2Intersection} <InlineMath math="(2, 2)" /></p>
                    <p className="font-body text-sm text-white/80">{t.q2Verify}</p>
                    <BlockMath math="P1: 2(2) + 2 = 6 \checkmark \qquad P2: 2 + 2(2) = 6 \checkmark" />
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">{t.q2Note}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.hard} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.contoh} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q3}<br /><InlineMath math="x + 2y = 6" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="x + 2y = 10" /></p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">✅ {language === "id" ? "Pembahasan" : language === "en" ? "Solution" : "解説"}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.q3P1Label} <InlineMath math="x + 2y = 6" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          {t.q3P1Points.map((p) => <p key={p}>{p}</p>)}
                        </div>
                        <div className="overflow-x-auto mt-2">
                          <table className="text-xs font-body border-collapse mx-auto">
                            <thead><tr className="bg-cyan-900/40">
                              <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200"><InlineMath math="x" /></th>
                              <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">0</th>
                              <th className="border border-cyan-500/30 px-4 py-1 text-cyan-200">6</th>
                            </tr></thead>
                            <tbody><tr>
                              <td className="border border-white/10 px-4 py-1 text-cyan-200 font-bold"><InlineMath math="y" /></td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">3</td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">0</td>
                            </tr></tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.q3P2Label} <InlineMath math="x + 2y = 10" /></p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-body space-y-1 text-white/80">
                          {t.q3P2Points.map((p) => <p key={p}>{p}</p>)}
                        </div>
                        <div className="overflow-x-auto mt-2">
                          <table className="text-xs font-body border-collapse mx-auto">
                            <thead><tr className="bg-orange-900/40">
                              <th className="border border-orange-500/30 px-4 py-1 text-orange-200"><InlineMath math="x" /></th>
                              <th className="border border-orange-500/30 px-4 py-1 text-orange-200">0</th>
                              <th className="border border-orange-500/30 px-4 py-1 text-orange-200">6</th>
                            </tr></thead>
                            <tbody><tr>
                              <td className="border border-white/10 px-4 py-1 text-orange-200 font-bold"><InlineMath math="y" /></td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">5</td>
                              <td className="border border-white/10 px-4 py-1 text-center text-white">2</td>
                            </tr></tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className={`${isDark ? "bg-slate-800/40 border-red-500/20" : "bg-gray-50 border-red-400/40"} border rounded-xl p-3 space-y-2`}>
                      <p className={`font-body text-xs font-bold ${isDark ? "text-white" : "text-gray-800"} text-center`}>{t.q3GraphTitle}</p>
                      <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto">
                        <defs>
                          <filter id="glowRed"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                          <marker id="arrowR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,1 L5,3 L0,5 Z" fill={isDark ? "#475569" : "#94a3b8"}/></marker>
                        </defs>
                        <rect x="0" y="0" width="280" height="220" fill={isDark ? "#0f172a" : "#f8fafc"} rx="6"/>
                        <rect x="30" y="10" width="240" height="190" fill={isDark ? "#0f172a" : "#f1f5f9"} rx="4"/>
                        {[0,1,2,3,4,5,6,7,8].map(i => {
                          const sx = 30 + i * 30; const sy = 200 - i * 22.5;
                          return (<g key={i}>
                            <line x1={sx} y1="10" x2={sx} y2="200" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="0.7"/>
                            <line x1="30" y1={sy} x2="270" y2={sy} stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="0.7"/>
                            <text x={sx} y="212" textAnchor="middle" fill={isDark ? "#475569" : "#64748b"} fontSize="9" fontFamily="monospace">{i}</text>
                            {i > 0 && <text x="22" y={sy + 3} textAnchor="end" fill={isDark ? "#475569" : "#64748b"} fontSize="9" fontFamily="monospace">{i}</text>}
                          </g>);
                        })}
                        <line x1="30" y1="200" x2="268" y2="200" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="1.5" markerEnd="url(#arrowR)"/>
                        <line x1="30" y1="200" x2="30" y2="12" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="1.5" markerEnd="url(#arrowR)"/>
                        <text x="272" y="204" fill={isDark ? "#64748b" : "#475569"} fontSize="10" fontStyle="italic">x</text>
                        <text x="28" y="10" fill={isDark ? "#64748b" : "#475569"} fontSize="10" fontStyle="italic">y</text>
                        <line x1="30" y1="132.5" x2="210" y2="200" stroke="#22d3ee" strokeWidth="2.8" strokeLinecap="round" filter="url(#glowRed)" opacity="0.9"/>
                        <line x1="30" y1="87.5" x2="210" y2="155" stroke="#fb923c" strokeWidth="2.8" strokeLinecap="round" filter="url(#glowRed)" opacity="0.9"/>
                        <circle cx="30" cy="132.5" r="4" fill="#22d3ee"/><circle cx="210" cy="200" r="4" fill="#22d3ee"/>
                        <circle cx="30" cy="87.5" r="4" fill="#fb923c"/><circle cx="210" cy="155" r="4" fill="#fb923c"/>
                        <rect x="82" y="148" width="116" height="20" rx="5" fill={isDark ? "#1c0a0a" : "#fff1f2"} fillOpacity="0.9"/>
                        <text x="140" y="162" textAnchor="middle" fill="#f87171" fontSize="11" fontFamily="sans-serif" fontWeight="bold">{t.q3ParallelLabel}</text>
                        <text x="220" y="100" fill="#ef4444" fontSize="22" fontFamily="monospace" fontWeight="bold" opacity="0.75">∅</text>
                        <rect x="32" y="14" width="130" height="38" rx="4" fill={isDark ? "#0f172a" : "#f8fafc"} fillOpacity="0.9"/>
                        <line x1="38" y1="27" x2="58" y2="27" stroke="#22d3ee" strokeWidth="2.5"/>
                        <text x="62" y="31" fill="#22d3ee" fontSize="10" fontFamily="monospace">x + 2y = 6</text>
                        <line x1="38" y1="44" x2="58" y2="44" stroke="#fb923c" strokeWidth="2.5"/>
                        <text x="62" y="48" fill="#fb923c" fontSize="10" fontFamily="monospace">x + 2y = 10</text>
                      </svg>
                      <p className="font-body text-[11px] text-center text-red-300/80">{t.q3ParallelNote}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-body text-sm text-white/80">🔍 {t.q3GradientTitle} <InlineMath math="y = mx + c" />:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-3 py-2 text-xs font-body space-y-1">
                          <p className="text-white font-mono">x + 2y = 6</p>
                          <BlockMath math="y = -\tfrac{1}{2}x + 3" />
                          <p className="text-white/50">{t.q3P1Grad}</p>
                        </div>
                        <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg px-3 py-2 text-xs font-body space-y-1">
                          <p className="text-white font-mono">x + 2y = 10</p>
                          <BlockMath math="y = -\tfrac{1}{2}x + 5" />
                          <p className="text-white/50">{t.q3P2Grad}</p>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-body space-y-1">
                        <p className="text-white/70">{t.q3GradSame} <InlineMath math="-\tfrac{1}{2} = -\tfrac{1}{2}" /> <span className="text-yellow-300 font-bold">{t.q3GradSameLabel}</span></p>
                        <p className="text-white/70">{t.q3GradDiff} <InlineMath math="3 \neq 5" /> <span className="text-red-300 font-bold">{t.q3GradDiffLabel}</span></p>
                      </div>
                    </div>
                    <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 text-center space-y-2">
                      <p className="font-display text-base font-bold text-red-300">{t.q3Conclusion}</p>
                      <p className="font-body text-xs text-white/60">{t.q3ConclusionDesc}</p>
                      <div className="bg-slate-900/50 rounded-lg px-4 py-2 inline-block mt-1">
                        <BlockMath math="\frac{1}{1} = \frac{2}{2} \neq \frac{6}{10} \quad \Rightarrow \quad \text{no solution}" />
                      </div>
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

export default MetodeGrafikPage;
