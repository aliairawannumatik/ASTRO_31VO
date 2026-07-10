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
    title: "MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU",
    subtitle: "Kelas 8 · Teorema Pythagoras · Materi Matematika",
    back: "← Kembali ke Teorema Pythagoras",
    sec_intro: "🌟 Tiga Skenario Berbeda",
    sec_rumus: "📐 Prosedur Menghitung Langkah demi Langkah",
    sec_contoh1: "✏️ Contoh 1 — Mencari Hipotenusa (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Mencari Salah Satu Kaki (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — Hasil Bentuk Akar (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    svgFindC: "Cari c (hipotenusa)",
    svgFindA: "Cari a (kaki)",
    svgFindB: "Cari b (kaki)",
    svgTitle: "TIGA VARIASI RUMUS PYTHAGORAS",
    findHyp: "(cari hipotenusa)",
    findLeg1: "(cari kaki pertama)",
    findLeg2: "(cari kaki kedua)",
    intisari: "🎯 Ringkasan Intisari",
    introDesc: "Dalam sebuah segitiga siku-siku, ada <strong>tiga sisi</strong>: dua kaki (a dan b) dan satu hipotenusa (c). Menggunakan Teorema Pythagoras, kita bisa mencari salah satu sisi jika dua sisi lainnya diketahui. Ada tiga skenario berbeda yang perlu kamu kuasai!",
    threeVariants: "📌 Tiga Variasi Rumus Pythagoras",
    strategyTip: "💡 Strategi mudah: Sisi yang dicari pindahkan ke kiri, dua sisi yang diketahui tetap di kanan. Jika mencari c → tambahkan. Jika mencari a atau b → kurangkan c² dengan sisi yang diketahui.",
    rumusSummary: "🎯 Ringkasan Intisari",
    rumusSummaryDesc: "Kunci menghitung panjang sisi adalah: (1) identifikasi mana hipotenusa, (2) pilih rumus yang tepat, (3) substitusikan nilai, (4) sederhanakan hasilnya — pastikan dalam bentuk akar sederhana jika perlu.",
    simplifyRoot: "📋 Cara Menyederhanakan Akar",
    simplifyRootDesc: "Contoh: Sederhanakan",
    simplifyStep: "Langkah: Cari faktor kuadrat sempurna terbesar dari bilangan di bawah akar!",
    perfectSquares: "Bilangan Akar Sempurna:",
    tips: "Tips:",
    tipDesc: "Jika hasilnya bulat → tulis tanpa akar. Jika tidak → sederhanakan ke bentuk",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1Problem: "Sebuah tangga disandarkan ke dinding. Kaki tangga berjarak 6 m dari dinding, dan tinggi tembok yang dijangkau tangga adalah 8 m. Berapa panjang tangga tersebut?",
    c1Given: "Diketahui:",
    c1Ans: "✅ Panjang tangga adalah 10 m.",
    c2Problem: "Sebuah layar kapal berbentuk segitiga siku-siku. Sisi miringnya (tali layar terpanjang) adalah 13 m dan alas layarnya 5 m. Tentukan tinggi layar tersebut!",
    c2Given: "Diketahui:",
    c2Ans: "✅ Tinggi layar kapal adalah 12 m.",
    c3Problem: "Sebuah lapangan berbentuk persegi panjang berukuran 7 m × 9 m. Seorang siswa berlari dari sudut A ke sudut C (diagonal lapangan). Berapa jarak yang ditempuh siswa tersebut? Nyatakan dalam bentuk akar sederhana!",
    c3Desc: "Diagonal persegi panjang membentuk segitiga siku-siku dengan kaki",
    c3Factor: "Apakah 130 bisa disederhanakan? Faktorkan: 130 = 2 × 5 × 13. Tidak ada faktor kuadrat sempurna.",
    c3Ans: "✅ Jarak diagonal adalah",
    c3Ans2: "m atau sekitar 11,40 m.",
    r1: "• Mencari c:",
    r2: "• Mencari a:",
    r3: "• Mencari b:",
    r4: "• Hasilnya bisa berupa bilangan bulat atau bentuk akar.",
    r5: "• Sederhanakan akar: cari faktor kuadrat sempurna terbesar.",
    astronaut: "🚀 Tips Astronot: NASA menggunakan Pythagoras untuk menghitung lintasan roket! Setiap komponen kecepatan horizontal dan vertikal dihitung, lalu digabung menggunakan rumus",
  },
  en: {
    title: "CALCULATING RIGHT TRIANGLE SIDE LENGTHS",
    subtitle: "Grade 8 · Pythagorean Theorem · Math Book",
    back: "← Back to Pythagorean Theorem",
    sec_intro: "🌟 Three Different Scenarios",
    sec_rumus: "📐 Step-by-Step Calculation Procedure",
    sec_contoh1: "✏️ Example 1 — Finding the Hypotenuse (Easy)",
    sec_contoh2: "✏️ Example 2 — Finding One Leg (Medium)",
    sec_contoh3: "✏️ Example 3 — Surd Form Result (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    svgFindC: "Find c (hypotenuse)",
    svgFindA: "Find a (leg)",
    svgFindB: "Find b (leg)",
    svgTitle: "THREE VARIATIONS OF PYTHAGOREAN FORMULA",
    findHyp: "(find hypotenuse)",
    findLeg1: "(find first leg)",
    findLeg2: "(find second leg)",
    intisari: "🎯 Key Summary",
    introDesc: "In a right triangle, there are <strong>three sides</strong>: two legs (a and b) and one hypotenuse (c). Using the Pythagorean Theorem, we can find one side <em>if the other two are known</em>. There are three scenarios you need to master!",
    threeVariants: "📌 Three Pythagorean Formula Variations",
    strategyTip: "💡 Easy strategy: Move the unknown side to the left, keep the two known sides on the right. Finding c → add. Finding a or b → subtract c² from the known side.",
    rumusSummary: "🎯 Key Summary",
    rumusSummaryDesc: "The key to calculating side lengths: (1) identify the hypotenuse, (2) choose the right formula, (3) substitute values, (4) simplify the result — express as a simplified surd if needed.",
    simplifyRoot: "📋 Simplifying Square Roots",
    simplifyRootDesc: "Example: Simplify",
    simplifyStep: "Step: Find the largest perfect square factor of the number under the root!",
    perfectSquares: "Perfect Square Roots:",
    tips: "Tips:",
    tipDesc: "If the result is a whole number → write without a root. Otherwise → simplify to the form",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1Problem: "A ladder leans against a wall. The foot of the ladder is 6 m from the wall, and the ladder reaches a height of 8 m up the wall. How long is the ladder?",
    c1Given: "Given:",
    c1Ans: "✅ The ladder is 10 m long.",
    c2Problem: "A ship's sail is shaped like a right triangle. Its hypotenuse (longest rope) is 13 m and the base of the sail is 5 m. Find the height of the sail!",
    c2Given: "Given:",
    c2Ans: "✅ The height of the sail is 12 m.",
    c3Problem: "A rectangular field measures 7 m × 9 m. A student runs from corner A to corner C (the diagonal). How far does the student run? Express your answer as a simplified surd!",
    c3Desc: "The diagonal of the rectangle forms a right triangle with legs",
    c3Factor: "Can 130 be simplified? Factor: 130 = 2 × 5 × 13. No perfect square factor.",
    c3Ans: "✅ The diagonal distance is",
    c3Ans2: "m or approximately 11.40 m.",
    r1: "• Find c:",
    r2: "• Find a:",
    r3: "• Find b:",
    r4: "• The result can be a whole number or a surd.",
    r5: "• Simplify surds: find the largest perfect square factor.",
    astronaut: "🚀 Astronaut Tip: NASA uses Pythagoras to calculate rocket trajectories! Each horizontal and vertical velocity component is calculated, then combined using the formula",
  },
  ja: {
    title: "直角三角形の辺の長さの計算",
    subtitle: "8年生 · ピタゴラスの定理 · 数学テキスト",
    back: "← ピタゴラスの定理に戻る",
    sec_intro: "🌟 3つの異なるシナリオ",
    sec_rumus: "📐 ステップバイステップの計算手順",
    sec_contoh1: "✏️ 例題1 — 斜辺を求める（基本）",
    sec_contoh2: "✏️ 例題2 — 直角辺の一辺を求める（標準）",
    sec_contoh3: "✏️ 例題3 — 無理数の結果（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    svgFindC: "c を求める（斜辺）",
    svgFindA: "a を求める（直角辺）",
    svgFindB: "b を求める（直角辺）",
    svgTitle: "ピタゴラスの定理の3つの変形",
    findHyp: "（斜辺を求める）",
    findLeg1: "（第1の辺を求める）",
    findLeg2: "（第2の辺を求める）",
    intisari: "🎯 要点まとめ",
    introDesc: "直角三角形には<strong>3辺</strong>があります：2つの直角辺（aとb）と1つの斜辺（c）。ピタゴラスの定理を使えば、他の2辺がわかれば1辺を求められます。3つのシナリオをマスターしましょう！",
    threeVariants: "📌 ピタゴラスの定理の3つの変形",
    strategyTip: "💡 簡単な戦略：求める辺を左辺に移し、既知の2辺を右辺に残します。cを求める → 足す。aまたはbを求める → c²から既知の辺を引く。",
    rumusSummary: "🎯 要点まとめ",
    rumusSummaryDesc: "辺の長さ計算の手順：(1) 斜辺を特定する、(2) 適切な公式を選ぶ、(3) 値を代入する、(4) 結果を整理する — 必要なら簡単な根号の形に。",
    simplifyRoot: "📋 平方根の簡略化",
    simplifyRootDesc: "例：次を簡略化せよ",
    simplifyStep: "手順：根号の中の最大の平方因数を見つける！",
    perfectSquares: "完全平方数の平方根：",
    tips: "ヒント：",
    tipDesc: "結果が整数なら → 根号なしで書く。そうでなければ → 形式に簡略化",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解答",
    c1Problem: "はしごが壁に立てかけられています。はしごの足は壁から6m離れており、はしごは壁の高さ8mまで届きます。はしごの長さは何mですか？",
    c1Given: "与えられた値：",
    c1Ans: "✅ はしごの長さは10mです。",
    c2Problem: "船の帆は直角三角形の形をしています。斜辺（最も長い綱）は13m、帆の底辺は5mです。帆の高さを求めなさい！",
    c2Given: "与えられた値：",
    c2Ans: "✅ 帆の高さは12mです。",
    c3Problem: "長方形のグラウンドの大きさは7m×9mです。生徒が角Aから角C（対角線）まで走ります。走った距離は何mですか？簡単な根号の形で答えなさい！",
    c3Desc: "長方形の対角線は直角三角形を形成し、直角辺は",
    c3Factor: "130は簡略化できますか？因数分解：130 = 2 × 5 × 13。平方因数はありません。",
    c3Ans: "✅ 対角線の距離は",
    c3Ans2: "m、約11.40mです。",
    r1: "• cを求める：",
    r2: "• aを求める：",
    r3: "• bを求める：",
    r4: "• 結果は整数または根号の形になります。",
    r5: "• 根号を簡略化：最大の平方因数を探す。",
    astronaut: "🚀 宇宙飛行士のヒント：NASAはロケットの軌道計算にピタゴラスを使います！水平・垂直の速度成分をそれぞれ計算し、公式で合成します",
  },
} as const;
type Lang = keyof typeof translations;

const RumusVariasiSVG = ({ texts }: { texts: { findC: string; findA: string; findB: string; title: string } }) => (
  <svg viewBox="0 0 340 230" className="w-full max-w-sm mx-auto my-2" aria-label="Pythagorean formula variations">
    <defs>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .p1{animation:pulse 2s ease-in-out infinite;}
        .p2{animation:pulse 2s ease-in-out infinite 0.7s;}
        .p3{animation:pulse 2s ease-in-out infinite 1.4s;}
      `}</style>
    </defs>
    <g transform="translate(10,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.6"/>
      <text x="8" y="15" fill="#60a5fa" fontSize="9" fontFamily="monospace">a=3</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace">b=4</text>
      <text x="55" y="55" fill="#fb923c" fontSize="9" fontFamily="monospace" className="p1">c=?</text>
      <text x="5" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">{texts.findC}</text>
      <text x="5" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">c=√(a²+b²)</text>
    </g>
    <line x1="115" y1="10" x2="115" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    <g transform="translate(125,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.6"/>
      <text x="8" y="15" fill="#60a5fa" fontSize="9" fontFamily="monospace" className="p2">a=?</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace">b=4</text>
      <text x="55" y="55" fill="#fb923c" fontSize="9" fontFamily="monospace">c=5</text>
      <text x="5" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">{texts.findA}</text>
      <text x="5" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">a=√(c²-b²)</text>
    </g>
    <line x1="230" y1="10" x2="230" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="3 2"/>
    <g transform="translate(240,10)">
      <polygon points="10,100 90,100 10,20" fill="rgba(249,115,22,0.2)" stroke="#f97316" strokeWidth="1.5"/>
      <polyline points="10,82 28,82 28,100" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.6"/>
      <text x="8" y="15" fill="#60a5fa" fontSize="9" fontFamily="monospace">a=3</text>
      <text x="47" y="112" fill="#4ade80" fontSize="9" fontFamily="monospace" className="p3">b=?</text>
      <text x="55" y="55" fill="#fb923c" fontSize="9" fontFamily="monospace">c=5</text>
      <text x="5" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">{texts.findB}</text>
      <text x="5" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">b=√(c²-a²)</text>
    </g>
    <rect x="10" y="170" width="320" height="50" rx="8" fill="rgba(30,41,59,0.8)" stroke="#334155" strokeWidth="1"/>
    <text x="170" y="187" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{texts.title}</text>
    <text x="60" y="205" fill="#fb923c" fontSize="8" textAnchor="middle" fontFamily="monospace">c = √(a²+b²)</text>
    <text x="170" y="205" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">a = √(c²-b²)</text>
    <text x="282" y="205" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">b = √(c²-a²)</text>
  </svg>
);

const HitungSVG = ({ a, b, c, cari }: { a: number; b: number; c: number; cari: "a"|"b"|"c" }) => {
  const maxVal = Math.max(a*a, b*b, c*c);
  const scale = 260 / maxVal;
  return (
    <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto" aria-label="Calculation visualization">
      <rect x="20" y="15" width={a*a*scale} height="18" rx="4" fill={cari==="c"?"#3b82f6":"#3b82f690"} />
      <text x="20" y="42" fill="#60a5fa" fontSize="9" fontFamily="monospace">a² = {a}² = {a*a}</text>
      <rect x="20" y="50" width={b*b*scale} height="18" rx="4" fill={cari==="c"?"#22c55e":"#22c55e90"} />
      <text x="20" y="77" fill="#4ade80" fontSize="9" fontFamily="monospace">b² = {b}² = {b*b}</text>
      <rect x="20" y="85" width={c*c*scale} height="18" rx="4" fill={cari==="a"||cari==="b"?"#f97316":"#f9731690"} />
      <text x="20" y="112" fill="#fb923c" fontSize="9" fontFamily="monospace">c² = {c}² = {c*c}</text>
      <text x={a*a*scale + b*b*scale + 25} y="58" fill="#eab308" fontSize="14" fontFamily="monospace">✓</text>
    </svg>
  );
};

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as Lang];
  const [open, setOpen] = useState<string[]>(["intro","rumus","contoh1","contoh2","contoh3","rangkuman"]);

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
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary"/> : <ChevronDown className="w-5 h-5 text-primary"/>}
    </button>
  );

  const svgTexts = { findC: t.svgFindC, findA: t.svgFindA, findB: t.svgFindB, title: t.svgTitle };

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
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === 'id' && <>Dalam sebuah segitiga siku-siku, ada <strong className="text-cyan-300">tiga sisi</strong>: dua kaki (<InlineMath math="a"/> dan <InlineMath math="b"/>) dan satu hipotenusa (<InlineMath math="c"/>). Menggunakan Teorema Pythagoras, kita bisa mencari salah satu sisi <em>jika dua sisi lainnya diketahui</em>. Ada tiga skenario berbeda yang perlu kamu kuasai!</>}
                  {language === 'en' && <>In a right triangle, there are <strong className="text-cyan-300">three sides</strong>: two legs (<InlineMath math="a"/> and <InlineMath math="b"/>) and one hypotenuse (<InlineMath math="c"/>). Using the Pythagorean Theorem, we can find one side <em>if the other two are known</em>. There are three scenarios you need to master!</>}
                  {language === 'ja' && <>直角三角形には<strong className="text-cyan-300">3辺</strong>があります：2つの直角辺（<InlineMath math="a"/>と<InlineMath math="b"/>）と1つの斜辺（<InlineMath math="c"/>）。ピタゴラスの定理を使えば、他の2辺がわかれば1辺を求められます。3つのシナリオをマスターしましょう！</>}
                </p>
                <RumusVariasiSVG texts={svgTexts}/>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  <p className="text-cyan-300 font-semibold text-sm">{t.threeVariants}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                    <div>
                      <BlockMath math="c = \sqrt{a^2 + b^2}"/>
                      <p className="text-center text-xs text-orange-300 -mt-2 mb-1">{t.findHyp}</p>
                    </div>
                    <div>
                      <BlockMath math="a = \sqrt{c^2 - b^2}"/>
                      <p className="text-center text-xs text-blue-300 -mt-2 mb-1">{t.findLeg1}</p>
                    </div>
                    <div>
                      <BlockMath math="b = \sqrt{c^2 - a^2}"/>
                      <p className="text-center text-xs text-green-300 -mt-2">{t.findLeg2}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">{t.strategyTip}</p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS DETAIL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title={t.sec_rumus}/>
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.rumusSummary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.rumusSummaryDesc}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.simplifyRoot}</p>
                  <p className="font-body text-sm text-white/80">{t.simplifyRootDesc} <InlineMath math="\sqrt{72}"/></p>
                  <BlockMath math="\sqrt{72} = \sqrt{36 \times 2} = \sqrt{36} \times \sqrt{2} = 6\sqrt{2}"/>
                  <p className="font-body text-sm text-white/80">{t.simplifyStep}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-cyan-300 font-bold mb-1">{t.perfectSquares}</p>
                      <p className="text-white/60"><InlineMath math="\sqrt{4}=2,\ \sqrt{9}=3,\ \sqrt{16}=4"/></p>
                      <p className="text-white/60"><InlineMath math="\sqrt{25}=5,\ \sqrt{36}=6,\ \sqrt{49}=7"/></p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-yellow-300 font-bold mb-1">{t.tips}</p>
                      <p className="text-white/60">{t.tipDesc} <InlineMath math="n\sqrt{k}"/>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 - MUDAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-green-400" title={t.sec_contoh1}/>
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.easy}</p>
                  <p className="font-body text-sm text-white/90">{t.c1Problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">
                    {language === 'id' && <>Diketahui: <InlineMath math="a = 6"/> m (jarak kaki tangga), <InlineMath math="b = 8"/> m (tinggi tembok). Dicari: <InlineMath math="c"/> (panjang tangga).</>}
                    {language === 'en' && <>Given: <InlineMath math="a = 6"/> m (distance of ladder foot), <InlineMath math="b = 8"/> m (wall height). Find: <InlineMath math="c"/> (ladder length).</>}
                    {language === 'ja' && <>与えられた値：<InlineMath math="a = 6"/> m（はしごの足の距離）、<InlineMath math="b = 8"/> m（壁の高さ）。求めるもの：<InlineMath math="c"/>（はしごの長さ）。</>}
                  </p>
                  <BlockMath math="c = \sqrt{a^2 + b^2} = \sqrt{6^2 + 8^2}"/>
                  <BlockMath math="c = \sqrt{36 + 64} = \sqrt{100}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="c = 10 \text{ m}"/>
                    <p className="font-body text-sm text-green-300 text-center mt-1">{t.c1Ans}</p>
                  </div>
                  <HitungSVG a={6} b={8} c={10} cari="c"/>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 - SEDANG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-yellow-400" title={t.sec_contoh2}/>
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.medium}</p>
                  <p className="font-body text-sm text-white/90">{t.c2Problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">
                    {language === 'id' && <>Diketahui: <InlineMath math="c = 13"/> m, <InlineMath math="b = 5"/> m. Dicari: <InlineMath math="a"/> (tinggi layar).</>}
                    {language === 'en' && <>Given: <InlineMath math="c = 13"/> m, <InlineMath math="b = 5"/> m. Find: <InlineMath math="a"/> (height of the sail).</>}
                    {language === 'ja' && <>与えられた値：<InlineMath math="c = 13"/> m、<InlineMath math="b = 5"/> m。求めるもの：<InlineMath math="a"/>（帆の高さ）。</>}
                  </p>
                  <BlockMath math="a = \sqrt{c^2 - b^2} = \sqrt{13^2 - 5^2}"/>
                  <BlockMath math="a = \sqrt{169 - 25} = \sqrt{144}"/>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="a = 12 \text{ m}"/>
                    <p className="font-body text-sm text-yellow-200 text-center mt-1">{t.c2Ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 - SULIT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5"/>} iconColor="text-red-400" title={t.sec_contoh3}/>
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.hard}</p>
                  <p className="font-body text-sm text-white/90">{t.c3Problem}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.c3Desc} <InlineMath math="a = 7"/> m {language === 'id' ? 'dan' : language === 'ja' ? 'と' : 'and'} <InlineMath math="b = 9"/> m.
                  </p>
                  <BlockMath math="c = \sqrt{a^2 + b^2} = \sqrt{7^2 + 9^2}"/>
                  <BlockMath math="c = \sqrt{49 + 81} = \sqrt{130}"/>
                  <p className="font-body text-sm text-white/80">{t.c3Factor}</p>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="c = \sqrt{130} \approx 11{,}40 \text{ m}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">
                      {t.c3Ans} <InlineMath math="\sqrt{130}"/> {t.c3Ans2}
                    </p>
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
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">{t.r1}</strong> <InlineMath math="c = \sqrt{a^2 + b^2}"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-blue-300">{t.r2}</strong> <InlineMath math="a = \sqrt{c^2 - b^2}"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">{t.r3}</strong> <InlineMath math="b = \sqrt{c^2 - a^2}"/></p>
                  <p className="font-body text-sm text-white/80">{t.r4}</p>
                  <p className="font-body text-sm text-white/80">{t.r5}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.astronaut} <InlineMath math="v = \sqrt{v_x^2 + v_y^2}"/>.
                  </p>
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

export default MenghitungPanjangPage;
