import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, Wrench } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "SABUK LILITAN MINIMAL (PENERAPAN)",
    subtitle: "Kelas 8 · Garis Singgung Lingkaran · Materi Matematika",
    back: "← Kembali ke Garis Singgung Lingkaran",
    sec_intro: "🌟 Matematika di Pabrik dan Mesin!",
    sec_rumus: "📐 Rumus Sabuk Lilitan",
    sec_kalkulator: "🔧 Kalkulator Sabuk Interaktif",
    sec_contoh1: "✏️ Contoh 1 — Dua Roda Sama Besar (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Tiga Roda Segaris (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — Dua Roda Berbeda Ukuran (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab & Seluruh Materi",
    intro_p: "Pernahkah kamu melihat mesin dengan dua roda yang dihubungkan sabuk? Misalnya mesin sepeda atau treadmill? Para insinyur perlu menghitung panjang sabuk minimal yang diperlukan agar sabuk pas melilit kedua roda tanpa kendur. Inilah penerapan nyata garis singgung lingkaran yang kita pelajari!",
    intro_bold: "panjang sabuk minimal",
    comp_title: "🏭 Komponen Panjang Sabuk",
    comp1_num: "①",
    comp1_text: "Segmen lurus: bagian sabuk yang menyentuh garis singgung persekutuan",
    comp2_num: "②",
    comp2_text: "Busur lingkaran: bagian sabuk yang melilit setiap roda",
    key_tip: "💡 Kunci: Panjang sabuk minimal = jumlah segmen lurus + jumlah busur pada setiap lingkaran.",
    key_bold1: "jumlah segmen lurus",
    key_bold2: "jumlah busur",
    intisari: "🎯 Ringkasan Intisari",
    intisari_desc: "Ada dua kasus utama: sabuk melilit dua lingkaran sama besar (lebih sederhana) dan berbeda besar. Kasus sama besar adalah yang paling sering muncul di soal SMP.",
    intisari_bold1: "sama besar",
    intisari_bold2: "berbeda besar",
    case1_title: "📋 Kasus 1: Dua Lingkaran Sama Besar (R = r)",
    case1_desc: "Sabuk terdiri dari: 2 segmen lurus (panjang masing-masing = d) + 2 setengah lingkaran (total = 1 lingkaran penuh).",
    case1_where: "di mana d = jarak antar pusat, r = jari-jari masing-masing lingkaran.",
    case2_title: "📋 Kasus 2: Dua Lingkaran Berbeda Besar (R ≠ r)",
    case2_desc: "Sabuk terdiri dari: 2 segmen GSPL + busur besar + busur kecil.",
    smp_tip: "💡 Untuk soal SMP: Jika soal hanya meminta panjang sabuk secara sederhana (dua lingkaran sama besar), gunakan rumus L = 2d + 2πr. Rumus lengkap untuk berbeda besar biasanya dipelajari di SMA.",
    calc_title: "🔧 Kalkulator Sabuk Lilitan",
    calc_intro: "Masukkan nilai dan hitung panjang sabuk! (Jika R = r, gunakan rumus sederhana. Jika berbeda, gunakan perkiraan.)",
    label_R: "Jari-jari R (cm)",
    label_r: "Jari-jari r (cm)",
    label_d: "Jarak pusat d (cm)",
    btn_calc: "Hitung!",
    err_input: "Masukkan nilai yang valid!",
    res_equal: "L = 2d + 2πr",
    res_luar: "l_luar",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1_problem: "Sebuah mesin memiliki dua roda silinder berjari-jari 7 cm yang berjarak pusat 30 cm. Tentukan panjang sabuk minimal yang diperlukan! (Gunakan π = 22/7)",
    c1_given: "Dua roda sama besar (r = 7 cm), d = 30 cm. Gunakan: L = 2d + 2πr.",
    c1_ans: "✅ Panjang sabuk minimal = 104 cm.",
    c2_problem: "Tiga silinder berjari-jari 14 cm disusun berjajar dan diikat sabuk keliling. Tentukan panjang sabuk minimal! (π = 22/7)",
    c2_step1: "Tiga silinder bersentuhan: jarak pusat ke pusat = d = 2r = 28 cm. Ada 2 celah, jadi total segmen lurus = 4 × 28 cm. Busur total: setiap silinder di ujung = setengah lingkaran, silinder tengah = 1 lingkaran penuh. Total busur = 2 × setengah + 1 = 2 lingkaran penuh.",
    c2_step2: "Pendekatan SMP: 4 segmen lurus (masing-masing = d=28) + busur keliling (= 4πr untuk sudut efektif):",
    c2_ans: "✅ Panjang sabuk minimal ≈ 288 cm.",
    c3_problem: "Sebuah mesin memiliki roda besar berjari-jari 20 cm dan roda kecil berjari-jari 8 cm dengan jarak pusat 52 cm. Tentukan panjang sabuk GSPL (bagian lurus × 2), lalu perkirakan panjang sabuk total jika busur total = π(R+r)!",
    c3_step1: "Langkah 1: Hitung panjang GSPL.",
    c3_step2: "Langkah 2: Estimasi panjang sabuk total.",
    c3_ans: "✅ Panjang GSPL = 16√10 ≈ 50,60 cm. Panjang sabuk total ≈ 189,16 cm.",
    sum_belt: "Sabuk Lilitan:",
    sum_equal: "• Sama besar (R=r):",
    sum_diff: "• Berbeda besar:",
    sum_approx: "(approx. SMP)",
    sum_recap: "Recap Seluruh Materi:",
    recap_rows: [
      ["Garis Singgung", "Menyentuh lingkaran di 1 titik; OT ⊥ garis"],
      ["Panjang Singgung", "l = √(d² − r²)"],
      ["GSPL", "l_luar = √(d² − (R−r)²)"],
      ["GSPD", "l_dalam = √(d² − (R+r)²)"],
      ["Sabuk (sama besar)", "L = 2d + 2πr"],
    ],
    tip_label: "🚀 Tips Astronot:",
    tip_text: "Mekanisme sabuk-roda digunakan di sistem roket dan teleskop luar angkasa! Sabuk transmisi pada teleskop Hubble menghubungkan motor ke lensa dengan prinsip persis yang kamu pelajari hari ini.",
  },
  en: {
    title: "MINIMUM BELT LENGTH (APPLICATION)",
    subtitle: "Grade 8 · Circle Tangent Lines · Math Book",
    back: "← Back to Circle Tangent Lines",
    sec_intro: "🌟 Math in Factories and Machines!",
    sec_rumus: "📐 Belt Length Formula",
    sec_kalkulator: "🔧 Interactive Belt Calculator",
    sec_contoh1: "✏️ Example 1 — Two Equal Wheels (Easy)",
    sec_contoh2: "✏️ Example 2 — Three Wheels in a Row (Medium)",
    sec_contoh3: "✏️ Example 3 — Two Different-Sized Wheels (Hard)",
    sec_rangkuman: "📌 Sub-Topic & Full Topic Summary",
    intro_p: "Have you seen a machine with two wheels connected by a belt? Like a bicycle or treadmill? Engineers need to calculate the minimum belt length so the belt fits tightly around both wheels without sagging. This is a real application of circle tangent lines!",
    intro_bold: "minimum belt length",
    comp_title: "🏭 Belt Length Components",
    comp1_num: "①",
    comp1_text: "Straight segments: the part of the belt that touches the common tangent lines",
    comp2_num: "②",
    comp2_text: "Arcs: the part of the belt that wraps around each wheel",
    key_tip: "💡 Key: Minimum belt length = sum of straight segments + sum of arcs on each circle.",
    key_bold1: "sum of straight segments",
    key_bold2: "sum of arcs",
    intisari: "🎯 Key Summary",
    intisari_desc: "There are two main cases: belt around two equal circles (simpler) and different-sized circles. The equal case is most common in junior high exams.",
    intisari_bold1: "equal circles",
    intisari_bold2: "different-sized circles",
    case1_title: "📋 Case 1: Two Equal Circles (R = r)",
    case1_desc: "The belt consists of: 2 straight segments (each length = d) + 2 semicircles (total = 1 full circle).",
    case1_where: "where d = distance between centers, r = radius of each circle.",
    case2_title: "📋 Case 2: Two Different-Sized Circles (R ≠ r)",
    case2_desc: "The belt consists of: 2 ECT segments + major arc + minor arc.",
    smp_tip: "💡 For junior high exams: If the problem only asks for a simple belt length (two equal circles), use L = 2d + 2πr. The full formula for different sizes is usually taught in high school.",
    calc_title: "🔧 Belt Length Calculator",
    calc_intro: "Enter values and calculate belt length! (If R = r, uses the simple formula. If different, uses an approximation.)",
    label_R: "Radius R (cm)",
    label_r: "Radius r (cm)",
    label_d: "Center distance d (cm)",
    btn_calc: "Calculate!",
    err_input: "Please enter valid values!",
    res_equal: "L = 2d + 2πr",
    res_luar: "outer tangent l",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1_problem: "A machine has two cylindrical wheels each with radius 7 cm and centers 30 cm apart. Find the minimum belt length! (Use π = 22/7)",
    c1_given: "Two equal wheels (r = 7 cm), d = 30 cm. Use: L = 2d + 2πr.",
    c1_ans: "✅ Minimum belt length = 104 cm.",
    c2_problem: "Three cylinders each with radius 14 cm are arranged in a row and wrapped with a belt. Find the minimum belt length! (π = 22/7)",
    c2_step1: "Three touching cylinders: center-to-center distance = d = 2r = 28 cm. 2 gaps, so total straight = 4 × 28 cm. Total arcs: end cylinders = semicircle each, middle cylinder = full circle. Total arcs = 2 full circles.",
    c2_step2: "Junior high approach: 4 straight segments (each = d=28) + arcs (= 4πr for effective angle):",
    c2_ans: "✅ Minimum belt length ≈ 288 cm.",
    c3_problem: "A machine has a large wheel (radius 20 cm) and small wheel (radius 8 cm) with centers 52 cm apart. Find the ECT belt segments (× 2), then estimate total belt length if total arc = π(R+r)!",
    c3_step1: "Step 1: Calculate ECT length.",
    c3_step2: "Step 2: Estimate total belt length.",
    c3_ans: "✅ ECT length = 16√10 ≈ 50.60 cm. Total belt length ≈ 189.16 cm.",
    sum_belt: "Belt Length:",
    sum_equal: "• Equal (R=r):",
    sum_diff: "• Different sizes:",
    sum_approx: "(approx.)",
    sum_recap: "Full Topic Recap:",
    recap_rows: [
      ["Tangent Line", "Touches circle at 1 point; OT ⊥ line"],
      ["Tangent Length", "l = √(d² − r²)"],
      ["ECT", "l_out = √(d² − (R−r)²)"],
      ["ICT", "l_in = √(d² − (R+r)²)"],
      ["Belt (equal)", "L = 2d + 2πr"],
    ],
    tip_label: "🚀 Astronaut Tip:",
    tip_text: "Belt-and-wheel mechanisms are used in rocket systems and space telescopes! The transmission belt on the Hubble Telescope connects the motor to the lens using the exact principle you learned today.",
  },
  ja: {
    title: "最小ベルト長（応用）",
    subtitle: "中学2年 · 円の接線 · 数学テキスト",
    back: "← 円の接線に戻る",
    sec_intro: "🌟 工場と機械の数学！",
    sec_rumus: "📐 ベルト長の公式",
    sec_kalkulator: "🔧 インタラクティブ計算機",
    sec_contoh1: "✏️ 例題1 — 同径の2つの車輪（基本）",
    sec_contoh2: "✏️ 例題2 — 一列の3つの車輪（標準）",
    sec_contoh3: "✏️ 例題3 — 異径の2つの車輪（発展）",
    sec_rangkuman: "📌 小単元・全体まとめ",
    intro_p: "自転車やトレッドミルのようにベルトでつながれた2つの車輪を見たことがありますか？エンジニアはベルトがたるまないように必要な最小ベルト長を計算する必要があります。これが今日学んだ円の接線の実際の応用です！",
    intro_bold: "最小ベルト長",
    comp_title: "🏭 ベルト長の構成要素",
    comp1_num: "①",
    comp1_text: "直線部分：共通接線に接するベルトの部分",
    comp2_num: "②",
    comp2_text: "弧部分：各車輪に巻き付くベルトの部分",
    key_tip: "💡 ポイント：最小ベルト長 = 直線部分の合計 + 各円の弧の合計。",
    key_bold1: "直線部分の合計",
    key_bold2: "弧の合計",
    intisari: "🎯 要点まとめ",
    intisari_desc: "主に2つのケース：等しい円（シンプル）と異なる大きさの円。等しい場合が中学の試験では最もよく出ます。",
    intisari_bold1: "等しい円",
    intisari_bold2: "異なる大きさの円",
    case1_title: "📋 ケース1：同じ大きさの2つの円（R = r）",
    case1_desc: "ベルトの構成：2つの直線部分（各長さ = d）+ 2つの半円（合計 = 1つの全円）。",
    case1_where: "d = 中心間距離、r = 各円の半径。",
    case2_title: "📋 ケース2：異なる大きさの2つの円（R ≠ r）",
    case2_desc: "ベルトの構成：外接共通接線2本分 + 大弧 + 小弧。",
    smp_tip: "💡 中学試験向け：問題が同径の簡単なベルト長を求める場合は、L = 2d + 2πrを使う。異径の完全な公式は高校で学ぶ。",
    calc_title: "🔧 ベルト長計算機",
    calc_intro: "値を入力してベルト長を計算！（R = rの場合は簡単な公式を使用。異なる場合は近似値を使用。）",
    label_R: "半径 R (cm)",
    label_r: "半径 r (cm)",
    label_d: "中心距離 d (cm)",
    btn_calc: "計算！",
    err_input: "有効な値を入力してください！",
    res_equal: "L = 2d + 2πr",
    res_luar: "外接共通接線 l",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解説",
    c1_problem: "ある機械に半径7 cmの2つの円筒形の車輪があり、中心間距離が30 cmです。必要な最小ベルト長を求めなさい！（π = 22/7を使用）",
    c1_given: "同じ大きさの車輪（r = 7 cm）、d = 30 cm。使用式：L = 2d + 2πr。",
    c1_ans: "✅ 最小ベルト長 = 104 cm。",
    c2_problem: "半径14 cmの3つの円柱が一列に並びベルトで囲まれています。最小ベルト長を求めなさい！（π = 22/7）",
    c2_step1: "3つの接触円柱：中心間距離 = d = 2r = 28 cm。2つのすき間があるので直線合計 = 4 × 28 cm。弧合計：両端 = 半円ずつ、真ん中 = 全円。合計 = 2全円。",
    c2_step2: "中学レベルのアプローチ：4つの直線部分（各 = d=28）+ 弧（= 4πr）：",
    c2_ans: "✅ 最小ベルト長 ≈ 288 cm。",
    c3_problem: "大きな車輪（半径20 cm）と小さな車輪（半径8 cm）の中心間距離が52 cmです。外接共通接線の長さ（× 2）を求め、弧合計 = π(R+r)としてベルト長を推定しなさい！",
    c3_step1: "ステップ1：外接共通接線の長さを計算する。",
    c3_step2: "ステップ2：ベルト長の合計を推定する。",
    c3_ans: "✅ 外接共通接線の長さ = 16√10 ≈ 50.60 cm。ベルト長合計 ≈ 189.16 cm。",
    sum_belt: "ベルト長：",
    sum_equal: "• 同径 (R=r)：",
    sum_diff: "• 異径：",
    sum_approx: "（中学近似）",
    sum_recap: "全体まとめ：",
    recap_rows: [
      ["接線", "円に1点で接する；OT ⊥ 接線"],
      ["接線の長さ", "l = √(d² − r²)"],
      ["外接共通接線", "l = √(d² − (R−r)²)"],
      ["内接共通接線", "l = √(d² − (R+r)²)"],
      ["ベルト（同径）", "L = 2d + 2πr"],
    ],
    tip_label: "🚀 宇宙飛行士のヒント：",
    tip_text: "ベルト-車輪のメカニズムはロケットや宇宙望遠鏡にも使われています！ハッブル宇宙望遠鏡の伝達ベルトは今日学んだ原理でモーターとレンズを接続しています。",
  },
};

type TranslationKey = keyof typeof translations.id;

/* ── SVG: Belt around two equal circles ── */
const SabukSamaBesarSVG = () => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-2" aria-label="Belt around two equal circles">
    <defs>
      <style>{`
        @keyframes beltGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #f97316);}50%{stroke-opacity:0.4;filter:none;}}
        .belt{animation:beltGlow 2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="90" cy="100" r="55" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="90" cy="100" r="4" fill="#3b82f6"/>
    <text x="76" y="97" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">O₁</text>
    <circle cx="250" cy="100" r="55" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="250" cy="100" r="4" fill="#a855f7"/>
    <text x="255" y="97" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">O₂</text>
    <line x1="90" y1="45" x2="250" y2="45" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    <line x1="90" y1="155" x2="250" y2="155" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    <path d="M90,45 A55,55 0 0,0 90,155" fill="none" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    <path d="M250,45 A55,55 0 0,1 250,155" fill="none" stroke="#f97316" strokeWidth="3.5" className="belt"/>
    <line x1="90" y1="100" x2="250" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7"/>
    <text x="170" y="115" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">d</text>
    <text x="90" y="68" fill="#60a5fa" fontSize="9" textAnchor="middle" fontFamily="monospace">r</text>
    <text x="250" y="68" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">r</text>
    <text x="170" y="38" fill="#fb923c" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">d</text>
    <rect x="5" y="178" width="330" height="20" rx="5" fill="rgba(30,41,59,0.9)" stroke="#334155"/>
    <text x="170" y="192" fill="#f97316" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">L = 2d + 2πr</text>
  </svg>
);

/* ── SVG: Belt around two different circles ── */
const SabukBedaBesarSVG = () => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-2" aria-label="Belt around two different circles">
    <defs>
      <style>{`@keyframes beltX{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #22c55e);}50%{stroke-opacity:0.4;filter:none;}}.beltx{animation:beltX 2s ease-in-out infinite;}`}</style>
    </defs>
    <circle cx="85" cy="105" r="60" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2.5"/>
    <circle cx="85" cy="105" r="4" fill="#3b82f6"/>
    <text x="70" y="102" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">O₁</text>
    <circle cx="255" cy="115" r="38" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2.5"/>
    <circle cx="255" cy="115" r="4" fill="#a855f7"/>
    <text x="260" y="112" fill="#c084fc" fontSize="11" fontFamily="monospace" fontWeight="bold">O₂</text>
    <line x1="60" y1="47" x2="233" y2="77" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    <line x1="60" y1="163" x2="233" y2="153" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    <path d="M60,47 A60,60 0 0,0 60,163" fill="none" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    <path d="M233,77 A38,38 0 0,1 233,153" fill="none" stroke="#22c55e" strokeWidth="3" className="beltx"/>
    <text x="55" y="82" fill="#60a5fa" fontSize="9" fontFamily="monospace">R</text>
    <text x="248" y="92" fill="#c084fc" fontSize="9" fontFamily="monospace">r</text>
    <line x1="85" y1="105" x2="255" y2="115" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
    <text x="170" y="128" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">d</text>
  </svg>
);

/* ── Interactive Belt Calculator ── */
const BeltCalculator = ({ labels }: {
  labels: { R: string; r: string; d: string; btn: string; err: string; resEqual: string; resLuar: string }
}) => {
  const [r1, setR1] = useState("");
  const [r2, setR2] = useState("");
  const [d, setD] = useState("");
  const [result, setResult] = useState<null | string>(null);

  const calc = () => {
    const R = parseFloat(r1), r = parseFloat(r2), dist = parseFloat(d);
    if (isNaN(R) || isNaN(r) || isNaN(dist) || R <= 0 || r <= 0 || dist <= 0) {
      setResult(labels.err); return;
    }
    if (Math.abs(R - r) < 0.001) {
      const L = 2 * dist + 2 * Math.PI * R;
      setResult(`${labels.resEqual} = 2×${dist} + 2π×${R} = ${(2*dist).toFixed(2)} + ${(2*Math.PI*R).toFixed(2)} ≈ ${L.toFixed(2)} cm`);
    } else {
      const luar = Math.sqrt(dist*dist - (R-r)*(R-r));
      const L = 2 * luar + Math.PI * (R + r);
      setResult(`${labels.resLuar} = √(${dist}² - (${R}-${r})²) ≈ ${luar.toFixed(2)} cm\nL ≈ 2×${luar.toFixed(2)} + π×(${R}+${r}) ≈ ${L.toFixed(2)} cm`);
    }
  };

  const fields = [
    { val: r1, set: setR1, label: labels.R },
    { val: r2, set: setR2, label: labels.r },
    { val: d,  set: setD,  label: labels.d },
  ];

  return (
    <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-4 space-y-3">
      <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{labels.btn === "Hitung!" ? "🔧 Kalkulator Sabuk Lilitan" : labels.btn === "計算！" ? "🔧 ベルト計算機" : "🔧 Belt Calculator"}</p>
      <div className="flex gap-2 flex-wrap">
        {fields.map(({ val, set, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="font-body text-xs text-white/50">{label}</label>
            <input type="number" min="0.1" step="0.1" value={val}
              onChange={e => { set(e.target.value); setResult(null); }}
              className="w-28 bg-slate-900/60 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm font-body focus:outline-none"
              placeholder="..." />
          </div>
        ))}
        <button onClick={calc}
          className="mt-5 px-4 py-2 bg-orange-700/60 border border-orange-500 text-orange-300 rounded-lg text-xs font-bold font-body hover:bg-orange-600/60 transition-colors cursor-pointer">
          {labels.btn}
        </button>
      </div>
      {result && (
        <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-3">
          <pre className="font-body text-sm text-orange-200 whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

const SabukLilitanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] as Record<TranslationKey, string>;
  const recapRows = translations[language].recap_rows;

  const [open, setOpen] = useState<string[]>(["intro", "rumus", "kalkulator", "contoh1", "contoh2", "contoh3", "rangkuman"]);

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

  const calcLabels = {
    R: t.label_R,
    r: t.label_r,
    d: t.label_d,
    btn: t.btn_calc,
    err: t.err_input,
    resEqual: t.res_equal,
    resLuar: t.res_luar,
  };

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
                  <strong className="text-cyan-300">{t.intro_bold}</strong>
                  {t.intro_p.split(t.intro_bold)[1]}
                </p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-cyan-300 font-semibold text-sm mb-2">{t.comp_title}</p>
                  <div className="space-y-2 text-xs font-body">
                    <div className="flex items-center gap-2 bg-orange-900/30 rounded-lg px-3 py-2">
                      <span className="text-orange-300 font-bold">{t.comp1_num}</span>
                      <p className="text-white/80">{t.comp1_text}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-900/30 rounded-lg px-3 py-2">
                      <span className="text-blue-300 font-bold">{t.comp2_num}</span>
                      <p className="text-white/80">{t.comp2_text}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.key_tip.split(t.key_bold1)[0]}
                    <strong className="text-cyan-300">{t.key_bold1}</strong>
                    {t.key_tip.split(t.key_bold1)[1]?.split(t.key_bold2)[0]}
                    <strong className="text-orange-300">{t.key_bold2}</strong>
                    {t.key_tip.split(t.key_bold2)[1]}
                  </p>
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
                    {t.intisari_desc.split(t.intisari_bold1)[0]}
                    <strong className="text-cyan-300">{t.intisari_bold1}</strong>
                    {t.intisari_desc.split(t.intisari_bold1)[1]?.split(t.intisari_bold2)[0]}
                    <strong className="text-yellow-300">{t.intisari_bold2}</strong>
                    {t.intisari_desc.split(t.intisari_bold2)[1]}
                  </p>
                </div>
                <SabukSamaBesarSVG />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.case1_title}</p>
                  <p className="font-body text-sm text-white/80">{t.case1_desc}</p>
                  <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-3">
                    <BlockMath math="L_{sabuk} = 2d + 2\pi r" />
                  </div>
                  <p className="font-body text-sm text-white/60 mt-2">{t.case1_where}</p>
                </div>
                <SabukBedaBesarSVG />
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.case2_title}</p>
                  <p className="font-body text-sm text-white/80">{t.case2_desc}</p>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="L_{sabuk} = 2l_{luar} + \pi(R + r) + 2(R-r)\arcsin\!\left(\frac{R-r}{d}\right)" />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200">{t.smp_tip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KALKULATOR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kalkulator" icon={<Wrench className="w-5 h-5" />} iconColor="text-orange-400" title={t.sec_kalkulator} />
            {open.includes("kalkulator") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70">{t.calc_intro}</p>
                <BeltCalculator labels={calcLabels} />
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
                  <p className="font-body text-sm text-white/80">{t.c1_given}</p>
                  <BlockMath math="L = 2(30) + 2 \times \frac{22}{7} \times 7" />
                  <BlockMath math="L = 60 + 2 \times 22 = 60 + 44" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="L = 104 \mathrm{\ cm}" />
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
                  <p className="font-body text-sm text-white/80">{t.c2_step2}</p>
                  <BlockMath math="L = 4 \times 28 + 2 \times 2\pi \times 14" />
                  <BlockMath math="L = 112 + 4 \times \frac{22}{7} \times 14 = 112 + 176" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="L = 288 \mathrm{\ cm}" />
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
                  <BlockMath math="l_{luar} = \sqrt{d^2 - (R-r)^2} = \sqrt{52^2 - (20-8)^2}" />
                  <BlockMath math="= \sqrt{2704 - 144} = \sqrt{2560} = 16\sqrt{10} \approx 50{,}60 \mathrm{\ cm}" />
                  <p className="font-body text-sm text-white/80"><strong>{t.c3_step2}</strong></p>
                  <BlockMath math="L_{sabuk} \approx 2 \times l_{luar} + \pi(R+r)" />
                  <BlockMath math="= 2 \times 50{,}60 + \pi \times 28" />
                  <BlockMath math="= 101{,}20 + 87{,}96 \approx 189{,}16 \mathrm{\ cm}" />
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
                  <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.sum_belt}</p>
                  <p className="font-body text-sm text-white/80">{t.sum_equal} <InlineMath math="L = 2d + 2\pi r"/></p>
                  <p className="font-body text-sm text-white/80">{t.sum_diff} <InlineMath math="L \approx 2l_{luar} + \pi(R+r)"/> {t.sum_approx}</p>
                  <p className="font-body text-sm font-bold text-yellow-300 mt-3 mb-1">{t.sum_recap}</p>
                  <div className="grid grid-cols-1 gap-1 text-xs font-body">
                    {recapRows.map(([term, formula]) => (
                      <div key={term} className="flex gap-2 bg-slate-800/60 rounded-lg px-3 py-1.5">
                        <span className="text-cyan-300 font-bold min-w-[120px]">{term}</span>
                        <span className="text-white/70">{formula}</span>
                      </div>
                    ))}
                  </div>
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

export default SabukLilitanPage;
