import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical, Ruler } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import PythagorasRearrangementAnimation from "@/components/PythagorasRearrangementAnimation";
import PythagorasWaterProof from "@/components/PythagorasWaterProof";
import PythagorasSquaresAnimation from "@/components/PythagorasSquaresAnimation";
import PythagorasDiscoveryAnimation from "@/components/PythagorasDiscoveryAnimation";
import PythagorasStepProof from "@/components/PythagorasStepProof";

/*
  Pembuktian SVG — 4 right-triangles (a=60, b=80, c=100) inside a square (side=140).
*/
const PP_TRANSLATIONS = {
  id: {
    pageTitle: "PEMBUKTIAN TEOREMA PYTHAGORAS DAN MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU",
    pageSubtitle: "Kelas 8 · Teorema Pythagoras · Materi Matematika",
    svgDerivation: "PENURUNAN RUMUS",
    svgMethod1: "🟡 Cara 1 — rumus persegi (a+b)",
    svgMethod2: "🔵 Cara 2 — 4 segitiga + c²",
    svgEquate: "↓ samakan → kurangi 2ab",
    scenario1Label: "Skenario 1",
    scenario1Title: "Cari hipotenusa c",
    scenario1Desc: "Diketahui: a dan b  →  Cari: c (sisi miring)",
    scenario2Label: "Skenario 2",
    scenario2Title: "Cari kaki pertama a",
    scenario2Desc: "Diketahui: b dan c  →  Cari: a (kaki 1)",
    scenario3Label: "Skenario 3",
    scenario3Title: "Cari kaki kedua b",
    scenario3Desc: "Diketahui: a dan c  →  Cari: b (kaki 2)",
    secIntro: "🌟 Selamat Datang di Dunia Teorema Pythagoras!",
    secProof1: "🎬 Pembuktian 1 — Animasi Penemuan Persegi",
    secProof2: "💧 Pembuktian 2 — Animasi Air",
    secProof3: "🟦 Pembuktian 3 — Animasi Persegi Bergerak",
    secProof4: "🔷 Pembuktian 4 — Langkah demi Langkah",
    secProof5: "🎮 Pembuktian 5 — Interaktif",
    secFormula: "📐 Rumus & Variasi Teorema Pythagoras",
    secEx1: "✏️ Contoh Soal 1 — Bilangan Bulat",
    secEx2: "✏️ Contoh Soal 2 — Bilangan Irasional",
    secEx3: "✏️ Contoh Soal 3 — Kapal Berlayar (Soal Cerita)",
    secSummary: "📌 Rangkuman Sub-Bab",
    secSquares: "⚡ Hafal Bilangan Kuadrat 1–30",
    backBtn: "← Kembali ke Teorema Pythagoras",
    introPart1: "Lebih dari 2.500 tahun lalu, seorang matematikawan Yunani bernama ",
    introPart2: " menemukan sebuah pola yang luar biasa di setiap segitiga siku-siku. Hubungan antar sisi-sisinya selalu berlaku, tanpa terkecuali! Inilah yang kita kenal sebagai ",
    termPythagoras: "Teorema Pythagoras",
    introPart3: " — salah satu rumus paling terkenal di dunia matematika.",
    realWorldTitle: "🏗️ Kegunaan Teorema Pythagoras dalam Kehidupan Nyata",
    realWorldDesc: "Teorema Pythagoras bukan sekadar rumus di buku teks — ia dipakai setiap hari oleh para profesional di berbagai bidang:",
    rw1Label: "Konstruksi & Arsitektur",
    rw1Text: "Para pekerja bangunan menggunakan Teorema Pythagoras untuk memastikan sudut bangunan benar-benar 90° (siku-siku), mengukur diagonal pondasi, dan menghitung panjang rangka atap secara presisi.",
    rw2Label: "Navigasi & Pemetaan",
    rw2Text: "Menentukan jarak terpendek antara dua titik di peta, digunakan pada GPS dan sistem navigasi kapal maupun pesawat.",
    rw3Label: "Teknologi & Sinyal",
    rw3Text: "Menghitung jangkauan sinyal antena, jarak antar menara telekomunikasi, dan posisi satelit.",
    rw4Label: "Game & Grafis Komputer",
    rw4Text: "Menghitung jarak antar objek dalam ruang 2D dan 3D, dipakai dalam rendering dan deteksi tabrakan (collision detection).",
    rw5Label: "Kedokteran & Imaging",
    rw5Text: "Digunakan dalam pemrosesan gambar medis seperti CT scan dan MRI untuk menghitung jarak dan ukuran organ.",
  },
  en: {
    pageTitle: "PROVING THE PYTHAGOREAN THEOREM AND CALCULATING SIDE LENGTHS OF RIGHT TRIANGLES",
    pageSubtitle: "Grade 8 · Pythagorean Theorem · Mathematics",
    svgDerivation: "FORMULA DERIVATION",
    svgMethod1: "🟡 Method 1 — large square formula (a+b)",
    svgMethod2: "🔵 Method 2 — 4 triangles + c²",
    svgEquate: "↓ equate → subtract 2ab",
    scenario1Label: "Scenario 1",
    scenario1Title: "Find hypotenuse c",
    scenario1Desc: "Given: a and b  →  Find: c (hypotenuse)",
    scenario2Label: "Scenario 2",
    scenario2Title: "Find leg a",
    scenario2Desc: "Given: b and c  →  Find: a (leg 1)",
    scenario3Label: "Scenario 3",
    scenario3Title: "Find leg b",
    scenario3Desc: "Given: a and c  →  Find: b (leg 2)",
    secIntro: "🌟 Welcome to the World of the Pythagorean Theorem!",
    secProof1: "🎬 Proof 1 — Square Discovery Animation",
    secProof2: "💧 Proof 2 — Water Animation",
    secProof3: "🟦 Proof 3 — Moving Squares Animation",
    secProof4: "🔷 Proof 4 — Step by Step",
    secProof5: "🎮 Proof 5 — Interactive",
    secFormula: "📐 Formula & Variations of the Pythagorean Theorem",
    secEx1: "✏️ Example 1 — Whole Numbers",
    secEx2: "✏️ Example 2 — Irrational Numbers",
    secEx3: "✏️ Example 3 — Ship Navigation (Word Problem)",
    secSummary: "📌 Section Summary",
    secSquares: "⚡ Memorize Perfect Squares 1–30",
    backBtn: "← Back to Pythagorean Theorem",
    introPart1: "More than 2,500 years ago, a Greek mathematician named ",
    introPart2: " discovered a remarkable pattern in every right triangle. The relationship between its sides always holds, without exception! This is what we know as the ",
    termPythagoras: "Pythagorean Theorem",
    introPart3: " — one of the most famous formulas in mathematics.",
    realWorldTitle: "🏗️ Uses of the Pythagorean Theorem in Real Life",
    realWorldDesc: "The Pythagorean Theorem isn't just a formula in a textbook — it is used every day by professionals across many fields:",
    rw1Label: "Construction & Architecture",
    rw1Text: "Construction workers use the Pythagorean Theorem to ensure building corners are exactly 90° (right angles), measure foundation diagonals, and calculate roof frame lengths with precision.",
    rw2Label: "Navigation & Mapping",
    rw2Text: "Determining the shortest distance between two points on a map, used in GPS and navigation systems for ships and aircraft.",
    rw3Label: "Technology & Signals",
    rw3Text: "Calculating the range of antenna signals, distances between telecommunications towers, and satellite positions.",
    rw4Label: "Game & Computer Graphics",
    rw4Text: "Calculating distances between objects in 2D and 3D space, used in rendering and collision detection.",
    rw5Label: "Medicine & Imaging",
    rw5Text: "Used in processing medical images such as CT scans and MRI to calculate distances and organ sizes.",
  },
  ja: {
    pageTitle: "三平方の定理の証明と直角三角形の辺の長さの計算",
    pageSubtitle: "中学2年 · 三平方の定理 · 数学",
    svgDerivation: "公式の導出",
    svgMethod1: "🟡 方法 1 — 大きな正方形の公式 (a+b)",
    svgMethod2: "🔵 方法 2 — 4 つの三角形 + c²",
    svgEquate: "↓ 等式 → 2ab を引く",
    scenario1Label: "ケース 1",
    scenario1Title: "斜辺 c を求める",
    scenario1Desc: "既知: a と b  →  求: c（斜辺）",
    scenario2Label: "ケース 2",
    scenario2Title: "脚 a を求める",
    scenario2Desc: "既知: b と c  →  求: a（脚 1）",
    scenario3Label: "ケース 3",
    scenario3Title: "脚 b を求める",
    scenario3Desc: "既知: a と c  →  求: b（脚 2）",
    secIntro: "🌟 三平方の定理の世界へようこそ！",
    secProof1: "🎬 証明 1 — 正方形発見アニメーション",
    secProof2: "💧 証明 2 — 水アニメーション",
    secProof3: "🟦 証明 3 — 動く正方形のアニメーション",
    secProof4: "🔷 証明 4 — ステップ・バイ・ステップ",
    secProof5: "🎮 証明 5 — インタラクティブ",
    secFormula: "📐 三平方の定理の公式と変形",
    secEx1: "✏️ 例題 1 — 整数",
    secEx2: "✏️ 例題 2 — 無理数",
    secEx3: "✏️ 例題 3 — 船の航行（文章題）",
    secSummary: "📌 セクションまとめ",
    secSquares: "⚡ 平方数 1–30 を覚えよう",
    backBtn: "← 三平方の定理に戻る",
    introPart1: "2,500年以上前、ギリシャの数学者",
    introPart2: "は、直角三角形に驚くべきパターンを発見しました。辺の間の関係は、例外なく常に成り立ちます！これが私たちが「",
    termPythagoras: "三平方の定理",
    introPart3: "」として知るもの — 数学界で最も有名な公式の一つです。",
    realWorldTitle: "🏗️ 三平方の定理の実生活での利用",
    realWorldDesc: "三平方の定理は教科書の公式にとどまりません — さまざまな分野の専門家が毎日活用しています：",
    rw1Label: "建設・建築",
    rw1Text: "建設作業員は三平方の定理を使って、建物の角が正確に90°（直角）であることを確認し、基礎の対角線を測定し、屋根の骨組みの長さを精密に計算します。",
    rw2Label: "ナビゲーション・測量",
    rw2Text: "地図上の2点間の最短距離を求めるため、GPS や船・航空機のナビゲーションシステムで使われています。",
    rw3Label: "技術・電波",
    rw3Text: "アンテナの電波到達範囲、通信タワー間の距離、衛星の位置を計算します。",
    rw4Label: "ゲーム・コンピュータグラフィックス",
    rw4Text: "2Dおよび3D空間でのオブジェクト間の距離計算に使われ、レンダリングや衝突検出（コリジョン）に応用されています。",
    rw5Label: "医療・イメージング",
    rw5Text: "CTスキャンやMRIなどの医療画像処理で、距離や臓器のサイズを計算するために使われます。",
  },
};

const PembuktianSVG = ({ lang = "id" }: { lang?: string }) => {
  const t = PP_TRANSLATIONS[lang as keyof typeof PP_TRANSLATIONS] ?? PP_TRANSLATIONS.id;
  return (
  <svg viewBox="0 0 440 238" className="w-full max-w-2xl mx-auto my-2" aria-label="Pembuktian Teorema Pythagoras - Metode Persegi">
    <defs>
      <style>{`
        @keyframes lbl-pulse{0%,100%{opacity:1;}50%{opacity:0.45;}}
        @keyframes c2-glow{0%,100%{opacity:1;}50%{opacity:0.6;}}
        .lbl-anim{animation:lbl-pulse 2.8s ease-in-out infinite;}
        .c2-anim{animation:c2-glow 2s ease-in-out infinite;}
      `}</style>
      <filter id="psv-glow">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="psv-glow-lg">
        <feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <rect x="35" y="25" width="154" height="154"
      fill="rgba(15,23,42,0.5)" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" strokeDasharray="7 3"/>

    <polygon points="35,25 123,25 35,91"   fill="#3b82f6" fillOpacity="0.72" stroke="#60a5fa" strokeWidth="1.5"/>
    <polygon points="189,25 189,113 123,25" fill="#22c55e" fillOpacity="0.72" stroke="#4ade80" strokeWidth="1.5"/>
    <polygon points="189,179 101,179 189,113" fill="#f97316" fillOpacity="0.72" stroke="#fb923c" strokeWidth="1.5"/>
    <polygon points="35,179 35,91 101,179"  fill="#a855f7" fillOpacity="0.72" stroke="#c084fc" strokeWidth="1.5"/>

    <polygon points="123,25 189,113 101,179 35,91"
      fill="rgba(239,68,68,0.18)" stroke="#ef4444" strokeWidth="2.5"
      filter="url(#psv-glow)" className="c2-anim"/>
    <text x="113" y="105" textAnchor="middle"
      fill="rgba(252,165,165,0.9)" fontSize="15" fontWeight="bold" fontFamily="monospace"
      filter="url(#psv-glow)" className="c2-anim">c²</text>
    <text x="158" y="63" fill="#fca5a5" fontSize="12" fontWeight="bold" className="lbl-anim" filter="url(#psv-glow)">c</text>

    <polyline points="35,33 43,33 43,25"   fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.55"/>
    <polyline points="181,25 181,33 189,33" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.55"/>
    <polyline points="189,171 181,171 181,179" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.55"/>
    <polyline points="43,179 43,171 35,171"  fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.55"/>

    <text x="79"  y="18" fill="#86efac" fontSize="12" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="156" y="18" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    <text x="196" y="74"  fill="#86efac" fontSize="12" fontWeight="bold" className="lbl-anim">b</text>
    <text x="196" y="151" fill="#93c5fd" fontSize="12" fontWeight="bold" className="lbl-anim">a</text>
    <text x="68"  y="194" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    <text x="145" y="194" fill="#86efac" fontSize="12" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>
    <text x="27"  y="62"  fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle" className="lbl-anim">a</text>
    <text x="27"  y="140" fill="#86efac" fontSize="12" fontWeight="bold" textAnchor="middle" className="lbl-anim">b</text>

    <line x1="35" y1="12" x2="189" y2="12" stroke="rgba(100,116,139,0.55)" strokeWidth="1"/>
    <line x1="35"  y1="8" x2="35"  y2="16" stroke="rgba(100,116,139,0.55)" strokeWidth="1.5"/>
    <line x1="189" y1="8" x2="189" y2="16" stroke="rgba(100,116,139,0.55)" strokeWidth="1.5"/>
    <text x="112" y="8" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">a + b</text>

    <line x1="206" y1="10" x2="206" y2="228" stroke="rgba(51,65,85,0.9)" strokeWidth="1" strokeDasharray="4 2"/>

    <rect x="212" y="12" width="222" height="218" rx="10"
      fill="rgba(15,23,42,0.88)" stroke="rgba(51,65,85,0.8)" strokeWidth="1"/>

    <text x="323" y="30" textAnchor="middle" fill="#64748b" fontSize="9.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.8">{t.svgDerivation}</text>
    <line x1="219" y1="35" x2="427" y2="35" stroke="rgba(51,65,85,0.8)" strokeWidth="1"/>

    <rect x="218" y="39" width="216" height="42" rx="6"
      fill="rgba(234,179,8,0.1)" stroke="rgba(234,179,8,0.35)" strokeWidth="1"/>
    <text x="226" y="53" fill="#fbbf24" fontSize="9.5" fontWeight="bold" fontFamily="monospace">{t.svgMethod1}</text>
    <text x="226" y="68" fill="#fde68a" fontSize="11.5" fontWeight="bold" fontFamily="monospace">(a+b)² = a² + 2ab + b²</text>

    <text x="323" y="94" textAnchor="middle" fill="#475569" fontSize="13" fontWeight="bold" fontFamily="monospace">=</text>

    <rect x="218" y="98" width="216" height="42" rx="6"
      fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.35)" strokeWidth="1"/>
    <text x="226" y="112" fill="#60a5fa" fontSize="9.5" fontWeight="bold" fontFamily="monospace">{t.svgMethod2}</text>
    <text x="226" y="127" fill="#93c5fd" fontSize="11.5" fontWeight="bold" fontFamily="monospace">4×½ab + c² = 2ab + c²</text>

    <text x="323" y="153" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">{t.svgEquate}</text>
    <line x1="218" y1="157" x2="434" y2="157" stroke="rgba(71,85,105,0.6)" strokeWidth="1" strokeDasharray="3 2"/>

    <text x="226" y="171" fill="#94a3b8" fontSize="10.5" fontFamily="monospace">a² + 2ab + b² = 2ab + c²</text>
    <text x="226" y="183" fill="#475569" fontSize="9"   fontFamily="monospace">    ─────       ─────</text>
    <text x="226" y="193" fill="#64748b" fontSize="9"   fontFamily="monospace">    − 2ab        − 2ab</text>

    <rect x="218" y="198" width="216" height="26" rx="6"
      fill="rgba(239,68,68,0.18)" stroke="rgba(239,68,68,0.7)" strokeWidth="1.8"
      filter="url(#psv-glow-lg)" className="c2-anim"/>
    <text x="323" y="216" textAnchor="middle"
      fill="#fca5a5" fontSize="13" fontWeight="bold" fontFamily="monospace"
      filter="url(#psv-glow)" className="c2-anim">∴ a² + b² = c²  ✓</text>
  </svg>
  );
};

const SegitigaSikuSVG = () => (
  <svg viewBox="0 0 200 160" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga siku-siku">
    <defs>
      <style>{`
        @keyframes sideGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.3;}}
        .side-a{animation:sideGlow 1.8s ease-in-out infinite;}
        .side-b{animation:sideGlow 1.8s ease-in-out infinite 0.6s;}
        .side-c{animation:sideGlow 1.8s ease-in-out infinite 1.2s;}
      `}</style>
    </defs>
    <polygon points="20,130 160,130 20,20" fill="rgba(59,130,246,0.15)" stroke="none"/>
    <line x1="20" y1="130" x2="160" y2="130" stroke="#22c55e" strokeWidth="3" className="side-b"/>
    <line x1="20" y1="20" x2="20" y2="130" stroke="#3b82f6" strokeWidth="3" className="side-a"/>
    <line x1="20" y1="20" x2="160" y2="130" stroke="#f97316" strokeWidth="3" className="side-c"/>
    <polyline points="20,110 40,110 40,130" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.7"/>
    <text x="8"   y="80"  fill="#60a5fa" fontSize="14" fontWeight="bold">a</text>
    <text x="87"  y="148" fill="#4ade80" fontSize="14" fontWeight="bold">b</text>
    <text x="100" y="75"  fill="#fb923c" fontSize="14" fontWeight="bold">c</text>
    <text x="20"  y="13"  fill="#94a3b8" fontSize="9">A</text>
    <text x="162" y="134" fill="#94a3b8" fontSize="9">B</text>
    <text x="8"   y="134" fill="#94a3b8" fontSize="9">C</text>
    <text x="44"  y="126" fill="var(--icon-color)" fontSize="8" opacity="0.6">90°</text>
  </svg>
);

const RumusVariasiSVG = ({ lang = "id" }: { lang?: string }) => {
  const t = PP_TRANSLATIONS[lang as keyof typeof PP_TRANSLATIONS] ?? PP_TRANSLATIONS.id;
  return (
  <svg viewBox="0 0 420 230" className="w-full max-w-xl mx-auto my-2" aria-label="Tiga skenario variasi rumus Pythagoras">
    <defs>
      <style>{`
        @keyframes glw{0%,100%{opacity:1;}50%{opacity:0.45;}}
        .gl-c{animation:glw 2.2s ease-in-out infinite;}
        .gl-a{animation:glw 2.2s ease-in-out infinite 0.73s;}
        .gl-b{animation:glw 2.2s ease-in-out infinite 1.47s;}
      `}</style>
      <filter id="rvs-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* ── Main background ── */}
    <rect x="1" y="1" width="418" height="228" rx="12" fill="rgba(10,15,30,0.92)" stroke="rgba(51,65,85,0.7)" strokeWidth="1.4"/>

    {/* ════ LEFT: Main labeled triangle ════ */}
    {/* Right angle at C=(38,200), A=(38,30) vertical leg=a, B=(178,200) horizontal leg=b */}
    <polygon points="38,30 178,200 38,200" fill="rgba(99,102,241,0.08)"/>

    {/* Side a — vertical, blue */}
    <line x1="38" y1="30" x2="38" y2="200" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round"/>
    {/* Side b — horizontal, green */}
    <line x1="38" y1="200" x2="178" y2="200" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round"/>
    {/* Hypotenuse c — orange */}
    <line x1="38" y1="30" x2="178" y2="200" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round"/>

    {/* Right-angle mark */}
    <polyline points="38,186 52,186 52,200" fill="none" stroke="rgba(148,163,184,0.85)" strokeWidth="1.8"/>

    {/* 90° label */}
    <text x="28" y="58" fill="#64748b" fontSize="9" fontFamily="monospace">90°</text>

    {/* Vertex labels */}
    <text x="24" y="28" fill="#94a3b8" fontSize="10" fontWeight="bold">A</text>
    <text x="24" y="213" fill="#94a3b8" fontSize="10" fontWeight="bold">C</text>
    <text x="183" y="213" fill="#94a3b8" fontSize="10" fontWeight="bold">B</text>

    {/* Side label badges */}
    {/* a badge */}
    <rect x="6" y="107" width="26" height="26" rx="6" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1.5"/>
    <text x="19" y="124" textAnchor="middle" fill="#93c5fd" fontSize="16" fontWeight="bold" fontFamily="sans-serif">a</text>
    {/* b badge */}
    <rect x="97" y="205" width="26" height="20" rx="5" fill="rgba(34,197,94,0.3)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="110" y="219" textAnchor="middle" fill="#86efac" fontSize="15" fontWeight="bold" fontFamily="sans-serif">b</text>
    {/* c badge */}
    <rect x="95" y="99" width="26" height="26" rx="6" fill="rgba(249,115,22,0.3)" stroke="#f97316" strokeWidth="1.5" className="gl-c"/>
    <text x="108" y="116" textAnchor="middle" fill="#fdba74" fontSize="16" fontWeight="bold" fontFamily="sans-serif" className="gl-c">c</text>

    {/* ════ DIVIDER ════ */}
    <line x1="196" y1="8" x2="196" y2="222" stroke="rgba(71,85,105,0.6)" strokeWidth="1.2" strokeDasharray="5 3"/>

    {/* ════ RIGHT: 3 Scenario panels ════ */}

    {/* SCENARIO 1 — Cari c */}
    <rect x="202" y="8" width="210" height="66" rx="8" fill="rgba(249,115,22,0.09)" stroke="rgba(249,115,22,0.55)" strokeWidth="1.4"/>
    <rect x="207" y="13" width="36" height="16" rx="4" fill="rgba(249,115,22,0.25)"/>
    <text x="225" y="24" textAnchor="middle" fill="#fb923c" fontSize="9" fontWeight="bold" fontFamily="sans-serif">{t.scenario1Label}</text>
    <text x="250" y="24" fill="#fdba74" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">{t.scenario1Title}</text>
    <text x="208" y="38" fill="#94a3b8" fontSize="8.5" fontFamily="sans-serif">{t.scenario1Desc}</text>
    {/* Formula box */}
    <rect x="207" y="44" width="199" height="25" rx="5" fill="rgba(0,0,0,0.5)" stroke="rgba(249,115,22,0.4)" strokeWidth="1" className="gl-c"/>
    <text x="306" y="60" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="bold" fontFamily="monospace" filter="url(#rvs-glow)" className="gl-c">c² = a² + b²</text>

    {/* SCENARIO 2 — Cari a */}
    <rect x="202" y="82" width="210" height="66" rx="8" fill="rgba(59,130,246,0.09)" stroke="rgba(59,130,246,0.55)" strokeWidth="1.4"/>
    <rect x="207" y="87" width="36" height="16" rx="4" fill="rgba(59,130,246,0.25)"/>
    <text x="225" y="98" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold" fontFamily="sans-serif">{t.scenario2Label}</text>
    <text x="250" y="98" fill="#93c5fd" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">{t.scenario2Title}</text>
    <text x="208" y="112" fill="#94a3b8" fontSize="8.5" fontFamily="sans-serif">{t.scenario2Desc}</text>
    <rect x="207" y="118" width="199" height="25" rx="5" fill="rgba(0,0,0,0.5)" stroke="rgba(59,130,246,0.4)" strokeWidth="1" className="gl-a"/>
    <text x="306" y="134" textAnchor="middle" fill="#bfdbfe" fontSize="14" fontWeight="bold" fontFamily="monospace" filter="url(#rvs-glow)" className="gl-a">a² = c² - b²</text>

    {/* SCENARIO 3 — Cari b */}
    <rect x="202" y="156" width="210" height="66" rx="8" fill="rgba(34,197,94,0.09)" stroke="rgba(34,197,94,0.55)" strokeWidth="1.4"/>
    <rect x="207" y="161" width="36" height="16" rx="4" fill="rgba(34,197,94,0.25)"/>
    <text x="225" y="172" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="bold" fontFamily="sans-serif">{t.scenario3Label}</text>
    <text x="250" y="172" fill="#86efac" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">{t.scenario3Title}</text>
    <text x="208" y="186" fill="#94a3b8" fontSize="8.5" fontFamily="sans-serif">{t.scenario3Desc}</text>
    <rect x="207" y="192" width="199" height="25" rx="5" fill="rgba(0,0,0,0.5)" stroke="rgba(34,197,94,0.4)" strokeWidth="1" className="gl-b"/>
    <text x="306" y="208" textAnchor="middle" fill="#bbf7d0" fontSize="14" fontWeight="bold" fontFamily="monospace" filter="url(#rvs-glow)" className="gl-b">b² = c² - a²</text>
  </svg>
  );
};

const HitungSVG = ({ a, b, c, cari }: { a: number; b: number; c: number; cari: "a"|"b"|"c" }) => {
  const maxVal = Math.max(a*a, b*b, c*c);
  const scale  = 260 / maxVal;
  return (
    <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto" aria-label="Visualisasi perhitungan">
      <rect x="20" y="15" width={a*a*scale} height="18" rx="4" fill={cari==="c"?"#3b82f6":"#3b82f690"}/>
      <text x="20" y="42" fill="#60a5fa" fontSize="9" fontFamily="monospace">a² = {a}² = {a*a}</text>
      <rect x="20" y="50" width={b*b*scale} height="18" rx="4" fill={cari==="c"?"#22c55e":"#22c55e90"}/>
      <text x="20" y="77" fill="#4ade80" fontSize="9" fontFamily="monospace">b² = {b}² = {b*b}</text>
      <rect x="20" y="85" width={c*c*scale} height="18" rx="4" fill={(cari==="a"||cari==="b")?"#f97316":"#f9731690"}/>
      <text x="20" y="112" fill="#fb923c" fontSize="9" fontFamily="monospace">c² = {c}² = {c*c}</text>
      <text x={a*a*scale + b*b*scale + 25} y="58" fill="#eab308" fontSize="14" fontFamily="monospace">✓</text>
    </svg>
  );
};

const PembuktianPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const ppt = PP_TRANSLATIONS[language as keyof typeof PP_TRANSLATIONS] ?? PP_TRANSLATIONS.id;

  const SectionHeader = ({ icon, iconColor, title }: { id?: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
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
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center leading-snug">
          {ppt.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{ppt.pageSubtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══ INTRO ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title={ppt.secIntro}/>
            <div className="px-5 pb-5 space-y-4">
              <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                {ppt.introPart1}<strong className="text-cyan-300">Pythagoras</strong>{ppt.introPart2}<strong className="text-yellow-300">{ppt.termPythagoras}</strong>{ppt.introPart3}
              </p>

              <div className={`${isDark ? "bg-slate-800/70 border-slate-600/50" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className="text-yellow-300 font-semibold text-sm">{ppt.realWorldTitle}</p>
                <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                  {ppt.realWorldDesc}
                </p>
                <ul className="space-y-2 font-body text-sm text-white/75">
                  <li className="flex gap-2">
                    <span className="text-orange-400 shrink-0">🏗️</span>
                    <span><strong className="text-orange-300">{ppt.rw1Label}</strong> — {ppt.rw1Text}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 shrink-0">🗺️</span>
                    <span><strong className="text-cyan-300">{ppt.rw2Label}</strong> — {ppt.rw2Text}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400 shrink-0">📡</span>
                    <span><strong className="text-green-300">{ppt.rw3Label}</strong> — {ppt.rw3Text}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 shrink-0">🎮</span>
                    <span><strong className="text-purple-300">{ppt.rw4Label}</strong> — {ppt.rw4Text}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-400 shrink-0">⚕️</span>
                    <span><strong className="text-pink-300">{ppt.rw5Label}</strong> — {ppt.rw5Text}</span>
                  </li>
                </ul>

                <figure className="rounded-xl overflow-hidden border border-yellow-500/30 bg-slate-900/60">
                  <img
                    src="/pythagoras-construction.png"
                    alt="Pekerja konstruksi menggunakan Teorema Pythagoras di lapangan"
                    className="w-full object-contain"
                  />
                  <figcaption className="text-center text-white/40 text-xs py-2 px-3 font-body italic">
                    bing.com/images/create
                  </figcaption>
                </figure>

                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mt-2">
                  <p className="font-body text-xs text-yellow-200">
                    💡 <strong>Fakta Menarik:</strong> Teknik "<em>3-4-5</em>" yang dipakai tukang bangunan untuk memastikan sudut siku-siku adalah penerapan langsung Teorema Pythagoras (3² + 4² = 5²) — digunakan sejak zaman Mesir Kuno!
                  </p>
                </div>
              </div>

              <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-cyan-300 font-semibold text-sm mb-3">🔭 Rumus Inti Teorema Pythagoras</p>
                <SegitigaSikuSVG/>
                <div className="bg-slate-900/60 rounded-lg p-3">
                  <BlockMath math="a^2 + b^2 = c^2"/>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-body">
                  <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-2 text-center">
                    <p className="text-blue-300 font-bold"><InlineMath math="a"/></p>
                    <p className="text-white/60 mt-1">Sisi siku-siku (kaki 1)</p>
                  </div>
                  <div className="bg-green-900/40 border border-green-500/30 rounded-lg p-2 text-center">
                    <p className="text-green-300 font-bold"><InlineMath math="b"/></p>
                    <p className="text-white/60 mt-1">Sisi siku-siku (kaki 2)</p>
                  </div>
                  <div className="bg-orange-900/40 border border-orange-500/30 rounded-lg p-2 text-center">
                    <p className="text-orange-300 font-bold"><InlineMath math="c"/></p>
                    <p className="text-white/60 mt-1">Hipotenusa (miring)</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-cyan-300/70 text-xs font-body font-semibold uppercase tracking-wide">🔄 Variasi Rumus — Mencari Sisi Lain</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-3 space-y-1">
                      <p className="text-blue-300 text-xs font-body font-semibold">Mencari sisi siku-siku <InlineMath math="a"/></p>
                      <p className="text-white/50 text-xs font-body">Jika <InlineMath math="b"/> dan <InlineMath math="c"/> diketahui:</p>
                      <div className="bg-slate-900/60 rounded-lg px-3 py-1">
                        <BlockMath math="a^2 = c^2 - b^2"/>
                      </div>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3 space-y-1">
                      <p className="text-green-300 text-xs font-body font-semibold">Mencari sisi siku-siku <InlineMath math="b"/></p>
                      <p className="text-white/50 text-xs font-body">Jika <InlineMath math="a"/> dan <InlineMath math="c"/> diketahui:</p>
                      <div className="bg-slate-900/60 rounded-lg px-3 py-1">
                        <BlockMath math="b^2 = c^2 - a^2"/>
                      </div>
                    </div>
                  </div>
                  <div className={isDark ? "bg-slate-700/40 border border-slate-600/40 rounded-lg p-2 mt-1" : "bg-gray-50 border border-gray-200 rounded-lg p-2 mt-1"}>
                    <p className="text-white/50 text-xs font-body text-center">
                      💡 Ketiga rumus ini berasal dari <strong className="text-yellow-300">persamaan yang sama</strong> — hanya dipindah-pindah ruas saja!
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">
                  💡 <strong>Ingat!</strong> Huruf <strong className="text-orange-300">c</strong> selalu mewakili sisi miring (hipotenusa) — yaitu sisi yang berhadapan dengan sudut 90°. Ini adalah sisi terpanjang dari segitiga siku-siku.
                </p>
              </div>
            </div>
          </div>

          {/* VIDEO YOUTUBE — Pembuktian 1 */}
          <div className="w-full">
            <p className="text-center font-display font-bold text-white text-base md:text-lg mb-3 tracking-wide">
              📽️ Pembuktian Teorema Pythagoras 1 (Video Animasi)
            </p>
            <div className="rounded-2xl overflow-hidden border border-cyan-500/40 shadow-lg shadow-cyan-900/30 bg-black">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/COkhrDbNcuA?rel=0&modestbranding=1"
                  title="Pembuktian Teorema Pythagoras"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="text-center text-white/50 text-xs mt-2 font-body">
              oleh{" "}
              <a
                href="https://www.youtube.com/watch?v=COkhrDbNcuA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                Beau Janzen
              </a>
            </p>
          </div>

          {/* DISCOVERY ANIMATION — Pembuktian 1 */}
          <div className="bg-card/80 backdrop-blur border border-teal-500/40 rounded-2xl overflow-hidden">
            <SectionHeader id="discovery" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-teal-400" title={ppt.secProof1}/>
            <div className="px-4 pb-5">
              <PythagorasDiscoveryAnimation />
            </div>
          </div>

          {/* WATER PROOF ANIMATION — Pembuktian 2 */}
          <div className="bg-card/80 backdrop-blur border border-cyan-500/40 rounded-2xl overflow-hidden p-4">
            <PythagorasWaterProof />
          </div>

          {/* SQUARES ANIMATION — Pembuktian 3 */}
          <div className="bg-card/80 backdrop-blur border border-blue-500/40 rounded-2xl overflow-hidden p-4">
            <PythagorasSquaresAnimation />
          </div>

          {/* ANIMASI REARRANGEMENT — Pembuktian 4 */}
          <div className="bg-card/80 backdrop-blur border border-violet-500/40 rounded-xl overflow-hidden">
            <SectionHeader id="rearrangement" icon={<Target className="w-5 h-5"/>} iconColor="text-violet-400" title="🔀 Pembuktian Teorema Pythagoras 4 Animasi : Metode Penyusunan Ulang (Rearrangement)"/>
            <div className="px-4 pb-5 space-y-3">
              <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-3">
                <p className="font-body text-sm text-violet-200 leading-relaxed">
                  🔬 Bukti paling elegan! Empat segitiga siku-siku yang sama disusun di dalam persegi besar <InlineMath math="(a+b)^2"/>. Dengan <strong className="text-yellow-300">menggeser posisi keempat segitiga</strong>, terlihat bahwa ruang kosong berubah dari <strong className="text-yellow-300">c²</strong> menjadi <strong className="text-cyan-300">a² + b²</strong> — membuktikan teorema secara visual!
                </p>
              </div>
              <PythagorasRearrangementAnimation />
            </div>
          </div>

          {/* STEP PROOF — Pembuktian 4 (Step by Step) */}
          <div className="bg-card/80 backdrop-blur border border-amber-500/40 rounded-2xl overflow-hidden">
            <SectionHeader id="stepproof" icon={<Target className="w-5 h-5"/>} iconColor="text-amber-400" title={ppt.secProof4}/>
            <div className="px-4 pb-5">
              <PythagorasStepProof />
            </div>
          </div>

          {/* PEMBUKTIAN VISUAL — Pembuktian 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pembuktian" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title={ppt.secFormula}/>
            <div className="px-5 pb-5 space-y-4">

              <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ide Utama Pembuktian</p>
                <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                  Susun <strong className="text-cyan-300">4 segitiga siku-siku identik</strong> di dalam persegi besar bersisi (a+b).
                  Hitung luasnya dengan <strong className="text-yellow-300">dua cara berbeda</strong> — karena hasilnya harus sama,
                  kita buktikan bahwa <InlineMath math="a^2 + b^2 = c^2"/>.
                </p>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50">
                <p className="text-center text-xs text-slate-400 mb-1 font-body">
                  4 segitiga identik (biru · hijau · oranye · ungu) + persegi <span className="text-red-400 font-bold">c²</span> merah di tengah
                </p>
                <PembuktianSVG lang={language}/>
              </div>

              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wider text-center">⚖️ Dua Cara Menghitung Luas Persegi Besar</p>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
                  <div className="bg-yellow-900/25 border border-yellow-500/40 rounded-xl p-4 space-y-2">
                    <p className="text-yellow-300 text-xs font-bold uppercase tracking-wide">🟡 Cara 1 — Rumus Ekspansi</p>
                    <p className="text-white/60 text-xs font-body">Persegi besar bersisi (a+b):</p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="(a+b)^2 = a^2 + 2ab + b^2"/>
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-slate-500 self-center text-center hidden sm:block">=</div>

                  <div className="bg-blue-900/25 border border-blue-500/40 rounded-xl p-4 space-y-2">
                    <p className="text-blue-300 text-xs font-bold uppercase tracking-wide">🔵 Cara 2 — Komponen Dalam</p>
                    <p className="text-white/60 text-xs font-body">4 segitiga + persegi merah c²:</p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="4 \cdot \tfrac{1}{2}ab + c^2 = 2ab + c^2"/>
                    </div>
                  </div>
                </div>

                <div className="sm:hidden text-center text-slate-500 text-2xl font-bold">=</div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-700/70"/>
                  <p className="text-slate-400 text-xs font-body whitespace-nowrap px-2">↓ Samakan keduanya, lalu kurangi 2ab di kedua ruas</p>
                  <div className="flex-1 h-px bg-slate-700/70"/>
                </div>

                <div className={`${isDark ? "bg-slate-800/60 border-slate-600/50" : "bg-gray-100 border-gray-200"} border rounded-xl p-4`}>
                  <p className="text-slate-400 text-xs font-body mb-2">Dari persamaan kedua cara:</p>
                  <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                    <BlockMath math="a^2 + \cancel{2ab} + b^2 = \cancel{2ab} + c^2"/>
                  </div>
                </div>

                <div
                  className="bg-gradient-to-r from-red-900/40 via-rose-900/30 to-red-900/40 border-2 border-red-500/60 rounded-xl p-5 text-center space-y-2"
                  style={{boxShadow: '0 0 28px rgba(239,68,68,0.22), inset 0 0 18px rgba(239,68,68,0.07)'}}
                >
                  <p className="text-red-300 text-xs font-bold uppercase tracking-wider">✅ Teorema Pythagoras — Terbukti!</p>
                  <div className="bg-slate-900/70 rounded-xl px-4 py-1">
                    <BlockMath math="\boxed{a^2 + b^2 = c^2}"/>
                  </div>
                  <p className="text-white/55 text-xs font-body">
                    Berlaku di <strong className="text-white/75">setiap</strong> segitiga siku-siku tanpa terkecuali.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
               BAGIAN 2: MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
              ══════════════════════════════════════════════════════ */}
          <div className="border-t-2 border-cyan-500/40 pt-2">
            <div className="flex items-center gap-3 px-1 mb-4">
              <Ruler className="w-6 h-6 text-cyan-400 shrink-0"/>
              <p className="font-display text-base md:text-lg font-bold text-cyan-300">
                MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
              </p>
            </div>
          </div>

          {/* MHG INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="mhg_intro" icon={<Lightbulb className="w-5 h-5"/>} iconColor="text-yellow-400" title="🌟 Tiga Skenario Berbeda"/>
            <div className="px-5 pb-5 space-y-4">
              <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                Dalam sebuah segitiga siku-siku, ada <strong className="text-cyan-300">tiga sisi</strong>: dua kaki (<InlineMath math="a"/> dan <InlineMath math="b"/>) dan satu hipotenusa (<InlineMath math="c"/>). Menggunakan Teorema Pythagoras, kita bisa mencari salah satu sisi <em>jika dua sisi lainnya diketahui</em>. Ada tiga skenario berbeda yang perlu kamu kuasai!
              </p>
              <RumusVariasiSVG lang={language}/>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">
                  💡 <strong>Strategi mudah:</strong> Sisi yang <em>dicari</em> pindahkan ke kiri dalam bentuk kuadrat, dua sisi yang <em>diketahui</em> tetap di kanan. Jika mencari <strong className="text-orange-300">c²</strong> → tambahkan. Jika mencari <strong className="text-blue-300">a² atau b²</strong> → kurangkan dari <strong className="text-orange-300">c²</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* MHG PROSEDUR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="mhg_prosedur" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title="📐 Prosedur Menghitung Langkah demi Langkah"/>
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-1">🎯 Ringkasan Intisari</p>
                <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                  Kunci menghitung panjang sisi adalah: <strong className="text-cyan-300">(1)</strong> identifikasi mana hipotenusa, <strong className="text-cyan-300">(2)</strong> pilih rumus yang tepat, <strong className="text-cyan-300">(3)</strong> substitusikan nilai, <strong className="text-cyan-300">(4)</strong> sederhanakan hasilnya.
                </p>
              </div>
              {/* ── CARA MENYEDERHANAKAN AKAR ── */}
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-4`}>
                <p className={isDark ? "font-body text-xs font-bold text-slate-300 uppercase tracking-wide" : "font-body text-xs font-bold text-gray-600 uppercase tracking-wide"}>📋 Cara Menyederhanakan Akar</p>

                {/* KUNCI UTAMA */}
                <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/30 border-2 border-yellow-500/50 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-yellow-300">🔑 Kunci Utama — Aturan Perkalian Akar</p>
                  <p className={isDark ? "font-body text-sm text-white/80 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>
                    Untuk menyederhanakan <InlineMath math="\sqrt{n}"/>, kamu harus mengubahnya menjadi perkalian <strong className="text-cyan-300">di mana salah satu faktornya adalah bilangan kuadrat sempurna</strong> (seperti 4, 9, 16, 25, 36, ...).
                  </p>
                  <div className="bg-black/40 rounded-xl px-3 py-2 mt-2 text-center">
                    <BlockMath math="\sqrt{a^2 \cdot b} = \sqrt{a^2} \times \sqrt{b} = a\sqrt{b}"/>
                  </div>
                  <p className="font-body text-xs text-yellow-200/80 text-center">
                    ↑ Akar dari kuadrat sempurna langsung bisa dikeluarkan dari tanda akar!
                  </p>
                </div>

                {/* LANGKAH-LANGKAH */}
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">⚙️ Langkah-Langkah Menyederhanakan</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { step: "1", color: "bg-blue-900/40 border-blue-500/40", tc: "text-blue-300", text: "Faktorkan bilangan di bawah akar menjadi dua faktor, di mana salah satunya adalah bilangan kuadrat sempurna terbesar yang mungkin." },
                      { step: "2", color: "bg-purple-900/40 border-purple-500/40", tc: "text-purple-300", text: "Pisahkan akar menggunakan aturan: √(a² · b) = √a² × √b" },
                      { step: "3", color: "bg-green-900/40 border-green-500/40", tc: "text-green-300", text: "Selesaikan √a² = a, dan tulis hasilnya dalam bentuk a√b." },
                    ].map(({step,color,tc,text}) => (
                      <div key={step} className={`flex gap-3 items-start rounded-lg p-2.5 border ${color}`}>
                        <span className={`shrink-0 w-6 h-6 rounded-full ${color} border flex items-center justify-center font-bold text-xs ${tc}`}>{step}</span>
                        <p className="font-body text-xs text-white/75 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTOH */}
                <div className="space-y-2">
                  <p className={isDark ? "font-body text-xs font-bold text-slate-300 uppercase tracking-wide" : "font-body text-xs font-bold text-gray-600 uppercase tracking-wide"}>💡 Contoh Penyederhanaan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className={isDark ? "bg-slate-700/50 border border-slate-600/50 rounded-lg p-2.5 space-y-1" : "bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-1"}>
                      <p className="text-amber-300 font-bold text-xs text-center">√72</p>
                      <div className="text-center text-xs">
                        <InlineMath math="\sqrt{72} = \sqrt{36 \times 2}"/>
                      </div>
                      <div className="text-center text-xs">
                        <InlineMath math="= \sqrt{36} \times \sqrt{2}"/>
                      </div>
                      <p className="text-center text-green-300 font-bold text-sm"><InlineMath math="= 6\sqrt{2}"/></p>
                      <p className="text-center text-white/40 text-xs">36 = 6² ✓ kuadrat sempurna</p>
                    </div>
                    <div className={isDark ? "bg-slate-700/50 border border-slate-600/50 rounded-lg p-2.5 space-y-1" : "bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-1"}>
                      <p className="text-amber-300 font-bold text-xs text-center">√50</p>
                      <div className="text-center text-xs">
                        <InlineMath math="\sqrt{50} = \sqrt{25 \times 2}"/>
                      </div>
                      <div className="text-center text-xs">
                        <InlineMath math="= \sqrt{25} \times \sqrt{2}"/>
                      </div>
                      <p className="text-center text-green-300 font-bold text-sm"><InlineMath math="= 5\sqrt{2}"/></p>
                      <p className="text-center text-white/40 text-xs">25 = 5² ✓ kuadrat sempurna</p>
                    </div>
                    <div className={isDark ? "bg-slate-700/50 border border-slate-600/50 rounded-lg p-2.5 space-y-1" : "bg-gray-50 border border-gray-200 rounded-lg p-2.5 space-y-1"}>
                      <p className="text-amber-300 font-bold text-xs text-center">√48</p>
                      <div className="text-center text-xs">
                        <InlineMath math="\sqrt{48} = \sqrt{16 \times 3}"/>
                      </div>
                      <div className="text-center text-xs">
                        <InlineMath math="= \sqrt{16} \times \sqrt{3}"/>
                      </div>
                      <p className="text-center text-green-300 font-bold text-sm"><InlineMath math="= 4\sqrt{3}"/></p>
                      <p className="text-center text-white/40 text-xs">16 = 4² ✓ kuadrat sempurna</p>
                    </div>
                  </div>
                </div>

                {/* BILANGAN KUADRAT SEMPURNA */}
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-body text-xs font-bold text-cyan-300 mb-2">📌 Bilangan Kuadrat Sempurna yang Sering Dipakai</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[[1,1],[2,4],[3,9],[4,16],[5,25],[6,36],[7,49],[8,64],[9,81],[10,100],[11,121],[12,144]].map(([n,sq]) => (
                      <div key={n} className="bg-slate-800/70 border border-slate-600/50 rounded px-2 py-1 text-center min-w-[44px]">
                        <p className="text-cyan-300 text-xs font-mono font-bold">{n}²</p>
                        <p className="text-white text-xs font-mono">{sq}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MHG CONTOH SOAL 1 */}
          <div className="bg-card/80 backdrop-blur border border-green-500/30 rounded-xl overflow-hidden">
            <SectionHeader id="mhg_c1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title={ppt.secEx1}/>
            <div className="px-5 pb-5 space-y-5">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-2">
                <p className="font-body text-xs text-green-300">🟢 Pada contoh soal ini, semua jawaban berupa <strong>bilangan bulat</strong> (Bilangan Triple Pythagoras).</p>
              </div>

              {/* Sub-soal (a) — Mencari hipotenusa, 3-4-5 */}
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600/60" : "bg-gray-100 border-gray-200"} border rounded-xl overflow-hidden`}>
                <div className="bg-green-900/40 px-4 py-2 flex items-center gap-2">
                  <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">a</span>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>Sebuah segitiga siku-siku mempunyai dua sisi siku-siku masing-masing <strong className="text-yellow-300">3 cm</strong> dan <strong className="text-yellow-300">4 cm</strong>. Tentukan panjang sisi miringnya!</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Triangle SVG */}
                  <svg viewBox="0 0 190 155" className="w-full max-w-[200px] mx-auto">
                    <polygon points="30,125 30,25 150,125" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" strokeWidth="1"/>
                    <line x1="30" y1="25" x2="30" y2="125" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="30" y1="125" x2="150" y2="125" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="30" y1="25" x2="150" y2="125" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3"/>
                    <polyline points="30,113 42,113 42,125" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
                    <text x="3"  y="75"  fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="sans-serif">a=3</text>
                    <text x="82" y="140" fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="sans-serif">b=4</text>
                    <text x="95" y="72"  fill="#fb923c" fontSize="13" fontWeight="bold" fontFamily="sans-serif">c=?</text>
                    <text x="20" y="20"  fill="#94a3b8" fontSize="9">A</text>
                    <text x="20" y="137" fill="#94a3b8" fontSize="9">C</text>
                    <text x="153" y="137" fill="#94a3b8" fontSize="9">B</text>
                  </svg>
                  {/* Solution */}
                  <div className="space-y-2">
                    <p className="font-body text-xs text-slate-400">Diketahui: <InlineMath math="a=3"/> cm, <InlineMath math="b=4"/> cm &nbsp;|&nbsp; Dicari: <InlineMath math="c"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="c^2 = a^2 + b^2 = 3^2 + 4^2"/>
                    </div>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="c^2 = 9 + 16 = 25"/>
                    </div>
                    <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-2 py-1">
                      <BlockMath math="c = \sqrt{25} = 5 \text{ cm}"/>
                    </div>
                    <p className="font-body text-xs text-green-300 text-center">✅ Sisi miring = <strong>5 cm</strong></p>
                  </div>
                </div>
              </div>

              {/* Sub-soal (b) — Mencari hipotenusa, 5-12-13 */}
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600/60" : "bg-gray-100 border-gray-200"} border rounded-xl overflow-hidden`}>
                <div className="bg-sky-900/40 px-4 py-2 flex items-center gap-2">
                  <span className="bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">b</span>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>Sebuah layar kapal berbentuk segitiga siku-siku dengan dua kaki masing-masing <strong className="text-yellow-300">5 cm</strong> dan <strong className="text-yellow-300">12 cm</strong>. Berapa panjang tali layar (sisi miring) tersebut?</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Rotated 90° CW — right angle at top-left */}
                  <svg viewBox="0 0 190 155" className="w-full max-w-[200px] mx-auto">
                    <polygon points="30,25 150,25 30,125" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.3)" strokeWidth="1"/>
                    <line x1="30" y1="25" x2="30" y2="125" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="30" y1="25" x2="150" y2="25" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="30" y1="125" x2="150" y2="25" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3"/>
                    <polyline points="42,25 42,37 30,37" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
                    <text x="3"  y="82"  fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="sans-serif">a=5</text>
                    <text x="76" y="18"  fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="sans-serif">b=12</text>
                    <text x="92" y="90"  fill="#fb923c" fontSize="13" fontWeight="bold" fontFamily="sans-serif">c=?</text>
                    <text x="18" y="22"  fill="#94a3b8" fontSize="9">C</text>
                    <text x="18" y="138" fill="#94a3b8" fontSize="9">A</text>
                    <text x="153" y="22" fill="#94a3b8" fontSize="9">B</text>
                  </svg>
                  <div className="space-y-2">
                    <p className="font-body text-xs text-slate-400">Diketahui: <InlineMath math="a=5"/> cm, <InlineMath math="b=12"/> cm &nbsp;|&nbsp; Dicari: <InlineMath math="c"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="c^2 = 5^2 + 12^2 = 25 + 144"/>
                    </div>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="c^2 = 169"/>
                    </div>
                    <div className="bg-sky-900/40 border border-sky-500/40 rounded-lg px-2 py-1">
                      <BlockMath math="c = \sqrt{169} = 13 \text{ cm}"/>
                    </div>
                    <p className="font-body text-xs text-sky-300 text-center">✅ Panjang tali layar = <strong>13 cm</strong></p>
                  </div>
                </div>
              </div>

              {/* Sub-soal (c) — Mencari salah satu kaki, 6-8-10 */}
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600/60" : "bg-gray-100 border-gray-200"} border rounded-xl overflow-hidden`}>
                <div className="bg-violet-900/40 px-4 py-2 flex items-center gap-2">
                  <span className="bg-violet-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">c</span>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>Sebuah segitiga siku-siku mempunyai sisi miring <strong className="text-yellow-300">10 cm</strong> dan salah satu kaki <strong className="text-yellow-300">6 cm</strong>. Tentukan panjang kaki lainnya!</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Rotated 180° — right angle at top-right */}
                  <svg viewBox="0 0 190 155" className="w-full max-w-[200px] mx-auto">
                    <polygon points="160,30 160,130 40,30" fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.3)" strokeWidth="1"/>
                    <line x1="160" y1="30" x2="160" y2="130" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3"/>
                    <line x1="40"  y1="30" x2="160" y2="30"  stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="160" y1="130" x2="40" y2="30"  stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                    <polyline points="148,30 148,42 160,42" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
                    <text x="163" y="85"  fill="#c4b5fd" fontSize="12" fontWeight="bold" fontFamily="sans-serif">a=?</text>
                    <text x="85"  y="22"  fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="sans-serif">b=6</text>
                    <text x="68"  y="92"  fill="#fb923c" fontSize="12" fontWeight="bold" fontFamily="sans-serif">c=10</text>
                    <text x="163" y="27"  fill="#94a3b8" fontSize="9">C</text>
                    <text x="163" y="143" fill="#94a3b8" fontSize="9">A</text>
                    <text x="26"  y="27"  fill="#94a3b8" fontSize="9">B</text>
                  </svg>
                  <div className="space-y-2">
                    <p className="font-body text-xs text-slate-400">Diketahui: <InlineMath math="c=10"/> cm, <InlineMath math="b=6"/> cm &nbsp;|&nbsp; Dicari: <InlineMath math="a"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="a^2 = c^2 - b^2 = 10^2 - 6^2"/>
                    </div>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="a^2 = 100 - 36 = 64"/>
                    </div>
                    <div className="bg-violet-900/40 border border-violet-500/40 rounded-lg px-2 py-1">
                      <BlockMath math="a = \sqrt{64} = 8 \text{ cm}"/>
                    </div>
                    <p className="font-body text-xs text-violet-300 text-center">✅ Kaki lainnya = <strong>8 cm</strong></p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* MHG CONTOH SOAL 2 */}
          <div className="bg-card/80 backdrop-blur border border-yellow-500/30 rounded-xl overflow-hidden">
            <SectionHeader id="mhg_c2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title={ppt.secEx2}/>
            <div className="px-5 pb-5 space-y-5">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <p className="font-body text-xs text-yellow-300">🟡 Pada contoh soal ini, jawaban <strong>tidak bisa menjadi bilangan bulat</strong> — harus disederhanakan ke bentuk <InlineMath math="a\sqrt{b}"/>. Jangan ubah ke bentuk desimal!</p>
              </div>

              {/* Sub-soal (a) — a=4, b=6 → c²=52=4×13 → c=2√13 */}
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600/60" : "bg-gray-100 border-gray-200"} border rounded-xl overflow-hidden`}>
                <div className="bg-yellow-900/40 px-4 py-2 flex items-center gap-2">
                  <span className="bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">a</span>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>Sebuah segitiga siku-siku mempunyai dua kaki <strong className="text-yellow-300">4 cm</strong> dan <strong className="text-yellow-300">6 cm</strong>. Tentukan panjang sisi miringnya dalam bentuk akar paling sederhana!</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Mirrored about Y-axis — right angle at bottom-right */}
                  <svg viewBox="0 0 190 155" className="w-full max-w-[200px] mx-auto">
                    <polygon points="160,125 160,35 40,125" fill="rgba(234,179,8,0.07)" stroke="rgba(234,179,8,0.3)" strokeWidth="1"/>
                    <line x1="160" y1="35" x2="160" y2="125" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="40"  y1="125" x2="160" y2="125" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="160" y1="35" x2="40"  y2="125" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3"/>
                    <polyline points="148,125 148,113 160,113" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
                    <text x="163" y="82"  fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="sans-serif">a=4</text>
                    <text x="85"  y="140" fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="sans-serif">b=6</text>
                    <text x="75"  y="68"  fill="#fb923c" fontSize="13" fontWeight="bold" fontFamily="sans-serif">c=?</text>
                  </svg>
                  <div className="space-y-2">
                    <p className="font-body text-xs text-slate-400">Diketahui: <InlineMath math="a=4"/>, <InlineMath math="b=6"/> &nbsp;|&nbsp; Dicari: <InlineMath math="c"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="c^2 = 4^2 + 6^2 = 16 + 36 = 52"/>
                    </div>
                    <p className={isDark ? "font-body text-xs text-white/60" : "font-body text-xs text-gray-500"}>Sederhanakan <InlineMath math="\sqrt{52}"/>: faktorkan → <InlineMath math="52 = 4 \times 13"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="\sqrt{52} = \sqrt{4 \times 13} = \sqrt{4}\cdot\sqrt{13} = 2\sqrt{13}"/>
                    </div>
                    <div className="bg-yellow-900/40 border border-yellow-500/40 rounded-lg px-2 py-1">
                      <BlockMath math="c = 2\sqrt{13} \text{ cm}"/>
                    </div>
                    <p className="font-body text-xs text-yellow-300 text-center">✅ Sisi miring = <InlineMath math="2\sqrt{13}"/> cm</p>
                  </div>
                </div>
              </div>

              {/* Sub-soal (b) — a=3, b=3 → c²=18=9×2 → c=3√2 */}
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600/60" : "bg-gray-100 border-gray-200"} border rounded-xl overflow-hidden`}>
                <div className="bg-orange-900/40 px-4 py-2 flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">b</span>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>Sebuah segitiga siku-siku sama kaki dengan kedua kaki masing-masing <strong className="text-yellow-300">3 cm</strong>. Berapa panjang sisi miringnya?</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Tilted — right angle at interior point */}
                  <svg viewBox="0 0 190 155" className="w-full max-w-[200px] mx-auto">
                    <polygon points="30,55 120,125 155,80" fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.3)" strokeWidth="1"/>
                    <line x1="30"  y1="55"  x2="120" y2="125" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="120" y1="125" x2="155" y2="80"  stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="30"  y1="55"  x2="155" y2="80"  stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3"/>
                    <polyline points="111,118 118,109 127,116" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
                    <text x="42"  y="98"  fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="sans-serif">a=3</text>
                    <text x="140" y="113" fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="sans-serif">b=3</text>
                    <text x="78"  y="50"  fill="#fb923c" fontSize="13" fontWeight="bold" fontFamily="sans-serif">c=?</text>
                  </svg>
                  <div className="space-y-2">
                    <p className="font-body text-xs text-slate-400">Diketahui: <InlineMath math="a=3"/>, <InlineMath math="b=3"/> &nbsp;|&nbsp; Dicari: <InlineMath math="c"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="c^2 = 3^2 + 3^2 = 9 + 9 = 18"/>
                    </div>
                    <p className={isDark ? "font-body text-xs text-white/60" : "font-body text-xs text-gray-500"}>Sederhanakan <InlineMath math="\sqrt{18}"/>: faktorkan → <InlineMath math="18 = 9 \times 2"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="\sqrt{18} = \sqrt{9 \times 2} = \sqrt{9}\cdot\sqrt{2} = 3\sqrt{2}"/>
                    </div>
                    <div className="bg-orange-900/40 border border-orange-500/40 rounded-lg px-2 py-1">
                      <BlockMath math="c = 3\sqrt{2} \text{ cm}"/>
                    </div>
                    <p className="font-body text-xs text-orange-300 text-center">✅ Sisi miring = <InlineMath math="3\sqrt{2}"/> cm</p>
                  </div>
                </div>
              </div>

              {/* Sub-soal (c) — c=6, b=2 → a²=32=16×2 → a=4√2 */}
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600/60" : "bg-gray-100 border-gray-200"} border rounded-xl overflow-hidden`}>
                <div className="bg-rose-900/40 px-4 py-2 flex items-center gap-2">
                  <span className="bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">c</span>
                  <p className={isDark ? "font-body text-sm text-white/90" : "font-body text-sm text-gray-800"}>Sebuah segitiga siku-siku mempunyai sisi miring <strong className="text-yellow-300">6 cm</strong> dan salah satu kaki <strong className="text-yellow-300">2 cm</strong>. Tentukan kaki lainnya!</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* Rotated 270° CW — right angle at bottom-right */}
                  <svg viewBox="0 0 190 155" className="w-full max-w-[200px] mx-auto">
                    <polygon points="30,125 155,125 155,25" fill="rgba(244,63,94,0.07)" stroke="rgba(244,63,94,0.3)" strokeWidth="1"/>
                    <line x1="30"  y1="125" x2="155" y2="125" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3"/>
                    <line x1="155" y1="125" x2="155" y2="25"  stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="30"  y1="125" x2="155" y2="25"  stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                    <polyline points="143,125 143,113 155,113" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
                    <text x="76"  y="140" fill="#c4b5fd" fontSize="12" fontWeight="bold" fontFamily="sans-serif">a=?</text>
                    <text x="158" y="80"  fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="sans-serif">b=2</text>
                    <text x="75"  y="65"  fill="#fb923c" fontSize="12" fontWeight="bold" fontFamily="sans-serif">c=6</text>
                  </svg>
                  <div className="space-y-2">
                    <p className="font-body text-xs text-slate-400">Diketahui: <InlineMath math="c=6"/>, <InlineMath math="b=2"/> &nbsp;|&nbsp; Dicari: <InlineMath math="a"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="a^2 = c^2 - b^2 = 6^2 - 2^2 = 36 - 4 = 32"/>
                    </div>
                    <p className={isDark ? "font-body text-xs text-white/60" : "font-body text-xs text-gray-500"}>Sederhanakan <InlineMath math="\sqrt{32}"/>: faktorkan → <InlineMath math="32 = 16 \times 2"/></p>
                    <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                      <BlockMath math="\sqrt{32} = \sqrt{16 \times 2} = \sqrt{16}\cdot\sqrt{2} = 4\sqrt{2}"/>
                    </div>
                    <div className="bg-rose-900/40 border border-rose-500/40 rounded-lg px-2 py-1">
                      <BlockMath math="a = 4\sqrt{2} \text{ cm}"/>
                    </div>
                    <p className="font-body text-xs text-rose-300 text-center">✅ Kaki lainnya = <InlineMath math="4\sqrt{2}"/> cm</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* MHG CONTOH SOAL 3 */}
          <div className="bg-card/80 backdrop-blur border border-red-500/30 rounded-xl overflow-hidden">
            <SectionHeader id="mhg_c3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title={ppt.secEx3}/>
            <div className="px-5 pb-5 space-y-4">
              {/* Soal */}
              <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 space-y-2">
                <p className="text-red-300 font-bold text-xs uppercase tracking-wide">🔴 Soal Cerita — Navigasi Kapal</p>
                <p className="font-body text-sm text-white/90 leading-relaxed">
                  Sebuah kapal berangkat dari <strong className="text-cyan-300">Pelabuhan A</strong>. Kapal berlayar ke <strong className="text-green-300">arah Utara</strong> sejauh <strong className="text-yellow-300">8 km</strong> hingga tiba di <strong className="text-blue-300">Pelabuhan B</strong>. Dari Pelabuhan B, kapal berbelok ke <strong className="text-orange-300">arah Timur</strong> sejauh <strong className="text-yellow-300">15 km</strong> menuju <strong className="text-purple-300">Pelabuhan C</strong>.
                </p>
                <p className="font-body text-sm text-white/80 mt-1">
                  <strong className="text-cyan-200">Pertanyaan:</strong> Berapa jarak lurus (garis lurus) dari Pelabuhan A ke Pelabuhan C?
                </p>
              </div>

              {/* Diagram kapal */}
              <div className={`${isDark ? "bg-slate-900/60 border-slate-700/50" : "bg-gray-50 border-gray-200"} border rounded-xl p-3`}>
                <p className="font-body text-xs text-slate-400 text-center mb-2">📍 Diagram Rute Kapal</p>
                <svg viewBox="0 0 340 240" className="w-full max-w-md mx-auto">
                  {/* Background ocean */}
                  <rect x="0" y="0" width="340" height="240" rx="10" fill="rgba(3,7,18,0.5)"/>
                  {/* Ocean grid */}
                  {[0,1,2,3].map(i => (
                    <line key={`h${i}`} x1="20" y1={60+i*45} x2="320" y2={60+i*45} stroke="rgba(59,130,246,0.08)" strokeWidth="1"/>
                  ))}
                  {[0,1,2,3,4].map(i => (
                    <line key={`v${i}`} x1={20+i*75} y1="20" x2={20+i*75} y2="210" stroke="rgba(59,130,246,0.08)" strokeWidth="1"/>
                  ))}

                  {/* North arrow */}
                  <line x1="305" y1="40" x2="305" y2="20" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#arr)"/>
                  <text x="299" y="52" fill="#4ade80" fontSize="9" fontFamily="sans-serif" fontWeight="bold">U</text>
                  <defs>
                    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80"/>
                    </marker>
                    <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8"/>
                    </marker>
                  </defs>

                  {/* Triangle area fill */}
                  <polygon points="70,190 70,55 250,190" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>

                  {/* AB — North leg (blue, 8 km) */}
                  <line x1="70" y1="190" x2="70" y2="55" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                  {/* BC — East leg (green, 15 km) */}
                  <line x1="70" y1="55" x2="250" y2="55" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                  {/* AC — hypotenuse (orange dashed, unknown → 17 km) */}
                  <line x1="70" y1="190" x2="250" y2="55" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 4"/>

                  {/* Right angle at B */}
                  <polyline points="70,70 85,70 85,55" fill="none" stroke="rgba(148,163,184,0.8)" strokeWidth="1.5"/>

                  {/* Port markers */}
                  {/* A */}
                  <circle cx="70" cy="190" r="7" fill="#06b6d4" opacity="0.9"/>
                  <text x="70" cy="190" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" y="193">A</text>
                  <text x="48" y="200" fill="#06b6d4" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Pelabuhan A</text>
                  <text x="48" y="212" fill="#94a3b8" fontSize="8" fontFamily="monospace">(start)</text>

                  {/* B */}
                  <circle cx="70" cy="55" r="7" fill="#3b82f6" opacity="0.9"/>
                  <text x="70" cy="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" y="58">B</text>
                  <text x="48" y="45" fill="#3b82f6" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Pelabuhan B</text>

                  {/* C */}
                  <circle cx="250" cy="55" r="7" fill="#a855f7" opacity="0.9"/>
                  <text x="250" cy="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" y="58">C</text>
                  <text x="256" y="45" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Pelabuhan C</text>

                  {/* Side labels */}
                  {/* AB = 8 km */}
                  <rect x="20" y="112" width="43" height="18" rx="4" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1"/>
                  <text x="41" y="124" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold" fontFamily="monospace">8 km ↑</text>

                  {/* BC = 15 km */}
                  <rect x="130" y="32" width="56" height="18" rx="4" fill="rgba(34,197,94,0.3)" stroke="#22c55e" strokeWidth="1"/>
                  <text x="158" y="44" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="bold" fontFamily="monospace">15 km →</text>

                  {/* AC = ? (diagonal) */}
                  <rect x="148" y="128" width="46" height="18" rx="4" fill="rgba(249,115,22,0.3)" stroke="#f97316" strokeWidth="1"/>
                  <text x="171" y="140" textAnchor="middle" fill="#fdba74" fontSize="11" fontWeight="bold" fontFamily="monospace">AC = ?</text>
                </svg>
              </div>

              {/* Pembahasan */}
              <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3" : "bg-gray-100 border border-gray-200 rounded-xl p-4 space-y-3"}>
                <p className={isDark ? "font-body text-xs font-bold text-slate-300 uppercase tracking-wide" : "font-body text-xs font-bold text-gray-600 uppercase tracking-wide"}>📋 Pembahasan</p>

                <div className={`${isDark ? "bg-slate-700/40" : "bg-gray-50"} rounded-lg p-3 space-y-1`}>
                  <p className="font-body text-xs text-cyan-300 font-bold">Identifikasi Segitiga:</p>
                  <p className="font-body text-xs text-white/75">• AB = 8 km (kaki — arah Utara)</p>
                  <p className="font-body text-xs text-white/75">• BC = 15 km (kaki — arah Timur)</p>
                  <p className="font-body text-xs text-white/75">• Sudut di B = 90° (Utara ⊥ Timur)</p>
                  <p className="font-body text-xs text-white/75">• AC = hipotenusa (jarak lurus A ke C) = <strong className="text-orange-300">dicari</strong></p>
                </div>

                <p className="font-body text-xs text-slate-400">Gunakan rumus hipotenusa: <InlineMath math="c^2 = a^2 + b^2"/></p>
                <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                  <BlockMath math="AC^2 = AB^2 + BC^2 = 8^2 + 15^2"/>
                </div>
                <div className={isDark ? "bg-slate-900/60 rounded-lg px-2 py-0.5" : "bg-gray-50 rounded-lg px-2 py-0.5"}>
                  <BlockMath math="AC^2 = 64 + 225 = 289"/>
                </div>
                <div className="bg-gradient-to-r from-red-900/40 to-orange-900/30 border border-red-500/40 rounded-xl px-3 py-3 text-center space-y-1">
                  <BlockMath math="AC = \sqrt{289} = 17 \text{ km}"/>
                  <p className="font-body text-sm text-red-200 font-semibold">✅ Jarak lurus Pelabuhan A ke Pelabuhan C = <strong className="text-white">17 km</strong></p>
                  <p className="font-body text-xs text-slate-400">(Kapal menempuh rute 8 + 15 = 23 km, padahal jarak lurus hanya 17 km!)</p>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5"/>} iconColor="text-violet-400" title={ppt.secSummary}/>
            <div className="px-5 pb-5 space-y-3">
              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-xs font-bold text-violet-300 uppercase mb-1">📐 Pembuktian</p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>• Teorema Pythagoras berlaku di <strong className="text-cyan-300">setiap segitiga siku-siku</strong>.</p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>• Rumus dasar: <InlineMath math="a^2 + b^2 = c^2"/> di mana <InlineMath math="c"/> adalah hipotenusa.</p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>• Dibuktikan secara visual dengan <strong className="text-yellow-300">metode susunan persegi</strong> (4 segitiga identik dalam persegi besar).</p>
                <div className="border-t border-violet-500/20 pt-2 mt-2"/>
                <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-1">📏 Menghitung Panjang Sisi</p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>• <strong className="text-orange-300">Mencari c²:</strong> <InlineMath math="c^2 = a^2 + b^2"/></p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>• <strong className="text-blue-300">Mencari a²:</strong> <InlineMath math="a^2 = c^2 - b^2"/></p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>• <strong className="text-green-300">Mencari b²:</strong> <InlineMath math="b^2 = c^2 - a^2"/></p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>• Jawaban bisa berupa <strong className="text-cyan-300">bilangan bulat</strong> atau <strong className="text-yellow-300">bentuk akar</strong> — sederhanakan dengan mencari faktor kuadrat sempurna terbesar.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">
                  🚀 <strong>Tips Astronot:</strong> Teorema Pythagoras digunakan bahkan dalam navigasi satelit dan GPS! Tanpa Pythagoras, kita tidak bisa menghitung jarak antar titik di ruang angkasa.
                </p>
              </div>
            </div>
          </div>

          {/* HAFAL BILANGAN KUADRAT 1–30 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kuadrat" icon={<Target className="w-5 h-5"/>} iconColor="text-yellow-400" title={ppt.secSquares}/>
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-sm font-bold text-yellow-300">🎯 Mengapa Harus Dihafal?</p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>
                  Dalam soal Teorema Pythagoras, kita sering harus <strong className="text-cyan-300">mencari sisi yang tidak diketahui</strong> dengan cara mengakarkan bilangan.
                  Jika kamu hafal bilangan kuadrat 1–30, kamu bisa langsung tahu hasil akarnya <strong className="text-yellow-300">tanpa kalkulator</strong>!
                </p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>
                  Contoh: jika <InlineMath math="c^2 = 169"/>, kamu langsung tahu <InlineMath math="c = 13"/> karena hafal <InlineMath math="13^2 = 169"/>. ✅
                </p>
                <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>
                  Manfaat lain: mempercepat perhitungan <strong className="text-pink-300">Triple Pythagoras</strong>, soal ANBK, UN, dan olimpiade matematika.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-body text-xs font-bold text-sky-300 mb-2">🔵 Kelompok 1 — Bilangan 1 sampai 10</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <div key={n} className="bg-sky-900/40 border border-sky-600/40 rounded-lg p-2 text-center">
                      <p className="text-sky-300 font-bold font-mono text-xs">{n}²</p>
                      <p className="text-white font-bold font-mono text-sm">{n*n}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-body text-xs font-bold text-emerald-300 mb-2">🟢 Kelompok 2 — Bilangan 11 sampai 20</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[11,12,13,14,15,16,17,18,19,20].map(n => (
                    <div key={n} className="bg-emerald-900/40 border border-emerald-600/40 rounded-lg p-2 text-center">
                      <p className="text-emerald-300 font-bold font-mono text-xs">{n}²</p>
                      <p className="text-white font-bold font-mono text-sm">{n*n}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-body text-xs font-bold text-orange-300 mb-2">🟠 Kelompok 3 — Bilangan 21 sampai 30</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[21,22,23,24,25,26,27,28,29,30].map(n => (
                    <div key={n} className="bg-orange-900/40 border border-orange-600/40 rounded-lg p-2 text-center">
                      <p className="text-orange-300 font-bold font-mono text-xs">{n}²</p>
                      <p className="text-white font-bold font-mono text-sm">{n*n}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-sm font-bold text-violet-300">🔍 Pola Menarik Bilangan Kuadrat</p>
                <ul className="space-y-1.5 font-body text-sm text-white/80">
                  <li>• Bilangan kuadrat <strong className="text-yellow-300">hanya berakhiran 0, 1, 4, 5, 6, atau 9</strong> — tidak pernah 2, 3, 7, atau 8.</li>
                  <li>• Bilangan yang berakhiran <strong className="text-sky-300">5</strong>, kuadratnya selalu berakhiran <strong className="text-sky-300">25</strong>. Contoh: 5²=25, 15²=225, 25²=625.</li>
                  <li>• Selisih dua bilangan kuadrat berurutan selalu ganjil: <InlineMath math="(n+1)^2 - n^2 = 2n+1"/>.</li>
                  <li>• Contoh: 10²=100, 11²=121, selisihnya = 21 = 2×10+1. ✅</li>
                </ul>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-cyan-200">
                  🚀 <strong>Tips Hafal Cepat:</strong> Mulai dari kelompok 1 (1–10), hafalkan dulu sampai lancar. Lanjut kelompok 2 (11–20), perhatikan polanya. Kelompok 3 (21–30) lebih mudah jika kamu sudah paham pola selisihnya.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/materi-matematika/kelas-8/teorema-pythagoras")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {ppt.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembuktianPage;
