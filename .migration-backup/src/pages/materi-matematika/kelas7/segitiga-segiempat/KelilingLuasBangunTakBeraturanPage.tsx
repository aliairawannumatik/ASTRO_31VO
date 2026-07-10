import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ══════════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════════ */
const translations = {
  id: {
    title1: "KELILING DAN LUAS",
    title2: "BANGUN TAK BERATURAN",
    breadcrumb: "Kelas 7 · Segitiga dan Segiempat",
    back: "← Kembali ke Segitiga dan Segiempat",
    introA: "Tidak semua bidang tanah atau ruangan berbentuk persegi panjang sempurna! Banyak bentuk di dunia nyata yang",
    introIrregular: "tidak beraturan",
    introB: "— ada lekukan, tonjolan, sudut ganjil, dan sisi tersembunyi. Di sini kita akan belajar cara cerdas menghitung",
    introPerimeter: "keliling",
    introAnd: "dan",
    introArea: "luas",
    introC: "bangun-bangun tak beraturan tersebut. Perhatikan bagian yang",
    introBlink: "berkedip",
    introD: "pada setiap gambar — itulah bagian yang sedang kita hitung!",
    // Section titles
    sec1: "Keliling Bangun Tak Beraturan",
    sec2: "Luas Bangun Tak Beraturan",
    // Section 1
    s1p1: "Bangun tak beraturan adalah bangun datar yang sisinya tidak semuanya sama panjang dan tidak punya pola simetri yang baku — seperti potongan lahan tanah, denah ruangan berbentuk huruf L atau U, atau peta wilayah yang tidak beraturan.",
    s1boxTitle: "💡 Inti Konsep Keliling Bangun Tak Beraturan",
    s1boxP: "Meskipun bentuknya \"tidak standar\", cara menghitung kelilingnya tetap sama:",
    s1boxHighlight: "jumlahkan semua sisi yang membentuk bangun tersebut",
    s1boxEnd: ". Sisi-sisi yang bersinar pada ilustrasi di bawah menunjukkan bagian mana yang dihitung!",
    s1formulaNote: "Di mana",
    s1formulaEnd: "adalah panjang setiap sisi bangun.",
    s1svgLegend: "K = a + b + c + d + e + f  ← semua sisi bersinar!",
    s1stepTitle: "🔑 Langkah Menghitung Keliling:",
    s1step1a: "Identifikasi",
    s1step1b: "semua sisi bangun (termasuk sisi yang \"tersembunyi\" di sudut).",
    s1step2a: "Ukur atau cari",
    s1step2b: "panjang setiap sisi yang belum diketahui menggunakan hubungan geometris.",
    s1step3a: "Jumlahkan",
    s1step3b: "semua sisi yang sudah diketahui.",
    s1tip: "📌 Trik Sisi Tersembunyi:",
    s1tipText: "Pada bangun berbentuk huruf L, ada sisi yang panjangnya tidak langsung tertera. Gunakan hubungan: sisi tersembunyi = selisih atau jumlah sisi-sisi yang sejajar dengannya.",
    // Section 2
    s2p1a: "Menghitung luas bangun tak beraturan memerlukan sedikit kreativitas — kita perlu",
    s2decompose: "memecah (dekomposisi)",
    s2p1b: "bangun itu menjadi beberapa bangun sederhana yang kita sudah tahu rumus luasnya!",
    s2stratTitle: "💡 Dua Strategi Utama:",
    s2strat1: "① Dekomposisi (Pecah Jadi Bagian)",
    s2strat1text: "Bagi bangun tak beraturan menjadi beberapa persegi panjang, segitiga, atau bangun lain yang sudah dikenal. Hitung luas masing-masing, lalu jumlahkan.",
    s2strat2: "② Komplemen (Kurangi dari Bangun Besar)",
    s2strat2text: "Bayangkan bangun tak beraturan sebagai bangun besar dikurangi bagian yang \"dipotong\". Hitung luas bangun besar, kurangi luas bagian yang dipotong.",
    s2stepTitle: "🔑 Langkah Menghitung Luas:",
    s2step1a: "Gambarlah garis bantu",
    s2step1b: "untuk memisahkan bangun menjadi bagian-bagian yang lebih sederhana.",
    s2step2a: "Tentukan dimensi",
    s2step2b: "tiap bagian (panjang, lebar, tinggi, dll.).",
    s2step3a: "Hitung luas",
    s2step3b: "tiap bagian menggunakan rumus yang sesuai.",
    s2step4a: "Jumlahkan atau kurangkan",
    s2step4b: "sesuai strategi yang dipilih.",
    // SVG labels
    svgPart1: "Bagian I",
    svgPart2: "Bagian II",
    svgCutHere: "potong di sini",
    // Examples UI
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    showSolution: "Lihat Pembahasan",
    hideSolution: "Sembunyikan Pembahasan",
    step: "Langkah",
    kelilingHeader: "📏 Contoh Soal — KELILING",
    kelilingSubtitle: "Perhatikan sisi yang berkedip pada setiap gambar",
    luasHeader: "🟦 Contoh Soal — LUAS",
    luasSubtitle: "Perhatikan bagian yang berkedip pada setiap gambar",
    prefixKeliling: "KELILING",
    prefixLuas: "LUAS",
    // Keliling example 1
    kex1q: "Perhatikan bangun datar berbentuk huruf",
    kex1qL: "L",
    kex1qEnd: "berikut:",
    kex1q2: "Tentukan keliling bangun tersebut!",
    kex1s1: "Langkah 1 — Identifikasi semua sisi:",
    kex1sides: ["Sisi atas (a) = 6 cm", "Sisi turun kanan atas (b) = 3 cm", "Sisi kanan atas mendatar (c) = 6 cm (= 12 − 6)", "Sisi kanan panjang (d) = 6 cm", "Sisi bawah (e) = 12 cm", "Sisi kiri (f) = 9 cm (= 3 + 6)"],
    kex1s2: "Langkah 2 — Jumlahkan semua sisi:",
    kex1ans: "✅ Jawaban: Keliling",
    kex1tip: "💡 Cek sisi tersembunyi: sisi mendatar c = 12 − 6 = 6 cm, sisi tegak f = 3 + 6 = 9 cm ✓",
    // Keliling example 2
    kex2q: "Sebuah kolam renang memiliki denah berbentuk huruf",
    kex2qL: "U",
    kex2qEnd: "seperti gambar berikut:",
    kex2q2: "Hitung keliling bangun tersebut!",
    kex2s1: "Langkah 1 — Daftar semua sisi bangun U:",
    kex2sides: ["Sisi kiri atas = 5 cm", "Sisi turun kiri dalam = 3 cm", "Sisi mendatar dalam = 4 cm", "Sisi naik kanan dalam = 3 cm", "Sisi kanan atas = 5 cm", "Sisi kanan panjang = 9,5 cm", "Sisi bawah = 14 cm", "Sisi kiri panjang = 9,5 cm"],
    kex2s2: "Langkah 2 — Jumlahkan:",
    kex2ans: "✅ Jawaban: Keliling",
    kex2chk: "✅ Cek: Jumlah sisi kanan + kiri = 9,5 + 9,5 = 19 cm = total tinggi bangun ✓",
    // Keliling example 3
    kex3q: "Sebuah kavling tanah berbentuk segi-7 tak beraturan dengan ukuran sisi sebagai berikut:",
    kex3li: ["AB = 14 m", "BC = 8,5 m", "CD = 10 m", "DE = 15 m", "EF = ? (perlu dihitung)", "FG = 12 m", "GA = 10,6 m"],
    kex3note: "Diketahui bahwa EF tegak lurus, proyeksi horizontalnya 4 m dan vertikalnya 7 m, sehingga",
    kex3q2: "Tentukan keliling kavling tersebut!",
    kex3s1: "Langkah 1 — Hitung sisi EF yang belum diketahui:",
    kex3s2: "Langkah 2 — Jumlahkan semua sisi:",
    kex3ans: "✅ Jawaban:",
    kex3a1: "• EF =",
    kex3a2: "• Keliling kavling",
    kex3tip: "🔑 Kunci:",
    kex3tipText: "Sisi yang tidak diketahui bisa ditemukan dengan Teorema Pythagoras jika kita tahu komponen horizontal dan vertikalnya.",
    // Luas example 1
    lex1q: "Hitung luas bangun berbentuk huruf",
    lex1qL: "L",
    lex1qEnd: "berikut (bagian yang menyala adalah bagian yang dihitung):",
    lex1parts: ["Bagian atas (hijau): panjang 6 cm, lebar 4 cm", "Bagian bawah (biru): panjang 13 cm, lebar 5 cm"],
    lex1s1: "Langkah 1 — Hitung L₁ (bagian atas):",
    lex1s2: "Langkah 2 — Hitung L₂ (bagian bawah):",
    lex1s3: "Langkah 3 — Jumlahkan:",
    lex1ans: "✅ Jawaban: Luas",
    // Luas example 2
    lex2q: "Sebuah denah ruangan berbentuk siku-L kompleks dipecah menjadi 3 bagian seperti gambar (perhatikan bagian yang berkedip):",
    lex2parts: ["Bagian I (oranye): panjang 5 cm, tinggi 10 cm", "Bagian II (kuning): panjang 4 cm, tinggi 4 cm", "Bagian III (ungu): panjang 5 cm, tinggi 5 cm"],
    lex2q2: "Hitung total luas denah tersebut!",
    lex2s1: "Langkah 1 — Hitung setiap bagian:",
    lex2s2: "Langkah 2 — Jumlahkan total luas:",
    lex2ans: "✅ Jawaban: Luas total",
    lex2tip: "💡 Semakin kompleks bangunnya, semakin banyak bagian yang kita pecah — tapi cara kerjanya tetap sama: hitung luas tiap bagian lalu jumlahkan!",
    // Luas example 3
    lex3q: "Sebuah taman berbentuk huruf T akan ditanami rumput dan diberi pagar. Perhatikan dua bagian yang berkedip pada gambar:",
    lex3parts: ["Bagian atas (merah): panjang 14 cm, tinggi 3 cm", "Bagian bawah (biru): panjang 5 cm, tinggi 7 cm"],
    lex3context: "Jika harga rumput Rp25.000/cm² dan pagar Rp8.000/cm, berapa total biaya yang dibutuhkan?",
    lex3s1: "Langkah 1 — Hitung luas tiap bagian:",
    lex3s2: "Langkah 2 — Hitung keliling bangun T:",
    lex3s2p: "Sisi-sisi bangun T (mulai dari pojok kiri atas, searah jarum jam):",
    lex3s3: "Langkah 3 — Hitung total biaya:",
    lex3ans: "✅ Jawaban:",
    lex3a1: "• Luas taman",
    lex3a2: "• Keliling taman",
    lex3a3: "• Total biaya",
    lex3tip: "🔑 Soal gabungan seperti ini",
    lex3tipText: "menguji kemampuan menghitung keliling dan luas sekaligus, lalu mengaplikasikannya ke konteks nyata (biaya).",
  },
  en: {
    title1: "PERIMETER AND AREA",
    title2: "OF IRREGULAR SHAPES",
    breadcrumb: "Grade 7 · Triangles & Quadrilaterals",
    back: "← Back to Triangles & Quadrilaterals",
    introA: "Not all land plots or rooms are perfect rectangles! Many real-world shapes are",
    introIrregular: "irregular",
    introB: "— with notches, protrusions, odd angles, and hidden sides. Here we'll learn smart ways to calculate the",
    introPerimeter: "perimeter",
    introAnd: "and",
    introArea: "area",
    introC: "of these irregular shapes. Pay attention to the parts that",
    introBlink: "blink",
    introD: "in each figure — those are the parts being calculated!",
    sec1: "Perimeter of Irregular Shapes",
    sec2: "Area of Irregular Shapes",
    s1p1: "An irregular shape is a flat figure whose sides are not all equal and has no standard symmetry pattern — like a land plot, an L- or U-shaped room layout, or an irregular map region.",
    s1boxTitle: "💡 Core Concept: Perimeter of Irregular Shapes",
    s1boxP: "Even though the shape is \"non-standard\", the method for finding its perimeter remains the same:",
    s1boxHighlight: "add up all the sides that form the shape",
    s1boxEnd: ". The glowing sides in the illustration below show which parts are being counted!",
    s1formulaNote: "Where",
    s1formulaEnd: "are the lengths of each side of the shape.",
    s1svgLegend: "P = a + b + c + d + e + f  ← all sides glow!",
    s1stepTitle: "🔑 Steps to Find the Perimeter:",
    s1step1a: "Identify",
    s1step1b: "all sides of the shape (including \"hidden\" sides at corners).",
    s1step2a: "Measure or find",
    s1step2b: "the length of any unknown side using geometric relationships.",
    s1step3a: "Add",
    s1step3b: "all the known sides together.",
    s1tip: "📌 Hidden Side Trick:",
    s1tipText: "In L-shaped figures, some side lengths are not directly labeled. Use the relationship: hidden side = difference or sum of the parallel sides.",
    s2p1a: "Calculating the area of an irregular shape requires a bit of creativity — we need to",
    s2decompose: "decompose",
    s2p1b: "the shape into simpler figures whose area formulas we already know!",
    s2stratTitle: "💡 Two Main Strategies:",
    s2strat1: "① Decomposition (Break into Parts)",
    s2strat1text: "Divide the irregular shape into rectangles, triangles, or other familiar shapes. Calculate each area, then add them up.",
    s2strat2: "② Complement (Subtract from a Larger Shape)",
    s2strat2text: "Imagine the irregular shape as a large shape minus a \"cut-out\" part. Calculate the large area, then subtract the cut-out area.",
    s2stepTitle: "🔑 Steps to Find the Area:",
    s2step1a: "Draw helper lines",
    s2step1b: "to separate the shape into simpler parts.",
    s2step2a: "Determine the dimensions",
    s2step2b: "of each part (length, width, height, etc.).",
    s2step3a: "Calculate the area",
    s2step3b: "of each part using the appropriate formula.",
    s2step4a: "Add or subtract",
    s2step4b: "according to the chosen strategy.",
    svgPart1: "Part I",
    svgPart2: "Part II",
    svgCutHere: "cut here",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
    step: "Step",
    kelilingHeader: "📏 Example Problems — PERIMETER",
    kelilingSubtitle: "Watch the blinking sides in each figure",
    luasHeader: "🟦 Example Problems — AREA",
    luasSubtitle: "Watch the blinking parts in each figure",
    prefixKeliling: "PERIMETER",
    prefixLuas: "AREA",
    kex1q: "Look at the",
    kex1qL: "L",
    kex1qEnd: "-shaped figure below:",
    kex1q2: "Find the perimeter of the shape.",
    kex1s1: "Step 1 — Identify all sides:",
    kex1sides: ["Top side (a) = 6 cm", "Upper right drop (b) = 3 cm", "Upper right horizontal (c) = 6 cm (= 12 − 6)", "Long right side (d) = 6 cm", "Bottom side (e) = 12 cm", "Left side (f) = 9 cm (= 3 + 6)"],
    kex1s2: "Step 2 — Add all sides:",
    kex1ans: "✅ Answer: Perimeter",
    kex1tip: "💡 Check hidden sides: horizontal c = 12 − 6 = 6 cm, vertical f = 3 + 6 = 9 cm ✓",
    kex2q: "A swimming pool has a",
    kex2qL: "U",
    kex2qEnd: "-shaped floor plan as shown:",
    kex2q2: "Calculate the perimeter of the shape.",
    kex2s1: "Step 1 — List all sides of the U-shape:",
    kex2sides: ["Upper left side = 5 cm", "Left inner drop = 3 cm", "Inner horizontal = 4 cm", "Right inner rise = 3 cm", "Upper right side = 5 cm", "Long right side = 9.5 cm", "Bottom side = 14 cm", "Long left side = 9.5 cm"],
    kex2s2: "Step 2 — Add up:",
    kex2ans: "✅ Answer: Perimeter",
    kex2chk: "✅ Check: Right + left sides = 9.5 + 9.5 = 19 cm = total height of shape ✓",
    kex3q: "A 7-sided irregular land plot has the following side lengths:",
    kex3li: ["AB = 14 m", "BC = 8.5 m", "CD = 10 m", "DE = 15 m", "EF = ? (to be calculated)", "FG = 12 m", "GA = 10.6 m"],
    kex3note: "EF is perpendicular, with horizontal projection 4 m and vertical projection 7 m, so",
    kex3q2: "Find the perimeter of the plot.",
    kex3s1: "Step 1 — Calculate the unknown side EF:",
    kex3s2: "Step 2 — Add all sides:",
    kex3ans: "✅ Answer:",
    kex3a1: "• EF =",
    kex3a2: "• Perimeter of plot",
    kex3tip: "🔑 Key:",
    kex3tipText: "An unknown side can be found using the Pythagorean Theorem if we know its horizontal and vertical components.",
    lex1q: "Calculate the area of the",
    lex1qL: "L",
    lex1qEnd: "-shaped figure below (glowing parts are being calculated):",
    lex1parts: ["Upper part (green): length 6 cm, width 4 cm", "Lower part (blue): length 13 cm, width 5 cm"],
    lex1s1: "Step 1 — Calculate A₁ (upper part):",
    lex1s2: "Step 2 — Calculate A₂ (lower part):",
    lex1s3: "Step 3 — Add them up:",
    lex1ans: "✅ Answer: Area",
    lex2q: "A complex L-shaped room plan is decomposed into 3 parts (watch the blinking parts):",
    lex2parts: ["Part I (orange): length 5 cm, height 10 cm", "Part II (yellow): length 4 cm, height 4 cm", "Part III (purple): length 5 cm, height 5 cm"],
    lex2q2: "Calculate the total area of the plan.",
    lex2s1: "Step 1 — Calculate each part:",
    lex2s2: "Step 2 — Add the total area:",
    lex2ans: "✅ Answer: Total area",
    lex2tip: "💡 The more complex the shape, the more parts we break it into — but the method stays the same: calculate each part then add them up!",
    lex3q: "A T-shaped garden will be seeded with grass and fenced. Look at the two blinking parts:",
    lex3parts: ["Upper part (red): length 14 cm, height 3 cm", "Lower part (blue): length 5 cm, height 7 cm"],
    lex3context: "If grass costs IDR 25,000/cm² and fencing costs IDR 8,000/cm, what is the total cost needed?",
    lex3s1: "Step 1 — Calculate each part's area:",
    lex3s2: "Step 2 — Calculate the perimeter of the T-shape:",
    lex3s2p: "Sides of the T-shape (starting from top-left corner, clockwise):",
    lex3s3: "Step 3 — Calculate total cost:",
    lex3ans: "✅ Answer:",
    lex3a1: "• Garden area",
    lex3a2: "• Garden perimeter",
    lex3a3: "• Total cost",
    lex3tip: "🔑 Combined problems like this",
    lex3tipText: "test the ability to calculate both perimeter and area, then apply them to a real-world context (cost).",
  },
  ja: {
    title1: "不規則な図形の",
    title2: "周長と面積",
    breadcrumb: "中学1年 · 三角形と四角形",
    back: "← 三角形と四角形に戻る",
    introA: "すべての土地や部屋が完全な長方形であるとは限りません！現実の多くの形は",
    introIrregular: "不規則",
    introB: "です——くぼみ、突起、変わった角、隠れた辺があります。ここでは、不規則な図形の",
    introPerimeter: "周長",
    introAnd: "と",
    introArea: "面積",
    introC: "を賢く計算する方法を学びます。各図の",
    introBlink: "点滅している",
    introD: "部分に注目してください——それが計算している部分です！",
    sec1: "不規則な図形の周長",
    sec2: "不規則な図形の面積",
    s1p1: "不規則な図形とは、すべての辺が等しくなく、標準的な対称性のパターンがない平面図形です——土地の区画、L字型やU字型の部屋の間取り、不規則な地図の地域などが例として挙げられます。",
    s1boxTitle: "💡 不規則な図形の周長の核心概念",
    s1boxP: "形が「非標準」であっても、周長を求める方法は変わりません：",
    s1boxHighlight: "図形を構成するすべての辺を足し合わせる",
    s1boxEnd: "。下のイラストで光っている辺が、計算される部分を示しています！",
    s1formulaNote: "ここで",
    s1formulaEnd: "は図形の各辺の長さです。",
    s1svgLegend: "P = a + b + c + d + e + f  ← すべての辺が光る！",
    s1stepTitle: "🔑 周長の計算手順：",
    s1step1a: "確認する",
    s1step1b: "図形のすべての辺（角の「隠れた」辺を含む）。",
    s1step2a: "求める",
    s1step2b: "幾何学的な関係を使って、未知の辺の長さを測るか求める。",
    s1step3a: "合計する",
    s1step3b: "すべての既知の辺を足し合わせる。",
    s1tip: "📌 隠れた辺のコツ：",
    s1tipText: "L字型の図形では、一部の辺の長さが直接表示されていません。関係式を使う：隠れた辺 = 平行する辺の差または和。",
    s2p1a: "不規則な図形の面積を計算するには少し創造性が必要です——図形を",
    s2decompose: "分解",
    s2p1b: "して、面積公式がわかっている単純な図形に分ける必要があります！",
    s2stratTitle: "💡 2つの主な戦略：",
    s2strat1: "① 分解（部分に分ける）",
    s2strat1text: "不規則な図形を長方形、三角形、またはその他の既知の図形に分ける。各面積を計算し、合計する。",
    s2strat2: "② 補完（大きな図形から引く）",
    s2strat2text: "不規則な図形を、大きな図形から「切り取られた」部分を引いたものと考える。大きな面積を計算し、切り取られた面積を引く。",
    s2stepTitle: "🔑 面積の計算手順：",
    s2step1a: "補助線を引く",
    s2step1b: "図形をより単純な部分に分けるために。",
    s2step2a: "各部分の寸法を決める",
    s2step2b: "（長さ、幅、高さなど）。",
    s2step3a: "各部分の面積を計算する",
    s2step3b: "適切な公式を使って。",
    s2step4a: "足すか引く",
    s2step4b: "選んだ戦略に従って。",
    svgPart1: "部分I",
    svgPart2: "部分II",
    svgCutHere: "ここで切る",
    easy: "基本", medium: "標準", hard: "発展",
    showSolution: "解説を見る",
    hideSolution: "解説を隠す",
    step: "ステップ",
    kelilingHeader: "📏 例題 — 周長",
    kelilingSubtitle: "各図の点滅している辺に注目してください",
    luasHeader: "🟦 例題 — 面積",
    luasSubtitle: "各図の点滅している部分に注目してください",
    prefixKeliling: "周長",
    prefixLuas: "面積",
    kex1q: "以下の",
    kex1qL: "L",
    kex1qEnd: "字型の図形を見てください：",
    kex1q2: "図形の周長を求めなさい。",
    kex1s1: "ステップ1 — すべての辺を確認する：",
    kex1sides: ["上辺 (a) = 6 cm", "右上の縦下り (b) = 3 cm", "右上の横 (c) = 6 cm (= 12 − 6)", "右の長い辺 (d) = 6 cm", "下辺 (e) = 12 cm", "左辺 (f) = 9 cm (= 3 + 6)"],
    kex1s2: "ステップ2 — すべての辺を合計する：",
    kex1ans: "✅ 答え：周長",
    kex1tip: "💡 隠れた辺を確認：横 c = 12 − 6 = 6 cm、縦 f = 3 + 6 = 9 cm ✓",
    kex2q: "U字型の間取りを持つプールがあります",
    kex2qL: "U",
    kex2qEnd: "（下図参照）：",
    kex2q2: "図形の周長を計算しなさい。",
    kex2s1: "ステップ1 — U字型のすべての辺を列挙する：",
    kex2sides: ["左上の辺 = 5 cm", "左内側の縦下り = 3 cm", "内側の横 = 4 cm", "右内側の縦上り = 3 cm", "右上の辺 = 5 cm", "右の長い辺 = 9.5 cm", "下辺 = 14 cm", "左の長い辺 = 9.5 cm"],
    kex2s2: "ステップ2 — 合計する：",
    kex2ans: "✅ 答え：周長",
    kex2chk: "✅ 確認：右 + 左辺 = 9.5 + 9.5 = 19 cm = 図形の全高 ✓",
    kex3q: "7辺の不規則な土地の区画で、各辺の長さは次のとおりです：",
    kex3li: ["AB = 14 m", "BC = 8.5 m", "CD = 10 m", "DE = 15 m", "EF = ?（計算が必要）", "FG = 12 m", "GA = 10.6 m"],
    kex3note: "EFは垂直で、水平方向の射影が4 m、垂直方向の射影が7 m であることがわかっているので、",
    kex3q2: "区画の周長を求めなさい。",
    kex3s1: "ステップ1 — 未知の辺EFを計算する：",
    kex3s2: "ステップ2 — すべての辺を合計する：",
    kex3ans: "✅ 答え：",
    kex3a1: "• EF =",
    kex3a2: "• 区画の周長",
    kex3tip: "🔑 ポイント：",
    kex3tipText: "未知の辺は、水平・垂直成分がわかれば三平方の定理で求められます。",
    lex1q: "以下の",
    lex1qL: "L",
    lex1qEnd: "字型の図形の面積を計算しなさい（光っている部分が計算対象）：",
    lex1parts: ["上の部分（緑）：長さ6 cm、幅4 cm", "下の部分（青）：長さ13 cm、幅5 cm"],
    lex1s1: "ステップ1 — A₁（上の部分）を計算する：",
    lex1s2: "ステップ2 — A₂（下の部分）を計算する：",
    lex1s3: "ステップ3 — 合計する：",
    lex1ans: "✅ 答え：面積",
    lex2q: "複雑なL字型の間取りが3つの部分に分解されています（点滅している部分に注目）：",
    lex2parts: ["部分I（オレンジ）：長さ5 cm、高さ10 cm", "部分II（黄色）：長さ4 cm、高さ4 cm", "部分III（紫）：長さ5 cm、高さ5 cm"],
    lex2q2: "間取りの総面積を計算しなさい。",
    lex2s1: "ステップ1 — 各部分を計算する：",
    lex2s2: "ステップ2 — 総面積を合計する：",
    lex2ans: "✅ 答え：総面積",
    lex2tip: "💡 図形が複雑なほど、分ける部分が多くなりますが、方法は同じです：各部分の面積を計算して合計する！",
    lex3q: "T字型の公園に芝生を植え、柵を設けます。図の2つの点滅している部分に注目してください：",
    lex3parts: ["上の部分（赤）：長さ14 cm、高さ3 cm", "下の部分（青）：長さ5 cm、高さ7 cm"],
    lex3context: "芝生の費用が25,000円/cm²、柵の費用が8,000円/cmの場合、必要な総費用はいくらですか？",
    lex3s1: "ステップ1 — 各部分の面積を計算する：",
    lex3s2: "ステップ2 — T字型の周長を計算する：",
    lex3s2p: "T字型の辺（左上の角から時計回り）：",
    lex3s3: "ステップ3 — 総費用を計算する：",
    lex3ans: "✅ 答え：",
    lex3a1: "• 公園の面積",
    lex3a2: "• 公園の周長",
    lex3a3: "• 総費用",
    lex3tip: "🔑 このような複合問題は",
    lex3tipText: "周長と面積の両方を計算し、実生活の文脈（費用）に応用する能力を問います。",
  },
};

/* ══════════════════════════════════════════════════════════
   ANIMATED SVG COMPONENTS
══════════════════════════════════════════════════════════ */
const KelilingAnimatedSVG = ({ legend }: { legend: string }) => (
  <svg viewBox="0 0 340 260" className="w-full max-w-sm mx-auto my-3" aria-label="Animated perimeter of irregular L-shape">
    <defs>
      <style>{`
        @keyframes periGlow {
          0%   { stroke-opacity: 1;   filter: drop-shadow(0 0 6px #22d3ee); }
          50%  { stroke-opacity: 0.25; filter: drop-shadow(0 0 0px #22d3ee); }
          100% { stroke-opacity: 1;   filter: drop-shadow(0 0 6px #22d3ee); }
        }
        .peri-anim { animation: periGlow 1.6s ease-in-out infinite; }
        @keyframes labelPop { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .label-anim { animation: labelPop 1.6s ease-in-out infinite; }
      `}</style>
    </defs>
    {[0,1,2,3,4,5,6].map(i => (
      <line key={`gh${i}`} x1="30" y1={30+i*34} x2="310" y2={30+i*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}
    {[0,1,2,3,4,5,6,7,8].map(i => (
      <line key={`gv${i}`} x1={30+i*35} y1="30" x2={30+i*35} y2={30+6*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}
    <polygon points="30,30 170,30 170,98 310,98 310,234 30,234" fill="rgba(30,41,59,0.7)" stroke="none"/>
    <polygon points="30,30 170,30 170,98 310,98 310,234 30,234"
      fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinejoin="round" className="peri-anim"/>
    {[[30,30],[170,30],[170,98],[310,98],[310,234],[30,234]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="5" fill="#22d3ee" opacity="0.85"/>
    ))}
    <text x="100" y="22" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">a</text>
    <text x="178" y="68" fill="#facc15" fontSize="12" fontFamily="monospace" className="label-anim">b</text>
    <text x="240" y="91" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">c</text>
    <text x="318" y="166" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">d</text>
    <text x="170" y="248" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">e</text>
    <text x="22" y="136" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" className="label-anim">f</text>
    <rect x="30" y="245" width="280" height="18" rx="4" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="0.8"/>
    <text x="170" y="257" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">{legend}</text>
  </svg>
);

const LuasAnimatedSVG = ({ part1: labelPart1, part2: labelPart2, cutHere }: { part1: string; part2: string; cutHere: string }) => (
  <svg viewBox="0 0 340 270" className="w-full max-w-sm mx-auto my-3" aria-label="Animated area of irregular shape — fill pulses">
    <defs>
      <style>{`
        @keyframes areaGlow { 0% { fill-opacity: 0.55; } 50% { fill-opacity: 0.12; } 100% { fill-opacity: 0.55; } }
        .area-anim { animation: areaGlow 1.8s ease-in-out infinite; }
        @keyframes decompLine { 0%, 100% { opacity: 0.9; } 50% { opacity: 0.3; } }
        .decomp-anim { animation: decompLine 1.8s ease-in-out infinite; }
      `}</style>
    </defs>
    {[0,1,2,3,4,5,6].map(i => (
      <line key={`gh${i}`} x1="30" y1={30+i*34} x2="310" y2={30+i*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}
    {[0,1,2,3,4,5,6,7,8].map(i => (
      <line key={`gv${i}`} x1={30+i*35} y1="30" x2={30+i*35} y2={30+6*34} stroke="#1e293b" strokeWidth="0.7"/>
    ))}
    <rect x="30" y="30" width="140" height="68" fill="#4ade80" className="area-anim" rx="2"/>
    <rect x="30" y="98" width="280" height="136" fill="#22d3ee" className="area-anim" rx="2"/>
    <polygon points="30,30 170,30 170,98 310,98 310,234 30,234"
      fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinejoin="round" opacity="0.6"/>
    <line x1="30" y1="98" x2="170" y2="98" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3" className="decomp-anim"/>
    <text x="100" y="70" fill="#052e16" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{labelPart1}</text>
    <text x="170" y="172" fill="#083344" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{labelPart2}</text>
    <text x="100" y="22" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">4 sat</text>
    <text x="2"  y="68" fill="#4ade80" fontSize="10" fontFamily="monospace">2</text>
    <text x="240" y="91" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">4 sat</text>
    <text x="316" y="170" fill="#22d3ee" fontSize="10" fontFamily="monospace">4</text>
    <rect x="30" y="242" width="130" height="22" rx="4" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1"/>
    <text x="95" y="256" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle">L₁ = p₁ × l₁</text>
    <rect x="175" y="242" width="130" height="22" rx="4" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
    <text x="240" y="256" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">L₂ = p₂ × l₂</text>
    <text x="100" y="97" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">{cutHere}</text>
  </svg>
);

/* Example SVGs (numeric labels — no translation needed) */
const ContohKelilingMudahSVG = () => (
  <svg viewBox="0 0 300 220" className="w-full max-w-xs mx-auto my-2" aria-label="L-shape perimeter easy example">
    <defs><style>{`@keyframes pm1{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.2;}}.pm1{animation:pm1 1.5s ease-in-out infinite;}`}</style></defs>
    <polygon points="20,20 140,20 140,80 260,80 260,200 20,200" fill="rgba(34,211,238,0.07)" stroke="none"/>
    <polygon points="20,20 140,20 140,80 260,80 260,200 20,200" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinejoin="round" className="pm1"/>
    {[[20,20],[140,20],[140,80],[260,80],[260,200],[20,200]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="4" fill="#22d3ee" opacity="0.8"/>))}
    <text x="80" y="14" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="148" y="54" fill="#facc15" fontSize="11" fontFamily="monospace">3 cm</text>
    <text x="200" y="74" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="268" y="144" fill="#facc15" fontSize="11" fontFamily="monospace">6 cm</text>
    <text x="140" y="215" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">12 cm</text>
    <text x="2" y="114" fill="#facc15" fontSize="11" fontFamily="monospace">9 cm</text>
  </svg>
);

const ContohKelilingSedangSVG = () => (
  <svg viewBox="0 0 320 230" className="w-full max-w-xs mx-auto my-2" aria-label="U-shape perimeter medium example">
    <defs><style>{`@keyframes pm2{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.2;}}.pm2{animation:pm2 1.5s ease-in-out infinite;}`}</style></defs>
    <polygon points="20,20 120,20 120,80 200,80 200,20 300,20 300,210 20,210" fill="rgba(167,139,250,0.07)" stroke="none"/>
    <polygon points="20,20 120,20 120,80 200,80 200,20 300,20 300,210 20,210" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinejoin="round" className="pm2"/>
    {[[20,20],[120,20],[120,80],[200,80],[200,20],[300,20],[300,210],[20,210]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="4" fill="#a78bfa" opacity="0.85"/>))}
    <text x="70"  y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
    <text x="128" y="54" fill="#facc15" fontSize="10" fontFamily="monospace">3 cm</text>
    <text x="160" y="74" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">4 cm</text>
    <text x="208" y="54" fill="#facc15" fontSize="10" fontFamily="monospace">3 cm</text>
    <text x="250" y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
    <text x="308" y="118" fill="#facc15" fontSize="10" fontFamily="monospace">9,5 cm</text>
    <text x="160" y="224" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="2"   y="118" fill="#facc15" fontSize="10" fontFamily="monospace">9,5 cm</text>
  </svg>
);

const ContohKelilingSulitSVG = () => (
  <svg viewBox="0 0 320 240" className="w-full max-w-xs mx-auto my-2" aria-label="7-sided irregular perimeter hard example">
    <defs><style>{`@keyframes pm3{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 5px #f87171);}50%{stroke-opacity:0.25;filter:drop-shadow(0 0 0px #f87171);}}.pm3{animation:pm3 1.5s ease-in-out infinite;}`}</style></defs>
    <polygon points="80,20 220,20 280,80 280,180 200,220 60,200 20,100" fill="rgba(248,113,113,0.07)" stroke="none"/>
    <polygon points="80,20 220,20 280,80 280,180 200,220 60,200 20,100" fill="none" stroke="#f87171" strokeWidth="3" strokeLinejoin="round" className="pm3"/>
    {[[80,20],[220,20],[280,80],[280,180],[200,220],[60,200],[20,100]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="4" fill="#f87171" opacity="0.85"/>))}
    <text x="150" y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">AB=14</text>
    <text x="258" y="52" fill="#facc15" fontSize="10" fontFamily="monospace">BC=8,5</text>
    <text x="286" y="134" fill="#facc15" fontSize="10" fontFamily="monospace">CD=10</text>
    <text x="130" y="222" fill="#facc15" fontSize="10" fontFamily="monospace">DE=15</text>
    <text x="22" y="218" fill="#facc15" fontSize="10" fontFamily="monospace">EF=?</text>
    <text x="4"  y="158" fill="#facc15" fontSize="10" fontFamily="monospace">FG=12</text>
    <text x="22" y="62"  fill="#facc15" fontSize="10" fontFamily="monospace">GA=10,6</text>
    <text x="60" y="108" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">K=?</text>
  </svg>
);

const ContohLuasMudahSVG = ({ cutHere }: { cutHere: string }) => (
  <svg viewBox="0 0 300 220" className="w-full max-w-xs mx-auto my-2" aria-label="L-shape area easy example">
    <defs><style>{`@keyframes la1{0%,100%{fill-opacity:0.5;}50%{fill-opacity:0.1;}}.la1{animation:la1 1.8s ease-in-out infinite;}.la2{animation:la1 1.8s ease-in-out infinite 0.4s;}`}</style></defs>
    <rect x="20" y="20" width="120" height="80" fill="#4ade80" className="la1" rx="2"/>
    <rect x="20" y="100" width="260" height="100" fill="#22d3ee" className="la2" rx="2"/>
    <polygon points="20,20 140,20 140,100 280,100 280,200 20,200" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5"/>
    <line x1="20" y1="100" x2="140" y2="100" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="80" y="14" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="2" y="66" fill="#4ade80" fontSize="10" fontFamily="monospace">4 cm</text>
    <text x="150" y="97" fill="#94a3b8" fontSize="9" fontFamily="monospace">{cutHere}</text>
    <text x="80" y="65" fill="#052e16" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₁</text>
    <text x="150" y="155" fill="#083344" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₂</text>
    <text x="150" y="212" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">13 cm</text>
    <text x="288" y="155" fill="#22d3ee" fontSize="10" fontFamily="monospace">5 cm</text>
  </svg>
);

const ContohLuasSedangSVG = () => (
  <svg viewBox="0 0 320 240" className="w-full max-w-xs mx-auto my-2" aria-label="L-plus area medium example">
    <defs><style>{`@keyframes lb1{0%,100%{fill-opacity:0.5;}50%{fill-opacity:0.08;}}.lb1{animation:lb1 1.8s ease-in-out infinite;}.lb2{animation:lb1 1.8s ease-in-out infinite 0.6s;}.lb3{animation:lb1 1.8s ease-in-out infinite 1.2s;}`}</style></defs>
    <rect x="20" y="20" width="100" height="200" fill="#fb923c" className="lb1" rx="2"/>
    <rect x="120" y="20" width="80" height="80" fill="#facc15" className="lb2" rx="2"/>
    <rect x="200" y="100" width="100" height="120" fill="#a78bfa" className="lb3" rx="2"/>
    <polygon points="20,20 200,20 200,100 300,100 300,220 120,220 120,100 20,100" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5"/>
    <line x1="120" y1="20" x2="120" y2="100" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="120" y1="100" x2="200" y2="100" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="70" y="118" fill="#c2410c" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₁</text>
    <text x="160" y="65" fill="#713f12" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₂</text>
    <text x="250" y="165" fill="#4c1d95" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₃</text>
    <text x="70" y="14" fill="#fb923c" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
    <text x="160" y="14" fill="#facc15" fontSize="10" fontFamily="monospace" textAnchor="middle">4 cm</text>
    <text x="308" y="163" fill="#a78bfa" fontSize="10" fontFamily="monospace">5 cm</text>
    <text x="4" y="65" fill="#fb923c" fontSize="10" fontFamily="monospace">10</text>
    <text x="4" y="168" fill="#fb923c" fontSize="9" fontFamily="monospace">cm</text>
  </svg>
);

const ContohLuasSulitSVG = () => (
  <svg viewBox="0 0 320 240" className="w-full max-w-xs mx-auto my-2" aria-label="T-shape area hard example">
    <defs><style>{`@keyframes lc1{0%,100%{fill-opacity:0.45;}50%{fill-opacity:0.08;}}.lc1{animation:lc1 1.8s ease-in-out infinite;}.lc2{animation:lc1 1.8s ease-in-out infinite 0.9s;}`}</style></defs>
    <rect x="20" y="20" width="280" height="60" fill="#f87171" className="lc1" rx="2"/>
    <rect x="110" y="80" width="100" height="140" fill="#22d3ee" className="lc2" rx="2"/>
    <polygon points="20,20 300,20 300,80 210,80 210,220 110,220 110,80 20,80" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5"/>
    <line x1="20" y1="80" x2="300" y2="80" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="160" y="56" fill="#7f1d1d" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₁</text>
    <text x="160" y="158" fill="#083344" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L₂</text>
    <text x="160" y="14" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="2" y="54" fill="#f87171" fontSize="10" fontFamily="monospace">3 cm</text>
    <text x="218" y="158" fill="#22d3ee" fontSize="10" fontFamily="monospace">7 cm</text>
    <text x="150" y="232" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">5 cm</text>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   ACCORDION & CARD COMPONENTS
══════════════════════════════════════════════════════════ */
type SectionData = { title: string; icon: string; content: React.ReactNode };

const AccordionSection = ({ section, idx }: { section: SectionData; idx: number }) => {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => { playPopSound(); setOpen(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <span className="font-display text-sm font-semibold text-white">{section.title}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0"/> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0"/>}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border/50">
          <div className="pt-4">{section.content}</div>
        </div>
      )}
    </div>
  );
};

type ExampleData = {
  level: string; color: string; bg: string; border: string; badgeBg: string;
  question: React.ReactNode; answer: React.ReactNode;
};

const ExampleCard = ({ ex, idx, prefix, showLabel, hideLabel }: {
  ex: ExampleData; idx: number; prefix: string; showLabel: string; hideLabel: string;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button
        onClick={() => { playPopSound(); setShowAnswer(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50"
      >
        <span className={`text-xs font-semibold font-body ${ex.color}`}>
          {showAnswer ? hideLabel : showLabel}
        </span>
        {showAnswer ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {showAnswer && (
        <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">
          {ex.answer}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const KelilingLuasBangunTakBeraturanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const sections: SectionData[] = [
    {
      title: t.sec1,
      icon: "📏",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s1p1}</p>
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">{t.s1boxTitle}</p>
            <p>
              {t.s1boxP}{" "}
              <strong className="text-yellow-300">{t.s1boxHighlight}</strong>
              {t.s1boxEnd}
            </p>
            <div className="bg-cyan-950/70 rounded p-3 text-center">
              <BlockMath math="K = s_1 + s_2 + s_3 + \cdots + s_n" />
            </div>
            <p className="text-white/60 text-xs">
              {t.s1formulaNote} <InlineMath math="s_1, s_2, \ldots, s_n" /> {t.s1formulaEnd}
            </p>
          </div>

          <KelilingAnimatedSVG legend={t.s1svgLegend} />

          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-slate-300">
            <p className="text-white font-semibold">{t.s1stepTitle}</p>
            <p>1. <strong className="text-cyan-300">{t.s1step1a}</strong> {t.s1step1b}</p>
            <p>2. <strong className="text-yellow-300">{t.s1step2a}</strong> {t.s1step2b}</p>
            <p>3. <strong className="text-green-300">{t.s1step3a}</strong> {t.s1step3b}</p>
          </div>

          <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
            {t.s1tip} {t.s1tipText}
          </blockquote>
        </div>
      ),
    },
    {
      title: t.sec2,
      icon: "🟦",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {t.s2p1a} <strong className="text-green-300">{t.s2decompose}</strong> {t.s2p1b}
          </p>

          <LuasAnimatedSVG part1={t.svgPart1} part2={t.svgPart2} cutHere={t.svgCutHere} />

          <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4 space-y-2">
            <p className="text-green-300 font-semibold">{t.s2stratTitle}</p>
            <div className="space-y-3">
              <div className="bg-green-950/50 rounded p-3 space-y-1">
                <p className="text-green-300 font-semibold text-xs">{t.s2strat1}</p>
                <p className="text-white/70 text-xs">{t.s2strat1text}</p>
                <div className="bg-green-950/70 rounded p-2 text-center mt-1">
                  <BlockMath math="L_{\text{total}} = L_1 + L_2 + L_3 + \cdots" />
                </div>
              </div>
              <div className="bg-cyan-950/50 rounded p-3 space-y-1">
                <p className="text-cyan-300 font-semibold text-xs">{t.s2strat2}</p>
                <p className="text-white/70 text-xs">{t.s2strat2text}</p>
                <div className="bg-cyan-950/70 rounded p-2 text-center mt-1">
                  <BlockMath math="L_{\text{total}} = L_{\text{besar}} - L_{\text{dipotong}}" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p className="text-white font-semibold">{t.s2stepTitle}</p>
            <p>1. <strong className="text-green-300">{t.s2step1a}</strong> {t.s2step1b}</p>
            <p>2. <strong className="text-yellow-300">{t.s2step2a}</strong> {t.s2step2b}</p>
            <p>3. <strong className="text-violet-300">{t.s2step3a}</strong> {t.s2step3b}</p>
            <p>4. <strong className="text-cyan-300">{t.s2step4a}</strong> {t.s2step4b}</p>
          </div>
        </div>
      ),
    },
  ];

  const kelilingExamples: ExampleData[] = [
    {
      level: t.easy, color: "text-green-400", bg: "bg-green-950/30",
      border: "border-green-700/50", badgeBg: "bg-green-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.kex1q} <strong className="text-cyan-300">{t.kex1qL}</strong> {t.kex1qEnd}</p>
          <ContohKelilingMudahSVG />
          <p>{t.kex1q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-green-400">{t.kex1s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
            {t.kex1sides.map((s, i) => <p key={i}>• {s}</p>)}
          </div>
          <p className="text-white/80"><strong className="text-green-400">{t.kex1s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="K = 6 + 3 + 6 + 6 + 12 + 9 = 42 \text{ cm}" />
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
            <p className="text-green-300 font-semibold">{t.kex1ans} <InlineMath math="= 42 \text{ cm}" /></p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            {t.kex1tip}
          </div>
        </div>
      ),
    },
    {
      level: t.medium, color: "text-yellow-400", bg: "bg-yellow-950/30",
      border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.kex2q} <strong className="text-violet-300">{t.kex2qL}</strong> {t.kex2qEnd}</p>
          <ContohKelilingSedangSVG />
          <p>{t.kex2q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-yellow-400">{t.kex2s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
            {t.kex2sides.map((s, i) => <p key={i}>• {s}</p>)}
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.kex2s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="K = 5 + 3 + 4 + 3 + 5 + 9{,}5 + 14 + 9{,}5" />
            <BlockMath math="K = 53 \text{ cm}" />
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
            <p className="text-yellow-300 font-semibold">{t.kex2ans} <InlineMath math="= 53 \text{ cm}" /></p>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
            {t.kex2chk}
          </div>
        </div>
      ),
    },
    {
      level: t.hard, color: "text-red-400", bg: "bg-red-950/30",
      border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.kex3q}</p>
          <ContohKelilingSulitSVG />
          <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
            {t.kex3li.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p className="text-xs text-white/70 mt-1">
            {t.kex3note} <InlineMath math="EF = \sqrt{4^2+7^2}" />.
          </p>
          <p>{t.kex3q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-red-400">{t.kex3s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="EF = \sqrt{4^2 + 7^2} = \sqrt{16 + 49} = \sqrt{65} \approx 8{,}06 \text{ m}" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.kex3s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="K = AB + BC + CD + DE + EF + FG + GA" />
            <BlockMath math="K = 14 + 8{,}5 + 10 + 15 + 8{,}06 + 12 + 10{,}6" />
            <BlockMath math="K = 78{,}16 \text{ m}" />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
            <p className="text-red-300 font-semibold">{t.kex3ans}</p>
            <p className="text-white/80">{t.kex3a1} <InlineMath math="\sqrt{65} \approx 8{,}06 \text{ m}" /></p>
            <p className="text-white/80">{t.kex3a2} <InlineMath math="\approx 78{,}16 \text{ m}" /></p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            {t.kex3tip} {t.kex3tipText}
          </div>
        </div>
      ),
    },
  ];

  const luasExamples: ExampleData[] = [
    {
      level: t.easy, color: "text-green-400", bg: "bg-green-950/30",
      border: "border-green-700/50", badgeBg: "bg-green-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.lex1q} <strong className="text-green-300">{t.lex1qL}</strong> {t.lex1qEnd}</p>
          <ContohLuasMudahSVG cutHere={t.svgCutHere} />
          <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
            {t.lex1parts.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-green-400">{t.lex1s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L_1 = 6 \times 4 = 24 \text{ cm}^2" />
          </div>
          <p className="text-white/80"><strong className="text-green-400">{t.lex1s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L_2 = 13 \times 5 = 65 \text{ cm}^2" />
          </div>
          <p className="text-white/80"><strong className="text-green-400">{t.lex1s3}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L = L_1 + L_2 = 24 + 65 = 89 \text{ cm}^2" />
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
            <p className="text-green-300 font-semibold">{t.lex1ans} <InlineMath math="= 89 \text{ cm}^2" /></p>
          </div>
        </div>
      ),
    },
    {
      level: t.medium, color: "text-yellow-400", bg: "bg-yellow-950/30",
      border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.lex2q}</p>
          <ContohLuasSedangSVG />
          <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
            {t.lex2parts.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <p className="text-xs text-white/70">{t.lex2q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-yellow-400">{t.lex2s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
            <BlockMath math="L_1 = 5 \times 10 = 50 \text{ cm}^2" />
            <BlockMath math="L_2 = 4 \times 4 = 16 \text{ cm}^2" />
            <BlockMath math="L_3 = 5 \times 5 = 25 \text{ cm}^2" />
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.lex2s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L = L_1 + L_2 + L_3 = 50 + 16 + 25 = 91 \text{ cm}^2" />
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
            <p className="text-yellow-300 font-semibold">{t.lex2ans} <InlineMath math="= 91 \text{ cm}^2" /></p>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
            {t.lex2tip}
          </div>
        </div>
      ),
    },
    {
      level: t.hard, color: "text-red-400", bg: "bg-red-950/30",
      border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.lex3q}</p>
          <ContohLuasSulitSVG />
          <ul className="list-disc list-inside text-white/80 space-y-0.5 ml-2 text-xs">
            {t.lex3parts.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <p className="text-xs text-white/70 mt-1">{t.lex3context}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-red-400">{t.lex3s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
            <BlockMath math="L_1 = 14 \times 3 = 42 \text{ cm}^2 \quad \text{(L\u2081)}" />
            <BlockMath math="L_2 = 5 \times 7 = 35 \text{ cm}^2 \quad \text{(L\u2082)}" />
            <BlockMath math="L_{\text{total}} = 42 + 35 = 77 \text{ cm}^2" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.lex3s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
            <p>{t.lex3s2p}</p>
            <BlockMath math="K = 14 + 3 + 4{,}5 + 7 + 5 + 7 + 4{,}5 + 3 = 48 \text{ cm}" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.lex3s3}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2">
            <BlockMath math="\text{cost}_{\text{grass}} = 77 \times 25{,}000 = Rp\,1.925.000" />
            <BlockMath math="\text{cost}_{\text{fence}} = 48 \times 8{,}000 = Rp\,384.000" />
            <BlockMath math="\text{total} = 1.925.000 + 384.000 = Rp\,2.309.000" />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
            <p className="text-red-300 font-semibold">{t.lex3ans}</p>
            <p className="text-white/80">{t.lex3a1} <InlineMath math="= 77 \text{ cm}^2" /></p>
            <p className="text-white/80">{t.lex3a2} <InlineMath math="= 48 \text{ cm}" /></p>
            <p className="text-white/80">{t.lex3a3} <InlineMath math="= Rp\,2.309.000" /></p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            <strong>{t.lex3tip}</strong> {t.lex3tipText}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-base md:text-xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          {t.title1}
        </h1>
        <h2 className="font-display text-base md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center leading-tight">
          {t.title2}
        </h2>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.breadcrumb}</p>

        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            {t.introA} <strong className="text-cyan-300">{t.introIrregular}</strong>
            {t.introB} <strong className="text-yellow-300">{t.introPerimeter}</strong> {t.introAnd}{" "}
            <strong className="text-green-300">{t.introArea}</strong>{" "}
            {t.introC} <span className="text-cyan-300 font-bold">{t.introBlink}</span> {t.introD}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {sections.map((sec, i) => (
            <AccordionSection key={sec.title} section={sec} idx={i} />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-display text-sm font-bold text-cyan-300 text-center mb-1">
            {t.kelilingHeader}
          </h3>
          <p className="text-white/40 text-xs text-center mb-4 font-body">{t.kelilingSubtitle}</p>
          <div className="flex flex-col gap-4">
            {kelilingExamples.map((ex, i) => (
              <ExampleCard key={`k${i}`} ex={ex} idx={i} prefix={t.prefixKeliling}
                showLabel={t.showSolution} hideLabel={t.hideSolution} />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-display text-sm font-bold text-green-300 text-center mb-1">
            {t.luasHeader}
          </h3>
          <p className="text-white/40 text-xs text-center mb-4 font-body">{t.luasSubtitle}</p>
          <div className="flex flex-col gap-4">
            {luasExamples.map((ex, i) => (
              <ExampleCard key={`l${i}`} ex={ex} idx={i} prefix={t.prefixLuas}
                showLabel={t.showSolution} hideLabel={t.hideSolution} />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/segitiga-dan-segiempat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingLuasBangunTakBeraturanPage;
