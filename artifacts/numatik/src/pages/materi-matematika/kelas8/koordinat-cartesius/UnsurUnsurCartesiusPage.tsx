import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, Grid } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import CartesianDragAnimation from "@/components/CartesianDragAnimation";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "UNSUR-UNSUR PADA DIAGRAM KARTESIUS",
    pageSubtitle: "Peta Koordinat — Bahasa Universal Matematika!",
    breadcrumb: "Kelas 8 · Koordinat Kartesius · Materi Matematika",
    introHeader: "🌟 Dari GPS ke Matematika — Koordinat Ada di Mana-mana!",
    introBody: "Saat kamu share lokasi ke teman lewat Google Maps, kamu sebenarnya sedang berbagi dua angka: garis lintang dan garis bujur. Itulah konsep",
    introEmph: "koordinat",
    introBody2: "! Dalam matematika, kita menggunakan",
    introEmph2: "Diagram Kartesius",
    introBody3: "— sebuah sistem peta angka yang diciptakan filsuf Prancis René Descartes — untuk menentukan posisi setiap titik di bidang datar secara tepat dan jelas.",
    imgCaption: "Koordinat di smartphone — prinsipnya persis sama dengan Diagram Kartesius!",
    imgSrc: "Sumber gambar",
    introFact: "Fakta keren:",
    introFactBody: "Nama \"Cartesius\" berasal dari nama Latin René Descartes (Renatus Kartesius). Menurut cerita, ide sistem koordinat ini muncul saat ia berbaring di tempat tidur dan mengamati seekor lalat di langit-langit kamar. Ia berpikir: bagaimana cara menentukan posisi lalat itu secara tepat? 🪰",
    unsurHeader: "📘 Komponen Utama Diagram Kartesius",
    unsurIntisari: "🎯 Ringkasan Intisari",
    unsurBody: "Diagram Kartesius terdiri dari dua garis bilangan yang saling tegak lurus. Setiap titik di bidang Kartesius dinyatakan dengan pasangan bilangan",
    unsurEmph: "(x, y)",
    unsurBody2: "yang disebut",
    unsurEmph2: "koordinat",
    unsurComp: [
      { nama: "Sumbu-x (Absis)", icon: "→", desc: "Garis horizontal (mendatar). Nilai positif ke kanan, negatif ke kiri.", warna: "border-cyan-500/40 bg-cyan-900/30 text-cyan-200" },
      { nama: "Sumbu-y (Ordinat)", icon: "↑", desc: "Garis vertikal (tegak). Nilai positif ke atas, negatif ke bawah.", warna: "border-green-500/40 bg-green-900/30 text-green-200" },
      { nama: "Titik Asal (Origin)", icon: "O", desc: "Titik perpotongan sumbu-x dan sumbu-y. Koordinatnya selalu (0, 0).", warna: "border-white/30 bg-slate-700/40 text-white/80" },
      { nama: "Absis (koordinat x)", icon: "x", desc: "Jarak titik ke sumbu-y, diukur sejajar sumbu-x. Bilangan pertama dalam (x, y).", warna: "border-violet-500/40 bg-violet-900/30 text-violet-200" },
      { nama: "Ordinat (koordinat y)", icon: "y", desc: "Jarak titik ke sumbu-x, diukur sejajar sumbu-y. Bilangan kedua dalam (x, y).", warna: "border-pink-500/40 bg-pink-900/30 text-pink-200" },
    ],
    coordNote: "Cara menulis koordinat sebuah titik:",
    coordWarn: "⚠️ Urutan selalu x dulu, baru y! Jangan tertukar.",
    kuadranHeader: "🧭 Empat Kuadran — Wilayah di Bidang Kartesius",
    kuadranBody: "Sumbu-x dan sumbu-y membagi bidang Kartesius menjadi",
    kuadranEmph: "4 daerah",
    kuadranBody2: "yang disebut kuadran, diberi nomor romawi I, II, III, IV berlawanan arah jarum jam:",
    kuadranData: [
      { roman: "I", pos: "Kanan Atas", example: "A(3, 4)" },
      { roman: "II", pos: "Kiri Atas", example: "B(−2, 3)" },
      { roman: "III", pos: "Kiri Bawah", example: "C(−3, −2)" },
      { roman: "IV", pos: "Kanan Bawah", example: "D(2, −4)" },
    ],
    kuadranLabel: "Kuadran",
    contohLabel: "Contoh:",
    axisHeader: "📍 Titik di Sumbu (bukan di kuadran manapun):",
    axisSumbux: "Titik di",
    axisSumbuxEmph: "sumbu-x",
    axisSumbuxSuffix: ": ordinatnya = 0, contoh E(5, 0)",
    axisSumbuy: "Titik di",
    axisSumbuyEmph: "sumbu-y",
    axisSumbuySuffix: ": absisnya = 0, contoh F(0, −3)",
    axisOrigin: "Titik asal O",
    axisOriginSuffix: ": koordinat (0, 0), bukan di kuadran manapun",
    ex1Header: "✏️ Contoh 1 — Mudah",
    ex2Header: "✏️ Contoh 2 — Sedang",
    ex3Header: "✏️ Contoh 3 — Sulit",
    badge_easy: "MUDAH",
    badge_med: "SEDANG",
    badge_hard: "SULIT",
    soal: "📝 Soal",
    pembahasan: "🔍 Pembahasan",
    ex1q: "Tentukan koordinat (absis dan ordinat) dari setiap titik berikut, lalu sebutkan titik itu berada di kuadran berapa:",
    thPoint: "Titik", thAbsis: "Absis (x)", thOrdinat: "Ordinat (y)", thKuadran: "Kuadran",
    tableData: [
      ["P(4, 7)", "4 (positif)", "7 (positif)", "I (+, +)"],
      ["Q(−5, 2)", "−5 (negatif)", "2 (positif)", "II (−, +)"],
      ["R(−1, −6)", "−1 (negatif)", "−6 (negatif)", "III (−, −)"],
      ["S(3, −3)", "3 (positif)", "−3 (negatif)", "IV (+, −)"],
    ],
    ex1ans: "✅ P → Kuadran I, Q → Kuadran II, R → Kuadran III, S → Kuadran IV",
    ex2q: "Diketahui titik",
    ex2q2: ". Tentukan nilai",
    ex2q3: "dan",
    ex2q4: "agar titik A berada tepat di titik asal O(0, 0)!",
    ex2body: "Agar A berada di O(0,0), maka absis = 0 dan ordinat = 0:",
    ex2absis: "Absis:",
    ex2ordinat: "Ordinat:",
    ex2ans: "✅",
    ex2check: "Cek: A(2(2)−4, 3(−2)+6) = A(0, 0) ✓",
    ex3q: "Titik",
    ex3q2: "berada di sumbu-y (bukan di titik asal). Tentukan nilai",
    ex3q3: "dan koordinat titik",
    ex3q4: "!",
    ex3body: "Titik di sumbu-y → absis = 0, tapi ordinat ≠ 0:",
    ex3absisReq: "Syarat absis = 0:",
    ex3ordinatCheck: "Cek ordinat dengan",
    ex3notOrigin: "(Ordinat ≠ 0, jadi titik memang di sumbu-y, bukan di titik asal)",
    ex3ans: "✅",
    ex3ansBody: ", sehingga",
    ex3check: "Cek: absis",
    ex3check2: "· ordinat",
    ex3onAxis: "Titik P berada di sumbu-y, bagian positif.",
    rangHeader: "📌 Rangkuman",
    rangTerms: [
      ["Koordinat P(x,y)", "Pasangan terurut (absis, ordinat) yang menyatakan posisi titik P"],
      ["Absis (x)", "Posisi horizontal — jarak ke sumbu-y"],
      ["Ordinat (y)", "Posisi vertikal — jarak ke sumbu-x"],
      ["Titik asal O", "(0,0) — perpotongan kedua sumbu"],
      ["Kuadran I", "x > 0, y > 0 (kanan atas)"],
      ["Kuadran II", "x < 0, y > 0 (kiri atas)"],
      ["Kuadran III", "x < 0, y < 0 (kiri bawah)"],
      ["Kuadran IV", "x > 0, y < 0 (kanan bawah)"],
    ],
    thTerm: "Istilah", thDesc: "Penjelasan",
    rangTip: "Hafalan Kuadran:",
    rangTipBody: "Mulai dari Kuadran I (kanan atas) lalu putar berlawanan jarum jam → II → III → IV. Tanda koordinatnya: (+,+) → (−,+) → (−,−) → (+,−)",
    rangkumanJudul: "Rangkuman — Unsur-Unsur Diagram Kartesius",
    rangkumanSubjudul: "Semua yang perlu kamu kuasai tentang bidang koordinat Kartesius",
    r1judul: "Sumbu X & Sumbu Y", r1isi: "Sumbu X adalah garis mendatar (horizontal), Sumbu Y adalah garis tegak (vertikal). Keduanya berpotongan tegak lurus di titik asal O(0,0).",
    r2judul: "Empat Kuadran", r2isi: "Kuadran I(+,+) → II(−,+) → III(−,−) → IV(+,−). Urutan berlawanan jarum jam mulai dari kanan atas.",
    r3judul: "Koordinat (x, y)", r3isi: "Absis (x) adalah jarak ke sumbu Y, dibaca pertama. Ordinat (y) adalah jarak ke sumbu X, dibaca kedua. Penulisan: P(absis, ordinat).",
    r4judul: "Jarak ke Sumbu", r4isi: "Jarak titik P(x,y) ke sumbu X = |y|. Jarak ke sumbu Y = |x|. Titik di sumbu X → y=0. Titik di sumbu Y → x=0.",
    tip1: <>"Datar = X, Tegak = Y" — Sumbu X seperti <strong>hor</strong>izon (mendatar), Sumbu Y seperti tiang yang <strong>tegak</strong> lurus ke atas.</>,
    tip2: "Hafal tanda kuadran dengan putaran berlawanan jarum jam: I(+,+) → II(−,+) → III(−,−) → IV(+,−). Mulai selalu dari kanan atas!",
    tip3: "Titik di sumbu X selalu y = 0. Titik di sumbu Y selalu x = 0. Titik di origin O: x = 0 dan y = 0 sekaligus.",
    tip4: <>Urutan penulisan: <strong>P(absis, ordinat)</strong> = P(x, y). Absis (mendatar) SELALU ditulis pertama sebelum ordinat (tegak).</>,
    kesimpulan: "Sistem koordinat Kartesius adalah bahasa universal sains dan teknologi — dari geometri, fisika, pemrograman, hingga animasi komputer dan GPS. René Descartes menyatukan aljabar dan geometri dalam satu sistem yang mengubah dunia matematika selamanya!",
    back: "← Kembali ke Koordinat Kartesius",
    rumusLabel1: "Jarak ke Sumbu X:", rumusLabel2: "Jarak ke Sumbu Y:",
  },
  en: {
    pageTitle: "ELEMENTS OF THE CARTESIAN DIAGRAM",
    pageSubtitle: "Coordinate Map — The Universal Language of Mathematics!",
    breadcrumb: "Grade 8 · Cartesian Coordinates · Math Material",
    introHeader: "🌟 From GPS to Mathematics — Coordinates Are Everywhere!",
    introBody: "When you share your location via Google Maps, you are actually sharing two numbers: latitude and longitude. That is the concept of",
    introEmph: "coordinates",
    introBody2: "! In mathematics, we use the",
    introEmph2: "Cartesian Diagram",
    introBody3: "— a number map system created by French philosopher René Descartes — to precisely determine the position of every point on a plane.",
    imgCaption: "Coordinates on a smartphone — the principle is exactly the same as the Cartesian Diagram!",
    imgSrc: "Image source",
    introFact: "Cool fact:",
    introFactBody: "The name \"Cartesian\" comes from the Latin name of René Descartes (Renatus Cartesius). According to legend, the idea for the coordinate system came to him while lying in bed, observing a fly on the ceiling. He thought: how can I precisely determine that fly's position? 🪰",
    unsurHeader: "📘 Main Components of the Cartesian Diagram",
    unsurIntisari: "🎯 Key Summary",
    unsurBody: "The Cartesian diagram consists of two number lines perpendicular to each other. Every point on the Cartesian plane is expressed by a number pair",
    unsurEmph: "(x, y)",
    unsurBody2: "called",
    unsurEmph2: "coordinates",
    unsurComp: [
      { nama: "X-axis (Abscissa)", icon: "→", desc: "Horizontal line. Positive values to the right, negative to the left.", warna: "border-cyan-500/40 bg-cyan-900/30 text-cyan-200" },
      { nama: "Y-axis (Ordinate)", icon: "↑", desc: "Vertical line. Positive values upward, negative downward.", warna: "border-green-500/40 bg-green-900/30 text-green-200" },
      { nama: "Origin", icon: "O", desc: "Intersection of the x-axis and y-axis. Its coordinates are always (0, 0).", warna: "border-white/30 bg-slate-700/40 text-white/80" },
      { nama: "Abscissa (x-coordinate)", icon: "x", desc: "Distance of the point to the y-axis, measured parallel to the x-axis. First number in (x, y).", warna: "border-violet-500/40 bg-violet-900/30 text-violet-200" },
      { nama: "Ordinate (y-coordinate)", icon: "y", desc: "Distance of the point to the x-axis, measured parallel to the y-axis. Second number in (x, y).", warna: "border-pink-500/40 bg-pink-900/30 text-pink-200" },
    ],
    coordNote: "How to write the coordinates of a point:",
    coordWarn: "⚠️ The order is always x first, then y! Don't mix them up.",
    kuadranHeader: "🧭 Four Quadrants — Regions of the Cartesian Plane",
    kuadranBody: "The x-axis and y-axis divide the Cartesian plane into",
    kuadranEmph: "4 regions",
    kuadranBody2: "called quadrants, numbered with Roman numerals I, II, III, IV counterclockwise:",
    kuadranData: [
      { roman: "I", pos: "Upper Right", example: "A(3, 4)" },
      { roman: "II", pos: "Upper Left", example: "B(−2, 3)" },
      { roman: "III", pos: "Lower Left", example: "C(−3, −2)" },
      { roman: "IV", pos: "Lower Right", example: "D(2, −4)" },
    ],
    kuadranLabel: "Quadrant",
    contohLabel: "Example:",
    axisHeader: "📍 Points on the Axes (not in any quadrant):",
    axisSumbux: "Points on the",
    axisSumbuxEmph: "x-axis",
    axisSumbuxSuffix: ": ordinate = 0, e.g. E(5, 0)",
    axisSumbuy: "Points on the",
    axisSumbuyEmph: "y-axis",
    axisSumbuySuffix: ": abscissa = 0, e.g. F(0, −3)",
    axisOrigin: "Origin O",
    axisOriginSuffix: ": coordinates (0, 0), not in any quadrant",
    ex1Header: "✏️ Example 1 — Easy",
    ex2Header: "✏️ Example 2 — Medium",
    ex3Header: "✏️ Example 3 — Hard",
    badge_easy: "EASY",
    badge_med: "MEDIUM",
    badge_hard: "HARD",
    soal: "📝 Problem",
    pembahasan: "🔍 Solution",
    ex1q: "Determine the coordinates (abscissa and ordinate) of each point below, and state which quadrant each point is in:",
    thPoint: "Point", thAbsis: "Abscissa (x)", thOrdinat: "Ordinate (y)", thKuadran: "Quadrant",
    tableData: [
      ["P(4, 7)", "4 (positive)", "7 (positive)", "I (+, +)"],
      ["Q(−5, 2)", "−5 (negative)", "2 (positive)", "II (−, +)"],
      ["R(−1, −6)", "−1 (negative)", "−6 (negative)", "III (−, −)"],
      ["S(3, −3)", "3 (positive)", "−3 (negative)", "IV (+, −)"],
    ],
    ex1ans: "✅ P → Quadrant I, Q → Quadrant II, R → Quadrant III, S → Quadrant IV",
    ex2q: "Given point",
    ex2q2: ". Find the values of",
    ex2q3: "and",
    ex2q4: "so that point A is exactly at the origin O(0, 0)!",
    ex2body: "For A to be at O(0,0), abscissa = 0 and ordinate = 0:",
    ex2absis: "Abscissa:",
    ex2ordinat: "Ordinate:",
    ex2ans: "✅",
    ex2check: "Check: A(2(2)−4, 3(−2)+6) = A(0, 0) ✓",
    ex3q: "Point",
    ex3q2: "lies on the y-axis (not at the origin). Find the value of",
    ex3q3: "and the coordinates of point",
    ex3q4: "!",
    ex3body: "Point on y-axis → abscissa = 0, but ordinate ≠ 0:",
    ex3absisReq: "Condition abscissa = 0:",
    ex3ordinatCheck: "Check ordinate with",
    ex3notOrigin: "(Ordinate ≠ 0, so the point is indeed on the y-axis, not at the origin)",
    ex3ans: "✅",
    ex3ansBody: ", so",
    ex3check: "Check: abscissa",
    ex3check2: "· ordinate",
    ex3onAxis: "Point P is on the positive y-axis.",
    rangHeader: "📌 Summary",
    rangTerms: [
      ["Coordinates P(x,y)", "Ordered pair (abscissa, ordinate) representing the position of point P"],
      ["Abscissa (x)", "Horizontal position — distance to the y-axis"],
      ["Ordinate (y)", "Vertical position — distance to the x-axis"],
      ["Origin O", "(0,0) — intersection of both axes"],
      ["Quadrant I", "x > 0, y > 0 (upper right)"],
      ["Quadrant II", "x < 0, y > 0 (upper left)"],
      ["Quadrant III", "x < 0, y < 0 (lower left)"],
      ["Quadrant IV", "x > 0, y < 0 (lower right)"],
    ],
    thTerm: "Term", thDesc: "Explanation",
    rangTip: "Quadrant Memory Aid:",
    rangTipBody: "Start from Quadrant I (upper right) then rotate counterclockwise → II → III → IV. Signs: (+,+) → (−,+) → (−,−) → (+,−)",
    rangkumanJudul: "Summary — Elements of the Cartesian Diagram",
    rangkumanSubjudul: "Everything you need to master about the Cartesian coordinate plane",
    r1judul: "X-axis & Y-axis", r1isi: "The X-axis is a horizontal line, the Y-axis is a vertical line. They intersect perpendicularly at the origin O(0,0).",
    r2judul: "Four Quadrants", r2isi: "Quadrant I(+,+) → II(−,+) → III(−,−) → IV(+,−). Order is counterclockwise starting from the upper right.",
    r3judul: "Coordinates (x, y)", r3isi: "Abscissa (x) is the distance to the Y-axis, read first. Ordinate (y) is the distance to the X-axis, read second. Written as: P(abscissa, ordinate).",
    r4judul: "Distance to Axes", r4isi: "Distance from point P(x,y) to X-axis = |y|. Distance to Y-axis = |x|. Point on X-axis → y=0. Point on Y-axis → x=0.",
    tip1: <>"Horizontal = X, Vertical = Y" — The X-axis is like the <strong>hor</strong>izon (flat), the Y-axis stands <strong>vertically</strong> upright.</>,
    tip2: "Memorize quadrant signs counterclockwise: I(+,+) → II(−,+) → III(−,−) → IV(+,−). Always start from the upper right!",
    tip3: "Points on the X-axis always have y = 0. Points on the Y-axis always have x = 0. Point at origin O: both x = 0 and y = 0.",
    tip4: <>Writing order: <strong>P(abscissa, ordinate)</strong> = P(x, y). Abscissa (horizontal) is ALWAYS written first before the ordinate (vertical).</>,
    kesimpulan: "The Cartesian coordinate system is the universal language of science and technology — from geometry, physics, programming, to computer animation and GPS. René Descartes united algebra and geometry in one system that changed the world of mathematics forever!",
    back: "← Back to Cartesian Coordinates",
    rumusLabel1: "Distance to X-axis:", rumusLabel2: "Distance to Y-axis:",
  },
  ja: {
    pageTitle: "直交座標の要素",
    pageSubtitle: "座標の地図 — 数学の共通言語！",
    breadcrumb: "中学2年 · 直交座標 · 数学教材",
    introHeader: "🌟 GPSから数学へ — 座標はどこにでもある！",
    introBody: "Google マップで友達に場所を共有するとき、実際には2つの数字（緯度と経度）を共有しています。これが",
    introEmph: "座標",
    introBody2: "の概念です！数学では、フランスの哲学者ルネ・デカルトが作った",
    introEmph2: "直交座標系（デカルト座標系）",
    introBody3: "を使って、平面上のすべての点の位置を正確に決定します。",
    imgCaption: "スマートフォンの座標 — 直交座標と全く同じ原理！",
    imgSrc: "画像ソース",
    introFact: "豆知識：",
    introFactBody: "「デカルト座標系」の名前は、ルネ・デカルト（ラテン名：Renatus Cartesius）から来ています。伝説によると、ベッドに横になって天井のハエを観察しているときに座標の考えが浮かんだそうです。「あのハエの位置を正確に表すには？」と考えたのが始まりです。🪰",
    unsurHeader: "📘 直交座標の主要成分",
    unsurIntisari: "🎯 要点まとめ",
    unsurBody: "直交座標は互いに垂直な2本の数直線からなります。直交座標平面上のすべての点は数の組",
    unsurEmph: "(x, y)",
    unsurBody2: "で表され、これを",
    unsurEmph2: "座標",
    unsurComp: [
      { nama: "x軸（横軸）", icon: "→", desc: "水平の直線。正の方向は右、負の方向は左。", warna: "border-cyan-500/40 bg-cyan-900/30 text-cyan-200" },
      { nama: "y軸（縦軸）", icon: "↑", desc: "垂直の直線。正の方向は上、負の方向は下。", warna: "border-green-500/40 bg-green-900/30 text-green-200" },
      { nama: "原点", icon: "O", desc: "x軸とy軸の交点。座標は常に(0, 0)。", warna: "border-white/30 bg-slate-700/40 text-white/80" },
      { nama: "x座標（横座標）", icon: "x", desc: "y軸までの距離（x軸に平行に測定）。座標の組の最初の数字。", warna: "border-violet-500/40 bg-violet-900/30 text-violet-200" },
      { nama: "y座標（縦座標）", icon: "y", desc: "x軸までの距離（y軸に平行に測定）。座標の組の2番目の数字。", warna: "border-pink-500/40 bg-pink-900/30 text-pink-200" },
    ],
    coordNote: "点の座標の書き方：",
    coordWarn: "⚠️ 順序は常にxが先、次にy！間違えないように。",
    kuadranHeader: "🧭 4つの象限 — 直交座標の領域",
    kuadranBody: "x軸とy軸は直交座標平面を",
    kuadranEmph: "4つの領域",
    kuadranBody2: "（象限）に分けます。ローマ数字Ⅰ、Ⅱ、Ⅲ、Ⅳで反時計回りに番号付け：",
    kuadranData: [
      { roman: "I", pos: "右上", example: "A(3, 4)" },
      { roman: "II", pos: "左上", example: "B(−2, 3)" },
      { roman: "III", pos: "左下", example: "C(−3, −2)" },
      { roman: "IV", pos: "右下", example: "D(2, −4)" },
    ],
    kuadranLabel: "第",
    contohLabel: "例：",
    axisHeader: "📍 軸上の点（どの象限にも属さない）：",
    axisSumbux: "",
    axisSumbuxEmph: "x軸",
    axisSumbuxSuffix: "上の点：y座標 = 0、例 E(5, 0)",
    axisSumbuy: "",
    axisSumbuyEmph: "y軸",
    axisSumbuySuffix: "上の点：x座標 = 0、例 F(0, −3)",
    axisOrigin: "原点O",
    axisOriginSuffix: "：座標(0, 0)、どの象限にも属さない",
    ex1Header: "✏️ 例題1 — 基本",
    ex2Header: "✏️ 例題2 — 標準",
    ex3Header: "✏️ 例題3 — 発展",
    badge_easy: "基本",
    badge_med: "標準",
    badge_hard: "発展",
    soal: "📝 問題",
    pembahasan: "🔍 解説",
    ex1q: "次の各点のx座標・y座標を求め、どの象限にあるかを答えなさい：",
    thPoint: "点", thAbsis: "x座標", thOrdinat: "y座標", thKuadran: "象限",
    tableData: [
      ["P(4, 7)", "4（正）", "7（正）", "第Ⅰ象限(+,+)"],
      ["Q(−5, 2)", "−5（負）", "2（正）", "第Ⅱ象限(−,+)"],
      ["R(−1, −6)", "−1（負）", "−6（負）", "第Ⅲ象限(−,−)"],
      ["S(3, −3)", "3（正）", "−3（負）", "第Ⅳ象限(+,−)"],
    ],
    ex1ans: "✅ P → 第Ⅰ象限、Q → 第Ⅱ象限、R → 第Ⅲ象限、S → 第Ⅳ象限",
    ex2q: "点",
    ex2q2: "が与えられています。点Aがちょうど原点O(0, 0)にある場合、",
    ex2q3: "と",
    ex2q4: "の値を求めなさい！",
    ex2body: "A が O(0,0) になるには、x座標 = 0 かつ y座標 = 0：",
    ex2absis: "x座標：",
    ex2ordinat: "y座標：",
    ex2ans: "✅",
    ex2check: "確認：A(2(2)−4, 3(−2)+6) = A(0, 0) ✓",
    ex3q: "点",
    ex3q2: "がy軸上にある（原点ではない）場合、",
    ex3q3: "の値と点",
    ex3q4: "の座標を求めなさい！",
    ex3body: "y軸上の点 → x座標 = 0、ただし y座標 ≠ 0：",
    ex3absisReq: "x座標 = 0 の条件：",
    ex3ordinatCheck: "で y座標を確認：",
    ex3notOrigin: "（y座標 ≠ 0 なので、点は確かにy軸上にあり、原点ではない）",
    ex3ans: "✅",
    ex3ansBody: "、よって",
    ex3check: "確認：x座標",
    ex3check2: "・y座標",
    ex3onAxis: "点Pはy軸の正の部分にある。",
    rangHeader: "📌 まとめ",
    rangTerms: [
      ["座標P(x,y)", "点Pの位置を表す順序付きの組(x座標, y座標)"],
      ["x座標", "水平方向の位置 — y軸までの距離"],
      ["y座標", "垂直方向の位置 — x軸までの距離"],
      ["原点O", "(0,0) — 両軸の交点"],
      ["第Ⅰ象限", "x > 0, y > 0（右上）"],
      ["第Ⅱ象限", "x < 0, y > 0（左上）"],
      ["第Ⅲ象限", "x < 0, y < 0（左下）"],
      ["第Ⅳ象限", "x > 0, y < 0（右下）"],
    ],
    thTerm: "用語", thDesc: "説明",
    rangTip: "象限の覚え方：",
    rangTipBody: "第Ⅰ象限（右上）から反時計回り → Ⅱ → Ⅲ → Ⅳ。符号：(+,+) → (−,+) → (−,−) → (+,−)",
    rangkumanJudul: "まとめ — 直交座標の要素",
    rangkumanSubjudul: "直交座標平面について必要なすべてのことを習得しよう",
    r1judul: "x軸とy軸", r1isi: "x軸は水平な直線、y軸は垂直な直線です。両方が原点O(0,0)で垂直に交わります。",
    r2judul: "4つの象限", r2isi: "第Ⅰ象限(+,+) → Ⅱ(−,+) → Ⅲ(−,−) → Ⅳ(+,−)。右上から反時計回りの順序。",
    r3judul: "座標(x, y)", r3isi: "x座標はy軸までの距離で最初に読む。y座標はx軸までの距離で2番目に読む。書き方：P(x座標, y座標)。",
    r4judul: "軸までの距離", r4isi: "点P(x,y)からx軸への距離 = |y|。y軸への距離 = |x|。x軸上の点 → y=0。y軸上の点 → x=0。",
    tip1: <>"水平 = X、垂直 = Y" — x軸は地平線のように<strong>水平</strong>、y軸は柱のように<strong>垂直</strong>に立っています。</>,
    tip2: "象限の符号を反時計回りで覚える：Ⅰ(+,+) → Ⅱ(−,+) → Ⅲ(−,−) → Ⅳ(+,−)。常に右上から始める！",
    tip3: "x軸上の点は常にy = 0。y軸上の点は常にx = 0。原点Oでは x = 0 かつ y = 0。",
    tip4: <>書き方の順序：<strong>P(x座標, y座標)</strong>。x座標（水平）は常にy座標（垂直）の前に書く。</>,
    kesimpulan: "デカルト座標系は科学と技術の共通言語です — 幾何学、物理学、プログラミング、コンピュータアニメーション、GPSまで。ルネ・デカルトは代数学と幾何学を一つのシステムに統合し、数学の世界を永遠に変えました！",
    back: "← 直交座標に戻る",
    rumusLabel1: "x軸までの距離：", rumusLabel2: "y軸までの距離：",
  },
};

const UnsurUnsurCartesiusPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "unsur", "kuadran", "contoh1", "contoh2", "contoh3", "rangkuman",
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

  const CoordGrid = () => {
    const points = [
      { x: 3, y: 4, label: "A(3,4)", color: "bg-cyan-400", textColor: "text-cyan-300" },
      { x: -2, y: 3, label: "B(–2,3)", color: "bg-green-400", textColor: "text-green-300" },
      { x: -3, y: -2, label: "C(–3,–2)", color: "bg-yellow-400", textColor: "text-yellow-300" },
      { x: 2, y: -4, label: "D(2,–4)", color: "bg-pink-400", textColor: "text-pink-300" },
    ];
    const size = 6; const cellPx = 22; const total = size * 2;
    const toCell = (v: number) => v + size;

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative border border-white/20 rounded-lg overflow-hidden"
          style={{ width: total * cellPx, height: total * cellPx, background: "rgba(15,23,42,0.8)" }}>
          {Array.from({ length: total + 1 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="absolute" style={{ left: i * cellPx, top: 0, width: 1, height: total * cellPx, background: i === size ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)" }} />
              <div className="absolute" style={{ top: i * cellPx, left: 0, height: 1, width: total * cellPx, background: i === size ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)" }} />
            </React.Fragment>
          ))}
          <span className="absolute text-white/60 font-mono" style={{ right: 2, top: size * cellPx - 14, fontSize: 9 }}>+x</span>
          <span className="absolute text-white/60 font-mono" style={{ left: 2, top: size * cellPx - 14, fontSize: 9 }}>−x</span>
          <span className="absolute text-white/60 font-mono" style={{ left: size * cellPx + 3, top: 2, fontSize: 9 }}>+y</span>
          <span className="absolute text-white/60 font-mono" style={{ left: size * cellPx + 3, bottom: 2, fontSize: 9 }}>−y</span>
          <span className="absolute font-bold opacity-30 text-white" style={{ left: size * cellPx + 6, top: 6, fontSize: 10 }}>I</span>
          <span className="absolute font-bold opacity-30 text-white" style={{ right: size * cellPx - 4 + 8, top: 6, fontSize: 10 }}>II</span>
          <span className="absolute font-bold opacity-30 text-white" style={{ right: size * cellPx - 4 + 4, bottom: 6, fontSize: 10 }}>III</span>
          <span className="absolute font-bold opacity-30 text-white" style={{ left: size * cellPx + 6, bottom: 6, fontSize: 10 }}>IV</span>
          {points.map(({ x, y, label, color, textColor }) => (
            <div key={label}>
              <div className={`absolute rounded-full ${color} border-2 border-white/80 z-10`}
                style={{ width: 8, height: 8, left: toCell(x) * cellPx - 4, top: toCell(-y) * cellPx - 4 }} />
              <span className={`absolute font-mono font-bold z-10 ${textColor}`}
                style={{ fontSize: 8, left: toCell(x) * cellPx + 5, top: toCell(-y) * cellPx - 10, whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {points.map(({ label, color, textColor }) => (
            <span key={label} className="flex items-center gap-1 text-xs font-mono">
              <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
              <span className={textColor}>{label}</span>
            </span>
          ))}
        </div>
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
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introBody} <strong className="text-cyan-300">{t.introEmph}</strong>{t.introBody2} <strong className="text-cyan-300">{t.introEmph2}</strong> {t.introBody3}
                </p>
                <div className="flex flex-col items-center gap-2">
                  <img src="/koordinat-maps.png" alt="Koordinat GPS pada smartphone"
                    className="rounded-xl w-full max-w-xs border border-cyan-500/30 shadow-lg" />
                  <p className="text-[11px] text-white/45 font-body text-center">
                    {t.imgCaption}{" "}
                    <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">
                      {t.imgSrc}
                    </a>
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.introFact}</strong> {t.introFactBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* UNSUR-UNSUR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="unsur" icon={<Grid className="w-5 h-5" />} iconColor="text-cyan-400" title={t.unsurHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.unsurIntisari}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.unsurBody} <strong className="text-cyan-300">{t.unsurEmph}</strong> {t.unsurBody2} <strong className="text-cyan-300">{t.unsurEmph2}</strong>{language === "ja" ? "と呼びます。" : "."}
                  </p>
                </div>
                <CartesianDragAnimation />
                <div className="space-y-2 text-sm font-body">
                  {t.unsurComp.map(({ nama, warna, icon, desc }) => (
                    <div key={nama} className={`border ${warna} rounded-lg px-4 py-2 flex gap-3 items-start`}>
                      <span className="font-display font-bold text-sm w-6 h-6 flex items-center justify-center rounded bg-white/10 shrink-0">{icon}</span>
                      <div>
                        <p className="font-semibold">{nama}</p>
                        <p className="text-white/60 text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 text-sm font-body text-center">
                  <p className="text-white/60 text-xs mb-1">{t.coordNote}</p>
                  <BlockMath math="P(x, y) \quad \rightarrow \quad x = \text{absis}, \quad y = \text{ordinat}" />
                  <p className="text-yellow-300 text-xs mt-1">{t.coordWarn}</p>
                </div>
              </div>
            )}
          </div>

          {/* KUADRAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kuadran" icon={<Grid className="w-5 h-5" />} iconColor="text-violet-400" title={t.kuadranHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80">
                  {t.kuadranBody} <strong className="text-violet-300">{t.kuadranEmph}</strong> {t.kuadranBody2}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-body">
                  {[
                    { roman: t.kuadranData[0].roman, pos: t.kuadranData[0].pos, x: "+", y: "+", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200", example: t.kuadranData[0].example },
                    { roman: t.kuadranData[1].roman, pos: t.kuadranData[1].pos, x: "−", y: "+", color: "bg-green-900/40 border-green-500/40 text-green-200", example: t.kuadranData[1].example },
                    { roman: t.kuadranData[2].roman, pos: t.kuadranData[2].pos, x: "−", y: "−", color: "bg-yellow-900/40 border-yellow-500/40 text-yellow-200", example: t.kuadranData[2].example },
                    { roman: t.kuadranData[3].roman, pos: t.kuadranData[3].pos, x: "+", y: "−", color: "bg-pink-900/40 border-pink-500/40 text-pink-200", example: t.kuadranData[3].example },
                  ].map(({ roman, pos, x, y, color, example }) => (
                    <div key={roman} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display font-bold text-lg mb-1">{t.kuadranLabel}{roman}</p>
                      <p className="text-white/70">{pos}</p>
                      <p className="font-mono mt-1"><InlineMath math={`x ${x === "+" ? "> 0" : "< 0"}`} />, <InlineMath math={`y ${y === "+" ? "> 0" : "< 0"}`} /></p>
                      <p className="text-white/50 mt-1">{t.contohLabel} {example}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 text-sm font-body">
                  <p className="text-violet-300 font-semibold mb-1">{t.axisHeader}</p>
                  <div className="space-y-1 text-xs text-white/70">
                    <p>• {t.axisSumbux} <strong className="text-cyan-300">{t.axisSumbuxEmph}</strong>{t.axisSumbuxSuffix}</p>
                    <p>• {t.axisSumbuy} <strong className="text-green-300">{t.axisSumbuyEmph}</strong>{t.axisSumbuySuffix}</p>
                    <p>• <strong className="text-white">{t.axisOrigin}</strong>{t.axisOriginSuffix}</p>
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
                  <p className="font-body text-sm text-white/85">
                    {t.ex1q}<br />
                    a) <InlineMath math="P(4, 7)" />, b) <InlineMath math="Q(-5, 2)" />, c) <InlineMath math="R(-1, -6)" />, d) <InlineMath math="S(3, -3)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-cyan-900/40">
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">{t.thPoint}</th>
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">{t.thAbsis}</th>
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">{t.thOrdinat}</th>
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">{t.thKuadran}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.tableData.map(([pt, x, y, k], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                            <td className="border border-white/10 px-3 py-2 text-white font-semibold">{pt}</td>
                            <td className="border border-white/10 px-3 py-2 text-cyan-300">{x}</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300">{y}</td>
                            <td className="border border-white/10 px-3 py-2 text-violet-300 font-bold">{k}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex1ans}</p>
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
                    {t.ex2q} <InlineMath math="A(2a-4,\ 3b+6)" />{t.ex2q2} <InlineMath math="a" /> {t.ex2q3} <InlineMath math="b" /> {t.ex2q4}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 mb-1">{t.ex2body}</p>
                      <p className="text-cyan-300 font-semibold">{t.ex2absis}</p>
                      <BlockMath math="2a - 4 = 0 \Rightarrow 2a = 4 \Rightarrow a = 2" />
                      <p className="text-green-300 font-semibold">{t.ex2ordinat}</p>
                      <BlockMath math="3b + 6 = 0 \Rightarrow 3b = -6 \Rightarrow b = -2" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex2ans} <InlineMath math="a = 2" /> {language === "ja" ? "かつ" : "dan"} <InlineMath math="b = -2" /></p>
                      <p className="text-white/60 text-xs mt-1">{t.ex2check}</p>
                    </div>
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
                    {t.ex3q} <InlineMath math="P(3a - 9,\ 2a + 4)" /> {t.ex3q2} <InlineMath math="a" /> {t.ex3q3} <InlineMath math="P" />{t.ex3q4}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 mb-1">{t.ex3body}</p>
                      <p className="text-cyan-300 font-semibold">{t.ex3absisReq}</p>
                      <BlockMath math="3a - 9 = 0 \Rightarrow 3a = 9 \Rightarrow a = 3" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.ex3ordinatCheck} <InlineMath math="a = 3" />{language === "ja" ? "：" : ":"}</p>
                      <BlockMath math="\text{ordinat} = 2(3) + 4 = 6 + 4 = 10 \neq 0 \quad \checkmark" />
                      <p className="text-white/50 text-xs mt-1">{t.ex3notOrigin}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex3ans} <InlineMath math="a = 3" />{t.ex3ansBody} <InlineMath math="P(0,\ 10)" /></p>
                      <p className="text-white/60 text-xs">{t.ex3check} <InlineMath math="= 3(3) - 9 = 0" /> ✓ {t.ex3check2} <InlineMath math="= 2(3) + 4 = 10" /> ✓</p>
                      <p className="text-white/60 text-xs">{t.ex3onAxis}</p>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-cyan-900/40">
                      <th className="border border-white/10 px-3 py-2 text-cyan-200">{t.thTerm}</th>
                      <th className="border border-white/10 px-3 py-2 text-cyan-200">{t.thDesc}</th>
                    </tr></thead>
                    <tbody>
                      {t.rangTerms.map(([term, desc], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{term}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-xs"><strong>💡 {t.rangTip}</strong> {t.rangTipBody}</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RANGKUMAN ═══ */}
          <RangkumanSection
            gradientFrom="from-cyan-600" gradientVia="via-sky-600" gradientTo="to-blue-700"
            borderColor="border-cyan-500/30" accentColor="text-cyan-200"
            headerIcon="📋" judul={t.rangkumanJudul} subjudul={t.rangkumanSubjudul}
            ringkasan={[
              { emoji:"📍", judul: t.r1judul, bg:"bg-cyan-900/40", border:"border-cyan-500/30", textColor:"text-cyan-300", isi: t.r1isi },
              { emoji:"🗺️", judul: t.r2judul, bg:"bg-sky-900/40", border:"border-sky-500/30", textColor:"text-sky-300", isi: t.r2isi },
              { emoji:"📌", judul: t.r3judul, bg:"bg-indigo-900/40", border:"border-indigo-500/30", textColor:"text-indigo-300", isi: t.r3isi },
              { emoji:"📏", judul: t.r4judul, bg:"bg-blue-900/40", border:"border-blue-500/30", textColor:"text-blue-300", isi: t.r4isi },
            ]}
            rumus={[
              { label: t.rumusLabel1, rumus:"d = |y_P|", bg:"bg-cyan-900/30", border:"border-cyan-500/25", labelColor:"text-cyan-300" },
              { label: t.rumusLabel2, rumus:"d = |x_P|", bg:"bg-sky-900/30", border:"border-sky-500/25", labelColor:"text-sky-300" },
            ]}
            tips={[
              { emoji:"🧠", teks: t.tip1 },
              { emoji:"⭐", teks: t.tip2 },
              { emoji:"✅", teks: t.tip3 },
              { emoji:"📐", teks: t.tip4 },
            ]}
            kesimpulan={t.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
            kesimpulanBorder="border-cyan-400/40"
            kesimpulanTextColor="text-cyan-100/90"
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

export default UnsurUnsurCartesiusPage;
