import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, Ruler } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import JarakDuaTitikInteraktif from "@/components/JarakDuaTitikInteraktif";
import { JarakGarisHorizontal, JarakGarisVertikal, JarakGarisMiring } from "@/components/JarakTitikKeGarisInteraktif";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS",
    pageSubtitle: "Teorema Pythagoras Bertemu Koordinat Kartesius!",
    breadcrumb: "Kelas 8 · Koordinat Kartesius · Materi Matematika",
    introHeader: "🌟 Mengapa Kita Perlu Mengukur Jarak di Koordinat?",
    introBody: "Di peta digital, berapa jarak lurus dari rumahmu ke sekolah? Di game, berapa jarak karakter dari musuh? Semua pertanyaan ini dijawab dengan rumus yang sama: gabungan",
    introEmph: "koordinat Kartesius",
    introBody2: "dan",
    introEmph2: "Teorema Pythagoras",
    introBody3: ". Konsep ini juga fundamental untuk menghitung jarak terdekat sebuah titik ke sebuah garis — dipakai dalam grafis komputer, engineering, dan GPS!",
    imgCaption: "Garis hitam menunjukkan jarak lurus antara dua titik di peta — konsep yang sama dengan rumus jarak koordinat Kartesius.",
    imgSrc: "Sumber: terralogiq.com",
    pt1Header: "📏 Bagian 1 — Jarak Antar Dua Titik",
    pt1Intisari: "🎯 Ringkasan Intisari",
    pt1Body: "Jarak antara dua titik di bidang Kartesius dihitung menggunakan",
    pt1Emph: "rumus jarak",
    pt1Body2: "yang merupakan penerapan langsung Teorema Pythagoras. Dua titik membentuk hipotenusa segitiga siku-siku di mana selisih koordinatnya membentuk dua sisi tegak.",
    pt1FormulaLabel: "Rumus Jarak Dua Titik A(x₁, y₁) dan B(x₂, y₂):",
    pt1AnimHeader: "🎮 Animasi Interaktif — Seret Titik A dan B",
    pt1AnimBody: "Geser titik A dan B — rumus, nilai x₁, y₁, x₂, y₂, dan jarak otomatis diperbarui!",
    pt2Header: "📏 Bagian 2 — Jarak Titik ke Garis",
    pt2Intisari: "🎯 Ringkasan Intisari",
    pt2Body: "Jarak titik ke garis adalah",
    pt2Emph: "jarak terpendek",
    pt2Body2: "dari titik tersebut ke garis — yang selalu berupa garis tegak lurus. Untuk garis horizontal/vertikal cukup hitung selisih koordinat. Untuk garis miring, gunakan rumus khusus.",
    realWorldHeader: "🌍 Manfaat & Penerapan Nyata",
    realWorldItems: [
      { icon: "🛰️", title: "Navigasi & GPS", desc: "Menghitung seberapa jauh posisi kendaraan/kapal dari jalur yang seharusnya, untuk deteksi penyimpangan arah." },
      { icon: "🤖", title: "Robotika & Otomasi", desc: "Robot atau drone menjaga jarak aman dari dinding/objek dengan menghitung jarak ke garis batas (line-following robot)." },
      { icon: "🏗️", title: "Desain & Konstruksi", desc: "Menentukan jarak minimum bangunan dari jalan, sungai, atau batas tanah (garis sempadan)." },
      { icon: "👁️", title: "Computer Vision / Deteksi Tepi", desc: "Mengukur seberapa 'lurus' suatu objek — cek kelurusan rel kereta, pipa." },
      { icon: "⚽", title: "Olahraga", desc: "Offside di sepak bola (jarak pemain ke garis), atau jarak bola ke garis lapangan." },
      { icon: "📈", title: "Optimasi / Statistik", desc: "Regresi linear menggunakan jarak titik data ke garis (least squares) untuk mengukur error prediksi." },
      { icon: "🗺️", title: "Pemetaan & GIS", desc: "Menghitung jarak suatu lokasi ke jalan, sungai, atau batas wilayah untuk analisis tata ruang." },
      { icon: "🦺", title: "Keselamatan Kerja", desc: "Menjaga jarak aman pekerja/alat berat dari kabel listrik (digambarkan sebagai garis)." },
    ],
    infografisCaption: "Infografis: 8 penerapan nyata konsep jarak titik ke garis dalam kehidupan sehari-hari",
    specialCasesHeader: "Kasus Khusus (Garis Horizontal / Vertikal / Miring):",
    horzLabel: "Garis horizontal",
    horzBody: "Jarak titik P(a, b) ke garis y = k adalah |b − k|",
    vertLabel: "Garis vertikal",
    vertBody: "Jarak titik P(a, b) ke garis x = k adalah |a − k|",
    slopeLabel: "Garis miring",
    slopeBody: "Masukkan koordinat P ke persamaan garis, bagi dengan panjang vektor normal",
    ex1Header: "✏️ Contoh 1 — Mudah (Jarak Dua Titik)",
    ex2Header: "✏️ Contoh 2 — Sedang (Jarak Titik ke Garis)",
    ex3Header: "✏️ Contoh 3 — Sulit (Jarak ke Garis Miring)",
    badge_easy: "MUDAH", badge_med: "SEDANG", badge_hard: "SULIT",
    soal: "📝 Soal", pembahasan: "🔍 Pembahasan",
    ex1q: "Tentukan jarak antara titik",
    ex1q2: "dan",
    ex1q3: "!",
    ex1pythagorean: "✨ Perhatikan: 3² + 4² = 5² → ini",
    ex1pythagoreanEmph: "Tripel Pythagoras",
    ex1pythagoreanSuffix: "yang terkenal (3-4-5)!",
    ex1ans: "✅ Jarak PQ =",
    ex1ansUnit: "5 satuan",
    ex2q: "Hitung jarak dari titik",
    ex2q2: "ke garis:",
    ex2qa: "a)",
    ex2ans: "✅ a) Jarak ke y = 4 adalah",
    ex2ansA: "6 satuan",
    ex2ansB: "b) Jarak ke x = −1 adalah",
    ex2ansUnit2: "4 satuan",
    ex3q: "Hitunglah jarak titik",
    ex3q2: "terhadap garis",
    ex3q3: "!",
    ex3identify: "Identifikasi:",
    ex3identifySuffix: ", titik P(4, 3)",
    ex3useFormula: "Gunakan rumus jarak titik ke garis miring:",
    ex3subst: "Substitusi:",
    ex3ans: "✅ Jarak P ke garis 3x − 4y + 5 = 0 adalah",
    ex3ansUnit: "1 satuan",
    rangHeader: "📌 Rangkuman Rumus Jarak",
    rangFormulas: [
      { judul: "Jarak 2 Titik A(x₁,y₁) & B(x₂,y₂)", rumus: "d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}", color: "bg-cyan-900/30 border-cyan-500/30" },
      { judul: "Titik P(a,b) ke Garis y = k", rumus: "d = |b - k|", color: "bg-green-900/30 border-green-500/30" },
      { judul: "Titik P(a,b) ke Garis x = k", rumus: "d = |a - k|", color: "bg-violet-900/30 border-violet-500/30" },
      { judul: "Titik P(x₀,y₀) ke Garis ax+by+c=0", rumus: "d = \\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}", color: "bg-orange-900/30 border-orange-500/30" },
    ],
    rangkumanJudul: "Rangkuman — Jarak Dua Titik & Jarak Titik ke Garis",
    rangkumanSubjudul: "Empat rumus jarak yang wajib dikuasai dalam koordinat Kartesius",
    r1judul: "Jarak Dua Titik P dan Q", r1isi: "Gunakan Teorema Pythagoras: d = √((x₂−x₁)²+(y₂−y₁)²). Selisih absis dan ordinat dikuadratkan lalu dijumlahkan, kemudian diakarkan.",
    r2judul: "Ke Garis Horizontal y = k", r2isi: "Jarak titik P(xₚ,yₚ) ke garis y=k hanya perlu d = |yₚ − k|. Cukup selisih ordinat saja, tanpa akar!",
    r3judul: "Ke Garis Vertikal x = k", r3isi: "Jarak titik P(xₚ,yₚ) ke garis x=k adalah d = |xₚ − k|. Cukup selisih absis saja, tanpa akar!",
    r4judul: "Ke Garis Miring ax+by+c=0", r4isi: "Rumus umum: d = |axₚ+byₚ+c|/√(a²+b²). Penyebut √(a²+b²) adalah panjang vektor normal garis.",
    tip1: <>Tripel Pythagoras hafalan: <strong>3-4-5</strong>, <strong>5-12-13</strong>, <strong>8-15-17</strong>, <strong>7-24-25</strong>. Jika muncul pasangan ini dalam soal, hasilnya pasti bilangan bulat!</>,
    tip2: <>Jarak selalu ≥ 0 (nilai mutlak menjamin ini). Jika d = 0, titik <strong>tepat berada pada garis</strong> atau <strong>bertumpuk</strong> dengan titik lain.</>,
    tip3: "Untuk soal jarak ke garis miring: ubah persamaan garis ke bentuk baku ax+by+c=0 terlebih dahulu. Pastikan tidak semua koefisien nol!",
    tip4: "Ingat: penyebut √(a²+b²) adalah panjang vektor normal (a,b). Konsep ini identik dengan normalisasi vektor dalam fisika — bekal untuk SMA!",
    kesimpulan: "Rumus jarak adalah fondasi trigonometri, kalkulus analitik, statistika (regresi linier), dan machine learning (k-NN, SVM). Dari Pythagoras kuno hingga algoritma AI modern — rumus sederhana ini tidak pernah lapuk!",
    back: "← Kembali ke Koordinat Kartesius",
    rumusLabel1: "Jarak dua titik P(x₁,y₁) dan Q(x₂,y₂):",
    rumusLabel2: "Jarak titik P ke garis ax+by+c=0:",
  },
  en: {
    pageTitle: "DISTANCE BETWEEN TWO POINTS AND DISTANCE FROM A POINT TO A LINE",
    pageSubtitle: "The Pythagorean Theorem Meets Cartesian Coordinates!",
    breadcrumb: "Grade 8 · Cartesian Coordinates · Math Material",
    introHeader: "🌟 Why Do We Need to Measure Distance on a Coordinate Plane?",
    introBody: "On a digital map, what is the straight-line distance from your house to school? In a game, how far is your character from an enemy? All these questions are answered with the same formula: a combination of",
    introEmph: "Cartesian coordinates",
    introBody2: "and the",
    introEmph2: "Pythagorean Theorem",
    introBody3: ". This concept is also fundamental for calculating the shortest distance from a point to a line — used in computer graphics, engineering, and GPS!",
    imgCaption: "The black line shows the straight-line distance between two points on the map — the same concept as the Cartesian distance formula.",
    imgSrc: "Source: terralogiq.com",
    pt1Header: "📏 Part 1 — Distance Between Two Points",
    pt1Intisari: "🎯 Key Summary",
    pt1Body: "The distance between two points on a Cartesian plane is calculated using the",
    pt1Emph: "distance formula",
    pt1Body2: ", which is a direct application of the Pythagorean Theorem. The two points form the hypotenuse of a right triangle, where the differences in coordinates form the two legs.",
    pt1FormulaLabel: "Distance Formula for Points A(x₁, y₁) and B(x₂, y₂):",
    pt1AnimHeader: "🎮 Interactive Animation — Drag Points A and B",
    pt1AnimBody: "Slide points A and B — the formula, values of x₁, y₁, x₂, y₂, and distance update automatically!",
    pt2Header: "📏 Part 2 — Distance from a Point to a Line",
    pt2Intisari: "🎯 Key Summary",
    pt2Body: "The distance from a point to a line is the",
    pt2Emph: "shortest distance",
    pt2Body2: "from that point to the line — which is always the perpendicular distance. For horizontal/vertical lines, just calculate the difference in coordinates. For oblique lines, use a special formula.",
    realWorldHeader: "🌍 Benefits & Real-World Applications",
    realWorldItems: [
      { icon: "🛰️", title: "Navigation & GPS", desc: "Calculating how far a vehicle/ship is from the intended route, to detect deviation." },
      { icon: "🤖", title: "Robotics & Automation", desc: "Robots or drones maintain a safe distance from walls/objects by calculating distance to boundary lines." },
      { icon: "🏗️", title: "Design & Construction", desc: "Determining the minimum distance of a building from roads, rivers, or land boundaries." },
      { icon: "👁️", title: "Computer Vision / Edge Detection", desc: "Measuring how 'straight' an object is — checking rail tracks, pipes." },
      { icon: "⚽", title: "Sports", desc: "Offside in soccer (distance of a player to the line), or ball to field line distance." },
      { icon: "📈", title: "Optimization / Statistics", desc: "Linear regression uses distance from data points to the line (least squares) to measure prediction error." },
      { icon: "🗺️", title: "Mapping & GIS", desc: "Calculating the distance of a location to roads, rivers, or territory boundaries for spatial analysis." },
      { icon: "🦺", title: "Workplace Safety", desc: "Maintaining safe distance of workers/heavy equipment from power lines (represented as a line)." },
    ],
    infografisCaption: "Infographic: 8 real-world applications of the point-to-line distance concept",
    specialCasesHeader: "Special Cases (Horizontal / Vertical / Oblique Lines):",
    horzLabel: "Horizontal line",
    horzBody: "Distance from point P(a, b) to line y = k is |b − k|",
    vertLabel: "Vertical line",
    vertBody: "Distance from point P(a, b) to line x = k is |a − k|",
    slopeLabel: "Oblique line",
    slopeBody: "Substitute the coordinates of P into the line equation, divide by the length of the normal vector",
    ex1Header: "✏️ Example 1 — Easy (Distance Between Two Points)",
    ex2Header: "✏️ Example 2 — Medium (Distance from Point to Line)",
    ex3Header: "✏️ Example 3 — Hard (Distance to an Oblique Line)",
    badge_easy: "EASY", badge_med: "MEDIUM", badge_hard: "HARD",
    soal: "📝 Problem", pembahasan: "🔍 Solution",
    ex1q: "Find the distance between point",
    ex1q2: "and",
    ex1q3: "!",
    ex1pythagorean: "✨ Note: 3² + 4² = 5² → this is the famous",
    ex1pythagoreanEmph: "Pythagorean Triple",
    ex1pythagoreanSuffix: "(3-4-5)!",
    ex1ans: "✅ Distance PQ =",
    ex1ansUnit: "5 units",
    ex2q: "Calculate the distance from point",
    ex2q2: "to the line:",
    ex2qa: "a)",
    ex2ans: "✅ a) Distance to y = 4 is",
    ex2ansA: "6 units",
    ex2ansB: "b) Distance to x = −1 is",
    ex2ansUnit2: "4 units",
    ex3q: "Calculate the distance from point",
    ex3q2: "to the line",
    ex3q3: "!",
    ex3identify: "Identify:",
    ex3identifySuffix: ", point P(4, 3)",
    ex3useFormula: "Use the point-to-oblique-line distance formula:",
    ex3subst: "Substituting:",
    ex3ans: "✅ Distance from P to line 3x − 4y + 5 = 0 is",
    ex3ansUnit: "1 unit",
    rangHeader: "📌 Summary of Distance Formulas",
    rangFormulas: [
      { judul: "Distance between 2 Points A(x₁,y₁) & B(x₂,y₂)", rumus: "d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}", color: "bg-cyan-900/30 border-cyan-500/30" },
      { judul: "Point P(a,b) to Line y = k", rumus: "d = |b - k|", color: "bg-green-900/30 border-green-500/30" },
      { judul: "Point P(a,b) to Line x = k", rumus: "d = |a - k|", color: "bg-violet-900/30 border-violet-500/30" },
      { judul: "Point P(x₀,y₀) to Line ax+by+c=0", rumus: "d = \\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}", color: "bg-orange-900/30 border-orange-500/30" },
    ],
    rangkumanJudul: "Summary — Distance Between Points & Distance to a Line",
    rangkumanSubjudul: "Four distance formulas essential for Cartesian coordinates",
    r1judul: "Distance Between Points P and Q", r1isi: "Use the Pythagorean Theorem: d = √((x₂−x₁)²+(y₂−y₁)²). Square the differences, add them, then take the square root.",
    r2judul: "To Horizontal Line y = k", r2isi: "Distance from P(xₚ,yₚ) to y=k is simply d = |yₚ − k|. Just the ordinate difference, no square root!",
    r3judul: "To Vertical Line x = k", r3isi: "Distance from P(xₚ,yₚ) to x=k is d = |xₚ − k|. Just the abscissa difference, no square root!",
    r4judul: "To Oblique Line ax+by+c=0", r4isi: "General formula: d = |axₚ+byₚ+c|/√(a²+b²). The denominator √(a²+b²) is the length of the line's normal vector.",
    tip1: <>Pythagorean Triple memory aid: <strong>3-4-5</strong>, <strong>5-12-13</strong>, <strong>8-15-17</strong>, <strong>7-24-25</strong>. If these pairs appear in a problem, the answer is always a whole number!</>,
    tip2: <>Distance is always ≥ 0 (absolute value guarantees this). If d = 0, the point <strong>lies exactly on the line</strong> or <strong>coincides</strong> with another point.</>,
    tip3: "For distance to oblique lines: first convert the line equation to standard form ax+by+c=0. Make sure not all coefficients are zero!",
    tip4: "Remember: the denominator √(a²+b²) is the length of the normal vector (a,b). This is identical to vector normalization in physics — useful for high school!",
    kesimpulan: "The distance formula is the foundation of trigonometry, analytic calculus, statistics (linear regression), and machine learning (k-NN, SVM). From ancient Pythagoras to modern AI algorithms — this simple formula never gets old!",
    back: "← Back to Cartesian Coordinates",
    rumusLabel1: "Distance between points P(x₁,y₁) and Q(x₂,y₂):",
    rumusLabel2: "Distance from point P to line ax+by+c=0:",
  },
  ja: {
    pageTitle: "2点間の距離と点と直線の距離",
    pageSubtitle: "ピタゴラスの定理と直交座標の出会い！",
    breadcrumb: "中学2年 · 直交座標 · 数学教材",
    introHeader: "🌟 座標平面で距離を測る必要があるのはなぜ？",
    introBody: "デジタル地図で家から学校までの直線距離は？ゲームでキャラクターと敵の距離は？これらの質問はすべて同じ公式で答えられます：",
    introEmph: "直交座標",
    introBody2: "と",
    introEmph2: "ピタゴラスの定理",
    introBody3: "の組み合わせです。この概念は点から直線までの最短距離の計算にも重要で、コンピュータグラフィックス、工学、GPSで使われています！",
    imgCaption: "黒い線は地図上の2点間の直線距離を示す — 直交座標の距離公式と同じ概念。",
    imgSrc: "ソース：terralogiq.com",
    pt1Header: "📏 パート1 — 2点間の距離",
    pt1Intisari: "🎯 要点まとめ",
    pt1Body: "直交座標上の2点間の距離は、ピタゴラスの定理を直接適用した",
    pt1Emph: "距離公式",
    pt1Body2: "を使って計算します。2点は直角三角形の斜辺を形成し、座標の差が2辺になります。",
    pt1FormulaLabel: "点A(x₁, y₁)とB(x₂, y₂)の距離公式：",
    pt1AnimHeader: "🎮 インタラクティブアニメーション — 点AとBをドラッグ",
    pt1AnimBody: "点AとBをスライドさせると、公式、x₁, y₁, x₂, y₂の値、距離が自動的に更新されます！",
    pt2Header: "📏 パート2 — 点から直線までの距離",
    pt2Intisari: "🎯 要点まとめ",
    pt2Body: "点から直線までの距離は、その点から直線への",
    pt2Emph: "最短距離",
    pt2Body2: "で、常に垂線の足への距離です。水平・垂直の直線には座標の差だけを計算すれば十分。斜めの直線には特別な公式を使います。",
    realWorldHeader: "🌍 メリットと実際の応用",
    realWorldItems: [
      { icon: "🛰️", title: "ナビゲーション・GPS", desc: "車両・船舶が予定ルートからどれだけ離れているかを計算し、逸脱を検出する。" },
      { icon: "🤖", title: "ロボット工学・自動化", desc: "ロボットやドローンが境界線への距離を計算して壁・障害物との安全距離を維持する。" },
      { icon: "🏗️", title: "設計・建設", desc: "建物の道路・河川・土地境界からの最小距離の決定。" },
      { icon: "👁️", title: "コンピュータビジョン・エッジ検出", desc: "物体がどれだけ「まっすぐ」かを測定 — 鉄道レール・パイプの直線チェック。" },
      { icon: "⚽", title: "スポーツ", desc: "サッカーのオフサイド（プレイヤーとラインの距離）、またはボールとフィールドラインの距離。" },
      { icon: "📈", title: "最適化・統計", desc: "線形回帰はデータ点から直線への距離（最小二乗法）を使用して予測誤差を測定する。" },
      { icon: "🗺️", title: "地図作成・GIS", desc: "空間分析のため、ある場所から道路・河川・区域境界までの距離を計算する。" },
      { icon: "🦺", title: "職場安全", desc: "作業者・重機が送電線（直線として表現）からの安全距離を維持する。" },
    ],
    infografisCaption: "インフォグラフィック：点と直線の距離の概念の8つの実際の応用",
    specialCasesHeader: "特殊ケース（水平・垂直・斜め直線）：",
    horzLabel: "水平線",
    horzBody: "点P(a, b)から直線y = kまでの距離は |b − k|",
    vertLabel: "垂直線",
    vertBody: "点P(a, b)から直線x = kまでの距離は |a − k|",
    slopeLabel: "斜め直線",
    slopeBody: "Pの座標を直線方程式に代入し、法線ベクトルの長さで割る",
    ex1Header: "✏️ 例題1 — 基本（2点間の距離）",
    ex2Header: "✏️ 例題2 — 標準（点から直線までの距離）",
    ex3Header: "✏️ 例題3 — 発展（斜め直線への距離）",
    badge_easy: "基本", badge_med: "標準", badge_hard: "発展",
    soal: "📝 問題", pembahasan: "🔍 解説",
    ex1q: "点",
    ex1q2: "と",
    ex1q3: "の間の距離を求めなさい！",
    ex1pythagorean: "✨ 注意：3² + 4² = 5² → これは有名な",
    ex1pythagoreanEmph: "ピタゴラス数",
    ex1pythagoreanSuffix: "(3-4-5)！",
    ex1ans: "✅ PQの距離 =",
    ex1ansUnit: "5単位",
    ex2q: "点",
    ex2q2: "から次の直線までの距離を求めなさい：",
    ex2qa: "a)",
    ex2ans: "✅ a) y = 4 までの距離は",
    ex2ansA: "6単位",
    ex2ansB: "b) x = −1 までの距離は",
    ex2ansUnit2: "4単位",
    ex3q: "点",
    ex3q2: "から直線",
    ex3q3: "までの距離を計算しなさい！",
    ex3identify: "識別：",
    ex3identifySuffix: "、点P(4, 3)",
    ex3useFormula: "点から斜め直線までの距離公式を使用：",
    ex3subst: "代入：",
    ex3ans: "✅ Pから直線3x − 4y + 5 = 0までの距離は",
    ex3ansUnit: "1単位",
    rangHeader: "📌 距離公式まとめ",
    rangFormulas: [
      { judul: "2点A(x₁,y₁)とB(x₂,y₂)の距離", rumus: "d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}", color: "bg-cyan-900/30 border-cyan-500/30" },
      { judul: "点P(a,b)から直線y = kまでの距離", rumus: "d = |b - k|", color: "bg-green-900/30 border-green-500/30" },
      { judul: "点P(a,b)から直線x = kまでの距離", rumus: "d = |a - k|", color: "bg-violet-900/30 border-violet-500/30" },
      { judul: "点P(x₀,y₀)から直線ax+by+c=0までの距離", rumus: "d = \\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}", color: "bg-orange-900/30 border-orange-500/30" },
    ],
    rangkumanJudul: "まとめ — 2点間の距離と点から直線までの距離",
    rangkumanSubjudul: "直交座標で必須の4つの距離公式",
    r1judul: "点PとQの距離", r1isi: "ピタゴラスの定理を使う：d = √((x₂−x₁)²+(y₂−y₁)²)。差を2乗して足し、平方根をとる。",
    r2judul: "水平線y = kへの距離", r2isi: "P(xₚ,yₚ)から y=k への距離は d = |yₚ − k| だけ。y座標の差のみ、平方根不要！",
    r3judul: "垂直線x = kへの距離", r3isi: "P(xₚ,yₚ)から x=k への距離は d = |xₚ − k|。x座標の差のみ、平方根不要！",
    r4judul: "斜め直線ax+by+c=0への距離", r4isi: "一般式：d = |axₚ+byₚ+c|/√(a²+b²)。分母 √(a²+b²) は直線の法線ベクトルの長さ。",
    tip1: <>ピタゴラス数の覚え方：<strong>3-4-5</strong>、<strong>5-12-13</strong>、<strong>8-15-17</strong>、<strong>7-24-25</strong>。問題にこれらが出たら答えは整数！</>,
    tip2: <>距離は常に ≥ 0（絶対値が保証）。d = 0 なら点は<strong>直線上にある</strong>か、別の点と<strong>重なっている</strong>。</>,
    tip3: "斜め直線への距離：まず直線を標準形 ax+by+c=0 に変換する。すべての係数がゼロにならないように！",
    tip4: "分母 √(a²+b²) は法線ベクトル(a,b)の長さ。これは物理のベクトル正規化と同じ概念 — 高校数学への準備！",
    kesimpulan: "距離公式は三角法、解析微積分、統計（線形回帰）、機械学習（k-NN、SVM）の基礎です。古代のピタゴラスから現代のAIアルゴリズムまで — この単純な公式は時代を超えます！",
    back: "← 直交座標に戻る",
    rumusLabel1: "点P(x₁,y₁)とQ(x₂,y₂)の距離：",
    rumusLabel2: "点Pから直線ax+by+c=0までの距離：",
  },
};

const JarakTitikGarisPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "jarakdua", "jarakgaris", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (id: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const TwoPointGrid = () => {
    const A = [1, 4]; const B = [4, 1];
    const size = 5; const cellPx = 22; const total = size * 2;
    const toCell = (v: number) => (v + size) * cellPx;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative border border-white/20 rounded-lg overflow-hidden"
          style={{ width: total * cellPx, height: total * cellPx, background: "rgba(15,23,42,0.85)" }}>
          {Array.from({ length: total + 1 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="absolute" style={{ left: i * cellPx, top: 0, width: 1, height: total * cellPx, background: i === size ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)" }} />
              <div className="absolute" style={{ top: i * cellPx, left: 0, height: 1, width: total * cellPx, background: i === size ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)" }} />
            </React.Fragment>
          ))}
          {(() => {
            const ax = toCell(A[0]); const ay = toCell(-A[1]);
            const bx = toCell(B[0]); const by = toCell(-B[1]);
            const dx = bx - ax; const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return <div className="absolute z-10 origin-left" style={{ left: ax, top: ay, width: len, height: 2, background: "#22d3ee", transform: `rotate(${angle}deg)`, opacity: 0.8 }} />;
          })()}
          <div className="absolute border-r-2 border-dashed border-cyan-400/40 z-5"
            style={{ left: toCell(A[0]), top: toCell(-A[1]), width: toCell(B[0]) - toCell(A[0]), height: toCell(-B[1]) - toCell(-A[1]) }} />
          <span className="absolute text-cyan-300 font-mono z-20" style={{ fontSize: 8, left: (toCell(A[0]) + toCell(B[0])) / 2, top: toCell(-A[1]) + 2 }}>Δx=3</span>
          <span className="absolute text-green-300 font-mono z-20" style={{ fontSize: 8, left: toCell(B[0]) + 2, top: (toCell(-A[1]) + toCell(-B[1])) / 2 }}>Δy=3</span>
          {([[A[0], A[1], "A(1,4)", "bg-cyan-400", "text-cyan-300"], [B[0], B[1], "B(4,1)", "bg-pink-400", "text-pink-300"]] as [number, number, string, string, string][]).map(([x, y, label, bg, tc]) => (
            <div key={label}>
              <div className={`absolute rounded-full ${bg} border-2 border-white/80 z-20`} style={{ width: 8, height: 8, left: toCell(x) - 4, top: toCell(-y) - 4 }} />
              <span className={`absolute font-mono font-bold z-20 ${tc}`} style={{ fontSize: 8, left: toCell(x) + 5, top: toCell(-y) - 12, whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-cyan-300 text-xs font-mono">d(AB) = √(3²+3²) = √18 = 3√2 ≈ 4,24</p>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.pageSubtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introBody} <strong className="text-cyan-300">{t.introEmph}</strong> {t.introBody2} <strong className="text-cyan-300">{t.introEmph2}</strong>{t.introBody3}
                </p>
                <div className="flex flex-col items-center gap-2">
                  <img src="/images/peta-jarak-dua-titik.png" alt="Contoh jarak dua titik pada peta"
                    className="rounded-xl border border-white/10 shadow-lg w-full max-w-sm object-cover" />
                  <p className="text-white/40 text-xs font-body italic text-center">
                    {t.imgCaption}{" "}
                    <a href="https://terralogiq.com/cara-menghitung-jarak-antar-titik-dengan-maps-javascript-api/" target="_blank" rel="noopener noreferrer"
                      className="text-cyan-400/70 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                      {t.imgSrc}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* JARAK DUA TITIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jarakdua" icon={<Ruler className="w-5 h-5" />} iconColor="text-cyan-400" title={t.pt1Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.pt1Intisari}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.pt1Body} <strong className="text-cyan-300">{t.pt1Emph}</strong>{t.pt1Body2}
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-4 text-center space-y-2">
                  <p className="font-body text-xs text-white/60">{t.pt1FormulaLabel}</p>
                  <BlockMath math="\boxed{d(AB) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}}" />
                </div>
                <div className="bg-slate-800/60 border border-cyan-500/25 rounded-xl p-4 space-y-3">
                  <p className="text-cyan-300 font-mono font-bold text-sm">{t.pt1AnimHeader}</p>
                  <p className="text-white/50 text-xs font-body">{t.pt1AnimBody}</p>
                  <JarakDuaTitikInteraktif />
                </div>
              </div>
            )}
          </div>

          {/* JARAK TITIK KE GARIS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jarakgaris" icon={<Ruler className="w-5 h-5" />} iconColor="text-green-400" title={t.pt2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.pt2Intisari}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.pt2Body} <strong className="text-green-300">{t.pt2Emph}</strong>{t.pt2Body2}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-emerald-500/25 rounded-xl p-4 space-y-3">
                  <p className="font-mono font-bold text-emerald-300 text-sm">{t.realWorldHeader}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {t.realWorldItems.map(({ icon, title, desc }) => (
                      <div key={title} className="flex gap-3 items-start bg-emerald-900/20 border border-emerald-500/15 rounded-lg px-3 py-2.5">
                        <span className="text-lg leading-none mt-0.5 shrink-0">{icon}</span>
                        <div>
                          <p className="font-body font-bold text-emerald-300 text-xs">{title}</p>
                          <p className="font-body text-white/60 text-xs mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <img src="/images/penerapan-jarak-titik-garis.png" alt="Infografis penerapan jarak titik ke garis"
                      className="rounded-xl border border-emerald-500/20 shadow-lg w-full object-cover" />
                    <p className="text-white/35 text-xs font-body italic text-center">{t.infografisCaption}</p>
                  </div>
                </div>
                <div className="space-y-6 text-xs font-body">
                  <p className="font-bold text-white text-sm">{t.specialCasesHeader}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">{t.horzLabel} <InlineMath math="y = k" />:</p>
                      <BlockMath math="d = |y_P - k|" />
                      <p className="text-white/60">{t.horzBody}</p>
                    </div>
                    <JarakGarisHorizontal />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">{t.vertLabel} <InlineMath math="x = k" />:</p>
                      <BlockMath math="d = |x_P - k|" />
                      <p className="text-white/60">{t.vertBody}</p>
                    </div>
                    <JarakGarisVertikal />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.slopeLabel} <InlineMath math="ax + by + c = 0" />:</p>
                      <BlockMath math="d = \frac{|ax_P + by_P + c|}{\sqrt{a^2 + b^2}}" />
                      <p className="text-white/60">{t.slopeBody}</p>
                    </div>
                    <JarakGarisMiring />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">{t.ex1q} <InlineMath math="P(1, 2)" /> {t.ex1q2} <InlineMath math="Q(4, 6)" />{t.ex1q3}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <BlockMath math="d(PQ) = \sqrt{(4-1)^2 + (6-2)^2}" />
                    <BlockMath math="= \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5" />
                  </div>
                  <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2 text-xs">
                    <p className="text-yellow-200">{t.ex1pythagorean} <strong>{t.ex1pythagoreanEmph}</strong> {t.ex1pythagoreanSuffix}</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex1ans} <strong>{t.ex1ansUnit}</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_med} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex2q} <InlineMath math="A(3, -2)" /> {t.ex2q2}<br />
                    {t.ex2qa} <InlineMath math="y = 4" />&nbsp;&nbsp;&nbsp;b) <InlineMath math="x = -1" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">a) {language === "ja" ? "y = 4 まで：" : "ke garis y = 4:"}</p>
                      <BlockMath math="d = |y_A - 4| = |-2 - 4|" />
                      <BlockMath math="= |-6| = 6" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">b) {language === "ja" ? "x = −1 まで：" : "ke garis x = −1:"}</p>
                      <BlockMath math="d = |x_A - (-1)| = |3 + 1|" />
                      <BlockMath math="= |4| = 4" />
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex2ans} <strong>{t.ex2ansA}</strong>. {t.ex2ansB} <strong>{t.ex2ansUnit2}</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex3q} <InlineMath math="P(4, 3)" /> {t.ex3q2} <InlineMath math="3x - 4y + 5 = 0" />{t.ex3q3}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">{t.ex3identify} <InlineMath math="a=3,\ b=-4,\ c=5" />{t.ex3identifySuffix}</p>
                      <p className="text-white/70">{t.ex3useFormula}</p>
                      <BlockMath math="d = \frac{|ax_P + by_P + c|}{\sqrt{a^2 + b^2}}" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.ex3subst}</p>
                      <BlockMath math="d = \frac{|3(4) + (-4)(3) + 5|}{\sqrt{3^2 + (-4)^2}}" />
                      <BlockMath math="= \frac{|12 - 12 + 5|}{\sqrt{9 + 16}} = \frac{|5|}{\sqrt{25}} = \frac{5}{5} = 1" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex3ans} <strong>{t.ex3ansUnit}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.rangHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="grid grid-cols-1 gap-3">
                  {t.rangFormulas.map(({ judul, rumus, color }) => (
                    <div key={judul} className={`border ${color} rounded-lg p-3 text-center`}>
                      <p className="text-white/60 text-xs mb-1">{judul}</p>
                      <BlockMath math={rumus} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══ RANGKUMAN ═══ */}
          <RangkumanSection
            gradientFrom="from-rose-600" gradientVia="via-pink-600" gradientTo="to-red-700"
            borderColor="border-rose-500/30" accentColor="text-rose-200"
            headerIcon="📋" judul={t.rangkumanJudul} subjudul={t.rangkumanSubjudul}
            ringkasan={[
              { emoji:"📏", judul: t.r1judul, bg:"bg-rose-900/40", border:"border-rose-500/30", textColor:"text-rose-300", isi: t.r1isi },
              { emoji:"↔️", judul: t.r2judul, bg:"bg-cyan-900/40", border:"border-cyan-500/30", textColor:"text-cyan-300", isi: t.r2isi },
              { emoji:"↕️", judul: t.r3judul, bg:"bg-green-900/40", border:"border-green-500/30", textColor:"text-green-300", isi: t.r3isi },
              { emoji:"📐", judul: t.r4judul, bg:"bg-violet-900/40", border:"border-violet-500/30", textColor:"text-violet-300", isi: t.r4isi },
            ]}
            rumus={[
              { label: t.rumusLabel1, rumus:"d(PQ) = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}", bg:"bg-rose-900/30", border:"border-rose-500/25", labelColor:"text-rose-300" },
              { label: t.rumusLabel2, rumus:"d = \\frac{|ax_P + by_P + c|}{\\sqrt{a^2+b^2}}", bg:"bg-violet-900/30", border:"border-violet-500/25", labelColor:"text-violet-300" },
            ]}
            tips={[
              { emoji:"🧠", teks: t.tip1 },
              { emoji:"📐", teks: t.tip2 },
              { emoji:"✅", teks: t.tip3 },
              { emoji:"🎯", teks: t.tip4 },
            ]}
            kesimpulan={t.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-rose-600/20 to-pink-600/20"
            kesimpulanBorder="border-rose-400/40"
            kesimpulanTextColor="text-rose-100/90"
          />

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JarakTitikGarisPage;
