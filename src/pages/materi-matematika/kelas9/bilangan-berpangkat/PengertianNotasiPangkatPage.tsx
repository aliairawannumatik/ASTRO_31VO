import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, AlertTriangle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// ─── Translations ────────────────────────────────────────────────────────────
const translations = {
  id: {
    pageTitle: "PENGERTIAN DAN NOTASI PANGKAT",
    pageSub: "Kelas 9 · Bilangan Berpangkat · Materi Matematika",
    // BacteriaAnimation
    animBadge: "🎬 Animasi Interaktif",
    animTitle: "Pembelahan Kuman & Notasi Pangkat",
    splitting: "⚗️ Sedang membelah…",
    btnBusy: "⏳ Membelah…",
    btnReset: "🔄 Ulangi dari awal",
    btnSplit: (a: number, b: number) => `🦠 Tekan untuk membelah! (${a} → ${b})`,
    tipMax: "Sudah 2⁵ = 32 kuman! Lihat betapa cepatnya berkembang biak? 🤯",
    tipBusy: "Perhatikan pembelahan sel secara slow-motion…",
    tipNormal: "Klik kuman atau tombol untuk melihat pembelahan selanjutnya",
    // Intro section
    beforeStart: "Sebelum Mulai Belajar…",
    heroTitle: "🦠 Yuk, Amati Kuman Ini Membelah Diri!",
    heroDesc: "Tekan tombol di bawah dan perhatikan apa yang terjadi — ada pola matematika tersembunyi di sini!",
    sec_intro: "🚀 Perkalian Berulang? Ada Cara Lebih Cepatnya!",
    intro_p1_before: "Tadi kamu sudah melihat animasi kuman yang membelah diri — dari",
    intro_p1_mid1: "kuman menjadi",
    intro_p1_mid2: "lalu",
    intro_p1_mid3: "hingga",
    intro_p1_after: "hanya dalam beberapa langkah. Coba bayangkan kalau kamu harus menuliskan perkaliannya secara manual sampai generasi ke-10:",
    intro_p1_suffix: "— panjang dan melelahkan, kan?",
    intro_highlight: "Inilah alasan kenapa matematika punya",
    intro_highlight2: "! Pembelahan kuman sampai generasi ke-10 cukup ditulis",
    intro_highlight3: "saja. Satu simbol kecil, makna yang besar! 🌟",
    notasiPangkat: "notasi pangkat",
    intro_funfact_bold: "Tahukah kamu?",
    intro_funfact: "Pembelahan sel bakteri nyata di alam mengikuti pola",
    intro_funfact2: "ini — itulah mengapa infeksi bakteri bisa menyebar sangat cepat jika tidak ditangani! Notasi pangkat membantu para ilmuwan menghitung dan memprediksinya.",
    // Sub-bab 1
    sec_konsep1: "📘 Sub-Bab 1: Pengertian Bilangan Berpangkat",
    badge_intisari: "🎯 Ringkasan Intisari",
    konsep1_def: "adalah cara singkat menuliskan perkalian berulang dari bilangan yang sama. Secara umum, bentuknya ditulis sebagai:",
    bilBerpangkat: "Bilangan berpangkat",
    konsep1_basis: "Bilangan Pokok (Basis)",
    konsep1_basis_desc: "adalah bilangan yang dikalikan berulang-ulang.",
    konsep1_eksponen: "Pangkat (Eksponen)",
    konsep1_eksponen_desc: "menunjukkan berapa kali basis dikalikan dengan dirinya sendiri.",
    konsep1_syarat: "Syarat:",
    konsep1_syarat_desc: "Pada definisi ini,",
    konsep1_syarat_desc2: "adalah bilangan bulat positif dan",
    anatomi_label: "🔍 ANATOMI NOTASI PANGKAT:",
    basis_label: "BASIS (5)",
    basis_sub: "Bilangan Pokok",
    eksponen_label: "EKSPONEN (3)",
    eksponen_sub: "Pangkat",
    read_as: "Dibaca: "lima pangkat tiga" atau "lima kubik"",
    tip_squared: "Tips:",
    tip_squared_text: "Pangkat 2 biasa disebut",
    tip_squared_kuadrat: ""kuadrat"",
    tip_squared_and: "dan pangkat 3 disebut",
    tip_squared_kubik: ""kubik"",
    tip_squared_suffix: ". Jadi",
    tip_squared_suffix2: "dibaca "tujuh kuadrat" dan",
    tip_squared_suffix3: "dibaca "empat kubik".",
    // Contoh 1
    sec_contoh1: "📝 Contoh Soal — Pengertian Bilangan Berpangkat",
    ex1_easy_q: "Nyatakan perkalian berulang",
    ex1_easy_q2: "dalam bentuk notasi pangkat, lalu sebutkan basis dan eksponenya!",
    step: "Langkah",
    ex1_s1: "Hitung berapa kali angka 7 muncul → sebanyak",
    ex1_s1b: "4 kali",
    ex1_s2: "Tulis dalam notasi pangkat:",
    ex1_s3: "Identifikasi unsur-unsurnya:",
    ex1_basis_val: "Basis (bilangan pokok) =",
    ex1_eks_val: "Eksponen (pangkat) =",
    ex1_nilai: "Nilai:",
    ex1_med_q: "Sebuah kubus memiliki panjang rusuk",
    ex1_med_q2: "cm. Hitunglah volume kubus tersebut dan nyatakan dalam notasi pangkat!",
    ex1_med_s1: "Gunakan rumus volume kubus:",
    ex1_med_s2: "Substitusi",
    ex1_med_s2b: "cm:",
    ex1_med_s3: "Notasi pangkat",
    ex1_med_s3b: "artinya:",
    ex1_med_s3c: "eksponen =",
    ex1_hard_q: "Sebuah bakteri membelah diri menjadi 2 setiap jam. Jika awalnya ada 1 bakteri, berapa banyak bakteri setelah 8 jam? Nyatakan jawabanmu menggunakan notasi pangkat!",
    ex1_h_s1: "Perhatikan polanya:",
    jam: "Jam ke-",
    bacteria: "bakteri",
    andSoon: "... dan seterusnya",
    ex1_h_s2: "Setelah",
    ex1_h_s2b: "jam, jumlah bakteri =",
    ex1_h_s3: "Untuk",
    ex1_h_ans: "Setelah 8 jam, terdapat 256 bakteri.",
    // Sub-bab 2
    sec_konsep2: "📘 Sub-Bab 2: Bilangan Bulat dan Pecahan Berpangkat",
    konsep2_intro: "Notasi pangkat tidak hanya berlaku untuk bilangan bulat positif. Basis",
    konsep2_intro2: "bisa berupa bilangan bulat apa pun (termasuk nol dan negatif) maupun bilangan pecahan.",
    konsep2_int_label: "Bilangan Bulat Berpangkat:",
    konsep2_int_note: "Berlaku untuk semua bilangan bulat",
    konsep2_int_note2: "dan",
    konsep2_frac_label: "Pecahan Berpangkat:",
    konsep2_frac_note: "Basis berupa pecahan → pembilang dan penyebut masing-masing dipangkatkan!",
    tip_frac: "Tips:",
    tip_frac_text: "Pecahan berpangkat caranya mudah — pangkatkan pembilang dan penyebutnya secara terpisah! Misalnya:",
    // Contoh 2
    sec_contoh2: "📝 Contoh Soal — Bilangan Bulat & Pecahan Berpangkat",
    ex2_easy_q: "Hitunglah:",
    ex2_med_q: "Hitunglah:",
    ex2_hard_q: "Sederhanakan:",
    ex2_s_expand: "Ekspansi langsung dari definisi:",
    ex2_s_frac: "Gunakan rumus pecahan berpangkat:",
    ex2_s_separate: "Pangkatkan pembilang dan penyebut secara terpisah:",
    ex2_hard_s1: "Tulis sebagai perkalian berulang:",
    ex2_hard_s2: "Ubah ke pecahan pangkat:",
    ex2_hard_ans: "Hasil:",
    // Sub-bab 3: pangkat 0
    sec_konsep3: "📘 Sub-Bab 3: Pangkat Nol dan Pangkat Negatif",
    konsep3_intro: "adalah suatu bilangan yang dipangkatkan dengan",
    pangkatNol: "Pangkat nol",
    konsep3_def_zero: "Bilangan apa pun (kecuali nol) yang dipangkatkan nol hasilnya adalah 1:",
    konsep3_proof_title: "🔍 BUKTI LEWAT POLA PEMBAGIAN:",
    konsep3_proof_note: "Setiap turun satu pangkat, nilainya dibagi 2 → maka",
    konsep3_neg_def: "Pangkat negatif adalah kebalikan (invers perkalian) dari pangkat positif:",
    konsep3_neg_proof: "🔍 ASAL USUL PANGKAT NEGATIF:",
    konsep3_neg_from_zero: "Dari definisi pangkat nol dan sifat pembagian:",
    tip_zero: "Catatan Penting:",
    tip_zero_text: "tidak terdefinisi! Hanya",
    tip_zero_text2: "jika",
    // Boxes for even/odd exponents
    evenExp_title: "Pangkat GENAP",
    evenExp_note: "n = genap (2, 4, 6, …) → hasil selalu positif",
    oddExp_title: "Pangkat GANJIL",
    oddExp_note: "n = ganjil (1, 3, 5, …) → hasil selalu negatif",
    // Contoh 3
    sec_contoh3: "📝 Contoh Soal — Pangkat Nol & Negatif",
    ex3_easy_q: "Hitunglah:",
    ex3_med_q1: "Sederhanakan:",
    ex3_hard_q: "Tentukan nilai",
    ex3_hard_q2: "jika",
    ex3_note_positive: "pangkat genap → positif",
    ex3_note_negative: "pangkat ganjil → negatif",
    ex3_note_not: "bukan",
    // Sub-bab 4: pangkat campuran
    sec_konsep4: "📘 Sub-Bab 4: Sifat Dasar Pangkat — Ringkasan",
    konsep4_intro: "Sebelum masuk ke operasi pangkat yang lebih kompleks, mari kita ringkas sifat-sifat dasar yang telah kita pelajari:",
    rangkuman_label: "📊 RANGKUMAN SIFAT DASAR:",
    col_sifat: "Sifat",
    col_rumus: "Rumus",
    col_keterangan: "Keterangan",
    row1_sifat: "Perkalian berulang",
    row1_ket: "Definisi dasar",
    row2_sifat: "Pangkat nol",
    row2_ket: "Selalu = 1 (a ≠ 0)",
    row3_sifat: "Pangkat negatif",
    row3_ket: "Kebalikan / invers",
    row4_sifat: "Pecahan berpangkat",
    row4_ket: "Distribusi ke pembilang & penyebut",
    // Contoh 4
    sec_contoh4: "📝 Contoh Soal — Gabungan Konsep",
    ex4_easy_q: "Hitunglah nilai dari:",
    ex4_med_q: "Sederhanakan:",
    ex4_hard_q: "Jika",
    ex4_hard_q2: ", tentukan nilai",
    ex4_hard_q3: "dan hitunglah",
    ex4_s_combine: "Gabungkan semua konsep:",
    // Difficulty badges
    diff_easy: "MUDAH",
    diff_med: "SEDANG",
    diff_hard: "SULIT",
    pembahasan: "PEMBAHASAN:",
    example: "Contoh",
  },
  en: {
    pageTitle: "INTRODUCTION TO EXPONENTS & NOTATION",
    pageSub: "Grade 9 · Exponents & Powers · Math Materials",
    animBadge: "🎬 Interactive Animation",
    animTitle: "Bacteria Division & Exponential Notation",
    splitting: "⚗️ Splitting…",
    btnBusy: "⏳ Splitting…",
    btnReset: "🔄 Restart from beginning",
    btnSplit: (a: number, b: number) => `🦠 Press to split! (${a} → ${b})`,
    tipMax: "Already 2⁵ = 32 bacteria! See how fast they multiply? 🤯",
    tipBusy: "Watch the cell division in slow-motion…",
    tipNormal: "Click a bacterium or the button to see the next split",
    beforeStart: "Before We Begin…",
    heroTitle: "🦠 Watch These Bacteria Divide!",
    heroDesc: "Press the button below and observe what happens — there's a hidden math pattern here!",
    sec_intro: "🚀 Repeated Multiplication? There's a Faster Way!",
    intro_p1_before: "You just saw the bacteria animation — from",
    intro_p1_mid1: "bacterium to",
    intro_p1_mid2: "then",
    intro_p1_mid3: "all the way to",
    intro_p1_after: "in just a few steps. Imagine writing out the multiplication manually up to generation 10:",
    intro_p1_suffix: "— long and tedious, right?",
    intro_highlight: "This is exactly why math invented",
    intro_highlight2: "! Bacteria division up to generation 10 is simply written as",
    intro_highlight3: ". One small symbol, big meaning! 🌟",
    notasiPangkat: "exponential notation",
    intro_funfact_bold: "Did you know?",
    intro_funfact: "Real bacterial cell division in nature follows the pattern",
    intro_funfact2: "— that's why bacterial infections can spread incredibly fast if untreated! Exponential notation helps scientists calculate and predict it.",
    sec_konsep1: "📘 Section 1: What Are Exponents?",
    badge_intisari: "🎯 Key Summary",
    konsep1_def: "is a shorthand way to write repeated multiplication of the same number. The general form is:",
    bilBerpangkat: "An exponent",
    konsep1_basis: "Base",
    konsep1_basis_desc: "is the number being multiplied repeatedly.",
    konsep1_eksponen: "Exponent (Power)",
    konsep1_eksponen_desc: "tells how many times the base is multiplied by itself.",
    konsep1_syarat: "Condition:",
    konsep1_syarat_desc: "In this definition,",
    konsep1_syarat_desc2: "is a positive integer and",
    anatomi_label: "🔍 ANATOMY OF EXPONENTIAL NOTATION:",
    basis_label: "BASE (5)",
    basis_sub: "The repeated factor",
    eksponen_label: "EXPONENT (3)",
    eksponen_sub: "Power",
    read_as: "Read as: "five to the power of three" or "five cubed"",
    tip_squared: "Tip:",
    tip_squared_text: "A power of 2 is called",
    tip_squared_kuadrat: ""squared"",
    tip_squared_and: "and a power of 3 is called",
    tip_squared_kubik: ""cubed"",
    tip_squared_suffix: ". So",
    tip_squared_suffix2: "is read "seven squared" and",
    tip_squared_suffix3: "is read "four cubed".",
    sec_contoh1: "📝 Practice Problems — Introduction to Exponents",
    ex1_easy_q: "Express the repeated multiplication",
    ex1_easy_q2: "in exponential notation, then identify the base and exponent!",
    step: "Step",
    ex1_s1: "Count how many times 7 appears →",
    ex1_s1b: "4 times",
    ex1_s2: "Write in exponential notation:",
    ex1_s3: "Identify the parts:",
    ex1_basis_val: "Base =",
    ex1_eks_val: "Exponent =",
    ex1_nilai: "Value:",
    ex1_med_q: "A cube has edge length",
    ex1_med_q2: "cm. Calculate its volume and express it using exponential notation!",
    ex1_med_s1: "Use the volume formula for a cube:",
    ex1_med_s2: "Substitute",
    ex1_med_s2b: "cm:",
    ex1_med_s3: "Exponential notation",
    ex1_med_s3b: "means:",
    ex1_med_s3c: "exponent =",
    ex1_hard_q: "A bacterium splits into 2 every hour. Starting with 1 bacterium, how many are there after 8 hours? Express your answer using exponential notation!",
    ex1_h_s1: "Observe the pattern:",
    jam: "Hour",
    bacteria: "bacteria",
    andSoon: "... and so on",
    ex1_h_s2: "After",
    ex1_h_s2b: "hours, number of bacteria =",
    ex1_h_s3: "For",
    ex1_h_ans: "After 8 hours, there are 256 bacteria.",
    sec_konsep2: "📘 Section 2: Integer & Fraction Bases",
    konsep2_intro: "Exponential notation applies beyond positive integers. Base",
    konsep2_intro2: "can be any integer (including zero and negatives) or a fraction.",
    konsep2_int_label: "Integer Base:",
    konsep2_int_note: "Valid for all integers",
    konsep2_int_note2: "and",
    konsep2_frac_label: "Fraction Base:",
    konsep2_frac_note: "Fraction base → raise numerator and denominator separately!",
    tip_frac: "Tip:",
    tip_frac_text: "Fraction powers are easy — raise the numerator and denominator separately! For example:",
    sec_contoh2: "📝 Practice Problems — Integer & Fraction Bases",
    ex2_easy_q: "Calculate:",
    ex2_med_q: "Calculate:",
    ex2_hard_q: "Simplify:",
    ex2_s_expand: "Expand using the definition:",
    ex2_s_frac: "Use the fraction power formula:",
    ex2_s_separate: "Raise numerator and denominator separately:",
    ex2_hard_s1: "Write as repeated multiplication:",
    ex2_hard_s2: "Convert to fraction power:",
    ex2_hard_ans: "Result:",
    sec_konsep3: "📘 Section 3: Zero & Negative Exponents",
    konsep3_intro: "is a number raised to the power of",
    pangkatNol: "A zero exponent",
    konsep3_def_zero: "Any non-zero number raised to the power of zero equals 1:",
    konsep3_proof_title: "🔍 PROOF VIA DIVISION PATTERN:",
    konsep3_proof_note: "Each step down divides by 2 → therefore",
    konsep3_neg_def: "A negative exponent is the multiplicative inverse of a positive exponent:",
    konsep3_neg_proof: "🔍 ORIGIN OF NEGATIVE EXPONENTS:",
    konsep3_neg_from_zero: "From the zero exponent definition and division property:",
    tip_zero: "Important Note:",
    tip_zero_text: "is undefined! Only",
    tip_zero_text2: "when",
    evenExp_title: "EVEN Exponent",
    evenExp_note: "n = even (2, 4, 6, …) → result always positive",
    oddExp_title: "ODD Exponent",
    oddExp_note: "n = odd (1, 3, 5, …) → result always negative",
    sec_contoh3: "📝 Practice Problems — Zero & Negative Exponents",
    ex3_easy_q: "Calculate:",
    ex3_med_q1: "Simplify:",
    ex3_hard_q: "Find",
    ex3_hard_q2: "if",
    ex3_note_positive: "even exponent → positive",
    ex3_note_negative: "odd exponent → negative",
    ex3_note_not: "not",
    sec_konsep4: "📘 Section 4: Basic Exponent Properties — Summary",
    konsep4_intro: "Before moving to more complex operations, let's summarise the basic properties we've learned:",
    rangkuman_label: "📊 SUMMARY OF BASIC PROPERTIES:",
    col_sifat: "Property",
    col_rumus: "Formula",
    col_keterangan: "Notes",
    row1_sifat: "Repeated multiplication",
    row1_ket: "Basic definition",
    row2_sifat: "Zero exponent",
    row2_ket: "Always = 1 (a ≠ 0)",
    row3_sifat: "Negative exponent",
    row3_ket: "Reciprocal / inverse",
    row4_sifat: "Fraction base",
    row4_ket: "Distribute to numerator & denominator",
    sec_contoh4: "📝 Practice Problems — Mixed Concepts",
    ex4_easy_q: "Calculate the value of:",
    ex4_med_q: "Simplify:",
    ex4_hard_q: "If",
    ex4_hard_q2: ", find",
    ex4_hard_q3: "and calculate",
    ex4_s_combine: "Combine all concepts:",
    diff_easy: "EASY",
    diff_med: "MEDIUM",
    diff_hard: "HARD",
    pembahasan: "SOLUTION:",
    example: "Example",
  },
  ja: {
    pageTitle: "累乗の概念と表記",
    pageSub: "中学3年 · 累乗・指数 · 数学教材",
    animBadge: "🎬 インタラクティブアニメーション",
    animTitle: "細菌分裂と指数表記",
    splitting: "⚗️ 分裂中…",
    btnBusy: "⏳ 分裂中…",
    btnReset: "🔄 最初からやり直す",
    btnSplit: (a: number, b: number) => `🦠 分裂させよう！(${a} → ${b})`,
    tipMax: "2⁵ = 32個の細菌になった！こんなに速く増えるんだ！ 🤯",
    tipBusy: "スローモーションで細胞分裂を見てみよう…",
    tipNormal: "細菌またはボタンをクリックして次の分裂を見よう",
    beforeStart: "学習の前に…",
    heroTitle: "🦠 細菌の分裂を観察しよう！",
    heroDesc: "下のボタンを押して何が起きるか観察しよう — ここに隠れた数学のパターンがある！",
    sec_intro: "🚀 繰り返しの掛け算？もっと速い方法がある！",
    intro_p1_before: "今、細菌が分裂するアニメーションを見た — ",
    intro_p1_mid1: "個から",
    intro_p1_mid2: "個、そして",
    intro_p1_mid3: "個まで",
    intro_p1_after: "数ステップで増えた。第10世代まで手で掛け算を書くと：",
    intro_p1_suffix: "— 長くて大変だよね？",
    intro_highlight: "だから数学には",
    intro_highlight2: "がある！第10世代の細菌数は",
    intro_highlight3: "と書けばいい。小さな記号に大きな意味！ 🌟",
    notasiPangkat: "指数表記",
    intro_funfact_bold: "知ってた？",
    intro_funfact: "自然界の細菌の細胞分裂は",
    intro_funfact2: "のパターンに従う — だから細菌感染は放置するとあっという間に広がる！指数表記で科学者が計算・予測できる。",
    sec_konsep1: "📘 第1節：累乗とは何か？",
    badge_intisari: "🎯 要点まとめ",
    konsep1_def: "は同じ数を繰り返し掛け合わせる省略記法です。一般的な形：",
    bilBerpangkat: "累乗",
    konsep1_basis: "底（ベース）",
    konsep1_basis_desc: "繰り返し掛ける数。",
    konsep1_eksponen: "指数（べき）",
    konsep1_eksponen_desc: "底を何回掛け合わせるかを示す数。",
    konsep1_syarat: "条件：",
    konsep1_syarat_desc: "この定義では",
    konsep1_syarat_desc2: "は正の整数で",
    anatomi_label: "🔍 指数表記の構造：",
    basis_label: "底（5）",
    basis_sub: "繰り返す数",
    eksponen_label: "指数（3）",
    eksponen_sub: "べき",
    read_as: "読み方：「5の3乗」または「5の三乗」",
    tip_squared: "ヒント：",
    tip_squared_text: "2乗は",
    tip_squared_kuadrat: "「二乗・平方」",
    tip_squared_and: "、3乗は",
    tip_squared_kubik: "「三乗・立方」",
    tip_squared_suffix: "と呼ぶ。だから",
    tip_squared_suffix2: "は「7の二乗」、",
    tip_squared_suffix3: "は「4の三乗」と読む。",
    sec_contoh1: "📝 練習問題 — 累乗の概念",
    ex1_easy_q: "繰り返しの掛け算",
    ex1_easy_q2: "を指数表記に直し、底と指数を答えよ！",
    step: "ステップ",
    ex1_s1: "7が何回現れるか数える →",
    ex1_s1b: "4回",
    ex1_s2: "指数表記で書く：",
    ex1_s3: "各部分を確認：",
    ex1_basis_val: "底 =",
    ex1_eks_val: "指数 =",
    ex1_nilai: "値：",
    ex1_med_q: "辺の長さが",
    ex1_med_q2: "cmの立方体の体積を求め、指数表記で表せ！",
    ex1_med_s1: "立方体の体積の公式を使う：",
    ex1_med_s2: "代入",
    ex1_med_s2b: "cm：",
    ex1_med_s3: "指数表記",
    ex1_med_s3b: "の意味：",
    ex1_med_s3c: "指数 =",
    ex1_hard_q: "細菌は1時間ごとに2倍に分裂する。最初に1個あったとき、8時間後には何個になるか？指数表記で答えよ！",
    ex1_h_s1: "パターンを観察：",
    jam: "時間後：",
    bacteria: "個",
    andSoon: "… など",
    ex1_h_s2: "",
    ex1_h_s2b: "時間後の細菌数 =",
    ex1_h_s3: "",
    ex1_h_ans: "8時間後、細菌は256個になる。",
    sec_konsep2: "📘 第2節：整数・分数の底",
    konsep2_intro: "指数表記は正の整数だけではない。底",
    konsep2_intro2: "は整数（負数・ゼロを含む）や分数でもよい。",
    konsep2_int_label: "整数の累乗：",
    konsep2_int_note: "すべての整数",
    konsep2_int_note2: "と",
    konsep2_frac_label: "分数の累乗：",
    konsep2_frac_note: "分数の底 → 分子と分母にそれぞれべきをかける！",
    tip_frac: "ヒント：",
    tip_frac_text: "分数の累乗は簡単 — 分子と分母を別々に累乗する！例：",
    sec_contoh2: "📝 練習問題 — 整数・分数の底",
    ex2_easy_q: "計算せよ：",
    ex2_med_q: "計算せよ：",
    ex2_hard_q: "簡略化せよ：",
    ex2_s_expand: "定義から展開：",
    ex2_s_frac: "分数の累乗の公式を使う：",
    ex2_s_separate: "分子と分母を別々に累乗：",
    ex2_hard_s1: "繰り返しの掛け算として書く：",
    ex2_hard_s2: "分数指数に変換：",
    ex2_hard_ans: "結果：",
    sec_konsep3: "📘 第3節：零乗と負の指数",
    konsep3_intro: "とは",
    pangkatNol: "零乗",
    konsep3_def_zero: "ゼロでない数を0乗すると常に1になる：",
    konsep3_proof_title: "🔍 除法パターンによる証明：",
    konsep3_proof_note: "1段下がるごとに2で割る → よって",
    konsep3_neg_def: "負の指数は正の指数の乗法的逆数：",
    konsep3_neg_proof: "🔍 負の指数の由来：",
    konsep3_neg_from_zero: "零乗の定義と除法の性質から：",
    tip_zero: "重要：",
    tip_zero_text: "は未定義！",
    tip_zero_text2: "が成り立つのは",
    evenExp_title: "偶数の指数",
    evenExp_note: "n = 偶数 (2, 4, 6, …) → 結果は常に正",
    oddExp_title: "奇数の指数",
    oddExp_note: "n = 奇数 (1, 3, 5, …) → 結果は常に負",
    sec_contoh3: "📝 練習問題 — 零乗・負の指数",
    ex3_easy_q: "計算せよ：",
    ex3_med_q1: "簡略化せよ：",
    ex3_hard_q: "を求めよ",
    ex3_hard_q2: "のとき",
    ex3_note_positive: "偶数乗 → 正",
    ex3_note_negative: "奇数乗 → 負",
    ex3_note_not: "ではない",
    sec_konsep4: "📘 第4節：基本的な指数の性質 — まとめ",
    konsep4_intro: "より複雑な操作に入る前に、学んだ基本的な性質をまとめよう：",
    rangkuman_label: "📊 基本的な性質のまとめ：",
    col_sifat: "性質",
    col_rumus: "公式",
    col_keterangan: "備考",
    row1_sifat: "繰り返しの掛け算",
    row1_ket: "基本定義",
    row2_sifat: "零乗",
    row2_ket: "常に 1（a ≠ 0）",
    row3_sifat: "負の指数",
    row3_ket: "逆数",
    row4_sifat: "分数の底",
    row4_ket: "分子と分母に分配",
    sec_contoh4: "📝 練習問題 — 複合問題",
    ex4_easy_q: "値を計算せよ：",
    ex4_med_q: "簡略化せよ：",
    ex4_hard_q: "もし",
    ex4_hard_q2: "なら",
    ex4_hard_q3: "を計算せよ",
    ex4_s_combine: "すべての概念を組み合わせ：",
    diff_easy: "基本",
    diff_med: "標準",
    diff_hard: "発展",
    pembahasan: "解説：",
    example: "例題",
  },
};

// ─── Bacterium animation steps (language-neutral visuals) ───────────────────
const STEPS = [
  { count: 1,  exp: 0, label: "2^0 = 1",  color: "from-emerald-400 to-teal-600",     glow: "shadow-emerald-500/60",  bg: "bg-emerald-500/20",  border: "border-emerald-400/50",  text: "text-emerald-300" },
  { count: 2,  exp: 1, label: "2^1 = 2",  color: "from-cyan-400 to-blue-600",        glow: "shadow-cyan-500/60",     bg: "bg-cyan-500/20",     border: "border-cyan-400/50",     text: "text-cyan-300"    },
  { count: 4,  exp: 2, label: "2^2 = 4",  color: "from-violet-400 to-purple-700",    glow: "shadow-violet-500/60",   bg: "bg-violet-500/20",   border: "border-violet-400/50",   text: "text-violet-300"  },
  { count: 8,  exp: 3, label: "2^3 = 8",  color: "from-orange-400 to-red-600",       glow: "shadow-orange-500/60",   bg: "bg-orange-500/20",   border: "border-orange-400/50",   text: "text-orange-300"  },
  { count: 16, exp: 4, label: "2^4 = 16", color: "from-pink-400 to-fuchsia-600",     glow: "shadow-pink-500/60",     bg: "bg-pink-500/20",     border: "border-pink-400/50",     text: "text-pink-300"    },
  { count: 32, exp: 5, label: "2^5 = 32", color: "from-yellow-400 to-amber-600",     glow: "shadow-yellow-500/60",   bg: "bg-yellow-500/20",   border: "border-yellow-400/50",   text: "text-yellow-300"  },
];

// ─── SplittingBacterium (unchanged visual) ───────────────────────────────────
const SplittingBacterium = ({
  color, glow, nextColor, nextGlow,
}: {
  color: string; glow: string; nextColor: string; nextGlow: string;
}) => {
  const [divPhase, setDivPhase] = useState<0 | 1>(0);
  useEffect(() => {
    const t = setTimeout(() => setDivPhase(1), 700);
    return () => clearTimeout(t);
  }, []);
  if (divPhase === 0) {
    return (
      <motion.div
        className={`w-11 h-11 bg-gradient-to-br ${color} shadow-lg ${glow} flex items-center justify-center text-xl select-none`}
        style={{ borderRadius: "50%", flexShrink: 0 }}
        animate={{ scaleX: [1, 1.85, 2.1], scaleY: [1, 0.6, 0.55] }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >🦠</motion.div>
    );
  }
  return (
    <div className="relative flex-shrink-0" style={{ width: 96, height: 44 }}>
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[28px] bg-gradient-to-r ${nextColor} opacity-60 rounded-full`}
        initial={{ width: 56 }} animate={{ width: 0 }}
        transition={{ duration: 0.55, ease: "easeIn" }}
      />
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${nextColor} shadow-lg ${nextGlow} flex items-center justify-center text-lg select-none`}
        initial={{ x: "-50%", scale: 0.7 }} animate={{ x: "calc(-50% - 28px)", scale: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 13 }}
      >🦠</motion.div>
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${nextColor} shadow-lg ${nextGlow} flex items-center justify-center text-lg select-none`}
        initial={{ x: "-50%", scale: 0.7 }} animate={{ x: "calc(-50% + 28px)", scale: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 13 }}
      >🦠</motion.div>
    </div>
  );
};

// ─── BacteriaAnimation (accepts translation strings) ─────────────────────────
interface BacteriaT {
  animBadge: string; animTitle: string; splitting: string;
  btnBusy: string; btnReset: string; btnSplit: (a: number, b: number) => string;
  tipMax: string; tipBusy: string; tipNormal: string;
}

const BacteriaAnimation = ({ t }: { t: BacteriaT }) => {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"idle" | "splitting">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = STEPS[step];
  const next    = STEPS[step + 1] ?? STEPS[step];
  const isMax   = step === STEPS.length - 1;
  const busy    = phase !== "idle";

  const handleAction = () => {
    if (busy) return;
    playPopSound();
    if (isMax) { setStep(0); return; }
    setPhase("splitting");
    timerRef.current = setTimeout(() => { setStep((s) => s + 1); setPhase("idle"); }, 1700);
  };
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const items = Array.from({ length: current.count }, (_, i) => i);

  return (
    <div className={`rounded-2xl border-2 ${current.border} ${current.bg} backdrop-blur-sm overflow-hidden transition-colors duration-700`}>
      <div className="px-5 pt-4 pb-2 text-center">
        <p className="font-body text-xs font-semibold text-white/60 tracking-widest uppercase mb-1">{t.animBadge}</p>
        <h3 className="font-display text-base font-bold text-white">{t.animTitle}</h3>
      </div>
      <div className="flex items-center justify-center py-3">
        <motion.div
          key={step} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className={`px-5 py-2 rounded-full ${current.bg} border ${current.border}`}
        >
          <span className={`font-display text-2xl font-bold ${current.text}`}>
            <InlineMath math={current.label} />
          </span>
        </motion.div>
      </div>
      <div className="min-h-[150px] flex flex-wrap justify-center items-center gap-3 px-4 py-2 content-center">
        {phase === "idle" && items.map((_, i) => (
          <motion.div
            key={`idle-${step}-${i}`}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 22, delay: i * 0.045 }}
            className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${current.color} shadow-lg ${current.glow} flex items-center justify-center text-xl cursor-pointer select-none`}
            onClick={handleAction} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.92 }}
          >
            🦠
            <span className={`absolute inset-0 rounded-full bg-gradient-to-br ${current.color} opacity-25 blur-sm pointer-events-none`} />
          </motion.div>
        ))}
        {phase === "splitting" && items.map((_, i) => (
          <SplittingBacterium key={`split-${step}-${i}`} color={current.color} glow={current.glow} nextColor={next.color} nextGlow={next.glow} />
        ))}
      </div>
      <div className="text-center h-5 mb-1">
        <AnimatePresence mode="wait">
          {phase === "splitting" && (
            <motion.p key="splitting-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="font-body text-xs text-white/50">
              {t.splitting}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">
        {STEPS.map((s, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-400 ${
            i === step ? `w-6 bg-gradient-to-r ${s.color}` : i < step ? "w-3 bg-white/40" : "w-3 bg-white/10"
          }`} />
        ))}
      </div>
      <div className="px-5 pb-5">
        <motion.button
          whileTap={{ scale: 0.94 }} onClick={handleAction} disabled={busy}
          className={`w-full py-3 rounded-xl bg-gradient-to-r ${current.color} text-white font-body font-bold text-sm shadow-lg ${current.glow} transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {busy ? t.btnBusy : isMax ? t.btnReset : t.btnSplit(current.count, next.count)}
        </motion.button>
        <p className="text-center font-body text-xs text-white/40 mt-2">
          {isMax ? t.tipMax : busy ? t.tipBusy : t.tipNormal}
        </p>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const PengertianNotasiPangkatPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "contoh1", "konsep2", "contoh2", "konsep3", "contoh3", "konsep4", "contoh4",
  ]);
  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const diffColor = (d: string) => ({
    [t.diff_easy]: { badge: "bg-green-500/20 text-green-400", bar: "border-l-4 border-green-500", hdr: "text-green-400", bg: "bg-green-500/5 border border-green-500/20" },
    [t.diff_med]:  { badge: "bg-yellow-500/20 text-yellow-400", bar: "border-l-4 border-yellow-500", hdr: "text-yellow-400", bg: "bg-yellow-500/5 border border-yellow-500/20" },
    [t.diff_hard]: { badge: "bg-red-500/20 text-red-400", bar: "border-l-4 border-red-500", hdr: "text-red-400", bg: "bg-red-500/5 border border-red-500/20" },
  }[d] ?? { badge: "bg-green-500/20 text-green-400", bar: "border-l-4 border-green-500", hdr: "text-green-400", bg: "bg-green-500/5 border border-green-500/20" });

  const SectionBtn = ({ id, icon, iconCls, title }: { id: string; icon: React.ReactNode; iconCls: string; title: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconCls}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const isOpen = (id: string) => expandedSections.includes(id);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.pageSub}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── BACTERIA ANIMATION ─────────────────────────────────────────── */}
          <div className="text-center space-y-1 px-1">
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-white/40">{t.beforeStart}</p>
            <h2 className="font-display text-lg md:text-xl font-bold text-white leading-snug">{t.heroTitle}</h2>
            <p className="font-body text-sm text-white/60 leading-relaxed max-w-sm mx-auto">{t.heroDesc}</p>
          </div>
          <BacteriaAnimation t={t} />

          {/* ── INTRO ──────────────────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="intro" icon={<Lightbulb className="w-5 h-5" />} iconCls="text-yellow-400" title={t.sec_intro} />
            {isOpen("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro_p1_before}{" "}
                  <strong className="text-emerald-300">1 {t.intro_p1_mid1}</strong>{" "}
                  <strong className="text-cyan-300">2</strong>,{" "}
                  {t.intro_p1_mid2}{" "}
                  <strong className="text-violet-300">4</strong>,{" "}
                  <strong className="text-orange-300">8</strong>,{" "}
                  <strong className="text-pink-300">16</strong>,{" "}
                  {t.intro_p1_mid3}{" "}
                  <strong className="text-yellow-300">32</strong>{" "}
                  {t.intro_p1_after}{" "}
                  <InlineMath math="2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2" />{" "}
                  {t.intro_p1_suffix}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.intro_highlight} <strong>{t.notasiPangkat}</strong>
                    {t.intro_highlight2}{" "}
                    <InlineMath math="2^{10} = 1.024" />
                    {t.intro_highlight3}
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.intro_funfact_bold}</strong>{" "}{t.intro_funfact}{" "}
                    <InlineMath math="2^n" />{" "}{t.intro_funfact2}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: PENGERTIAN ──────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="konsep1" icon={<Target className="w-5 h-5" />} iconCls="text-green-400" title={t.sec_konsep1} />
            {isOpen("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">{t.bilBerpangkat}</strong> {t.konsep1_def}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="a^n = \underbrace{a \times a \times a \times \cdots \times a}_{n \text{ faktor}}" />
                  </div>
                  <div className="space-y-2 font-body text-sm text-white/80">
                    <p><strong className="text-green-300">{t.konsep1_basis}</strong> → <InlineMath math="a" /> {t.konsep1_basis_desc}</p>
                    <p><strong className="text-green-300">{t.konsep1_eksponen}</strong> → <InlineMath math="n" /> {t.konsep1_eksponen_desc}</p>
                    <p><strong className="text-green-300">{t.konsep1_syarat}</strong> {t.konsep1_syarat_desc} <InlineMath math="n" /> {t.konsep1_syarat_desc2} <InlineMath math="n \geq 1" />.</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.anatomi_label}</p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative inline-block">
                      <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border-2 border-cyan-500/50 rounded-xl px-10 py-6 text-center">
                        <span className="inline-flex items-start">
                          <span className="font-display text-5xl font-bold text-white leading-none">5</span>
                          <span className="font-display text-2xl font-bold text-yellow-400 leading-none" style={{ marginTop: '-4px', marginLeft: '3px' }}>3</span>
                        </span>
                      </div>
                      <div className="mt-3 flex justify-around text-xs font-body">
                        <div className="text-center">
                          <div className="w-2 h-6 border-l-2 border-cyan-400 mx-auto mb-1"></div>
                          <span className="text-cyan-300 font-semibold">{t.basis_label}</span><br />
                          <span className="text-white/60">{t.basis_sub}</span>
                        </div>
                        <div className="text-center">
                          <div className="w-2 h-6 border-l-2 border-yellow-400 mx-auto mb-1"></div>
                          <span className="text-yellow-300 font-semibold">{t.eksponen_label}</span><br />
                          <span className="text-white/60">{t.eksponen_sub}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center w-full">
                      <p className="font-body text-sm text-white/80"><InlineMath math="5^3 = 5 \times 5 \times 5 = 125" /></p>
                      <p className="font-body text-xs text-white/50 mt-1">{t.read_as}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_squared}</strong> {t.tip_squared_text} <em>{t.tip_squared_kuadrat}</em> {t.tip_squared_and} <em>{t.tip_squared_kubik}</em>{t.tip_squared_suffix} <InlineMath math="7^2" /> {t.tip_squared_suffix2} <InlineMath math="4^3" /> {t.tip_squared_suffix3}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 1 ───────────────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="contoh1" icon={<Calculator className="w-5 h-5" />} iconCls="text-blue-400" title={t.sec_contoh1} />
            {isOpen("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                {(() => { const dc = diffColor(t.diff_easy); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_easy}</span>
                      <span className="font-body font-semibold text-white">{t.example} 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        {t.ex1_easy_q} <InlineMath math="7 \times 7 \times 7 \times 7" /> {t.ex1_easy_q2}
                      </p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step} 1:</strong> {t.ex1_s1} <strong className="text-primary">{t.ex1_s1b}</strong>.</p>
                        <p><strong>{t.step} 2:</strong> {t.ex1_s2}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="7 \times 7 \times 7 \times 7 = 7^4" /></div>
                        <p><strong>{t.step} 3:</strong> {t.ex1_s3}</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1">
                          <p>{t.ex1_basis_val} <strong className="text-cyan-300">7</strong></p>
                          <p>{t.ex1_eks_val} <strong className="text-yellow-300">4</strong></p>
                          <p>{t.ex1_nilai} <InlineMath math="7^4 = 7 \times 7 \times 7 \times 7 = 2.401" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Medium */}
                {(() => { const dc = diffColor(t.diff_med); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_med}</span>
                      <span className="font-body font-semibold text-white">{t.example} 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        {t.ex1_med_q} <InlineMath math="6" /> {t.ex1_med_q2}
                      </p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-3 font-body text-sm text-white/80">
                        <p><strong>{t.step} 1:</strong> {t.ex1_med_s1}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="V = s \times s \times s = s^3" /></div>
                        <p><strong>{t.step} 2:</strong> {t.ex1_med_s2} <InlineMath math="s = 6" /> {t.ex1_med_s2b}</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          {/* KaTeX fix: use \mathrm for unit */}
                          <BlockMath math="V = 6^3 = 6 \times 6 \times 6 = 216\,\mathrm{cm}^3" />
                        </div>
                        <p>{t.ex1_med_s3} <InlineMath math="6^3" /> {t.ex1_med_s3b} <strong className="text-primary">{language === "ja" ? "底 = 6" : t.ex1_med_s3c === "exponent =" ? "base = 6" : "basis = 6"}</strong>, <strong className="text-primary">{t.ex1_med_s3c} 3</strong>.</p>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Hard */}
                {(() => { const dc = diffColor(t.diff_hard); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_hard}</span>
                      <span className="font-body font-semibold text-white">{t.example} 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex1_hard_q}</p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-3 font-body text-sm text-white/80">
                        <p><strong>{t.step} 1:</strong> {t.ex1_h_s1}</p>
                        <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                          <p>{t.jam}0: <InlineMath math="2^0 = 1" /> {t.bacteria}</p>
                          <p>{t.jam}1: <InlineMath math="2^1 = 2" /> {t.bacteria}</p>
                          <p>{t.jam}2: <InlineMath math="2^2 = 4" /> {t.bacteria}</p>
                          <p>{t.jam}3: <InlineMath math="2^3 = 8" /> {t.bacteria}</p>
                          <p className="text-white/50">{t.andSoon}</p>
                        </div>
                        <p><strong>{t.step} 2:</strong> {t.ex1_h_s2} <InlineMath math="n" /> {t.ex1_h_s2b} <InlineMath math="2^n" /></p>
                        <p><strong>{t.step} 3:</strong> {t.ex1_h_s3} <InlineMath math="n = 8" />:</p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="2^8 = 2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 = 256" />
                        </div>
                        <p><strong className="text-primary">{t.ex1_h_ans}</strong></p>
                      </div>
                    </div>
                  </div>
                ); })()}
              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: BILANGAN BULAT & PECAHAN BERPANGKAT ─────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="konsep2" icon={<Target className="w-5 h-5" />} iconCls="text-purple-400" title={t.sec_konsep2} />
            {isOpen("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.konsep2_intro} <InlineMath math="a" /> {t.konsep2_intro2}
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-purple-300 mb-2">{t.konsep2_int_label}</p>
                      <BlockMath math="a^n = \underbrace{a \times a \times \cdots \times a}_{n}" />
                      <p className="font-body text-xs text-white/60 mt-1">{t.konsep2_int_note} <InlineMath math="a" /> {t.konsep2_int_note2} <InlineMath math="n \in \mathbb{Z}^+" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-purple-300 mb-2">{t.konsep2_frac_label}</p>
                      <BlockMath math="\left(\frac{p}{q}\right)^n = \frac{p^n}{q^n}, \quad q \neq 0" />
                      <p className="font-body text-xs text-white/60 mt-1">{t.konsep2_frac_note}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_frac}</strong> {t.tip_frac_text}{" "}
                    <InlineMath math="\left(\frac{2}{3}\right)^4 = \frac{2^4}{3^4} = \frac{16}{81}" />
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 2 ───────────────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="contoh2" icon={<Calculator className="w-5 h-5" />} iconCls="text-purple-400" title={t.sec_contoh2} />
            {isOpen("contoh2") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                {(() => { const dc = diffColor(t.diff_easy); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_easy}</span>
                      <span className="font-body font-semibold text-white">{t.example} 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex2_easy_q} <InlineMath math="(-3)^4" /></p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p>{t.ex2_s_expand}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="(-3)^4 = (-3) \times (-3) \times (-3) \times (-3) = 81" /></div>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Medium */}
                {(() => { const dc = diffColor(t.diff_med); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_med}</span>
                      <span className="font-body font-semibold text-white">{t.example} 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex2_med_q} <InlineMath math="\left(\dfrac{3}{5}\right)^3" /></p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p>{t.ex2_s_frac}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\left(\frac{3}{5}\right)^3 = \frac{3^3}{5^3} = \frac{27}{125}" /></div>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Hard */}
                {(() => { const dc = diffColor(t.diff_hard); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_hard}</span>
                      <span className="font-body font-semibold text-white">{t.example} 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex2_hard_q} <InlineMath math="\left(-\dfrac{2}{3}\right)^5" /></p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step} 1:</strong> {t.ex2_hard_s1}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="\left(-\frac{2}{3}\right)^5 = \frac{(-2)^5}{3^5}" /></div>
                        <p><strong>{t.step} 2:</strong> {t.ex2_s_separate}</p>
                        <div className="bg-slate-900/50 rounded p-3"><BlockMath math="(-2)^5 = -32, \quad 3^5 = 243" /></div>
                        <p><strong>{t.ex2_hard_ans}</strong> <InlineMath math="-\dfrac{32}{243}" /></p>
                      </div>
                    </div>
                  </div>
                ); })()}
              </div>
            )}
          </div>

          {/* ── SUB-BAB 3: PANGKAT NOL & NEGATIF ──────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="konsep3" icon={<Target className="w-5 h-5" />} iconCls="text-cyan-400" title={t.sec_konsep3} />
            {isOpen("konsep3") && (
              <div className="px-5 pb-5 space-y-4">
                {/* Zero exponent */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80">{t.konsep3_def_zero}</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="a^0 = 1, \quad a \neq 0" />
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.konsep3_proof_title}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs font-body text-white/70">
                      <p><InlineMath math="2^4 = 16,\; 2^3 = 8,\; 2^2 = 4,\; 2^1 = 2,\; 2^0 = ?" /></p>
                      <p>{t.konsep3_proof_note} <InlineMath math="2^0 = 2 \div 2 = 1" /></p>
                    </div>
                  </div>
                </div>
                {/* Negative exponent */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80">{t.konsep3_neg_def}</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="a^{-n} = \frac{1}{a^n}, \quad a \neq 0" />
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.konsep3_neg_proof}</p>
                    <p className="font-body text-xs text-white/70 mb-2">{t.konsep3_neg_from_zero}</p>
                    <div className="bg-slate-900/50 rounded p-3">
                      <BlockMath math="\frac{a^0}{a^n} = a^{0-n} = a^{-n} \quad \Rightarrow \quad a^{-n} = \frac{1}{a^n}" />
                    </div>
                  </div>
                </div>
                {/* Even / Odd exponent visual — KaTeX fix: remove \text{genap}/\text{ganjil} */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="font-body text-xs font-semibold text-green-300 mb-2">{t.evenExp_title}</p>
                    <BlockMath math="(-a)^n > 0" />
                    <p className="font-body text-xs text-white/60 mt-1">{t.evenExp_note}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="font-body text-xs font-semibold text-red-300 mb-2">{t.oddExp_title}</p>
                    <BlockMath math="(-a)^n < 0" />
                    <p className="font-body text-xs text-white/60 mt-1">{t.oddExp_note}</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_zero}</strong> <InlineMath math="0^0" /> {t.tip_zero_text} <InlineMath math="a^0 = 1" /> {t.tip_zero_text2} <InlineMath math="a \neq 0" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 3 ───────────────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="contoh3" icon={<Calculator className="w-5 h-5" />} iconCls="text-cyan-400" title={t.sec_contoh3} />
            {isOpen("contoh3") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                {(() => { const dc = diffColor(t.diff_easy); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_easy}</span>
                      <span className="font-body font-semibold text-white">{t.example} 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex3_easy_q} <InlineMath math="5^0 + 3^{-2}" /></p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="5^0 = 1" />
                          <BlockMath math="3^{-2} = \frac{1}{3^2} = \frac{1}{9}" />
                          <BlockMath math="5^0 + 3^{-2} = 1 + \frac{1}{9} = \frac{10}{9}" />
                        </div>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Medium */}
                {(() => { const dc = diffColor(t.diff_med); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_med}</span>
                      <span className="font-body font-semibold text-white">{t.example} 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex3_med_q1} <InlineMath math="(-2)^6" /> dan/and <InlineMath math="(-3)^5" /></p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <div className="bg-slate-900/50 rounded p-3">
                          {/* KaTeX fix: removed \text{pangkat genap, positif} etc — use JSX labels */}
                          <BlockMath math="(-2)^6 = 64" />
                          <p className="text-xs text-green-300 mt-1">↑ {t.ex3_note_positive}</p>
                          <BlockMath math="(-3)^5 = -243" />
                          <p className="text-xs text-red-300 mt-1">↑ {t.ex3_note_negative}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Hard */}
                {(() => { const dc = diffColor(t.diff_hard); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_hard}</span>
                      <span className="font-body font-semibold text-white">{t.example} 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        {t.ex3_hard_q} <InlineMath math="(-4)^n" /> {t.ex3_hard_q2} <InlineMath math="(-4)^n = -1024" />
                      </p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step} 1:</strong> <InlineMath math="4^5 = 1024" /></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          {/* KaTeX fix: removed \text{bukan 1024} — use JSX label */}
                          <BlockMath math="(-4)^5 = -1024" />
                          <p className="text-xs text-orange-300 mt-1">
                            ↑ {t.ex3_note_negative} ({t.ex3_note_not} +1024)
                          </p>
                        </div>
                        <p><strong>{t.step} 2:</strong> <InlineMath math="n = 5" /></p>
                      </div>
                    </div>
                  </div>
                ); })()}
              </div>
            )}
          </div>

          {/* ── SUB-BAB 4: RANGKUMAN ───────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="konsep4" icon={<Target className="w-5 h-5" />} iconCls="text-yellow-400" title={t.sec_konsep4} />
            {isOpen("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.konsep4_intro}</p>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.rangkuman_label}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-cyan-300 pr-4">{t.col_sifat}</th>
                          <th className="text-left py-2 text-green-300 pr-4">{t.col_rumus}</th>
                          <th className="text-left py-2 text-yellow-300">{t.col_keterangan}</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5">
                          <td className="py-2 pr-4">{t.row1_sifat}</td>
                          <td className="pr-4"><InlineMath math="a^n = \underbrace{a \cdots a}_{n}" /></td>
                          <td>{t.row1_ket}</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 pr-4">{t.row2_sifat}</td>
                          <td className="pr-4"><InlineMath math="a^0 = 1" /></td>
                          <td>{t.row2_ket}</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2 pr-4">{t.row3_sifat}</td>
                          <td className="pr-4"><InlineMath math="a^{-n} = \frac{1}{a^n}" /></td>
                          <td>{t.row3_ket}</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4">{t.row4_sifat}</td>
                          <td className="pr-4"><InlineMath math="\left(\frac{p}{q}\right)^n = \frac{p^n}{q^n}" /></td>
                          <td>{t.row4_ket}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH 4: GABUNGAN ──────────────────────────────────────────── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionBtn id="contoh4" icon={<Calculator className="w-5 h-5" />} iconCls="text-yellow-400" title={t.sec_contoh4} />
            {isOpen("contoh4") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Easy */}
                {(() => { const dc = diffColor(t.diff_easy); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_easy}</span>
                      <span className="font-body font-semibold text-white">{t.example} 1</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex4_easy_q} <InlineMath math="4^0 + 2^{-3} + \left(\frac{1}{3}\right)^2" /></p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="4^0 = 1" />
                          <BlockMath math="2^{-3} = \frac{1}{8}" />
                          <BlockMath math="\left(\frac{1}{3}\right)^2 = \frac{1}{9}" />
                          <BlockMath math="1 + \frac{1}{8} + \frac{1}{9} = \frac{72+9+8}{72} = \frac{89}{72}" />
                        </div>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Medium */}
                {(() => { const dc = diffColor(t.diff_med); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_med}</span>
                      <span className="font-body font-semibold text-white">{t.example} 2</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">{t.ex4_med_q} <InlineMath math="\dfrac{(-2)^3 \times 3^{-2}}{6^0}" /></p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="(-2)^3 = -8, \quad 3^{-2} = \frac{1}{9}, \quad 6^0 = 1" />
                          <BlockMath math="\frac{-8 \times \frac{1}{9}}{1} = -\frac{8}{9}" />
                        </div>
                      </div>
                    </div>
                  </div>
                ); })()}
                {/* Hard */}
                {(() => { const dc = diffColor(t.diff_hard); return (
                  <div className={`${dc.bar} pl-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{t.diff_hard}</span>
                      <span className="font-body font-semibold text-white">{t.example} 3</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <p className="font-body text-sm text-white">
                        {t.ex4_hard_q} <InlineMath math="a = 2^{-3}" />{t.ex4_hard_q2} <InlineMath math="a^{-2}" /> {t.ex4_hard_q3} <InlineMath math="\left(\frac{1}{a}\right)^4" />.
                      </p>
                    </div>
                    <div className={`${dc.bg} rounded-lg p-4`}>
                      <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
                      <div className="space-y-2 font-body text-sm text-white/80">
                        <p><strong>{t.step} 1:</strong> <InlineMath math="a = 2^{-3} = \frac{1}{8}" /></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="a^{-2} = (2^{-3})^{-2} = 2^{6} = 64" />
                        </div>
                        <p><strong>{t.step} 2:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3">
                          <BlockMath math="\left(\frac{1}{a}\right)^4 = (2^3)^4 = 2^{12} = 4096" />
                        </div>
                      </div>
                    </div>
                  </div>
                ); })()}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PengertianNotasiPangkatPage;
