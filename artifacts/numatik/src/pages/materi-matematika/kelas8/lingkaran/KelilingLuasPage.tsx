import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

/* ─── Translations ─────────────────────────────────────── */
const translations = {
  id: {
    h1: "KELILING DAN LUAS LINGKARAN",
    subtitle: "Kelas 8 · Lingkaran · Buku Animasi Matematika",
    backBtn: "← Kembali ke Lingkaran",
    // Pi section
    piSectionTitle: "🪐 Misteri Angka Pi (π)",
    piIntro: "Orang Yunani kuno punya teka-teki menarik: berapakah perbandingan keliling lingkaran dengan diameternya? Mereka menemukan jawabannya selalu sama — sebuah angka ajaib yang kita kenal sebagai ",
    piName: "Pi (π)",
    piIntro2: ". Nilainya sekitar ",
    piVal: "3,14159...",
    piIntro3: " dan tak pernah berhenti atau berulang!",
    piBoxTitle: "🔵 Nilai π yang sering digunakan:",
    piB1: "π ≈ 3,14 (untuk perhitungan desimal)",
    piB2: "π ≈ 22/7 (jika jari-jari kelipatan 7)",
    // Phase labels for animation
    ph1: "① Lingkaran terbentuk...",
    ph2: "② Diameter terungkap!",
    ph3a: "③ Keliling terputus di bawah...",
    ph3b: "③ Busur meluruskan menjadi garis → ",
    ph4: "④ Keliling bergeser ke bawah...",
    ph5: "⑤ Bandingkan keliling ÷ diameter!",
    ph6: "⑥ π = K ÷ d ≈ 3,14",
    arcLabel: "Keliling",
    svgAria: "Busur lingkaran meluruskan diri menjadi garis keliling",
    // Formula section
    formulaSectionTitle: "📐 Rumus Keliling dan Luas Lingkaran",
    formulaIntroTitle: "🎯 Ringkasan Intisari",
    formulaIntro: "Keliling adalah panjang garis lengkung yang membentuk lingkaran. Luas adalah daerah di dalam lingkaran.",
    circLabel: "⭕ Keliling",
    circEdge: "Hanya ",
    circEdgeBold: "tepi/garis",
    circEdge2: " yang menyala — itulah keliling!",
    circFormTitle: "📏 KELILING (K)",
    circFormOr: "atau",
    circNote: "d = diameter, r = jari-jari",
    circAria: "Lingkaran keliling",
    areaLabel: "🟠 Luas",
    areaInner: "Yang menyala adalah ",
    areaInnerBold: "daerah dalam",
    areaInner2: " — itulah luas!",
    areaFormTitle: "🔲 LUAS (L)",
    areaFormOr: "atau",
    areaNote: "r = jari-jari, d = diameter",
    areaAria: "Lingkaran luas",
    unitNote: "⚠️ Perhatikan satuan! Keliling = satuan panjang (cm, m). Luas = satuan kuadrat (cm², m²).",
    // Contoh 1
    c1_header: "✏️ Contoh 1 — Menghitung Keliling (Mudah)",
    c1_level: "🟢 Tingkat: Mudah",
    c1_q: "Sebuah roda sepeda memiliki diameter 70 cm. Berapa keliling roda tersebut? Gunakan ",
    c1_sol: "📋 Pembahasan",
    c1_known: "Diketahui: ",
    c1_use: "Gunakan rumus:",
    c1_check: "✅ Keliling roda = 220 cm = 2,2 m.",
    // Contoh 2
    c2_header: "✏️ Contoh 2 — Menghitung Luas (Sedang)",
    c2_level: "🟡 Tingkat: Sedang",
    c2_q: "Sebuah taman berbentuk lingkaran memiliki keliling 88 m. Hitunglah luas taman tersebut! (Gunakan ",
    c2_q2: ")",
    c2_sol: "📋 Pembahasan",
    c2_step1: "Langkah 1:",
    c2_step1desc: "Cari jari-jari dari keliling",
    c2_step2: "Langkah 2:",
    c2_step2desc: "Hitung luas",
    c2_check: "✅ Luas taman = 616 m².",
    // Contoh 3
    c3_header: "✏️ Contoh 3 — Cincin Lingkaran (Sulit)",
    c3_level: "🔴 Tingkat: Sulit",
    c3_q: "Sebuah kolam renang berbentuk lingkaran berjari-jari 10 m. Di sekeliling kolam terdapat jalur pejalan kaki selebar 3,5 m. Hitunglah luas jalur pejalan kaki tersebut! (Gunakan ",
    c3_q2: ")",
    c3_sol: "📋 Pembahasan",
    c3_step1: "Langkah 1:",
    c3_step1desc: "Tentukan jari-jari lingkaran besar (kolam + jalur)",
    c3_step2: "Langkah 2:",
    c3_step2desc: "Luas lingkaran besar",
    c3_step3: "Langkah 3:",
    c3_step3desc: "Luas lingkaran kecil (kolam)",
    c3_step4: "Langkah 4:",
    c3_step4desc: "Luas jalur = Luas besar − Luas kecil",
    c3_check: "✅ Luas jalur pejalan kaki ≈ 258,5 m².",
    // Subscript formulas
    f_Lbesar: "L_{\\text{besar}}",
    f_Lkecil: "L_{\\text{kecil}}",
    f_Ljalur: "L_{\\text{jalur}}",
    // Rangkuman
    rangkuman_header: "📌 Rangkuman Sub-Bab",
    r_pi: "π (Pi)",
    r_pi_desc: "≈ 3,14 atau 22/7 — konstanta ajaib perbandingan keliling dengan diameter.",
    r_K: "Keliling:",
    r_L: "Luas:",
    r_ring: "Soal \"cincin\" atau \"daerah antara dua lingkaran\":",
    tips: "🚀 Tips Astronot: Orbit planet adalah elips, tapi banyak orbit buatan dibuat mendekati lingkaran. Rumus keliling digunakan untuk menghitung waktu tempuh satelit mengelilingi bumi!",
  },
  en: {
    h1: "CIRCUMFERENCE & AREA OF A CIRCLE",
    subtitle: "Grade 8 · Circle · Math Animation Book",
    backBtn: "← Back to Circle",
    piSectionTitle: "🪐 The Mystery of Pi (π)",
    piIntro: "Ancient Greeks had a fascinating puzzle: what is the ratio of a circle's circumference to its diameter? They found the answer is always the same — a magical number we know as ",
    piName: "Pi (π)",
    piIntro2: ". Its value is approximately ",
    piVal: "3.14159...",
    piIntro3: " and it never ends or repeats!",
    piBoxTitle: "🔵 Commonly used values of π:",
    piB1: "π ≈ 3.14 (for decimal calculations)",
    piB2: "π ≈ 22/7 (when radius is a multiple of 7)",
    ph1: "① Circle forms...",
    ph2: "② Diameter revealed!",
    ph3a: "③ Circumference cut at the bottom...",
    ph3b: "③ Arc straightens into a line → ",
    ph4: "④ Circumference shifts down...",
    ph5: "⑤ Compare circumference ÷ diameter!",
    ph6: "⑥ π = C ÷ d ≈ 3.14",
    arcLabel: "Circumference",
    svgAria: "Circle arc unrolling into a straight circumference line",
    formulaSectionTitle: "📐 Circumference & Area Formulas",
    formulaIntroTitle: "🎯 Key Summary",
    formulaIntro: "Circumference is the length of the curved line forming the circle. Area is the region inside the circle.",
    circLabel: "⭕ Circumference",
    circEdge: "Only the ",
    circEdgeBold: "edge/line",
    circEdge2: " glows — that is the circumference!",
    circFormTitle: "📏 CIRCUMFERENCE (C)",
    circFormOr: "or",
    circNote: "d = diameter, r = radius",
    circAria: "Circle circumference",
    areaLabel: "🟠 Area",
    areaInner: "The glowing part is the ",
    areaInnerBold: "inner region",
    areaInner2: " — that is the area!",
    areaFormTitle: "🔲 AREA (A)",
    areaFormOr: "or",
    areaNote: "r = radius, d = diameter",
    areaAria: "Circle area",
    unitNote: "⚠️ Watch your units! Circumference = length unit (cm, m). Area = squared unit (cm², m²).",
    c1_header: "✏️ Example 1 — Calculating Circumference (Easy)",
    c1_level: "🟢 Level: Easy",
    c1_q: "A bicycle wheel has a diameter of 70 cm. What is the circumference of the wheel? Use ",
    c1_sol: "📋 Solution",
    c1_known: "Given: ",
    c1_use: "Apply the formula:",
    c1_check: "✅ Circumference of the wheel = 220 cm = 2.2 m.",
    c2_header: "✏️ Example 2 — Calculating Area (Medium)",
    c2_level: "🟡 Level: Medium",
    c2_q: "A circular park has a circumference of 88 m. Calculate the area of the park. (Use ",
    c2_q2: ")",
    c2_sol: "📋 Solution",
    c2_step1: "Step 1:",
    c2_step1desc: "Find the radius from the circumference",
    c2_step2: "Step 2:",
    c2_step2desc: "Calculate the area",
    c2_check: "✅ Area of the park = 616 m².",
    c3_header: "✏️ Example 3 — Annular Ring (Hard)",
    c3_level: "🔴 Level: Hard",
    c3_q: "A circular swimming pool has a radius of 10 m. Around the pool is a 3.5 m wide walking path. Calculate the area of the walking path. (Use ",
    c3_q2: ")",
    c3_sol: "📋 Solution",
    c3_step1: "Step 1:",
    c3_step1desc: "Find the radius of the large circle (pool + path)",
    c3_step2: "Step 2:",
    c3_step2desc: "Area of the large circle",
    c3_step3: "Step 3:",
    c3_step3desc: "Area of the small circle (pool only)",
    c3_step4: "Step 4:",
    c3_step4desc: "Path area = Large area − Small area",
    c3_check: "✅ Area of the walking path ≈ 258.5 m².",
    f_Lbesar: "L_{\\text{large}}",
    f_Lkecil: "L_{\\text{small}}",
    f_Ljalur: "L_{\\text{path}}",
    rangkuman_header: "📌 Chapter Summary",
    r_pi: "π (Pi)",
    r_pi_desc: "≈ 3.14 or 22/7 — the magical constant relating circumference to diameter.",
    r_K: "Circumference:",
    r_L: "Area:",
    r_ring: "\"Ring\" or \"region between two circles\":",
    tips: "🚀 Astronaut Tip: Planetary orbits are ellipses, but many artificial orbits approach circles. The circumference formula is used to calculate how long it takes a satellite to orbit Earth!",
  },
  ja: {
    h1: "円周と円の面積",
    subtitle: "中学2年 · 円 · 数学アニメーション",
    backBtn: "← 円に戻る",
    piSectionTitle: "🪐 円周率（π）の謎",
    piIntro: "古代ギリシャ人には面白いなぞがありました：円の円周と直径の比はいくつか？その答えはいつも同じ — 私たちが",
    piName: "π（パイ）",
    piIntro2: "として知る不思議な数です。その値は約",
    piVal: "3.14159...",
    piIntro3: "で、終わることなく繰り返しもしません！",
    piBoxTitle: "🔵 よく使うπの値：",
    piB1: "π ≈ 3.14（小数計算に使用）",
    piB2: "π ≈ 22/7（半径が7の倍数のとき）",
    ph1: "① 円が描かれる...",
    ph2: "② 直径が現れる！",
    ph3a: "③ 円周が下で切れる...",
    ph3b: "③ 弧が直線に変わる → ",
    ph4: "④ 円周が下に移動...",
    ph5: "⑤ 円周 ÷ 直径を比べる！",
    ph6: "⑥ π = C ÷ d ≈ 3.14",
    arcLabel: "円周",
    svgAria: "円弧が直線の円周に展開するアニメーション",
    formulaSectionTitle: "📐 円周と面積の公式",
    formulaIntroTitle: "🎯 重要まとめ",
    formulaIntro: "円周とは円を形成する曲線の長さです。面積とは円の内側の領域です。",
    circLabel: "⭕ 円周",
    circEdge: "",
    circEdgeBold: "外周の線",
    circEdge2: "が光っているのが円周です！",
    circFormTitle: "📏 円周（C）",
    circFormOr: "または",
    circNote: "d = 直径、r = 半径",
    circAria: "円の円周図",
    areaLabel: "🟠 面積",
    areaInner: "光っているのは",
    areaInnerBold: "内側の領域",
    areaInner2: "です — これが面積！",
    areaFormTitle: "🔲 面積（S）",
    areaFormOr: "または",
    areaNote: "r = 半径、d = 直径",
    areaAria: "円の面積図",
    unitNote: "⚠️ 単位に注意！円周 = 長さの単位（cm、m）。面積 = 2乗の単位（cm²、m²）。",
    c1_header: "✏️ 例題 1 — 円周を求める（基本）",
    c1_level: "🟢 レベル：基本",
    c1_q: "自転車の車輪の直径が 70 cm です。車輪の円周を求めなさい。",
    c1_sol: "📋 解説",
    c1_known: "わかっていること：",
    c1_use: "公式を使います：",
    c1_check: "✅ 車輪の円周 = 220 cm = 2.2 m。",
    c2_header: "✏️ 例題 2 — 面積を求める（標準）",
    c2_level: "🟡 レベル：標準",
    c2_q: "円形の公園の円周が 88 m です。公園の面積を求めなさい。（",
    c2_q2: "を使用）",
    c2_sol: "📋 解説",
    c2_step1: "ステップ 1：",
    c2_step1desc: "円周から半径を求める",
    c2_step2: "ステップ 2：",
    c2_step2desc: "面積を計算する",
    c2_check: "✅ 公園の面積 = 616 m²。",
    c3_header: "✏️ 例題 3 — 環状リング（発展）",
    c3_level: "🔴 レベル：発展",
    c3_q: "半径 10 m の円形プールの周囲に、幅 3.5 m の歩道があります。歩道の面積を求めなさい。（",
    c3_q2: "を使用）",
    c3_sol: "📋 解説",
    c3_step1: "ステップ 1：",
    c3_step1desc: "大きい円の半径を求める（プール＋歩道）",
    c3_step2: "ステップ 2：",
    c3_step2desc: "大きい円の面積",
    c3_step3: "ステップ 3：",
    c3_step3desc: "小さい円の面積（プールのみ）",
    c3_step4: "ステップ 4：",
    c3_step4desc: "歩道の面積 = 大きい面積 − 小さい面積",
    c3_check: "✅ 歩道の面積 ≈ 258.5 m²。",
    f_Lbesar: "L_{\\text{大}}",
    f_Lkecil: "L_{\\text{小}}",
    f_Ljalur: "L_{\\text{道}}",
    rangkuman_header: "📌 まとめ",
    r_pi: "π（パイ）",
    r_pi_desc: "≈ 3.14 または 22/7 — 円周と直径の比を表す不思議な定数。",
    r_K: "円周：",
    r_L: "面積：",
    r_ring: "「リング」または「2つの円の間の領域」：",
    tips: "🚀 宇宙人のヒント：惑星の軌道は楕円ですが、多くの人工衛星の軌道は円に近いです。円周の公式は、衛星が地球を一周するのにかかる時間の計算に使われます！",
  },
} as const;
type T = typeof translations.id;

/* ─── Pi Animation SVG ───────────────────────────────────── */
const PiAnimationSVG = ({ t }: { t: T }) => {
  const [prog, setProg]       = useState(0);
  const [hasSeen, setHasSeen] = useState(false);
  useEffect(() => {
    let id: number;
    const start = performance.now();
    const PERIOD = 15000;
    const loop = (now: number) => { setProg(((now - start) % PERIOD) / PERIOD); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (prog > 0.91 && !hasSeen) setHasSeen(true);
  }, [prog, hasSeen]);

  const ease = (x: number) => x < 0.5 ? 2*x*x : 1 - (-2*x+2)**2/2;
  const band = (s: number, e: number) => prog < s ? 0 : prog > e ? 1 : ease((prog-s)/(e-s));
  const cl   = (x: number) => Math.max(0, Math.min(1, x));

  const R     = 28;
  const CX    = 155, CY = 66;
  const CIRC  = 2 * Math.PI * R;
  const D     = 2 * R;
  const PART  = CIRC - 3 * D;
  const BOT_Y = CY + R;
  const LINE_Y = 140;
  const SEG_Y  = 165;

  const drawCircle = band(0.02, 0.18);
  const drawDiam   = band(0.19, 0.33);
  const peel       = band(0.35, 0.60);
  const shift      = band(0.61, 0.71);
  const s1         = band(0.73, 0.78);
  const s2         = band(0.77, 0.82);
  const s3         = band(0.81, 0.86);
  const s4         = band(0.85, 0.90);
  const piLbl      = band(0.91, 0.96);
  const fadeOut    = prog > 0.97 ? 1 - cl((prog-0.97)/0.03) : 1;

  const cr = Math.round(6   + (217-6)   * peel);
  const cg = Math.round(182 + (119-182) * peel);
  const cb = Math.round(212 + (6-212)   * peel);
  const morphStroke = `rgb(${cr},${cg},${cb})`;
  const morphGlow   = `rgba(${cr},${cg},${cb},0.22)`;

  const svgDash    = CIRC * drawCircle;
  const svgOpacity = cl(1 - peel * 5);

  const N = 80;
  const targetY = BOT_Y + (LINE_Y - BOT_Y) * shift;

  let morphPts = '';
  if (drawCircle > 0.94 || peel > 0) {
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const tt = i / N;
      const angle = Math.PI / 2 - tt * 2 * Math.PI;
      const cx_pt = CX + R * Math.cos(angle);
      const cy_pt = CY + R * Math.sin(angle);
      const lx_pt = CX + CIRC / 2 - tt * CIRC;
      const px = cx_pt + (lx_pt - cx_pt) * peel;
      const py = cy_pt + (targetY - cy_pt) * peel;
      pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    morphPts = pts.join(' ');
  }
  const morphOpacity = cl((drawCircle - 0.94) / 0.06);

  const lineLen  = CIRC * peel;
  const labelY   = targetY - 11;

  const SEG_X0  = CX - CIRC / 2;
  const diamX1  = (CX - R * drawDiam) + (SEG_X0          - (CX - R)) * peel;
  const diamX2  = (CX + R * drawDiam) + (SEG_X0 + D      - (CX + R)) * peel;
  const diamY   = CY + (SEG_Y - CY) * peel;
  const diamLabelY = peel < 0.05 ? CY - R - 8 : diamY + 14;

  const d2x1 = SEG_X0 + D * s2;
  const d2x2 = d2x1 + D;
  const d3x1 = SEG_X0 + D * (1 + s3);
  const d3x2 = d3x1 + D;
  const sisaX1 = SEG_X0 + 3 * D;
  const sisaX2 = sisaX1 + PART * s4;

  const phaseLabel =
    drawCircle < 0.5  ? t.ph1 :
    drawDiam   < 0.7  ? t.ph2 :
    peel       < 0.04 ? t.ph3a :
    peel       < 0.99 ? `${t.ph3b}${lineLen.toFixed(1)}` :
    shift      < 0.5  ? t.ph4 :
    s4         < 0.9  ? t.ph5 :
                        t.ph6;

  return (
    <div className="select-none">
      <svg viewBox="0 0 310 220" className="w-full max-w-sm mx-auto my-2"
        aria-label={t.svgAria}
        style={{ opacity: fadeOut }}>

        {drawCircle > 0.01 && (
          <circle cx={CX} cy={CY} r={R}
            fill={`rgba(6,182,212,${0.12 * svgOpacity})`} />
        )}

        {drawCircle > 0.01 && svgOpacity > 0.01 && (
          <>
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="rgba(6,182,212,0.22)" strokeWidth="9"
              strokeDasharray={`${svgDash} ${CIRC + 200}`}
              transform={`rotate(-90 ${CX} ${CY})`}
              opacity={svgOpacity} />
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={`${svgDash} ${CIRC + 200}`}
              transform={`rotate(-90 ${CX} ${CY})`}
              opacity={svgOpacity} />
          </>
        )}

        {drawCircle > 0.1 && peel < 0.8 && (
          <circle cx={CX} cy={CY} r="2.5" fill="#94a3b8"
            opacity={cl((1 - peel * 1.2) * (1 - shift))} />
        )}

        {peel > 0.01 && peel < 0.18 && (
          <g opacity={cl(peel * 8)} stroke="#fbbf24" strokeWidth="1.8">
            <line x1={CX - 4} y1={BOT_Y - 4} x2={CX + 4} y2={BOT_Y + 4} />
            <line x1={CX + 4} y1={BOT_Y - 4} x2={CX - 4} y2={BOT_Y + 4} />
          </g>
        )}

        {morphPts && (
          <>
            <polyline points={morphPts} fill="none"
              stroke={morphGlow} strokeWidth="10" strokeLinejoin="round"
              strokeLinecap="round" opacity={morphOpacity} />
            <polyline points={morphPts} fill="none"
              stroke={morphStroke} strokeWidth="3.5" strokeLinejoin="round"
              strokeLinecap="round" opacity={morphOpacity} />
          </>
        )}

        {peel > 0.3 && (
          <text x={CX} y={labelY} fill="#fbbf24" fontSize="8.5"
            textAnchor="middle" fontFamily="monospace" fontWeight="bold"
            opacity={cl((peel - 0.3) / 0.3)}>
            {t.arcLabel} = {lineLen.toFixed(1)}
          </text>
        )}

        {drawDiam > 0 && (
          <g opacity={drawDiam}>
            <line x1={diamX1} y1={diamY} x2={diamX2} y2={diamY}
              stroke="rgba(34,197,94,0.20)" strokeWidth="8" strokeLinecap="round" />
            <line x1={diamX1} y1={diamY} x2={diamX2} y2={diamY}
              stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            {drawDiam > 0.6 && (
              <>
                <circle cx={diamX1} cy={diamY} r="2.5" fill="#22c55e" />
                <circle cx={diamX2} cy={diamY} r="2.5" fill="#22c55e" />
                {peel > 0.97 && (
                  <>
                    <line x1={diamX1} y1={diamY - 5} x2={diamX1} y2={diamY + 5}
                      stroke="#22c55e" strokeWidth="1.5" />
                    <line x1={diamX2} y1={diamY - 5} x2={diamX2} y2={diamY + 5}
                      stroke="#22c55e" strokeWidth="1.5" />
                  </>
                )}
                <text x={(diamX1 + diamX2) / 2} y={diamLabelY}
                  fill="#4ade80" fontSize="9"
                  textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  d = {D}
                </text>
              </>
            )}
          </g>
        )}

        {s1 > 0 && (
          <g opacity={s1}>
            <line x1={SEG_X0}   y1={SEG_Y-6} x2={SEG_X0}   y2={SEG_Y+6} stroke="#22c55e" strokeWidth="1.5"/>
            <line x1={SEG_X0+D} y1={SEG_Y-6} x2={SEG_X0+D} y2={SEG_Y+6} stroke="#22c55e" strokeWidth="1.5"/>
          </g>
        )}

        {s2 > 0 && (
          <g>
            <line x1={d2x1} y1={SEG_Y} x2={d2x2} y2={SEG_Y}
              stroke="rgba(59,130,246,0.25)" strokeWidth="9" strokeLinecap="round"/>
            <line x1={d2x1} y1={SEG_Y} x2={d2x2} y2={SEG_Y}
              stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            <line x1={d2x1} y1={SEG_Y-5} x2={d2x1} y2={SEG_Y+5} stroke="#3b82f6" strokeWidth="1.5"/>
            <line x1={d2x2} y1={SEG_Y-5} x2={d2x2} y2={SEG_Y+5} stroke="#3b82f6" strokeWidth="1.5"/>
            {s2 > 0.9 && (
              <text x={(d2x1+d2x2)/2} y={SEG_Y+14} fill="#60a5fa" fontSize="8"
                textAnchor="middle" fontFamily="monospace" fontWeight="bold"
                opacity={cl((s2-0.9)/0.1)}>d</text>
            )}
          </g>
        )}

        {s3 > 0 && (
          <g>
            <line x1={d3x1} y1={SEG_Y} x2={d3x2} y2={SEG_Y}
              stroke="rgba(168,85,247,0.25)" strokeWidth="9" strokeLinecap="round"/>
            <line x1={d3x1} y1={SEG_Y} x2={d3x2} y2={SEG_Y}
              stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
            <line x1={d3x1} y1={SEG_Y-5} x2={d3x1} y2={SEG_Y+5} stroke="#a855f7" strokeWidth="1.5"/>
            <line x1={d3x2} y1={SEG_Y-5} x2={d3x2} y2={SEG_Y+5} stroke="#a855f7" strokeWidth="1.5"/>
            {s3 > 0.9 && (
              <text x={(d3x1+d3x2)/2} y={SEG_Y+14} fill="#c084fc" fontSize="8"
                textAnchor="middle" fontFamily="monospace" fontWeight="bold"
                opacity={cl((s3-0.9)/0.1)}>d</text>
            )}
          </g>
        )}

        {s4 > 0 && sisaX2 > sisaX1 + 0.5 && (
          <g>
            <line x1={sisaX1} y1={SEG_Y} x2={sisaX2} y2={SEG_Y}
              stroke="rgba(234,179,8,0.25)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray="5 3"/>
            <line x1={sisaX1} y1={SEG_Y} x2={sisaX2} y2={SEG_Y}
              stroke="#eab308" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="5 3"/>
            <line x1={sisaX1} y1={SEG_Y-5} x2={sisaX1} y2={SEG_Y+5} stroke="#eab308" strokeWidth="1.5"/>
            {s4 > 0.85 && (
              <>
                <line x1={sisaX2} y1={SEG_Y-5} x2={sisaX2} y2={SEG_Y+5} stroke="#eab308" strokeWidth="1.5"/>
                <text x={(sisaX1+sisaX2)/2} y={SEG_Y+14} fill="#facc15" fontSize="8"
                  textAnchor="middle" fontFamily="monospace" fontWeight="bold"
                  opacity={cl((s4-0.85)/0.15)}>≈0.14d</text>
              </>
            )}
          </g>
        )}

        {s4 > 0.9 && (
          <>
            <line x1={SEG_X0}        y1={LINE_Y + 8} x2={SEG_X0}        y2={SEG_Y - 6}
              stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={SEG_X0 + CIRC} y1={LINE_Y + 8} x2={SEG_X0 + CIRC} y2={SEG_Y - 6}
              stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          </>
        )}

        {piLbl > 0 && (
          <g opacity={piLbl}>
            <rect x={111} y={5} width={88} height={32} rx="8"
              fill="rgba(168,85,247,0.20)" stroke="#a855f7" strokeWidth="1.5" />
            <text x={155} y={17} fill="#c084fc" fontSize="8.5" textAnchor="middle"
              fontFamily="monospace" fontWeight="bold">π = C ÷ d</text>
            <text x={155} y={31} fill="#fbbf24" fontSize="13" textAnchor="middle"
              fontFamily="monospace" fontWeight="black">≈ 3.14  (22/7)</text>
          </g>
        )}

        <text x="155" y="215" fill="#475569" fontSize="7.5" textAnchor="middle"
          fontFamily="sans-serif">{phaseLabel}</text>
      </svg>

      <style>{`
        @keyframes piGlow {
          0%,100% { opacity:.72; filter: drop-shadow(0 0 5px #c084fc) drop-shadow(0 0 12px rgba(192,132,252,.35)); }
          50%      { opacity:1;   filter: drop-shadow(0 0 14px #e879f9) drop-shadow(0 0 28px rgba(232,121,249,.65)) drop-shadow(0 0 42px rgba(251,191,36,.25)); }
        }
        .pi-latex-glow { animation: piGlow 2.4s ease-in-out infinite; color: #e879f9; }
        .pi-latex-glow .katex { font-size: 1.35em; }
        .pi-latex-result { color: #fbbf24; letter-spacing:.04em; }
      `}</style>

      {hasSeen && (
        <div className="flex flex-col items-center gap-1 pb-1"
          style={{ animation: 'fadeInUp .6s ease both' }}>
          <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
          <div className="pi-latex-glow">
            <BlockMath math={String.raw`\begin{aligned} \pi &= \dfrac{C}{d} \\[4pt] &\approx {\color{#fbbf24} 3{,}14159{\small\color{#fbbf2499}{...}}} \end{aligned}`} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Keliling Luas Circles SVG ──────────────────────────── */
const KelilingLuasCirclesSVG = ({ t }: { t: T }) => (
  <div className="w-full">
    <style>{`
      @keyframes kelilingPulse {
        0%,100% { stroke-opacity:.55; filter: drop-shadow(0 0 4px #22d3ee) drop-shadow(0 0 10px rgba(34,211,238,.4)); }
        50%      { stroke-opacity:1;   filter: drop-shadow(0 0 10px #22d3ee) drop-shadow(0 0 28px rgba(34,211,238,.75)) drop-shadow(0 0 48px rgba(34,211,238,.35)); }
      }
      @keyframes kelilingDash {
        from { stroke-dashoffset: 502; }
        to   { stroke-dashoffset: 0;   }
      }
      @keyframes kelilingOrbit {
        from { transform: rotate(0deg);   }
        to   { transform: rotate(360deg); }
      }
      @keyframes luasPulse {
        0%,100% { opacity:.82; filter: drop-shadow(0 0 8px #fb923c)  drop-shadow(0 0 22px rgba(251,146,60,.55)); }
        50%      { opacity:1;   filter: drop-shadow(0 0 12px #fb923c) drop-shadow(0 0 32px rgba(251,146,60,.75)); }
      }
      @keyframes fadeScaleIn {
        from { opacity:0; transform:scale(.82); }
        to   { opacity:1; transform:scale(1);   }
      }
      .keliling-ring { animation: kelilingPulse 2.2s ease-in-out infinite, kelilingDash 1.8s ease-out forwards; }
      .keliling-orbit { transform-origin: 80px 80px; animation: kelilingOrbit 6s linear infinite; }
      .luas-fill { animation: luasPulse 2.4s ease-in-out infinite; }
      .circle-card { animation: fadeScaleIn .7s cubic-bezier(.22,1,.36,1) both; }
      .circle-card-right { animation: fadeScaleIn .7s .18s cubic-bezier(.22,1,.36,1) both; }
    `}</style>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">

      <div className="circle-card flex flex-col items-center gap-2 bg-cyan-500/8 border border-cyan-500/30 rounded-2xl px-3 py-4 text-center">
        <p className="font-body text-xs font-bold text-cyan-300 tracking-wide uppercase">{t.circLabel}</p>
        <svg viewBox="0 0 160 160" className="w-full max-w-[140px]" aria-label={t.circAria}>
          <defs>
            <radialGradient id="kGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#22d3ee" stopOpacity=".06" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"   />
            </radialGradient>
          </defs>
          <circle cx="80" cy="80" r="58" fill="url(#kGlow)" />
          <circle cx="80" cy="80" r="58" fill="none"
            stroke="#22d3ee" strokeWidth="12" strokeOpacity=".12"
            className="keliling-ring"
            strokeDasharray="502" strokeDashoffset="502" />
          <circle cx="80" cy="80" r="58" fill="none"
            stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round"
            className="keliling-ring"
            strokeDasharray="502" strokeDashoffset="502" />
          <g className="keliling-orbit">
            <circle cx="138" cy="80" r="5" fill="#22d3ee" opacity=".9"
              style={{ filter: 'drop-shadow(0 0 6px #22d3ee) drop-shadow(0 0 14px rgba(34,211,238,.8))' }} />
          </g>
          <circle cx="80" cy="80" r="3" fill="#94a3b8" opacity=".5" />
          <line x1="80" y1="80" x2="138" y2="80"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" opacity=".6" />
          <text x="110" y="74" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity=".8">r</text>
        </svg>
        <p className="font-body text-[10px] text-white/45 leading-snug">
          {t.circEdge}<span className="text-cyan-300 font-semibold">{t.circEdgeBold}</span>{t.circEdge2}
        </p>
        <div className="w-full bg-green-900/30 border border-green-500/40 rounded-xl p-3 text-center">
          <p className="font-body text-xs font-bold text-green-300 mb-1">{t.circFormTitle}</p>
          <BlockMath math="K = \pi \times d" />
          <p className="font-body text-[10px] text-white/50">{t.circFormOr}</p>
          <BlockMath math="K = 2\pi r" />
          <p className="font-body text-[10px] text-white/40 mt-1">{t.circNote}</p>
        </div>
      </div>

      <div className="circle-card-right flex flex-col items-center gap-2 bg-orange-500/8 border border-orange-500/30 rounded-2xl px-3 py-4 text-center">
        <p className="font-body text-xs font-bold text-orange-300 tracking-wide uppercase">{t.areaLabel}</p>
        <svg viewBox="0 0 160 160" className="w-full max-w-[140px]" aria-label={t.areaAria}>
          <defs>
            <radialGradient id="lGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fb923c" stopOpacity="1"   />
              <stop offset="70%"  stopColor="#fb923c" stopOpacity=".55" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0"   />
            </radialGradient>
            <radialGradient id="lGlowOuter" cx="50%" cy="50%" r="50%">
              <stop offset="60%"  stopColor="#fb923c" stopOpacity="0"   />
              <stop offset="100%" stopColor="#fb923c" stopOpacity=".18" />
            </radialGradient>
          </defs>
          <circle cx="80" cy="80" r="58" fill="none"
            stroke="#fb923c" strokeWidth="2" strokeOpacity=".22" />
          <circle cx="80" cy="80" r="57" fill="url(#lGlow)"
            fillOpacity="1" className="luas-fill" />
          <circle cx="80" cy="80" r="57" fill="url(#lGlowOuter)"
            fillOpacity="1" className="luas-fill" />
          <line x1="80" y1="80" x2="130" y2="80"
            stroke="#fdba74" strokeWidth="2" strokeLinecap="round" opacity=".85" />
          <polygon points="130,76 138,80 130,84" fill="#fdba74" opacity=".85" />
          <text x="106" y="74" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>
          <circle cx="80" cy="80" r="3.5" fill="#fdba74" opacity=".9"
            style={{ filter: 'drop-shadow(0 0 5px #fb923c)' }} />
        </svg>
        <p className="font-body text-[10px] text-white/45 leading-snug">
          {t.areaInner}<span className="text-orange-300 font-semibold">{t.areaInnerBold}</span>{t.areaInner2}
        </p>
        <div className="w-full bg-orange-900/30 border border-orange-500/40 rounded-xl p-3 text-center">
          <p className="font-body text-xs font-bold text-orange-300 mb-1">{t.areaFormTitle}</p>
          <BlockMath math="L = \pi \times r^2" />
          <p className="font-body text-[10px] text-white/50">{t.areaFormOr}</p>
          <BlockMath math="L = \frac{1}{4}\pi d^2" />
          <p className="font-body text-[10px] text-white/40 mt-1">{t.areaNote}</p>
        </div>
      </div>

    </div>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────── */
const KelilingLuasPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const { isDark } = useTheme();

  const SectionHeader = ({ icon, iconColor, title }: { icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4 text-left">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className={`font-body font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>{title}</span>
      </div>
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

          {/* Pi Section */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.piSectionTitle} />
            <div className="px-5 pb-5 space-y-4">
              <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} leading-relaxed`}>
                {t.piIntro}<strong className="text-cyan-300">{t.piName}</strong>{t.piIntro2}
                <strong className="text-yellow-300">{t.piVal}</strong>{t.piIntro3}
              </p>
              <PiAnimationSVG t={t} />
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-cyan-200">
                  {t.piBoxTitle}<br/>
                  • {t.piB1}<br/>
                  • {t.piB2}
                </p>
              </div>
            </div>
          </div>

          {/* Formula Section */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.formulaSectionTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-3">{t.formulaIntroTitle}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} mb-2`}>{t.formulaIntro}</p>
              </div>
              <KelilingLuasCirclesSVG t={t} />
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">{t.unitNote}</p>
              </div>
            </div>
          </div>

          {/* Contoh 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title={t.c1_header} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c1_level}</p>
                <p className="font-body text-sm text-white/90">
                  {t.c1_q}<InlineMath math="\pi = \frac{22}{7}"/>.
                </p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c1_sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c1_known}<InlineMath math="d = 70"/> cm, <InlineMath math="\pi = \frac{22}{7}"/></p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c1_use}</p>
                <BlockMath math="K = \pi \times d" />
                <BlockMath math="K = \frac{22}{7} \times 70" />
                <BlockMath math="K = 22 \times 10 = 220 \,\mathrm{cm}" />
                <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-green-300 text-center">✅ {t.c1_check}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contoh 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title={t.c2_header} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c2_level}</p>
                <p className="font-body text-sm text-white/90">
                  {t.c2_q}<InlineMath math="\pi = \frac{22}{7}"/>{t.c2_q2}
                </p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c2_sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c2_step1}</strong> {t.c2_step1desc}</p>
                <BlockMath math="K = 2\pi r \Rightarrow 88 = 2 \times \frac{22}{7} \times r" />
                <BlockMath math="88 = \frac{44}{7} \times r \Rightarrow r = 88 \times \frac{7}{44} = 14 \,\mathrm{m}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c2_step2}</strong> {t.c2_step2desc}</p>
                <BlockMath math="L = \pi r^2 = \frac{22}{7} \times 14^2 = \frac{22}{7} \times 196 = 22 \times 28 = 616 \,\mathrm{m}^2" />
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200 text-center">✅ {t.c2_check}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contoh 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.c3_header} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c3_level}</p>
                <p className="font-body text-sm text-white/90">
                  {t.c3_q}<InlineMath math="\pi = \frac{22}{7}"/>{t.c3_q2}
                </p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c3_sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c3_step1}</strong> {t.c3_step1desc}</p>
                <BlockMath math="R = 10 + 3{,}5 = 13{,}5 \,\mathrm{m}" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c3_step2}</strong> {t.c3_step2desc}</p>
                <BlockMath math={`${t.f_Lbesar} = \\pi R^2 = \\frac{22}{7} \\times (13{,}5)^2 = \\frac{22}{7} \\times 182{,}25 \\approx 572{,}79 \\,\\mathrm{m}^2`} />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c3_step3}</strong> {t.c3_step3desc}</p>
                <BlockMath math={`${t.f_Lkecil} = \\pi r^2 = \\frac{22}{7} \\times 10^2 = \\frac{22}{7} \\times 100 \\approx 314{,}29 \\,\\mathrm{m}^2`} />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c3_step4}</strong> {t.c3_step4desc}</p>
                <BlockMath math={`${t.f_Ljalur} = 572{,}79 - 314{,}29 = 258{,}5 \\,\\mathrm{m}^2`} />
                <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-red-200 text-center">✅ {t.c3_check}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rangkuman */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.rangkuman_header} />
            <div className="px-5 pb-5 space-y-3">
              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• <strong className={isDark ? "text-cyan-300" : "text-cyan-700"}>{t.r_pi}</strong> {t.r_pi_desc}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• <strong className={isDark ? "text-green-300" : "text-green-700"}>{t.r_K}</strong> <InlineMath math="K = \pi d = 2\pi r"/></p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• <strong className={isDark ? "text-orange-300" : "text-orange-700"}>{t.r_L}</strong> <InlineMath math="L = \pi r^2"/></p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>• {t.r_ring} <InlineMath math="L = \pi(R^2 - r^2)"/></p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">{t.tips}</p>
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

export default KelilingLuasPage;
