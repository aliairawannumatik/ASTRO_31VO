import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Code } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import FunctionMachineAnimation from "@/components/FunctionMachineAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    badge: "Kelas 8 · Relasi dan Fungsi · Materi Matematika",
    title: "NOTASI DAN RUMUS FUNGSI",
    subtitle: "Bahasa Matematika Untuk Mengekspresikan Fungsi!",
    backBtn: "← Kembali ke Relasi dan Fungsi",
    sec_intro_title: "🌟 Notasi Fungsi — Bahasa Singkat yang Powerful",
    sec_notasi_title: "📘 Bentuk Notasi dan Cara Membaca",
    sec_operasi_title: "🔧 Operasi pada Fungsi",
    sec_contoh1_title: "✏️ Contoh 1 — Tingkat Mudah",
    sec_contoh2_title: "✏️ Contoh 2 — Tingkat Sedang",
    sec_contoh3_title: "✏️ Contoh 3 — Tingkat Sulit",
    sec_contoh4_title: "✏️ Contoh 4 — Mencari Nilai x dari Bayangan",
    sec_rangkuman_title: "📌 Rangkuman & Kesimpulan",
    badge_easy: "MUDAH",
    badge_medium: "SEDANG",
    badge_hard: "SULIT",
    badge_challenge: "TANTANGAN",
    intro_p: "Daripada selalu menulis \"fungsi yang memetakan x menjadi dua kali x tambah tiga\", matematikawan menggunakan notasi singkat yang universal. Notasi ini memungkinkan kita mengomunikasikan aturan fungsi secara efisien dan presisi.",
    intro_anatomi: "📖 Anatomi Notasi Fungsi",
    symbols: [
      { simbol: "f", arti: "Nama fungsi (bisa juga g, h, p, dll.)" },
      { simbol: "A → B", arti: "Fungsi memetakan dari himpunan A ke himpunan B" },
      { simbol: "f(x)", arti: "Nilai fungsi f saat input adalah x (dibaca: 'f dari x')" },
      { simbol: "2x + 3", arti: "Aturan/rumus yang menghubungkan x dengan nilai keluarannya" },
    ],
    notasi_summary: "🎯 Ringkasan Intisari",
    notasi_p: (a: string, b: string, c: string, d: string, e: string, f2: string, g: string, h: string, k: string) =>
      <>Fungsi <InlineMath math={a} /> dari himpunan <InlineMath math={b} /> ke himpunan <InlineMath math={c} /> ditulis <InlineMath math={d} />. Jika <InlineMath math={e} /> dipetakan ke <InlineMath math={f2} />, kita tulis <InlineMath math={g} /> atau <InlineMath math={h} />. Nilai <InlineMath math="y" /> disebut <strong className="text-yellow-300">bayangan</strong> atau <strong className="text-yellow-300">peta</strong> dari <InlineMath math={k} /> oleh fungsi <InlineMath math="f" />.</>,
    notasi_reading_title: "📋 Cara Membaca Notasi Fungsi",
    notasi_rows: [
      { notasi: "f : A \\to B", baca: "f adalah fungsi dari A ke B", color: "cyan" },
      { notasi: "f(x) = 3x - 1", baca: "f dari x sama dengan tiga x dikurangi satu", color: "violet" },
      { notasi: "f(2) = 5", baca: "nilai f saat x = 2 adalah 5", color: "green" },
      { notasi: "x \\mapsto 2x + 3", baca: "x dipetakan ke dua x tambah tiga", color: "orange" },
    ],
    calc_title: "🔢 Cara Menghitung Nilai Fungsi",
    calc_example: "Contoh: Jika f(x) = 4x - 5, hitung f(3)",
    calc_step1: "Langkah 1: Tulis rumus fungsi",
    calc_step2: "Langkah 2: Ganti semua x dengan 3",
    calc_key: "💡 Kunci:",
    calc_key_text: "Ganti variabel x dengan nilai yang diberikan, lalu hitung hasilnya!",
    ops_intro: "Dua fungsi atau lebih bisa dioperasikan untuk menghasilkan fungsi baru:",
    ops_col1: "Operasi", ops_col2: "Notasi", ops_col3: "Definisi",
    ops_rows: [
      ["Penjumlahan", "(f + g)(x)", "f(x) + g(x)"],
      ["Pengurangan", "(f - g)(x)", "f(x) - g(x)"],
      ["Perkalian", "(f · g)(x)", "f(x) × g(x)"],
      ["Pembagian", "(f/g)(x)", "f(x) ÷ g(x), dengan g(x) ≠ 0"],
    ],
    ops_example: "Contoh: f(x) = 3x + 1 dan g(x) = x - 2",
    c1_soal: "📝 Soal",
    c1_soal_p: <>Diketahui fungsi <InlineMath math="f(x) = 5x - 3" />. Hitunglah:</>,
    c1_disc: "🔍 Pembahasan",
    c1_items: [
      { bagian: "a) f(0)", sub: "x = 0", kalkulasi: "f(0) = 5(0) - 3 = 0 - 3 = -3", hasil: "-3" },
      { bagian: "b) f(4)", sub: "x = 4", kalkulasi: "f(4) = 5(4) - 3 = 20 - 3 = 17", hasil: "17" },
      { bagian: "c) f(-2)", sub: "x = -2", kalkulasi: "f(-2) = 5(-2) - 3 = -10 - 3 = -13", hasil: "-13" },
    ],
    hasil_label: "Hasil:",
    c1_answer: "✅ f(0) = -3, f(4) = 17, f(-2) = -13",
    c2_soal_p: <>Diketahui <InlineMath math="f(x) = 3x - 2" /> dan <InlineMath math="g(x) = x^2 + 1" />. Tentukan:</>,
    c2_disc: "🔍 Pembahasan",
    c2_calc_intro: "Hitung dulu f(3) dan g(3):",
    c2_answer: "✅ (f+g)(3) = 17, (f-g)(-1) = -7, (f·g)(2) = 20",
    c3_soal_p: <>Diketahui fungsi <InlineMath math="f(x) = px + q" />. Jika <InlineMath math="f(3) = 11" /> dan <InlineMath math="f(5) = 17" />, tentukan:</>,
    c3_a_label: "a) Nilai p dan q",
    c3_b_label: "b) Rumus fungsi f(x)",
    c3_c_label: (v: string) => <>c) Nilai x jika <InlineMath math={v} /></>,
    c3_disc: "🔍 Pembahasan",
    c3_a_title: "a) Mencari p dan q:",
    c3_a_sub: "Substitusi ke f(x) = px + q:",
    c3_elim: "Eliminasi: (2) - (1):",
    c3_sub_p: "Substitusi p=3 ke (1):",
    c3_b_title: "b) Rumus Fungsi:",
    c3_c_title: "c) Mencari x jika f(x) = 29:",
    c3_answer: "✅ p = 3, q = 2, f(x) = 3x + 2, dan x = 9 saat f(x) = 29",
    c4_concept: "🎯 Konsep:",
    c4_concept_p: "Jika diketahui fungsi f(x) dan bayangan (nilai f(x)), kita bisa mencari nilai x dengan menyelesaikan persamaan. Bayangan = hasil keluaran dari fungsi.",
    c4a_soal: "📝 Soal a",
    c4a_soal_p: <>Diketahui fungsi <InlineMath math="f(x) = 4x - 6" />. Jika bayangan dari <InlineMath math="x" /> adalah <InlineMath math="18" />, tentukan nilai <InlineMath math="x" />!</>,
    c4a_disc: "🔍 Penyelesaian a",
    c4a_disc_p: "Bayangan dari x adalah 18, artinya f(x) = 18. Kita substitusikan ke rumus fungsi:",
    c4a_answer: "✅ Nilai x = 6",
    c4a_verify: "Verifikasi: f(6) = 4(6) − 6 = 24 − 6 = 18 ✓",
    c4b_soal: "📝 Soal b",
    c4b_soal_p: <>Diketahui fungsi <InlineMath math="g(x) = 3x + 5" />. Bayangan dari <InlineMath math="x" /> oleh fungsi <InlineMath math="g" /> adalah <InlineMath math="-7" />. Tentukan nilai <InlineMath math="x" />!</>,
    c4b_disc: "🔍 Penyelesaian b",
    c4b_disc_p: "Bayangan −7 berarti g(x) = −7:",
    c4b_answer: "✅ Nilai x = −4",
    c4b_verify: "Verifikasi: g(−4) = 3(−4) + 5 = −12 + 5 = −7 ✓",
    c4_remember: "💡 Ingat:",
    c4_remember_p: "\"Bayangan dari x adalah k\" sama artinya dengan f(x) = k. Tinggal substitusi dan selesaikan persamaannya untuk mencari x!",
    sum_title: "📚 Rangkuman Materi",
    sum_items: [
      { icon: "📐", label: "Notasi Fungsi", desc: "Ditulis f : A → B atau f(x) = ... Cara ringkas menyatakan aturan fungsi." },
      { icon: "🔢", label: "f(x)", desc: "Nilai fungsi f saat input adalah x. Disebut juga 'bayangan dari x'." },
      { icon: "🧮", label: "Cara Menghitung", desc: "Ganti semua variabel x dengan nilai yang diminta, lalu hitung hasilnya." },
      { icon: "➕", label: "Operasi Fungsi", desc: "(f ± g)(x) = f(x) ± g(x)  dan  (f · g)(x) = f(x) · g(x)." },
      { icon: "🔍", label: "Mencari Nilai x", desc: "Jika diketahui f(x) = k, jadikan seperti persamaan dan isolasi x." },
    ],
    tips_title: "💡 Tips & Trik",
    tips: [
      "f(2) artinya ganti x dengan 2 — bukan f × 2! Jangan tertukar.",
      "Untuk mencari x dari f(x) = k: pindahkan semua angka ke satu sisi, x ke sisi lain.",
      "Operasi fungsi: hitung f(x) dan g(x) masing-masing dulu, baru gabungkan hasilnya.",
    ],
    concl_title: "🎯 Kesimpulan",
    concl_p: <>Notasi fungsi adalah <strong className="text-orange-300">bahasa matematika yang efisien</strong>. f(x) berarti <strong className="text-amber-300">"masukkan x, keluarkan hasilnya"</strong> — seperti kalkulator pribadi yang siap dipakai kapan saja!</>,
  },
  en: {
    badge: "Grade 8 · Relations and Functions · Math Material",
    title: "FUNCTION NOTATION AND FORMULAS",
    subtitle: "The Mathematical Language for Expressing Functions!",
    backBtn: "← Back to Relations and Functions",
    sec_intro_title: "🌟 Function Notation — A Powerful Shorthand",
    sec_notasi_title: "📘 Notation Forms and How to Read Them",
    sec_operasi_title: "🔧 Operations on Functions",
    sec_contoh1_title: "✏️ Example 1 — Basic Level",
    sec_contoh2_title: "✏️ Example 2 — Medium Level",
    sec_contoh3_title: "✏️ Example 3 — Advanced Level",
    sec_contoh4_title: "✏️ Example 4 — Finding x from the Image",
    sec_rangkuman_title: "📌 Summary & Conclusion",
    badge_easy: "EASY",
    badge_medium: "MEDIUM",
    badge_hard: "HARD",
    badge_challenge: "CHALLENGE",
    intro_p: "Instead of always writing \"the function that maps x to two times x plus three\", mathematicians use a concise universal notation. This notation lets us communicate function rules efficiently and precisely.",
    intro_anatomi: "📖 Anatomy of Function Notation",
    symbols: [
      { simbol: "f", arti: "Name of the function (can also be g, h, p, etc.)" },
      { simbol: "A → B", arti: "The function maps from set A to set B" },
      { simbol: "f(x)", arti: "Value of function f when input is x (read: 'f of x')" },
      { simbol: "2x + 3", arti: "The rule/formula connecting x to its output value" },
    ],
    notasi_summary: "🎯 Key Summary",
    notasi_p: (a: string, b: string, c: string, d: string, e: string, f2: string, g: string, h: string, k: string) =>
      <>Function <InlineMath math={a} /> from set <InlineMath math={b} /> to set <InlineMath math={c} /> is written <InlineMath math={d} />. If <InlineMath math={e} /> is mapped to <InlineMath math={f2} />, we write <InlineMath math={g} /> or <InlineMath math={h} />. The value <InlineMath math="y" /> is called the <strong className="text-yellow-300">image</strong> of <InlineMath math={k} /> under function <InlineMath math="f" />.</>,
    notasi_reading_title: "📋 How to Read Function Notation",
    notasi_rows: [
      { notasi: "f : A \\to B", baca: "f is a function from A to B", color: "cyan" },
      { notasi: "f(x) = 3x - 1", baca: "f of x equals three x minus one", color: "violet" },
      { notasi: "f(2) = 5", baca: "the value of f when x = 2 is 5", color: "green" },
      { notasi: "x \\mapsto 2x + 3", baca: "x is mapped to two x plus three", color: "orange" },
    ],
    calc_title: "🔢 How to Evaluate a Function",
    calc_example: "Example: If f(x) = 4x - 5, find f(3)",
    calc_step1: "Step 1: Write the function rule",
    calc_step2: "Step 2: Replace all x with 3",
    calc_key: "💡 Key:",
    calc_key_text: "Replace variable x with the given value, then compute the result!",
    ops_intro: "Two or more functions can be combined to produce a new function:",
    ops_col1: "Operation", ops_col2: "Notation", ops_col3: "Definition",
    ops_rows: [
      ["Addition", "(f + g)(x)", "f(x) + g(x)"],
      ["Subtraction", "(f - g)(x)", "f(x) - g(x)"],
      ["Multiplication", "(f · g)(x)", "f(x) × g(x)"],
      ["Division", "(f/g)(x)", "f(x) ÷ g(x), where g(x) ≠ 0"],
    ],
    ops_example: "Example: f(x) = 3x + 1 and g(x) = x - 2",
    c1_soal: "📝 Problem",
    c1_soal_p: <>Given function <InlineMath math="f(x) = 5x - 3" />. Calculate:</>,
    c1_disc: "🔍 Solution",
    c1_items: [
      { bagian: "a) f(0)", sub: "x = 0", kalkulasi: "f(0) = 5(0) - 3 = 0 - 3 = -3", hasil: "-3" },
      { bagian: "b) f(4)", sub: "x = 4", kalkulasi: "f(4) = 5(4) - 3 = 20 - 3 = 17", hasil: "17" },
      { bagian: "c) f(-2)", sub: "x = -2", kalkulasi: "f(-2) = 5(-2) - 3 = -10 - 3 = -13", hasil: "-13" },
    ],
    hasil_label: "Result:",
    c1_answer: "✅ f(0) = -3, f(4) = 17, f(-2) = -13",
    c2_soal_p: <>Given <InlineMath math="f(x) = 3x - 2" /> and <InlineMath math="g(x) = x^2 + 1" />. Find:</>,
    c2_disc: "🔍 Solution",
    c2_calc_intro: "First compute f(3) and g(3):",
    c2_answer: "✅ (f+g)(3) = 17, (f-g)(-1) = -7, (f·g)(2) = 20",
    c3_soal_p: <>Given function <InlineMath math="f(x) = px + q" />. If <InlineMath math="f(3) = 11" /> and <InlineMath math="f(5) = 17" />, find:</>,
    c3_a_label: "a) The values of p and q",
    c3_b_label: "b) The formula of f(x)",
    c3_c_label: (v: string) => <>c) The value of x when <InlineMath math={v} /></>,
    c3_disc: "🔍 Solution",
    c3_a_title: "a) Finding p and q:",
    c3_a_sub: "Substitute into f(x) = px + q:",
    c3_elim: "Eliminate: (2) − (1):",
    c3_sub_p: "Substitute p = 3 into (1):",
    c3_b_title: "b) Function Formula:",
    c3_c_title: "c) Finding x when f(x) = 29:",
    c3_answer: "✅ p = 3, q = 2, f(x) = 3x + 2, and x = 9 when f(x) = 29",
    c4_concept: "🎯 Concept:",
    c4_concept_p: "If we know the function f(x) and its image (value of f(x)), we can find x by solving the equation. Image = output of the function.",
    c4a_soal: "📝 Problem a",
    c4a_soal_p: <>Given function <InlineMath math="f(x) = 4x - 6" />. If the image of <InlineMath math="x" /> is <InlineMath math="18" />, find the value of <InlineMath math="x" />!</>,
    c4a_disc: "🔍 Solution a",
    c4a_disc_p: "The image of x is 18, meaning f(x) = 18. Substitute into the function formula:",
    c4a_answer: "✅ x = 6",
    c4a_verify: "Verify: f(6) = 4(6) − 6 = 24 − 6 = 18 ✓",
    c4b_soal: "📝 Problem b",
    c4b_soal_p: <>Given function <InlineMath math="g(x) = 3x + 5" />. The image of <InlineMath math="x" /> under function <InlineMath math="g" /> is <InlineMath math="-7" />. Find the value of <InlineMath math="x" />!</>,
    c4b_disc: "🔍 Solution b",
    c4b_disc_p: "Image −7 means g(x) = −7:",
    c4b_answer: "✅ x = −4",
    c4b_verify: "Verify: g(−4) = 3(−4) + 5 = −12 + 5 = −7 ✓",
    c4_remember: "💡 Remember:",
    c4_remember_p: "\"The image of x is k\" means f(x) = k. Just substitute and solve the equation to find x!",
    sum_title: "📚 Material Summary",
    sum_items: [
      { icon: "📐", label: "Function Notation", desc: "Written f : A → B or f(x) = ... A concise way to express the function rule." },
      { icon: "🔢", label: "f(x)", desc: "Value of function f when input is x. Also called 'the image of x'." },
      { icon: "🧮", label: "How to Evaluate", desc: "Replace all variable x with the requested value, then compute the result." },
      { icon: "➕", label: "Function Operations", desc: "(f ± g)(x) = f(x) ± g(x)  and  (f · g)(x) = f(x) · g(x)." },
      { icon: "🔍", label: "Finding x", desc: "If f(x) = k is given, treat it as an equation and isolate x." },
    ],
    tips_title: "💡 Tips & Tricks",
    tips: [
      "f(2) means replace x with 2 — not f × 2! Don't mix them up.",
      "To find x from f(x) = k: move all numbers to one side, x to the other.",
      "Function operations: compute f(x) and g(x) separately first, then combine the results.",
    ],
    concl_title: "🎯 Conclusion",
    concl_p: <>Function notation is an <strong className="text-orange-300">efficient mathematical language</strong>. f(x) means <strong className="text-amber-300">"put x in, get the result out"</strong> — like a personal calculator ready to use any time!</>,
  },
  ja: {
    badge: "中学2年 · 関係と関数 · 数学教材",
    title: "関数の表記と公式",
    subtitle: "関数を表現するための数学的言語！",
    backBtn: "← 関係と関数に戻る",
    sec_intro_title: "🌟 関数の表記 — 強力な省略記法",
    sec_notasi_title: "📘 表記の形式と読み方",
    sec_operasi_title: "🔧 関数の演算",
    sec_contoh1_title: "✏️ 例題 1 — 基本レベル",
    sec_contoh2_title: "✏️ 例題 2 — 標準レベル",
    sec_contoh3_title: "✏️ 例題 3 — 発展レベル",
    sec_contoh4_title: "✏️ 例題 4 — 像からxを求める",
    sec_rangkuman_title: "📌 まとめ・結論",
    badge_easy: "基本",
    badge_medium: "標準",
    badge_hard: "発展",
    badge_challenge: "チャレンジ",
    intro_p: "「xを2倍して3を加えた値に対応する関数」といちいち書く代わりに、数学者は簡潔で万国共通の表記を使います。この表記により、関数の規則を効率的かつ正確に伝えることができます。",
    intro_anatomi: "📖 関数表記の解剖",
    symbols: [
      { simbol: "f", arti: "関数の名前（g, h, p なども可）" },
      { simbol: "A → B", arti: "関数が集合Aから集合Bへ対応付ける" },
      { simbol: "f(x)", arti: "入力がxのときの関数fの値（「fのx」と読む）" },
      { simbol: "2x + 3", arti: "xと出力値を結ぶ規則/公式" },
    ],
    notasi_summary: "🎯 要点まとめ",
    notasi_p: (a: string, b: string, c: string, d: string, e: string, f2: string, g: string, h: string, k: string) =>
      <>集合 <InlineMath math={b} /> から集合 <InlineMath math={c} /> への関数 <InlineMath math={a} /> は <InlineMath math={d} /> と書きます。<InlineMath math={e} /> が <InlineMath math={f2} /> に対応するとき、<InlineMath math={g} /> または <InlineMath math={h} /> と書きます。<InlineMath math="y" /> の値は関数 <InlineMath math="f" /> による <InlineMath math={k} /> の<strong className="text-yellow-300">像</strong>と呼ばれます。</>,
    notasi_reading_title: "📋 関数表記の読み方",
    notasi_rows: [
      { notasi: "f : A \\to B", baca: "fはAからBへの関数", color: "cyan" },
      { notasi: "f(x) = 3x - 1", baca: "f(x) = 3x マイナス 1", color: "violet" },
      { notasi: "f(2) = 5", baca: "x = 2 のときのfの値は5", color: "green" },
      { notasi: "x \\mapsto 2x + 3", baca: "xは 2x + 3 に対応する", color: "orange" },
    ],
    calc_title: "🔢 関数の値の求め方",
    calc_example: "例：f(x) = 4x - 5 のとき、f(3) を求めよ",
    calc_step1: "ステップ1：関数の公式を書く",
    calc_step2: "ステップ2：すべてのxを3に置き換える",
    calc_key: "💡 ポイント：",
    calc_key_text: "変数xを与えられた値に置き換えて計算する！",
    ops_intro: "2つ以上の関数を演算して新しい関数を作ることができます：",
    ops_col1: "演算", ops_col2: "表記", ops_col3: "定義",
    ops_rows: [
      ["和", "(f + g)(x)", "f(x) + g(x)"],
      ["差", "(f - g)(x)", "f(x) - g(x)"],
      ["積", "(f · g)(x)", "f(x) × g(x)"],
      ["商", "(f/g)(x)", "f(x) ÷ g(x)、ただし g(x) ≠ 0"],
    ],
    ops_example: "例：f(x) = 3x + 1、g(x) = x - 2",
    c1_soal: "📝 問題",
    c1_soal_p: <>関数 <InlineMath math="f(x) = 5x - 3" /> が与えられています。次を計算しなさい：</>,
    c1_disc: "🔍 解説",
    c1_items: [
      { bagian: "a) f(0)", sub: "x = 0", kalkulasi: "f(0) = 5(0) - 3 = 0 - 3 = -3", hasil: "-3" },
      { bagian: "b) f(4)", sub: "x = 4", kalkulasi: "f(4) = 5(4) - 3 = 20 - 3 = 17", hasil: "17" },
      { bagian: "c) f(-2)", sub: "x = -2", kalkulasi: "f(-2) = 5(-2) - 3 = -10 - 3 = -13", hasil: "-13" },
    ],
    hasil_label: "答え：",
    c1_answer: "✅ f(0) = -3、f(4) = 17、f(-2) = -13",
    c2_soal_p: <><InlineMath math="f(x) = 3x - 2" />、<InlineMath math="g(x) = x^2 + 1" /> が与えられています。次を求めなさい：</>,
    c2_disc: "🔍 解説",
    c2_calc_intro: "まずf(3)とg(3)を計算する：",
    c2_answer: "✅ (f+g)(3) = 17、(f-g)(-1) = -7、(f·g)(2) = 20",
    c3_soal_p: <>関数 <InlineMath math="f(x) = px + q" /> が与えられています。<InlineMath math="f(3) = 11" />、<InlineMath math="f(5) = 17" /> のとき、次を求めなさい：</>,
    c3_a_label: "a) p と q の値",
    c3_b_label: "b) f(x) の公式",
    c3_c_label: (v: string) => <>c) <InlineMath math={v} /> のときの x の値</>,
    c3_disc: "🔍 解説",
    c3_a_title: "a) p と q を求める：",
    c3_a_sub: "f(x) = px + q に代入する：",
    c3_elim: "消去法：(2) − (1)：",
    c3_sub_p: "p = 3 を (1) に代入：",
    c3_b_title: "b) 関数の公式：",
    c3_c_title: "c) f(x) = 29 のときの x を求める：",
    c3_answer: "✅ p = 3、q = 2、f(x) = 3x + 2、f(x) = 29 のとき x = 9",
    c4_concept: "🎯 概念：",
    c4_concept_p: "関数f(x)とその像（f(x)の値）がわかれば、方程式を解いてxを求めることができます。像 = 関数の出力値。",
    c4a_soal: "📝 問題 a",
    c4a_soal_p: <>関数 <InlineMath math="f(x) = 4x - 6" /> において、<InlineMath math="x" /> の像が <InlineMath math="18" /> のとき、<InlineMath math="x" /> の値を求めなさい！</>,
    c4a_disc: "🔍 解法 a",
    c4a_disc_p: "xの像が18とはf(x) = 18を意味します。関数の公式に代入します：",
    c4a_answer: "✅ x = 6",
    c4a_verify: "確認：f(6) = 4(6) − 6 = 24 − 6 = 18 ✓",
    c4b_soal: "📝 問題 b",
    c4b_soal_p: <>関数 <InlineMath math="g(x) = 3x + 5" /> において、関数 <InlineMath math="g" /> による <InlineMath math="x" /> の像が <InlineMath math="-7" /> のとき、<InlineMath math="x" /> の値を求めなさい！</>,
    c4b_disc: "🔍 解法 b",
    c4b_disc_p: "像が−7ということはg(x) = −7を意味します：",
    c4b_answer: "✅ x = −4",
    c4b_verify: "確認：g(−4) = 3(−4) + 5 = −12 + 5 = −7 ✓",
    c4_remember: "💡 覚えよう：",
    c4_remember_p: "「xの像がk」はf(x) = kと同じ意味です。代入して方程式を解けばxが求まります！",
    sum_title: "📚 学習内容のまとめ",
    sum_items: [
      { icon: "📐", label: "関数の表記", desc: "f : A → B または f(x) = ... と書く。関数の規則を簡潔に表す方法。" },
      { icon: "🔢", label: "f(x)", desc: "入力がxのときの関数fの値。「xの像」とも呼ばれる。" },
      { icon: "🧮", label: "値の求め方", desc: "変数xを求められた値に置き換えて計算する。" },
      { icon: "➕", label: "関数の演算", desc: "(f ± g)(x) = f(x) ± g(x)  および  (f · g)(x) = f(x) · g(x)。" },
      { icon: "🔍", label: "xを求める", desc: "f(x) = k が与えられたら、方程式として解いてxを求める。" },
    ],
    tips_title: "💡 コツ・ポイント",
    tips: [
      "f(2)はxを2に置き換えること — f × 2ではない！混同しないように。",
      "f(x) = k からxを求める：数字を一方の辺に、xを他方の辺に移す。",
      "関数の演算：f(x)とg(x)をそれぞれ計算してから合わせる。",
    ],
    concl_title: "🎯 結論",
    concl_p: <>関数の表記は<strong className="text-orange-300">効率的な数学の言語</strong>です。f(x)は<strong className="text-amber-300">「xを入れて結果を出す」</strong>という意味で、いつでも使える個人計算機のようなものです！</>,
  },
} as const;

const NotasiFungsiPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "notasi", "operasi", "contoh1", "contoh2", "contoh3", "contoh4", "rangkuman",
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
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Code className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.subtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.badge}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_intro_title} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.intro_p}</p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{t.intro_anatomi}</p>
                  <div className="text-center">
                    <BlockMath math="f : A \to B,\ f(x) = 2x + 3" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs font-body mt-3">
                    {[
                      { ...t.symbols[0], color: "bg-cyan-900/40 border-cyan-500/30 text-cyan-200" },
                      { ...t.symbols[1], color: "bg-violet-900/40 border-violet-500/30 text-violet-200" },
                      { ...t.symbols[2], color: "bg-green-900/40 border-green-500/30 text-green-200" },
                      { ...t.symbols[3], color: "bg-orange-900/40 border-orange-500/30 text-orange-200" },
                    ].map(({ simbol, arti, color }) => (
                      <div key={simbol} className={`border ${color} rounded-lg px-3 py-2 flex gap-2 items-start`}>
                        <code className="font-bold font-mono text-sm shrink-0">{simbol}</code>
                        <span className="text-white/70">→ {arti}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NOTASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="notasi" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.sec_notasi_title} />
            {expandedSections.includes("notasi") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.notasi_summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.notasi_p("f","A","B","f : A \\to B","x \\in A","y \\in B","f(x) = y","y = f(x)","x")}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.notasi_reading_title}</p>
                  {t.notasi_rows.map(({ notasi, baca, color }) => (
                    <div key={notasi} className={`bg-${color}-900/20 border border-${color}-500/30 rounded-lg p-3 flex flex-col sm:flex-row gap-2`}>
                      <div className={`bg-${color}-900/40 rounded-lg px-3 py-2 text-sm font-mono min-w-fit`}>
                        <InlineMath math={notasi} />
                      </div>
                      <div className={`text-${color}-200 text-sm font-body flex items-center`}>→ "{baca}"</div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">{t.calc_title}</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold text-xs mb-2">{t.calc_example}</p>
                      <div className="space-y-1 text-xs text-white/70">
                        <p>{t.calc_step1}</p>
                        <BlockMath math="f(x) = 4x - 5" />
                        <p>{t.calc_step2}</p>
                        <BlockMath math="f(3) = 4(3) - 5 = 12 - 5 = 7" />
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                      <p className="text-xs text-yellow-200"><strong>{t.calc_key}</strong> {t.calc_key_text}</p>
                    </div>
                  </div>
                </div>

                <FunctionMachineAnimation />
              </div>
            )}
          </div>

          {/* OPERASI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="operasi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-orange-400" title={t.sec_operasi_title} />
            {expandedSections.includes("operasi") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/70 leading-relaxed">{t.ops_intro}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-orange-900/40">
                        <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">{t.ops_col1}</th>
                        <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">{t.ops_col2}</th>
                        <th className="border border-orange-500/30 px-3 py-2 text-orange-200 text-left">{t.ops_col3}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.ops_rows.map(([op, not, def], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-orange-300 font-semibold">{op}</td>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-mono">{not}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{def}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-orange-300 mb-2">{t.ops_example}</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-white/70"><BlockMath math="(f+g)(x) = (3x+1) + (x-2) = 4x - 1" /></div>
                    <div className="text-white/70"><BlockMath math="(f-g)(x) = (3x+1) - (x-2) = 2x + 3" /></div>
                    <div className="text-white/70"><BlockMath math="(f \cdot g)(x) = (3x+1)(x-2) = 3x^2 - 5x - 2" /></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.sec_contoh1_title} />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.c1_soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {t.c1_soal_p}
                    <br />a) <InlineMath math="f(0)" />
                    <br />b) <InlineMath math="f(4)" />
                    <br />c) <InlineMath math="f(-2)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c1_disc}</p>
                  <div className="space-y-3 text-sm font-body">
                    {t.c1_items.map(({ bagian, sub, kalkulasi, hasil }) => (
                      <div key={bagian} className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-cyan-300 font-semibold text-xs mb-1">{bagian} ({sub})</p>
                        <p className="text-white/70 text-xs">{kalkulasi}</p>
                        <p className="text-green-300 font-bold text-sm mt-1">{t.hasil_label} {hasil}</p>
                      </div>
                    ))}
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">{t.c1_answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec_contoh2_title} />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_medium} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.c1_soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {t.c2_soal_p}
                    <br />a) <InlineMath math="(f + g)(3)" />
                    <br />b) <InlineMath math="(f - g)(-1)" />
                    <br />c) <InlineMath math="(f \cdot g)(2)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c2_disc}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) (f + g)(3):</p>
                      <p className="text-white/60 text-xs mb-1">{t.c2_calc_intro}</p>
                      <BlockMath math="f(3) = 3(3) - 2 = 7" />
                      <BlockMath math="g(3) = 3^2 + 1 = 10" />
                      <BlockMath math="(f+g)(3) = f(3) + g(3) = 7 + 10 = 17" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">b) (f - g)(-1):</p>
                      <BlockMath math="f(-1) = 3(-1) - 2 = -5" />
                      <BlockMath math="g(-1) = (-1)^2 + 1 = 2" />
                      <BlockMath math="(f-g)(-1) = -5 - 2 = -7" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-2">c) (f · g)(2):</p>
                      <BlockMath math="f(2) = 3(2) - 2 = 4" />
                      <BlockMath math="g(2) = 2^2 + 1 = 5" />
                      <BlockMath math="(f \cdot g)(2) = 4 \times 5 = 20" />
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">{t.c2_answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.sec_contoh3_title} />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.c1_soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    {t.c3_soal_p}
                    <br />a) {t.c3_a_label}
                    <br />b) {t.c3_b_label}
                    <br />{t.c3_c_label("f(x) = 29")}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c3_disc}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.c3_a_title}</p>
                      <p className="text-white/60 text-xs mb-1">{t.c3_a_sub}</p>
                      <BlockMath math="f(3) = 3p + q = 11 \quad \cdots (1)" />
                      <BlockMath math="f(5) = 5p + q = 17 \quad \cdots (2)" />
                      <p className="text-white/60 text-xs mt-1 mb-1">{t.c3_elim}</p>
                      <BlockMath math="2p = 6 \implies p = 3" />
                      <p className="text-white/60 text-xs mb-1">{t.c3_sub_p}</p>
                      <BlockMath math="3(3) + q = 11 \implies 9 + q = 11 \implies q = 2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.c3_b_title}</p>
                      <BlockMath math="f(x) = 3x + 2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">{t.c3_c_title}</p>
                      <BlockMath math="3x + 2 = 29" />
                      <BlockMath math="3x = 27 \implies x = 9" />
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">{t.c3_answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title={t.sec_contoh4_title} />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_challenge} color="bg-purple-700/60 text-purple-200" />
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-purple-200 leading-relaxed">
                    <strong>{t.c4_concept}</strong> {t.c4_concept_p}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.c4a_soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">{t.c4a_soal_p}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c4a_disc}</p>
                  <p className="font-body text-xs text-white/60">{t.c4a_disc_p}</p>
                  <BlockMath math="f(x) = 18" />
                  <BlockMath math="4x - 6 = 18" />
                  <BlockMath math="4x = 18 + 6 = 24" />
                  <BlockMath math="x = \frac{24}{4} = 6" />
                  <div className="bg-purple-500/10 border border-purple-500/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-sm font-bold text-purple-300">{t.c4a_answer}</p>
                    <p className="font-body text-xs text-white/50 mt-1">{t.c4a_verify}</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.c4b_soal}</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">{t.c4b_soal_p}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.c4b_disc}</p>
                  <p className="font-body text-xs text-white/60">{t.c4b_disc_p}</p>
                  <BlockMath math="g(x) = -7" />
                  <BlockMath math="3x + 5 = -7" />
                  <BlockMath math="3x = -7 - 5 = -12" />
                  <BlockMath math="x = \frac{-12}{3} = -4" />
                  <div className="bg-purple-500/10 border border-purple-500/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-sm font-bold text-purple-300">{t.c4b_answer}</p>
                    <p className="font-body text-xs text-white/50 mt-1">{t.c4b_verify}</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.c4_remember}</strong> {t.c4_remember_p}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.sec_rangkuman_title} />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-6 space-y-4">
                <p className="font-display text-xs font-bold text-orange-300 uppercase tracking-wider pt-1">{t.sum_title}</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { ...t.sum_items[0], color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
                    { ...t.sum_items[1], color: "from-amber-900/60 to-yellow-900/60 border-amber-500/40 text-amber-300" },
                    { ...t.sum_items[2], color: "from-yellow-900/60 to-lime-900/60 border-yellow-500/40 text-yellow-300" },
                    { ...t.sum_items[3], color: "from-green-900/60 to-emerald-900/60 border-green-500/40 text-green-300" },
                    { ...t.sum_items[4], color: "from-blue-900/60 to-indigo-900/60 border-blue-500/40 text-blue-300" },
                  ].map(({ icon, label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className="font-body text-xs text-white/80 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">{t.tips_title}</p>
                  <div className="space-y-2">
                    {t.tips.map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                        <p className="font-body text-xs text-amber-100/90 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-900/60 to-amber-900/60 border border-orange-400/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-orange-300 uppercase tracking-wider mb-2">{t.concl_title}</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">{t.concl_p}</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotasiFungsiPage;
