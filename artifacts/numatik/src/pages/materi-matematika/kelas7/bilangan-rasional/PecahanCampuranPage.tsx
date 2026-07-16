import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, Layers, Percent, ArrowRightLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PECAHAN CAMPURAN DAN PERSEN",
    pageSubtitle: "Kelas 7 - Bilangan Rasional - Materi Matematika",
    summaryLabel: "Ringkasan Intisari",
    examplesLabel: "Contoh Soal dan Pembahasan",
    step: (n: number) => `Langkah ${n}:`,
    discuss: "PEMBAHASAN:",
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    ex: (n: number) => `Contoh ${n}`,

    sec1Title: "Pecahan Campuran",
    sec1Summary: <><strong className="text-primary">Pecahan campuran</strong> adalah gabungan antara bilangan bulat dengan pecahan murni. Bayangkan kamu punya 2 pizza utuh ditambah setengah pizza lagi - itulah bentuk pecahan campuran <InlineMath math="2\frac{1}{2}" />!</>,
    sec1Desc: <>Pecahan campuran muncul ketika pembilang suatu pecahan <strong className="text-cyan-300">lebih besar</strong> dari penyebutnya. Misalnya <InlineMath math="\frac{7}{3}" /> dapat diubah menjadi pecahan campuran.</>,
    sec1PartA: <><InlineMath math="a" /> = <strong>Bilangan bulat</strong></>,
    sec1PartB: <><InlineMath math="\frac{b}{c}" /> = <strong>Pecahan murni</strong> (pembilang lebih kecil dari penyebut)</>,
    sec1VisualTitle: "Contoh Visual:",
    sec1Visual: <>Pecahan <InlineMath math="\frac{7}{3}" /> artinya 7 bagian dari keseluruhan yang masing-masing dibagi 3. Karena <InlineMath math="7 \div 3 = 2" /> sisa 1, maka <InlineMath math="\frac{7}{3} = 2\frac{1}{3}" /> (2 bulat dan <InlineMath math="\frac{1}{3}" /> sisa).</>,
    sec1StepsTitle: "Cara Mengubah Pecahan Biasa ke Pecahan Campuran:",
    sec1Step1: "Bagi pembilang dengan penyebut",
    sec1Step2: "Hasil bagi menjadi bilangan bulat",
    sec1Step3: "Sisa pembagian menjadi pembilang baru, penyebut tetap",
    sec1Formula: "\\frac{a}{b} = \\text{hasil bagi} + \\frac{\\text{sisa}}{b}",
    sec1Tip: <><strong>Tips:</strong> Pecahan campuran lebih mudah dibayangkan dalam kehidupan sehari-hari karena menggambarkan "berapa banyak utuh" ditambah "berapa sisa bagiannya".</>,

    ex1Q: <>Nyatakan <InlineMath math="\frac{8}{3}" /> sebagai pecahan campuran!</>,
    ex1s1: "Bagi pembilang dengan penyebut",
    ex1katex1: "8 \\div 3 = 2 \\text{ sisa } 2",
    ex1s2: "Tulis dalam bentuk pecahan campuran",
    ex1ans: <>Jadi, <InlineMath math="\frac{8}{3} = 2\frac{2}{3}" /></>,

    ex2Q: <>Nyatakan <InlineMath math="\frac{17}{5}" /> sebagai pecahan campuran, lalu nyatakan kembali dalam bentuk pecahan biasa untuk memverifikasi!</>,
    ex2s1: "Ubah ke pecahan campuran",
    ex2katex1: "17 \\div 5 = 3 \\text{ sisa } 2",
    ex2s2: "Verifikasi dengan mengubah kembali ke pecahan biasa",
    ex2ans: <>Jadi, <InlineMath math="\frac{17}{5} = 3\frac{2}{5}" /> (terverifikasi!)</>,

    ex3Q: <>Dua per lima dari penduduk kota A adalah laki-laki. Jika total penduduk kota tersebut adalah 8 juta jiwa, berapa banyak penduduk laki-laki di kota tersebut?</>,
    ex3s1: "Identifikasi pecahan dan nilai total",
    ex3s1a: <>Pecahan laki-laki = <InlineMath math="\frac{2}{5}" /></>,
    ex3s1b: "Total penduduk = 8.000.000 jiwa",
    ex3s2: "Hitung banyak penduduk laki-laki",
    ex3katex1: "\\text{Penduduk laki-laki} = \\frac{2}{5} \\times 8.000.000",
    ex3katex2: "= \\frac{2 \\times 8.000.000}{5}",
    ex3katex3: "= \\frac{16.000.000}{5}",
    ex3katex4: "= 3.200.000 \\text{ jiwa}",
    ex3ans: "Jadi, penduduk laki-laki di kota A adalah 3.200.000 jiwa (3,2 juta jiwa).",

    sec2Title: "Konversi Pecahan Campuran dan Pecahan Biasa",
    sec2Summary: "Pecahan campuran dan pecahan biasa dapat saling dikonversi. Kemampuan ini sangat berguna saat melakukan operasi hitung seperti penjumlahan, pengurangan, perkalian, dan pembagian pecahan.",
    sec2ImpTitle: "Pecahan Biasa ke Campuran:",
    sec2ImpNote: "Hasil bagi = bulat, sisa = pembilang baru",
    sec2MixTitle: "Pecahan Campuran ke Biasa:",
    sec2MixNote: "Penyebut x bulat + pembilang",
    sec2Tip: <><strong>Tips Mudah Mengingat:</strong> Untuk mengubah pecahan campuran ke biasa, bayangkan "penyebut naik ke atas mengalikan bilangan bulat, lalu hasilnya ditambah pembilang".</>,

    ex4Q: <>Nyatakan <InlineMath math="2\frac{5}{6}" /> sebagai pecahan biasa!</>,
    ex4s1: "Gunakan rumus konversi",
    ex4s2: "Hitung pembilang baru",
    ex4ans: <>Jadi, <InlineMath math="2\frac{5}{6} = \frac{17}{6}" /></>,

    ex5Q: <>Nyatakan <InlineMath math="\frac{126}{12}" /> sebagai pecahan campuran dalam bentuk paling sederhana!</>,
    ex5s1: "Bagi pembilang dengan penyebut",
    ex5katex1: "126 \\div 12 = 10 \\text{ sisa } 6",
    ex5s2: "Tulis dalam bentuk pecahan campuran",
    ex5s3: "Sederhanakan pecahan (FPB 6 dan 12 adalah 6)",
    ex5ans: <>Jadi, <InlineMath math="\frac{126}{12} = 10\frac{1}{2}" /></>,

    ex6Q: <>Emas 18 karat mengandung <InlineMath math="\frac{18}{24}" /> emas murni. Jika kamu memiliki 48 gram emas 18 karat, berapa gram emas murni yang terkandung di dalamnya?</>,
    ex6s1: "Sederhanakan pecahan kadar emas",
    ex6s2: "Hitung kandungan emas murni",
    ex6katex1: "\\text{Emas murni} = \\frac{3}{4} \\times 48 \\text{ gram}",
    ex6katex2: "= \\frac{3 \\times 48}{4} = \\frac{144}{4} = 36 \\text{ gram}",
    ex6ans: "Jadi, dalam 48 gram emas 18 karat terkandung 36 gram emas murni.",

    sec3Title: "Persen",
    sec3Summary: <><strong className="text-primary">Persen (%)</strong> adalah cara menyatakan pecahan dengan penyebut 100. Kata "persen" berasal dari bahasa Latin "per centum" yang berarti "per seratus". Persen sangat umum digunakan dalam kehidupan sehari-hari seperti diskon, pajak, dan statistik.</>,
    sec3Example: <>Contoh: <InlineMath math="25\% = \frac{25}{100} = \frac{1}{4}" /></>,
    sec3FormulaTitle: "Rumus Mengubah Pecahan ke Persen:",
    sec3FormulaDesc: "Artinya, kalikan pecahan dengan 100 lalu tambahkan simbol %.",
    sec3TableTitle: "Hubungan Persen - Pecahan - Desimal:",
    sec3ColPct: "Persen",
    sec3ColFrac: "Pecahan",
    sec3ColDec: "Desimal",
    sec3DecRow1: "0,25",
    sec3DecRow2: "0,5",
    sec3DecRow3: "0,75",
    sec3DecRow4: "1",
    sec3Tip: <><strong>Tips Praktis:</strong> Untuk menghitung persen dari suatu nilai, kalikan nilai tersebut dengan persen dalam bentuk desimal. Contoh: 20% dari 150 = 0,20 x 150 = 30.</>,

    ex7Q: <>Nyatakan <InlineMath math="\frac{7}{20}" /> dalam bentuk persen!</>,
    ex7s1: "Kalikan pecahan dengan 100%",
    ex7s2: "Hitung hasilnya",
    ex7ans: <>Jadi, <InlineMath math="\frac{7}{20} = 35\%" /></>,

    ex8Q: <>Nyatakan <InlineMath math="\frac{2}{15}" /> dalam bentuk persen!</>,
    ex8s1: "Kalikan pecahan dengan 100%",
    ex8s2: "Sederhanakan (bagi dengan 5)",
    ex8s3: "Ubah ke pecahan campuran",
    ex8ans: <>Jadi, <InlineMath math="\frac{2}{15} = 13\frac{1}{3}\%" /></>,

    ex9Q: <>Dalam sebuah kelas terdapat 18 siswa putra dan 22 siswa putri. Pada suatu hari, 3 orang tidak masuk karena sakit. Berapa persen siswa yang tidak masuk sekolah?</>,
    ex9s1: "Hitung total siswa",
    ex9s2: "Nyatakan dalam pecahan",
    ex9s3: "Ubah ke persen",
    ex9katex1: "\\text{Total siswa} = 18 + 22 = 40 \\text{ siswa}",
    ex9katex2: "\\text{Siswa tidak masuk} = \\frac{3}{40}",
    ex9katex3: "\\frac{3}{40} \\times 100\\% = \\frac{300}{40}\\% = 7{,}5\\%",
    ex9ans: "Jadi, persentase siswa yang tidak masuk adalah 7,5%.",

    bonusTitle: "Aplikasi Persen dalam Kehidupan Sehari-hari:",
    bonus1: <><strong>Diskon:</strong> "Diskon 30%" artinya harga dikurangi <InlineMath math="\frac{30}{100}" /> dari harga asli.</>,
    bonus2: <><strong>Pajak:</strong> PPN 11% berarti membayar tambahan <InlineMath math="\frac{11}{100}" /> dari harga barang.</>,
    bonus3: <><strong>Bunga:</strong> Bunga tabungan 5% per tahun berarti tabungan bertambah <InlineMath math="\frac{5}{100}" /> dari saldo.</>,

    sumTitle: "🔀 RANGKUMAN LENGKAP",
    sumSubtitle: "Pecahan Campuran, Persen & Konversi — Kelas 7",
    sumSec1Label: "Pecahan Campuran & Persen — Konsep Utama",
    sumCards: [
      { label: "Pecahan Campuran: a b/c", desc: "Terdiri dari bagian bulat (a) dan bagian pecahan (b/c). Contoh: 2¾ = 2 + 3/4. Selalu ubah ke biasa untuk operasi!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      { label: "Campuran → Biasa: (a×c + b)/c", desc: "2¾ = (2×4 + 3)/4 = 11/4. Kalikan bagian bulat dengan penyebut, tambahkan pembilang, letakkan di atas penyebut.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "Biasa → Campuran: bagi dan sisa", desc: "11 ÷ 4 = 2 sisa 3 → 2¾. Hasil bagi = bagian bulat, sisa = pembilang, penyebut tetap.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Persen (%) = per seratus", desc: "75% = 75/100 = 3/4 = 0,75. Konversi: % → desimal (÷100), % → pecahan (/100 lalu sederhanakan).", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "Menghitung Persen dari Suatu Nilai", desc: "p% dari n = (p/100) × n. Contoh: 25% dari 80 = (25/100) × 80 = 20.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
    ],
    sumSec2Label: "Tips & Trik Jitu",
    sumTips: [
      { icon: "🔄", tip: "Selalu ubah campuran ke biasa sebelum operasi", detail: "2¾ + 1½ → ubah ke 11/4 + 3/2 terlebih dahulu, baru jumlahkan. Jangan operasikan bagian bulat dan pecahan secara terpisah!", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "💯", tip: "Hafal konversi persen-pecahan umum", detail: "10%=1/10 | 20%=1/5 | 25%=1/4 | 33%≈1/3 | 50%=1/2 | 75%=3/4 | 100%=1. Hafal ini untuk perhitungan cepat!", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "🎯", tip: "Persen dari n: kalikan n dengan persen/100", detail: "30% dari 150 = 150 × 30/100 = 150 × 3/10 = 45. Atau cepat: 10% dari 150 = 15, jadi 30% = 15 × 3 = 45!", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "📊", tip: "Diskon, pajak, bunga semuanya pakai persen", detail: "Diskon 20% dari Rp 150.000 = 150.000 × 20/100 = Rp 30.000. Harga bayar = 150.000 − 30.000 = Rp 120.000.", color: "bg-cyan-900/30 border-cyan-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Pecahan campuran, desimal, dan persen adalah <strong className="text-violet-300">tiga wajah dari satu konsep yang sama</strong>. Ketiganya bisa saling dikonversi! Kuasai cara mengubah antar bentuk ini, dan kamu akan siap menghadapi soal matematika maupun situasi kehidupan nyata — dari menghitung diskon belanja hingga memahami statistik dan grafik!</>,
    tags: ["Campuran ↔ Biasa", "% = /100", "Sederhanakan FPB", "p% dari n = n×p/100", "Diskon & Pajak"],
    doneLabel: "🏆 Selesai! Kamu sudah menguasai semua bentuk pecahan!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "MIXED NUMBERS AND PERCENTAGES",
    pageSubtitle: "Grade 7 - Rational Numbers - Mathematics",
    summaryLabel: "Key Summary",
    examplesLabel: "Examples and Solutions",
    step: (n: number) => `Step ${n}:`,
    discuss: "SOLUTION:",
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    ex: (n: number) => `Example ${n}`,

    sec1Title: "Mixed Numbers",
    sec1Summary: <>A <strong className="text-primary">mixed number</strong> is a combination of a whole number and a proper fraction. Imagine you have 2 whole pizzas plus half a pizza — that's the mixed number <InlineMath math="2\frac{1}{2}" />!</>,
    sec1Desc: <>Mixed numbers appear when a fraction's numerator is <strong className="text-cyan-300">greater than</strong> its denominator. For example, <InlineMath math="\frac{7}{3}" /> can be expressed as a mixed number.</>,
    sec1PartA: <><InlineMath math="a" /> = <strong>Whole number part</strong></>,
    sec1PartB: <><InlineMath math="\frac{b}{c}" /> = <strong>Proper fraction part</strong> (numerator less than denominator)</>,
    sec1VisualTitle: "Visual Example:",
    sec1Visual: <>The fraction <InlineMath math="\frac{7}{3}" /> means 7 parts where each whole is divided into 3. Since <InlineMath math="7 \div 3 = 2" /> remainder 1, we get <InlineMath math="\frac{7}{3} = 2\frac{1}{3}" /> (2 wholes and <InlineMath math="\frac{1}{3}" /> left over).</>,
    sec1StepsTitle: "How to Convert an Improper Fraction to a Mixed Number:",
    sec1Step1: "Divide the numerator by the denominator",
    sec1Step2: "The quotient becomes the whole number part",
    sec1Step3: "The remainder becomes the new numerator; the denominator stays the same",
    sec1Formula: "\\frac{a}{b} = \\text{quotient} + \\frac{\\text{remainder}}{b}",
    sec1Tip: <><strong>Tip:</strong> Mixed numbers are easier to visualise in everyday life because they show "how many whole ones" plus "how much is left over".</>,

    ex1Q: <>Express <InlineMath math="\frac{8}{3}" /> as a mixed number!</>,
    ex1s1: "Divide the numerator by the denominator",
    ex1katex1: "8 \\div 3 = 2 \\text{ remainder } 2",
    ex1s2: "Write in mixed number form",
    ex1ans: <>So, <InlineMath math="\frac{8}{3} = 2\frac{2}{3}" /></>,

    ex2Q: <>Express <InlineMath math="\frac{17}{5}" /> as a mixed number, then convert it back to an improper fraction to verify!</>,
    ex2s1: "Convert to a mixed number",
    ex2katex1: "17 \\div 5 = 3 \\text{ remainder } 2",
    ex2s2: "Verify by converting back to an improper fraction",
    ex2ans: <>So, <InlineMath math="\frac{17}{5} = 3\frac{2}{5}" /> (verified!)</>,

    ex3Q: <>Two-fifths of the population of City A are male. If the total population is 8 million residents, how many male residents are there?</>,
    ex3s1: "Identify the fraction and total value",
    ex3s1a: <>Male fraction = <InlineMath math="\frac{2}{5}" /></>,
    ex3s1b: "Total population = 8,000,000 residents",
    ex3s2: "Calculate the number of male residents",
    ex3katex1: "\\text{Male residents} = \\frac{2}{5} \\times 8{,}000{,}000",
    ex3katex2: "= \\frac{2 \\times 8{,}000{,}000}{5}",
    ex3katex3: "= \\frac{16{,}000{,}000}{5}",
    ex3katex4: "= 3{,}200{,}000 \\text{ residents}",
    ex3ans: "So, there are 3,200,000 male residents in City A (3.2 million people).",

    sec2Title: "Converting Mixed Numbers and Improper Fractions",
    sec2Summary: "Mixed numbers and improper fractions can be converted into each other. This skill is very useful when performing operations such as addition, subtraction, multiplication, and division of fractions.",
    sec2ImpTitle: "Improper Fraction to Mixed Number:",
    sec2ImpNote: "Quotient = whole part, remainder = new numerator",
    sec2MixTitle: "Mixed Number to Improper Fraction:",
    sec2MixNote: "Denominator × whole + numerator",
    sec2Tip: <><strong>Easy Memory Tip:</strong> To convert a mixed number to an improper fraction, think "the denominator goes up to multiply the whole number, then add the numerator".</>,

    ex4Q: <>Express <InlineMath math="2\frac{5}{6}" /> as an improper fraction!</>,
    ex4s1: "Apply the conversion formula",
    ex4s2: "Calculate the new numerator",
    ex4ans: <>So, <InlineMath math="2\frac{5}{6} = \frac{17}{6}" /></>,

    ex5Q: <>Express <InlineMath math="\frac{126}{12}" /> as a mixed number in its simplest form!</>,
    ex5s1: "Divide the numerator by the denominator",
    ex5katex1: "126 \\div 12 = 10 \\text{ remainder } 6",
    ex5s2: "Write in mixed number form",
    ex5s3: "Simplify the fraction (GCD of 6 and 12 is 6)",
    ex5ans: <>So, <InlineMath math="\frac{126}{12} = 10\frac{1}{2}" /></>,

    ex6Q: <>18-karat gold contains <InlineMath math="\frac{18}{24}" /> pure gold. If you have 48 grams of 18-karat gold, how many grams of pure gold does it contain?</>,
    ex6s1: "Simplify the gold purity fraction",
    ex6s2: "Calculate the pure gold content",
    ex6katex1: "\\text{Pure gold} = \\frac{3}{4} \\times 48 \\text{ g}",
    ex6katex2: "= \\frac{3 \\times 48}{4} = \\frac{144}{4} = 36 \\text{ g}",
    ex6ans: "So, 48 grams of 18-karat gold contains 36 grams of pure gold.",

    sec3Title: "Percentages",
    sec3Summary: <><strong className="text-primary">Percent (%)</strong> is a way to express a fraction with a denominator of 100. The word "percent" comes from the Latin "per centum" meaning "per hundred". Percentages are widely used in everyday life — discounts, tax, and statistics.</>,
    sec3Example: <>Example: <InlineMath math="25\% = \frac{25}{100} = \frac{1}{4}" /></>,
    sec3FormulaTitle: "Formula for Converting a Fraction to a Percentage:",
    sec3FormulaDesc: "Multiply the fraction by 100 and add the % symbol.",
    sec3TableTitle: "Relationship between Percent – Fraction – Decimal:",
    sec3ColPct: "Percent",
    sec3ColFrac: "Fraction",
    sec3ColDec: "Decimal",
    sec3DecRow1: "0.25",
    sec3DecRow2: "0.5",
    sec3DecRow3: "0.75",
    sec3DecRow4: "1",
    sec3Tip: <><strong>Practical Tip:</strong> To find a percentage of a value, multiply that value by the percentage expressed as a decimal. Example: 20% of 150 = 0.20 × 150 = 30.</>,

    ex7Q: <>Express <InlineMath math="\frac{7}{20}" /> as a percentage!</>,
    ex7s1: "Multiply the fraction by 100%",
    ex7s2: "Calculate the result",
    ex7ans: <>So, <InlineMath math="\frac{7}{20} = 35\%" /></>,

    ex8Q: <>Express <InlineMath math="\frac{2}{15}" /> as a percentage!</>,
    ex8s1: "Multiply the fraction by 100%",
    ex8s2: "Simplify (divide by 5)",
    ex8s3: "Convert to a mixed number",
    ex8ans: <>So, <InlineMath math="\frac{2}{15} = 13\frac{1}{3}\%" /></>,

    ex9Q: <>A class has 18 male students and 22 female students. One day, 3 students were absent due to illness. What percentage of students were absent?</>,
    ex9s1: "Calculate the total number of students",
    ex9s2: "Express as a fraction",
    ex9s3: "Convert to a percentage",
    ex9katex1: "\\text{Total students} = 18 + 22 = 40 \\text{ students}",
    ex9katex2: "\\text{Absent students} = \\frac{3}{40}",
    ex9katex3: "\\frac{3}{40} \\times 100\\% = \\frac{300}{40}\\% = 7.5\\%",
    ex9ans: "So, 7.5% of students were absent.",

    bonusTitle: "Everyday Applications of Percentages:",
    bonus1: <><strong>Discount:</strong> "30% off" means the price is reduced by <InlineMath math="\frac{30}{100}" /> of the original price.</>,
    bonus2: <><strong>Tax:</strong> 11% VAT means paying an extra <InlineMath math="\frac{11}{100}" /> of the item's price.</>,
    bonus3: <><strong>Interest:</strong> 5% annual savings interest means the balance grows by <InlineMath math="\frac{5}{100}" /> per year.</>,

    sumTitle: "🔀 COMPLETE SUMMARY",
    sumSubtitle: "Mixed Numbers, Percentages & Conversion — Grade 7",
    sumSec1Label: "Mixed Numbers & Percentages — Key Concepts",
    sumCards: [
      { label: "Mixed Number: a b/c", desc: "Consists of a whole part (a) and a fraction part (b/c). Example: 2¾ = 2 + 3/4. Always convert to improper before operations!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      { label: "Mixed → Improper: (a×c + b)/c", desc: "2¾ = (2×4 + 3)/4 = 11/4. Multiply the whole part by the denominator, add the numerator, put over the denominator.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "Improper → Mixed: divide and remainder", desc: "11 ÷ 4 = 2 remainder 3 → 2¾. Quotient = whole part, remainder = numerator, denominator stays.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Percent (%) = per hundred", desc: "75% = 75/100 = 3/4 = 0.75. Convert: % → decimal (÷100), % → fraction (/100 then simplify).", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "Calculating a Percentage of a Value", desc: "p% of n = (p/100) × n. Example: 25% of 80 = (25/100) × 80 = 20.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
    ],
    sumSec2Label: "Tips & Tricks",
    sumTips: [
      { icon: "🔄", tip: "Always convert mixed to improper before operations", detail: "2¾ + 1½ → convert to 11/4 + 3/2 first, then add. Never operate on the whole-number and fraction parts separately!", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "💯", tip: "Memorise common percent–fraction conversions", detail: "10%=1/10 | 20%=1/5 | 25%=1/4 | 33%≈1/3 | 50%=1/2 | 75%=3/4 | 100%=1. Know these for quick calculations!", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "🎯", tip: "Percent of n: multiply n by percent/100", detail: "30% of 150 = 150 × 30/100 = 45. Quick way: 10% of 150 = 15, so 30% = 15 × 3 = 45!", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "📊", tip: "Discounts, tax, interest all use percentages", detail: "20% off $150 = $150 × 20/100 = $30. Price to pay = $150 − $30 = $120.", color: "bg-cyan-900/30 border-cyan-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Mixed numbers, decimals, and percentages are <strong className="text-violet-300">three faces of the same concept</strong>. They can all be converted into each other! Master how to move between these forms, and you'll be ready for math problems and real-life situations — from calculating shopping discounts to understanding statistics and charts!</>,
    tags: ["Mixed ↔ Improper", "% = /100", "Simplify with GCD", "p% of n = n×p/100", "Discount & Tax"],
    doneLabel: "🏆 Done! You've mastered all fraction forms!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    pageTitle: "帯分数とパーセント",
    pageSubtitle: "中学1年 - 有理数 - 数学",
    summaryLabel: "要点まとめ",
    examplesLabel: "例題と解説",
    step: (n: number) => `手順 ${n}：`,
    discuss: "解説：",
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    ex: (n: number) => `例題 ${n}`,

    sec1Title: "帯分数",
    sec1Summary: <><strong className="text-primary">帯分数</strong>とは、整数と真分数の組み合わせです。ピザを2枚まるごと＋半分持っているとイメージしてください。それが帯分数 <InlineMath math="2\frac{1}{2}" /> です！</>,
    sec1Desc: <>分子が分母より<strong className="text-cyan-300">大きい</strong>分数（仮分数）は帯分数に変換できます。例えば <InlineMath math="\frac{7}{3}" /> は帯分数で表せます。</>,
    sec1PartA: <><InlineMath math="a" /> = <strong>整数部分</strong></>,
    sec1PartB: <><InlineMath math="\frac{b}{c}" /> = <strong>真分数部分</strong>（分子が分母より小さい）</>,
    sec1VisualTitle: "視覚的な例：",
    sec1Visual: <>分数 <InlineMath math="\frac{7}{3}" /> は、全体を3等分したものが7個分という意味です。<InlineMath math="7 \div 3 = 2" /> 余り1なので、<InlineMath math="\frac{7}{3} = 2\frac{1}{3}" />（整数2つと<InlineMath math="\frac{1}{3}" />の余り）になります。</>,
    sec1StepsTitle: "仮分数を帯分数に変換する方法：",
    sec1Step1: "分子を分母で割る",
    sec1Step2: "商が整数部分になる",
    sec1Step3: "余りが新しい分子になり、分母はそのまま",
    sec1Formula: "\\frac{a}{b} = \\text{商} + \\frac{\\text{余り}}{b}",
    sec1Tip: <><strong>ヒント：</strong>帯分数は「何個まるごと」＋「余りの分」という形なので、日常生活でイメージしやすいです。</>,

    ex1Q: <><InlineMath math="\frac{8}{3}" /> を帯分数で表せ！</>,
    ex1s1: "分子を分母で割る",
    ex1katex1: "8 \\div 3 = 2 \\text{ 余り } 2",
    ex1s2: "帯分数の形で書く",
    ex1ans: <>よって、<InlineMath math="\frac{8}{3} = 2\frac{2}{3}" /></>,

    ex2Q: <><InlineMath math="\frac{17}{5}" /> を帯分数で表し、仮分数に戻して確認せよ！</>,
    ex2s1: "帯分数に変換する",
    ex2katex1: "17 \\div 5 = 3 \\text{ 余り } 2",
    ex2s2: "仮分数に戻して確認する",
    ex2ans: <>よって、<InlineMath math="\frac{17}{5} = 3\frac{2}{5}" />（確認済み！）</>,

    ex3Q: <>都市Aの人口の5分の2は男性です。都市の総人口が800万人のとき、男性住民は何人ですか？</>,
    ex3s1: "分数と合計値を確認する",
    ex3s1a: <>男性の割合 = <InlineMath math="\frac{2}{5}" /></>,
    ex3s1b: "総人口 = 8,000,000人",
    ex3s2: "男性住民数を計算する",
    ex3katex1: "\\text{男性住民数} = \\frac{2}{5} \\times 8{,}000{,}000",
    ex3katex2: "= \\frac{2 \\times 8{,}000{,}000}{5}",
    ex3katex3: "= \\frac{16{,}000{,}000}{5}",
    ex3katex4: "= 3{,}200{,}000 \\text{ 人}",
    ex3ans: "よって、都市Aの男性住民は3,200,000人（320万人）です。",

    sec2Title: "帯分数と仮分数の変換",
    sec2Summary: "帯分数と仮分数は相互に変換できます。この能力は分数の足し算・引き算・掛け算・割り算を行う際に非常に役立ちます。",
    sec2ImpTitle: "仮分数 → 帯分数：",
    sec2ImpNote: "商 = 整数部分、余り = 新しい分子",
    sec2MixTitle: "帯分数 → 仮分数：",
    sec2MixNote: "分母 × 整数 ＋ 分子",
    sec2Tip: <><strong>覚え方のコツ：</strong>帯分数を仮分数に変換するとき、「分母が上に上がって整数と掛け算し、その結果に分子を足す」とイメージしましょう。</>,

    ex4Q: <><InlineMath math="2\frac{5}{6}" /> を仮分数で表せ！</>,
    ex4s1: "変換公式を使う",
    ex4s2: "新しい分子を計算する",
    ex4ans: <>よって、<InlineMath math="2\frac{5}{6} = \frac{17}{6}" /></>,

    ex5Q: <><InlineMath math="\frac{126}{12}" /> を最も簡単な形の帯分数で表せ！</>,
    ex5s1: "分子を分母で割る",
    ex5katex1: "126 \\div 12 = 10 \\text{ 余り } 6",
    ex5s2: "帯分数の形で書く",
    ex5s3: "分数を約分する（6と12の最大公約数は6）",
    ex5ans: <>よって、<InlineMath math="\frac{126}{12} = 10\frac{1}{2}" /></>,

    ex6Q: <>18カラットの金には <InlineMath math="\frac{18}{24}" /> の純金が含まれています。18カラットの金を48グラム持っている場合、純金は何グラム含まれていますか？</>,
    ex6s1: "金の純度を表す分数を約分する",
    ex6s2: "純金の量を計算する",
    ex6katex1: "\\text{純金} = \\frac{3}{4} \\times 48 \\text{ g}",
    ex6katex2: "= \\frac{3 \\times 48}{4} = \\frac{144}{4} = 36 \\text{ g}",
    ex6ans: "よって、18カラットの金48グラムには純金が36グラム含まれています。",

    sec3Title: "パーセント",
    sec3Summary: <><strong className="text-primary">パーセント（%）</strong>とは、分母を100とした分数の表し方です。"percent"はラテン語の"per centum"（100あたり）に由来します。パーセントは割引、税金、統計など日常生活で広く使われています。</>,
    sec3Example: <>例：<InlineMath math="25\% = \frac{25}{100} = \frac{1}{4}" /></>,
    sec3FormulaTitle: "分数をパーセントに変換する公式：",
    sec3FormulaDesc: "分数に100を掛けて、%の記号をつけます。",
    sec3TableTitle: "パーセント・分数・小数の関係：",
    sec3ColPct: "パーセント",
    sec3ColFrac: "分数",
    sec3ColDec: "小数",
    sec3DecRow1: "0.25",
    sec3DecRow2: "0.5",
    sec3DecRow3: "0.75",
    sec3DecRow4: "1",
    sec3Tip: <><strong>実践的なヒント：</strong>ある値のパーセントを求めるには、その値にパーセントを小数で表したものを掛けます。例：150の20% = 0.20 × 150 = 30。</>,

    ex7Q: <><InlineMath math="\frac{7}{20}" /> をパーセントで表せ！</>,
    ex7s1: "分数に100%を掛ける",
    ex7s2: "結果を計算する",
    ex7ans: <>よって、<InlineMath math="\frac{7}{20} = 35\%" /></>,

    ex8Q: <><InlineMath math="\frac{2}{15}" /> をパーセントで表せ！</>,
    ex8s1: "分数に100%を掛ける",
    ex8s2: "簡略化する（5で割る）",
    ex8s3: "帯分数に変換する",
    ex8ans: <>よって、<InlineMath math="\frac{2}{15} = 13\frac{1}{3}\%" /></>,

    ex9Q: <>あるクラスに男子18人と女子22人がいます。ある日、3人が病気で欠席しました。欠席した生徒の割合は何パーセントですか？</>,
    ex9s1: "生徒の合計数を求める",
    ex9s2: "分数で表す",
    ex9s3: "パーセントに変換する",
    ex9katex1: "\\text{生徒数合計} = 18 + 22 = 40 \\text{ 人}",
    ex9katex2: "\\text{欠席生徒} = \\frac{3}{40}",
    ex9katex3: "\\frac{3}{40} \\times 100\\% = \\frac{300}{40}\\% = 7.5\\%",
    ex9ans: "よって、欠席した生徒の割合は7.5%です。",

    bonusTitle: "パーセントの日常生活への応用：",
    bonus1: <><strong>割引：</strong>「30%オフ」とは、元の価格から <InlineMath math="\frac{30}{100}" /> 分引かれることです。</>,
    bonus2: <><strong>税金：</strong>消費税11%とは、商品の価格の <InlineMath math="\frac{11}{100}" /> が追加されることです。</>,
    bonus3: <><strong>利息：</strong>年利5%とは、残高が毎年 <InlineMath math="\frac{5}{100}" /> ずつ増えることです。</>,

    sumTitle: "🔀 完全まとめ",
    sumSubtitle: "帯分数・パーセント・変換 — 中学1年",
    sumSec1Label: "帯分数とパーセント — 主要概念",
    sumCards: [
      { label: "帯分数：a b/c", desc: "整数部分(a)と分数部分(b/c)からなる。例：2¾ = 2 + 3/4。計算するときは必ず仮分数に変換！", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
      { label: "帯分数 → 仮分数：(a×c + b)/c", desc: "2¾ = (2×4 + 3)/4 = 11/4。整数部分に分母を掛け、分子を足し、分母の上に置く。", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "仮分数 → 帯分数：割り算と余り", desc: "11 ÷ 4 = 2 余り 3 → 2¾。商 = 整数部分、余り = 分子、分母はそのまま。", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "パーセント(%) = 100分の〇", desc: "75% = 75/100 = 3/4 = 0.75。変換：% → 小数(÷100)、% → 分数(/100で約分)。", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "ある値のパーセントを求める", desc: "n の p% = (p/100) × n。例：80の25% = (25/100) × 80 = 20。", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
    ],
    sumSec2Label: "ヒントとコツ",
    sumTips: [
      { icon: "🔄", tip: "計算前に帯分数を必ず仮分数に変換する", detail: "2¾ + 1½ → まず11/4 + 3/2に変換してから計算する。整数部分と分数部分を別々に計算しないこと！", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "💯", tip: "よく使うパーセント・分数の変換を覚える", detail: "10%=1/10 | 20%=1/5 | 25%=1/4 | 33%≈1/3 | 50%=1/2 | 75%=3/4 | 100%=1。素早い計算のために暗記しよう！", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "🎯", tip: "n のパーセント：n にパーセント/100を掛ける", detail: "150の30% = 150 × 30/100 = 45。簡単な方法：150の10% = 15、30% = 15 × 3 = 45！", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "📊", tip: "割引・税金・利息はすべてパーセントを使う", detail: "$150の20%オフ = $150 × 20/100 = $30引き。支払額 = $150 − $30 = $120。", color: "bg-cyan-900/30 border-cyan-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>帯分数・小数・パーセントは<strong className="text-violet-300">同じ概念の3つの顔</strong>です。すべて相互に変換できます！これらの形式を使い分ける方法をマスターすれば、数学の問題だけでなく、ショッピングの割引計算から統計やグラフの理解まで、実生活でも活躍できます！</>,
    tags: ["帯分数↔仮分数", "% = /100", "GCDで約分", "n の p% = n×p/100", "割引・税金"],
    doneLabel: "🏆 完了！分数のすべての形式をマスターしました！",
    backBtn: "有理数に戻る",
  },
};

const PecahanCampuranPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(["pecahan-campuran", "konversi", "persen"]);
  const t = translations[language];

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  void toggleSection;
  void expandedSections;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.pageSubtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section 1: Pecahan Campuran */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.sec1Title}</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t.summaryLabel}
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec1Summary}</p>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec1Desc}</p>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-bold text-primary">
                      <InlineMath math="a\frac{b}{c}" />
                    </div>
                    <div className="flex flex-col gap-1 text-sm font-body">
                      <p className="text-cyan-300">{t.sec1PartA}</p>
                      <p className="text-yellow-300">{t.sec1PartB}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{t.sec1VisualTitle}</strong> {t.sec1Visual}
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.sec1StepsTitle}</p>
                  <div className="space-y-2 font-body text-sm text-white/70">
                    <p><strong className="text-purple-300">{t.step(1)}</strong> {t.sec1Step1}</p>
                    <p><strong className="text-purple-300">{t.step(2)}</strong> {t.sec1Step2}</p>
                    <p><strong className="text-purple-300">{t.step(3)}</strong> {t.sec1Step3}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mt-3 text-center">
                    <BlockMath math={t.sec1Formula} />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec1Tip}</p>
                </div>

                {/* Examples Section 1 */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesLabel}
                  </p>

                  {/* Example 1 - Easy */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeEasy}</span>
                      <span className="font-body font-semibold text-white">{t.ex(1)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex1Q}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex1s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex1katex1} />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{8}{3} = 2\frac{2}{3}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex1ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 2 - Medium */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMedium}</span>
                      <span className="font-body font-semibold text-white">{t.ex(2)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex2Q}</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex2s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex2katex1} />
                          <BlockMath math="\frac{17}{5} = 3\frac{2}{5}" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="3\frac{2}{5} = \frac{(5 \times 3) + 2}{5} = \frac{15 + 2}{5} = \frac{17}{5}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex2ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 3 - Hard */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeHard}</span>
                      <span className="font-body font-semibold text-white">{t.ex(3)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex3Q}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex3s1}</p>
                        <p className="pl-4">{t.ex3s1a}</p>
                        <p className="pl-4">{t.ex3s1b}</p>
                        <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex3katex1} />
                          <BlockMath math={t.ex3katex2} />
                          <BlockMath math={t.ex3katex3} />
                          <BlockMath math={t.ex3katex4} />
                        </div>
                        <p className="text-primary font-semibold">{t.ex3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Konversi */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">{t.sec2Title}</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t.summaryLabel}
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec2Summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.sec2ImpTitle}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\frac{a}{b} \rightarrow \text{÷}" />
                    </div>
                    <p className="font-body text-xs text-white/60 mt-2">{t.sec2ImpNote}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.sec2MixTitle}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="a\frac{b}{c} = \frac{(c \times a) + b}{c}" />
                    </div>
                    <p className="font-body text-xs text-white/60 mt-2">{t.sec2MixNote}</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec2Tip}</p>
                </div>

                {/* Examples Section 2 */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesLabel}
                  </p>

                  {/* Example 4 - Easy */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeEasy}</span>
                      <span className="font-body font-semibold text-white">{t.ex(1)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex4Q}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex4s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="2\frac{5}{6} = \frac{(6 \times 2) + 5}{6}" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex4s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{12 + 5}{6} = \frac{17}{6}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex4ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 5 - Medium */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMedium}</span>
                      <span className="font-body font-semibold text-white">{t.ex(2)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex5Q}</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex5s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex5katex1} />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex5s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{126}{12} = 10\frac{6}{12}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex5s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="10\frac{6}{12} = 10\frac{6 \div 6}{12 \div 6} = 10\frac{1}{2}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex5ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 6 - Hard */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeHard}</span>
                      <span className="font-body font-semibold text-white">{t.ex(3)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex6Q}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex6s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{18}{24} = \frac{18 \div 6}{24 \div 6} = \frac{3}{4}" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex6s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex6katex1} />
                          <BlockMath math={t.ex6katex2} />
                        </div>
                        <p className="text-primary font-semibold">{t.ex6ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Persen */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Percent className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{t.sec3Title}</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t.summaryLabel}
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec3Summary}</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl font-bold text-primary">
                      <InlineMath math="x\% = \frac{x}{100}" />
                    </div>
                    <p className="text-white/60 text-sm font-body mt-2">{t.sec3Example}</p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.sec3FormulaTitle}</p>
                  <div className="bg-slate-900/50 rounded p-4 text-center">
                    <BlockMath math="\frac{a}{b} = \frac{a}{b} \times 100\%" />
                  </div>
                  <p className="font-body text-sm text-white/70 mt-3 leading-relaxed">{t.sec3FormulaDesc}</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.sec3TableTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body">
                      <thead>
                        <tr className="text-white/60 border-b border-border">
                          <th className="py-2 px-3 text-center">{t.sec3ColPct}</th>
                          <th className="py-2 px-3 text-center">{t.sec3ColFrac}</th>
                          <th className="py-2 px-3 text-center">{t.sec3ColDec}</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-3 text-center text-primary">25%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{1}{4}" /></td>
                          <td className="py-2 px-3 text-center">{t.sec3DecRow1}</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-3 text-center text-primary">50%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{1}{2}" /></td>
                          <td className="py-2 px-3 text-center">{t.sec3DecRow2}</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-3 text-center text-primary">75%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{3}{4}" /></td>
                          <td className="py-2 px-3 text-center">{t.sec3DecRow3}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-center text-primary">100%</td>
                          <td className="py-2 px-3 text-center"><InlineMath math="\frac{4}{4} = 1" /></td>
                          <td className="py-2 px-3 text-center">{t.sec3DecRow4}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec3Tip}</p>
                </div>

                {/* Examples Section 3 */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesLabel}
                  </p>

                  {/* Example 7 - Easy */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeEasy}</span>
                      <span className="font-body font-semibold text-white">{t.ex(1)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex7Q}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex7s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{7}{20} \times 100\% = \frac{7 \times 100}{20}\%" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex7s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{700}{20}\% = 35\%" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex7ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 8 - Medium */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMedium}</span>
                      <span className="font-body font-semibold text-white">{t.ex(2)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex8Q}</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex8s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{15} \times 100\% = \frac{200}{15}\%" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex8s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{200 \div 5}{15 \div 5}\% = \frac{40}{3}\%" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex8s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= 13\frac{1}{3}\%" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex8ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 9 - Hard */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeHard}</span>
                      <span className="font-body font-semibold text-white">{t.ex(3)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex9Q}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex9s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex9katex1} />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex9s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex9katex2} />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex9s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex9katex3} />
                        </div>
                        <p className="text-primary font-semibold">{t.ex9ans}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bonus */}
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
                  <p className="font-body text-sm font-semibold text-accent mb-3">{t.bonusTitle}</p>
                  <ul className="space-y-2 font-body text-sm text-white/80">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">1.</span>
                      <span>{t.bonus1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">2.</span>
                      <span>{t.bonus2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">3.</span>
                      <span>{t.bonus3}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500 flex items-center justify-center text-[10px]">1</span>
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

              <div className="bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-blue-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌌</div>
                <p className="font-display text-base font-bold text-white">{t.conclusionTitle}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.conclusionBody}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {t.tags.map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{t.doneLabel}</p>
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
    </div>
  );
};

export default PecahanCampuranPage;
