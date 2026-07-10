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
    title1: "KELILING SEGITIGA",
    title2: "DAN SEGIEMPAT",
    breadcrumb: "Kelas 7 · Segitiga dan Segiempat",
    back: "← Kembali ke Segitiga dan Segiempat",
    intro: "Dari sawah yang berbentuk persegi panjang hingga taman yang berbentuk segitiga — setiap kali kita ingin tahu",
    introHighlight: " seberapa jauh mengelilingi",
    introMid: " sebuah bangun datar, kita sedang menghitung",
    introHighlight2: " kelilingnya",
    introEnd: ". Di sini kita akan belajar cara menghitung keliling berbagai bangun datar secara sistematis dan cepat!",
    examplesTitle: "🚀 Contoh Soal",
    examplesSubtitle: "Latihan bertahap dari mudah hingga sulit",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "CONTOH",
    showSolution: "Lihat Pembahasan",
    hideSolution: "Sembunyikan Pembahasan",
    step: "Langkah",
    // SVG labels
    trapTop: "a (atas)",
    trapBottom: "b (bawah)",
    // Section titles
    sec1: "Apa Itu Keliling?",
    sec2: "Keliling Segitiga",
    sec3: "Keliling Persegi Panjang & Persegi",
    sec4: "Keliling Jajargenjang, Trapesium, Belah Ketupat & Layang-layang",
    sec5: "Tabel Ringkasan Semua Rumus Keliling",
    // Section 1
    s1p1: "Bayangkan kamu sedang berjalan mengelilingi sebuah lapangan sepak bola — mulai dari satu sudut, menyusuri setiap sisinya, dan kembali lagi ke titik awal. Jarak total yang kamu tempuh itulah yang disebut",
    s1def: "Definisi:",
    s1defText: "Keliling suatu bangun datar adalah total panjang semua sisi yang membentuk bangun tersebut.",
    s1formula: "Rumus Umum:",
    s1formulaText: "Untuk bangun apapun, keliling dihitung dengan menjumlahkan seluruh panjang sisinya.",
    s1analogy: "💡 Analogi Nyata:",
    s1analogyText: "Petani yang ingin memasang pagar mengelilingi sawahnya perlu mengetahui keliling sawah tersebut agar bisa menghitung berapa meter kawat pagar yang dibutuhkan.",
    s1note: "📌 Ingat:",
    s1noteText: "Satuan keliling adalah satuan panjang (cm, m, km), bukan satuan luas!",
    // Section 2
    s2p1: "Segitiga punya tiga sisi. Kelilingnya diperoleh cukup dengan menjumlahkan ketiga sisi tersebut.",
    s2formula: "📐 Rumus Keliling Segitiga",
    s2where: "Di mana",
    s2where2: "dan",
    s2where3: "adalah panjang masing-masing sisi segitiga.",
    s2special: "Kasus Khusus:",
    s2equil: "Segitiga Sama Sisi:",
    s2equilNote: "(ketiga sisi sama panjang)",
    s2isosc: "Segitiga Sama Kaki:",
    s2isoscNote: "(dua sisi kaki panjang",
    s2isoscNote2: ", alas",
    s2scalene: "Segitiga Sembarang:",
    s2scaleneNote: "(semua sisi beda)",
    // Section 3
    s3rect: "① Persegi Panjang",
    s3rectDesc: "Persegi panjang memiliki dua pasang sisi yang sama panjang: dua sisi sepanjang",
    s3rectDesc2: "(panjang) dan dua sisi sepanjang",
    s3rectDesc3: "(lebar).",
    s3rectNote: "📌 Rumus ini setara dengan",
    s3sq: "② Persegi",
    s3sqDesc: "Persegi adalah persegi panjang istimewa di mana semua sisinya sama panjang, yaitu",
    s3tip: "🔑 Cara cepat bedakan:",
    s3tipText: "Persegi = semua sisi sama. Persegi panjang = hanya sisi berhadapan yang sama.",
    // Section 4
    s4jj: "① Jajargenjang",
    s4jjDesc: "Seperti persegi panjang yang \"dimiringkan\" — dua pasang sisi berhadapan sama panjang.",
    s4jjNote: "Di mana",
    s4jjNote2: "= sisi atas/bawah,",
    s4jjNote3: "= sisi kiri/kanan (miring).",
    s4trap: "② Trapesium",
    s4trapDesc: "Trapesium punya satu pasang sisi sejajar (atas dan bawah) dan dua sisi kaki yang bisa berbeda panjang.",
    s4trapNote: "= sisi atas,",
    s4trapNote2: "= sisi bawah,",
    s4trapNote3: "dan",
    s4trapNote4: "= dua sisi kaki.",
    s4bk: "③ Belah Ketupat",
    s4bkDesc: "Semua empat sisinya sama panjang — seperti persegi yang diputar miring!",
    s4ll: "④ Layang-layang",
    s4llDesc: "Layang-layang punya dua pasang sisi yang berdekatan sama panjang.",
    s4llNote: "= panjang sisi pendek (sepasang),",
    s4llNote2: "= panjang sisi panjang (sepasang).",
    // Table
    tblShape: "Bangun", tblCond: "Syarat Khusus", tblFormula: "Rumus Keliling",
    tblTip: "🔑 Kunci Mudah Mengingat:",
    tblTip1: "Kalau semua sisi sama → kalikan jumlah sisi × panjang sisi (persegi: ×4, segitiga sama sisi: ×3)",
    tblTip2: "Kalau ada dua pasang sisi sama → pakai rumus",
    tblTip3: "Kalau semua sisi berbeda → jumlahkan semua sisi satu per satu",
    tblRows: [
      ["🔺 Segitiga", "Semua sisi berbeda", "K = a + b + c"],
      ["🔺 Seg. Sama Sisi", "a = b = c = s", "K = 3s"],
      ["▭ Persegi Panjang", "2 pasang sisi sejajar", "K = 2(p + l)"],
      ["■ Persegi", "Semua sisi = s", "K = 4s"],
      ["⬡ Jajargenjang", "2 pasang sisi sejajar", "K = 2(a + b)"],
      ["⬢ Trapesium", "1 pasang sisi sejajar", "K = a + b + c + d"],
      ["◆ Belah Ketupat", "Semua sisi = s", "K = 4s"],
      ["🪁 Layang-layang", "2 pasang sisi berdekatan", "K = 2(p + q)"],
    ],
    // Examples
    ex1q: "Sebuah segitiga sama kaki ABC memiliki dua sisi kaki masing-masing sepanjang 13 cm dan alas BC = 10 cm.",
    ex1q2: "Hitunglah keliling segitiga tersebut!",
    ex1s1: "Identifikasi sisi-sisi segitiga:",
    ex1s1note: "Segitiga sama kaki → dua sisi kaki sama panjang:",
    ex1s2: "Hitung keliling:",
    ex1ans: "Jawaban: K = 36 cm",
    ex1tip: "💡 Alternatif: K = 2 × 13 + 10 = 26 + 10 = 36 cm (rumus segitiga sama kaki: K = 2p + a) ✓",
    ex2q: "Sebuah kolam renang berbentuk persegi panjang memiliki keliling 70 m dan lebar 12 m.",
    ex2q2: "Tentukan panjang kolam tersebut!",
    ex2s1: "Tulis rumus keliling persegi panjang:",
    ex2s2: "Substitusi nilai yang diketahui:",
    ex2s3: "Hitung panjang (p):",
    ex2ans: "✅ Jawaban: Panjang kolam = 23 m",
    ex2chk: "✅ Cek:",
    ex3q: "Perhatikan bangun datar berbentuk huruf \"L\" berikut ini (bangun FABCDE). Diketahui:",
    ex3q2: "Tentukan panjang sisi BC (sisi kanan bawah) dan keliling bangun!",
    ex3li: ["FA = 8 cm (sisi kiri, vertikal)", "AB = 13 cm (sisi bawah, horizontal)", "FE = 9 cm (sisi atas, horizontal)", "ED = 5 cm (sisi kanan atas, vertikal)", "DC = 3 cm (sisi tonjolan, horizontal)"],
    ex3s1: "Cari sisi BC yang belum diketahui:",
    ex3s1p1: "Perhatikan arah vertikal (atas ke bawah): Sisi kiri FA = 8 cm adalah tinggi total bangun.",
    ex3s1p2: "Sisi kanan terbagi menjadi dua: ED (bagian atas) dan BC (bagian bawah).",
    ex3s2: "Verifikasi sisi horizontal (opsional):",
    ex3s2p1: "Arah horizontal: AB = 13 cm (bawah) dan FE + DC = 9 + 3 = 12 cm ??",
    ex3s2warn: "⚠️ Selisih ini wajar karena bangun berbentuk L, bukan persegi panjang penuh.",
    ex3s2p2: "Selisih horizontal: AB − FE = 13 − 9 = 4 cm = lebar lekukan = DC = ...",
    ex3s2p3: "Sesuaikan: DC sebenarnya adalah AB − FE = 13 − 9 = 4 cm",
    ex3s3: "Jumlahkan semua sisi:",
    ex3s3p: "Semua sisi bangun L: FA, AB, BC, CD, DE, EF",
    ex3ans: "✅ Jawaban:",
    ex3a1: "• Panjang BC = 3 cm",
    ex3a2: "• Keliling bangun L = 42 cm",
    ex3tip: "🔑 Trik bangun tak beraturan:",
    ex3tipText: "Cari sisi yang belum diketahui menggunakan hubungan geometris (sisi-sisi sejajar yang berhubungan), lalu jumlahkan semua sisi keliling.",
  },
  en: {
    title1: "PERIMETER OF TRIANGLES",
    title2: "AND QUADRILATERALS",
    breadcrumb: "Grade 7 · Triangles & Quadrilaterals",
    back: "← Back to Triangles & Quadrilaterals",
    intro: "From rice fields shaped like rectangles to parks shaped like triangles — whenever we want to know",
    introHighlight: " how far around",
    introMid: " a shape goes, we are calculating its",
    introHighlight2: " perimeter",
    introEnd: ". Here we will learn how to calculate the perimeter of various shapes systematically and quickly!",
    examplesTitle: "🚀 Example Problems",
    examplesSubtitle: "Progressive exercises from easy to hard",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "EXAMPLE",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
    step: "Step",
    trapTop: "a (top)",
    trapBottom: "b (bottom)",
    sec1: "What Is Perimeter?",
    sec2: "Perimeter of a Triangle",
    sec3: "Perimeter of Rectangle & Square",
    sec4: "Perimeter of Parallelogram, Trapezoid, Rhombus & Kite",
    sec5: "Summary Table of All Perimeter Formulas",
    s1p1: "Imagine walking around a soccer field — starting from one corner, going along every side, and returning to the starting point. The total distance you travel is called the",
    s1def: "Definition:",
    s1defText: "The perimeter of a flat shape is the total length of all its sides.",
    s1formula: "General Formula:",
    s1formulaText: "For any shape, the perimeter is calculated by adding up all the side lengths.",
    s1analogy: "💡 Real-life Example:",
    s1analogyText: "A farmer who wants to fence their field needs to know the perimeter to calculate how many meters of wire fencing are needed.",
    s1note: "📌 Remember:",
    s1noteText: "The unit of perimeter is a unit of length (cm, m, km), not a unit of area!",
    s2p1: "A triangle has three sides. Its perimeter is simply the sum of all three sides.",
    s2formula: "📐 Triangle Perimeter Formula",
    s2where: "Where",
    s2where2: "and",
    s2where3: "are the lengths of each side of the triangle.",
    s2special: "Special Cases:",
    s2equil: "Equilateral Triangle:",
    s2equilNote: "(all three sides are equal)",
    s2isosc: "Isosceles Triangle:",
    s2isoscNote: "(two equal legs of length",
    s2isoscNote2: ", base",
    s2scalene: "Scalene Triangle:",
    s2scaleneNote: "(all sides are different)",
    s3rect: "① Rectangle",
    s3rectDesc: "A rectangle has two pairs of equal sides: two sides of length",
    s3rectDesc2: "(length) and two sides of width",
    s3rectDesc3: ".",
    s3rectNote: "📌 This formula is equivalent to",
    s3sq: "② Square",
    s3sqDesc: "A square is a special rectangle where all sides are equal, each of length",
    s3tip: "🔑 Quick tip:",
    s3tipText: "Square = all sides equal. Rectangle = only opposite sides equal.",
    s4jj: "① Parallelogram",
    s4jjDesc: "Like a rectangle that has been \"tilted\" — two pairs of opposite sides are equal.",
    s4jjNote: "Where",
    s4jjNote2: "= top/bottom side,",
    s4jjNote3: "= left/right (slanted) side.",
    s4trap: "② Trapezoid",
    s4trapDesc: "A trapezoid has one pair of parallel sides (top and bottom) and two legs that may differ in length.",
    s4trapNote: "= top side,",
    s4trapNote2: "= bottom side,",
    s4trapNote3: "and",
    s4trapNote4: "= two legs.",
    s4bk: "③ Rhombus",
    s4bkDesc: "All four sides are equal — like a square tilted to one side!",
    s4ll: "④ Kite",
    s4llDesc: "A kite has two pairs of adjacent sides that are equal in length.",
    s4llNote: "= length of the shorter pair,",
    s4llNote2: "= length of the longer pair.",
    tblShape: "Shape", tblCond: "Special Condition", tblFormula: "Perimeter Formula",
    tblTip: "🔑 Easy Memory Tips:",
    tblTip1: "If all sides are equal → multiply number of sides × side length (square: ×4, equilateral triangle: ×3)",
    tblTip2: "If two pairs of equal sides → use the formula",
    tblTip3: "If all sides are different → add all sides one by one",
    tblRows: [
      ["🔺 Triangle", "All sides different", "K = a + b + c"],
      ["🔺 Equilateral △", "a = b = c = s", "K = 3s"],
      ["▭ Rectangle", "2 pairs of parallel sides", "K = 2(l + w)"],
      ["■ Square", "All sides = s", "K = 4s"],
      ["⬡ Parallelogram", "2 pairs of parallel sides", "K = 2(a + b)"],
      ["⬢ Trapezoid", "1 pair of parallel sides", "K = a + b + c + d"],
      ["◆ Rhombus", "All sides = s", "K = 4s"],
      ["🪁 Kite", "2 pairs of adjacent sides", "K = 2(p + q)"],
    ],
    ex1q: "Isosceles triangle ABC has two equal legs each 13 cm long and base BC = 10 cm.",
    ex1q2: "Calculate the perimeter of the triangle.",
    ex1s1: "Identify the sides of the triangle:",
    ex1s1note: "Isosceles triangle → two legs are equal:",
    ex1s2: "Calculate the perimeter:",
    ex1ans: "Answer: P = 36 cm",
    ex1tip: "💡 Alternative: P = 2 × 13 + 10 = 26 + 10 = 36 cm (isosceles formula: P = 2l + b) ✓",
    ex2q: "A rectangular swimming pool has a perimeter of 70 m and a width of 12 m.",
    ex2q2: "Find the length of the pool.",
    ex2s1: "Write the rectangle perimeter formula:",
    ex2s2: "Substitute the known values:",
    ex2s3: "Solve for length (p):",
    ex2ans: "✅ Answer: Pool length = 23 m",
    ex2chk: "✅ Check:",
    ex3q: "Consider the L-shaped figure FABCDE below. Given:",
    ex3q2: "Find the length of side BC (bottom right) and the perimeter of the shape.",
    ex3li: ["FA = 8 cm (left side, vertical)", "AB = 13 cm (bottom side, horizontal)", "FE = 9 cm (top side, horizontal)", "ED = 5 cm (upper right side, vertical)", "DC = 3 cm (notch side, horizontal)"],
    ex3s1: "Find the unknown side BC:",
    ex3s1p1: "Look vertically (top to bottom): left side FA = 8 cm is the total height of the shape.",
    ex3s1p2: "The right side is split into: ED (upper part) and BC (lower part).",
    ex3s2: "Verify horizontal sides (optional):",
    ex3s2p1: "Horizontally: AB = 13 cm (bottom) and FE + DC = 9 + 3 = 12 cm ??",
    ex3s2warn: "⚠️ This difference is expected since the shape is L-shaped, not a full rectangle.",
    ex3s2p2: "Horizontal difference: AB − FE = 13 − 9 = 4 cm = notch width = DC = ...",
    ex3s2p3: "Corrected: DC is actually AB − FE = 13 − 9 = 4 cm",
    ex3s3: "Add up all sides:",
    ex3s3p: "All sides of L-shape: FA, AB, BC, CD, DE, EF",
    ex3ans: "✅ Answer:",
    ex3a1: "• Length BC = 3 cm",
    ex3a2: "• Perimeter of L-shape = 42 cm",
    ex3tip: "🔑 Trick for irregular shapes:",
    ex3tipText: "Find unknown sides using geometric relationships (related parallel sides), then sum all perimeter sides.",
  },
  ja: {
    title1: "三角形と四角形の",
    title2: "周長（まわりの長さ）",
    breadcrumb: "中学1年 · 三角形と四角形",
    back: "← 三角形と四角形に戻る",
    intro: "長方形の田んぼから三角形の公園まで——図形の",
    introHighlight: "まわりの長さ",
    introMid: "を知りたいとき、私たちは",
    introHighlight2: "周長",
    introEnd: "を計算しています。ここでは様々な図形の周長を体系的に素早く計算する方法を学びましょう！",
    examplesTitle: "🚀 例題",
    examplesSubtitle: "基本から発展まで段階的に練習",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題",
    showSolution: "解説を見る",
    hideSolution: "解説を隠す",
    step: "ステップ",
    trapTop: "a (上辺)",
    trapBottom: "b (下辺)",
    sec1: "周長とは何か？",
    sec2: "三角形の周長",
    sec3: "長方形と正方形の周長",
    sec4: "平行四辺形・台形・ひし形・凧形の周長",
    sec5: "周長公式まとめ表",
    s1p1: "サッカー場の周りを歩くことを想像してみてください——一隅から出発し、すべての辺に沿って歩き、出発点に戻ってきます。その合計距離が「",
    s1def: "定義：",
    s1defText: "図形の周長とは、その図形を構成するすべての辺の長さの合計です。",
    s1formula: "一般公式：",
    s1formulaText: "どんな図形でも、周長はすべての辺の長さを足して求めます。",
    s1analogy: "💡 実生活の例：",
    s1analogyText: "農家が田んぼの周りに柵を設置したい場合、必要なワイヤーフェンスの長さを計算するために周長を知る必要があります。",
    s1note: "📌 覚えておこう：",
    s1noteText: "周長の単位は長さの単位（cm、m、km）であり、面積の単位ではありません！",
    s2p1: "三角形には3つの辺があります。周長は3辺の長さを足すだけです。",
    s2formula: "📐 三角形の周長の公式",
    s2where: "ここで",
    s2where2: "と",
    s2where3: "は三角形の各辺の長さです。",
    s2special: "特殊な場合：",
    s2equil: "正三角形：",
    s2equilNote: "（3辺すべて等しい）",
    s2isosc: "二等辺三角形：",
    s2isoscNote: "（等辺の長さが",
    s2isoscNote2: "、底辺が",
    s2scalene: "不等辺三角形：",
    s2scaleneNote: "（すべての辺が異なる）",
    s3rect: "① 長方形",
    s3rectDesc: "長方形は2組の等しい辺があります：長さ",
    s3rectDesc2: "の辺が2本と、幅",
    s3rectDesc3: "の辺が2本。",
    s3rectNote: "📌 この公式は次と同等です：",
    s3sq: "② 正方形",
    s3sqDesc: "正方形はすべての辺が等しい特別な長方形で、各辺の長さは",
    s3tip: "🔑 判別のコツ：",
    s3tipText: "正方形 = すべての辺が等しい。長方形 = 向かい合う辺だけが等しい。",
    s4jj: "① 平行四辺形",
    s4jjDesc: "長方形を「傾けた」ような形——向かい合う2組の辺が等しい。",
    s4jjNote: "ここで",
    s4jjNote2: "= 上下の辺、",
    s4jjNote3: "= 左右の辺（斜め）。",
    s4trap: "② 台形",
    s4trapDesc: "台形は1組の平行な辺（上辺と下辺）と、長さが異なる場合がある2つの斜辺を持ちます。",
    s4trapNote: "= 上辺、",
    s4trapNote2: "= 下辺、",
    s4trapNote3: "と",
    s4trapNote4: "= 2つの斜辺。",
    s4bk: "③ ひし形",
    s4bkDesc: "4辺すべてが等しい——傾けた正方形のような形！",
    s4ll: "④ 凧形（カイト）",
    s4llDesc: "凧形は隣り合う2組の辺が等しい長さを持ちます。",
    s4llNote: "= 短い組の長さ、",
    s4llNote2: "= 長い組の長さ。",
    tblShape: "図形", tblCond: "特別な条件", tblFormula: "周長の公式",
    tblTip: "🔑 覚え方のコツ：",
    tblTip1: "すべての辺が等しい場合 → 辺の数 × 辺の長さ（正方形：×4、正三角形：×3）",
    tblTip2: "等しい辺が2組ある場合 → 公式を使う",
    tblTip3: "すべての辺が異なる場合 → すべての辺を1つずつ足す",
    tblRows: [
      ["🔺 三角形", "すべての辺が異なる", "K = a + b + c"],
      ["🔺 正三角形", "a = b = c = s", "K = 3s"],
      ["▭ 長方形", "2組の平行な辺", "K = 2(l + w)"],
      ["■ 正方形", "すべての辺 = s", "K = 4s"],
      ["⬡ 平行四辺形", "2組の平行な辺", "K = 2(a + b)"],
      ["⬢ 台形", "1組の平行な辺", "K = a + b + c + d"],
      ["◆ ひし形", "すべての辺 = s", "K = 4s"],
      ["🪁 凧形", "隣り合う2組の辺", "K = 2(p + q)"],
    ],
    ex1q: "二等辺三角形ABCは等辺がそれぞれ13 cm、底辺BC = 10 cm です。",
    ex1q2: "三角形の周長を求めなさい。",
    ex1s1: "三角形の辺を確認する：",
    ex1s1note: "二等辺三角形 → 2つの等辺が等しい：",
    ex1s2: "周長を計算する：",
    ex1ans: "答え：P = 36 cm",
    ex1tip: "💡 別の方法：P = 2 × 13 + 10 = 26 + 10 = 36 cm（二等辺三角形の公式：P = 2l + b）✓",
    ex2q: "長方形のプールの周長は70 m、幅は12 m です。",
    ex2q2: "プールの長さを求めなさい。",
    ex2s1: "長方形の周長の公式を書く：",
    ex2s2: "既知の値を代入する：",
    ex2s3: "長さ (p) を求める：",
    ex2ans: "✅ 答え：プールの長さ = 23 m",
    ex2chk: "✅ 確認：",
    ex3q: "以下のL字型の図形FABCDE を見てください。わかっていること：",
    ex3q2: "辺BC（右下の辺）の長さと図形の周長を求めなさい。",
    ex3li: ["FA = 8 cm（左辺、垂直）", "AB = 13 cm（下辺、水平）", "FE = 9 cm（上辺、水平）", "ED = 5 cm（右上の辺、垂直）", "DC = 3 cm（くぼみの辺、水平）"],
    ex3s1: "未知の辺BCを求める：",
    ex3s1p1: "垂直方向（上から下へ）を見る：左辺 FA = 8 cm が図形の全高。",
    ex3s1p2: "右辺はED（上部）とBC（下部）に分かれている。",
    ex3s2: "水平辺の確認（任意）：",
    ex3s2p1: "水平方向：AB = 13 cm（下）と FE + DC = 9 + 3 = 12 cm ??",
    ex3s2warn: "⚠️ L字型の図形なので完全な長方形ではなく、この差は正常です。",
    ex3s2p2: "水平の差：AB − FE = 13 − 9 = 4 cm = くぼみの幅 = DC = ...",
    ex3s2p3: "修正：DC の実際の長さは AB − FE = 13 − 9 = 4 cm",
    ex3s3: "全辺を合計する：",
    ex3s3p: "L字型の全辺：FA, AB, BC, CD, DE, EF",
    ex3ans: "✅ 答え：",
    ex3a1: "• BC の長さ = 3 cm",
    ex3a2: "• L字型の周長 = 42 cm",
    ex3tip: "🔑 不規則な図形のコツ：",
    ex3tipText: "幾何学的な関係（関連する平行辺）を使って未知の辺を求め、すべての辺を合計します。",
  },
};

/* ══════════════════════════════════════════════════════════
   SVG DIAGRAMS
══════════════════════════════════════════════════════════ */
const SegitigaSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-3" aria-label="Triangle with sides a, b, c">
    <polygon points="150,20 30,175 270,175" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
    <text x="143" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="274" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="76" y="108" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-55,90,115)">c</text>
    <text x="214" y="108" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(52,218,115)">b</text>
    <text x="143" y="192" fill="#facc15" fontSize="12" fontFamily="monospace">a</text>
    <rect x="6" y="148" width="60" height="26" rx="4" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1" opacity="0.7"/>
    <text x="10" y="165" fill="#22d3ee" fontSize="10" fontFamily="monospace">K = a+b+c</text>
  </svg>
);

const PersegiPanjangSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-3" aria-label="Rectangle with length p and width l">
    <rect x="30" y="40" width="240" height="110" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="2" />
    <text x="22" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="272" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="22" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="272" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="135" y="32" fill="#facc15" fontSize="12" fontFamily="monospace">p</text>
    <text x="135" y="168" fill="#facc15" fontSize="12" fontFamily="monospace">p</text>
    <text x="6" y="102" fill="#facc15" fontSize="12" fontFamily="monospace">l</text>
    <text x="282" y="102" fill="#facc15" fontSize="12" fontFamily="monospace">l</text>
    <rect x="30" y="138" width="12" height="12" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="60" y="135" fill="#a78bfa" fontSize="10" fontFamily="monospace">K = 2×(p+l)</text>
  </svg>
);

const PersegiSVG = () => (
  <svg viewBox="0 0 220 200" className="w-full max-w-xs mx-auto my-3" aria-label="Square with side s">
    <rect x="40" y="30" width="140" height="140" fill="rgba(74,222,128,0.08)" stroke="#4ade80" strokeWidth="2" />
    <text x="32" y="25" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="182" y="25" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="32" y="183" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="182" y="183" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <rect x="40" y="158" width="12" height="12" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="103" y="22" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="103" y="186" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="16" y="103" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="188" y="103" fill="#facc15" fontSize="13" fontFamily="monospace">s</text>
    <text x="50" y="108" fill="#4ade80" fontSize="10" fontFamily="monospace">K = 4 × s</text>
  </svg>
);

const JajargenjangSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-3" aria-label="Parallelogram with sides a and b">
    <polygon points="70,30 270,30 230,150 30,150" fill="rgba(251,146,60,0.08)" stroke="#fb923c" strokeWidth="2"/>
    <text x="58" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="272" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="15" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="232" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="158" y="22" fill="#facc15" fontSize="12" fontFamily="monospace">a</text>
    <text x="118" y="162" fill="#facc15" fontSize="12" fontFamily="monospace">a</text>
    <text x="30" y="96" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-72,38,94)">b</text>
    <text x="252" y="96" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-72,254,94)">b</text>
    <text x="60" y="120" fill="#fb923c" fontSize="10" fontFamily="monospace">K = 2×(a+b)</text>
  </svg>
);

const TrapesiumSVG = ({ labelTop, labelBottom }: { labelTop: string; labelBottom: string }) => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-3" aria-label="Trapezoid with sides a, b, c, d">
    <polygon points="80,30 220,30 270,150 30,150" fill="rgba(248,113,113,0.08)" stroke="#f87171" strokeWidth="2"/>
    <text x="68" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="222" y="24" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="14" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="272" y="163" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="130" y="22" fill="#facc15" fontSize="11" fontFamily="monospace">{labelTop}</text>
    <text x="118" y="164" fill="#facc15" fontSize="11" fontFamily="monospace">{labelBottom}</text>
    <text x="32" y="96" fill="#22d3ee" fontSize="12" fontFamily="monospace" transform="rotate(-75,40,95)">c</text>
    <text x="258" y="96" fill="#22d3ee" fontSize="12" fontFamily="monospace" transform="rotate(67,262,95)">d</text>
    <text x="60" y="120" fill="#f87171" fontSize="10" fontFamily="monospace">K = a+b+c+d</text>
  </svg>
);

const BelahKetupatSVG = () => (
  <svg viewBox="0 0 220 200" className="w-full max-w-xs mx-auto my-3" aria-label="Rhombus with side s">
    <polygon points="110,20 200,100 110,180 20,100" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2"/>
    <text x="103" y="14" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="204" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="103" y="194" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="162" y="60" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(42,158,65)">s</text>
    <text x="155" y="148" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-42,158,145)">s</text>
    <text x="42" y="60" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-42,55,65)">s</text>
    <text x="42" y="148" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(42,55,145)">s</text>
    <text x="52" y="108" fill="#22d3ee" fontSize="10" fontFamily="monospace">K = 4 × s</text>
  </svg>
);

const LayangLayangSVG = () => (
  <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto my-3" aria-label="Kite with two pairs of sides">
    <polygon points="110,15 185,90 110,200 35,90" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="2"/>
    <text x="102" y="10" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="188" y="94" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="102" y="214" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="16" y="94" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="152" y="48" fill="#facc15" fontSize="11" fontFamily="monospace" transform="rotate(40,155,55)">p</text>
    <text x="148" y="152" fill="#22d3ee" fontSize="11" fontFamily="monospace" transform="rotate(-45,154,157)">q</text>
    <text x="46" y="48" fill="#facc15" fontSize="11" fontFamily="monospace" transform="rotate(-40,55,55)">p</text>
    <text x="44" y="152" fill="#22d3ee" fontSize="11" fontFamily="monospace" transform="rotate(45,54,157)">q</text>
    <text x="35" y="115" fill="#a78bfa" fontSize="10" fontFamily="monospace">K=2(p+q)</text>
  </svg>
);

const ContohMudahSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-2" aria-label="Isosceles triangle example">
    <polygon points="150,20 30,160 270,160" fill="rgba(74,222,128,0.1)" stroke="#4ade80" strokeWidth="2"/>
    <text x="143" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="173" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="274" y="173" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="62" y="85" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(-52,75,90)">13 cm</text>
    <text x="210" y="85" fill="#facc15" fontSize="12" fontFamily="monospace" transform="rotate(52,218,90)">13 cm</text>
    <text x="130" y="174" fill="#22d3ee" fontSize="12" fontFamily="monospace">10 cm</text>
  </svg>
);

const ContohSedangSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto my-2" aria-label="Rectangle with unknown length">
    <rect x="30" y="40" width="240" height="110" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="2"/>
    <text x="22" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="272" y="35" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="22" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="272" y="165" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="128" y="33" fill="#facc15" fontSize="12" fontFamily="monospace">p = ?</text>
    <text x="128" y="168" fill="#facc15" fontSize="12" fontFamily="monospace">p = ?</text>
    <text x="2" y="102" fill="#22d3ee" fontSize="11" fontFamily="monospace">12</text>
    <text x="280" y="102" fill="#22d3ee" fontSize="11" fontFamily="monospace">12</text>
    <rect x="30" y="138" width="12" height="12" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="60" y="128" fill="#f87171" fontSize="10" fontFamily="monospace">K = 70 cm</text>
  </svg>
);

const ContohSulitSVG = () => (
  <svg viewBox="0 0 320 220" className="w-full max-w-sm mx-auto my-2" aria-label="L-shaped figure FABCDE">
    <polygon points="30,30 30,190 160,190 160,120 210,120 210,30"
      fill="rgba(248,113,113,0.1)" stroke="#f87171" strokeWidth="2"/>
    <text x="20" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">F</text>
    <text x="212" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">E</text>
    <text x="212" y="128" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="162" y="128" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="162" y="200" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="20" y="200" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="108" y="24" fill="#facc15" fontSize="11" fontFamily="monospace">FE = 9</text>
    <text x="212" y="80" fill="#facc15" fontSize="11" fontFamily="monospace">ED = 5</text>
    <text x="168" y="148" fill="#22d3ee" fontSize="11" fontFamily="monospace">DC = 3</text>
    <text x="80" y="205" fill="#facc15" fontSize="11" fontFamily="monospace">AB = 13</text>
    <text x="2" y="115" fill="#22d3ee" fontSize="11" fontFamily="monospace">FA = 8</text>
    <text x="76" y="170" fill="#f87171" fontSize="11" fontFamily="monospace">BC = ?</text>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   ACCORDION & CARD COMPONENTS
══════════════════════════════════════════════════════════ */
type Section = { title: string; icon: string; content: React.ReactNode };
type Example = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode; };

const AccordionSection = ({ section, idx }: { section: Section; idx: number }) => {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <button onClick={() => { playPopSound(); setOpen((v) => !v); }} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer">
        <span className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <span className="font-display text-sm font-semibold text-white">{section.title}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (<div className="px-5 pb-5 border-t border-border/50"><div className="pt-4">{section.content}</div></div>)}
    </div>
  );
};

const ExampleCard = ({ ex, idx, showLabel, hideLabel, exLabel }: { ex: Example; idx: number; showLabel: string; hideLabel: string; exLabel: string }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>{exLabel} {idx + 1} — {ex.level}</span>
        </div>
        {ex.question}
      </div>
      <button onClick={() => { playPopSound(); setShowAnswer((v) => !v); }} className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50">
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{showAnswer ? hideLabel : showLabel}</span>
        {showAnswer ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {showAnswer && (<div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>)}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════ */
const KelilingSegitigaSegiempatPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const sections: Section[] = [
    {
      title: t.sec1, icon: "🌍",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s1p1} <strong className="text-cyan-300">{language === "id" ? "keliling" : language === "en" ? "perimeter" : "周長"}</strong>.</p>
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p><strong className="text-cyan-300">{t.s1def}</strong> {t.s1defText}</p>
            <p><strong className="text-cyan-300">{t.s1formula}</strong> {t.s1formulaText}</p>
            <div className="bg-cyan-950/70 rounded p-3 text-center">
              <BlockMath math="K = \text{sisi}_1 + \text{sisi}_2 + \text{sisi}_3 + \cdots" />
            </div>
          </div>
          <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
            💡 <strong>{t.s1analogy}</strong> {t.s1analogyText}
          </div>
          <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
            📌 <strong>{t.s1note}</strong> {t.s1noteText}
          </blockquote>
        </div>
      ),
    },
    {
      title: t.sec2, icon: "🔺",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s2p1}</p>
          <SegitigaSVG />
          <div className="bg-green-950/50 border border-green-700/50 rounded-lg p-4 space-y-2">
            <p className="text-green-300 font-semibold">{t.s2formula}</p>
            <div className="bg-green-950/70 rounded p-3 text-center"><BlockMath math="K_{\triangle} = a + b + c" /></div>
            <p className="text-white/70 text-xs">{t.s2where} <InlineMath math="a" />, <InlineMath math="b" />, {t.s2where2} <InlineMath math="c" /> {t.s2where3}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs">
            <p className="text-cyan-300 font-semibold">{t.s2special}</p>
            <p>• <strong className="text-yellow-300">{t.s2equil}</strong> <InlineMath math="K = 3s" /> {t.s2equilNote}</p>
            <p>• <strong className="text-violet-300">{t.s2isosc}</strong> <InlineMath math="K = 2p + a" /> {t.s2isoscNote} <InlineMath math="p" />{t.s2isoscNote2} <InlineMath math="a" />)</p>
            <p>• <strong className="text-orange-300">{t.s2scalene}</strong> <InlineMath math="K = a + b + c" /> {t.s2scaleneNote}</p>
          </div>
        </div>
      ),
    },
    {
      title: t.sec3, icon: "▭",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <div className="space-y-2">
            <p className="text-violet-300 font-semibold">{t.s3rect}</p>
            <p>{t.s3rectDesc} <InlineMath math="p" /> {t.s3rectDesc2} <InlineMath math="l" /> {t.s3rectDesc3}</p>
            <PersegiPanjangSVG />
            <div className="bg-violet-950/50 border border-violet-700/50 rounded-lg p-3 text-center"><BlockMath math="K_{\text{pp}} = 2 \times (p + l)" /></div>
            <blockquote className="border-l-4 border-violet-500 pl-3 text-violet-200 text-xs italic">
              {t.s3rectNote} <InlineMath math="K = p + l + p + l = 2p + 2l" />.
            </blockquote>
          </div>
          <div className="border-t border-slate-700/50 pt-4 space-y-2">
            <p className="text-green-300 font-semibold">{t.s3sq}</p>
            <p>{t.s3sqDesc} <InlineMath math="s" />.</p>
            <PersegiSVG />
            <div className="bg-green-950/50 border border-green-700/50 rounded-lg p-3 text-center"><BlockMath math="K_{\square} = 4 \times s" /></div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
            🔑 <strong className="text-white">{t.s3tip}</strong> {t.s3tipText}
          </div>
        </div>
      ),
    },
    {
      title: t.sec4, icon: "💎",
      content: (
        <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
          <div className="space-y-2">
            <p className="text-orange-300 font-semibold">{t.s4jj}</p>
            <p>{t.s4jjDesc}</p>
            <JajargenjangSVG />
            <div className="bg-orange-950/50 border border-orange-700/40 rounded-lg p-3 text-center"><BlockMath math="K_{\text{jj}} = 2 \times (a + b)" /></div>
            <p className="text-white/60 text-xs">{t.s4jjNote} <InlineMath math="a" /> {t.s4jjNote2} <InlineMath math="b" /> {t.s4jjNote3}</p>
          </div>
          <div className="border-t border-slate-700/50 pt-4 space-y-2">
            <p className="text-red-300 font-semibold">{t.s4trap}</p>
            <p>{t.s4trapDesc}</p>
            <TrapesiumSVG labelTop={t.trapTop} labelBottom={t.trapBottom} />
            <div className="bg-red-950/50 border border-red-700/40 rounded-lg p-3 text-center"><BlockMath math="K_{\text{trap}} = a + b + c + d" /></div>
            <p className="text-white/60 text-xs"><InlineMath math="a" /> {t.s4trapNote} <InlineMath math="b" /> {t.s4trapNote2} <InlineMath math="c" /> {t.s4trapNote3} <InlineMath math="d" /> {t.s4trapNote4}</p>
          </div>
          <div className="border-t border-slate-700/50 pt-4 space-y-2">
            <p className="text-cyan-300 font-semibold">{t.s4bk}</p>
            <p>{t.s4bkDesc}</p>
            <BelahKetupatSVG />
            <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-center"><BlockMath math="K_{\text{bk}} = 4 \times s" /></div>
          </div>
          <div className="border-t border-slate-700/50 pt-4 space-y-2">
            <p className="text-violet-300 font-semibold">{t.s4ll}</p>
            <p>{t.s4llDesc}</p>
            <LayangLayangSVG />
            <div className="bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-center"><BlockMath math="K_{\text{ll}} = 2 \times (p + q)" /></div>
            <p className="text-white/60 text-xs"><InlineMath math="p" /> {t.s4llNote} <InlineMath math="q" /> {t.s4llNote2}</p>
          </div>
        </div>
      ),
    },
    {
      title: t.sec5, icon: "📊",
      content: (
        <div className="space-y-3 font-body">
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="bg-slate-800">
                  <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">{t.tblShape}</th>
                  <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{t.tblCond}</th>
                  <th className="px-3 py-2 text-cyan-300">{t.tblFormula}</th>
                </tr>
              </thead>
              <tbody>
                {t.tblRows.map(([shape, cond, formula], i) => (
                  <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                    <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{shape}</td>
                    <td className="px-3 py-2 text-white/60 border-r border-slate-700">{cond}</td>
                    <td className="px-3 py-2 text-yellow-300 font-mono">{formula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p>🔑 <strong className="text-white">{t.tblTip}</strong></p>
            <p>• {t.tblTip1}</p>
            <p>• {t.tblTip2} <InlineMath math="2 \times (\cdots + \cdots)" /></p>
            <p>• {t.tblTip3}</p>
          </div>
        </div>
      ),
    },
  ];

  const examples: Example[] = [
    {
      level: t.easy, color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex1q}</p>
          <ContohMudahSVG />
          <p>{t.ex1q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-green-400">{t.step} 1 — {t.ex1s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
            <p>{t.ex1s1note}</p>
            <p>• AB = AC = 13 cm</p>
            <p>• BC = 10 cm</p>
          </div>
          <p className="text-white/80"><strong className="text-green-400">{t.step} 2 — {t.ex1s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="K = AB + AC + BC = 13 + 13 + 10" />
            <BlockMath math="K = 36 \text{ cm}" />
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
            <p className="text-green-300 font-semibold">✅ {t.ex1ans}</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">{t.ex1tip}</div>
        </div>
      ),
    },
    {
      level: t.medium, color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex2q}</p>
          <ContohSedangSVG />
          <p>{t.ex2q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 1 — {t.ex2s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="K = 2 \times (p + l)" />
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 2 — {t.ex2s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
            <p>K = 70 m, l = 12 m</p>
            <BlockMath math="70 = 2 \times (p + 12)" />
            <BlockMath math="35 = p + 12" />
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 3 — {t.ex2s3}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="p = 35 - 12 = 23 \text{ m}" />
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
            <p className="text-yellow-300 font-semibold">{t.ex2ans}</p>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
            {t.ex2chk} <InlineMath math="K = 2 \times (23 + 12) = 2 \times 35 = 70 \text{ m}" /> ✓
          </div>
        </div>
      ),
    },
    {
      level: t.hard, color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex3q}</p>
          <ContohSulitSVG />
          <ul className="list-disc list-inside text-white/80 space-y-1 ml-2 text-xs">
            {t.ex3li.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p>{t.ex3q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-red-400">{t.step} 1 — {t.ex3s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-2">
            <p>{t.ex3s1p1}</p>
            <p>{t.ex3s1p2}</p>
            <BlockMath math="FA = ED + BC" />
            <BlockMath math="8 = 5 + BC \Rightarrow BC = 3 \text{ cm}" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 2 — {t.ex3s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-1">
            <p>{t.ex3s2p1}</p>
            <p className="text-yellow-300">{t.ex3s2warn}</p>
            <p>{t.ex3s2p2}</p>
            <p className="text-cyan-300">{t.ex3s2p3}</p>
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 3 — {t.ex3s3}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex3s3p}</p>
            <BlockMath math="K = FA + AB + BC + CD + DE + EF" />
            <BlockMath math="K = 8 + 13 + 3 + 4 + 5 + 9" />
            <BlockMath math="K = 42 \text{ cm}" />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
            <p className="text-red-300 font-semibold">{t.ex3ans}</p>
            <p className="text-white/80">{t.ex3a1}</p>
            <p className="text-white/80">{t.ex3a2}</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            🔑 <strong>{t.ex3tip}</strong> {t.ex3tipText}
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
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">{t.title1}</h1>
        <h2 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center leading-tight">{t.title2}</h2>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.breadcrumb}</p>

        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            {t.intro}<strong className="text-cyan-300">{t.introHighlight}</strong>{t.introMid}<strong className="text-yellow-300">{t.introHighlight2}</strong>{t.introEnd}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {sections.map((sec, i) => (<AccordionSection key={sec.title} section={sec} idx={i} />))}
        </div>

        <div className="mb-4">
          <h3 className="font-display text-base font-bold text-white text-center mb-1">{t.examplesTitle}</h3>
          <p className="text-white/40 text-xs text-center mb-4 font-body">{t.examplesSubtitle}</p>
          <div className="flex flex-col gap-4">
            {examples.map((ex, i) => (<ExampleCard key={ex.level} ex={ex} idx={i} showLabel={t.showSolution} hideLabel={t.hideSolution} exLabel={t.example} />))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/segitiga-dan-segiempat"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingSegitigaSegiempatPage;
