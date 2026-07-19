import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const translations = {
  id: {
    title: "PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS",
    subtitle: "Kelas 8 · Teorema Pythagoras · Materi Matematika",
    back: "← Kembali ke Teorema Pythagoras",
    sec_intro: "🌟 Sudut Istimewa yang Wajib Dikuasai",
    sec_interaktif: "🎮 Animasi Interaktif — Perbesar Segitiga Sudut Khusus",
    sec_45: "📐 Segitiga 45°-45°-90°",
    sec_30: "📐 Segitiga 30°-60°-90°",
    sec_perbandingan: "📊 Tabel Perbandingan Sudut Khusus",
    sec_contoh1: "✏️ Contoh 1 — Segitiga 45-45-90 (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Segitiga 30-60-90 (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — Gabungan Dua Segitiga Khusus (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    intisari: "🎯 Ringkasan Intisari",
    introDesc: "Ada dua jenis segitiga siku-siku spesial yang perbandingan sisinya sudah bisa kita ketahui tanpa menghitung: segitiga",
    introAnd: "dan segitiga",
    introEnd: ". Keduanya sering muncul di soal dan sangat berguna dalam kehidupan nyata!",
    isoName: "Segitiga Isosceles Siku-siku",
    halfName: "Segitiga Setengah Sama Sisi",
    animHint: "💡 Geser slider untuk memperbesar atau memperkecil segitiga. Perhatikan bahwa rasio sisi selalu tetap meskipun ukurannya berubah — itulah kunci sudut khusus!",
    s45Desc: "Jika kamu memotong persegi dari pojok ke pojok, kamu mendapat dua segitiga",
    s45Desc2: ". Kedua kakinya sama panjang (sebut",
    s45Desc3: "), dan hipotenusanya adalah",
    s45Formula: "🔢 Penurunan Rumus",
    s45FormulaDesc: "Misalkan kedua kaki =",
    s45FormulaDesc2: ". Gunakan Pythagoras:",
    s45RatioLabel: "Perbandingan sisi",
    s45RatioDesc: "Perbandingan sisi : kaki : kaki : hipotenusa",
    s45Tip: "💡 Trik cepat: Dari kaki ke hipotenusa,",
    s45Tip2: "kalikan dengan",
    s45Tip3: ". Dari hipotenusa ke kaki,",
    s45Tip4: "bagi dengan",
    s45Tip5: "(atau kalikan",
    s45Tip6: ").",
    s30Desc: "Segitiga ini terbentuk jika kamu memotong segitiga sama sisi tepat di tengah. Sisi terpendek berhadapan dengan sudut 30°, sisi tengah berhadapan sudut 60°, dan sisi terpanjang (hipotenusa) berhadapan sudut 90°.",
    s30Formula: "🔢 Penurunan Rumus",
    s30FormulaDesc: "Misalkan kaki terpendek (berhadapan 30°) =",
    s30FormulaDesc2: ". Hipotenusa =",
    s30FormulaDesc3: ". Cari kaki panjang:",
    s30RatioDesc: "kaki pendek : kaki panjang : hipotenusa",
    s30Tip: "💡 Trik cepat: Jika tahu kaki pendek (",
    s30Tip2: "): kaki panjang =",
    s30Tip3: ", hipotenusa =",
    s30Tip4: ". Selalu dari sudut terkecil ke terbesar: sisi ikut membesar!",
    compareRatio: "Perbandingan sisi:",
    compareLabelShort: "Kaki pendek",
    compareLabelSame: "Kaki (sama)",
    compareLabelLong: "Kaki panjang",
    compareLabelHyp: "Hipotenusa",
    compareExample: "Contoh",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1Problem: "Sebuah kain berbentuk segitiga siku-siku sama kaki dengan panjang kaki 10 cm. Berapa panjang sisi miringnya?",
    c1Sol: "Segitiga siku-siku sama kaki = segitiga 45°-45°-90°. Kaki =",
    c1Sol2: "cm. Gunakan perbandingan",
    c1Ans: "✅ Sisi miring =",
    c1Ans2: "cm ≈ 14,14 cm",
    c2Problem: "Sebuah tiang lampu membentuk bayangan sepanjang",
    c2Problem2: "m ketika sinar matahari membentuk sudut 30° dengan tanah. Berapa tinggi tiang lampu tersebut?",
    c2Sol: "Situasi ini membentuk segitiga 30°-60°-90°. Bayangan = kaki panjang (berhadapan 60°) =",
    c2Sol2: "m. Gunakan perbandingan: kaki panjang =",
    c2Sol3: ". Tinggi tiang = kaki pendek =",
    c2Label: "Tinggi tiang",
    c2Ans: "✅ Tiang lampu setinggi 6 m.",
    c3Problem: "Sebuah segitiga sama sisi ABC memiliki sisi 12 cm. Titik D adalah kaki tegak lurus dari A ke BC. Hitung panjang AD, lalu gunakan AD sebagai kaki segitiga 45-45-90 baru. Berapa hipotenusa segitiga baru itu?",
    c3Step1: "Langkah 1: Segitiga ABD adalah segitiga 30-60-90 (D di tengah BC, sudut B = 60°).",
    c3Step1b: "BD = ½ × 12 = 6 cm (kaki pendek). AD = kaki panjang:",
    c3Step2: "Langkah 2: Segitiga baru 45-45-90 dengan kaki = AD =",
    c3Step2b: "cm.",
    c3Ans: "✅ Hipotenusa segitiga baru =",
    c3Ans2: "cm ≈ 14,70 cm.",
    r45hyp: "Hipotenusa = kaki × √2",
    r30hyp: "Hipotenusa = 2 × kaki pendek",
    interLabel: "🎛️ Eksplorasi Interaktif",
    interRatio: "Rasio tetap:",
    shortLeg: "Kaki pendek",
    sameLeg: "Kaki (sama)",
    longLeg: "Kaki panjang",
    hypotenuse: "Hipotenusa",
    dragHint: "✋ seret • 🔄",
    rotateLabel: "🔄 Putar segitiga:",
    resetBtn: "↺ Reset",
    sizeLabel: "🔍 Geser untuk memperbesar segitiga (a = kelipatan dasar):",
    ratioAlways: "Rasio selalu tetap:",
    ratioDesc45: "Berapapun nilai a, sisi-sisinya selalu",
    ratioDesc30: "Berapapun nilai a, sisi-sisinya selalu",
    ratioNever: "— perbandingannya tidak pernah berubah!",
    svgRatio45: "Perbandingan: a : a : a√2",
    svgRatio30: "Perbandingan: a : a√3 : 2a",
  },
  en: {
    title: "SIDE RATIOS OF SPECIAL RIGHT TRIANGLES",
    subtitle: "Grade 8 · Pythagorean Theorem · Math Book",
    back: "← Back to Pythagorean Theorem",
    sec_intro: "🌟 Special Angles You Must Master",
    sec_interaktif: "🎮 Interactive Animation — Scale the Special Triangle",
    sec_45: "📐 45°-45°-90° Triangle",
    sec_30: "📐 30°-60°-90° Triangle",
    sec_perbandingan: "📊 Special Angle Comparison Table",
    sec_contoh1: "✏️ Example 1 — 45-45-90 Triangle (Easy)",
    sec_contoh2: "✏️ Example 2 — 30-60-90 Triangle (Medium)",
    sec_contoh3: "✏️ Example 3 — Two Special Triangles Combined (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    intisari: "🎯 Key Summary",
    introDesc: "There are two special right triangles whose side ratios we can know without calculating: the",
    introAnd: "and the",
    introEnd: " triangle. They appear frequently in problems and are very useful in real life!",
    isoName: "Isosceles Right Triangle",
    halfName: "Half Equilateral Triangle",
    animHint: "💡 Drag the slider to scale the triangle up or down. Notice that the side ratio remains constant regardless of size — that's the key to special angles!",
    s45Desc: "If you cut a square diagonally from corner to corner, you get two",
    s45Desc2: "triangles. Both legs are equal (call it",
    s45Desc3: "), and the hypotenuse is",
    s45Formula: "🔢 Deriving the Formula",
    s45FormulaDesc: "Let both legs =",
    s45FormulaDesc2: ". Apply Pythagoras:",
    s45RatioLabel: "Side ratio",
    s45RatioDesc: "Side ratio: leg : leg : hypotenuse",
    s45Tip: "💡 Quick trick: From leg to hypotenuse,",
    s45Tip2: "multiply by",
    s45Tip3: ". From hypotenuse to leg,",
    s45Tip4: "divide by",
    s45Tip5: "(or multiply by",
    s45Tip6: ").",
    s30Desc: "This triangle is formed by cutting an equilateral triangle exactly in half. The shortest side is opposite the 30° angle, the middle side is opposite the 60° angle, and the longest side (hypotenuse) is opposite the 90° angle.",
    s30Formula: "🔢 Deriving the Formula",
    s30FormulaDesc: "Let the shortest leg (opposite 30°) =",
    s30FormulaDesc2: ". Hypotenuse =",
    s30FormulaDesc3: ". Find the longer leg:",
    s30RatioDesc: "short leg : long leg : hypotenuse",
    s30Tip: "💡 Quick trick: If you know the short leg (",
    s30Tip2: "): long leg =",
    s30Tip3: ", hypotenuse =",
    s30Tip4: ". From smallest to largest angle: sides also grow!",
    compareRatio: "Side ratio:",
    compareLabelShort: "Short leg",
    compareLabelSame: "Leg (equal)",
    compareLabelLong: "Long leg",
    compareLabelHyp: "Hypotenuse",
    compareExample: "Example",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1Problem: "A fabric is shaped like an isosceles right triangle with leg length 10 cm. What is the length of the hypotenuse?",
    c1Sol: "Isosceles right triangle = 45°-45°-90° triangle. Leg =",
    c1Sol2: "cm. Use ratio",
    c1Ans: "✅ Hypotenuse =",
    c1Ans2: "cm ≈ 14.14 cm",
    c2Problem: "A lamp post casts a shadow of",
    c2Problem2: "m when sunlight makes a 30° angle with the ground. How tall is the lamp post?",
    c2Sol: "This forms a 30°-60°-90° triangle. Shadow = long leg (opposite 60°) =",
    c2Sol2: "m. Use ratio: long leg =",
    c2Sol3: ". Post height = short leg =",
    c2Label: "Post height",
    c2Ans: "✅ The lamp post is 6 m tall.",
    c3Problem: "An equilateral triangle ABC has side 12 cm. Point D is the foot of the perpendicular from A to BC. Calculate the length of AD, then use AD as the leg of a new 45-45-90 triangle. Find the hypotenuse of the new triangle.",
    c3Step1: "Step 1: Triangle ABD is a 30-60-90 triangle (D at midpoint of BC, angle B = 60°).",
    c3Step1b: "BD = ½ × 12 = 6 cm (short leg). AD = long leg:",
    c3Step2: "Step 2: New 45-45-90 triangle with leg = AD =",
    c3Step2b: "cm.",
    c3Ans: "✅ Hypotenuse of new triangle =",
    c3Ans2: "cm ≈ 14.70 cm.",
    r45hyp: "Hypotenuse = leg × √2",
    r30hyp: "Hypotenuse = 2 × short leg",
    interLabel: "🎛️ Interactive Exploration",
    interRatio: "Fixed ratio:",
    shortLeg: "Short leg",
    sameLeg: "Leg (equal)",
    longLeg: "Long leg",
    hypotenuse: "Hypotenuse",
    dragHint: "✋ drag • 🔄",
    rotateLabel: "🔄 Rotate triangle:",
    resetBtn: "↺ Reset",
    sizeLabel: "🔍 Drag to scale triangle (a = base multiple):",
    ratioAlways: "Ratio always fixed:",
    ratioDesc45: "Whatever the value of a, the sides are always",
    ratioDesc30: "Whatever the value of a, the sides are always",
    ratioNever: "— the ratio never changes!",
    svgRatio45: "Ratio: a : a : a√2",
    svgRatio30: "Ratio: a : a√3 : 2a",
  },
  ja: {
    title: "特殊な直角三角形の辺の比",
    subtitle: "8年生 · ピタゴラスの定理 · 数学テキスト",
    back: "← ピタゴラスの定理に戻る",
    sec_intro: "🌟 マスターすべき特殊な角度",
    sec_interaktif: "🎮 インタラクティブアニメーション — 特殊三角形を拡大しよう",
    sec_45: "📐 45°-45°-90° 三角形",
    sec_30: "📐 30°-60°-90° 三角形",
    sec_perbandingan: "📊 特殊角度の比較表",
    sec_contoh1: "✏️ 例題1 — 45-45-90三角形（基本）",
    sec_contoh2: "✏️ 例題2 — 30-60-90三角形（標準）",
    sec_contoh3: "✏️ 例題3 — 2つの特殊三角形の組み合わせ（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    intisari: "🎯 要点まとめ",
    introDesc: "計算しなくても辺の比がわかる特殊な直角三角形が2種類あります：",
    introAnd: "と",
    introEnd: "です。問題に頻出で、実生活でも非常に役立ちます！",
    isoName: "直角二等辺三角形",
    halfName: "正三角形の半分",
    animHint: "💡 スライダーを動かして三角形を拡大・縮小しよう。大きさが変わっても辺の比は常に一定 — これが特殊角度のポイントです！",
    s45Desc: "正方形を角から角へ切ると2つの",
    s45Desc2: "三角形になります。両方の直角辺は等しく（",
    s45Desc3: "）、斜辺は",
    s45Formula: "🔢 公式の導出",
    s45FormulaDesc: "両方の直角辺 =",
    s45FormulaDesc2: "とする。ピタゴラスを使うと：",
    s45RatioLabel: "辺の比",
    s45RatioDesc: "辺の比：直角辺 : 直角辺 : 斜辺",
    s45Tip: "💡 素早い方法：直角辺から斜辺へは",
    s45Tip2: "を掛ける",
    s45Tip3: "。斜辺から直角辺へは",
    s45Tip4: "で割る",
    s45Tip5: "（または",
    s45Tip6: "を掛ける）。",
    s30Desc: "正三角形を真ん中で切ってできる三角形です。最短辺が30°の角に対向し、中辺が60°に対向し、最長辺（斜辺）が90°に対向します。",
    s30Formula: "🔢 公式の導出",
    s30FormulaDesc: "30°に対向する短い直角辺 =",
    s30FormulaDesc2: "とする。斜辺 =",
    s30FormulaDesc3: "。長い直角辺を求めると：",
    s30RatioDesc: "短い辺 : 長い辺 : 斜辺",
    s30Tip: "💡 素早い方法：短い辺（",
    s30Tip2: "）がわかれば：長い辺 =",
    s30Tip3: "、斜辺 =",
    s30Tip4: "。小さい角から大きい角へ：辺も大きくなる！",
    compareRatio: "辺の比：",
    compareLabelShort: "短い辺",
    compareLabelSame: "辺（等しい）",
    compareLabelLong: "長い辺",
    compareLabelHyp: "斜辺",
    compareExample: "例",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解答",
    c1Problem: "直角二等辺三角形の形の布があり、直角辺の長さは10cmです。斜辺の長さは何cmですか？",
    c1Sol: "直角二等辺三角形 = 45°-45°-90°三角形。直角辺 =",
    c1Sol2: "cm。比",
    c1Ans: "✅ 斜辺 =",
    c1Ans2: "cm ≈ 14.14 cm",
    c2Problem: "街灯が影を",
    c2Problem2: "m作っています（太陽光と地面の角度が30°のとき）。街灯の高さは何mですか？",
    c2Sol: "これは30°-60°-90°三角形を形成します。影 = 長い直角辺（60°に対向）=",
    c2Sol2: "m。比を使う：長い辺 =",
    c2Sol3: "。街灯の高さ = 短い辺 =",
    c2Label: "街灯の高さ",
    c2Ans: "✅ 街灯の高さは6mです。",
    c3Problem: "正三角形ABCの辺の長さは12cmです。点DはAからBCへ下ろした垂線の足です。ADの長さを求め、ADを新しい45-45-90三角形の直角辺として使います。新しい三角形の斜辺は何cmですか？",
    c3Step1: "ステップ1：三角形ABDは30-60-90三角形（DはBCの中点、∠B = 60°）。",
    c3Step1b: "BD = ½ × 12 = 6 cm（短い辺）。AD = 長い辺：",
    c3Step2: "ステップ2：直角辺 = AD =",
    c3Step2b: "cmの新しい45-45-90三角形。",
    c3Ans: "✅ 新しい三角形の斜辺 =",
    c3Ans2: "cm ≈ 14.70 cm。",
    r45hyp: "斜辺 = 直角辺 × √2",
    r30hyp: "斜辺 = 短い辺 × 2",
    interLabel: "🎛️ インタラクティブ探究",
    interRatio: "固定比率：",
    shortLeg: "短い辺",
    sameLeg: "辺（等しい）",
    longLeg: "長い辺",
    hypotenuse: "斜辺",
    dragHint: "✋ ドラッグ • 🔄",
    rotateLabel: "🔄 三角形を回転：",
    resetBtn: "↺ リセット",
    sizeLabel: "🔍 スライダーで拡大（a = 倍率）：",
    ratioAlways: "比率は常に一定：",
    ratioDesc45: "aの値が何であっても、辺は常に",
    ratioDesc30: "aの値が何であっても、辺は常に",
    ratioNever: "— 比率は変わりません！",
    svgRatio45: "比率：a : a : a√2",
    svgRatio30: "比率：a : a√3 : 2a",
  },
} as const;
type Lang = keyof typeof translations;

const SudutKhususPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = translations[language as Lang];
  const [open, setOpen] = useState<string[]>(["intro","interaktif","sudut45","sudut30","perbandingan","contoh1","contoh2","contoh3","rangkuman"]);

  const toggle = (id: string) => {
    playPopSound();
    setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className={`font-body font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary"/> : <ChevronDown className="w-5 h-5 text-primary"/>}
    </button>
  );

  const Sudut4545SVG = () => (
    <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-2" aria-label="45-45-90 triangle">
      <defs>
        <style>{`@keyframes glow45{0%,100%{opacity:1;}50%{opacity:0.4;}}.g45{animation:glow45 2s ease-in-out infinite;}`}</style>
      </defs>
      <polygon points="20,150 140,150 20,30" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2"/>
      <polyline points="20,130 40,130 40,150" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
      <line x1="20" y1="30" x2="20" y2="150" stroke="#3b82f6" strokeWidth="2.5" className="g45"/>
      <line x1="20" y1="150" x2="140" y2="150" stroke="#22c55e" strokeWidth="2.5" className="g45"/>
      <line x1="20" y1="30" x2="140" y2="150" stroke="#f97316" strokeWidth="2.5"/>
      <text x="145" y="155" fill="#eab308" fontSize="10" fontFamily="monospace">45°</text>
      <text x="25" y="28" fill="#eab308" fontSize="10" fontFamily="monospace">45°</text>
      <text x="44" y="148" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">90°</text>
      <text x="6" y="95" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
      <text x="80" y="163" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
      <text x="92" y="88" fill="#fb923c" fontSize="12" fontWeight="bold">a√2</text>
      <rect x="0" y="170" width="200" height="10" fill="none"/>
      <text x="100" y="178" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svgRatio45}</text>
    </svg>
  );

  const Sudut3060SVG = () => (
    <svg viewBox="0 0 240 200" className="w-full max-w-xs mx-auto my-2" aria-label="30-60-90 triangle">
      <defs>
        <style>{`@keyframes glow30{0%,100%{opacity:1;}50%{opacity:0.4;}}.g30{animation:glow30 2s ease-in-out infinite;}`}</style>
      </defs>
      <polygon points="20,160 200,160 20,70" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
      <polyline points="20,140 40,140 40,160" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
      <line x1="20" y1="70" x2="20" y2="160" stroke="#3b82f6" strokeWidth="2.5" className="g30"/>
      <line x1="20" y1="160" x2="200" y2="160" stroke="#22c55e" strokeWidth="2.5" className="g30"/>
      <line x1="20" y1="70" x2="200" y2="160" stroke="#f97316" strokeWidth="2.5"/>
      <text x="205" y="165" fill="#eab308" fontSize="10" fontFamily="monospace">30°</text>
      <text x="25" y="68" fill="#eab308" fontSize="10" fontFamily="monospace">60°</text>
      <text x="44" y="158" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">90°</text>
      <text x="7" y="118" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
      <text x="110" y="175" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="middle">a√3</text>
      <text x="125" y="108" fill="#fb923c" fontSize="12" fontWeight="bold">2a</text>
      <text x="120" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svgRatio30}</text>
    </svg>
  );

  const TriangleInteraktif = () => {
    const [mode, setMode] = useState<'45' | '30'>('45');
    const [a, setA] = useState(4);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    const SVG_W = 300, SVG_H = 218;
    const CX = 38, CY = 185;
    const PX = mode === '45' ? 15 : 13;
    const shortPx = a * PX;
    const longPx  = mode === '45' ? a * PX : a * PX * Math.sqrt(3);
    const AX = CX, AY = CY - shortPx;
    const BX = CX + longPx, BY = CY;
    const centX = (CX + AX + BX) / 3;
    const centY = (CY + AY + BY) / 3;
    const shortVal   = a;
    const longVal    = mode === '45' ? a : +(a * Math.sqrt(3)).toFixed(2);
    const longDisplay = mode === '45' ? String(a) : `${a}√3`;
    const hypVal     = mode === '45' ? +(a * Math.sqrt(2)).toFixed(2) : 2 * a;
    const shortSym = 'a';
    const longSym  = mode === '45' ? 'a' : 'a√3';
    const hypSym   = mode === '45' ? 'a√2' : '2a';
    const ratioStr  = mode === '45' ? '1 : 1 : √2' : '1 : √3 : 2';
    const triColor  = mode === '45' ? 'rgba(168,85,247,0.18)' : 'rgba(34,197,94,0.18)';
    const edgeColor = mode === '45' ? '#a855f7' : '#22c55e';
    const accentHex = mode === '45' ? '#a855f7' : '#22c55e';
    const hypMidX = (AX + BX) / 2;
    const hypMidY = (AY + BY) / 2;
    const showLabels = shortPx >= 26;
    const MK = 11;
    const txtShadow = { stroke: 'rgba(2,6,23,0.85)', strokeWidth: 2, paintOrder: 'stroke' as const };

    const toSvgDelta = (dx: number, dy: number) => {
      if (!svgRef.current) return { dx, dy };
      const rect = svgRef.current.getBoundingClientRect();
      return { dx: dx * (SVG_W / rect.width), dy: dy * (SVG_H / rect.height) };
    };

    const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging.current) return;
      const raw = { dx: e.clientX - lastPos.current.x, dy: e.clientY - lastPos.current.y };
      lastPos.current = { x: e.clientX, y: e.clientY };
      const { dx, dy } = toSvgDelta(raw.dx, raw.dy);
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    };
    const onPointerUp = () => { isDragging.current = false; };
    const reset = () => { setOffset({ x: 0, y: 0 }); setRotation(0); };
    const groupTransform = `translate(${offset.x.toFixed(1)},${offset.y.toFixed(1)}) rotate(${rotation},${centX.toFixed(1)},${centY.toFixed(1)})`;

    return (
      <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-4`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide`}>{t.interLabel}</p>
          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${mode==='45' ? 'bg-purple-900/50 text-purple-200 border-purple-500/40' : 'bg-green-900/50 text-green-200 border-green-500/40'}`}>
            {t.interRatio} {ratioStr}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['45','30'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setA(4); reset(); }}
              className={`py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                mode === m
                  ? m === '45' ? 'bg-purple-600 text-white border-purple-500' : 'bg-green-700 text-white border-green-600'
                  : isDark ? 'bg-slate-700/50 text-slate-400 border-slate-600 hover:border-slate-500' : 'bg-gray-200 text-gray-500 border-gray-300 hover:border-gray-400'
              }`}>
              {m === '45' ? '▪ 45°–45°–90°' : '▲ 30°–60°–90°'}
            </button>
          ))}
        </div>
        <div className="relative rounded-lg overflow-hidden border border-slate-700/50">
          <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full select-none"
            style={{ cursor: isDragging.current ? 'grabbing' : 'grab', touchAction: 'none' }}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
            <defs>
              <filter id="triGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <line x1={CX} y1="8" x2={CX} y2={CY} stroke="rgba(100,116,139,0.12)" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1={CX} y1={CY} x2={SVG_W-4} y2={CY} stroke="rgba(100,116,139,0.12)" strokeWidth="1" strokeDasharray="4 4"/>
            <g transform={groupTransform}>
              <polygon points={`${CX},${AY} ${BX},${BY} ${CX},${CY}`} fill={triColor} stroke={edgeColor} strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1={CX} y1={CY} x2={AX} y2={AY} stroke="#3b82f6" strokeWidth="2.8" strokeLinecap="round"/>
              <line x1={CX} y1={CY} x2={BX} y2={BY} stroke="#22c55e" strokeWidth="2.8" strokeLinecap="round"/>
              <line x1={AX} y1={AY} x2={BX} y2={BY} stroke="#f97316" strokeWidth="2.8" strokeLinecap="round"/>
              <polyline points={`${CX},${CY-MK} ${CX+MK},${CY-MK} ${CX+MK},${CY}`} fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
              {mode === '45' && showLabels && (() => {
                const TK = 5;
                const vMidY = (CY + AY) / 2;
                const hMidX = (CX + BX) / 2;
                return <>
                  <line x1={CX - TK} y1={vMidY} x2={CX + TK} y2={vMidY} stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
                  <line x1={hMidX} y1={CY - TK} x2={hMidX} y2={CY + TK} stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
                </>;
              })()}
              {showLabels && <>
                <text x={AX+7} y={AY+15} fill="#eab308" fontSize="11" fontFamily="sans-serif" fontWeight="bold" {...txtShadow}>{mode==='45' ? '45°' : '60°'}</text>
                <text x={Math.max(BX-22, CX+28)} y={BY-4} fill="#eab308" fontSize="11" fontFamily="sans-serif" fontWeight="bold" {...txtShadow}>{mode==='45' ? '45°' : '30°'}</text>
              </>}
              <text x={CX+14} y={CY-3} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">90°</text>
              {showLabels && <>
                <text x={CX-5} y={(CY+AY)/2+4} fill="#60a5fa" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="end" {...txtShadow}>{shortVal}</text>
                <text x={Math.min((CX+BX)/2, SVG_W-40)} y={CY+16} fill="#4ade80" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" {...txtShadow}>{longDisplay}</text>
                <text x={Math.min(hypMidX+7, SVG_W-56)} y={Math.max(hypMidY-7, 16)} fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="sans-serif" {...txtShadow}>{mode === '45' ? `${a}√2` : String(hypVal)}</text>
              </>}
              <circle cx={CX} cy={CY} r="5" fill={accentHex} opacity="0.85"/>
              <circle cx={AX} cy={AY} r="5" fill="#3b82f6" opacity="0.85"/>
              <circle cx={BX} cy={BY} r="5" fill="#22c55e" opacity="0.85"/>
              <text x={CX-12} y={CY+5} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">C</text>
              {showLabels && <>
                <text x={AX-18} y={AY-4} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">A</text>
                <text x={BX+4}  y={BY+5} fill="#94a3b8" fontSize="9" fontFamily="sans-serif">B</text>
              </>}
            </g>
          </svg>
          <p className="absolute bottom-1 right-2 text-xs text-slate-600 font-mono pointer-events-none select-none">
            {t.dragHint} {rotation}°
          </p>
        </div>
        <div className="space-y-1 px-1">
          <div className="flex justify-between items-center">
            <label className={isDark ? "font-body text-xs text-white/70" : "font-body text-xs text-gray-600"}>{t.rotateLabel}</label>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold px-2 py-0.5 rounded font-mono ${mode==='45' ? 'bg-purple-900/60 text-purple-200' : 'bg-green-900/60 text-green-200'}`}>{rotation}°</span>
              <button onClick={reset} className="text-xs px-2 py-1 rounded border border-slate-500 text-slate-400 hover:text-white hover:border-slate-300 transition-colors cursor-pointer">{t.resetBtn}</button>
            </div>
          </div>
          <input type="range" min="0" max="359" step="1" value={rotation} onChange={e => setRotation(+e.target.value)} className="w-full cursor-pointer" style={{ accentColor: accentHex }}/>
        </div>
        <div className="space-y-2 px-1">
          <div className="flex justify-between items-center">
            <label className={isDark ? "font-body text-xs text-white/70" : "font-body text-xs text-gray-600"}>{t.sizeLabel}</label>
            <span className={`text-sm font-bold px-2 py-0.5 rounded font-mono ${mode==='45' ? 'bg-purple-900/60 text-purple-200' : 'bg-green-900/60 text-green-200'}`}>a = {a}</span>
          </div>
          <input type="range" min="1" max="10" step="1" value={a} onChange={e => setA(+e.target.value)} className="w-full h-2 rounded-full cursor-pointer" style={{ accentColor: accentHex }}/>
          <div className="flex justify-between text-xs text-slate-500 px-0.5 font-mono">
            {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n}>{n}</span>)}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: mode==='45' ? t.compareLabelSame : t.compareLabelShort, sym: shortSym, val: shortVal, c: 'text-blue-300', bg: 'bg-blue-900/25', bd: 'border-blue-500/30' },
            { label: mode==='45' ? t.compareLabelSame : t.compareLabelLong, sym: longSym, val: longDisplay, c: 'text-green-300', bg: 'bg-green-900/25', bd: 'border-green-500/30' },
            { label: t.compareLabelHyp, sym: hypSym, val: hypVal, c: 'text-orange-300', bg: 'bg-orange-900/25', bd: 'border-orange-500/30' },
          ].map(({ label, sym, val, c, bg, bd }, idx) => (
            <div key={idx} className={`${bg} border ${bd} rounded-lg p-2 text-center`}>
              <p className="text-xs text-white/40 leading-tight">{label}</p>
              <p className={`font-bold text-sm mt-0.5 ${c}`}>{val} <span className="text-xs font-normal">cm</span></p>
              <p className="text-xs text-slate-500 font-mono">({sym})</p>
            </div>
          ))}
        </div>
        <div className={`border rounded-lg px-3 py-2 flex items-start gap-2 ${mode==='45' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
          <span className="text-lg mt-0.5">✨</span>
          <div>
            <p className="font-body text-xs font-bold text-yellow-300">{t.ratioAlways} {ratioStr}</p>
            <p className="font-body text-xs text-white/60 mt-0.5">
              {mode==='45'
                ? `${t.ratioDesc45} ${a} : ${a} : ${longVal === a ? `${a}×√2 ≈ ${hypVal}` : hypVal} ${t.ratioNever}`
                : `${t.ratioDesc30} ${shortVal} : ${longDisplay} : ${hypVal} ${t.ratioNever}`
              }
            </p>
          </div>
        </div>
      </div>
    );
  };

  const CompareCard = ({ title, ratio, color, sides, example, shortLabel, longLabel, hypLabel, exampleLabel }: {
    title: string; ratio: string; color: string; sides: string[]; example: { angles: string; vals: string[] };
    shortLabel: string; longLabel: string; hypLabel: string; exampleLabel: string;
  }) => (
    <div className={`${isDark ? "bg-slate-800/60" : "bg-gray-100"} border ${color} rounded-xl p-4 space-y-3`}>
      <p className={`font-body text-sm font-bold ${color.replace("border-","text-").replace("/40","")}`}>{title}</p>
      <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>{t.compareRatio} <span className="text-yellow-300 font-bold">{ratio}</span></p>
      <div className="grid grid-cols-3 gap-2">
        {sides.map((s,i)=>(
          <div key={i} className={`${isDark ? "bg-slate-900/50" : "bg-white/80"} rounded-lg p-2 text-center`}>
            <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{[shortLabel, longLabel, hypLabel][i]}</p>
            <p className={`font-body text-sm font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{s}</p>
          </div>
        ))}
      </div>
      <div className={`${isDark ? "bg-slate-700/50" : "bg-gray-50"} rounded-lg p-2`}>
        <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{exampleLabel} ({example.angles}):</p>
        <p className="font-body text-xs text-cyan-300 font-bold">{example.vals.join(" : ")}</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield/>
      <PageNavigation/>
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3"/>
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title={t.sec_intro}/>
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.intisari}</p>
                  <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                    {t.introDesc} <strong className="text-purple-300">45°-45°-90°</strong> {t.introAnd} <strong className="text-green-300">30°-60°-90°</strong>{t.introEnd}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-body">
                  <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-3 text-center">
                    <p className="text-purple-300 font-bold mb-1">{t.isoName}</p>
                    <p className="text-white/60">45° – 45° – 90°</p>
                    <p className="text-yellow-300 font-bold mt-1">a : a : a√2</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3 text-center">
                    <p className="text-green-300 font-bold mb-1">{t.halfName}</p>
                    <p className="text-white/60">30° – 60° – 90°</p>
                    <p className="text-yellow-300 font-bold mt-1">a : a√3 : 2a</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INTERAKTIF */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="interaktif" icon={<Target className="w-5 h-5"/>} iconColor="text-pink-400" title={t.sec_interaktif}/>
            {open.includes("interaktif") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg px-4 py-2">
                  <p className="font-body text-xs text-pink-200">{t.animHint}</p>
                </div>
                <TriangleInteraktif/>
              </div>
            )}
          </div>

          {/* SUDUT 45-45-90 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sudut45" icon={<Target className="w-5 h-5"/>} iconColor="text-purple-400" title={t.sec_45}/>
            {open.includes("sudut45") && (
              <div className="px-5 pb-5 space-y-4">
                <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                  {t.s45Desc} <strong className="text-purple-300">45°-45°-90°</strong> {t.s45Desc2} <InlineMath math="a"/>{t.s45Desc3} <InlineMath math="a\sqrt{2}"/>.
                </p>
                <Sudut4545SVG/>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-purple-300 font-semibold text-sm">{t.s45Formula}</p>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{t.s45FormulaDesc} <InlineMath math="a"/>. {t.s45FormulaDesc2}</p>
                  <BlockMath math="c = \sqrt{a^2 + a^2} = \sqrt{2a^2} = a\sqrt{2}"/>
                  <div className={isDark ? "bg-slate-900/60 rounded-lg p-3 text-center" : "bg-gray-50 rounded-lg p-3 text-center"}>
                    <p className="font-body text-xs text-white/50 mb-1">{t.s45RatioLabel}</p>
                    <p className="font-body text-xs text-white/60 mb-1">{t.s45RatioDesc}</p>
                    <BlockMath math="a : a : a\sqrt{2} = 1 : 1 : \sqrt{2}"/>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.s45Tip} <strong className="text-purple-300">{t.s45Tip2} <InlineMath math="\sqrt{2}"/></strong>. {t.s45Tip3} <strong className="text-purple-300">{t.s45Tip4} <InlineMath math="\sqrt{2}"/></strong> {t.s45Tip5} <InlineMath math="\frac{\sqrt{2}}{2}"/>{t.s45Tip6}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUDUT 30-60-90 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="sudut30" icon={<Target className="w-5 h-5"/>} iconColor="text-green-400" title={t.sec_30}/>
            {open.includes("sudut30") && (
              <div className="px-5 pb-5 space-y-4">
                <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>{t.s30Desc}</p>
                <Sudut3060SVG/>
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-green-300 font-semibold text-sm">{t.s30Formula}</p>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{t.s30FormulaDesc} <InlineMath math="a"/>. {t.s30FormulaDesc2} <InlineMath math="2a"/>. {t.s30FormulaDesc3}</p>
                  <BlockMath math="b = \sqrt{(2a)^2 - a^2} = \sqrt{4a^2 - a^2} = \sqrt{3a^2} = a\sqrt{3}"/>
                  <div className={isDark ? "bg-slate-900/60 rounded-lg p-3 text-center" : "bg-gray-50 rounded-lg p-3 text-center"}>
                    <p className="font-body text-xs text-white/60 mb-1">{t.s30RatioDesc}</p>
                    <BlockMath math="a : a\sqrt{3} : 2a = 1 : \sqrt{3} : 2"/>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.s30Tip}<InlineMath math="a"/>{t.s30Tip2} <InlineMath math="a\sqrt{3}"/>, {t.s30Tip3} <InlineMath math="2a"/>. {t.s30Tip4}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PERBANDINGAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="perbandingan" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-cyan-400" title={t.sec_perbandingan}/>
            {open.includes("perbandingan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CompareCard
                    title="▪ 45°-45°-90°"
                    ratio="1 : 1 : √2"
                    color="border-purple-500/40"
                    sides={["a", "a", "a√2"]}
                    example={{angles:"a=5", vals:["5", "5", "5√2 ≈ 7,07"]}}
                    shortLabel={t.compareLabelSame}
                    longLabel={t.compareLabelSame}
                    hypLabel={t.compareLabelHyp}
                    exampleLabel={t.compareExample}
                  />
                  <CompareCard
                    title="▲ 30°-60°-90°"
                    ratio="1 : √3 : 2"
                    color="border-green-500/40"
                    sides={["a", "a√3", "2a"]}
                    example={{angles:"a=4", vals:["4", "4√3 ≈ 6,93", "8"]}}
                    shortLabel={t.compareLabelShort}
                    longLabel={t.compareLabelLong}
                    hypLabel={t.compareLabelHyp}
                    exampleLabel={t.compareExample}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title={t.sec_contoh1}/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.easy}</p>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>{t.c1Problem}</p>
                </div>
                <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3" : "bg-gray-100 border border-gray-200 rounded-xl p-4 space-y-3"}>
                  <p className={isDark ? "font-body text-xs font-bold text-slate-300 uppercase tracking-wide" : "font-body text-xs font-bold text-gray-600 uppercase tracking-wide"}>{t.discussion}</p>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{t.c1Sol} <InlineMath math="a = 10"/> {t.c1Sol2} <InlineMath math="1:1:\sqrt{2}"/>:</p>
                  <BlockMath math="c = a\sqrt{2} = 10\sqrt{2} \approx 14{,}14 \text{ cm}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">{t.c1Ans} <strong><InlineMath math="10\sqrt{2}"/> {t.c1Ans2}</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title={t.sec_contoh2}/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.medium}</p>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>
                    {t.c2Problem} <InlineMath math="6\sqrt{3}"/> {t.c2Problem2}
                  </p>
                </div>
                <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3" : "bg-gray-100 border border-gray-200 rounded-xl p-4 space-y-3"}>
                  <p className={isDark ? "font-body text-xs font-bold text-slate-300 uppercase tracking-wide" : "font-body text-xs font-bold text-gray-600 uppercase tracking-wide"}>{t.discussion}</p>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{t.c2Sol} <InlineMath math="6\sqrt{3}"/> {t.c2Sol2} <InlineMath math="a\sqrt{3}"/>.</p>
                  <BlockMath math="a\sqrt{3} = 6\sqrt{3} \Rightarrow a = 6 \text{ m}"/>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{t.c2Sol3} <InlineMath math="a"/>:</p>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="= 6 \text{ m}"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">{t.c2Ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title={t.sec_contoh3}/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.hard}</p>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>{t.c3Problem}</p>
                </div>
                <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3" : "bg-gray-100 border border-gray-200 rounded-xl p-4 space-y-3"}>
                  <p className={isDark ? "font-body text-xs font-bold text-slate-300 uppercase tracking-wide" : "font-body text-xs font-bold text-gray-600 uppercase tracking-wide"}>{t.discussion}</p>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}><strong>{t.c3Step1}</strong></p>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{t.c3Step1b}</p>
                  <BlockMath math="AD = BD \times \sqrt{3} = 6\sqrt{3} \text{ cm}"/>
                  <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}><strong>{t.c3Step2} <InlineMath math="6\sqrt{3}"/> {t.c3Step2b}</strong></p>
                  <BlockMath math="c = AD \times \sqrt{2} = 6\sqrt{3} \times \sqrt{2} = 6\sqrt{6} \text{ cm}"/>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="c = 6\sqrt{6} \approx 14{,}70 \text{ cm}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">{t.c3Ans} <strong><InlineMath math="6\sqrt{6}"/> {t.c3Ans2}</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400" title={t.sec_rangkuman}/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-body">
                    <div className="bg-purple-900/40 rounded-lg p-3">
                      <p className="text-purple-300 font-bold mb-1">45° – 45° – 90°</p>
                      <p className="text-white/80"><InlineMath math="1 : 1 : \sqrt{2}"/></p>
                      <p className="text-white/60 mt-1">{t.r45hyp}</p>
                    </div>
                    <div className="bg-green-900/40 rounded-lg p-3">
                      <p className="text-green-300 font-bold mb-1">30° – 60° – 90°</p>
                      <p className="text-white/80"><InlineMath math="1 : \sqrt{3} : 2"/></p>
                      <p className="text-white/60 mt-1">{t.r30hyp}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SudutKhususPage;
