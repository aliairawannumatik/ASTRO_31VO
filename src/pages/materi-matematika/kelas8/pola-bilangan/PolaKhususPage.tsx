import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, Sparkles, Activity } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import ArcDifferenceAnimation from "@/components/ArcDifferenceAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "POLA-POLA KHUSUS",
    pageSubtitle: "Genap, Ganjil, Persegi, Segitiga Pascal, Fibonacci & Lebih!",
    breadcrumb: "Kelas 8 · Pola Bilangan · Materi Matematika",
    introTitle: "🌟 Pola Khusus — Keindahan Matematika",
    introBody: "Dalam dunia matematika, ada pola-pola yang begitu terkenal dan muncul berulang kali di berbagai bidang — dari arsitektur hingga alam. Kita menyebutnya pola khusus. Mengenalinya akan membuat kamu jauh lebih cepat menjawab soal dan memahami dunia!",
    factBox: "Fakta menarik: Pola Fibonacci ditemukan di kelopak bunga, cangkang siput, dan bahkan galaksi spiral. Pola segitiga Pascal muncul di teori probabilitas dan ekspansi binomial. Matematika bukan hanya angka — ini adalah bahasa alam semesta! 🌌",
    catalogTitle: "📚 Katalog 7 Pola Khusus",
    animTitle: "🌀 Animasi Busur Beda — Visualisasi Selisih Setiap Pola",
    animDesc: "Pilih sebuah pola di bawah lalu perhatikan busur melengkung yang menunjukkan beda (selisih) antara dua suku yang berurutan. Busur muncul satu per satu dari kiri ke kanan — amati polanya!",
    patterns: [
      { num: "1", name: "Pola Bilangan Genap", desc: "Bilangan yang habis dibagi 2.", formula: "U_n = 2n \\quad (n = 1, 2, 3, \\ldots)", terms: [2,4,6,8,10], colorBg: "bg-cyan-900/30 border-cyan-500/30", colorBadge: "bg-cyan-500", colorText: "text-cyan-300", colorTerm: "bg-cyan-700/50 border border-cyan-400/40 text-cyan-200" },
      { num: "2", name: "Pola Bilangan Ganjil", desc: "Bilangan yang tidak habis dibagi 2.", formula: "U_n = 2n - 1 \\quad (n = 1, 2, 3, \\ldots)", terms: [1,3,5,7,9], colorBg: "bg-orange-900/30 border-orange-500/30", colorBadge: "bg-orange-500", colorText: "text-orange-300", colorTerm: "bg-orange-700/50 border border-orange-400/40 text-orange-200" },
      { num: "3", name: "Pola Bilangan Persegi", desc: "Bilangan kuadrat — bisa disusun membentuk persegi.", formula: "U_n = n^2 \\quad \\Rightarrow \\quad 1, 4, 9, 16, 25, \\ldots", colorBg: "bg-violet-900/30 border-violet-500/30", colorBadge: "bg-violet-500", colorText: "text-violet-300", dotColor: "bg-violet-400" },
      { num: "4", name: "Pola Bilangan Persegi Panjang", desc: <>Titik-titik yang membentuk persegi panjang dengan sisi <InlineMath math="n" /> dan <InlineMath math="n+1" />.</>, formula: "U_n = n(n+1) \\quad \\Rightarrow \\quad 2, 6, 12, 20, 30, \\ldots", colorBg: "bg-green-900/30 border-green-500/30", colorBadge: "bg-green-500", colorText: "text-green-300", dotColor: "bg-green-400" },
      { num: "5", name: "Pola Bilangan Segitiga", desc: "Titik-titik yang disusun membentuk segitiga sama sisi.", formula: "U_n = \\frac{n(n+1)}{2} \\quad \\Rightarrow \\quad 1, 3, 6, 10, 15, \\ldots", colorBg: "bg-yellow-900/30 border-yellow-500/30", colorBadge: "bg-yellow-500", colorText: "text-yellow-300", dotColor: "bg-yellow-400" },
    ],
    pascal: {
      name: "Pola Segitiga Pascal",
      desc: "Setiap bilangan = jumlah dua bilangan di atasnya. Baris dimulai dan diakhiri angka 1.",
      rowSumLabel: "Jumlah bilangan pada setiap baris:",
      doublesNote: <>Setiap baris, jumlahnya <strong className="text-pink-300">berlipat ganda (×2)</strong> dari baris sebelumnya.</>,
      colorBg: "bg-pink-900/30 border-pink-500/30", colorBadge: "bg-pink-500", colorText: "text-pink-300",
    },
    fibonacci: {
      name: "Pola Fibonacci",
      desc: "Setiap suku = jumlah dua suku sebelumnya. Dimulai dari 1, 1.",
      natureNote: "🌿 Muncul di alam: kelopak bunga, cangkang nautilus, susunan biji bunga matahari!",
      colorBg: "bg-teal-900/30 border-teal-500/30", colorBadge: "bg-teal-500", colorText: "text-teal-300", colorTerm: "bg-teal-700/50 border border-teal-400/40 text-teal-200",
    },
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    problemLabel: "📝 Soal", solutionLabel: "🔍 Pembahasan",
    ex1Title: "✏️ Contoh 1 — Tingkat Mudah (Pola Persegi)",
    ex1Problem: <>Perhatikan barisan bilangan berikut: <strong>1, 4, 9, 16, ...</strong><br />Tentukan suku ke-12 dari barisan tersebut!</>,
    ex1IdentLabel: "Identifikasi pola:",
    ex1TermNote: "Setiap suku merupakan kuadrat dari nomor sukunya:",
    ex1FormulaLabel: "Rumus suku ke-n:",
    ex1SubstLabel: "Substitusi n = 12:",
    ex1Ans: <>✅ Jawaban: Suku ke-12 dari barisan 1, 4, 9, 16, ... adalah <strong>144</strong>.</>,
    ex2Title: "✏️ Contoh 2 — Tingkat Sedang (Fibonacci)",
    ex2Problem: <>Barisan Fibonacci dimulai: 1, 1, 2, 3, 5, 8, 13, 21, ...<br />a) Tuliskan suku ke-11 dan ke-12.<br />b) Berapa hasil bagi suku ke-12 terhadap suku ke-11? Apa pola yang muncul?</>,
    ex2Step1: "a) Lanjutkan barisan hingga suku ke-12:",
    ex2Step2: "b) Rasio suku berurutan:",
    ex2GoldenNote: <>Nilai ini mendekati <strong className="text-yellow-300">Rasio Emas (Golden Ratio) φ ≈ 1,618!</strong> Semakin besar suku Fibonacci, rasio antar suku berurutan semakin mendekati φ.</>,
    ex2Ans: <><InlineMath math="U_{11} = 89" />, <InlineMath math="U_{12} = 144" />, rasio ≈ 1,618 (Golden Ratio!)</>,
    ex3Title: "✏️ Contoh 3 — Tingkat Sulit (Segitiga Pascal)",
    ex3Problem: <>a) Tuliskan baris ke-7 dari Segitiga Pascal (baris pertama = baris ke-1, bernilai "1").<br />b) Berapa jumlah semua bilangan pada baris ke-7?<br />c) Apa rumus jumlah bilangan pada baris ke-<InlineMath math="n" />?</>,
    ex3Step1: "a) Baris ke-7 dari Segitiga Pascal:",
    ex3Step2: "b) Jumlah baris ke-7:",
    ex3Step3: "c) Pola jumlah per baris:",
    ex3Ans: <>✅ Baris ke-7: 1, 6, 15, 20, 15, 6, 1. Jumlah = 64 = <InlineMath math="2^6" />. Rumus: <InlineMath math="\text{Jumlah baris ke-}n = 2^{n-1}" /></>,
    summaryHeader: "⭐ RANGKUMAN LENGKAP",
    summarySubheader: "7 Pola-Pola Khusus — Kelas 8",
    summarySection1: "Katalog 7 Pola Khusus — Hafal Semua!",
    summaryRows: [
      { nama: "Pola Genap", contoh: "2, 4, 6, 8, 10, ...", rumus: "Uₙ = 2n", beda: "Beda tetap +2", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200", badge: "bg-cyan-500" },
      { nama: "Pola Ganjil", contoh: "1, 3, 5, 7, 9, ...", rumus: "Uₙ = 2n − 1", beda: "Beda tetap +2", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200", badge: "bg-orange-500" },
      { nama: "Pola Persegi", contoh: "1, 4, 9, 16, 25, ...", rumus: "Uₙ = n²", beda: "Beda: +3, +5, +7, +9, ...", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200", badge: "bg-violet-500" },
      { nama: "Pola Persegi Panjang", contoh: "2, 6, 12, 20, 30, ...", rumus: "Uₙ = n(n+1)", beda: "Beda: +4, +6, +8, +10, ...", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200", badge: "bg-green-500" },
      { nama: "Pola Segitiga", contoh: "1, 3, 6, 10, 15, ...", rumus: "Uₙ = n(n+1)/2", beda: "Beda: +2, +3, +4, +5, ...", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200", badge: "bg-yellow-500" },
      { nama: "Segitiga Pascal (jumlah baris ke-n)", contoh: "1, 2, 4, 8, 16, 32, ...", rumus: "Jumlah = 2ⁿ⁻¹", beda: "Setiap baris ×2 dari sebelumnya", color: "from-pink-900/70 to-pink-800/30 border-pink-500/50 text-pink-200", badge: "bg-pink-500" },
      { nama: "Pola Fibonacci", contoh: "1, 1, 2, 3, 5, 8, 13, ...", rumus: "Uₙ = Uₙ₋₁ + Uₙ₋₂", beda: "Setiap suku = jumlah 2 suku sebelumnya", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200", badge: "bg-teal-500" },
    ],
    summarySection2: "Fakta Mengagumkan dari Tiap Pola",
    facts: [
      { icon: "🔢", fact: "Persegi = jumlah bilangan ganjil", detail: "1 = 1, 1+3 = 4, 1+3+5 = 9, 1+3+5+7 = 16 → Uₙ = 1+3+5+...+(2n−1) = n²", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🌀", fact: "Fibonacci hasilkan Rasio Emas (φ ≈ 1,618)", detail: "Semakin besar suku Fibonacci, rasio Uₙ/Uₙ₋₁ semakin mendekati φ = (1+√5)/2. Inilah proporsi terindah di alam semesta!", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "🔺", fact: "Segitiga Pascal menyimpan banyak pola", detail: "Diagonal 1 = semua 1, diagonal 2 = bilangan asli, diagonal 3 = pola segitiga. Dan jumlah tiap baris = 2ⁿ⁻¹!", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🌿", fact: "Fibonacci di alam nyata", detail: "Kelopak bunga hampir selalu bilangan Fibonacci (3, 5, 8, 13 kelopak). Cangkang siput, biji bunga matahari, daun paku — semuanya Fibonacci!", color: "bg-green-900/30 border-green-500/30" },
    ],
    summarySection3: "Tips & Trik Mengidentifikasi Pola Khusus",
    tips: [
      { icon: "👁️", tip: "Kenali bentuk barisan secara visual", detail: "Barisan persegi selalu naik cepat (1,4,9,16). Barisan segitiga naik sedang (1,3,6,10). Fibonacci naik makin cepat (1,1,2,3,5,8,13).", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "🔍", tip: "Hitung beda tingkat pertama dan kedua", detail: "Beda tetap = aritmetika. Beda dari beda tetap (beda ke-2 tetap) = pola persegi/segitiga/persegi panjang. Rasio tetap = geometri.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🎯", tip: "Cocokkan angka pertama dengan rumus", detail: "Uji n=1,2,3 di setiap rumus. Jika suku ke-2 = 4 dan ke-3 = 9 → ini pola persegi. Jika ke-2 = 6, ke-3 = 12 → persegi panjang.", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "🧩", tip: "Pola Pascal: baris 1 = baris ke-1", detail: "Ingat: baris ke-1 = {1}, baris ke-2 = {1,1}. Jumlah baris ke-n = 2ⁿ⁻¹, bukan 2ⁿ. Jangan terbalik!", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Tujuh pola khusus ini adalah <strong className="text-yellow-300">harta karun matematika</strong> yang tersembunyi di seluruh penjuru alam — dari cangkang siput hingga galaksi spiral, dari kelopak bunga hingga arsitektur bangunan megah. Dengan mengenali dan menghafal pola-pola ini, kamu memiliki <strong className="text-pink-300">kekuatan untuk membaca pola alam semesta</strong> dan menjawab soal ujian dengan lebih cepat dan tepat!</>,
    conclusionTags: ["Genap", "Ganjil", "Persegi", "Persegi Panjang", "Segitiga", "Pascal", "Fibonacci"],
    conclusionBadge: "🏆 Kamu telah menguasai semua pola khusus di Kelas 8!",
    backBtn: "← Kembali ke Pola Bilangan",
    rowLabel: "Baris ke-",
    sumLabel: "Jumlah",
    colN: "n", colSum: "Jumlah", colPow: "= 2^?",
  },
  en: {
    pageTitle: "SPECIAL PATTERNS",
    pageSubtitle: "Even, Odd, Square, Pascal's Triangle, Fibonacci & More!",
    breadcrumb: "Grade 8 · Number Patterns · Math Content",
    introTitle: "🌟 Special Patterns — The Beauty of Mathematics",
    introBody: "In the world of mathematics, there are patterns so famous that they appear repeatedly across many fields — from architecture to nature. We call them special patterns. Recognizing them will make you much faster at answering problems and understanding the world!",
    factBox: "Interesting fact: The Fibonacci pattern is found in flower petals, snail shells, and even spiral galaxies. Pascal's Triangle appears in probability theory and binomial expansion. Mathematics is not just numbers — it is the language of the universe! 🌌",
    catalogTitle: "📚 Catalogue of 7 Special Patterns",
    animTitle: "🌀 Difference Arc Animation — Visualizing the Difference in Each Pattern",
    animDesc: "Select a pattern below and observe the curved arcs showing the difference between consecutive terms. Arcs appear one by one from left to right — observe the pattern!",
    patterns: [
      { num: "1", name: "Even Number Pattern", desc: "Numbers divisible by 2.", formula: "U_n = 2n \\quad (n = 1, 2, 3, \\ldots)", terms: [2,4,6,8,10], colorBg: "bg-cyan-900/30 border-cyan-500/30", colorBadge: "bg-cyan-500", colorText: "text-cyan-300", colorTerm: "bg-cyan-700/50 border border-cyan-400/40 text-cyan-200" },
      { num: "2", name: "Odd Number Pattern", desc: "Numbers not divisible by 2.", formula: "U_n = 2n - 1 \\quad (n = 1, 2, 3, \\ldots)", terms: [1,3,5,7,9], colorBg: "bg-orange-900/30 border-orange-500/30", colorBadge: "bg-orange-500", colorText: "text-orange-300", colorTerm: "bg-orange-700/50 border border-orange-400/40 text-orange-200" },
      { num: "3", name: "Square Number Pattern", desc: "Square numbers — can be arranged to form a square.", formula: "U_n = n^2 \\quad \\Rightarrow \\quad 1, 4, 9, 16, 25, \\ldots", colorBg: "bg-violet-900/30 border-violet-500/30", colorBadge: "bg-violet-500", colorText: "text-violet-300", dotColor: "bg-violet-400" },
      { num: "4", name: "Rectangular Number Pattern", desc: <>Dots forming rectangles with sides <InlineMath math="n" /> and <InlineMath math="n+1" />.</>, formula: "U_n = n(n+1) \\quad \\Rightarrow \\quad 2, 6, 12, 20, 30, \\ldots", colorBg: "bg-green-900/30 border-green-500/30", colorBadge: "bg-green-500", colorText: "text-green-300", dotColor: "bg-green-400" },
      { num: "5", name: "Triangular Number Pattern", desc: "Dots arranged to form equilateral triangles.", formula: "U_n = \\frac{n(n+1)}{2} \\quad \\Rightarrow \\quad 1, 3, 6, 10, 15, \\ldots", colorBg: "bg-yellow-900/30 border-yellow-500/30", colorBadge: "bg-yellow-500", colorText: "text-yellow-300", dotColor: "bg-yellow-400" },
    ],
    pascal: {
      name: "Pascal's Triangle Pattern",
      desc: "Each number = sum of the two numbers above it. Rows start and end with 1.",
      rowSumLabel: "Sum of numbers in each row:",
      doublesNote: <>Each row, the sum <strong className="text-pink-300">doubles (×2)</strong> from the previous row.</>,
      colorBg: "bg-pink-900/30 border-pink-500/30", colorBadge: "bg-pink-500", colorText: "text-pink-300",
    },
    fibonacci: {
      name: "Fibonacci Pattern",
      desc: "Each term = sum of the two previous terms. Starts from 1, 1.",
      natureNote: "🌿 Found in nature: flower petals, nautilus shells, sunflower seed arrangements!",
      colorBg: "bg-teal-900/30 border-teal-500/30", colorBadge: "bg-teal-500", colorText: "text-teal-300", colorTerm: "bg-teal-700/50 border border-teal-400/40 text-teal-200",
    },
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    problemLabel: "📝 Problem", solutionLabel: "🔍 Solution",
    ex1Title: "✏️ Example 1 — Easy Level (Square Pattern)",
    ex1Problem: <>Observe the following sequence: <strong>1, 4, 9, 16, ...</strong><br />Determine the 12th term of the sequence!</>,
    ex1IdentLabel: "Identify the pattern:",
    ex1TermNote: "Each term is the square of its position number:",
    ex1FormulaLabel: "Formula for the nth term:",
    ex1SubstLabel: "Substitute n = 12:",
    ex1Ans: <>✅ Answer: The 12th term of the sequence 1, 4, 9, 16, ... is <strong>144</strong>.</>,
    ex2Title: "✏️ Example 2 — Medium Level (Fibonacci)",
    ex2Problem: <>The Fibonacci sequence starts: 1, 1, 2, 3, 5, 8, 13, 21, ...<br />a) Write the 11th and 12th terms.<br />b) What is the ratio of the 12th term to the 11th? What pattern appears?</>,
    ex2Step1: "a) Continue the sequence to the 12th term:",
    ex2Step2: "b) Ratio of consecutive terms:",
    ex2GoldenNote: <>This value approaches the <strong className="text-yellow-300">Golden Ratio φ ≈ 1.618!</strong> As Fibonacci terms get larger, the ratio between consecutive terms gets closer to φ.</>,
    ex2Ans: <><InlineMath math="U_{11} = 89" />, <InlineMath math="U_{12} = 144" />, ratio ≈ 1.618 (Golden Ratio!)</>,
    ex3Title: "✏️ Example 3 — Hard Level (Pascal's Triangle)",
    ex3Problem: <>a) Write row 7 of Pascal's Triangle (first row = row 1, containing "1").<br />b) What is the sum of all numbers in row 7?<br />c) What is the formula for the sum of row <InlineMath math="n" />?</>,
    ex3Step1: "a) Row 7 of Pascal's Triangle:",
    ex3Step2: "b) Sum of row 7:",
    ex3Step3: "c) Pattern of row sums:",
    ex3Ans: <>✅ Row 7: 1, 6, 15, 20, 15, 6, 1. Sum = 64 = <InlineMath math="2^6" />. Formula: <InlineMath math="\text{Sum of row }n = 2^{n-1}" /></>,
    summaryHeader: "⭐ COMPLETE SUMMARY",
    summarySubheader: "7 Special Patterns — Grade 8",
    summarySection1: "Catalogue of 7 Special Patterns — Memorize All!",
    summaryRows: [
      { nama: "Even Pattern", contoh: "2, 4, 6, 8, 10, ...", rumus: "Uₙ = 2n", beda: "Constant difference +2", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200", badge: "bg-cyan-500" },
      { nama: "Odd Pattern", contoh: "1, 3, 5, 7, 9, ...", rumus: "Uₙ = 2n − 1", beda: "Constant difference +2", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200", badge: "bg-orange-500" },
      { nama: "Square Pattern", contoh: "1, 4, 9, 16, 25, ...", rumus: "Uₙ = n²", beda: "Differences: +3, +5, +7, +9, ...", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200", badge: "bg-violet-500" },
      { nama: "Rectangular Pattern", contoh: "2, 6, 12, 20, 30, ...", rumus: "Uₙ = n(n+1)", beda: "Differences: +4, +6, +8, +10, ...", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200", badge: "bg-green-500" },
      { nama: "Triangular Pattern", contoh: "1, 3, 6, 10, 15, ...", rumus: "Uₙ = n(n+1)/2", beda: "Differences: +2, +3, +4, +5, ...", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200", badge: "bg-yellow-500" },
      { nama: "Pascal's Triangle (row n sum)", contoh: "1, 2, 4, 8, 16, 32, ...", rumus: "Sum = 2ⁿ⁻¹", beda: "Each row ×2 from previous", color: "from-pink-900/70 to-pink-800/30 border-pink-500/50 text-pink-200", badge: "bg-pink-500" },
      { nama: "Fibonacci Pattern", contoh: "1, 1, 2, 3, 5, 8, 13, ...", rumus: "Uₙ = Uₙ₋₁ + Uₙ₋₂", beda: "Each term = sum of previous 2", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200", badge: "bg-teal-500" },
    ],
    summarySection2: "Amazing Facts About Each Pattern",
    facts: [
      { icon: "🔢", fact: "Square = sum of odd numbers", detail: "1 = 1, 1+3 = 4, 1+3+5 = 9, 1+3+5+7 = 16 → Uₙ = 1+3+5+...+(2n−1) = n²", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🌀", fact: "Fibonacci produces the Golden Ratio (φ ≈ 1.618)", detail: "As Fibonacci terms grow larger, the ratio Uₙ/Uₙ₋₁ approaches φ = (1+√5)/2 — the most beautiful proportion in the universe!", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "🔺", fact: "Pascal's Triangle hides many patterns", detail: "Diagonal 1 = all 1s, diagonal 2 = natural numbers, diagonal 3 = triangular pattern. And the sum of each row = 2ⁿ⁻¹!", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🌿", fact: "Fibonacci in nature", detail: "Flower petals are almost always Fibonacci numbers (3, 5, 8, 13 petals). Snail shells, sunflower seeds, fern leaves — all Fibonacci!", color: "bg-green-900/30 border-green-500/30" },
    ],
    summarySection3: "Tips & Tricks for Identifying Special Patterns",
    tips: [
      { icon: "👁️", tip: "Recognize the sequence visually", detail: "Square sequences rise quickly (1,4,9,16). Triangular sequences rise moderately (1,3,6,10). Fibonacci rises increasingly fast (1,1,2,3,5,8,13).", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "🔍", tip: "Calculate first and second differences", detail: "Constant difference = arithmetic. Constant second difference = square/triangular/rectangular. Constant ratio = geometric.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🎯", tip: "Match first numbers to formulas", detail: "Test n=1,2,3 in each formula. If term 2 = 4 and term 3 = 9 → square pattern. If term 2 = 6, term 3 = 12 → rectangular.", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "🧩", tip: "Pascal: row 1 = row number 1", detail: "Remember: row 1 = {1}, row 2 = {1,1}. Sum of row n = 2ⁿ⁻¹, not 2ⁿ. Don't mix them up!", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>These seven special patterns are a <strong className="text-yellow-300">mathematical treasure</strong> hidden throughout nature — from snail shells to spiral galaxies, from flower petals to grand architecture. By recognizing and memorizing these patterns, you have the <strong className="text-pink-300">power to read the patterns of the universe</strong> and answer exam questions faster and more accurately!</>,
    conclusionTags: ["Even", "Odd", "Square", "Rectangular", "Triangular", "Pascal", "Fibonacci"],
    conclusionBadge: "🏆 You have mastered all special patterns in Grade 8!",
    backBtn: "← Back to Number Patterns",
    rowLabel: "Row ",
    sumLabel: "Sum",
    colN: "n", colSum: "Sum", colPow: "= 2^?",
  },
  ja: {
    pageTitle: "特殊パターン",
    pageSubtitle: "偶数・奇数・平方数・パスカルの三角形・フィボナッチ数列など！",
    breadcrumb: "中学2年 · 数の規則性 · 数学教材",
    introTitle: "🌟 特殊パターン — 数学の美しさ",
    introBody: "数学の世界には、建築から自然まで様々な分野で繰り返し現れる有名なパターンがあります。私たちはそれらを「特殊パターン」と呼びます。これらを認識できると、問題をずっと速く解けるようになり、世界をより深く理解できます！",
    factBox: "興味深い事実：フィボナッチ数列は花びら、カタツムリの殻、さらには渦巻銀河にも見られます。パスカルの三角形は確率論や二項展開に現れます。数学は単なる数ではなく、宇宙の言語です！🌌",
    catalogTitle: "📚 7つの特殊パターン一覧",
    animTitle: "🌀 差の弧アニメーション — 各パターンの差を可視化",
    animDesc: "下のパターンを選択し、連続する項の差を示す曲線の弧を観察してください。弧は左から右へ1つずつ現れます — パターンを観察しましょう！",
    patterns: [
      { num: "1", name: "偶数のパターン", desc: "2で割り切れる数。", formula: "U_n = 2n \\quad (n = 1, 2, 3, \\ldots)", terms: [2,4,6,8,10], colorBg: "bg-cyan-900/30 border-cyan-500/30", colorBadge: "bg-cyan-500", colorText: "text-cyan-300", colorTerm: "bg-cyan-700/50 border border-cyan-400/40 text-cyan-200" },
      { num: "2", name: "奇数のパターン", desc: "2で割り切れない数。", formula: "U_n = 2n - 1 \\quad (n = 1, 2, 3, \\ldots)", terms: [1,3,5,7,9], colorBg: "bg-orange-900/30 border-orange-500/30", colorBadge: "bg-orange-500", colorText: "text-orange-300", colorTerm: "bg-orange-700/50 border border-orange-400/40 text-orange-200" },
      { num: "3", name: "平方数のパターン", desc: "平方数 — 正方形に並べられる。", formula: "U_n = n^2 \\quad \\Rightarrow \\quad 1, 4, 9, 16, 25, \\ldots", colorBg: "bg-violet-900/30 border-violet-500/30", colorBadge: "bg-violet-500", colorText: "text-violet-300", dotColor: "bg-violet-400" },
      { num: "4", name: "長方形数のパターン", desc: <>nとn+1の辺を持つ長方形に並べられる点。</>, formula: "U_n = n(n+1) \\quad \\Rightarrow \\quad 2, 6, 12, 20, 30, \\ldots", colorBg: "bg-green-900/30 border-green-500/30", colorBadge: "bg-green-500", colorText: "text-green-300", dotColor: "bg-green-400" },
      { num: "5", name: "三角数のパターン", desc: "正三角形に並べられる点。", formula: "U_n = \\frac{n(n+1)}{2} \\quad \\Rightarrow \\quad 1, 3, 6, 10, 15, \\ldots", colorBg: "bg-yellow-900/30 border-yellow-500/30", colorBadge: "bg-yellow-500", colorText: "text-yellow-300", dotColor: "bg-yellow-400" },
    ],
    pascal: {
      name: "パスカルの三角形のパターン",
      desc: "各数 = 上の2つの数の和。各行は1で始まり1で終わる。",
      rowSumLabel: "各行の数の合計：",
      doublesNote: <>各行の合計は前の行から<strong className="text-pink-300">倍増（×2）</strong>します。</>,
      colorBg: "bg-pink-900/30 border-pink-500/30", colorBadge: "bg-pink-500", colorText: "text-pink-300",
    },
    fibonacci: {
      name: "フィボナッチ数列",
      desc: "各項 = 前の2項の和。1, 1から始まる。",
      natureNote: "🌿 自然界に現れる：花びら、オウムガイの殻、ひまわりの種の配列！",
      colorBg: "bg-teal-900/30 border-teal-500/30", colorBadge: "bg-teal-500", colorText: "text-teal-300", colorTerm: "bg-teal-700/50 border border-teal-400/40 text-teal-200",
    },
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    problemLabel: "📝 問題", solutionLabel: "🔍 解説",
    ex1Title: "✏️ 例1 — 基本（平方数のパターン）",
    ex1Problem: <>次の数列を観察しなさい：<strong>1, 4, 9, 16, ...</strong><br />第12項を求めなさい！</>,
    ex1IdentLabel: "パターンを識別する：",
    ex1TermNote: "各項はその位置番号の二乗です：",
    ex1FormulaLabel: "第n項の公式：",
    ex1SubstLabel: "n = 12を代入：",
    ex1Ans: <>✅ 答え：数列1, 4, 9, 16, ... の第12項は<strong>144</strong>です。</>,
    ex2Title: "✏️ 例2 — 標準（フィボナッチ数列）",
    ex2Problem: <>フィボナッチ数列：1, 1, 2, 3, 5, 8, 13, 21, ...<br />a) 第11項と第12項を書きなさい。<br />b) 第12項を第11項で割るといくつか？どんなパターンが現れるか？</>,
    ex2Step1: "a) 第12項まで数列を続ける：",
    ex2Step2: "b) 連続する項の比：",
    ex2GoldenNote: <>この値は<strong className="text-yellow-300">黄金比 φ ≈ 1.618</strong>に近づいています！フィボナッチの項が大きくなるにつれ、連続する項の比がφに近づきます。</>,
    ex2Ans: <><InlineMath math="U_{11} = 89" />、<InlineMath math="U_{12} = 144" />、比 ≈ 1.618（黄金比！）</>,
    ex3Title: "✏️ 例3 — 発展（パスカルの三角形）",
    ex3Problem: <>a) パスカルの三角形の第7行を書きなさい（第1行 = 「1」）。<br />b) 第7行の数の合計はいくつか？<br />c) 第<InlineMath math="n" />行の合計の公式は？</>,
    ex3Step1: "a) パスカルの三角形の第7行：",
    ex3Step2: "b) 第7行の合計：",
    ex3Step3: "c) 各行の合計のパターン：",
    ex3Ans: <>✅ 第7行：1, 6, 15, 20, 15, 6, 1。合計 = 64 = <InlineMath math="2^6" />。公式：<InlineMath math="\text{第}n\text{行の合計} = 2^{n-1}" /></>,
    summaryHeader: "⭐ 完全まとめ",
    summarySubheader: "7つの特殊パターン — 中学2年",
    summarySection1: "7つの特殊パターン一覧 — すべて覚えよう！",
    summaryRows: [
      { nama: "偶数パターン", contoh: "2, 4, 6, 8, 10, ...", rumus: "Uₙ = 2n", beda: "公差 +2（一定）", color: "from-cyan-900/70 to-cyan-800/30 border-cyan-500/50 text-cyan-200", badge: "bg-cyan-500" },
      { nama: "奇数パターン", contoh: "1, 3, 5, 7, 9, ...", rumus: "Uₙ = 2n − 1", beda: "公差 +2（一定）", color: "from-orange-900/70 to-orange-800/30 border-orange-500/50 text-orange-200", badge: "bg-orange-500" },
      { nama: "平方数パターン", contoh: "1, 4, 9, 16, 25, ...", rumus: "Uₙ = n²", beda: "差：+3, +5, +7, +9, ...", color: "from-violet-900/70 to-violet-800/30 border-violet-500/50 text-violet-200", badge: "bg-violet-500" },
      { nama: "長方形数パターン", contoh: "2, 6, 12, 20, 30, ...", rumus: "Uₙ = n(n+1)", beda: "差：+4, +6, +8, +10, ...", color: "from-green-900/70 to-green-800/30 border-green-500/50 text-green-200", badge: "bg-green-500" },
      { nama: "三角数パターン", contoh: "1, 3, 6, 10, 15, ...", rumus: "Uₙ = n(n+1)/2", beda: "差：+2, +3, +4, +5, ...", color: "from-yellow-900/70 to-yellow-800/30 border-yellow-500/50 text-yellow-200", badge: "bg-yellow-500" },
      { nama: "パスカルの三角形（第n行の和）", contoh: "1, 2, 4, 8, 16, 32, ...", rumus: "合計 = 2ⁿ⁻¹", beda: "各行は前の行の×2", color: "from-pink-900/70 to-pink-800/30 border-pink-500/50 text-pink-200", badge: "bg-pink-500" },
      { nama: "フィボナッチ数列", contoh: "1, 1, 2, 3, 5, 8, 13, ...", rumus: "Uₙ = Uₙ₋₁ + Uₙ₋₂", beda: "各項 = 前の2項の和", color: "from-teal-900/70 to-teal-800/30 border-teal-500/50 text-teal-200", badge: "bg-teal-500" },
    ],
    summarySection2: "各パターンの驚くべき事実",
    facts: [
      { icon: "🔢", fact: "平方数 = 奇数の総和", detail: "1 = 1、1+3 = 4、1+3+5 = 9、1+3+5+7 = 16 → Uₙ = 1+3+5+...+(2n−1) = n²", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🌀", fact: "フィボナッチ数列は黄金比（φ ≈ 1.618）を生む", detail: "フィボナッチの項が大きくなるほど、Uₙ/Uₙ₋₁の比はφ = (1+√5)/2に近づく。宇宙で最も美しい比！", color: "bg-teal-900/30 border-teal-500/30" },
      { icon: "🔺", fact: "パスカルの三角形は多くのパターンを含む", detail: "対角線1 = すべて1、対角線2 = 自然数、対角線3 = 三角数。各行の和 = 2ⁿ⁻¹！", color: "bg-pink-900/30 border-pink-500/30" },
      { icon: "🌿", fact: "自然界のフィボナッチ", detail: "花びらはほぼ必ずフィボナッチ数（3、5、8、13枚）。カタツムリの殻、ひまわりの種、シダの葉 — すべてフィボナッチ！", color: "bg-green-900/30 border-green-500/30" },
    ],
    summarySection3: "特殊パターンを識別するヒントとコツ",
    tips: [
      { icon: "👁️", tip: "数列を視覚的に認識する", detail: "平方数は急増（1,4,9,16）。三角数は中程度に増加（1,3,6,10）。フィボナッチは増加が加速する（1,1,2,3,5,8,13）。", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "🔍", tip: "第1差と第2差を計算する", detail: "差が一定 = 等差。第2差が一定 = 平方/三角/長方形パターン。比が一定 = 等比。", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🎯", tip: "最初の数を公式と対応させる", detail: "各公式でn=1,2,3を検証。第2項 = 4、第3項 = 9なら → 平方数パターン。第2項 = 6、第3項 = 12なら → 長方形数。", color: "bg-orange-900/30 border-orange-500/30" },
      { icon: "🧩", tip: "パスカル：第1行 = 行番号1", detail: "第1行 = {1}、第2行 = {1,1}。第n行の和 = 2ⁿ⁻¹（2ⁿではない）。混同しないように！", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>この7つの特殊パターンは、自然の至る所に隠された<strong className="text-yellow-300">数学の宝物</strong>です — カタツムリの殻から渦巻銀河、花びらから壮大な建築まで。これらのパターンを認識し暗記することで、<strong className="text-pink-300">宇宙のパターンを読む力</strong>を持ち、試験問題をより速く正確に解けるようになります！</>,
    conclusionTags: ["偶数", "奇数", "平方数", "長方形数", "三角数", "パスカル", "フィボナッチ"],
    conclusionBadge: "🏆 中学2年のすべての特殊パターンをマスターした！",
    backBtn: "← 数の規則性に戻る",
    rowLabel: "第",
    sumLabel: "合計",
    colN: "n", colSum: "合計", colPow: "= 2^?",
  },
};

const PolaKhususPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "katalog", "animasi", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const fibRows = [[1,1],[2,1],[3,2],[4,3],[5,5],[6,8],[7,13],[8,21],[9,34],[10,55],[11,89],[12,144]];
  const pascalRows = [
    { baris: 1, values: [1] }, { baris: 2, values: [1,1] }, { baris: 3, values: [1,2,1] },
    { baris: 4, values: [1,3,3,1] }, { baris: 5, values: [1,4,6,4,1] },
    { baris: 6, values: [1,5,10,10,5,1] }, { baris: 7, values: [1,6,15,20,15,6,1] },
  ];
  const pascalSumRows = [[1,1,"2⁰"],[2,2,"2¹"],[3,4,"2²"],[4,8,"2³"],[5,16,"2⁴"],[6,32,"2⁵"],[7,64,"2⁶"]];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.pageSubtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introTitle} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{language === "id" ? "Fakta menarik:" : language === "en" ? "Interesting fact:" : "興味深い事実："}</strong> {t.factBox}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KATALOG */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="katalog" icon={<Sparkles className="w-5 h-5" />} iconColor="text-violet-400" title={t.catalogTitle} />
            {expandedSections.includes("katalog") && (
              <div className="px-5 pb-5 space-y-4">

                {/* Patterns 1 & 2 — terms-based */}
                {t.patterns.slice(0,2).map((p) => (
                  <div key={p.num} className={`rounded-xl border p-4 ${p.colorBg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${p.colorBadge} text-white text-xs font-bold px-2 py-0.5 rounded`}>{p.num}</span>
                      <p className={`font-body text-sm font-bold ${p.colorText}`}>{p.name}</p>
                    </div>
                    <p className="font-body text-xs text-white/70 mb-2">{p.desc}</p>
                    <div className="flex gap-1 flex-wrap mb-2">
                      {p.terms!.map(n => (
                        <span key={n} className={`${p.colorTerm} text-xs font-bold px-2 py-1 rounded-lg`}>{n}</span>
                      ))}
                      <span className="text-white/40 self-center">...</span>
                    </div>
                    <BlockMath math={p.formula} />
                  </div>
                ))}

                {/* Pattern 3 — Square (dot grid) */}
                {(() => { const p = t.patterns[2]; return (
                  <div className={`rounded-xl border p-4 ${p.colorBg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${p.colorBadge} text-white text-xs font-bold px-2 py-0.5 rounded`}>{p.num}</span>
                      <p className={`font-body text-sm font-bold ${p.colorText}`}>{p.name}</p>
                    </div>
                    <p className="font-body text-xs text-white/70 mb-2">{p.desc}</p>
                    <div className="flex gap-3 flex-wrap mb-2 items-end">
                      {[{ n: 1, dots: [[1]] },{ n: 4, dots: [[1,1],[1,1]] },{ n: 9, dots: [[1,1,1],[1,1,1],[1,1,1]] }].map(({ n, dots }) => (
                        <div key={n} className="text-center">
                          <div className="inline-flex flex-col gap-0.5 mb-1">
                            {dots.map((row, ri) => (
                              <div key={ri} className="flex gap-0.5">
                                {row.map((_, ci) => <div key={ci} className={`w-3 h-3 rounded-sm ${p.dotColor}`} />)}
                              </div>
                            ))}
                          </div>
                          <p className={`${p.colorText} text-xs font-bold`}>{n}</p>
                        </div>
                      ))}
                      <span className="text-white/40 self-center text-lg">...</span>
                    </div>
                    <BlockMath math={p.formula} />
                  </div>
                );})()}

                {/* Pattern 4 — Rectangular (dot grid) */}
                {(() => { const p = t.patterns[3]; return (
                  <div className={`rounded-xl border p-4 ${p.colorBg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${p.colorBadge} text-white text-xs font-bold px-2 py-0.5 rounded`}>{p.num}</span>
                      <p className={`font-body text-sm font-bold ${p.colorText}`}>{p.name}</p>
                    </div>
                    <p className="font-body text-xs text-white/70 mb-2">{p.desc}</p>
                    <div className="flex gap-3 flex-wrap mb-2 items-end">
                      {[{ n: 2, rows: 1, cols: 2 },{ n: 6, rows: 2, cols: 3 },{ n: 12, rows: 3, cols: 4 }].map(({ n, rows, cols }) => (
                        <div key={n} className="text-center">
                          <div className="inline-flex flex-col gap-0.5 mb-1">
                            {Array.from({ length: rows }).map((_, ri) => (
                              <div key={ri} className="flex gap-0.5">
                                {Array.from({ length: cols }).map((_, ci) => <div key={ci} className={`w-3 h-3 rounded-sm ${p.dotColor}`} />)}
                              </div>
                            ))}
                          </div>
                          <p className={`${p.colorText} text-xs font-bold`}>{n}</p>
                        </div>
                      ))}
                      <span className="text-white/40 self-center text-lg">...</span>
                    </div>
                    <BlockMath math={p.formula} />
                  </div>
                );})()}

                {/* Pattern 5 — Triangular (dot triangle) */}
                {(() => { const p = t.patterns[4]; return (
                  <div className={`rounded-xl border p-4 ${p.colorBg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${p.colorBadge} text-white text-xs font-bold px-2 py-0.5 rounded`}>{p.num}</span>
                      <p className={`font-body text-sm font-bold ${p.colorText}`}>{p.name}</p>
                    </div>
                    <p className="font-body text-xs text-white/70 mb-2">{p.desc}</p>
                    <div className="flex gap-4 flex-wrap mb-2 items-end">
                      {[{ n: 1, rows: [1] },{ n: 3, rows: [1,2] },{ n: 6, rows: [1,2,3] },{ n: 10, rows: [1,2,3,4] }].map(({ n, rows }) => (
                        <div key={n} className="text-center">
                          <div className="inline-flex flex-col items-center gap-0.5 mb-1">
                            {rows.map((count, ri) => (
                              <div key={ri} className="flex gap-0.5">
                                {Array.from({ length: count }).map((_, ci) => <div key={ci} className={`w-3 h-3 rounded-full ${p.dotColor}`} />)}
                              </div>
                            ))}
                          </div>
                          <p className={`${p.colorText} text-xs font-bold`}>{n}</p>
                        </div>
                      ))}
                      <span className="text-white/40 self-center text-lg">...</span>
                    </div>
                    <BlockMath math={p.formula} />
                  </div>
                );})()}

                {/* Pattern 6 — Pascal */}
                <div className={`rounded-xl border p-4 ${t.pascal.colorBg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${t.pascal.colorBadge} text-white text-xs font-bold px-2 py-0.5 rounded`}>6</span>
                    <p className={`font-body text-sm font-bold ${t.pascal.colorText}`}>{t.pascal.name}</p>
                  </div>
                  <p className="font-body text-xs text-white/70 mb-2">{t.pascal.desc}</p>
                  <div className="flex flex-col items-center gap-1 my-3 font-mono text-xs">
                    {[{ row: [1], sum: 1 },{ row: [1,1], sum: 2 },{ row: [1,2,1], sum: 4 },{ row: [1,3,3,1], sum: 8 },{ row: [1,4,6,4,1], sum: 16 },{ row: [1,5,10,10,5,1], sum: 32 }].map(({ row, sum }, ri) => (
                      <div key={ri} className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {row.map((val, ci) => (
                            <span key={ci} className="bg-pink-700/50 border border-pink-400/40 text-pink-200 font-bold rounded px-1.5 py-0.5 min-w-[24px] text-center">{val}</span>
                          ))}
                        </div>
                        <span className="text-white/30 text-xs">→</span>
                        <span className="bg-pink-500/20 border border-pink-400/50 text-pink-100 font-bold rounded px-1.5 py-0.5 min-w-[28px] text-center">{sum}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="font-body text-xs text-white/70">{t.pascal.rowSumLabel} <strong className="text-pink-300">1, 2, 4, 8, 16, 32, ...</strong></p>
                    <p className="font-body text-xs text-white/70">{t.pascal.doublesNote}</p>
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-2 mt-2">
                      <BlockMath math="\text{Jumlah baris ke-}n = 2^{n-1}" />
                    </div>
                  </div>
                </div>

                {/* Pattern 7 — Fibonacci */}
                <div className={`rounded-xl border p-4 ${t.fibonacci.colorBg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${t.fibonacci.colorBadge} text-white text-xs font-bold px-2 py-0.5 rounded`}>7</span>
                    <p className={`font-body text-sm font-bold ${t.fibonacci.colorText}`}>{t.fibonacci.name}</p>
                  </div>
                  <p className="font-body text-xs text-white/70 mb-2">{t.fibonacci.desc}</p>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {[1,1,2,3,5,8,13,21,34,55].map((n, i) => (
                      <span key={i} className={`${t.fibonacci.colorTerm} text-xs font-bold px-2 py-1 rounded-lg`}>{n}</span>
                    ))}
                    <span className="text-white/40 self-center">...</span>
                  </div>
                  <BlockMath math="U_n = U_{n-1} + U_{n-2} \quad (U_1 = U_2 = 1)" />
                  <p className="font-body text-xs text-white/60 mt-1">{t.fibonacci.natureNote}</p>
                </div>

              </div>
            )}
          </div>

          {/* ANIMASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="animasi" icon={<Activity className="w-5 h-5" />} iconColor="text-cyan-400" title={t.animTitle} />
            {expandedSections.includes("animasi") && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/70 leading-relaxed">{t.animDesc}</p>
                <ArcDifferenceAnimation language={language} />
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1Title} />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badgeEasy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.problemLabel}</p>
                  <p className="font-body text-sm text-white/85">{t.ex1Problem}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.ex1IdentLabel}</p>
                      <div className="overflow-x-auto mb-2">
                        <table className="text-xs border-collapse">
                          <thead>
                            <tr className="bg-green-900/40">
                              <th className="border border-green-500/30 px-3 py-1 text-green-200">n</th>
                              {[1,2,3,4,12].map(n => <th key={n} className="border border-green-500/30 px-3 py-1 text-green-200">{n}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-slate-800/30">
                              <td className="border border-white/10 px-3 py-1 text-white/60">Uₙ</td>
                              {[1,4,9,16,"?"].map((v, i) => <td key={i} className={`border border-white/10 px-3 py-1 text-center font-bold ${v === "?" ? "text-yellow-300" : "text-green-200"}`}>{v}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-white/70 mb-1">{t.ex1TermNote}</p>
                      <BlockMath math="1 = 1^2,\quad 4 = 2^2,\quad 9 = 3^2,\quad 16 = 4^2" />
                      <p className="text-cyan-300 font-semibold mb-1">{t.ex1FormulaLabel}</p>
                      <BlockMath math="U_n = n^2" />
                      <p className="text-cyan-300 font-semibold mb-1">{t.ex1SubstLabel}</p>
                      <BlockMath math="U_{12} = 12^2 = 144" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">{t.ex1Ans}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2Title} />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badgeMedium} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.problemLabel}</p>
                  <p className="font-body text-sm text-white/85">{t.ex2Problem}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.ex2Step1}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead><tr className="bg-teal-900/40"><th className="border border-white/10 px-2 py-1 text-teal-200">n</th><th className="border border-white/10 px-2 py-1 text-teal-200">Uₙ</th></tr></thead>
                          <tbody>
                            {fibRows.map(([n, u]) => (
                              <tr key={n} className={n >= 11 ? "bg-teal-900/30" : "bg-slate-800/20"}>
                                <td className="border border-white/10 px-2 py-1 text-white/60 text-center">{n}</td>
                                <td className="border border-white/10 px-2 py-1 text-center font-bold text-teal-200">{u}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-white/70 mt-2"><InlineMath math="U_{11} = 89" />, <InlineMath math="U_{12} = 144" /></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.ex2Step2}</p>
                      <BlockMath math="\frac{U_{12}}{U_{11}} = \frac{144}{89} \approx 1{,}618" />
                      <p className="text-white/70 text-xs mt-1">{t.ex2GoldenNote}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">✅ {t.ex2Ans}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3Title} />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badgeHard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.problemLabel}</p>
                  <p className="font-body text-sm text-white/85">{t.ex3Problem}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.ex3Step1}</p>
                      <div className="flex flex-col items-center gap-1 my-2 font-mono text-xs">
                        {pascalRows.map(({ baris, values }) => (
                          <div key={baris} className="flex gap-1 items-center">
                            <span className="text-white/30 text-xs w-4 text-right mr-1">{baris}</span>
                            {values.map((val, ci) => (
                              <span key={ci} className={`${baris === 7 ? "bg-pink-700/60 border-pink-400/50 text-pink-100 font-bold" : "bg-slate-700/50 border-white/10 text-white/50"} border rounded px-1.5 py-0.5 min-w-[28px] text-center`}>{val}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                      <p className="text-pink-300 font-semibold mt-1">{language === "ja" ? "第7行：" : language === "en" ? "Row 7: " : "Baris ke-7: "}<strong>1, 6, 15, 20, 15, 6, 1</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.ex3Step2}</p>
                      <BlockMath math="1 + 6 + 15 + 20 + 15 + 6 + 1 = 64" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">{t.ex3Step3}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead><tr className="bg-pink-900/40">
                            <th className="border border-white/10 px-2 py-1 text-pink-200">{t.colN}</th>
                            <th className="border border-white/10 px-2 py-1 text-pink-200">{t.colSum}</th>
                            <th className="border border-white/10 px-2 py-1 text-pink-200">{t.colPow}</th>
                          </tr></thead>
                          <tbody>
                            {pascalSumRows.map(([n, j, p]) => (
                              <tr key={n} className={n === 7 ? "bg-pink-900/30" : "bg-slate-800/20"}>
                                <td className="border border-white/10 px-2 py-1 text-center text-white/60">{n}</td>
                                <td className="border border-white/10 px-2 py-1 text-center font-bold text-pink-200">{j}</td>
                                <td className="border border-white/10 px-2 py-1 text-center text-green-300">{p}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <BlockMath math="\text{Jumlah baris ke-}n = 2^{n-1}" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300">{t.ex3Ans}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{t.summaryHeader}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{t.summarySubheader}</p>
            </div>

            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">1</span>
                  {t.summarySection1}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {t.summaryRows.map(({ nama, contoh, rumus, beda, color, badge }, i) => (
                    <div key={nama} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className={`${badge} text-white text-xs font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <p className="font-body text-xs font-bold">{nama}</p>
                          <p className="font-mono text-xs font-bold text-white/90">{rumus}</p>
                        </div>
                        <p className="font-mono text-[11px] text-white/50 mt-0.5">{contoh}</p>
                        <p className="font-body text-[11px] text-white/40 mt-0.5 italic">{beda}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-500/30 border border-pink-500 flex items-center justify-center text-[10px]">2</span>
                  {t.summarySection2}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {t.facts.map(({ icon, fact, detail, color }) => (
                    <div key={fact} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{fact}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[10px]">3</span>
                  {t.summarySection3}
                </p>
                <div className="space-y-2">
                  {t.tips.map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-pink-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🌌</div>
                <p className="font-display text-base font-bold text-white">{t.conclusionTitle}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.conclusionBody}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {t.conclusionTags.map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{t.conclusionBadge}</p>
              </div>

            </div>
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaKhususPage;
