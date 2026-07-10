import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, Scale, Equal } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "ARTI PECAHAN, PECAHAN SENILAI DAN MEMBANDINGKAN PECAHAN",
    pageSubtitle: "Kelas 7 - Bilangan Rasional - Materi Matematika",
    sec1Title: "Arti Pecahan",
    summaryLabel: "Ringkasan Intisari",
    sec1SummaryBody: "adalah bilangan yang menggambarkan bagian dari suatu keseluruhan. Bayangkan kamu punya sepotong pizza yang dipotong rata menjadi beberapa bagian. Ketika kamu mengambil sebagian dari potongan tersebut, itulah yang disebut pecahan!",
    sec1SummaryBold: "Pecahan",
    imgAlt: "Ilustrasi pecahan senilai dengan pizza",
    imgCaption: <>Kelima pizza di atas memiliki ukuran yang sama dan masing-masing menunjukkan bagian yang diarsir (pepperoni). Walaupun penulisannya berbeda (<InlineMath math="\frac{1}{2}, \frac{2}{4}, \frac{3}{6}, \frac{4}{8}, \frac{6}{12}" />), bagian pizza yang diambil tetap sama besar — inilah yang disebut <strong className="text-green-300">Pecahan Senilai</strong>!</>,
    sec1Components: "Setiap pecahan terdiri dari dua komponen utama:",
    numeratorLabel: <>= <strong>Pembilang</strong> (angka di atas garis)</>,
    denominatorLabel: <>= <strong>Penyebut</strong> (angka di bawah garis, <InlineMath math="b \neq 0" />)</>,
    visualExample: <><strong>Contoh Visual:</strong> Jika sebuah kue dipotong menjadi <strong>4 bagian sama besar</strong> dan kamu mengambil <strong>3 potong</strong>, maka bagianmu adalah <InlineMath math="\frac{3}{4}" /> dari kue tersebut. Di sini, 3 adalah pembilang (bagian yang diambil) dan 4 adalah penyebut (total bagian).</>,
    properFraction: <><strong>Pecahan Murni</strong> adalah pecahan di mana nilai pembilangnya <strong>lebih kecil</strong> dari penyebutnya. Contoh: <InlineMath math="\frac{1}{2}" />, <InlineMath math="\frac{3}{4}" />, <InlineMath math="\frac{5}{8}" /></>,
    numberLineTitle: "Posisi Pecahan pada Garis Bilangan:",
    numberLineBody: <>Pecahan berada di antara dua bilangan bulat pada garis bilangan. Misalnya, <InlineMath math="\frac{1}{2}" /> terletak tepat di tengah antara 0 dan 1.</>,
    numberLineLabel: "Garis Bilangan:",
    svgEqual: "← sama →",
    examplesHeader: "Contoh Soal dan Pembahasan",
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    exLabel: "Contoh",
    discussLabel: "PEMBAHASAN:",
    step: (n: number) => `Langkah ${n}:`,
    answerLabel: "Jadi,",
    ex1Q: "Sebuah cokelat batangan dibagi menjadi 8 bagian yang sama. Dina memakan 3 bagian. Nyatakan bagian cokelat yang dimakan Dina dalam bentuk pecahan!",
    ex1s1: "Tentukan penyebut (total bagian) = 8",
    ex1s2: "Tentukan pembilang (bagian yang dimakan) = 3",
    ex1s3: "Tulis dalam bentuk pecahan:",
    ex1katex: "\\text{Bagian cokelat Dina} = \\frac{3}{8}",
    ex1ans: <>Jadi, Dina memakan <InlineMath math="\frac{3}{8}" /> bagian dari cokelat.</>,
    ex2Q: "Nyatakan 45 menit dari 1 jam dalam bentuk pecahan paling sederhana!",
    ex2s1: "Ingat bahwa 1 jam = 60 menit",
    ex2s2: "Tulis dalam bentuk pecahan:",
    ex2s3: "Sederhanakan dengan membagi pembilang dan penyebut dengan FPB-nya (15):",
    ex2ans: <>Jadi, 45 menit = <InlineMath math="\frac{3}{4}" /> jam.</>,
    ex3Q: <>Pada pecahan <InlineMath math="\frac{a}{b}" />, diketahui pembilang sama dengan 2 kurangnya dari penyebut. Jika penyebut bernilai 7, tentukan nilai pecahan tersebut dan gambarkan pada garis bilangan!</>,
    ex3s1: <>Penyebut <InlineMath math="b = 7" /></>,
    ex3s2: <>Pembilang = penyebut - 2, maka <InlineMath math="a = 7 - 2 = 5" /></>,
    ex3s3: "Pecahannya adalah:",
    ex3s4: <><InlineMath math="\frac{5}{7}" /> terletak di antara 0 dan 1, lebih dekat ke 1:</>,
    ex3ans: <>Jadi, pecahannya adalah <InlineMath math="\frac{5}{7}" /></>,
    numberLineFrac: "0 ─┼─ 1/7 ─┼─ 2/7 ─┼─ 3/7 ─┼─ 4/7 ─┼─ 5/7 ─┼─ 6/7 ─┼─ 1",
    sec2Title: "Pecahan Senilai",
    sec2SummaryBody: <>
      <strong className="text-primary">Pecahan senilai</strong> adalah pecahan-pecahan yang memiliki nilai sama meskipun ditulis dengan angka yang berbeda. Ibarat mengukur jarak yang sama dengan satuan berbeda - 1 meter sama dengan 100 sentimeter!
    </>,
    sec2VisualExample: <>
      <strong>Contoh Visual:</strong> Bayangkan sebuah pizza. Jika dipotong jadi 2 dan kamu ambil 1 potong (<InlineMath math="\frac{1}{2}" />), itu sama dengan mengambil 2 potong dari pizza yang dipotong jadi 4 (<InlineMath math="\frac{2}{4}" />), atau 3 potong dari pizza yang dipotong jadi 6 (<InlineMath math="\frac{3}{6}" />).
    </>,
    sec2FormulaTitle: "Rumus Pecahan Senilai:",
    sec2FormulaNote: <>dengan <InlineMath math="m, n \neq 0" /></>,
    sec2FormulaBody: <>Artinya, pecahan senilai diperoleh dengan <strong className="text-purple-300">mengalikan</strong> atau <strong className="text-purple-300">membagi</strong> pembilang dan penyebut dengan bilangan yang sama.</>,
    sec2Tip: <><strong>Tips Menyederhanakan Pecahan:</strong> Untuk mendapatkan bentuk paling sederhana, bagi pembilang dan penyebut dengan <strong>FPB (Faktor Persekutuan Terbesar)</strong> keduanya!</>,
    ex4Q: <>Tentukan 2 pecahan yang senilai dengan <InlineMath math="\frac{2}{3}" />!</>,
    ex4s1: "Kalikan pembilang dan penyebut dengan 2",
    ex4s2: "Kalikan pembilang dan penyebut dengan 3",
    ex4ans: <>Jadi, pecahan yang senilai dengan <InlineMath math="\frac{2}{3}" /> adalah <InlineMath math="\frac{4}{6}" /> dan <InlineMath math="\frac{6}{9}" /></>,
    ex5Q: <>Sederhanakan pecahan <InlineMath math="\frac{24}{56}" /> ke bentuk paling sederhana!</>,
    ex5s1: "Cari FPB dari 24 dan 56",
    ex5f24: "Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24",
    ex5f56: "Faktor 56: 1, 2, 4, 7, 8, 14, 28, 56",
    ex5gcd: "FPB = 8",
    ex5s2: "Bagi pembilang dan penyebut dengan FPB",
    ex5ans: <>Jadi, bentuk paling sederhana dari <InlineMath math="\frac{24}{56}" /> adalah <InlineMath math="\frac{3}{7}" /></>,
    ex6Q: <>Tentukan nilai <InlineMath math="x" /> jika <InlineMath math="\frac{3}{14} = \frac{x}{70}" /> adalah pecahan senilai!</>,
    ex6s1: "Cari pengali pada penyebut",
    ex6s2: "Karena penyebut dikali 5, maka pembilang juga harus dikali 5",
    ex6verify: "Verifikasi:",
    ex6ans: <>Jadi, nilai <InlineMath math="x = 15" /></>,
    sec3Title: "Membandingkan Dua Pecahan",
    sec3SummaryBody: <>Untuk <strong className="text-primary">membandingkan dua pecahan</strong>, kuncinya adalah menyamakan penyebut terlebih dahulu. Setelah penyebutnya sama, tinggal bandingkan pembilangnya. Sederhana, kan?</>,
    sec3RelTitle: "Tiga Kemungkinan Hubungan:",
    sec3Greater: "Lebih dari",
    sec3Less: "Kurang dari",
    sec3Equal: "Sama dengan",
    sec3StepsTitle: "Langkah-langkah Membandingkan:",
    sec3Steps: [
      <>Samakan penyebut kedua pecahan menggunakan <strong className="text-purple-300">KPK</strong></>,
      <>Ubah masing-masing pecahan ke bentuk senilai dengan penyebut yang sama</>,
      <>Bandingkan nilai pembilangnya</>,
    ],
    sec3QuickTip: <>
      <strong>Tips Cepat:</strong> Kamu juga bisa membandingkan dengan <strong>cross multiplication</strong>. Untuk <InlineMath math="\frac{a}{b}" /> dan <InlineMath math="\frac{p}{q}" />, bandingkan <InlineMath math="a \times q" /> dengan <InlineMath math="b \times p" />
    </>,
    ex7Q: <>Bandingkan pecahan <InlineMath math="\frac{3}{4}" /> dan <InlineMath math="\frac{3}{5}" />! Manakah yang lebih besar?</>,
    ex7s1: "Cari KPK dari 4 dan 5",
    ex7s1b: "KPK(4, 5) = 20",
    ex7s2: "Ubah ke penyebut 20",
    ex7s3: "Bandingkan pembilang: 15 > 12",
    ex7ans: <>Jadi, <InlineMath math="\frac{3}{4} > \frac{3}{5}" /></>,
    ex8Q: <>Tentukan hubungan antara <InlineMath math="\frac{2}{3}" /> dan <InlineMath math="\frac{3}{4}" />!</>,
    ex8method: "Metode Cross Multiplication:",
    ex8compare: <>Bandingkan <InlineMath math="2 \times 4" /> dengan <InlineMath math="3 \times 3" /></>,
    ex8because: "Karena 8 < 9",
    ex8ans: <>Maka, <InlineMath math="\frac{2}{3} < \frac{3}{4}" /></>,
    ex9Q: <>Urutkan pecahan berikut dari yang terkecil ke terbesar: <InlineMath math="\frac{7}{8}" />, <InlineMath math="\frac{11}{12}" />, <InlineMath math="\frac{2}{3}" /></>,
    ex9s1: "Cari KPK dari 8, 12, dan 3",
    ex9s1b: "KPK(8, 12, 3) = 24",
    ex9s2: "Ubah semua pecahan ke penyebut 24",
    ex9s3: "Bandingkan pembilang: 16 < 21 < 22",
    ex9ans: <>Jadi, urutan dari terkecil ke terbesar: <InlineMath math="\frac{2}{3} < \frac{7}{8} < \frac{11}{12}" /></>,
    noteTitle: "Catatan Penting",
    notes: [
      <>Penyebut pecahan tidak boleh nol (<InlineMath math="b \neq 0" />) karena pembagian dengan nol tidak terdefinisi.</>,
      <>Untuk menyederhanakan pecahan, selalu cari FPB dari pembilang dan penyebut.</>,
      <>Saat membandingkan pecahan dengan penyebut berbeda, gunakan KPK untuk menyamakan penyebutnya.</>,
    ],
    sumTitle: "🍕 RANGKUMAN LENGKAP",
    sumSubtitle: "Arti Pecahan & Bilangan Rasional — Kelas 7",
    sumSec1: "Konsep Dasar Pecahan",
    sumCards: [
      { label: "Pecahan = a/b", desc: "a = pembilang (bagian yang diambil), b = penyebut (jumlah bagian keseluruhan). Penyebut TIDAK boleh nol!", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
      { label: "Pecahan Senilai", desc: "a/b = (a×k)/(b×k) dan a/b = (a÷k)/(b÷k). Kalikan atau bagi pembilang dan penyebut dengan bilangan yang sama.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
      { label: "Menyederhanakan Pecahan", desc: "Bagi pembilang dan penyebut dengan FPB-nya. Contoh: 12/18 = 12÷6 / 18÷6 = 2/3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "Membandingkan Pecahan", desc: "Samakan penyebut dengan KPK terlebih dahulu. Setelah penyebut sama, bandingkan pembilangnya langsung.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Jenis Pecahan", desc: "Biasa (a/b), Campuran (c a/b), Desimal (0,75), Persen (75%). Semuanya bisa dikonversi satu sama lain!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
    ],
    sumSec2: "Tips & Trik Jitu",
    sumTips: [
      { icon: "🔑", tip: "FPB untuk menyederhanakan, KPK untuk menyamakan", detail: "Ini dua alat utama dalam semua operasi pecahan. Kuasai FPB dan KPK, dan pecahan tidak akan pernah sulit lagi!", color: "bg-emerald-900/30 border-emerald-500/30" },
      { icon: "👁️", tip: "Visualisasikan pecahan sebagai bagian kue/pizza", detail: "3/4 berarti 3 dari 4 potongan. Visualisasi ini membantu kamu mengerti operasi pecahan secara intuitif.", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "⚡", tip: "Kalikan silang untuk membandingkan dua pecahan", detail: "Untuk a/b dan c/d: kalikan silang a×d dan b×c. Jika a×d > b×c, maka a/b > c/d. Tidak perlu cari KPK!", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "✅", tip: "Selalu sederhanakan hasil akhirmu", detail: "Jawaban pecahan yang belum disederhanakan sering dianggap salah dalam ujian. Biasakan cari FPB di akhir!", color: "bg-blue-900/30 border-blue-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Pecahan adalah <strong className="text-emerald-300">bahasa matematika untuk menyatakan bagian dari keseluruhan</strong>. Dari belahan pizza hingga nilai ujian, dari takaran resep masakan hingga persentase diskon — pecahan ada di mana-mana! Dengan memahami arti, jenis, dan cara menyederhanakan pecahan, kamu siap untuk <strong className="text-yellow-300">menguasai semua operasi pecahan</strong> berikutnya!</>,
    tags: ["Pembilang/Penyebut", "Pecahan Senilai", "FPB untuk Sederhanakan", "KPK untuk Samakan", "Empat Jenis Pecahan"],
    nextLabel: "🚀 Lanjut ke operasi-operasi pecahan!",
    backBtn: "Kembali ke Bilangan Rasional",
    pecahanLabel: "Fraction",
    ex3s4label: "On the number line, ",
  },
  en: {
    pageTitle: "FRACTIONS: MEANING, EQUIVALENT FRACTIONS & COMPARING",
    pageSubtitle: "Grade 7 - Rational Numbers - Mathematics",
    sec1Title: "Meaning of Fractions",
    summaryLabel: "Key Summary",
    sec1SummaryBody: "is a number that describes part of a whole. Imagine you have a pizza cut evenly into several pieces. When you take some of those pieces, that is called a fraction!",
    sec1SummaryBold: "A fraction",
    imgAlt: "Illustration of equivalent fractions with pizza",
    imgCaption: <>All five pizzas above are the same size and each shows the shaded portion (pepperoni). Even though they are written differently (<InlineMath math="\frac{1}{2}, \frac{2}{4}, \frac{3}{6}, \frac{4}{8}, \frac{6}{12}" />), the amount of pizza taken is exactly the same — this is called an <strong className="text-green-300">Equivalent Fraction</strong>!</>,
    sec1Components: "Every fraction consists of two main components:",
    numeratorLabel: <>= <strong>Numerator</strong> (number above the line)</>,
    denominatorLabel: <>= <strong>Denominator</strong> (number below the line, <InlineMath math="b \neq 0" />)</>,
    visualExample: <><strong>Visual Example:</strong> If a cake is cut into <strong>4 equal pieces</strong> and you take <strong>3 pieces</strong>, your share is <InlineMath math="\frac{3}{4}" /> of the cake. Here, 3 is the numerator (pieces taken) and 4 is the denominator (total pieces).</>,
    properFraction: <><strong>A Proper Fraction</strong> is a fraction where the numerator is <strong>smaller</strong> than the denominator. Examples: <InlineMath math="\frac{1}{2}" />, <InlineMath math="\frac{3}{4}" />, <InlineMath math="\frac{5}{8}" /></>,
    numberLineTitle: "Position of Fractions on the Number Line:",
    numberLineBody: <>Fractions lie between two integers on the number line. For example, <InlineMath math="\frac{1}{2}" /> is exactly midway between 0 and 1.</>,
    numberLineLabel: "Number Line:",
    svgEqual: "← equal →",
    examplesHeader: "Example Problems and Solutions",
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    exLabel: "Example",
    discussLabel: "SOLUTION:",
    step: (n: number) => `Step ${n}:`,
    answerLabel: "Therefore,",
    ex1Q: "A chocolate bar is divided into 8 equal pieces. Dina ate 3 pieces. Express the portion Dina ate as a fraction!",
    ex1s1: "Determine the denominator (total pieces) = 8",
    ex1s2: "Determine the numerator (pieces eaten) = 3",
    ex1s3: "Write as a fraction:",
    ex1katex: "\\text{Dina's share} = \\frac{3}{8}",
    ex1ans: <>So, Dina ate <InlineMath math="\frac{3}{8}" /> of the chocolate bar.</>,
    ex2Q: "Express 45 minutes out of 1 hour as a fraction in its simplest form!",
    ex2s1: "Remember that 1 hour = 60 minutes",
    ex2s2: "Write as a fraction:",
    ex2s3: "Simplify by dividing numerator and denominator by their GCD (15):",
    ex2ans: <>So, 45 minutes = <InlineMath math="\frac{3}{4}" /> hour.</>,
    ex3Q: <>In fraction <InlineMath math="\frac{a}{b}" />, the numerator is 2 less than the denominator. If the denominator is 7, find the fraction and show it on the number line!</>,
    ex3s1: <>Denominator <InlineMath math="b = 7" /></>,
    ex3s2: <>Numerator = denominator − 2, so <InlineMath math="a = 7 - 2 = 5" /></>,
    ex3s3: "The fraction is:",
    ex3s4: <><InlineMath math="\frac{5}{7}" /> lies between 0 and 1, closer to 1:</>,
    ex3ans: <>So, the fraction is <InlineMath math="\frac{5}{7}" /></>,
    numberLineFrac: "0 ─┼─ 1/7 ─┼─ 2/7 ─┼─ 3/7 ─┼─ 4/7 ─┼─ 5/7 ─┼─ 6/7 ─┼─ 1",
    sec2Title: "Equivalent Fractions",
    sec2SummaryBody: <>
      <strong className="text-primary">Equivalent fractions</strong> are fractions that have the same value even though they are written with different numbers. Like measuring the same distance with different units — 1 metre equals 100 centimetres!
    </>,
    sec2VisualExample: <>
      <strong>Visual Example:</strong> Imagine a pizza. If cut into 2 and you take 1 piece (<InlineMath math="\frac{1}{2}" />), that equals taking 2 pieces from a pizza cut into 4 (<InlineMath math="\frac{2}{4}" />), or 3 pieces from one cut into 6 (<InlineMath math="\frac{3}{6}" />).
    </>,
    sec2FormulaTitle: "Equivalent Fraction Formula:",
    sec2FormulaNote: <>where <InlineMath math="m, n \neq 0" /></>,
    sec2FormulaBody: <>Equivalent fractions are obtained by <strong className="text-purple-300">multiplying</strong> or <strong className="text-purple-300">dividing</strong> both numerator and denominator by the same number.</>,
    sec2Tip: <><strong>Tip for Simplifying Fractions:</strong> To get the simplest form, divide both numerator and denominator by their <strong>GCD (Greatest Common Divisor)</strong>!</>,
    ex4Q: <>Find 2 fractions equivalent to <InlineMath math="\frac{2}{3}" />!</>,
    ex4s1: "Multiply numerator and denominator by 2",
    ex4s2: "Multiply numerator and denominator by 3",
    ex4ans: <>So, fractions equivalent to <InlineMath math="\frac{2}{3}" /> are <InlineMath math="\frac{4}{6}" /> and <InlineMath math="\frac{6}{9}" /></>,
    ex5Q: <>Simplify <InlineMath math="\frac{24}{56}" /> to its simplest form!</>,
    ex5s1: "Find the GCD of 24 and 56",
    ex5f24: "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24",
    ex5f56: "Factors of 56: 1, 2, 4, 7, 8, 14, 28, 56",
    ex5gcd: "GCD = 8",
    ex5s2: "Divide numerator and denominator by the GCD",
    ex5ans: <>So, the simplest form of <InlineMath math="\frac{24}{56}" /> is <InlineMath math="\frac{3}{7}" /></>,
    ex6Q: <>Find <InlineMath math="x" /> if <InlineMath math="\frac{3}{14} = \frac{x}{70}" /> is an equivalent fraction!</>,
    ex6s1: "Find the multiplier for the denominator",
    ex6s2: "Since the denominator is multiplied by 5, the numerator must also be multiplied by 5",
    ex6verify: "Verification:",
    ex6ans: <>So, <InlineMath math="x = 15" /></>,
    sec3Title: "Comparing Two Fractions",
    sec3SummaryBody: <>To <strong className="text-primary">compare two fractions</strong>, the key is to make the denominators equal first. Once denominators match, just compare the numerators. Simple!</>,
    sec3RelTitle: "Three Possible Relationships:",
    sec3Greater: "Greater than",
    sec3Less: "Less than",
    sec3Equal: "Equal to",
    sec3StepsTitle: "Steps for Comparing:",
    sec3Steps: [
      <>Make the denominators equal using the <strong className="text-purple-300">LCM</strong></>,
      <>Convert each fraction to an equivalent form with the same denominator</>,
      <>Compare the numerators</>,
    ],
    sec3QuickTip: <>
      <strong>Quick Tip:</strong> You can also compare using <strong>cross multiplication</strong>. For <InlineMath math="\frac{a}{b}" /> and <InlineMath math="\frac{p}{q}" />, compare <InlineMath math="a \times q" /> with <InlineMath math="b \times p" />
    </>,
    ex7Q: <>Compare <InlineMath math="\frac{3}{4}" /> and <InlineMath math="\frac{3}{5}" />! Which is larger?</>,
    ex7s1: "Find the LCM of 4 and 5",
    ex7s1b: "LCM(4, 5) = 20",
    ex7s2: "Convert to denominator 20",
    ex7s3: "Compare numerators: 15 > 12",
    ex7ans: <>So, <InlineMath math="\frac{3}{4} > \frac{3}{5}" /></>,
    ex8Q: <>Determine the relationship between <InlineMath math="\frac{2}{3}" /> and <InlineMath math="\frac{3}{4}" />!</>,
    ex8method: "Cross Multiplication Method:",
    ex8compare: <>Compare <InlineMath math="2 \times 4" /> with <InlineMath math="3 \times 3" /></>,
    ex8because: "Since 8 < 9",
    ex8ans: <>Therefore, <InlineMath math="\frac{2}{3} < \frac{3}{4}" /></>,
    ex9Q: <>Order the following fractions from smallest to largest: <InlineMath math="\frac{7}{8}" />, <InlineMath math="\frac{11}{12}" />, <InlineMath math="\frac{2}{3}" /></>,
    ex9s1: "Find the LCM of 8, 12, and 3",
    ex9s1b: "LCM(8, 12, 3) = 24",
    ex9s2: "Convert all fractions to denominator 24",
    ex9s3: "Compare numerators: 16 < 21 < 22",
    ex9ans: <>So, from smallest to largest: <InlineMath math="\frac{2}{3} < \frac{7}{8} < \frac{11}{12}" /></>,
    noteTitle: "Important Notes",
    notes: [
      <>The denominator of a fraction must not be zero (<InlineMath math="b \neq 0" />) because division by zero is undefined.</>,
      <>To simplify a fraction, always find the GCD of the numerator and denominator.</>,
      <>When comparing fractions with different denominators, use the LCM to equalise them.</>,
    ],
    sumTitle: "🍕 COMPLETE SUMMARY",
    sumSubtitle: "Fractions & Rational Numbers — Grade 7",
    sumSec1: "Basic Fraction Concepts",
    sumCards: [
      { label: "Fraction = a/b", desc: "a = numerator (portion taken), b = denominator (total parts). Denominator must NOT be zero!", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
      { label: "Equivalent Fractions", desc: "a/b = (a×k)/(b×k) and a/b = (a÷k)/(b÷k). Multiply or divide both numerator and denominator by the same number.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
      { label: "Simplifying Fractions", desc: "Divide numerator and denominator by their GCD. Example: 12/18 = 12÷6 / 18÷6 = 2/3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "Comparing Fractions", desc: "Equalise denominators with the LCM first. Once denominators match, compare numerators directly.", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "Types of Fractions", desc: "Proper (a/b), Mixed (c a/b), Decimal (0.75), Percent (75%). All can be converted into each other!", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
    ],
    sumSec2: "Tips & Tricks",
    sumTips: [
      { icon: "🔑", tip: "GCD to simplify, LCM to equalise", detail: "These are the two main tools in all fraction operations. Master GCD and LCM, and fractions will never be hard again!", color: "bg-emerald-900/30 border-emerald-500/30" },
      { icon: "👁️", tip: "Visualise fractions as slices of cake or pizza", detail: "3/4 means 3 out of 4 slices. This visualisation helps you understand fraction operations intuitively.", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "⚡", tip: "Cross-multiply to compare two fractions", detail: "For a/b and c/d: cross-multiply a×d and b×c. If a×d > b×c, then a/b > c/d. No need to find LCM!", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "✅", tip: "Always simplify your final answer", detail: "An unsimplified fraction answer is often marked wrong in exams. Make it a habit to find the GCD at the end!", color: "bg-blue-900/30 border-blue-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Fractions are the <strong className="text-emerald-300">mathematical language for expressing parts of a whole</strong>. From pizza slices to exam scores, from recipe measures to discount percentages — fractions are everywhere! By understanding the meaning, types, and simplification of fractions, you are ready to <strong className="text-yellow-300">master all fraction operations</strong> ahead!</>,
    tags: ["Numerator/Denominator", "Equivalent Fractions", "GCD to Simplify", "LCM to Equalise", "Four Types of Fractions"],
    nextLabel: "🚀 Continue to fraction operations!",
    backBtn: "Back to Rational Numbers",
    pecahanLabel: "Fraction",
    ex3s4label: "On the number line, ",
  },
  ja: {
    pageTitle: "分数の意味・等価分数・大小比較",
    pageSubtitle: "中学1年 - 有理数 - 数学",
    sec1Title: "分数の意味",
    summaryLabel: "要点まとめ",
    sec1SummaryBody: "は全体のうちの一部を表す数です。ピザを等分に切ったところを想像してください。その一部を取ったとき、それが分数です！",
    sec1SummaryBold: "分数",
    imgAlt: "ピザで等価分数を説明するイラスト",
    imgCaption: <>上の 5 枚のピザはすべて同じ大きさで、それぞれ塗られた部分（ペパロニ）を示しています。表記は異なっても（<InlineMath math="\frac{1}{2}, \frac{2}{4}, \frac{3}{6}, \frac{4}{8}, \frac{6}{12}" />）、取った量はまったく同じです — これが<strong className="text-green-300">等価分数</strong>です！</>,
    sec1Components: "すべての分数は 2 つの主要な要素で構成されています：",
    numeratorLabel: <>= <strong>分子</strong>（線の上の数）</>,
    denominatorLabel: <>= <strong>分母</strong>（線の下の数、<InlineMath math="b \neq 0" />）</>,
    visualExample: <><strong>視覚的な例：</strong>ケーキを<strong>4 等分</strong>して<strong>3 切れ</strong>取ると、あなたの分は <InlineMath math="\frac{3}{4}" /> です。ここで 3 が分子（取った部分）、4 が分母（全体の部分数）です。</>,
    properFraction: <><strong>真分数</strong>とは分子が分母より<strong>小さい</strong>分数です。例：<InlineMath math="\frac{1}{2}" />、<InlineMath math="\frac{3}{4}" />、<InlineMath math="\frac{5}{8}" /></>,
    numberLineTitle: "数直線上の分数の位置：",
    numberLineBody: <>分数は数直線上の 2 つの整数の間にあります。例えば <InlineMath math="\frac{1}{2}" /> は 0 と 1 のちょうど真ん中にあります。</>,
    numberLineLabel: "数直線：",
    svgEqual: "← 等しい →",
    examplesHeader: "例題と解説",
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    exLabel: "例題",
    discussLabel: "解説：",
    step: (n: number) => `手順 ${n}：`,
    answerLabel: "よって、",
    ex1Q: "チョコレートバーを 8 等分しました。Dina は 3 切れ食べました。Dina が食べた部分を分数で表せ！",
    ex1s1: "分母（全体の数）= 8 を求める",
    ex1s2: "分子（食べた数）= 3 を求める",
    ex1s3: "分数で表す：",
    ex1katex: "\\text{Dina の分} = \\frac{3}{8}",
    ex1ans: <>よって、Dina はチョコレートの <InlineMath math="\frac{3}{8}" /> を食べました。</>,
    ex2Q: "1 時間のうちの 45 分を、最も簡単な分数で表せ！",
    ex2s1: "1 時間 = 60 分を確認する",
    ex2s2: "分数で表す：",
    ex2s3: "GCD（= 15）で分子と分母を割って約分する：",
    ex2ans: <>よって、45 分 = <InlineMath math="\frac{3}{4}" /> 時間。</>,
    ex3Q: <>分数 <InlineMath math="\frac{a}{b}" /> で、分子は分母より 2 小さい。分母が 7 のとき、分数を求め、数直線に示せ！</>,
    ex3s1: <>分母 <InlineMath math="b = 7" /></>,
    ex3s2: <>分子 = 分母 - 2、なので <InlineMath math="a = 7 - 2 = 5" /></>,
    ex3s3: "分数は：",
    ex3s4: <><InlineMath math="\frac{5}{7}" /> は 0 と 1 の間、1 に近い：</>,
    ex3ans: <>よって、分数は <InlineMath math="\frac{5}{7}" /></>,
    numberLineFrac: "0 ─┼─ 1/7 ─┼─ 2/7 ─┼─ 3/7 ─┼─ 4/7 ─┼─ 5/7 ─┼─ 6/7 ─┼─ 1",
    sec2Title: "等価分数",
    sec2SummaryBody: <>
      <strong className="text-primary">等価分数</strong>とは、異なる数で書かれていても同じ値を持つ分数です。異なる単位で同じ距離を測るようなもの — 1 メートルは 100 センチメートルと同じ！
    </>,
    sec2VisualExample: <>
      <strong>視覚的な例：</strong>ピザを 2 等分して 1 切れ取る（<InlineMath math="\frac{1}{2}" />）のは、4 等分して 2 切れ取る（<InlineMath math="\frac{2}{4}" />）や、6 等分して 3 切れ取る（<InlineMath math="\frac{3}{6}" />）と同じです。
    </>,
    sec2FormulaTitle: "等価分数の公式：",
    sec2FormulaNote: <><InlineMath math="m, n \neq 0" /> のとき</>,
    sec2FormulaBody: <>等価分数は分子と分母を同じ数で <strong className="text-purple-300">掛ける</strong> か <strong className="text-purple-300">割る</strong> ことで得られます。</>,
    sec2Tip: <><strong>分数を約分するコツ：</strong>最も簡単な形を得るには、分子と分母を <strong>GCD（最大公約数）</strong>で割りましょう！</>,
    ex4Q: <><InlineMath math="\frac{2}{3}" /> と等価な分数を 2 つ求めよ！</>,
    ex4s1: "分子と分母に 2 を掛ける",
    ex4s2: "分子と分母に 3 を掛ける",
    ex4ans: <>よって、<InlineMath math="\frac{2}{3}" /> と等価な分数は <InlineMath math="\frac{4}{6}" /> と <InlineMath math="\frac{6}{9}" /></>,
    ex5Q: <><InlineMath math="\frac{24}{56}" /> を最も簡単な形に約分せよ！</>,
    ex5s1: "24 と 56 の GCD を求める",
    ex5f24: "24 の因数：1, 2, 3, 4, 6, 8, 12, 24",
    ex5f56: "56 の因数：1, 2, 4, 7, 8, 14, 28, 56",
    ex5gcd: "GCD = 8",
    ex5s2: "分子と分母を GCD で割る",
    ex5ans: <>よって、<InlineMath math="\frac{24}{56}" /> の最も簡単な形は <InlineMath math="\frac{3}{7}" /></>,
    ex6Q: <><InlineMath math="\frac{3}{14} = \frac{x}{70}" /> が等価分数のとき、<InlineMath math="x" /> の値を求めよ！</>,
    ex6s1: "分母の乗数を求める",
    ex6s2: "分母が 5 倍なので、分子も 5 倍にする",
    ex6verify: "確認：",
    ex6ans: <>よって、<InlineMath math="x = 15" /></>,
    sec3Title: "2 つの分数の大小比較",
    sec3SummaryBody: <><strong className="text-primary">2 つの分数を比較する</strong>には、まず分母を揃えることが鍵です。分母が揃ったら、分子を比較するだけ。簡単でしょ？</>,
    sec3RelTitle: "3 つの関係の可能性：",
    sec3Greater: "より大きい",
    sec3Less: "より小さい",
    sec3Equal: "等しい",
    sec3StepsTitle: "比較の手順：",
    sec3Steps: [
      <><strong className="text-purple-300">LCM（最小公倍数）</strong>を使って分母を揃える</>,
      <>それぞれの分数を同じ分母の等価分数に変換する</>,
      <>分子を比較する</>,
    ],
    sec3QuickTip: <>
      <strong>クイックヒント：</strong><strong>たすき掛け</strong>でも比較できます。<InlineMath math="\frac{a}{b}" /> と <InlineMath math="\frac{p}{q}" /> では、<InlineMath math="a \times q" /> と <InlineMath math="b \times p" /> を比べます
    </>,
    ex7Q: <><InlineMath math="\frac{3}{4}" /> と <InlineMath math="\frac{3}{5}" /> を比較せよ！どちらが大きいか？</>,
    ex7s1: "4 と 5 の LCM を求める",
    ex7s1b: "LCM(4, 5) = 20",
    ex7s2: "分母を 20 に変換する",
    ex7s3: "分子を比較する：15 > 12",
    ex7ans: <>よって、<InlineMath math="\frac{3}{4} > \frac{3}{5}" /></>,
    ex8Q: <><InlineMath math="\frac{2}{3}" /> と <InlineMath math="\frac{3}{4}" /> の関係を求めよ！</>,
    ex8method: "たすき掛け法：",
    ex8compare: <><InlineMath math="2 \times 4" /> と <InlineMath math="3 \times 3" /> を比べる</>,
    ex8because: "8 < 9 なので",
    ex8ans: <>よって、<InlineMath math="\frac{2}{3} < \frac{3}{4}" /></>,
    ex9Q: <>次の分数を小さい順に並べよ：<InlineMath math="\frac{7}{8}" />、<InlineMath math="\frac{11}{12}" />、<InlineMath math="\frac{2}{3}" /></>,
    ex9s1: "8、12、3 の LCM を求める",
    ex9s1b: "LCM(8, 12, 3) = 24",
    ex9s2: "すべての分数を分母 24 に変換する",
    ex9s3: "分子を比較する：16 < 21 < 22",
    ex9ans: <>よって、小さい順：<InlineMath math="\frac{2}{3} < \frac{7}{8} < \frac{11}{12}" /></>,
    noteTitle: "重要なメモ",
    notes: [
      <>分母はゼロにできない（<InlineMath math="b \neq 0" />）— ゼロ除算は定義されていないため。</>,
      <>分数を約分するには、常に分子と分母の GCD を求める。</>,
      <>異なる分母の分数を比較するときは、LCM で分母を揃える。</>,
    ],
    sumTitle: "🍕 完全まとめ",
    sumSubtitle: "分数の意味と有理数 — 中学1年",
    sumSec1: "分数の基本概念",
    sumCards: [
      { label: "分数 = a/b", desc: "a = 分子（取った部分）、b = 分母（全体の部分数）。分母はゼロにできない！", color: "from-emerald-900/70 to-emerald-800/30 border-emerald-500/50 text-emerald-200" },
      { label: "等価分数", desc: "a/b = (a×k)/(b×k) かつ a/b = (a÷k)/(b÷k)。分子と分母を同じ数で掛けるか割る。", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
      { label: "分数の約分", desc: "分子と分母を GCD で割る。例：12/18 = 12÷6 / 18÷6 = 2/3", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200" },
      { label: "分数の大小比較", desc: "まず LCM で分母を揃える。分母が揃ったら分子を直接比較する。", color: "from-blue-900/70 to-blue-800/30 border-blue-500/50 text-blue-200" },
      { label: "分数の種類", desc: "真分数 (a/b)、帯分数 (c a/b)、小数 (0.75)、パーセント (75%)。すべて相互変換できる！", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200" },
    ],
    sumSec2: "ヒントとコツ",
    sumTips: [
      { icon: "🔑", tip: "約分に GCD、分母揃えに LCM", detail: "これらは分数演算の 2 つの主要ツールです。GCD と LCM をマスターすれば、分数は難しくない！", color: "bg-emerald-900/30 border-emerald-500/30" },
      { icon: "👁️", tip: "分数をケーキやピザのスライスとして視覚化する", detail: "3/4 は 4 切れのうちの 3 切れ。この視覚化で分数演算を直感的に理解できます。", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "⚡", tip: "2 つの分数を比較するときはたすき掛け", detail: "a/b と c/d に対して：a×d と b×c を計算する。a×d > b×c なら a/b > c/d。LCM 不要！", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "✅", tip: "最終的な答えは必ず約分する", detail: "約分されていない分数の答えはテストで不正解とされることがよくあります。最後に GCD を求める習慣を！", color: "bg-blue-900/30 border-blue-500/30" },
    ],
    conclusionTitle: "結論",
    conclusionBody: <>分数は<strong className="text-emerald-300">全体の一部を表す数学の言語</strong>です。ピザのスライスからテストの点数まで、料理の計量から割引率まで — 分数はあらゆるところにあります！分数の意味、種類、約分を理解すれば、これから先の<strong className="text-yellow-300">すべての分数演算をマスターする</strong>準備ができています！</>,
    tags: ["分子/分母", "等価分数", "GCD で約分", "LCM で分母揃え", "4 種類の分数"],
    nextLabel: "🚀 分数の演算へ進もう！",
    backBtn: "有理数に戻る",
    pecahanLabel: "分数",
    ex3s4label: "数直線上では、",
  },
};

const ArtiPecahanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(["arti-pecahan", "pecahan-senilai", "membandingkan"]);
  const t = translations[language];

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.pageSubtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section 1: Arti Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.sec1Title}</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t.summaryLabel}
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-4">
                    <strong className="text-primary">{t.sec1SummaryBold}</strong> {t.sec1SummaryBody}
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <img src="/pizza_pecahan.jpg" alt={t.imgAlt} className="w-full rounded-lg object-cover" />
                    <p className="font-body text-xs text-white/60 text-center leading-relaxed">{t.imgCaption}</p>
                  </div>
                </div>

                <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec1Components}</p>

                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-bold text-primary"><InlineMath math="\frac{a}{b}" /></div>
                    <div className="flex flex-col gap-1 text-sm font-body">
                      <p className="text-cyan-300"><InlineMath math="a" /> {t.numeratorLabel}</p>
                      <p className="text-yellow-300"><InlineMath math="b" /> {t.denominatorLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">{t.visualExample}</p>
                </div>
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <p className="font-body text-sm text-accent leading-relaxed">{t.properFraction}</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.numberLineTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">{t.numberLineBody}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <p className="text-white/60 text-xs text-center mb-3">{t.numberLineLabel}</p>
                    <svg viewBox="0 0 320 60" className="w-full max-w-sm mx-auto" aria-label={t.numberLineLabel}>
                      <line x1="20" y1="30" x2="300" y2="30" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round"/>
                      <polygon points="300,30 292,25 292,35" fill="#facc15"/>
                      <line x1="60" y1="22" x2="60" y2="38" stroke="#facc15" strokeWidth="2"/>
                      <text x="60" y="52" textAnchor="middle" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">0</text>
                      <line x1="160" y1="20" x2="160" y2="40" stroke="#67e8f9" strokeWidth="2"/>
                      <circle cx="160" cy="30" r="4" fill="#67e8f9"/>
                      <text x="160" y="15" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">1/2</text>
                      <line x1="260" y1="22" x2="260" y2="38" stroke="#facc15" strokeWidth="2"/>
                      <text x="260" y="52" textAnchor="middle" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">1</text>
                      <text x="110" y="24" textAnchor="middle" fill="#ffffff60" fontSize="8">{t.svgEqual}</text>
                      <text x="210" y="24" textAnchor="middle" fill="#ffffff60" fontSize="8">{t.svgEqual}</text>
                    </svg>
                  </div>
                </div>

                {/* Examples Section 1 */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesHeader}
                  </p>

                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeEasy}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex1Q}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex1s1}</p>
                        <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                        <p><strong>{t.step(3)}</strong> {t.ex1s3}</p>
                        <div className="bg-slate-900/50 rounded p-3 mt-2">
                          <BlockMath math={t.ex1katex} />
                        </div>
                        <p className="text-primary font-semibold">{t.ex1ans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMedium}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex2Q}</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex2s1}</p>
                        <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\frac{45}{60}" /></div>
                        <p><strong>{t.step(3)}</strong> {t.ex2s3}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\frac{45}{60} = \frac{45 \div 15}{60 \div 15} = \frac{3}{4}" /></div>
                        <p className="text-primary font-semibold">{t.ex2ans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeHard}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex3Q}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex3s1}</p>
                        <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                        <p><strong>{t.step(3)}</strong> {t.ex3s3}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\frac{a}{b} = \frac{5}{7}" /></div>
                        <p><strong>{t.step(4)}</strong> {t.ex3s4}</p>
                        <div className="bg-slate-900/50 rounded p-3 font-mono text-xs text-center overflow-x-auto">
                          <p className="text-primary whitespace-nowrap">{t.numberLineFrac}</p>
                          <p className="text-green-400 mt-1">{"                                        ↑"}</p>
                        </div>
                        <p className="text-primary font-semibold">{t.ex3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Equivalent Fractions */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Equal className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">{t.sec2Title}</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t.summaryLabel}
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec2SummaryBody}</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">{t.sec2VisualExample}</p>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-lg font-bold text-primary"><InlineMath math="\frac{1}{2}" /></p>
                  </div>
                  <div className="flex items-center justify-center text-white/50">=</div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-lg font-bold text-cyan-400"><InlineMath math="\frac{2}{4}" /></p>
                  </div>
                  <div className="flex items-center justify-center text-white/50">=</div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-lg font-bold text-yellow-400"><InlineMath math="\frac{3}{6}" /></p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.sec2FormulaTitle}</p>
                  <div className="bg-slate-900/50 rounded p-4 text-center">
                    <BlockMath math="\frac{a}{b} = \frac{a \times m}{b \times m} = \frac{a \div n}{b \div n}" />
                    <p className="text-white/60 text-xs mt-2">{t.sec2FormulaNote}</p>
                  </div>
                  <p className="font-body text-sm text-white/70 mt-3 leading-relaxed">{t.sec2FormulaBody}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec2Tip}</p>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesHeader}
                  </p>

                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeEasy}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex4Q}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex4s1}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\frac{2}{3} = \frac{2 \times 2}{3 \times 2} = \frac{4}{6}" /></div>
                        <p><strong>{t.step(2)}</strong> {t.ex4s2}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\frac{2}{3} = \frac{2 \times 3}{3 \times 3} = \frac{6}{9}" /></div>
                        <p className="text-primary font-semibold">{t.ex4ans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMedium}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex5Q}</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex5s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p className="text-white/70 text-xs">{t.ex5f24}</p>
                          <p className="text-white/70 text-xs">{t.ex5f56}</p>
                          <p className="text-cyan-300 text-sm mt-1">{t.ex5gcd}</p>
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex5s2}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\frac{24}{56} = \frac{24 \div 8}{56 \div 8} = \frac{3}{7}" /></div>
                        <p className="text-primary font-semibold">{t.ex5ans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeHard}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex6Q}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex6s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="14 \times ? = 70" />
                          <BlockMath math="? = 70 \div 14 = 5" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex6s2}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="x = 3 \times 5 = 15" /></div>
                        <p><strong>{t.ex6verify}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\frac{3}{14} = \frac{3 \times 5}{14 \times 5} = \frac{15}{70}" /></div>
                        <p className="text-primary font-semibold">{t.ex6ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Comparing */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-purple-400" />
                <span className="font-body font-semibold text-white">{t.sec3Title}</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t.summaryLabel}
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec3SummaryBody}</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.sec3RelTitle}</p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-slate-900/50 rounded p-3 text-center">
                      <p className="text-green-400 text-lg font-bold"><InlineMath math="\frac{a}{b} > \frac{p}{q}" /></p>
                      <p className="text-white/60 text-xs mt-1">{t.sec3Greater}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 text-center">
                      <p className="text-red-400 text-lg font-bold"><InlineMath math="\frac{a}{b} < \frac{p}{q}" /></p>
                      <p className="text-white/60 text-xs mt-1">{t.sec3Less}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 text-center">
                      <p className="text-yellow-400 text-lg font-bold"><InlineMath math="\frac{a}{b} = \frac{p}{q}" /></p>
                      <p className="text-white/60 text-xs mt-1">{t.sec3Equal}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.sec3StepsTitle}</p>
                  <ol className="font-body text-sm text-white/80 space-y-2 list-decimal ml-4">
                    {t.sec3Steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec3QuickTip}</p>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesHeader}
                  </p>

                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeEasy}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex7Q}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex7s1}</p>
                        <div className="bg-slate-900/50 rounded p-3"><p>{t.ex7s1b}</p></div>
                        <p><strong>{t.step(2)}</strong> {t.ex7s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{4} = \frac{3 \times 5}{4 \times 5} = \frac{15}{20}" />
                          <BlockMath math="\frac{3}{5} = \frac{3 \times 4}{5 \times 4} = \frac{12}{20}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex7s3}</p>
                        <p className="text-primary font-semibold">{t.ex7ans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMedium}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex8Q}</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.ex8method}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <p>{t.ex8compare}</p>
                          <BlockMath math="2 \times 4 = 8" />
                          <BlockMath math="3 \times 3 = 9" />
                          <p className="text-cyan-300 mt-2">{t.ex8because}</p>
                        </div>
                        <p className="text-primary font-semibold">{t.ex8ans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeHard}</span>
                      <span className="font-body font-semibold text-white">{t.exLabel} 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex9Q}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discussLabel}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex9s1}</p>
                        <div className="bg-slate-900/50 rounded p-3"><p>{t.ex9s1b}</p></div>
                        <p><strong>{t.step(2)}</strong> {t.ex9s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{7}{8} = \frac{7 \times 3}{8 \times 3} = \frac{21}{24}" />
                          <BlockMath math="\frac{11}{12} = \frac{11 \times 2}{12 \times 2} = \frac{22}{24}" />
                          <BlockMath math="\frac{2}{3} = \frac{2 \times 8}{3 \times 8} = \frac{16}{24}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex9s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{16}{24} < \frac{21}{24} < \frac{22}{24}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex9ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> {t.noteTitle}
            </p>
            <ul className="font-body text-sm text-white/70 leading-relaxed space-y-2">
              {t.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>

          {/* Summary */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-[10px]">1</span>
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
              <div className="bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌍</div>
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

export default ArtiPecahanPage;
