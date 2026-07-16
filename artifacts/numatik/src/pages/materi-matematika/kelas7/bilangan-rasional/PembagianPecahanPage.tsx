import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, AlertCircle, Calculator, Repeat, MinusCircle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PEMBAGIAN PECAHAN",
    pageSubtitle: "Kelas 7 - Bilangan Rasional",
    sec1Title: "Konsep Dasar Pembagian Pecahan",
    summaryLabel: "Ringkasan Intisari",
    sec1Body: <>
      <strong>Pembagian pecahan</strong> punya trik keren: membagi dengan suatu pecahan sama dengan mengalikan dengan <strong>kebalikannya</strong>!{" "}
      Kebalikan pecahan <InlineMath math="\frac{c}{d}" /> adalah <InlineMath math="\frac{d}{c}" /> (pembilang dan penyebut ditukar posisinya).{" "}
      Jadi, kamu tinggal ubah tanda bagi menjadi kali, lalu balik pecahan pembaginya. Mudah kan?
    </>,
    sec1FormulaTitle: "Rumus Pembagian Pecahan:",
    sec1FormulaNote: <>dengan <InlineMath math="b \neq 0" />, <InlineMath math="c \neq 0" />, dan <InlineMath math="d \neq 0" /></>,
    tipTitle: "Tips Penting",
    sec1Tips: [
      <><strong>KPK</strong> (Kali-Putar-Kali): Kali dengan kebalikan pembagi!</>,
      <>Kebalikan dari <InlineMath math="\frac{c}{d}" /> adalah <InlineMath math="\frac{d}{c}" /></>,
      <>Jangan lupa sederhanakan hasil akhir jika memungkinkan</>,
      <>Pecahan campuran harus diubah ke pecahan biasa terlebih dahulu</>,
    ],
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    exLabel: "Contoh Soal",
    discussLabel: "Pembahasan:",
    answerLabel: "Jawaban:",
    step: (n: number) => `Langkah ${n}:`,
    ex1Q: <>Hitunglah hasil pembagian <InlineMath math="\frac{3}{4} \div \frac{6}{5}" /></>,
    ex1s1: "Tentukan kebalikan dari pembagi",
    ex1s1b: <>Kebalikan dari <InlineMath math="\frac{6}{5}" /> adalah <InlineMath math="\frac{5}{6}" /></>,
    ex1s2: "Ubah pembagian menjadi perkalian dengan kebalikan",
    ex1s3: "Kalikan dan sederhanakan",
    ex2Q: <>Hitunglah hasil pembagian <InlineMath math="5\frac{1}{4} \div 4\frac{1}{8}" /></>,
    ex2s1: "Ubah pecahan campuran menjadi pecahan biasa",
    ex2s2: "Tentukan kebalikan pembagi dan kalikan",
    ex2s3: "Sederhanakan silang sebelum mengalikan",
    ex2s4: "Ubah ke pecahan campuran",
    ex3Q: <>Untuk memperindah tampilan pada baju yang dirancangnya, seorang penjahit memasang pita pada bagian baju.{" "}Jika tersedia 1 gulung pita yang panjangnya 5 meter, dan setiap baju membutuhkan <InlineMath math="\frac{5}{8}" /> meter pita,{" "}berapa banyak baju yang dapat dipasangi pita?</>,
    ex3s1: "Tentukan operasi yang digunakan",
    ex3s1b: "Banyak baju = panjang total : panjang per baju",
    ex3s2: "Ubah 5 meter menjadi pecahan",
    ex3s3: "Hitung pembagian",
    ex3ans: "8 potong baju dapat dipasangi pita",
    sec2Title: "Kebalikan (Invers) Pecahan",
    sec2Body: <>
      <strong>Kebalikan (invers)</strong> dari suatu pecahan didapat dengan menukar posisi pembilang dan penyebut.{" "}
      Kebalikan dari <InlineMath math="\frac{a}{b}" /> adalah <InlineMath math="\frac{b}{a}" />.{" "}
      Sifat istimewa: jika suatu pecahan dikalikan dengan kebalikannya, hasilnya selalu <strong>1</strong>!{" "}
      Konsep ini adalah kunci utama dalam pembagian pecahan.
    </>,
    sec2FormulaTitle: "Sifat Kebalikan Pecahan:",
    sec2Formula1: "\\text{Kebalikan dari } \\frac{a}{b} \\text{ adalah } \\frac{b}{a}",
    ex4Q: <>Tentukan kebalikan dari pecahan-pecahan berikut: <InlineMath math="\frac{3}{7}" />, <InlineMath math="\frac{5}{2}" />, dan <InlineMath math="4" /></>,
    ex4part: (l: string) => <><strong>{l}.</strong></>,
    ex4s1a: <>Kebalikan dari <InlineMath math="\frac{3}{7}" />:</>,
    ex4swap: <>Tukar pembilang dan penyebut:</>,
    ex4s2a: <>Kebalikan dari <InlineMath math="\frac{5}{2}" />:</>,
    ex4s3a: <>Kebalikan dari <InlineMath math="4" />:</>,
    ex4toFrac: <>Ubah ke pecahan: <InlineMath math="4 = \frac{4}{1}" /></>,
    ex4flip: <>Tukar:</>,
    ex5Q: <>Tentukan kebalikan dari pecahan campuran <InlineMath math="2\frac{3}{5}" /></>,
    ex5s1: "Ubah pecahan campuran ke pecahan biasa",
    ex5s2: "Tentukan kebalikannya",
    ex5s2b: <>Kebalikan dari <InlineMath math="\frac{13}{5}" /> adalah <InlineMath math="\frac{5}{13}" /></>,
    ex5s3: "Verifikasi dengan mengalikan",
    ex5s3b: "(Benar!)",
    ex6Q: <>Jika <InlineMath math="x" /> adalah kebalikan dari <InlineMath math="3\frac{1}{4}" /> dan <InlineMath math="y" /> adalah kebalikan dari <InlineMath math="2\frac{1}{6}" />, hitunglah nilai dari <InlineMath math="x + y" /></>,
    ex6s1: (frac: string) => <>Tentukan nilai x (kebalikan dari <InlineMath math={frac} />)</>,
    ex6s2: (frac: string) => <>Tentukan nilai y (kebalikan dari <InlineMath math={frac} />)</>,
    ex6s3: "Hitung x + y",
    ex6so: "sehingga",
    sec3Title: "Pembagian Pecahan Negatif",
    sec3Body: <>
      Pembagian pecahan negatif mengikuti aturan tanda yang sama dengan perkalian:{" "}
      <strong> positif dibagi negatif = negatif</strong>, <strong>negatif dibagi positif = negatif</strong>,{" "}
      dan <strong>negatif dibagi negatif = positif</strong>.{" "}
      Caranya tetap sama: ubah jadi perkalian dengan kebalikan, lalu perhatikan tanda hasilnya!
    </>,
    sec3SignTitle: "Aturan Tanda pada Pembagian:",
    sec3SignNote: "Tanda sama = positif, Tanda beda = negatif",
    ex7Q: <>Hitunglah <InlineMath math="\frac{3}{8} \div \left(-\frac{2}{5}\right)" /></>,
    ex7s1: "Ubah jadi perkalian dengan kebalikan",
    ex7s2: "Kalikan dan tentukan tanda",
    ex8Q: <>Hitunglah <InlineMath math="-2\frac{1}{3} \div \left(-3\frac{1}{2}\right)" /></>,
    ex8s1: "Ubah ke pecahan biasa",
    ex8s2: "Ubah jadi perkalian dengan kebalikan",
    ex8s3: "Kalikan dan tentukan tanda",
    ex8s3b: "Negatif × Negatif = Positif",
    ex9Q: <>Hitunglah <InlineMath math="\left(-\frac{3}{4}\right) \div \frac{9}{16} \div \left(-\frac{2}{3}\right)" /></>,
    ex9s1: "Kerjakan dari kiri ke kanan, hitung bagian pertama",
    ex9s2: "Lanjutkan dengan pembagian kedua",
    ex9s2b: "Negatif × Negatif = Positif",
    sumTitle: "➗ RANGKUMAN LENGKAP",
    sumSubtitle: "Pembagian Pecahan — Kelas 7",
    sumSec1: "Aturan Pembagian Pecahan",
    sumCards: [
      { label: "Rumus: a/b ÷ c/d = a/b × d/c", desc: "Kalikan dengan kebalikan (resiprokal) pembagi! Balik pecahan kedua lalu kalikan. Ini satu-satunya aturan yang perlu diingat.", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
      { label: "KCF — Keep, Change, Flip", desc: "Keep (jaga pecahan pertama) → Change (ubah ÷ menjadi ×) → Flip (balik pecahan kedua). Tiga langkah mudah!", color: "from-amber-900/70 to-amber-800/30 border-amber-500/50 text-amber-200" },
      { label: "Pembagian Pecahan Campuran", desc: "Ubah ke bentuk biasa dulu! 2½ ÷ 1¼ = 5/2 ÷ 5/4 = 5/2 × 4/5 = 20/10 = 2", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
      { label: "Pembagian bilangan bulat ÷ pecahan", desc: "n ÷ a/b = n × b/a. Contoh: 6 ÷ 2/3 = 6 × 3/2 = 18/2 = 9. Hasilnya lebih besar dari 6!", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
    ],
    sumSec2: "Tips & Trik Jitu",
    sumTips: [
      { icon: "🔄", tip: "Hafal KCF: Keep-Change-Flip", detail: "Rumus ini tidak pernah salah: Jaga pecahan pertama, Ubah ÷ jadi ×, Balik pecahan kedua. Praktikkan sampai otomatis!", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "🎯", tip: "Hasil membagi pecahan < 1 akan lebih besar", detail: "6 ÷ 1/2 = 12. Membagi dengan pecahan menghasilkan angka yang lebih besar! Ini berlawanan dengan intuisi tapi selalu benar.", color: "bg-amber-900/30 border-amber-500/30" },
      { icon: "⚡", tip: "Cross-cancelling berlaku juga di pembagian", detail: "Setelah flip menjadi perkalian, kamu bisa melakukan cross-cancelling untuk menyederhanakan sebelum mengalikan.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "✅", tip: "Cek dengan perkalian balik", detail: "Jika a/b ÷ c/d = e/f, maka e/f × c/d harus = a/b. Gunakan ini untuk verifikasi jawabanmu!", color: "bg-green-900/30 border-green-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Pembagian pecahan adalah <strong className="text-orange-300">perkalian yang tersamarkan</strong>! Cukup ingat <strong className="text-yellow-300">KCF: Keep, Change, Flip</strong> — jaga pecahan pertama, ubah operasi menjadi kali, balik pecahan kedua. Dengan trik ini, tidak ada soal pembagian pecahan yang tidak bisa kamu selesaikan!</>,
    tags: ["KCF: Keep-Change-Flip", "a/b ÷ c/d = a/b × d/c", "Campuran → Biasa dulu", "Cross-Cancelling", "Verifikasi balik"],
    nextLabel: "🏆 Kamu sudah kuasai semua operasi pecahan biasa!",
    backBtn: "Kembali ke Bilangan Rasional",
  },
  en: {
    pageTitle: "FRACTION DIVISION",
    pageSubtitle: "Grade 7 - Rational Numbers",
    sec1Title: "Basic Concept of Fraction Division",
    summaryLabel: "Key Summary",
    sec1Body: <>
      <strong>Fraction division</strong> has a cool trick: dividing by a fraction is the same as multiplying by its <strong>reciprocal</strong>!{" "}
      The reciprocal of <InlineMath math="\frac{c}{d}" /> is <InlineMath math="\frac{d}{c}" /> (numerator and denominator swap positions).{" "}
      Just change the division sign to multiplication, then flip the divisor. Easy, right?
    </>,
    sec1FormulaTitle: "Fraction Division Formula:",
    sec1FormulaNote: <>where <InlineMath math="b \neq 0" />, <InlineMath math="c \neq 0" />, and <InlineMath math="d \neq 0" /></>,
    tipTitle: "Important Tips",
    sec1Tips: [
      <><strong>KCF</strong> (Keep, Change, Flip): Multiply by the reciprocal of the divisor!</>,
      <>The reciprocal of <InlineMath math="\frac{c}{d}" /> is <InlineMath math="\frac{d}{c}" /></>,
      <>Always simplify the final answer if possible</>,
      <>Mixed numbers must be converted to improper fractions first</>,
    ],
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    exLabel: "Example",
    discussLabel: "Solution:",
    answerLabel: "Answer:",
    step: (n: number) => `Step ${n}:`,
    ex1Q: <>Calculate <InlineMath math="\frac{3}{4} \div \frac{6}{5}" /></>,
    ex1s1: "Find the reciprocal of the divisor",
    ex1s1b: <>The reciprocal of <InlineMath math="\frac{6}{5}" /> is <InlineMath math="\frac{5}{6}" /></>,
    ex1s2: "Change division to multiplication by the reciprocal",
    ex1s3: "Multiply and simplify",
    ex2Q: <>Calculate <InlineMath math="5\frac{1}{4} \div 4\frac{1}{8}" /></>,
    ex2s1: "Convert mixed numbers to improper fractions",
    ex2s2: "Find the reciprocal of the divisor and multiply",
    ex2s3: "Cross-cancel before multiplying",
    ex2s4: "Convert to a mixed number",
    ex3Q: <>A tailor decorates garments with ribbon. There is 1 roll of ribbon, 5 metres long. Each garment needs <InlineMath math="\frac{5}{8}" /> metre of ribbon. How many garments can be decorated?</>,
    ex3s1: "Identify the operation",
    ex3s1b: "Number of garments = total length ÷ length per garment",
    ex3s2: "Write 5 metres as a fraction",
    ex3s3: "Calculate the division",
    ex3ans: "8 garments can be decorated with ribbon",
    sec2Title: "Reciprocal (Inverse) of a Fraction",
    sec2Body: <>
      The <strong>reciprocal (inverse)</strong> of a fraction is found by swapping the numerator and denominator.{" "}
      The reciprocal of <InlineMath math="\frac{a}{b}" /> is <InlineMath math="\frac{b}{a}" />.{" "}
      Special property: when a fraction is multiplied by its reciprocal, the result is always <strong>1</strong>!{" "}
      This concept is the key to fraction division.
    </>,
    sec2FormulaTitle: "Properties of the Reciprocal:",
    sec2Formula1: "\\text{Reciprocal of } \\frac{a}{b} \\text{ is } \\frac{b}{a}",
    ex4Q: <>Find the reciprocal of: <InlineMath math="\frac{3}{7}" />, <InlineMath math="\frac{5}{2}" />, and <InlineMath math="4" /></>,
    ex4part: (l: string) => <><strong>{l}.</strong></>,
    ex4s1a: <>Reciprocal of <InlineMath math="\frac{3}{7}" />:</>,
    ex4swap: <>Swap numerator and denominator:</>,
    ex4s2a: <>Reciprocal of <InlineMath math="\frac{5}{2}" />:</>,
    ex4s3a: <>Reciprocal of <InlineMath math="4" />:</>,
    ex4toFrac: <>Write as a fraction: <InlineMath math="4 = \frac{4}{1}" /></>,
    ex4flip: <>Swap:</>,
    ex5Q: <>Find the reciprocal of the mixed number <InlineMath math="2\frac{3}{5}" /></>,
    ex5s1: "Convert the mixed number to an improper fraction",
    ex5s2: "Find its reciprocal",
    ex5s2b: <>The reciprocal of <InlineMath math="\frac{13}{5}" /> is <InlineMath math="\frac{5}{13}" /></>,
    ex5s3: "Verify by multiplying",
    ex5s3b: "(Correct!)",
    ex6Q: <>If <InlineMath math="x" /> is the reciprocal of <InlineMath math="3\frac{1}{4}" /> and <InlineMath math="y" /> is the reciprocal of <InlineMath math="2\frac{1}{6}" />, find the value of <InlineMath math="x + y" /></>,
    ex6s1: (frac: string) => <>Find x (reciprocal of <InlineMath math={frac} />)</>,
    ex6s2: (frac: string) => <>Find y (reciprocal of <InlineMath math={frac} />)</>,
    ex6s3: "Calculate x + y",
    ex6so: "so",
    sec3Title: "Division of Negative Fractions",
    sec3Body: <>
      Negative fraction division follows the same sign rules as multiplication:{" "}
      <strong> positive ÷ negative = negative</strong>, <strong>negative ÷ positive = negative</strong>,{" "}
      and <strong>negative ÷ negative = positive</strong>.{" "}
      The method is the same: change to multiplication by the reciprocal, then determine the sign!
    </>,
    sec3SignTitle: "Sign Rules in Division:",
    sec3SignNote: "Same signs = positive, Different signs = negative",
    ex7Q: <>Calculate <InlineMath math="\frac{3}{8} \div \left(-\frac{2}{5}\right)" /></>,
    ex7s1: "Change to multiplication by the reciprocal",
    ex7s2: "Multiply and determine the sign",
    ex8Q: <>Calculate <InlineMath math="-2\frac{1}{3} \div \left(-3\frac{1}{2}\right)" /></>,
    ex8s1: "Convert to improper fractions",
    ex8s2: "Change to multiplication by the reciprocal",
    ex8s3: "Multiply and determine the sign",
    ex8s3b: "Negative × Negative = Positive",
    ex9Q: <>Calculate <InlineMath math="\left(-\frac{3}{4}\right) \div \frac{9}{16} \div \left(-\frac{2}{3}\right)" /></>,
    ex9s1: "Work left to right, calculate the first part",
    ex9s2: "Continue with the second division",
    ex9s2b: "Negative × Negative = Positive",
    sumTitle: "➗ COMPLETE SUMMARY",
    sumSubtitle: "Fraction Division — Grade 7",
    sumSec1: "Fraction Division Rules",
    sumCards: [
      { label: "Formula: a/b ÷ c/d = a/b × d/c", desc: "Multiply by the reciprocal of the divisor! Flip the second fraction and multiply. This is the only rule you need to remember.", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
      { label: "KCF — Keep, Change, Flip", desc: "Keep (the first fraction) → Change (÷ to ×) → Flip (the second fraction). Three easy steps!", color: "from-amber-900/70 to-amber-800/30 border-amber-500/50 text-amber-200" },
      { label: "Division of Mixed Numbers", desc: "Convert to improper fractions first! 2½ ÷ 1¼ = 5/2 ÷ 5/4 = 5/2 × 4/5 = 20/10 = 2", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
      { label: "Whole number ÷ fraction", desc: "n ÷ a/b = n × b/a. Example: 6 ÷ 2/3 = 6 × 3/2 = 18/2 = 9. The result is bigger than 6!", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
    ],
    sumSec2: "Tips & Tricks",
    sumTips: [
      { icon: "🔄", tip: "Remember KCF: Keep-Change-Flip", detail: "This rule never fails: Keep the first fraction, Change ÷ to ×, Flip the second fraction. Practice until it's automatic!", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "🎯", tip: "Dividing by a fraction < 1 gives a larger result", detail: "6 ÷ 1/2 = 12. Dividing by a fraction produces a larger number! This is counter-intuitive but always true.", color: "bg-amber-900/30 border-amber-500/30" },
      { icon: "⚡", tip: "Cross-cancelling also works in division", detail: "After flipping to multiplication, you can cross-cancel to simplify before multiplying.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "✅", tip: "Verify with reverse multiplication", detail: "If a/b ÷ c/d = e/f, then e/f × c/d must equal a/b. Use this to check your answer!", color: "bg-green-900/30 border-green-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>Fraction division is <strong className="text-orange-300">multiplication in disguise</strong>! Just remember <strong className="text-yellow-300">KCF: Keep, Change, Flip</strong> — keep the first fraction, change the operation to multiplication, flip the second fraction. With this trick, no fraction division problem is beyond you!</>,
    tags: ["KCF: Keep-Change-Flip", "a/b ÷ c/d = a/b × d/c", "Mixed → Improper first", "Cross-Cancelling", "Verify with reverse"],
    nextLabel: "🏆 You have mastered all basic fraction operations!",
    backBtn: "Back to Rational Numbers",
  },
  ja: {
    pageTitle: "分数の割り算",
    pageSubtitle: "中学1年 - 有理数",
    sec1Title: "分数の割り算の基本概念",
    summaryLabel: "要点まとめ",
    sec1Body: <>
      <strong>分数の割り算</strong>にはクールなコツがあります：分数で割ることは、その<strong>逆数</strong>を掛けることと同じです！{" "}
      <InlineMath math="\frac{c}{d}" /> の逆数は <InlineMath math="\frac{d}{c}" />（分子と分母を入れ替える）です。{" "}
      割り算の記号を掛け算に変えて、除数の分数を逆にするだけです。簡単ですよね？
    </>,
    sec1FormulaTitle: "分数の割り算の公式：",
    sec1FormulaNote: <><InlineMath math="b \neq 0" />、<InlineMath math="c \neq 0" />、<InlineMath math="d \neq 0" /> のとき</>,
    tipTitle: "重要ヒント",
    sec1Tips: [
      <><strong>KCF</strong>（Keep, Change, Flip）：除数の逆数を掛ける！</>,
      <><InlineMath math="\frac{c}{d}" /> の逆数は <InlineMath math="\frac{d}{c}" /></>,
      <>最終的な答えはできるだけ約分する</>,
      <>帯分数はまず仮分数に変換する</>,
    ],
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    exLabel: "例題",
    discussLabel: "解説：",
    answerLabel: "答え：",
    step: (n: number) => `手順 ${n}：`,
    ex1Q: <><InlineMath math="\frac{3}{4} \div \frac{6}{5}" /> を計算せよ</>,
    ex1s1: "除数の逆数を求める",
    ex1s1b: <><InlineMath math="\frac{6}{5}" /> の逆数は <InlineMath math="\frac{5}{6}" /></>,
    ex1s2: "割り算を逆数との掛け算に変える",
    ex1s3: "掛けて約分する",
    ex2Q: <><InlineMath math="5\frac{1}{4} \div 4\frac{1}{8}" /> を計算せよ</>,
    ex2s1: "帯分数を仮分数に変換する",
    ex2s2: "除数の逆数を求めて掛ける",
    ex2s3: "掛ける前に斜め約分する",
    ex2s4: "帯分数に変換する",
    ex3Q: <>洋服を飾るためにリボンをつける。5 メートルのリボンが 1 巻あり、各洋服に <InlineMath math="\frac{5}{8}" /> メートルのリボンが必要です。何着の洋服を飾れますか？</>,
    ex3s1: "使う演算を特定する",
    ex3s1b: "洋服の数 = 全長 ÷ 1着あたりの長さ",
    ex3s2: "5 メートルを分数で表す",
    ex3s3: "割り算を計算する",
    ex3ans: "8 着の洋服にリボンを付けられます",
    sec2Title: "分数の逆数（逆元）",
    sec2Body: <>
      分数の<strong>逆数（逆元）</strong>は分子と分母を入れ替えることで求めます。{" "}
      <InlineMath math="\frac{a}{b}" /> の逆数は <InlineMath math="\frac{b}{a}" /> です。{" "}
      特別な性質：分数にその逆数を掛けると、結果は常に <strong>1</strong> になります！{" "}
      この概念が分数の割り算の鍵です。
    </>,
    sec2FormulaTitle: "逆数の性質：",
    sec2Formula1: "\\frac{a}{b} \\text{ の逆数は } \\frac{b}{a}",
    ex4Q: <>次の分数の逆数を求めよ：<InlineMath math="\frac{3}{7}" />、<InlineMath math="\frac{5}{2}" />、<InlineMath math="4" /></>,
    ex4part: (l: string) => <><strong>{l}.</strong></>,
    ex4s1a: <><InlineMath math="\frac{3}{7}" /> の逆数：</>,
    ex4swap: <>分子と分母を入れ替える：</>,
    ex4s2a: <><InlineMath math="\frac{5}{2}" /> の逆数：</>,
    ex4s3a: <><InlineMath math="4" /> の逆数：</>,
    ex4toFrac: <>分数で表す：<InlineMath math="4 = \frac{4}{1}" /></>,
    ex4flip: <>入れ替え：</>,
    ex5Q: <>帯分数 <InlineMath math="2\frac{3}{5}" /> の逆数を求めよ</>,
    ex5s1: "帯分数を仮分数に変換する",
    ex5s2: "逆数を求める",
    ex5s2b: <><InlineMath math="\frac{13}{5}" /> の逆数は <InlineMath math="\frac{5}{13}" /></>,
    ex5s3: "掛け算で確認する",
    ex5s3b: "（正しい！）",
    ex6Q: <><InlineMath math="x" /> が <InlineMath math="3\frac{1}{4}" /> の逆数、<InlineMath math="y" /> が <InlineMath math="2\frac{1}{6}" /> の逆数のとき、<InlineMath math="x + y" /> の値を求めよ</>,
    ex6s1: (frac: string) => <>x の値を求める（<InlineMath math={frac} /> の逆数）</>,
    ex6s2: (frac: string) => <>y の値を求める（<InlineMath math={frac} /> の逆数）</>,
    ex6s3: "x + y を計算する",
    ex6so: "なので",
    sec3Title: "負の分数の割り算",
    sec3Body: <>
      負の分数の割り算は掛け算と同じ符号ルールに従います：{" "}
      <strong>正 ÷ 負 = 負</strong>、<strong>負 ÷ 正 = 負</strong>、{" "}
      <strong>負 ÷ 負 = 正</strong>。{" "}
      方法は同じ：逆数との掛け算に変えてから符号を決める！
    </>,
    sec3SignTitle: "割り算の符号ルール：",
    sec3SignNote: "同符号 = 正、異符号 = 負",
    ex7Q: <><InlineMath math="\frac{3}{8} \div \left(-\frac{2}{5}\right)" /> を計算せよ</>,
    ex7s1: "逆数との掛け算に変える",
    ex7s2: "掛けて符号を決める",
    ex8Q: <><InlineMath math="-2\frac{1}{3} \div \left(-3\frac{1}{2}\right)" /> を計算せよ</>,
    ex8s1: "仮分数に変換する",
    ex8s2: "逆数との掛け算に変える",
    ex8s3: "掛けて符号を決める",
    ex8s3b: "負 × 負 = 正",
    ex9Q: <><InlineMath math="\left(-\frac{3}{4}\right) \div \frac{9}{16} \div \left(-\frac{2}{3}\right)" /> を計算せよ</>,
    ex9s1: "左から順に、最初の部分を計算する",
    ex9s2: "次の割り算を続ける",
    ex9s2b: "負 × 負 = 正",
    sumTitle: "➗ 完全まとめ",
    sumSubtitle: "分数の割り算 — 中学1年",
    sumSec1: "分数の割り算のルール",
    sumCards: [
      { label: "公式：a/b ÷ c/d = a/b × d/c", desc: "除数の逆数を掛ける！2つ目の分数をひっくり返して掛ける。覚えるルールはこれだけ。", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200" },
      { label: "KCF — Keep, Change, Flip", desc: "Keep（最初の分数を保持）→ Change（÷を×に変える）→ Flip（2つ目の分数を逆にする）。3つの簡単なステップ！", color: "from-amber-900/70 to-amber-800/30 border-amber-500/50 text-amber-200" },
      { label: "帯分数の割り算", desc: "まず仮分数に変換！2½ ÷ 1¼ = 5/2 ÷ 5/4 = 5/2 × 4/5 = 20/10 = 2", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200" },
      { label: "整数 ÷ 分数", desc: "n ÷ a/b = n × b/a。例：6 ÷ 2/3 = 6 × 3/2 = 18/2 = 9。結果は 6 より大きい！", color: "from-red-900/70 to-red-800/30 border-red-500/50 text-red-200" },
    ],
    sumSec2: "ヒントとコツ",
    sumTips: [
      { icon: "🔄", tip: "KCF を覚える：Keep-Change-Flip", detail: "このルールは絶対に間違いない：最初の分数を保持、÷を×に変える、2つ目の分数を逆にする。自動化するまで練習！", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "🎯", tip: "1未満の分数で割ると結果が大きくなる", detail: "6 ÷ 1/2 = 12。分数で割ると数が大きくなります！直感に反しますが、常に正しい。", color: "bg-amber-900/30 border-amber-500/30" },
      { icon: "⚡", tip: "割り算でも斜め約分が使える", detail: "掛け算にした後、掛ける前に斜め約分で簡略化できます。", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "✅", tip: "逆の掛け算で確認", detail: "a/b ÷ c/d = e/f なら、e/f × c/d = a/b でなければなりません。これで答えを確認しましょう！", color: "bg-green-900/30 border-green-500/30" },
    ],
    conclusionTitle: "結論",
    conclusionBody: <>分数の割り算は<strong className="text-orange-300">変装した掛け算</strong>です！<strong className="text-yellow-300">KCF：Keep, Change, Flip</strong> — 最初の分数を保持、演算を掛け算に変える、2つ目の分数を逆にする。このコツで、どんな分数の割り算の問題も解けます！</>,
    tags: ["KCF：Keep-Change-Flip", "a/b ÷ c/d = a/b × d/c", "帯分数→仮分数に", "斜め約分", "逆の掛け算で確認"],
    nextLabel: "🏆 基本的な分数の演算をすべてマスターしました！",
    backBtn: "有理数に戻る",
  },
};

const PembagianPecahanPage = () => {
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
                  <BlockMath math="\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c} = \frac{a \times d}{b \times c}" />
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
              {/* Example 1 - Easy */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                  <span className="text-green-300 font-semibold text-sm">{t.exLabel} 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex1Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex1s1}</p>
                    <div className="pl-4">{t.ex1s1b}</div>
                    <p><strong>{t.step(2)}</strong> {t.ex1s2}</p>
                    <div className="pl-4"><InlineMath math="\frac{3}{4} \div \frac{6}{5} = \frac{3}{4} \times \frac{5}{6}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex1s3}</p>
                    <div className="pl-4"><InlineMath math="= \frac{3 \times 5}{4 \times 6} = \frac{15}{24} = \frac{5}{8}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{5}{8}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 2 - Medium */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                  <span className="text-yellow-300 font-semibold text-sm">{t.exLabel} 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex2Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex2s1}</p>
                    <div className="pl-4"><InlineMath math="5\frac{1}{4} = \frac{(5 \times 4) + 1}{4} = \frac{21}{4}" /></div>
                    <div className="pl-4"><InlineMath math="4\frac{1}{8} = \frac{(4 \times 8) + 1}{8} = \frac{33}{8}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex2s2}</p>
                    <div className="pl-4"><InlineMath math="\frac{21}{4} \div \frac{33}{8} = \frac{21}{4} \times \frac{8}{33}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex2s3}</p>
                    <div className="pl-4"><InlineMath math="= \frac{21}{4} \times \frac{8}{33} = \frac{21 \times 8}{4 \times 33} = \frac{21 \times 2}{1 \times 33} = \frac{42}{33} = \frac{14}{11}" /></div>
                    <p><strong>{t.step(4)}</strong> {t.ex2s4}</p>
                    <div className="pl-4"><InlineMath math="\frac{14}{11} = 1\frac{3}{11}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="1\frac{3}{11}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 3 - Hard */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                  <span className="text-red-300 font-semibold text-sm">{t.exLabel} 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex3Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex3s1}</p>
                    <div className="pl-4">{t.ex3s1b}</div>
                    <p><strong>{t.step(2)}</strong> {t.ex3s2}</p>
                    <div className="pl-4"><InlineMath math="5 = \frac{5}{1}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex3s3}</p>
                    <div className="pl-4"><InlineMath math="\frac{5}{1} \div \frac{5}{8} = \frac{5}{1} \times \frac{8}{5}" /></div>
                    <div className="pl-4"><InlineMath math="= \frac{5 \times 8}{1 \times 5} = \frac{40}{5} = 8" /></div>
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
            <Repeat className="w-5 h-5 text-green-400 shrink-0" />
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
                <div className="bg-black/30 rounded-lg p-4 text-center space-y-3">
                  <BlockMath math={t.sec2Formula1} />
                  <BlockMath math="\frac{a}{b} \times \frac{b}{a} = 1" />
                </div>
              </div>
              {/* Example 4 - Easy */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                  <span className="text-green-300 font-semibold text-sm">{t.exLabel} 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex4Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p>{t.ex4part("a")} {t.ex4s1a}</p>
                    <div className="pl-4">{t.ex4swap} <InlineMath math="\frac{7}{3}" /></div>
                    <p>{t.ex4part("b")} {t.ex4s2a}</p>
                    <div className="pl-4">{t.ex4swap} <InlineMath math="\frac{2}{5}" /></div>
                    <p>{t.ex4part("c")} {t.ex4s3a}</p>
                    <div className="pl-4">{t.ex4toFrac}</div>
                    <div className="pl-4">{t.ex4flip} <InlineMath math="\frac{1}{4}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{7}{3}" />, <InlineMath math="\frac{2}{5}" />, <InlineMath math="\frac{1}{4}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 5 - Medium */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                  <span className="text-yellow-300 font-semibold text-sm">{t.exLabel} 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex5Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex5s1}</p>
                    <div className="pl-4"><InlineMath math="2\frac{3}{5} = \frac{(2 \times 5) + 3}{5} = \frac{13}{5}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex5s2}</p>
                    <div className="pl-4">{t.ex5s2b}</div>
                    <p><strong>{t.step(3)}</strong> {t.ex5s3}</p>
                    <div className="pl-4"><InlineMath math="\frac{13}{5} \times \frac{5}{13} = \frac{65}{65} = 1" /> {t.ex5s3b}</div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{5}{13}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 6 - Hard */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                  <span className="text-red-300 font-semibold text-sm">{t.exLabel} 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex6Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex6s1("3\\frac{1}{4}")}</p>
                    <div className="pl-4"><InlineMath math="3\frac{1}{4} = \frac{13}{4}" /> {t.ex6so} <InlineMath math="x = \frac{4}{13}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex6s2("2\\frac{1}{6}")}</p>
                    <div className="pl-4"><InlineMath math="2\frac{1}{6} = \frac{13}{6}" /> {t.ex6so} <InlineMath math="y = \frac{6}{13}" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex6s3}</p>
                    <div className="pl-4"><InlineMath math="x + y = \frac{4}{13} + \frac{6}{13} = \frac{4 + 6}{13} = \frac{10}{13}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{10}{13}" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3 */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full group flex items-center gap-4 bg-card/90 backdrop-blur border border-border rounded-xl px-5 py-4 transition-all duration-300 text-left">
            <MinusCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-body text-base text-white font-semibold">{t.sec3Title}</span>
          </div>
          {true && (
            <div className="mt-3 bg-card/70 backdrop-blur border border-border rounded-xl px-5 py-6 space-y-5 animate-slide-up">
              <div className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {t.summaryLabel}
                </h3>
                <p className="text-white/90 text-sm font-body leading-relaxed">{t.sec3Body}</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3">{t.sec3SignTitle}</h4>
                <div className="bg-black/30 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm font-body">
                    <div className="text-white/80"><InlineMath math="(+) \div (+) = (+)" /></div>
                    <div className="text-white/80"><InlineMath math="(+) \div (-) = (-)" /></div>
                    <div className="text-white/80"><InlineMath math="(-) \div (+) = (-)" /></div>
                    <div className="text-white/80"><InlineMath math="(-) \div (-) = (+)" /></div>
                  </div>
                  <p className="text-white/60 text-xs mt-2 text-center">{t.sec3SignNote}</p>
                </div>
              </div>
              {/* Example 7 - Easy */}
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeEasy}</span>
                  <span className="text-green-300 font-semibold text-sm">{t.exLabel} 1</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex7Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex7s1}</p>
                    <div className="pl-4"><InlineMath math="\frac{3}{8} \div \left(-\frac{2}{5}\right) = \frac{3}{8} \times \left(-\frac{5}{2}\right)" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex7s2}</p>
                    <div className="pl-4"><InlineMath math="= -\frac{3 \times 5}{8 \times 2} = -\frac{15}{16}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="-\frac{15}{16}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 8 - Medium */}
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">{t.badgeMedium}</span>
                  <span className="text-yellow-300 font-semibold text-sm">{t.exLabel} 2</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex8Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex8s1}</p>
                    <div className="pl-4"><InlineMath math="-2\frac{1}{3} = -\frac{7}{3}" /> dan <InlineMath math="-3\frac{1}{2} = -\frac{7}{2}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex8s2}</p>
                    <div className="pl-4"><InlineMath math="-\frac{7}{3} \div \left(-\frac{7}{2}\right) = -\frac{7}{3} \times \left(-\frac{2}{7}\right)" /></div>
                    <p><strong>{t.step(3)}</strong> {t.ex8s3}</p>
                    <div className="pl-4">{t.ex8s3b}</div>
                    <div className="pl-4"><InlineMath math="= +\frac{7 \times 2}{3 \times 7} = \frac{14}{21} = \frac{2}{3}" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="\frac{2}{3}" /></p>
                  </div>
                </div>
              </div>
              {/* Example 9 - Hard */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t.badgeHard}</span>
                  <span className="text-red-300 font-semibold text-sm">{t.exLabel} 3</span>
                </div>
                <p className="text-white/90 text-sm font-body mb-4">{t.ex9Q}</p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-cyan-300 text-sm font-semibold mb-2">{t.discussLabel}</h5>
                  <div className="text-white/80 text-sm font-body space-y-2">
                    <p><strong>{t.step(1)}</strong> {t.ex9s1}</p>
                    <div className="pl-4"><InlineMath math="\left(-\frac{3}{4}\right) \div \frac{9}{16} = \left(-\frac{3}{4}\right) \times \frac{16}{9}" /></div>
                    <div className="pl-4"><InlineMath math="= -\frac{3 \times 16}{4 \times 9} = -\frac{48}{36} = -\frac{4}{3}" /></div>
                    <p><strong>{t.step(2)}</strong> {t.ex9s2}</p>
                    <div className="pl-4"><InlineMath math="-\frac{4}{3} \div \left(-\frac{2}{3}\right) = -\frac{4}{3} \times \left(-\frac{3}{2}\right)" /></div>
                    <div className="pl-4">{t.ex9s2b}</div>
                    <div className="pl-4"><InlineMath math="= +\frac{4 \times 3}{3 \times 2} = \frac{12}{6} = 2" /></div>
                    <p className="text-cyan-300 mt-2"><strong>{t.answerLabel}</strong> <InlineMath math="2" /></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{t.sumTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{t.sumSubtitle}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500 flex items-center justify-center text-[10px]">1</span>
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
            <div className="bg-gradient-to-br from-orange-500/20 via-amber-500/15 to-yellow-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🍊</div>
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

export default PembagianPecahanPage;
