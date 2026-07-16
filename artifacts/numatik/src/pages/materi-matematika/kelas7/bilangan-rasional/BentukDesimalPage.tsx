import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calculator, RefreshCw } from "lucide-react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";

const translations = {
  id: {
    backLink: "Kembali ke Bilangan Rasional",
    pageTitle: "Bentuk Desimal",
    pageSubtitle: "Memahami bilangan desimal dan konversinya dengan pecahan",
    sec1Title: "1. Memahami Bilangan Desimal",
    summaryLabel: "Ringkasan Intisari",
    sec1SummaryBody: "Bilangan desimal adalah cara penulisan bilangan menggunakan tanda koma untuk memisahkan bagian bulat dan bagian pecahan.",
    sec1PlaceTitle: "Nilai Tempat dalam Bilangan Desimal:",
    sec1PlaceExample: "Contoh: 2345,678",
    sec1Place: [
      "2 = ribuan (2000)", "3 = ratusan (300)", "4 = puluhan (40)", "5 = satuan (5)",
      "6 = persepuluhan (6/10)", "7 = perseratusan (7/100)", "8 = perseribu (8/1000)",
    ],
    badgeEasy: "Mudah", badgeMedium: "Sedang", badgeHard: "Sulit",
    discussLabel: "Pembahasan:",
    ex1Q: "Tentukan nilai tempat angka 7 pada bilangan 3,478!",
    ex1Body: "3 = satuan, 4 = persepuluhan, 7 = perseratusan, 8 = perseribu",
    ex1Ans: "Jadi, angka 7 berada di tempat perseratusan.",
    ex2Q: "Nyatakan 2345,678 dalam bentuk penjumlahan nilai tempat!",
    ex2KaTeX: "2345{,}678 = 2000 + 300 + 40 + 5 + 0{,}6 + 0{,}07 + 0{,}008",
    ex2Ans: "Setiap digit dikalikan dengan nilai tempatnya.",
    ex3Q: "Nyatakan 4,67 sebagai pecahan campuran!",
    ex3Body: "4,67 memiliki 2 angka di belakang koma (perseratusan)",
    ex3KaTeX: "4{,}67 = 4\\frac{67}{100}",
    ex3Ans: "Jadi, 4,67 sama dengan 4 67/100",
    sec2Title: "2. Mengubah Pecahan ke Desimal",
    sec2SummaryBody: "Ada dua cara: (1) mengubah penyebut menjadi 10, 100, atau 1000, dan (2) membagi pembilang dengan penyebut.",
    tipLabel: "Tips:",
    sec2TipBody: "Jika penyebut sulit diubah menjadi 10/100/1000, gunakan cara pembagian!",
    ex4Q: "Ubah 3/5 menjadi bentuk desimal!",
    ex4KaTeX: "\\frac{3}{5} = \\frac{3 \\times 2}{5 \\times 2} = \\frac{6}{10} = 0{,}6",
    ex4Ans: "Jadi, 3/5 = 0,6",
    ex5Q: "Ubah 4/125 menjadi bentuk desimal!",
    ex5KaTeX: "\\frac{4}{125} = \\frac{4 \\times 8}{125 \\times 8} = \\frac{32}{1000} = 0{,}032",
    ex5Ans: "Jadi, 4/125 = 0,032",
    ex6Q: "Ubah 7/11 menjadi desimal (4 tempat desimal)!",
    ex6Body: "Penyebut 11 tidak bisa diubah ke 10/100/1000, gunakan pembagian:",
    ex6KaTeX: "7 \\div 11 = 0{,}6363...",
    ex6Ans: "Jadi, 7/11 = 0,6363 (desimal berulang)",
    sec3Title: "3. Mengubah Desimal ke Pecahan",
    sec3SummaryBody: "Hitung jumlah angka di belakang koma untuk menentukan penyebutnya.",
    sec3RuleTitle: "Aturan Penyebut:",
    sec3Rules: ["1 angka = penyebut 10", "2 angka = penyebut 100", "3 angka = penyebut 1000"],
    ex7Q: "Ubah 0,6 menjadi pecahan!",
    ex7KaTeX: "0{,}6 = \\frac{6}{10} = \\frac{3}{5}",
    ex7Ans: "Jadi, 0,6 = 3/5",
    ex8Q: "Ubah 0,125 menjadi pecahan paling sederhana!",
    ex8KaTeX: "0{,}125 = \\frac{125}{1000} = \\frac{1}{8}",
    ex8Ans: "Jadi, 0,125 = 1/8",
    ex9Q: "Ubah 0,000289 menjadi pecahan!",
    ex9Body: "6 angka di belakang koma, penyebut = 1000000",
    ex9KaTeX: "0{,}000289 = \\frac{289}{1000000}",
    ex9Ans: "Jadi, 0,000289 = 289/1000000",
    sumTitle: "🔢 RANGKUMAN LENGKAP",
    sumSubtitle: "Bentuk Desimal — Kelas 7",
    sumSec1: "Konsep Bentuk Desimal",
    sumCards: [
      { label: "Desimal = Pecahan dengan penyebut 10ⁿ", desc: "0,3 = 3/10 | 0,45 = 45/100 | 0,125 = 125/1000. Hitung angka di belakang koma untuk tahu penyebutnya!", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
      { label: "Konversi Pecahan → Desimal", desc: "Cara 1: bagi pembilang ÷ penyebut. 3/4 = 3÷4 = 0,75. Cara 2: jadikan penyebut 10ⁿ. 3/4 = 75/100 = 0,75", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Konversi Desimal → Pecahan", desc: "Tuliskan angkanya sebagai pembilang dengan penyebut 10ⁿ sesuai jumlah desimal, lalu sederhanakan dengan FPB.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "Desimal berulang dan berhenti", desc: "1/3 = 0,333... (berulang). 1/4 = 0,25 (berhenti). Penyebut hanya faktor 2 dan 5 → desimal berhenti!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
    ],
    sumSec2: "Tips & Trik Jitu",
    sumTips: [
      { icon: "🔑", tip: "Hitung angka di belakang koma → tentukan penyebut", detail: "0,7 punya 1 angka → penyebut 10. 0,75 punya 2 angka → penyebut 100. 0,125 punya 3 angka → penyebut 1000. Sesederhana itu!", color: "bg-sky-900/30 border-sky-500/30" },
      { icon: "⚡", tip: "Pecahan dengan penyebut 2, 4, 5, 8, 10, 25 → desimal berhenti", detail: "1/8 = 0,125 (berhenti). 1/7 = 0,142857... (berulang). Bila penyebut hanya faktor 2 dan 5, desimalnya pasti berhenti!", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "🎯", tip: "Hafal konversi pecahan umum", detail: "1/2=0,5 | 1/4=0,25 | 3/4=0,75 | 1/5=0,2 | 1/8=0,125 | 1/10=0,1. Hafal ini dan konversi jadi super cepat!", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "✅", tip: "Sederhanakan setelah konversi", detail: "0,25 = 25/100 = 1/4 (bagi dengan FPB=25). Selalu cari FPB akhir agar jawabannya dalam bentuk paling sederhana!", color: "bg-violet-900/30 border-violet-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBold: "dua cara berbeda untuk menyatakan hal yang sama",
    conclusionBody: "Bentuk desimal dan pecahan adalah",
    conclusionBody2: ". Kunci konversinya: jumlah angka di belakang koma menentukan penyebut (10, 100, 1000). Hafalkan pecahan-desimal umum, dan kamu akan bisa bergerak bebas antara kedua bentuk ini dengan cepat!",
    tags: ["Desimal = Pecahan /10ⁿ", "Pecahan → Bagi", "Desimal → Penyebut 10ⁿ", "Sederhanakan FPB", "Hafal Konversi Umum"],
    nextLabel: "🚀 Lanjut ke operasi-operasi bentuk desimal!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    backLink: "Back to Rational Numbers",
    pageTitle: "Decimal Form",
    pageSubtitle: "Understanding decimals and their conversion with fractions",
    sec1Title: "1. Understanding Decimal Numbers",
    summaryLabel: "Key Summary",
    sec1SummaryBody: "A decimal number is a way of writing numbers using a decimal point to separate the whole part from the fractional part.",
    sec1PlaceTitle: "Place Values in Decimal Numbers:",
    sec1PlaceExample: "Example: 2345.678",
    sec1Place: [
      "2 = thousands (2000)", "3 = hundreds (300)", "4 = tens (40)", "5 = ones (5)",
      "6 = tenths (6/10)", "7 = hundredths (7/100)", "8 = thousandths (8/1000)",
    ],
    badgeEasy: "Easy", badgeMedium: "Medium", badgeHard: "Hard",
    discussLabel: "Solution:",
    ex1Q: "Determine the place value of digit 7 in the number 3.478!",
    ex1Body: "3 = ones, 4 = tenths, 7 = hundredths, 8 = thousandths",
    ex1Ans: "Therefore, digit 7 is in the hundredths place.",
    ex2Q: "Express 2345.678 as a sum of place values!",
    ex2KaTeX: "2345.678 = 2000 + 300 + 40 + 5 + 0.6 + 0.07 + 0.008",
    ex2Ans: "Each digit is multiplied by its place value.",
    ex3Q: "Express 4.67 as a mixed fraction!",
    ex3Body: "4.67 has 2 digits after the decimal point (hundredths)",
    ex3KaTeX: "4.67 = 4\\frac{67}{100}",
    ex3Ans: "So, 4.67 equals 4 and 67/100",
    sec2Title: "2. Converting Fractions to Decimals",
    sec2SummaryBody: "There are two methods: (1) change the denominator to 10, 100, or 1000, and (2) divide the numerator by the denominator.",
    tipLabel: "Tip:",
    sec2TipBody: "If the denominator cannot easily be changed to 10/100/1000, use division!",
    ex4Q: "Convert 3/5 to decimal form!",
    ex4KaTeX: "\\frac{3}{5} = \\frac{3 \\times 2}{5 \\times 2} = \\frac{6}{10} = 0.6",
    ex4Ans: "So, 3/5 = 0.6",
    ex5Q: "Convert 4/125 to decimal form!",
    ex5KaTeX: "\\frac{4}{125} = \\frac{4 \\times 8}{125 \\times 8} = \\frac{32}{1000} = 0.032",
    ex5Ans: "So, 4/125 = 0.032",
    ex6Q: "Convert 7/11 to decimal form (4 decimal places)!",
    ex6Body: "Denominator 11 cannot be converted to 10/100/1000, use division:",
    ex6KaTeX: "7 \\div 11 = 0.6363...",
    ex6Ans: "So, 7/11 = 0.6363 (repeating decimal)",
    sec3Title: "3. Converting Decimals to Fractions",
    sec3SummaryBody: "Count the number of digits after the decimal point to determine the denominator.",
    sec3RuleTitle: "Denominator Rule:",
    sec3Rules: ["1 digit = denominator 10", "2 digits = denominator 100", "3 digits = denominator 1000"],
    ex7Q: "Convert 0.6 to a fraction!",
    ex7KaTeX: "0.6 = \\frac{6}{10} = \\frac{3}{5}",
    ex7Ans: "So, 0.6 = 3/5",
    ex8Q: "Convert 0.125 to its simplest fraction!",
    ex8KaTeX: "0.125 = \\frac{125}{1000} = \\frac{1}{8}",
    ex8Ans: "So, 0.125 = 1/8",
    ex9Q: "Convert 0.000289 to a fraction!",
    ex9Body: "6 digits after the decimal point, denominator = 1,000,000",
    ex9KaTeX: "0.000289 = \\frac{289}{1000000}",
    ex9Ans: "So, 0.000289 = 289/1,000,000",
    sumTitle: "🔢 COMPLETE SUMMARY",
    sumSubtitle: "Decimal Form — Grade 7",
    sumSec1: "Decimal Concepts",
    sumCards: [
      { label: "Decimal = Fraction with denominator 10ⁿ", desc: "0.3 = 3/10 | 0.45 = 45/100 | 0.125 = 125/1000. Count digits after the decimal point to find the denominator!", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
      { label: "Fraction → Decimal", desc: "Method 1: divide numerator ÷ denominator. 3/4 = 3÷4 = 0.75. Method 2: make denominator 10ⁿ. 3/4 = 75/100 = 0.75", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Decimal → Fraction", desc: "Write the digits as numerator with denominator 10ⁿ matching decimal places, then simplify with GCD.", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "Repeating and terminating decimals", desc: "1/3 = 0.333... (repeating). 1/4 = 0.25 (terminating). If denominator has only factors 2 and 5, decimal terminates!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
    ],
    sumSec2: "Tips & Tricks",
    sumTips: [
      { icon: "🔑", tip: "Count digits after decimal → find denominator", detail: "0.7 has 1 digit → denominator 10. 0.75 has 2 digits → denominator 100. 0.125 has 3 digits → denominator 1000. That simple!", color: "bg-sky-900/30 border-sky-500/30" },
      { icon: "⚡", tip: "Fractions with denominators 2, 4, 5, 8, 10, 25 → terminating decimal", detail: "1/8 = 0.125 (terminates). 1/7 = 0.142857... (repeating). If denominator has only factors of 2 and 5, decimal always terminates!", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "🎯", tip: "Memorise common fraction conversions", detail: "1/2=0.5 | 1/4=0.25 | 3/4=0.75 | 1/5=0.2 | 1/8=0.125 | 1/10=0.1. Memorise these and conversions become super fast!", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "✅", tip: "Simplify after conversion", detail: "0.25 = 25/100 = 1/4 (divide by GCD=25). Always find the final GCD so your answer is in simplest form!", color: "bg-violet-900/30 border-violet-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBold: "two different ways of expressing the same thing",
    conclusionBody: "Decimals and fractions are",
    conclusionBody2: ". The key to conversion: the number of digits after the decimal point determines the denominator (10, 100, 1000). Memorise common fraction-decimal pairs, and you'll move freely between both forms with ease!",
    tags: ["Decimal = Fraction /10ⁿ", "Fraction → Divide", "Decimal → Denominator 10ⁿ", "Simplify with GCD", "Memorise Common Conversions"],
    nextLabel: "🚀 Continue to decimal operations!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    backLink: "有理数に戻る",
    pageTitle: "小数の形",
    pageSubtitle: "小数とその分数との変換を理解する",
    sec1Title: "1. 小数を理解する",
    summaryLabel: "要点まとめ",
    sec1SummaryBody: "小数は、整数部分と小数部分を小数点で区切って数を表す方法です。",
    sec1PlaceTitle: "小数の位の値：",
    sec1PlaceExample: "例：2345.678",
    sec1Place: [
      "2 = 千の位 (2000)", "3 = 百の位 (300)", "4 = 十の位 (40)", "5 = 一の位 (5)",
      "6 = 十分の一の位 (6/10)", "7 = 百分の一の位 (7/100)", "8 = 千分の一の位 (8/1000)",
    ],
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    discussLabel: "解説：",
    ex1Q: "3.478 における数字 7 の位の値を求めよ！",
    ex1Body: "3 = 一の位、4 = 十分の一の位、7 = 百分の一の位、8 = 千分の一の位",
    ex1Ans: "よって、数字 7 は百分の一の位にあります。",
    ex2Q: "2345.678 を位の値の和の形で表せ！",
    ex2KaTeX: "2345.678 = 2000 + 300 + 40 + 5 + 0.6 + 0.07 + 0.008",
    ex2Ans: "各桁はその位の値で掛けられます。",
    ex3Q: "4.67 を帯分数で表せ！",
    ex3Body: "4.67 は小数点以下 2 桁（百分の一の位）",
    ex3KaTeX: "4.67 = 4\\frac{67}{100}",
    ex3Ans: "よって、4.67 = 4 と 67/100",
    sec2Title: "2. 分数を小数に変換する",
    sec2SummaryBody: "2 つの方法があります：(1) 分母を 10、100、1000 にする、(2) 分子を分母で割る。",
    tipLabel: "ヒント：",
    sec2TipBody: "分母を 10/100/1000 に変えにくい場合は割り算を使います！",
    ex4Q: "3/5 を小数に変換せよ！",
    ex4KaTeX: "\\frac{3}{5} = \\frac{3 \\times 2}{5 \\times 2} = \\frac{6}{10} = 0.6",
    ex4Ans: "よって、3/5 = 0.6",
    ex5Q: "4/125 を小数に変換せよ！",
    ex5KaTeX: "\\frac{4}{125} = \\frac{4 \\times 8}{125 \\times 8} = \\frac{32}{1000} = 0.032",
    ex5Ans: "よって、4/125 = 0.032",
    ex6Q: "7/11 を小数に変換せよ（小数第 4 位まで）！",
    ex6Body: "分母 11 は 10/100/1000 に変換できないので割り算を使う：",
    ex6KaTeX: "7 \\div 11 = 0.6363...",
    ex6Ans: "よって、7/11 = 0.6363（循環小数）",
    sec3Title: "3. 小数を分数に変換する",
    sec3SummaryBody: "小数点以下の桁数を数えて分母を決めます。",
    sec3RuleTitle: "分母のルール：",
    sec3Rules: ["1桁 = 分母 10", "2桁 = 分母 100", "3桁 = 分母 1000"],
    ex7Q: "0.6 を分数に変換せよ！",
    ex7KaTeX: "0.6 = \\frac{6}{10} = \\frac{3}{5}",
    ex7Ans: "よって、0.6 = 3/5",
    ex8Q: "0.125 を最も簡単な分数に変換せよ！",
    ex8KaTeX: "0.125 = \\frac{125}{1000} = \\frac{1}{8}",
    ex8Ans: "よって、0.125 = 1/8",
    ex9Q: "0.000289 を分数に変換せよ！",
    ex9Body: "小数点以下 6 桁、分母 = 1,000,000",
    ex9KaTeX: "0.000289 = \\frac{289}{1000000}",
    ex9Ans: "よって、0.000289 = 289/1,000,000",
    sumTitle: "🔢 完全まとめ",
    sumSubtitle: "小数の形 — 中学1年",
    sumSec1: "小数の概念",
    sumCards: [
      { label: "小数 = 分母が 10ⁿ の分数", desc: "0.3 = 3/10 | 0.45 = 45/100 | 0.125 = 125/1000。小数点以下の桁数を数えて分母を決めます！", color: "from-sky-900/70 to-sky-800/30 border-sky-500/50 text-sky-200" },
      { label: "分数 → 小数", desc: "方法1：分子÷分母。3/4 = 3÷4 = 0.75。方法2：分母を10ⁿにする。3/4 = 75/100 = 0.75", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "小数 → 分数", desc: "数字を分子とし、小数点以下の桁数に応じた 10ⁿ を分母にして、最大公約数（GCD）で約分します。", color: "from-indigo-900/70 to-indigo-800/30 border-indigo-500/50 text-indigo-200" },
      { label: "循環小数と有限小数", desc: "1/3 = 0.333...（循環）。1/4 = 0.25（有限）。分母が 2 と 5 の因数のみなら小数は有限！", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
    ],
    sumSec2: "ヒントとコツ",
    sumTips: [
      { icon: "🔑", tip: "小数点以下の桁数を数えて分母を決める", detail: "0.7 は 1 桁 → 分母 10。0.75 は 2 桁 → 分母 100。0.125 は 3 桁 → 分母 1000。それだけ！", color: "bg-sky-900/30 border-sky-500/30" },
      { icon: "⚡", tip: "分母が 2、4、5、8、10、25 の分数 → 有限小数", detail: "1/8 = 0.125（有限）。1/7 = 0.142857...（循環）。分母が 2 と 5 の因数のみなら小数は必ず有限！", color: "bg-blue-900/30 border-blue-500/30" },
      { icon: "🎯", tip: "よく使う分数-小数変換を暗記する", detail: "1/2=0.5 | 1/4=0.25 | 3/4=0.75 | 1/5=0.2 | 1/8=0.125 | 1/10=0.1。これを暗記すると変換が超速くなる！", color: "bg-indigo-900/30 border-indigo-500/30" },
      { icon: "✅", tip: "変換後に約分する", detail: "0.25 = 25/100 = 1/4（GCD=25 で割る）。常に最後に GCD を求めて最も簡単な形にしましょう！", color: "bg-violet-900/30 border-violet-500/30" },
    ],
    conclusionTitle: "結論",
    conclusionBold: "同じものを表す 2 つの異なる方法",
    conclusionBody: "小数と分数は",
    conclusionBody2: "です。変換のカギ：小数点以下の桁数が分母を決めます（10、100、1000）。よく使う分数-小数のペアを暗記すれば、2 つの形式を自由に行き来できます！",
    tags: ["小数 = 分数 /10ⁿ", "分数 → 割り算", "小数 → 分母 10ⁿ", "GCD で約分", "よく使う変換を暗記"],
    nextLabel: "🚀 小数の演算へ進もう！",
    backBtn: "有理数に戻る",
  },
};

const BentukDesimalPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const c = translations[language];

  const toggleSection = (index: number) => {
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-4xl w-full px-4 py-10">

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 mb-8 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{c.pageTitle}</h1>
          <p className="text-cyan-100">{c.pageSubtitle}</p>
        </div>

        {/* Section 1 */}
        <div className="bg-card/80 backdrop-blur rounded-xl mb-4 overflow-hidden border border-border">
          <div className="w-full flex items-center p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="text-cyan-400" size={24} />
              <span className="font-semibold text-lg">{c.sec1Title}</span>
            </div>
          </div>
          {true && (
            <div className="p-4 border-t border-border space-y-4">
              <div className="bg-cyan-900/30 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <p className="font-medium text-cyan-300">{c.summaryLabel}</p>
                <p className="text-slate-300 mt-1">{c.sec1SummaryBody}</p>
              </div>
              <div className="bg-card/60 rounded-lg p-4">
                <p className="font-medium mb-3">{c.sec1PlaceTitle}</p>
                <p className="text-sm text-slate-300 mt-1">{c.sec1PlaceExample}</p>
                <ul className="text-sm mt-2 space-y-1">
                  {c.sec1Place.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeEasy}</span>
                <p className="font-medium mb-2">{c.ex1Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <p>{c.ex1Body}</p>
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex1Ans}</p>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeMedium}</span>
                <p className="font-medium mb-2">{c.ex2Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <BlockMath math={c.ex2KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex2Ans}</p>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeHard}</span>
                <p className="font-medium mb-2">{c.ex3Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <p>{c.ex3Body}</p>
                  <BlockMath math={c.ex3KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex3Ans}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2 */}
        <div className="bg-card/80 backdrop-blur rounded-xl mb-4 overflow-hidden border border-border">
          <div className="w-full flex items-center p-4">
            <div className="flex items-center gap-3">
              <Calculator className="text-cyan-400" size={24} />
              <span className="font-semibold text-lg">{c.sec2Title}</span>
            </div>
          </div>
          {true && (
            <div className="p-4 border-t border-border space-y-4">
              <div className="bg-cyan-900/30 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <p className="font-medium text-cyan-300">{c.summaryLabel}</p>
                <p className="text-slate-300 mt-1">{c.sec2SummaryBody}</p>
              </div>
              <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-3">
                <p className="text-amber-300 font-medium">{c.tipLabel}</p>
                <p className="text-sm">{c.sec2TipBody}</p>
              </div>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeEasy}</span>
                <p className="font-medium mb-2">{c.ex4Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <BlockMath math={c.ex4KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex4Ans}</p>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeMedium}</span>
                <p className="font-medium mb-2">{c.ex5Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <BlockMath math={c.ex5KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex5Ans}</p>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeHard}</span>
                <p className="font-medium mb-2">{c.ex6Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <p>{c.ex6Body}</p>
                  <BlockMath math={c.ex6KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex6Ans}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3 */}
        <div className="bg-card/80 backdrop-blur rounded-xl mb-4 overflow-hidden border border-border">
          <div className="w-full flex items-center p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="text-cyan-400" size={24} />
              <span className="font-semibold text-lg">{c.sec3Title}</span>
            </div>
          </div>
          {true && (
            <div className="p-4 border-t border-border space-y-4">
              <div className="bg-cyan-900/30 border-l-4 border-cyan-400 p-4 rounded-r-lg">
                <p className="font-medium text-cyan-300">{c.summaryLabel}</p>
                <p className="text-slate-300 mt-1">{c.sec3SummaryBody}</p>
              </div>
              <div className="bg-card/60 rounded-lg p-4">
                <p className="font-medium mb-2">{c.sec3RuleTitle}</p>
                <ul className="space-y-1 text-sm">
                  {c.sec3Rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeEasy}</span>
                <p className="font-medium mb-2">{c.ex7Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <BlockMath math={c.ex7KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex7Ans}</p>
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeMedium}</span>
                <p className="font-medium mb-2">{c.ex8Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <BlockMath math={c.ex8KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex8Ans}</p>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{c.badgeHard}</span>
                <p className="font-medium mb-2">{c.ex9Q}</p>
                <div className="bg-card/90 rounded p-3 mt-2">
                  <p className="text-sm text-slate-400 mb-1">{c.discussLabel}</p>
                  <p>{c.ex9Body}</p>
                  <BlockMath math={c.ex9KaTeX} />
                  <p className="text-cyan-400 font-semibold mt-2">{c.ex9Ans}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{c.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{c.sumSubtitle}</p>
          </div>
          <div className="bg-card/80 backdrop-blur px-5 py-5 space-y-5">

            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-sky-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/30 border border-sky-500 flex items-center justify-center text-[10px]">1</span>
                {c.sumSec1}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {c.sumCards.map(({ label, desc, color }) => (
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
                {c.sumSec2}
              </p>
              <div className="space-y-2">
                {c.sumTips.map(({ icon, tip, detail, color }) => (
                  <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div><p className="font-body text-xs font-bold text-white">{tip}</p><p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-indigo-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">💙</div>
              <p className="font-display text-base font-bold text-white">{c.conclusionTitle}</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {c.conclusionBody} <strong className="text-sky-300">{c.conclusionBold}</strong>{c.conclusionBody2}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {c.tags.map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{c.nextLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/materi-matematika/kelas-7/bilangan-rasional")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {c.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BentukDesimalPage;
