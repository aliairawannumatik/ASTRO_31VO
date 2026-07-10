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
    title: "LUAS SEGIEMPAT",
    breadcrumb: "Kelas 7 · Segitiga dan Segiempat",
    back: "← Kembali ke Segitiga dan Segiempat",
    intro: "Dari menghitung luas lantai yang akan dikeramik, lahan pertanian berbentuk trapesium, hingga desain layang-layang kertas — semuanya membutuhkan pemahaman",
    introHighlight: " luas segiempat",
    introEnd: ". Di sini kita akan menguasai rumus luas enam jenis bangun segiempat sekaligus, mulai dari yang paling sederhana hingga yang paling unik!",
    examplesTitle: "🚀 Contoh Soal",
    examplesSubtitle: "Latihan bertahap dari mudah hingga sulit",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "CONTOH",
    showSolution: "Lihat Pembahasan",
    hideSolution: "Sembunyikan Pembahasan",
    step: "Langkah",
    // SVG labels
    svgLength: "p (panjang)",
    svgWidth: "l (lebar)",
    svgBase: "a (alas)",
    svgSideTop: "a (sisi atas)",
    svgSideBottom: "b (sisi bawah)",
    // Section titles
    sec1: "Luas Persegi Panjang & Persegi",
    sec2: "Luas Jajargenjang",
    sec3: "Luas Trapesium",
    sec4: "Luas Belah Ketupat & Layang-layang",
    sec5: "Tabel Ringkasan Semua Rumus Luas",
    // Section 1
    s1p1: "Bayangkan kamu memasang eternit (ubin langit-langit) berbentuk persegi 1 m × 1 m di ruangan berukuran 5 m × 3 m. Berapa lembar eternit yang dibutuhkan? Ternyata jawabannya langsung memberikan kita",
    s1formula1: " rumus luas persegi panjang",
    s1rect: "① Persegi Panjang",
    s1p: "= panjang,", s1l: "= lebar",
    s1note1: "📌 Luas persegi panjang = jumlah petak satuan yang memenuhi seluruh bidang. Cara menghitungnya: banyak baris × banyak kolom.",
    s1sq: "② Persegi",
    s1sqDesc: "Persegi adalah persegi panjang dengan",
    s1sqDesc2: "semua sisi sama panjang",
    s1sqDesc3: ", sehingga",
    s1tip: "🔑 Cara cepat bedakan:",
    s1tipRect: "• Persegi panjang →",
    s1tipSq: "• Persegi →",
    s1tipRectEnd: "(dua ukuran berbeda)",
    s1tipSqEnd: "(satu ukuran dikuadratkan)",
    // Section 2
    s2p1: "Jajargenjang bisa dianggap sebagai persegi panjang yang \"digeser\" — kalau kita",
    s2p1mid: " potong dan pindahkan",
    s2p1end: " segitiga di salah satu ujungnya ke ujung lain, kita mendapat persegi panjang! Sehingga luasnya pun sama.",
    s2alas: "= panjang alas,",
    s2tinggi: "= tinggi (tegak lurus ke alas)",
    s2warn: "⚠️ Perhatian:",
    s2warnText: "Tinggi jajargenjang adalah jarak tegak lurus antara dua sisi sejajar, bukan panjang sisi miring! Jangan tertukar dengan panjang sisi",
    s2tip: "💡 Bukti visual:",
    s2tipText: "Potong segitiga di sisi kiri jajargenjang, tempelkan di sisi kanan → jadilah persegi panjang dengan panjang",
    s2tipEnd: "dan lebar",
    // Section 3
    s3p1: "Trapesium punya dua sisi yang sejajar tapi berbeda panjang. Cara menemukan rumus luasnya: gabungkan dua trapesium yang identik menjadi sebuah",
    s3p1mid: " jajargenjang",
    s3p1end: ", lalu bagi dua hasilnya.",
    s3a: "= panjang sisi atas (sejajar atas),",
    s3b: "= panjang sisi bawah (sejajar bawah),",
    s3t: "= tinggi (jarak tegak lurus antar dua sisi sejajar)",
    s3tip: "🔑 Cara mudah mengingat:",
    s3tipText: "Rumus trapesium mirip rata-rata dua sisi sejajar dikalikan tinggi.",
    s3tipMath: "adalah panjang rata-rata kedua sisi sejajar!",
    // Section 4
    s4bk: "① Belah Ketupat",
    s4bkp1: "Kedua diagonal belah ketupat saling berpotongan tegak lurus dan saling membagi dua. Bila kita gambar persegi panjang di sekeliling belah ketupat, luasnya tepat",
    s4bkp1mid: " setengah",
    s4bkp1end: " dari persegi panjang tersebut.",
    s4bkD1: "= panjang diagonal pertama,",
    s4bkD2: "= panjang diagonal kedua",
    s4ll: "② Layang-layang",
    s4llp1: "Layang-layang juga memiliki dua diagonal yang saling tegak lurus — satu diagonal membagi yang lain menjadi dua. Karena strukturnya mirip belah ketupat,",
    s4llp1mid: " rumus luasnya sama",
    s4llDiff: "🎯 Bedanya dengan belah ketupat:",
    s4llDiffText: "Pada belah ketupat, semua sisinya sama panjang. Pada layang-layang, hanya dua pasang sisi berdekatan yang sama panjang. Tapi rumus luasnya identik!",
    // Table
    tblShape: "Bangun", tblFormula: "Rumus Luas", tblNote: "Keterangan",
    tblPattern: "🔑 Pola yang perlu diingat:",
    tblP1: "• Persegi & Persegi Panjang → kalikan dua ukuran sisi",
    tblP2: "• Jajargenjang & Trapesium → melibatkan tinggi tegak lurus",
    tblP3: "• Belah Ketupat & Layang-layang → ½ × perkalian dua diagonal",
    tblRows: [
      ["▭ Persegi Panjang", "L = p × l", "p = panjang, l = lebar"],
      ["■ Persegi", "L = s²", "s = panjang sisi"],
      ["⬡ Jajargenjang", "L = a × t", "a = alas, t = tinggi ⊥"],
      ["⬢ Trapesium", "L = ½(a+b)×t", "a,b = sisi sejajar, t = tinggi"],
      ["◆ Belah Ketupat", "L = ½ × d₁ × d₂", "d₁, d₂ = dua diagonal"],
      ["🪁 Layang-layang", "L = ½ × d₁ × d₂", "d₁, d₂ = dua diagonal"],
    ],
    // Examples
    ex1q: "Sebuah kamar tidur berbentuk persegi panjang berukuran panjang 24 cm dan lebar 15 cm.",
    ex1q2: "Hitunglah luas kamar tidur tersebut!",
    ex1s1: "Identifikasi nilai yang diketahui:",
    ex1s1p: "p = 24 cm, l = 15 cm",
    ex1s2: "Hitung luas:",
    ex1ans: "Jawaban: Luas kamar = 360 cm²",
    ex2q: "Sebuah jembatan memiliki penampang berbentuk trapesium. Sisi atas (sejajar) panjangnya 8 m, sisi bawah (sejajar) panjangnya 14 m, dan tingginya 9 m.",
    ex2q2: "Jika biaya pengecatan Rp 50.000 per m², berapa total biaya untuk mengecat seluruh penampang jembatan tersebut?",
    ex2given: "Diketahui: sisi atas",
    ex2s1: "Hitung luas trapesium:",
    ex2s2: "Hitung total biaya pengecatan:",
    ex2ans: "✅ Jawaban:",
    ex2a1: "• Luas penampang jembatan",
    ex2a2: "• Total biaya pengecatan",
    ex2chk: "✅ Cek:",
    ex2chkEnd: "(rata-rata sisi sejajar), lalu",
    ex3q: "Sebuah taman berbentuk belah ketupat dengan panjang diagonal-diagonalnya",
    ex3q2: "Tentukan:",
    ex3li: ["Luas taman", "Panjang sisi belah ketupat", "Keliling taman"],
    ex3s1: "Hitung luas belah ketupat:",
    ex3s2: "Hitung panjang sisi menggunakan Pythagoras:",
    ex3s2p1: "Diagonal saling berpotongan tegak lurus dan membagi dua → setengah diagonal:",
    ex3s2p2: "Setiap sisi belah ketupat adalah hipotenusa segitiga siku-siku kecil:",
    ex3s3: "Hitung keliling:",
    ex3ans: "✅ Jawaban:",
    ex3a1: "• Luas taman",
    ex3a2: "• Panjang sisi",
    ex3a3: "• Keliling",
    ex3tip: "🔑 Kunci soal ini:",
    ex3tipText: "Luas pakai rumus diagonal, tapi untuk sisi dan keliling harus pakai Teorema Pythagoras pada segitiga siku-siku yang terbentuk oleh setengah-setengah diagonal.",
  },
  en: {
    title: "AREA OF QUADRILATERALS",
    breadcrumb: "Grade 7 · Triangles & Quadrilaterals",
    back: "← Back to Triangles & Quadrilaterals",
    intro: "From calculating floor tile area, trapezoid-shaped farmland, to kite paper designs — all require understanding the",
    introHighlight: " area of quadrilaterals",
    introEnd: ". Here we will master area formulas for six types of quadrilaterals, from the simplest to the most unique!",
    examplesTitle: "🚀 Example Problems",
    examplesSubtitle: "Progressive exercises from easy to hard",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "EXAMPLE",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
    step: "Step",
    svgLength: "p (length)",
    svgWidth: "l (width)",
    svgBase: "a (base)",
    svgSideTop: "a (top side)",
    svgSideBottom: "b (bottom side)",
    sec1: "Area of Rectangle & Square",
    sec2: "Area of Parallelogram",
    sec3: "Area of Trapezoid",
    sec4: "Area of Rhombus & Kite",
    sec5: "Summary Table of All Area Formulas",
    s1p1: "Imagine installing 1 m × 1 m ceiling tiles in a room that is 5 m × 3 m. How many tiles are needed? The answer directly gives us the",
    s1formula1: " rectangle area formula",
    s1rect: "① Rectangle",
    s1p: "= length,", s1l: "= width",
    s1note1: "📌 Area of a rectangle = number of unit squares filling the surface. Method: number of rows × number of columns.",
    s1sq: "② Square",
    s1sqDesc: "A square is a rectangle with",
    s1sqDesc2: "all sides equal",
    s1sqDesc3: ", so",
    s1tip: "🔑 Quick distinction:",
    s1tipRect: "• Rectangle →",
    s1tipSq: "• Square →",
    s1tipRectEnd: "(two different dimensions)",
    s1tipSqEnd: "(one dimension squared)",
    s2p1: "A parallelogram can be thought of as a \"shifted\" rectangle — if you",
    s2p1mid: " cut and move",
    s2p1end: " the triangle from one end to the other, you get a rectangle! So the area is the same.",
    s2alas: "= base length,",
    s2tinggi: "= height (perpendicular to base)",
    s2warn: "⚠️ Note:",
    s2warnText: "The height of a parallelogram is the perpendicular distance between the two parallel sides, NOT the length of the slanted side! Don't confuse it with side",
    s2tip: "💡 Visual proof:",
    s2tipText: "Cut the triangle from the left side of the parallelogram, attach it to the right side → you get a rectangle with length",
    s2tipEnd: "and width",
    s3p1: "A trapezoid has two parallel sides of different lengths. To find the area formula: join two identical trapezoids to form a",
    s3p1mid: " parallelogram",
    s3p1end: ", then divide by two.",
    s3a: "= top side (parallel top),",
    s3b: "= bottom side (parallel bottom),",
    s3t: "= height (perpendicular distance between the two parallel sides)",
    s3tip: "🔑 Easy to remember:",
    s3tipText: "The trapezoid formula is like the average of the two parallel sides times the height.",
    s3tipMath: "is the average length of the two parallel sides!",
    s4bk: "① Rhombus",
    s4bkp1: "The two diagonals of a rhombus are perpendicular bisectors of each other. If we draw a rectangle around the rhombus, its area is exactly",
    s4bkp1mid: " half",
    s4bkp1end: " of that rectangle.",
    s4bkD1: "= length of first diagonal,",
    s4bkD2: "= length of second diagonal",
    s4ll: "② Kite",
    s4llp1: "A kite also has two perpendicular diagonals — one diagonal bisects the other. Because its structure is similar to a rhombus,",
    s4llp1mid: " the area formula is the same",
    s4llDiff: "🎯 Difference from rhombus:",
    s4llDiffText: "In a rhombus, all sides are equal. In a kite, only two pairs of adjacent sides are equal. But the area formula is identical!",
    tblShape: "Shape", tblFormula: "Area Formula", tblNote: "Notes",
    tblPattern: "🔑 Key patterns to remember:",
    tblP1: "• Square & Rectangle → multiply two side dimensions",
    tblP2: "• Parallelogram & Trapezoid → involves perpendicular height",
    tblP3: "• Rhombus & Kite → ½ × product of two diagonals",
    tblRows: [
      ["▭ Rectangle", "A = l × w", "l = length, w = width"],
      ["■ Square", "A = s²", "s = side length"],
      ["⬡ Parallelogram", "A = b × h", "b = base, h = height ⊥"],
      ["⬢ Trapezoid", "A = ½(a+b)×h", "a,b = parallel sides, h = height"],
      ["◆ Rhombus", "A = ½ × d₁ × d₂", "d₁, d₂ = two diagonals"],
      ["🪁 Kite", "A = ½ × d₁ × d₂", "d₁, d₂ = two diagonals"],
    ],
    ex1q: "A rectangular bedroom has a length of 24 cm and a width of 15 cm.",
    ex1q2: "Calculate the area of the bedroom.",
    ex1s1: "Identify the given values:",
    ex1s1p: "l = 24 cm, w = 15 cm",
    ex1s2: "Calculate the area:",
    ex1ans: "Answer: Area = 360 cm²",
    ex2q: "A bridge has a trapezoidal cross-section. The top side (parallel) is 8 m, the bottom side (parallel) is 14 m, and the height is 9 m.",
    ex2q2: "If the painting cost is IDR 50,000 per m², what is the total cost to paint the entire bridge cross-section?",
    ex2given: "Given: top side",
    ex2s1: "Calculate the trapezoid area:",
    ex2s2: "Calculate the total painting cost:",
    ex2ans: "✅ Answer:",
    ex2a1: "• Area of bridge cross-section",
    ex2a2: "• Total painting cost",
    ex2chk: "✅ Check:",
    ex2chkEnd: "(average of parallel sides), then",
    ex3q: "A rhombus-shaped garden has diagonals",
    ex3q2: "Find:",
    ex3li: ["Garden area", "Side length of the rhombus", "Perimeter of the garden"],
    ex3s1: "Calculate the rhombus area:",
    ex3s2: "Calculate the side length using Pythagorean theorem:",
    ex3s2p1: "Diagonals bisect each other perpendicularly → half diagonals:",
    ex3s2p2: "Each side of the rhombus is the hypotenuse of a small right triangle:",
    ex3s3: "Calculate the perimeter:",
    ex3ans: "✅ Answer:",
    ex3a1: "• Garden area",
    ex3a2: "• Side length",
    ex3a3: "• Perimeter",
    ex3tip: "🔑 Key insight:",
    ex3tipText: "Use the diagonal formula for area, but for side length and perimeter you must use the Pythagorean theorem on the small right triangles formed by the half-diagonals.",
  },
  ja: {
    title: "四角形の面積",
    breadcrumb: "中学1年 · 三角形と四角形",
    back: "← 三角形と四角形に戻る",
    intro: "床タイルの面積計算から台形の農地、凧の設計まで——すべてに",
    introHighlight: "四角形の面積",
    introEnd: "の理解が必要です。ここでは6種類の四角形の面積公式を、最もシンプルなものから最もユニークなものまでマスターします！",
    examplesTitle: "🚀 例題",
    examplesSubtitle: "基本から発展まで段階的に練習",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題",
    showSolution: "解説を見る",
    hideSolution: "解説を隠す",
    step: "ステップ",
    svgLength: "p (長さ)",
    svgWidth: "l (幅)",
    svgBase: "a (底辺)",
    svgSideTop: "a (上辺)",
    svgSideBottom: "b (下辺)",
    sec1: "長方形と正方形の面積",
    sec2: "平行四辺形の面積",
    sec3: "台形の面積",
    sec4: "ひし形と凧形の面積",
    sec5: "面積公式まとめ表",
    s1p1: "1 m × 1 m の正方形の天井タイルを5 m × 3 m の部屋に貼る場合、何枚必要ですか？その答えが直接",
    s1formula1: "長方形の面積公式",
    s1rect: "① 長方形",
    s1p: "= 長さ、", s1l: "= 幅",
    s1note1: "📌 長方形の面積 = 全面を埋める単位正方形の数。計算方法：行数 × 列数。",
    s1sq: "② 正方形",
    s1sqDesc: "正方形は",
    s1sqDesc2: "すべての辺が等しい",
    s1sqDesc3: "特別な長方形で、",
    s1tip: "🔑 判別のコツ：",
    s1tipRect: "• 長方形 →",
    s1tipSq: "• 正方形 →",
    s1tipRectEnd: "（2つの異なる寸法）",
    s1tipSqEnd: "（1つの寸法を2乗）",
    s2p1: "平行四辺形は「ずらした」長方形と考えられます——一方の端の三角形を",
    s2p1mid: "切り取って反対側に貼り付ける",
    s2p1end: "と長方形になります！そのため面積も同じです。",
    s2alas: "= 底辺の長さ、",
    s2tinggi: "= 高さ（底辺に垂直）",
    s2warn: "⚠️ 注意：",
    s2warnText: "平行四辺形の高さは2つの平行な辺の間の垂直距離であり、斜辺の長さではありません！辺",
    s2tip: "💡 視覚的証明：",
    s2tipText: "平行四辺形の左側の三角形を切り取り、右側に貼り付けると、長さ",
    s2tipEnd: "、幅",
    s4bk: "① ひし形",
    s4bkp1: "ひし形の2本の対角線は互いに垂直で、互いに2等分します。ひし形の周りに長方形を描くと、面積はその長方形の",
    s4bkp1mid: "ちょうど半分",
    s4bkp1end: "です。",
    s4bkD1: "= 第1対角線の長さ、",
    s4bkD2: "= 第2対角線の長さ",
    s4ll: "② 凧形（カイト）",
    s4llp1: "凧形にも垂直な2本の対角線があり、一方が他方を2等分します。ひし形と構造が似ているため、",
    s4llp1mid: "面積公式は同じです",
    s4llDiff: "🎯 ひし形との違い：",
    s4llDiffText: "ひし形はすべての辺が等しい。凧形は隣り合う2組の辺が等しいだけ。でも面積公式は同じです！",
    s3p1: "台形は2つの平行な辺の長さが異なります。面積公式の導き方：2つの同じ台形を合わせて",
    s3p1mid: "平行四辺形",
    s3p1end: "を作り、2で割ります。",
    s3a: "= 上辺（上の平行辺）、",
    s3b: "= 下辺（下の平行辺）、",
    s3t: "= 高さ（2つの平行辺の垂直距離）",
    s3tip: "🔑 覚え方のコツ：",
    s3tipText: "台形の公式は2つの平行辺の平均に高さを掛けたものです。",
    s3tipMath: "は2つの平行辺の平均の長さです！",
    tblShape: "図形", tblFormula: "面積公式", tblNote: "説明",
    tblPattern: "🔑 覚えるべきパターン：",
    tblP1: "• 正方形・長方形 → 2つの辺の寸法を掛ける",
    tblP2: "• 平行四辺形・台形 → 垂直な高さが関わる",
    tblP3: "• ひし形・凧形 → ½ × 2本の対角線の積",
    tblRows: [
      ["▭ 長方形", "S = l × w", "l = 長さ、w = 幅"],
      ["■ 正方形", "S = s²", "s = 辺の長さ"],
      ["⬡ 平行四辺形", "S = b × h", "b = 底辺、h = 高さ ⊥"],
      ["⬢ 台形", "S = ½(a+b)×h", "a,b = 平行辺、h = 高さ"],
      ["◆ ひし形", "S = ½ × d₁ × d₂", "d₁、d₂ = 2本の対角線"],
      ["🪁 凧形", "S = ½ × d₁ × d₂", "d₁、d₂ = 2本の対角線"],
    ],
    ex1q: "長方形の寝室の長さは24 cm、幅は15 cm です。",
    ex1q2: "寝室の面積を求めなさい。",
    ex1s1: "わかっている値を確認する：",
    ex1s1p: "l = 24 cm、w = 15 cm",
    ex1s2: "面積を計算する：",
    ex1ans: "答え：面積 = 360 cm²",
    ex2q: "橋の断面は台形の形をしています。上辺（平行）は8 m、下辺（平行）は14 m、高さは9 m です。",
    ex2q2: "ペンキの費用が1 m²あたり50,000円の場合、橋の断面全体を塗るのにかかる費用はいくらですか？",
    ex2given: "わかっていること：上辺",
    ex2s1: "台形の面積を計算する：",
    ex2s2: "塗装費用を計算する：",
    ex2ans: "✅ 答え：",
    ex2a1: "• 橋の断面積",
    ex2a2: "• 塗装費用の合計",
    ex2chk: "✅ 確認：",
    ex2chkEnd: "（平行辺の平均）、次に",
    ex3q: "ひし形の公園の対角線の長さは",
    ex3q2: "次を求めなさい：",
    ex3li: ["公園の面積", "ひし形の辺の長さ", "公園の周長"],
    ex3s1: "ひし形の面積を計算する：",
    ex3s2: "三平方の定理を使って辺の長さを計算する：",
    ex3s2p1: "対角線は互いに垂直に2等分される → 対角線の半分：",
    ex3s2p2: "ひし形の各辺は小さな直角三角形の斜辺：",
    ex3s3: "周長を計算する：",
    ex3ans: "✅ 答え：",
    ex3a1: "• 公園の面積",
    ex3a2: "• 辺の長さ",
    ex3a3: "• 周長",
    ex3tip: "🔑 この問題のポイント：",
    ex3tipText: "面積は対角線の公式を使い、辺の長さと周長は半分の対角線が作る小さな直角三角形に三平方の定理を使います。",
  },
};

/* ══════════════════════════════════════════════════════════
   SVG DIAGRAMS
══════════════════════════════════════════════════════════ */
const PersegiPanjangLuasSVG = ({ labelLength, labelWidth }: { labelLength: string; labelWidth: string }) => (
  <svg viewBox="0 0 320 190" className="w-full max-w-sm mx-auto my-3" aria-label="Rectangle area">
    {[0,1,2].map(i => (<line key={`gh${i}`} x1="30" y1={50+i*40} x2="270" y2={50+i*40} stroke="#334155" strokeWidth="0.8"/>))}
    {[0,1,2,3,4,5].map(i => (<line key={`gv${i}`} x1={30+i*48} y1="50" x2={30+i*48} y2={130} stroke="#334155" strokeWidth="0.8"/>))}
    <rect x="30" y="50" width="240" height="80" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="30" y1="145" x2="270" y2="145" stroke="#4ade80" strokeWidth="1.5"/>
    <line x1="285" y1="50" x2="285" y2="130" stroke="#facc15" strokeWidth="1.5"/>
    <text x="150" y="95" fill="#a78bfa" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">p × l</text>
    <text x="150" y="158" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">{labelLength}</text>
    <text x="298" y="93" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle" transform="rotate(90,298,93)">{labelWidth}</text>
    <text x="20" y="45" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="268" y="45" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="20" y="138" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="268" y="138" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <rect x="80" y="58" width="160" height="26" rx="5" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1"/>
    <text x="160" y="75" fill="#a78bfa" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">L = p × l</text>
  </svg>
);

const PersegiLuasSVG = () => (
  <svg viewBox="0 0 220 210" className="w-full max-w-xs mx-auto my-3" aria-label="Square area">
    {[0,1,2,3,4].map(i => (<line key={`h${i}`} x1="30" y1={30+i*36} x2={30+4*36} y2={30+i*36} stroke="#334155" strokeWidth="0.8"/>))}
    {[0,1,2,3,4].map(i => (<line key={`v${i}`} x1={30+i*36} y1="30" x2={30+i*36} y2={30+4*36} stroke="#334155" strokeWidth="0.8"/>))}
    <rect x="30" y="30" width="144" height="144" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="2"/>
    <rect x="30" y="162" width="12" height="12" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="19" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="178" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="19" y="183" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="178" y="183" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="98" y="24" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle">s</text>
    <text x="98" y="192" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle">s</text>
    <text x="12" y="104" fill="#facc15" fontSize="12" fontFamily="monospace">s</text>
    <text x="190" y="104" fill="#facc15" fontSize="12" fontFamily="monospace">s</text>
    <text x="70" y="108" fill="#4ade80" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L = s²</text>
  </svg>
);

const JajargenjangLuasSVG = ({ labelBase }: { labelBase: string }) => (
  <svg viewBox="0 0 320 200" className="w-full max-w-sm mx-auto my-3" aria-label="Parallelogram area">
    <polygon points="70,30 290,30 230,155 10,155" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2"/>
    <line x1="230" y1="30" x2="230" y2="155" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="218" y="143" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <line x1="10" y1="172" x2="230" y2="172" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="58" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="292" y="25" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="0" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="230" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="116" y="185" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">{labelBase}</text>
    <text x="240" y="97" fill="#facc15" fontSize="12" fontFamily="monospace">t</text>
    <text x="100" y="105" fill="#fb923c" fontSize="12" fontFamily="monospace" fontWeight="bold">L = a × t</text>
  </svg>
);

const TrapesiumLuasSVG = ({ labelTop, labelBottom }: { labelTop: string; labelBottom: string }) => (
  <svg viewBox="0 0 320 200" className="w-full max-w-sm mx-auto my-3" aria-label="Trapezoid area">
    <polygon points="80,35 240,35 290,155 30,155" fill="rgba(248,113,113,0.12)" stroke="#f87171" strokeWidth="2"/>
    <line x1="200" y1="35" x2="200" y2="155" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="188" y="143" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <text x="67" y="30" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="243" y="30" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="17" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="292" y="168" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="160" y="28" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">{labelTop}</text>
    <text x="160" y="172" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">{labelBottom}</text>
    <text x="208" y="100" fill="#facc15" fontSize="12" fontFamily="monospace">t</text>
    <text x="55" y="108" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">L = ½(a+b)×t</text>
  </svg>
);

const BelahKetupatLuasSVG = () => (
  <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto my-3" aria-label="Rhombus area using diagonals">
    <polygon points="130,18 220,110 130,202 40,110" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="2"/>
    <line x1="40" y1="110" x2="220" y2="110" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3"/>
    <line x1="130" y1="18" x2="130" y2="202" stroke="#f87171" strokeWidth="2" strokeDasharray="6,3"/>
    <rect x="130" y="110" width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
    <text x="125" y="12" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="224" y="114" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="125" y="215" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="22" y="114" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="130" y="104" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">d₁</text>
    <text x="148" y="138" fill="#f87171" fontSize="11" fontFamily="monospace">d₂</text>
    <text x="25" y="65" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">L = ½×d₁×d₂</text>
  </svg>
);

const LayangLayangLuasSVG = () => (
  <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto my-3" aria-label="Kite area using diagonals">
    <polygon points="120,15 195,100 120,220 45,100" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="120" y1="15" x2="120" y2="220" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3"/>
    <line x1="45" y1="100" x2="195" y2="100" stroke="#f87171" strokeWidth="2" strokeDasharray="6,3"/>
    <rect x="120" y="100" width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
    <text x="114" y="10" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="198" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="114" y="233" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="28" y="104" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="127" y="66" fill="#facc15" fontSize="11" fontFamily="monospace">d₁</text>
    <text x="100" y="95" fill="#f87171" fontSize="11" fontFamily="monospace">d₂</text>
    <text x="18" y="50" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold">L = ½×d₁×d₂</text>
  </svg>
);

const ContohMudahSVG = () => (
  <svg viewBox="0 0 300 170" className="w-full max-w-xs mx-auto my-2" aria-label="Rectangle 24 by 15 cm">
    {[0,1,2].map(i => <line key={`h${i}`} x1="20" y1={40+i*30} x2="260" y2={40+i*30} stroke="#1e293b" strokeWidth="0.8"/>)}
    {[0,1,2,3,4,5,6,7].map(i => <line key={`v${i}`} x1={20+i*34} y1="40" x2={20+i*34} y2="100" stroke="#1e293b" strokeWidth="0.8"/>)}
    <rect x="20" y="40" width="240" height="60" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="2"/>
    <text x="10" y="35" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="262" y="35" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="112" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="262" y="112" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="140" y="74" fill="#a78bfa" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">L = ?</text>
    <text x="140" y="120" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">p = 24 cm</text>
    <text x="278" y="74" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle" transform="rotate(90,278,74)">l = 15 cm</text>
  </svg>
);

const ContohSedangSVG = () => (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-2" aria-label="Trapezoid with top 8 bottom 14 height 9">
    <polygon points="70,35 200,35 250,165 20,165" fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="2"/>
    <line x1="170" y1="35" x2="170" y2="165" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="158" y="153" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <text x="56" y="28" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="202" y="28" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="7" y="178" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="252" y="178" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="135" y="26" fill="#22d3ee" fontSize="11" fontFamily="monospace" textAnchor="middle">a = 8 m</text>
    <text x="135" y="182" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">b = 14 m</text>
    <text x="178" y="104" fill="#facc15" fontSize="11" fontFamily="monospace">t = 9 m</text>
  </svg>
);

const ContohSulitSVG = () => (
  <svg viewBox="0 0 260 230" className="w-full max-w-xs mx-auto my-2" aria-label="Rhombus diagonals 20 and 24">
    <polygon points="130,18 218,115 130,212 42,115" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2"/>
    <line x1="42" y1="115" x2="218" y2="115" stroke="#facc15" strokeWidth="2" strokeDasharray="6,3"/>
    <line x1="130" y1="18" x2="130" y2="212" stroke="#f87171" strokeWidth="2" strokeDasharray="6,3"/>
    <rect x="130" y="115" width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
    <text x="124" y="12" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="220" y="120" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="124" y="225" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="24" y="120" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="172" y="109" fill="#facc15" fontSize="11" fontFamily="monospace">d₁=20m</text>
    <text x="133" y="80" fill="#f87171" fontSize="11" fontFamily="monospace">d₂=24m</text>
    <text x="22" y="42" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">s = ?</text>
    <text x="22" y="54" fill="#22d3ee" fontSize="10" fontFamily="monospace">L = ?</text>
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
const LuasSegiempatPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const sections: Section[] = [
    {
      title: t.sec1, icon: "▭",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s1p1}<strong className="text-violet-300">{t.s1formula1}</strong>!</p>
          <div className="space-y-3">
            <p className="text-violet-300 font-semibold">{t.s1rect}</p>
            <PersegiPanjangLuasSVG labelLength={t.svgLength} labelWidth={t.svgWidth} />
            <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
              <p className="text-violet-300 font-semibold text-xs">📐 {language === "id" ? "Rumus" : language === "en" ? "Formula" : "公式"}</p>
              <div className="text-center"><BlockMath math="L_{\text{pp}} = p \times l" /></div>
              <p className="text-white/60 text-xs"><InlineMath math="p" /> {t.s1p} <InlineMath math="l" /> {t.s1l}</p>
            </div>
            <blockquote className="border-l-4 border-violet-500 pl-3 text-violet-200 text-xs italic">{t.s1note1}</blockquote>
          </div>
          <div className="border-t border-slate-700/50 pt-4 space-y-3">
            <p className="text-green-300 font-semibold">{t.s1sq}</p>
            <p>{t.s1sqDesc} <strong>{t.s1sqDesc2}</strong>{t.s1sqDesc3} <InlineMath math="p = l = s" />.</p>
            <PersegiLuasSVG />
            <div className="bg-green-950/60 border border-green-700/50 rounded-lg p-4 text-center">
              <BlockMath math="L_{\square} = s \times s = s^2" />
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            🔑 <strong className="text-white">{t.s1tip}</strong>
            <p>{t.s1tipRect} <InlineMath math="L = p \times l" /> {t.s1tipRectEnd}</p>
            <p>{t.s1tipSq} <InlineMath math="L = s^2" /> {t.s1tipSqEnd}</p>
          </div>
        </div>
      ),
    },
    {
      title: t.sec2, icon: "⬡",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s2p1}<strong className="text-orange-300">{t.s2p1mid}</strong>{t.s2p1end}</p>
          <JajargenjangLuasSVG labelBase={t.svgBase} />
          <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
            <p className="text-orange-300 font-semibold text-xs">📐 {language === "id" ? "Rumus" : language === "en" ? "Formula" : "公式"}</p>
            <div className="text-center"><BlockMath math="L_{\text{jj}} = a \times t" /></div>
            <p className="text-white/60 text-xs"><InlineMath math="a" /> {t.s2alas} <InlineMath math="t" /> {t.s2tinggi}</p>
          </div>
          <div className="bg-orange-950/40 border border-orange-600/30 rounded-lg p-3 text-xs text-orange-200 space-y-1">
            {t.s2warn} <strong>{t.s2warnText}</strong> <InlineMath math="b" />.
          </div>
          <blockquote className="border-l-4 border-orange-500 pl-3 text-orange-200 text-xs italic">
            {t.s2tip} {t.s2tipText} <InlineMath math="a" /> {t.s2tipEnd} <InlineMath math="t" />.
          </blockquote>
        </div>
      ),
    },
    {
      title: t.sec3, icon: "⬢",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s3p1}<strong className="text-red-300">{t.s3p1mid}</strong>{t.s3p1end}</p>
          <TrapesiumLuasSVG labelTop={t.svgSideTop} labelBottom={t.svgSideBottom} />
          <div className="bg-red-950/60 border border-red-700/50 rounded-lg p-4 space-y-2">
            <p className="text-red-300 font-semibold text-xs">📐 {language === "id" ? "Rumus" : language === "en" ? "Formula" : "公式"}</p>
            <div className="text-center"><BlockMath math="L_{\text{trap}} = \frac{1}{2} \times (a + b) \times t" /></div>
            <p className="text-white/60 text-xs"><InlineMath math="a" /> {t.s3a} <InlineMath math="b" /> {t.s3b} <InlineMath math="t" /> {t.s3t}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
            🔑 <strong className="text-white">{t.s3tip}</strong> {t.s3tipText} <InlineMath math="\frac{a+b}{2}" /> {t.s3tipMath}
          </div>
        </div>
      ),
    },
    {
      title: t.sec4, icon: "💎",
      content: (
        <div className="space-y-5 text-sm text-white/85 font-body leading-relaxed">
          <div className="space-y-3">
            <p className="text-cyan-300 font-semibold">{t.s4bk}</p>
            <p>{t.s4bkp1}<strong className="text-cyan-300">{t.s4bkp1mid}</strong>{t.s4bkp1end}</p>
            <BelahKetupatLuasSVG />
            <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
              <p className="text-cyan-300 font-semibold text-xs">📐 {language === "id" ? "Rumus" : language === "en" ? "Formula" : "公式"}</p>
              <div className="text-center"><BlockMath math="L_{\text{bk}} = \frac{1}{2} \times d_1 \times d_2" /></div>
              <p className="text-white/60 text-xs"><InlineMath math="d_1" /> {t.s4bkD1} <InlineMath math="d_2" /> {t.s4bkD2}</p>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-4 space-y-3">
            <p className="text-violet-300 font-semibold">{t.s4ll}</p>
            <p>{t.s4llp1}<strong className="text-violet-300">{t.s4llp1mid}</strong>!</p>
            <LayangLayangLuasSVG />
            <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
              <p className="text-violet-300 font-semibold text-xs">📐 {language === "id" ? "Rumus" : language === "en" ? "Formula" : "公式"}</p>
              <div className="text-center"><BlockMath math="L_{\text{ll}} = \frac{1}{2} \times d_1 \times d_2" /></div>
            </div>
            <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">
              {t.s4llDiff} {t.s4llDiffText}
            </div>
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
                  <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{t.tblFormula}</th>
                  <th className="px-3 py-2 text-cyan-300">{t.tblNote}</th>
                </tr>
              </thead>
              <tbody>
                {t.tblRows.map(([shape, formula, note], i) => (
                  <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                    <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{shape}</td>
                    <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{formula}</td>
                    <td className="px-3 py-2 text-white/55 text-left">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p>{t.tblPattern}</p>
            <p>{t.tblP1}</p>
            <p>{t.tblP2}</p>
            <p>{t.tblP3}</p>
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
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70"><p>{t.ex1s1p}</p></div>
          <p className="text-white/80"><strong className="text-green-400">{t.step} 2 — {t.ex1s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L = p \times l = 24 \times 15 = 360 \text{ cm}^2" />
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
            <p className="text-green-300 font-semibold">✅ {t.ex1ans}</p>
          </div>
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
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 mb-2">
            <p>{t.ex2given} <InlineMath math="a = 8 \text{ m}" />, b = 14 m, t = 9 m</p>
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 1 — {t.ex2s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L = \frac{1}{2} \times (a + b) \times t" />
            <BlockMath math="L = \frac{1}{2} \times (8 + 14) \times 9" />
            <BlockMath math="L = \frac{1}{2} \times 22 \times 9 = \frac{198}{2} = 99 \text{ m}^2" />
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 2 — {t.ex2s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="\text{Cost} = 99 \times 50.000 = Rp\,4.950.000" />
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 space-y-1">
            <p className="text-yellow-300 font-semibold">{t.ex2ans}</p>
            <p className="text-white/80">{t.ex2a1} <InlineMath math="= 99 \text{ m}^2" /></p>
            <p className="text-white/80">{t.ex2a2} <InlineMath math="= Rp\,4.950.000" /></p>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
            {t.ex2chk} <InlineMath math="\frac{a+b}{2} = \frac{8+14}{2} = 11" /> {t.ex2chkEnd} <InlineMath math="11 \times 9 = 99 \text{ m}^2" /> ✓
          </div>
        </div>
      ),
    },
    {
      level: t.hard, color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex3q} <InlineMath math="d_1 = 20 \text{ m}" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="d_2 = 24 \text{ m}" />.</p>
          <ContohSulitSVG />
          <p>{t.ex3q2}</p>
          <ul className="list-disc list-inside text-white/80 space-y-1 ml-2 text-xs">
            {t.ex3li.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-red-400">{t.step} 1 — {t.ex3s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L = \frac{1}{2} \times d_1 \times d_2 = \frac{1}{2} \times 20 \times 24" />
            <BlockMath math="L = \frac{480}{2} = 240 \text{ m}^2" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 2 — {t.ex3s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs text-white/70 space-y-2">
            <p>{t.ex3s2p1}</p>
            <BlockMath math="\frac{d_1}{2} = 10 \text{ m}, \quad \frac{d_2}{2} = 12 \text{ m}" />
            <p>{t.ex3s2p2}</p>
            <BlockMath math="s = \sqrt{10^2 + 12^2} = \sqrt{100 + 144} = \sqrt{244} = 2\sqrt{61} \approx 15{,}62 \text{ m}" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 3 — {t.ex3s3}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="K = 4 \times s = 4 \times 2\sqrt{61} = 8\sqrt{61} \approx 62{,}48 \text{ m}" />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
            <p className="text-red-300 font-semibold">{t.ex3ans}</p>
            <p className="text-white/80">{t.ex3a1} <InlineMath math="= 240 \text{ m}^2" /></p>
            <p className="text-white/80">{t.ex3a2} <InlineMath math="= 2\sqrt{61} \approx 15{,}62 \text{ m}" /></p>
            <p className="text-white/80">{t.ex3a3} <InlineMath math="= 8\sqrt{61} \approx 62{,}48 \text{ m}" /></p>
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
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">{t.title}</h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.breadcrumb}</p>

        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>{t.intro}<strong className="text-cyan-300">{t.introHighlight}</strong>{t.introEnd}</p>
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

export default LuasSegiempatPage;
