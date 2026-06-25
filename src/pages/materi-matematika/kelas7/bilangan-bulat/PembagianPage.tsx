import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, AlertCircle, Zap, Calculator } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "PEMBAGIAN BILANGAN BULAT",
    pageSubtitle: "Kelas 7 - Bilangan Bulat - Materi Matematika",

    introBtn: "Kunci Rahasia: Pembagian = Kebalikan Perkalian",
    introBodyP1: "Mau tahu rahasia memahami pembagian dengan mudah? ",
    introBodyBold: "Pembagian adalah operasi kebalikan dari perkalian!",
    introBodyP2: " Ini adalah kunci yang akan membantumu menyelesaikan semua soal pembagian bilangan bulat.",
    introExampleTitle: "Contoh Penerapan:",
    introEx1: "Misalnya, untuk mencari nilai ",
    introEx1b: " dari ",
    introEx2: 'Kita bisa bertanya: "Bilangan berapa yang jika dikalikan 7 hasilnya 56?"',
    introEx3: "Atau cukup hitung: ",
    introEx4: "Jawabannya sama: ",
    introGoldenTitle: "Rumus Emas:",
    introGeneral: "Secara umum: ",
    introTipP1: "Tips! Operasi kebalikan ini disebut juga ",
    introTipBold: "invers perkalian",
    introTipP2: ". Dengan memahami konsep ini, kamu bisa mengecek hasil pembagianmu dengan cara mengalikan kembali!",

    posPos: "Positif : Positif = Positif",
    posPosBody: "Pembagian dua bilangan positif menghasilkan bilangan positif. Mari kita buktikan dengan konsep kebalikan perkalian!",
    verif: "Pembuktian:",
    artinya: "artinya",
    q12x3: "Bilangan berapa yang jika dikali 3 hasilnya 12?",
    q30x6: "Bilangan berapa yang jika dikali 6 hasilnya 30?",
    jawab: "Jawab: ",
    karena: " karena ",
    konklusi: "Kesimpulan:",
    katexPosPos: "\\text{Positif} \\div \\text{Positif} = \\textbf{Positif}",

    negPos: "Negatif : Positif = Negatif",
    negPosBody: "Yuk kita buktikan dengan konsep kebalikan perkalian! Cari bilangan yang jika dikalikan dengan pembagi menghasilkan bilangan yang dibagi.",
    qNeg6x2: "Bilangan berapa yang jika dikali 2 hasilnya -6?",
    qNeg20x4: "Bilangan berapa yang jika dikali 4 hasilnya -20?",
    katexNegPos: "\\text{Negatif} \\div \\text{Positif} = \\textbf{Negatif}",

    posNeg: "Positif : Negatif = Negatif",
    posNegBody: "Dengan cara yang sama, mari kita buktikan pembagian bilangan positif dengan negatif:",
    q15xNeg3: "Bilangan berapa yang jika dikali -3 hasilnya 15?",
    q30xNeg5: "Bilangan berapa yang jika dikali -5 hasilnya 30?",
    katexPosNeg: "\\text{Positif} \\div \\text{Negatif} = \\textbf{Negatif}",

    negNeg: "Negatif : Negatif = Positif",
    negNegBody: "Nah, sama seperti perkalian, dua bilangan negatif dibagi menghasilkan bilangan positif! Mari kita buktikan:",
    qNeg12xNeg3: "Bilangan berapa yang jika dikali -3 hasilnya -12?",
    qNeg40xNeg5: "Bilangan berapa yang jika dikali -5 hasilnya -40?",
    katexNegNeg: "\\text{Negatif} \\div \\text{Negatif} = \\textbf{Positif}",

    signTableTitle: "Ringkasan Aturan Tanda Pembagian:",
    signTableH1: "Bilangan 1",
    signTableDiv: ":",
    signTableH2: "Bilangan 2",
    signTableEq: "=",
    signTableResult: "Hasil",
    signPos: "Positif (+)",
    signNeg: "Negatif (-)",
    signResultPos: "Positif (+)",
    signResultNeg: "Negatif (-)",
    memorize: "Cara Mudah Mengingat:",
    memorizeBody: "Aturan tanda pembagian SAMA PERSIS dengan aturan tanda perkalian! Jika tandanya sama = positif, jika tandanya beda = negatif.",

    divZeroBtn: "Pembagian dengan Nol (AWAS!)",
    divZeroWarningP1: "Ada satu hal yang WAJIB kamu ingat dalam pembagian: ",
    divZeroWarningBold: "TIDAK BOLEH membagi dengan nol!",
    divZeroWhy: "Mengapa tidak boleh?",
    divZeroEx1P1: "Misalkan ",
    divZeroEx1P2: ", maka ",
    divZeroEx1Q: "Adakah bilangan yang jika dikali 0 hasilnya 8?",
    divZeroEx1A: "TIDAK ADA! Karena bilangan apapun dikali 0 selalu = 0",
    divZeroEx2P1: "Misalkan ",
    divZeroEx2P2: ", maka ",
    divZeroEx2Q: "Adakah bilangan yang jika dikali 0 hasilnya -9?",
    divZeroEx2A: "TIDAK ADA!",
    divZeroKonklusi: "Kesimpulan:",
    katexDivZero: "a \\div 0 = \\text{TIDAK TERDEFINISI}",
    divZeroNote: "Untuk sembarang bilangan bulat ",
    divZeroNoteEnd: ", pembagian dengan 0 tidak memiliki hasil.",
    divZeroCalcTitle: "Coba di Kalkulator!",
    divZeroCalcBody1: "Jika kamu mencoba menghitung ",
    divZeroCalcBody2: " di kalkulator, akan muncul ",
    divZeroCalcOr: " atau ",
    divZeroCalcBody3: ". Ini membuktikan bahwa pembagian dengan nol memang tidak bisa dilakukan!",
    divZeroRemember: "Tapi ingat!",
    divZeroRememberBody: " (nol dibagi bilangan apapun selain nol hasilnya nol). Yang tidak boleh adalah ",
    divZeroRememberEnd: " (bilangan dibagi nol).",

    contohBtn: "Contoh Soal & Pembahasan",
    badgeMudah: "MUDAH",
    badgeSedang: "SEDANG",
    badgeSulit: "SULIT",
    badgeBonus: "BONUS",
    contoh1Title: "Contoh 1: Pembagian Dasar",
    contoh1Q: "Hitunglah hasil pembagian berikut:",
    pembahasan: "Pembahasan:",
    annotNegPos: "(Negatif : Positif = Negatif)",
    annotPosNeg: "(Positif : Negatif = Negatif)",
    annotNegNeg: "(Negatif : Negatif = Positif)",
    contoh2Title: "Contoh 2: Pembagian Bertingkat",
    contoh2Q: "Hitunglah hasil pembagian berikut:",
    contoh3Title: "Contoh 3: Soal Cerita",
    contoh3Story: "Sebuah kapal selam menyelam dari permukaan laut hingga kedalaman 120 meter di bawah permukaan laut dalam waktu 8 menit dengan kecepatan konstan. Berapa meter perubahan kedalaman kapal selam setiap menitnya?",
    diketahui: "Diketahui:",
    ditanya: "Ditanya: Perubahan kedalaman per menit?",
    jawabLabel: "Jawab:",
    contoh3Known1: "Kedalaman akhir = 120 m di bawah permukaan = ",
    contoh3Known1b: " m",
    contoh3Known2: "Waktu = 8 menit",
    katexContoh3: "\\text{Perubahan per menit} = (-120) \\div 8 = -15 \\text{ meter}",
    contoh3Conclusion: "Jadi, kapal selam turun (berubah) ",
    contoh3ConcBold: "15 meter ke bawah",
    contoh3ConcEnd: " setiap menitnya.",
    contoh4Title: "Contoh 4: Operasi Gabungan",
    contoh4Q: "Hitunglah:",
    langkah1: "Langkah 1: Kerjakan yang di dalam kurung dulu",
    langkah2: "Langkah 2: Substitusikan hasil",
    contoh4Conclusion: "Jadi, ",

    kesimpulanBtn: "Kesimpulan & Tips Pembagian Bilangan Bulat",
    signSummaryTitle: "Kesimpulan Aturan Tanda Pembagian:",
    signPos2: "Positif (+)",
    signNeg2: "Negatif (−)",
    easyMemorize: "Cara mudah mengingat:",
    easyMemorizeBody: "Tanda sama → positif \u00a0|\u00a0 Tanda beda → negatif",
    importantRulesTitle: "Aturan Penting yang Wajib Diingat:",
    rule1Bold: "Tidak bisa dibagi nol:",
    rule1Body: " tidak terdefinisi untuk semua bilangan ",
    rule2Bold: "Nol dibagi bilangan apapun:",
    rule2Body: " selama ",
    rule3Bold: "Hubungan dengan perkalian:",
    rule3Body: " berarti ",
    rule3End: ". Gunakan ini untuk mengecek jawaban!",
    tipsTitle: "Tips Cepat Mengerjakan Soal:",
    tip1Bold: "Tentukan tanda dulu, hitung nilai mutlaknya kemudian.",
    tip1Body: " Misalnya ",
    tip1End: ": tanda (−)÷(+) = negatif, nilai mutlak ",
    tip1End2: ", jadi hasilnya ",
    tip2Bold: "Kerjakan kurung terdalam dahulu",
    tip2Body: " pada operasi bertingkat, baru lanjut ke luar.",
    tip3Bold: "Verifikasi jawaban dengan perkalian balik.",
    tip3Body: " Jika ",
    tip3End: ", cek: ",
    tip4Bold: "Ingat: pembagian TIDAK komutatif.",
    tip4Body: " ",
    tip4End: ", jadi urutan pembagian tidak boleh ditukar!",

    rangkumanTitle: "➗ RANGKUMAN LENGKAP",
    rangkumanSub: "Pembagian Bilangan Bulat — Kelas 7",
    aturanTandaTitle: "Aturan Tanda Pembagian — Sama Seperti Perkalian!",
    aturanEmasTitle: "🔑 Aturan Emas — Sama dengan Perkalian:",
    aturanEmasBody1: "Tanda ",
    aturanEmasSame: "SAMA",
    aturanEmasBody2: " → hasil ",
    aturanEmasPos: "POSITIF",
    aturanEmasBody3: " \u00a0|\u00a0 Tanda ",
    aturanEmasDiff: "BERBEDA",
    aturanEmasBody4: " → hasil ",
    aturanEmasNeg: "NEGATIF",
    signGrid: [
      { kiri: "(+) ÷ (+)", kanan: "= (+)", contoh: "12 ÷ 3 = 4" },
      { kiri: "(−) ÷ (−)", kanan: "= (+)", contoh: "(−12) ÷ (−3) = 4" },
      { kiri: "(+) ÷ (−)", kanan: "= (−)", contoh: "12 ÷ (−3) = −4" },
      { kiri: "(−) ÷ (+)", kanan: "= (−)", contoh: "(−12) ÷ 3 = −4" },
    ],
    sifatTitle: "Sifat & Aturan Penting Pembagian",
    sifatItems: [
      { sifat: "Pembagian dengan 0 tidak terdefinisi", detail: "a ÷ 0 = tidak terdefinisi. Tidak ada bilangan apapun yang dikalikan 0 menghasilkan a (kecuali a = 0 yang hasilnya tak tentu)." },
      { sifat: "0 dibagi bilangan apapun = 0", detail: "0 ÷ a = 0 (untuk a ≠ 0). Contoh: 0 ÷ (−7) = 0" },
      { sifat: "Pembagian TIDAK Komutatif", detail: "a ÷ b ≠ b ÷ a (umumnya). Urutan sangat penting! 12 ÷ 3 = 4, tetapi 3 ÷ 12 = 0,25" },
      { sifat: "Pembagian = Kebalikan Perkalian", detail: "a ÷ b = c berarti c × b = a. Gunakan ini untuk verifikasi jawaban!" },
    ],
    trikTitle: "Tips & Trik Jitu Pembagian",
    trikItems: [
      { icon: "🎯", tip: "Tentukan tanda dulu, hitung nilai mutlak kemudian", detail: "Pisahkan masalah tanda dan masalah nilai. Tanda: sama = positif, beda = negatif. Nilai: abaikan tanda, bagi saja." },
      { icon: "✅", tip: "Verifikasi dengan perkalian balik", detail: "Jika −36 ÷ 4 = −9, cek: (−9) × 4 = −36 ✓. Kalau tidak cocok, ada yang salah!" },
      { icon: "⚠️", tip: "Waspada: pembagi 0 = jebakan!", detail: "Soal ujian sering memancing jawaban yang melibatkan pembagi 0. Ingat: pembagian dengan 0 selalu TIDAK TERDEFINISI!" },
      { icon: "🧮", tip: "Ubah ke perkalian jika perlu", detail: "Kesulitan membagi? Ubah a ÷ b = a × (1/b). Berguna terutama jika pembaginya besar atau pecahan." },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionP1: "Pembagian bilangan bulat adalah",
    conclusionBold1: "kebalikan dari perkalian",
    conclusionP2: ", dan aturan tandanya persis sama. Ingat:",
    conclusionBold2: "tanda sama = positif, tanda beda = negatif",
    conclusionP3: ", dan jangan pernah membagi dengan nol! Dengan memahami pembagian, kamu telah melengkapi keempat operasi dasar bilangan bulat!",
    conclusionTags: ["Tanda Sama = +", "Tanda Beda = −", "÷ 0 Tidak Terdefinisi", "Kebalikan Perkalian", "Verifikasi"],
    conclusionCta: "🚀 Lanjut ke Operasi Campuran — gabungan semua operasi!",
    backBtn: "Kembali ke Daftar Materi",
  },

  en: {
    pageTitle: "DIVISION OF INTEGERS",
    pageSubtitle: "Grade 7 - Integers - Mathematics",

    introBtn: "The Secret Key: Division = Inverse of Multiplication",
    introBodyP1: "Want to know the secret to understanding division easily? ",
    introBodyBold: "Division is the inverse operation of multiplication!",
    introBodyP2: " This is the key that will help you solve all integer division problems.",
    introExampleTitle: "Application Example:",
    introEx1: "For example, to find the value of ",
    introEx1b: " from ",
    introEx2: 'We can ask: "What number multiplied by 7 gives 56?"',
    introEx3: "Or simply calculate: ",
    introEx4: "The answer is the same: ",
    introGoldenTitle: "Golden Formula:",
    introGeneral: "In general: ",
    introTipP1: "Tip! This inverse operation is also called ",
    introTipBold: "multiplicative inverse",
    introTipP2: ". By understanding this concept, you can verify your division result by multiplying back!",

    posPos: "Positive ÷ Positive = Positive",
    posPosBody: "Dividing two positive numbers gives a positive result. Let's verify this with the inverse multiplication concept!",
    verif: "Verification:",
    artinya: "means",
    q12x3: "What number multiplied by 3 gives 12?",
    q30x6: "What number multiplied by 6 gives 30?",
    jawab: "Answer: ",
    karena: " because ",
    konklusi: "Conclusion:",
    katexPosPos: "\\text{Positive} \\div \\text{Positive} = \\textbf{Positive}",

    negPos: "Negative ÷ Positive = Negative",
    negPosBody: "Let's verify using the inverse multiplication concept! Find the number that, when multiplied by the divisor, gives the dividend.",
    qNeg6x2: "What number multiplied by 2 gives −6?",
    qNeg20x4: "What number multiplied by 4 gives −20?",
    katexNegPos: "\\text{Negative} \\div \\text{Positive} = \\textbf{Negative}",

    posNeg: "Positive ÷ Negative = Negative",
    posNegBody: "In the same way, let's verify dividing a positive number by a negative:",
    q15xNeg3: "What number multiplied by −3 gives 15?",
    q30xNeg5: "What number multiplied by −5 gives 30?",
    katexPosNeg: "\\text{Positive} \\div \\text{Negative} = \\textbf{Negative}",

    negNeg: "Negative ÷ Negative = Positive",
    negNegBody: "Just like multiplication, dividing two negative numbers gives a positive result! Let's verify:",
    qNeg12xNeg3: "What number multiplied by −3 gives −12?",
    qNeg40xNeg5: "What number multiplied by −5 gives −40?",
    katexNegNeg: "\\text{Negative} \\div \\text{Negative} = \\textbf{Positive}",

    signTableTitle: "Sign Rules Summary for Division:",
    signTableH1: "Number 1",
    signTableDiv: "÷",
    signTableH2: "Number 2",
    signTableEq: "=",
    signTableResult: "Result",
    signPos: "Positive (+)",
    signNeg: "Negative (−)",
    signResultPos: "Positive (+)",
    signResultNeg: "Negative (−)",
    memorize: "Easy Way to Remember:",
    memorizeBody: "The sign rules for division are EXACTLY the same as for multiplication! Same signs = positive, different signs = negative.",

    divZeroBtn: "Division by Zero (WARNING!)",
    divZeroWarningP1: "There is one thing you MUST remember in division: ",
    divZeroWarningBold: "NEVER divide by zero!",
    divZeroWhy: "Why is it not allowed?",
    divZeroEx1P1: "Suppose ",
    divZeroEx1P2: ", then ",
    divZeroEx1Q: "Is there a number that when multiplied by 0 gives 8?",
    divZeroEx1A: "NO! Because any number multiplied by 0 is always 0.",
    divZeroEx2P1: "Suppose ",
    divZeroEx2P2: ", then ",
    divZeroEx2Q: "Is there a number that when multiplied by 0 gives −9?",
    divZeroEx2A: "NO!",
    divZeroKonklusi: "Conclusion:",
    katexDivZero: "a \\div 0 = \\text{UNDEFINED}",
    divZeroNote: "For any integer ",
    divZeroNoteEnd: ", division by 0 has no result.",
    divZeroCalcTitle: "Try on a Calculator!",
    divZeroCalcBody1: "If you try to calculate ",
    divZeroCalcBody2: " on a calculator, you will see ",
    divZeroCalcOr: " or ",
    divZeroCalcBody3: ". This proves that division by zero is truly impossible!",
    divZeroRemember: "But remember!",
    divZeroRememberBody: " (zero divided by any nonzero number equals zero). What is not allowed is ",
    divZeroRememberEnd: " (a number divided by zero).",

    contohBtn: "Practice Problems & Solutions",
    badgeMudah: "EASY",
    badgeSedang: "MEDIUM",
    badgeSulit: "HARD",
    badgeBonus: "BONUS",
    contoh1Title: "Example 1: Basic Division",
    contoh1Q: "Calculate the following divisions:",
    pembahasan: "Solution:",
    annotNegPos: "(Negative ÷ Positive = Negative)",
    annotPosNeg: "(Positive ÷ Negative = Negative)",
    annotNegNeg: "(Negative ÷ Negative = Positive)",
    contoh2Title: "Example 2: Chained Division",
    contoh2Q: "Calculate the following divisions:",
    contoh3Title: "Example 3: Word Problem",
    contoh3Story: "A submarine dives from the sea surface to a depth of 120 meters below sea level in 8 minutes at a constant speed. How many meters does the submarine's depth change each minute?",
    diketahui: "Given:",
    ditanya: "Find: Change in depth per minute?",
    jawabLabel: "Solution:",
    contoh3Known1: "Final depth = 120 m below surface = ",
    contoh3Known1b: " m",
    contoh3Known2: "Time = 8 minutes",
    katexContoh3: "\\text{Change per minute} = (-120) \\div 8 = -15 \\text{ m}",
    contoh3Conclusion: "So, the submarine descends ",
    contoh3ConcBold: "15 meters downward",
    contoh3ConcEnd: " every minute.",
    contoh4Title: "Example 4: Combined Operations",
    contoh4Q: "Calculate:",
    langkah1: "Step 1: Evaluate inside the brackets first",
    langkah2: "Step 2: Substitute the result",
    contoh4Conclusion: "So, ",

    kesimpulanBtn: "Conclusion & Tips for Integer Division",
    signSummaryTitle: "Division Sign Rules Summary:",
    signPos2: "Positive (+)",
    signNeg2: "Negative (−)",
    easyMemorize: "Easy way to remember:",
    easyMemorizeBody: "Same signs → positive \u00a0|\u00a0 Different signs → negative",
    importantRulesTitle: "Important Rules to Remember:",
    rule1Bold: "Cannot divide by zero:",
    rule1Body: " is undefined for all numbers ",
    rule2Bold: "Zero divided by any number:",
    rule2Body: " as long as ",
    rule3Bold: "Relationship with multiplication:",
    rule3Body: " means ",
    rule3End: ". Use this to verify your answers!",
    tipsTitle: "Quick Tips for Solving Problems:",
    tip1Bold: "Determine the sign first, then calculate the absolute value.",
    tip1Body: " For example ",
    tip1End: ": sign (−)÷(+) = negative, absolute value ",
    tip1End2: ", so the result is ",
    tip2Bold: "Work from the innermost brackets first",
    tip2Body: " in chained operations, then move outward.",
    tip3Bold: "Verify the answer by reverse multiplication.",
    tip3Body: " If ",
    tip3End: ", check: ",
    tip4Bold: "Remember: division is NOT commutative.",
    tip4Body: " ",
    tip4End: ", so the order of division must not be swapped!",

    rangkumanTitle: "➗ COMPLETE SUMMARY",
    rangkumanSub: "Division of Integers — Grade 7",
    aturanTandaTitle: "Division Sign Rules — Same as Multiplication!",
    aturanEmasTitle: "🔑 Golden Rule — Same as Multiplication:",
    aturanEmasBody1: "Same ",
    aturanEmasSame: "SIGNS",
    aturanEmasBody2: " → result is ",
    aturanEmasPos: "POSITIVE",
    aturanEmasBody3: " \u00a0|\u00a0 Different ",
    aturanEmasDiff: "SIGNS",
    aturanEmasBody4: " → result is ",
    aturanEmasNeg: "NEGATIVE",
    signGrid: [
      { kiri: "(+) ÷ (+)", kanan: "= (+)", contoh: "12 ÷ 3 = 4" },
      { kiri: "(−) ÷ (−)", kanan: "= (+)", contoh: "(−12) ÷ (−3) = 4" },
      { kiri: "(+) ÷ (−)", kanan: "= (−)", contoh: "12 ÷ (−3) = −4" },
      { kiri: "(−) ÷ (+)", kanan: "= (−)", contoh: "(−12) ÷ 3 = −4" },
    ],
    sifatTitle: "Properties & Important Rules of Division",
    sifatItems: [
      { sifat: "Division by 0 is undefined", detail: "a ÷ 0 = undefined. No number multiplied by 0 gives a (unless a = 0, which is indeterminate)." },
      { sifat: "0 divided by any number = 0", detail: "0 ÷ a = 0 (for a ≠ 0). Example: 0 ÷ (−7) = 0" },
      { sifat: "Division is NOT Commutative", detail: "a ÷ b ≠ b ÷ a (in general). Order matters! 12 ÷ 3 = 4, but 3 ÷ 12 = 0.25" },
      { sifat: "Division = Inverse of Multiplication", detail: "a ÷ b = c means c × b = a. Use this to verify your answers!" },
    ],
    trikTitle: "Division Tips & Tricks",
    trikItems: [
      { icon: "🎯", tip: "Determine the sign first, then compute the absolute value", detail: "Separate the sign problem from the value problem. Sign: same = positive, different = negative. Value: ignore the sign, just divide." },
      { icon: "✅", tip: "Verify by reverse multiplication", detail: "If −36 ÷ 4 = −9, check: (−9) × 4 = −36 ✓. If it doesn't match, something is wrong!" },
      { icon: "⚠️", tip: "Watch out: divisor 0 = a trap!", detail: "Exam questions often trick you into answers involving a divisor of 0. Remember: division by 0 is always UNDEFINED!" },
      { icon: "🧮", tip: "Convert to multiplication if needed", detail: "Struggling to divide? Convert a ÷ b = a × (1/b). Especially useful when the divisor is large or a fraction." },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionP1: "Integer division is the",
    conclusionBold1: "inverse of multiplication",
    conclusionP2: ", and its sign rules are exactly the same. Remember:",
    conclusionBold2: "same signs = positive, different signs = negative",
    conclusionP3: ", and never divide by zero! By mastering division, you have completed all four basic operations on integers!",
    conclusionTags: ["Same Signs = +", "Diff. Signs = −", "÷ 0 Undefined", "Inverse of ×", "Verify"],
    conclusionCta: "🚀 Next: Mixed Operations — combining all operations!",
    backBtn: "Back to Topic List",
  },

  ja: {
    pageTitle: "整数の割り算",
    pageSubtitle: "7年生 - 整数 - 数学",

    introBtn: "秘密の鍵：割り算＝掛け算の逆",
    introBodyP1: "割り算を簡単に理解する秘密を知りたいですか？ ",
    introBodyBold: "割り算は掛け算の逆演算です！",
    introBodyP2: " これが整数の割り算の問題をすべて解くための鍵になります。",
    introExampleTitle: "適用例：",
    introEx1: "例えば、",
    introEx1b: " から ",
    introEx2: "「7をかけて56になる数は何ですか？」と考えることができます。",
    introEx3: "または単純に計算します：",
    introEx4: "答えは同じです：",
    introGoldenTitle: "黄金公式：",
    introGeneral: "一般的に：",
    introTipP1: "ヒント！この逆演算は ",
    introTipBold: "乗法の逆元",
    introTipP2: " とも呼ばれます。この概念を理解することで、掛け算で確認して割り算の答えを検証できます！",

    posPos: "正 ÷ 正 = 正",
    posPosBody: "正の数同士の割り算は正の結果になります。掛け算の逆演算の概念で確認してみましょう！",
    verif: "確認：",
    artinya: "は",
    q12x3: "3をかけて12になる数は何ですか？",
    q30x6: "6をかけて30になる数は何ですか？",
    jawab: "答え：",
    karena: "。なぜなら ",
    konklusi: "まとめ：",
    katexPosPos: "\\text{正} \\div \\text{正} = \\textbf{正}",

    negPos: "負 ÷ 正 = 負",
    negPosBody: "掛け算の逆演算の概念で確認しましょう！割られる数になるように、割る数にかける数を探します。",
    qNeg6x2: "2をかけて−6になる数は何ですか？",
    qNeg20x4: "4をかけて−20になる数は何ですか？",
    katexNegPos: "\\text{負} \\div \\text{正} = \\textbf{負}",

    posNeg: "正 ÷ 負 = 負",
    posNegBody: "同じ方法で、正の数を負の数で割る場合を確認しましょう：",
    q15xNeg3: "−3をかけて15になる数は何ですか？",
    q30xNeg5: "−5をかけて30になる数は何ですか？",
    katexPosNeg: "\\text{正} \\div \\text{負} = \\textbf{負}",

    negNeg: "負 ÷ 負 = 正",
    negNegBody: "掛け算と同様に、負の数同士を割ると正の結果になります！確認してみましょう：",
    qNeg12xNeg3: "−3をかけて−12になる数は何ですか？",
    qNeg40xNeg5: "−5をかけて−40になる数は何ですか？",
    katexNegNeg: "\\text{負} \\div \\text{負} = \\textbf{正}",

    signTableTitle: "割り算の符号ルール一覧：",
    signTableH1: "数1",
    signTableDiv: "÷",
    signTableH2: "数2",
    signTableEq: "=",
    signTableResult: "結果",
    signPos: "正 (+)",
    signNeg: "負 (−)",
    signResultPos: "正 (+)",
    signResultNeg: "負 (−)",
    memorize: "覚え方：",
    memorizeBody: "割り算の符号ルールは掛け算とまったく同じです！同符号＝正、異符号＝負。",

    divZeroBtn: "ゼロで割る（注意！）",
    divZeroWarningP1: "割り算で必ず覚えておくべきことが一つあります：",
    divZeroWarningBold: "ゼロで割ってはいけません！",
    divZeroWhy: "なぜいけないのですか？",
    divZeroEx1P1: "仮に ",
    divZeroEx1P2: " とすると、",
    divZeroEx1Q: "0をかけて8になる数はありますか？",
    divZeroEx1A: "ありません！どんな数に0をかけても常に0になるからです。",
    divZeroEx2P1: "仮に ",
    divZeroEx2P2: " とすると、",
    divZeroEx2Q: "0をかけて−9になる数はありますか？",
    divZeroEx2A: "ありません！",
    divZeroKonklusi: "まとめ：",
    katexDivZero: "a \\div 0 = \\text{定義されない}",
    divZeroNote: "任意の整数 ",
    divZeroNoteEnd: " に対して、0で割ることは結果を持ちません。",
    divZeroCalcTitle: "電卓で試してみよう！",
    divZeroCalcBody1: "電卓で ",
    divZeroCalcBody2: " を計算しようとすると、",
    divZeroCalcOr: " または ",
    divZeroCalcBody3: " と表示されます。これがゼロで割ることは不可能であることの証拠です！",
    divZeroRemember: "でも覚えておいて！",
    divZeroRememberBody: "（ゼロをゼロ以外の数で割るとゼロになります）。禁止されているのは ",
    divZeroRememberEnd: "（数をゼロで割ること）です。",

    contohBtn: "練習問題と解説",
    badgeMudah: "基本",
    badgeSedang: "標準",
    badgeSulit: "発展",
    badgeBonus: "ボーナス",
    contoh1Title: "例題1：基本的な割り算",
    contoh1Q: "次の割り算を計算しなさい：",
    pembahasan: "解説：",
    annotNegPos: "（負 ÷ 正 = 負）",
    annotPosNeg: "（正 ÷ 負 = 負）",
    annotNegNeg: "（負 ÷ 負 = 正）",
    contoh2Title: "例題2：連続した割り算",
    contoh2Q: "次の割り算を計算しなさい：",
    contoh3Title: "例題3：文章問題",
    contoh3Story: "潜水艦が海面から8分間で一定の速さで海面下120mの深さまで潜りました。潜水艦の深さは毎分何メートル変化しましたか？",
    diketahui: "わかっていること：",
    ditanya: "求めること：1分あたりの深さの変化",
    jawabLabel: "解答：",
    contoh3Known1: "最終深度 = 海面下120m = ",
    contoh3Known1b: " m",
    contoh3Known2: "時間 = 8分",
    katexContoh3: "\\text{1分あたりの変化量} = (-120) \\div 8 = -15 \\text{ m}",
    contoh3Conclusion: "したがって、潜水艦は毎分 ",
    contoh3ConcBold: "15m下方向",
    contoh3ConcEnd: " に変化します。",
    contoh4Title: "例題4：複合演算",
    contoh4Q: "計算しなさい：",
    langkah1: "ステップ1：まず括弧の中を計算する",
    langkah2: "ステップ2：結果を代入する",
    contoh4Conclusion: "したがって、",

    kesimpulanBtn: "まとめと整数の割り算のコツ",
    signSummaryTitle: "割り算の符号ルールのまとめ：",
    signPos2: "正 (+)",
    signNeg2: "負 (−)",
    easyMemorize: "覚え方：",
    easyMemorizeBody: "同符号 → 正 \u00a0|\u00a0 異符号 → 負",
    importantRulesTitle: "必ず覚えておくべき重要なルール：",
    rule1Bold: "ゼロで割ることはできない：",
    rule1Body: " はすべての数 ",
    rule2Bold: "ゼロを任意の数で割る：",
    rule2Body: "（ただし ",
    rule3Bold: "掛け算との関係：",
    rule3Body: " は ",
    rule3End: " を意味します。これを使って答えを確認しましょう！",
    tipsTitle: "問題を解くための素早いコツ：",
    tip1Bold: "まず符号を決め、次に絶対値を計算する。",
    tip1Body: " 例えば ",
    tip1End: "：符号 (−)÷(+) = 負、絶対値 ",
    tip1End2: "、よって結果は ",
    tip2Bold: "最も内側の括弧から先に計算する",
    tip2Body: "、それから外側へ進む。",
    tip3Bold: "逆の掛け算で答えを確認する。",
    tip3Body: "もし ",
    tip3End: " なら、確認：",
    tip4Bold: "割り算は交換可能ではない。",
    tip4Body: " ",
    tip4End: "なので、割り算の順序を入れ替えてはいけません！",

    rangkumanTitle: "➗ 完全まとめ",
    rangkumanSub: "整数の割り算 — 7年生",
    aturanTandaTitle: "割り算の符号ルール — 掛け算と同じ！",
    aturanEmasTitle: "🔑 黄金ルール — 掛け算と同じ：",
    aturanEmasBody1: "同じ",
    aturanEmasSame: "符号",
    aturanEmasBody2: " → 結果は",
    aturanEmasPos: "正",
    aturanEmasBody3: " \u00a0|\u00a0 異なる",
    aturanEmasDiff: "符号",
    aturanEmasBody4: " → 結果は",
    aturanEmasNeg: "負",
    signGrid: [
      { kiri: "(+) ÷ (+)", kanan: "= (+)", contoh: "12 ÷ 3 = 4" },
      { kiri: "(−) ÷ (−)", kanan: "= (+)", contoh: "(−12) ÷ (−3) = 4" },
      { kiri: "(+) ÷ (−)", kanan: "= (−)", contoh: "12 ÷ (−3) = −4" },
      { kiri: "(−) ÷ (+)", kanan: "= (−)", contoh: "(−12) ÷ 3 = −4" },
    ],
    sifatTitle: "割り算の性質と重要ルール",
    sifatItems: [
      { sifat: "0で割ることは定義されない", detail: "a ÷ 0 = 定義されない。0をかけてaになる数は存在しません（a = 0の場合は不定）。" },
      { sifat: "0を任意の数で割ると0になる", detail: "0 ÷ a = 0（a ≠ 0のとき）。例：0 ÷ (−7) = 0" },
      { sifat: "割り算は交換法則が成立しない", detail: "a ÷ b ≠ b ÷ a（一般的に）。順序が重要！12 ÷ 3 = 4 だが 3 ÷ 12 = 0.25" },
      { sifat: "割り算 = 掛け算の逆演算", detail: "a ÷ b = c は c × b = a を意味します。これを使って答えを検証しましょう！" },
    ],
    trikTitle: "割り算のコツとテクニック",
    trikItems: [
      { icon: "🎯", tip: "まず符号を決め、次に絶対値を計算する", detail: "符号の問題と値の問題を分けて考える。符号：同じ=正、異なる=負。値：符号を無視してそのまま割る。" },
      { icon: "✅", tip: "逆の掛け算で確認する", detail: "−36 ÷ 4 = −9なら、確認：(−9) × 4 = −36 ✓。合わなければ間違いがあります！" },
      { icon: "⚠️", tip: "注意：除数0 = 罠！", detail: "試験問題では0を含む除数の答えを誘導することがよくあります。0で割ることは常に定義されないことを忘れずに！" },
      { icon: "🧮", tip: "必要なら掛け算に変換する", detail: "割り算が難しいですか？a ÷ b = a × (1/b) に変換しましょう。除数が大きいときや分数のときに特に便利です。" },
    ],
    conclusionTitle: "まとめ",
    conclusionP1: "整数の割り算は掛け算の",
    conclusionBold1: "逆演算",
    conclusionP2: "であり、符号のルールもまったく同じです。覚えておいてください：",
    conclusionBold2: "同符号=正、異符号=負",
    conclusionP3: "、そして絶対にゼロで割ってはいけません！割り算を理解することで、整数の4つの基本演算をすべてマスターしました！",
    conclusionTags: ["同符号 = +", "異符号 = −", "÷ 0 定義されない", "掛け算の逆", "確認"],
    conclusionCta: "🚀 次：混合演算 — すべての演算の組み合わせ！",
    backBtn: "トピック一覧に戻る",
  },
} as const;

const PembagianBilanganBulatPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const c = translations[language];
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "positifPositif", "negatifPositif", "positifNegatif", "negatifNegatif", "pembagianNol", "contoh", "kesimpulan"]);

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
          {c.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {c.pageSubtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{c.introBtn}</span>
              </div>
              {expandedSections.includes("intro") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.introBodyP1}<strong className="text-primary">{c.introBodyBold}</strong>{c.introBodyP2}
                </p>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">{c.introExampleTitle}</p>
                  <div className="space-y-3">
                    <p className="font-body text-sm text-white/80">
                      {c.introEx1}<InlineMath math="p" />{c.introEx1b}<InlineMath math="p \times 7 = 56" />
                    </p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2">{c.introEx2}</p>
                      <p className="text-white/70 text-xs mb-2">{c.introEx3}<InlineMath math="56 \div 7 = ?" /></p>
                      <p className="text-green-400 text-sm font-semibold">{c.introEx4}<InlineMath math="p = 8" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.introGoldenTitle}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="56 \div 7 = 8 \Longleftrightarrow 8 \times 7 = 56" />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">
                    {c.introGeneral}<InlineMath math="p \div q = r \Longleftrightarrow r \times q = p" />
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    {c.introTipP1}<strong>{c.introTipBold}</strong>{c.introTipP2}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Positif dibagi Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifPositif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{c.posPos}</span>
              </div>
              {expandedSections.includes("positifPositif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifPositif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.posPosBody}
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">{c.verif}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="12 \div 3 = a" /> {c.artinya} <InlineMath math="a \times 3 = 12" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.q12x3}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="a = 4" />{c.karena}<InlineMath math="4 \times 3 = 12" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="30 \div 6 = b" /> {c.artinya} <InlineMath math="b \times 6 = 30" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.q30x6}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="b = 5" />{c.karena}<InlineMath math="5 \times 6 = 30" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.konklusi}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexPosPos} />
                    <BlockMath math="a \div b = \frac{a}{b}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Negatif dibagi Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("negatifPositif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">{c.negPos}</span>
              </div>
              {expandedSections.includes("negatifPositif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("negatifPositif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.negPosBody}
                </p>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-3">{c.verif}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-6 \div 2 = a" /> {c.artinya} <InlineMath math="a \times 2 = -6" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.qNeg6x2}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="a = -3" />{c.karena}<InlineMath math="-3 \times 2 = -6" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-20 \div 4 = b" /> {c.artinya} <InlineMath math="b \times 4 = -20" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.qNeg20x4}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="b = -5" />{c.karena}<InlineMath math="-5 \times 4 = -20" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.konklusi}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexNegPos} />
                    <BlockMath math="(-a) \div b = -\frac{a}{b}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Positif dibagi Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{c.posNeg}</span>
              </div>
              {expandedSections.includes("positifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.posNegBody}
                </p>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-3">{c.verif}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="15 \div (-3) = a" /> {c.artinya} <InlineMath math="a \times (-3) = 15" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.q15xNeg3}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="a = -5" />{c.karena}<InlineMath math="-5 \times (-3) = 15" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="30 \div (-5) = b" /> {c.artinya} <InlineMath math="b \times (-5) = 30" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.q30xNeg5}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="b = -6" />{c.karena}<InlineMath math="-6 \times (-5) = 30" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.konklusi}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexPosNeg} />
                    <BlockMath math="a \div (-b) = -\frac{a}{b}" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Negatif dibagi Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("negatifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{c.negNeg}</span>
              </div>
              {expandedSections.includes("negatifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("negatifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.negNegBody}
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">{c.verif}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-12 \div (-3) = a" /> {c.artinya} <InlineMath math="a \times (-3) = -12" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.qNeg12xNeg3}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="a = 4" />{c.karena}<InlineMath math="4 \times (-3) = -12" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2"><InlineMath math="-40 \div (-5) = b" /> {c.artinya} <InlineMath math="b \times (-5) = -40" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.qNeg40xNeg5}</p>
                      <p className="text-green-400 text-sm">{c.jawab}<InlineMath math="b = 8" />{c.karena}<InlineMath math="8 \times (-5) = -40" /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.konklusi}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexNegNeg} />
                    <BlockMath math="(-a) \div (-b) = \frac{a}{b}" />
                  </div>
                </div>

                {/* Sign Rules Table */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">{c.signTableTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="py-2 px-3 text-left text-white/70">{c.signTableH1}</th>
                          <th className="py-2 px-3 text-center text-white/70">{c.signTableDiv}</th>
                          <th className="py-2 px-3 text-left text-white/70">{c.signTableH2}</th>
                          <th className="py-2 px-3 text-center text-white/70">{c.signTableEq}</th>
                          <th className="py-2 px-3 text-left text-white/70">{c.signTableResult}</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">{c.signPos}</td>
                          <td className="py-2 px-3 text-center text-white/50">{c.signTableDiv}</td>
                          <td className="py-2 px-3 text-green-400">{c.signPos}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">{c.signResultPos}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-red-400">{c.signNeg}</td>
                          <td className="py-2 px-3 text-center text-white/50">{c.signTableDiv}</td>
                          <td className="py-2 px-3 text-green-400">{c.signPos}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">{c.signResultNeg}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">{c.signPos}</td>
                          <td className="py-2 px-3 text-center text-white/50">{c.signTableDiv}</td>
                          <td className="py-2 px-3 text-red-400">{c.signNeg}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">{c.signResultNeg}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-red-400">{c.signNeg}</td>
                          <td className="py-2 px-3 text-center text-white/50">{c.signTableDiv}</td>
                          <td className="py-2 px-3 text-red-400">{c.signNeg}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">{c.signResultPos}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.memorize}</strong> {c.memorizeBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Pembagian dengan Nol */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("pembagianNol")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-body font-semibold text-white">{c.divZeroBtn}</span>
              </div>
              {expandedSections.includes("pembagianNol") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("pembagianNol") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.divZeroWarningP1}<strong className="text-red-400">{c.divZeroWarningBold}</strong>
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-3">{c.divZeroWhy}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2">{c.divZeroEx1P1}<InlineMath math="8 \div 0 = p" />{c.divZeroEx1P2}<InlineMath math="p \times 0 = 8" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.divZeroEx1Q}</p>
                      <p className="text-red-400 text-sm font-semibold">{c.divZeroEx1A}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-2">{c.divZeroEx2P1}<InlineMath math="-9 \div 0 = q" />{c.divZeroEx2P2}<InlineMath math="q \times 0 = -9" /></p>
                      <p className="text-white/70 text-xs mb-1">{c.divZeroEx2Q}</p>
                      <p className="text-red-400 text-sm font-semibold">{c.divZeroEx2A}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-2">{c.divZeroKonklusi}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexDivZero} />
                  </div>
                  <p className="font-body text-xs text-white/60 mt-2">
                    {c.divZeroNote}<InlineMath math="a" />{c.divZeroNoteEnd}
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Calculator className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{c.divZeroCalcTitle}</p>
                      <p className="font-body text-sm text-yellow-200/80">
                        {c.divZeroCalcBody1}<InlineMath math="-9 \div 0" />{c.divZeroCalcBody2}<code className="bg-slate-800 px-2 py-0.5 rounded text-red-400">MATH ERROR</code>{c.divZeroCalcOr}<code className="bg-slate-800 px-2 py-0.5 rounded text-red-400">Error</code>{c.divZeroCalcBody3}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-blue-200 leading-relaxed">
                    <strong>{c.divZeroRemember}</strong>{c.divZeroRememberBody}<InlineMath math="a \div 0" />{c.divZeroRememberEnd}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span className="font-body font-semibold text-white">{c.contohBtn}</span>
              </div>
              {expandedSections.includes("contoh") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeMudah}</span>
                    <span className="font-body text-sm font-semibold text-green-300">{c.contoh1Title}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm mb-2">{c.contoh1Q}</p>
                    <p className="text-white/90 text-sm">a. <InlineMath math="-15 \div 3" /></p>
                    <p className="text-white/90 text-sm">b. <InlineMath math="-72 \div 2" /></p>
                    <p className="text-white/90 text-sm">c. <InlineMath math="18 \div (-3)" /></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-green-300">{c.pembahasan}</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-sm">a.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="-15 \div 3 = -5" /></p>
                          <p className="text-white/60 text-xs">{c.annotNegPos}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-sm">b.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="-72 \div 2 = -36" /></p>
                          <p className="text-white/60 text-xs">{c.annotNegPos}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-sm">c.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="18 \div (-3) = -6" /></p>
                          <p className="text-white/60 text-xs">{c.annotPosNeg}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medium */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeSedang}</span>
                    <span className="font-body text-sm font-semibold text-yellow-300">{c.contoh2Title}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm mb-2">{c.contoh2Q}</p>
                    <p className="text-white/90 text-sm">a. <InlineMath math="(-60 \div 5) \div 3" /></p>
                    <p className="text-white/90 text-sm">b. <InlineMath math="-96 \div (-12)" /></p>
                    <p className="text-white/90 text-sm">c. <InlineMath math="42 \div [8 + (-15)]" /></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-300">{c.pembahasan}</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-sm">a.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="(-60 \div 5) \div 3" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= -12 \div 3" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= -4" /></p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-sm">b.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="-96 \div (-12) = 8" /></p>
                          <p className="text-white/60 text-xs">{c.annotNegNeg}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-sm">c.</span>
                        <div>
                          <p className="text-white/80 text-sm"><InlineMath math="42 \div [8 + (-15)]" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= 42 \div (-7)" /></p>
                          <p className="text-white/80 text-sm"><InlineMath math="= -6" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hard */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeSulit}</span>
                    <span className="font-body text-sm font-semibold text-red-300">{c.contoh3Title}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm leading-relaxed">
                      {c.contoh3Story}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-red-300">{c.pembahasan}</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-2">
                      <p className="text-white/60 text-xs">{c.diketahui}</p>
                      <ul className="text-white/80 text-sm ml-4 list-disc space-y-1">
                        <li>{c.contoh3Known1}<InlineMath math="-120" />{c.contoh3Known1b}</li>
                        <li>{c.contoh3Known2}</li>
                      </ul>
                      <p className="text-white/60 text-xs mt-2">{c.ditanya}</p>
                      <p className="text-white/60 text-xs mt-2">{c.jawabLabel}</p>
                      <div className="mt-2">
                        <BlockMath math={c.katexContoh3} />
                      </div>
                      <p className="text-green-400 text-sm mt-2">
                        {c.contoh3Conclusion}<strong>{c.contoh3ConcBold}</strong>{c.contoh3ConcEnd}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bonus */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">{c.badgeBonus}</span>
                    <span className="font-body text-sm font-semibold text-purple-300">{c.contoh4Title}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <p className="text-white/90 text-sm mb-2">{c.contoh4Q}</p>
                    <p className="text-white/90 text-sm"><InlineMath math="-75 \div [45 \div (-9)]" /></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-body text-xs font-semibold text-purple-300">{c.pembahasan}</p>
                    <div className="bg-slate-800/50 rounded p-3 space-y-2">
                      <p className="text-white/60 text-xs">{c.langkah1}</p>
                      <p className="text-white/80 text-sm"><InlineMath math="45 \div (-9) = -5" /></p>
                      <p className="text-white/60 text-xs mt-2">{c.langkah2}</p>
                      <p className="text-white/80 text-sm"><InlineMath math="-75 \div (-5) = 15" /></p>
                      <p className="text-green-400 text-sm mt-2">
                        {c.contoh4Conclusion}<InlineMath math="-75 \div [45 \div (-9)] = 15" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesimpulan & Tips */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-body font-semibold text-white">{c.kesimpulanBtn}</span>
              </div>
              {expandedSections.includes("kesimpulan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesimpulan") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Sign Rule Summary */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">{c.signSummaryTitle}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-green-400 font-mono text-sm font-bold w-36">(+) ÷ (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">{c.signPos2}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(+) ÷ (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">{c.signNeg2}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(−) ÷ (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">{c.signNeg2}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-yellow-400 font-mono text-sm font-bold w-36">(−) ÷ (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">{c.signPos2}</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 mt-3">
                    <p className="text-white/70 text-xs text-center">
                      {c.easyMemorize} <strong className="text-cyan-300">{c.easyMemorizeBody}</strong>
                    </p>
                  </div>
                </div>

                {/* Important Rules */}
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-red-300 mb-3">{c.importantRulesTitle}</p>
                  <div className="space-y-2">
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-red-300">{c.rule1Bold}</strong> <InlineMath math="a \div 0" />{c.rule1Body}<InlineMath math="a" />.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.rule2Bold}</strong> <InlineMath math="0 \div a = 0" />{c.rule2Body}<InlineMath math="a \neq 0" />.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start bg-slate-900/50 rounded p-3">
                      <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-cyan-300">{c.rule3Bold}</strong> <InlineMath math="a \div b = c" />{c.rule3Body}<InlineMath math="b \times c = a" />{c.rule3End}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-3">{c.tipsTitle}</p>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">1.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip1Bold}</strong>{c.tip1Body}<InlineMath math="(-48) \div 6" />{c.tip1End}<InlineMath math="48 \div 6 = 8" />{c.tip1End2}<InlineMath math="-8" />.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">2.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip2Bold}</strong>{c.tip2Body}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">3.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip3Bold}</strong>{c.tip3Body}<InlineMath math="-36 \div (-4) = 9" />{c.tip3End}<InlineMath math="(-4) \times 9 = -36" /> ✓
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">4.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip4Bold}</strong>{c.tip4Body}<InlineMath math="12 \div (-3) \neq (-3) \div 12" />{c.tip4End}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-600 px-5 py-4 text-center">
            <p className="font-display text-lg font-bold text-white tracking-wide">{c.rangkumanTitle}</p>
            <p className="font-body text-xs text-white/80 mt-0.5">{c.rangkumanSub}</p>
          </div>
          <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

            {/* Sign Rules Grid */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-green-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/30 border border-green-500 flex items-center justify-center text-[10px]">1</span>
                {c.aturanTandaTitle}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(c.signGrid as { kiri: string; kanan: string; contoh: string }[]).map(({ kiri, kanan, contoh }, i) => {
                  const colors = [
                    "bg-green-900/50 border-green-500/40 text-green-200",
                    "bg-cyan-900/50 border-cyan-500/40 text-cyan-200",
                    "bg-red-900/50 border-red-500/40 text-red-200",
                    "bg-orange-900/50 border-orange-500/40 text-orange-200",
                  ];
                  return (
                    <div key={kiri} className={`${colors[i]} border rounded-xl px-3 py-2`}>
                      <p className="font-mono text-xs font-bold">{kiri} {kanan}</p>
                      <p className="font-body text-[11px] text-white/55 mt-0.5">{contoh}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gradient-to-r from-green-900/50 to-teal-900/30 border border-green-500/40 rounded-xl px-4 py-3 text-center">
                <p className="font-body text-xs font-bold text-green-200">{c.aturanEmasTitle}</p>
                <p className="font-body text-sm text-white/80 mt-1">
                  {c.aturanEmasBody1}<strong className="text-green-300">{c.aturanEmasSame}</strong>{c.aturanEmasBody2}<strong className="text-green-300">{c.aturanEmasPos}</strong>{c.aturanEmasBody3}<strong className="text-red-300">{c.aturanEmasDiff}</strong>{c.aturanEmasBody4}<strong className="text-red-300">{c.aturanEmasNeg}</strong>
                </p>
              </div>
            </div>

            {/* Properties */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-teal-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/30 border border-teal-500 flex items-center justify-center text-[10px]">2</span>
                {c.sifatTitle}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {(c.sifatItems as { sifat: string; detail: string }[]).map(({ sifat, detail }, i) => {
                  const colors = [
                    "from-red-900/50 to-red-800/20 border-red-500/40 text-red-200",
                    "from-slate-800/70 to-slate-700/30 border-slate-500/40 text-slate-200",
                    "from-orange-900/50 to-orange-800/20 border-orange-500/40 text-orange-200",
                    "from-green-900/50 to-green-800/20 border-green-500/40 text-green-200",
                  ];
                  return (
                    <div key={i} className={`bg-gradient-to-r ${colors[i]} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                      <div>
                        <p className="font-body text-xs font-bold">{sifat}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5">{detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips & Tricks */}
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">3</span>
                {c.trikTitle}
              </p>
              <div className="space-y-2">
                {(c.trikItems as { icon: string; tip: string; detail: string }[]).map(({ icon, tip, detail }, i) => {
                  const colors = [
                    "bg-green-900/30 border-green-500/30",
                    "bg-teal-900/30 border-teal-500/30",
                    "bg-red-900/30 border-red-500/30",
                    "bg-cyan-900/30 border-cyan-500/30",
                  ];
                  return (
                    <div key={i} className={`${colors[i]} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-gradient-to-br from-green-500/20 via-teal-500/15 to-cyan-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
              <div className="text-3xl">🌿</div>
              <p className="font-display text-base font-bold text-white">{c.conclusionTitle}</p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                {c.conclusionP1}{" "}
                <strong className="text-green-300">{c.conclusionBold1}</strong>{c.conclusionP2}{" "}
                <strong className="text-yellow-300">{c.conclusionBold2}</strong>{c.conclusionP3}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {(c.conclusionTags as string[]).map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{c.conclusionCta}</p>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/materi-matematika/kelas-7/bilangan-bulat");
            }}
            className="px-6 py-3 bg-primary/20 border border-primary/40 rounded-lg text-primary font-body text-sm hover:bg-primary/30 transition-colors"
          >
            {c.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PembagianBilanganBulatPage;
