import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, AlertCircle, Calculator, Zap, Hash } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PERKALIAN BENTUK DESIMAL",
    pageSubtitle: "Kelas 7 - Bilangan Rasional",
    summaryLabel: "Ringkasan Intisari",
    tipsLabel: "Tips Penting",
    discuss: "Pembahasan:",
    answer: "Jawaban:",
    given: "Diketahui:",
    find: "Ditanya:",
    solve: "Penyelesaian:",
    step: (n: number) => `Langkah ${n}:`,
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    ex: (n: number) => `Contoh Soal ${n}`,

    sec1Title: "Perkalian Desimal dengan 10, 100, 1000",
    sec1Summary: <>Mengalikan bilangan desimal dengan <strong>10, 100, atau 1000</strong> itu gampang banget! Kamu cukup <strong>geser tanda koma ke kanan</strong> sesuai jumlah angka nol pada pengali. Kalau dikali 10, geser 1 tempat. Dikali 100? Geser 2 tempat. Dikali 1000? Geser 3 tempat. Simpel, kan?</>,
    sec1FormulaTitle: "Aturan Pergeseran Koma:",
    mul10: <>Geser koma <strong className="text-purple-300">1 tempat</strong> ke kanan</>,
    mul100: <>Geser koma <strong className="text-purple-300">2 tempat</strong> ke kanan</>,
    mul1000: <>Geser koma <strong className="text-purple-300">3 tempat</strong> ke kanan</>,
    sec1Tips: [
      "Hitung jumlah angka nol pada pengali (10, 100, 1000)",
      "Jika tempat desimal kurang, tambahkan angka 0 di belakang",
      "Cara ini jauh lebih cepat dari perkalian biasa!",
    ],
    ex1Q: <>Hitunglah hasil perkalian <InlineMath math="46,72 \times 10" /></>,
    ex1s1desc: "Pengali adalah 10 (memiliki 1 angka nol)",
    ex1s2: "Geser tanda koma ke kanan sebanyak 1 tempat",
    ex2Q: <>Hitunglah hasil perkalian <InlineMath math="2,3467 \times 1000" /></>,
    ex2s1desc: "Pengali adalah 1000 (memiliki 3 angka nol)",
    ex2s2: "Geser tanda koma ke kanan sebanyak 3 tempat",
    ex3Q: <>Hitunglah hasil perkalian <InlineMath math="8,6543 \times 100.000" /></>,
    ex3s1desc: "Pengali adalah 100.000 (memiliki 5 angka nol)",
    ex3s2: "Perhatikan bahwa 8,6543 hanya punya 4 angka di belakang koma",
    ex3s2desc: <>Kita perlu menambah 1 angka nol di belakang: <InlineMath math="8,65430" /></>,
    ex3s3: "Geser tanda koma ke kanan sebanyak 5 tempat",

    sec2Title: "Perkalian Desimal dengan Desimal",
    sec2Summary: <>Saat mengalikan dua bilangan desimal, ada trik keren yang bisa kamu pakai: <strong> jumlahkan semua angka di belakang koma</strong> dari kedua bilangan. Angka totalnya itulah yang menentukan posisi koma pada hasil akhir. Kalikan dulu seperti bilangan bulat biasa, baru tentukan posisi komanya!</>,
    sec2FormulaTitle: "Aturan Tempat Desimal:",
    sec2FormulaNote: "Jumlah angka di belakang koma pada hasil =",
    sec2FormulaBody: "\\text{Tempat desimal pengali 1} + \\text{Tempat desimal pengali 2}",
    sec2IllusTitle: "Ilustrasi Konsep:",
    sec2Tips: [
      "Abaikan dulu tanda koma saat mengalikan",
      "Hitung total tempat desimal dari kedua pengali",
      "Letakkan koma dari kanan sebanyak total tempat desimal",
    ],
    illus1: "0,25 = 2 tempat desimal",
    illus2: "0,87 = 2 tempat desimal",
    illus3: "Total = 4 tempat desimal",
    illus4: "1,8 = 1 tempat desimal",
    illus5: "1,3626 = 4 tempat desimal",
    illus6: "Total = 5 tempat desimal",

    ex4Q: <>Hitunglah hasil perkalian <InlineMath math="0,25 \times 0,87" /></>,
    ex4s1: "Hitung jumlah tempat desimal",
    ex4s1a: "0,25 memiliki 2 tempat desimal",
    ex4s1b: "0,87 memiliki 2 tempat desimal",
    ex4s1total: "Total = 2 + 2 = 4 tempat desimal",
    ex4s2: "Kalikan seperti bilangan bulat",
    ex4s3: "Letakkan koma (4 angka dari kanan)",
    ex5Q: <>Hitunglah hasil perkalian <InlineMath math="6,4 \times 1,38" /></>,
    ex5s1: "Hitung jumlah tempat desimal",
    ex5s1a: "6,4 memiliki 1 tempat desimal",
    ex5s1b: "1,38 memiliki 2 tempat desimal",
    ex5s1total: "Total = 1 + 2 = 3 tempat desimal",
    ex5s2: "Kalikan seperti bilangan bulat",
    ex5s3: "Letakkan koma (3 angka dari kanan)",
    ex6Q: <>Hitunglah hasil perkalian <InlineMath math="3,67 \times 4,258" /></>,
    ex6s1: "Hitung jumlah tempat desimal",
    ex6s1a: "3,67 memiliki 2 tempat desimal",
    ex6s1b: "4,258 memiliki 3 tempat desimal",
    ex6s1total: "Total = 2 + 3 = 5 tempat desimal",
    ex6s2: "Kalikan seperti bilangan bulat",
    ex6s3: "Letakkan koma (5 angka dari kanan)",

    sec3Title: "Aplikasi dalam Kehidupan Sehari-hari",
    sec3Summary: <>Perkalian bilangan desimal sering banget kita temui dalam kehidupan sehari-hari. Mulai dari menghitung <strong>harga barang</strong>, <strong>konsumsi bahan bakar</strong>, <strong>pengukuran berat</strong>, hingga <strong>perhitungan luas</strong>. Dengan menguasai teknik ini, kamu bisa lebih mudah memecahkan berbagai masalah praktis!</>,
    sec3UsageTitle: "Contoh Penerapan:",
    usage1: "Menghitung total belanja",
    usage2: "Konsumsi bensin kendaraan",
    usage3: "Perhitungan luas tanah",
    usage4: "Konversi mata uang",
    sec3Tips: [] as string[],

    ex7Q: "Sebuah toko menjual apel seharga Rp15.500 per kg. Berapakah harga yang harus dibayar jika membeli 2,5 kg apel?",
    ex7s1: "Tulis persamaan matematika",
    ex7katex1: "\\text{Harga total} = 15.500 \\times 2,5",
    ex7s2: "Hitung perkalian",
    ex7s2a: "15.500 memiliki 0 tempat desimal",
    ex7s2b: "2,5 memiliki 1 tempat desimal",
    ex7s2c: "15500 × 25 = 387.500",
    ex7s2d: "Letakkan koma (1 angka dari kanan): 38.750,0",
    ex7ans: <>Harga yang harus dibayar adalah <strong>Rp38.750</strong></>,

    ex8Q: "Sebuah mobil mengonsumsi bensin 8,5 liter untuk menempuh jarak 100 km. Jika harga bensin Rp12.650 per liter, berapa biaya bensin untuk perjalanan sejauh 350 km?",
    ex8s1: "Hitung kebutuhan bensin untuk 350 km",
    ex8katex1: "\\text{Bensin} = \\frac{350}{100} \\times 8,5 = 3,5 \\times 8,5 = 29,75 \\text{ liter}",
    ex8s2: "Hitung total biaya",
    ex8katex2: "\\text{Biaya} = 29,75 \\times 12.650",
    ex8s3: "Hitung perkalian desimal",
    ex8s3a: "29,75 (2 tempat desimal) × 12.650 (0 tempat desimal)",
    ex8s3b: "2975 × 12650 = 37.633.750",
    ex8s3c: "Total = 2 tempat desimal = 376.337,50",
    ex8ans: <>Biaya bensin adalah <strong>Rp376.337,50</strong></>,

    ex9Q: "Pak Ahmad memiliki sebidang tanah berbentuk persegi panjang dengan panjang 12,75 m dan lebar 8,4 m. Ia ingin memasang keramik dengan ukuran 0,3 m × 0,3 m. Jika harga keramik Rp25.000 per buah, berapa total biaya yang dibutuhkan untuk membeli keramik?",
    ex9s1: "Hitung luas tanah",
    ex9katex1: "\\text{Luas tanah} = 12,75 \\times 8,4 = 107,1 \\text{ m}^2",
    ex9s2: "Hitung luas satu keramik",
    ex9katex2: "\\text{Luas keramik} = 0,3 \\times 0,3 = 0,09 \\text{ m}^2",
    ex9s3: "Hitung jumlah keramik yang dibutuhkan",
    ex9katex3: "\\text{Jumlah} = \\frac{107,1}{0,09} = 1190 \\text{ buah}",
    ex9s4: "Hitung total biaya",
    ex9katex4: "\\text{Biaya} = 1190 \\times 25.000 = 29.750.000",
    ex9ans: <>Total biaya keramik adalah <strong>Rp29.750.000</strong></>,

    sumTitle: "✖️ RANGKUMAN LENGKAP",
    sumSubtitle: "Perkalian Bentuk Desimal — Kelas 7",
    sumSec1Label: "Aturan Perkalian Desimal",
    sumCards: [
      { label: "Abaikan koma, kalikan seperti bilangan bulat", desc: "1,5 × 2,4 → kalikan 15 × 24 = 360. Letakkan koma setelahnya berdasarkan jumlah angka di belakang koma.", color: "from-purple-900/70 to-purple-800/30 border-purple-500/50 text-purple-200" },
      { label: "Hitung total angka di belakang koma", desc: "1,5 (1 desimal) × 2,4 (1 desimal) = 2 desimal di hasil. Jadi 360 → 3,60 = 3,6", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      { label: "Perkalian desimal dengan 10, 100, 1000", desc: "Geser koma ke kanan sebanyak jumlah angka 0! 2,34 × 100 = 234 (geser 2 kali ke kanan).", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "Desimal × Pecahan biasa", desc: "Ubah desimal ke pecahan dulu (atau sebaliknya), lalu kalikan. Pilih cara yang lebih mudah.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
    ],
    sumSec2Label: "Tips & Trik Jitu",
    sumTips: [
      { icon: "🔢", tip: "Hitung total digit desimal kedua faktor", detail: "Jumlah angka di belakang koma A + jumlah angka di belakang koma B = jumlah angka di belakang koma hasil. Selalu!", color: "bg-purple-900/30 border-purple-500/30" },
      { icon: "⚡", tip: "Perkalian ×10ⁿ = geser koma kanan n langkah", detail: "0,0056 × 1000 = 5,6. Cukup geser koma 3 langkah ke kanan. Mudah dan cepat!", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🎯", tip: "Estimasi dulu untuk cek kewajaran", detail: "1,8 × 3,2 ≈ 2 × 3 = 6. Jika hasilmu 5,76 — wajar! Jika 57,6 atau 0,576 — kamu salah meletakkan koma.", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "✅", tip: "Cek dengan pembagian balik", detail: "Jika 1,5 × 2,4 = 3,6, maka 3,6 ÷ 1,5 harus = 2,4. Gunakan kalkulator untuk verifikasi!", color: "bg-blue-900/30 border-blue-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Perkalian desimal mudah bila kamu tahu rahasianya: <strong className="text-purple-300">abaikan koma dulu, kalikan seperti bilangan bulat</strong>, lalu letakkan koma di posisi yang tepat berdasarkan <strong className="text-yellow-300">jumlah total angka desimal</strong>. Teknik estimasi membantu kamu memastikan koma di tempat yang benar!</>,
    tags: ["Abaikan Koma dulu", "Hitung Total Desimal", "×10ⁿ = Geser Koma", "Estimasi untuk Cek"],
    nextLabel: "🚀 Lanjut ke Pembagian Bentuk Desimal!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "DECIMAL MULTIPLICATION",
    pageSubtitle: "Grade 7 - Rational Numbers",
    summaryLabel: "Key Summary",
    tipsLabel: "Important Tips",
    discuss: "Solution:",
    answer: "Answer:",
    given: "Given:",
    find: "Find:",
    solve: "Solution:",
    step: (n: number) => `Step ${n}:`,
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    ex: (n: number) => `Example ${n}`,

    sec1Title: "Decimal Multiplication by 10, 100, 1000",
    sec1Summary: <>Multiplying a decimal number by <strong>10, 100, or 1000</strong> is super easy! Simply <strong>shift the decimal point to the right</strong> by the number of zeros in the multiplier. Multiply by 10? Shift 1 place right. By 100? Shift 2 places. By 1000? Shift 3 places. Simple!</>,
    sec1FormulaTitle: "Decimal Point Shift Rule:",
    mul10: <>Shift decimal <strong className="text-purple-300">1 place</strong> to the right</>,
    mul100: <>Shift decimal <strong className="text-purple-300">2 places</strong> to the right</>,
    mul1000: <>Shift decimal <strong className="text-purple-300">3 places</strong> to the right</>,
    sec1Tips: [
      "Count the number of zeros in the multiplier (10, 100, 1000)",
      "If there are not enough decimal places, add zeros at the end",
      "This is much faster than normal multiplication!",
    ],
    ex1Q: <>Calculate <InlineMath math="46,72 \times 10" /></>,
    ex1s1desc: "The multiplier is 10 (has 1 zero)",
    ex1s2: "Shift the decimal point 1 place to the right",
    ex2Q: <>Calculate <InlineMath math="2,3467 \times 1000" /></>,
    ex2s1desc: "The multiplier is 1000 (has 3 zeros)",
    ex2s2: "Shift the decimal point 3 places to the right",
    ex3Q: <>Calculate <InlineMath math="8,6543 \times 100.000" /></>,
    ex3s1desc: "The multiplier is 100,000 (has 5 zeros)",
    ex3s2: "Note that 8.6543 has only 4 digits after the decimal point",
    ex3s2desc: <>We need to add 1 zero at the end: <InlineMath math="8,65430" /></>,
    ex3s3: "Shift the decimal point 5 places to the right",

    sec2Title: "Multiplying Decimals by Decimals",
    sec2Summary: <>When multiplying two decimals, there is a great trick: <strong>add up all the decimal places</strong> in both numbers. That total tells you where to put the decimal point in the answer. Multiply as whole numbers first, then place the decimal point!</>,
    sec2FormulaTitle: "Decimal Places Rule:",
    sec2FormulaNote: "Number of decimal places in the result =",
    sec2FormulaBody: "\\text{Decimal places in factor 1} + \\text{Decimal places in factor 2}",
    sec2IllusTitle: "Concept Illustration:",
    sec2Tips: [
      "Ignore the decimal point when multiplying",
      "Count the total decimal places from both factors",
      "Place the decimal point that many places from the right",
    ],
    illus1: "0.25 = 2 decimal places",
    illus2: "0.87 = 2 decimal places",
    illus3: "Total = 4 decimal places",
    illus4: "1.8 = 1 decimal place",
    illus5: "1.3626 = 4 decimal places",
    illus6: "Total = 5 decimal places",

    ex4Q: <>Calculate <InlineMath math="0,25 \times 0,87" /></>,
    ex4s1: "Count the decimal places",
    ex4s1a: "0.25 has 2 decimal places",
    ex4s1b: "0.87 has 2 decimal places",
    ex4s1total: "Total = 2 + 2 = 4 decimal places",
    ex4s2: "Multiply as whole numbers",
    ex4s3: "Place the decimal point (4 digits from the right)",
    ex5Q: <>Calculate <InlineMath math="6,4 \times 1,38" /></>,
    ex5s1: "Count the decimal places",
    ex5s1a: "6.4 has 1 decimal place",
    ex5s1b: "1.38 has 2 decimal places",
    ex5s1total: "Total = 1 + 2 = 3 decimal places",
    ex5s2: "Multiply as whole numbers",
    ex5s3: "Place the decimal point (3 digits from the right)",
    ex6Q: <>Calculate <InlineMath math="3,67 \times 4,258" /></>,
    ex6s1: "Count the decimal places",
    ex6s1a: "3.67 has 2 decimal places",
    ex6s1b: "4.258 has 3 decimal places",
    ex6s1total: "Total = 2 + 3 = 5 decimal places",
    ex6s2: "Multiply as whole numbers",
    ex6s3: "Place the decimal point (5 digits from the right)",

    sec3Title: "Real-Life Applications",
    sec3Summary: <>Decimal multiplication appears constantly in everyday life — from calculating <strong>item prices</strong>, <strong>fuel consumption</strong>, <strong>weight measurements</strong>, to <strong>area calculations</strong>. Master this technique and you can solve many practical problems!</>,
    sec3UsageTitle: "Application Examples:",
    usage1: "Calculating total shopping cost",
    usage2: "Vehicle fuel consumption",
    usage3: "Land area calculation",
    usage4: "Currency conversion",
    sec3Tips: [] as string[],

    ex7Q: "A shop sells apples for $15,500 per kg. How much must be paid for 2.5 kg of apples?",
    ex7s1: "Write the mathematical equation",
    ex7katex1: "\\text{Total price} = 15.500 \\times 2,5",
    ex7s2: "Calculate the multiplication",
    ex7s2a: "15,500 has 0 decimal places",
    ex7s2b: "2.5 has 1 decimal place",
    ex7s2c: "15500 × 25 = 387,500",
    ex7s2d: "Place decimal (1 digit from right): 38,750.0",
    ex7ans: <>The amount to be paid is <strong>$38,750</strong></>,

    ex8Q: "A car uses 8.5 litres of petrol for 100 km. If petrol costs $12,650 per litre, what is the petrol cost for a 350 km journey?",
    ex8s1: "Calculate fuel needed for 350 km",
    ex8katex1: "\\text{Fuel} = \\frac{350}{100} \\times 8,5 = 3,5 \\times 8,5 = 29,75 \\text{ litres}",
    ex8s2: "Calculate total cost",
    ex8katex2: "\\text{Cost} = 29,75 \\times 12{,}650",
    ex8s3: "Calculate the decimal multiplication",
    ex8s3a: "29.75 (2 decimal places) × 12,650 (0 decimal places)",
    ex8s3b: "2975 × 12650 = 37,633,750",
    ex8s3c: "Total = 2 decimal places = 376,337.50",
    ex8ans: <>The petrol cost is <strong>$376,337.50</strong></>,

    ex9Q: "Mr Ahmad has a rectangular plot of land 12.75 m long and 8.4 m wide. He wants to lay tiles measuring 0.3 m × 0.3 m. If each tile costs $25,000, what is the total cost of buying the tiles?",
    ex9s1: "Calculate the land area",
    ex9katex1: "\\text{Land area} = 12,75 \\times 8,4 = 107,1 \\text{ m}^2",
    ex9s2: "Calculate the area of one tile",
    ex9katex2: "\\text{Tile area} = 0,3 \\times 0,3 = 0,09 \\text{ m}^2",
    ex9s3: "Calculate the number of tiles needed",
    ex9katex3: "\\text{Quantity} = \\frac{107,1}{0,09} = 1190 \\text{ tiles}",
    ex9s4: "Calculate the total cost",
    ex9katex4: "\\text{Cost} = 1190 \\times 25{,}000 = 29{,}750{,}000",
    ex9ans: <>The total cost of tiles is <strong>$29,750,000</strong></>,

    sumTitle: "✖️ COMPLETE SUMMARY",
    sumSubtitle: "Decimal Multiplication — Grade 7",
    sumSec1Label: "Rules for Decimal Multiplication",
    sumCards: [
      { label: "Ignore the decimal, multiply as whole numbers", desc: "1.5 × 2.4 → multiply 15 × 24 = 360. Then place the decimal based on total decimal places.", color: "from-purple-900/70 to-purple-800/30 border-purple-500/50 text-purple-200" },
      { label: "Count total decimal places", desc: "1.5 (1 decimal) × 2.4 (1 decimal) = 2 decimals in result. So 360 → 3.60 = 3.6", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      { label: "Decimal × 10, 100, 1000", desc: "Shift decimal right by the number of zeros! 2.34 × 100 = 234 (shift 2 places right).", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "Decimal × ordinary fraction", desc: "Convert the decimal to a fraction (or vice versa), then multiply. Choose the easier method.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
    ],
    sumSec2Label: "Tips & Tricks",
    sumTips: [
      { icon: "🔢", tip: "Count total decimal digits of both factors", detail: "Decimal places in A + decimal places in B = decimal places in result. Always!", color: "bg-purple-900/30 border-purple-500/30" },
      { icon: "⚡", tip: "×10ⁿ = shift decimal right n steps", detail: "0.0056 × 1000 = 5.6. Just shift the decimal 3 steps right. Easy and fast!", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🎯", tip: "Estimate first to check reasonableness", detail: "1.8 × 3.2 ≈ 2 × 3 = 6. If your result is 5.76 — reasonable! If 57.6 or 0.576 — you placed the decimal wrong.", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "✅", tip: "Check with reverse division", detail: "If 1.5 × 2.4 = 3.6, then 3.6 ÷ 1.5 must = 2.4. Use a calculator to verify!", color: "bg-blue-900/30 border-blue-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Decimal multiplication is easy when you know the secret: <strong className="text-purple-300">ignore the decimal point first, multiply as whole numbers</strong>, then place the decimal at the right position based on <strong className="text-yellow-300">the total number of decimal places</strong>. Estimation helps you ensure the decimal is in the right place!</>,
    tags: ["Ignore Decimal First", "Count Total Decimals", "×10ⁿ = Shift Decimal", "Estimate to Check"],
    nextLabel: "🚀 Continue to Decimal Division!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    pageTitle: "小数の掛け算",
    pageSubtitle: "中学1年 - 有理数",
    summaryLabel: "要点まとめ",
    tipsLabel: "重要なヒント",
    discuss: "解説：",
    answer: "答え：",
    given: "既知：",
    find: "求めるもの：",
    solve: "解法：",
    step: (n: number) => `手順 ${n}：`,
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    ex: (n: number) => `例題 ${n}`,

    sec1Title: "小数を10・100・1000で掛ける",
    sec1Summary: <>小数に<strong>10、100、1000</strong>を掛けるのはとても簡単です！掛ける数のゼロの個数だけ<strong>小数点を右にずらせば</strong>OKです。10を掛けるなら1つ右へ。100なら2つ。1000なら3つ。シンプルでしょう？</>,
    sec1FormulaTitle: "小数点移動のルール：",
    mul10: <>小数点を<strong className="text-purple-300">1つ</strong>右にずらす</>,
    mul100: <>小数点を<strong className="text-purple-300">2つ</strong>右にずらす</>,
    mul1000: <>小数点を<strong className="text-purple-300">3つ</strong>右にずらす</>,
    sec1Tips: [
      "掛ける数（10、100、1000）のゼロの個数を数える",
      "小数点以下の桁が足りない場合は、後ろに0を追加する",
      "この方法は普通の掛け算よりずっと速い！",
    ],
    ex1Q: <>計算せよ <InlineMath math="46,72 \times 10" /></>,
    ex1s1desc: "掛ける数は10（ゼロが1つ）",
    ex1s2: "小数点を1つ右にずらす",
    ex2Q: <>計算せよ <InlineMath math="2,3467 \times 1000" /></>,
    ex2s1desc: "掛ける数は1000（ゼロが3つ）",
    ex2s2: "小数点を3つ右にずらす",
    ex3Q: <>計算せよ <InlineMath math="8,6543 \times 100.000" /></>,
    ex3s1desc: "掛ける数は100,000（ゼロが5つ）",
    ex3s2: "8.6543の小数点以下には4桁しかないことに注意する",
    ex3s2desc: <>後ろに0を1つ追加する必要があります：<InlineMath math="8,65430" /></>,
    ex3s3: "小数点を5つ右にずらす",

    sec2Title: "小数同士の掛け算",
    sec2Summary: <>2つの小数を掛けるときの便利なコツ：両方の数の<strong>小数点以下の桁数を足す</strong>。その合計が答えの小数点の位置を決めます。まず整数として掛けてから、小数点を配置します！</>,
    sec2FormulaTitle: "小数の桁数のルール：",
    sec2FormulaNote: "答えの小数点以下の桁数 =",
    sec2FormulaBody: "\\text{因数1の小数桁数} + \\text{因数2の小数桁数}",
    sec2IllusTitle: "概念の図解：",
    sec2Tips: [
      "掛け算のとき小数点は無視する",
      "両方の因数の小数桁数の合計を求める",
      "右から合計桁数の位置に小数点を置く",
    ],
    illus1: "0.25 = 小数2桁",
    illus2: "0.87 = 小数2桁",
    illus3: "合計 = 4桁",
    illus4: "1.8 = 小数1桁",
    illus5: "1.3626 = 小数4桁",
    illus6: "合計 = 5桁",

    ex4Q: <>計算せよ <InlineMath math="0,25 \times 0,87" /></>,
    ex4s1: "小数の桁数を数える",
    ex4s1a: "0.25は小数2桁",
    ex4s1b: "0.87は小数2桁",
    ex4s1total: "合計 = 2 + 2 = 4桁",
    ex4s2: "整数として掛け算する",
    ex4s3: "小数点を配置する（右から4桁）",
    ex5Q: <>計算せよ <InlineMath math="6,4 \times 1,38" /></>,
    ex5s1: "小数の桁数を数える",
    ex5s1a: "6.4は小数1桁",
    ex5s1b: "1.38は小数2桁",
    ex5s1total: "合計 = 1 + 2 = 3桁",
    ex5s2: "整数として掛け算する",
    ex5s3: "小数点を配置する（右から3桁）",
    ex6Q: <>計算せよ <InlineMath math="3,67 \times 4,258" /></>,
    ex6s1: "小数の桁数を数える",
    ex6s1a: "3.67は小数2桁",
    ex6s1b: "4.258は小数3桁",
    ex6s1total: "合計 = 2 + 3 = 5桁",
    ex6s2: "整数として掛け算する",
    ex6s3: "小数点を配置する（右から5桁）",

    sec3Title: "日常生活への応用",
    sec3Summary: <>小数の掛け算は日常生活でよく使います。<strong>商品の価格計算</strong>、<strong>燃費</strong>、<strong>重量の計測</strong>、<strong>面積計算</strong>など。このテクニックを使えばさまざまな実用的な問題が解けます！</>,
    sec3UsageTitle: "応用例：",
    usage1: "購入金額の計算",
    usage2: "車の燃費",
    usage3: "土地の面積計算",
    usage4: "通貨換算",
    sec3Tips: [] as string[],

    ex7Q: "あるお店でリンゴが1 kgあたり$15,500で売られています。2.5 kgのリンゴを買うといくらになりますか？",
    ex7s1: "数式を書く",
    ex7katex1: "\\text{合計金額} = 15.500 \\times 2,5",
    ex7s2: "掛け算を計算する",
    ex7s2a: "15,500は小数0桁",
    ex7s2b: "2.5は小数1桁",
    ex7s2c: "15500 × 25 = 387,500",
    ex7s2d: "小数点を配置（右から1桁）：38,750.0",
    ex7ans: <>支払う金額は<strong>$38,750</strong>です。</>,

    ex8Q: "ある車は100 kmを走るのに8.5リットルのガソリンを消費します。ガソリンが1リットル$12,650の場合、350 kmの旅行のガソリン代はいくらですか？",
    ex8s1: "350 kmに必要なガソリン量を計算する",
    ex8katex1: "\\text{燃料} = \\frac{350}{100} \\times 8,5 = 3,5 \\times 8,5 = 29,75 \\text{ リットル}",
    ex8s2: "合計費用を計算する",
    ex8katex2: "\\text{費用} = 29,75 \\times 12{,}650",
    ex8s3: "小数の掛け算を計算する",
    ex8s3a: "29.75（小数2桁）× 12,650（小数0桁）",
    ex8s3b: "2975 × 12650 = 37,633,750",
    ex8s3c: "合計 = 小数2桁 = 376,337.50",
    ex8ans: <>ガソリン代は<strong>$376,337.50</strong>です。</>,

    ex9Q: "アフマドさんは縦12.75 m、横8.4 mの長方形の土地を持っています。0.3 m × 0.3 mのタイルを敷こうとしています。タイルが1枚$25,000の場合、タイルの購入総費用はいくらですか？",
    ex9s1: "土地の面積を計算する",
    ex9katex1: "\\text{土地の面積} = 12,75 \\times 8,4 = 107,1 \\text{ m}^2",
    ex9s2: "タイル1枚の面積を計算する",
    ex9katex2: "\\text{タイルの面積} = 0,3 \\times 0,3 = 0,09 \\text{ m}^2",
    ex9s3: "必要なタイルの枚数を計算する",
    ex9katex3: "\\text{枚数} = \\frac{107,1}{0,09} = 1190 \\text{ 枚}",
    ex9s4: "総費用を計算する",
    ex9katex4: "\\text{費用} = 1190 \\times 25{,}000 = 29{,}750{,}000",
    ex9ans: <>タイルの総費用は<strong>$29,750,000</strong>です。</>,

    sumTitle: "✖️ 完全まとめ",
    sumSubtitle: "小数の掛け算 — 中学1年",
    sumSec1Label: "小数の掛け算のルール",
    sumCards: [
      { label: "小数点を無視して整数として掛ける", desc: "1.5 × 2.4 → 15 × 24 = 360。その後、小数の桁数に基づいて小数点を配置する。", color: "from-purple-900/70 to-purple-800/30 border-purple-500/50 text-purple-200" },
      { label: "小数の桁数の合計を数える", desc: "1.5（1桁）× 2.4（1桁）= 結果は2桁。360 → 3.60 = 3.6", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      { label: "小数 × 10、100、1000", desc: "ゼロの個数だけ小数点を右にずらす！2.34 × 100 = 234（2つ右へ）。", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "小数 × 分数", desc: "小数を分数に変換してから（または逆に）掛け算する。より簡単な方法を選ぶ。", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
    ],
    sumSec2Label: "ヒントとコツ",
    sumTips: [
      { icon: "🔢", tip: "両方の因数の小数桁数の合計を数える", detail: "AとBの小数桁数の合計 = 結果の小数桁数。必ずこうなります！", color: "bg-purple-900/30 border-purple-500/30" },
      { icon: "⚡", tip: "×10ⁿ = 小数点をn歩右にずらす", detail: "0.0056 × 1000 = 5.6。小数点を3つ右にずらすだけ。簡単で速い！", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🎯", tip: "まず見積もって妥当性を確認する", detail: "1.8 × 3.2 ≈ 2 × 3 = 6。結果が5.76なら妥当！57.6や0.576なら小数点の位置が間違い。", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "✅", tip: "逆の割り算で確認する", detail: "1.5 × 2.4 = 3.6なら、3.6 ÷ 1.5 = 2.4でなければならない。電卓で確認しよう！", color: "bg-blue-900/30 border-blue-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>小数の掛け算は秘訣を知れば簡単です：<strong className="text-purple-300">まず小数点を無視して整数として掛け算し</strong>、その後<strong className="text-yellow-300">小数の桁数の合計</strong>に基づいて小数点を正しい位置に配置します。見積もりを使って小数点の位置を確認しましょう！</>,
    tags: ["まず小数点を無視", "合計桁数を数える", "×10ⁿ=小数点移動", "見積もりで確認"],
    nextLabel: "🚀 小数の割り算へ進む！",
    backBtn: "有理数に戻る",
  },
};

const PerkalianBentukDesimalPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-4xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.pageSubtitle}</p>

        {/* Section 1: ×10/100/1000 */}
        <div className="mb-6 animate-slide-up">
          <div className="w-full flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 text-left">
            <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec1Title}</span>
          </div>
          <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
              </h3>
              <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec1Summary}</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec1FormulaTitle}</h4>
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">x10</span>
                  <span className="text-white/80 text-sm">{t.mul10}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">x100</span>
                  <span className="text-white/80 text-sm">{t.mul100}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">x1000</span>
                  <span className="text-white/80 text-sm">{t.mul1000}</span>
                </div>
              </div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {t.tipsLabel}
              </h4>
              <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                {t.sec1Tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
            {/* Example 1 - Easy */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                <span className="text-green-300 font-semibold text-sm">{t.ex(1)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex1Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {language === "id" ? "Identifikasi pengali" : language === "en" ? "Identify the multiplier" : "掛ける数を確認する"}</p>
                  <div className="pl-4">{t.ex1s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                  <div className="pl-4"><InlineMath math="46,72 \rightarrow 467,2" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="46,72 \times 10 = 467,2" /></p>
                </div>
              </div>
            </div>
            {/* Example 2 - Medium */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                <span className="text-yellow-300 font-semibold text-sm">{t.ex(2)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex2Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {language === "id" ? "Identifikasi pengali" : language === "en" ? "Identify the multiplier" : "掛ける数を確認する"}</p>
                  <div className="pl-4">{t.ex2s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                  <div className="pl-4"><InlineMath math="2,3467 \rightarrow 2346,7" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="2,3467 \times 1000 = 2346,7" /></p>
                </div>
              </div>
            </div>
            {/* Example 3 - Hard */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                <span className="text-red-300 font-semibold text-sm">{t.ex(3)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex3Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {language === "id" ? "Identifikasi pengali" : language === "en" ? "Identify the multiplier" : "掛ける数を確認する"}</p>
                  <div className="pl-4">{t.ex3s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                  <div className="pl-4">{t.ex3s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex3s3}</p>
                  <div className="pl-4"><InlineMath math="8,65430 \rightarrow 865430" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="8,6543 \times 100.000 = 865.430" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: ×decimal */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-full flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 text-left">
            <Calculator className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec2Title}</span>
          </div>
          <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
              </h3>
              <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec2Summary}</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec2FormulaTitle}</h4>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-white/90 text-sm mb-2">{t.sec2FormulaNote}</p>
                <BlockMath math={t.sec2FormulaBody} />
              </div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="text-slate-300 font-semibold text-sm mb-3">{t.sec2IllusTitle}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-black/30 rounded p-3">
                  <p className="text-cyan-300 mb-2">{language === "id" ? "Contoh:" : language === "en" ? "Example:" : "例："} <InlineMath math="0,25 \times 0,87" /></p>
                  <p className="text-white/70">{t.illus1}</p>
                  <p className="text-white/70">{t.illus2}</p>
                  <p className="text-green-300 mt-2">{t.illus3}</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <p className="text-cyan-300 mb-2">{language === "id" ? "Contoh:" : language === "en" ? "Example:" : "例："} <InlineMath math="1,8 \times 1,3626" /></p>
                  <p className="text-white/70">{t.illus4}</p>
                  <p className="text-white/70">{t.illus5}</p>
                  <p className="text-green-300 mt-2">{t.illus6}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {t.tipsLabel}
              </h4>
              <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                {t.sec2Tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
            {/* Example 4 - Easy */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                <span className="text-green-300 font-semibold text-sm">{t.ex(1)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex4Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex4s1}</p>
                  <div className="pl-4">
                    <p>{t.ex4s1a}</p><p>{t.ex4s1b}</p>
                    <p className="text-yellow-300">{t.ex4s1total}</p>
                  </div>
                  <p><strong>{t.step(2)}</strong> {t.ex4s2}</p>
                  <div className="pl-4"><InlineMath math="25 \times 87 = 2175" /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex4s3}</p>
                  <div className="pl-4"><InlineMath math="2175 \rightarrow 0,2175" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="0,25 \times 0,87 = 0,2175" /></p>
                </div>
              </div>
            </div>
            {/* Example 5 - Medium */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                <span className="text-yellow-300 font-semibold text-sm">{t.ex(2)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex5Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex5s1}</p>
                  <div className="pl-4">
                    <p>{t.ex5s1a}</p><p>{t.ex5s1b}</p>
                    <p className="text-yellow-300">{t.ex5s1total}</p>
                  </div>
                  <p><strong>{t.step(2)}</strong> {t.ex5s2}</p>
                  <div className="pl-4"><BlockMath math="64 \times 138 = 8832" /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex5s3}</p>
                  <div className="pl-4"><InlineMath math="8832 \rightarrow 8,832" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="6,4 \times 1,38 = 8,832" /></p>
                </div>
              </div>
            </div>
            {/* Example 6 - Hard */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                <span className="text-red-300 font-semibold text-sm">{t.ex(3)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex6Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex6s1}</p>
                  <div className="pl-4">
                    <p>{t.ex6s1a}</p><p>{t.ex6s1b}</p>
                    <p className="text-yellow-300">{t.ex6s1total}</p>
                  </div>
                  <p><strong>{t.step(2)}</strong> {t.ex6s2}</p>
                  <div className="pl-4"><BlockMath math="367 \times 4258 = 1.562.686" /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex6s3}</p>
                  <div className="pl-4"><InlineMath math="1562686 \rightarrow 15,62686" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="3,67 \times 4,258 = 15,62686" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Applications */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 text-left">
            <Hash className="w-5 h-5 text-orange-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec3Title}</span>
          </div>
          <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg p-4">
              <h3 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
              </h3>
              <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec3Summary}</p>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="text-slate-300 font-semibold text-sm mb-3">{t.sec3UsageTitle}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  { dot: "bg-cyan-400", text: t.usage1 },
                  { dot: "bg-green-400", text: t.usage2 },
                  { dot: "bg-yellow-400", text: t.usage3 },
                  { dot: "bg-orange-400", text: t.usage4 },
                ].map(({ dot, text }) => (
                  <div key={text} className="flex items-center gap-2 text-white/80">
                    <span className={`w-2 h-2 ${dot} rounded-full`}></span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            {/* Example 7 - Easy */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                <span className="text-green-300 font-semibold text-sm">{t.ex(1)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex7Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex7s1}</p>
                  <div className="pl-4"><InlineMath math={t.ex7katex1} /></div>
                  <p><strong>{t.step(2)}</strong> {t.ex7s2}</p>
                  <div className="pl-4">
                    <p>{t.ex7s2a}</p>
                    <p>{t.ex7s2b}</p>
                    <p><InlineMath math={language === "id" ? "15500 \\times 25 = 387.500" : "15500 \\times 25 = 387{,}500"} /></p>
                    <p>{t.ex7s2d}</p>
                  </div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> {t.ex7ans}</p>
                </div>
              </div>
            </div>
            {/* Example 8 - Medium */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                <span className="text-yellow-300 font-semibold text-sm">{t.ex(2)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex8Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex8s1}</p>
                  <div className="pl-4"><InlineMath math={t.ex8katex1} /></div>
                  <p><strong>{t.step(2)}</strong> {t.ex8s2}</p>
                  <div className="pl-4"><InlineMath math={t.ex8katex2} /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex8s3}</p>
                  <div className="pl-4">
                    <p>{t.ex8s3a}</p>
                    <p><InlineMath math={language === "id" ? "2975 \\times 12650 = 37.633.750" : "2975 \\times 12650 = 37{,}633{,}750"} /></p>
                    <p>{t.ex8s3c}</p>
                  </div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> {t.ex8ans}</p>
                </div>
              </div>
            </div>
            {/* Example 9 - Hard */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                <span className="text-red-300 font-semibold text-sm">{t.ex(3)}</span>
              </div>
              <p className="text-white/90 text-sm font-body mb-4">{t.ex9Q}</p>
              <div className="bg-black/30 rounded-lg p-4">
                <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discuss}</h5>
                <div className="text-white/80 text-sm font-body space-y-2">
                  <p><strong>{t.step(1)}</strong> {t.ex9s1}</p>
                  <div className="pl-4"><InlineMath math={t.ex9katex1} /></div>
                  <p><strong>{t.step(2)}</strong> {t.ex9s2}</p>
                  <div className="pl-4"><InlineMath math={t.ex9katex2} /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex9s3}</p>
                  <div className="pl-4"><InlineMath math={t.ex9katex3} /></div>
                  <p><strong>{t.step(4)}</strong> {t.ex9s4}</p>
                  <div className="pl-4"><InlineMath math={t.ex9katex4} /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> {t.ex9ans}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 border border-purple-500 flex items-center justify-center text-[10px]">1</span>
                {t.sumSec1Label}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {t.sumCards.map(({ label, desc, color }) => (
                  <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                    <div><p className="font-body text-xs font-bold">{label}</p><p className="font-body text-xs text-white/65 mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">2</span>
                {t.sumSec2Label}
              </p>
              <div className="space-y-2">
                {t.sumTips.map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 via-violet-500/15 to-indigo-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🔮</div>
              <p className="font-display text-base font-bold text-white">{t.conclusionTitle}</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.conclusionBody}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {t.tags.map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{t.nextLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/bilangan-rasional"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianBentukDesimalPage;
