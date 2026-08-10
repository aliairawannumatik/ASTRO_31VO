import { useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  id: {
    pageTitle: "BENTUK AKAR",
    pageSub: "Kelas 9 · Bilangan Berpangkat · Materi Matematika",
    // Intro
    sec_intro: "🌟 Kenapa Kita Perlu Belajar Bentuk Akar?",
    intro_p: "Pernahkah kamu mencoba menghitung panjang sisi persegi yang luasnya 5 cm²? Jawabannya adalah",
    intro_p2: "cm — bukan bilangan bulat, bukan juga pecahan biasa. Inilah yang disebut",
    intro_p3: "bentuk akar",
    intro_p4: "!",
    intro_highlight: "Bentuk akar muncul di banyak tempat: menghitung diagonal layar HP, jarak antar titik di peta, hingga kecepatan gelombang suara. Memahaminya berarti kamu siap bermain di level matematika yang lebih tinggi! 🚀",
    intro_note: "Catatan:",
    intro_note2: "Materi ini erat kaitannya dengan pangkat. Pastikan kamu sudah paham konsep bilangan berpangkat sebelum melanjutkan!",
    badge_intisari: "🎯 Ringkasan Intisari",
    // Konsep 1
    sec_k1: "📘 Sub-Bab 1: Pengertian Bentuk Akar",
    k1_def: "adalah akar dari suatu bilangan yang",
    bentukAkar: "Bentuk akar",
    k1_def2: "tidak dapat disederhanakan menjadi bilangan rasional",
    k1_def3: "(bilangan bulat atau pecahan biasa). Secara umum, akar pangkat",
    k1_def4: "dari bilangan",
    k1_def5: "didefinisikan sebagai:",
    k1_n2_note: "Jika",
    k1_n2_note2: ", tanda akar ditulis",
    k1_n2_note3: "(tanpa angka 2). Bilangan di dalam tanda akar disebut",
    radicand: "radicand",
    k1_not_radical: "Bukan bentuk akar (rasional)",
    k1_is_radical: "Bentuk akar (irasional)",
    anatomi_label: "🔍 ANATOMI BENTUK AKAR:",
    idx_label: "INDEKS (n)",
    idx_sub: "Pangkat akar",
    radicand_label: "RADICAND (a)",
    radicand_sub: "Bilangan di bawah akar",
    tip_radical: "Tips:",
    tip_radical2: "Cara mudah mengenali bentuk akar — coba cari apakah radicand adalah bilangan kuadrat sempurna (1, 4, 9, 16, 25, …). Jika ya, hasilnya bilangan bulat (bukan bentuk akar). Jika tidak, itulah bentuk akar!",
    // Contoh 1
    sec_c1: "📝 Contoh Soal — Pengertian Bentuk Akar",
    c1_easy_q: "Dari daftar berikut, tentukan mana yang merupakan bentuk akar dan mana yang bukan:",
    c1_easy_check: "Langkah:",
    c1_easy_check2: "Cek apakah radicand adalah bilangan kuadrat sempurna.",
    c1_not: "Bukan bentuk akar",
    c1_is: "Bentuk akar",
    c1_med_q: "Sebuah taman berbentuk persegi memiliki luas",
    c1_med_q2: ". Tentukan panjang sisi taman tersebut dalam bentuk akar!",
    c1_med_s1: "Gunakan rumus luas persegi",
    c1_med_s2: "Cari",
    c1_med_s2b: ":",
    c1_med_s3: "Cek apakah 75 kuadrat sempurna →",
    c1_med_s3b: "tidak",
    c1_med_s3c: ", karena",
    c1_med_s3d: "dan",
    c1_med_ans: "Panjang sisi taman =",
    c1_med_ans2: "m (bentuk akar)",
    c1_hard_q: "Hitunglah nilai dari",
    c1_hard_q2: "dan tentukan apakah hasilnya termasuk bentuk akar atau bukan. Jelaskan!",
    c1_hard_s1: "Akar pangkat tiga dari bilangan negatif diperbolehkan (karena",
    c1_hard_s1b: ").",
    c1_hard_s2: "Periksa hasilnya:",
    c1_hard_s2b: "Hasilnya adalah",
    c1_hard_s2c: ", yaitu bilangan bulat (bilangan rasional).",
    c1_hard_ans: "BUKAN bentuk akar",
    c1_hard_ans2: ", karena hasilnya bilangan rasional (",
    c1_hard_ans3: ").",
    kesimpulan: "Kesimpulan:",
    // Konsep 2
    sec_k2: "📘 Sub-Bab 2: Hubungan Bentuk Akar dengan Pangkat Pecahan",
    k2_intro: "Ternyata, bentuk akar dan pangkat pecahan adalah",
    k2_intro2: "dua cara berbeda menulis hal yang sama!",
    k2_intro3: "Hubungannya dirumuskan sebagai:",
    k2_bridge: "🌉 JEMBATAN ANTARA DUA NOTASI:",
    k2_pangkat: "Pangkat Pecahan",
    k2_akar: "Bentuk Akar",
    k2_bridge_note: "Penyebut pangkat = indeks akar · Pembilang pangkat = pangkat radicand",
    tip_bridge: "Tips:",
    tip_bridge2: "Hafal pola ini — penyebut pecahan menjadi indeks akar, dan pembilang pecahan menjadi pangkat di dalam akar. Mudah!",
    // Contoh 2
    sec_c2: "📝 Contoh Soal — Hubungan Akar & Pangkat Pecahan",
    c2_easy_q: "Ubah ke bentuk akar:",
    c2_easy_rule: "Gunakan rumus",
    c2_med_q: "Hitunglah nilai dari",
    c2_med_s1: "Ubah ke bentuk akar:",
    c2_med_s2: "Cari",
    c2_med_s2b: "terlebih dahulu:",
    c2_med_s3: "Pangkatkan dengan 3:",
    c2_med_ans: "Hasil: 8",
    c2_hard_q: "Sederhanakan:",
    c2_hard_s1: "Ubah semua ke basis 3:",
    c2_hard_s2: "Substitusi:",
    // Konsep 3
    sec_k3: "📘 Sub-Bab 3: Penyederhanaan Bentuk Akar",
    k3_intro: "Bentuk akar dikatakan",
    k3_sederhana: "sederhana",
    k3_intro2: "jika radicand tidak memiliki faktor yang merupakan kuadrat sempurna (selain 1). Cara menyederhanakan:",
    k3_intro3: "faktorkan radicand, lalu keluarkan faktor kuadrat sempurna dari dalam akar.",
    k3_steps_title: "Langkah Penyederhanaan:",
    k3_s1: "Faktorkan radicand ke faktor-faktor prima.",
    k3_s2: "Kelompokkan faktor yang berpasangan (kuadrat sempurna).",
    k3_s3: "Keluarkan faktor berpasangan dari tanda akar.",
    k3_vis_title: "CONTOH VISUALISASI",
    k3_vis_note: "Belum sederhana → Faktorkan → Bentuk sederhana ✓",
    tip_k3: "Tips:",
    tip_k3b: "Cari faktor kuadrat sempurna terbesar dari radicand untuk mempersingkat langkah! Misalnya untuk",
    tip_k3c: ", langsung cari 36 (bukan 4 atau 9) agar lebih efisien.",
    // Contoh 3
    sec_c3: "📝 Contoh Soal — Penyederhanaan Bentuk Akar",
    c3_easy_q: "Sederhanakan:",
    c3_easy_s1: "Cari faktor kuadrat sempurna terbesar dari 48:",
    c3_easy_s1b: "48 = 16 × 3 (karena 16 = 4² adalah faktor kuadrat sempurna terbesar)",
    c3_easy_ans: "Hasil:",
    c3_med_q: "Sederhanakan:",
    c3_med_s1: "Sederhanakan masing-masing suku:",
    c3_med_s2: "Gabungkan suku-suku sejenis:",
    c3_hard_q: "Sederhanakan:",
    c3_hard_s1: "Sederhanakan pembilang:",
    c3_hard_s2: "Rasionalkan penyebut (kalikan dengan",
    c3_hard_s2b: "):",
    c3_hard_s3: "Sederhanakan:",
    c3_hard_ans: "Hasil:",
    // Konsep 4
    sec_k4: "📘 Sub-Bab 4: Operasi pada Bentuk Akar",
    k4_add: "Penjumlahan/Pengurangan Bentuk Akar:",
    k4_add_note: "Hanya bentuk akar dengan radicand yang SAMA yang bisa dijumlahkan/dikurangkan:",
    k4_mul: "Perkalian Bentuk Akar:",
    k4_div: "Pembagian/Merasionalkan:",
    tip_k4: "Tips:",
    tip_k4b: "Bentuk akar",
    tip_k4c: "tidak bisa dijumlahkan langsung! Harus disederhanakan dulu, kemungkinan bisa jadi sejenis.",
    // Contoh 4
    sec_c4: "📝 Contoh Soal — Operasi pada Bentuk Akar",
    // Konsep 5
    sec_k5: "📘 Sub-Bab 5: Merasionalkan Penyebut",
    k5_intro: "Merasionalkan penyebut adalah proses menghilangkan bentuk akar dari penyebut suatu pecahan. Ini penting agar ekspresi dianggap dalam",
    k5_intro2: "bentuk sederhana",
    k5_intro3: ".",
    k5_t1_title: "Tipe 1 — Penyebut tunggal:",
    k5_t2_title: "Tipe 2 — Penyebut binomial:",
    k5_konj: "Konjugat",
    k5_konj2: "dari",
    k5_konj3: "adalah",
    tip_k5: "Tips:",
    tip_k5b: "Selisih kuadrat selalu membantu saat merasionalkan penyebut binomial!",
    // Contoh 5
    sec_c5: "📝 Contoh Soal — Merasionalkan Penyebut",
    c5_easy_q: "Rasionalkan penyebut:",
    c5_med_q: "Rasionalkan penyebut:",
    c5_hard_q: "Rasionalkan penyebut:",
    kalikan_conj: "Kalikan dengan konjugatnya:",
    gunakan_selisih: "Gunakan selisih kuadrat:",
    // Konsep 6
    sec_k6: "📘 Sub-Bab 6: Menyederhanakan Bentuk Akar Bertingkat",
    k6_intro: "Bentuk akar bertingkat (nested radical) adalah akar yang di dalamnya masih terdapat bentuk akar. Ada rumus khusus untuk menyederhanakan bentuk",
    k6_formula_note: "Jika",
    k6_formula_note2: "maka berlaku:",
    k6_steps_title: "Langkah Identifikasi:",
    k6_s1: "Tentukan nilai",
    k6_s1b: "dari suku akar tengah:",
    k6_s2: "Cari nilai",
    k6_s2b: "dan",
    k6_s2c: "sehingga",
    k6_s3: "Substitusikan ke rumus.",
    tip_k6: "Tips:",
    tip_k6b: "Tidak semua akar bertingkat bisa disederhanakan! Ini hanya berlaku jika",
    tip_k6c: "dan",
    tip_k6d: "adalah bilangan kuadrat sempurna.",
    // Contoh 6
    sec_c6: "📝 Contoh Soal — Bentuk Akar Bertingkat",
    // Common
    step: "Langkah",
    pembahasan: "PEMBAHASAN:",
    example: "Contoh",
    diff_easy: "MUDAH",
    diff_med: "SEDANG",
    diff_hard: "SULIT",
    sederhanakan: "Sederhanakan:",
    hitung: "Hitunglah:",
    rasionalkan: "Rasionalkan penyebut:",
    hasil: "Hasil:",
    karena: "karena",
    dan: "dan",
    jika: "Jika",
    maka: "maka",
    perhatikan: "Perhatikan:",
    langkah: "Langkah",
    nilai: "nilai",
    akar_bertingkat: "akar bertingkat",
    dengan: "dengan",
  },
  en: {
    pageTitle: "RADICAL EXPRESSIONS",
    pageSub: "Grade 9 · Exponents & Powers · Math Materials",
    sec_intro: "🌟 Why Do We Need Radical Expressions?",
    intro_p: "Have you ever tried to find the side length of a square with area 5 cm²? The answer is",
    intro_p2: "cm — not an integer, not a simple fraction. This is called a",
    intro_p3: "radical expression",
    intro_p4: "!",
    intro_highlight: "Radicals appear everywhere: the diagonal of a phone screen, distances on a map, even sound wave speed. Understanding them means you're ready for higher-level math! 🚀",
    intro_note: "Note:",
    intro_note2: "This topic is closely related to exponents. Make sure you understand exponents before continuing!",
    badge_intisari: "🎯 Key Summary",
    sec_k1: "📘 Section 1: What Are Radicals?",
    k1_def: "is the root of a number that",
    bentukAkar: "A radical expression",
    k1_def2: "cannot be simplified to a rational number",
    k1_def3: "(integer or simple fraction). In general, the n-th root of",
    k1_def4: "from number",
    k1_def5: "is defined as:",
    k1_n2_note: "When",
    k1_n2_note2: ", the radical sign is written as",
    k1_n2_note3: "(without the 2). The number under the radical sign is called the",
    radicand: "radicand",
    k1_not_radical: "Not a radical (rational)",
    k1_is_radical: "Radical (irrational)",
    anatomi_label: "🔍 ANATOMY OF A RADICAL:",
    idx_label: "INDEX (n)",
    idx_sub: "Radical power",
    radicand_label: "RADICAND (a)",
    radicand_sub: "Number under the radical",
    tip_radical: "Tip:",
    tip_radical2: "Easy way to identify radicals — check if the radicand is a perfect square (1, 4, 9, 16, 25, …). If yes, the result is an integer (not a radical). If not, it's a radical!",
    sec_c1: "📝 Practice Problems — Introduction to Radicals",
    c1_easy_q: "From the following list, identify which are radicals and which are not:",
    c1_easy_check: "Step:",
    c1_easy_check2: "Check if the radicand is a perfect square.",
    c1_not: "Not a radical",
    c1_is: "Radical",
    c1_med_q: "A square garden has an area of",
    c1_med_q2: ". Find the side length of the garden in radical form!",
    c1_med_s1: "Use the area formula for a square",
    c1_med_s2: "Find",
    c1_med_s2b: ":",
    c1_med_s3: "Check if 75 is a perfect square →",
    c1_med_s3b: "no",
    c1_med_s3c: ", since",
    c1_med_s3d: "and",
    c1_med_ans: "Side length =",
    c1_med_ans2: "m (radical form)",
    c1_hard_q: "Calculate the value of",
    c1_hard_q2: "and determine whether the result is a radical. Explain!",
    c1_hard_s1: "The cube root of a negative number is allowed (since",
    c1_hard_s1b: ").",
    c1_hard_s2: "Examine the result:",
    c1_hard_s2b: "The result is",
    c1_hard_s2c: ", which is an integer (rational number).",
    c1_hard_ans: "NOT a radical expression",
    c1_hard_ans2: ", since the result is rational (",
    c1_hard_ans3: ").",
    kesimpulan: "Conclusion:",
    sec_k2: "📘 Section 2: Relationship Between Radicals & Fractional Exponents",
    k2_intro: "Radical expressions and fractional exponents are",
    k2_intro2: "two different ways to write the same thing!",
    k2_intro3: "The relationship is expressed as:",
    k2_bridge: "🌉 BRIDGE BETWEEN TWO NOTATIONS:",
    k2_pangkat: "Fractional Exponent",
    k2_akar: "Radical",
    k2_bridge_note: "Denominator of exponent = radical index · Numerator = power of radicand",
    tip_bridge: "Tip:",
    tip_bridge2: "Remember this pattern — the denominator becomes the radical index, and the numerator becomes the power inside the radical. Easy!",
    sec_c2: "📝 Practice Problems — Radicals & Fractional Exponents",
    c2_easy_q: "Convert to radical form:",
    c2_easy_rule: "Use the formula",
    c2_med_q: "Calculate the value of",
    c2_med_s1: "Convert to radical form:",
    c2_med_s2: "Find",
    c2_med_s2b: "first:",
    c2_med_s3: "Raise to the power of 3:",
    c2_med_ans: "Result: 8",
    c2_hard_q: "Simplify:",
    c2_hard_s1: "Convert all to base 3:",
    c2_hard_s2: "Substitute:",
    sec_k3: "📘 Section 3: Simplifying Radicals",
    k3_intro: "A radical is in",
    k3_sederhana: "simplest form",
    k3_intro2: "if the radicand has no perfect square factors (other than 1). How to simplify:",
    k3_intro3: "factor the radicand, then extract perfect square factors from under the radical.",
    k3_steps_title: "Simplification Steps:",
    k3_s1: "Factor the radicand into prime factors.",
    k3_s2: "Group paired factors (perfect squares).",
    k3_s3: "Extract paired factors from under the radical sign.",
    k3_vis_title: "VISUALISATION EXAMPLE",
    k3_vis_note: "Not simplified → Factor → Simplified ✓",
    tip_k3: "Tip:",
    tip_k3b: "Find the largest perfect square factor of the radicand to minimise steps! For example with",
    tip_k3c: ", directly find 36 (not 4 or 9) for efficiency.",
    sec_c3: "📝 Practice Problems — Simplifying Radicals",
    c3_easy_q: "Simplify:",
    c3_easy_s1: "Find the largest perfect square factor of 48:",
    c3_easy_s1b: "48 = 16 × 3 (since 16 = 4² is the largest perfect square factor)",
    c3_easy_ans: "Result:",
    c3_med_q: "Simplify:",
    c3_med_s1: "Simplify each term:",
    c3_med_s2: "Combine like terms:",
    c3_hard_q: "Simplify:",
    c3_hard_s1: "Simplify the numerator:",
    c3_hard_s2: "Rationalise the denominator (multiply by",
    c3_hard_s2b: "):",
    c3_hard_s3: "Simplify:",
    c3_hard_ans: "Result:",
    sec_k4: "📘 Section 4: Operations with Radicals",
    k4_add: "Addition/Subtraction of Radicals:",
    k4_add_note: "Only radicals with the SAME radicand can be added/subtracted:",
    k4_mul: "Multiplication of Radicals:",
    k4_div: "Division / Rationalisation:",
    tip_k4: "Tip:",
    tip_k4b: "Radicals",
    tip_k4c: "cannot be added directly! Simplify first — they may become like terms.",
    sec_c4: "📝 Practice Problems — Operations with Radicals",
    sec_k5: "📘 Section 5: Rationalising the Denominator",
    k5_intro: "Rationalising the denominator is the process of eliminating radicals from the denominator of a fraction. This is required for the expression to be in",
    k5_intro2: "simplest form",
    k5_intro3: ".",
    k5_t1_title: "Type 1 — Single radical denominator:",
    k5_t2_title: "Type 2 — Binomial radical denominator:",
    k5_konj: "Conjugate",
    k5_konj2: "of",
    k5_konj3: "is",
    tip_k5: "Tip:",
    tip_k5b: "The difference of squares always helps when rationalising a binomial denominator!",
    sec_c5: "📝 Practice Problems — Rationalising the Denominator",
    c5_easy_q: "Rationalise the denominator:",
    c5_med_q: "Rationalise the denominator:",
    c5_hard_q: "Rationalise the denominator:",
    kalikan_conj: "Multiply by the conjugate:",
    gunakan_selisih: "Use the difference of squares:",
    sec_k6: "📘 Section 6: Nested Radicals",
    k6_intro: "A nested radical is a radical containing another radical inside. There is a special formula to simplify the form",
    k6_formula_note: "If",
    k6_formula_note2: "then:",
    k6_steps_title: "Identification Steps:",
    k6_s1: "Find the value of",
    k6_s1b: "from the middle radical term:",
    k6_s2: "Find values",
    k6_s2b: "and",
    k6_s2c: "such that",
    k6_s3: "Substitute into the formula.",
    tip_k6: "Tip:",
    tip_k6b: "Not all nested radicals can be simplified! This only works if",
    tip_k6c: "and",
    tip_k6d: "are perfect squares.",
    sec_c6: "📝 Practice Problems — Nested Radicals",
    step: "Step",
    pembahasan: "SOLUTION:",
    example: "Example",
    diff_easy: "EASY",
    diff_med: "MEDIUM",
    diff_hard: "HARD",
    sederhanakan: "Simplify:",
    hitung: "Calculate:",
    rasionalkan: "Rationalise the denominator:",
    hasil: "Result:",
    karena: "since",
    dan: "and",
    jika: "If",
    maka: "then",
    perhatikan: "Observe:",
    langkah: "Step",
    nilai: "value",
    akar_bertingkat: "nested radical",
    dengan: "with",
  },
  ja: {
    pageTitle: "根号の表現",
    pageSub: "中学3年 · 累乗・指数 · 数学教材",
    sec_intro: "🌟 なぜ根号を学ぶ必要があるか？",
    intro_p: "面積5 cm²の正方形の一辺の長さを求めようとしたことはある？答えは",
    intro_p2: "cm — 整数でも分数でもない。これが",
    intro_p3: "根号の表現（無理数）",
    intro_p4: "だ！",
    intro_highlight: "根号はいたるところに現れる：スマホの画面の対角線、地図上の距離、音波の速さまで。理解すれば、より高いレベルの数学に進める！ 🚀",
    intro_note: "注意：",
    intro_note2: "この単元は指数と密接に関係している。先に指数の概念を理解してから進もう！",
    badge_intisari: "🎯 要点まとめ",
    sec_k1: "📘 第1節：根号とは何か？",
    k1_def: "は、",
    bentukAkar: "根号の表現",
    k1_def2: "有理数（整数や分数）に簡略化できない",
    k1_def3: "数の根のこと。一般に、数",
    k1_def4: "の",
    k1_def5: "乗根は次のように定義される：",
    k1_n2_note: "",
    k1_n2_note2: "のとき、根号は",
    k1_n2_note3: "（2なし）と書く。根号の中の数を",
    radicand: "被開数（radicand）",
    k1_not_radical: "根号ではない（有理数）",
    k1_is_radical: "根号（無理数）",
    anatomi_label: "🔍 根号の構造：",
    idx_label: "指数（n）",
    idx_sub: "根号の次数",
    radicand_label: "被開数（a）",
    radicand_sub: "根号の中の数",
    tip_radical: "ヒント：",
    tip_radical2: "根号の見分け方 — 被開数が完全平方数（1, 4, 9, 16, 25, …）かどうか確認。そうなら整数（根号なし）。そうでなければ根号！",
    sec_c1: "📝 練習問題 — 根号の概念",
    c1_easy_q: "次のリストの中で根号であるものとそうでないものを判定せよ：",
    c1_easy_check: "手順：",
    c1_easy_check2: "被開数が完全平方数かどうか確認する。",
    c1_not: "根号ではない",
    c1_is: "根号",
    c1_med_q: "面積が",
    c1_med_q2: "の正方形の庭の一辺の長さを根号の形で求めよ！",
    c1_med_s1: "正方形の面積の公式を使う",
    c1_med_s2: "",
    c1_med_s2b: "を求める：",
    c1_med_s3: "75が完全平方数かどうか確認 →",
    c1_med_s3b: "否",
    c1_med_s3c: "（",
    c1_med_s3d: "かつ",
    c1_med_ans: "庭の一辺の長さ =",
    c1_med_ans2: "m（根号の形）",
    c1_hard_q: "の値を求め、結果が根号か否かを判定して説明せよ！",
    c1_hard_q2: "",
    c1_hard_s1: "負数の立方根は許される（",
    c1_hard_s1b: "なので）。",
    c1_hard_s2: "結果を確認：",
    c1_hard_s2b: "結果は",
    c1_hard_s2c: "で、整数（有理数）。",
    c1_hard_ans: "根号ではない",
    c1_hard_ans2: "、結果が有理数（",
    c1_hard_ans3: "）なので。",
    kesimpulan: "結論：",
    sec_k2: "📘 第2節：根号と分数指数の関係",
    k2_intro: "根号と分数指数は",
    k2_intro2: "同じものを別の方法で書いている！",
    k2_intro3: "その関係は：",
    k2_bridge: "🌉 2つの表記の橋：",
    k2_pangkat: "分数指数",
    k2_akar: "根号",
    k2_bridge_note: "分母 = 根号の次数 · 分子 = 被開数の指数",
    tip_bridge: "ヒント：",
    tip_bridge2: "このパターンを覚えよう — 分母が根号の次数になり、分子が根号内の指数になる。簡単！",
    sec_c2: "📝 練習問題 — 根号と分数指数",
    c2_easy_q: "根号の形に変換せよ：",
    c2_easy_rule: "公式を使う",
    c2_med_q: "の値を計算せよ",
    c2_med_s1: "根号の形に変換：",
    c2_med_s2: "",
    c2_med_s2b: "をまず求める：",
    c2_med_s3: "3乗する：",
    c2_med_ans: "結果：8",
    c2_hard_q: "簡略化せよ：",
    c2_hard_s1: "すべて底3に変換：",
    c2_hard_s2: "代入：",
    sec_k3: "📘 第3節：根号の簡略化",
    k3_intro: "根号が",
    k3_sederhana: "最も簡単な形",
    k3_intro2: "とは、被開数に完全平方因数（1以外）がない状態。簡略化の方法：",
    k3_intro3: "被開数を因数分解し、完全平方因数を根号の外に出す。",
    k3_steps_title: "簡略化の手順：",
    k3_s1: "被開数を素因数分解する。",
    k3_s2: "ペアになった因数（完全平方数）をグループ化する。",
    k3_s3: "ペアになった因数を根号の外に出す。",
    k3_vis_title: "可視化の例",
    k3_vis_note: "未簡略 → 因数分解 → 簡略化済み ✓",
    tip_k3: "ヒント：",
    tip_k3b: "ステップを短くするため、最大の完全平方因数を探そう！例えば",
    tip_k3c: "なら36を直接探す（4や9ではなく）。",
    sec_c3: "📝 練習問題 — 根号の簡略化",
    c3_easy_q: "簡略化せよ：",
    c3_easy_s1: "48の最大完全平方因数を探す：",
    c3_easy_s1b: "48 = 16 × 3（16 = 4²が最大の完全平方因数）",
    c3_easy_ans: "結果：",
    c3_med_q: "簡略化せよ：",
    c3_med_s1: "各項を簡略化：",
    c3_med_s2: "同類項をまとめる：",
    c3_hard_q: "簡略化せよ：",
    c3_hard_s1: "分子を簡略化：",
    c3_hard_s2: "分母を有理化（",
    c3_hard_s2b: "を掛ける）：",
    c3_hard_s3: "簡略化：",
    c3_hard_ans: "結果：",
    sec_k4: "📘 第4節：根号の演算",
    k4_add: "根号の加減：",
    k4_add_note: "被開数が同じ根号だけが加減できる：",
    k4_mul: "根号の乗法：",
    k4_div: "根号の除法・有理化：",
    tip_k4: "ヒント：",
    tip_k4b: "根号",
    tip_k4c: "は直接足せない！まず簡略化してから同類項かどうか確認。",
    sec_c4: "📝 練習問題 — 根号の演算",
    sec_k5: "📘 第5節：分母の有理化",
    k5_intro: "分母の有理化とは、分数の分母から根号を取り除く操作。式を",
    k5_intro2: "最も簡単な形",
    k5_intro3: "にするために必要。",
    k5_t1_title: "タイプ1 — 単項式の分母：",
    k5_t2_title: "タイプ2 — 二項式の分母：",
    k5_konj: "共役",
    k5_konj2: "の",
    k5_konj3: "は",
    tip_k5: "ヒント：",
    tip_k5b: "二項式の有理化には平方差が常に役立つ！",
    sec_c5: "📝 練習問題 — 分母の有理化",
    c5_easy_q: "分母を有理化せよ：",
    c5_med_q: "分母を有理化せよ：",
    c5_hard_q: "分母を有理化せよ：",
    kalikan_conj: "共役を掛ける：",
    gunakan_selisih: "平方差を使う：",
    sec_k6: "📘 第6節：二重根号の簡略化",
    k6_intro: "二重根号（nested radical）は根号の中にさらに根号を含む形。",
    k6_formula_note: "もし",
    k6_formula_note2: "なら：",
    k6_steps_title: "識別の手順：",
    k6_s1: "中間の根号項から",
    k6_s1b: "の値を求める：",
    k6_s2: "値",
    k6_s2b: "と",
    k6_s2c: "を求める（",
    k6_s3: "公式に代入する。",
    tip_k6: "ヒント：",
    tip_k6b: "すべての二重根号が簡略化できるわけではない！",
    tip_k6c: "と",
    tip_k6d: "が完全平方数のときのみ有効。",
    sec_c6: "📝 練習問題 — 二重根号",
    step: "ステップ",
    pembahasan: "解説：",
    example: "例題",
    diff_easy: "基本",
    diff_med: "標準",
    diff_hard: "発展",
    sederhanakan: "簡略化せよ：",
    hitung: "計算せよ：",
    rasionalkan: "分母を有理化せよ：",
    hasil: "結果：",
    karena: "なぜなら",
    dan: "と",
    jika: "もし",
    maka: "なら",
    perhatikan: "観察：",
    langkah: "ステップ",
    nilai: "値",
    akar_bertingkat: "二重��号",
    dengan: "ただし",
  },
};

const BentukAkarPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "k1","c1","k2","c2","k3","c3","k4","c4","k5","c5","k6","c6",
  ]);
  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };
  const isOpen = (id: string) => expandedSections.includes(id);

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {isOpen(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const diffCfg = (level: "easy" | "med" | "hard") => ({
    easy: { badge: "bg-green-500/20 text-green-400", bar: "border-l-4 border-green-500", hdr: "text-green-400", bg: "bg-green-500/5 border border-green-500/20" },
    med:  { badge: "bg-yellow-500/20 text-yellow-400", bar: "border-l-4 border-yellow-500", hdr: "text-yellow-400", bg: "bg-yellow-500/5 border border-yellow-500/20" },
    hard: { badge: "bg-red-500/20 text-red-400", bar: "border-l-4 border-red-500", hdr: "text-red-400", bg: "bg-red-500/5 border border-red-500/20" },
  }[level]);

  const ExBlock = ({
    level, n, soal, solution,
  }: { level: "easy" | "med" | "hard"; n: number; soal: React.ReactNode; solution: React.ReactNode }) => {
    const dc = diffCfg(level);
    const diffLabel = level === "easy" ? t.diff_easy : level === "med" ? t.diff_med : t.diff_hard;
    return (
      <div className={`${dc.bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${dc.badge}`}>{diffLabel}</span>
          <span className="font-body font-semibold text-white">{t.example} {n}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white">{soal}</div>
        <div className={`${dc.bg} rounded-lg p-4`}>
          <p className={`font-body text-xs font-semibold mb-3 ${dc.hdr}`}>{t.pembahasan}</p>
          <div className="space-y-2 font-body text-sm text-white/80">{solution}</div>
        </div>
      </div>
    );
  };

  const Dark = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-900/50 rounded p-3">{children}</div>
  );

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

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_intro} />
            {isOpen("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro_p} <InlineMath math="\sqrt{5}" /> {t.intro_p2} <strong className="text-cyan-300">{t.intro_p3}</strong>{t.intro_p4}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">{t.intro_highlight}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.intro_note}</strong> {t.intro_note2}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.sec_k1} />
            {isOpen("k1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">{t.bentukAkar}</strong> {t.k1_def} <em>{t.k1_def2}</em> {t.k1_def3} <InlineMath math="n" /> {t.k1_def4} <InlineMath math="a" /> {t.k1_def5}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="\sqrt[n]{a} = b \iff b^n = a, \quad a \geq 0,\; b \geq 0" />
                  </div>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k1_n2_note} <InlineMath math="n = 2" /> {t.k1_n2_note2} <InlineMath math="\sqrt{\;}" /> {t.k1_n2_note3} <strong className="text-green-300">{t.radicand}</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{t.k1_not_radical}</p>
                      <p className="font-body text-sm text-white"><InlineMath math="\sqrt{9} = 3" /></p>
                      <p className="font-body text-sm text-white"><InlineMath math="\sqrt{49} = 7" /></p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/60 mb-1">{t.k1_is_radical}</p>
                      <p className="font-body text-sm text-cyan-300"><InlineMath math="\sqrt{2},\; \sqrt{3},\; \sqrt{5}" /></p>
                      <p className="font-body text-sm text-cyan-300"><InlineMath math="\sqrt{7},\; \sqrt{11}" /></p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.anatomi_label}</p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-green-900/60 to-teal-900/60 border-2 border-green-500/50 rounded-xl px-10 py-5 text-center">
                      <span className="font-display text-2xl font-bold text-yellow-400 align-super mr-1">n</span>
                      <span className="font-display text-5xl font-bold text-white">√</span>
                      <span className="font-display text-4xl font-bold text-cyan-300">a</span>
                    </div>
                    <div className="flex justify-around w-full text-xs font-body">
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-yellow-400 mx-auto mb-1"></div>
                        <span className="text-yellow-300 font-semibold">{t.idx_label}</span>
                        <br /><span className="text-white/60">{t.idx_sub}</span>
                      </div>
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-cyan-400 mx-auto mb-1"></div>
                        <span className="text-cyan-300 font-semibold">{t.radicand_label}</span>
                        <br /><span className="text-white/60">{t.radicand_sub}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_radical}</strong> {t.tip_radical2}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c1" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title={t.sec_c1} />
            {isOpen("c1") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.c1_easy_q}<br /><InlineMath math="\sqrt{16},\quad \sqrt{20},\quad \sqrt{36},\quad \sqrt{50}" /></>}
                  solution={<>
                    <p><strong>{t.c1_easy_check}</strong> {t.c1_easy_check2}</p>
                    <Dark>
                      <div className="space-y-1 text-sm">
                        <p><InlineMath math="\sqrt{16} = 4" /> → <span className="text-red-400 font-semibold">{t.c1_not}</span> (16 = 4²)</p>
                        <p><InlineMath math="\sqrt{20}" /> → <span className="text-green-400 font-semibold">{t.c1_is}</span></p>
                        <p><InlineMath math="\sqrt{36} = 6" /> → <span className="text-red-400 font-semibold">{t.c1_not}</span> (36 = 6²)</p>
                        <p><InlineMath math="\sqrt{50}" /> → <span className="text-green-400 font-semibold">{t.c1_is}</span></p>
                      </div>
                    </Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>
                    {t.c1_med_q}{" "}
                    {/* KaTeX fix: use \mathrm for unit */}
                    <InlineMath math="75\,\mathrm{m}^2" />
                    {" "}{t.c1_med_q2}
                  </>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c1_med_s1} <InlineMath math="L = s^2" /></p>
                    <p><strong>{t.step} 2:</strong> {t.c1_med_s2} <InlineMath math="s" />{t.c1_med_s2b}</p>
                    <Dark><BlockMath math="s = \sqrt{L} = \sqrt{75}" /></Dark>
                    <p><strong>{t.step} 3:</strong> {t.c1_med_s3} <strong>{t.c1_med_s3b}</strong>{t.c1_med_s3c} <InlineMath math="8^2 = 64" /> {t.c1_med_s3d} <InlineMath math="9^2 = 81" />.</p>
                    <p><strong className="text-primary">{t.c1_med_ans} <InlineMath math="\sqrt{75}" /> {t.c1_med_ans2}</strong></p>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.c1_hard_q} <InlineMath math="\sqrt[3]{-125}" /> {t.c1_hard_q2}</>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c1_hard_s1} <InlineMath math="(-5)^3 = -125" />{t.c1_hard_s1b}</p>
                    <Dark><BlockMath math="\sqrt[3]{-125} = -5" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.c1_hard_s2}</p>
                    <p>{t.c1_hard_s2b} <InlineMath math="-5" />{t.c1_hard_s2c}</p>
                    <p><strong className="text-primary">{t.kesimpulan} <InlineMath math="\sqrt[3]{-125}" /> {t.c1_hard_ans}</strong>{t.c1_hard_ans2}<InlineMath math="-5" />{t.c1_hard_ans3}</p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* SUB-BAB 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k2" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title={t.sec_k2} />
            {isOpen("k2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k2_intro} <strong className="text-purple-300">{t.k2_intro2}</strong> {t.k2_intro3}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-3">
                    <BlockMath math="a^{\frac{1}{n}} = \sqrt[n]{a}" />
                    <BlockMath math="a^{\frac{m}{n}} = \sqrt[n]{a^m} = \left(\sqrt[n]{a}\right)^m" />
                  </div>
                  <div className="bg-purple-900/30 rounded p-3">
                    <p className="text-purple-300 font-semibold text-sm">{t.example}:</p>
                    <p className="text-white/80 mt-1 text-sm"><InlineMath math="25^{\frac{1}{2}} = \sqrt{25} = 5" /></p>
                    <p className="text-white/80 text-sm"><InlineMath math="8^{\frac{2}{3}} = \sqrt[3]{8^2} = \sqrt[3]{64} = 4" /></p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.k2_bridge}</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="bg-purple-900/50 border border-purple-500/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-300 mb-1">{t.k2_pangkat}</p>
                      <p className="text-white font-bold text-lg"><InlineMath math="a^{\frac{m}{n}}" /></p>
                    </div>
                    <div className="text-2xl text-primary font-bold">⇌</div>
                    <div className="bg-green-900/50 border border-green-500/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-300 mb-1">{t.k2_akar}</p>
                      <p className="text-white font-bold text-lg"><InlineMath math="\sqrt[n]{a^m}" /></p>
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-900/50 rounded p-2 text-center">
                    <p className="font-body text-xs text-white/60">{t.k2_bridge_note}</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.tip_bridge}</strong> {t.tip_bridge2}</p>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 3: PENYEDERHANAAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k3" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_k3} />
            {isOpen("k3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.k3_intro} <strong className="text-cyan-300">{t.k3_sederhana}</strong> {t.k3_intro2} <em>{t.k3_intro3}</em>
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2 text-center">
                    <BlockMath math="\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}" />
                    <BlockMath math="\sqrt{m^2 \cdot k} = m\sqrt{k}, \quad m > 0" />
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.k3_steps_title}</p>
                    <ol className="space-y-1 font-body text-sm text-white/80 list-decimal list-inside">
                      <li>{t.k3_s1}</li>
                      <li>{t.k3_s2}</li>
                      <li>{t.k3_s3}</li>
                    </ol>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">📊 {t.k3_vis_title} <InlineMath math="\sqrt{72}" />:</p>
                  <div className="space-y-2">
                    <Dark><BlockMath math="72 = 4 \times 18 = 4 \times 9 \times 2 = 36 \times 2" /></Dark>
                    <div className="flex items-center gap-2 justify-center text-sm font-body text-white/80">
                      <div className="bg-red-900/40 border border-red-500/40 rounded px-3 py-1"><InlineMath math="\sqrt{72}" /></div>
                      <span className="text-primary">→</span>
                      <div className="bg-yellow-900/40 border border-yellow-500/40 rounded px-3 py-1"><InlineMath math="\sqrt{36 \times 2}" /></div>
                      <span className="text-primary">→</span>
                      <div className="bg-green-900/40 border border-green-500/40 rounded px-3 py-1"><InlineMath math="6\sqrt{2}" /></div>
                    </div>
                    <p className="text-xs text-white/50 text-center font-body">{t.k3_vis_note}</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_k3}</strong> {t.tip_k3b} <InlineMath math="\sqrt{72}" />{t.tip_k3c}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c3" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_c3} />
            {isOpen("c3") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.c3_easy_q} <InlineMath math="\sqrt{48}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c3_easy_s1}</p>
                    <p className="text-white/60 text-xs">{t.c3_easy_s1b}</p>
                    <Dark><BlockMath math="\sqrt{48} = \sqrt{16 \times 3} = \sqrt{16} \times \sqrt{3} = 4\sqrt{3}" /></Dark>
                    <p><strong className="text-primary">{t.c3_easy_ans} <InlineMath math="4\sqrt{3}" /></strong></p>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.c3_med_q} <InlineMath math="3\sqrt{50} - \sqrt{32} + 2\sqrt{8}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c3_med_s1}</p>
                    <Dark>
                      <BlockMath math="3\sqrt{50} = 3\sqrt{25 \times 2} = 15\sqrt{2}" />
                      <BlockMath math="\sqrt{32} = \sqrt{16 \times 2} = 4\sqrt{2}" />
                      <BlockMath math="2\sqrt{8} = 2\sqrt{4 \times 2} = 4\sqrt{2}" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong> {t.c3_med_s2}</p>
                    <Dark><BlockMath math="15\sqrt{2} - 4\sqrt{2} + 4\sqrt{2} = 15\sqrt{2}" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.c3_hard_q} <InlineMath math="\dfrac{3\sqrt{6} + \sqrt{24}}{\sqrt{3}}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c3_hard_s1}</p>
                    <Dark><BlockMath math="3\sqrt{6} + \sqrt{24} = 3\sqrt{6} + 2\sqrt{6} = 5\sqrt{6}" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.c3_hard_s2} <InlineMath math="\sqrt{3}" />{t.c3_hard_s2b}</p>
                    <Dark>
                      {/* KaTeX fix: removed \text{dengan} — use JSX text */}
                      <BlockMath math="\frac{5\sqrt{6}}{\sqrt{3}} = \frac{5\sqrt{6} \cdot \sqrt{3}}{\sqrt{3} \cdot \sqrt{3}} = \frac{5\sqrt{18}}{3}" />
                    </Dark>
                    <p><strong>{t.step} 3:</strong> {t.c3_hard_s3}</p>
                    <Dark><BlockMath math="\frac{5\sqrt{18}}{3} = \frac{5 \cdot 3\sqrt{2}}{3} = 5\sqrt{2}" /></Dark>
                    <p><strong className="text-primary">{t.c3_hard_ans} <InlineMath math="5\sqrt{2}" /></strong></p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* SUB-BAB 4: OPERASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title={t.sec_k4} />
            {isOpen("k4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.badge_intisari}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-orange-300 mb-2">{t.k4_add}</p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.k4_add_note}</p>
                      <BlockMath math="a\sqrt{b} \pm c\sqrt{b} = (a \pm c)\sqrt{b}" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-orange-300 mb-2">{t.k4_mul}</p>
                      <BlockMath math="\sqrt{a} \times \sqrt{b} = \sqrt{a \times b}" />
                      <BlockMath math="p\sqrt{a} \times q\sqrt{b} = pq\sqrt{ab}" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-orange-300 mb-2">{t.k4_div}</p>
                      <BlockMath math="\frac{\sqrt{a}}{\sqrt{b}} = \sqrt{\frac{a}{b}}" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_k4}</strong> {t.tip_k4b} <InlineMath math="\sqrt{2} + \sqrt{3}" /> {t.tip_k4c}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title={t.sec_c4} />
            {isOpen("c4") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.hitung} <InlineMath math="2\sqrt{3} + 5\sqrt{3} - \sqrt{3}" /></>}
                  solution={<>
                    <Dark><BlockMath math="2\sqrt{3} + 5\sqrt{3} - \sqrt{3} = (2+5-1)\sqrt{3} = 6\sqrt{3}" /></Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.hitung} <InlineMath math="\sqrt{12} + \sqrt{27} - \sqrt{48}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong></p>
                    <Dark>
                      <BlockMath math="\sqrt{12} = 2\sqrt{3},\;\sqrt{27} = 3\sqrt{3},\;\sqrt{48} = 4\sqrt{3}" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong></p>
                    <Dark><BlockMath math="2\sqrt{3} + 3\sqrt{3} - 4\sqrt{3} = \sqrt{3}" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.hitung} <InlineMath math="(\sqrt{3} + \sqrt{2})(\sqrt{3} - \sqrt{2})" /></>}
                  solution={<>
                    <Dark>
                      <BlockMath math="(\sqrt{3} + \sqrt{2})(\sqrt{3} - \sqrt{2}) = (\sqrt{3})^2 - (\sqrt{2})^2 = 3 - 2 = 1" />
                    </Dark>
                  </>}
                />
              </div>
            )}
          </div>

          {/* SUB-BAB 5: MERASIONALKAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k5" icon={<Target className="w-5 h-5" />} iconColor="text-pink-400" title={t.sec_k5} />
            {isOpen("k5") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-pink-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80">{t.k5_intro} <strong className="text-pink-300">{t.k5_intro2}</strong>{t.k5_intro3}</p>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-pink-300 mb-2">{t.k5_t1_title}</p>
                    <BlockMath math="\frac{a}{\sqrt{b}} = \frac{a}{\sqrt{b}} \times \frac{\sqrt{b}}{\sqrt{b}} = \frac{a\sqrt{b}}{b}" />
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-pink-300 mb-2">{t.k5_t2_title}</p>
                    <p className="font-body text-xs text-white/60 mb-2">
                      {t.k5_konj} <InlineMath math="(\sqrt{a} + \sqrt{b})" /> {t.k5_konj2} <InlineMath math="(\sqrt{a} + \sqrt{b})" /> {t.k5_konj3} <InlineMath math="(\sqrt{a} - \sqrt{b})" />
                    </p>
                    <BlockMath math="\frac{c}{\sqrt{a} + \sqrt{b}} \times \frac{\sqrt{a} - \sqrt{b}}{\sqrt{a} - \sqrt{b}} = \frac{c(\sqrt{a} - \sqrt{b})}{a - b}" />
                    <BlockMath math="\frac{c}{\sqrt{a} - \sqrt{b}} \times \frac{\sqrt{a} + \sqrt{b}}{\sqrt{a} + \sqrt{b}} = \frac{c(\sqrt{a} + \sqrt{b})}{a - b}" />
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.tip_k5}</strong> {t.tip_k5b}</p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 5 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c5" icon={<Calculator className="w-5 h-5" />} iconColor="text-pink-400" title={t.sec_c5} />
            {isOpen("c5") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.c5_easy_q} <InlineMath math="\dfrac{6}{\sqrt{3}}" /></>}
                  solution={<>
                    <Dark>
                      <BlockMath math="\frac{6}{\sqrt{3}} = \frac{6}{\sqrt{3}} \times \frac{\sqrt{3}}{\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}" />
                    </Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.c5_med_q} <InlineMath math="\dfrac{8}{\sqrt{6} - \sqrt{2}}" /></>}
                  solution={<>
                    <p>{t.kalikan_conj} <InlineMath math="(\sqrt{6}+\sqrt{2})" />:</p>
                    <Dark>
                      <BlockMath math="\frac{8}{\sqrt{6}-\sqrt{2}} \times \frac{\sqrt{6}+\sqrt{2}}{\sqrt{6}+\sqrt{2}} = \frac{8(\sqrt{6}+\sqrt{2})}{(\sqrt{6})^2 - (\sqrt{2})^2}" />
                    </Dark>
                    <p><strong>{t.step} 1:</strong> {t.gunakan_selisih}</p>
                    <Dark>
                      <BlockMath math="(\sqrt{6})^2 - (\sqrt{2})^2 = 6 - 2 = 4" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong></p>
                    <Dark>
                      <BlockMath math="\frac{8(\sqrt{6}+\sqrt{2})}{4} = 2(\sqrt{6}+\sqrt{2}) = 2\sqrt{6}+2\sqrt{2}" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} <InlineMath math="2\sqrt{6}+2\sqrt{2}" /></strong></p>
                  </>}
                />
                <ExBlock level="med" n={3}
                  soal={<>{t.rasionalkan} <InlineMath math="\dfrac{4}{\sqrt{5}+1}" /></>}
                  solution={<>
                    <p>{t.kalikan_conj} <InlineMath math="(\sqrt{5}-1)" />:</p>
                    <Dark>
                      <BlockMath math="\frac{4}{\sqrt{5}+1} \times \frac{\sqrt{5}-1}{\sqrt{5}-1} = \frac{4(\sqrt{5}-1)}{(\sqrt{5})^2 - 1^2}" />
                    </Dark>
                    <p><strong>{t.step} 1:</strong> {t.gunakan_selisih}</p>
                    <Dark>
                      <BlockMath math="(\sqrt{5})^2 - 1^2 = 5 - 1 = 4" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong></p>
                    <Dark>
                      <BlockMath math="\frac{4(\sqrt{5}-1)}{4} = \sqrt{5}-1" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} <InlineMath math="\sqrt{5}-1" /></strong></p>
                  </>}
                />
                <ExBlock level="hard" n={4}
                  soal={<>{t.c5_hard_q} <InlineMath math="\dfrac{3\sqrt{3} - 2\sqrt{2}}{3\sqrt{3} + 2\sqrt{2}}" /></>}
                  solution={<>
                    <p>{t.kalikan_conj} <InlineMath math="(3\sqrt{3} - 2\sqrt{2})" />:</p>
                    <Dark>
                      <BlockMath math="\frac{3\sqrt{3} - 2\sqrt{2}}{3\sqrt{3} + 2\sqrt{2}} \times \frac{3\sqrt{3} - 2\sqrt{2}}{3\sqrt{3} - 2\sqrt{2}} = \frac{(3\sqrt{3} - 2\sqrt{2})^2}{(3\sqrt{3})^2 - (2\sqrt{2})^2}" />
                    </Dark>
                    <p><strong>{t.step} 1:</strong> {t.gunakan_selisih}</p>
                    <Dark>
                      <BlockMath math="(3\sqrt{3})^2 - (2\sqrt{2})^2 = 27 - 8 = 19" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong></p>
                    <Dark>
                      <BlockMath math="(3\sqrt{3} - 2\sqrt{2})^2 = 27 - 2 \cdot 3\sqrt{3} \cdot 2\sqrt{2} + 8 = 35 - 12\sqrt{6}" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} <InlineMath math="\dfrac{35 - 12\sqrt{6}}{19}" /></strong></p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* SUB-BAB 6: AKAR BERTINGKAT */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k6" icon={<Target className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec_k6} />
            {isOpen("k6") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-violet-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80">{t.k6_intro}</p>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-violet-300 mb-2">{t.k6_formula_note} <InlineMath math="a > b > 0" /> {t.k6_formula_note2}</p>
                    {/* KaTeX fix: removed \text{dengan } — use JSX */}
                    <BlockMath math="\sqrt{a + b + 2\sqrt{ab}} = \sqrt{a} + \sqrt{b}" />
                    <BlockMath math="\sqrt{a + b - 2\sqrt{ab}} = \sqrt{a} - \sqrt{b}" />
                    <p className="font-body text-xs text-white/60 mt-1">{t.dengan} <InlineMath math="a > b" /></p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-violet-300 mb-2">{t.k6_steps_title}</p>
                    <ol className="space-y-1 font-body text-sm text-white/80 list-decimal list-inside">
                      <li>{t.k6_s1} <InlineMath math="ab" /> {t.k6_s1b} <InlineMath math="2\sqrt{ab}" /></li>
                      <li>{t.k6_s2} <InlineMath math="a" /> {t.k6_s2b} <InlineMath math="b" /> {t.k6_s2c} <InlineMath math="a + b" /> = (constant) {t.dan} <InlineMath math="ab" /> = (constant)</li>
                      <li>{t.k6_s3}</li>
                    </ol>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_k6}</strong> {t.tip_k6b} <InlineMath math="a" /> {t.tip_k6c} <InlineMath math="b" /> {t.tip_k6d}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 6 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c6" icon={<Calculator className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec_c6} />
            {isOpen("c6") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.sederhanakan} <InlineMath math="\sqrt{5 + 2\sqrt{6}}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> <InlineMath math="5 + 2\sqrt{6} = 3 + 2\sqrt{6} + 2" /></p>
                    <p><InlineMath math="2\sqrt{6} = 2\sqrt{2 \times 3}" />, {t.karena} <InlineMath math="a=3, b=2" /></p>
                    <Dark><BlockMath math="\sqrt{5 + 2\sqrt{6}} = \sqrt{3} + \sqrt{2}" /></Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.sederhanakan} <InlineMath math="\sqrt{7 - 2\sqrt{12}}" /></>}
                  solution={<>
                    <p><InlineMath math="7 - 2\sqrt{12} = 4 - 2\sqrt{12} + 3" />, {t.karena} <InlineMath math="a=4, b=3" /></p>
                    <Dark><BlockMath math="\sqrt{7 - 2\sqrt{12}} = \sqrt{4} - \sqrt{3} = 2 - \sqrt{3}" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.sederhanakan} <InlineMath math="\sqrt{11 - 6\sqrt{2}}" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> <InlineMath math="6\sqrt{2} = 2\sqrt{18} = 2\sqrt{9 \times 2}" />, {t.karena} <InlineMath math="ab = 9, \; 2\sqrt{ab} = 6\sqrt{2}" /></p>
                    <p><InlineMath math="a + b = 11,\; ab = 9 \Rightarrow a=9, b=2" /></p>
                    <Dark><BlockMath math="\sqrt{11 - 6\sqrt{2}} = \sqrt{9} - \sqrt{2} = 3 - \sqrt{2}" /></Dark>
                  </>}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BentukAkarPage;
