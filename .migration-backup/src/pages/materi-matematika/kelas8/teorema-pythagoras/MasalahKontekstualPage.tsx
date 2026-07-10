import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical, MapPin } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    title: "PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL",
    subtitle: "Kelas 8 · Teorema Pythagoras · Materi Matematika",
    back: "← Kembali ke Teorema Pythagoras",
    sec_intro: "🌟 Pythagoras di Dunia Nyata",
    sec_strategi: "📐 Strategi Menyelesaikan Soal Kontekstual",
    sec_contoh1: "✏️ Contoh 1 — Tangga dan Dinding (Mudah)",
    sec_contoh2: "✏️ Contoh 2 — Diagonal Lapangan (Sedang)",
    sec_contoh3: "✏️ Contoh 3 — Jarak Dua Kapal di Laut (Sulit)",
    sec_rangkuman: "📌 Rangkuman Sub-Bab",
    intisari: "🎯 Ringkasan Intisari",
    introDesc: "Teorema Pythagoras bukan sekadar rumus di buku! Ia hadir di mana-mana: dari menghitung tinggi pohon, panjang kabel listrik, jalur pelari, hingga jarak antara dua kota di peta. Kuncinya: kenali dulu bentuk segitiga siku-siku yang tersembunyi dalam soal cerita!",
    fields: ["🏗️ Konstruksi","⚡ Kelistrikan","🗺️ Navigasi","🏥 Medis"],
    steps: [
      { step: 1, title: "Baca & Pahami", desc: "Baca soal 2× dan identifikasi apa yang diketahui dan apa yang ditanya.", color: "bg-blue-900/30 border-blue-500/40" },
      { step: 2, title: "Gambar Sketsa", desc: "Buat gambar/diagram situasinya. Tandai sudut siku-siku yang ada.", color: "bg-green-900/30 border-green-500/40" },
      { step: 3, title: "Labeli Sisi", desc: "Tandai sisi yang diketahui (a dan b) dan sisi yang dicari (c, atau sebaliknya).", color: "bg-yellow-900/30 border-yellow-500/40" },
      { step: 4, title: "Pilih Rumus", desc: "Gunakan rumus yang sesuai: cari c → √(a²+b²), cari kaki → √(c²-sisi²).", color: "bg-orange-900/30 border-orange-500/40" },
      { step: 5, title: "Hitung & Cek", desc: "Hitung dengan teliti, sederhanakan akar jika perlu, dan beri satuan yang benar.", color: "bg-purple-900/30 border-purple-500/40" },
    ],
    stepsHeader: "📋 Langkah Penyelesaian Soal Cerita",
    easy: "🟢 Tingkat: Mudah",
    medium: "🟡 Tingkat: Sedang",
    hard: "🔴 Tingkat: Sulit",
    discussion: "📋 Pembahasan",
    c1Problem: "Sebuah tangga sepanjang 10 m bersandar ke dinding. Ujung bawah tangga berjarak 6 m dari dasar dinding. Seberapa tinggi tangga itu mencapai tembok?",
    c1Sol: "Diketahui: tangga (hipotenusa)",
    c1Sol2: "m, jarak ke dinding",
    c1Sol3: "m. Dicari: tinggi tembok",
    c1Ans: "✅ Tangga mencapai ketinggian 8 m di tembok. (Ini triple 6-8-10 = kelipatan 3-4-5!)",
    c2Problem: "Lapangan bulu tangkis berukuran panjang 13,4 m dan lebar 6,1 m. Seorang pemain berlari dari sudut ke sudut (diagonal). Berapa jarak yang ditempuhnya? (Bulatkan ke 2 desimal)",
    c2Sol: "Diagonal",
    c2Sol2: "adalah hipotenusa dengan kaki",
    c2Sol3: "m dan",
    c2Ans: "✅ Pemain menempuh jarak sekitar 14,72 m saat berlari diagonal.",
    c3Problem: "Dua kapal berangkat bersamaan dari pelabuhan A. Kapal P berlayar ke arah timur sejauh 36 km, lalu berbelok ke utara sejauh 15 km dan berhenti di titik B. Kapal Q berlayar lurus ke arah timur sejauh 20 km dan berhenti di titik C. Hitung jarak dari B ke C!",
    c3Step1: "Langkah 1: Tentukan koordinat titik-titik. Misalkan A = (0, 0).",
    c3Step2: "Langkah 2: Hitung selisih koordinat.",
    c3Step3: "Langkah 3: Gunakan Pythagoras untuk jarak BC.",
    c3ShipP: "Titik B (Kapal P):",
    c3ShipPDesc: "36 km timur, 15 km utara",
    c3ShipQ: "Titik C (Kapal Q):",
    c3ShipQDesc: "20 km timur, 0 km utara",
    c3Ans: "✅ Jarak dari B ke C ≈ 21,93 km.",
    r1: "Soal kontekstual selalu bisa diubah menjadi masalah segitiga siku-siku —",
    r1b: "gambar sketsanya dulu!",
    r2: "Identifikasi dua sisi yang diketahui dan satu sisi yang dicari.",
    r3: "Untuk jarak dua titik:",
    r4: "Untuk diagonal persegi panjang:",
    r5: "Selalu berikan",
    r5b: "satuan",
    r5c: "pada jawaban akhir!",
    astronaut: "🚀 Tips Astronot: Para insinyur NASA menggunakan Pythagoras untuk menghitung jarak antar planet! Jika kita tahu posisi dua benda langit dalam koordinat tiga dimensi, rumus jarak tiga dimensi adalah perluasan Pythagoras:",
    svgLadder: "c = tangga",
    svgWall: "→ tembok",
    svgHeight: "↑ tinggi",
    svgLength: "panjang (p)",
    svgWidth: "lebar (l)",
    svgVertical: "vertikal",
    svgDistance: "AB (jarak)",
  },
  en: {
    title: "APPLYING THE PYTHAGOREAN THEOREM TO REAL-WORLD PROBLEMS",
    subtitle: "Grade 8 · Pythagorean Theorem · Math Book",
    back: "← Back to Pythagorean Theorem",
    sec_intro: "🌟 Pythagoras in the Real World",
    sec_strategi: "📐 Strategy for Solving Real-World Problems",
    sec_contoh1: "✏️ Example 1 — Ladder and Wall (Easy)",
    sec_contoh2: "✏️ Example 2 — Field Diagonal (Medium)",
    sec_contoh3: "✏️ Example 3 — Distance Between Two Ships (Hard)",
    sec_rangkuman: "📌 Sub-Topic Summary",
    intisari: "🎯 Key Summary",
    introDesc: "The Pythagorean Theorem isn't just a formula in a book! It appears everywhere: from calculating tree heights, cable lengths, running routes, to distances between cities on a map. The key: identify the right triangle hidden in the word problem!",
    fields: ["🏗️ Construction","⚡ Electrical","🗺️ Navigation","🏥 Medical"],
    steps: [
      { step: 1, title: "Read & Understand", desc: "Read the problem twice and identify what is given and what is asked.", color: "bg-blue-900/30 border-blue-500/40" },
      { step: 2, title: "Draw a Sketch", desc: "Draw a diagram of the situation. Mark the right angle.", color: "bg-green-900/30 border-green-500/40" },
      { step: 3, title: "Label the Sides", desc: "Mark the known sides (a and b) and the side to find (c, or vice versa).", color: "bg-yellow-900/30 border-yellow-500/40" },
      { step: 4, title: "Choose the Formula", desc: "Use the appropriate formula: find c → √(a²+b²), find a leg → √(c²−side²).", color: "bg-orange-900/30 border-orange-500/40" },
      { step: 5, title: "Calculate & Check", desc: "Calculate carefully, simplify surds if needed, and include the correct units.", color: "bg-purple-900/30 border-purple-500/40" },
    ],
    stepsHeader: "📋 Steps to Solve Word Problems",
    easy: "🟢 Level: Easy",
    medium: "🟡 Level: Medium",
    hard: "🔴 Level: Hard",
    discussion: "📋 Solution",
    c1Problem: "A 10 m ladder leans against a wall. The foot of the ladder is 6 m from the base of the wall. How high does the ladder reach?",
    c1Sol: "Given: ladder (hypotenuse)",
    c1Sol2: "m, distance from wall",
    c1Sol3: "m. Find: wall height",
    c1Ans: "✅ The ladder reaches 8 m up the wall. (This is triple 6-8-10 = multiple of 3-4-5!)",
    c2Problem: "A badminton court is 13.4 m long and 6.1 m wide. A player runs from one corner to the opposite corner (diagonal). How far does the player run? (Round to 2 decimal places)",
    c2Sol: "The diagonal",
    c2Sol2: "is the hypotenuse with legs",
    c2Sol3: "m and",
    c2Ans: "✅ The player runs approximately 14.72 m diagonally.",
    c3Problem: "Two ships depart simultaneously from port A. Ship P sails east 36 km, then turns north 15 km and stops at point B. Ship Q sails straight east 20 km and stops at point C. Calculate the distance from B to C!",
    c3Step1: "Step 1: Determine coordinates. Let A = (0, 0).",
    c3Step2: "Step 2: Calculate the coordinate differences.",
    c3Step3: "Step 3: Use Pythagoras to find distance BC.",
    c3ShipP: "Point B (Ship P):",
    c3ShipPDesc: "36 km east, 15 km north",
    c3ShipQ: "Point C (Ship Q):",
    c3ShipQDesc: "20 km east, 0 km north",
    c3Ans: "✅ Distance from B to C ≈ 21.93 km.",
    r1: "Real-world problems can always be turned into right triangle problems —",
    r1b: "draw a sketch first!",
    r2: "Identify the two known sides and the one unknown side.",
    r3: "For distance between two points:",
    r4: "For the diagonal of a rectangle:",
    r5: "Always include the",
    r5b: "unit",
    r5c: "in your final answer!",
    astronaut: "🚀 Astronaut Tip: NASA engineers use Pythagoras to calculate distances between planets! If we know the positions of two celestial bodies in 3D coordinates, the 3D distance formula is an extension of Pythagoras:",
    svgLadder: "c = ladder",
    svgWall: "→ wall",
    svgHeight: "↑ height",
    svgLength: "length (l)",
    svgWidth: "width (w)",
    svgVertical: "vertical",
    svgDistance: "AB (distance)",
  },
  ja: {
    title: "ピタゴラスの定理の実生活への応用",
    subtitle: "8年生 · ピタゴラスの定理 · 数学テキスト",
    back: "← ピタゴラスの定理に戻る",
    sec_intro: "🌟 実生活の中のピタゴラス",
    sec_strategi: "📐 実生活の問題を解く戦略",
    sec_contoh1: "✏️ 例題1 — はしごと壁（基本）",
    sec_contoh2: "✏️ 例題2 — グラウンドの対角線（標準）",
    sec_contoh3: "✏️ 例題3 — 2隻の船の距離（発展）",
    sec_rangkuman: "📌 小単元のまとめ",
    intisari: "🎯 要点まとめ",
    introDesc: "ピタゴラスの定理は教科書の中だけの公式ではありません！木の高さ、ケーブルの長さ、走路、地図上の都市間距離など、あらゆる場面に現れます。鍵は：文章問題に隠れた直角三角形を見つけること！",
    fields: ["🏗️ 建設","⚡ 電気","🗺️ ナビゲーション","🏥 医療"],
    steps: [
      { step: 1, title: "読む・理解する", desc: "問題を2回読み、与えられた値と求めるものを確認する。", color: "bg-blue-900/30 border-blue-500/40" },
      { step: 2, title: "スケッチを描く", desc: "状況を図に表す。直角を印で示す。", color: "bg-green-900/30 border-green-500/40" },
      { step: 3, title: "辺にラベルを付ける", desc: "既知の辺（aとb）と求める辺（c、または逆）にラベルを付ける。", color: "bg-yellow-900/30 border-yellow-500/40" },
      { step: 4, title: "公式を選ぶ", desc: "適切な公式を選ぶ：cを求める → √(a²+b²)、辺を求める → √(c²-辺²)。", color: "bg-orange-900/30 border-orange-500/40" },
      { step: 5, title: "計算・確認する", desc: "丁寧に計算し、必要なら根号を簡略化し、正しい単位を付ける。", color: "bg-purple-900/30 border-purple-500/40" },
    ],
    stepsHeader: "📋 文章問題の解き方ステップ",
    easy: "🟢 レベル：基本",
    medium: "🟡 レベル：標準",
    hard: "🔴 レベル：発展",
    discussion: "📋 解答",
    c1Problem: "長さ10mのはしごが壁に立てかけられています。はしごの足は壁の根元から6m離れています。はしごは何mの高さまで届きますか？",
    c1Sol: "与えられた値：はしご（斜辺）",
    c1Sol2: "m、壁からの距離",
    c1Sol3: "m。求めるもの：壁の高さ",
    c1Ans: "✅ はしごは壁の高さ8mまで届きます。（6-8-10は3-4-5の2倍のトリプル！）",
    c2Problem: "バドミントンコートの長さは13.4m、幅は6.1mです。選手が一方の角から対角の角まで（対角線上に）走ります。走った距離は何mですか？（小数第2位まで）",
    c2Sol: "対角線",
    c2Sol2: "は斜辺で、直角辺は",
    c2Sol3: "mと",
    c2Ans: "✅ 選手は対角線上を約14.72m走ります。",
    c3Problem: "2隻の船が港Aを同時に出発します。船Pは東に36km進み、次に北に15km進んで点Bで止まります。船Qは真東に20km進んで点Cで止まります。BからCまでの距離を求めなさい！",
    c3Step1: "ステップ1：座標を決める。A = (0, 0) とする。",
    c3Step2: "ステップ2：座標の差を計算する。",
    c3Step3: "ステップ3：ピタゴラスを使ってBCの距離を求める。",
    c3ShipP: "点B（船P）：",
    c3ShipPDesc: "東へ36km、北へ15km",
    c3ShipQ: "点C（船Q）：",
    c3ShipQDesc: "東へ20km、北へ0km",
    c3Ans: "✅ BからCまでの距離 ≈ 21.93 km。",
    r1: "実生活の問題はいつでも直角三角形の問題に変換できます —",
    r1b: "まずスケッチを描こう！",
    r2: "既知の2辺と求める1辺を特定する。",
    r3: "2点間の距離：",
    r4: "長方形の対角線：",
    r5: "最終的な答えには必ず",
    r5b: "単位",
    r5c: "を付けること！",
    astronaut: "🚀 宇宙飛行士のヒント：NASAのエンジニアは惑星間距離の計算にピタゴラスを使います！3次元座標で2つの天体の位置がわかれば、3次元距離の公式はピタゴラスを拡張したものです：",
    svgLadder: "c = はしご",
    svgWall: "→ 壁",
    svgHeight: "↑ 高さ",
    svgLength: "長さ (l)",
    svgWidth: "幅 (w)",
    svgVertical: "垂直",
    svgDistance: "AB（距離）",
  },
} as const;
type Lang = keyof typeof translations;

const TanggaSVG = ({ svgLadder, svgWall, svgHeight }: { svgLadder: string; svgWall: string; svgHeight: string }) => (
  <svg viewBox="0 0 200 180" className="w-full max-w-xs mx-auto my-2" aria-label="Ladder against wall">
    <defs>
      <style>{`@keyframes tanggaGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.3;}}.tg{animation:tanggaGlow 2s ease-in-out infinite;}`}</style>
    </defs>
    <line x1="10" y1="160" x2="190" y2="160" stroke="#475569" strokeWidth="3"/>
    <line x1="40" y1="160" x2="40" y2="20" stroke="#475569" strokeWidth="3"/>
    <line x1="110" y1="160" x2="40" y2="50" stroke="#f97316" strokeWidth="3" className="tg"/>
    <polyline points="40,155 50,155 50,160" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" opacity="0.8"/>
    <text x="70" y="155" fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">b = ?</text>
    <text x="12" y="110" fill="#3b82f6" fontSize="10" fontFamily="monospace" fontWeight="bold">a = ?</text>
    <text x="85" y="100" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">{svgLadder}</text>
    <text x="120" y="158" fill="#4ade80" fontSize="8" fontFamily="monospace">{svgWall}</text>
    <text x="40" y="18" fill="#60a5fa" fontSize="8" fontFamily="monospace">{svgHeight}</text>
  </svg>
);

const DiagonalSVG = ({ svgLength, svgWidth }: { svgLength: string; svgWidth: string }) => (
  <svg viewBox="0 0 240 160" className="w-full max-w-sm mx-auto my-2" aria-label="Rectangle diagonal">
    <defs>
      <style>{`@keyframes diagGlow{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.2;}}.dg{animation:diagGlow 2s ease-in-out infinite;}`}</style>
    </defs>
    <rect x="20" y="30" width="180" height="100" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="2"/>
    <line x1="20" y1="30" x2="200" y2="130" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" className="dg"/>
    <line x1="20" y1="130" x2="200" y2="30" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 3" className="dg"/>
    <text x="105" y="25" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">{svgLength}</text>
    <text x="8" y="83" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,8,83)">{svgWidth}</text>
    <text x="118" y="100" fill="#fb923c" fontSize="10" fontFamily="monospace">d = √(p²+l²)</text>
    <polyline points="20,110 35,110 35,130" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.7"/>
  </svg>
);

const JarakTitikSVG = ({ svgVertical, svgDistance }: { svgVertical: string; svgDistance: string }) => (
  <svg viewBox="0 0 240 180" className="w-full max-w-sm mx-auto my-2" aria-label="Distance between two points">
    <defs>
      <style>{`@keyframes pathGlow{0%,100%{opacity:1;}50%{opacity:0.3;}}.pg{animation:pathGlow 2.5s ease-in-out infinite;}`}</style>
    </defs>
    {[0,1,2,3,4].map(i=>(
      <line key={"h"+i} x1="20" y1={20+i*35} x2="220" y2={20+i*35} stroke="#1e293b" strokeWidth="1"/>
    ))}
    {[0,1,2,3,4,5].map(i=>(
      <line key={"v"+i} x1={20+i*40} y1="20" x2={20+i*40} y2="160" stroke="#1e293b" strokeWidth="1"/>
    ))}
    <line x1="40" y1="130" x2="180" y2="130" stroke="#22c55e" strokeWidth="2.5" className="pg"/>
    <line x1="180" y1="130" x2="180" y2="50" stroke="#3b82f6" strokeWidth="2.5" className="pg"/>
    <line x1="40" y1="130" x2="180" y2="50" stroke="#f97316" strokeWidth="2.5"/>
    <circle cx="40" cy="130" r="5" fill="#22c55e"/>
    <circle cx="180" cy="50" r="5" fill="#f97316"/>
    <circle cx="180" cy="130" r="4" fill="#3b82f6" fillOpacity="0.7"/>
    <text x="32" y="144" fill="#4ade80" fontSize="9" fontFamily="monospace">A</text>
    <text x="183" y="143" fill="#60a5fa" fontSize="9" fontFamily="monospace">C</text>
    <text x="183" y="47" fill="#fb923c" fontSize="9" fontFamily="monospace">B</text>
    <text x="110" y="145" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">horizontal</text>
    <text x="193" y="93" fill="#60a5fa" fontSize="9" textAnchor="middle" fontFamily="monospace">{svgVertical}</text>
    <text x="95" y="82" fill="#fb923c" fontSize="9" fontFamily="monospace">{svgDistance}</text>
    <polyline points="180,120 170,120 170,130" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" opacity="0.7"/>
  </svg>
);

const MasalahKontekstualPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as Lang];
  const [open, setOpen] = useState<string[]>(["intro","strategi","contoh1","contoh2","contoh3","rangkuman"]);

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
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.introDesc}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-body">
                  {t.fields.map((item,i)=>(
                    <div key={i} className="bg-slate-800/60 border border-slate-600 rounded-lg p-2 text-center">
                      <p className="text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STRATEGI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="strategi" icon={<Target className="w-5 h-5"/>} iconColor="text-cyan-400" title={t.sec_strategi}/>
            {open.includes("strategi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.stepsHeader}</p>
                  {t.steps.map(({ step, title, desc, color }) => (
                    <div key={step} className={`flex gap-3 border rounded-lg px-3 py-2 ${color}`}>
                      <span className="bg-slate-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                      <div>
                        <p className="font-body text-sm font-bold text-white">{title}</p>
                        <p className="font-body text-xs text-white/60">{desc}</p>
                      </div>
                    </div>
                  ))}
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
                  <p className="font-body text-sm text-white/90">{t.c1Problem}</p>
                </div>
                <TanggaSVG svgLadder={t.svgLadder} svgWall={t.svgWall} svgHeight={t.svgHeight}/>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.c1Sol} <InlineMath math="c = 10"/> {t.c1Sol2} <InlineMath math="b = 6"/> {t.c1Sol3} <InlineMath math="a"/>.
                  </p>
                  <BlockMath math="a = \sqrt{c^2 - b^2} = \sqrt{10^2 - 6^2}"/>
                  <BlockMath math="a = \sqrt{100 - 36} = \sqrt{64}"/>
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <BlockMath math="a = 8 \text{ m}"/>
                    <p className="font-body text-sm text-green-300 text-center mt-1">{t.c1Ans}</p>
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
                  <p className="font-body text-sm text-white/90">{t.c2Problem}</p>
                </div>
                <DiagonalSVG svgLength={t.svgLength} svgWidth={t.svgWidth}/>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.c2Sol} <InlineMath math="d"/> {t.c2Sol2} <InlineMath math="p = 13{,}4"/> {t.c2Sol3} <InlineMath math="l = 6{,}1"/> m.
                  </p>
                  <BlockMath math="d = \sqrt{p^2 + l^2} = \sqrt{13{,}4^2 + 6{,}1^2}"/>
                  <BlockMath math="d = \sqrt{179{,}56 + 37{,}21} = \sqrt{216{,}77}"/>
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <BlockMath math="d \approx 14{,}72 \text{ m}"/>
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
                  <p className="font-body text-sm text-white/90">{t.c3Problem}</p>
                </div>
                <JarakTitikSVG svgVertical={t.svgVertical} svgDistance={t.svgDistance}/>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-4">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide">{t.discussion}</p>
                  <p className="font-body text-sm text-white/80"><strong>{t.c3Step1}</strong></p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-cyan-300 font-bold">{t.c3ShipP}</p>
                      <p className="text-white/70">{t.c3ShipPDesc}</p>
                      <p className="text-white font-bold mt-1">B = (36, 15)</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-orange-300 font-bold">{t.c3ShipQ}</p>
                      <p className="text-white/70">{t.c3ShipQDesc}</p>
                      <p className="text-white font-bold mt-1">C = (20, 0)</p>
                    </div>
                  </div>
                  <p className="font-body text-sm text-white/80"><strong>{t.c3Step2}</strong></p>
                  <BlockMath math="\Delta x = 36 - 20 = 16 \text{ km}"/>
                  <BlockMath math="\Delta y = 15 - 0 = 15 \text{ km}"/>
                  <p className="font-body text-sm text-white/80"><strong>{t.c3Step3}</strong></p>
                  <BlockMath math="BC = \sqrt{(\Delta x)^2 + (\Delta y)^2} = \sqrt{16^2 + 15^2}"/>
                  <BlockMath math="BC = \sqrt{256 + 225} = \sqrt{481}"/>
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <BlockMath math="BC = \sqrt{481} \approx 21{,}93 \text{ km}"/>
                    <p className="font-body text-sm text-red-200 text-center mt-1">{t.c3Ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<MapPin className="w-5 h-5"/>} iconColor="text-violet-400" title={t.sec_rangkuman}/>
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• {t.r1} <strong className="text-cyan-300">{t.r1b}</strong></p>
                  <p className="font-body text-sm text-white/80">• {t.r2}</p>
                  <p className="font-body text-sm text-white/80">• {t.r3} <InlineMath math="d = \sqrt{(\Delta x)^2 + (\Delta y)^2}"/>.</p>
                  <p className="font-body text-sm text-white/80">• {t.r4} <InlineMath math="d = \sqrt{p^2 + l^2}"/>.</p>
                  <p className="font-body text-sm text-white/80">• {t.r5} <strong className="text-yellow-300">{t.r5b}</strong> {t.r5c}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    {t.astronaut} <InlineMath math="d = \sqrt{x^2 + y^2 + z^2}"/>.
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

export default MasalahKontekstualPage;
