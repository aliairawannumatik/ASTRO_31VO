import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ──────────────────────────────────────────
   UI MAP
────────────────────────────────────────── */
const uiMap = {
  id: {
    pageTitle: "JUMLAH SUDUT PADA SEGI BANYAK",
    pageSubtitle2: "Dari Segitiga Hingga Segi-n",
    pageSubtitle: "Kelas 7 · Garis dan Sudut · Materi Matematika",
    backBtn: "← Kembali ke Garis dan Sudut",
    intisariTitle: "🌌 Ringkasan Intisari",
    intisariP: "Setiap segi banyak (poligon) bisa dipecah menjadi",
    intisariBold: "segitiga-segitiga",
    intisariEnd: ". Dari situlah lahir rumus ajaib untuk menghitung jumlah sudut semua segi banyak:",
    intisariFormula: "\\text{Jumlah Sudut Segi-}n = (n - 2) \\times 180°",
    grid3: "🔺 Segitiga (n=3):",
    grid4: "🔷 Segi 4 (n=4):",
    grid5: "⭐ Segi 5 (n=5):",
    grid6: "🟢 Segi 6 (n=6):",
    materiLabel: "📚 Materi",
    examplesLabel: "✏️ Contoh Soal",
    contoh: "CONTOH",
    pembahasan: "💡 Pembahasan:",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT",
    // SVG labels
    svgSegi4tri: "= 2 segitiga × 180° = 360°",
    svgSegi5sum: "Jumlah = 3 × 180° = 540°",
    svgPolaLine1: "Pola: 1 segitiga → 2 segitiga → 3 segitiga → ... → (n-2) segitiga",
    svgPolaLine2: "       180°          360°          540°              (n-2)×180°",
    svgSegi6label: "Segi 6",
    // Section titles
    sec1title: "Jumlah Sudut Segitiga = 180°",
    sec2title: "Jumlah Sudut Segi Empat = 360°",
    sec3title: "Pola Segi Lima, Segi Enam, dan Seterusnya",
    sec4title: "Rumus Umum: Jumlah Sudut Segi-n",
    sec5title: "Sudut Dalam Reguler: Setiap Sudutnya Sama!",
    // Section 1
    s1p1: "Fakta ini mungkin sudah pernah kamu dengar, tapi tahukah kamu",
    s1em: "mengapa",
    s1p1b: "bisa begitu? Jumlah ketiga sudut dalam segitiga",
    s1bold: "selalu tepat 180°",
    s1p1c: ", tidak peduli seberapa lancip, tumpul, atau siku-siku bentuknya.",
    s1theorem: "📌 Teorema Sudut Segitiga:",
    s1theoremDesc: "Untuk segitiga ABC dengan sudut",
    s1theoremAt: "di A,",
    s1theoremAt2: "di B, dan",
    s1theoremAt3: "di C.",
    s1proofTitle: "Bukti Deduktif (Ringkasan):",
    s1proofText: "Tarik garis sejajar",
    s1proofMid: "melalui titik B. Karena sifat sudut dalam berseberangan dan sudut sehadap, ketiga sudut segitiga berkumpul membentuk sudut lurus (180°) di titik B.",
    s1ingatBold: "Ingat:",
    s1ingatText: "Segitiga adalah segi banyak dengan jumlah sudut paling kecil — 3 sudut, 180°. Semua segi banyak lainnya dibangun dari sini!",
    // Section 2
    s2p1: "Sebuah segi empat bisa kita \"belah\" menjadi",
    s2bold: "2 segitiga",
    s2p1b: "dengan menghubungkan dua sudut yang tidak berdekatan (menarik diagonal). Jumlah sudutnya pun menjadi 2 kali jumlah sudut segitiga!",
    s2theorem: "📌 Jumlah Sudut Segi Empat:",
    s2tipsBold: "Tips:",
    s2tipsText: "Persegi, persegi panjang, jajargenjang, trapesium — semua segi empat memiliki jumlah sudut dalam yang sama: 360°!",
    // Section 3
    s3p1: "Sama seperti tadi, segi lima bisa dipecah menjadi",
    s3bold1: "3 segitiga",
    s3p1b: ", segi enam menjadi",
    s3bold2: "4 segitiga",
    s3p1c: ", dan seterusnya. Polanya sangat jelas!",
    tbl3Bangun: "Bangun",
    tbl3N: "n (sisi)",
    tbl3Tri: "Jml Segitiga",
    tbl3Sum: "Jumlah Sudut",
    tbl3r1: "Segitiga",
    tbl3r2: "Segi empat",
    tbl3r3: "Segi lima",
    tbl3r4: "Segi enam",
    tbl3r5: "Segi tujuh",
    tbl3r6: "Segi-n",
    // Section 4
    s4p1: "Dari pola yang sudah kita temukan, lahirlah satu rumus",
    s4bold: "super penting",
    s4p1b: "yang berlaku untuk semua segi banyak:",
    s4formulaTitle: "RUMUS JUMLAH SUDUT SEGI-n",
    s4formulaNote: "dengan",
    s4formulaNote2: "= jumlah sisi/sudut bangun",
    s4howTitle: "Cara Menggunakan Rumus:",
    s4how1: "1. Tentukan nilai",
    s4how1b: "(jumlah sisi bangun)",
    s4how2: "2. Hitung",
    s4how3: "3. Kalikan dengan",
    s4noteBold: "Catatan Penting:",
    s4noteText: "Rumus ini berlaku untuk semua segi banyak",
    s4noteEm: "cembung",
    s4noteEnd: "(convex polygon). Rumus ini tidak berlaku untuk bangun yang \"berlekuk ke dalam\" (konkaf).",
    // Section 5
    s5p1: "Kalau semua sisi dan semua sudutnya sama besar, bangun itu disebut",
    s5bold: "segi banyak beraturan",
    s5p1b: "(regular polygon). Kita bisa cari besar tiap sudutnya dengan cara membagi rata:",
    s5formulaTitle: "BESAR SETIAP SUDUT (Segi-n Beraturan):",
    tbl5Bangun: "Bangun Beraturan",
    tbl5N: "n",
    tbl5Angle: "Besar Setiap Sudut",
    tbl5r1: "Segitiga sama sisi",
    tbl5r2: "Persegi",
    tbl5r3: "Segi lima beraturan",
    tbl5r4: "Segi enam beraturan",
    tbl5r5: "Segi delapan beraturan",
    // Example texts
    ex1q: "Pada segitiga ABC, diketahui",
    ex1qmid: "dan",
    ex1qend: ". Tentukan besar",
    ex1formula: "Gunakan: jumlah sudut segitiga = 180°",
    ex1ans: "Jawaban:",
    ex1check: "✅ Cek:",
    ex2q: "Perbandingan sudut-sudut pada segitiga PQR adalah",
    ex2qend: ". Tentukan besar masing-masing sudut dan klasifikasikan jenis segitiganya!",
    ex2factor: "Misalkan faktor pengali = k:",
    ex2calc: "Besar setiap sudut:",
    ex2ans: "Jawaban:",
    ex2class: "Klasifikasi:",
    ex2classBold: "Segitiga tumpul",
    ex2classNote: "(ada sudut > 90°, yaitu ∠R = 105°)",
    ex3q: "Sebuah segi banyak beraturan memiliki jumlah seluruh sudut dalamnya",
    ex3a: "a) Tentukan jumlah sisi bangun tersebut!",
    ex3b: "b) Tentukan besar setiap sudut dalamnya!",
    ex3c: "c) Apakah nama bangun tersebut?",
    ex3calcA: "a) Mencari n (jumlah sisi):",
    ex3calcB: "b) Besar setiap sudut dalam (beraturan):",
    ex3orNote: "Atau:",
    ex3ans: "Jawaban:",
    ex3ansA: "a)",
    ex3ansAsuffix: "sisi",
    ex3ansB: "b) Setiap sudut =",
    ex3ansC: "c) Bangun tersebut adalah",
    ex3ansCName: "segi sepuluh beraturan (dekagon beraturan)",
  },
  en: {
    pageTitle: "INTERIOR ANGLE SUMS OF POLYGONS",
    pageSubtitle2: "From Triangles to n-gons",
    pageSubtitle: "Grade 7 · Lines & Angles · Mathematics",
    backBtn: "← Back to Lines & Angles",
    intisariTitle: "🌌 Key Summary",
    intisariP: "Every polygon can be divided into",
    intisariBold: "triangles",
    intisariEnd: ". This gives us the formula for the angle sum of any polygon:",
    intisariFormula: "\\text{Angle Sum of }n\\text{-gon} = (n - 2) \\times 180°",
    grid3: "🔺 Triangle (n=3):",
    grid4: "🔷 Quadrilateral (n=4):",
    grid5: "⭐ Pentagon (n=5):",
    grid6: "🟢 Hexagon (n=6):",
    materiLabel: "📚 Material",
    examplesLabel: "✏️ Practice Problems",
    contoh: "EXAMPLE",
    pembahasan: "💡 Solution:",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD",
    svgSegi4tri: "= 2 triangles × 180° = 360°",
    svgSegi5sum: "Sum = 3 × 180° = 540°",
    svgPolaLine1: "Pattern: 1 triangle → 2 triangles → 3 triangles → ... → (n-2) triangles",
    svgPolaLine2: "           180°          360°            540°              (n-2)×180°",
    svgSegi6label: "Hexagon",
    sec1title: "Triangle Angle Sum = 180°",
    sec2title: "Quadrilateral Angle Sum = 360°",
    sec3title: "Pentagons, Hexagons, and Beyond",
    sec4title: "General Formula: Angle Sum of an n-gon",
    sec5title: "Regular Polygons: Every Angle is Equal!",
    s1p1: "You may have heard this before, but do you know",
    s1em: "why",
    s1p1b: "it works? The sum of the three interior angles of any triangle is",
    s1bold: "always exactly 180°",
    s1p1c: ", no matter how acute, obtuse, or right-angled it is.",
    s1theorem: "📌 Triangle Angle Sum Theorem:",
    s1theoremDesc: "For triangle ABC with angle",
    s1theoremAt: "at A,",
    s1theoremAt2: "at B, and",
    s1theoremAt3: "at C.",
    s1proofTitle: "Deductive Proof (Summary):",
    s1proofText: "Draw a line through B parallel to",
    s1proofMid: ". By the properties of alternate interior angles and corresponding angles, the three angles of the triangle together form a straight angle (180°) at point B.",
    s1ingatBold: "Remember:",
    s1ingatText: "The triangle is the polygon with the fewest angles — 3 angles, 180°. All other polygons are built from this foundation!",
    s2p1: "A quadrilateral can be split into",
    s2bold: "2 triangles",
    s2p1b: "by drawing a diagonal. So its angle sum is twice that of a triangle!",
    s2theorem: "📌 Quadrilateral Angle Sum:",
    s2tipsBold: "Tips:",
    s2tipsText: "Squares, rectangles, parallelograms, trapezoids — all quadrilaterals have the same interior angle sum: 360°!",
    s3p1: "Similarly, a pentagon can be split into",
    s3bold1: "3 triangles",
    s3p1b: ", a hexagon into",
    s3bold2: "4 triangles",
    s3p1c: ", and so on. The pattern is very clear!",
    tbl3Bangun: "Shape",
    tbl3N: "n (sides)",
    tbl3Tri: "No. of Triangles",
    tbl3Sum: "Angle Sum",
    tbl3r1: "Triangle",
    tbl3r2: "Quadrilateral",
    tbl3r3: "Pentagon",
    tbl3r4: "Hexagon",
    tbl3r5: "Heptagon",
    tbl3r6: "n-gon",
    s4p1: "From the pattern we discovered, we get one",
    s4bold: "crucial formula",
    s4p1b: "that works for all polygons:",
    s4formulaTitle: "POLYGON ANGLE SUM FORMULA",
    s4formulaNote: "where",
    s4formulaNote2: "= number of sides/angles",
    s4howTitle: "How to Use the Formula:",
    s4how1: "1. Find",
    s4how1b: "(number of sides)",
    s4how2: "2. Calculate",
    s4how3: "3. Multiply by",
    s4noteBold: "Important Note:",
    s4noteText: "This formula applies to all",
    s4noteEm: "convex",
    s4noteEnd: "polygons. It does not apply to concave (non-convex) polygons.",
    s5p1: "When all sides and all angles are equal, the shape is called a",
    s5bold: "regular polygon",
    s5p1b: ". We can find each angle by dividing equally:",
    s5formulaTitle: "EACH INTERIOR ANGLE (Regular n-gon):",
    tbl5Bangun: "Regular Polygon",
    tbl5N: "n",
    tbl5Angle: "Each Interior Angle",
    tbl5r1: "Equilateral Triangle",
    tbl5r2: "Square",
    tbl5r3: "Regular Pentagon",
    tbl5r4: "Regular Hexagon",
    tbl5r5: "Regular Octagon",
    ex1q: "In triangle ABC,",
    ex1qmid: "and",
    ex1qend: ". Find",
    ex1formula: "Use: triangle angle sum = 180°",
    ex1ans: "Answer:",
    ex1check: "✅ Check:",
    ex2q: "The angles of triangle PQR are in the ratio",
    ex2qend: ". Find each angle and classify the triangle!",
    ex2factor: "Let the scale factor = k:",
    ex2calc: "Each angle:",
    ex2ans: "Answer:",
    ex2class: "Classification:",
    ex2classBold: "Obtuse triangle",
    ex2classNote: "(one angle > 90°, namely ∠R = 105°)",
    ex3q: "A regular polygon has an interior angle sum of",
    ex3a: "a) Find the number of sides.",
    ex3b: "b) Find the measure of each interior angle.",
    ex3c: "c) What is the name of this polygon?",
    ex3calcA: "a) Finding n (number of sides):",
    ex3calcB: "b) Each interior angle (regular polygon):",
    ex3orNote: "Or:",
    ex3ans: "Answer:",
    ex3ansA: "a)",
    ex3ansAsuffix: "sides",
    ex3ansB: "b) Each angle =",
    ex3ansC: "c) The polygon is a",
    ex3ansCName: "regular decagon (10-sided polygon)",
  },
  ja: {
    pageTitle: "多角形の内角の和",
    pageSubtitle2: "三角形からn角形まで",
    pageSubtitle: "中学1年 · 直線と角 · 数学",
    backBtn: "← 直線と角に戻る",
    intisariTitle: "🌌 要点まとめ",
    intisariP: "すべての多角形は",
    intisariBold: "三角形",
    intisariEnd: "に分割できます。そこから、すべての多角形の内角の和を求める公式が生まれます：",
    intisariFormula: "n\\text{角形の内角の和} = (n - 2) \\times 180°",
    grid3: "🔺 三角形（n=3）：",
    grid4: "🔷 四角形（n=4）：",
    grid5: "⭐ 五角形（n=5）：",
    grid6: "🟢 六角形（n=6）：",
    materiLabel: "📚 内容",
    examplesLabel: "✏️ 練習問題",
    contoh: "例題",
    pembahasan: "💡 解説：",
    mudah: "基本", sedang: "標準", sulit: "発展",
    svgSegi4tri: "= 三角形2個 × 180° = 360°",
    svgSegi5sum: "和 = 3 × 180° = 540°",
    svgPolaLine1: "パターン：△1個 → △2個 → △3個 → ... → (n-2)個",
    svgPolaLine2: "          180°    360°    540°        (n-2)×180°",
    svgSegi6label: "六角形",
    sec1title: "三角形の内角の和 = 180°",
    sec2title: "四角形の内角の和 = 360°",
    sec3title: "五角形・六角形とそれ以上",
    sec4title: "一般公式：n角形の内角の和",
    sec5title: "正多角形：すべての角が等しい！",
    s1p1: "この事実は知っているかもしれませんが、",
    s1em: "なぜ",
    s1p1b: "そうなのかご存知ですか？どんな三角形でも、3つの内角の和は",
    s1bold: "常にちょうど180°",
    s1p1c: "です。鋭角三角形でも鈍角三角形でも直角三角形でも変わりません。",
    s1theorem: "📌 三角形の内角の和の定理：",
    s1theoremDesc: "三角形ABCにおいて、角",
    s1theoremAt: "はAで、",
    s1theoremAt2: "はBで、",
    s1theoremAt3: "はCにあります。",
    s1proofTitle: "演繹的証明（概要）：",
    s1proofText: "B点を通り",
    s1proofMid: "に平行な直線を引く。錯角と同位角の性質から、三角形の3つの角がB点で直線角（180°）を形成する。",
    s1ingatBold: "覚えておこう：",
    s1ingatText: "三角形は最も少ない角を持つ多角形 — 3つの角で180°。他のすべての多角形はここから構築されます！",
    s2p1: "四角形は対角線を引いて",
    s2bold: "2つの三角形",
    s2p1b: "に分割できます。だから内角の和は三角形の2倍になります！",
    s2theorem: "📌 四角形の内角の和：",
    s2tipsBold: "ヒント：",
    s2tipsText: "正方形・長方形・平行四辺形・台形 — すべての四角形の内角の和は360°！",
    s3p1: "同様に、五角形は",
    s3bold1: "3つの三角形",
    s3p1b: "に、六角形は",
    s3bold2: "4つの三角形",
    s3p1c: "に分割できます。パターンはとても明確です！",
    tbl3Bangun: "図形",
    tbl3N: "n（辺数）",
    tbl3Tri: "三角形の数",
    tbl3Sum: "内角の和",
    tbl3r1: "三角形",
    tbl3r2: "四角形",
    tbl3r3: "五角形",
    tbl3r4: "六角形",
    tbl3r5: "七角形",
    tbl3r6: "n角形",
    s4p1: "見つけたパターンから、すべての多角形に当てはまる",
    s4bold: "超重要な公式",
    s4p1b: "が生まれます：",
    s4formulaTitle: "n角形の内角の和の公式",
    s4formulaNote: "ただし",
    s4formulaNote2: "= 辺の数",
    s4howTitle: "公式の使い方：",
    s4how1: "1. ",
    s4how1b: "（辺の数）を確認する",
    s4how2: "2. ",
    s4how3: "3. 180°をかける",
    s4noteBold: "重要メモ：",
    s4noteText: "この公式はすべての",
    s4noteEm: "凸",
    s4noteEnd: "多角形に適用できます。凹多角形（くぼみのある図形）には適用できません。",
    s5p1: "すべての辺とすべての角が等しい場合、その図形を",
    s5bold: "正多角形",
    s5p1b: "（regular polygon）といいます。それぞれの角の大きさは均等割りで求められます：",
    s5formulaTitle: "各内角の大きさ（正n角形）：",
    tbl5Bangun: "正多角形",
    tbl5N: "n",
    tbl5Angle: "各内角の大きさ",
    tbl5r1: "正三角形",
    tbl5r2: "正方形",
    tbl5r3: "正五角形",
    tbl5r4: "正六角形",
    tbl5r5: "正八角形",
    ex1q: "三角形ABCで、",
    ex1qmid: "かつ",
    ex1qend: "のとき、",
    ex1formula: "使う公式：三角形の内角の和 = 180°",
    ex1ans: "答え：",
    ex1check: "✅ 確認：",
    ex2q: "三角形PQRの角の比が",
    ex2qend: "のとき、各角の大きさを求め、三角形を分類しなさい！",
    ex2factor: "比の定数 = k とすると：",
    ex2calc: "各角の大きさ：",
    ex2ans: "答え：",
    ex2class: "分類：",
    ex2classBold: "鈍角三角形",
    ex2classNote: "（90°より大きい角がある → ∠R = 105°）",
    ex3q: "ある正多角形の内角の和が",
    ex3a: "a) 辺の数を求めなさい。",
    ex3b: "b) 各内角の大きさを求めなさい。",
    ex3c: "c) この図形の名前を答えなさい。",
    ex3calcA: "a) n（辺の数）を求める：",
    ex3calcB: "b) 各内角（正多角形）：",
    ex3orNote: "または：",
    ex3ans: "答え：",
    ex3ansA: "a)",
    ex3ansAsuffix: "辺",
    ex3ansB: "b) 各角 =",
    ex3ansC: "c) この図形は",
    ex3ansCName: "正十角形（デカゴン）",
  },
};

type UI = typeof uiMap.id;

/* ──────────────────────────────────────────
   SVG DIAGRAMS
────────────────────────────────────────── */

const SegitigaSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-3">
    <polygon points="140,25 30,170 250,170" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2.5" />
    <circle cx="140" cy="25" r="4" fill="#facc15" />
    <circle cx="30" cy="170" r="4" fill="#facc15" />
    <circle cx="250" cy="170" r="4" fill="#facc15" />
    <text x="132" y="16" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="178" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="254" y="178" fill="#facc15" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <path d="M55,170 A28,28 0 0,1 47,146" fill="rgba(167,139,250,0.3)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="50" y="160" fill="#a78bfa" fontSize="11" fontFamily="monospace">α</text>
    <path d="M225,170 A28,28 0 0,0 228,144" fill="rgba(74,222,128,0.3)" stroke="#4ade80" strokeWidth="1.5" />
    <text x="217" y="158" fill="#4ade80" fontSize="11" fontFamily="monospace">β</text>
    <path d="M124,40 A22,22 0 0,1 156,40" fill="rgba(251,146,60,0.3)" stroke="#fb923c" strokeWidth="1.5" />
    <text x="132" y="52" fill="#fb923c" fontSize="11" fontFamily="monospace">γ</text>
    <text x="60" y="195" fill="#e2e8f0" fontSize="10" fontFamily="monospace">α + β + γ = 180°</text>
  </svg>
);

const SegiEmpatSVG = ({ triLabel }: { triLabel: string }) => (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-3">
    <polygon points="50,30 230,30 250,170 30,170" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="2.5" />
    <line x1="50" y1="30" x2="250" y2="170" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6,4" />
    <circle cx="50" cy="30" r="4" fill="#facc15" />
    <circle cx="230" cy="30" r="4" fill="#facc15" />
    <circle cx="250" cy="170" r="4" fill="#facc15" />
    <circle cx="30" cy="170" r="4" fill="#facc15" />
    <text x="36" y="22" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="232" y="22" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="254" y="178" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="10" y="178" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <path d="M72,30 A25,25 0 0,1 64,52" fill="rgba(167,139,250,0.3)" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="65" y="46" fill="#a78bfa" fontSize="10" fontFamily="monospace">∠A</text>
    <path d="M207,30 A25,25 0 0,0 214,52" fill="rgba(74,222,128,0.3)" stroke="#4ade80" strokeWidth="1.5" />
    <text x="197" y="46" fill="#4ade80" fontSize="10" fontFamily="monospace">∠B</text>
    <path d="M230,157 A25,25 0 0,0 226,145" fill="rgba(251,146,60,0.3)" stroke="#fb923c" strokeWidth="1.5" />
    <text x="222" y="153" fill="#fb923c" fontSize="10" fontFamily="monospace">∠C</text>
    <path d="M50,157 A25,25 0 0,1 54,145" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.5" />
    <text x="46" y="150" fill="#f472b6" fontSize="10" fontFamily="monospace">∠D</text>
    <text x="35" y="195" fill="#e2e8f0" fontSize="10" fontFamily="monospace">∠A + ∠B + ∠C + ∠D = 360°</text>
    <text x="40" y="208" fill="#94a3b8" fontSize="9" fontFamily="monospace">{triLabel}</text>
  </svg>
);

const SegiLimaSVG = ({ jumlahLabel }: { jumlahLabel: string }) => (
  <svg viewBox="0 0 240 230" className="w-full max-w-xs mx-auto my-3">
    <polygon points="120,15 215,80 180,190 60,190 25,80"
      fill="rgba(250,204,21,0.1)" stroke="#facc15" strokeWidth="2.5" />
    <line x1="120" y1="15" x2="180" y2="190" stroke="#facc15" strokeWidth="1.2" strokeDasharray="5,4" />
    <line x1="120" y1="15" x2="60" y2="190" stroke="#facc15" strokeWidth="1.2" strokeDasharray="5,4" />
    <text x="114" y="11" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="218" y="82" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="182" y="200" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="44" y="200" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="8" y="82" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">E</text>
    <text x="140" y="80" fill="#22d3ee" fontSize="10" fontFamily="monospace">△1</text>
    <text x="115" y="140" fill="#22d3ee" fontSize="10" fontFamily="monospace">△2</text>
    <text x="80" y="90" fill="#22d3ee" fontSize="10" fontFamily="monospace">△3</text>
    <text x="30" y="222" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{jumlahLabel}</text>
  </svg>
);

const PolaSegiNSVG = ({ line1, line2 }: { line1: string; line2: string }) => (
  <svg viewBox="0 0 320 120" className="w-full max-w-sm mx-auto my-3">
    <g className="theme-legend-box">
      <rect x="5" y="5" width="310" height="110" rx="10" fill="rgba(15,23,42,0.8)" stroke="#334155" strokeWidth="1.5" />
      <polygon points="45,85 25,95 65,95" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2" />
      <text x="28" y="110" fill="#22d3ee" fontSize="9" fontFamily="monospace">n=3</text>
      <text x="22" y="78" fill="#22d3ee" fontSize="9" fontFamily="monospace">180°</text>
      <rect x="85" y="72" width="30" height="22" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="2" />
      <text x="86" y="110" fill="#a78bfa" fontSize="9" fontFamily="monospace">n=4</text>
      <text x="81" y="66" fill="#a78bfa" fontSize="9" fontFamily="monospace">360°</text>
      <polygon points="155,72 170,68 180,80 170,94 145,94" fill="rgba(250,204,21,0.15)" stroke="#facc15" strokeWidth="2" />
      <text x="148" y="110" fill="#facc15" fontSize="9" fontFamily="monospace">n=5</text>
      <text x="148" y="62" fill="#facc15" fontSize="9" fontFamily="monospace">540°</text>
      <polygon points="230,72 242,65 256,72 256,88 242,95 228,88" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2" />
      <text x="225" y="110" fill="#4ade80" fontSize="9" fontFamily="monospace">n=6</text>
      <text x="225" y="59" fill="#4ade80" fontSize="9" fontFamily="monospace">720°</text>
      <text x="278" y="78" fill="#f472b6" fontSize="9" fontFamily="monospace">segi-n</text>
      <text x="273" y="92" fill="#f472b6" fontSize="9" fontFamily="monospace">(n-2)×180°</text>
      <text x="15" y="35" fill="#e2e8f0" fontSize="9" fontFamily="monospace">{line1}</text>
      <text x="15" y="50" fill="#94a3b8" fontSize="8" fontFamily="monospace">{line2}</text>
    </g>
  </svg>
);

/* ──────────────────────────────────────────
   SECTION DATA
────────────────────────────────────────── */
type Section = { title: string; icon: string; content: React.ReactNode };

const getSections = (ui: UI): Section[] => [
  {
    title: ui.sec1title, icon: "🔺",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s1p1} <em>{ui.s1em}</em> {ui.s1p1b} <strong className="text-cyan-300">{ui.s1bold}</strong>{ui.s1p1c}
        </p>
        <SegitigaSVG />
        <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-cyan-300">{ui.s1theorem}</p>
          <BlockMath math="\alpha + \beta + \gamma = 180°" />
          <p className="text-white/60 text-xs">
            {ui.s1theoremDesc} <InlineMath math="\alpha" /> {ui.s1theoremAt} <InlineMath math="\beta" /> {ui.s1theoremAt2} <InlineMath math="\gamma" /> {ui.s1theoremAt3}
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300">
          <p className="text-white/80 font-semibold mb-2">{ui.s1proofTitle}</p>
          <p>{ui.s1proofText} <InlineMath math="AC" /> {ui.s1proofMid}</p>
        </div>
        <blockquote className="border-l-4 border-cyan-500 bg-cyan-950/40 pl-4 py-2 text-cyan-200 text-xs rounded-r-lg">
          <strong>{ui.s1ingatBold}</strong> {ui.s1ingatText}
        </blockquote>
      </div>
    ),
  },
  {
    title: ui.sec2title, icon: "🔷",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s2p1} <strong className="text-violet-300">{ui.s2bold}</strong> {ui.s2p1b}
        </p>
        <SegiEmpatSVG triLabel={ui.svgSegi4tri} />
        <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-violet-300">{ui.s2theorem}</p>
          <BlockMath math="(4 - 2) \times 180° = 2 \times 180° = 360°" />
        </div>
        <blockquote className="border-l-4 border-violet-500 bg-violet-950/40 pl-4 py-2 text-violet-200 text-xs rounded-r-lg">
          <strong>{ui.s2tipsBold}</strong> {ui.s2tipsText}
        </blockquote>
      </div>
    ),
  },
  {
    title: ui.sec3title, icon: "⭐",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s3p1} <strong className="text-yellow-300">{ui.s3bold1}</strong>{ui.s3p1b}
          <strong className="text-green-300">{ui.s3bold2}</strong>{ui.s3p1c}
        </p>
        <SegiLimaSVG jumlahLabel={ui.svgSegi5sum} />
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tbl3Bangun}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tbl3N}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tbl3Tri}</th>
                <th className="px-3 py-2 text-cyan-300">{ui.tbl3Sum}</th>
              </tr>
            </thead>
            <tbody>
              {([
                [ui.tbl3r1, 3, 1, "180°"],
                [ui.tbl3r2, 4, 2, "360°"],
                [ui.tbl3r3, 5, 3, "540°"],
                [ui.tbl3r4, 6, 4, "720°"],
                [ui.tbl3r5, 7, 5, "900°"],
                [ui.tbl3r6, "n", "n − 2", "(n−2) × 180°"],
              ] as [string, number | string, number | string, string][]).map(([nama, n, jt, js], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i === 5 ? "bg-pink-950/40" : i % 2 === 0 ? "bg-slate-900/40" : ""}`}>
                  <td className={`px-3 py-2 border-r border-slate-700 ${i === 5 ? "text-pink-300 font-bold" : "text-white/80"}`}>{nama}</td>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/70">{n}</td>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/70">{jt}</td>
                  <td className={`px-3 py-2 ${i === 5 ? "text-pink-300 font-bold" : "text-white/70"}`}>{js}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PolaSegiNSVG line1={ui.svgPolaLine1} line2={ui.svgPolaLine2} />
      </div>
    ),
  },
  {
    title: ui.sec4title, icon: "🏆",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s4p1} <strong className="text-pink-300">{ui.s4bold}</strong> {ui.s4p1b}
        </p>
        <div className="formula-box-jumlahsudut bg-gradient-to-r from-pink-950/80 to-violet-950/80 border border-pink-700/60 rounded-xl p-5 text-center">
          <p className="text-pink-300 font-semibold mb-2 text-xs">{ui.s4formulaTitle}</p>
          <BlockMath math="\text{Jumlah Sudut} = (n - 2) \times 180°" />
          <p className="text-white/60 text-xs mt-2">{ui.s4formulaNote} <InlineMath math="n \geq 3" />, <InlineMath math="n" /> = {ui.s4formulaNote2}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs space-y-1">
          <p className="text-white/80 font-semibold">{ui.s4howTitle}</p>
          <p className="text-white/60">{ui.s4how1} <InlineMath math="n" /> {ui.s4how1b}</p>
          <p className="text-white/60">{ui.s4how2} <InlineMath math="n - 2" /></p>
          <p className="text-white/60">{ui.s4how3} <InlineMath math="180°" /></p>
        </div>
        <blockquote className="border-l-4 border-pink-500 bg-pink-950/40 pl-4 py-2 text-pink-200 text-xs rounded-r-lg">
          <strong>{ui.s4noteBold}</strong> {ui.s4noteText} <em>{ui.s4noteEm}</em> {ui.s4noteEnd}
        </blockquote>
      </div>
    ),
  },
  {
    title: ui.sec5title, icon: "💎",
    content: (
      <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
        <p>
          {ui.s5p1} <strong className="text-green-300">{ui.s5bold}</strong> {ui.s5p1b}
        </p>
        <div className="bg-green-950/60 border border-green-700/50 rounded-xl p-4">
          <p className="text-green-300 font-semibold mb-2 text-xs">{ui.s5formulaTitle}</p>
          <BlockMath math="\text{Besar setiap sudut} = \frac{(n-2) \times 180°}{n}" />
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-slate-800">
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tbl5Bangun}</th>
                <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">{ui.tbl5N}</th>
                <th className="px-3 py-2 text-cyan-300">{ui.tbl5Angle}</th>
              </tr>
            </thead>
            <tbody>
              {([
                [ui.tbl5r1, 3, "60°"],
                [ui.tbl5r2, 4, "90°"],
                [ui.tbl5r3, 5, "108°"],
                [ui.tbl5r4, 6, "120°"],
                [ui.tbl5r5, 8, "135°"],
              ] as [string, number, string][]).map(([nama, n, sudut], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/80">{nama}</td>
                  <td className="px-3 py-2 border-r border-slate-700 text-white/60">{n}</td>
                  <td className="px-3 py-2 text-green-300 font-semibold">{sudut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

/* ──────────────────────────────────────────
   CONTOH SOAL
────────────────────────────────────────── */
type Example = { level: string; color: string; bg: string; border: string; question: React.ReactNode; answer: React.ReactNode };

const ContohSegitigaSVG = ({ a, b, c }: { a: string; b: string; c: string }) => (
  <svg viewBox="0 0 240 160" className="w-full max-w-xs mx-auto my-2">
    <polygon points="120,15 20,145 220,145" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2" />
    <circle cx="120" cy="15" r="3" fill="#facc15" />
    <circle cx="20" cy="145" r="3" fill="#facc15" />
    <circle cx="220" cy="145" r="3" fill="#facc15" />
    <text x="112" y="10" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="152" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="223" y="152" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="115" y="42" fill="#fb923c" fontSize="10" fontFamily="monospace">{c}</text>
    <text x="35" y="138" fill="#a78bfa" fontSize="10" fontFamily="monospace">{a}</text>
    <text x="192" y="138" fill="#4ade80" fontSize="10" fontFamily="monospace">{b}</text>
  </svg>
);

const ContohSegiEnamSVG = ({ label }: { label: string }) => (
  <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto my-2">
    <polygon points="100,15 170,55 170,125 100,165 30,125 30,55"
      fill="rgba(74,222,128,0.1)" stroke="#4ade80" strokeWidth="2.5" />
    {([[100, 15], [170, 55], [170, 125], [100, 165], [30, 125], [30, 55]] as [number, number][]).map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#facc15" />
    ))}
    <text x="86" y="10" fill="#facc15" fontSize="9" fontFamily="monospace">A</text>
    <text x="173" y="58" fill="#facc15" fontSize="9" fontFamily="monospace">B</text>
    <text x="173" y="128" fill="#facc15" fontSize="9" fontFamily="monospace">C</text>
    <text x="86" y="180" fill="#facc15" fontSize="9" fontFamily="monospace">D</text>
    <text x="10" y="128" fill="#facc15" fontSize="9" fontFamily="monospace">E</text>
    <text x="10" y="58" fill="#facc15" fontSize="9" fontFamily="monospace">F</text>
    <text x="55" y="92" fill="#4ade80" fontSize="10" fontFamily="monospace">{label}</text>
    <text x="25" y="195" fill="#e2e8f0" fontSize="9" fontFamily="monospace">(6-2) × 180° = 720°</text>
  </svg>
);

const getExamples = (ui: UI): Example[] => [
  {
    level: ui.mudah,
    color: "text-green-400",
    bg: "bg-green-950/40",
    border: "border-green-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          {ui.ex1q} <InlineMath math="\angle A = 48°" /> {ui.ex1qmid} <InlineMath math="\angle B = 73°" />.
          {ui.ex1qend} <InlineMath math="\angle C" />!
        </p>
        <ContohSegitigaSVG a="48°" b="73°" c="∠C=?" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex1formula}</p>
          <BlockMath math="\angle A + \angle B + \angle C = 180°" />
          <BlockMath math="48° + 73° + \angle C = 180°" />
          <BlockMath math="121° + \angle C = 180°" />
          <BlockMath math="\angle C = 180° - 121° = 59°" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">{ui.ex1ans} <InlineMath math="\angle C = 59°" /></p>
        </div>
        <div className="bg-yellow-950/40 border border-yellow-600/30 rounded p-2 text-xs text-yellow-200">
          {ui.ex1check} <InlineMath math="48° + 73° + 59° = 180°" /> ✓
        </div>
      </div>
    ),
  },
  {
    level: ui.sedang,
    color: "text-yellow-400",
    bg: "bg-yellow-950/40",
    border: "border-yellow-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>
          {ui.ex2q} <InlineMath math="2 : 3 : 7" />{ui.ex2qend}
        </p>
        <ContohSegitigaSVG a="2k" b="3k" c="7k" />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex2factor}</p>
          <BlockMath math="\angle P + \angle Q + \angle R = 180°" />
          <BlockMath math="2k + 3k + 7k = 180°" />
          <BlockMath math="12k = 180° \implies k = 15°" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex2calc}</p>
          <BlockMath math="\angle P = 2 \times 15° = 30°" />
          <BlockMath math="\angle Q = 3 \times 15° = 45°" />
          <BlockMath math="\angle R = 7 \times 15° = 105°" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
          <p className="text-yellow-300 font-semibold">{ui.ex2ans} <InlineMath math="\angle P = 30°" />, <InlineMath math="\angle Q = 45°" />, <InlineMath math="\angle R = 105°" /></p>
          <p className="text-white/60 text-xs mt-1">{ui.ex2class} <strong className="text-yellow-300">{ui.ex2classBold}</strong> {ui.ex2classNote}</p>
        </div>
      </div>
    ),
  },
  {
    level: ui.sulit,
    color: "text-red-400",
    bg: "bg-red-950/40",
    border: "border-red-700/50",
    question: (
      <div className="space-y-2 text-sm text-white/85 font-body">
        <p>{ui.ex3q} <InlineMath math="1.440°" />.</p>
        <p>{ui.ex3a}</p>
        <p>{ui.ex3b}</p>
        <p>{ui.ex3c}</p>
        <ContohSegiEnamSVG label={ui.svgSegi6label} />
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex3calcA}</p>
          <BlockMath math="(n - 2) \times 180° = 1440°" />
          <BlockMath math="n - 2 = \frac{1440°}{180°} = 8" />
          <BlockMath math="n = 8 + 2 = 10" />
        </div>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
          <p className="text-white/60 text-xs mb-1">{ui.ex3calcB}</p>
          <BlockMath math="\text{Setiap sudut} = \frac{1440°}{10} = 144°" />
          <p className="text-white/60 text-xs mt-1">{ui.ex3orNote} <InlineMath math="\frac{(10-2)\times180°}{10} = \frac{1440°}{10} = 144°" /></p>
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3">
          <p className="text-red-300 font-semibold">{ui.ex3ans}</p>
          <p className="text-white/80 text-xs">{ui.ex3ansA} <InlineMath math="n = 10" /> {ui.ex3ansAsuffix}</p>
          <p className="text-white/80 text-xs">{ui.ex3ansB} <InlineMath math="144°" /></p>
          <p className="text-white/80 text-xs">{ui.ex3ansC} <strong className="text-red-300">{ui.ex3ansCName}</strong></p>
        </div>
      </div>
    ),
  },
];

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const JumlahSudutSegiBanyakPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui: UI = uiMap[language as "id" | "en" | "ja"] ?? uiMap.id;

  const [openSection, setOpenSection] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);
  const [openExample, setOpenExample] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);

  const toggle = (i: number, setter: React.Dispatch<React.SetStateAction<number[]>>, cur: number[]) => {
    playPopSound();
    setter(cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i]);
  };

  const sections = getSections(ui);
  const examples = getExamples(ui);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-2xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-1 text-center leading-snug">
          {ui.pageTitle}
        </h1>
        <p className="text-cyan-300 text-xs text-center font-display mb-1">{ui.pageSubtitle2}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{ui.pageSubtitle}</p>

        {/* RINGKASAN INTISARI */}
        <div className="bg-slate-900/80 border border-cyan-700/50 rounded-2xl p-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="text-cyan-300 font-semibold mb-2">{ui.intisariTitle}</p>
          <p>
            {ui.intisariP} <strong className="text-yellow-300">{ui.intisariBold}</strong>{ui.intisariEnd}
          </p>
          <div className="mt-3 bg-pink-950/60 border border-pink-700/40 rounded-lg p-3 text-center">
            <BlockMath math={ui.intisariFormula} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/60">
            <div className="bg-slate-800/50 rounded p-2">{ui.grid3} <span className="text-cyan-300 font-semibold">180°</span></div>
            <div className="bg-slate-800/50 rounded p-2">{ui.grid4} <span className="text-violet-300 font-semibold">360°</span></div>
            <div className="bg-slate-800/50 rounded p-2">{ui.grid5} <span className="text-yellow-300 font-semibold">540°</span></div>
            <div className="bg-slate-800/50 rounded p-2">{ui.grid6} <span className="text-green-300 font-semibold">720°</span></div>
          </div>
        </div>

        {/* MATERI */}
        <p className="text-white/60 text-xs font-body mb-3 uppercase tracking-widest">{ui.materiLabel}</p>
        <div className="flex flex-col gap-2 mb-8">
          {sections.map((sec, i) => (
            <div key={i} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(i, setOpenSection, openSection)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-body text-sm font-semibold text-white flex items-center gap-2">
                  <span className="text-base">{sec.icon}</span> {sec.title}
                </span>
                {openSection.includes(i)
                  ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openSection.includes(i) && (
                <div className="px-4 pb-4 pt-1 border-t border-border/50 animate-slide-up">
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CONTOH SOAL */}
        <p className="text-white/60 text-xs font-body mb-3 uppercase tracking-widest">{ui.examplesLabel}</p>
        <div className="flex flex-col gap-3">
          {examples.map((ex, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden ${ex.border} ${ex.bg}`}>
              <button
                onClick={() => toggle(i, setOpenExample, openExample)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className={`font-display text-xs font-bold ${ex.color}`}>
                  ⭐ {ui.contoh} {i + 1} — {ex.level}
                </span>
                {openExample.includes(i)
                  ? <ChevronUp className="w-4 h-4 shrink-0 text-white/60" />
                  : <ChevronDown className="w-4 h-4 shrink-0 text-white/60" />}
              </button>
              {openExample.includes(i) && (
                <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3 animate-slide-up">
                  <div className="bg-slate-900/60 rounded-lg p-3">{ex.question}</div>
                  <p className={`text-xs font-semibold font-body ${ex.color}`}>{ui.pembahasan}</p>
                  <div className="bg-slate-900/60 rounded-lg p-3">{ex.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/garis-dan-sudut"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {ui.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JumlahSudutSegiBanyakPage;
