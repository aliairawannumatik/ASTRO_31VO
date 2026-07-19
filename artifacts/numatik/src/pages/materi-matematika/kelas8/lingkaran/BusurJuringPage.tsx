import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, FlaskConical, Zap } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

/* ─── Translations ─────────────────────────────────────── */
const translations = {
  id: {
    h1: "PANJANG BUSUR DAN LUAS JURING",
    subtitle: "Kelas 8 · Lingkaran · Buku Animasi Matematika",
    backBtn: "← Kembali ke Lingkaran",
    // AnimasiBusur
    anim1Hint: "👆 Seret titik A dan B di sekeliling lingkaran",
    anim1RadiusLabel: "📏 Jari-jari r",
    anim1ArcLabel: "Busur AB",
    anim1FormulaTitle: "Panjang Busur AB",
    // AnimasiJuring
    anim2Hint: "👆 Seret titik A dan B di sekeliling lingkaran",
    anim2RadiusLabel: "📏 Jari-jari r",
    anim2SectorLabel: "Juring",
    anim2FormulaTitle: "Luas Juring OAB",
    // Pizza SVGs
    pizzaBusurAria: "Pizza analogi busur",
    pizzaBusurLabel: "BUSUR",
    pizzaBusurSub: "(tepi kerak)",
    pizzaBusurFocus: "Fokus: Busur 🟠",
    pizzaJuringAria: "Pizza analogi juring",
    pizzaJuringLabel: "JURING",
    pizzaJuringSub: "(potongan)",
    pizzaJuringFocus: "Fokus: Juring 🟣",
    pizzaCaption: "🍕 Pizza = lingkaran penuh (360°)  ·  Kerak berkedip = busur  ·  Potongan berkedip = juring",
    // Tembereng SVG
    tembAria: "Tembereng lingkaran",
    tembLabel: "Tembereng",
    tembFormula: "L.Tembereng = L.Juring OAB \u2212 L.\u25b3OAB",
    // SvgPerbandingan
    perbAria: "Dua sudut dalam satu lingkaran",
    perbBusurAB: "Busur AB",
    perbBusurCD: "Busur CD",
    // Section titles
    introTitle: "🍕 Analogi Pizza yang Sempurna",
    anim1Title: "⚡ Animasi 1 — Eksplorasi Panjang Busur",
    anim2Title: "⚡ Animasi 2 — Eksplorasi Luas Juring",
    rumusTitle: "📐 Rumus Panjang Busur, Luas Juring & Tembereng",
    perbTitle: "🔗 Konsep — Perbandingan Busur & Juring dalam Satu Lingkaran",
    rangkTitle: "📌 Rangkuman Sub-Bab",
    c1Title: "✏️ Contoh 1 — Panjang Busur (Mudah)",
    c2Title: "✏️ Contoh 2 — Luas Juring (Sedang)",
    c3Title: "✏️ Contoh 3 — Luas Tembereng (Sulit)",
    // Intro
    introP: "Bayangkan sebuah pizza! Jika pizza utuh = lingkaran penuh (360°), maka juring adalah satu potong pizza. Semakin besar sudutnya, semakin besar potongannya. Nah, busur adalah tepi luar potongan pizza itu — bagian lekungnya yang berkerak!",
    introPizJuring: "juring",
    introPizBusur: "busur",
    keyIdeaLabel: "💡 Ide Kunci:",
    keyIdeaText: "Perbandingan sudut juring dengan sudut penuh (360°) menentukan berapa bagian busur dan juring dari keseluruhan lingkaran.",
    // Anim instructions
    anim1Instr: "🎯 Seret titik A dan B untuk mengatur posisi di sekeliling lingkaran. Busur yang menyala 🟠 adalah busur yang menghadap sudut antara A dan B. Atur juga jari-jari dengan slider!",
    anim2Instr: "🎯 Seret titik A dan B untuk mengubah besar juring yang bercahaya 🟣. Perbesar jari-jari dengan slider untuk memperluas juring. Luas juring dihitung real-time!",
    // Formula section
    rumusSummaryTitle: "🎯 Ringkasan Intisari",
    rumusSummaryP: "Kunci utama: gunakan perbandingan sudut pusat terhadap 360° untuk mencari bagian dari keliling maupun luas lingkaran.",
    rumusSummaryBold: "perbandingan sudut pusat",
    rumusBusurTitle: "📏 Panjang Busur AB",
    rumusBusurAlpha: "α = sudut pusat yang menghadap busur AB",
    rumusJuringTitle: "🍕 Luas Juring OAB",
    rumusTembTitle: "🌙 Luas Tembereng",
    // Perbandingan section
    perbHook: "Sejauh ini kita menghitung busur atau juring satu per satu menggunakan sudut pusat terhadap 360°. Tapi ada situasi yang lebih cerdas: ketika soal memberikan",
    perbHookBold: "dua sudut sekaligus dalam satu lingkaran",
    perbHookEnd: ", kita bisa membandingkan langsung tanpa perlu mengetahui jari-jarinya!",
    perbHookEm: "satu per satu",
    perbLegendCyan: "Juring OAB (sudut α)",
    perbLegendCyanSub: "Busur AB berkilau cyan",
    perbLegendOrange: "Juring OCD (sudut β)",
    perbLegendOrangeSub: "Busur CD berkilau oranye",
    perbIdePokokLabel: "💡 Ide Pokok",
    perbIdeP1: "Dalam satu lingkaran, dua busur (atau dua juring) berbanding lurus dengan sudut pusat masing-masing. Artinya:",
    perbIdeP1Bold: "satu lingkaran",
    perbIdeP2: "Jika sudutnya dua kali lebih besar, maka busurnya pun dua kali lebih panjang, dan juringnya dua kali lebih luas — karena jari-jarinya sama!",
    perbRumusLabel: "📐 Rumus Perbandingan",
    perbGabNote: "Ketiga besaran ini selalu berbanding sama dalam satu lingkaran",
    perbGabLegend: "ℓ = panjang busur,  L = luas juring",
    perbBusurTitle: "📏 Perbandingan Sudut Pusat dengan Panjang Busur",
    perbBusurNote: "∠AOB = sudut pusat yang menghadap busur AB  ·  ∠COD = sudut pusat yang menghadap busur CD",
    perbJuringTitle: "🍕 Perbandingan Sudut Pusat dengan Luas Juring",
    perbJuringNote: "∠AOB = sudut pusat yang menghadap juring AOB  ·  ∠COD = sudut pusat yang menghadap juring COD",
    perbBusJurTitle: "🔗 Perbandingan Panjang Busur dan Luas Juring",
    perbBusJurNote: "Busur dan juring selalu memiliki rasio yang sama dalam satu lingkaran!",
    perbKapanLabel: "🎯 Kapan Menggunakan Konsep Ini?",
    perbKapanItems: [
      "Soal menyebutkan dua sudut pusat berbeda dalam satu lingkaran yang sama",
      "Diketahui salah satu busur/juring dan kedua sudutnya, lalu ditanya busur/juring yang lain",
      "Ingin membandingkan dua bagian lingkaran tanpa menghitung masing-masing dari 360°",
    ],
    perbContohLabel: "⚡ Contoh Kilat",
    perbContohQ: "Dalam satu lingkaran, sudut pusat α = 60° menghadap busur AB sepanjang 33 cm. Sudut pusat β = 45° menghadap busur CD. Berapa panjang busur CD?",
    perbContohQBold: "33 cm",
    perbContohSol: "Penyelesaian:",
    perbContohCheck: "✅ Busur CD = 24,75 cm — tanpa perlu tahu jari-jarinya!",
    perbWarning: "⚠️ Ingat: Konsep perbandingan ini hanya berlaku jika kedua busur/juring berada dalam lingkaran yang sama (jari-jari sama). Jika jari-jarinya berbeda, gunakan rumus dasar masing-masing!",
    perbWarningBold1: "Ingat:",
    perbWarningBold2: "lingkaran yang sama",
    // Contoh 1
    c1Level: "🟢 Tingkat: Mudah",
    c1Q: "Lingkaran berjari-jari 21 cm memiliki sudut pusat 120°. Hitunglah panjang busur yang sesuai! (π = 22/7)",
    c1Sol: "📋 Pembahasan",
    c1Known: "Diketahui:",
    c1PanjangBusur: "Panjang Busur",
    c1Check: "✅ Panjang busur = 44 cm.",
    // Contoh 2
    c2Level: "🟡 Tingkat: Sedang",
    c2Q: "Sebuah juring lingkaran memiliki panjang busur 33 cm dan jari-jari 63 cm. Tentukan luas juring tersebut! (π = 22/7)",
    c2Sol: "📋 Pembahasan",
    c2Step1: "Langkah 1:",
    c2Step1desc: "Cari sudut pusat dari panjang busur",
    c2Step2: "Langkah 2:",
    c2Step2desc: "Hitung luas juring",
    c2Shortcut: "Cara pintas:",
    c2ShortcutDesc: "Luas Juring = ½ × r × panjang busur",
    c2PanjangBusur: "Panjang Busur",
    c2LuasJuring: "Luas Juring",
    c2Check: "✅ Luas juring = 1.039,5 cm².",
    // Contoh 3
    c3Level: "🔴 Tingkat: Sulit",
    c3Q: "Lingkaran berpusat O memiliki jari-jari 10 cm. Juring OAB memiliki sudut pusat 60°. Hitunglah luas tembereng yang dibatasi tali busur AB dan busur AB! (π = 3,14, ",
    c3Q2: ")",
    c3Sol: "📋 Pembahasan",
    c3Step1: "Langkah 1:",
    c3Step1desc: "Luas juring OAB",
    c3Step2: "Langkah 2:",
    c3Step2desc: "Luas segitiga OAB",
    c3Step2Note: "Karena α = 60° dan OA = OB = r = 10 cm, segitiga OAB adalah segitiga sama kaki dengan sudut puncak 60°, jadi segitiga OAB adalah segitiga sama sisi!",
    c3Step3: "Langkah 3:",
    c3Step3desc: "Luas tembereng",
    c3LuasJuring: "Luas Juring",
    c3LuasTembereng: "Luas Tembereng",
    c3Check: "✅ Luas tembereng ≈ 9,03 cm².",
    // Rangkuman
    rBusur: "Panjang Busur",
    rJuring: "Luas Juring",
    rJuringOr: "atau",
    rJuringShortcut: "½ × r × panjang busur",
    rTembereng: "Luas Tembereng",
    rTemberengVal: "= Luas Juring − Luas Segitiga",
    tips: "🚀 Tips Astronot: Antena parabola dan reflektor teleskop menggunakan perhitungan busur untuk menentukan sudut fokus sinyal. Semakin tepat sudutnya, semakin jernih sinyalnya!",
  },
  en: {
    h1: "ARC LENGTH & SECTOR AREA",
    subtitle: "Grade 8 · Circle · Math Animation Book",
    backBtn: "← Back to Circle",
    anim1Hint: "👆 Drag points A and B around the circle",
    anim1RadiusLabel: "📏 Radius r",
    anim1ArcLabel: "Arc AB",
    anim1FormulaTitle: "Arc Length AB",
    anim2Hint: "👆 Drag points A and B around the circle",
    anim2RadiusLabel: "📏 Radius r",
    anim2SectorLabel: "Sector",
    anim2FormulaTitle: "Sector Area OAB",
    pizzaBusurAria: "Pizza arc analogy",
    pizzaBusurLabel: "ARC",
    pizzaBusurSub: "(curved edge)",
    pizzaBusurFocus: "Focus: Arc 🟠",
    pizzaJuringAria: "Pizza sector analogy",
    pizzaJuringLabel: "SECTOR",
    pizzaJuringSub: "(slice)",
    pizzaJuringFocus: "Focus: Sector 🟣",
    pizzaCaption: "🍕 Pizza = full circle (360°)  ·  Blinking crust = arc  ·  Blinking slice = sector",
    tembAria: "Circle segment",
    tembLabel: "Segment",
    tembFormula: "A.Segment = A.Sector OAB \u2212 A.\u25b3OAB",
    perbAria: "Two angles in one circle",
    perbBusurAB: "Arc AB",
    perbBusurCD: "Arc CD",
    introTitle: "🍕 The Perfect Pizza Analogy",
    anim1Title: "⚡ Animation 1 — Explore Arc Length",
    anim2Title: "⚡ Animation 2 — Explore Sector Area",
    rumusTitle: "📐 Arc Length, Sector & Segment Formulas",
    perbTitle: "🔗 Concept — Comparing Arcs & Sectors in One Circle",
    rangkTitle: "📌 Chapter Summary",
    c1Title: "✏️ Example 1 — Arc Length (Easy)",
    c2Title: "✏️ Example 2 — Sector Area (Medium)",
    c3Title: "✏️ Example 3 — Segment Area (Hard)",
    introP: "Imagine a pizza! If a whole pizza = a full circle (360°), then a sector is one slice of pizza. The bigger the angle, the bigger the slice. And the arc is the outer curved edge of that slice — the crust!",
    introPizJuring: "sector",
    introPizBusur: "arc",
    keyIdeaLabel: "💡 Key Idea:",
    keyIdeaText: "The ratio of the sector angle to the full angle (360°) determines what fraction of the arc and sector belongs to the whole circle.",
    anim1Instr: "🎯 Drag points A and B to set their positions around the circle. The glowing arc 🟠 faces the angle between A and B. Adjust the radius with the slider too!",
    anim2Instr: "🎯 Drag points A and B to change the size of the glowing sector 🟣. Increase the radius with the slider to expand the sector. Sector area is calculated in real-time!",
    rumusSummaryTitle: "🎯 Key Summary",
    rumusSummaryP: "Key principle: use the central angle ratio to 360° to find the fraction of the circumference or area of the circle.",
    rumusSummaryBold: "central angle ratio",
    rumusBusurTitle: "📏 Arc Length AB",
    rumusBusurAlpha: "α = central angle facing arc AB",
    rumusJuringTitle: "🍕 Sector Area OAB",
    rumusTembTitle: "🌙 Segment Area",
    perbHook: "So far we have calculated arcs or sectors one by one using the central angle against 360°. But there is a smarter situation: when a problem gives",
    perbHookBold: "two angles at once in one circle",
    perbHookEnd: ", we can compare them directly without needing to know the radius!",
    perbHookEm: "one by one",
    perbLegendCyan: "Sector OAB (angle α)",
    perbLegendCyanSub: "Arc AB glows cyan",
    perbLegendOrange: "Sector OCD (angle β)",
    perbLegendOrangeSub: "Arc CD glows orange",
    perbIdePokokLabel: "💡 Core Idea",
    perbIdeP1: "In one circle, two arcs (or two sectors) are proportional to their respective central angles. This means:",
    perbIdeP1Bold: "one circle",
    perbIdeP2: "If an angle is twice as large, the arc is twice as long, and the sector is twice as large — because the radius is the same!",
    perbRumusLabel: "📐 Comparison Formulas",
    perbGabNote: "All three quantities always have the same ratio in one circle",
    perbGabLegend: "ℓ = arc length,  L = sector area",
    perbBusurTitle: "📏 Central Angle vs Arc Length Ratio",
    perbBusurNote: "∠AOB = central angle facing arc AB  ·  ∠COD = central angle facing arc CD",
    perbJuringTitle: "🍕 Central Angle vs Sector Area Ratio",
    perbJuringNote: "∠AOB = central angle facing sector AOB  ·  ∠COD = central angle facing sector COD",
    perbBusJurTitle: "🔗 Arc Length vs Sector Area Ratio",
    perbBusJurNote: "Arcs and sectors always have the same ratio in one circle!",
    perbKapanLabel: "🎯 When to Use This Concept?",
    perbKapanItems: [
      "A problem mentions two different central angles in the same circle",
      "One arc/sector and both angles are given, and you need to find the other arc/sector",
      "You want to compare two parts of a circle without calculating each from 360°",
    ],
    perbContohLabel: "⚡ Quick Example",
    perbContohQ: "In one circle, central angle α = 60° faces arc AB with length 33 cm. Central angle β = 45° faces arc CD. What is the length of arc CD?",
    perbContohQBold: "33 cm",
    perbContohSol: "Solution:",
    perbContohCheck: "✅ Arc CD = 24.75 cm — without needing to know the radius!",
    perbWarning: "⚠️ Remember: This ratio concept only applies if both arcs/sectors are in the same circle (same radius). If the radii differ, use the basic formula for each!",
    perbWarningBold1: "Remember:",
    perbWarningBold2: "the same circle",
    c1Level: "🟢 Level: Easy",
    c1Q: "A circle has radius 21 cm and a central angle of 120°. Calculate the corresponding arc length! (π = 22/7)",
    c1Sol: "📋 Solution",
    c1Known: "Given:",
    c1PanjangBusur: "Arc Length",
    c1Check: "✅ Arc length = 44 cm.",
    c2Level: "🟡 Level: Medium",
    c2Q: "A circular sector has an arc length of 33 cm and radius 63 cm. Find the sector area! (π = 22/7)",
    c2Sol: "📋 Solution",
    c2Step1: "Step 1:",
    c2Step1desc: "Find the central angle from the arc length",
    c2Step2: "Step 2:",
    c2Step2desc: "Calculate the sector area",
    c2Shortcut: "Shortcut:",
    c2ShortcutDesc: "Sector Area = ½ × r × arc length",
    c2PanjangBusur: "Arc Length",
    c2LuasJuring: "Sector Area",
    c2Check: "✅ Sector area = 1,039.5 cm².",
    c3Level: "🔴 Level: Hard",
    c3Q: "Circle O has radius 10 cm. Sector OAB has a central angle of 60°. Calculate the area of the segment bounded by chord AB and arc AB! (π = 3.14, ",
    c3Q2: ")",
    c3Sol: "📋 Solution",
    c3Step1: "Step 1:",
    c3Step1desc: "Sector area OAB",
    c3Step2: "Step 2:",
    c3Step2desc: "Triangle OAB area",
    c3Step2Note: "Since α = 60° and OA = OB = r = 10 cm, triangle OAB is isosceles with an apex angle of 60°, so triangle OAB is equilateral!",
    c3Step3: "Step 3:",
    c3Step3desc: "Segment area",
    c3LuasJuring: "Sector Area",
    c3LuasTembereng: "Segment Area",
    c3Check: "✅ Segment area ≈ 9.03 cm².",
    rBusur: "Arc Length",
    rJuring: "Sector Area",
    rJuringOr: "or",
    rJuringShortcut: "½ × r × arc length",
    rTembereng: "Segment Area",
    rTemberengVal: "= Sector Area − Triangle Area",
    tips: "🚀 Astronaut Tip: Parabolic antennas and telescope reflectors use arc calculations to determine the focal angle of signals. The more precise the angle, the clearer the signal!",
  },
  ja: {
    h1: "弧の長さと扇形の面積",
    subtitle: "中学2年 · 円 · 数学アニメーション",
    backBtn: "← 円に戻る",
    anim1Hint: "👆 点AとBを円の周りにドラッグしてください",
    anim1RadiusLabel: "📏 半径 r",
    anim1ArcLabel: "弧AB",
    anim1FormulaTitle: "弧ABの長さ",
    anim2Hint: "👆 点AとBを円の周りにドラッグしてください",
    anim2RadiusLabel: "📏 半径 r",
    anim2SectorLabel: "扇形",
    anim2FormulaTitle: "扇形OABの面積",
    pizzaBusurAria: "ピザの弧のアナロジー",
    pizzaBusurLabel: "弧",
    pizzaBusurSub: "（弧の部分）",
    pizzaBusurFocus: "注目：弧 🟠",
    pizzaJuringAria: "ピザの扇形のアナロジー",
    pizzaJuringLabel: "扇形",
    pizzaJuringSub: "（スライス）",
    pizzaJuringFocus: "注目：扇形 🟣",
    pizzaCaption: "🍕 ピザ = 完全な円（360°）  ·  点滅するクラスト = 弧  ·  点滅するスライス = 扇形",
    tembAria: "円の弓形",
    tembLabel: "弓形",
    tembFormula: "弓形面積 = 扇形OAB \u2212 \u25b3OABの面積",
    perbAria: "一つの円の中の2つの角度",
    perbBusurAB: "弧AB",
    perbBusurCD: "弧CD",
    introTitle: "🍕 完璧なピザのアナロジー",
    anim1Title: "⚡ アニメーション1 — 弧の長さを探索",
    anim2Title: "⚡ アニメーション2 — 扇形の面積を探索",
    rumusTitle: "📐 弧の長さ・扇形・弓形の公式",
    perbTitle: "🔗 概念 — 一つの円での弧と扇形の比較",
    rangkTitle: "📌 まとめ",
    c1Title: "✏️ 例題1 — 弧の長さ（基本）",
    c2Title: "✏️ 例題2 — 扇形の面積（標準）",
    c3Title: "✏️ 例題3 — 弓形の面積（発展）",
    introP: "ピザを想像してください！ピザ丸ごと = 完全な円（360°）とすると、扇形はピザの一切れです。角度が大きいほど、切れ目も大きくなります。そして、弧はその切れ目の外側の曲線部分 — クラスト（耳）の部分です！",
    introPizJuring: "扇形",
    introPizBusur: "弧",
    keyIdeaLabel: "💡 重要ポイント：",
    keyIdeaText: "扇形の角度と完全な角度（360°）の比が、弧や扇形が円全体の何割にあたるかを決定します。",
    anim1Instr: "🎯 点AとBをドラッグして円周上の位置を調整してください。光る弧🟠はAとBの間の角度に対応する弧です。スライダーで半径も変えられます！",
    anim2Instr: "🎯 点AとBをドラッグして光る扇形🟣の大きさを変えてください。スライダーで半径を大きくすると扇形が広がります。扇形の面積はリアルタイムで計算されます！",
    rumusSummaryTitle: "🎯 重要まとめ",
    rumusSummaryP: "核心：360°に対する中心角の比を使って、円周や面積の何割かを求めます。",
    rumusSummaryBold: "中心角の比",
    rumusBusurTitle: "📏 弧ABの長さ",
    rumusBusurAlpha: "α = 弧ABに対する中心角",
    rumusJuringTitle: "🍕 扇形OABの面積",
    rumusTembTitle: "🌙 弓形の面積",
    perbHook: "これまで弧や扇形を、360°に対する中心角の比を使って一つずつ計算してきました。しかし、もっとスマートな状況があります：問題が",
    perbHookBold: "一つの円に二つの角度を同時に与えている",
    perbHookEnd: "場合、半径を知らなくても直接比較できます！",
    perbHookEm: "一つずつ",
    perbLegendCyan: "扇形OAB（角α）",
    perbLegendCyanSub: "弧ABはシアンに輝く",
    perbLegendOrange: "扇形OCD（角β）",
    perbLegendOrangeSub: "弧CDはオレンジに輝く",
    perbIdePokokLabel: "💡 核心",
    perbIdeP1: "一つの円において、二つの弧（または二つの扇形）はそれぞれの中心角に比例します。つまり：",
    perbIdeP1Bold: "一つの円",
    perbIdeP2: "角度が2倍になれば、弧も2倍の長さになり、扇形も2倍の面積になります — 半径が同じだからです！",
    perbRumusLabel: "📐 比較の公式",
    perbGabNote: "この3つの量は常に一つの円の中で同じ比率を持ちます",
    perbGabLegend: "ℓ = 弧の長さ、L = 扇形の面積",
    perbBusurTitle: "📏 中心角と弧の長さの比",
    perbBusurNote: "∠AOB = 弧ABに対する中心角  ·  ∠COD = 弧CDに対する中心角",
    perbJuringTitle: "🍕 中心角と扇形の面積の比",
    perbJuringNote: "∠AOB = 扇形AOBに対する中心角  ·  ∠COD = 扇形CODに対する中心角",
    perbBusJurTitle: "🔗 弧の長さと扇形の面積の比",
    perbBusJurNote: "弧と扇形は常に一つの円の中で同じ比率を持ちます！",
    perbKapanLabel: "🎯 いつ使う？",
    perbKapanItems: [
      "問題が同じ円の中に二つの異なる中心角を述べている場合",
      "一方の弧/扇形と両方の角度がわかり、もう一方の弧/扇形を求める場合",
      "それぞれを360°から計算せずに二つの円の部分を比較したい場合",
    ],
    perbContohLabel: "⚡ 例題",
    perbContohQ: "一つの円において、中心角α = 60°が長さ33 cmの弧ABに対応しています。中心角β = 45°が弧CDに対応しています。弧CDの長さを求めなさい。",
    perbContohQBold: "33 cm",
    perbContohSol: "解説：",
    perbContohCheck: "✅ 弧CD = 24.75 cm — 半径を知らなくても求められる！",
    perbWarning: "⚠️ 注意：この比の概念は、両方の弧/扇形が同じ円（同じ半径）にある場合のみ有効です。半径が異なる場合は、それぞれの基本公式を使用してください！",
    perbWarningBold1: "注意：",
    perbWarningBold2: "同じ円",
    c1Level: "🟢 レベル：基本",
    c1Q: "半径21 cmの円に中心角120°があります。対応する弧の長さを求めなさい！（π = 22/7）",
    c1Sol: "📋 解説",
    c1Known: "わかっていること：",
    c1PanjangBusur: "弧の長さ",
    c1Check: "✅ 弧の長さ = 44 cm。",
    c2Level: "🟡 レベル：標準",
    c2Q: "ある扇形の弧の長さが33 cm、半径が63 cmです。扇形の面積を求めなさい！（π = 22/7）",
    c2Sol: "📋 解説",
    c2Step1: "ステップ1：",
    c2Step1desc: "弧の長さから中心角を求める",
    c2Step2: "ステップ2：",
    c2Step2desc: "扇形の面積を計算する",
    c2Shortcut: "近道：",
    c2ShortcutDesc: "扇形の面積 = ½ × r × 弧の長さ",
    c2PanjangBusur: "弧の長さ",
    c2LuasJuring: "扇形の面積",
    c2Check: "✅ 扇形の面積 = 1,039.5 cm²。",
    c3Level: "🔴 レベル：発展",
    c3Q: "円Oの半径は10 cmです。扇形OABの中心角は60°です。弦ABと弧ABで囲まれた弓形の面積を求めなさい！（π = 3.14、",
    c3Q2: "）",
    c3Sol: "📋 解説",
    c3Step1: "ステップ1：",
    c3Step1desc: "扇形OABの面積",
    c3Step2: "ステップ2：",
    c3Step2desc: "三角形OABの面積",
    c3Step2Note: "α = 60°でOA = OB = r = 10 cmより、三角形OABは頂角60°の二等辺三角形 → 正三角形です！",
    c3Step3: "ステップ3：",
    c3Step3desc: "弓形の面積",
    c3LuasJuring: "扇形の面積",
    c3LuasTembereng: "弓形の面積",
    c3Check: "✅ 弓形の面積 ≈ 9.03 cm²。",
    rBusur: "弧の長さ",
    rJuring: "扇形の面積",
    rJuringOr: "または",
    rJuringShortcut: "½ × r × 弧の長さ",
    rTembereng: "弓形の面積",
    rTemberengVal: "= 扇形の面積 − 三角形の面積",
    tips: "🚀 宇宙人のヒント：パラボラアンテナや望遠鏡のリフレクターは、信号の焦点角を決定するために弧の計算を使用します。角度が正確であるほど、信号がクリアになります！",
  },
} as const;
type T = typeof translations.id;

/* ═══════════════════════════════════════════════════════════════════
   Shared drag hook — returns angle (0-360°) of pointer on the circle
═══════════════════════════════════════════════════════════════════ */
const VB = 320;
const CX = 160, CY = 160;

function useDragOnCircle(
  svgRef: React.RefObject<SVGSVGElement>,
  onDrag: (who: 'A' | 'B', angle: number) => void
) {
  const dragging = useRef<'A' | 'B' | null>(null);

  const getAngle = useCallback((clientX: number, clientY: number): number => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * VB;
    const svgY = ((clientY - rect.top) / rect.height) * VB;
    const raw = Math.atan2(-(svgY - CY), svgX - CX) * (180 / Math.PI);
    return Math.round(((raw % 360) + 360) % 360);
  }, [svgRef]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      if (e.cancelable) e.preventDefault();
      const pt = 'touches' in e ? e.touches[0] : (e as MouseEvent);
      onDrag(dragging.current, getAngle(pt.clientX, pt.clientY));
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [getAngle, onDrag]);

  return dragging;
}

/* ═══════════════════════════════════════════════════════════════════
   Shared SVG helpers
═══════════════════════════════════════════════════════════════════ */
const toRad = (d: number) => d * Math.PI / 180;
const ptOnCircle = (r: number, deg: number) => ({
  x: CX + r * Math.cos(toRad(deg)),
  y: CY - r * Math.sin(toRad(deg)),
});

/* ═══════════════════════════════════════════════════════════════════
   ANIMASI 1 — Panjang Busur (drag A & B)
═══════════════════════════════════════════════════════════════════ */
const AnimasiBusur = ({ t }: { t: T }) => {
  const { isDark } = useTheme();
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(120);
  const [radius, setRadius] = useState(7);
  const svgRef = useRef<SVGSVGElement>(null);

  const SCALE = 8;
  const rPx = radius * SCALE;

  const A = ptOnCircle(rPx, angleA);
  const B = ptOnCircle(rPx, angleB);

  const arcSpan = ((angleB - angleA) + 360) % 360;
  const largeArc = arcSpan > 180 ? 1 : 0;
  const remLargeArc = largeArc === 1 ? 0 : 1;

  const midAng = angleA + arcSpan / 2;
  const arcLabelDist = rPx + (arcSpan < 40 ? 34 : 22);
  const arcLabel = ptOnCircle(arcLabelDist, midAng);

  const IND_R = Math.min(26, rPx * 0.3);
  const indA = ptOnCircle(IND_R, angleA);
  const indB = ptOnCircle(IND_R, angleB);
  const alphaLabel = ptOnCircle(IND_R + 18, midAng);

  const rLabelX = (CX + A.x) / 2;
  const rLabelY = (CY + A.y) / 2 - 9;

  const LAB_OFF = 17;
  const aLabel = ptOnCircle(rPx + LAB_OFF, angleA);
  const bLabel = ptOnCircle(rPx + LAB_OFF, angleB);

  const piVal = radius % 7 === 0 ? 22 / 7 : 3.14;
  const fmtNum = (n: number) => {
    if (Math.abs(n - Math.round(n)) < 0.005) return Math.round(n).toString();
    const d1 = Math.round(n * 10) / 10;
    if (Math.abs(n - d1) < 0.005) return d1.toFixed(1);
    return n.toFixed(2);
  };
  const arcLen = arcSpan > 0 ? fmtNum((arcSpan / 360) * 2 * piVal * radius) : "0";

  const handleDrag = useCallback((who: 'A' | 'B', angle: number) => {
    if (who === 'A') setAngleA(angle);
    else setAngleB(angle);
  }, []);

  const dragging = useDragOnCircle(svgRef, handleDrag);

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-amber-300/70 font-body">
        {t.anim1Hint}
      </p>

      <svg ref={svgRef} viewBox="0 0 320 320"
        className="w-full max-w-xs mx-auto touch-none select-none">
        <defs>
          <style>{`
            @keyframes bPulse{0%,100%{stroke-width:6;filter:drop-shadow(0 0 8px #f59e0b);}
              50%{stroke-width:9;filter:drop-shadow(0 0 18px #f59e0b);}}
            .b-glow{animation:bPulse 1.5s ease-in-out infinite;}
            @keyframes ptBounce{0%,100%{r:8;}50%{r:10;}}
            .pt-a{animation:ptBounce 1.5s ease-in-out infinite;}
          `}</style>
        </defs>

        <circle cx={CX} cy={CY} r={rPx}
          fill="rgba(6,182,212,0.06)" stroke="#164e63" strokeWidth="1.5"/>

        {arcSpan > 0 && arcSpan < 360 && (
          <path d={`M ${A.x} ${A.y} A ${rPx} ${rPx} 0 ${remLargeArc} 1 ${B.x} ${B.y}`}
            fill="none" stroke="#0c2240" strokeWidth="3" opacity="0.6"/>
        )}

        {arcSpan > 0 && (
          <path d={`M ${A.x} ${A.y} A ${rPx} ${rPx} 0 ${largeArc} 0 ${B.x} ${B.y}`}
            fill="none" stroke="#f59e0b" strokeLinecap="round" className="b-glow"/>
        )}

        <line x1={CX} y1={CY} x2={A.x} y2={A.y}
          stroke="#4ade80" strokeWidth="1.8" strokeDasharray="5 3"/>
        <line x1={CX} y1={CY} x2={B.x} y2={B.y}
          stroke="#4ade80" strokeWidth="1.8" strokeDasharray="5 3"/>

        <text x={rLabelX} y={rLabelY}
          fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          r={radius}cm
        </text>

        {arcSpan > 0 && arcSpan < 360 && IND_R > 4 && (
          <path d={`M ${indA.x} ${indA.y} A ${IND_R} ${IND_R} 0 ${largeArc} 0 ${indB.x} ${indB.y}`}
            fill="none" stroke="#fbbf24" strokeWidth="1.6"/>
        )}

        {arcSpan > 0 && (
          <text x={alphaLabel.x} y={alphaLabel.y + 4}
            fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {arcSpan}°
          </text>
        )}

        {arcSpan > 0 && (
          <>
            <text x={arcLabel.x} y={arcLabel.y - 7}
              fill="#fef08a" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {t.anim1ArcLabel}
            </text>
            <text x={arcLabel.x} y={arcLabel.y + 7}
              fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">
              ≈{arcLen} cm
            </text>
          </>
        )}

        <circle cx={CX} cy={CY} r="4" fill="#06b6d4"/>
        <text x={CX + 7} y={CY - 5}
          fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>

        <circle cx={A.x} cy={A.y} r="9" fill="#f59e0b" stroke="#fef08a" strokeWidth="2"
          style={{ cursor: 'grab' }} className="pt-a"
          onMouseDown={e => { e.preventDefault(); dragging.current = 'A'; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = 'A'; }}/>
        <text x={aLabel.x} y={aLabel.y}
          fill="#fef08a" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>
        <text x={aLabel.x} y={aLabel.y + 13}
          fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle">{angleA}°</text>

        <circle cx={B.x} cy={B.y} r="9" fill="#f59e0b" stroke="#fef08a" strokeWidth="2"
          style={{ cursor: 'grab' }} className="pt-a"
          onMouseDown={e => { e.preventDefault(); dragging.current = 'B'; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = 'B'; }}/>
        <text x={bLabel.x} y={bLabel.y}
          fill="#fef08a" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
        <text x={bLabel.x} y={bLabel.y + 13}
          fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle">{angleB}°</text>
      </svg>

      <div className="px-1">
        <div className={`flex justify-between text-xs font-body ${isDark ? "text-white/70" : "text-gray-600"} mb-1`}>
          <span>{t.anim1RadiusLabel}</span>
          <span className="text-green-300 font-bold">{radius} cm</span>
        </div>
        <input type="range" min="1" max="14" step="1" value={radius}
          onChange={e => { setRadius(Number(e.target.value)); playPopSound(); }}
          className="w-full accent-green-400 cursor-pointer h-2"/>
        <div className={`flex justify-between text-[10px] ${isDark ? "text-white/30" : "text-gray-400"} font-mono mt-0.5`}>
          <span>1</span><span>14</span>
        </div>
      </div>

      <div className="rounded-xl p-3 border"
        style={{ background: "rgba(251,191,36,.1)", borderColor: "rgba(251,191,36,.35)" }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <p className={`text-xs ${isDark ? "text-white/55" : "text-gray-500"} font-body`}>{t.anim1FormulaTitle}</p>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
            style={{ background: radius % 7 === 0 ? "rgba(74,222,128,.15)" : "rgba(148,163,184,.12)",
                     color: radius % 7 === 0 ? "#4ade80" : "#94a3b8" }}>
            π
          </span>
        </div>
        <p className="text-amber-300 text-xs font-mono text-center">
          = ({arcSpan}/360) × 2 × π × {radius}
        </p>
        <p className={`${isDark ? "text-white" : "text-gray-900"} font-bold text-xl text-center mt-1`}>{arcLen} cm</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ANIMASI 2 — Luas Juring (drag A & B)
═══════════════════════════════════════════════════════════════════ */
const AnimasiJuring = ({ t }: { t: T }) => {
  const { isDark } = useTheme();
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(120);
  const [radius, setRadius] = useState(7);
  const svgRef = useRef<SVGSVGElement>(null);

  const SCALE = 8;
  const rPx = radius * SCALE;

  const A = ptOnCircle(rPx, angleA);
  const B = ptOnCircle(rPx, angleB);

  const arcSpan = ((angleB - angleA) + 360) % 360;
  const largeArc = arcSpan > 180 ? 1 : 0;
  const remLargeArc = largeArc === 1 ? 0 : 1;

  const midAng = angleA + arcSpan / 2;

  const inside = arcSpan >= 30;
  const labelR = inside ? rPx * 0.52 : rPx + 24;
  const secLabel = ptOnCircle(labelR, midAng);

  const IND_R = Math.min(26, rPx * 0.3);
  const indA = ptOnCircle(IND_R, angleA);
  const indB = ptOnCircle(IND_R, angleB);
  const alphaLabel = ptOnCircle(IND_R + 18, midAng);

  const rLabelX = (CX + A.x) / 2;
  const rLabelY = (CY + A.y) / 2 - 9;

  const LAB_OFF = 17;
  const aLabel = ptOnCircle(rPx + LAB_OFF, angleA);
  const bLabel = ptOnCircle(rPx + LAB_OFF, angleB);

  const piVal = radius % 7 === 0 ? 22 / 7 : 3.14;
  const fmtNum = (n: number) => {
    if (Math.abs(n - Math.round(n)) < 0.005) return Math.round(n).toString();
    const d1 = Math.round(n * 10) / 10;
    if (Math.abs(n - d1) < 0.005) return d1.toFixed(1);
    return n.toFixed(2);
  };
  const sectorArea = arcSpan > 0 ? fmtNum((arcSpan / 360) * piVal * radius * radius) : "0";

  const handleDrag = useCallback((who: 'A' | 'B', angle: number) => {
    if (who === 'A') setAngleA(angle);
    else setAngleB(angle);
  }, []);

  const dragging = useDragOnCircle(svgRef, handleDrag);

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-purple-300/70 font-body">
        {t.anim2Hint}
      </p>

      <svg ref={svgRef} viewBox="0 0 320 320"
        className="w-full max-w-xs mx-auto touch-none select-none">
        <defs>
          <style>{`
            @keyframes jFill{0%,100%{opacity:.52;filter:drop-shadow(0 0 8px #a855f7);}
              50%{opacity:.80;filter:drop-shadow(0 0 20px #a855f7);}}
            @keyframes jStroke{0%,100%{stroke:#a855f7;}50%{stroke:#d8b4fe;filter:drop-shadow(0 0 7px #c084fc);}}
            .j-fill{animation:jFill 1.5s ease-in-out infinite;}
            .j-stroke{animation:jStroke 1.5s ease-in-out infinite;}
            @keyframes ptB2{0%,100%{r:8;}50%{r:10;}}
            .pt-b{animation:ptB2 1.5s ease-in-out infinite;}
          `}</style>
        </defs>

        <circle cx={CX} cy={CY} r={rPx}
          fill="rgba(6,182,212,0.04)" stroke="#164e63" strokeWidth="1.5" opacity="0.5"/>

        {arcSpan > 0 && arcSpan < 360 && (
          <path d={`M ${A.x} ${A.y} A ${rPx} ${rPx} 0 ${remLargeArc} 1 ${B.x} ${B.y}`}
            fill="none" stroke="#1e293b" strokeWidth="1.5" opacity="0.5"/>
        )}

        {arcSpan > 0 && (
          <path
            d={`M ${CX} ${CY} L ${A.x} ${A.y} A ${rPx} ${rPx} 0 ${largeArc} 0 ${B.x} ${B.y} Z`}
            fill="rgba(168,85,247,0.55)" stroke="none" className="j-fill"/>
        )}

        {arcSpan > 0 && (
          <path
            d={`M ${CX} ${CY} L ${A.x} ${A.y} A ${rPx} ${rPx} 0 ${largeArc} 0 ${B.x} ${B.y} Z`}
            fill="none" strokeWidth="2.5" className="j-stroke"/>
        )}

        <line x1={CX} y1={CY} x2={A.x} y2={A.y}
          stroke="#c4b5fd" strokeWidth="1.8" strokeDasharray="5 3"/>
        <line x1={CX} y1={CY} x2={B.x} y2={B.y}
          stroke="#c4b5fd" strokeWidth="1.8" strokeDasharray="5 3"/>

        <text x={rLabelX} y={rLabelY}
          fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          r={radius}cm
        </text>

        {arcSpan > 0 && arcSpan < 360 && IND_R > 4 && (
          <path d={`M ${indA.x} ${indA.y} A ${IND_R} ${IND_R} 0 ${largeArc} 0 ${indB.x} ${indB.y}`}
            fill="none" stroke="#fbbf24" strokeWidth="1.6"/>
        )}

        {arcSpan > 0 && (
          <text x={alphaLabel.x} y={alphaLabel.y + 4}
            fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {arcSpan}°
          </text>
        )}

        {arcSpan > 0 && (
          <>
            <text x={secLabel.x} y={secLabel.y - 7}
              fill="#e9d5ff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {t.anim2SectorLabel}
            </text>
            <text x={secLabel.x} y={secLabel.y + 7}
              fill="#d8b4fe" fontSize="10" fontFamily="monospace" textAnchor="middle">
              {sectorArea} cm²
            </text>
          </>
        )}

        <circle cx={CX} cy={CY} r="4" fill="#06b6d4"/>
        <text x={CX + 7} y={CY - 5}
          fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>

        <circle cx={A.x} cy={A.y} r="9" fill="#c084fc" stroke="#e9d5ff" strokeWidth="2"
          style={{ cursor: 'grab' }} className="pt-b"
          onMouseDown={e => { e.preventDefault(); dragging.current = 'A'; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = 'A'; }}/>
        <text x={aLabel.x} y={aLabel.y}
          fill="#e9d5ff" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>
        <text x={aLabel.x} y={aLabel.y + 13}
          fill="#c084fc" fontSize="9" fontFamily="monospace" textAnchor="middle">{angleA}°</text>

        <circle cx={B.x} cy={B.y} r="9" fill="#c084fc" stroke="#e9d5ff" strokeWidth="2"
          style={{ cursor: 'grab' }} className="pt-b"
          onMouseDown={e => { e.preventDefault(); dragging.current = 'B'; }}
          onTouchStart={e => { e.preventDefault(); dragging.current = 'B'; }}/>
        <text x={bLabel.x} y={bLabel.y}
          fill="#e9d5ff" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
        <text x={bLabel.x} y={bLabel.y + 13}
          fill="#c084fc" fontSize="9" fontFamily="monospace" textAnchor="middle">{angleB}°</text>
      </svg>

      <div className="px-1">
        <div className={`flex justify-between text-xs font-body ${isDark ? "text-white/70" : "text-gray-600"} mb-1`}>
          <span>{t.anim2RadiusLabel}</span>
          <span className="text-violet-300 font-bold">{radius} cm</span>
        </div>
        <input type="range" min="1" max="14" step="1" value={radius}
          onChange={e => { setRadius(Number(e.target.value)); playPopSound(); }}
          className="w-full accent-violet-400 cursor-pointer h-2"/>
        <div className={`flex justify-between text-[10px] ${isDark ? "text-white/30" : "text-gray-400"} font-mono mt-0.5`}>
          <span>1</span><span>14</span>
        </div>
      </div>

      <div className="rounded-xl p-3 border"
        style={{ background: "rgba(168,85,247,.1)", borderColor: "rgba(168,85,247,.35)" }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <p className={`text-xs ${isDark ? "text-white/55" : "text-gray-500"} font-body`}>{t.anim2FormulaTitle}</p>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
            style={{ background: radius % 7 === 0 ? "rgba(74,222,128,.15)" : "rgba(148,163,184,.12)",
                     color: radius % 7 === 0 ? "#4ade80" : "#94a3b8" }}>
            π
          </span>
        </div>
        <p className="text-purple-300 text-xs font-mono text-center">
          = ({arcSpan}/360) × π × {radius}²
        </p>
        <p className={`${isDark ? "text-white" : "text-gray-900"} font-bold text-xl text-center mt-1`}>{sectorArea} cm²</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Static SVGs — two pizza analogies side by side
═══════════════════════════════════════════════════════════════════ */
const PizzaBusurSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 220 230" className="w-full" aria-label={t.pizzaBusurAria}>
    <defs>
      <style>{`
        @keyframes busurBlink{0%,100%{stroke-width:6;filter:drop-shadow(0 0 10px #f59e0b);opacity:1;}
          50%{stroke-width:3;filter:none;opacity:0.3;}}
        .pb-arc{animation:busurBlink 1.2s ease-in-out infinite;}
        @keyframes crustFill{0%,100%{opacity:0.18;}50%{opacity:0.55;}}
        .pb-slice{animation:crustFill 1.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="110" cy="110" r="85" fill="rgba(120,53,15,0.55)" stroke="#92400e" strokeWidth="1.5"/>
    <circle cx="110" cy="110" r="65" fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="1"/>
    <circle cx="110" cy="110" r="40" fill="none" stroke="rgba(251,191,36,0.10)" strokeWidth="1"/>
    <path d="M110,110 L195,110 A85,85 0 0,0 110,25 Z"
      fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.2)" strokeWidth="1"/>
    <path d="M195,110 A85,85 0 0,0 110,25"
      fill="none" stroke="#f59e0b" strokeLinecap="round" className="pb-arc"/>
    <line x1="110" y1="110" x2="195" y2="110" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
    <line x1="110" y1="110" x2="110" y2="25" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
    <circle cx="110" cy="110" r="4" fill="#06b6d4"/>
    <text x="117" y="106" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="155" y="62" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">{t.pizzaBusurLabel}</text>
    <text x="152" y="75" fill="#fef08a" fontSize="9" fontFamily="monospace">{t.pizzaBusurSub}</text>
    <line x1="153" y1="61" x2="170" y2="72" stroke="#f59e0b" strokeWidth="1.5"/>
    <text x="110" y="215" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{t.pizzaBusurFocus}</text>
  </svg>
);

const PizzaJuringSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 220 230" className="w-full" aria-label={t.pizzaJuringAria}>
    <defs>
      <style>{`
        @keyframes juringBlink{0%,100%{opacity:0.7;filter:drop-shadow(0 0 12px #a855f7);}
          50%{opacity:0.2;filter:none;}}
        .pj-slice{animation:juringBlink 1.2s ease-in-out infinite;}
        @keyframes juringStroke{0%,100%{stroke:#a855f7;filter:drop-shadow(0 0 8px #c084fc);}
          50%{stroke:#581c87;filter:none;}}
        .pj-outline{animation:juringStroke 1.2s ease-in-out infinite;}
      `}</style>
    </defs>
    <circle cx="110" cy="110" r="85" fill="rgba(120,53,15,0.55)" stroke="#92400e" strokeWidth="1.5"/>
    <circle cx="110" cy="110" r="65" fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="1"/>
    <circle cx="110" cy="110" r="40" fill="none" stroke="rgba(251,191,36,0.10)" strokeWidth="1"/>
    <path d="M110,110 L195,110 A85,85 0 0,0 110,25 Z"
      fill="rgba(168,85,247,0.65)" className="pj-slice"/>
    <path d="M110,110 L195,110 A85,85 0 0,0 110,25 Z"
      fill="none" strokeWidth="2.5" className="pj-outline"/>
    <line x1="110" y1="110" x2="195" y2="110" stroke="#c4b5fd" strokeWidth="1.8" strokeDasharray="5 3"/>
    <line x1="110" y1="110" x2="110" y2="25" stroke="#c4b5fd" strokeWidth="1.8" strokeDasharray="5 3"/>
    <text x="155" y="106" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="104" y="70" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>
    <circle cx="110" cy="110" r="4" fill="#06b6d4"/>
    <text x="117" y="106" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="148" y="88" fill="#f3e8ff" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{t.pizzaJuringLabel}</text>
    <text x="148" y="100" fill="#e9d5ff" fontSize="9" fontFamily="monospace" textAnchor="middle">{t.pizzaJuringSub}</text>
    <text x="110" y="215" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{t.pizzaJuringFocus}</text>
  </svg>
);

const PizzaAnalogiDua = ({ t }: { t: T }) => {
  const { isDark } = useTheme();
  return (
  <div className="space-y-2">
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2">
        <PizzaBusurSVG t={t} />
      </div>
      <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-2">
        <PizzaJuringSVG t={t} />
      </div>
    </div>
    <p className={`text-center text-[10px] ${isDark ? "text-white/40" : "text-gray-400"} font-mono`}>
      {t.pizzaCaption}
    </p>
  </div>
  );
};

const TemberengLengkapSVG = ({ t }: { t: T }) => (
  <svg viewBox="0 0 280 225" className="w-full max-w-xs mx-auto my-2" aria-label={t.tembAria}>
    <defs>
      <style>{`@keyframes tFill4{0%{opacity:0;}100%{opacity:1;}}.tf4{animation:tFill4 1.5s ease-in forwards;}`}</style>
    </defs>
    <circle cx="140" cy="125" r="80" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <path d="M76,77 A80,80 0 0 1 204,77 Z"
      fill="rgba(251,146,60,0.60)" stroke="none" className="tf4"/>
    <path d="M76,77 A80,80 0 0 1 204,77"
      fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round"/>
    <line x1="76" y1="77" x2="204" y2="77" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3"/>
    <line x1="140" y1="125" x2="76" y2="77" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 2"/>
    <line x1="140" y1="125" x2="204" y2="77" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 2"/>
    <circle cx="140" cy="125" r="4" fill="#06b6d4"/>
    <text x="147" y="121" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <circle cx="76" cy="77" r="4" fill="#fb923c"/>
    <text x="58" y="74" fill="#fed7aa" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <circle cx="204" cy="77" r="4" fill="#fb923c"/>
    <text x="210" y="74" fill="#fed7aa" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="140" y="63" fill="#fed7aa" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{t.tembLabel}</text>
    <text x="140" y="215" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">{t.tembFormula}</text>
  </svg>
);

const SvgPerbandingan = ({ t }: { t: T }) => (
  <svg viewBox="0 0 300 265" className="w-full max-w-xs mx-auto my-1" aria-label={t.perbAria}>
    <defs>
      <style>{`
        @keyframes secA{0%,100%{opacity:.55;filter:drop-shadow(0 0 8px #06b6d4);}50%{opacity:.80;filter:drop-shadow(0 0 18px #06b6d4);}}
        @keyframes secB{0%,100%{opacity:.55;filter:drop-shadow(0 0 8px #f97316);}50%{opacity:.80;filter:drop-shadow(0 0 18px #f97316);}}
        @keyframes arcA{0%,100%{stroke:#22d3ee;stroke-width:4;}50%{stroke:#67e8f9;stroke-width:6;filter:drop-shadow(0 0 8px #67e8f9);}}
        @keyframes arcB{0%,100%{stroke:#fb923c;stroke-width:4;}50%{stroke:#fdba74;stroke-width:6;filter:drop-shadow(0 0 8px #fdba74);}}
        .sa{animation:secA 2s ease-in-out infinite;}
        .sb{animation:secB 2s ease-in-out infinite; animation-delay:.9s;}
        .aa{animation:arcA 2s ease-in-out infinite;}
        .ab{animation:arcB 2s ease-in-out infinite; animation-delay:.9s;}
      `}</style>
    </defs>
    <circle cx="150" cy="135" r="100" fill="rgba(6,182,212,0.06)" stroke="#1e3a5f" strokeWidth="1.5"/>
    <path d="M150,135 L250,135 A100,100 0 0 0 100,48 Z"
      fill="rgba(6,182,212,0.35)" stroke="none" className="sa"/>
    <path d="M150,135 L56,169 A100,100 0 0 0 184,229 Z"
      fill="rgba(249,115,22,0.35)" stroke="none" className="sb"/>
    <path d="M100,48 A100,100 0 0 0 56,169" fill="none" stroke="#1e3a5f" strokeWidth="2"/>
    <path d="M184,229 A100,100 0 1 0 250,135" fill="none" stroke="#1e3a5f" strokeWidth="2"/>
    <path d="M250,135 A100,100 0 0 0 100,48" fill="none" className="aa"/>
    <path d="M56,169 A100,100 0 0 0 184,229" fill="none" className="ab"/>
    <line x1="150" y1="135" x2="250" y2="135" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="5 3"/>
    <line x1="150" y1="135" x2="100" y2="48"  stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="5 3"/>
    <line x1="150" y1="135" x2="56"  y2="169" stroke="#fb923c" strokeWidth="1.4" strokeDasharray="5 3"/>
    <line x1="150" y1="135" x2="184" y2="229" stroke="#fb923c" strokeWidth="1.4" strokeDasharray="5 3"/>
    <text x="188" y="78" fill="#67e8f9" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">α</text>
    <text x="110" y="205" fill="#fdba74" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">β</text>
    <circle cx="250" cy="135" r="4" fill="#22d3ee"/>
    <text x="258" y="139" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <circle cx="100" cy="48" r="4" fill="#22d3ee"/>
    <text x="88"  y="44"  fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <circle cx="56"  cy="169" r="4" fill="#fb923c"/>
    <text x="38"  y="173" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <circle cx="184" cy="229" r="4" fill="#fb923c"/>
    <text x="187" y="245" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <circle cx="150" cy="135" r="4" fill="#06b6d4"/>
    <text x="156" y="131" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">O</text>
    <text x="210" y="64"  fill="#a5f3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">{t.perbBusurAB}</text>
    <text x="100" y="222" fill="#fed7aa" fontSize="9" fontFamily="monospace" textAnchor="middle">{t.perbBusurCD}</text>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
const BusurJuringPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = translations[language];

  const SectionHeader = ({ icon, iconColor, title }: {
    id?: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <div className="w-full flex items-center px-5 py-4">
      <span className={iconColor}>{icon}</span>
      <span className={`font-body font-semibold ${isDark ? "text-white" : "text-gray-800"} ml-3`}>{title}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.h1}
        </h1>
        <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center mb-6 font-body`}>
          {t.subtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />}
              iconColor="text-yellow-400" title={t.introTitle} />
            <div className="px-5 pb-5 space-y-4">
              <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} leading-relaxed`}>
                {t.introP.split(t.introPizJuring)[0]}
                <strong className="text-yellow-300">{t.introPizJuring}</strong>
                {t.introP.split(t.introPizJuring)[1]?.split(t.introPizBusur)[0]}
                <strong className="text-orange-300">{t.introPizBusur}</strong>
                {t.introP.split(t.introPizJuring)[1]?.split(t.introPizBusur)[1]}
              </p>
              <PizzaAnalogiDua t={t} />
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">
                  {t.keyIdeaLabel} {t.keyIdeaText}
                </p>
              </div>
            </div>
          </div>

          {/* ANIMASI 1 */}
          <div className="rounded-xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.8)" : "rgba(248,250,252,.97)", borderColor: "rgba(251,191,36,.3)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<Zap className="w-5 h-5" />}
              iconColor="text-amber-400" title={t.anim1Title} />
            <div className="px-5 pb-5 pt-2 space-y-4">
              <div className="rounded-xl p-3 border"
                style={{ background: "rgba(251,191,36,.08)", borderColor: "rgba(251,191,36,.25)" }}>
                <p className="text-amber-200 text-xs font-body leading-relaxed">
                  {t.anim1Instr}
                </p>
              </div>
              <AnimasiBusur t={t} />
            </div>
          </div>

          {/* ANIMASI 2 */}
          <div className="rounded-xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.8)" : "rgba(248,250,252,.97)", borderColor: "rgba(168,85,247,.3)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<Zap className="w-5 h-5" />}
              iconColor="text-purple-400" title={t.anim2Title} />
            <div className="px-5 pb-5 pt-2 space-y-4">
              <div className="rounded-xl p-3 border"
                style={{ background: "rgba(168,85,247,.08)", borderColor: "rgba(168,85,247,.25)" }}>
                <p className="text-purple-200 text-xs font-body leading-relaxed">
                  {t.anim2Instr}
                </p>
              </div>
              <AnimasiJuring t={t} />
            </div>
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />}
              iconColor="text-cyan-400" title={t.rumusTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.rumusSummaryTitle}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  {t.rumusSummaryP.split(t.rumusSummaryBold)[0]}
                  <strong className="text-yellow-300">{t.rumusSummaryBold}</strong>
                  {t.rumusSummaryP.split(t.rumusSummaryBold)[1]}
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-1">{t.rumusBusurTitle}</p>
                  <BlockMath math="\frac{\alpha}{360°} \times 2\pi r" />
                  <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}>{t.rumusBusurAlpha}</p>
                </div>
                <div className="bg-orange-900/30 border border-orange-500/40 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-orange-300 mb-1">{t.rumusJuringTitle}</p>
                  <BlockMath math="\frac{\alpha}{360°} \times \pi r^2" />
                </div>
                <div className="bg-purple-900/30 border border-purple-500/40 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-2">{t.rumusTembTitle}</p>
                  <BlockMath math="L_{\triangle} = L_J - L_{\triangle OAB}" />
                  <TemberengLengkapSVG t={t} />
                </div>
              </div>
            </div>
          </div>

          {/* KONSEP PERBANDINGAN */}
          <div className="rounded-xl overflow-hidden border"
            style={{ background: isDark ? "rgba(15,23,42,.85)" : "rgba(248,250,252,.97)", borderColor: "rgba(6,182,212,.35)", backdropFilter: "blur(12px)" }}>
            <SectionHeader icon={<Target className="w-5 h-5" />}
              iconColor="text-cyan-400" title={t.perbTitle} />
            <div className="px-5 pb-6 pt-1 space-y-5">

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <p className={`font-body text-sm ${isDark ? "text-white/85" : "text-gray-700"} leading-relaxed`}>
                  {t.perbHook}{" "}
                  <em>{t.perbHookEm}</em>{" "}
                  {t.perbHook.includes(t.perbHookEm) ? "" : ""}{t.perbHook.split(t.perbHookEm).length > 1 ? "" : ""}
                  <strong className="text-cyan-300">{t.perbHookBold}</strong>
                  {t.perbHookEnd}
                </p>
              </div>

              <SvgPerbandingan t={t} />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 border border-cyan-500/30 bg-cyan-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-cyan-400"/>
                    <p className="text-cyan-300 text-xs font-bold font-body">{t.perbLegendCyan}</p>
                  </div>
                  <p className={`${isDark ? "text-white/60" : "text-gray-500"} text-[11px] font-body`}>{t.perbLegendCyanSub}</p>
                </div>
                <div className="rounded-lg p-3 border border-orange-500/30 bg-orange-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-orange-400"/>
                    <p className="text-orange-300 text-xs font-bold font-body">{t.perbLegendOrange}</p>
                  </div>
                  <p className={`${isDark ? "text-white/60" : "text-gray-500"} text-[11px] font-body`}>{t.perbLegendOrangeSub}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className={`${isDark ? "text-white/70" : "text-gray-600"} text-xs font-body font-semibold uppercase tracking-wider`}>{t.perbIdePokokLabel}</p>
                <div className={`${isDark ? "bg-slate-800/70 border-slate-600/50" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-2`}>
                  <p className={`font-body text-sm ${isDark ? "text-white/85" : "text-gray-700"} leading-relaxed`}>
                    {t.perbIdeP1.split(t.perbIdeP1Bold)[0]}
                    <strong className="text-yellow-300">{t.perbIdeP1Bold}</strong>
                    {t.perbIdeP1.split(t.perbIdeP1Bold)[1]}
                  </p>
                  <p className={`font-body text-sm ${isDark ? "text-white/70" : "text-gray-600"} leading-relaxed`}>
                    {t.perbIdeP2}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className={`${isDark ? "text-white/70" : "text-gray-600"} text-xs font-body font-semibold uppercase tracking-wider`}>{t.perbRumusLabel}</p>

                <div className={`rounded-xl p-4 border ${isDark ? "border-white/20 bg-slate-800/60" : "border-gray-200 bg-gray-100"} text-center`}>
                  <p className={`font-body text-xs ${isDark ? "text-white/60" : "text-gray-500"} mb-1`}>{t.perbGabNote}</p>
                  <p className={`font-body text-[10px] ${isDark ? "text-white/40" : "text-gray-400"} mb-2 font-mono`}>{t.perbGabLegend}</p>
                  <BlockMath math="\frac{\angle AOB}{\angle COD} = \frac{\ell_{AB}}{\ell_{CD}} = \frac{L_{AOB}}{L_{COD}}" />
                </div>

                <div className="rounded-xl p-4 border border-cyan-500/40 bg-cyan-900/20">
                  <p className="font-body text-xs font-bold text-cyan-300 mb-2">{t.perbBusurTitle}</p>
                  <BlockMath math="\frac{\angle AOB}{\angle COD} = \frac{\ell_{AB}}{\ell_{CD}}" />
                  <p className={`${isDark ? "text-white/55" : "text-gray-500"} text-xs font-body mt-1`}>
                    {t.perbBusurNote}
                  </p>
                </div>

                <div className="rounded-xl p-4 border border-orange-500/40 bg-orange-900/20">
                  <p className="font-body text-xs font-bold text-orange-300 mb-2">{t.perbJuringTitle}</p>
                  <BlockMath math="\frac{\angle AOB}{\angle COD} = \frac{L_{AOB}}{L_{COD}}" />
                  <p className={`${isDark ? "text-white/55" : "text-gray-500"} text-xs font-body mt-1`}>
                    {t.perbJuringNote}
                  </p>
                </div>

                <div className="rounded-xl p-4 border border-yellow-500/40 bg-yellow-900/20">
                  <p className="font-body text-xs font-bold text-yellow-300 mb-2">{t.perbBusJurTitle}</p>
                  <BlockMath math="\frac{\ell_{AB}}{\ell_{CD}} = \frac{L_{AOB}}{L_{COD}}" />
                  <p className="text-yellow-200/70 text-xs font-body mt-1">
                    {t.perbBusJurNote}
                  </p>
                </div>
              </div>

              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-wide">{t.perbKapanLabel}</p>
                <ul className="space-y-1.5">
                  {t.perbKapanItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-violet-400 mt-0.5">✦</span>
                      <p className={`font-body text-xs ${isDark ? "text-white/75" : "text-gray-600"}`}>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/40 bg-emerald-900/20 p-4 space-y-3">
                <p className="font-body text-xs font-bold text-emerald-300 uppercase tracking-wide">{t.perbContohLabel}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/85" : "text-gray-700"}`}>
                  {t.perbContohQ.split(t.perbContohQBold)[0]}
                  <strong className="text-emerald-300">{t.perbContohQBold}</strong>
                  {t.perbContohQ.split(t.perbContohQBold)[1]}
                </p>
                <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-lg p-3 space-y-2`}>
                  <p className={`${isDark ? "text-slate-300" : "text-gray-600"} text-xs font-mono font-bold`}>{t.perbContohSol}</p>
                  <BlockMath math="\frac{\ell_{CD}}{\ell_{AB}} = \frac{\beta}{\alpha} = \frac{45°}{60°} = \frac{3}{4}" />
                  <p className={`font-body text-xs ${isDark ? "text-white/70" : "text-gray-500"}`}>{t.perbGabLegend}</p>
                  <BlockMath math="\ell_{CD} = \frac{3}{4} \times 33 = 24{,}75 \,\mathrm{cm}" />
                  <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-lg p-2 mt-1">
                    <p className="font-body text-sm text-emerald-300 text-center font-bold">
                      {t.perbContohCheck}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="font-body text-xs text-red-200">
                  <strong>{t.perbWarningBold1}</strong>{" "}
                  {t.perbWarning.split(t.perbWarningBold1)[1]?.split(t.perbWarningBold2)[0]}
                  <strong>{t.perbWarningBold2}</strong>
                  {t.perbWarning.split(t.perbWarningBold2)[1]}
                </p>
              </div>

            </div>
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />}
              iconColor="text-green-400" title={t.c1Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c1Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>{t.c1Q}</p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c1Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c1Known} <InlineMath math="r = 21"/> cm, <InlineMath math="\alpha = 120°"/></p>
                <p className={`font-body text-xs ${isDark ? "text-white/55" : "text-gray-500"} font-mono`}>{t.c1PanjangBusur} =</p>
                <BlockMath math="\frac{120}{360} \times 2 \times \frac{22}{7} \times 21" />
                <BlockMath math="= \frac{1}{3} \times 2 \times \frac{22}{7} \times 21" />
                <BlockMath math="= \frac{1}{3} \times 132 = 44 \,\mathrm{cm}" />
                <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-green-300 text-center">{t.c1Check}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />}
              iconColor="text-yellow-400" title={t.c2Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c2Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>{t.c2Q}</p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c2Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c2Step1}</strong> {t.c2Step1desc}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/55" : "text-gray-500"} font-mono`}>{t.c2PanjangBusur} =</p>
                <BlockMath math="\frac{\alpha}{360°} \times 2\pi r" />
                <BlockMath math="33 = \frac{\alpha}{360} \times 2 \times \frac{22}{7} \times 63 = \frac{\alpha}{360} \times 396" />
                <BlockMath math="\alpha = \frac{33 \times 360}{396} = 30°" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c2Step2}</strong> {t.c2Step2desc}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/55" : "text-gray-500"} font-mono`}>{t.c2LuasJuring} =</p>
                <BlockMath math="\frac{30}{360} \times \frac{22}{7} \times 63^2 = \frac{1}{12} \times \frac{22}{7} \times 3969" />
                <BlockMath math="= \frac{1}{12} \times 12474 = 1039{,}5 \,\mathrm{cm}^2" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c2Shortcut}</strong> {t.c2ShortcutDesc}</p>
                <BlockMath math="= \frac{1}{2} \times 63 \times 33 = 1039{,}5 \,\mathrm{cm}^2 \checkmark" />
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200 text-center">{t.c2Check}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<FlaskConical className="w-5 h-5" />}
              iconColor="text-red-400" title={t.c3Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">{t.c3Level}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"}`}>
                  {t.c3Q}<InlineMath math="\sqrt{3} \approx 1{,}732"/>{t.c3Q2}
                </p>
              </div>
              <div className={`${isDark ? "bg-slate-800/60 border-slate-600" : "bg-gray-100 border-gray-200"} border rounded-xl p-4 space-y-3`}>
                <p className={`font-body text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-600"} uppercase tracking-wide mb-2`}>{t.c3Sol}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c3Step1}</strong> {t.c3Step1desc}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/55" : "text-gray-500"} font-mono`}>{t.c3LuasJuring} =</p>
                <BlockMath math="\frac{60}{360} \times 3{,}14 \times 10^2 = \frac{1}{6} \times 314 \approx 52{,}33 \,\mathrm{cm}^2" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c3Step2}</strong> {t.c3Step2desc}</p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.c3Step2Note}</p>
                <BlockMath math="L_{\triangle OAB} = \frac{\sqrt{3}}{4} \times s^2 = \frac{1{,}732}{4} \times 100 = 43{,}3 \,\mathrm{cm}^2" />
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}><strong>{t.c3Step3}</strong> {t.c3Step3desc}</p>
                <p className={`font-body text-xs ${isDark ? "text-white/55" : "text-gray-500"} font-mono`}>{t.c3LuasTembereng} =</p>
                <BlockMath math="52{,}33 - 43{,}3 = 9{,}03 \,\mathrm{cm}^2" />
                <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                  <p className="font-body text-sm text-red-200 text-center">{t.c3Check}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<BookOpen className="w-5 h-5" />}
              iconColor="text-violet-400" title={t.rangkTitle} />
            <div className="px-5 pb-5 space-y-3">
              <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  • <strong className="text-yellow-300">{t.rBusur}</strong> ={" "}
                  <InlineMath math="\frac{\alpha}{360°} \times 2\pi r"/>
                </p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  • <strong className="text-orange-300">{t.rJuring}</strong> ={" "}
                  <InlineMath math="\frac{\alpha}{360°} \times \pi r^2"/>{" "}
                  {t.rJuringOr}{" "}
                  <InlineMath math="\frac{1}{2} \times r \times \ell"/>
                  <span className={`${isDark ? "text-white/50" : "text-gray-400"} text-[11px] ml-1`}>({t.rJuringShortcut})</span>
                </p>
                <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  • <strong className="text-purple-300">{t.rTembereng}</strong> {t.rTemberengVal}
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-body text-sm text-yellow-200">{t.tips}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusurJuringPage;
