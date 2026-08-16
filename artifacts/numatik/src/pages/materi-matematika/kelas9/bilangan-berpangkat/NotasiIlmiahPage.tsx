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
    pageTitle: "NOTASI ILMIAH",
    pageSub: "Kelas 9 · Bilangan Berpangkat · Materi Matematika",
    // Intro
    sec_intro: "🔭 Ketika Angka Terlalu Besar atau Terlalu Kecil...",
    intro_p1: "Jarak dari Bumi ke Matahari sekitar",
    intro_p1b: "meter.",
    intro_p2: "Massa sebuah elektron hanya",
    intro_p2b: "kg.",
    intro_p3: "Coba bayangkan betapa ribetnya menulis dan menghitung dengan angka-angka seperti itu setiap hari!",
    intro_highlight: "Di sinilah",
    intro_highlight2: "notasi ilmiah",
    intro_highlight3: "hadir sebagai penyelamat. Para ilmuwan, insinyur, dan ahli matematika di seluruh dunia menggunakannya untuk menulis bilangan sangat besar atau sangat kecil dengan cara yang ringkas, rapi, dan mudah dihitung. 🚀",
    skala_title: "🌌 PERBANDINGAN SKALA:",
    skala_bumi: "Jarak Bumi–Matahari:",
    skala_elektron: "Massa elektron:",
    skala_cahaya: "Kecepatan cahaya:",
    intro_note: "Catatan:",
    intro_note2: "Notasi ilmiah tidak hanya dipakai di fisika dan kimia — tapi juga di ilmu komputer (ukuran data), astronomi, biologi (ukuran sel), dan keuangan (nilai GDP negara)!",
    badge_intisari: "🎯 Ringkasan Intisari",
    // Sub-bab 1
    sec_k1: "📘 Sub-Bab 1: Bentuk Umum Notasi Ilmiah",
    k1_def: "adalah cara penulisan bilangan dalam bentuk perkalian antara suatu bilangan dengan pangkat sepuluh. Bentuk umumnya adalah:",
    notasiIlmiah: "Notasi ilmiah",
    k1_syarat: "dengan syarat:",
    k1_a: "Koefisien (a)",
    k1_a_desc: "Bilangan desimal antara 1 dan 10 (tidak termasuk 10)",
    k1_a_ex: "Contoh: 1,5 · 2,7 · 9,99",
    k1_n: "Pangkat (n)",
    k1_n_desc: "Bilangan bulat positif, negatif, atau nol",
    k1_n_ex: "Positif → besar · Negatif → kecil",
    k1_wrong: "Bukan notasi ilmiah",
    k1_wrong_note: "(12 ≥ 10, salah!)",
    k1_right: "Notasi ilmiah yang benar",
    k1_right_note: "(1 ≤ 1,2 < 10 ✓)",
    anatomi_label: "🔍 ANATOMI NOTASI ILMIAH:",
    koef_label: "KOEFISIEN (a)",
    koef_sub: "1 ≤ a < 10",
    eksponen_label: "EKSPONEN (n)",
    eksponen_sub: "Bilangan bulat",
    tabel_title: "📊 TABEL NILAI PANGKAT SEPULUH:",
    col_pangkat: "Pangkat",
    col_nilai: "Nilai",
    col_nama: "Nama",
    row_miliar: "Miliar",
    row_juta: "Juta",
    row_ribu: "Ribu",
    row_satu: "Satu",
    row_sepert: "Seperseribu",
    row_seperjuta: "Seperjuta",
    row_sepermiliar: "Sepermiliar",
    tip_k1: "Tips Ingat:",
    tip_k1b: "Pangkat positif → geser koma ke",
    tip_k1c: "kanan",
    tip_k1d: "(bilangan makin besar). Pangkat negatif → geser koma ke",
    tip_k1e: "kiri",
    tip_k1f: "(bilangan makin kecil). Pangkat = jumlah geseran!",
    // Contoh 1
    sec_c1: "📝 Contoh Soal — Bentuk Umum Notasi Ilmiah",
    c1_easy_q: "Nyatakan bilangan",
    c1_easy_q2: "dalam bentuk notasi ilmiah!",
    c1_easy_s1: "Tentukan koefisien dengan meletakkan koma setelah angka pertama yang bukan nol:",
    c1_easy_s2: "Hitung berapa kali koma bergeser ke kiri untuk mendapat koefisien 5,7:",
    c1_easy_note1: "5",
    c1_easy_note2: "7.000.000",
    c1_easy_note3: "→ bergeser",
    c1_easy_note4: "7",
    c1_easy_note5: "langkah ke kiri",
    c1_med_q: "Ubah",
    c1_med_q2: "ke bentuk bilangan biasa!",
    c1_med_s1: "Eksponen negatif",
    c1_med_s1b: "→ geser koma ke",
    c1_med_s1c: "kiri",
    c1_med_s1d: "sebanyak 4 langkah:",
    c1_med_note: "4,05 → geser koma 4 langkah ke kiri → tambah nol di depan:",
    c1_hard_q: "Urutkan bilangan-bilangan berikut dari yang terkecil ke terbesar:",
    c1_hard_s1: "Bandingkan eksponen terlebih dahulu — semakin besar eksponen, semakin besar bilangan:",
    c1_hard_s2: "Untuk eksponen sama",
    c1_hard_s2b: ", bandingkan koefisiennya: 2,9 < 3,2.",
    // Sub-bab 2
    sec_k2: "📘 Sub-Bab 2: Aturan Penulisan Notasi Ilmiah",
    k2_intro: "Ada dua proses utama dalam penulisan notasi ilmiah: mengubah bilangan biasa ke notasi ilmiah, dan sebaliknya. Kunci utamanya adalah",
    k2_intro2: "menghitung perpindahan titik desimal",
    k2_intro3: ".",
    k2_rule1: "📌 ATURAN 1 — Bilangan Biasa → Notasi Ilmiah",
    k2_r1_1: "Letakkan titik desimal tepat setelah angka pertama yang bukan nol → inilah koefisien",
    k2_r1_2: "Hitung jumlah langkah perpindahan titik desimal → inilah nilai",
    k2_r1_3: "Jika koma bergerak ke",
    k2_r1_3b: "kiri",
    k2_r1_3c: "→ n positif. Jika ke",
    k2_r1_3d: "kanan",
    k2_r1_3e: "→ n negatif.",
    k2_rule2: "📌 ATURAN 2 — Notasi Ilmiah → Bilangan Biasa",
    k2_r2_1: "Jika",
    k2_r2_1b: ": geser titik desimal ke",
    k2_r2_1c: "kanan",
    k2_r2_1d: "sebanyak n langkah (tambah nol jika perlu).",
    k2_r2_2: "Jika",
    k2_r2_2b: ": geser titik desimal ke",
    k2_r2_2c: "kiri",
    k2_r2_2d: "sebanyak |n| langkah (tambah nol di depan jika perlu).",
    diagram_title: "↔️ DIAGRAM ARAH PERGESERAN KOMA:",
    n_neg: "n negatif",
    n_pos: "n positif",
    bil_kecil: "Bilangan kecil",
    bil_besar: "Bilangan besar",
    tip_k2: "Tips Cepat:",
    tip_k2b: "Untuk bilangan bulat positif besar, nilai n = jumlah digit dikurangi 1. Contoh: 5.000.000 punya 7 digit → n = 7 − 1 = 6, sehingga",
    // Contoh 2
    sec_c2: "📝 Contoh Soal — Aturan Penulisan Notasi Ilmiah",
    c2_easy_q: "Tuliskan",
    c2_easy_q2: "dalam notasi ilmiah!",
    c2_easy_s1: "Temukan angka pertama yang bukan nol → angka",
    c2_easy_s1b: ". Koefisien =",
    c2_easy_s2: "Hitung langkah koma dari 7,2 ke posisi awal:",
    c2_easy_note: "0,",
    c2_easy_note2: "0000007",
    c2_easy_note3: "2 → koma bergerak 7 langkah ke",
    c2_easy_note4: "kanan",
    c2_easy_note5: "→",
    c2_med_q: "Periksa apakah bilangan-bilangan berikut sudah dalam bentuk notasi ilmiah yang benar. Jika belum, perbaiki!",
    c2_med_a_check: "koefisien 0,35 < 1,",
    c2_med_a_wrong: "salah!",
    c2_med_a_fix: "Perbaikan:",
    c2_med_b_check: "koefisien 15 ≥ 10,",
    c2_med_c_check: "koefisien 6,02: 1 ≤ 6,02 < 10,",
    c2_med_c_right: "benar! ✓",
    avogadro: "(Ini adalah bilangan Avogadro yang terkenal dalam kimia!)",
    c2_hard_q: "Tentukan nilai x jika",
    c2_hard_q2: "dan hasilnya dalam notasi ilmiah!",
    // Sub-bab 3
    sec_k3: "📘 Sub-Bab 3: Operasi pada Notasi Ilmiah",
    k3_intro: "Saat melakukan operasi (tambah, kurang, kali, bagi) dengan notasi ilmiah, ada teknik khusus yang mempercepat perhitungan.",
    k3_mul: "Perkalian:",
    k3_div: "Pembagian:",
    k3_add: "Penjumlahan/Pengurangan:",
    k3_add_note: "Samakan eksponen terlebih dahulu, lalu jumlahkan/kurangkan koefisien.",
    tip_k3: "Tips:",
    tip_k3b: "Setelah operasi, pastikan koefisien hasil tetap memenuhi",
    tip_k3c: ". Jika tidak, ubah kembali ke notasi ilmiah yang benar!",
    // Contoh 3
    sec_c3: "📝 Contoh Soal — Operasi pada Notasi Ilmiah",
    c3_easy_q: "Hitunglah:",
    c3_med_q: "Hitunglah:",
    c3_hard_q: "Massa planet A adalah",
    c3_hard_q2: "kg dan massa planet B adalah",
    c3_hard_q3: "kg. Hitunglah total massa kedua planet dalam notasi ilmiah!",
    c3_hard_s1: "Samakan eksponen (gunakan pangkat yang lebih besar):",
    c3_hard_s2: "Jumlahkan koefisien:",
    // Common
    step: "Langkah",
    pembahasan: "PEMBAHASAN:",
    example: "Contoh",
    diff_easy: "MUDAH",
    diff_med: "SEDANG",
    diff_hard: "SULIT",
    hitung: "Hitunglah:",
    sederhanakan: "Sederhanakan:",
    hasil: "Hasil:",
    karena: "karena",
    dan: "dan",
    jika: "Jika",
    maka: "maka",
    langkah: "Langkah",
    nilai: "nilai",
    tentukan: "tentukan",
    ubah: "ubah",
    geser: "geser koma",
    langkah_lbl: "langkah ke",
  },
  en: {
    pageTitle: "SCIENTIFIC NOTATION",
    pageSub: "Grade 9 · Exponents & Powers · Math Materials",
    sec_intro: "🔭 When Numbers Are Too Large or Too Small...",
    intro_p1: "The distance from Earth to the Sun is about",
    intro_p1b: "meters.",
    intro_p2: "The mass of an electron is only",
    intro_p2b: "kg.",
    intro_p3: "Imagine having to write and compute with such numbers every day!",
    intro_highlight: "This is where",
    intro_highlight2: "scientific notation",
    intro_highlight3: "comes to the rescue. Scientists, engineers, and mathematicians worldwide use it to write very large or very small numbers concisely, neatly, and efficiently. 🚀",
    skala_title: "🌌 SCALE COMPARISON:",
    skala_bumi: "Earth–Sun distance:",
    skala_elektron: "Electron mass:",
    skala_cahaya: "Speed of light:",
    intro_note: "Note:",
    intro_note2: "Scientific notation isn't just for physics and chemistry — it's also used in computer science (data sizes), astronomy, biology (cell sizes), and finance (GDP values)!",
    badge_intisari: "🎯 Key Summary",
    sec_k1: "📘 Section 1: General Form of Scientific Notation",
    k1_def: "is a way of writing numbers as a product of a coefficient and a power of ten. The general form is:",
    notasiIlmiah: "Scientific notation",
    k1_syarat: "with conditions:",
    k1_a: "Coefficient (a)",
    k1_a_desc: "A decimal between 1 and 10 (not including 10)",
    k1_a_ex: "Examples: 1.5 · 2.7 · 9.99",
    k1_n: "Exponent (n)",
    k1_n_desc: "A positive, negative, or zero integer",
    k1_n_ex: "Positive → large · Negative → small",
    k1_wrong: "Not scientific notation",
    k1_wrong_note: "(12 ≥ 10, incorrect!)",
    k1_right: "Correct scientific notation",
    k1_right_note: "(1 ≤ 1.2 < 10 ✓)",
    anatomi_label: "🔍 ANATOMY OF SCIENTIFIC NOTATION:",
    koef_label: "COEFFICIENT (a)",
    koef_sub: "1 ≤ a < 10",
    eksponen_label: "EXPONENT (n)",
    eksponen_sub: "Integer",
    tabel_title: "📊 POWERS OF TEN TABLE:",
    col_pangkat: "Power",
    col_nilai: "Value",
    col_nama: "Name",
    row_miliar: "Billion",
    row_juta: "Million",
    row_ribu: "Thousand",
    row_satu: "One",
    row_sepert: "One-thousandth",
    row_seperjuta: "One-millionth",
    row_sepermiliar: "One-billionth",
    tip_k1: "Remember:",
    tip_k1b: "Positive exponent → decimal moves",
    tip_k1c: "right",
    tip_k1d: "(number gets larger). Negative exponent → decimal moves",
    tip_k1e: "left",
    tip_k1f: "(number gets smaller). Exponent = number of shifts!",
    sec_c1: "📝 Practice Problems — General Form of Scientific Notation",
    c1_easy_q: "Express the number",
    c1_easy_q2: "in scientific notation!",
    c1_easy_s1: "Determine the coefficient by placing the decimal after the first non-zero digit:",
    c1_easy_s2: "Count how many places the decimal shifts left to get 5.7:",
    c1_easy_note1: "5",
    c1_easy_note2: "7,000,000",
    c1_easy_note3: "→ shifted",
    c1_easy_note4: "7",
    c1_easy_note5: "places to the left",
    c1_med_q: "Convert",
    c1_med_q2: "to an ordinary number!",
    c1_med_s1: "Negative exponent",
    c1_med_s1b: "→ shift decimal to the",
    c1_med_s1c: "left",
    c1_med_s1d: "by 4 places:",
    c1_med_note: "4.05 → shift decimal 4 places left → add zeros in front:",
    c1_hard_q: "Order the following numbers from smallest to largest:",
    c1_hard_s1: "Compare the exponents first — larger exponent means larger number:",
    c1_hard_s2: "For equal exponents",
    c1_hard_s2b: ", compare the coefficients: 2.9 < 3.2.",
    sec_k2: "📘 Section 2: Rules for Writing Scientific Notation",
    k2_intro: "There are two main processes in scientific notation: converting ordinary numbers to scientific notation, and vice versa. The key is",
    k2_intro2: "counting the movement of the decimal point",
    k2_intro3: ".",
    k2_rule1: "📌 RULE 1 — Ordinary Number → Scientific Notation",
    k2_r1_1: "Place the decimal immediately after the first non-zero digit → this is coefficient",
    k2_r1_2: "Count the number of decimal place shifts → this is the value",
    k2_r1_3: "If the decimal moves",
    k2_r1_3b: "left",
    k2_r1_3c: "→ n is positive. If it moves",
    k2_r1_3d: "right",
    k2_r1_3e: "→ n is negative.",
    k2_rule2: "📌 RULE 2 — Scientific Notation → Ordinary Number",
    k2_r2_1: "If",
    k2_r2_1b: ": shift decimal",
    k2_r2_1c: "right",
    k2_r2_1d: "by n places (add zeros if needed).",
    k2_r2_2: "If",
    k2_r2_2b: ": shift decimal",
    k2_r2_2c: "left",
    k2_r2_2d: "by |n| places (add leading zeros if needed).",
    diagram_title: "↔️ DECIMAL SHIFT DIRECTION DIAGRAM:",
    n_neg: "n negative",
    n_pos: "n positive",
    bil_kecil: "Small number",
    bil_besar: "Large number",
    tip_k2: "Quick Tip:",
    tip_k2b: "For large positive integers, n = number of digits minus 1. Example: 5,000,000 has 7 digits → n = 7 − 1 = 6, so",
    sec_c2: "📝 Practice Problems — Rules for Writing Scientific Notation",
    c2_easy_q: "Write",
    c2_easy_q2: "in scientific notation!",
    c2_easy_s1: "Find the first non-zero digit → digit",
    c2_easy_s1b: ". Coefficient =",
    c2_easy_s2: "Count decimal shifts from 7.2 back to original position:",
    c2_easy_note: "0.",
    c2_easy_note2: "0000007",
    c2_easy_note3: "2 → decimal moved 7 places to the",
    c2_easy_note4: "right",
    c2_easy_note5: "→",
    c2_med_q: "Check whether the following are in correct scientific notation. If not, correct them!",
    c2_med_a_check: "coefficient 0.35 < 1,",
    c2_med_a_wrong: "incorrect!",
    c2_med_a_fix: "Correction:",
    c2_med_b_check: "coefficient 15 ≥ 10,",
    c2_med_c_check: "coefficient 6.02: 1 ≤ 6.02 < 10,",
    c2_med_c_right: "correct! ✓",
    avogadro: "(This is the famous Avogadro's number in chemistry!)",
    c2_hard_q: "Find x if",
    c2_hard_q2: "and express the result in scientific notation!",
    sec_k3: "📘 Section 3: Operations in Scientific Notation",
    k3_intro: "When performing operations (add, subtract, multiply, divide) with scientific notation, there are special techniques to speed up calculation.",
    k3_mul: "Multiplication:",
    k3_div: "Division:",
    k3_add: "Addition/Subtraction:",
    k3_add_note: "First match the exponents, then add/subtract the coefficients.",
    tip_k3: "Tip:",
    tip_k3b: "After operating, make sure the resulting coefficient still satisfies",
    tip_k3c: ". If not, convert back to correct scientific notation!",
    sec_c3: "📝 Practice Problems — Operations in Scientific Notation",
    c3_easy_q: "Calculate:",
    c3_med_q: "Calculate:",
    c3_hard_q: "Planet A has mass",
    c3_hard_q2: "kg and planet B has mass",
    c3_hard_q3: "kg. Calculate the total mass of both planets in scientific notation!",
    c3_hard_s1: "Match the exponents (use the larger power):",
    c3_hard_s2: "Add the coefficients:",
    step: "Step",
    pembahasan: "SOLUTION:",
    example: "Example",
    diff_easy: "EASY",
    diff_med: "MEDIUM",
    diff_hard: "HARD",
    hitung: "Calculate:",
    sederhanakan: "Simplify:",
    hasil: "Result:",
    karena: "since",
    dan: "and",
    jika: "If",
    maka: "then",
    langkah: "Step",
    nilai: "value",
    tentukan: "find",
    ubah: "convert",
    geser: "shift decimal",
    langkah_lbl: "places to the",
  },
  ja: {
    pageTitle: "科学的記数法",
    pageSub: "中学3年 · 累乗・指数 · 数学教材",
    sec_intro: "🔭 数が大きすぎたり小さすぎたりするとき...",
    intro_p1: "地球から太陽までの距離はおよそ",
    intro_p1b: "メートル。",
    intro_p2: "電子の質量はわずか",
    intro_p2b: "kg。",
    intro_p3: "このような数を毎日書いて計算するのを想像してみよう！",
    intro_highlight: "そこで",
    intro_highlight2: "科学的記数法",
    intro_highlight3: "が救世主として登場する。世界中の科学者、エンジニア、数学者が非常に大きいまたは非常に小さい数を簡潔・整然・効率よく書くために使っている。 🚀",
    skala_title: "🌌 スケールの比較：",
    skala_bumi: "地球–太陽の距離：",
    skala_elektron: "電子の質量：",
    skala_cahaya: "光速：",
    intro_note: "注意：",
    intro_note2: "科学的記数法は物理・化学だけでなく、コンピュータサイエンス（データサイズ）、天文学、生物学（細胞サイズ）、金融（GDPの値）でも使われる！",
    badge_intisari: "🎯 要点まとめ",
    sec_k1: "📘 第1節：科学的記数法の一般形",
    k1_def: "は、数を係数と10の累乗の積として表す方法。一般的な形：",
    notasiIlmiah: "科学的記数法",
    k1_syarat: "条件：",
    k1_a: "係数（a）",
    k1_a_desc: "1以上10未満の小数",
    k1_a_ex: "例：1.5、2.7、9.99",
    k1_n: "指数（n）",
    k1_n_desc: "正・負・ゼロの整数",
    k1_n_ex: "正 → 大きい数 · 負 → 小さい数",
    k1_wrong: "科学的記数法でない",
    k1_wrong_note: "（12 ≥ 10、不正解！）",
    k1_right: "正しい科学的記数法",
    k1_right_note: "（1 ≤ 1.2 < 10 ✓）",
    anatomi_label: "🔍 科学的記数法の構造：",
    koef_label: "係数（a）",
    koef_sub: "1 ≤ a < 10",
    eksponen_label: "指数（n）",
    eksponen_sub: "整数",
    tabel_title: "📊 10の累乗の値表：",
    col_pangkat: "累乗",
    col_nilai: "値",
    col_nama: "名称",
    row_miliar: "十億",
    row_juta: "百万",
    row_ribu: "千",
    row_satu: "一",
    row_sepert: "千分の一",
    row_seperjuta: "百万分の一",
    row_sepermiliar: "十億分の一",
    tip_k1: "覚え方：",
    tip_k1b: "正の指数 → 小数点を",
    tip_k1c: "右",
    tip_k1d: "に移動（数が大きくなる）。負の指数 → 小数点を",
    tip_k1e: "左",
    tip_k1f: "に移動（数が小さくなる）。指数 = 移動回数！",
    sec_c1: "📝 練習問題 — 科学的記数法の一般形",
    c1_easy_q: "数",
    c1_easy_q2: "を科学的記数法で表せ！",
    c1_easy_s1: "ゼロでない最初の数字の後に小数点を置き、係数を決める：",
    c1_easy_s2: "係数5.7を得るために小数点が左に何回移動するか数える：",
    c1_easy_note1: "5",
    c1_easy_note2: "7,000,000",
    c1_easy_note3: "→",
    c1_easy_note4: "7",
    c1_easy_note5: "回左に移動",
    c1_med_q: "",
    c1_med_q2: "を通常の数に変換せよ！",
    c1_med_s1: "負の指数",
    c1_med_s1b: "→ 小数点を",
    c1_med_s1c: "左",
    c1_med_s1d: "に4回移動：",
    c1_med_note: "4.05 → 小数点を4回左に移動 → 前にゼロを追加：",
    c1_hard_q: "次の数を小さい順に並べよ：",
    c1_hard_s1: "まず指数を比べる — 指数が大きいほど数が大きい：",
    c1_hard_s2: "指数が同じ場合",
    c1_hard_s2b: "、係数を比べる：2.9 < 3.2。",
    sec_k2: "📘 第2節：科学的記数法の書き方のルール",
    k2_intro: "科学的記数法の主なプロセスは2つ：通常の数を科学的記数法に変換すること、またその逆。鍵は",
    k2_intro2: "小数点の移動回数を数える",
    k2_intro3: "こと。",
    k2_rule1: "📌 ルール1 — 通常の数 → 科学的記数法",
    k2_r1_1: "ゼロでない最初の数字の直後に小数点を置く → これが係数",
    k2_r1_2: "小数点の移動回数を数える → これが",
    k2_r1_3: "小数点が",
    k2_r1_3b: "左",
    k2_r1_3c: "に移動 → nは正。",
    k2_r1_3d: "右",
    k2_r1_3e: "に移動 → nは負。",
    k2_rule2: "📌 ルール2 — 科学的記数法 → 通常の数",
    k2_r2_1: "もし",
    k2_r2_1b: "：小数点を",
    k2_r2_1c: "右",
    k2_r2_1d: "にn回移動（必要ならゼロを追加）。",
    k2_r2_2: "もし",
    k2_r2_2b: "：小数点を",
    k2_r2_2c: "左",
    k2_r2_2d: "|n|回移動（必要なら前にゼロを追加）。",
    diagram_title: "↔️ 小数点移動方向の図：",
    n_neg: "n 負",
    n_pos: "n 正",
    bil_kecil: "小さい数",
    bil_besar: "大きい数",
    tip_k2: "クイックヒント：",
    tip_k2b: "大きな正の整数では、n = 桁数 − 1。例：5,000,000は7桁 → n = 7 − 1 = 6、よって",
    sec_c2: "📝 練習問題 — 科学的記数法の書き方",
    c2_easy_q: "",
    c2_easy_q2: "を科学的記数法で書け！",
    c2_easy_s1: "ゼロでない最初の数字を探す →",
    c2_easy_s1b: "。係数 =",
    c2_easy_s2: "7.2から元の位置までの小数点の移動を数える：",
    c2_easy_note: "0.",
    c2_easy_note2: "0000007",
    c2_easy_note3: "2 → 小数点が7回",
    c2_easy_note4: "右",
    c2_easy_note5: "に移動 →",
    c2_med_q: "次の数が正しい科学的記数法かどうか確認し、違えば訂正せよ！",
    c2_med_a_check: "係数0.35 < 1、",
    c2_med_a_wrong: "不正解！",
    c2_med_a_fix: "訂正：",
    c2_med_b_check: "係数15 ≥ 10、",
    c2_med_c_check: "係数6.02：1 ≤ 6.02 < 10、",
    c2_med_c_right: "正解！ ✓",
    avogadro: "（化学で有名なアボガドロ数！）",
    c2_hard_q: "を求めよ",
    c2_hard_q2: "で、結果を科学的記数法で表せ！",
    sec_k3: "📘 第3節：科学的記数法の演算",
    k3_intro: "科学的記数法で演算（加減乗除）を行うとき、計算を速くする特別な技法がある。",
    k3_mul: "乗法：",
    k3_div: "除法：",
    k3_add: "加法・減法：",
    k3_add_note: "まず指数を揃えてから係数を加減する。",
    tip_k3: "ヒント：",
    tip_k3b: "演算後、係数が",
    tip_k3c: "を満たすことを確認。満たさなければ正しい科学的記数法に変換し直す！",
    sec_c3: "📝 練習問題 — 科学的記数法の演算",
    c3_easy_q: "計算せよ：",
    c3_med_q: "計算せよ：",
    c3_hard_q: "惑星Aの質量は",
    c3_hard_q2: "kgで、惑星Bの質量は",
    c3_hard_q3: "kg。2つの惑星の合計質量を科学的記数法で求めよ！",
    c3_hard_s1: "指数を揃える（大きい方の累乗を使う）：",
    c3_hard_s2: "係数を加える：",
    step: "ステップ",
    pembahasan: "解説：",
    example: "例題",
    diff_easy: "基本",
    diff_med: "標準",
    diff_hard: "発展",
    hitung: "計算せよ：",
    sederhanakan: "簡略化せよ：",
    hasil: "結果：",
    karena: "なぜなら",
    dan: "と",
    jika: "もし",
    maka: "なら",
    langkah: "ステッ���",
    nilai: "値",
    tentukan: "求めよ",
    ubah: "変換",
    geser: "小数点を移動",
    langkah_lbl: "回",
  },
};

const NotasiIlmiahPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] ?? translations.id;

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "k1","c1","k2","c2","k3","c3","k4",
  ]);
  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };
  const isOpen = (id: string) => expandedSections.includes(id);

  const SectionHeader = ({
    id: _id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4 text-left">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
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
                  {t.intro_p1} <strong className="text-white">150.000.000.000</strong> {t.intro_p1b}{" "}
                  {t.intro_p2} <strong className="text-white">0,000...911</strong> {t.intro_p2b}{" "}
                  {t.intro_p3}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.intro_highlight} <strong>{t.intro_highlight2}</strong> {t.intro_highlight3}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.skala_title}</p>
                  <div className="space-y-2 font-body text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 shrink-0"></div>
                      <span className="text-white/70">{t.skala_bumi}</span>
                      <span className="text-red-400 font-semibold">150.000.000.000 m</span>
                      <span className="text-primary mx-1">→</span>
                      <span className="text-green-400 font-semibold"><InlineMath math="1{,}5 \times 10^{11}" /> m</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 shrink-0"></div>
                      <span className="text-white/70">{t.skala_elektron}</span>
                      <span className="text-red-400 font-semibold">0,000...911 kg</span>
                      <span className="text-primary mx-1">→</span>
                      <span className="text-green-400 font-semibold"><InlineMath math="9{,}11 \times 10^{-31}" /> kg</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-400 shrink-0"></div>
                      <span className="text-white/70">{t.skala_cahaya}</span>
                      <span className="text-red-400 font-semibold">300.000.000 m/s</span>
                      <span className="text-primary mx-1">→</span>
                      <span className="text-green-400 font-semibold"><InlineMath math="3 \times 10^{8}" /> m/s</span>
                    </div>
                  </div>
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
                    <strong className="text-green-300">{t.notasiIlmiah}</strong> {t.k1_def}
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center">
                    <BlockMath math="a \times 10^n" />
                    <p className="font-body text-xs text-white/60 mt-2">{t.k1_syarat} <InlineMath math="1 \leq |a| < 10" /> {t.dan} <InlineMath math="n \in \mathbb{Z}" /></p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-green-300 mb-1">{t.k1_a}</p>
                      <p className="font-body text-xs text-white/70">{t.k1_a_desc}</p>
                      <p className="font-body text-xs text-green-200 mt-1">{t.k1_a_ex}</p>
                    </div>
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-blue-300 mb-1">{t.k1_n}</p>
                      <p className="font-body text-xs text-white/70">{t.k1_n_desc}</p>
                      <p className="font-body text-xs text-blue-200 mt-1">{t.k1_n_ex}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/50 mb-1">{t.k1_wrong}</p>
                      <p className="font-body text-sm text-red-400"><InlineMath math="12 \times 10^3" /></p>
                      <p className="font-body text-xs text-white/40">{t.k1_wrong_note}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <p className="font-body text-xs text-white/50 mb-1">{t.k1_right}</p>
                      <p className="font-body text-sm text-green-400"><InlineMath math="1{,}2 \times 10^4" /></p>
                      <p className="font-body text-xs text-white/40">{t.k1_right_note}</p>
                    </div>
                  </div>
                </div>
                {/* Anatomi */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.anatomi_label}</p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-green-900/60 to-blue-900/60 border-2 border-green-500/50 rounded-xl px-6 py-5 text-center">
                      <span className="font-display text-4xl font-bold text-yellow-300">3,8</span>
                      <span className="font-display text-3xl font-bold text-white mx-2">×</span>
                      <span className="inline-flex items-start">
                        <span className="font-display text-4xl font-bold text-white">10</span>
                        <span className="font-display text-2xl font-bold text-cyan-400 -mt-2 leading-none">5</span>
                      </span>
                    </div>
                    <div className="flex justify-around w-full text-xs font-body">
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-yellow-400 mx-auto mb-1"></div>
                        <span className="text-yellow-300 font-semibold">{t.koef_label}</span>
                        <br /><span className="text-white/60">{t.koef_sub}</span>
                      </div>
                      <div className="text-center">
                        <div className="w-2 h-5 border-l-2 border-cyan-400 mx-auto mb-1"></div>
                        <span className="text-cyan-300 font-semibold">{t.eksponen_label}</span>
                        <br /><span className="text-white/60">{t.eksponen_sub}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center w-full">
                      <p className="font-body text-sm text-white/80"><InlineMath math="3{,}8 \times 10^5 = 380.000" /></p>
                    </div>
                  </div>
                </div>
                {/* Table */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.tabel_title}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-cyan-300 pr-4">{t.col_pangkat}</th>
                          <th className="text-left py-2 text-green-300 pr-4">{t.col_nilai}</th>
                          <th className="text-left py-2 text-yellow-300">{t.col_nama}</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^9" /></td><td className="pr-4">1.000.000.000</td><td>{t.row_miliar}</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^6" /></td><td className="pr-4">1.000.000</td><td>{t.row_juta}</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^3" /></td><td className="pr-4">1.000</td><td>{t.row_ribu}</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^0" /></td><td className="pr-4">1</td><td>{t.row_satu}</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^{-3}" /></td><td className="pr-4">0,001</td><td>{t.row_sepert}</td></tr>
                        <tr className="border-b border-white/5"><td className="py-1 pr-4"><InlineMath math="10^{-6}" /></td><td className="pr-4">0,000001</td><td>{t.row_seperjuta}</td></tr>
                        <tr><td className="py-1 pr-4"><InlineMath math="10^{-9}" /></td><td className="pr-4">0,000000001</td><td>{t.row_sepermiliar}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_k1}</strong> {t.tip_k1b} <em>{t.tip_k1c}</em> {t.tip_k1d} <em>{t.tip_k1e}</em> {t.tip_k1f}
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
                  soal={<>{t.c1_easy_q} <strong>57.000.000</strong> {t.c1_easy_q2}</>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c1_easy_s1}</p>
                    <Dark><p className="text-sm text-white">57.000.000 → <span className="text-yellow-300 font-bold">5,7</span></p></Dark>
                    <p><strong>{t.step} 2:</strong> {t.c1_easy_s2}</p>
                    <Dark>
                      <p className="text-sm text-white/70 mb-1">{t.c1_easy_note1}<span className="text-cyan-300">{t.c1_easy_note2}</span> {t.c1_easy_note3} <span className="text-cyan-300 font-bold">{t.c1_easy_note4}</span> {t.c1_easy_note5}</p>
                      <BlockMath math="57.000.000 = 5{,}7 \times 10^7" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} <InlineMath math="5{,}7 \times 10^7" /></strong></p>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.c1_med_q} <InlineMath math="4{,}05 \times 10^{-4}" /> {t.c1_med_q2}</>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c1_med_s1} (<InlineMath math="n = -4" />) {t.c1_med_s1b} <em>{t.c1_med_s1c}</em> {t.c1_med_s1d}</p>
                    <Dark>
                      <p className="text-xs text-white/60">{t.c1_med_note}</p>
                      <BlockMath math="4{,}05 \times 10^{-4} = 0{,}000405" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} 0,000405</strong></p>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>
                    {t.c1_hard_q}<br />
                    <InlineMath math="3{,}2 \times 10^5" />,&nbsp;
                    <InlineMath math="8{,}1 \times 10^4" />,&nbsp;
                    <InlineMath math="2{,}9 \times 10^5" />,&nbsp;
                    <InlineMath math="9{,}9 \times 10^3" />
                  </>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c1_hard_s1}</p>
                    <Dark>
                      <div className="space-y-1 text-xs">
                        <p><InlineMath math="9{,}9 \times 10^3" /> = 9.900</p>
                        <p><InlineMath math="8{,}1 \times 10^4" /> = 81.000</p>
                        <p><InlineMath math="2{,}9 \times 10^5" /> = 290.000</p>
                        <p><InlineMath math="3{,}2 \times 10^5" /> = 320.000</p>
                      </div>
                    </Dark>
                    <p><strong>{t.step} 2:</strong> {t.c1_hard_s2} (<InlineMath math="10^5" />){t.c1_hard_s2b}</p>
                    <Dark><BlockMath math="9{,}9\times10^3 < 8{,}1\times10^4 < 2{,}9\times10^5 < 3{,}2\times10^5" /></Dark>
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
                    {t.k2_intro} <strong className="text-purple-300">{t.k2_intro2}</strong>{t.k2_intro3}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-purple-500">
  <p className="font-body text-xs font-semibold text-purple-300 mb-2">{t.k2_rule1}</p>
  <div className="mb-3 rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-3 font-body text-sm text-white/80">
    <p className="font-semibold text-cyan-300">Pembulatan digit notasi ilmiah</p>
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      <div className="rounded-md border border-emerald-400/40 bg-emerald-400/10 p-2 font-bold text-emerald-300">DIGIT ≥ 5 → BERTAMBAH 1 KE KIRI</div>
      <div className="rounded-md border border-amber-400/40 bg-amber-400/10 p-2 font-bold text-amber-300">DIGIT &lt; 5 → TETAP / TIDAK BERTAMBAH</div>
    </div>
    <p className="mt-2">Jika digit berikutnya lebih dari atau sama dengan 5, digit yang dipertahankan bertambah 1 ke kiri. Jika digit berikutnya kurang dari 5, digit sebelumnya tetap.</p>
    <p className="mt-1 text-cyan-200">Contoh: <InlineMath math="3{,}4567\\times10^5\\approx3{,}46\\times10^5" /> karena 6 ≥ 5, sedangkan <InlineMath math="3{,}4547\\times10^5\\approx3{,}45\\times10^5" /> karena 4 &lt; 5.</p>
  </div>
  <ol className="space-y-2 font-body text-sm text-white/80 list-decimal list-inside">
                      <li>{t.k2_r1_1} <InlineMath math="a" />.</li>
                      <li>{t.k2_r1_2} <InlineMath math="|n|" />.</li>
                      <li>{t.k2_r1_3} <strong className="text-green-300">{t.k2_r1_3b}</strong> {t.k2_r1_3c} <strong className="text-red-400">{t.k2_r1_3d}</strong> {t.k2_r1_3e}</li>
                    </ol>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-fuchsia-500">
                    <p className="font-body text-xs font-semibold text-fuchsia-300 mb-2">{t.k2_rule2}</p>
                    <ol className="space-y-2 font-body text-sm text-white/80 list-decimal list-inside">
                      <li>{t.k2_r2_1} <InlineMath math="n > 0" />{t.k2_r2_1b} <strong className="text-green-300">{t.k2_r2_1c}</strong> {t.k2_r2_1d}</li>
                      <li>{t.k2_r2_2} <InlineMath math="n < 0" />{t.k2_r2_2b} <strong className="text-red-400">{t.k2_r2_2c}</strong> {t.k2_r2_2d}</li>
                    </ol>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">{t.diagram_title}</p>
                  <div className="flex items-center justify-center gap-2 text-xs font-body flex-wrap">
                    <div className="bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2 text-center">
                      <p className="text-red-300 font-semibold">{t.n_neg}</p>
                      <p className="text-white/60">{t.bil_kecil}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-red-400">← {t.k2_r2_2c}</span>
                      <div className="w-20 h-1 bg-gradient-to-l from-primary to-red-500 rounded"></div>
                      <div className="w-20 h-1 bg-gradient-to-r from-primary to-green-500 rounded"></div>
                      <span className="text-green-400">{t.k2_r2_1c} →</span>
                    </div>
                    <div className="bg-green-900/40 border border-green-500/40 rounded-lg px-3 py-2 text-center">
                      <p className="text-green-300 font-semibold">{t.n_pos}</p>
                      <p className="text-white/60">{t.bil_besar}</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-900/50 rounded-lg p-3">
                    <div className="flex justify-between text-xs font-body text-white/60">
                      <span><InlineMath math="10^{-6}" /> → 0,000001</span>
                      <span><InlineMath math="10^0" /> → 1</span>
                      <span><InlineMath math="10^6" /> → 1.000.000</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_k2}</strong> {t.tip_k2b} <InlineMath math="5 \times 10^6" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c2" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title={t.sec_c2} />
            {isOpen("c2") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.c2_easy_q} <strong>0,00000072</strong> {t.c2_easy_q2}</>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c2_easy_s1} <strong>7</strong>{t.c2_easy_s1b} <strong>7,2</strong>.</p>
                    <p><strong>{t.step} 2:</strong> {t.c2_easy_s2}</p>
                    <Dark>
                      <p className="text-xs text-white/70">{t.c2_easy_note}<span className="text-cyan-300">{t.c2_easy_note2}</span>{t.c2_easy_note3} <strong className="text-red-400">{t.c2_easy_note4}</strong> {t.c2_easy_note5} <InlineMath math="n = -7" /></p>
                      <BlockMath math="0{,}00000072 = 7{,}2 \times 10^{-7}" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} <InlineMath math="7{,}2 \times 10^{-7}" /></strong></p>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>
                    {t.c2_med_q}<br />
                    a) <InlineMath math="0{,}35 \times 10^6" />&nbsp;&nbsp;
                    b) <InlineMath math="15 \times 10^{-3}" />&nbsp;&nbsp;
                    c) <InlineMath math="6{,}02 \times 10^{23}" />
                  </>}
                  solution={<>
                    <Dark>
                      <div className="space-y-3">
                        <div>
                          <p><strong>a)</strong> <InlineMath math="0{,}35 \times 10^6" /> → {t.c2_med_a_check} <span className="text-red-400">{t.c2_med_a_wrong}</span></p>
                          <p className="pl-3">{t.c2_med_a_fix} <InlineMath math="0{,}35 = 3{,}5 \times 10^{-1}" /></p>
                          <BlockMath math="0{,}35 \times 10^6 = 3{,}5 \times 10^{-1} \times 10^6 = 3{,}5 \times 10^5" />
                        </div>
                        <div>
                          <p><strong>b)</strong> <InlineMath math="15 \times 10^{-3}" /> → {t.c2_med_b_check} <span className="text-red-400">{t.c2_med_a_wrong}</span></p>
                          <p className="pl-3">{t.c2_med_a_fix} <InlineMath math="15 = 1{,}5 \times 10^1" /></p>
                          <BlockMath math="15 \times 10^{-3} = 1{,}5 \times 10^1 \times 10^{-3} = 1{,}5 \times 10^{-2}" />
                        </div>
                        <div>
                          <p><strong>c)</strong> <InlineMath math="6{,}02 \times 10^{23}" /> → {t.c2_med_c_check} <span className="text-green-400">{t.c2_med_c_right}</span></p>
                          <p className="text-xs text-white/50 mt-1">{t.avogadro}</p>
                        </div>
                      </div>
                    </Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>{t.c2_hard_q} <InlineMath math="(3{,}2 \times 10^4) \times (2{,}5 \times 10^3)" /> {t.c2_hard_q2}</>}
                  solution={<>
                    <Dark>
                      <BlockMath math="(3{,}2 \times 2{,}5) \times (10^4 \times 10^3) = 8 \times 10^7" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} <InlineMath math="8 \times 10^7" /></strong></p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* SUB-BAB 3: OPERASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k3" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_k3} />
            {isOpen("k3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80">{t.k3_intro}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.k3_mul}</p>
                      <BlockMath math="(a \times 10^m) \times (b \times 10^n) = (a \times b) \times 10^{m+n}" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.k3_div}</p>
                      <BlockMath math="\frac{a \times 10^m}{b \times 10^n} = \frac{a}{b} \times 10^{m-n}" />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.k3_add}</p>
                      <p className="font-body text-xs text-white/60 mb-2">{t.k3_add_note}</p>
                      <BlockMath math="(a \times 10^n) \pm (b \times 10^n) = (a \pm b) \times 10^n" />
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tip_k3}</strong> {t.tip_k3b} <InlineMath math="1 \leq |a| < 10" />{t.tip_k3c}
                  </p>
                </div>
              </div>
            )}
          </div>

  {/* CONTOH 3 disembunyikan sesuai materi ringkas */}
  <div className="hidden bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="c3" icon={<Calculator className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_c3} />
            {isOpen("c3") && (
              <div className="px-5 pb-5 space-y-6">
                <ExBlock level="easy" n={1}
                  soal={<>{t.c3_easy_q} <InlineMath math="(6 \times 10^5) \div (2 \times 10^2)" /></>}
                  solution={<>
                    <Dark>
                      <BlockMath math="\frac{6 \times 10^5}{2 \times 10^2} = \frac{6}{2} \times 10^{5-2} = 3 \times 10^3 = 3.000" />
                    </Dark>
                  </>}
                />
                <ExBlock level="med" n={2}
                  soal={<>{t.c3_med_q} <InlineMath math="(3 \times 10^4) + (5 \times 10^3)" /></>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c3_hard_s1}</p>
                    <Dark><BlockMath math="5 \times 10^3 = 0{,}5 \times 10^4" /></Dark>
                    <p><strong>{t.step} 2:</strong> {t.c3_hard_s2}</p>
                    <Dark><BlockMath math="(3 + 0{,}5) \times 10^4 = 3{,}5 \times 10^4" /></Dark>
                  </>}
                />
                <ExBlock level="hard" n={3}
                  soal={<>
                    {t.c3_hard_q} <InlineMath math="8{,}4 \times 10^{24}" /> {t.c3_hard_q2} <InlineMath math="2{,}1 \times 10^{22}" /> {t.c3_hard_q3}
                  </>}
                  solution={<>
                    <p><strong>{t.step} 1:</strong> {t.c3_hard_s1}</p>
                    <Dark>
                      {/* KaTeX fix: replace \text{ kg} with \,\mathrm{kg} */}
                      <BlockMath math="2{,}1 \times 10^{22} = 0{,}021 \times 10^{24}" />
                    </Dark>
                    <p><strong>{t.step} 2:</strong> {t.c3_hard_s2}</p>
                    <Dark>
                      <BlockMath math="(8{,}4 + 0{,}021) \times 10^{24} = 8{,}421 \times 10^{24}\,\mathrm{kg}" />
                    </Dark>
                    <p><strong className="text-primary">{t.hasil} <InlineMath math="8{,}421 \times 10^{24}\,\mathrm{kg}" /></strong></p>
                  </>}
                />
              </div>
            )}
          </div>

          {/* SUB-BAB 4: PEMAKAIAN NOTASI ILMIAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="k4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400"
              title={language === "en" ? "📘 Section 4: Real-World Applications" : language === "ja" ? "📘 第4節：実生活での応用" : "📘 Sub-Bab 4: Penerapan Notasi Ilmiah dalam Kehidupan Nyata"} />
            {isOpen("k4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.badge_intisari}</p>
                  <p className="font-body text-sm text-white/80">
                    {language === "en"
                      ? "Scientific notation is indispensable in many fields of science. Here are some famous examples:"
                      : language === "ja"
                      ? "科学的記数法は多くの科学分野で不可欠。有名な例："
                      : "Notasi ilmiah sangat berguna dalam banyak cabang sains. Berikut beberapa contoh terkenal:"}
                  </p>
                  <div className="space-y-2 font-body text-xs">
                    {[
                      {
                        icon: "⚡",
                        label: language === "en" ? "Speed of light" : language === "ja" ? "光速" : "Kecepatan cahaya",
                        val: "3 \\times 10^8 \\,\\mathrm{m/s}",
                      },
                      {
                        icon: "🌍",
                        label: language === "en" ? "Earth's mass" : language === "ja" ? "地球の質量" : "Massa Bumi",
                        val: "5{,}97 \\times 10^{24} \\,\\mathrm{kg}",
                      },
                      {
                        icon: "🦠",
                        label: language === "en" ? "Bacteria size" : language === "ja" ? "細菌のサイズ" : "Ukuran bakteri",
                        val: "1 \\times 10^{-6} \\,\\mathrm{m}",
                      },
                      {
                        icon: "💾",
                        label: language === "en" ? "1 Terabyte" : language === "ja" ? "1テラバイト" : "1 Terabyte",
                        val: "10^{12} \\,\\mathrm{bytes}",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-900/40 rounded-lg px-3 py-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-white/70 flex-1">{item.label}:</span>
                        <span className="text-green-300 font-semibold"><InlineMath math={item.val} /></span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Contoh perhitungan nyata */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">
                    {language === "en" ? "🌟 CALCULATION: Distance light travels in 1 year" : language === "ja" ? "🌟 計算：光が1年間で進む距離" : "🌟 PERHITUNGAN: Jarak yang ditempuh cahaya dalam 1 tahun"}
                  </p>
                  <div className="space-y-2 font-body text-xs text-white/70">
                    <p>{language === "en" ? "1 year = " : language === "ja" ? "1年 = " : "1 tahun = "}<InlineMath math="365\\times24\\times3600" /> {language === "en" ? "seconds:" : language === "ja" ? "秒：" : "detik:"}</p>
                    <Dark>
                      {/* KaTeX fix: \text{ detik} → \,\mathrm{s} and \text{ meter} → \,\mathrm{m} */}
                      <BlockMath math="365 \times 86400 = 31.536.000 \approx 3{,}1536 \times 10^7\,\mathrm{s}" />
                      <p className="text-xs text-white/60 mt-1">
                        {language === "en" ? "Distance = speed × time:" : language === "ja" ? "距離 = 速さ × 時間：" : "Jarak = kecepatan × waktu:"}
                      </p>
                      <BlockMath math="3 \times 10^8 \times 3{,}1536 \times 10^7 = 9{,}46 \times 10^{15}\,\mathrm{m}" />
                    </Dark>
                    <p>
                      {language === "en"
                        ? "This is 1 light-year ≈ 9.46 × 10¹⁵ m!"
                        : language === "ja"
                        ? "これが1光年 ≈ 9.46 × 10¹⁵ m！"
                        : "Inilah yang disebut 1 tahun cahaya ≈ 9,46 × 10¹⁵ m!"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotasiIlmiahPage;
