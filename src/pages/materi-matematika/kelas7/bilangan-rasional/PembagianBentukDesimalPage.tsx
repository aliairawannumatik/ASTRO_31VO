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
    pageTitle: "PEMBAGIAN BENTUK DESIMAL",
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

    sec1Title: "Pembagian Desimal dengan 10, 100, 1000",
    sec1Summary: <>Membagi bilangan desimal dengan <strong>10, 100, atau 1000</strong> itu kebalikan dari perkalian! Kamu cukup <strong>geser tanda koma ke kiri</strong> sesuai jumlah angka nol pada pembagi. Kalau dibagi 10, geser 1 tempat ke kiri. Dibagi 100? Geser 2 tempat. Dibagi 1000? Geser 3 tempat. Praktis banget!</>,
    sec1FormulaTitle: "Aturan Pergeseran Koma:",
    div10: <>Geser koma <strong className="text-purple-300">1 tempat</strong> ke kiri</>,
    div100: <>Geser koma <strong className="text-purple-300">2 tempat</strong> ke kiri</>,
    div1000: <>Geser koma <strong className="text-purple-300">3 tempat</strong> ke kiri</>,
    sec1Tips: [
      "Hitung jumlah angka nol pada pembagi (10, 100, 1000)",
      "Jika tempat di depan koma kurang, tambahkan angka 0 di depan",
      <>Ingat: pembagian = geser koma ke <strong>KIRI</strong> (kebalikan dari perkalian)</>,
    ],
    ex1Q: <>Hitunglah hasil pembagian <InlineMath math="234,5 \div 10" /></>,
    ex1s1desc: "Pembagi adalah 10 (memiliki 1 angka nol)",
    ex1s2: "Geser tanda koma ke kiri sebanyak 1 tempat",
    ex2Q: <>Hitunglah hasil pembagian <InlineMath math="3456,78 \div 1000" /></>,
    ex2s1desc: "Pembagi adalah 1000 (memiliki 3 angka nol)",
    ex2s2: "Geser tanda koma ke kiri sebanyak 3 tempat",
    ex3Q: <>Hitunglah hasil pembagian <InlineMath math="3456,78 \div 100.000" /></>,
    ex3s1desc: "Pembagi adalah 100.000 (memiliki 5 angka nol)",
    ex3s2: "Perhatikan bahwa 3456,78 hanya punya 4 angka di depan koma",
    ex3s2desc: <>Kita perlu menambah 1 angka nol di depan: <InlineMath math="03456,78" /></>,
    ex3s3: "Geser tanda koma ke kiri sebanyak 5 tempat",

    sec2Title: "Pembagian Desimal dengan Desimal",
    sec2Summary: <>Membagi bilangan desimal dengan bilangan desimal lainnya butuh trik khusus: <strong> ubah pembagi menjadi bilangan bulat terlebih dahulu!</strong> Caranya? Kalikan pembilang dan pembagi dengan angka yang sama (10, 100, atau 1000) sampai pembaginya jadi bilangan bulat. Setelah itu, tinggal bagi seperti biasa!</>,
    sec2FormulaTitle: "Strategi Pembagian Desimal:",
    sec2FormulaNote: <>di mana <InlineMath math="n" /> adalah 10, 100, atau 1000 agar pembagi menjadi bilangan bulat</>,
    sec2IllusTitle: "Ilustrasi Konsep:",
    sec2Tips: [
      "Fokus pada pembagi - hitung berapa angka di belakang komanya",
      "Kalikan pembilang dan pembagi dengan kelipatan 10 yang sama",
      "Setelah pembagi jadi bilangan bulat, lakukan pembagian biasa",
    ],
    illus1desc1: "Pembagi 0,7 punya 1 desimal",
    illus1desc2: "Kalikan keduanya dengan 10",
    illus2desc1: "Pembagi 0,012 punya 3 desimal",
    illus2desc2: "Kalikan keduanya dengan 1000",

    ex4Q: <>Hitunglah hasil pembagian <InlineMath math="14,245 \div 0,7" /></>,
    ex4s1: "Ubah menjadi bentuk pecahan",
    ex4s2: "Kalikan pembilang dan pembagi dengan 10",
    ex4s3: "Lakukan pembagian",
    ex5Q: <>Hitunglah hasil pembagian <InlineMath math="1,03248 \div 0,012" /></>,
    ex5s1: "Ubah menjadi bentuk pecahan",
    ex5s2: "Pembagi punya 3 angka desimal, kalikan dengan 1000",
    ex5s3: "Lakukan pembagian",
    ex6Q: <>Hitunglah hasil pembagian <InlineMath math="0,4563 \div 0,0015" /></>,
    ex6s1: "Ubah menjadi bentuk pecahan",
    ex6s2: "Pembagi punya 4 angka desimal, kalikan dengan 10.000",
    ex6s3: "Lakukan pembagian",

    sec3Title: "Aplikasi dalam Kehidupan Sehari-hari",
    sec3Summary: <>Pembagian desimal bukan cuma teori di buku pelajaran! Kamu akan sering menemukannya dalam kehidupan nyata, misalnya saat <strong>menghitung harga satuan</strong>, <strong> membagi makanan</strong>, atau <strong>menghitung kecepatan rata-rata</strong>. Yuk, latihan dengan contoh-contoh praktis!</>,
    sec3UsageTitle: "Contoh Penggunaan Sehari-hari:",
    usage1: "Harga per unit",
    usage1desc: "Rp15.750 : 2,5 kg",
    usage2: "Konsumsi BBM",
    usage2desc: "125,5 km : 8,5 liter",
    usage3: "Pembagian panjang",
    usage3desc: "18,6 m : 1,2 bagian",
    sec3Tips: [
      "Baca soal cerita dengan teliti, identifikasi mana yang dibagi dan pembaginya",
      "Perhatikan satuan dalam soal (rupiah, kg, meter, liter)",
      "Gunakan teknik mengubah pembagi jadi bilangan bulat untuk mempermudah",
    ],
    ex7Q: "Andi membeli 2,5 kg gula dengan harga Rp37.500. Berapakah harga gula per kilogram?",
    ex7given1: "Total harga = Rp37.500",
    ex7given2: "Berat gula = 2,5 kg",
    ex7find: "Harga per kilogram",
    ex7pricePerKg: "Harga per kg = ",
    ex7multiply: "Kalikan dengan 10:",
    ex7ans: <>Harga gula per kilogram adalah <strong>Rp15.000</strong></>,

    ex8Q: "Sebuah mobil menempuh jarak 187,5 km dengan menghabiskan 12,5 liter bensin. Berapa kilometer yang dapat ditempuh mobil tersebut untuk setiap liter bensin?",
    ex8given1: "Jarak tempuh = 187,5 km",
    ex8given2: "Bensin yang dipakai = 12,5 liter",
    ex8find: "Jarak per liter bensin",
    ex8distPerLitre: "Jarak per liter = ",
    ex8multiply: "Kalikan dengan 10:",
    ex8calc: "Hitung:",
    ex8ans: <>Mobil dapat menempuh <strong>15 km per liter bensin</strong></>,

    ex9Q: "Seutas tali sepanjang 24,36 meter akan dipotong menjadi beberapa bagian. Setiap bagian memiliki panjang 0,84 meter. Berapa banyak potongan tali yang didapat dan berapa sisa panjang tali yang tidak terpotong?",
    ex9given1: "Panjang tali = 24,36 meter",
    ex9given2: "Panjang setiap potongan = 0,84 meter",
    ex9find: "Jumlah potongan dan sisa tali",
    ex9numPieces: "Jumlah potongan = ",
    ex9multiply: "Kalikan dengan 100:",
    ex9check: "Cek:",
    ex9ans: <>Didapat <strong>29 potongan tali</strong> dan <strong>tidak ada sisa</strong> (habis terbagi)</>,

    sumTitle: "➗ RANGKUMAN LENGKAP",
    sumSubtitle: "Pembagian Bentuk Desimal — Kelas 7",
    sumSec1Label: "Aturan Pembagian Desimal",
    sumCards: [
      { label: "Kalikan keduanya agar pembagi jadi bilangan bulat", desc: "4,8 ÷ 0,12 → kalikan ×100 → 480 ÷ 12 = 40. Selalu kalikan pembagi dan yang dibagi dengan 10ⁿ yang sama!", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
      { label: "Jumlah desimal menentukan pengali", desc: "Pembagi 0,12 punya 2 desimal → kalikan ×100. Pembagi 0,5 punya 1 desimal → kalikan ×10.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
      { label: "Pembagian dengan 10, 100, 1000", desc: "Geser koma ke kiri! 56,4 ÷ 10 = 5,64. 56,4 ÷ 100 = 0,564. 56,4 ÷ 1000 = 0,0564", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
      { label: "Hasilnya bisa pecahan tak berulang atau berulang", desc: "1 ÷ 3 = 0,333... (berulang). 1 ÷ 4 = 0,25 (berhenti). Kenali keduanya!", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
    ],
    sumSec2Label: "Tips & Trik Jitu",
    sumTips: [
      { icon: "🎯", tip: "Jadikan pembagi bilangan bulat SELALU!", detail: "Aturan emas pembagian desimal: buat pembagi jadi bilangan bulat dengan kalikan ×10ⁿ. Setelah itu, hitung biasa.", color: "bg-green-900/30 border-green-500/30" },
      { icon: "⬅️", tip: "÷10ⁿ = geser koma ke kiri n langkah", detail: "123,4 ÷ 100 = 1,234. Hanya perlu menggeser koma — tidak perlu menghitung panjang!", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "✅", tip: "Verifikasi dengan perkalian balik", detail: "Jika 4,8 ÷ 0,12 = 40, cek: 40 × 0,12 = 4,8 ✓. Sangat mudah untuk mengecek jawaban!", color: "bg-emerald-900/30 border-emerald-500/30" },
      { icon: "🎲", tip: "Estimasi kewajaran hasil", detail: "4,8 ÷ 0,12 ≈ 5 ÷ 0,1 = 50. Hasil 40 dekat dari estimasi 50 → wajar! Jika dapat 4 atau 400, ada yang salah.", color: "bg-cyan-900/30 border-cyan-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Pembagian desimal memiliki <strong className="text-green-300">satu strategi utama: ubah pembagi menjadi bilangan bulat</strong> dengan mengalikan keduanya dengan 10ⁿ. Setelah pembagi menjadi bilangan bulat, lakukan pembagian biasa. Dan untuk pembagian dengan 10ⁿ, cukup <strong className="text-yellow-300">geser koma ke kiri</strong> — tidak perlu menghitung!</>,
    tags: ["Kalikan ×10ⁿ dulu", "Pembagi jadi bulat", "÷10ⁿ = geser kiri", "Verifikasi ×balik", "Estimasi kewajaran"],
    nextLabel: "🚀 Lanjut ke Pembulatan Bilangan Desimal!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "DECIMAL DIVISION",
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

    sec1Title: "Decimal Division by 10, 100, 1000",
    sec1Summary: <>Dividing a decimal number by <strong>10, 100, or 1000</strong> is the reverse of multiplication! Simply <strong>shift the decimal point to the left</strong> by the number of zeros in the divisor. Divide by 10? Shift 1 place left. By 100? Shift 2 places. By 1000? Shift 3 places. Super easy!</>,
    sec1FormulaTitle: "Decimal Point Shift Rule:",
    div10: <>Shift decimal <strong className="text-purple-300">1 place</strong> to the left</>,
    div100: <>Shift decimal <strong className="text-purple-300">2 places</strong> to the left</>,
    div1000: <>Shift decimal <strong className="text-purple-300">3 places</strong> to the left</>,
    sec1Tips: [
      "Count the number of zeros in the divisor (10, 100, 1000)",
      "If there are not enough digits before the decimal point, add zeros at the front",
      <>Remember: division = shift decimal to the <strong>LEFT</strong> (opposite of multiplication)</>,
    ],
    ex1Q: <>Calculate <InlineMath math="234,5 \div 10" /></>,
    ex1s1desc: "The divisor is 10 (has 1 zero)",
    ex1s2: "Shift the decimal point 1 place to the left",
    ex2Q: <>Calculate <InlineMath math="3456,78 \div 1000" /></>,
    ex2s1desc: "The divisor is 1000 (has 3 zeros)",
    ex2s2: "Shift the decimal point 3 places to the left",
    ex3Q: <>Calculate <InlineMath math="3456,78 \div 100.000" /></>,
    ex3s1desc: "The divisor is 100,000 (has 5 zeros)",
    ex3s2: "Note that 3456.78 has only 4 digits before the decimal point",
    ex3s2desc: <>We need to add 1 zero at the front: <InlineMath math="03456,78" /></>,
    ex3s3: "Shift the decimal point 5 places to the left",

    sec2Title: "Decimal Divided by a Decimal",
    sec2Summary: <>Dividing a decimal by another decimal requires a special trick: <strong>make the divisor a whole number first!</strong> How? Multiply both the dividend and divisor by the same number (10, 100, or 1000) until the divisor becomes a whole number. Then divide as usual!</>,
    sec2FormulaTitle: "Decimal Division Strategy:",
    sec2FormulaNote: <>where <InlineMath math="n" /> is 10, 100, or 1000 to make the divisor a whole number</>,
    sec2IllusTitle: "Concept Illustration:",
    sec2Tips: [
      "Focus on the divisor — count how many decimal places it has",
      "Multiply both the dividend and divisor by the same power of 10",
      "Once the divisor is a whole number, divide as usual",
    ],
    illus1desc1: "Divisor 0.7 has 1 decimal place",
    illus1desc2: "Multiply both by 10",
    illus2desc1: "Divisor 0.012 has 3 decimal places",
    illus2desc2: "Multiply both by 1000",

    ex4Q: <>Calculate <InlineMath math="14,245 \div 0,7" /></>,
    ex4s1: "Convert to a fraction",
    ex4s2: "Multiply both numerator and denominator by 10",
    ex4s3: "Perform the division",
    ex5Q: <>Calculate <InlineMath math="1,03248 \div 0,012" /></>,
    ex5s1: "Convert to a fraction",
    ex5s2: "The divisor has 3 decimal places — multiply by 1000",
    ex5s3: "Perform the division",
    ex6Q: <>Calculate <InlineMath math="0,4563 \div 0,0015" /></>,
    ex6s1: "Convert to a fraction",
    ex6s2: "The divisor has 4 decimal places — multiply by 10,000",
    ex6s3: "Perform the division",

    sec3Title: "Real-Life Applications",
    sec3Summary: <>Decimal division is not just classroom theory! You will encounter it often in real life — for example when <strong>calculating unit prices</strong>, <strong>dividing food</strong>, or <strong>finding average speed</strong>. Let's practise with practical examples!</>,
    sec3UsageTitle: "Everyday Examples:",
    usage1: "Unit price",
    usage1desc: "$15,750 ÷ 2.5 kg",
    usage2: "Fuel consumption",
    usage2desc: "125.5 km ÷ 8.5 litres",
    usage3: "Length division",
    usage3desc: "18.6 m ÷ 1.2 sections",
    sec3Tips: [
      "Read word problems carefully — identify the dividend and the divisor",
      "Pay attention to units in the problem (currency, kg, metres, litres)",
      "Use the technique of making the divisor a whole number to simplify",
    ],
    ex7Q: "Andi buys 2.5 kg of sugar for $37,500. What is the price of sugar per kilogram?",
    ex7given1: "Total price = $37,500",
    ex7given2: "Weight of sugar = 2.5 kg",
    ex7find: "Price per kilogram",
    ex7pricePerKg: "Price per kg = ",
    ex7multiply: "Multiply by 10:",
    ex7ans: <>The price of sugar per kilogram is <strong>$15,000</strong></>,

    ex8Q: "A car travels 187.5 km using 12.5 litres of petrol. How many kilometres can the car travel per litre of petrol?",
    ex8given1: "Distance travelled = 187.5 km",
    ex8given2: "Petrol used = 12.5 litres",
    ex8find: "Distance per litre of petrol",
    ex8distPerLitre: "Distance per litre = ",
    ex8multiply: "Multiply by 10:",
    ex8calc: "Calculate:",
    ex8ans: <>The car can travel <strong>15 km per litre of petrol</strong></>,

    ex9Q: "A rope 24.36 metres long is to be cut into pieces. Each piece is 0.84 metres long. How many pieces can be cut and how much rope is left over?",
    ex9given1: "Rope length = 24.36 metres",
    ex9given2: "Length of each piece = 0.84 metres",
    ex9find: "Number of pieces and remaining rope",
    ex9numPieces: "Number of pieces = ",
    ex9multiply: "Multiply by 100:",
    ex9check: "Check:",
    ex9ans: <>We get <strong>29 pieces of rope</strong> with <strong>no remainder</strong> (exactly divisible)</>,

    sumTitle: "➗ COMPLETE SUMMARY",
    sumSubtitle: "Decimal Division — Grade 7",
    sumSec1Label: "Rules for Decimal Division",
    sumCards: [
      { label: "Multiply both so the divisor becomes a whole number", desc: "4.8 ÷ 0.12 → multiply ×100 → 480 ÷ 12 = 40. Always multiply both by the same 10ⁿ!", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
      { label: "Number of decimal places determines the multiplier", desc: "Divisor 0.12 has 2 decimal places → multiply ×100. Divisor 0.5 has 1 decimal place → multiply ×10.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
      { label: "Division by 10, 100, 1000", desc: "Shift the decimal left! 56.4 ÷ 10 = 5.64. 56.4 ÷ 100 = 0.564. 56.4 ÷ 1000 = 0.0564", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
      { label: "Result can be terminating or repeating", desc: "1 ÷ 3 = 0.333... (repeating). 1 ÷ 4 = 0.25 (terminating). Recognise both!", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
    ],
    sumSec2Label: "Tips & Tricks",
    sumTips: [
      { icon: "🎯", tip: "ALWAYS make the divisor a whole number!", detail: "The golden rule of decimal division: make the divisor a whole number by multiplying ×10ⁿ. Then divide as usual.", color: "bg-green-900/30 border-green-500/30" },
      { icon: "⬅️", tip: "÷10ⁿ = shift decimal left n steps", detail: "123.4 ÷ 100 = 1.234. Just shift the decimal — no lengthy calculation needed!", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "✅", tip: "Verify with reverse multiplication", detail: "If 4.8 ÷ 0.12 = 40, check: 40 × 0.12 = 4.8 ✓. Very easy to check your answer!", color: "bg-emerald-900/30 border-emerald-500/30" },
      { icon: "🎲", tip: "Estimate reasonableness of result", detail: "4.8 ÷ 0.12 ≈ 5 ÷ 0.1 = 50. Result 40 is close to estimate 50 → reasonable! If you get 4 or 400, something is wrong.", color: "bg-cyan-900/30 border-cyan-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Decimal division has <strong className="text-green-300">one main strategy: make the divisor a whole number</strong> by multiplying both by 10ⁿ. Once the divisor is a whole number, divide as usual. For division by 10ⁿ, simply <strong className="text-yellow-300">shift the decimal point to the left</strong> — no calculation needed!</>,
    tags: ["Multiply ×10ⁿ first", "Make divisor whole", "÷10ⁿ = shift left", "Verify ×reverse", "Estimate reasonableness"],
    nextLabel: "🚀 Continue to Decimal Rounding!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    pageTitle: "小数の割り算",
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

    sec1Title: "小数を10・100・1000で割る",
    sec1Summary: <>小数を<strong>10、100、1000</strong>で割ることは掛け算の逆です！割る数のゼロの個数だけ<strong>小数点を左にずらせば</strong>OKです。10で割るなら1つ左へ。100なら2つ。1000なら3つ。とても簡単です！</>,
    sec1FormulaTitle: "小数点移動のルール：",
    div10: <>小数点を<strong className="text-purple-300">1つ</strong>左にずらす</>,
    div100: <>小数点を<strong className="text-purple-300">2つ</strong>左にずらす</>,
    div1000: <>小数点を<strong className="text-purple-300">3つ</strong>左にずらす</>,
    sec1Tips: [
      "割る数（10、100、1000）のゼロの個数を数える",
      "小数点の前の桁が足りない場合は、前に0を追加する",
      <>注意：割り算 = 小数点を<strong>左に</strong>ずらす（掛け算の逆）</>,
    ],
    ex1Q: <>計算せよ <InlineMath math="234,5 \div 10" /></>,
    ex1s1desc: "除数は10（ゼロが1つ）",
    ex1s2: "小数点を1つ左にずらす",
    ex2Q: <>計算せよ <InlineMath math="3456,78 \div 1000" /></>,
    ex2s1desc: "除数は1000（ゼロが3つ）",
    ex2s2: "小数点を3つ左にずらす",
    ex3Q: <>計算せよ <InlineMath math="3456,78 \div 100.000" /></>,
    ex3s1desc: "除数は100,000（ゼロが5つ）",
    ex3s2: "3456.78の小数点前には4桁しかないことに注意する",
    ex3s2desc: <>前に0を1つ追加する必要があります：<InlineMath math="03456,78" /></>,
    ex3s3: "小数点を5つ左にずらす",

    sec2Title: "小数同士の割り算",
    sec2Summary: <>小数を別の小数で割るには特別なコツが必要です：<strong>まず除数を整数にしましょう！</strong>方法は？被除数と除数の両方に同じ数（10、100、1000）を掛けて除数を整数にします。その後、普通に割り算します！</>,
    sec2FormulaTitle: "小数の割り算の戦略：",
    sec2FormulaNote: <><InlineMath math="n" /> は除数を整数にするための10、100、または1000</>,
    sec2IllusTitle: "概念の図解：",
    sec2Tips: [
      "除数に注目 — 小数点以下の桁数を数える",
      "被除数と除数の両方に同じ10の累乗を掛ける",
      "除数が整数になったら普通に割り算する",
    ],
    illus1desc1: "除数0.7は小数1桁",
    illus1desc2: "両方を10倍する",
    illus2desc1: "除数0.012は小数3桁",
    illus2desc2: "両方を1000倍する",

    ex4Q: <>計算せよ <InlineMath math="14,245 \div 0,7" /></>,
    ex4s1: "分数の形に変換する",
    ex4s2: "分子と分母の両方を10倍する",
    ex4s3: "割り算を実行する",
    ex5Q: <>計算せよ <InlineMath math="1,03248 \div 0,012" /></>,
    ex5s1: "分数の形に変換する",
    ex5s2: "除数は小数3桁 — 1000を掛ける",
    ex5s3: "割り算を実行する",
    ex6Q: <>計算せよ <InlineMath math="0,4563 \div 0,0015" /></>,
    ex6s1: "分数の形に変換する",
    ex6s2: "除数は小数4桁 — 10,000を掛ける",
    ex6s3: "割り算を実行する",

    sec3Title: "日常生活への応用",
    sec3Summary: <>小数の割り算は授業の理論だけではありません！日常生活でよく使われます。例えば<strong>単価の計算</strong>、<strong>食べ物を分ける</strong>、<strong>平均速度の計算</strong>などです。実用的な例題で練習しましょう！</>,
    sec3UsageTitle: "日常の使用例：",
    usage1: "単価",
    usage1desc: "$15,750 ÷ 2.5 kg",
    usage2: "燃費",
    usage2desc: "125.5 km ÷ 8.5リットル",
    usage3: "長さの分割",
    usage3desc: "18.6 m ÷ 1.2区間",
    sec3Tips: [
      "文章題をよく読んで、被除数と除数を見分ける",
      "問題の単位に注意する（通貨、kg、メートル、リットル）",
      "除数を整数にするテクニックを使って簡単にする",
    ],
    ex7Q: "Andiは砂糖2.5 kgを$37,500で買いました。砂糖1 kgあたりの価格はいくらですか？",
    ex7given1: "合計金額 = $37,500",
    ex7given2: "砂糖の重量 = 2.5 kg",
    ex7find: "1 kgあたりの価格",
    ex7pricePerKg: "1 kgの価格 = ",
    ex7multiply: "10倍する：",
    ex7ans: <>砂糖1 kgの価格は<strong>$15,000</strong>です。</>,

    ex8Q: "車が12.5リットルのガソリンで187.5 kmを走りました。1リットルあたり何km走れますか？",
    ex8given1: "走行距離 = 187.5 km",
    ex8given2: "使用ガソリン = 12.5リットル",
    ex8find: "1リットルあたりの走行距離",
    ex8distPerLitre: "1リットルあたりの距離 = ",
    ex8multiply: "10倍する：",
    ex8calc: "計算する：",
    ex8ans: <>車は<strong>1リットルで15 km</strong>走れます。</>,

    ex9Q: "長さ24.36メートルのロープをいくつかに切ります。各部分の長さは0.84メートルです。何本切れますか？また残りは何メートルですか？",
    ex9given1: "ロープの長さ = 24.36メートル",
    ex9given2: "各部分の長さ = 0.84メートル",
    ex9find: "切れる本数と残り",
    ex9numPieces: "切れる本数 = ",
    ex9multiply: "100倍する：",
    ex9check: "確認：",
    ex9ans: <><strong>29本のロープ</strong>が切れて<strong>余りはなし</strong>（ちょうど割り切れる）。</>,

    sumTitle: "➗ 完全まとめ",
    sumSubtitle: "小数の割り算 — 中学1年",
    sumSec1Label: "小数の割り算のルール",
    sumCards: [
      { label: "両方に掛けて除数を整数にする", desc: "4.8 ÷ 0.12 → ×100倍 → 480 ÷ 12 = 40。被除数と除数の両方に同じ10ⁿを掛ける！", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
      { label: "小数の桁数が乗数を決める", desc: "除数0.12は小数2桁 → ×100倍。除数0.5は小数1桁 → ×10倍。", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
      { label: "10・100・1000で割る場合", desc: "小数点を左にずらす！56.4 ÷ 10 = 5.64。56.4 ÷ 100 = 0.564。56.4 ÷ 1000 = 0.0564", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
      { label: "結果は有限小数か循環小数になる", desc: "1 ÷ 3 = 0.333...（循環）。1 ÷ 4 = 0.25（有限）。両方を覚えよう！", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
    ],
    sumSec2Label: "ヒントとコツ",
    sumTips: [
      { icon: "🎯", tip: "除数を必ず整数にすること！", detail: "小数の割り算の黄金則：×10ⁿで除数を整数にする。その後、普通に計算する。", color: "bg-green-900/30 border-green-500/30" },
      { icon: "⬅️", tip: "÷10ⁿ = 小数点をn歩左にずらす", detail: "123.4 ÷ 100 = 1.234。小数点をずらすだけ — 長い計算は不要！", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "✅", tip: "逆の掛け算で確認する", detail: "4.8 ÷ 0.12 = 40なら、40 × 0.12 = 4.8 ✓で確認できる。とても簡単！", color: "bg-emerald-900/30 border-emerald-500/30" },
      { icon: "🎲", tip: "結果の妥当性を見積もる", detail: "4.8 ÷ 0.12 ≈ 5 ÷ 0.1 = 50。結果40は見積もり50に近い → 妥当！4や400なら間違いあり。", color: "bg-cyan-900/30 border-cyan-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>小数の割り算には<strong className="text-green-300">一つの主な戦略があります：10ⁿを掛けて除数を整数にする</strong>。除数が整数になったら普通に割り算します。10ⁿで割る場合は<strong className="text-yellow-300">小数点を左にずらすだけ</strong>で計算不要です！</>,
    tags: ["まず×10ⁿ倍", "除数を整数に", "÷10ⁿ=左にずらす", "逆算で確認", "妥当性の見積もり"],
    nextLabel: "🚀 小数の四捨五入へ進む！",
    backBtn: "有理数に戻る",
  },
};

const PembagianBentukDesimalPage = () => {
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

        {/* Section 1: ÷10/100/1000 */}
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
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">:10</span>
                  <span className="text-white/80 text-sm">{t.div10}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">:100</span>
                  <span className="text-white/80 text-sm">{t.div100}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">:1000</span>
                  <span className="text-white/80 text-sm">{t.div1000}</span>
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
                  <p><strong>{t.step(1)}</strong> {t.badgeEasy === "MUDAH" ? "Identifikasi pembagi" : t.badgeEasy === "EASY" ? "Identify the divisor" : "除数を確認する"}</p>
                  <div className="pl-4">{t.ex1s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                  <div className="pl-4"><InlineMath math="234,5 \rightarrow 23,45" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="234,5 \div 10 = 23,45" /></p>
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
                  <p><strong>{t.step(1)}</strong> {t.badgeEasy === "MUDAH" ? "Identifikasi pembagi" : t.badgeEasy === "EASY" ? "Identify the divisor" : "除数を確認する"}</p>
                  <div className="pl-4">{t.ex2s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                  <div className="pl-4"><InlineMath math="3456,78 \rightarrow 3,45678" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="3456,78 \div 1000 = 3,45678" /></p>
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
                  <p><strong>{t.step(1)}</strong> {t.badgeEasy === "MUDAH" ? "Identifikasi pembagi" : t.badgeEasy === "EASY" ? "Identify the divisor" : "除数を確認する"}</p>
                  <div className="pl-4">{t.ex3s1desc}</div>
                  <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                  <div className="pl-4">{t.ex3s2desc}</div>
                  <p><strong>{t.step(3)}</strong> {t.ex3s3}</p>
                  <div className="pl-4"><InlineMath math="03456,78 \rightarrow 0,0345678" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="3456,78 \div 100.000 = 0,0345678" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: ÷decimal */}
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
                <p className="text-white/90 text-sm mb-2">{language === "id" ? "Ubah bentuk pembagian menjadi pecahan:" : language === "en" ? "Convert to a fraction:" : "分数の形に変換する："}</p>
                <BlockMath math="\frac{a}{b} = \frac{a \times n}{b \times n}" />
                <p className="text-white/70 text-xs mt-2">{t.sec2FormulaNote}</p>
              </div>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="text-slate-300 font-semibold text-sm mb-3">{t.sec2IllusTitle}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-black/30 rounded p-3">
                  <p className="text-cyan-300 mb-2">{language === "id" ? "Contoh:" : language === "en" ? "Example:" : "例："} <InlineMath math="14,245 \div 0,7" /></p>
                  <p className="text-white/70">{t.illus1desc1}</p>
                  <p className="text-white/70">{t.illus1desc2}</p>
                  <p className="text-green-300 mt-2"><InlineMath math="= \frac{142,45}{7}" /></p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <p className="text-cyan-300 mb-2">{language === "id" ? "Contoh:" : language === "en" ? "Example:" : "例："} <InlineMath math="1,03248 \div 0,012" /></p>
                  <p className="text-white/70">{t.illus2desc1}</p>
                  <p className="text-white/70">{t.illus2desc2}</p>
                  <p className="text-green-300 mt-2"><InlineMath math="= \frac{1032,48}{12}" /></p>
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
                  <div className="pl-4"><InlineMath math="14,245 \div 0,7 = \frac{14,245}{0,7}" /></div>
                  <p><strong>{t.step(2)}</strong> {t.ex4s2}</p>
                  <div className="pl-4"><InlineMath math="= \frac{14,245 \times 10}{0,7 \times 10} = \frac{142,45}{7}" /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex4s3}</p>
                  <div className="pl-4"><InlineMath math="142,45 \div 7 = 20,35" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="14,245 \div 0,7 = 20,35" /></p>
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
                  <div className="pl-4"><InlineMath math="1,03248 \div 0,012 = \frac{1,03248}{0,012}" /></div>
                  <p><strong>{t.step(2)}</strong> {t.ex5s2}</p>
                  <div className="pl-4"><InlineMath math="= \frac{1,03248 \times 1000}{0,012 \times 1000} = \frac{1032,48}{12}" /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex5s3}</p>
                  <div className="pl-4"><InlineMath math="1032,48 \div 12 = 86,04" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="1,03248 \div 0,012 = 86,04" /></p>
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
                  <div className="pl-4"><InlineMath math="0,4563 \div 0,0015 = \frac{0,4563}{0,0015}" /></div>
                  <p><strong>{t.step(2)}</strong> {t.ex6s2}</p>
                  <div className="pl-4"><InlineMath math="= \frac{0,4563 \times 10000}{0,0015 \times 10000} = \frac{4563}{15}" /></div>
                  <p><strong>{t.step(3)}</strong> {t.ex6s3}</p>
                  <div className="pl-4"><InlineMath math="4563 \div 15 = 304,2" /></div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> <InlineMath math="0,4563 \div 0,0015 = 304,2" /></p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-black/30 rounded p-3 text-center">
                  <span className="text-2xl mb-2 block">🛒</span>
                  <p className="text-cyan-300">{t.usage1}</p>
                  <p className="text-white/60 text-xs">{t.usage1desc}</p>
                </div>
                <div className="bg-black/30 rounded p-3 text-center">
                  <span className="text-2xl mb-2 block">⛽</span>
                  <p className="text-cyan-300">{t.usage2}</p>
                  <p className="text-white/60 text-xs">{t.usage2desc}</p>
                </div>
                <div className="bg-black/30 rounded p-3 text-center">
                  <span className="text-2xl mb-2 block">📏</span>
                  <p className="text-cyan-300">{t.usage3}</p>
                  <p className="text-white/60 text-xs">{t.usage3desc}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {t.tipsLabel}
              </h4>
              <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                {t.sec3Tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
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
                  <p><strong>{t.given}</strong></p>
                  <div className="pl-4"><p>{t.ex7given1}</p><p>{t.ex7given2}</p></div>
                  <p><strong>{t.find}</strong> {t.ex7find}</p>
                  <p><strong>{t.solve}</strong></p>
                  <div className="pl-4">
                    <p>{t.ex7pricePerKg}<InlineMath math="\frac{37500}{2,5}" /></p>
                    <p className="mt-1">{t.ex7multiply} <InlineMath math="= \frac{375000}{25} = 15000" /></p>
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
                  <p><strong>{t.given}</strong></p>
                  <div className="pl-4"><p>{t.ex8given1}</p><p>{t.ex8given2}</p></div>
                  <p><strong>{t.find}</strong> {t.ex8find}</p>
                  <p><strong>{t.solve}</strong></p>
                  <div className="pl-4">
                    <p>{t.ex8distPerLitre}<InlineMath math="\frac{187,5}{12,5}" /></p>
                    <p className="mt-1">{t.ex8multiply} <InlineMath math="= \frac{1875}{125}" /></p>
                    <p className="mt-1">{t.ex8calc} <InlineMath math="= 15" /></p>
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
                  <p><strong>{t.given}</strong></p>
                  <div className="pl-4"><p>{t.ex9given1}</p><p>{t.ex9given2}</p></div>
                  <p><strong>{t.find}</strong> {t.ex9find}</p>
                  <p><strong>{t.solve}</strong></p>
                  <div className="pl-4">
                    <p>{t.ex9numPieces}<InlineMath math="\frac{24,36}{0,84}" /></p>
                    <p className="mt-1">{t.ex9multiply} <InlineMath math="= \frac{2436}{84} = 29" /></p>
                    <p className="mt-1">{t.ex9check} <InlineMath math="29 \times 0,84 = 24,36" /> {language === "id" ? "meter" : language === "en" ? "metres" : "メートル"}</p>
                  </div>
                  <p className="text-cyan-300 mt-2"><strong>{t.answer}</strong> {t.ex9ans}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-green-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/30 border border-green-500 flex items-center justify-center text-[10px]">1</span>
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
            <div className="bg-gradient-to-br from-green-500/20 via-teal-500/15 to-emerald-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌿</div>
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

export default PembagianBentukDesimalPage;
