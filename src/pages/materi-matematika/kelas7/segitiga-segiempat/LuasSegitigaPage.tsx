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
    title: "LUAS SEGITIGA",
    breadcrumb: "Kelas 7 · Segitiga dan Segiempat",
    back: "← Kembali ke Segitiga dan Segiempat",
    intro: "Dari memasang keramik lantai hingga menghitung luas lahan pertanian berbentuk segitiga — memahami",
    introHighlight: " luas segitiga",
    introMid: " adalah keterampilan matematika yang sangat berguna di kehidupan nyata. Hanya dengan satu rumus sederhana yang lahir dari persegi panjang, kita bisa menghitung luas",
    introHighlight2: " semua jenis segitiga!",
    examplesTitle: "🚀 Contoh Soal",
    examplesSubtitle: "Latihan bertahap dari mudah hingga sulit",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "CONTOH",
    showSolution: "Lihat Pembahasan",
    hideSolution: "Sembunyikan Pembahasan",
    step: "Langkah",
    // SVG labels
    svgBase: "a (alas)",
    svgHeight: "t (tinggi)",
    svgTriangle: "Segitiga",
    svgHalfRect: "½ persegi panjang",
    svgUnits: "satuan",
    svgUnits2: "satuan²",
    svgRectArea: "L.persegi",
    svgHyp: "miring",
    svgLegs: "kaki ⊥ kaki",
    // Section titles
    sec1: "Apa Itu Luas?",
    sec2: "Menurunkan Rumus Luas Segitiga",
    sec3: "Rumus Luas Segitiga",
    sec4: "Konversi Satuan Luas",
    // Section 1
    s1p1: "Bayangkan kamu ingin memasang keramik di lantai kamar berbentuk persegi panjang. Berapa banyak keramik yang kamu butuhkan? Jawabannya bergantung pada seberapa besar",
    s1area: " daerah yang perlu ditutupi",
    s1area2: " — itulah yang kita sebut",
    s1area3: " luas",
    s1def: "Definisi:",
    s1defText: "Luas daerah suatu bangun datar adalah banyaknya satuan luas yang diperlukan untuk menutupi seluruh bangun tersebut tanpa sisa dan tanpa tumpang tindih.",
    s1unit: "Satuan Luas",
    s1unitText: "ditulis sebagai kuadrat dari satuan panjang:",
    s1units: [["mm²","milimeter persegi"],["cm²","sentimeter persegi"],["m²","meter persegi"],["km²","kilometer persegi"],["ha","hektar (10.000 m²)"],["are","are (100 m²)"]],
    s1note: "📌 Bedakan:",
    s1noteText: "Keliling = jarak mengelilingi (satuan panjang). Luas = daerah yang tercakup (satuan persegi/kuadrat).",
    s1gridA: "a = 5 satuan",
    s1gridT: "t = 5 sat.",
    s1gridL: "sat.",
    s1gridRect: "= 25 sat²",
    // Section 2
    s2p1: "Rahasia rumus luas segitiga sebenarnya bisa ditemukan dari",
    s2p1mid: "! Mari kita eksplor cara menemukan rumusnya.",
    s2derive: "🔍 Proses Penurunan Rumus:",
    s2step1: "Langkah 1:",
    s2step1text: "Ambil sebuah persegi panjang dengan panjang",
    s2step1mid: "(alas) dan tinggi",
    s2step2: "Langkah 2:",
    s2step2text: "Tarik diagonal — persegi panjang terbagi menjadi dua segitiga yang ukurannya sama persis.",
    s2step3: "Langkah 3:",
    s2step3text: "Karena setiap segitiga adalah setengah dari persegi panjang:",
    s2fun: "💡 Fakta Keren:",
    s2funText: "Cara ini berlaku untuk semua jenis segitiga — lancip, siku-siku, maupun tumpul — selama",
    s2funMid: "adalah alas dan",
    s2funEnd: "adalah tinggi yang tegak lurus terhadap alas tersebut!",
    // Section 3
    s3main: "⭐ Rumus Utama",
    s3where: "= panjang alas,",
    s3where2: "= tinggi tegak lurus ke alas",
    s3warn: "⚠️ Hal Penting tentang \"Tinggi\":",
    s3warnText: "Tinggi segitiga (t) adalah panjang ruas garis yang ditarik dari salah satu titik sudut tegak lurus (90°) ke sisi yang menjadi alas (atau perpanjangannya). Tinggi ini belum tentu sama dengan panjang sisi!",
    s3right: "📐 Segitiga Siku-Siku (Istimewa!)",
    s3rightText: "Pada segitiga siku-siku, kedua kaki saling tegak lurus. Jadi satu kaki bisa jadi alas, dan kaki lainnya otomatis jadi tingginya.",
    s3equil: "🔺 Segitiga Sama Sisi",
    s3equilText: "Untuk segitiga sama sisi dengan panjang sisi",
    s3equilText2: ", tingginya dihitung dengan Pythagoras:",
    s3note: "📌 Ingat:",
    s3noteText: "Setiap segitiga memiliki 3 alas yang berbeda (setiap sisi bisa jadi alas), dan setiap alas punya tinggi yang berbeda. Tapi hasilnya tetap sama!",
    // Section 4
    s4p1: "Sering kali kita perlu mengubah satuan luas dari satu bentuk ke bentuk lain. Yuk, kuasai konversi satuan luas agar tidak salah dalam menjawab soal!",
    s4from: "Dari", s4to: "Ke", s4mult: "Dikali",
    s4rows: [["km²","m²","× 1.000.000"],["m²","dm²","× 100"],["dm²","cm²","× 100"],["cm²","mm²","× 100"],["m²","cm²","× 10.000"],["ha","m²","× 10.000"],["are","m²","× 100"]],
    s4tip: "🔑 Trik Mengingat:",
    s4tipText: "Setiap naik 1 tingkat satuan panjang → dikali 10. Tapi satuan luas berarti dikuadratkan → naik 1 tingkat = dikali 100.",
    // Examples
    ex1q: "Sebuah segitiga siku-siku ABC memiliki dua kaki (sisi siku-siku) sepanjang AC = 6 cm dan BC = 8 cm.",
    ex1q2: "Hitunglah luas segitiga tersebut!",
    ex1s1: "Identifikasi alas dan tinggi:",
    ex1s1p1: "Segitiga siku-siku di C, sehingga dua kaki saling tegak lurus.",
    ex1s1p2: "• Alas a = BC = 8 cm",
    ex1s1p3: "• Tinggi t = AC = 6 cm",
    ex1s2: "Hitung luas:",
    ex1ans: "Jawaban: Luas segitiga = 24 cm²",
    ex2q: "Sebuah segitiga PQR memiliki alas QR = 14 cm. Tinggi dari P ke QR adalah 10 cm.",
    ex2q2: "Jika harga cat dinding Rp 12.000 per cm², berapakah biaya mengecat seluruh permukaan segitiga tersebut?",
    ex2s1: "Hitung luas segitiga:",
    ex2s2: "Hitung biaya pengecatan:",
    ex2ans: "✅ Jawaban:",
    ex2a1: "• Luas segitiga = 70 cm²",
    ex2a2: "• Biaya pengecatan = Rp 840.000",
    ex2tip: "💡 Perhatikan: tinggi segitiga (10 cm) bukan panjang sisi PQ atau PR, melainkan jarak tegak lurus dari P ke alas QR!",
    ex3q: "Sebuah segitiga sama sisi memiliki panjang sisi 12 cm.",
    ex3q2: "Tentukan: a) tinggi segitiga, dan b) luas segitiga!",
    ex3s1: "Hitung tinggi segitiga sama sisi:",
    ex3s1note: "Gunakan rumus tinggi segitiga sama sisi:",
    ex3s2: "Hitung luas:",
    ex3s2note: "Substitusi nilai t ke rumus luas:",
    ex3ans: "✅ Jawaban:",
    ex3a1: "• Tinggi segitiga = 6√3 cm ≈ 10,39 cm",
    ex3a2: "• Luas segitiga = 36√3 cm² ≈ 62,35 cm²",
    ex3chk: "✅ Cek dengan rumus langsung:",
  },
  en: {
    title: "AREA OF A TRIANGLE",
    breadcrumb: "Grade 7 · Triangles & Quadrilaterals",
    back: "← Back to Triangles & Quadrilaterals",
    intro: "From laying floor tiles to calculating the area of triangular farmland — understanding the",
    introHighlight: " area of a triangle",
    introMid: " is a very useful math skill in real life. With just one simple formula derived from the rectangle, we can calculate the area of",
    introHighlight2: " any type of triangle!",
    examplesTitle: "🚀 Example Problems",
    examplesSubtitle: "Progressive exercises from easy to hard",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "EXAMPLE",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
    step: "Step",
    svgBase: "a (base)",
    svgHeight: "t (height)",
    svgTriangle: "Triangle",
    svgHalfRect: "½ rectangle",
    svgUnits: "units",
    svgUnits2: "units²",
    svgRectArea: "Rect. area",
    svgHyp: "hyp.",
    svgLegs: "leg ⊥ leg",
    sec1: "What Is Area?",
    sec2: "Deriving the Triangle Area Formula",
    sec3: "Triangle Area Formula",
    sec4: "Area Unit Conversion",
    s1p1: "Imagine you want to tile the floor of a rectangular room. How many tiles do you need? The answer depends on how large the",
    s1area: " region to be covered",
    s1area2: " is — that's what we call",
    s1area3: " area",
    s1def: "Definition:",
    s1defText: "The area of a flat shape is the number of unit squares needed to cover the entire shape without gaps or overlaps.",
    s1unit: "Area Units",
    s1unitText: "are written as the square of a length unit:",
    s1units: [["mm²","square millimeter"],["cm²","square centimeter"],["m²","square meter"],["km²","square kilometer"],["ha","hectare (10,000 m²)"],["are","are (100 m²)"]],
    s1note: "📌 Distinguish:",
    s1noteText: "Perimeter = distance around a shape (length unit). Area = region covered (square unit).",
    s1gridA: "a = 5 units",
    s1gridT: "t = 5 units",
    s1gridL: "units",
    s1gridRect: "= 25 units²",
    s2p1: "The secret of the triangle area formula can actually be found from the",
    s2p1mid: "! Let's explore how to discover the formula.",
    s2derive: "🔍 Derivation Process:",
    s2step1: "Step 1:",
    s2step1text: "Take a rectangle with length",
    s2step1mid: "(base) and height",
    s2step2: "Step 2:",
    s2step2text: "Draw a diagonal — the rectangle is divided into two perfectly equal triangles.",
    s2step3: "Step 3:",
    s2step3text: "Since each triangle is half the rectangle:",
    s2fun: "💡 Cool Fact:",
    s2funText: "This works for all types of triangles — acute, right, and obtuse — as long as",
    s2funMid: "is the base and",
    s2funEnd: "is the height perpendicular to that base!",
    sec3: "Triangle Area Formula",
    s3main: "⭐ Main Formula",
    s3where: "= base length,",
    s3where2: "= height perpendicular to base",
    s3warn: "⚠️ Important Note about \"Height\":",
    s3warnText: "The height of a triangle (t) is the length of the segment drawn from a vertex perpendicular (90°) to the opposite side (or its extension). The height is NOT necessarily equal to a side length!",
    s3right: "📐 Right Triangle (Special!)",
    s3rightText: "In a right triangle, the two legs are perpendicular to each other. So one leg serves as the base and the other automatically becomes the height.",
    s3equil: "🔺 Equilateral Triangle",
    s3equilText: "For an equilateral triangle with side length",
    s3equilText2: ", the height is found using the Pythagorean theorem:",
    s3note: "📌 Remember:",
    s3noteText: "Every triangle has 3 different bases (any side can be the base), and each base has its own height. But the area is always the same!",
    s4p1: "Often we need to convert area units from one form to another. Master area unit conversion to avoid mistakes in problems!",
    s4from: "From", s4to: "To", s4mult: "Multiply by",
    s4rows: [["km²","m²","× 1,000,000"],["m²","dm²","× 100"],["dm²","cm²","× 100"],["cm²","mm²","× 100"],["m²","cm²","× 10,000"],["ha","m²","× 10,000"],["are","m²","× 100"]],
    s4tip: "🔑 Memory Trick:",
    s4tipText: "Each step up in length unit → multiply by 10. But area units are squared → one step up = multiply by 100.",
    ex1q: "Right triangle ABC has two legs AC = 6 cm and BC = 8 cm.",
    ex1q2: "Calculate the area of the triangle.",
    ex1s1: "Identify the base and height:",
    ex1s1p1: "Right angle at C, so the two legs are perpendicular.",
    ex1s1p2: "• Base a = BC = 8 cm",
    ex1s1p3: "• Height t = AC = 6 cm",
    ex1s2: "Calculate the area:",
    ex1ans: "Answer: Area = 24 cm²",
    ex2q: "Triangle PQR has base QR = 14 cm. The height from P to QR is 10 cm.",
    ex2q2: "If the paint cost is IDR 12,000 per cm², what is the total cost to paint the entire triangular surface?",
    ex2s1: "Calculate the triangle area:",
    ex2s2: "Calculate the painting cost:",
    ex2ans: "✅ Answer:",
    ex2a1: "• Area of triangle = 70 cm²",
    ex2a2: "• Painting cost = IDR 840,000",
    ex2tip: "💡 Note: the height (10 cm) is NOT the length of side PQ or PR — it is the perpendicular distance from P to base QR!",
    ex3q: "An equilateral triangle has a side length of 12 cm.",
    ex3q2: "Find: a) the height of the triangle, and b) the area of the triangle.",
    ex3s1: "Calculate the height of the equilateral triangle:",
    ex3s1note: "Use the equilateral triangle height formula:",
    ex3s2: "Calculate the area:",
    ex3s2note: "Substitute the value of t into the area formula:",
    ex3ans: "✅ Answer:",
    ex3a1: "• Height = 6√3 cm ≈ 10.39 cm",
    ex3a2: "• Area = 36√3 cm² ≈ 62.35 cm²",
    ex3chk: "✅ Check with direct formula:",
  },
  ja: {
    title: "三角形の面積",
    breadcrumb: "中学1年 · 三角形と四角形",
    back: "← 三角形と四角形に戻る",
    intro: "床タイルの貼り付けから三角形の農地の面積計算まで——",
    introHighlight: "三角形の面積",
    introMid: "を理解することは、実生活でとても役立つ数学のスキルです。長方形から導かれる一つのシンプルな公式で、",
    introHighlight2: "あらゆる種類の三角形の面積",
    examplesTitle: "🚀 例題",
    examplesSubtitle: "基本から発展まで段階的に練習",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題",
    showSolution: "解説を見る",
    hideSolution: "解説を隠す",
    step: "ステップ",
    svgBase: "a (底辺)",
    svgHeight: "t (高さ)",
    svgTriangle: "三角形",
    svgHalfRect: "½ 長方形",
    svgUnits: "単位",
    svgUnits2: "単位²",
    svgRectArea: "長方形の面積",
    svgHyp: "斜辺",
    svgLegs: "直角辺⊥直角辺",
    sec1: "面積とは何か？",
    sec2: "三角形の面積の公式の導き方",
    sec3: "三角形の面積の公式",
    sec4: "面積の単位換算",
    s1p1: "長方形の部屋の床にタイルを貼りたいとします。何枚のタイルが必要ですか？答えは",
    s1area: "覆う必要がある領域の大きさ",
    s1area2: "によります——それが「",
    s1area3: "面積",
    s1def: "定義：",
    s1defText: "図形の面積とは、その図形全体を隙間なく重なりなく覆うために必要な単位正方形の数です。",
    s1unit: "面積の単位",
    s1unitText: "は長さの単位の2乗で表されます：",
    s1units: [["mm²","平方ミリメートル"],["cm²","平方センチメートル"],["m²","平方メートル"],["km²","平方キロメートル"],["ha","ヘクタール（10,000 m²）"],["are","アール（100 m²）"]],
    s1note: "📌 区別しよう：",
    s1noteText: "周長 = 図形の周りの距離（長さの単位）。面積 = 覆われた領域（平方単位）。",
    s1gridA: "a = 5 単位",
    s1gridT: "t = 5 単位",
    s1gridL: "単位",
    s1gridRect: "= 25 単位²",
    s2p1: "三角形の面積の公式の秘密は、実は",
    s2p1mid: "から見つけることができます！公式の導き方を探ってみましょう。",
    s2derive: "🔍 導出プロセス：",
    s2step1: "ステップ1：",
    s2step1text: "底辺",
    s2step1mid: "（底辺）、高さ",
    s2step2: "ステップ2：",
    s2step2text: "対角線を引く——長方形は全く同じ2つの三角形に分かれます。",
    s2step3: "ステップ3：",
    s2step3text: "各三角形は長方形の半分なので：",
    s2fun: "💡 豆知識：",
    s2funText: "これは鋭角・直角・鈍角のすべての三角形に成り立ちます——",
    s2funMid: "が底辺、",
    s2funEnd: "がその底辺に垂直な高さである限り！",
    sec3: "三角形の面積の公式",
    s3main: "⭐ メインの公式",
    s3where: "= 底辺の長さ、",
    s3where2: "= 底辺に垂直な高さ",
    s3warn: "⚠️ 「高さ」についての重要な注意：",
    s3warnText: "三角形の高さ（t）は、ある頂点から対辺（またはその延長）に垂直（90°）に引いた線分の長さです。高さは辺の長さと必ずしも同じではありません！",
    s3right: "📐 直角三角形（特別！）",
    s3rightText: "直角三角形では、2つの直角辺が互いに垂直です。一方の辺を底辺にすると、もう一方が自動的に高さになります。",
    s3equil: "🔺 正三角形",
    s3equilText: "辺の長さが",
    s3equilText2: "の正三角形の高さは、三平方の定理で求められます：",
    s3note: "📌 覚えておこう：",
    s3noteText: "三角形にはどの辺も底辺にできる3つの異なる底辺があり、各底辺に対応する高さがあります。でも面積は常に同じです！",
    s4p1: "面積の単位を変換する必要がある場合があります。単位換算をマスターして問題で間違えないようにしましょう！",
    s4from: "変換元", s4to: "変換先", s4mult: "掛け算",
    s4rows: [["km²","m²","× 1,000,000"],["m²","dm²","× 100"],["dm²","cm²","× 100"],["cm²","mm²","× 100"],["m²","cm²","× 10,000"],["ha","m²","× 10,000"],["are","m²","× 100"]],
    s4tip: "🔑 覚え方のコツ：",
    s4tipText: "長さの単位が1段階上がるごとに×10。でも面積の単位は2乗なので——1段階上がると×100になります。",
    ex1q: "直角三角形ABCは2つの直角辺AC = 6 cm、BC = 8 cm を持ちます。",
    ex1q2: "三角形の面積を求めなさい。",
    ex1s1: "底辺と高さを確認する：",
    ex1s1p1: "Cが直角なので、2つの直角辺は垂直です。",
    ex1s1p2: "• 底辺 a = BC = 8 cm",
    ex1s1p3: "• 高さ t = AC = 6 cm",
    ex1s2: "面積を計算する：",
    ex1ans: "答え：面積 = 24 cm²",
    ex2q: "三角形PQRは底辺QR = 14 cm で、PからQRへの高さは10 cm です。",
    ex2q2: "ペンキの費用が1 cm²あたり12,000円の場合、三角形全体を塗るのにかかる費用はいくらですか？",
    ex2s1: "三角形の面積を計算する：",
    ex2s2: "塗装費用を計算する：",
    ex2ans: "✅ 答え：",
    ex2a1: "• 三角形の面積 = 70 cm²",
    ex2a2: "• 塗装費用 = 840,000円",
    ex2tip: "💡 注意：高さ（10 cm）は辺PQやPRの長さではなく、PからQRまでの垂直距離です！",
    ex3q: "正三角形の辺の長さは12 cm です。",
    ex3q2: "a）三角形の高さ、b）三角形の面積を求めなさい。",
    ex3s1: "正三角形の高さを計算する：",
    ex3s1note: "正三角形の高さの公式を使う：",
    ex3s2: "面積を計算する：",
    ex3s2note: "t の値を面積の公式に代入する：",
    ex3ans: "✅ 答え：",
    ex3a1: "• 高さ = 6√3 cm ≈ 10.39 cm",
    ex3a2: "• 面積 = 36√3 cm² ≈ 62.35 cm²",
    ex3chk: "✅ 直接公式で確認：",
  },
};

/* ══════════════════════════════════════════════════════════
   SVG DIAGRAMS
══════════════════════════════════════════════════════════ */
const PenurunanRumusSVG = ({ labelBase, labelHeight, labelTri, labelHalf }: { labelBase: string; labelHeight: string; labelTri: string; labelHalf: string }) => (
  <svg viewBox="0 0 340 220" className="w-full max-w-sm mx-auto my-3" aria-label="Deriving triangle area from rectangle">
    <rect x="30" y="30" width="280" height="150" fill="rgba(167,139,250,0.10)" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6,3"/>
    <polygon points="30,180 310,180 30,30" fill="rgba(34,211,238,0.20)" stroke="#22d3ee" strokeWidth="2"/>
    <polygon points="30,30 310,180 310,30" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="30" y1="30" x2="30" y2="180" stroke="#facc15" strokeWidth="2" strokeDasharray="4,3"/>
    <rect x="30" y="165" width="15" height="15" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <line x1="30" y1="198" x2="310" y2="198" stroke="#4ade80" strokeWidth="1.5"/>
    <line x1="310" y1="198" x2="30" y2="198" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="155" y="210" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">{labelBase}</text>
    <text x="8" y="112" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,8,112)">{labelHeight}</text>
    <text x="175" y="145" fill="#22d3ee" fontSize="11" fontFamily="monospace">{labelTri}</text>
    <text x="200" y="65" fill="#a78bfa" fontSize="10" fontFamily="monospace" opacity="0.8">{labelHalf}</text>
    <rect x="80" y="60" width="180" height="48" rx="6" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="1"/>
    <text x="170" y="80" fill="#22d3ee" fontSize="10" fontFamily="monospace" textAnchor="middle">L = ½ × a × t</text>
    <text x="170" y="96" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">= ½ × L. Persegi Panjang</text>
  </svg>
);

const SegitigaSembarangSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-3" aria-label="General triangle with base and height">
    <polygon points="60,175 240,175 140,35" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="2"/>
    <line x1="140" y1="35" x2="140" y2="175" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="128" y="163" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <line x1="60" y1="192" x2="240" y2="192" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="150" y="170" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="44" y="185" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="244" y="185" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="150" y="108" fill="#facc15" fontSize="12" fontFamily="monospace">t</text>
    <text x="140" y="207" fill="#4ade80" fontSize="12" fontFamily="monospace" textAnchor="middle">a</text>
    <text x="85" y="115" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-56,90,118)">c</text>
    <text x="198" y="115" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(50,202,118)">b</text>
  </svg>
);

const SegitigaSikuSVG = ({ labelHyp, labelLegs }: { labelHyp: string; labelLegs: string }) => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3" aria-label="Right triangle with base and height as the two legs">
    <polygon points="40,170 220,170 40,40" fill="rgba(74,222,128,0.10)" stroke="#4ade80" strokeWidth="2"/>
    <rect x="40" y="158" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    <text x="26" y="35" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="224" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="26" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="110" fill="#facc15" fontSize="12" fontFamily="monospace">t = AC</text>
    <text x="118" y="187" fill="#4ade80" fontSize="12" fontFamily="monospace">a = BC</text>
    <text x="100" y="95" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-45,110,105)">{labelHyp}</text>
    <rect x="130" y="60" width="115" height="32" rx="5" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="1"/>
    <text x="188" y="77" fill="#4ade80" fontSize="10" fontFamily="monospace" textAnchor="middle">L = ½ × a × t</text>
    <text x="188" y="88" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">({labelLegs})</text>
  </svg>
);

const SegitigaSamaSisiSVG = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3" aria-label="Equilateral triangle with side s">
    <polygon points="130,20 20,185 240,185" fill="rgba(251,146,60,0.10)" stroke="#fb923c" strokeWidth="2"/>
    <line x1="130" y1="20" x2="130" y2="185" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="118" y="173" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <line x1="65" y1="104" x2="72" y2="97" stroke="#fb923c" strokeWidth="2"/>
    <line x1="68" y1="108" x2="75" y2="101" stroke="#fb923c" strokeWidth="2"/>
    <line x1="189" y1="104" x2="182" y2="97" stroke="#fb923c" strokeWidth="2"/>
    <line x1="186" y1="108" x2="179" y2="101" stroke="#fb923c" strokeWidth="2"/>
    <line x1="116" y1="185" x2="116" y2="178" stroke="#fb923c" strokeWidth="2"/>
    <line x1="121" y1="185" x2="121" y2="178" stroke="#fb923c" strokeWidth="2"/>
    <text x="124" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="6" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="242" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="138" y="108" fill="#facc15" fontSize="11" fontFamily="monospace">t</text>
    <text x="62" y="155" fill="#fb923c" fontSize="11" fontFamily="monospace" transform="rotate(-59,70,158)">s</text>
    <text x="190" y="155" fill="#fb923c" fontSize="11" fontFamily="monospace" transform="rotate(59,192,158)">s</text>
    <text x="118" y="198" fill="#fb923c" fontSize="11" fontFamily="monospace">s</text>
    <rect x="54" y="30" width="148" height="30" rx="5" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="1"/>
    <text x="128" y="47" fill="#fb923c" fontSize="10" fontFamily="monospace" textAnchor="middle">t = ½√3 × s</text>
  </svg>
);

const GridLuasSVG = ({ labelA, labelT, labelUnits, labelUnits2, labelRect, labelRectArea }: { labelA: string; labelT: string; labelUnits: string; labelUnits2: string; labelRect: string; labelRectArea: string }) => (
  <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto my-3" aria-label="Triangle area on grid">
    {[0,1,2,3,4,5].map(i => (<line key={`h${i}`} x1="20" y1={30+i*32} x2="240" y2={30+i*32} stroke="#334155" strokeWidth="0.8"/>))}
    {[0,1,2,3,4,5,6,7].map(i => (<line key={`v${i}`} x1={20+i*32} y1="30" x2={20+i*32} y2="190" stroke="#334155" strokeWidth="0.8"/>))}
    <polygon points="20,190 180,190 20,30" fill="rgba(34,211,238,0.25)" stroke="#22d3ee" strokeWidth="2"/>
    <rect x="20" y="30" width="160" height="160" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="100" y="208" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">{labelA}</text>
    <text x="5" y="112" fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,5,112)">{labelT}</text>
    <text x="60" y="145" fill="#22d3ee" fontSize="12" fontFamily="monospace" fontWeight="bold">12,5</text>
    <text x="60" y="158" fill="#22d3ee" fontSize="10" fontFamily="monospace">{labelUnits2}</text>
    <text x="145" y="65" fill="#a78bfa" fontSize="9" fontFamily="monospace">{labelRect}</text>
    <text x="145" y="76" fill="#a78bfa" fontSize="9" fontFamily="monospace">{labelRectArea}</text>
  </svg>
);

const ContohMudahSVG = () => (
  <svg viewBox="0 0 280 190" className="w-full max-w-xs mx-auto my-2" aria-label="Right triangle base 8 height 6">
    <polygon points="40,165 200,165 40,45" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="2"/>
    <rect x="40" y="153" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2"/>
    <text x="26" y="40" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="204" y="178" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="26" y="178" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="108" fill="#facc15" fontSize="12" fontFamily="monospace">6 cm</text>
    <text x="105" y="180" fill="#4ade80" fontSize="12" fontFamily="monospace">8 cm</text>
    <text x="100" y="75" fill="#94a3b8" fontSize="10" fontFamily="monospace" transform="rotate(-38,110,85)">10 cm</text>
  </svg>
);

const ContohSedangSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto my-2" aria-label="Triangle base 14 height 10">
    <polygon points="40,175 260,175 160,35" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2"/>
    <line x1="160" y1="35" x2="160" y2="175" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="148" y="163" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <text x="153" y="29" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">P</text>
    <text x="25" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">Q</text>
    <text x="263" y="188" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">R</text>
    <text x="165" y="110" fill="#facc15" fontSize="12" fontFamily="monospace">10 cm</text>
    <text x="138" y="192" fill="#4ade80" fontSize="12" fontFamily="monospace">14 cm</text>
    <text x="62" y="105" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-55,72,110)">PQ</text>
    <text x="216" y="105" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(50,222,112)">PR</text>
  </svg>
);

const ContohSulitSVG = () => (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-2" aria-label="Equilateral triangle side 12 cm">
    <polygon points="140,18 28,188 252,188" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="140" y1="18" x2="140" y2="188" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <rect x="128" y="176" width="12" height="12" fill="none" stroke="#facc15" strokeWidth="1.5"/>
    <line x1="78" y1="106" x2="85" y2="99" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="82" y1="110" x2="89" y2="103" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="194" y1="106" x2="187" y2="99" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="190" y1="110" x2="183" y2="103" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="127" y1="188" x2="127" y2="181" stroke="#a78bfa" strokeWidth="2"/>
    <line x1="132" y1="188" x2="132" y2="181" stroke="#a78bfa" strokeWidth="2"/>
    <text x="133" y="13" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="12" y="200" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="254" y="200" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="148" y="108" fill="#facc15" fontSize="11" fontFamily="monospace">t = ?</text>
    <text x="60" y="158" fill="#a78bfa" fontSize="11" fontFamily="monospace" transform="rotate(-59,68,162)">12 cm</text>
    <text x="196" y="158" fill="#a78bfa" fontSize="11" fontFamily="monospace" transform="rotate(59,198,162)">12 cm</text>
    <text x="128" y="202" fill="#a78bfa" fontSize="11" fontFamily="monospace">12 cm</text>
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
const LuasSegitigaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const sections: Section[] = [
    {
      title: t.sec1, icon: "📐",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s1p1}<strong className="text-cyan-300">{t.s1area}</strong>{t.s1area2}<strong className="text-yellow-300">{t.s1area3}</strong>{language === "ja" ? "」と言います。" : "."}</p>
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p><strong className="text-cyan-300">{t.s1def}</strong> {t.s1defText}</p>
            <p><strong className="text-cyan-300">{t.s1unit}</strong> {t.s1unitText}</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {t.s1units.map(([sat, nama]) => (
                <div key={sat} className="bg-cyan-950/40 border border-cyan-800/40 rounded p-2 text-center">
                  <p className="text-yellow-300 font-bold text-xs font-mono">{sat}</p>
                  <p className="text-white/50 text-xs">{nama}</p>
                </div>
              ))}
            </div>
          </div>
          <GridLuasSVG labelA={t.s1gridA} labelT={t.s1gridT} labelUnits={t.s1gridL} labelUnits2={t.svgUnits2} labelRect={t.svgRectArea} labelRectArea={t.s1gridRect} />
          <blockquote className="border-l-4 border-cyan-500 pl-3 text-cyan-200 text-xs italic">
            📌 <strong>{t.s1note}</strong> {t.s1noteText}
          </blockquote>
        </div>
      ),
    },
    {
      title: t.sec2, icon: "🔬",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s2p1} <strong className="text-violet-300">{language === "id" ? "persegi panjang" : language === "en" ? "rectangle" : "長方形"}</strong>{t.s2p1mid}</p>
          <PenurunanRumusSVG labelBase={t.svgBase} labelHeight={t.svgHeight} labelTri={t.svgTriangle} labelHalf={t.svgHalfRect} />
          <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-3">
            <p className="text-violet-300 font-semibold">{t.s2derive}</p>
            <div className="space-y-2 text-white/80">
              <p><strong className="text-violet-300">{t.s2step1}</strong> {t.s2step1text} <InlineMath math="a" /> {t.s2step1mid} <InlineMath math="t" />.</p>
              <div className="bg-violet-950/50 rounded p-2"><BlockMath math="L_{\text{persegi panjang}} = a \times t" /></div>
              <p><strong className="text-violet-300">{t.s2step2}</strong> {t.s2step2text}</p>
              <p><strong className="text-violet-300">{t.s2step3}</strong> {t.s2step3text}</p>
              <div className="bg-violet-950/70 rounded p-3 text-center">
                <BlockMath math="L_{\triangle} = \frac{1}{2} \times L_{\text{persegi panjang}} = \frac{1}{2} \times a \times t" />
              </div>
            </div>
          </div>
          <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-xs text-yellow-200">
            💡 <strong>{t.s2fun}</strong> {t.s2funText} <InlineMath math="a" /> {t.s2funMid} <InlineMath math="t" /> {t.s2funEnd}
          </div>
        </div>
      ),
    },
    {
      title: t.sec3, icon: "📏",
      content: (
        <div className="space-y-4 text-sm text-white/85 font-body leading-relaxed">
          <div className="bg-cyan-950/60 border border-cyan-500/60 rounded-xl p-4 text-center">
            <p className="text-cyan-300 font-semibold mb-2">{t.s3main}</p>
            <BlockMath math="L_{\triangle} = \frac{1}{2} \times a \times t" />
            <p className="text-white/60 text-xs mt-1"><InlineMath math="a" /> {t.s3where} <InlineMath math="t" /> {t.s3where2}</p>
          </div>
          <SegitigaSembarangSVG />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2">
            <p className="text-white font-semibold text-xs">{t.s3warn}</p>
            <p className="text-white/70 text-xs">{t.s3warnText}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-2">
            <div className="bg-green-950/50 border border-green-700/40 rounded-lg p-3">
              <p className="text-green-300 font-semibold text-xs mb-2">{t.s3right}</p>
              <SegitigaSikuSVG labelHyp={t.svgHyp} labelLegs={t.svgLegs} />
              <p className="text-white/70 text-xs">{t.s3rightText}</p>
              <div className="bg-green-950/60 rounded p-2 mt-2 text-center">
                <BlockMath math="L = \frac{1}{2} \times \text{kaki}_1 \times \text{kaki}_2" />
              </div>
            </div>
            <div className="bg-orange-950/50 border border-orange-700/40 rounded-lg p-3">
              <p className="text-orange-300 font-semibold text-xs mb-2">{t.s3equil}</p>
              <SegitigaSamaSisiSVG />
              <p className="text-white/70 text-xs">{t.s3equilText} <InlineMath math="s" />{t.s3equilText2}</p>
              <div className="bg-orange-950/60 rounded p-2 mt-2 text-center">
                <BlockMath math="t = \frac{\sqrt{3}}{2} \times s" />
                <BlockMath math="L = \frac{\sqrt{3}}{4} \times s^2" />
              </div>
            </div>
          </div>
          <blockquote className="border-l-4 border-yellow-500 pl-3 text-yellow-200 text-xs italic">
            📌 <strong>{t.s3note}</strong> {t.s3noteText}
          </blockquote>
        </div>
      ),
    },
    {
      title: t.sec4, icon: "🔄",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>{t.s4p1}</p>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="bg-slate-800">
                  <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{t.s4from}</th>
                  <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{t.s4to}</th>
                  <th className="px-3 py-2 text-cyan-300">{t.s4mult}</th>
                </tr>
              </thead>
              <tbody>
                {t.s4rows.map(([dari, ke, kali], i) => (
                  <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                    <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{dari}</td>
                    <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700">{ke}</td>
                    <td className="px-3 py-2 text-green-300 font-mono">{kali}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-2">
            <p>🔑 <strong className="text-white">{t.s4tip}</strong></p>
            <p>{t.s4tipText}</p>
            <div className="bg-slate-900/60 rounded p-2">
              <BlockMath math="1 \text{ m}^2 = (100 \text{ cm})^2 = 10.000 \text{ cm}^2" />
            </div>
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
            <p>{t.ex1s1p1}</p>
            <p>{t.ex1s1p2}</p>
            <p>{t.ex1s1p3}</p>
          </div>
          <p className="text-white/80"><strong className="text-green-400">{t.step} 2 — {t.ex1s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L = \frac{1}{2} \times a \times t" />
            <BlockMath math="L = \frac{1}{2} \times 8 \times 6" />
            <BlockMath math="L = \frac{1}{2} \times 48 = 24 \text{ cm}^2" />
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
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 1 — {t.ex2s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="L = \frac{1}{2} \times a \times t = \frac{1}{2} \times 14 \times 10" />
            <BlockMath math="L = \frac{1}{2} \times 140 = 70 \text{ cm}^2" />
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 2 — {t.ex2s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="\text{Biaya} = 70 \times 12.000 = Rp\,840.000" />
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 space-y-1">
            <p className="text-yellow-300 font-semibold">{t.ex2ans}</p>
            <p className="text-white/80">{t.ex2a1}</p>
            <p className="text-white/80">{t.ex2a2}</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">{t.ex2tip}</div>
        </div>
      ),
    },
    {
      level: t.hard, color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex3q}</p>
          <ContohSulitSVG />
          <p>{t.ex3q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-red-400">{t.step} 1 — {t.ex3s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex3s1note}</p>
            <BlockMath math="t = \frac{\sqrt{3}}{2} \times s = \frac{\sqrt{3}}{2} \times 12 = 6\sqrt{3} \approx 10{,}39 \text{ cm}" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 2 — {t.ex3s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex3s2note}</p>
            <BlockMath math="L = \frac{1}{2} \times 12 \times 6\sqrt{3}" />
            <BlockMath math="L = 36\sqrt{3} \approx 62{,}35 \text{ cm}^2" />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
            <p className="text-red-300 font-semibold">{t.ex3ans}</p>
            <p className="text-white/80">{t.ex3a1}</p>
            <p className="text-white/80">{t.ex3a2}</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            {t.ex3chk} <InlineMath math="L = \frac{\sqrt{3}}{4} \times s^2 = \frac{\sqrt{3}}{4} \times 144 = 36\sqrt{3}" /> ✓
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
          <p>
            {t.intro}<strong className="text-cyan-300">{t.introHighlight}</strong>{t.introMid}<strong className="text-yellow-300">{t.introHighlight2}</strong>
            {language === "ja" ? "を計算できます！" : ""}
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

export default LuasSegitigaPage;
