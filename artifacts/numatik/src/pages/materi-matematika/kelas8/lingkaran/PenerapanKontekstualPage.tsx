import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const translations = {
  id: {
    h1: "PENERAPAN LINGKARAN PADA MASALAH KONTEKSTUAL",
    subtitle: "Kelas 8 · Lingkaran · Buku Animasi Matematika",
    backBtn: "← Kembali ke Lingkaran",
    svgJamNote: "Sudut jarum jam = busur/juring lingkaran!",
    svgJamAria: "Jam dinding analogi lingkaran",
    svgRodaNote: "K₁/K₂ = r₁/r₂ → kec. putar berbeda!",
    svgRodaAria: "Roda gigi - penerapan lingkaran",
    svgKolongNote: "L = π(R² − r²) — luas cincin pipa",
    svgKolongAria: "Tampang melintang pipa",
    svgBanAria: "Ban menggelinding satu putaran penuh",
    svgBanTitle: "🛞 1 putaran penuh ban = 1 keliling lingkaran",
    svgBanStart: "Mulai",
    svgBanKeliling: "Keliling = πd = 2πr",
    svgBanPerfect: "✅ Tepat 1 putaran penuh!",
    heroLabel: "Intuisi Awal",
    heroP: "Bayangkan sebuah ban menggelinding di jalan lurus. Satu putaran penuh artinya ban menempuh jarak yang tepat sama dengan keliling lingkaran ban tersebut.",
    heroBold1: "Satu putaran penuh",
    heroBold2: "keliling lingkaran ban",
    heroTrail: "— Jejak kuning = jarak 1 putaran",
    heroDot: "● Titik merah = penanda rotasi",
    introTitle: "🌍 Lingkaran Ada di Mana-Mana!",
    introP: "Selama ini kita belajar rumus — sekarang waktunya pakai rumus itu untuk menyelesaikan masalah nyata! Lingkaran hadir dalam kehidupan sehari-hari: jam dinding, roda kendaraan, pipa air, permukaan kaleng, taman melingkar, antena parabola, dan masih banyak lagi.",
    introBold: "jam dinding, roda kendaraan, pipa air, permukaan kaleng, taman melingkar, antena parabola",
    cards: [
      { emoji: "⏰", label: "Jam & Sudut", hint: "Jarum jam → sudut pusat & busur" },
      { emoji: "⚙️", label: "Roda & Mesin", hint: "Keliling roda → jarak tempuh" },
      { emoji: "🚿", label: "Pipa & Kolam", hint: "Luas cincin → debit air" },
    ],
    strategiTitle: "📐 Strategi Menyelesaikan Soal Kontekstual",
    summaryTitle: "🎯 Ringkasan Intisari",
    summaryP: "Soal kontekstual = soal cerita. Kuncinya adalah terjemahkan kata-kata ke gambar/model matematis, baru hitung!",
    summaryBold: "terjemahkan kata-kata ke gambar/model matematis",
    steps: [
      { step: "1", color: "blue", title: "Baca & Pahami", desc: "Apa yang diketahui? Apa yang dicari? Gambarkan jika perlu." },
      { step: "2", color: "green", title: "Identifikasi Konsep", desc: "Apakah ini soal keliling, luas, busur, juring, atau sudut?" },
      { step: "3", color: "yellow", title: "Pilih Rumus", desc: "Tulis rumus yang sesuai dan substitusikan nilai yang diketahui." },
      { step: "4", color: "orange", title: "Hitung & Cek Satuan", desc: "Pastikan satuannya konsisten (cm, m, cm², dll)." },
    ],
    c1Title: "✏️ Contoh 1 — Roda dan Jarak Tempuh (Mudah)",
    c1Level: "🟢 Tingkat: Mudah",
    c1Q: "Sebuah sepeda memiliki roda berdiameter 56 cm. Jika roda berputar sebanyak 500 kali, berapa jarak yang ditempuh sepeda? (π = 22/7)",
    c1Sol: "📋 Pembahasan",
    c1Ident: "Satu putaran roda = menempuh jarak sejauh keliling roda.",
    c1s1: "Langkah 1:",
    c1s1T: "Keliling roda",
    c1s2: "Langkah 2:",
    c1s2T: "Jarak total (500 putaran)",
    c1Result: "✅ Jarak tempuh = 880 m = 0,88 km.",
    c2Title: "✏️ Contoh 2 — Biaya Pengecatan Taman (Sedang)",
    c2Level: "🟡 Tingkat: Sedang",
    c2Q: "Sebuah taman kota berbentuk lingkaran dengan diameter 28 m. Di tengah taman terdapat air mancur berbentuk lingkaran berjari-jari 3,5 m. Sisa tanah taman akan ditanami rumput dengan biaya Rp15.000 per m². Tentukan total biaya yang diperlukan! (π = 22/7)",
    c2Sol: "📋 Pembahasan",
    c2s1: "Langkah 1:",
    c2s1T: "Jari-jari taman besar",
    c2s2: "Langkah 2:",
    c2s2T: "Luas taman besar (L₁)",
    c2s3: "Langkah 3:",
    c2s3T: "Luas air mancur (L₂)",
    c2s4: "Langkah 4:",
    c2s4T: "Luas yang ditanami rumput",
    c2s5: "Langkah 5:",
    c2s5T: "Total biaya",
    c2CostLabel: "Biaya",
    c2Result: "✅ Total biaya = Rp 8.662.500.",
    c3Title: "✏️ Contoh 3 — Debit Air Pipa (Sulit)",
    c3Level: "🔴 Tingkat: Sulit",
    c3Q: "Sebuah pipa air berdiameter luar 10 cm dan diameter dalam 8 cm. Air mengalir dengan kecepatan 2 m/s melalui bagian dalam pipa. Hitunglah debit air (volume per detik) yang mengalir! (π = 3,14, jawab dalam cm³/s)",
    c3Sol: "📋 Pembahasan",
    c3Ident: "Debit = luas penampang × kecepatan aliran. Penampang = lingkaran dalam pipa.",
    c3s1: "Langkah 1:",
    c3s1T: "Jari-jari dalam pipa",
    c3s2: "Langkah 2:",
    c3s2T: "Luas penampang dalam",
    c3s3: "Langkah 3:",
    c3s3T: "Konversi kecepatan (2 m/s = 200 cm/s)",
    c3s4: "Langkah 4:",
    c3s4T: "Debit air",
    c3Result: "✅ Debit air = 10.048 cm³/s ≈ 10,05 liter/detik.",
    rTitle: "📌 Rangkuman Sub-Bab",
    rB1: "Jarak tempuh roda",
    rB1rest: "= jumlah putaran × keliling roda",
    rB2: "Luas daerah berlubang/cincin",
    rB3: "Biaya",
    rB3rest: "= luas area × harga per satuan luas",
    rB4: "Debit air",
    rB4rest: "= luas penampang × kecepatan aliran",
    tips: "🚀 Tips Astronot: Semua rumus lingkaran yang kamu pelajari digunakan para insinyur NASA untuk merancang roket, orbit satelit, dan antena radar. Kamu sudah satu langkah lebih dekat menjadi insinyur antariksa!",
  },
  en: {
    h1: "CONTEXTUAL APPLICATIONS OF CIRCLES",
    subtitle: "Grade 8 · Circle · Math Animation Book",
    backBtn: "← Back to Circle",
    svgJamNote: "Clock hand angle = arc/sector of a circle!",
    svgJamAria: "Clock analogy for circles",
    svgRodaNote: "C₁/C₂ = r₁/r₂ → different rotation speeds!",
    svgRodaAria: "Gear wheels — circle application",
    svgKolongNote: "A = π(R² − r²) — area of pipe ring",
    svgKolongAria: "Cross-section of a pipe",
    svgBanAria: "Wheel rolling one full rotation",
    svgBanTitle: "🛞 1 full rotation = 1 circumference",
    svgBanStart: "Start",
    svgBanKeliling: "Circumference = πd = 2πr",
    svgBanPerfect: "✅ Exactly 1 full rotation!",
    heroLabel: "Initial Intuition",
    heroP: "Imagine a wheel rolling on a straight road. One full rotation means the wheel travels a distance exactly equal to the circumference of the wheel.",
    heroBold1: "One full rotation",
    heroBold2: "circumference of the wheel",
    heroTrail: "— Yellow trail = distance of 1 rotation",
    heroDot: "● Red dot = rotation tracker",
    introTitle: "🌍 Circles Are Everywhere!",
    introP: "We've been learning formulas — now it's time to use them to solve real problems! Circles appear in everyday life: clocks, vehicle wheels, water pipes, can surfaces, circular parks, parabolic antennas, and many more.",
    introBold: "clocks, vehicle wheels, water pipes, can surfaces, circular parks, parabolic antennas",
    cards: [
      { emoji: "⏰", label: "Clocks & Angles", hint: "Clock hand → central angle & arc" },
      { emoji: "⚙️", label: "Wheels & Engines", hint: "Circumference → distance traveled" },
      { emoji: "🚿", label: "Pipes & Pools", hint: "Ring area → flow rate" },
    ],
    strategiTitle: "📐 Strategy for Contextual Problems",
    summaryTitle: "🎯 Key Summary",
    summaryP: "Contextual problems = word problems. The key is to translate words into a diagram/math model, then calculate!",
    summaryBold: "translate words into a diagram/math model",
    steps: [
      { step: "1", color: "blue", title: "Read & Understand", desc: "What is given? What is asked? Draw a diagram if needed." },
      { step: "2", color: "green", title: "Identify the Concept", desc: "Is this a circumference, area, arc, sector, or angle problem?" },
      { step: "3", color: "yellow", title: "Choose the Formula", desc: "Write the appropriate formula and substitute the known values." },
      { step: "4", color: "orange", title: "Calculate & Check Units", desc: "Make sure units are consistent (cm, m, cm², etc.)." },
    ],
    c1Title: "✏️ Example 1 — Wheel and Distance (Easy)",
    c1Level: "🟢 Level: Easy",
    c1Q: "A bicycle has a wheel with diameter 56 cm. If the wheel rotates 500 times, what distance does the bicycle travel? (π = 22/7)",
    c1Sol: "📋 Solution",
    c1Ident: "One rotation of the wheel = the wheel travels a distance equal to its circumference.",
    c1s1: "Step 1:",
    c1s1T: "Wheel circumference",
    c1s2: "Step 2:",
    c1s2T: "Total distance (500 rotations)",
    c1Result: "✅ Distance traveled = 880 m = 0.88 km.",
    c2Title: "✏️ Example 2 — Park Planting Cost (Medium)",
    c2Level: "🟡 Level: Medium",
    c2Q: "A city park is circular with diameter 28 m. At the center is a circular fountain with radius 3.5 m. The remaining land will be planted with grass at Rp15,000 per m². Find the total cost! (π = 22/7)",
    c2Sol: "📋 Solution",
    c2s1: "Step 1:",
    c2s1T: "Radius of the large park",
    c2s2: "Step 2:",
    c2s2T: "Area of large park (A₁)",
    c2s3: "Step 3:",
    c2s3T: "Area of fountain (A₂)",
    c2s4: "Step 4:",
    c2s4T: "Grass area",
    c2s5: "Step 5:",
    c2s5T: "Total cost",
    c2CostLabel: "Cost",
    c2Result: "✅ Total cost = Rp 8,662,500.",
    c3Title: "✏️ Example 3 — Water Pipe Flow Rate (Hard)",
    c3Level: "🔴 Level: Hard",
    c3Q: "A water pipe has outer diameter 10 cm and inner diameter 8 cm. Water flows at 2 m/s through the inside of the pipe. Calculate the flow rate (volume per second)! (π = 3.14, answer in cm³/s)",
    c3Sol: "📋 Solution",
    c3Ident: "Flow rate = cross-sectional area × flow speed. Cross-section = inner circle of pipe.",
    c3s1: "Step 1:",
    c3s1T: "Inner radius of pipe",
    c3s2: "Step 2:",
    c3s2T: "Inner cross-sectional area",
    c3s3: "Step 3:",
    c3s3T: "Convert speed (2 m/s = 200 cm/s)",
    c3s4: "Step 4:",
    c3s4T: "Flow rate",
    c3Result: "✅ Flow rate = 10,048 cm³/s ≈ 10.05 liters/second.",
    rTitle: "📌 Chapter Summary",
    rB1: "Distance traveled by wheel",
    rB1rest: "= number of rotations × circumference",
    rB2: "Area of hollow/ring region",
    rB3: "Cost",
    rB3rest: "= area × price per unit area",
    rB4: "Flow rate",
    rB4rest: "= cross-sectional area × flow speed",
    tips: "🚀 Astronaut Tip: All the circle formulas you've learned are used by NASA engineers to design rockets, satellite orbits, and radar antennas. You're one step closer to becoming a space engineer!",
  },
  ja: {
    h1: "円の文脈的応用",
    subtitle: "中学2年 · 円 · 数学アニメーション",
    backBtn: "← 円に戻る",
    svgJamNote: "時計の針の角度 = 弧/扇形！",
    svgJamAria: "円のアナロジーとしての時計",
    svgRodaNote: "C₁/C₂ = r₁/r₂ → 異なる回転速度！",
    svgRodaAria: "歯車 — 円の応用",
    svgKolongNote: "A = π(R² − r²) — パイプの輪の面積",
    svgKolongAria: "パイプの断面",
    svgBanAria: "タイヤが1回転する様子",
    svgBanTitle: "🛞 1回転 = 1周分の距離",
    svgBanStart: "スタート",
    svgBanKeliling: "円周 = πd = 2πr",
    svgBanPerfect: "✅ ちょうど1回転！",
    heroLabel: "最初の直感",
    heroP: "直線の道でタイヤが転がるのを想像してください。1回転するとタイヤはちょうどタイヤの円周と同じ距離を進みます。",
    heroBold1: "1回転",
    heroBold2: "タイヤの円周",
    heroTrail: "— 黄色の跡 = 1回転分の距離",
    heroDot: "● 赤い点 = 回転トラッカー",
    introTitle: "🌍 円はどこにでもある！",
    introP: "これまで公式を学んできました — 今度はその公式を実際の問題に使う時です！円は日常生活の中に溢れています：時計、車輪、水道管、缶の表面、円形公園、パラボラアンテナ、などなど。",
    introBold: "時計、車輪、水道管、缶の表面、円形公園、パラボラアンテナ",
    cards: [
      { emoji: "⏰", label: "時計と角度", hint: "時計の針 → 中心角と弧" },
      { emoji: "⚙️", label: "車輪と機械", hint: "円周 → 移動距離" },
      { emoji: "🚿", label: "パイプとプール", hint: "輪の面積 → 流量" },
    ],
    strategiTitle: "📐 文章題の解き方",
    summaryTitle: "🎯 重要ポイント",
    summaryP: "文脈的問題 = 文章題。鍵は言葉を図/数学モデルに変換してから計算することです！",
    summaryBold: "言葉を図/数学モデルに変換",
    steps: [
      { step: "1", color: "blue", title: "読んで理解する", desc: "何が与えられているか？何が求められているか？必要なら図を描く。" },
      { step: "2", color: "green", title: "概念を特定する", desc: "これは円周、面積、弧、扇形、角度の問題か？" },
      { step: "3", color: "yellow", title: "公式を選ぶ", desc: "適切な公式を書いて、既知の値を代入する。" },
      { step: "4", color: "orange", title: "計算して単位を確認", desc: "単位が一致しているか確認する（cm、m、cm²など）。" },
    ],
    c1Title: "✏️ 例題1 — 車輪と移動距離（基本）",
    c1Level: "🟢 レベル：基本",
    c1Q: "自転車の車輪の直径は56 cmです。車輪が500回転したとき、自転車が進む距離は？（π = 22/7）",
    c1Sol: "📋 解説",
    c1Ident: "車輪1回転 = 車輪の円周と同じ距離を進む。",
    c1s1: "ステップ1：",
    c1s1T: "車輪の円周",
    c1s2: "ステップ2：",
    c1s2T: "合計距離（500回転）",
    c1Result: "✅ 移動距離 = 880 m = 0.88 km。",
    c2Title: "✏️ 例題2 — 公園の芝植えコスト（標準）",
    c2Level: "🟡 レベル：標準",
    c2Q: "直径28 mの円形の都市公園があります。中央にr = 3.5 mの円形噴水があります。残りの土地にRp15,000/m²で芝を植えます。総費用を求めなさい！（π = 22/7）",
    c2Sol: "📋 解説",
    c2s1: "ステップ1：",
    c2s1T: "大きな公園の半径",
    c2s2: "ステップ2：",
    c2s2T: "大きな公園の面積（A₁）",
    c2s3: "ステップ3：",
    c2s3T: "噴水の面積（A₂）",
    c2s4: "ステップ4：",
    c2s4T: "芝を植える面積",
    c2s5: "ステップ5：",
    c2s5T: "総費用",
    c2CostLabel: "費用",
    c2Result: "✅ 総費用 = Rp 8,662,500。",
    c3Title: "✏️ 例題3 — 水流量（発展）",
    c3Level: "🔴 レベル：発展",
    c3Q: "外径10 cm、内径8 cmの水道管があります。水は管内を2 m/sで流れます。流量（毎秒の体積）を計算しなさい！（π = 3.14、cm³/s単位で答えること）",
    c3Sol: "📋 解説",
    c3Ident: "流量 = 断面積 × 流速。断面 = パイプの内側の円。",
    c3s1: "ステップ1：",
    c3s1T: "パイプの内側半径",
    c3s2: "ステップ2：",
    c3s2T: "内側断面積",
    c3s3: "ステップ3：",
    c3s3T: "速度の変換（2 m/s = 200 cm/s）",
    c3s4: "ステップ4：",
    c3s4T: "流量",
    c3Result: "✅ 流量 = 10,048 cm³/s ≈ 10.05 L/秒。",
    rTitle: "📌 まとめ",
    rB1: "車輪の移動距離",
    rB1rest: "= 回転数 × 円周",
    rB2: "中空/輪の面積",
    rB3: "費用",
    rB3rest: "= 面積 × 単位面積あたりの価格",
    rB4: "流量",
    rB4rest: "= 断面積 × 流速",
    tips: "🚀 宇宙人のヒント：学んだ円の公式はすべてNASAのエンジニアがロケット、衛星軌道、レーダーアンテナの設計に使っています。宇宙エンジニアへの一歩を踏み出しました！",
  },
} as const;
type T = typeof translations.id;

/* ─── SVG: Jam Dinding ─────────────────────────────────── */
const JamDindingSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto my-2" aria-label={t.svgJamAria}>
    <defs>
      <style>{`
        @keyframes rotateJarum{from{transform-origin:130px 130px;transform:rotate(0deg);}to{transform-origin:130px 130px;transform:rotate(360deg);}}
        @keyframes rotateJarumMenit{from{transform-origin:130px 130px;transform:rotate(0deg);}to{transform-origin:130px 130px;transform:rotate(360deg);}}
        .jarum-jam{animation:rotateJarum 12s linear infinite;}
        .jarum-menit{animation:rotateJarumMenit 60s linear infinite;}
      `}</style>
    </defs>
    <circle cx="130" cy="130" r="100" fill="rgba(30,41,59,0.9)" stroke="#06b6d4" strokeWidth="3"/>
    <circle cx="130" cy="130" r="95" fill="none" stroke="#0e7490" strokeWidth="1"/>
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const x1 = 130 + 82 * Math.cos(angle);
      const y1 = 130 + 82 * Math.sin(angle);
      const x2 = 130 + 95 * Math.cos(angle);
      const y2 = 130 + 95 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#06b6d4" strokeWidth={i % 3 === 0 ? 3 : 1.5}/>;
    })}
    {[12,3,6,9].map((n, i) => {
      const angle = (i * 90 - 90) * Math.PI / 180;
      const x = 130 + 70 * Math.cos(angle);
      const y = 130 + 70 * Math.sin(angle);
      return <text key={n} x={x} y={y + 4} fill="#67e8f9" fontSize="16" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{n}</text>;
    })}
    <line x1="130" y1="130" x2="130" y2="80" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" className="jarum-jam"/>
    <line x1="130" y1="130" x2="160" y2="68" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" className="jarum-menit"/>
    <circle cx="130" cy="130" r="5" fill="#f59e0b"/>
    <text x="130" y="240" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svgJamNote}</text>
  </svg>
);

/* ─── SVG: Roda Gigi ───────────────────────────────────── */
const RodaGigiSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto my-2" aria-label={t.svgRodaAria}>
    <defs>
      <style>{`
        @keyframes spin1{from{transform-origin:80px 90px;transform:rotate(0deg);}to{transform-origin:80px 90px;transform:rotate(360deg);}}
        @keyframes spin2{from{transform-origin:210px 90px;transform:rotate(0deg);}to{transform-origin:210px 90px;transform:rotate(-360deg);}}
        .gear1{animation:spin1 4s linear infinite;}
        .gear2{animation:spin2 4s linear infinite;}
      `}</style>
    </defs>
    <circle cx="80" cy="90" r="55" fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="2.5" className="gear1"/>
    <circle cx="80" cy="90" r="10" fill="#f59e0b" className="gear1"/>
    <text x="80" y="155" fill="#fbbf24" fontSize="10" textAnchor="middle" fontFamily="monospace">r₁ = 55</text>
    <circle cx="210" cy="90" r="35" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2.5" className="gear2"/>
    <circle cx="210" cy="90" r="8" fill="#22c55e" className="gear2"/>
    <text x="210" y="155" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="monospace">r₂ = 35</text>
    <line x1="80" y1="90" x2="210" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3"/>
    <text x="145" y="83" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">135</text>
    <text x="145" y="170" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">{t.svgRodaNote}</text>
  </svg>
);

/* ─── SVG: Kolong Pipa ─────────────────────────────────── */
const KolongSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto my-2" aria-label={t.svgKolongAria}>
    <defs>
      <style>{`@keyframes waterFlow{0%{opacity:0.3;}50%{opacity:0.9;}100%{opacity:0.3;}}.wf{animation:waterFlow 2s ease-in-out infinite;}`}</style>
    </defs>
    <circle cx="150" cy="100" r="80" fill="rgba(6,182,212,0.05)" stroke="#0e7490" strokeWidth="3"/>
    <circle cx="150" cy="100" r="65" fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth="2" className="wf"/>
    <circle cx="150" cy="100" r="65" fill="rgba(59,130,246,0.1)" stroke="none"/>
    <line x1="150" y1="100" x2="215" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2"/>
    <text x="185" y="92" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">R=80</text>
    <line x1="150" y1="100" x2="150" y2="35" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2"/>
    <text x="155" y="65" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">r=65</text>
    <circle cx="150" cy="100" r="4" fill="var(--icon-color)"/>
    <text x="150" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.svgKolongNote}</text>
  </svg>
);

/* ─── SVG: Ban Menggelinding ────────────────────────────── */
const BanMenggelindingSVG = ({ t }: { t: T }) => {
  const r = 35;
  const groundY = 148;
  const startX = 50;
  const wheelCY = groundY - r;
  const dist = Math.round(2 * Math.PI * r);
  const endX = startX + dist;
  const spokes = [0, 60, 120, 180, 240, 300];
  return (
    <svg viewBox="0 0 324 200" className="w-full max-w-md mx-auto" aria-label={t.svgBanAria}>
      <defs>
        <style>{`
          @keyframes wTranslate {
            0%   { transform: translate(${startX}px, ${wheelCY}px); }
            70%  { transform: translate(${endX}px, ${wheelCY}px); }
            88%  { transform: translate(${endX}px, ${wheelCY}px); }
            89%  { transform: translate(${startX}px, ${wheelCY}px); }
            100% { transform: translate(${startX}px, ${wheelCY}px); }
          }
          @keyframes wOpacity {
            0%   { opacity: 1; }
            87%  { opacity: 1; }
            88.5%{ opacity: 0; }
            92%  { opacity: 0; }
            94%  { opacity: 1; }
            100% { opacity: 1; }
          }
          @keyframes wRotate {
            0%   { transform: rotate(0deg); }
            70%  { transform: rotate(360deg); }
            88%  { transform: rotate(360deg); }
            89%  { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes braceFade {
            0%   { opacity: 0; }
            69%  { opacity: 0; }
            72%  { opacity: 1; }
            87%  { opacity: 1; }
            89%  { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes trailGrow {
            0%   { stroke-dashoffset: ${dist}; }
            70%  { stroke-dashoffset: 0; }
            88%  { stroke-dashoffset: 0; }
            89%  { stroke-dashoffset: ${dist}; }
            100% { stroke-dashoffset: ${dist}; }
          }
          .ban-wt  { animation: wTranslate 5s ease-in-out infinite, wOpacity 5s ease-in-out infinite; }
          .ban-wr  { transform-origin: 0px 0px; animation: wRotate 5s ease-in-out infinite; }
          .ban-brace { animation: braceFade 5s ease-in-out infinite; }
          .ban-trail { stroke-dasharray: ${dist}; animation: trailGrow 5s ease-in-out infinite; }
        `}</style>
      </defs>
      <text x="162" y="15" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
        {t.svgBanTitle}
      </text>
      <line
        x1={startX} y1={groundY - 1}
        x2={endX}   y2={groundY - 1}
        stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"
        className="ban-trail"
      />
      <line x1="8" y1={groundY} x2="316" y2={groundY} stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1={startX} y1={groundY} x2={startX} y2={groundY + 9} stroke="#06b6d4" strokeWidth="2"/>
      <text x={startX} y={groundY + 19} fill="#67e8f9" fontSize="8.5" textAnchor="middle" fontFamily="monospace">{t.svgBanStart}</text>
      <g className="ban-brace">
        <line x1={endX} y1={groundY} x2={endX} y2={groundY + 9} stroke="#22c55e" strokeWidth="2"/>
        <line x1={startX} y1={groundY + 13} x2={endX} y2={groundY + 13} stroke="#fbbf24" strokeWidth="1.5"/>
        <line x1={startX} y1={groundY + 10} x2={startX} y2={groundY + 16} stroke="#fbbf24" strokeWidth="1.5"/>
        <line x1={endX}   y1={groundY + 10} x2={endX}   y2={groundY + 16} stroke="#fbbf24" strokeWidth="1.5"/>
        <text x={(startX + endX) / 2} y={groundY + 29} fill="#fcd34d" fontSize="9.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
          {t.svgBanKeliling}
        </text>
        <text x={(startX + endX) / 2} y={groundY + 42} fill="#4ade80" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
          {t.svgBanPerfect}
        </text>
      </g>
      <g className="ban-wt">
        <g className="ban-wr">
          <circle cx="0" cy="0" r={r} fill="rgba(15,23,42,0.95)" stroke="#64748b" strokeWidth="6"/>
          <circle cx="0" cy="0" r={r - 10} fill="none" stroke="#334155" strokeWidth="2"/>
          {spokes.map(deg => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line key={deg}
                x1="0" y1="0"
                x2={(r - 7) * Math.cos(rad)}
                y2={(r - 7) * Math.sin(rad)}
                stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
              />
            );
          })}
          <circle cx="0" cy="0" r={5} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5"/>
          <circle cx="0" cy={r} r={5.5} fill="#f43f5e" stroke="#fda4af" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  );
};

/* ─── Main Page ─────────────────────────────────────────── */
const PenerapanKontekstualPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const SH = ({ icon, iconColor, title }: { icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <span className={iconColor}>{icon}</span>
      <span className="font-body font-semibold text-white ml-3">{title}</span>
    </div>
  );

  const cardColors = ["yellow", "green", "blue"] as const;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.h1}</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        {/* Hero */}
        <div className="rounded-xl border mb-4 px-4 pt-4 pb-5 text-center"
          style={{ background: "rgba(15,23,42,.85)", borderColor: "rgba(6,182,212,.3)", backdropFilter: "blur(12px)" }}>
          <p className="font-body text-xs text-white/55 mb-1 uppercase tracking-widest">{t.heroLabel}</p>
          <p className="font-body text-sm text-white/85 mb-3 leading-relaxed">
            {t.heroP.split(t.heroBold1)[0]}
            <strong className="text-cyan-300">{t.heroBold1}</strong>
            {t.heroP.split(t.heroBold1)[1]?.split(t.heroBold2)[0]}
            <em>{t.heroP.split(t.heroBold1)[1]?.split(t.heroBold2)[0]?.includes("tepat sama") ? "tepat sama" : ""}</em>
            {" "}<strong className="text-yellow-300">{t.heroBold2}</strong>
            {t.heroP.split(t.heroBold2)[1]}
          </p>
          <BanMenggelindingSVG t={t} />
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg px-3 py-1.5">
              <p className="text-yellow-300 text-xs font-mono font-bold">{t.heroTrail}</p>
            </div>
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-1.5">
              <p className="text-red-300 text-xs font-mono font-bold">{t.heroDot}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* Intro */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introTitle} />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {t.introP.split(t.introBold)[0]}
                <strong className="text-cyan-300">{t.introBold}</strong>
                {t.introP.split(t.introBold)[1]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-body">
                {t.cards.map(({ emoji, label, hint }, i) => (
                  <div key={label} className={`bg-${cardColors[i]}-900/30 border border-${cardColors[i]}-500/30 rounded-lg p-3 text-center`}>
                    <p className="text-2xl mb-1">{emoji}</p>
                    <p className={`text-${cardColors[i]}-300 font-bold`}>{label}</p>
                    <p className="text-white/50 mt-1">{hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.strategiTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.summaryTitle}</p>
                <p className="font-body text-sm text-white/80">
                  {t.summaryP.split(t.summaryBold)[0]}
                  <strong className="text-yellow-300">{t.summaryBold}</strong>
                  {t.summaryP.split(t.summaryBold)[1]}
                </p>
              </div>
              <JamDindingSVG t={t} />
              <div className="space-y-2">
                {t.steps.map(({ step, color, title, desc }) => (
                  <div key={step} className={`flex gap-3 bg-${color}-900/20 border border-${color}-500/20 rounded-lg p-3`}>
                    <span className={`bg-${color}-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5`}>{step}</span>
                    <div>
                      <p className="font-body text-sm font-bold text-white">{title}</p>
                      <p className="font-body text-xs text-white/60">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contoh 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title={t.c1Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c1Level}</p>
                <p className="font-body text-sm text-white/90">{t.c1Q}</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">{t.c1Sol}</p>
                <p className="font-body text-sm text-white/80"><em>{t.c1Ident}</em></p>
                <p className="font-body text-sm text-white/80"><strong>{t.c1s1}</strong> {t.c1s1T}</p>
                <BlockMath math="K = \pi \times d = \frac{22}{7} \times 56 = 176 \,\mathrm{cm}" />
                <p className="font-body text-sm text-white/80"><strong>{t.c1s2}</strong> {t.c1s2T}</p>
                <BlockMath math="= 500 \times 176 = 88{.}000 \,\mathrm{cm} = 880 \,\mathrm{m}" />
                <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-green-300 text-center">{t.c1Result}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contoh 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title={t.c2Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c2Level}</p>
                <p className="font-body text-sm text-white/90">{t.c2Q}</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">{t.c2Sol}</p>
                <p className="font-body text-sm text-white/80"><strong>{t.c2s1}</strong> {t.c2s1T}</p>
                <BlockMath math="R = \frac{28}{2} = 14 \,\mathrm{m}" />
                <p className="font-body text-sm text-white/80"><strong>{t.c2s2}</strong> {t.c2s2T}</p>
                <BlockMath math="L_1 = \pi R^2 = \frac{22}{7} \times 196 = 616 \,\mathrm{m}^2" />
                <p className="font-body text-sm text-white/80"><strong>{t.c2s3}</strong> {t.c2s3T}</p>
                <BlockMath math="L_2 = \pi r^2 = \frac{22}{7} \times 3{,}5^2 = \frac{22}{7} \times 12{,}25 = 38{,}5 \,\mathrm{m}^2" />
                <p className="font-body text-sm text-white/80"><strong>{t.c2s4}</strong> {t.c2s4T}</p>
                <BlockMath math="L_{rumput} = L_1 - L_2 = 616 - 38{,}5 = 577{,}5 \,\mathrm{m}^2" />
                <p className="font-body text-sm text-white/80"><strong>{t.c2s5}</strong> {t.c2s5T}</p>
                <BlockMath math="= 577{,}5 \times 15.000 = \mathrm{Rp}\ 8.662.500" />
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200 text-center">{t.c2Result}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contoh 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title={t.c3Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c3Level}</p>
                <p className="font-body text-sm text-white/90">{t.c3Q}</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">{t.c3Sol}</p>
                <KolongSVG t={t} />
                <p className="font-body text-sm text-white/80"><em>{t.c3Ident}</em></p>
                <p className="font-body text-sm text-white/80"><strong>{t.c3s1}</strong> {t.c3s1T}</p>
                <BlockMath math="r = \frac{d_2}{2} = \frac{8}{2} = 4 \,\mathrm{cm}" />
                <p className="font-body text-sm text-white/80"><strong>{t.c3s2}</strong> {t.c3s2T}</p>
                <BlockMath math="A = \pi r^2 = 3{,}14 \times 4^2 = 3{,}14 \times 16 = 50{,}24 \,\mathrm{cm}^2" />
                <p className="font-body text-sm text-white/80"><strong>{t.c3s3}</strong> {t.c3s3T}</p>
                <p className="font-body text-sm text-white/80"><strong>{t.c3s4}</strong> {t.c3s4T}</p>
                <BlockMath math="Q = A \times v = 50{,}24 \times 200 = 10{.}048 \,\mathrm{cm}^3/\mathrm{s}" />
                <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-red-200 text-center">{t.c3Result}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rangkuman */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.rTitle} />
            <div className="px-5 pb-5 space-y-3">
              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-sm text-white/80">• <strong className="text-green-300">{t.rB1}</strong> {t.rB1rest}</p>
                <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">{t.rB2}</strong> = <InlineMath math="\pi(R^2 - r^2)"/></p>
                <p className="font-body text-sm text-white/80">• <strong className="text-yellow-300">{t.rB3}</strong> {t.rB3rest}</p>
                <p className="font-body text-sm text-white/80">• <strong className="text-cyan-300">{t.rB4}</strong> {t.rB4rest}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">{t.tips}</p>
              </div>
              <RodaGigiSVG t={t} />
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

export default PenerapanKontekstualPage;
