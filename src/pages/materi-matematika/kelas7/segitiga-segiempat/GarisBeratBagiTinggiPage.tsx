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
    title1: "GARIS BERAT, GARIS BAGI",
    title2: "DAN GARIS TINGGI PADA SEGITIGA",
    breadcrumb: "Kelas 7 · Segitiga dan Segiempat",
    back: "← Kembali ke Segitiga dan Segiempat",
    intro: "Setiap segitiga menyimpan tiga \"garis istimewa\" yang sering dipakai dalam geometri:",
    introMedian: " garis berat",
    introMedianDesc: " yang menuju titik tengah sisi lawan,",
    introBisect: " garis bagi",
    introBisectDesc: " yang membelah sudut menjadi dua bagian sama,",
    introAlt: " garis tinggi",
    introAltDesc: " yang tegak lurus ke sisi hadapannya. Ketiganya punya titik temu unik masing-masing yang akan kita eksplorasi bersama!",
    examplesTitle: "✏️ CONTOH SOAL & PEMBAHASAN",
    examplesSubtitle: "Latihan bertahap dari mudah hingga sulit",
    quickRef: "🚀 RUMUS KILAT",
    centroidTitle: "Titik Berat (G):",
    bisectorTitle: "Teorema Garis Bagi:",
    altTitle: "Panjang Garis Tinggi:",
    altNote: "Segitiga siku-siku:",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    example: "CONTOH",
    showSolution: "Lihat Pembahasan",
    hideSolution: "Sembunyikan Pembahasan",
    step: "Langkah",
    answer: "Jawaban",
    // SVG labels
    svgHInside: "H di dalam (segitiga lancip)",
    svgHRight: "H = titik sudut siku-siku",
    svgHOutside: "H di luar (segitiga tumpul)",
    // Section titles
    secMedian: "Garis Berat (Median)",
    secBisect: "Garis Bagi (Angle Bisector)",
    secAlt: "Garis Tinggi (Altitude)",
    secTable: "Tabel Perbandingan Ketiga Garis",
    // Section content
    medDef: "Definisi:",
    medDefText: "Garis berat (atau median) adalah ruas garis yang menghubungkan sebuah titik sudut segitiga dengan titik tengah sisi yang berhadapan dengannya.",
    medCount: "Jumlah:",
    medCountText: "Setiap segitiga memiliki tepat 3 garis berat (satu dari setiap sudut).",
    medMeet: "Titik Temu:",
    medMeetText: "Ketiga garis berat selalu berpotongan di satu titik yang disebut titik berat (centroid), dilambangkan G.",
    medProp: "⚖️ Sifat Utama Titik Berat:",
    medPropText: "Titik berat G membagi setiap garis berat dengan perbandingan 2 : 1 dihitung dari titik sudut ke titik tengah sisi.",
    medWhere: "Di mana Ma adalah titik tengah sisi BC, dan AMa adalah panjang total garis berat dari A ke Ma.",
    medFun: "💡 Fakta Seru:",
    medFunText: "Titik berat adalah pusat gravitasi segitiga. Jika kamu gantung segitiga karton dari titik ini, segitiga akan seimbang sempurna secara horizontal!",
    medIntro: "Bayangkan kamu ingin mencari titik keseimbangan sebuah segitiga dari karton — titik di mana segitiga tidak akan jatuh ke sisi manapun jika diletakkan di ujung pensil. Untuk menemukan titik itu, kamu perlu tahu tentang",
    bisDef: "Definisi:",
    bisDefText: "Garis bagi adalah ruas garis dari sebuah titik sudut yang membagi sudut tersebut menjadi dua bagian yang sama besar.",
    bisCount: "Jumlah:",
    bisCountText: "Setiap segitiga memiliki tepat 3 garis bagi.",
    bisMeet: "Titik Temu:",
    bisMeetText: "Ketiga garis bagi berpotongan di satu titik yang disebut titik bagi atau incenter, dilambangkan I.",
    bisThm: "📏 Teorema Garis Bagi (Angle Bisector Theorem):",
    bisThmText: "Jika garis bagi dari sudut A memotong sisi BC di titik D, maka berlaku:",
    bisThmNote: "Artinya, titik D membagi sisi BC secara proporsional sesuai panjang kedua sisi yang mengapit sudut A.",
    bisProp: "🎯 Sifat Spesial Titik Bagi:",
    bisPropText: "Titik bagi (I) berjarak sama terhadap ketiga sisi segitiga. Jarak ini adalah jari-jari lingkaran dalam segitiga (incircle).",
    bisIntro: "Pernahkah kamu memotong sebuah sudut menjadi dua bagian yang sama besar — seperti melipat kertas segitiga sehingga kedua sisi sudutnya berimpit sempurna? Lipatan itu adalah",
    altDef: "Definisi:",
    altDefText: "Garis tinggi adalah ruas garis dari sebuah titik sudut yang tegak lurus (90°) terhadap sisi yang berhadapan (atau perpanjangannya).",
    altCount: "Jumlah:",
    altCountText: "Setiap segitiga memiliki tepat 3 garis tinggi.",
    altMeet: "Titik Temu:",
    altMeetText: "Ketiga garis tinggi berpotongan di satu titik yang disebut titik tinggi atau orthocenter, dilambangkan H.",
    altPos: "Posisi ortosentrum tergantung jenis segitiga:",
    altAcute: "🔺 Segitiga Lancip → H di DALAM",
    altRight: "📐 Siku-siku → H = Titik Sudut",
    altObtuse: "📐 Tumpul → H di LUAR",
    altFormula: "📐 Rumus Panjang Garis Tinggi (via Luas):",
    altFormulaNote: "Di mana ta = garis tinggi ke sisi a, dan a = panjang sisi alas yang dituju.",
    altIntro: "Ketika kamu mengukur tinggi sebuah segitiga — seperti mengukur seberapa tinggi sebuah gunung berbentuk segitiga dari alasnya — kamu sebenarnya sedang berurusan dengan",
    tblType: "Jenis", tblDef: "Definisi", tblMeet: "Titik Temu", tblProp: "Sifat Khusus",
    tblMedian: "Garis Berat", tblMedianDef: "Sudut → titik tengah sisi lawan", tblMedianMeet: "Titik Berat (G)", tblMedianProp: "Rasio 2:1 dari sudut",
    tblBisect: "Garis Bagi", tblBisectDef: "Membelah sudut menjadi 2 sama besar", tblBisectMeet: "Titik Bagi (I)", tblBisectProp: "Pusat lingkaran dalam",
    tblAlt: "Garis Tinggi", tblAltDef: "Tegak lurus sisi yang berhadapan", tblAltMeet: "Ortosentrum (H)", tblAltProp: "Bisa di luar segitiga",
    tblMemo: "Cara mengingat:",
    tblMemo1: "Garis Berat → ke tengah sisi lawan (Berat = keseimbangan)",
    tblMemo2: "Garis Bagi → bagi sudut jadi dua bagian sama",
    tblMemo3: "Garis Tinggi → tegak lurus (Tinggi = vertikal = lurus ke bawah)",
    // Examples
    ex1q: "Pada segitiga ABC, titik M adalah titik tengah sisi BC. Ruas garis AM adalah garis berat segitiga tersebut, dan titik G adalah titik berat yang terletak pada AM.",
    ex1q2: "Jika diketahui AG = 10 cm, tentukan panjang GM!",
    ex1s1: "Gunakan sifat titik berat:",
    ex1s1note: "Titik berat membagi garis berat dengan rasio 2 : 1 dari sudut ke titik tengah sisi.",
    ex1s2: "Hitung GM:",
    ex1ans: "Jawaban: GM = 5 cm",
    ex1tip: "💡 Jika panjang total AM = AG + GM = 10 + 5 = 15 cm. Artinya G membagi AM sehingga bagian dari A dua kali lebih panjang.",
    ex2q: "Pada segitiga PQR, garis bagi dari sudut P memotong sisi QR di titik D. Diketahui:",
    ex2q2: "Tentukan panjang QD dan DR!",
    ex2s1: "Tulis teorema garis bagi:",
    ex2s1note: "Berdasarkan Teorema Garis Bagi:",
    ex2s2: "Nyatakan QD dan DR dalam perbandingan:",
    ex2s2note: "Misalkan QD = 3k dan DR = 4k, maka:",
    ex2s3: "Hitung QD dan DR:",
    ex2ans: "Jawaban: QD = 6 cm dan DR = 8 cm",
    ex3q: "Segitiga ABC siku-siku di C. Diketahui AC = 6 cm dan BC = 8 cm. Dari titik C, ditarik garis tinggi CH yang tegak lurus ke sisi miring AB.",
    ex3q2: "Tentukan:",
    ex3q3a: "Panjang sisi miring AB",
    ex3q3b: "Panjang garis tinggi CH",
    ex3q3c: "Panjang AH dan BH",
    ex3s1: "Cari panjang AB (Teorema Pythagoras):",
    ex3s2: "Hitung Luas Segitiga ABC:",
    ex3s2note: "Siku-siku di C, jadi AC dan BC adalah kedua kakinya (alas dan tinggi):",
    ex3s3: "Cari CH menggunakan rumus Luas:",
    ex3s3note: "Luas juga bisa dihitung dengan alas AB dan tinggi CH:",
    ex3s4: "Cari AH dan BH:",
    ex3s4note: "Gunakan Teorema Pythagoras pada segitiga siku-siku kecil yang terbentuk:",
    ex3ans: "Jawaban:",
    ex3chk: "✅ Cek: AH + BH = 3,6 + 6,4 = 10 = AB ✓",
    ex3formula: "🔑 Rumus umum:",
  },
  en: {
    title1: "MEDIANS, ANGLE BISECTORS",
    title2: "AND ALTITUDES OF A TRIANGLE",
    breadcrumb: "Grade 7 · Triangles & Quadrilaterals",
    back: "← Back to Triangles & Quadrilaterals",
    intro: "Every triangle has three \"special lines\" frequently used in geometry:",
    introMedian: " the median",
    introMedianDesc: " connecting a vertex to the midpoint of the opposite side,",
    introBisect: " the angle bisector",
    introBisectDesc: " splitting an angle into two equal parts,",
    introAlt: " the altitude",
    introAltDesc: " drawn perpendicular to the opposite side. Each has its own unique intersection point that we will explore together!",
    examplesTitle: "✏️ EXAMPLE PROBLEMS & SOLUTIONS",
    examplesSubtitle: "Progressive exercises from easy to hard",
    quickRef: "🚀 QUICK REFERENCE",
    centroidTitle: "Centroid (G):",
    bisectorTitle: "Angle Bisector Theorem:",
    altTitle: "Altitude Length:",
    altNote: "Right triangle:",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    example: "EXAMPLE",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
    step: "Step",
    answer: "Answer",
    svgHInside: "H inside (acute triangle)",
    svgHRight: "H = right-angle vertex",
    svgHOutside: "H outside (obtuse triangle)",
    secMedian: "Median",
    secBisect: "Angle Bisector",
    secAlt: "Altitude",
    secTable: "Comparison Table of the Three Special Lines",
    medDef: "Definition:",
    medDefText: "A median is a line segment connecting a vertex of a triangle to the midpoint of the opposite side.",
    medCount: "Count:",
    medCountText: "Every triangle has exactly 3 medians (one from each vertex).",
    medMeet: "Intersection:",
    medMeetText: "The three medians always meet at one point called the centroid, denoted G.",
    medProp: "⚖️ Key Property of the Centroid:",
    medPropText: "The centroid G divides each median in a 2 : 1 ratio, measured from the vertex to the midpoint of the opposite side.",
    medWhere: "Where Ma is the midpoint of BC, and AMa is the total length of the median from A to Ma.",
    medFun: "💡 Fun Fact:",
    medFunText: "The centroid is the center of gravity of the triangle. If you hang a cardboard triangle from this point, it will balance perfectly horizontally!",
    medIntro: "Imagine trying to find the balance point of a cardboard triangle — the point where it won't tip to any side when placed on a pencil tip. To find that point, you need to know about",
    bisDef: "Definition:",
    bisDefText: "An angle bisector is a line segment from a vertex that divides that angle into two equal parts.",
    bisCount: "Count:",
    bisCountText: "Every triangle has exactly 3 angle bisectors.",
    bisMeet: "Intersection:",
    bisMeetText: "The three angle bisectors meet at one point called the incenter, denoted I.",
    bisThm: "📏 Angle Bisector Theorem:",
    bisThmText: "If the angle bisector from vertex A meets side BC at point D, then:",
    bisThmNote: "This means point D divides side BC proportionally according to the lengths of the two sides adjacent to angle A.",
    bisProp: "🎯 Special Property of the Incenter:",
    bisPropText: "The incenter (I) is equidistant from all three sides of the triangle. This distance is the inradius of the triangle's inscribed circle (incircle).",
    bisIntro: "Have you ever folded a paper triangle so that both sides of a corner overlap perfectly? That fold line is",
    altDef: "Definition:",
    altDefText: "An altitude is a line segment from a vertex drawn perpendicular (90°) to the opposite side (or its extension).",
    altCount: "Count:",
    altCountText: "Every triangle has exactly 3 altitudes.",
    altMeet: "Intersection:",
    altMeetText: "The three altitudes meet at one point called the orthocenter, denoted H.",
    altPos: "The position of the orthocenter depends on the type of triangle:",
    altAcute: "🔺 Acute Triangle → H is INSIDE",
    altRight: "📐 Right Triangle → H = Right-angle Vertex",
    altObtuse: "📐 Obtuse Triangle → H is OUTSIDE",
    altFormula: "📐 Altitude Length Formula (via Area):",
    altFormulaNote: "Where ta = altitude to side a, and a = length of the base side.",
    altIntro: "When measuring the height of a triangle — like measuring how tall a mountain-shaped triangle is from its base — you are dealing with",
    tblType: "Type", tblDef: "Definition", tblMeet: "Intersection Point", tblProp: "Special Property",
    tblMedian: "Median", tblMedianDef: "Vertex → midpoint of opposite side", tblMedianMeet: "Centroid (G)", tblMedianProp: "2:1 ratio from vertex",
    tblBisect: "Angle Bisector", tblBisectDef: "Splits angle into 2 equal parts", tblBisectMeet: "Incenter (I)", tblBisectProp: "Center of incircle",
    tblAlt: "Altitude", tblAltDef: "Perpendicular to opposite side", tblAltMeet: "Orthocenter (H)", tblAltProp: "Can be outside triangle",
    tblMemo: "Memory tips:",
    tblMemo1: "Median → to the midpoint of the opposite side (balance point)",
    tblMemo2: "Angle Bisector → splits the angle into two equal halves",
    tblMemo3: "Altitude → perpendicular (straight down like height)",
    ex1q: "In triangle ABC, point M is the midpoint of side BC. Line segment AM is a median and G is the centroid located on AM.",
    ex1q2: "Given AG = 10 cm, find the length of GM.",
    ex1s1: "Use the centroid property:",
    ex1s1note: "The centroid divides each median in a 2 : 1 ratio from the vertex to the midpoint.",
    ex1s2: "Calculate GM:",
    ex1ans: "Answer: GM = 5 cm",
    ex1tip: "💡 Total AM = AG + GM = 10 + 5 = 15 cm. So G divides AM such that the part from A is twice as long.",
    ex2q: "In triangle PQR, the angle bisector from vertex P meets side QR at point D. Given:",
    ex2q2: "Find the lengths of QD and DR.",
    ex2s1: "Write the Angle Bisector Theorem:",
    ex2s1note: "By the Angle Bisector Theorem:",
    ex2s2: "Express QD and DR using ratios:",
    ex2s2note: "Let QD = 3k and DR = 4k, then:",
    ex2s3: "Calculate QD and DR:",
    ex2ans: "Answer: QD = 6 cm and DR = 8 cm",
    ex3q: "Right triangle ABC with the right angle at C. Given AC = 6 cm and BC = 8 cm. From vertex C, altitude CH is drawn perpendicular to hypotenuse AB.",
    ex3q2: "Find:",
    ex3q3a: "Length of hypotenuse AB",
    ex3q3b: "Length of altitude CH",
    ex3q3c: "Lengths of AH and BH",
    ex3s1: "Find AB (Pythagorean Theorem):",
    ex3s2: "Calculate Area of Triangle ABC:",
    ex3s2note: "Right angle at C, so AC and BC are the two legs (base and height):",
    ex3s3: "Find CH using the Area formula:",
    ex3s3note: "Area can also be expressed using base AB and height CH:",
    ex3s4: "Find AH and BH:",
    ex3s4note: "Use the Pythagorean Theorem on the small right triangles formed:",
    ex3ans: "Answer:",
    ex3chk: "✅ Check: AH + BH = 3.6 + 6.4 = 10 = AB ✓",
    ex3formula: "🔑 General formulas:",
  },
  ja: {
    title1: "三角形の中線・角の二等分線",
    title2: "・高さ（垂線）",
    breadcrumb: "中学1年 · 三角形と四角形",
    back: "← 三角形と四角形に戻る",
    intro: "三角形には幾何学でよく使われる3つの「特別な線」があります：",
    introMedian: "中線",
    introMedianDesc: "（頂点と対辺の中点を結ぶ線分）、",
    introBisect: "角の二等分線",
    introBisectDesc: "（角を2等分する線分）、",
    introAlt: "高さ（垂線）",
    introAltDesc: "（対辺に垂直に引いた線分）。それぞれ固有の交点があり、一緒に探っていきましょう！",
    examplesTitle: "✏️ 例題と解説",
    examplesSubtitle: "基本から発展まで段階的に練習",
    quickRef: "🚀 公式まとめ",
    centroidTitle: "重心 (G)：",
    bisectorTitle: "角の二等分線定理：",
    altTitle: "高さの長さ：",
    altNote: "直角三角形：",
    easy: "基本", medium: "標準", hard: "発展",
    example: "例題",
    showSolution: "解説を見る",
    hideSolution: "解説を隠す",
    step: "ステップ",
    answer: "答え",
    svgHInside: "H は内部（鋭角三角形）",
    svgHRight: "H = 直角の頂点",
    svgHOutside: "H は外部（鈍角三角形）",
    secMedian: "中線（メジアン）",
    secBisect: "角の二等分線",
    secAlt: "高さ（垂線）",
    secTable: "3つの特別な線の比較表",
    medDef: "定義：",
    medDefText: "中線とは、三角形の頂点からその対辺の中点を結ぶ線分です。",
    medCount: "本数：",
    medCountText: "三角形には必ず3本の中線があります（各頂点から1本）。",
    medMeet: "交点：",
    medMeetText: "3本の中線は必ず1点で交わり、その点を重心（G）と呼びます。",
    medProp: "⚖️ 重心の主な性質：",
    medPropText: "重心Gは、各中線を頂点から2 : 1の比に分けます。",
    medWhere: "ここでMaはBCの中点、AMaはAからMaまでの中線の全長です。",
    medFun: "💡 豆知識：",
    medFunText: "重心は三角形の重さの中心です。この点で厚紙の三角形を吊るすと、水平に完全にバランスが取れます！",
    medIntro: "厚紙の三角形のバランスポイント——鉛筆の先に乗せてどちら側にも傾かない点——を探すには、",
    bisDef: "定義：",
    bisDefText: "角の二等分線とは、ある頂点の角を2等分する線分です。",
    bisCount: "本数：",
    bisCountText: "三角形には必ず3本の角の二等分線があります。",
    bisMeet: "交点：",
    bisMeetText: "3本の角の二等分線は1点で交わり、その点を内心（I）と呼びます。",
    bisThm: "📏 角の二等分線定理：",
    bisThmText: "頂点AからのAの角の二等分線がBCとDで交わるとき：",
    bisThmNote: "つまり、点DはBCを角Aを挟む2辺の長さの比で分けます。",
    bisProp: "🎯 内心の特別な性質：",
    bisPropText: "内心（I）は三角形の3辺すべてから等距離にあります。この距離が内接円の半径です。",
    bisIntro: "紙の三角形を折って角の両辺がぴったり重なるような折り目——それが",
    altDef: "定義：",
    altDefText: "高さとは、ある頂点から対辺（またはその延長）に垂直（90°）に引いた線分です。",
    altCount: "本数：",
    altCountText: "三角形には必ず3本の高さがあります。",
    altMeet: "交点：",
    altMeetText: "3本の高さは1点で交わり、その点を垂心（H）と呼びます。",
    altPos: "垂心の位置は三角形の種類によって異なります：",
    altAcute: "🔺 鋭角三角形 → H は内部",
    altRight: "📐 直角三角形 → H = 直角の頂点",
    altObtuse: "📐 鈍角三角形 → H は外部",
    altFormula: "📐 高さの長さの公式（面積を使って）：",
    altFormulaNote: "ここでta = 辺aへの高さ、a = 底辺の長さ。",
    altIntro: "三角形の高さを測るとき——山の形をした三角形の底からの高さを測るように——扱っているのが",
    tblType: "種類", tblDef: "定義", tblMeet: "交点", tblProp: "特別な性質",
    tblMedian: "中線", tblMedianDef: "頂点→対辺の中点", tblMedianMeet: "重心 (G)", tblMedianProp: "頂点から2:1に分割",
    tblBisect: "角の二等分線", tblBisectDef: "角を2等分する", tblBisectMeet: "内心 (I)", tblBisectProp: "内接円の中心",
    tblAlt: "高さ", tblAltDef: "対辺に垂直", tblAltMeet: "垂心 (H)", tblAltProp: "三角形の外に出ることも",
    tblMemo: "覚え方：",
    tblMemo1: "中線 → 対辺の中点へ（バランスポイント）",
    tblMemo2: "角の二等分線 → 角を2等分する",
    tblMemo3: "高さ → 垂直（真下に向かう）",
    ex1q: "三角形ABCで、点MはBCの中点です。線分AMは中線で、GはAM上の重心です。",
    ex1q2: "AG = 10 cm のとき、GMの長さを求めなさい。",
    ex1s1: "重心の性質を使う：",
    ex1s1note: "重心は各中線を頂点から2 : 1の比に分けます。",
    ex1s2: "GMを計算する：",
    ex1ans: "答え：GM = 5 cm",
    ex1tip: "💡 AM の全長 = AG + GM = 10 + 5 = 15 cm。Gは A からの部分が2倍になるようにAMを分けます。",
    ex2q: "三角形PQRで、頂点Pからの角の二等分線がQRとDで交わります。わかっていること：",
    ex2q2: "QD と DR の長さを求めなさい。",
    ex2s1: "角の二等分線定理を書く：",
    ex2s1note: "角の二等分線定理より：",
    ex2s2: "QD と DR を比で表す：",
    ex2s2note: "QD = 3k、DR = 4k とすると：",
    ex2s3: "QD と DR を計算する：",
    ex2ans: "答え：QD = 6 cm、DR = 8 cm",
    ex3q: "三角形ABCはCで直角です。AC = 6 cm、BC = 8 cm。頂点Cから斜辺ABに垂線CHを引きます。",
    ex3q2: "次を求めなさい：",
    ex3q3a: "斜辺ABの長さ",
    ex3q3b: "高さCHの長さ",
    ex3q3c: "AHとBHの長さ",
    ex3s1: "AB を求める（三平方の定理）：",
    ex3s2: "三角形ABCの面積を計算する：",
    ex3s2note: "Cが直角なので、ACとBCが2つの直角辺（底辺と高さ）：",
    ex3s3: "面積の公式でCHを求める：",
    ex3s3note: "底辺ABと高さCHでも面積を表せる：",
    ex3s4: "AHとBHを求める：",
    ex3s4note: "できた小さな直角三角形に三平方の定理を使う：",
    ex3ans: "答え：",
    ex3chk: "✅ 確認：AH + BH = 3.6 + 6.4 = 10 = AB ✓",
    ex3formula: "🔑 一般公式：",
  },
};

/* ══════════════════════════════════════════════════════════
   SVG DIAGRAMS
══════════════════════════════════════════════════════════ */
const GarisBeratSVG = () => (
  <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto my-3" aria-label="Three medians of a triangle meeting at centroid G">
    <polygon points="160,20 30,185 290,185" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <line x1="160" y1="20" x2="160" y2="185" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,3" />
    <line x1="30" y1="185" x2="225" y2="103" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,3" />
    <line x1="290" y1="185" x2="95" y2="103" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,3" />
    <circle cx="160" cy="185" r="4" fill="#facc15" />
    <circle cx="225" cy="103" r="4" fill="#facc15" />
    <circle cx="95" cy="103" r="4" fill="#facc15" />
    <circle cx="160" cy="130" r="6" fill="#f87171" />
    <text x="168" y="128" fill="#f87171" fontSize="13" fontFamily="monospace" fontWeight="bold">G</text>
    <text x="153" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="293" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="164" y="200" fill="#facc15" fontSize="10" fontFamily="monospace">Ma</text>
    <text x="228" y="100" fill="#facc15" fontSize="10" fontFamily="monospace">Mb</text>
    <text x="72" y="100" fill="#facc15" fontSize="10" fontFamily="monospace">Mc</text>
    <text x="6" y="20" fill="#22d3ee" fontSize="10" fontFamily="monospace">AG : GMa = 2 : 1</text>
    <text x="164" y="108" fill="#f87171" fontSize="9" fontFamily="monospace">2</text>
    <text x="164" y="160" fill="#f87171" fontSize="9" fontFamily="monospace">1</text>
  </svg>
);

const GarisBagiSVG = () => (
  <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto my-3" aria-label="Angle bisector from A in triangle ABC">
    <polygon points="160,20 20,185 300,185" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <line x1="160" y1="20" x2="154" y2="185" stroke="#a78bfa" strokeWidth="2.5" />
    <circle cx="154" cy="185" r="4" fill="#a78bfa" />
    <text x="148" y="200" fill="#a78bfa" fontSize="11" fontFamily="monospace">D</text>
    <path d="M 140,44 A 28,28 0 0,0 160,20" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3,2" />
    <path d="M 160,20 A 28,28 0 0,0 178,47" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3,2" />
    <text x="131" y="62" fill="#fb923c" fontSize="10" fontFamily="monospace">α</text>
    <text x="170" y="62" fill="#fb923c" fontSize="10" fontFamily="monospace">α</text>
    <text x="60" y="200" fill="#22d3ee" fontSize="10" fontFamily="monospace">BD</text>
    <text x="220" y="200" fill="#22d3ee" fontSize="10" fontFamily="monospace">DC</text>
    <text x="90" y="175" fill="#94a3b8" fontSize="9" fontFamily="monospace">BD/DC = AB/AC</text>
    <text x="153" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="4" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="304" y="195" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="65" y="90" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(-49,80,90)">AB</text>
    <text x="250" y="80" fill="#e2e8f0" fontSize="10" fontFamily="monospace" transform="rotate(42,240,100)">AC</text>
  </svg>
);

const GarisTimggiAkutSVG = ({ label }: { label: string }) => (
  <svg viewBox="0 0 320 210" className="w-full max-w-sm mx-auto my-3" aria-label="Altitude of acute triangle — orthocenter inside">
    <polygon points="160,20 30,185 290,185" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <line x1="160" y1="20" x2="160" y2="185" stroke="#fb923c" strokeWidth="2" />
    <rect x="148" y="173" width="12" height="12" fill="none" stroke="#fb923c" strokeWidth="1.5" />
    <line x1="30" y1="185" x2="179" y2="41" stroke="#fb923c" strokeWidth="2" />
    <rect x="175" y="37" width="10" height="10" fill="none" stroke="#fb923c" strokeWidth="1.5" transform="rotate(49,180,42)" />
    <line x1="290" y1="185" x2="142" y2="41" stroke="#fb923c" strokeWidth="2" />
    <rect x="138" y="37" width="10" height="10" fill="none" stroke="#fb923c" strokeWidth="1.5" transform="rotate(-49,142,42)" />
    <circle cx="160" cy="57" r="5" fill="#f87171" />
    <text x="166" y="55" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>
    <text x="153" y="14" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="14" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="293" y="198" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="20" fill="#fb923c" fontSize="10" fontFamily="monospace">{label}</text>
  </svg>
);

const GarisTimggiSikuSVG = ({ label }: { label: string }) => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3" aria-label="Altitude of right triangle — orthocenter at right-angle vertex">
    <polygon points="30,30 30,170 230,170" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <rect x="30" y="158" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2" />
    <line x1="30" y1="30" x2="30" y2="170" stroke="#fb923c" strokeWidth="2.5" />
    <line x1="30" y1="170" x2="230" y2="170" stroke="#fb923c" strokeWidth="2.5" />
    <line x1="30" y1="30" x2="30" y2="170" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3" />
    <circle cx="30" cy="170" r="5" fill="#f87171" />
    <text x="10" y="168" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">H(B)</text>
    <text x="34" y="25" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="234" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="38" y="16" fill="#fb923c" fontSize="9" fontFamily="monospace">{label}</text>
  </svg>
);

const GarisTimggiTumpulSVG = ({ label }: { label: string }) => (
  <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto my-3" aria-label="Altitude of obtuse triangle — orthocenter outside">
    <polygon points="230,30 20,170 200,170" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <line x1="200" y1="170" x2="310" y2="170" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />
    <line x1="20" y1="170" x2="230" y2="30" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
    <line x1="230" y1="30" x2="230" y2="170" stroke="#fb923c" strokeWidth="2" />
    <rect x="218" y="158" width="12" height="12" fill="none" stroke="#fb923c" strokeWidth="1.5" />
    <line x1="20" y1="170" x2="185" y2="108" stroke="#fb923c" strokeWidth="2" />
    <circle cx="230" cy="252" r="5" fill="#f87171" />
    <text x="236" y="255" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>
    <text x="224" y="26" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="4" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="202" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4" y="14" fill="#fb923c" fontSize="9" fontFamily="monospace">{label}</text>
  </svg>
);

const ContohSVGMudah = () => (
  <svg viewBox="0 0 280 180" className="w-full max-w-xs mx-auto my-2" aria-label="Example: median AG and GM in triangle ABC">
    <polygon points="140,15 20,165 260,165" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <line x1="140" y1="15" x2="140" y2="165" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="7,3" />
    <circle cx="140" cy="165" r="4" fill="#facc15" />
    <circle cx="140" cy="115" r="5" fill="#f87171" />
    <text x="133" y="10" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="4" y="178" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="264" y="178" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="148" y="170" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">M</text>
    <text x="148" y="113" fill="#f87171" fontSize="12" fontFamily="monospace" fontWeight="bold">G</text>
    <text x="103" y="72" fill="#22d3ee" fontSize="11" fontFamily="monospace">AG=10</text>
    <text x="103" y="148" fill="#4ade80" fontSize="11" fontFamily="monospace">GM=?</text>
  </svg>
);

const ContohSVGSedang = () => (
  <svg viewBox="0 0 300 190" className="w-full max-w-xs mx-auto my-2" aria-label="Example: angle bisector from P in triangle PQR">
    <polygon points="140,15 20,175 280,175" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <line x1="140" y1="15" x2="146" y2="175" stroke="#a78bfa" strokeWidth="2.5" />
    <circle cx="146" cy="175" r="4" fill="#a78bfa" />
    <text x="133" y="11" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">P</text>
    <text x="4" y="188" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">Q</text>
    <text x="284" y="188" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">R</text>
    <text x="140" y="192" fill="#a78bfa" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="44" y="80" fill="#22d3ee" fontSize="10" fontFamily="monospace" transform="rotate(-52,60,90)">PQ = 9</text>
    <text x="228" y="70" fill="#22d3ee" fontSize="10" fontFamily="monospace" transform="rotate(47,225,95)">PR = 12</text>
    <text x="50" y="192" fill="#facc15" fontSize="10" fontFamily="monospace">QD = ?</text>
    <text x="185" y="192" fill="#4ade80" fontSize="10" fontFamily="monospace">DR = ?</text>
    <text x="70" y="160" fill="#94a3b8" fontSize="9" fontFamily="monospace">QR = 14</text>
  </svg>
);

const ContohSVGSulit = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Example: altitude CH in right triangle ABC">
    <polygon points="20,30 20,170 210,170" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
    <rect x="20" y="158" width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="2" />
    <line x1="20" y1="30" x2="20" y2="170" stroke="#e2e8f0" strokeWidth="2.5" opacity="0.7" />
    <line x1="20" y1="170" x2="210" y2="170" stroke="#e2e8f0" strokeWidth="2.5" opacity="0.7" />
    <line x1="20" y1="170" x2="87" y2="79" stroke="#fb923c" strokeWidth="2.5" />
    <circle cx="87" cy="79" r="4" fill="#fb923c" />
    <rect x="84" y="76" width="9" height="9" fill="none" stroke="#fb923c" strokeWidth="1.5" transform="rotate(36,87,80)" />
    <text x="6" y="26" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="214" y="183" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="4" y="175" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="91" y="77" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">H</text>
    <text x="24" y="105" fill="#22d3ee" fontSize="10" fontFamily="monospace">AC=6</text>
    <text x="90" y="185" fill="#22d3ee" fontSize="10" fontFamily="monospace">BC=8</text>
    <text x="80" y="105" fill="#facc15" fontSize="10" fontFamily="monospace" transform="rotate(36,105,120)">AB=10</text>
    <text x="28" y="138" fill="#f87171" fontSize="10" fontFamily="monospace">CH=?</text>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   ACCORDION & CARD COMPONENTS
══════════════════════════════════════════════════════════ */
type Section = { title: string; icon: string; content: React.ReactNode };

const AccordionSection = ({ section, idx }: { section: Section; idx: number }) => {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => { playPopSound(); setOpen((v) => !v); }}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <span className="font-display text-sm font-semibold text-white">{section.title}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border/50">
          <div className="pt-4">{section.content}</div>
        </div>
      )}
    </div>
  );
};

type Example = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode; };

const ExampleCard = ({ ex, idx, showLabel, hideLabel, exLabel }: { ex: Example; idx: number; showLabel: string; hideLabel: string; exLabel: string }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {exLabel} {idx + 1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button
        onClick={() => { playPopSound(); setShowAnswer((v) => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50"
      >
        <span className={`text-xs font-semibold font-body ${ex.color}`}>
          {showAnswer ? hideLabel : showLabel}
        </span>
        {showAnswer ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {showAnswer && (
        <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════ */
const GarisBeratBagiTinggiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const sections: Section[] = [
    {
      title: t.secMedian,
      icon: "📐",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {t.medIntro} <strong className="text-cyan-300">{language === "id" ? "garis berat" : language === "en" ? "the median" : "中線"}</strong>.
          </p>
          <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-lg p-4 space-y-2">
            <p><strong className="text-cyan-300">{t.medDef}</strong> {t.medDefText}</p>
            <p><strong className="text-cyan-300">{t.medCount}</strong> {t.medCountText}</p>
            <p><strong className="text-cyan-300">{t.medMeet}</strong> {t.medMeetText}</p>
          </div>
          <GarisBeratSVG />
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2">
            <p className="text-cyan-300 font-semibold">{t.medProp}</p>
            <p>{t.medPropText}</p>
            <div className="bg-cyan-950/50 rounded p-3 text-center">
              <BlockMath math="\frac{AG}{GMa} = \frac{2}{1} \quad \Rightarrow \quad AG = \frac{2}{3} \times AMa" />
            </div>
            <p className="text-white/70 text-xs">{t.medWhere}</p>
          </div>
          <div className="bg-yellow-950/50 border border-yellow-600/40 rounded-lg p-3 text-yellow-200 text-xs">
            <strong>{t.medFun}</strong> {t.medFunText}
          </div>
        </div>
      ),
    },
    {
      title: t.secBisect,
      icon: "✂️",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {t.bisIntro} <strong className="text-violet-300">{language === "id" ? "garis bagi" : language === "en" ? "an angle bisector" : "角の二等分線"}</strong>.
          </p>
          <div className="bg-violet-950/60 border border-violet-700/50 rounded-lg p-4 space-y-2">
            <p><strong className="text-violet-300">{t.bisDef}</strong> {t.bisDefText}</p>
            <p><strong className="text-violet-300">{t.bisCount}</strong> {t.bisCountText}</p>
            <p><strong className="text-violet-300">{t.bisMeet}</strong> {t.bisMeetText}</p>
          </div>
          <GarisBagiSVG />
          <div className="bg-violet-950/50 border border-violet-600/40 rounded-lg p-4 space-y-3">
            <p className="text-violet-300 font-semibold">{t.bisThm}</p>
            <p className="text-white/80">{t.bisThmText}</p>
            <div className="bg-violet-950/70 rounded p-3 text-center">
              <BlockMath math="\frac{BD}{DC} = \frac{AB}{AC}" />
            </div>
            <p className="text-white/70 text-xs">{t.bisThmNote}</p>
          </div>
          <div className="bg-violet-950/40 border border-violet-600/30 rounded-lg p-3 text-xs text-violet-200">
            🎯 <strong>{t.bisProp}</strong> {t.bisPropText}
          </div>
        </div>
      ),
    },
    {
      title: t.secAlt,
      icon: "📏",
      content: (
        <div className="space-y-3 text-sm text-white/85 font-body leading-relaxed">
          <p>
            {t.altIntro} <strong className="text-orange-300">{language === "id" ? "garis tinggi" : language === "en" ? "the altitude" : "高さ（垂線）"}</strong>.
          </p>
          <div className="bg-orange-950/60 border border-orange-700/50 rounded-lg p-4 space-y-2">
            <p><strong className="text-orange-300">{t.altDef}</strong> {t.altDefText}</p>
            <p><strong className="text-orange-300">{t.altCount}</strong> {t.altCountText}</p>
            <p><strong className="text-orange-300">{t.altMeet}</strong> {t.altMeetText}</p>
          </div>
          <p className="text-orange-300 font-semibold text-xs mt-2">{t.altPos}</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-slate-800/50 border border-slate-600/40 rounded-lg p-3">
              <p className="text-green-400 font-semibold text-xs mb-1">{t.altAcute}</p>
              <GarisTimggiAkutSVG label={t.svgHInside} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 border border-slate-600/40 rounded-lg p-3">
                <p className="text-yellow-400 font-semibold text-xs mb-1">{t.altRight}</p>
                <GarisTimggiSikuSVG label={t.svgHRight} />
              </div>
              <div className="bg-slate-800/50 border border-slate-600/40 rounded-lg p-3">
                <p className="text-red-400 font-semibold text-xs mb-1">{t.altObtuse}</p>
                <GarisTimggiTumpulSVG label={t.svgHOutside} />
              </div>
            </div>
          </div>
          <div className="bg-orange-950/50 border border-orange-600/40 rounded-lg p-3 space-y-1">
            <p className="text-orange-300 font-semibold text-xs">{t.altFormula}</p>
            <div className="bg-orange-950/70 rounded p-2 text-center">
              <BlockMath math="t_a = \frac{2 \times \text{Luas}_{\triangle}}{a}" />
            </div>
            <p className="text-white/60 text-xs">{t.altFormulaNote}</p>
          </div>
        </div>
      ),
    },
    {
      title: t.secTable,
      icon: "📊",
      content: (
        <div className="space-y-3 text-sm font-body">
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="bg-slate-800">
                  <th className="px-2 py-2 text-cyan-300 border-r border-slate-700">{t.tblType}</th>
                  <th className="px-2 py-2 text-cyan-300 border-r border-slate-700">{t.tblDef}</th>
                  <th className="px-2 py-2 text-cyan-300 border-r border-slate-700">{t.tblMeet}</th>
                  <th className="px-2 py-2 text-cyan-300">{t.tblProp}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-700 bg-cyan-950/30">
                  <td className="px-2 py-2 text-cyan-300 font-bold border-r border-slate-700">{t.tblMedian}</td>
                  <td className="px-2 py-2 text-white/70 border-r border-slate-700">{t.tblMedianDef}</td>
                  <td className="px-2 py-2 text-yellow-300 border-r border-slate-700">{t.tblMedianMeet}</td>
                  <td className="px-2 py-2 text-white/70">{t.tblMedianProp}</td>
                </tr>
                <tr className="border-t border-slate-700 bg-violet-950/30">
                  <td className="px-2 py-2 text-violet-300 font-bold border-r border-slate-700">{t.tblBisect}</td>
                  <td className="px-2 py-2 text-white/70 border-r border-slate-700">{t.tblBisectDef}</td>
                  <td className="px-2 py-2 text-yellow-300 border-r border-slate-700">{t.tblBisectMeet}</td>
                  <td className="px-2 py-2 text-white/70">{t.tblBisectProp}</td>
                </tr>
                <tr className="border-t border-slate-700 bg-orange-950/30">
                  <td className="px-2 py-2 text-orange-300 font-bold border-r border-slate-700">{t.tblAlt}</td>
                  <td className="px-2 py-2 text-white/70 border-r border-slate-700">{t.tblAltDef}</td>
                  <td className="px-2 py-2 text-yellow-300 border-r border-slate-700">{t.tblAltMeet}</td>
                  <td className="px-2 py-2 text-white/70">{t.tblAltProp}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p>🔑 <strong className="text-white">{t.tblMemo}</strong></p>
            <p>• <strong className="text-cyan-300">{t.tblMedian}</strong> → {t.tblMemo1}</p>
            <p>• <strong className="text-violet-300">{t.tblBisect}</strong> → {t.tblMemo2}</p>
            <p>• <strong className="text-orange-300">{t.tblAlt}</strong> → {t.tblMemo3}</p>
          </div>
        </div>
      ),
    },
  ];

  const examples: Example[] = [
    {
      level: t.easy,
      color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex1q}</p>
          <ContohSVGMudah />
          <p>{t.ex1q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-green-400">{t.step} 1 — {t.ex1s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex1s1note}</p>
            <BlockMath math="AG : GM = 2 : 1" />
          </div>
          <p className="text-white/80"><strong className="text-green-400">{t.step} 2 — {t.ex1s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="GM = \frac{1}{2} \times AG = \frac{1}{2} \times 10 = 5 \text{ cm}" />
          </div>
          <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
            <p className="text-green-300 font-semibold">{t.ex1ans}</p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">{t.ex1tip}</div>
        </div>
      ),
    },
    {
      level: t.medium,
      color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex2q}</p>
          <ContohSVGSedang />
          <ul className="list-disc list-inside text-white/80 space-y-1 ml-2">
            <li><InlineMath math="PQ = 9 \text{ cm}" /></li>
            <li><InlineMath math="PR = 12 \text{ cm}" /></li>
            <li><InlineMath math="QR = 14 \text{ cm}" /></li>
          </ul>
          <p>{t.ex2q2}</p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 1 — {t.ex2s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex2s1note}</p>
            <BlockMath math="\frac{QD}{DR} = \frac{PQ}{PR} = \frac{9}{12} = \frac{3}{4}" />
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 2 — {t.ex2s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex2s2note}</p>
            <BlockMath math="QD + DR = QR \Rightarrow 3k + 4k = 14" />
            <BlockMath math="7k = 14 \Rightarrow k = 2" />
          </div>
          <p className="text-white/80"><strong className="text-yellow-400">{t.step} 3 — {t.ex2s3}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="QD = 3k = 3 \times 2 = 6 \text{ cm}" />
            <BlockMath math="DR = 4k = 4 \times 2 = 8 \text{ cm}" />
          </div>
          <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3">
            <p className="text-yellow-300 font-semibold">{t.ex2ans}</p>
          </div>
          <div className="bg-violet-950/40 border border-violet-700/30 rounded p-2 text-xs text-violet-200">
            ✅ <InlineMath math="QD + DR = 6 + 8 = 14 \text{ cm} = QR" /> ✓ &nbsp; <InlineMath math="\frac{QD}{DR} = \frac{6}{8} = \frac{3}{4} = \frac{PQ}{PR}" /> ✓
          </div>
        </div>
      ),
    },
    {
      level: t.hard,
      color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
      question: (
        <div className="text-sm text-white/85 font-body space-y-2">
          <p>{t.ex3q}</p>
          <ContohSVGSulit />
          <p>{t.ex3q2}</p>
          <ul className="list-disc list-inside text-white/80 space-y-1 ml-2">
            <li>{t.ex3q3a}</li>
            <li>{t.ex3q3b}</li>
            <li>{t.ex3q3c}</li>
          </ul>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-white/80"><strong className="text-red-400">{t.step} 1 — {t.ex3s1}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <BlockMath math="AB = \sqrt{AC^2 + BC^2} = \sqrt{6^2 + 8^2} = \sqrt{100} = 10 \text{ cm}" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 2 — {t.ex3s2}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex3s2note}</p>
            <BlockMath math="\text{Area} = \frac{1}{2} \times AC \times BC = \frac{1}{2} \times 6 \times 8 = 24 \text{ cm}^2" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 3 — {t.ex3s3}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex3s3note}</p>
            <BlockMath math="24 = \frac{1}{2} \times 10 \times CH \Rightarrow CH = \frac{48}{10} = 4{,}8 \text{ cm}" />
          </div>
          <p className="text-white/80"><strong className="text-red-400">{t.step} 4 — {t.ex3s4}</strong></p>
          <div className="bg-slate-800/60 border border-slate-600 rounded p-3">
            <p className="text-white/70 text-xs mb-2">{t.ex3s4note}</p>
            <BlockMath math="AH = \frac{AC^2}{AB} = \frac{36}{10} = 3{,}6 \text{ cm}" />
            <BlockMath math="BH = \frac{BC^2}{AB} = \frac{64}{10} = 6{,}4 \text{ cm}" />
          </div>
          <div className="bg-red-950/60 border border-red-700/40 rounded p-3 space-y-1">
            <p className="text-red-300 font-semibold">{t.ex3ans}</p>
            <p className="text-white/80">• <InlineMath math="AB = 10 \text{ cm}" /></p>
            <p className="text-white/80">• <InlineMath math="CH = 4{,}8 \text{ cm}" /></p>
            <p className="text-white/80">• <InlineMath math="AH = 3{,}6 \text{ cm}" />, <InlineMath math="BH = 6{,}4 \text{ cm}" /></p>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-700/30 rounded p-2 text-xs text-cyan-200">
            {t.ex3chk}<br />
            {t.ex3formula} <InlineMath math="AH = \frac{AC^2}{AB}" />, <InlineMath math="BH = \frac{BC^2}{AB}" />, <InlineMath math="CH = \frac{AC \times BC}{AB}" />
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
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center leading-tight">
          {t.title1}
        </h1>
        <h2 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center leading-tight">
          {t.title2}
        </h2>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.breadcrumb}</p>

        <div className="bg-card/60 border border-border rounded-xl p-4 mb-6 text-sm font-body text-white/75 leading-relaxed">
          <p>
            {t.intro}
            <strong className="text-cyan-300">{t.introMedian}</strong>{t.introMedianDesc}
            <strong className="text-violet-300">{t.introBisect}</strong>{t.introBisectDesc}
            {language === "ja" ? "" : " dan"}
            <strong className="text-orange-300"> {t.introAlt}</strong>{t.introAltDesc}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {sections.map((section, i) => (
            <AccordionSection key={section.title} section={section} idx={i} />
          ))}
        </div>

        <div className="mb-8">
          <h3 className="font-display text-base font-semibold text-primary text-center mb-4">{t.examplesTitle}</h3>
          <p className="text-white/40 text-xs text-center mb-4 font-body">{t.examplesSubtitle}</p>
          <div className="flex flex-col gap-4">
            {examples.map((ex, i) => (
              <ExampleCard key={ex.level} ex={ex} idx={i} showLabel={t.showSolution} hideLabel={t.hideSolution} exLabel={t.example} />
            ))}
          </div>
        </div>

        <div className="bg-card/60 border border-cyan-800/40 rounded-xl p-4 mb-8">
          <p className="text-cyan-300 font-semibold font-display text-sm mb-3 text-center">{t.quickRef}</p>
          <div className="space-y-2 text-xs font-body text-white/80">
            <div className="bg-cyan-950/50 border border-cyan-800/40 rounded p-3">
              <p className="text-cyan-300 font-semibold mb-1">{t.centroidTitle}</p>
              <BlockMath math="AG = \frac{2}{3} \times AM_a \qquad GM_a = \frac{1}{3} \times AM_a" />
            </div>
            <div className="bg-violet-950/50 border border-violet-800/40 rounded p-3">
              <p className="text-violet-300 font-semibold mb-1">{t.bisectorTitle}</p>
              <BlockMath math="\frac{BD}{DC} = \frac{AB}{AC}" />
            </div>
            <div className="bg-orange-950/50 border border-orange-800/40 rounded p-3">
              <p className="text-orange-300 font-semibold mb-1">{t.altTitle}</p>
              <BlockMath math="t_a = \frac{2 \times \text{Luas}_{\triangle}}{a}" />
              <p className="text-white/60 mt-1 text-center">{t.altNote} <InlineMath math="CH = \frac{AC \times BC}{AB}" /></p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
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

export default GarisBeratBagiTinggiPage;
