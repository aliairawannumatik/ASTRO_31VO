import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { TrendingUp, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs
───────────────────────────────────────────────────────────── */

const ScaleComparisonSVG = () => (
  <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto my-2" aria-label="Perbandingan skala bangun ruang">
    <defs>
      <style>{`
        @keyframes scaleGlow{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .sc-a{animation:scaleGlow 1.8s ease-in-out infinite;}
        @keyframes arrowPulse{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.3;}}
        .arr{animation:arrowPulse 1.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Tabung kecil (asli) */}
    <ellipse cx="70" cy="70" rx="35" ry="10" fill="rgba(14,116,144,0.3)" stroke="#0891b2" strokeWidth="1.5"/>
    <rect x="35" y="70" width="70" height="60" fill="rgba(8,145,178,0.15)" stroke="none"/>
    <line x1="35" y1="70" x2="35" y2="130" stroke="#0891b2" strokeWidth="1.5"/>
    <line x1="105" y1="70" x2="105" y2="130" stroke="#0891b2" strokeWidth="1.5"/>
    <ellipse cx="70" cy="130" rx="35" ry="10" fill="rgba(14,116,144,0.3)" stroke="#0891b2" strokeWidth="1.5"/>
    <text x="70" y="155" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="700">r, t</text>
    <text x="70" y="165" textAnchor="middle" fill="#a5f3fc" fontSize="8" fontFamily="monospace">V = πr²t</text>

    {/* Panah → */}
    <line x1="120" y1="100" x2="155" y2="100" stroke="#fbbf24" strokeWidth="2.5" className="arr"/>
    <polygon points="155,96 163,100 155,104" fill="#fbbf24" className="sc-a"/>
    <text x="140" y="94" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">× k</text>

    {/* Tabung besar (diperbesar k kali) */}
    <ellipse cx="240" cy="55" rx="55" ry="15" fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="2"/>
    <rect x="185" y="55" width="110" height="90" fill="rgba(168,85,247,0.12)" stroke="none"/>
    <line x1="185" y1="55" x2="185" y2="145" stroke="#a855f7" strokeWidth="2"/>
    <line x1="295" y1="55" x2="295" y2="145" stroke="#a855f7" strokeWidth="2"/>
    <ellipse cx="240" cy="145" rx="55" ry="15" fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="2"/>
    <text x="240" y="163" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontFamily="monospace" fontWeight="700">kr, kt</text>
    <text x="240" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontFamily="monospace">V = k³·πr²t</text>
  </svg>
);

// TabungPerubahanSVG — REMOVED (dead code, never rendered anywhere)

const BolaPerubahanSVG = () => (
  <svg viewBox="0 0 280 140" className="w-full max-w-sm mx-auto my-2" aria-label="Perubahan bola">
    <defs>
      <radialGradient id="bGrad1" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#0e7490" stopOpacity="0.7"/>
      </radialGradient>
      <radialGradient id="bGrad2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.7"/>
      </radialGradient>
    </defs>
    {/* Bola kecil */}
    <circle cx="70" cy="70" r="35" fill="url(#bGrad1)" stroke="#0891b2" strokeWidth="1.5"/>
    <text x="70" y="115" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">r</text>
    {/* Arrow */}
    <line x1="115" y1="70" x2="150" y2="70" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2"/>
    <polygon points="150,66 157,70 150,74" fill="#fbbf24"/>
    <text x="132" y="65" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">×2</text>
    {/* Bola besar */}
    <circle cx="215" cy="70" r="55" fill="url(#bGrad2)" stroke="#a855f7" strokeWidth="2"/>
    <text x="215" y="134" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontFamily="monospace">2r</text>
    {/* Labels */}
    <text x="70" y="125" textAnchor="middle" fill="#a5f3fc" fontSize="8" fontFamily="monospace">V = (4/3)πr³</text>
    <text x="215" y="8" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontFamily="monospace">V = 8 × (4/3)πr³ (r²→4r², L×4)</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   SCALE CALCULATOR TRANSLATIONS
───────────────────────────────────────────────────────────── */
const calcTrans = {
  id: {
    title: "🧮 Kalkulator Perubahan Skala Interaktif",
    shapeLabels: { tabung: "Tabung", kerucut: "Kerucut", bola: "Bola" },
    radiusLabel: "Perubahan jari-jari (k_r):",
    heightLabel: "Perubahan tinggi (k_t):",
    volumeCardTitle: "📦 Volume menjadi",
    volumeCardNote: "dari volume asal",
    luasCardTitle: "🎨 Luas Permukaan",
    luasCardNote: "dari luas asal",
    footnote: "* Hasil berlaku jika hanya jari-jari dan/atau tinggi yang diubah secara proporsional",
  },
  en: {
    title: "🧮 Interactive Scale Change Calculator",
    shapeLabels: { tabung: "Cylinder", kerucut: "Cone", bola: "Sphere" },
    radiusLabel: "Radius change (k_r):",
    heightLabel: "Height change (k_t):",
    volumeCardTitle: "📦 Volume becomes",
    volumeCardNote: "of the original volume",
    luasCardTitle: "🎨 Surface Area",
    luasCardNote: "of the original area",
    footnote: "* Results apply only when the radius and/or height are changed proportionally",
  },
  ja: {
    title: "🧮 スケール変化インタラクティブ計算機",
    shapeLabels: { tabung: "円柱", kerucut: "円錐", bola: "球" },
    radiusLabel: "半径の変化（k_r）：",
    heightLabel: "高さの変化（k_t）：",
    volumeCardTitle: "📦 体積は",
    volumeCardNote: "元の体積に対して",
    luasCardTitle: "🎨 表面積",
    luasCardNote: "元の面積に対して",
    footnote: "※ この結果は、半径や高さを比例的に変化させた場合にのみ適用されます",
  },
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE SCALE CALCULATOR
───────────────────────────────────────────────────────────── */
const ScaleCalculator = ({ language }: { language: Language }) => {
  const ct = calcTrans[language];
  const [shape, setShape] = useState<"tabung" | "kerucut" | "bola">("tabung");
  const [kR, setKR] = useState(2);
  const [kT, setKT] = useState(1);

  const computeVolumeRatio = () => {
    if (shape === "bola") return Math.pow(kR, 3);
    if (shape === "tabung") return Math.pow(kR, 2) * kT;
    return Math.pow(kR, 2) * kT;
  };
  const computeLuasRatio = () => {
    if (shape === "bola") return Math.pow(kR, 2);
    if (shape === "tabung") return Math.pow(kR, 2);
    return Math.pow(kR, 2);
  };

  const vRatio = computeVolumeRatio();
  const lRatio = computeLuasRatio();

  return (
    <div className="bg-slate-800/70 border border-slate-600/40 rounded-xl p-4 space-y-4 font-body">
      <p className="text-cyan-300 font-bold text-sm">{ct.title}</p>
      <div className="flex flex-wrap gap-2">
        {(["tabung","kerucut","bola"] as const).map(s => (
          <button key={s} onClick={() => { playPopSound(); setShape(s); }}
            className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer ${shape === s ? "bg-cyan-800/80 border-cyan-500 text-cyan-200" : "bg-slate-900/60 border-slate-600 text-slate-300"}`}>
            {ct.shapeLabels[s]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60 mb-1 block">{ct.radiusLabel} <strong className="text-yellow-300">{kR}×</strong></label>
          <input type="range" min={1} max={5} step={0.5} value={kR}
            onChange={e => setKR(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"/>
        </div>
        {shape !== "bola" && (
          <div>
            <label className="text-xs text-white/60 mb-1 block">{ct.heightLabel} <strong className="text-green-300">{kT}×</strong></label>
            <input type="range" min={1} max={5} step={0.5} value={kT}
              onChange={e => setKT(parseFloat(e.target.value))}
              className="w-full accent-green-400"/>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-950/60 border border-blue-700/40 rounded-lg p-3 text-center">
          <p className="text-blue-300 text-xs font-bold mb-1">{ct.volumeCardTitle}</p>
          <p className="text-white text-2xl font-bold font-mono">{vRatio}×</p>
          <p className="text-blue-200 text-xs">{ct.volumeCardNote}</p>
        </div>
        <div className="bg-orange-950/60 border border-orange-700/40 rounded-lg p-3 text-center">
          <p className="text-orange-300 text-xs font-bold mb-1">{ct.luasCardTitle}</p>
          <p className="text-white text-2xl font-bold font-mono">{lRatio}×</p>
          <p className="text-orange-200 text-xs">{ct.luasCardNote}</p>
        </div>
      </div>
      <p className="text-white/40 text-xs">{ct.footnote}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE-LEVEL TRANSLATIONS
───────────────────────────────────────────────────────────── */
const pageTrans = {
  id: {
    title: "PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG",
    subtitle: "Kelas 9 · Bangun Ruang Sisi Lengkung",
    prev: "Sebelumnya",
    next: "Selanjutnya",
    back: "← Kembali ke Bangun Ruang Sisi Lengkung",
    slide0Title: "Pengantar: Perubahan Luas & Volume",
    examplesTitle: "Contoh Soal — Perubahan Volume & Luas",
    examplesSubtitle: "Latihan bertingkat dari mudah hingga sulit",
    examplesPrefix: "SOAL",
    showSolution: "Lihat Pembahasan",
    hideSolution: "Sembunyikan",
  },
  en: {
    title: "SURFACE AREA AND VOLUME CHANGES OF CURVED SURFACE SOLIDS",
    subtitle: "Grade 9 · Curved Surface Solids",
    prev: "Previous",
    next: "Next",
    back: "← Back to Curved Surface Solids",
    slide0Title: "Introduction: Surface Area & Volume Changes",
    examplesTitle: "Example Problems — Volume & Surface Area Changes",
    examplesSubtitle: "Tiered exercises from easy to challenging",
    examplesPrefix: "Problem",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
  },
  ja: {
    title: "曲面体の表面積・体積の変化",
    subtitle: "中学3年 · 曲面体",
    prev: "前へ",
    next: "次へ",
    back: "← 曲面体に戻る",
    slide0Title: "はじめに：表面積・体積の変化",
    examplesTitle: "例題 — 体積・表面積の変化",
    examplesSubtitle: "易しいものから難しいものまで段階的な演習",
    examplesPrefix: "問題",
    showSolution: "解説を見る",
    hideSolution: "解説を隠す",
  },
};

/* ─────────────────────────────────────────────────────────────
   SLIDE 0 — PENGANTAR
───────────────────────────────────────────────────────────── */
const slide0Trans = {
  id: {
    intro: (
      <>
        Apa yang terjadi jika jari-jari sebuah bola diperbesar 3 kali? Apakah volumenya juga 3 kali?{" "}
        <strong className="text-red-400">Tidak!</strong> Di sini kamu akan belajar bagaimana perubahan{" "}
        <strong className="text-yellow-300">satu unsur</strong> bangun ruang sisi lengkung memengaruhi{" "}
        <strong className="text-orange-300">luas permukaan</strong> dan <strong className="text-blue-300">volume</strong>-nya
        secara dramatis.
      </>
    ),
    quickTitle: "🚀 Cara cepat mengingat:",
    q1: "Dimensi linier × k → Luas (2D) × k² → Volume (3D) × k³",
    q2: "Seperti memperbesar panjang sisi kubus: luas sisi jadi k², volume jadi k³!",
  },
  en: {
    intro: (
      <>
        What happens when a sphere's radius is enlarged 3 times? Does the volume also become 3 times?{" "}
        <strong className="text-red-400">No!</strong> Here you will learn how changing{" "}
        <strong className="text-yellow-300">one dimension</strong> of a curved surface solid dramatically affects its{" "}
        <strong className="text-orange-300">surface area</strong> and <strong className="text-blue-300">volume</strong>.
      </>
    ),
    quickTitle: "🚀 Quick way to remember:",
    q1: "Linear dimension × k → Surface Area (2D) × k² → Volume (3D) × k³",
    q2: "Think of enlarging a cube's side length: face area becomes k², volume becomes k³!",
  },
  ja: {
    intro: (
      <>
        球の半径を3倍にしたとき、体積も3倍になるでしょうか？{" "}
        <strong className="text-red-400">いいえ！</strong>ここでは、曲面体の{" "}
        <strong className="text-yellow-300">1つの寸法</strong>を変えることで、
        <strong className="text-orange-300">表面積</strong>と<strong className="text-blue-300">体積</strong>が
        どのように劇的に変化するかを学びます。
      </>
    ),
    quickTitle: "🚀 覚え方のコツ：",
    q1: "線形寸法 × k → 面積（2D）× k² → 体積（3D）× k³",
    q2: "立方体の辺を拡大するイメージ：面積は k²、体積は k³ になる！",
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 0 — KONSEP PERUBAHAN DIMENSI
───────────────────────────────────────────────────────────── */
const sec0Trans = {
  id: {
    opening: (
      <>
        Pernahkah kamu bertanya: <em>"Kalau jari-jari tabung diperbesar 2 kali, apakah volumenya juga 2 kali lebih besar?"</em>{" "}
        Jawabannya adalah <strong className="text-red-400">TIDAK</strong> — dan inilah yang akan kita pelajari di bab ini!
      </>
    ),
    boxTitle: "📌 Konsep Inti:",
    boxIntro: (
      <>Jika <strong>satu unsur</strong> bangun ruang (seperti jari-jari atau tinggi) diubah sebesar faktor{" "}
      <strong className="text-yellow-300">k</strong>, maka:</>
    ),
    bullet1: (<><strong className="text-orange-300">Luas permukaan</strong> berubah sebesar{" "}<strong className="text-yellow-300">k²</strong> kali (proporsional dengan pangkat 2)</>),
    bullet2: (<><strong className="text-blue-300">Volume</strong> berubah sebesar{" "}<strong className="text-yellow-300">k³</strong> kali (proporsional dengan pangkat 3)</>),
    card1Title: "🔑 Aturan Kunci:",
    c1b1: (<>• <strong className="text-orange-300">Luas</strong> ~ dimensi <strong>pangkat 2</strong></>),
    c1b2: (<>• <strong className="text-blue-300">Volume</strong> ~ dimensi <strong>pangkat 3</strong></>),
    c1b3: "• Semua dimensi × k → L × k², V × k³",
    card2Title: "📐 Contoh Nyata:",
    c2b1: "• Bola mini → Bola basket (r × 3)",
    c2b2: "• L permukaan → 9× lebih besar",
    c2b3: "• Volume → 27× lebih besar",
  },
  en: {
    opening: (
      <>
        Have you ever wondered: <em>"If a cylinder's radius is doubled, does its volume also double?"</em>{" "}
        The answer is <strong className="text-red-400">NO</strong> — and that's exactly what we'll explore in this chapter!
      </>
    ),
    boxTitle: "📌 Core Concept:",
    boxIntro: (
      <>If <strong>one dimension</strong> of a solid (such as radius or height) is scaled by a factor{" "}
      <strong className="text-yellow-300">k</strong>, then:</>
    ),
    bullet1: (<><strong className="text-orange-300">Surface area</strong> changes by{" "}<strong className="text-yellow-300">k²</strong> times (proportional to the square)</>),
    bullet2: (<><strong className="text-blue-300">Volume</strong> changes by{" "}<strong className="text-yellow-300">k³</strong> times (proportional to the cube)</>),
    card1Title: "🔑 Key Rule:",
    c1b1: (<>• <strong className="text-orange-300">Area</strong> ~ dimension <strong>squared</strong></>),
    c1b2: (<>• <strong className="text-blue-300">Volume</strong> ~ dimension <strong>cubed</strong></>),
    c1b3: "• All dimensions × k → A × k², V × k³",
    card2Title: "📐 Real-World Example:",
    c2b1: "• Mini ball → Basketball (r × 3)",
    c2b2: "• Surface area → 9× larger",
    c2b3: "• Volume → 27× larger",
  },
  ja: {
    opening: (
      <>
        こんな疑問を持ったことはありますか？<em>「円柱の半径を2倍にしたら、体積も2倍になる？」</em>{" "}
        答えは<strong className="text-red-400">「いいえ」</strong>です——それがこの章で学ぶ内容です！
      </>
    ),
    boxTitle: "📌 核心概念：",
    boxIntro: (
      <>立体の<strong>1つの寸法</strong>（半径や高さなど）を拡大縮小率{" "}
      <strong className="text-yellow-300">k</strong> で変えると：</>
    ),
    bullet1: (<><strong className="text-orange-300">表面積</strong>は{" "}<strong className="text-yellow-300">k²</strong> 倍になる（2乗に比例）</>),
    bullet2: (<><strong className="text-blue-300">体積</strong>は{" "}<strong className="text-yellow-300">k³</strong> 倍になる（3乗に比例）</>),
    card1Title: "🔑 重要なルール：",
    c1b1: (<>• <strong className="text-orange-300">面積</strong> ∝ 寸法の<strong>2乗</strong></>),
    c1b2: (<>• <strong className="text-blue-300">体積</strong> ∝ 寸法の<strong>3乗</strong></>),
    c1b3: "• 全寸法 × k → 面積 × k²、体積 × k³",
    card2Title: "📐 身近な例：",
    c2b1: "• 小さいボール → バスケットボール（r × 3）",
    c2b2: "• 表面積 → 9倍",
    c2b3: "• 体積 → 27倍",
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 1 — PERUBAHAN PADA TABUNG
───────────────────────────────────────────────────────────── */
const sec1Trans = {
  id: {
    intro: (<p className="text-white/80 text-sm">Tabung memiliki dua variabel: <strong className="text-yellow-300">r (jari-jari)</strong> dan <strong className="text-green-300">t (tinggi)</strong>. Perubahan masing-masing memberi efek yang berbeda!</p>),
    originalFormula: "Rumus asli:",
    case1Title: "1. Jika Jari-jari (r) Diperbesar k kali (tinggi tetap)",
    case1Conclusion: (<>→ Volume menjadi <strong>k²</strong> kali volume semula</>),
    case1Note: "→ Luas tidak bisa disederhanakan menjadi k² × L kecuali t juga turut berubah",
    case2Title: "2. Jika Tinggi (t) Diperbesar k kali (jari-jari tetap)",
    case2Conclusion: (<>→ Volume menjadi <strong>k</strong> kali volume semula</>),
    case2LateralNote: "Luas selimut:",
    case2LateralResult: "→ selimut menjadi k kali",
    case3Title: "3. Jika Semua Dimensi Diperbesar k kali (r → kr, t → kt)",
    conclLabel: "✨ Kesimpulan:",
    conclText: (<>Jika semua dimensi × k: <strong className="text-yellow-300">L × k²</strong> dan <strong className="text-yellow-300">V × k³</strong></>),
    tableHeaders: ["Perubahan", "Volume", "Luas Permukaan"],
    tableRows: [
      ["r → kr (t tetap)", "V_n = k² × V", "Tidak proporsional"],
      ["t → kt (r tetap)", "V_n = k × V", "Selimut = k × L_s"],
      ["r → kr, t → kt", "V_n = k³ × V", "L_n = k² × L"],
    ],
  },
  en: {
    intro: (<p className="text-white/80 text-sm">A cylinder has two variables: <strong className="text-yellow-300">r (radius)</strong> and <strong className="text-green-300">t (height)</strong>. Each change produces a different effect!</p>),
    originalFormula: "Original formula:",
    case1Title: "1. If Radius (r) Is Scaled by k (t fixed)",
    case1Conclusion: (<>→ Volume becomes <strong>k²</strong> times the original</>),
    case1Note: "→ Surface area cannot be simplified to k² × L unless t also changes",
    case2Title: "2. If Height (t) Is Scaled by k (r fixed)",
    case2Conclusion: (<>→ Volume becomes <strong>k</strong> times the original</>),
    case2LateralNote: "Lateral surface:",
    case2LateralResult: "→ lateral area becomes k times",
    case3Title: "3. If All Dimensions Are Scaled by k (r → kr, t → kt)",
    conclLabel: "✨ Conclusion:",
    conclText: (<>If all dimensions × k: <strong className="text-yellow-300">A × k²</strong> and <strong className="text-yellow-300">V × k³</strong></>),
    tableHeaders: ["Change", "Volume", "Surface Area"],
    tableRows: [
      ["r → kr (t fixed)", "V_n = k² × V", "Not proportional"],
      ["t → kt (r fixed)", "V_n = k × V", "Lateral = k × L_s"],
      ["r → kr, t → kt", "V_n = k³ × V", "L_n = k² × L"],
    ],
  },
  ja: {
    intro: (<p className="text-white/80 text-sm">円柱には2つの変数があります：<strong className="text-yellow-300">r（半径）</strong>と<strong className="text-green-300">t（高さ）</strong>。それぞれの変化が異なる効果をもたらします！</p>),
    originalFormula: "元の公式：",
    case1Title: "1. 半径（r）を k 倍にした場合（t 固定）",
    case1Conclusion: (<>→ 体積は元の <strong>k²</strong> 倍になる</>),
    case1Note: "→ t も変化しない限り、表面積は k² × L とは単純にならない",
    case2Title: "2. 高さ（t）を k 倍にした場合（r 固定）",
    case2Conclusion: (<>→ 体積は元の <strong>k</strong> 倍になる</>),
    case2LateralNote: "側面積：",
    case2LateralResult: "→ 側面積は k 倍",
    case3Title: "3. 全ての寸法を k 倍にした場合（r → kr、t → kt）",
    conclLabel: "✨ まとめ：",
    conclText: (<>全寸法 × k のとき：<strong className="text-yellow-300">面積 × k²</strong> かつ <strong className="text-yellow-300">体積 × k³</strong></>),
    tableHeaders: ["変化", "体積", "表面積"],
    tableRows: [
      ["r → kr（t 固定）", "V_n = k² × V", "比例しない"],
      ["t → kt（r 固定）", "V_n = k × V", "側面 = k × L_s"],
      ["r → kr, t → kt", "V_n = k³ × V", "L_n = k² × L"],
    ],
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 2 — PERUBAHAN PADA KERUCUT
───────────────────────────────────────────────────────────── */
const sec2Trans = {
  id: {
    intro: (<p className="text-white/80 text-sm">Kerucut memiliki <strong className="text-yellow-300">r (jari-jari)</strong>, <strong className="text-green-300">t (tinggi)</strong>, dan{" "}<strong className="text-purple-300">s (garis pelukis)</strong> di mana <InlineMath math="s = \sqrt{r^2 + t^2}" />.</p>),
    formulaTitle: "📐 Rumus Kerucut (Asal):",
    case1Title: "Jika Jari-jari (r) → kr (tinggi tetap)",
    case1SlantNote: "Garis pelukis baru:",
    case1Conclusion: "→ Volume menjadi k² kali; luas permukaan tidak sederhana karena s berubah berbeda",
    case2Title: "Jika Semua Dimensi → k kali (r → kr, t → kt, s → ks)",
    principle: "✨ Prinsip yang sama: Semua dimensi × k → L × k², V × k³",
  },
  en: {
    intro: (<p className="text-white/80 text-sm">A cone has <strong className="text-yellow-300">r (radius)</strong>, <strong className="text-green-300">t (height)</strong>, and{" "}<strong className="text-purple-300">s (slant height)</strong> where <InlineMath math="s = \sqrt{r^2 + t^2}" />.</p>),
    formulaTitle: "📐 Cone Formulas (Original):",
    case1Title: "If Radius (r) → kr (t fixed)",
    case1SlantNote: "New slant height:",
    case1Conclusion: "→ Volume becomes k² times; surface area is not simple because s changes differently",
    case2Title: "If All Dimensions → k times (r → kr, t → kt, s → ks)",
    principle: "✨ Same principle: All dimensions × k → A × k², V × k³",
  },
  ja: {
    intro: (<p className="text-white/80 text-sm">円錐には <strong className="text-yellow-300">r（半径）</strong>、<strong className="text-green-300">t（高さ）</strong>、<strong className="text-purple-300">s（母線）</strong> があり、<InlineMath math="s = \sqrt{r^2 + t^2}" /> です。</p>),
    formulaTitle: "📐 円錐の公式（元）：",
    case1Title: "半径（r）→ kr の場合（t 固定）",
    case1SlantNote: "新しい母線：",
    case1Conclusion: "→ 体積は k² 倍；s の変化が異なるため表面積は単純にならない",
    case2Title: "全ての寸法が k 倍の場合（r → kr、t → kt、s → ks）",
    principle: "✨ 同じ原則：全寸法 × k → 面積 × k²、体積 × k³",
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 3 — PERUBAHAN PADA BOLA
───────────────────────────────────────────────────────────── */
const sec3Trans = {
  id: {
    intro: (<p className="text-white/80 text-sm">Bola hanya punya satu variabel: <strong className="text-yellow-300">r (jari-jari)</strong>. Sehingga perubahan jari-jari langsung berpengaruh ke semua!</p>),
    formulaTitle: "📐 Rumus Bola (Asal):",
    caseTitle: "Jika r → kr:",
    memoLabel: "✨ Untuk bola, sangat mudah diingat:",
    memo1: (<>• r diperbesar <strong className="text-yellow-300">2×</strong> → V menjadi <strong className="text-blue-300">8×</strong>, L menjadi <strong className="text-orange-300">4×</strong></>),
    memo2: (<>• r diperbesar <strong className="text-yellow-300">3×</strong> → V menjadi <strong className="text-blue-300">27×</strong>, L menjadi <strong className="text-orange-300">9×</strong></>),
    tableHeaders: ["r diperbesar", "L menjadi", "V menjadi"],
    tableKTimes: (k: number) => `${k}× lebih besar`,
  },
  en: {
    intro: (<p className="text-white/80 text-sm">A sphere has only one variable: <strong className="text-yellow-300">r (radius)</strong>. So any change in radius directly affects everything!</p>),
    formulaTitle: "📐 Sphere Formulas (Original):",
    caseTitle: "If r → kr:",
    memoLabel: "✨ For a sphere, easy to remember:",
    memo1: (<>• r enlarged <strong className="text-yellow-300">2×</strong> → V becomes <strong className="text-blue-300">8×</strong>, A becomes <strong className="text-orange-300">4×</strong></>),
    memo2: (<>• r enlarged <strong className="text-yellow-300">3×</strong> → V becomes <strong className="text-blue-300">27×</strong>, A becomes <strong className="text-orange-300">9×</strong></>),
    tableHeaders: ["r enlarged", "A becomes", "V becomes"],
    tableKTimes: (k: number) => `${k}×`,
  },
  ja: {
    intro: (<p className="text-white/80 text-sm">球の変数は <strong className="text-yellow-300">r（半径）</strong> のみ。半径を変えるだけで全てが変わります！</p>),
    formulaTitle: "📐 球の公式（元）：",
    caseTitle: "r → kr の場合：",
    memoLabel: "✨ 球は覚えやすい：",
    memo1: (<>• r を <strong className="text-yellow-300">2倍</strong> → V は <strong className="text-blue-300">8倍</strong>、面積は <strong className="text-orange-300">4倍</strong></>),
    memo2: (<>• r を <strong className="text-yellow-300">3倍</strong> → V は <strong className="text-blue-300">27倍</strong>、面積は <strong className="text-orange-300">9倍</strong></>),
    tableHeaders: ["r の拡大倍率", "面積の変化", "体積の変化"],
    tableKTimes: (k: number) => `${k}×`,
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 4 — KALKULATOR & RINGKASAN
───────────────────────────────────────────────────────────── */
const sec4Trans = {
  id: {
    tableHeaders: ["Bangun", "Perubahan", "Luas Permukaan", "Volume"],
    tableRows: [
      ["Tabung", "r→kr, t→kt", "× k²", "× k³"],
      ["Tabung", "r→kr (t tetap)", "Tidak sederhana", "× k²"],
      ["Tabung", "t→kt (r tetap)", "Selimut × k", "× k"],
      ["Kerucut", "r→kr, t→kt, s→ks", "× k²", "× k³"],
      ["Bola", "r→kr", "× k²", "× k³"],
    ],
    tipTitle: "🚀 Cara cepat mengingat:",
    tip1: "Dimensi linier × k → Luas (2D) × k² → Volume (3D) × k³",
    tip2: "Bayangkan seperti: memperbesar panjang sisi kubus — luas sisi jadi k², volume jadi k³!",
  },
  en: {
    tableHeaders: ["Solid", "Change", "Surface Area", "Volume"],
    tableRows: [
      ["Cylinder", "r→kr, t→kt", "× k²", "× k³"],
      ["Cylinder", "r→kr (t fixed)", "Not simple", "× k²"],
      ["Cylinder", "t→kt (r fixed)", "Lateral × k", "× k"],
      ["Cone", "r→kr, t→kt, s→ks", "× k²", "× k³"],
      ["Sphere", "r→kr", "× k²", "× k³"],
    ],
    tipTitle: "🚀 Quick way to remember:",
    tip1: "Linear dimension × k → Surface Area (2D) × k² → Volume (3D) × k³",
    tip2: "Think of it like enlarging a cube's side length — face area becomes k², volume becomes k³!",
  },
  ja: {
    tableHeaders: ["立体", "変化", "表面積", "体積"],
    tableRows: [
      ["円柱", "r→kr, t→kt", "× k²", "× k³"],
      ["円柱", "r→kr（t 固定）", "単純でない", "× k²"],
      ["円柱", "t→kt（r 固定）", "側面 × k", "× k"],
      ["円錐", "r→kr, t→kt, s→ks", "× k²", "× k³"],
      ["球", "r→kr", "× k²", "× k³"],
    ],
    tipTitle: "🚀 覚え方のコツ：",
    tip1: "線形寸法 × k → 面積（2D）× k² → 体積（3D）× k³",
    tip2: "立方体の辺を拡大するイメージ：面積は k²、体積は k³ になる！",
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION TITLES (all 5 sections, all languages)
───────────────────────────────────────────────────────────── */
const secTitles: Record<Language, [string, string, string, string, string]> = {
  id: [
    "Konsep Perubahan Dimensi",
    "Perubahan pada Tabung",
    "Perubahan pada Kerucut",
    "Perubahan pada Bola",
    "Kalkulator & Ringkasan Perubahan",
  ],
  en: [
    "Concept of Dimensional Change",
    "Changes in a Cylinder",
    "Changes in a Cone",
    "Changes in a Sphere",
    "Calculator & Summary",
  ],
  ja: [
    "次元変化の概念",
    "円柱の変化",
    "円錐の変化",
    "球の変化",
    "計算機 & まとめ",
  ],
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS DATA
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

function getSections(language: Language): Sec[] {
  const t = secTitles[language];
  const s0 = sec0Trans[language];
  const s1 = sec1Trans[language];
  const s2 = sec2Trans[language];
  const s3 = sec3Trans[language];
  const s4 = sec4Trans[language];
  return [
    {
      title: t[0],
      icon: "🔄",
      content: (
        <div className="space-y-4 font-body">
          <p className="text-white/80 text-sm leading-relaxed">{s0.opening}</p>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-4 text-sm text-cyan-100 space-y-2">
            <p className="font-semibold text-cyan-300">{s0.boxTitle}</p>
            <p>{s0.boxIntro}</p>
            <ul className="list-disc list-inside space-y-1 text-white/80 text-xs mt-2">
              <li>{s0.bullet1}</li>
              <li>{s0.bullet2}</li>
            </ul>
          </div>
          <ScaleComparisonSVG />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
              <p className="text-yellow-400 font-bold text-sm">{s0.card1Title}</p>
              <p>{s0.c1b1}</p>
              <p>{s0.c1b2}</p>
              <p>{s0.c1b3}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
              <p className="text-cyan-400 font-bold text-sm">{s0.card2Title}</p>
              <p>{s0.c2b1}</p>
              <p>{s0.c2b2}</p>
              <p>{s0.c2b3}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t[1],
      icon: "🔵",
      content: (
        <div className="space-y-4 font-body">
          {s1.intro}
          <div className="space-y-3">
            <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
              <p className="text-amber-300 font-bold text-sm">{s1.case1Title}</p>
              <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
                <p className="text-white/60 mb-1">{s1.originalFormula} <InlineMath math="V = \pi r^2 t" />, <InlineMath math="L = 2\pi r^2 + 2\pi r t" /></p>
                <BlockMath math="V_n = \pi (kr)^2 t = k^2 \cdot \pi r^2 t = k^2 \cdot V" />
                <p className="text-orange-300 font-semibold">{s1.case1Conclusion}</p>
                <BlockMath math="L_n = 2\pi (kr)^2 + 2\pi (kr) t = k^2 \cdot 2\pi r^2 + k \cdot 2\pi r t" />
                <p className="text-orange-300 text-xs">{s1.case1Note}</p>
              </div>
            </div>
            <div className="bg-green-950/40 border border-green-700/40 rounded-xl p-4 space-y-2">
              <p className="text-green-300 font-bold text-sm">{s1.case2Title}</p>
              <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
                <BlockMath math="V_n = \pi r^2 \cdot (kt) = k \cdot \pi r^2 t = k \cdot V" />
                <p className="text-green-300 font-semibold">{s1.case2Conclusion}</p>
                <p className="text-white/60 text-xs">{s1.case2LateralNote} <InlineMath math="L_s = 2\pi r \cdot kt = k \cdot 2\pi rt" /> {s1.case2LateralResult}</p>
              </div>
            </div>
            <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl p-4 space-y-2">
              <p className="text-blue-300 font-bold text-sm">{s1.case3Title}</p>
              <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
                <BlockMath math="V_n = \pi (kr)^2 (kt) = k^3 \cdot \pi r^2 t = k^3 \cdot V" />
                <BlockMath math="L_n = 2\pi (kr)^2 + 2\pi (kr)(kt) = k^2(2\pi r^2 + 2\pi rt) = k^2 \cdot L" />
              </div>
              <div className="bg-blue-950/70 border border-blue-600/40 rounded p-2 text-xs">
                <p className="text-blue-200 font-semibold">{s1.conclLabel}</p>
                <p className="text-white/80">{s1.conclText}</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-center">
              <thead><tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s1.tableHeaders[0]}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{s1.tableHeaders[1]}</th>
                <th className="px-3 py-2 text-cyan-300">{s1.tableHeaders[2]}</th>
              </tr></thead>
              <tbody>
                {s1.tableRows.map(([b, r, c], i) => (
                  <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                    <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                    <td className="px-3 py-2 text-blue-300 font-mono border-r border-slate-700">{r}</td>
                    <td className="px-3 py-2 text-orange-300 font-mono text-left">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      title: t[2],
      icon: "🔺",
      content: (
        <div className="space-y-4 font-body">
          {s2.intro}
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-3">
            <p className="text-orange-300 font-bold text-sm">{s2.formulaTitle}</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <p><InlineMath math="V = \frac{1}{3} \pi r^2 t" /></p>
              <p><InlineMath math="L = \pi r^2 + \pi r s" /></p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
              <p className="text-amber-300 font-bold text-sm">{s2.case1Title}</p>
              <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
                <BlockMath math="V_n = \frac{1}{3}\pi (kr)^2 t = k^2 \cdot \frac{1}{3}\pi r^2 t = k^2 \cdot V" />
                <p className="text-white/60">{s2.case1SlantNote} <InlineMath math="s_n = \sqrt{(kr)^2 + t^2} \neq k \cdot s" /></p>
                <p className="text-amber-300 font-semibold">{s2.case1Conclusion}</p>
              </div>
            </div>
            <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl p-4 space-y-2">
              <p className="text-blue-300 font-bold text-sm">{s2.case2Title}</p>
              <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
                <BlockMath math="V_n = \frac{1}{3}\pi (kr)^2(kt) = k^3 \cdot V" />
                <BlockMath math="L_n = \pi (kr)^2 + \pi (kr)(ks) = k^2(\pi r^2 + \pi rs) = k^2 \cdot L" />
              </div>
              <div className="bg-blue-950/70 border border-blue-600/40 rounded p-2 text-xs text-blue-200 font-semibold">
                {s2.principle}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t[3],
      icon: "⚽",
      content: (
        <div className="space-y-4 font-body">
          {s3.intro}
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-3">
            <p className="text-orange-300 font-bold text-sm">{s3.formulaTitle}</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <p><InlineMath math="V = \frac{4}{3} \pi r^3" /></p>
              <p><InlineMath math="L = 4 \pi r^2" /></p>
            </div>
          </div>
          <div className="bg-purple-950/40 border border-purple-700/40 rounded-xl p-4 space-y-3">
            <p className="text-purple-300 font-bold text-sm">{s3.caseTitle}</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-2">
              <BlockMath math="V_n = \frac{4}{3}\pi (kr)^3 = k^3 \cdot \frac{4}{3}\pi r^3 = k^3 \cdot V" />
              <BlockMath math="L_n = 4\pi (kr)^2 = k^2 \cdot 4\pi r^2 = k^2 \cdot L" />
            </div>
            <div className="bg-purple-950/70 border border-purple-600/40 rounded p-3 text-xs">
              <p className="text-purple-200 font-semibold">{s3.memoLabel}</p>
              <p className="text-white/80 mt-1">{s3.memo1}</p>
              <p className="text-white/80">{s3.memo2}</p>
            </div>
          </div>
          <BolaPerubahanSVG />
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-center">
              <thead><tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{s3.tableHeaders[0]}</th>
                <th className="px-3 py-2 text-orange-300 border-r border-slate-700">{s3.tableHeaders[1]}</th>
                <th className="px-3 py-2 text-blue-300">{s3.tableHeaders[2]}</th>
              </tr></thead>
              <tbody>
                {[[2,4,8],[3,9,27],[4,16,64],[5,25,125]].map(([k,l,v],i) => (
                  <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                    <td className="px-3 py-2 text-yellow-300 font-bold border-r border-slate-700">{s3.tableKTimes(k)}</td>
                    <td className="px-3 py-2 text-orange-300 font-mono border-r border-slate-700">{l}× L</td>
                    <td className="px-3 py-2 text-blue-300 font-mono">{v}× V</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      title: t[4],
      icon: "📊",
      content: (
        <div className="space-y-4 font-body">
          <ScaleCalculator language={language} />
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-center">
              <thead><tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s4.tableHeaders[0]}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{s4.tableHeaders[1]}</th>
                <th className="px-3 py-2 text-orange-300 border-r border-slate-700">{s4.tableHeaders[2]}</th>
                <th className="px-3 py-2 text-blue-300">{s4.tableHeaders[3]}</th>
              </tr></thead>
              <tbody>
                {s4.tableRows.map(([b, p, l, v], i) => (
                  <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                    <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                    <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700 text-left">{p}</td>
                    <td className="px-3 py-2 text-orange-300 font-mono border-r border-slate-700">{l}</td>
                    <td className="px-3 py-2 text-blue-300 font-mono">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p>{s4.tipTitle}</p>
            <p>• {s4.tip1}</p>
            <p>• {s4.tip2}</p>
          </div>
        </div>
      ),
    },
  ];
}

/* ─────────────────────────────────────────────────────────────
   EXAMPLE PROBLEMS
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const levelLabels: Record<string, Record<Language, string>> = {
  MUDAH:  { id: "MUDAH",  en: "EASY",   ja: "基本" },
  SEDANG: { id: "SEDANG", en: "MEDIUM", ja: "標準" },
  SULIT:  { id: "SULIT",  en: "HARD",   ja: "発展" },
};
function levelLabel(level: string, language: Language): string {
  return levelLabels[level]?.[language] ?? level;
}

function getExamples(language: Language): Ex[] {
  return [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah bola memiliki jari-jari <InlineMath math="5 \text{ cm}" /> dan volume <InlineMath math="V" />.</p>
            <p>Jika jari-jari bola diperbesar menjadi <InlineMath math="10 \text{ cm}" />, berapa kali volume bola yang baru dibanding volume semula?</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A sphere has a radius of <InlineMath math="5 \text{ cm}" /> and volume <InlineMath math="V" />.</p>
            <p>If the sphere's radius is enlarged to <InlineMath math="10 \text{ cm}" />, how many times the original volume is the new volume?</p>
          </>
        ) : (
          <>
            <p>ある球の半径は<InlineMath math="5 \text{ cm}" />で、体積は<InlineMath math="V" />です。</p>
            <p>球の半径を<InlineMath math="10 \text{ cm}" />に拡大すると、新しい体積は元の体積の何倍になりますか。</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-green-400 font-semibold">
          {language === "id" ? "Analisis: r diperbesar dari 5 cm → 10 cm" : language === "en" ? "Analysis: r is enlarged from 5 cm → 10 cm" : "分析：半径 r が 5 cm → 10 cm に拡大"}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p>{language === "id" ? "Faktor perubahan:" : language === "en" ? "Scale factor:" : "変化の割合："}</p>
          <BlockMath math="k = \frac{r_n}{r_0} = \frac{10}{5} = 2" />
          <p>{language === "id" ? <>Karena <InlineMath math="V = \frac{4}{3}\pi r^3" />, maka:</> : language === "en" ? <>Since <InlineMath math="V = \frac{4}{3}\pi r^3" />, then:</> : <><InlineMath math="V = \frac{4}{3}\pi r^3" /> なので：</>}</p>
          <BlockMath math="V_n = \frac{4}{3}\pi (2r)^3 = 2^3 \cdot V = 8V" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">
            {language === "id" ? <>✅ Volume bola baru = <strong>8 kali</strong> volume semula</> : language === "en" ? <>✅ The new sphere's volume = <strong>8 times</strong> the original volume</> : <>✅ 新しい球の体積 = 元の体積の<strong>8倍</strong></>}
          </p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah tabung memiliki jari-jari <InlineMath math="r" /> dan tinggi <InlineMath math="t" />.</p>
            <p>Jika jari-jari diperbesar <strong>3 kali</strong> dan tinggi <strong>diperkecil menjadi setengahnya</strong>, bagaimana perbandingan volume baru terhadap volume lama?</p>
          </>
        ) : language === "en" ? (
          <>
            <p>A cylinder has radius <InlineMath math="r" /> and height <InlineMath math="t" />.</p>
            <p>If the radius is enlarged <strong>3 times</strong> and the height is <strong>reduced to half</strong>, what is the ratio of the new volume to the old volume?</p>
          </>
        ) : (
          <>
            <p>ある円柱の半径は<InlineMath math="r" />、高さは<InlineMath math="t" />です。</p>
            <p>半径を<strong>3倍</strong>に拡大し、高さを<strong>半分に縮小</strong>すると、新しい体積と元の体積の比はどうなりますか。</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">
          {language === "id" ? <>Diketahui: <InlineMath math="r_n = 3r" />, <InlineMath math="t_n = \frac{t}{2}" /></> : language === "en" ? <>Given: <InlineMath math="r_n = 3r" />, <InlineMath math="t_n = \frac{t}{2}" /></> : <>条件：<InlineMath math="r_n = 3r" />、<InlineMath math="t_n = \frac{t}{2}" /></>}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <BlockMath math="V_0 = \pi r^2 t" />
          <BlockMath math="V_n = \pi (3r)^2 \cdot \frac{t}{2} = \pi \cdot 9r^2 \cdot \frac{t}{2} = \frac{9}{2} \pi r^2 t" />
          <BlockMath math={language === "id" ? "\\frac{V_n}{V_0} = \\frac{\\frac{9}{2}\\pi r^2 t}{\\pi r^2 t} = \\frac{9}{2} = 4{,}5" : "\\frac{V_n}{V_0} = \\frac{\\frac{9}{2}\\pi r^2 t}{\\pi r^2 t} = \\frac{9}{2} = 4.5"} />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs">
          <p className="text-yellow-300 font-semibold">
            {language === "id" ? <>✅ Volume baru = <strong>4,5 kali</strong> volume lama</> : language === "en" ? <>✅ New volume = <strong>4.5 times</strong> the old volume</> : <>✅ 新しい体積 = 元の体積の<strong>4.5倍</strong></>}
          </p>
          <p className="text-white/60 mt-1">
            {language === "id" ? "Meskipun tinggi diperkecil ½, perbesaran r³ lebih mendominasi" : language === "en" ? "Even though the height is halved, the r³ growth dominates" : "高さが半分になっても、半径の3乗の増加の影響がより大きい"}
          </p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        {language === "id" ? (
          <>
            <p>Sebuah tabung A memiliki jari-jari <InlineMath math="6 \text{ cm}" /> dan tinggi <InlineMath math="10 \text{ cm}" />.</p>
            <p>Tabung B memiliki luas permukaan <strong>4 kali</strong> tabung A dan tinggi yang sama dengan tabung A.</p>
            <p>Tentukan: (a) jari-jari tabung B, (b) perbandingan volume tabung B terhadap tabung A.</p>
            <p className="text-xs text-white/50">(π = 3,14)</p>
          </>
        ) : language === "en" ? (
          <>
            <p>Cylinder A has radius <InlineMath math="6 \text{ cm}" /> and height <InlineMath math="10 \text{ cm}" />.</p>
            <p>Cylinder B has a surface area <strong>4 times</strong> that of cylinder A and the same height as cylinder A.</p>
            <p>Determine: (a) the radius of cylinder B, (b) the ratio of cylinder B's volume to cylinder A's volume.</p>
            <p className="text-xs text-white/50">(π = 3.14)</p>
          </>
        ) : (
          <>
            <p>円柱Aの半径は<InlineMath math="6 \text{ cm}" />、高さは<InlineMath math="10 \text{ cm}" />です。</p>
            <p>円柱Bの表面積は円柱Aの<strong>4倍</strong>で、高さは円柱Aと同じです。</p>
            <p>次を求めなさい：(a) 円柱Bの半径、(b) 円柱Bの体積と円柱Aの体積の比。</p>
            <p className="text-xs text-white/50">(π = 3.14)</p>
          </>
        )}
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 1 — Hitung luas permukaan tabung A:" : language === "en" ? "Step 1 — Calculate cylinder A's surface area:" : "手順1 — 円柱Aの表面積を計算："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="L_A = 2\pi r_A^2 + 2\pi r_A t = 2\pi (6)^2 + 2\pi (6)(10)" />
          <BlockMath math={language === "id" ? "L_A = 2 \\times 3{,}14 \\times 36 + 2 \\times 3{,}14 \\times 60" : "L_A = 2 \\times 3.14 \\times 36 + 2 \\times 3.14 \\times 60"} />
          <BlockMath math={language === "id" ? "L_A = 226{,}08 + 376{,}8 = 602{,}88 \\text{ cm}^2" : "L_A = 226.08 + 376.8 = 602.88 \\text{ cm}^2"} />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 2 — Cari jari-jari tabung B (L_B = 4 × L_A, t sama):" : language === "en" ? "Step 2 — Find cylinder B's radius (L_B = 4 × L_A, same t):" : "手順2 — 円柱Bの半径を求める（L_B = 4 × L_A、高さは同じ）："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math={language === "id" ? "L_B = 4 \\times L_A = 4 \\times 602{,}88 = 2411{,}52 \\text{ cm}^2" : "L_B = 4 \\times L_A = 4 \\times 602.88 = 2411.52 \\text{ cm}^2"} />
          <BlockMath math={language === "id" ? "2\\pi r_B^2 + 2\\pi r_B (10) = 2411{,}52" : "2\\pi r_B^2 + 2\\pi r_B (10) = 2411.52"} />
          <BlockMath math={language === "id" ? "6{,}28 r_B^2 + 62{,}8 r_B - 2411{,}52 = 0" : "6.28 r_B^2 + 62.8 r_B - 2411.52 = 0"} />
          <p className="text-white/60">{language === "id" ? "Bagi dengan 6,28:" : language === "en" ? "Divide by 6.28:" : "6.28で割る："}</p>
          <BlockMath math="r_B^2 + 10 r_B - 384 = 0" />
          <BlockMath math="(r_B - 16)(r_B + 24) = 0 \Rightarrow r_B = 16 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">
          {language === "id" ? "Langkah 3 — Perbandingan volume:" : language === "en" ? "Step 3 — Volume ratio:" : "手順3 — 体積の比："}
        </p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math={language === "id" ? "\\frac{V_B}{V_A} = \\frac{\\pi r_B^2 t}{\\pi r_A^2 t} = \\frac{r_B^2}{r_A^2} = \\frac{16^2}{6^2} = \\frac{256}{36} = \\frac{64}{9} \\approx 7{,}11" : "\\frac{V_B}{V_A} = \\frac{\\pi r_B^2 t}{\\pi r_A^2 t} = \\frac{r_B^2}{r_A^2} = \\frac{16^2}{6^2} = \\frac{256}{36} = \\frac{64}{9} \\approx 7.11"} />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
          <p className="text-red-300 font-semibold">{language === "id" ? "✅ Jawaban:" : language === "en" ? "✅ Answer:" : "✅ 答え："}</p>
          <p className="text-white/80">
            {language === "id" ? <>• Jari-jari tabung B = <strong className="text-yellow-300">16 cm</strong></> : language === "en" ? <>• Cylinder B's radius = <strong className="text-yellow-300">16 cm</strong></> : <>• 円柱Bの半径 = <strong className="text-yellow-300">16 cm</strong></>}
          </p>
          <p className="text-white/80">
            {language === "id" ? <>• Volume B : Volume A = <strong className="text-yellow-300">64 : 9</strong> ≈ 7,11 kali lebih besar</> : language === "en" ? <>• Volume B : Volume A = <strong className="text-yellow-300">64 : 9</strong> ≈ 7.11 times larger</> : <>• 体積B : 体積A = <strong className="text-yellow-300">64 : 9</strong> ≈ 約7.11倍</>}
          </p>
        </div>
      </div>
    ),
  },
  ];
}

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */

const ExampleCard = ({ ex, idx, prefix, language, showLabel, hideLabel }: { ex: Ex; idx: number; prefix: string; language: Language; showLabel: string; hideLabel: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {levelLabel(ex.level, language)}
          </span>
        </div>
        {ex.question}
      </div>
      <button onClick={() => { playPopSound(); setShow(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50">
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? hideLabel : showLabel}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const PerubahanVolumePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const pt = pageTrans[language];
  const s0 = slide0Trans[language];
  const sections = getSections(language);
  const exampleList = getExamples(language);

  const slides = [
    {
      title: pt.slide0Title,
      icon: "🔄",
      content: (
        <div className="space-y-4 font-body">
          <p className="text-white/80 text-sm leading-relaxed">{s0.intro}</p>
          <ScaleComparisonSVG />
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p className="font-bold text-cyan-300">{s0.quickTitle}</p>
            <p>• {s0.q1}</p>
            <p>• {s0.q2}</p>
          </div>
        </div>
      ),
    },
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    {
      title: pt.examplesTitle,
      icon: "📝",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">{pt.examplesSubtitle}</p>
          <div className="flex flex-col gap-4">
            {exampleList.map((ex, i) => <ExampleCard key={`e${i}`} ex={ex} idx={i} prefix={pt.examplesPrefix} language={language} showLabel={pt.showSolution} hideLabel={pt.hideSolution}/>)}
          </div>
        </div>
      ),
    },
  ];

  const total = slides.length;
  const slide = slides[currentSlide];

  const goPrev = () => { playPopSound(); setCurrentSlide(i => Math.max(0, i - 1)); };
  const goNext = () => { playPopSound(); setCurrentSlide(i => Math.min(total - 1, i + 1)); };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {pt.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{pt.subtitle}</p>

        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { playPopSound(); setCurrentSlide(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentSlide ? "bg-primary scale-125" : "bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
            <span className="text-2xl">{slide.icon}</span>
            <h2 className="font-display text-sm font-semibold text-white">{slide.title}</h2>
            <span className="ml-auto text-xs text-white/30 font-body">{currentSlide + 1}/{total}</span>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4" /> {pt.prev}
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            {pt.next} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {pt.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerubahanVolumePage;
