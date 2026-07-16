import React from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, Layers, Sparkles } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { ArcPatternPanel } from "@/components/ArcDifferenceAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const SectionHeader = ({ icon, iconColor, title }: {
  icon: React.ReactNode; iconColor?: string; title: string;
}) => (
  <div className="w-full flex items-center px-5 py-4">
    <div className="flex items-center gap-3">
      <span className={iconColor}>{icon}</span>
      <span className="font-body font-semibold text-foreground">{title}</span>
    </div>
  </div>
);

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
);

const translations = {
  id: {
    pageTitle: "PENGERTIAN POLA, BARISAN BILANGAN DAN POLA-POLA KHUSUS",
    pageSubtitle: "Temukan Aturan Tersembunyi di Balik Deretan Angka!",
    breadcrumb: "Kelas 8 · Pola Bilangan · Materi Matematika",
    sec1Banner: "📘 Bagian 1 — Pengertian Pola & Barisan Bilangan",
    sec1Title: "🌟 Pola — Keteraturan yang Ada di Mana-mana",
    sec1Body: "Coba perhatikan lantai keramik bermotif, petikan dawai gitar, atau jadwal bus yang datang setiap 15 menit — semuanya punya pola! Bahkan motif batik — warisan seni budaya Indonesia yang kaya — pun merupakan contoh nyata dari pola: setiap motif tercipta dari pengulangan bentuk yang mengikuti aturan tertentu. Dalam matematika, pola bilangan adalah susunan angka-angka yang mengikuti aturan tertentu yang bisa kita prediksi dan analisis.",
    figcaption: "Batik Sidomukti 🇮🇩 — motif batik adalah pola berulang, bukti bahwa seni budaya Indonesia pun penuh matematika!",
    simplePatternsHeader: "🔍 Contoh Pola Sederhana",
    addTwo: "→ Tambah 2",
    squareNum: "→ Bilangan kuadrat",
    timesTwo: "→ Dikali 2",
    whyImportant: "Mengapa pola bilangan penting?",
    whyImportantBody: "Kemampuan mengenali pola adalah fondasi berpikir matematis. Dari sini kamu bisa memprediksi suku berikutnya, merumuskan persamaan, bahkan memecahkan masalah dunia nyata seperti bunga bank, pertumbuhan populasi, dan fisika!",
    sec2Title: "📘 Konsep: Pola vs Barisan vs Deret",
    conceptSummaryTitle: "🎯 Ringkasan Intisari",
    conceptSummaryBody: "Sebuah pola bilangan adalah kumpulan bilangan yang disusun berdasarkan aturan tertentu. Setiap bilangan dalam susunan itu disebut suku. Ketika suku-suku itu berurutan secara beraturan, kita menyebutnya barisan bilangan. Jika semua suku dalam barisan tersebut dijumlahkan, maka hasilnya disebut deret.",
    tableCol1: "Istilah", tableCol2: "Arti", tableCol3: "Simbol",
    tableRows: [
      ["Suku", "Setiap bilangan dalam barisan", "U₁, U₂, U₃, ..., Uₙ"],
      ["Barisan", "Deretan suku yang berurutan dengan aturan tertentu", "U₁, U₂, U₃, ..."],
      ["Pola", "Aturan/hubungan yang menghubungkan antar suku", "Selisih tetap, rasio tetap, dll"],
      ["Deret", "Jumlah dari suku-suku dalam suatu barisan bilangan", "Sₙ = U₁ + U₂ + U₃ + ... + Uₙ"],
      ["Suku ke-n", "Rumus umum untuk menemukan suku manapun", "Uₙ = f(n)"],
    ],
    findRuleHeader: "🔎 Cara Menemukan Aturan Pola",
    steps: [
      { step: "1", label: "Amati apakah selisih antar suku sama", desc: "Cek: 4−2=2, 6−4=2, 8−6=2 → setiap suku bertambah 2", color: "border-cyan-500/30 bg-cyan-900/10" },
      { step: "2", label: "Amati apakah setiap suku dikali angka yang sama", desc: "Cek: 6÷3=2, 12÷6=2, 24÷12=2 → setiap suku dikali 2", color: "border-green-500/30 bg-green-900/10" },
      { step: "3", label: "Lihat hubungan nilai suku dengan posisinya", desc: "Suku ke-1, ke-2, ke-3... apakah ada pola n², n(n+1), atau 2ⁿ?", color: "border-violet-500/30 bg-violet-900/10" },
      { step: "4", label: "Uji aturan yang kamu temukan", desc: "Cek dengan n=1, 2, 3 — hasil harus cocok dengan barisan", color: "border-orange-500/30 bg-orange-900/10" },
    ],
    sec2Banner: "⭐ Bagian 2 — Pola-Pola Khusus",
    specialTitle: "🌟 Pola Khusus — Keindahan Matematika",
    specialBody: "Dalam dunia matematika, ada pola-pola yang begitu terkenal dan muncul berulang kali di berbagai bidang — dari arsitektur hingga alam. Kita menyebutnya pola khusus. Mengenalinya akan membuat kamu jauh lebih cepat menjawab soal dan memahami dunia!",
    factBox: "Fakta menarik: Pola Fibonacci ditemukan di kelopak bunga, cangkang siput, dan bahkan galaksi spiral. Pola segitiga Pascal muncul di teori probabilitas dan ekspansi binomial. Matematika bukan hanya angka — ini adalah bahasa alam semesta! 🌌",
    catalogTitle: "📚 Katalog 7 Pola Khusus",
    polaNames: ["Pola Bilangan Genap", "Pola Bilangan Ganjil", "Pola Bilangan Persegi", "Pola Bilangan Persegi Panjang", "Pola Bilangan Segitiga", "Pola Segitiga Pascal", "Pola Fibonacci"],
    polaDescs: [
      "Bilangan yang habis dibagi 2.",
      "Bilangan yang tidak habis dibagi 2.",
      "Bilangan kuadrat — bisa disusun membentuk persegi.",
      <>Titik-titik yang membentuk persegi panjang dengan sisi <InlineMath math="n" /> dan <InlineMath math="n+1" />.</>,
      "Titik-titik yang disusun membentuk segitiga sama sisi.",
      "Setiap bilangan = jumlah dua bilangan di atasnya. Baris dimulai dan diakhiri angka 1.",
      "Setiap suku = jumlah dua suku sebelumnya. Dimulai dari 1, 1.",
    ],
    polaDiffLabels: [
      "Beda tetap +2", "Beda tetap +2",
      "Beda bertambah +2 setiap kali", "Beda bertambah +2 setiap kali",
      "Beda bertambah +1 setiap kali", "Beda selalu ×2 (berlipat ganda)", undefined,
    ],
    polaNotes: [
      undefined, undefined,
      "Beda: +3, +5, +7, +9, +11 → bilangan ganjil!",
      "Beda: +4, +6, +8, +10, +12 → bilangan genap!",
      "Beda: +2, +3, +4, +5, +6 → bilangan asli!",
      <>Beda: +1, +2, +4, +8, +16 → jumlah baris ke-n = <InlineMath math="2^{n-1}" /></>,
      "Setiap suku = jumlah dua suku sebelumnya",
    ],
    pascalRowSum: "Jumlah bilangan pada setiap baris:",
    pascalDoubles: <>Setiap baris, jumlahnya <strong className="text-pink-300">berlipat ganda (×2)</strong> dari baris sebelumnya.</>,
    fibNatureNote: "🌿 Muncul di alam: kelopak bunga, cangkang nautilus, susunan biji bunga matahari!",
    ex1Title: "✏️ Contoh 1 — Tingkat Mudah (Pola Persegi)",
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    problemLabel: "📝 Soal", solutionLabel: "🔍 Pembahasan",
    ex1Problem: <>Perhatikan barisan bilangan berikut: <strong>1, 4, 9, 16, ...</strong><br />Tentukan suku ke-12 dari barisan tersebut!</>,
    ex1Identify: "Identifikasi pola:",
    ex1EachTerm: "Setiap suku merupakan kuadrat dari nomor sukunya:",
    ex1FormulaLabel: "Rumus suku ke-n:",
    ex1SubstLabel: "Substitusi n = 12:",
    ex1Answer: <>✅ Jawaban: Suku ke-12 dari barisan 1, 4, 9, 16, ... adalah <strong>144</strong>.</>,
    ex2Title: "✏️ Contoh 2 — Tingkat Sedang (Barisan Bertingkat)",
    ex2Problem: <>Perhatikan barisan berikut: <strong>6, 12, 20, 30, …</strong><br />Tentukan suku ke-15 dari barisan tersebut!</>,
    ex2Step1: "Langkah 1 — Nyatakan setiap suku sebagai perkalian dua bilangan berurutan:",
    ex2Step2: "Langkah 2 — Temukan polanya:",
    ex2Step3: "Langkah 3 — Rumus umum & substitusi n = 15:",
    ex2ObserveRel: <>Perhatikan hubungan antara nilai <InlineMath math="n" /> dan faktor perkaliannya:</>,
    ex2Pattern: <>Pola: faktor pertama = <InlineMath math="(n+1)" />, faktor kedua = <InlineMath math="(n+2)" /></>,
    ex2Answer: <>✅ Jawaban: Suku ke-15 dari barisan 6, 12, 20, 30, … adalah <strong className="text-yellow-300">272</strong>.</>,
    colTerm: "Suku", colProduct: "Bentuk Perkalian",
    ex3Title: "✏️ Contoh 3 — Tingkat Sulit (Pola Gambar)",
    ex3Problem: <>Perhatikan pola susunan lingkaran berikut. Tentukan <strong>banyaknya lingkaran pada Pola ke-20</strong>!</>,
    circleUnit: "lingkaran", patternLabel: "Pola ke-",
    ex3Step1: "Langkah 1 — Nyatakan setiap pola sebagai perkalian dua bilangan:",
    ex3Step2: "Langkah 2 — Temukan polanya:",
    ex3Step3: "Langkah 3 — Rumus umum & substitusi n = 20:",
    ex3ObserveRel: <>Perhatikan hubungan antara nilai <InlineMath math="n" /> dan faktor perkaliannya:</>,
    ex3ColPattern: "Pola ke-", ex3ColCircles: "Banyak Lingkaran", ex3ColProduct: "Bentuk Perkalian",
    ex3Pattern: <>Pola: faktor pertama = <InlineMath math="n" />, faktor kedua = <InlineMath math="(n+2)" /></>,
    ex3Answer: <>✅ Jawaban: Banyak lingkaran pada Pola ke-20 adalah <strong className="text-yellow-300">440 lingkaran</strong>.</>,
    miniSummaryTitle: "📌 Rangkuman Pengertian Pola, Barisan Bilangan & Pola-Pola Khusus",
    miniSummaryItems: [
      ["Pola Bilangan", "Susunan angka yang mengikuti aturan tertentu"],
      ["Suku", "Setiap anggota/elemen dalam barisan"],
      ["Barisan", "Deretan suku yang berurutan berdasarkan aturan"],
      ["Deret", "Hasil penjumlahan suku-suku dalam suatu barisan"],
      ["Cara menemukan pola", "Cek selisih → cek rasio → cek hubungan dengan n"],
      ["Rumus suku ke-n", "Ekspresi matematika Uₙ = f(n) yang berlaku untuk semua suku"],
    ],
    summaryTableColName: "Nama Pola", summaryTableColExample: "Contoh", summaryTableColFormula: "Rumus Uₙ",
    summaryTableRows: [
      ["Genap", "2, 4, 6, 8, ...", "2n"],
      ["Ganjil", "1, 3, 5, 7, ...", "2n − 1"],
      ["Persegi", "1, 4, 9, 16, ...", "n²"],
      ["Persegi Panjang", "2, 6, 12, 20, ...", "n(n+1)"],
      ["Segitiga", "1, 3, 6, 10, ...", "n(n+1)/2"],
      ["Pascal (jumlah baris n)", "1, 2, 4, 8, 16, 32, ...", "2ⁿ⁻¹"],
      ["Fibonacci", "1, 1, 2, 3, 5, ...", "Uₙ = Uₙ₋₁ + Uₙ₋₂"],
    ],
    tipBox: "💡 Tip: Selalu uji rumus yang kamu temukan dengan minimal 3 suku pertama. Jika cocok, rumusmu sudah benar!",
    finalSummaryHeader: "📖 RANGKUMAN LENGKAP",
    finalSummarySubheader: "Pengertian Pola, Barisan Bilangan & Pola Khusus",
    conceptSection: "Konsep Dasar",
    conceptItems: [
      { label: "Pola Bilangan", desc: "Susunan angka yang mengikuti aturan tertentu yang dapat diprediksi", color: "from-cyan-900/60 to-cyan-800/30 border-cyan-500/40 text-cyan-200" },
      { label: "Barisan Bilangan", desc: "Suku-suku pola yang disusun secara berurutan: U₁, U₂, U₃, ..., Uₙ", color: "from-violet-900/60 to-violet-800/30 border-violet-500/40 text-violet-200" },
      { label: "Deret Bilangan", desc: "Jumlah semua suku dalam barisan: Sₙ = U₁ + U₂ + ... + Uₙ", color: "from-pink-900/60 to-pink-800/30 border-pink-500/40 text-pink-200" },
      { label: "Suku ke-n (Uₙ)", desc: "Rumus umum untuk menentukan nilai suku pada posisi ke-n", color: "from-green-900/60 to-green-800/30 border-green-500/40 text-green-200" },
    ],
    specialSection: "7 Pola Khusus — Hafal Rumusnya!",
    specialItems: [
      { nama: "Genap", rumus: "Uₙ = 2n", warna: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { nama: "Ganjil", rumus: "Uₙ = 2n − 1", warna: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
      { nama: "Persegi", rumus: "Uₙ = n²", warna: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { nama: "Persegi Panjang", rumus: "Uₙ = n(n+1)", warna: "bg-green-900/50 border-green-500/40 text-green-200" },
      { nama: "Segitiga", rumus: "Uₙ = n(n+1)/2", warna: "bg-yellow-900/50 border-yellow-500/40 text-yellow-200" },
      { nama: "Pascal (baris n)", rumus: "Jumlah = 2ⁿ⁻¹", warna: "bg-pink-900/50 border-pink-500/40 text-pink-200" },
      { nama: "Fibonacci", rumus: "Uₙ = Uₙ₋₁ + Uₙ₋₂", warna: "bg-teal-900/50 border-teal-500/40 text-teal-200" },
    ],
    tipsSection: "Tips & Trik Jitu",
    tipsItems: [
      { tip: "Cek selisih antar suku terlebih dahulu", detail: "Jika selisihnya tetap → aritmetika. Jika rasionya tetap → geometri. Jika selisih 2× → bertingkat.", icon: "⚡", color: "bg-yellow-900/30 border-yellow-500/30" },
      { tip: "Cocokkan suku dengan posisinya", detail: "Coba hubungkan nilai suku dengan n. Apakah suku ke-n = n², n(n+1), atau 2ⁿ? Uji dengan n=1, 2, 3.", icon: "🔍", color: "bg-blue-900/30 border-blue-500/30" },
      { tip: "Hafal 7 pola khusus di atas", detail: "Soal ujian sering menyamarkan pola khusus. Kenali polanya dulu sebelum mencari rumus.", icon: "🧠", color: "bg-green-900/30 border-green-500/30" },
      { tip: "Verifikasi dengan minimal 3 suku", detail: "Rumus yang benar harus cocok untuk semua suku, bukan hanya 1 atau 2 suku.", icon: "✅", color: "bg-violet-900/30 border-violet-500/30" },
    ],
    conclusionText: "Tujuh pola khusus ini adalah jendela untuk melihat keindahan tersembunyi di balik angka-angka. Dengan memahami setiap polanya, kamu tidak hanya lebih cepat menjawab soal, tetapi juga mulai melihat matematika di mana-mana — dari susunan lantai hingga pola alam semesta. Selamat belajar!",
    conclusionTags: ["Pola Bilangan", "Barisan", "Deret", "Pola Khusus", "Fibonacci", "Pascal", "Persegi"],
    backBtn: "← Kembali ke Pola Bilangan",
  },
  en: {
    pageTitle: "NUMBER PATTERNS, SEQUENCES & SPECIAL PATTERNS",
    pageSubtitle: "Discover the Hidden Rules Behind Number Sequences!",
    breadcrumb: "Grade 8 · Number Patterns · Math Content",
    sec1Banner: "📘 Part 1 — Introduction to Patterns & Sequences",
    sec1Title: "🌟 Patterns — Order Everywhere Around Us",
    sec1Body: "Look at patterned tile floors, guitar strings plucked in sequence, or a bus schedule that comes every 15 minutes — they all have patterns! Even batik motifs — the rich cultural heritage of Indonesia — are a real example of patterns: each motif is created by repeating shapes following a specific rule. In mathematics, a number pattern is an arrangement of numbers that follows a specific rule we can predict and analyze.",
    figcaption: "Batik Sidomukti 🇮🇩 — batik motifs are repeating patterns, proof that Indonesian cultural art is full of mathematics!",
    simplePatternsHeader: "🔍 Simple Pattern Examples",
    addTwo: "→ Add 2",
    squareNum: "→ Square numbers",
    timesTwo: "→ Multiply by 2",
    whyImportant: "Why are number patterns important?",
    whyImportantBody: "The ability to recognize patterns is the foundation of mathematical thinking. From here you can predict the next term, formulate equations, and even solve real-world problems like bank interest, population growth, and physics!",
    sec2Title: "📘 Concepts: Pattern vs Sequence vs Series",
    conceptSummaryTitle: "🎯 Key Summary",
    conceptSummaryBody: "A number pattern is a collection of numbers arranged according to a specific rule. Each number in the arrangement is called a term. When terms are arranged in an orderly sequence, we call it a number sequence. When all terms in a sequence are added together, the result is called a series.",
    tableCol1: "Term", tableCol2: "Meaning", tableCol3: "Symbol",
    tableRows: [
      ["Term", "Each number in a sequence", "U₁, U₂, U₃, ..., Uₙ"],
      ["Sequence", "An ordered list of terms following a specific rule", "U₁, U₂, U₃, ..."],
      ["Pattern", "The rule/relationship connecting consecutive terms", "Constant difference, constant ratio, etc."],
      ["Series", "The sum of terms in a number sequence", "Sₙ = U₁ + U₂ + U₃ + ... + Uₙ"],
      ["nth Term", "General formula to find any term", "Uₙ = f(n)"],
    ],
    findRuleHeader: "🔎 How to Find a Pattern Rule",
    steps: [
      { step: "1", label: "Check whether the difference between consecutive terms is constant", desc: "Check: 4−2=2, 6−4=2, 8−6=2 → each term increases by 2", color: "border-cyan-500/30 bg-cyan-900/10" },
      { step: "2", label: "Check whether each term is multiplied by the same number", desc: "Check: 6÷3=2, 12÷6=2, 24÷12=2 → each term multiplied by 2", color: "border-green-500/30 bg-green-900/10" },
      { step: "3", label: "Look at the relationship between term value and its position", desc: "Term 1, 2, 3... is there a pattern n², n(n+1), or 2ⁿ?", color: "border-violet-500/30 bg-violet-900/10" },
      { step: "4", label: "Test the rule you found", desc: "Check with n=1, 2, 3 — results must match the sequence", color: "border-orange-500/30 bg-orange-900/10" },
    ],
    sec2Banner: "⭐ Part 2 — Special Patterns",
    specialTitle: "🌟 Special Patterns — The Beauty of Mathematics",
    specialBody: "In the world of mathematics, there are patterns so famous that they appear repeatedly across many fields — from architecture to nature. We call them special patterns. Recognizing them will make you much faster at answering problems and understanding the world!",
    factBox: "Interesting fact: The Fibonacci pattern is found in flower petals, snail shells, and even spiral galaxies. Pascal's Triangle appears in probability theory and binomial expansion. Mathematics is not just numbers — it is the language of the universe! 🌌",
    catalogTitle: "📚 Catalogue of 7 Special Patterns",
    polaNames: ["Even Number Pattern", "Odd Number Pattern", "Square Number Pattern", "Rectangular Number Pattern", "Triangular Number Pattern", "Pascal's Triangle Pattern", "Fibonacci Pattern"],
    polaDescs: [
      "Numbers divisible by 2.",
      "Numbers not divisible by 2.",
      "Square numbers — can be arranged to form a square.",
      <>Dots forming rectangles with sides <InlineMath math="n" /> and <InlineMath math="n+1" />.</>,
      "Dots arranged to form equilateral triangles.",
      "Each number = sum of the two numbers above it. Rows start and end with 1.",
      "Each term = sum of the two previous terms. Starts from 1, 1.",
    ],
    polaDiffLabels: [
      "Constant difference +2", "Constant difference +2",
      "Difference increases by +2 each time", "Difference increases by +2 each time",
      "Difference increases by +1 each time", "Difference always ×2 (doubles each time)", undefined,
    ],
    polaNotes: [
      undefined, undefined,
      "Differences: +3, +5, +7, +9, +11 → odd numbers!",
      "Differences: +4, +6, +8, +10, +12 → even numbers!",
      "Differences: +2, +3, +4, +5, +6 → natural numbers!",
      <>Differences: +1, +2, +4, +8, +16 → row n sum = <InlineMath math="2^{n-1}" /></>,
      "Each term = sum of two previous terms",
    ],
    pascalRowSum: "Sum of numbers in each row:",
    pascalDoubles: <>Each row, the sum <strong className="text-pink-300">doubles (×2)</strong> from the previous row.</>,
    fibNatureNote: "🌿 Found in nature: flower petals, nautilus shells, sunflower seed arrangements!",
    ex1Title: "✏️ Example 1 — Easy Level (Square Pattern)",
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    problemLabel: "📝 Problem", solutionLabel: "🔍 Solution",
    ex1Problem: <>Observe the following sequence: <strong>1, 4, 9, 16, ...</strong><br />Determine the 12th term of the sequence!</>,
    ex1Identify: "Identify the pattern:",
    ex1EachTerm: "Each term is the square of its position number:",
    ex1FormulaLabel: "Formula for the nth term:",
    ex1SubstLabel: "Substitute n = 12:",
    ex1Answer: <>✅ Answer: The 12th term of the sequence 1, 4, 9, 16, ... is <strong>144</strong>.</>,
    ex2Title: "✏️ Example 2 — Medium Level (Layered Sequence)",
    ex2Problem: <>Observe the following sequence: <strong>6, 12, 20, 30, …</strong><br />Determine the 15th term of the sequence!</>,
    ex2Step1: "Step 1 — Express each term as the product of two consecutive numbers:",
    ex2Step2: "Step 2 — Find the pattern:",
    ex2Step3: "Step 3 — General formula & substitute n = 15:",
    ex2ObserveRel: <>Observe the relationship between <InlineMath math="n" /> and its multiplication factors:</>,
    ex2Pattern: <>Pattern: first factor = <InlineMath math="(n+1)" />, second factor = <InlineMath math="(n+2)" /></>,
    ex2Answer: <>✅ Answer: The 15th term of the sequence 6, 12, 20, 30, … is <strong className="text-yellow-300">272</strong>.</>,
    colTerm: "Term", colProduct: "Product Form",
    ex3Title: "✏️ Example 3 — Hard Level (Dot Pattern)",
    ex3Problem: <>Observe the circle arrangement pattern below. Determine the <strong>number of circles in Pattern 20</strong>!</>,
    circleUnit: "circles", patternLabel: "Pattern ",
    ex3Step1: "Step 1 — Express each pattern as the product of two numbers:",
    ex3Step2: "Step 2 — Find the pattern:",
    ex3Step3: "Step 3 — General formula & substitute n = 20:",
    ex3ObserveRel: <>Observe the relationship between <InlineMath math="n" /> and its multiplication factors:</>,
    ex3ColPattern: "Pattern No.", ex3ColCircles: "Number of Circles", ex3ColProduct: "Product Form",
    ex3Pattern: <>Pattern: first factor = <InlineMath math="n" />, second factor = <InlineMath math="(n+2)" /></>,
    ex3Answer: <>✅ Answer: The number of circles in Pattern 20 is <strong className="text-yellow-300">440 circles</strong>.</>,
    miniSummaryTitle: "📌 Summary: Number Patterns, Sequences & Special Patterns",
    miniSummaryItems: [
      ["Number Pattern", "A set of numbers following a specific rule"],
      ["Term", "Each member/element in a sequence"],
      ["Sequence", "An ordered list of terms following a rule"],
      ["Series", "The result of adding terms in a sequence"],
      ["Finding a pattern", "Check differences → check ratios → check relation with n"],
      ["nth Term formula", "Mathematical expression Uₙ = f(n) valid for all terms"],
    ],
    summaryTableColName: "Pattern Name", summaryTableColExample: "Example", summaryTableColFormula: "Formula Uₙ",
    summaryTableRows: [
      ["Even", "2, 4, 6, 8, ...", "2n"],
      ["Odd", "1, 3, 5, 7, ...", "2n − 1"],
      ["Square", "1, 4, 9, 16, ...", "n²"],
      ["Rectangular", "2, 6, 12, 20, ...", "n(n+1)"],
      ["Triangular", "1, 3, 6, 10, ...", "n(n+1)/2"],
      ["Pascal (row n sum)", "1, 2, 4, 8, 16, 32, ...", "2ⁿ⁻¹"],
      ["Fibonacci", "1, 1, 2, 3, 5, ...", "Uₙ = Uₙ₋₁ + Uₙ₋₂"],
    ],
    tipBox: "💡 Tip: Always test the formula you find with at least the first 3 terms. If it matches, your formula is correct!",
    finalSummaryHeader: "📖 COMPLETE SUMMARY",
    finalSummarySubheader: "Number Patterns, Sequences & Special Patterns",
    conceptSection: "Basic Concepts",
    conceptItems: [
      { label: "Number Pattern", desc: "An arrangement of numbers following a predictable specific rule", color: "from-cyan-900/60 to-cyan-800/30 border-cyan-500/40 text-cyan-200" },
      { label: "Number Sequence", desc: "Pattern terms arranged in order: U₁, U₂, U₃, ..., Uₙ", color: "from-violet-900/60 to-violet-800/30 border-violet-500/40 text-violet-200" },
      { label: "Number Series", desc: "Sum of all terms in a sequence: Sₙ = U₁ + U₂ + ... + Uₙ", color: "from-pink-900/60 to-pink-800/30 border-pink-500/40 text-pink-200" },
      { label: "nth Term (Uₙ)", desc: "General formula to determine the value of the term at position n", color: "from-green-900/60 to-green-800/30 border-green-500/40 text-green-200" },
    ],
    specialSection: "7 Special Patterns — Memorize the Formulas!",
    specialItems: [
      { nama: "Even", rumus: "Uₙ = 2n", warna: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { nama: "Odd", rumus: "Uₙ = 2n − 1", warna: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
      { nama: "Square", rumus: "Uₙ = n²", warna: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { nama: "Rectangular", rumus: "Uₙ = n(n+1)", warna: "bg-green-900/50 border-green-500/40 text-green-200" },
      { nama: "Triangular", rumus: "Uₙ = n(n+1)/2", warna: "bg-yellow-900/50 border-yellow-500/40 text-yellow-200" },
      { nama: "Pascal (row n)", rumus: "Sum = 2ⁿ⁻¹", warna: "bg-pink-900/50 border-pink-500/40 text-pink-200" },
      { nama: "Fibonacci", rumus: "Uₙ = Uₙ₋₁ + Uₙ₋₂", warna: "bg-teal-900/50 border-teal-500/40 text-teal-200" },
    ],
    tipsSection: "Key Tips & Tricks",
    tipsItems: [
      { tip: "Check the difference between consecutive terms first", detail: "If the difference is constant → arithmetic. If the ratio is constant → geometric. If the difference doubles → layered.", icon: "⚡", color: "bg-yellow-900/30 border-yellow-500/30" },
      { tip: "Match terms with their positions", detail: "Try connecting the term value with n. Is term n = n², n(n+1), or 2ⁿ? Test with n=1, 2, 3.", icon: "🔍", color: "bg-blue-900/30 border-blue-500/30" },
      { tip: "Memorize the 7 special patterns above", detail: "Exam questions often disguise special patterns. Identify the pattern first before looking for a formula.", icon: "🧠", color: "bg-green-900/30 border-green-500/30" },
      { tip: "Verify with at least 3 terms", detail: "A correct formula must match all terms, not just 1 or 2.", icon: "✅", color: "bg-violet-900/30 border-violet-500/30" },
    ],
    conclusionText: "These seven special patterns are a window to see the hidden beauty behind numbers. By understanding each pattern, you will not only answer problems faster, but also start seeing mathematics everywhere — from floor tiles to the patterns of the universe. Happy learning!",
    conclusionTags: ["Number Patterns", "Sequences", "Series", "Special Patterns", "Fibonacci", "Pascal", "Square"],
    backBtn: "← Back to Number Patterns",
  },
  ja: {
    pageTitle: "数のパターン・数列と特殊パターン",
    pageSubtitle: "数の並びに隠されたルールを発見しよう！",
    breadcrumb: "中学2年 · 数の規則性 · 数学教材",
    sec1Banner: "📘 第1節 — パターンと数列の概念",
    sec1Title: "🌟 パターン — 至る所に存在する規則性",
    sec1Body: "タイル張りの床、ギターの弦の音、15分ごとに来るバスの時刻表 — すべてにパターンがあります！インドネシアの豊かな文化遺産であるバティック模様でさえ、パターンの実例です：各模様は特定のルールに従って形を繰り返すことで作られています。数学では、数のパターンとは特定のルールに従って配列された数のことで、予測・分析できるものです。",
    figcaption: "バティック・シドムクティ 🇮🇩 — バティック模様は繰り返しのパターン、インドネシアの文化芸術が数学に満ちている証拠！",
    simplePatternsHeader: "🔍 簡単なパターンの例",
    addTwo: "→ +2ずつ増える",
    squareNum: "→ 平方数",
    timesTwo: "→ ×2ずつ増える",
    whyImportant: "数のパターンはなぜ重要か？",
    whyImportantBody: "パターンを認識する能力は数学的思考の基盤です。ここから次の項を予測し、方程式を立て、銀行利息、人口増加、物理学などの実世界の問題を解くことができます！",
    sec2Title: "📘 概念：パターン vs 数列 vs 級数",
    conceptSummaryTitle: "🎯 要点まとめ",
    conceptSummaryBody: "数のパターンとは、特定のルールに従って配列された数の集まりです。配列の各数を「項」といいます。項が規則的に並んでいるとき、それを「数列」と呼びます。数列のすべての項を足し合わせると「級数」になります。",
    tableCol1: "用語", tableCol2: "意味", tableCol3: "記号",
    tableRows: [
      ["項", "数列の各数", "U₁, U₂, U₃, ..., Uₙ"],
      ["数列", "特定のルールに従った順番に並んだ項の列", "U₁, U₂, U₃, ..."],
      ["パターン", "隣り合う項を結ぶルール・関係", "公差、公比など"],
      ["級数", "数列の項の総和", "Sₙ = U₁ + U₂ + U₃ + ... + Uₙ"],
      ["第n項", "どの項でも求められる一般式", "Uₙ = f(n)"],
    ],
    findRuleHeader: "🔎 パターンのルールを見つける方法",
    steps: [
      { step: "1", label: "隣り合う項の差が一定かどうか確認する", desc: "確認：4−2=2, 6−4=2, 8−6=2 → 各項が2ずつ増える", color: "border-cyan-500/30 bg-cyan-900/10" },
      { step: "2", label: "各項が同じ数で掛けられているかどうか確認する", desc: "確認：6÷3=2, 12÷6=2, 24÷12=2 → 各項が2倍になる", color: "border-green-500/30 bg-green-900/10" },
      { step: "3", label: "項の値と位置の関係を見る", desc: "第1項、第2項、第3項... n²、n(n+1)、または2ⁿのパターンがあるか？", color: "border-violet-500/30 bg-violet-900/10" },
      { step: "4", label: "見つけたルールを検証する", desc: "n=1, 2, 3で確認 — 結果が数列と一致しなければならない", color: "border-orange-500/30 bg-orange-900/10" },
    ],
    sec2Banner: "⭐ 第2節 — 特殊パターン",
    specialTitle: "🌟 特殊パターン — 数学の美しさ",
    specialBody: "数学の世界には、建築から自然まで様々な分野で繰り返し現れる有名なパターンがあります。私たちはそれらを「特殊パターン」と呼びます。これらを認識できると、問題をずっと速く解けるようになり、世界をより深く理解できます！",
    factBox: "興味深い事実：フィボナッチ数列は花びら、カタツムリの殻、さらには渦巻銀河にも見られます。パスカルの三角形は確率論や二項展開に現れます。数学は単なる数ではなく、宇宙の言語です！🌌",
    catalogTitle: "📚 7つの特殊パターン一覧",
    polaNames: ["偶数のパターン", "奇数のパターン", "平方数のパターン", "長方形数のパターン", "三角数のパターン", "パスカルの三角形のパターン", "フィボナッチ数列"],
    polaDescs: [
      "2で割り切れる数。",
      "2で割り切れない数。",
      "平方数 — 正方形に並べられる。",
      <>nとn+1の辺を持つ長方形に並べられる点。</>,
      "正三角形に並べられる点。",
      "各数 = 上の2つの数の和。各行は1で始まり1で終わる。",
      "各項 = 前の2項の和。1, 1から始まる。",
    ],
    polaDiffLabels: [
      "公差 +2（一定）", "公差 +2（一定）",
      "差が毎回+2ずつ増える", "差が毎回+2ずつ増える",
      "差が毎回+1ずつ増える", "差は常に×2（倍増）", undefined,
    ],
    polaNotes: [
      undefined, undefined,
      "差：+3, +5, +7, +9, +11 → 奇数！",
      "差：+4, +6, +8, +10, +12 → 偶数！",
      "差：+2, +3, +4, +5, +6 → 自然数！",
      <>差：+1, +2, +4, +8, +16 → 第n行の合計 = <InlineMath math="2^{n-1}" /></>,
      "各項 = 前の2項の和",
    ],
    pascalRowSum: "各行の数の合計：",
    pascalDoubles: <>各行の合計は前の行から<strong className="text-pink-300">倍増（×2）</strong>します。</>,
    fibNatureNote: "🌿 自然界に現れる：花びら、オウムガイの殻、ひまわりの種の配列！",
    ex1Title: "✏️ 例1 — 基本（平方数のパターン）",
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    problemLabel: "📝 問題", solutionLabel: "🔍 解説",
    ex1Problem: <>次の数列を観察しなさい：<strong>1, 4, 9, 16, ...</strong><br />第12項を求めなさい！</>,
    ex1Identify: "パターンを識別する：",
    ex1EachTerm: "各項はその位置番号の二乗です：",
    ex1FormulaLabel: "第n項の公式：",
    ex1SubstLabel: "n = 12を代入：",
    ex1Answer: <>✅ 答え：数列1, 4, 9, 16, ... の第12項は<strong>144</strong>です。</>,
    ex2Title: "✏️ 例2 — 標準（段階的数列）",
    ex2Problem: <>次の数列を観察しなさい：<strong>6, 12, 20, 30, …</strong><br />第15項を求めなさい！</>,
    ex2Step1: "ステップ1 — 各項を連続する2数の積として表す：",
    ex2Step2: "ステップ2 — パターンを見つける：",
    ex2Step3: "ステップ3 — 一般式とn = 15の代入：",
    ex2ObserveRel: <><InlineMath math="n" />とその積の因数の関係を観察する：</>,
    ex2Pattern: <>パターン：第1の因数 = <InlineMath math="(n+1)" />、第2の因数 = <InlineMath math="(n+2)" /></>,
    ex2Answer: <>✅ 答え：数列6, 12, 20, 30, … の第15項は<strong className="text-yellow-300">272</strong>です。</>,
    colTerm: "項", colProduct: "積の形",
    ex3Title: "✏️ 例3 — 発展（図形のパターン）",
    ex3Problem: <>下の円の配置パターンを観察しなさい。<strong>パターン20の円の数</strong>を求めなさい！</>,
    circleUnit: "個", patternLabel: "パターン",
    ex3Step1: "ステップ1 — 各パターンを2数の積として表す：",
    ex3Step2: "ステップ2 — パターンを見つける：",
    ex3Step3: "ステップ3 — 一般式とn = 20の代入：",
    ex3ObserveRel: <><InlineMath math="n" />とその積の因数の関係を観察する：</>,
    ex3ColPattern: "パターン番号", ex3ColCircles: "円の数", ex3ColProduct: "積の形",
    ex3Pattern: <>パターン：第1の因数 = <InlineMath math="n" />、第2の因数 = <InlineMath math="(n+2)" /></>,
    ex3Answer: <>✅ 答え：パターン20の円の数は<strong className="text-yellow-300">440個</strong>です。</>,
    miniSummaryTitle: "📌 まとめ：数のパターン・数列と特殊パターン",
    miniSummaryItems: [
      ["数のパターン", "特定のルールに従った数の配列"],
      ["項", "数列の各メンバー・要素"],
      ["数列", "ルールに基づく順番に並んだ項の列"],
      ["級数", "数列の項の総和"],
      ["パターンを見つける方法", "差を確認 → 比を確認 → nとの関係を確認"],
      ["第n項の公式", "すべての項に適用される数学的表現 Uₙ = f(n)"],
    ],
    summaryTableColName: "パターン名", summaryTableColExample: "例", summaryTableColFormula: "公式 Uₙ",
    summaryTableRows: [
      ["偶数", "2, 4, 6, 8, ...", "2n"],
      ["奇数", "1, 3, 5, 7, ...", "2n − 1"],
      ["平方数", "1, 4, 9, 16, ...", "n²"],
      ["長方形数", "2, 6, 12, 20, ...", "n(n+1)"],
      ["三角数", "1, 3, 6, 10, ...", "n(n+1)/2"],
      ["パスカル（第n行の和）", "1, 2, 4, 8, 16, 32, ...", "2ⁿ⁻¹"],
      ["フィボナッチ", "1, 1, 2, 3, 5, ...", "Uₙ = Uₙ₋₁ + Uₙ₋₂"],
    ],
    tipBox: "💡 ヒント：見つけた公式を必ず最初の3項以上で検証しなさい。一致すれば、公式は正しいです！",
    finalSummaryHeader: "📖 完全まとめ",
    finalSummarySubheader: "数のパターン・数列と特殊パターン",
    conceptSection: "基本概念",
    conceptItems: [
      { label: "数のパターン", desc: "予測可能な特定のルールに従った数の配列", color: "from-cyan-900/60 to-cyan-800/30 border-cyan-500/40 text-cyan-200" },
      { label: "数列", desc: "順番に並んだパターンの項：U₁, U₂, U₃, ..., Uₙ", color: "from-violet-900/60 to-violet-800/30 border-violet-500/40 text-violet-200" },
      { label: "数列の総和（級数）", desc: "数列のすべての項の和：Sₙ = U₁ + U₂ + ... + Uₙ", color: "from-pink-900/60 to-pink-800/30 border-pink-500/40 text-pink-200" },
      { label: "第n項（Uₙ）", desc: "位置nの項の値を決定する一般式", color: "from-green-900/60 to-green-800/30 border-green-500/40 text-green-200" },
    ],
    specialSection: "7つの特殊パターン — 公式を覚えよう！",
    specialItems: [
      { nama: "偶数", rumus: "Uₙ = 2n", warna: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { nama: "奇数", rumus: "Uₙ = 2n − 1", warna: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
      { nama: "平方数", rumus: "Uₙ = n²", warna: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { nama: "長方形数", rumus: "Uₙ = n(n+1)", warna: "bg-green-900/50 border-green-500/40 text-green-200" },
      { nama: "三角数", rumus: "Uₙ = n(n+1)/2", warna: "bg-yellow-900/50 border-yellow-500/40 text-yellow-200" },
      { nama: "パスカル（第n行）", rumus: "合計 = 2ⁿ⁻¹", warna: "bg-pink-900/50 border-pink-500/40 text-pink-200" },
      { nama: "フィボナッチ", rumus: "Uₙ = Uₙ₋₁ + Uₙ₋₂", warna: "bg-teal-900/50 border-teal-500/40 text-teal-200" },
    ],
    tipsSection: "重要なヒントとコツ",
    tipsItems: [
      { tip: "まず隣り合う項の差を確認する", detail: "差が一定 → 等差数列。比が一定 → 等比数列。差が2倍ずつ → 段階的。", icon: "⚡", color: "bg-yellow-900/30 border-yellow-500/30" },
      { tip: "項をその位置と対応させる", detail: "項の値をnと結びつけてみる。第n項 = n²、n(n+1)、または2ⁿ？n=1, 2, 3で検証。", icon: "🔍", color: "bg-blue-900/30 border-blue-500/30" },
      { tip: "上の7つの特殊パターンを暗記する", detail: "試験問題は特殊パターンを変装させることが多い。公式を探す前にパターンを識別しよう。", icon: "🧠", color: "bg-green-900/30 border-green-500/30" },
      { tip: "最低3項で検証する", detail: "正しい公式はすべての項と一致しなければならない。1項や2項だけではダメ。", icon: "✅", color: "bg-violet-900/30 border-violet-500/30" },
    ],
    conclusionText: "この7つの特殊パターンは、数の裏に隠された美しさを見る窓です。各パターンを理解することで、問題をより速く解けるだけでなく、床のタイルから宇宙のパターンまで、至る所で数学を見始めることができます。頑張って！",
    conclusionTags: ["数のパターン", "数列", "級数", "特殊パターン", "フィボナッチ", "パスカル", "平方数"],
    backBtn: "← 数の規則性に戻る",
  },
};


const arcTerms = [
  [2, 4, 6, 8, 10, 12],
  [1, 3, 5, 7, 9, 11],
  [1, 4, 9, 16, 25, 36],
  [2, 6, 12, 20, 30, 42],
  [1, 3, 6, 10, 15, 21],
  [1, 2, 4, 8, 16, 32],
  [1, 1, 2, 3, 5, 8, 13],
];

const PengertianPolaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = translations[language];

  const prose = isDark ? "text-white/80" : "text-gray-700";
  const proseSm = isDark ? "text-white/60" : "text-gray-500";
  const box = isDark ? "bg-slate-800/50" : "bg-white/80 border border-gray-200";
  const boxAlt = isDark ? "bg-slate-800/60" : "bg-gray-50/90 border border-gray-200";

  const arcColors = isDark ? [
    { arcColor: "#22d3ee", labelColor: "#a5f3fc", bg: "bg-cyan-900/30 border-cyan-500/30", badge: "bg-cyan-500", labelClass: "" },
    { arcColor: "#fb923c", labelColor: "#fed7aa", bg: "bg-orange-900/30 border-orange-500/30", badge: "bg-orange-500", labelClass: "" },
    { arcColor: "#a78bfa", labelColor: "#ddd6fe", bg: "bg-violet-900/30 border-violet-500/30", badge: "bg-violet-500", labelClass: "" },
    { arcColor: "#4ade80", labelColor: "#bbf7d0", bg: "bg-green-900/30 border-green-500/30", badge: "bg-green-500", labelClass: "" },
    { arcColor: "#facc15", labelColor: "#fef08a", bg: "bg-yellow-900/30 border-yellow-500/30", badge: "bg-yellow-500", labelClass: "" },
    { arcColor: "#f472b6", labelColor: "#fbcfe8", bg: "bg-pink-900/30 border-pink-500/30", badge: "bg-pink-500", labelClass: "" },
    { arcColor: "#2dd4bf", labelColor: "#99f6e4", bg: "bg-teal-900/30 border-teal-500/30", badge: "bg-teal-500", labelClass: "" },
  ] : [
    { arcColor: "#0891b2", labelColor: "", bg: "bg-cyan-50 border-cyan-300", badge: "bg-cyan-600", labelClass: "text-cyan-800" },
    { arcColor: "#ea580c", labelColor: "", bg: "bg-orange-50 border-orange-300", badge: "bg-orange-500", labelClass: "text-orange-800" },
    { arcColor: "#7c3aed", labelColor: "", bg: "bg-violet-50 border-violet-300", badge: "bg-violet-600", labelClass: "text-violet-800" },
    { arcColor: "#16a34a", labelColor: "", bg: "bg-green-50 border-green-300", badge: "bg-green-600", labelClass: "text-green-800" },
    { arcColor: "#ca8a04", labelColor: "", bg: "bg-yellow-50 border-yellow-300", badge: "bg-yellow-500", labelClass: "text-yellow-800" },
    { arcColor: "#db2777", labelColor: "", bg: "bg-pink-50 border-pink-300", badge: "bg-pink-600", labelClass: "text-pink-800" },
    { arcColor: "#0d9488", labelColor: "", bg: "bg-teal-50 border-teal-300", badge: "bg-teal-600", labelClass: "text-teal-800" },
  ];

  const conceptItemColors = isDark ? [
    "from-cyan-900/60 to-cyan-800/30 border-cyan-500/40 text-cyan-200",
    "from-violet-900/60 to-violet-800/30 border-violet-500/40 text-violet-200",
    "from-pink-900/60 to-pink-800/30 border-pink-500/40 text-pink-200",
    "from-green-900/60 to-green-800/30 border-green-500/40 text-green-200",
  ] : [
    "from-cyan-50 to-cyan-100/60 border-cyan-400 text-cyan-800",
    "from-violet-50 to-violet-100/60 border-violet-400 text-violet-800",
    "from-pink-50 to-pink-100/60 border-pink-400 text-pink-800",
    "from-green-50 to-green-100/60 border-green-400 text-green-800",
  ];

  const specialItemColors = isDark ? [
    "bg-cyan-900/50 border-cyan-500/40 text-cyan-200",
    "bg-orange-900/50 border-orange-500/40 text-orange-200",
    "bg-violet-900/50 border-violet-500/40 text-violet-200",
    "bg-green-900/50 border-green-500/40 text-green-200",
    "bg-yellow-900/50 border-yellow-500/40 text-yellow-200",
    "bg-pink-900/50 border-pink-500/40 text-pink-200",
    "bg-teal-900/50 border-teal-500/40 text-teal-200",
  ] : [
    "bg-cyan-50 border-cyan-400 text-cyan-800",
    "bg-orange-50 border-orange-400 text-orange-800",
    "bg-violet-50 border-violet-400 text-violet-800",
    "bg-green-50 border-green-400 text-green-800",
    "bg-yellow-50 border-yellow-400 text-yellow-800",
    "bg-pink-50 border-pink-400 text-pink-800",
    "bg-teal-50 border-teal-400 text-teal-800",
  ];

  const tipsItemColors = isDark ? [
    "bg-yellow-900/30 border-yellow-500/30",
    "bg-blue-900/30 border-blue-500/30",
    "bg-green-900/30 border-green-500/30",
    "bg-violet-900/30 border-violet-500/30",
  ] : [
    "bg-yellow-50 border-yellow-300",
    "bg-blue-50 border-blue-300",
    "bg-green-50 border-green-300",
    "bg-violet-50 border-violet-300",
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.pageTitle}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.pageSubtitle}</p>
        <p className="text-muted-foreground text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── BAGIAN 1 ── */}
          <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl px-4 py-2">
            <p className={`font-display text-sm font-bold text-center uppercase tracking-widest ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>{t.sec1Banner}</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec1Title} />
            <div className="px-5 pb-5 space-y-4">
              <p className={`font-body text-sm leading-relaxed ${prose}`}>{t.sec1Body}</p>
              <figure className="flex flex-col items-center gap-2">
                <img src="/batik-sidomukti.png" alt="Batik Sidomukti" className="w-full max-w-sm rounded-xl border border-cyan-500/30 shadow-lg object-cover" />
                <figcaption className={`font-body text-xs italic text-center ${proseSm}`}>{t.figcaption}</figcaption>
              </figure>
              <div className={`${boxAlt} border border-cyan-500/20 rounded-xl p-4`}>
                <p className={`font-body text-xs font-bold uppercase mb-3 ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>{t.simplePatternsHeader}</p>
                <div className="grid grid-cols-1 gap-3 text-xs font-body">
                  <div className={`border rounded-lg px-3 py-2 ${isDark ? "bg-cyan-900/40 border-cyan-500/30" : "bg-cyan-50 border-cyan-300"}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold tracking-widest ${isDark ? "text-cyan-200" : "text-cyan-800"}`}>2, 4, 6, 8, 10, ...</span>
                      <span className={`ml-2 ${proseSm}`}>{t.addTwo}</span>
                    </div>
                    <svg viewBox="0 0 248 52" className="w-full">
                      {[2,4,6,8,10].map((n, i) => { const x = 24 + i * 48; return (<g key={i}><rect x={x-14} y={28} width={28} height={18} rx="3" fill={isDark ? "rgba(8,145,178,0.3)" : "rgba(8,145,178,0.15)"} stroke="#22d3ee" strokeWidth="0.9"/><text x={x} y={41} textAnchor="middle" fill={isDark ? "#a5f3fc" : "#164e63"} fontSize="11" fontFamily="monospace" fontWeight="bold">{n}</text></g>); })}
                      <text x={236} y={41} fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize="13" fontFamily="monospace">…</text>
                      {[0,1,2,3].map(i => { const x1 = 24 + i * 48 + 14; const x2 = 24 + (i+1)*48 - 14; const mx = (x1+x2)/2; return (<g key={i}><path d={`M ${x1},28 Q ${mx},10 ${x2},28`} fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="3,2"/><text x={mx} y={7} textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">+2</text></g>); })}
                    </svg>
                  </div>
                  <div className={`border rounded-lg px-3 py-2 ${isDark ? "bg-violet-900/40 border-violet-500/30" : "bg-violet-50 border-violet-300"}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold tracking-widest ${isDark ? "text-violet-200" : "text-violet-800"}`}>1, 4, 9, 16, 25, ...</span>
                      <span className={`ml-2 ${proseSm}`}>{t.squareNum}</span>
                    </div>
                    <svg viewBox="0 0 248 52" className="w-full">
                      {[1,4,9,16,25].map((n, i) => { const x = 24 + i * 48; return (<g key={i}><rect x={x-15} y={28} width={30} height={18} rx="3" fill={isDark ? "rgba(109,40,217,0.3)" : "rgba(109,40,217,0.12)"} stroke="#a855f7" strokeWidth="0.9"/><text x={x} y={41} textAnchor="middle" fill={isDark ? "#e9d5ff" : "#4c1d95"} fontSize="11" fontFamily="monospace" fontWeight="bold">{n}</text></g>); })}
                      <text x={236} y={41} fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize="13" fontFamily="monospace">…</text>
                      {["+3","+5","+7","+9"].map((d, i) => { const x1 = 24 + i * 48 + 15; const x2 = 24 + (i+1)*48 - 15; const mx = (x1+x2)/2; return (<g key={i}><path d={`M ${x1},28 Q ${mx},10 ${x2},28`} fill="none" stroke="#a855f7" strokeWidth="1.4" strokeDasharray="3,2"/><text x={mx} y={7} textAnchor="middle" fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold">{d}</text></g>); })}
                    </svg>
                  </div>
                  <div className={`border rounded-lg px-3 py-2 ${isDark ? "bg-green-900/40 border-green-500/30" : "bg-green-50 border-green-300"}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold tracking-widest ${isDark ? "text-green-200" : "text-green-800"}`}>3, 6, 12, 24, 48, ...</span>
                      <span className={`ml-2 ${proseSm}`}>{t.timesTwo}</span>
                    </div>
                    <svg viewBox="0 0 248 52" className="w-full">
                      {[3,6,12,24,48].map((n, i) => { const x = 24 + i * 48; return (<g key={i}><rect x={x-15} y={28} width={30} height={18} rx="3" fill={isDark ? "rgba(22,101,52,0.3)" : "rgba(22,101,52,0.12)"} stroke="#4ade80" strokeWidth="0.9"/><text x={x} y={41} textAnchor="middle" fill={isDark ? "#bbf7d0" : "#14532d"} fontSize="11" fontFamily="monospace" fontWeight="bold">{n}</text></g>); })}
                      <text x={236} y={41} fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fontSize="13" fontFamily="monospace">…</text>
                      {[0,1,2,3].map(i => { const x1 = 24 + i * 48 + 15; const x2 = 24 + (i+1)*48 - 15; const mx = (x1+x2)/2; return (<g key={i}><path d={`M ${x1},28 Q ${mx},10 ${x2},28`} fill="none" stroke="#4ade80" strokeWidth="1.4" strokeDasharray="3,2"/><text x={mx} y={7} textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold">×2</text></g>); })}
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className={`font-body text-sm ${isDark ? "text-yellow-200" : "text-yellow-800"}`}><strong>{t.whyImportant}</strong> {t.whyImportantBody}</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec2Title} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                <p className={`font-body text-sm font-semibold mb-2 ${isDark ? "text-violet-300" : "text-violet-700"}`}>{t.conceptSummaryTitle}</p>
                <p className={`font-body text-sm leading-relaxed ${prose}`}>{t.conceptSummaryBody}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-body border-collapse">
                  <thead>
                    <tr className={isDark ? "bg-violet-900/40" : "bg-violet-100"}>
                      <th className={`border px-3 py-2 text-left ${isDark ? "border-violet-500/30 text-violet-200" : "border-violet-300 text-violet-800"}`}>{t.tableCol1}</th>
                      <th className={`border px-3 py-2 text-left ${isDark ? "border-violet-500/30 text-violet-200" : "border-violet-300 text-violet-800"}`}>{t.tableCol2}</th>
                      <th className={`border px-3 py-2 text-left ${isDark ? "border-violet-500/30 text-violet-200" : "border-violet-300 text-violet-800"}`}>{t.tableCol3}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.tableRows.map(([term, def, sym], i) => (
                      <tr key={i} className={i % 2 === 0 ? (isDark ? "bg-slate-800/30" : "bg-gray-50") : (isDark ? "bg-slate-700/20" : "bg-white")}>
                        <td className={`border px-3 py-2 font-semibold ${isDark ? "border-white/10 text-cyan-300" : "border-gray-200 text-cyan-700"}`}>{term}</td>
                        <td className={`border px-3 py-2 ${isDark ? "border-white/10 text-white/70" : "border-gray-200 text-gray-600"}`}>{def}</td>
                        <td className={`border px-3 py-2 font-mono ${isDark ? "border-white/10 text-green-300" : "border-gray-200 text-green-700"}`}>{sym}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`${box} border border-white/10 rounded-xl p-4 space-y-3`}>
                <p className="font-body text-sm font-bold text-foreground">{t.findRuleHeader}</p>
                <div className="space-y-2 text-sm font-body">
                  {t.steps.map(({ step, label, desc }) => (
                    <div key={step} className={`border rounded-lg p-2 flex gap-3 ${isDark ? "border-cyan-500/30 bg-cyan-900/10" : "border-cyan-300 bg-cyan-50"}`}>
                      <span className={`font-display font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm ${isDark ? "text-white bg-white/10" : "text-gray-800 bg-gray-200"}`}>{step}</span>
                      <div>
                        <p className="text-foreground font-semibold">{label}</p>
                        <p className={`text-xs mt-0.5 ${proseSm}`}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── BAGIAN 2 ── */}
          <div className="bg-violet-500/10 border border-violet-500/40 rounded-xl px-4 py-2 mt-2">
            <p className="font-display text-sm font-bold text-violet-300 text-center uppercase tracking-widest">{t.sec2Banner}</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.specialTitle} />
            <div className="px-5 pb-5 space-y-3">
              <p className={`font-body text-sm leading-relaxed ${prose}`}>{t.specialBody}</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className={`font-body text-sm ${isDark ? "text-yellow-200" : "text-yellow-800"}`}><strong>{language === "id" ? "Fakta menarik:" : language === "en" ? "Interesting fact:" : "興味深い事実："}</strong> {t.factBox.replace(/^Fakta menarik:|^Interesting fact:|^興味深い事実：/, "").trim()}</p>
              </div>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Sparkles className="w-5 h-5" />} iconColor="text-violet-400" title={t.catalogTitle} />
            <div className="px-5 pb-5 space-y-4">
              {[0,1,2,3,4,5,6].map((idx) => {
                const ac = arcColors[idx];
                const terms = arcTerms[idx];
                const getDiffs = (t2: number[]) => t2.slice(1).map((v, i) => v - t2[i]);
                return (
                  <div key={idx} className={`${ac.bg} rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${ac.badge} text-white text-xs font-bold px-2 py-0.5 rounded`}>{idx + 1}</span>
                      <p className="font-body text-sm font-bold" style={{ color: ac.labelColor }}>{t.polaNames[idx]}</p>
                    </div>
                    <p className="font-body text-xs text-white/70 mb-2">{t.polaDescs[idx]}</p>
                    {idx === 5 && (
                      <>
                        <div className="flex flex-col items-center gap-1.5 my-3 font-mono text-xs">
                          {[
                            { row: [1], sum: 1, expanded: "1", power: "2⁰" },
                            { row: [1,1], sum: 2, expanded: "1+1", power: "2¹" },
                            { row: [1,2,1], sum: 4, expanded: "1+2+1", power: "2²" },
                            { row: [1,3,3,1], sum: 8, expanded: "1+3+3+1", power: "2³" },
                            { row: [1,4,6,4,1], sum: 16, expanded: "1+4+6+4+1", power: "2⁴" },
                            { row: [1,5,10,10,5,1], sum: 32, expanded: "1+5+10+10+5+1", power: "2⁵" },
                          ].map(({ row, sum, expanded, power }, ri) => (
                            <div key={ri} className="flex flex-col items-center gap-0.5">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {row.map((val, ci) => (<span key={ci} className="bg-pink-700/50 border border-pink-400/40 text-pink-200 font-bold rounded px-1.5 py-0.5 min-w-[22px] text-center text-xs">{val}</span>))}
                                </div>
                                <span className="text-white/30 text-[10px]">→</span>
                                <span className="text-pink-100 font-bold text-xs">{sum}</span>
                                <span className="text-white/30 text-[10px]">=</span>
                                <span className="text-amber-300 font-mono text-xs font-bold">{power}</span>
                              </div>
                              <p className="font-mono text-[10px] text-pink-300/55">= {expanded}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mb-3 space-y-1">
                          <p className="font-body text-xs text-white/70">{t.pascalRowSum} <strong className="text-pink-300">1, 2, 4, 8, 16, 32, ...</strong></p>
                          <p className="font-body text-xs text-white/70">{t.pascalDoubles}</p>
                          <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-2 mt-2">
                            <BlockMath math="\text{Sum of row }n = 2^{n-1}" />
                          </div>
                        </div>
                      </>
                    )}
                    <ArcPatternPanel
                      terms={terms}
                      arcColor={ac.arcColor}
                      labelColor={ac.labelColor}
                      getDifferences={getDiffs}
                      diffLabel={t.polaDiffLabels[idx]}
                      note={t.polaNotes[idx] as React.ReactNode}
                      isFibonacci={idx === 6}
                      language={language}
                    />
                    {idx === 6 && <p className="font-body text-xs text-white/60 mt-2">{t.fibNatureNote}</p>}
                    {idx === 0 && <BlockMath math="U_n = 2n \quad (n = 1, 2, 3, \ldots)" />}
                    {idx === 1 && <BlockMath math="U_n = 2n - 1 \quad (n = 1, 2, 3, \ldots)" />}
                    {idx === 2 && <BlockMath math="U_n = n^2 \quad \Rightarrow \quad 1, 4, 9, 16, 25, \ldots" />}
                    {idx === 3 && <BlockMath math="U_n = n(n+1) \quad \Rightarrow \quad 2, 6, 12, 20, 30, \ldots" />}
                    {idx === 4 && <BlockMath math="U_n = \frac{n(n+1)}{2} \quad \Rightarrow \quad 1, 3, 6, 10, 15, \ldots" />}
                    {idx === 5 && <BlockMath math="\text{Sum of row }n = 2^{n-1}" />}
                    {idx === 6 && <BlockMath math="U_n = U_{n-1} + U_{n-2} \quad (U_1 = U_2 = 1)" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1Title} />
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
                    <p className="text-cyan-300 font-semibold mb-2">{t.ex1Identify}</p>
                    <div className="overflow-x-auto mb-2">
                      <table className="text-xs border-collapse">
                        <thead><tr className="bg-green-900/40"><th className="border border-green-500/30 px-3 py-1 text-green-200">n</th>{[1,2,3,4,12].map(n => <th key={n} className="border border-green-500/30 px-3 py-1 text-green-200">{n}</th>)}</tr></thead>
                        <tbody><tr className="bg-slate-800/30"><td className="border border-white/10 px-3 py-1 text-white/60">Uₙ</td>{[1,4,9,16,"?"].map((v, i) => <td key={i} className={`border border-white/10 px-3 py-1 text-center font-bold ${v === "?" ? "text-yellow-300" : "text-green-200"}`}>{v}</td>)}</tr></tbody>
                      </table>
                    </div>
                    <p className="text-white/70 mb-1">{t.ex1EachTerm}</p>
                    <BlockMath math="1 = 1^2,\quad 4 = 2^2,\quad 9 = 3^2,\quad 16 = 4^2" />
                    <p className="text-cyan-300 font-semibold mb-1">{t.ex1FormulaLabel}</p>
                    <BlockMath math="U_n = n^2" />
                    <p className="text-cyan-300 font-semibold mb-1">{t.ex1SubstLabel}</p>
                    <BlockMath math="U_{12} = 12^2 = 144" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">{t.ex1Answer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2Title} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeMedium} color="bg-yellow-700/60 text-yellow-200" />
              <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85">{t.ex2Problem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">{t.ex2Step1}</p>
                    <div className="overflow-x-auto">
                      <table className="text-xs border-collapse w-full">
                        <thead><tr className="bg-yellow-900/40"><th className="border border-yellow-500/30 px-3 py-1 text-yellow-200">n</th><th className="border border-yellow-500/30 px-3 py-1 text-yellow-200">{t.colTerm}</th><th className="border border-yellow-500/30 px-3 py-1 text-yellow-200">{t.colProduct}</th></tr></thead>
                        <tbody>
                          {[[1,6,"2 × 3"],[2,12,"3 × 4"],[3,20,"4 × 5"],[4,30,"5 × 6"]].map(([n,u,bentuk]) => (
                            <tr key={String(n)} className="bg-slate-800/30">
                              <td className="border border-white/10 px-3 py-1 text-center text-white/60">{n}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-yellow-200 font-bold">{u}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-cyan-300 font-mono">{bentuk}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2">{t.ex2Step2}</p>
                    <p className="text-white/70 mb-2">{t.ex2ObserveRel}</p>
                    <BlockMath math="6 = 2 \times 3 = (1+1)(1+2)" />
                    <BlockMath math="12 = 3 \times 4 = (2+1)(2+2)" />
                    <BlockMath math="20 = 4 \times 5 = (3+1)(3+2)" />
                    <p className="text-green-300 font-semibold mt-2">{t.ex2Pattern}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">{t.ex2Step3}</p>
                    <BlockMath math="U_n = (n+1)(n+2)" />
                    <BlockMath math="U_{15} = (15+1)(15+2) = 16 \times 17 = 272" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">{t.ex2Answer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3Title} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeHard} color="bg-red-700/60 text-red-200" />
              <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85 mb-3">{t.ex3Problem}</p>
                <div className="flex gap-5 flex-wrap justify-center items-end">
                  {[{pola:1,rows:1,cols:3},{pola:2,rows:2,cols:4},{pola:3,rows:3,cols:5}].map(({ pola, rows, cols }) => (
                    <div key={pola} className="text-center">
                      <div className="inline-flex flex-col gap-0.5 mb-1">
                        {Array.from({ length: rows }).map((_, ri) => (
                          <div key={ri} className="flex gap-0.5">
                            {Array.from({ length: cols }).map((_, ci) => (<div key={ci} className="w-4 h-4 rounded-full border-2 border-red-300/70 bg-red-950/60" />))}
                          </div>
                        ))}
                      </div>
                      <p className="text-red-200 text-xs font-bold">{rows * cols} {t.circleUnit}</p>
                      <p className="text-red-400 text-[10px]">{t.patternLabel}{pola}</p>
                    </div>
                  ))}
                  <span className="text-white/40 self-center text-lg">...</span>
                </div>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">{t.ex3Step1}</p>
                    <div className="overflow-x-auto">
                      <table className="text-xs border-collapse w-full">
                        <thead><tr className="bg-red-900/40"><th className="border border-red-500/30 px-3 py-1 text-red-200">{t.ex3ColPattern}</th><th className="border border-red-500/30 px-3 py-1 text-red-200">{t.ex3ColCircles}</th><th className="border border-red-500/30 px-3 py-1 text-red-200">{t.ex3ColProduct}</th></tr></thead>
                        <tbody>
                          {[[1,3,"1 × 3"],[2,8,"2 × 4"],[3,15,"3 × 5"],[4,24,"4 × 6"]].map(([n,u,bentuk]) => (
                            <tr key={String(n)} className="bg-slate-800/30">
                              <td className="border border-white/10 px-3 py-1 text-center text-white/60">{n}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-red-200 font-bold">{u}</td>
                              <td className="border border-white/10 px-3 py-1 text-center text-cyan-300 font-mono">{bentuk}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2">{t.ex3Step2}</p>
                    <p className="text-white/70 mb-2">{t.ex3ObserveRel}</p>
                    <BlockMath math="3 = 1 \times 3 = 1 \times (1+2)" />
                    <BlockMath math="8 = 2 \times 4 = 2 \times (2+2)" />
                    <BlockMath math="15 = 3 \times 5 = 3 \times (3+2)" />
                    <p className="text-green-300 font-semibold mt-2">{t.ex3Pattern}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">{t.ex3Step3}</p>
                    <BlockMath math="U_n = n(n+2)" />
                    <BlockMath math="U_{20} = 20 \times (20+2) = 20 \times 22 = 440" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">{t.ex3Answer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MINI SUMMARY */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.miniSummaryTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className={`${isDark ? "bg-cyan-500/10 border-cyan-500/30" : "bg-cyan-50 border-cyan-300"} border rounded-lg p-4 space-y-2 text-sm font-body`}>
                {t.miniSummaryItems.map(([term, def]) => (
                  <div key={term} className="flex gap-2">
                    <span className={`${isDark ? "text-cyan-400" : "text-cyan-600"} shrink-0`}>▸</span>
                    <p className={prose}><strong className={isDark ? "text-cyan-300" : "text-cyan-700"}>{term}:</strong> {def}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-body border-collapse">
                  <thead>
                    <tr className={isDark ? "bg-cyan-900/40" : "bg-cyan-100"}>
                      <th className={`border ${isDark ? "border-cyan-500/30 text-cyan-200" : "border-cyan-300 text-cyan-800"} px-3 py-2 text-left`}>{t.summaryTableColName}</th>
                      <th className={`border ${isDark ? "border-cyan-500/30 text-cyan-200" : "border-cyan-300 text-cyan-800"} px-3 py-2 text-left`}>{t.summaryTableColExample}</th>
                      <th className={`border ${isDark ? "border-cyan-500/30 text-cyan-200" : "border-cyan-300 text-cyan-800"} px-3 py-2 text-left`}>{t.summaryTableColFormula}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.summaryTableRows.map(([nama, contoh, rumus], i) => (
                      <tr key={i} className={i % 2 === 0 ? (isDark ? "bg-slate-800/30" : "bg-gray-50") : (isDark ? "bg-slate-700/20" : "bg-white")}>
                        <td className={`border ${isDark ? "border-white/10 text-cyan-300" : "border-gray-200 text-cyan-700"} px-3 py-2 font-semibold`}>{nama}</td>
                        <td className={`border ${isDark ? "border-white/10 text-white/60" : "border-gray-200 text-gray-500"} px-3 py-2 font-mono`}>{contoh}</td>
                        <td className={`border ${isDark ? "border-white/10 text-green-300" : "border-gray-200 text-green-700"} px-3 py-2 font-mono`}>{rumus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`${isDark ? "bg-yellow-500/10 border-yellow-500/30" : "bg-yellow-50 border-yellow-300"} border rounded-lg p-3`}>
                <p className={`font-body text-xs ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>{t.tipBox}</p>
              </div>
            </div>
          </div>

          {/* FINAL RANGKUMAN */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{t.finalSummaryHeader}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{t.finalSummarySubheader}</p>
            </div>
            <div className={`${isDark ? "bg-slate-900/90" : "bg-white/95"} backdrop-blur px-5 py-5 space-y-5`}>
              <div className="space-y-2">
                <p className={`font-body text-xs font-bold ${isDark ? "text-cyan-300" : "text-cyan-700"} uppercase tracking-widest flex items-center gap-2`}>
                  <span className={`w-5 h-5 rounded-full ${isDark ? "bg-cyan-500/30 border-cyan-500" : "bg-cyan-100 border-cyan-400"} border flex items-center justify-center text-[10px]`}>1</span>
                  {t.conceptSection}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {t.conceptItems.map(({ label, desc }, idx) => (
                    <div key={label} className={`bg-gradient-to-r ${conceptItemColors[idx]} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-current shrink-0 opacity-70" />
                      <div>
                        <p className="font-body text-xs font-bold">{label}</p>
                        <p className={`font-body text-xs mt-0.5 ${isDark ? "text-white/65" : "text-gray-600"}`}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className={`font-body text-xs font-bold ${isDark ? "text-violet-300" : "text-violet-700"} uppercase tracking-widest flex items-center gap-2`}>
                  <span className={`w-5 h-5 rounded-full ${isDark ? "bg-violet-500/30 border-violet-500" : "bg-violet-100 border-violet-400"} border flex items-center justify-center text-[10px]`}>2</span>
                  {t.specialSection}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {t.specialItems.map(({ nama, rumus }, idx) => (
                    <div key={nama} className={`border ${specialItemColors[idx]} rounded-xl px-3 py-2 text-center`}>
                      <p className="font-body text-xs font-bold">{nama}</p>
                      <p className={`font-mono text-[11px] mt-0.5 ${isDark ? "text-white/70" : "text-gray-600"}`}>{rumus}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className={`font-body text-xs font-bold ${isDark ? "text-yellow-300" : "text-yellow-700"} uppercase tracking-widest flex items-center gap-2`}>
                  <span className={`w-5 h-5 rounded-full ${isDark ? "bg-yellow-500/30 border-yellow-500" : "bg-yellow-100 border-yellow-400"} border flex items-center justify-center text-[10px]`}>3</span>
                  {t.tipsSection}
                </p>
                <div className="space-y-2">
                  {t.tipsItems.map(({ tip, detail, icon }, idx) => (
                    <div key={tip} className={`${tipsItemColors[idx]} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className={`font-body text-xs font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{tip}</p>
                        <p className={`font-body text-xs mt-0.5 leading-relaxed ${isDark ? "text-white/60" : "text-gray-600"}`}>{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${isDark ? "bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-pink-500/20 border-white/20" : "bg-gradient-to-br from-cyan-50 via-violet-50 to-pink-50 border-violet-200"} border rounded-2xl p-5 text-center space-y-3`}>
                <div className="text-3xl">🌌</div>
                <p className={`font-body text-sm leading-relaxed ${isDark ? "text-white/80" : "text-gray-700"}`}>{t.conclusionText}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {t.conclusionTags.map(tag => (
                    <span key={tag} className={`${isDark ? "bg-white/10 border-white/20 text-white/80" : "bg-white border-violet-200 text-gray-700"} border text-xs font-body px-3 py-1 rounded-full`}>{tag}</span>
                  ))}
                </div>
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

export default PengertianPolaPage;
