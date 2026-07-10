import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, Plus, Minus, RefreshCw } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import FractionCircleAnimation from "@/components/FractionCircleAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PENJUMLAHAN DAN PENGURANGAN PECAHAN",
    pageSubtitle: "Kelas 7 - Bilangan Rasional - Materi Matematika",
    summaryLabel: "Ringkasan Intisari",
    examplesLabel: "Contoh Soal dan Pembahasan",
    step: (n: number) => `Langkah ${n}:`,
    discuss: "PEMBAHASAN:",
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    ex: (n: number) => `Contoh ${n}`,

    sec1Title: "Penjumlahan Pecahan",
    sec1Summary: <><strong className="text-primary">Penjumlahan pecahan</strong> adalah operasi menggabungkan dua pecahan atau lebih menjadi satu nilai. Kunci utamanya ada pada <strong>penyebut</strong>: jika penyebutnya sama, langsung jumlahkan pembilangnya. Jika berbeda, samakan dulu penyebutnya menggunakan KPK!</>,
    sec1FormulaTitle: "Rumus Penjumlahan Pecahan:",
    sec1SameDen: "Jika penyebut sama:",
    sec1DiffDen: "Jika penyebut berbeda:",
    sec1OrLCM: "atau gunakan KPK dari penyebut",
    sec1Visual: <><strong>Visualisasi:</strong> Bayangkan kamu punya <InlineMath math="\frac{2}{4}" /> bagian pizza dan temanmu memberi <InlineMath math="\frac{1}{4}" /> bagian lagi. Total yang kamu punya adalah <InlineMath math="\frac{2+1}{4} = \frac{3}{4}" /> bagian pizza!</>,
    sec1Tip: <><strong>Tips Penting:</strong> Selalu sederhanakan hasil akhir jika memungkinkan! Jika hasilnya berupa pecahan tidak murni (pembilang lebih besar dari penyebut), ubah menjadi pecahan campuran.</>,

    ex1Q: <>Hitunglah <InlineMath math="\frac{5}{12} + \frac{3}{12}" /></>,
    ex1s1: "Perhatikan penyebutnya sudah sama (12)",
    ex1s2: "Langsung jumlahkan pembilangnya:",
    ex1s3: "Sederhanakan dengan membagi FPB (4):",
    ex1ans: <>Jadi, <InlineMath math="\frac{5}{12} + \frac{3}{12} = \frac{2}{3}" /></>,

    ex2Q: <>Hitunglah <InlineMath math="1\frac{1}{6} + 3\frac{7}{8}" /></>,
    ex2s1: "Tentukan KPK dari 6 dan 8 = 24",
    ex2s2: "Samakan penyebut kedua pecahan:",
    ex2s3: "Jumlahkan bilangan bulat dan pecahannya:",
    ex2s4: <>Karena <InlineMath math="\frac{25}{24} > 1" />, ubah ke pecahan campuran:</>,
    ex2ans: <>Jadi, <InlineMath math="1\frac{1}{6} + 3\frac{7}{8} = 5\frac{1}{24}" /></>,

    ex3Q: <>Sebuah mobil angkutan mengangkut sepeda motor dari dealer A dengan berat <InlineMath math="130\frac{1}{4}" /> kg, dan dari dealer B dengan berat <InlineMath math="128\frac{3}{8}" /> kg. Berapa kilogram total berat beban yang diangkut?</>,
    ex3s1: "Identifikasi yang dijumlahkan:",
    ex3katex1: "\\text{Total} = 130\\frac{1}{4} + 128\\frac{3}{8}",
    ex3s2: "Tentukan KPK dari 4 dan 8 = 8",
    ex3s3: "Samakan penyebut:",
    ex3s4: "Jumlahkan:",
    ex3ans: <>Jadi, total berat beban adalah <InlineMath math="258\frac{5}{8}" /> kg</>,

    sec2Title: "Sifat-Sifat Penjumlahan Pecahan",
    sec2Summary: <>Penjumlahan pecahan memiliki <strong className="text-primary">dua sifat penting</strong> yang dapat mempermudah perhitungan: <strong>Sifat Komutatif</strong> (pertukaran) dan <strong>Sifat Asosiatif</strong> (pengelompokan).</>,
    sec2Comm: "1. Sifat Komutatif (Pertukaran)",
    sec2CommDesc: "Urutan penjumlahan tidak memengaruhi hasil. Mau dijumlahkan dari kiri atau kanan, hasilnya tetap sama!",
    sec2CommEx: <>Contoh: <InlineMath math="\frac{1}{2} + \frac{3}{4} = \frac{3}{4} + \frac{1}{2} = \frac{5}{4}" /></>,
    sec2Assoc: "2. Sifat Asosiatif (Pengelompokan)",
    sec2AssocDesc: "Cara pengelompokan tidak memengaruhi hasil. Kamu bebas menjumlahkan yang mana dulu!",
    sec2AssocEx: <>Contoh: <InlineMath math="\left(\frac{1}{2} + \frac{1}{4}\right) + \frac{1}{8} = \frac{1}{2} + \left(\frac{1}{4} + \frac{1}{8}\right) = \frac{7}{8}" /></>,
    sec2Tip: <><strong>Tips:</strong> Gunakan sifat-sifat ini untuk mempermudah perhitungan! Misalnya, kelompokkan pecahan dengan penyebut sama terlebih dahulu.</>,

    ex4Q: <>Buktikan bahwa <InlineMath math="\frac{2}{5} + \frac{1}{3} = \frac{1}{3} + \frac{2}{5}" /></>,
    ex4Left: "Ruas Kiri:",
    ex4Right: "Ruas Kanan:",
    ex4ans: <>Terbukti keduanya sama = <InlineMath math="\frac{11}{15}" /> (Sifat Komutatif)</>,

    ex5Q: <>Hitunglah <InlineMath math="\frac{3}{10} + \frac{1}{7} + \frac{7}{10}" /> dengan cara yang efisien!</>,
    ex5s1: "Gunakan sifat komutatif, kelompokkan penyebut sama:",
    ex5s2: "Hitung pecahan dengan penyebut sama terlebih dahulu:",
    ex5ans: <>Jadi, hasilnya adalah <InlineMath math="1\frac{1}{7}" /></>,

    ex6Q: <>Hitunglah <InlineMath math="5\frac{2}{3} + 6\frac{1}{4} + 4\frac{1}{2}" /> dengan menggunakan sifat asosiatif!</>,
    ex6s1: "Jumlahkan bilangan bulat terlebih dahulu:",
    ex6s2: "Tentukan KPK dari 3, 4, dan 2 = 12",
    ex6s3: "Samakan penyebut pecahan:",
    ex6s4: "Jumlahkan pecahannya:",
    ex6s5: "Gabungkan dengan bilangan bulat:",
    ex6ans: <>Jadi, hasilnya adalah <InlineMath math="16\frac{5}{12}" /></>,

    sec3Title: "Pengurangan Pecahan",
    sec3Summary: <><strong className="text-primary">Pengurangan pecahan</strong> adalah operasi mengurangkan satu pecahan dari pecahan lainnya. Prinsipnya mirip dengan penjumlahan: <strong>samakan penyebut</strong> terlebih dahulu, baru kurangkan pembilangnya!</>,
    sec3FormulaTitle: "Rumus Pengurangan Pecahan:",
    sec3Warning: <><strong>Perhatian!</strong> Berbeda dengan penjumlahan, pengurangan <strong>tidak memiliki sifat komutatif</strong>. Artinya, <InlineMath math="\frac{a}{b} - \frac{c}{d} \neq \frac{c}{d} - \frac{a}{b}" /></>,

    ex7Q: <>Hitunglah <InlineMath math="\frac{5}{9} - \frac{2}{9}" /></>,
    ex7s1: "Penyebut sudah sama (9)",
    ex7s2: "Kurangkan pembilangnya:",
    ex7s3: "Sederhanakan:",
    ex7ans: <>Jadi, <InlineMath math="\frac{5}{9} - \frac{2}{9} = \frac{1}{3}" /></>,

    ex8Q: <>Hitunglah <InlineMath math="\frac{3}{4} - \frac{1}{6}" /></>,
    ex8s1: "Penyebut berbeda, cari KPK dari 4 dan 6 = 12",
    ex8s2: "Samakan penyebut:",
    ex8s3: "Kurangkan:",
    ex8ans: <>Jadi, <InlineMath math="\frac{3}{4} - \frac{1}{6} = \frac{7}{12}" /></>,

    ex9Q: <>Seseorang mendapat upah Rp840.000 sebulan. Seperenam dari upah digunakan untuk sewa rumah, <InlineMath math="\frac{2}{5}" /> bagian untuk kebutuhan makan. Berapa rupiah yang digunakan untuk keperluan lain?</>,
    ex9s1: "Hitung bagian untuk keperluan lain:",
    ex9katex1: "\\text{Keperluan lain} = 1 - \\frac{1}{6} - \\frac{2}{5}",
    ex9s2: "Cari KPK dari 6 dan 5 = 30, samakan penyebut:",
    ex9s3: "Kurangkan:",
    ex9s4: "Hitung uang untuk keperluan lain:",
    ex9katex4: "= \\frac{13}{30} \\times 840.000 = \\text{Rp}364.000",
    ex9ans: "Jadi, uang untuk keperluan lain adalah Rp364.000",

    sec4Title: "Penjumlahan dan Pengurangan Pecahan Negatif",
    sec4Summary: <><strong className="text-primary">Pecahan negatif</strong> adalah pecahan yang nilainya kurang dari nol. Operasi penjumlahan dan pengurangan pada pecahan negatif mengikuti aturan yang sama dengan bilangan bulat negatif, dikombinasikan dengan aturan pecahan.</>,
    sec4FormTitle: "Bentuk Penulisan Pecahan Negatif:",
    sec4FormNote: "Ketiga bentuk di atas nilainya sama",
    sec4RulesTitle: "Aturan Tanda:",
    sec4Rules: [
      "Positif + Positif = Positif",
      "Negatif + Negatif = Negatif (jumlahkan, beri tanda negatif)",
      "Positif + Negatif = Kurangkan, ikuti tanda yang lebih besar",
      "Dikurangi bilangan negatif = Ditambah bilangan positif",
    ],
    sec4Tip: <><strong>Tips:</strong> Ingat bahwa mengurangi bilangan negatif sama dengan menambah bilangan positif: <InlineMath math="a - (-b) = a + b" /></>,

    ex10Q: <>Hitunglah <InlineMath math="-\frac{3}{8} + \left(-\frac{7}{8}\right)" /></>,
    ex10s1: "Kedua pecahan negatif, maka jumlahkan nilainya dan beri tanda negatif:",
    ex10s2: "Sederhanakan:",
    ex10ans: <>Jadi, hasilnya adalah <InlineMath math="-1\frac{1}{4}" /></>,

    ex11Q: <>Hitunglah <InlineMath math="\frac{5}{6} - \left(-\frac{1}{4}\right)" /></>,
    ex11s1: "Ubah pengurangan negatif menjadi penjumlahan:",
    ex11s2: "Samakan penyebut (KPK 6 dan 4 = 12):",
    ex11ans: <>Jadi, hasilnya adalah <InlineMath math="1\frac{1}{12}" /></>,

    ex12Q: <>Hitunglah <InlineMath math="-3\frac{1}{3} - \left(-5\frac{1}{2}\right) + \left(-2\frac{1}{6}\right)" /></>,
    ex12s1: "Sederhanakan tanda operasi:",
    ex12s2: "Ubah ke pecahan biasa dengan penyebut sama (KPK = 6):",
    ex12s3: "Hitung dari kiri ke kanan:",
    ex12ans: "Jadi, hasilnya adalah 0",

    sumTitle: "➕➖ RANGKUMAN LENGKAP",
    sumSubtitle: "Penjumlahan & Pengurangan Pecahan — Kelas 7",
    sumSec1Label: "Aturan Penjumlahan & Pengurangan Pecahan",
    sumCards: [
      { label: "Penyebut SAMA → Langsung operasikan", desc: "a/b + c/b = (a+c)/b dan a/b − c/b = (a−c)/b. Hanya pembilang yang dijumlahkan/dikurangi, penyebut tetap!", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
      { label: "Penyebut BEDA → Samakan dulu dengan KPK", desc: "Cari KPK penyebut. Ubah semua pecahan ke penyebut KPK. Baru jumlah/kurangi pembilangnya.", color: "from-lime-900/70 to-lime-800/30 border-lime-500/50 text-lime-200" },
      { label: "Pecahan Campuran → Ubah ke biasa dulu", desc: "2 3/4 = (2×4+3)/4 = 11/4. Ubah semua pecahan campuran ke bentuk biasa sebelum dioperasikan.", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
      { label: "Sederhanakan hasil akhir!", desc: "Setelah menjumlah/mengurangi, selalu cek apakah hasilnya bisa disederhanakan dengan FPB.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
    ],
    sumSec2Label: "Tips & Trik Jitu",
    sumTips: [
      { icon: "🎯", tip: "Jangan pernah langsung menjumlah penyebut!", detail: "3/4 + 1/2 ≠ 4/6. Ini kesalahan paling umum! Selalu samakan penyebut dulu dengan KPK: 3/4 + 2/4 = 5/4.", color: "bg-red-900/30 border-red-500/30" },
      { icon: "⚡", tip: "Gunakan KPK, bukan perkalian langsung", detail: "Untuk 1/6 + 1/4, KPK = 12 (bukan 24). Menggunakan KPK membuat pecahan lebih kecil dan mudah disederhanakan.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔄", tip: "Tiga pecahan sekaligus? Tetap samakan semua dulu", detail: "Cari KPK dari ketiga penyebut sekaligus, ubah semua ke penyebut yang sama, baru kerjakan dari kiri ke kanan.", color: "bg-lime-900/30 border-lime-500/30" },
      { icon: "✅", tip: "Verifikasi dengan desimal", detail: "Ubah pecahanmu ke desimal dan hitung. Contoh: 1/4 + 1/2 = 0,25 + 0,50 = 0,75 = 3/4. Cocokkan hasilmu!", color: "bg-green-900/30 border-green-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Kunci penjumlahan dan pengurangan pecahan hanya satu: <strong className="text-yellow-300">penyebut harus sama sebelum dioperasikan</strong>. Gunakan <strong className="text-lime-300">KPK untuk menyamakan penyebut</strong>, operasikan hanya pembilangnya, lalu sederhanakan hasilnya dengan FPB. Sederhana, sistematis, dan tidak bisa salah!</>,
    tags: ["Penyebut Sama = Langsung", "KPK untuk Samakan", "Ubah Campuran dulu", "Sederhanakan Akhir"],
    nextLabel: "🚀 Lanjut ke Perkalian Pecahan!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "FRACTION ADDITION AND SUBTRACTION",
    pageSubtitle: "Grade 7 - Rational Numbers - Mathematics",
    summaryLabel: "Key Summary",
    examplesLabel: "Examples and Solutions",
    step: (n: number) => `Step ${n}:`,
    discuss: "SOLUTION:",
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    ex: (n: number) => `Example ${n}`,

    sec1Title: "Fraction Addition",
    sec1Summary: <><strong className="text-primary">Fraction addition</strong> is the operation of combining two or more fractions into a single value. The key is the <strong>denominator</strong>: if the denominators are the same, directly add the numerators. If different, first find the common denominator using the LCM!</>,
    sec1FormulaTitle: "Formula for Fraction Addition:",
    sec1SameDen: "If denominators are the same:",
    sec1DiffDen: "If denominators are different:",
    sec1OrLCM: "or use the LCM of the denominators",
    sec1Visual: <><strong>Visualisation:</strong> Imagine you have <InlineMath math="\frac{2}{4}" /> of a pizza and your friend gives you <InlineMath math="\frac{1}{4}" /> more. Your total is <InlineMath math="\frac{2+1}{4} = \frac{3}{4}" /> of the pizza!</>,
    sec1Tip: <><strong>Important Tip:</strong> Always simplify the final result if possible! If the result is an improper fraction (numerator greater than denominator), convert it to a mixed number.</>,

    ex1Q: <>Calculate <InlineMath math="\frac{5}{12} + \frac{3}{12}" /></>,
    ex1s1: "Notice the denominators are already the same (12)",
    ex1s2: "Directly add the numerators:",
    ex1s3: "Simplify by dividing by GCD (4):",
    ex1ans: <>So, <InlineMath math="\frac{5}{12} + \frac{3}{12} = \frac{2}{3}" /></>,

    ex2Q: <>Calculate <InlineMath math="1\frac{1}{6} + 3\frac{7}{8}" /></>,
    ex2s1: "Find the LCM of 6 and 8 = 24",
    ex2s2: "Make the denominators equal:",
    ex2s3: "Add the whole number and fractional parts:",
    ex2s4: <>Since <InlineMath math="\frac{25}{24} > 1" />, convert to a mixed number:</>,
    ex2ans: <>So, <InlineMath math="1\frac{1}{6} + 3\frac{7}{8} = 5\frac{1}{24}" /></>,

    ex3Q: <>A transport vehicle carries motorcycles from Dealer A weighing <InlineMath math="130\frac{1}{4}" /> kg, and from Dealer B weighing <InlineMath math="128\frac{3}{8}" /> kg. What is the total cargo weight in kilograms?</>,
    ex3s1: "Identify what is being added:",
    ex3katex1: "\\text{Total} = 130\\frac{1}{4} + 128\\frac{3}{8}",
    ex3s2: "Find the LCM of 4 and 8 = 8",
    ex3s3: "Make denominators equal:",
    ex3s4: "Add:",
    ex3ans: <>So, the total cargo weight is <InlineMath math="258\frac{5}{8}" /> kg</>,

    sec2Title: "Properties of Fraction Addition",
    sec2Summary: <>Fraction addition has <strong className="text-primary">two important properties</strong> that simplify calculations: the <strong>Commutative Property</strong> (order) and the <strong>Associative Property</strong> (grouping).</>,
    sec2Comm: "1. Commutative Property (Order)",
    sec2CommDesc: "The order of addition does not affect the result. Whether you add left to right or right to left, the answer is the same!",
    sec2CommEx: <>Example: <InlineMath math="\frac{1}{2} + \frac{3}{4} = \frac{3}{4} + \frac{1}{2} = \frac{5}{4}" /></>,
    sec2Assoc: "2. Associative Property (Grouping)",
    sec2AssocDesc: "The grouping of addition does not affect the result. You are free to add in any order!",
    sec2AssocEx: <>Example: <InlineMath math="\left(\frac{1}{2} + \frac{1}{4}\right) + \frac{1}{8} = \frac{1}{2} + \left(\frac{1}{4} + \frac{1}{8}\right) = \frac{7}{8}" /></>,
    sec2Tip: <><strong>Tip:</strong> Use these properties to simplify calculations! For example, group fractions with the same denominator first.</>,

    ex4Q: <>Prove that <InlineMath math="\frac{2}{5} + \frac{1}{3} = \frac{1}{3} + \frac{2}{5}" /></>,
    ex4Left: "Left Side:",
    ex4Right: "Right Side:",
    ex4ans: <>Both sides equal <InlineMath math="\frac{11}{15}" /> (Commutative Property)</>,

    ex5Q: <>Calculate <InlineMath math="\frac{3}{10} + \frac{1}{7} + \frac{7}{10}" /> efficiently!</>,
    ex5s1: "Use the commutative property to group fractions with the same denominator:",
    ex5s2: "Calculate fractions with the same denominator first:",
    ex5ans: <>So, the result is <InlineMath math="1\frac{1}{7}" /></>,

    ex6Q: <>Calculate <InlineMath math="5\frac{2}{3} + 6\frac{1}{4} + 4\frac{1}{2}" /> using the associative property!</>,
    ex6s1: "Add the whole numbers first:",
    ex6s2: "Find the LCM of 3, 4, and 2 = 12",
    ex6s3: "Make denominators equal:",
    ex6s4: "Add the fractions:",
    ex6s5: "Combine with the whole number:",
    ex6ans: <>So, the result is <InlineMath math="16\frac{5}{12}" /></>,

    sec3Title: "Fraction Subtraction",
    sec3Summary: <><strong className="text-primary">Fraction subtraction</strong> is the operation of subtracting one fraction from another. The principle is similar to addition: <strong>make the denominators equal</strong> first, then subtract the numerators!</>,
    sec3FormulaTitle: "Formula for Fraction Subtraction:",
    sec3Warning: <><strong>Warning!</strong> Unlike addition, subtraction <strong>does not have the commutative property</strong>. That is, <InlineMath math="\frac{a}{b} - \frac{c}{d} \neq \frac{c}{d} - \frac{a}{b}" /></>,

    ex7Q: <>Calculate <InlineMath math="\frac{5}{9} - \frac{2}{9}" /></>,
    ex7s1: "The denominators are already the same (9)",
    ex7s2: "Subtract the numerators:",
    ex7s3: "Simplify:",
    ex7ans: <>So, <InlineMath math="\frac{5}{9} - \frac{2}{9} = \frac{1}{3}" /></>,

    ex8Q: <>Calculate <InlineMath math="\frac{3}{4} - \frac{1}{6}" /></>,
    ex8s1: "Different denominators — find the LCM of 4 and 6 = 12",
    ex8s2: "Make denominators equal:",
    ex8s3: "Subtract:",
    ex8ans: <>So, <InlineMath math="\frac{3}{4} - \frac{1}{6} = \frac{7}{12}" /></>,

    ex9Q: <>A person earns $840,000 per month. One-sixth is used for rent, <InlineMath math="\frac{2}{5}" /> for food expenses. How much is used for other necessities?</>,
    ex9s1: "Calculate the fraction for other expenses:",
    ex9katex1: "\\text{Other expenses} = 1 - \\frac{1}{6} - \\frac{2}{5}",
    ex9s2: "Find the LCM of 6 and 5 = 30, make denominators equal:",
    ex9s3: "Subtract:",
    ex9s4: "Calculate the money for other expenses:",
    ex9katex4: "= \\frac{13}{30} \\times 840{,}000 = \\$364{,}000",
    ex9ans: "So, the amount for other expenses is $364,000.",

    sec4Title: "Addition and Subtraction of Negative Fractions",
    sec4Summary: <>A <strong className="text-primary">negative fraction</strong> is a fraction whose value is less than zero. Addition and subtraction of negative fractions follow the same rules as negative integers, combined with the rules for fractions.</>,
    sec4FormTitle: "Writing Negative Fractions:",
    sec4FormNote: "All three forms above have the same value",
    sec4RulesTitle: "Sign Rules:",
    sec4Rules: [
      "Positive + Positive = Positive",
      "Negative + Negative = Negative (add the values, apply negative sign)",
      "Positive + Negative = Subtract, follow the sign of the larger value",
      "Subtracting a negative number = Adding a positive number",
    ],
    sec4Tip: <><strong>Tip:</strong> Remember that subtracting a negative number is the same as adding a positive number: <InlineMath math="a - (-b) = a + b" /></>,

    ex10Q: <>Calculate <InlineMath math="-\frac{3}{8} + \left(-\frac{7}{8}\right)" /></>,
    ex10s1: "Both fractions are negative, so add the values and apply a negative sign:",
    ex10s2: "Simplify:",
    ex10ans: <>So, the result is <InlineMath math="-1\frac{1}{4}" /></>,

    ex11Q: <>Calculate <InlineMath math="\frac{5}{6} - \left(-\frac{1}{4}\right)" /></>,
    ex11s1: "Convert subtraction of a negative to addition:",
    ex11s2: "Make denominators equal (LCM of 6 and 4 = 12):",
    ex11ans: <>So, the result is <InlineMath math="1\frac{1}{12}" /></>,

    ex12Q: <>Calculate <InlineMath math="-3\frac{1}{3} - \left(-5\frac{1}{2}\right) + \left(-2\frac{1}{6}\right)" /></>,
    ex12s1: "Simplify the operation signs:",
    ex12s2: "Convert to improper fractions with a common denominator (LCM = 6):",
    ex12s3: "Calculate from left to right:",
    ex12ans: "So, the result is 0.",

    sumTitle: "➕➖ COMPLETE SUMMARY",
    sumSubtitle: "Fraction Addition & Subtraction — Grade 7",
    sumSec1Label: "Rules for Fraction Addition & Subtraction",
    sumCards: [
      { label: "SAME denominator → Operate directly", desc: "a/b + c/b = (a+c)/b and a/b − c/b = (a−c)/b. Only the numerators are added/subtracted; the denominator stays!", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
      { label: "DIFFERENT denominators → Equalise with LCM first", desc: "Find the LCM of the denominators. Convert all fractions to the LCM denominator. Then add/subtract the numerators.", color: "from-lime-900/70 to-lime-800/30 border-lime-500/50 text-lime-200" },
      { label: "Mixed Numbers → Convert to improper first", desc: "2 3/4 = (2×4+3)/4 = 11/4. Convert all mixed numbers to improper fractions before operating.", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
      { label: "Simplify the final result!", desc: "After adding/subtracting, always check whether the result can be simplified with the GCD.", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
    ],
    sumSec2Label: "Tips & Tricks",
    sumTips: [
      { icon: "🎯", tip: "Never directly add the denominators!", detail: "3/4 + 1/2 ≠ 4/6. This is the most common mistake! Always equalise the denominator first with LCM: 3/4 + 2/4 = 5/4.", color: "bg-red-900/30 border-red-500/30" },
      { icon: "⚡", tip: "Use LCM, not direct multiplication", detail: "For 1/6 + 1/4, LCM = 12 (not 24). Using LCM keeps fractions smaller and easier to simplify.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔄", tip: "Three fractions at once? Still equalise all denominators first", detail: "Find the LCM of all three denominators at once, convert them all to the same denominator, then work left to right.", color: "bg-lime-900/30 border-lime-500/30" },
      { icon: "✅", tip: "Verify with decimals", detail: "Convert your fractions to decimals and check. Example: 1/4 + 1/2 = 0.25 + 0.50 = 0.75 = 3/4. Match your result!", color: "bg-green-900/30 border-green-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>There is one key to fraction addition and subtraction: <strong className="text-yellow-300">denominators must be equal before operating</strong>. Use <strong className="text-lime-300">LCM to equalise denominators</strong>, operate only on the numerators, then simplify the result with GCD. Simple, systematic, and foolproof!</>,
    tags: ["Same Denominator = Direct", "LCM to Equalise", "Convert Mixed First", "Simplify at the End"],
    nextLabel: "🚀 Continue to Fraction Multiplication!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    pageTitle: "分数の足し算と引き算",
    pageSubtitle: "中学1年 - 有理数 - 数学",
    summaryLabel: "要点まとめ",
    examplesLabel: "例題と解説",
    step: (n: number) => `手順 ${n}：`,
    discuss: "解説：",
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    ex: (n: number) => `例題 ${n}`,

    sec1Title: "分数の足し算",
    sec1Summary: <><strong className="text-primary">分数の足し算</strong>とは、2つ以上の分数を1つの値にまとめる演算です。鍵は<strong>分母</strong>にあります。分母が同じなら分子を直接足す。異なる場合はLCMを使って分母を揃えてから足します！</>,
    sec1FormulaTitle: "分数の足し算の公式：",
    sec1SameDen: "分母が同じ場合：",
    sec1DiffDen: "分母が異なる場合：",
    sec1OrLCM: "または分母のLCMを使う",
    sec1Visual: <><strong>視覚的イメージ：</strong>ピザを <InlineMath math="\frac{2}{4}" /> 枚持っていて、友だちが <InlineMath math="\frac{1}{4}" /> 枚くれたとします。合計は <InlineMath math="\frac{2+1}{4} = \frac{3}{4}" /> 枚です！</>,
    sec1Tip: <><strong>重要なヒント：</strong>可能であれば最終結果を必ず約分しましょう！結果が仮分数（分子が分母より大きい）の場合は帯分数に変換します。</>,

    ex1Q: <>計算せよ <InlineMath math="\frac{5}{12} + \frac{3}{12}" /></>,
    ex1s1: "分母がすでに同じ(12)であることを確認する",
    ex1s2: "分子を直接足す：",
    ex1s3: "GCD(4)で約分する：",
    ex1ans: <>よって、<InlineMath math="\frac{5}{12} + \frac{3}{12} = \frac{2}{3}" /></>,

    ex2Q: <>計算せよ <InlineMath math="1\frac{1}{6} + 3\frac{7}{8}" /></>,
    ex2s1: "6と8のLCM = 24を求める",
    ex2s2: "分母を揃える：",
    ex2s3: "整数部分と分数部分を足す：",
    ex2s4: <><InlineMath math="\frac{25}{24} > 1" /> なので帯分数に変換する：</>,
    ex2ans: <>よって、<InlineMath math="1\frac{1}{6} + 3\frac{7}{8} = 5\frac{1}{24}" /></>,

    ex3Q: <>輸送車両がディーラーAから <InlineMath math="130\frac{1}{4}" /> kg、ディーラーBから <InlineMath math="128\frac{3}{8}" /> kg のオートバイを運びます。積載物の総重量は何 kg ですか？</>,
    ex3s1: "足す対象を確認する：",
    ex3katex1: "\\text{Total} = 130\\frac{1}{4} + 128\\frac{3}{8}",
    ex3s2: "4と8のLCM = 8を求める",
    ex3s3: "分母を揃える：",
    ex3s4: "足す：",
    ex3ans: <>よって、積載物の総重量は <InlineMath math="258\frac{5}{8}" /> kg です。</>,

    sec2Title: "分数の足し算の性質",
    sec2Summary: <>分数の足し算には、計算を簡単にする<strong className="text-primary">2つの重要な性質</strong>があります：<strong>交換法則</strong>（順序）と<strong>結合法則</strong>（グループ化）です。</>,
    sec2Comm: "1. 交換法則（順序）",
    sec2CommDesc: "足す順序は結果に影響しません。左から足しても右から足しても答えは同じです！",
    sec2CommEx: <>例：<InlineMath math="\frac{1}{2} + \frac{3}{4} = \frac{3}{4} + \frac{1}{2} = \frac{5}{4}" /></>,
    sec2Assoc: "2. 結合法則（グループ化）",
    sec2AssocDesc: "グループ化の方法は結果に影響しません。どの順序で足してもかまいません！",
    sec2AssocEx: <>例：<InlineMath math="\left(\frac{1}{2} + \frac{1}{4}\right) + \frac{1}{8} = \frac{1}{2} + \left(\frac{1}{4} + \frac{1}{8}\right) = \frac{7}{8}" /></>,
    sec2Tip: <><strong>ヒント：</strong>これらの性質を使って計算を簡略化しましょう！例えば、同じ分母の分数を先にグループ化します。</>,

    ex4Q: <><InlineMath math="\frac{2}{5} + \frac{1}{3} = \frac{1}{3} + \frac{2}{5}" /> を証明せよ。</>,
    ex4Left: "左辺：",
    ex4Right: "右辺：",
    ex4ans: <>両辺は <InlineMath math="\frac{11}{15}" /> に等しい（交換法則）</>,

    ex5Q: <><InlineMath math="\frac{3}{10} + \frac{1}{7} + \frac{7}{10}" /> を効率的に計算せよ！</>,
    ex5s1: "交換法則を使って同じ分母の分数をグループ化する：",
    ex5s2: "同じ分母の分数を先に計算する：",
    ex5ans: <>よって、結果は <InlineMath math="1\frac{1}{7}" /> です。</>,

    ex6Q: <>結合法則を使って <InlineMath math="5\frac{2}{3} + 6\frac{1}{4} + 4\frac{1}{2}" /> を計算せよ！</>,
    ex6s1: "整数部分を先に足す：",
    ex6s2: "3、4、2のLCM = 12を求める",
    ex6s3: "分母を揃える：",
    ex6s4: "分数部分を足す：",
    ex6s5: "整数部分と合わせる：",
    ex6ans: <>よって、結果は <InlineMath math="16\frac{5}{12}" /> です。</>,

    sec3Title: "分数の引き算",
    sec3Summary: <><strong className="text-primary">分数の引き算</strong>とは、一方の分数から他方の分数を引く演算です。原則は足し算と同様：まず<strong>分母を揃えて</strong>から分子を引きます！</>,
    sec3FormulaTitle: "分数の引き算の公式：",
    sec3Warning: <><strong>注意！</strong>足し算と異なり、引き算は<strong>交換法則が成り立ちません</strong>。つまり <InlineMath math="\frac{a}{b} - \frac{c}{d} \neq \frac{c}{d} - \frac{a}{b}" /> です。</>,

    ex7Q: <>計算せよ <InlineMath math="\frac{5}{9} - \frac{2}{9}" /></>,
    ex7s1: "分母はすでに同じ(9)",
    ex7s2: "分子を引く：",
    ex7s3: "約分する：",
    ex7ans: <>よって、<InlineMath math="\frac{5}{9} - \frac{2}{9} = \frac{1}{3}" /></>,

    ex8Q: <>計算せよ <InlineMath math="\frac{3}{4} - \frac{1}{6}" /></>,
    ex8s1: "分母が異なるため、4と6のLCM = 12を求める",
    ex8s2: "分母を揃える：",
    ex8s3: "引く：",
    ex8ans: <>よって、<InlineMath math="\frac{3}{4} - \frac{1}{6} = \frac{7}{12}" /></>,

    ex9Q: <>ある人の月収は$840,000です。6分の1を家賃、<InlineMath math="\frac{2}{5}" /> を食費に使います。その他の費用はいくらですか？</>,
    ex9s1: "その他の費用の割合を計算する：",
    ex9katex1: "\\text{その他の費用} = 1 - \\frac{1}{6} - \\frac{2}{5}",
    ex9s2: "6と5のLCM = 30を求め、分母を揃える：",
    ex9s3: "引く：",
    ex9s4: "その他の費用の金額を計算する：",
    ex9katex4: "= \\frac{13}{30} \\times 840{,}000 = \\$364{,}000",
    ex9ans: "よって、その他の費用は$364,000です。",

    sec4Title: "負の分数の足し算と引き算",
    sec4Summary: <>負の<strong className="text-primary">分数</strong>とは、値がゼロより小さい分数です。負の分数の足し算と引き算は、負の整数と同じ規則に従い、さらに分数のルールと組み合わせます。</>,
    sec4FormTitle: "負の分数の表記：",
    sec4FormNote: "上記3つの形式はすべて同じ値を持ちます",
    sec4RulesTitle: "符号のルール：",
    sec4Rules: [
      "正 + 正 = 正",
      "負 + 負 = 負（値を足して負の符号をつける）",
      "正 + 負 = 引き算して、値の大きい方の符号をとる",
      "負の数を引く = 正の数を足す",
    ],
    sec4Tip: <><strong>ヒント：</strong>負の数を引くことは正の数を足すことと同じです：<InlineMath math="a - (-b) = a + b" /></>,

    ex10Q: <>計算せよ <InlineMath math="-\frac{3}{8} + \left(-\frac{7}{8}\right)" /></>,
    ex10s1: "両方の分数が負なので、値を足して負の符号をつける：",
    ex10s2: "約分する：",
    ex10ans: <>よって、結果は <InlineMath math="-1\frac{1}{4}" /> です。</>,

    ex11Q: <>計算せよ <InlineMath math="\frac{5}{6} - \left(-\frac{1}{4}\right)" /></>,
    ex11s1: "負の数の引き算を足し算に変換する：",
    ex11s2: "分母を揃える（6と4のLCM = 12）：",
    ex11ans: <>よって、結果は <InlineMath math="1\frac{1}{12}" /> です。</>,

    ex12Q: <>計算せよ <InlineMath math="-3\frac{1}{3} - \left(-5\frac{1}{2}\right) + \left(-2\frac{1}{6}\right)" /></>,
    ex12s1: "演算記号を整理する：",
    ex12s2: "共通分母を持つ仮分数に変換する（LCM = 6）：",
    ex12s3: "左から右へ計算する：",
    ex12ans: "よって、結果は0です。",

    sumTitle: "➕➖ 完全まとめ",
    sumSubtitle: "分数の足し算と引き算 — 中学1年",
    sumSec1Label: "分数の足し算と引き算のルール",
    sumCards: [
      { label: "分母が同じ → 直接演算する", desc: "a/b + c/b = (a+c)/b、a/b − c/b = (a−c)/b。分子だけを足す/引く。分母はそのまま！", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
      { label: "分母が異なる → まずLCMで揃える", desc: "分母のLCMを求める。すべての分数をLCMの分母に変換する。その後、分子を足す/引く。", color: "from-lime-900/70 to-lime-800/30 border-lime-500/50 text-lime-200" },
      { label: "帯分数 → まず仮分数に変換する", desc: "2 3/4 = (2×4+3)/4 = 11/4。演算する前にすべての帯分数を仮分数に変換する。", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200" },
      { label: "最終結果を約分する！", desc: "足し算/引き算の後、GCDで結果を約分できるか必ず確認する。", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200" },
    ],
    sumSec2Label: "ヒントとコツ",
    sumTips: [
      { icon: "🎯", tip: "分母を直接足さないこと！", detail: "3/4 + 1/2 ≠ 4/6。これが最も一般的なミスです！LCMで分母を揃えてから：3/4 + 2/4 = 5/4。", color: "bg-red-900/30 border-red-500/30" },
      { icon: "⚡", tip: "直接掛け算ではなくLCMを使う", detail: "1/6 + 1/4 の場合、LCM = 12（24ではない）。LCMを使うと分数が小さくなり約分しやすい。", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔄", tip: "3つの分数でも、まず全部の分母を揃える", detail: "3つの分母のLCMを一度に求め、すべて同じ分母に変換してから左から右へ計算する。", color: "bg-lime-900/30 border-lime-500/30" },
      { icon: "✅", tip: "小数で確認する", detail: "分数を小数に変換して確認する。例：1/4 + 1/2 = 0.25 + 0.50 = 0.75 = 3/4。結果を照合しよう！", color: "bg-green-900/30 border-green-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>分数の足し算と引き算の鍵はただ一つ：<strong className="text-yellow-300">演算する前に分母を揃えること</strong>。<strong className="text-lime-300">LCMで分母を揃え</strong>、分子だけを演算し、GCDで結果を約分する。シンプル、体系的、そして間違いようがありません！</>,
    tags: ["同じ分母 = 直接", "LCMで揃える", "帯分数を先に変換", "最後に約分"],
    nextLabel: "🚀 分数の掛け算へ進む！",
    backBtn: "有理数に戻る",
  },
};

const PenjumlahanPenguranganPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(["penjumlahan", "pengurangan", "sifat-penjumlahan", "pecahan-negatif"]);
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
          <FractionCircleAnimation />

          {/* Section 1: Penjumlahan Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-green-400" />
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

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.sec1FormulaTitle}</p>
                  <p className="font-body text-xs text-white/70 mb-2">{t.sec1SameDen}</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center mb-3">
                    <BlockMath math="\frac{a}{c} + \frac{b}{c} = \frac{a + b}{c}" />
                  </div>
                  <p className="font-body text-xs text-white/70 mb-2">{t.sec1DiffDen}</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\frac{a}{b} + \frac{c}{d} = \frac{a \times d + c \times b}{b \times d}" />
                    <p className="text-white/60 text-xs mt-2">{t.sec1OrLCM}</p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">{t.sec1Visual}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec1Tip}</p>
                </div>

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
                        <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{5}{12} + \frac{3}{12} = \frac{5 + 3}{12} = \frac{8}{12}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex1s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{8}{12} = \frac{8 \div 4}{12 \div 4} = \frac{2}{3}" />
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
                        <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="1\frac{1}{6} = 1\frac{4}{24}" />
                          <BlockMath math="3\frac{7}{8} = 3\frac{21}{24}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex2s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="1\frac{4}{24} + 3\frac{21}{24} = (1+3) + \frac{4+21}{24} = 4\frac{25}{24}" />
                        </div>
                        <p><strong>{t.step(4)}</strong> {t.ex2s4}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="4\frac{25}{24} = 4 + 1\frac{1}{24} = 5\frac{1}{24}" />
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
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex3katex1} />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                        <p><strong>{t.step(3)}</strong> {t.ex3s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="130\frac{1}{4} = 130\frac{2}{8}" />
                        </div>
                        <p><strong>{t.step(4)}</strong> {t.ex3s4}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="130\frac{2}{8} + 128\frac{3}{8} = (130+128) + \frac{2+3}{8} = 258\frac{5}{8}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Sifat-Sifat Penjumlahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
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

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.sec2Comm}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">{t.sec2CommDesc}</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\frac{a}{b} + \frac{c}{d} = \frac{c}{d} + \frac{a}{b}" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">{t.sec2CommEx}</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.sec2Assoc}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed mb-3">{t.sec2AssocDesc}</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\left(\frac{a}{b} + \frac{c}{d}\right) + \frac{e}{f} = \frac{a}{b} + \left(\frac{c}{d} + \frac{e}{f}\right)" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">{t.sec2AssocEx}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec2Tip}</p>
                </div>

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
                        <p><strong>{t.ex4Left}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{5} + \frac{1}{3} = \frac{6}{15} + \frac{5}{15} = \frac{11}{15}" />
                        </div>
                        <p><strong>{t.ex4Right}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{1}{3} + \frac{2}{5} = \frac{5}{15} + \frac{6}{15} = \frac{11}{15}" />
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
                          <BlockMath math="\frac{3}{10} + \frac{1}{7} + \frac{7}{10} = \left(\frac{3}{10} + \frac{7}{10}\right) + \frac{1}{7}" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex5s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{10}{10} + \frac{1}{7} = 1 + \frac{1}{7} = 1\frac{1}{7}" />
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
                          <BlockMath math="5 + 6 + 4 = 15" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex6s2}</p>
                        <p><strong>{t.step(3)}</strong> {t.ex6s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{2}{3} = \frac{8}{12}, \quad \frac{1}{4} = \frac{3}{12}, \quad \frac{1}{2} = \frac{6}{12}" />
                        </div>
                        <p><strong>{t.step(4)}</strong> {t.ex6s4}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{8}{12} + \frac{3}{12} + \frac{6}{12} = \frac{17}{12} = 1\frac{5}{12}" />
                        </div>
                        <p><strong>{t.step(5)}</strong> {t.ex6s5}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="15 + 1\frac{5}{12} = 16\frac{5}{12}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex6ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Pengurangan Pecahan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Minus className="w-5 h-5 text-red-400" />
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

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.sec3FormulaTitle}</p>
                  <p className="font-body text-xs text-white/70 mb-2">{t.sec1SameDen}</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center mb-3">
                    <BlockMath math="\frac{a}{c} - \frac{b}{c} = \frac{a - b}{c}" />
                  </div>
                  <p className="font-body text-xs text-white/70 mb-2">{t.sec1DiffDen}</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="\frac{a}{b} - \frac{c}{d} = \frac{a \times d - c \times b}{b \times d}" />
                    <p className="text-white/60 text-xs mt-2">{t.sec1OrLCM}</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec3Warning}</p>
                </div>

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
                        <p><strong>{t.step(2)}</strong> {t.ex7s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{5}{9} - \frac{2}{9} = \frac{5 - 2}{9} = \frac{3}{9}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex7s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{9} = \frac{1}{3}" />
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
                        <p><strong>{t.step(2)}</strong> {t.ex8s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{3}{4} = \frac{3 \times 3}{4 \times 3} = \frac{9}{12}" />
                          <BlockMath math="\frac{1}{6} = \frac{1 \times 2}{6 \times 2} = \frac{2}{12}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex8s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{9}{12} - \frac{2}{12} = \frac{7}{12}" />
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
                          <BlockMath math="= \frac{30}{30} - \frac{5}{30} - \frac{12}{30}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex9s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{30 - 5 - 12}{30} = \frac{13}{30}" />
                        </div>
                        <p><strong>{t.step(4)}</strong> {t.ex9s4}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math={t.ex9katex4} />
                        </div>
                        <p className="text-primary font-semibold">{t.ex9ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Pecahan Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <div className="w-full flex items-center px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.sec4Title}</span>
              </div>
            </div>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> {t.summaryLabel}
                  </p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.sec4Summary}</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.sec4FormTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <BlockMath math="-\frac{a}{b} = \frac{-a}{b} = \frac{a}{-b}" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">{t.sec4FormNote}</p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.sec4RulesTitle}</p>
                  <ul className="font-body text-sm text-white/80 space-y-1 list-disc list-inside">
                    {t.sec4Rules.map((rule) => <li key={rule}>{rule}</li>)}
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">{t.sec4Tip}</p>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <p className="font-body text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-400" /> {t.examplesLabel}
                  </p>

                  {/* Example 10 - Easy */}
                  <div className="border-l-4 border-green-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.badgeEasy}</span>
                      <span className="font-body font-semibold text-white">{t.ex(1)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex10Q}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex10s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="-\frac{3}{8} + \left(-\frac{7}{8}\right) = -\frac{3 + 7}{8} = -\frac{10}{8}" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex10s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="-\frac{10}{8} = -\frac{5}{4} = -1\frac{1}{4}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex10ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 11 - Medium */}
                  <div className="border-l-4 border-yellow-500 pl-4 space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.badgeMedium}</span>
                      <span className="font-body font-semibold text-white">{t.ex(2)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex11Q}</p>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex11s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\frac{5}{6} - \left(-\frac{1}{4}\right) = \frac{5}{6} + \frac{1}{4}" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex11s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{10}{12} + \frac{3}{12} = \frac{13}{12} = 1\frac{1}{12}" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex11ans}</p>
                      </div>
                    </div>
                  </div>

                  {/* Example 12 - Hard */}
                  <div className="border-l-4 border-red-500 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.badgeHard}</span>
                      <span className="font-body font-semibold text-white">{t.ex(3)}</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex12Q}</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.discuss}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step(1)}</strong> {t.ex12s1}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="-3\frac{1}{3} - \left(-5\frac{1}{2}\right) + \left(-2\frac{1}{6}\right) = -3\frac{1}{3} + 5\frac{1}{2} - 2\frac{1}{6}" />
                        </div>
                        <p><strong>{t.step(2)}</strong> {t.ex12s2}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= -\frac{10}{3} + \frac{11}{2} - \frac{13}{6}" />
                          <BlockMath math="= -\frac{20}{6} + \frac{33}{6} - \frac{13}{6}" />
                        </div>
                        <p><strong>{t.step(3)}</strong> {t.ex12s3}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="= \frac{-20 + 33 - 13}{6} = \frac{0}{6} = 0" />
                        </div>
                        <p className="text-primary font-semibold">{t.ex12ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-yellow-500 via-lime-500 to-green-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">1</span>
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
              <p className="font-body text-xs font-bold text-lime-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-lime-500/30 border border-lime-500 flex items-center justify-center text-[10px]">2</span>
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

            <div className="bg-gradient-to-br from-yellow-500/20 via-lime-500/15 to-green-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌻</div>
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

export default PenjumlahanPenguranganPage;
