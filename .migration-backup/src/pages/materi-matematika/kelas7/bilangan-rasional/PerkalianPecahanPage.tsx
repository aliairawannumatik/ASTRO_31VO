import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, AlertCircle, Calculator, Scale, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import FractionMultiplicationAnimation from "@/components/FractionMultiplicationAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PERKALIAN PECAHAN",
    pageSubtitle: "Kelas 7 - Bilangan Rasional",
    summaryLabel: "Ringkasan Intisari",
    tipTitle: "Tips Penting",
    discussLabel: "Pembahasan:",
    answerLabel: "Jawaban:",
    conclusionLabel: "Kesimpulan:",
    step: (n: number) => `Langkah ${n}:`,
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    exLabel: (n: number) => `Contoh Soal ${n}`,
    sec1Title: "Konsep Dasar Perkalian Pecahan",
    sec1Body: <><strong>Perkalian pecahan</strong> itu sebenarnya simpel banget! Kamu tinggal kalikan <strong>pembilang dengan pembilang</strong>, lalu kalikan <strong>penyebut dengan penyebut</strong>. Nggak perlu repot-repot menyamakan penyebut seperti penjumlahan atau pengurangan. Kalau ada pecahan campuran, ubah dulu jadi pecahan biasa sebelum dikalikan.</>,
    sec1FormulaTitle: "Rumus Perkalian Pecahan:",
    sec1FormulaNote: <>dengan <InlineMath math="b \neq 0" /> dan <InlineMath math="d \neq 0" /></>,
    sec1Tips: ["Jika ada pecahan campuran, ubah dulu jadi pecahan biasa!", "Sederhanakan hasil akhir jika memungkinkan", "Bisa menyederhanakan silang sebelum mengalikan (lebih efisien)"],
    ex1Q: <>Hitunglah hasil perkalian <InlineMath math="\frac{3}{8} \times \frac{4}{7}" /></>,
    ex1s1: "Kalikan pembilang dengan pembilang",
    ex1s2: "Kalikan penyebut dengan penyebut",
    ex1s3: "Tulis hasilnya dan sederhanakan",
    ex2Q: <>Hitunglah hasil perkalian <InlineMath math="1\frac{4}{5} \times 2\frac{1}{3}" /></>,
    ex2s1: "Ubah pecahan campuran menjadi pecahan biasa",
    ex2s2: "Kalikan kedua pecahan",
    ex2s3: "Sederhanakan dan ubah ke pecahan campuran",
    ex3Q: <>Alex mendapat penghasilan Rp3.600.000 setiap bulan. Sebanyak <InlineMath math="\frac{2}{5}" /> dari penghasilan tersebut digunakan untuk kebutuhan pangan. Kemudian <InlineMath math="\frac{1}{4}" /> dari biaya pangan digunakan untuk membeli gas dan air minum. Berapa rupiah uang yang digunakan untuk membeli gas dan air minum?</>,
    ex3s1: "Tentukan bagian untuk gas dan air minum",
    ex3s2: "Hitung nominal uangnya",
    ex3katex1: "\\text{Biaya} = \\frac{1}{10} \\times Rp3.600.000",
    ex3katex2: "= Rp360.000",
    ex3ans: "Rp360.000",
    sec2Title: "Sifat Komutatif (Pertukaran)",
    sec2Body: <><strong>Sifat komutatif</strong> artinya urutan perkalian boleh ditukar tanpa mengubah hasil. Mau <InlineMath math="a \times b" /> atau <InlineMath math="b \times a" />, hasilnya tetap sama! Ini berlaku juga untuk pecahan. Sifat ini berguna untuk mempermudah perhitungan dengan memilih urutan yang lebih mudah dihitung.</>,
    sec2FormulaTitle: "Rumus Sifat Komutatif:",
    ex4Q: <>Buktikan bahwa <InlineMath math="\frac{1}{2} \times \frac{3}{4} = \frac{3}{4} \times \frac{1}{2}" /></>,
    ex4leftSide: "Hitung ruas kiri:",
    ex4rightSide: "Hitung ruas kanan:",
    ex4conclusion: <>Kedua ruas sama, yaitu <InlineMath math="\frac{3}{8}" />. Terbukti komutatif!</>,
    ex5Q: <>Buktikan sifat komutatif pada <InlineMath math="1\frac{1}{3} \times \frac{1}{5}" /></>,
    ex5s1: "Ubah pecahan campuran",
    ex5s2: (frac: string) => <>Hitung <InlineMath math={frac} /></>,
    ex5s3: (frac: string) => <>Hitung <InlineMath math={frac} /></>,
    ex5conclusion: (frac: string) => <><InlineMath math={frac} /></>,
    ex6Q: <>Gunakan sifat komutatif untuk menghitung <InlineMath math="\frac{7}{12} \times \frac{8}{21}" /> dengan cara yang lebih mudah!</>,
    ex6strategy: "Strategi: Dengan sifat komutatif, kita bisa menyederhanakan silang lebih dulu",
    ex6s1: "Cari faktor persekutuan",
    ex6s1a: "7 dan 21: FPB = 7 (karena 21 = 7 × 3)",
    ex6s1b: "8 dan 12: FPB = 4 (karena 8 = 4 × 2 dan 12 = 4 × 3)",
    ex6s2: "Sederhanakan silang sebelum mengalikan",
    sec3Title: "Sifat Asosiatif (Pengelompokan)",
    sec3Body: <><strong>Sifat asosiatif</strong> artinya pengelompokan operasi tidak mempengaruhi hasil. Saat mengalikan tiga pecahan atau lebih, kamu bebas mau mengelompokkan yang mana dulu. Hasilnya akan tetap sama! Ini sangat membantu saat ada perhitungan yang lebih mudah jika dikelompokkan dengan cara tertentu.</>,
    sec3FormulaTitle: "Rumus Sifat Asosiatif:",
    ex7Q: <>Buktikan bahwa <InlineMath math="\left(\frac{1}{2} \times \frac{1}{3}\right) \times \frac{1}{4} = \frac{1}{2} \times \left(\frac{1}{3} \times \frac{1}{4}\right)" /></>,
    ex7leftSide: "Hitung ruas kiri:",
    ex7rightSide: "Hitung ruas kanan:",
    ex7conclusion: <>Kedua ruas sama, yaitu <InlineMath math="\frac{1}{24}" />. Terbukti asosiatif!</>,
    ex8Q: <>Hitunglah <InlineMath math="\frac{3}{7} \times \frac{1}{9} \times \frac{3}{5}" /> dengan dua cara pengelompokan berbeda!</>,
    ex8way1: "Cara 1: Kelompokkan dua pecahan pertama",
    ex8way2: "Cara 2: Kelompokkan dua pecahan terakhir",
    ex8conclusion: <>Kedua cara menghasilkan <InlineMath math="\frac{1}{35}" /></>,
    ex9Q: <>Hitunglah <InlineMath math="3\frac{1}{7} \times 5\frac{1}{9} \times 3\frac{1}{5}" /> dengan pengelompokan yang paling efisien!</>,
    ex9s1: "Ubah semua pecahan campuran",
    ex9s2: "Kalikan semuanya",
    ex9s3: "Hitung pembilang dan penyebut",
    ex9s4: "Ubah ke pecahan campuran",
    sec4Title: "Sifat Distributif (Penyebaran)",
    sec4Body: <><strong>Sifat distributif</strong> menghubungkan perkalian dengan penjumlahan atau pengurangan. Kamu bisa "menyebarkan" perkalian ke setiap suku di dalam kurung. Sifat ini sangat berguna untuk menyederhanakan perhitungan, terutama saat ada pecahan yang sama.</>,
    sec4FormulaTitle: "Rumus Sifat Distributif:",
    sec4overAdd: "Terhadap Penjumlahan:",
    sec4overSub: "Terhadap Pengurangan:",
    ex10Q: <>Hitunglah <InlineMath math="\frac{1}{2} \times \frac{3}{8} + \frac{1}{2} \times \frac{1}{8}" /> menggunakan sifat distributif!</>,
    ex10s1: (frac: string) => <>Kenali pola distributif (faktor yang sama: <InlineMath math={frac} />)</>,
    ex10s2: "Jumlahkan pecahan dalam kurung",
    ex10s3: "Kalikan",
    ex11Q: <>Hitunglah <InlineMath math="2\frac{1}{5} \times \frac{1}{4} - 1\frac{1}{5} \times \frac{1}{4}" /> dengan sifat distributif!</>,
    ex11s1: (frac: string) => <>Kenali faktor yang sama: <InlineMath math={frac} /></>,
    ex11s2: "Kurangkan pecahan dalam kurung",
    ex11s3: "Kalikan",
    ex12Q: <>Hitunglah <InlineMath math="\frac{1}{3} \times \left(\frac{1}{4} + \frac{1}{6}\right)" /> dengan dua cara: langsung dan distributif!</>,
    ex12way1: "Cara 1 (Langsung):",
    ex12way1a: "Jumlahkan dulu isi kurung (KPK 4 dan 6 = 12):",
    ex12way1b: "Lalu kalikan:",
    ex12way2: "Cara 2 (Distributif):",
    ex12way2a: "KPK 12 dan 18 = 36:",
    ex12conclusion: <>kedua cara sama</>,
    sumTitle: "✖️ RANGKUMAN LENGKAP",
    sumSubtitle: "Perkalian Pecahan — Kelas 7",
    sumSec1: "Aturan Perkalian Pecahan",
    sumCards: [
      { label: "Rumus Dasar: a/b × c/d = ac/bd", desc: "Kalikan pembilang dengan pembilang, dan penyebut dengan penyebut. Tidak perlu menyamakan penyebut!", color: "from-pink-900/70 to-pink-800/30 border-pink-500/50 text-pink-200" },
      { label: "Perkalian Pecahan Campuran", desc: "Ubah pecahan campuran ke bentuk biasa dulu. Contoh: 1½ × 2/3 = 3/2 × 2/3 = 6/6 = 1", color: "from-rose-900/70 to-rose-800/30 border-rose-500/50 text-rose-200" },
      { label: "Perkalian Bilangan Bulat dengan Pecahan", desc: "Anggap bilangan bulat n = n/1. Contoh: 4 × 3/5 = 4/1 × 3/5 = 12/5 = 2 2/5", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
      { label: "Sederhanakan sebelum mengalikan!", desc: "Cross-cancelling: 4/9 × 3/8 = 1/2 × 1/3 = 1/6. Lebih mudah!", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
    ],
    sumSec2: "Tips & Trik Jitu",
    sumTips: [
      { icon: "✂️", tip: "Cross-cancelling sebelum mengalikan", detail: "Sederhanakan pembilang satu pecahan dengan penyebut pecahan lain sebelum dikalikan. Ini membuat angkanya lebih kecil dan lebih mudah dihitung!", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🔄", tip: "Perkalian pecahan LEBIH mudah dari penjumlahan", detail: "Tidak perlu menyamakan penyebut! Langsung kalikan saja. Ini justru operasi yang paling sederhana di antara operasi pecahan.", color: "bg-rose-900/30 border-rose-500/30" },
      { icon: "🎯", tip: "Hasil perkalian dua pecahan < 1 selalu lebih kecil", detail: "1/2 × 3/4 = 3/8 < 1/2. Mengalikan pecahan membuatnya lebih kecil — kebalikan dari intuisi perkalian bilangan bulat!", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "✅", tip: "Ubah pecahan campuran ke biasa SEBELUM mengalikan", detail: "2 1/3 × 1 1/2 → 7/3 × 3/2 = 21/6 = 7/2 = 3 1/2. Jangan kalikan bagian bulat dan pecahannya secara terpisah!", color: "bg-red-900/30 border-red-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Perkalian pecahan adalah operasi paling elegan dalam matematika — <strong className="text-pink-300">cukup kalikan pembilang dengan pembilang dan penyebut dengan penyebut</strong>. Gunakan teknik <strong className="text-yellow-300">cross-cancelling</strong> untuk menyederhanakan sebelum mengalikan, dan kamu akan mendapat jawaban dalam hitungan detik!</>,
    tags: ["a/b × c/d = ac/bd", "Cross-Cancelling", "Campuran → Biasa dulu", "Tidak perlu samakan penyebut"],
    nextLabel: "🚀 Lanjut ke Pembagian Pecahan!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "FRACTION MULTIPLICATION",
    pageSubtitle: "Grade 7 - Rational Numbers",
    summaryLabel: "Key Summary",
    tipTitle: "Important Tips",
    discussLabel: "Solution:",
    answerLabel: "Answer:",
    conclusionLabel: "Conclusion:",
    step: (n: number) => `Step ${n}:`,
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    exLabel: (n: number) => `Example ${n}`,
    sec1Title: "Basic Concept of Fraction Multiplication",
    sec1Body: <><strong>Fraction multiplication</strong> is actually very simple! Just multiply <strong>numerator by numerator</strong>, then <strong>denominator by denominator</strong>. No need to find a common denominator like in addition or subtraction. If there are mixed numbers, convert them to improper fractions first.</>,
    sec1FormulaTitle: "Fraction Multiplication Formula:",
    sec1FormulaNote: <>where <InlineMath math="b \neq 0" /> and <InlineMath math="d \neq 0" /></>,
    sec1Tips: ["If there are mixed numbers, convert them to improper fractions first!", "Simplify the final answer if possible", "You can cross-cancel before multiplying (more efficient)"],
    ex1Q: <>Calculate <InlineMath math="\frac{3}{8} \times \frac{4}{7}" /></>,
    ex1s1: "Multiply numerator by numerator",
    ex1s2: "Multiply denominator by denominator",
    ex1s3: "Write the result and simplify",
    ex2Q: <>Calculate <InlineMath math="1\frac{4}{5} \times 2\frac{1}{3}" /></>,
    ex2s1: "Convert mixed numbers to improper fractions",
    ex2s2: "Multiply the two fractions",
    ex2s3: "Simplify and convert to a mixed number",
    ex3Q: <>Alex earns $3,600 per month. <InlineMath math="\frac{2}{5}" /> of his income is spent on food. Then <InlineMath math="\frac{1}{4}" /> of the food budget is spent on gas and drinking water. How much money is spent on gas and drinking water?</>,
    ex3s1: "Find the fraction for gas and drinking water",
    ex3s2: "Calculate the dollar amount",
    ex3katex1: "\\text{Cost} = \\frac{1}{10} \\times \\$3{,}600",
    ex3katex2: "= \\$360",
    ex3ans: "$360",
    sec2Title: "Commutative Property (Swapping Order)",
    sec2Body: <>The <strong>commutative property</strong> means the order of multiplication can be swapped without changing the result. Whether <InlineMath math="a \times b" /> or <InlineMath math="b \times a" />, the result is the same! This applies to fractions too. Use it to choose the easier calculation order.</>,
    sec2FormulaTitle: "Commutative Property Formula:",
    ex4Q: <>Prove that <InlineMath math="\frac{1}{2} \times \frac{3}{4} = \frac{3}{4} \times \frac{1}{2}" /></>,
    ex4leftSide: "Calculate the left side:",
    ex4rightSide: "Calculate the right side:",
    ex4conclusion: <>Both sides equal <InlineMath math="\frac{3}{8}" />. Commutativity proved!</>,
    ex5Q: <>Prove the commutative property for <InlineMath math="1\frac{1}{3} \times \frac{1}{5}" /></>,
    ex5s1: "Convert the mixed number",
    ex5s2: (frac: string) => <>Calculate <InlineMath math={frac} /></>,
    ex5s3: (frac: string) => <>Calculate <InlineMath math={frac} /></>,
    ex5conclusion: (frac: string) => <><InlineMath math={frac} /></>,
    ex6Q: <>Use the commutative property to calculate <InlineMath math="\frac{7}{12} \times \frac{8}{21}" /> more easily!</>,
    ex6strategy: "Strategy: With the commutative property, we can cross-cancel first",
    ex6s1: "Find common factors",
    ex6s1a: "7 and 21: GCD = 7 (since 21 = 7 × 3)",
    ex6s1b: "8 and 12: GCD = 4 (since 8 = 4 × 2 and 12 = 4 × 3)",
    ex6s2: "Cross-cancel before multiplying",
    sec3Title: "Associative Property (Grouping)",
    sec3Body: <>The <strong>associative property</strong> means grouping does not affect the result. When multiplying three or more fractions, you can group them any way you like. The result will always be the same! This is very helpful when a certain grouping makes the calculation easier.</>,
    sec3FormulaTitle: "Associative Property Formula:",
    ex7Q: <>Prove that <InlineMath math="\left(\frac{1}{2} \times \frac{1}{3}\right) \times \frac{1}{4} = \frac{1}{2} \times \left(\frac{1}{3} \times \frac{1}{4}\right)" /></>,
    ex7leftSide: "Calculate the left side:",
    ex7rightSide: "Calculate the right side:",
    ex7conclusion: <>Both sides equal <InlineMath math="\frac{1}{24}" />. Associativity proved!</>,
    ex8Q: <>Calculate <InlineMath math="\frac{3}{7} \times \frac{1}{9} \times \frac{3}{5}" /> using two different groupings!</>,
    ex8way1: "Method 1: Group the first two fractions",
    ex8way2: "Method 2: Group the last two fractions",
    ex8conclusion: <>Both methods give <InlineMath math="\frac{1}{35}" /></>,
    ex9Q: <>Calculate <InlineMath math="3\frac{1}{7} \times 5\frac{1}{9} \times 3\frac{1}{5}" /> using the most efficient grouping!</>,
    ex9s1: "Convert all mixed numbers",
    ex9s2: "Multiply them all",
    ex9s3: "Calculate numerator and denominator",
    ex9s4: "Convert to a mixed number",
    sec4Title: "Distributive Property (Distribution)",
    sec4Body: <>The <strong>distributive property</strong> links multiplication with addition or subtraction. You can "distribute" multiplication to each term inside the brackets. This is very useful for simplifying calculations, especially when the same fraction appears as a factor.</>,
    sec4FormulaTitle: "Distributive Property Formula:",
    sec4overAdd: "Over Addition:",
    sec4overSub: "Over Subtraction:",
    ex10Q: <>Calculate <InlineMath math="\frac{1}{2} \times \frac{3}{8} + \frac{1}{2} \times \frac{1}{8}" /> using the distributive property!</>,
    ex10s1: (frac: string) => <>Identify the distributive pattern (common factor: <InlineMath math={frac} />)</>,
    ex10s2: "Add the fractions inside the brackets",
    ex10s3: "Multiply",
    ex11Q: <>Calculate <InlineMath math="2\frac{1}{5} \times \frac{1}{4} - 1\frac{1}{5} \times \frac{1}{4}" /> using the distributive property!</>,
    ex11s1: (frac: string) => <>Identify the common factor: <InlineMath math={frac} /></>,
    ex11s2: "Subtract the fractions inside the brackets",
    ex11s3: "Multiply",
    ex12Q: <>Calculate <InlineMath math="\frac{1}{3} \times \left(\frac{1}{4} + \frac{1}{6}\right)" /> two ways: directly and by distributing!</>,
    ex12way1: "Method 1 (Direct):",
    ex12way1a: "Add the contents of the brackets first (LCM of 4 and 6 = 12):",
    ex12way1b: "Then multiply:",
    ex12way2: "Method 2 (Distributive):",
    ex12way2a: "LCM of 12 and 18 = 36:",
    ex12conclusion: <>both methods match</>,
    sumTitle: "✖️ COMPLETE SUMMARY",
    sumSubtitle: "Fraction Multiplication — Grade 7",
    sumSec1: "Fraction Multiplication Rules",
    sumCards: [
      { label: "Basic Formula: a/b × c/d = ac/bd", desc: "Multiply numerator by numerator, denominator by denominator. No need to find a common denominator!", color: "from-pink-900/70 to-pink-800/30 border-pink-500/50 text-pink-200" },
      { label: "Multiplying Mixed Numbers", desc: "Convert mixed numbers to improper fractions first. Example: 1½ × 2/3 = 3/2 × 2/3 = 6/6 = 1", color: "from-rose-900/70 to-rose-800/30 border-rose-500/50 text-rose-200" },
      { label: "Whole Number × Fraction", desc: "Treat the whole number n as n/1. Example: 4 × 3/5 = 4/1 × 3/5 = 12/5 = 2 2/5", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
      { label: "Simplify before multiplying!", desc: "Cross-cancel: 4/9 × 3/8 = 1/2 × 1/3 = 1/6. Much easier!", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
    ],
    sumSec2: "Tips & Tricks",
    sumTips: [
      { icon: "✂️", tip: "Cross-cancel before multiplying", detail: "Simplify a numerator from one fraction with a denominator from another before multiplying. This keeps numbers small and easy!", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🔄", tip: "Fraction multiplication is EASIER than addition", detail: "No common denominator needed! Just multiply straight away. This is the simplest of all fraction operations.", color: "bg-rose-900/30 border-rose-500/30" },
      { icon: "🎯", tip: "Multiplying two fractions < 1 always gives a smaller result", detail: "1/2 × 3/4 = 3/8 < 1/2. Multiplying fractions makes them smaller — opposite to whole-number intuition!", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "✅", tip: "Convert mixed numbers BEFORE multiplying", detail: "2 1/3 × 1 1/2 → 7/3 × 3/2 = 21/6 = 7/2 = 3 1/2. Never multiply the whole-number and fraction parts separately!", color: "bg-red-900/30 border-red-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Fraction multiplication is the most elegant operation in mathematics — <strong className="text-pink-300">just multiply numerator by numerator and denominator by denominator</strong>. Use the <strong className="text-yellow-300">cross-cancelling</strong> technique to simplify before multiplying, and you'll have an answer in seconds!</>,
    tags: ["a/b × c/d = ac/bd", "Cross-Cancelling", "Mixed → Improper first", "No common denominator needed"],
    nextLabel: "🚀 Continue to Fraction Division!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    pageTitle: "分数の掛け算",
    pageSubtitle: "中学1年 - 有理数",
    summaryLabel: "要点まとめ",
    tipTitle: "重要ヒント",
    discussLabel: "解説：",
    answerLabel: "答え：",
    conclusionLabel: "まとめ：",
    step: (n: number) => `手順 ${n}：`,
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    exLabel: (n: number) => `例題 ${n}`,
    sec1Title: "分数の掛け算の基本概念",
    sec1Body: <><strong>分数の掛け算</strong>はとても簡単です！<strong>分子×分子</strong>、<strong>分母×分母</strong>を計算するだけです。足し算や引き算のように通分する必要はありません。帯分数があれば、掛ける前に仮分数に変換しましょう。</>,
    sec1FormulaTitle: "分数の掛け算の公式：",
    sec1FormulaNote: <><InlineMath math="b \neq 0" /> かつ <InlineMath math="d \neq 0" /></>,
    sec1Tips: ["帯分数があれば、まず仮分数に変換する！", "できれば最終答えを約分する", "掛ける前に斜め約分できる（より効率的）"],
    ex1Q: <><InlineMath math="\frac{3}{8} \times \frac{4}{7}" /> を計算せよ</>,
    ex1s1: "分子×分子を計算する",
    ex1s2: "分母×分母を計算する",
    ex1s3: "結果を書いて約分する",
    ex2Q: <><InlineMath math="1\frac{4}{5} \times 2\frac{1}{3}" /> を計算せよ</>,
    ex2s1: "帯分数を仮分数に変換する",
    ex2s2: "2つの分数を掛ける",
    ex2s3: "約分して帯分数に変換する",
    ex3Q: <>Alexさんの月収は$3,600です。そのうち <InlineMath math="\frac{2}{5}" /> を食費に使います。さらに食費の <InlineMath math="\frac{1}{4}" /> をガス代と飲料水に使います。ガスと飲料水にいくら使いますか？</>,
    ex3s1: "ガスと飲料水の割合を求める",
    ex3s2: "金額を計算する",
    ex3katex1: "\\text{金額} = \\frac{1}{10} \\times \\$3{,}600",
    ex3katex2: "= \\$360",
    ex3ans: "$360",
    sec2Title: "交換法則（掛け算の順番を入れ替えても同じ）",
    sec2Body: <>交換法則とは、掛け算の順序を入れ替えても結果が変わらないことです。<InlineMath math="a \times b" /> でも <InlineMath math="b \times a" /> でも同じです！分数でも同様です。計算しやすい順序を選ぶのに役立ちます。</>,
    sec2FormulaTitle: "交換法則の公式：",
    ex4Q: <><InlineMath math="\frac{1}{2} \times \frac{3}{4} = \frac{3}{4} \times \frac{1}{2}" /> を証明せよ</>,
    ex4leftSide: "左辺を計算する：",
    ex4rightSide: "右辺を計算する：",
    ex4conclusion: <>両辺ともに <InlineMath math="\frac{3}{8}" />。交換法則が証明された！</>,
    ex5Q: <><InlineMath math="1\frac{1}{3} \times \frac{1}{5}" /> で交換法則を証明せよ</>,
    ex5s1: "帯分数を変換する",
    ex5s2: (frac: string) => <><InlineMath math={frac} /> を計算する</>,
    ex5s3: (frac: string) => <><InlineMath math={frac} /> を計算する</>,
    ex5conclusion: (frac: string) => <><InlineMath math={frac} /></>,
    ex6Q: <>交換法則を使って <InlineMath math="\frac{7}{12} \times \frac{8}{21}" /> を効率よく計算せよ！</>,
    ex6strategy: "戦略：交換法則を使って先に斜め約分する",
    ex6s1: "公因数を求める",
    ex6s1a: "7 と 21：GCD = 7（21 = 7 × 3 なので）",
    ex6s1b: "8 と 12：GCD = 4（8 = 4 × 2、12 = 4 × 3 なので）",
    ex6s2: "掛ける前に斜め約分する",
    sec3Title: "結合法則（グループ化しても同じ）",
    sec3Body: <>結合法則とはグループ化が結果に影響しないことです。3つ以上の分数を掛けるとき、どの組み合わせを先にグループ化しても構いません。結果は常に同じです！特定のグループ化で計算が楽になるときに非常に役立ちます。</>,
    sec3FormulaTitle: "結合法則の公式：",
    ex7Q: <><InlineMath math="\left(\frac{1}{2} \times \frac{1}{3}\right) \times \frac{1}{4} = \frac{1}{2} \times \left(\frac{1}{3} \times \frac{1}{4}\right)" /> を証明せよ</>,
    ex7leftSide: "左辺を計算する：",
    ex7rightSide: "右辺を計算する：",
    ex7conclusion: <>両辺ともに <InlineMath math="\frac{1}{24}" />。結合法則が証明された！</>,
    ex8Q: <><InlineMath math="\frac{3}{7} \times \frac{1}{9} \times \frac{3}{5}" /> を 2 通りのグループ化で計算せよ！</>,
    ex8way1: "方法 1：最初の 2 つをグループ化",
    ex8way2: "方法 2：最後の 2 つをグループ化",
    ex8conclusion: <>どちらの方法も <InlineMath math="\frac{1}{35}" /> になる</>,
    ex9Q: <><InlineMath math="3\frac{1}{7} \times 5\frac{1}{9} \times 3\frac{1}{5}" /> を最も効率的なグループ化で計算せよ！</>,
    ex9s1: "すべての帯分数を変換する",
    ex9s2: "すべて掛ける",
    ex9s3: "分子と分母を計算する",
    ex9s4: "帯分数に変換する",
    sec4Title: "分配法則（分配して計算）",
    sec4Body: <>分配法則とは掛け算を足し算や引き算と結びつけるものです。カッコ内の各項に掛け算を"分配"できます。同じ分数が因数として現れるときに計算を簡単にするのに非常に役立ちます。</>,
    sec4FormulaTitle: "分配法則の公式：",
    sec4overAdd: "足し算に対して：",
    sec4overSub: "引き算に対して：",
    ex10Q: <>分配法則を使って <InlineMath math="\frac{1}{2} \times \frac{3}{8} + \frac{1}{2} \times \frac{1}{8}" /> を計算せよ！</>,
    ex10s1: (frac: string) => <>分配のパターンを見つける（共通因数：<InlineMath math={frac} />）</>,
    ex10s2: "カッコ内の分数を足す",
    ex10s3: "掛ける",
    ex11Q: <>分配法則を使って <InlineMath math="2\frac{1}{5} \times \frac{1}{4} - 1\frac{1}{5} \times \frac{1}{4}" /> を計算せよ！</>,
    ex11s1: (frac: string) => <>共通因数を見つける：<InlineMath math={frac} /></>,
    ex11s2: "カッコ内の分数を引く",
    ex11s3: "掛ける",
    ex12Q: <><InlineMath math="\frac{1}{3} \times \left(\frac{1}{4} + \frac{1}{6}\right)" /> を 2 通りの方法で計算せよ：直接計算と分配法則！</>,
    ex12way1: "方法 1（直接計算）：",
    ex12way1a: "まずカッコ内を足す（4 と 6 の LCM = 12）：",
    ex12way1b: "次に掛ける：",
    ex12way2: "方法 2（分配法則）：",
    ex12way2a: "12 と 18 の LCM = 36：",
    ex12conclusion: <>両方の方法が一致</>,
    sumTitle: "✖️ 完全まとめ",
    sumSubtitle: "分数の掛け算 — 中学1年",
    sumSec1: "分数の掛け算のルール",
    sumCards: [
      { label: "基本公式：a/b × c/d = ac/bd", desc: "分子×分子、分母×分母。通分の必要なし！", color: "from-pink-900/70 to-pink-800/30 border-pink-500/50 text-pink-200" },
      { label: "帯分数の掛け算", desc: "まず仮分数に変換する。例：1½ × 2/3 = 3/2 × 2/3 = 6/6 = 1", color: "from-rose-900/70 to-rose-800/30 border-rose-500/50 text-rose-200" },
      { label: "整数 × 分数", desc: "整数 n を n/1 と考える。例：4 × 3/5 = 4/1 × 3/5 = 12/5 = 2 2/5", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
      { label: "掛ける前に約分！", desc: "斜め約分：4/9 × 3/8 = 1/2 × 1/3 = 1/6。ずっと簡単！", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
    ],
    sumSec2: "ヒントとコツ",
    sumTips: [
      { icon: "✂️", tip: "掛ける前に斜め約分する", detail: "一方の分数の分子と他方の分数の分母を約分してから掛ける。数が小さくなって計算しやすい！", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🔄", tip: "分数の掛け算は足し算より簡単", detail: "通分不要！そのまま掛けるだけ。分数の演算の中で最もシンプルです。", color: "bg-rose-900/30 border-rose-500/30" },
      { icon: "🎯", tip: "1 未満の分数どうしを掛けると結果は小さくなる", detail: "1/2 × 3/4 = 3/8 < 1/2。分数を掛けると小さくなる — 整数の直感と逆！", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "✅", tip: "掛ける前に帯分数を仮分数に変換する", detail: "2 1/3 × 1 1/2 → 7/3 × 3/2 = 21/6 = 7/2 = 3 1/2。整数部と分数部を別々に掛けないこと！", color: "bg-red-900/30 border-red-500/30" },
    ],
    conclusionTitle: "結論",
    conclusionBody: <>分数の掛け算は最もエレガントな演算です — <strong className="text-pink-300">分子×分子、分母×分母</strong>を計算するだけ。<strong className="text-yellow-300">斜め約分</strong>のテクニックで掛ける前に簡略化すれば、秒で答えが出ます！</>,
    tags: ["a/b × c/d = ac/bd", "斜め約分", "帯分数→仮分数に", "通分不要"],
    nextLabel: "🚀 分数の割り算へ進もう！",
    backBtn: "有理数に戻る",
  },
};

const PerkalianPecahanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<number | null>(null);
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

        <div className="mb-6 animate-slide-up">
          <FractionMultiplicationAnimation />
        </div>

        {/* Section 1 */}
        <div className="mb-6 animate-slide-up">
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Calculator className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec1Title}</span>
          </div>
          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
                <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec1Body}</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec1FormulaTitle}</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <BlockMath math="\frac{a}{b} \times \frac{c}{d} = \frac{a \times c}{b \times d}" />
                  <p className="text-white/70 text-xs mt-2 font-body">{t.sec1FormulaNote}</p>
                </div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {t.tipTitle}
                </h4>
                <ul className="text-white/80 text-sm font-body space-y-1 list-disc list-inside">
                  {t.sec1Tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
              {/* Example 1 */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                  <span className="text-green-300 font-semibold text-sm">{t.exLabel(1)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex1Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex1s1}</p>
                    <div className="pl-4"><InlineMath math="3 \times 4 = 12" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                    <div className="pl-4"><InlineMath math="8 \times 7 = 56" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex1s3}</p>
                    <div className="pl-4"><InlineMath math="\frac{3}{8} \times \frac{4}{7} = \frac{12}{56} = \frac{3}{14}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{3}{14}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 2 */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                  <span className="text-yellow-300 font-semibold text-sm">{t.exLabel(2)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex2Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex2s1}</p>
                    <div className="pl-4"><InlineMath math="1\frac{4}{5} = \frac{(1 \times 5) + 4}{5} = \frac{9}{5}" /></div>
                    <div className="pl-4"><InlineMath math="2\frac{1}{3} = \frac{(2 \times 3) + 1}{3} = \frac{7}{3}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                    <div className="pl-4"><InlineMath math="\frac{9}{5} \times \frac{7}{3} = \frac{9 \times 7}{5 \times 3} = \frac{63}{15}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex2s3}</p>
                    <div className="pl-4"><InlineMath math="\frac{63}{15} = \frac{21}{5} = 4\frac{1}{5}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="4\frac{1}{5}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 3 */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                  <span className="text-red-300 font-semibold text-sm">{t.exLabel(3)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex3Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex3s1}</p>
                    <div className="pl-4">
                      <InlineMath math="\text{Fraction} = \frac{1}{4} \times \frac{2}{5} = \frac{1 \times 2}{4 \times 5} = \frac{2}{20} = \frac{1}{10}" />
                    </div>
                    <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                    <div className="pl-4"><BlockMath math={t.ex3katex1} /></div>
                    <div className="pl-4"><BlockMath math={t.ex3katex2} /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> {t.ex3ans}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2 */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Scale className="w-5 h-5 text-green-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec2Title}</span>
          </div>
          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec2Body}</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec2FormulaTitle}</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <BlockMath math="\frac{a}{b} \times \frac{c}{d} = \frac{c}{d} \times \frac{a}{b}" />
                </div>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                  <span className="text-green-300 font-semibold text-sm">{t.exLabel(1)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex4Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.ex4leftSide}</strong></p>
                    <div className="pl-4"><InlineMath math="\frac{1}{2} \times \frac{3}{4} = \frac{1 \times 3}{2 \times 4} = \frac{3}{8}" /></div>
                    <p><strong>{t.ex4rightSide}</strong></p>
                    <div className="pl-4"><InlineMath math="\frac{3}{4} \times \frac{1}{2} = \frac{3 \times 1}{4 \times 2} = \frac{3}{8}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.conclusionLabel}</strong> {t.ex4conclusion}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                  <span className="text-yellow-300 font-semibold text-sm">{t.exLabel(2)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex5Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex5s1}</p>
                    <div className="pl-4"><InlineMath math="1\frac{1}{3} = \frac{4}{3}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex5s2("\\frac{4}{3} \\times \\frac{1}{5}")}</p>
                    <div className="pl-4"><InlineMath math="\frac{4}{3} \times \frac{1}{5} = \frac{4}{15}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex5s3("\\frac{1}{5} \\times \\frac{4}{3}")}</p>
                    <div className="pl-4"><InlineMath math="\frac{1}{5} \times \frac{4}{3} = \frac{4}{15}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.conclusionLabel}</strong> {t.ex5conclusion("\\frac{4}{3} \\times \\frac{1}{5} = \\frac{1}{5} \\times \\frac{4}{3} = \\frac{4}{15}")}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                  <span className="text-red-300 font-semibold text-sm">{t.exLabel(3)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex6Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.ex6strategy}</strong></p>
                    <p><strong>{t.step(1)}</strong> {t.ex6s1}</p>
                    <div className="pl-4">
                      <p>{t.ex6s1a}</p>
                      <p>{t.ex6s1b}</p>
                    </div>
                    <p><strong>{t.step(2)}</strong> {t.ex6s2}</p>
                    <div className="pl-4">
                      <InlineMath math="\frac{7}{12} \times \frac{8}{21} = \frac{^1\cancel{7}}{^3\cancel{12}} \times \frac{^2\cancel{8}}{_3\cancel{21}} = \frac{1 \times 2}{3 \times 3} = \frac{2}{9}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{2}{9}" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3 */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <Layers className="w-5 h-5 text-orange-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec3Title}</span>
          </div>
          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg p-4">
                <h3 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec3Body}</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec3FormulaTitle}</h4>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <BlockMath math="\left(\frac{a}{b} \times \frac{c}{d}\right) \times \frac{e}{f} = \frac{a}{b} \times \left(\frac{c}{d} \times \frac{e}{f}\right)" />
                </div>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                  <span className="text-green-300 font-semibold text-sm">{t.exLabel(1)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex7Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.ex7leftSide}</strong></p>
                    <div className="pl-4"><InlineMath math="\left(\frac{1}{2} \times \frac{1}{3}\right) \times \frac{1}{4} = \frac{1}{6} \times \frac{1}{4} = \frac{1}{24}" /></div>
                    <p><strong>{t.ex7rightSide}</strong></p>
                    <div className="pl-4"><InlineMath math="\frac{1}{2} \times \left(\frac{1}{3} \times \frac{1}{4}\right) = \frac{1}{2} \times \frac{1}{12} = \frac{1}{24}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.conclusionLabel}</strong> {t.ex7conclusion}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                  <span className="text-yellow-300 font-semibold text-sm">{t.exLabel(2)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex8Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.ex8way1}</strong></p>
                    <div className="pl-4">
                      <InlineMath math="\left(\frac{3}{7} \times \frac{1}{9}\right) \times \frac{3}{5} = \frac{3}{63} \times \frac{3}{5} = \frac{1}{21} \times \frac{3}{5} = \frac{3}{105} = \frac{1}{35}" />
                    </div>
                    <p><strong>{t.ex8way2}</strong></p>
                    <div className="pl-4">
                      <InlineMath math="\frac{3}{7} \times \left(\frac{1}{9} \times \frac{3}{5}\right) = \frac{3}{7} \times \frac{3}{45} = \frac{3}{7} \times \frac{1}{15} = \frac{3}{105} = \frac{1}{35}" />
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>{t.conclusionLabel}</strong> {t.ex8conclusion}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                  <span className="text-red-300 font-semibold text-sm">{t.exLabel(3)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex9Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex9s1}</p>
                    <div className="pl-4"><InlineMath math="3\frac{1}{7} = \frac{22}{7}, \quad 5\frac{1}{9} = \frac{46}{9}, \quad 3\frac{1}{5} = \frac{16}{5}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex9s2}</p>
                    <div className="pl-4"><InlineMath math="\frac{22}{7} \times \frac{46}{9} \times \frac{16}{5}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex9s3}</p>
                    <div className="pl-4"><InlineMath math="= \frac{22 \times 46 \times 16}{7 \times 9 \times 5} = \frac{16192}{315}" /></div>
                    <p><strong>{t.step(4)}</strong> {t.ex9s4}</p>
                    <div className="pl-4"><InlineMath math="= 51\frac{127}{315}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="51\frac{127}{315}" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4 */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <span className="font-body text-base text-white font-semibold">{t.sec4Title}</span>
          </div>
          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-lg p-4">
                <h3 className="text-pink-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec4Body}</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec4FormulaTitle}</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-3">
                  <div className="text-center">
                    <p className="text-white/70 text-xs mb-1">{t.sec4overAdd}</p>
                    <BlockMath math="\frac{a}{b} \times \left(\frac{c}{d} + \frac{e}{f}\right) = \frac{a}{b} \times \frac{c}{d} + \frac{a}{b} \times \frac{e}{f}" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-xs mb-1">{t.sec4overSub}</p>
                    <BlockMath math="\frac{a}{b} \times \left(\frac{c}{d} - \frac{e}{f}\right) = \frac{a}{b} \times \frac{c}{d} - \frac{a}{b} \times \frac{e}{f}" />
                  </div>
                </div>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                  <span className="text-green-300 font-semibold text-sm">{t.exLabel(1)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex10Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex10s1("\\frac{1}{2}")}</p>
                    <div className="pl-4"><InlineMath math="\frac{1}{2} \times \frac{3}{8} + \frac{1}{2} \times \frac{1}{8} = \frac{1}{2} \times \left(\frac{3}{8} + \frac{1}{8}\right)" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex10s2}</p>
                    <div className="pl-4"><InlineMath math="= \frac{1}{2} \times \frac{4}{8} = \frac{1}{2} \times \frac{1}{2}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex10s3}</p>
                    <div className="pl-4"><InlineMath math="= \frac{1}{4}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{1}{4}" /></p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                  <span className="text-yellow-300 font-semibold text-sm">{t.exLabel(2)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex11Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex11s1("\\frac{1}{4}")}</p>
                    <div className="pl-4"><InlineMath math="= \left(2\frac{1}{5} - 1\frac{1}{5}\right) \times \frac{1}{4}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex11s2}</p>
                    <div className="pl-4"><InlineMath math="= 1 \times \frac{1}{4}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex11s3}</p>
                    <div className="pl-4"><InlineMath math="= \frac{1}{4}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{1}{4}" /></p>
                  </div>
                </div>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                  <span className="text-red-300 font-semibold text-sm">{t.exLabel(3)}</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex12Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-3">
                    <div className="border-b border-white/20 pb-3">
                      <p><strong>{t.ex12way1}</strong></p>
                      <div className="pl-4">
                        <p>{t.ex12way1a}</p>
                        <InlineMath math="\frac{1}{4} + \frac{1}{6} = \frac{3}{12} + \frac{2}{12} = \frac{5}{12}" />
                      </div>
                      <div className="pl-4 mt-1">
                        <p>{t.ex12way1b}</p>
                        <InlineMath math="\frac{1}{3} \times \frac{5}{12} = \frac{5}{36}" />
                      </div>
                    </div>
                    <div>
                      <p><strong>{t.ex12way2}</strong></p>
                      <div className="pl-4">
                        <InlineMath math="\frac{1}{3} \times \frac{1}{4} + \frac{1}{3} \times \frac{1}{6}" />
                      </div>
                      <div className="pl-4 mt-1"><InlineMath math="= \frac{1}{12} + \frac{1}{18}" /></div>
                      <div className="pl-4 mt-1">
                        <p>{t.ex12way2a}</p>
                        <InlineMath math="= \frac{3}{36} + \frac{2}{36} = \frac{5}{36}" />
                      </div>
                    </div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{5}{36}" /> ({t.ex12conclusion})</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-500/30 border border-pink-500 flex items-center justify-center text-[10px]">1</span>
                {t.sumSec1}
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
                {t.sumSec2}
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
            <div className="bg-gradient-to-br from-pink-500/20 via-rose-500/15 to-red-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌸</div>
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

export default PerkalianPecahanPage;
