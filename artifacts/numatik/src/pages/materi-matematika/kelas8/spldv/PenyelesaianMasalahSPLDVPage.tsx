import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, CheckCircle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    pageTitle: "PENYELESAIAN MASALAH SPLDV",
    pageSubtitle: "Dari Soal Cerita Hingga Jawaban Lengkap — Satu Alur Terpadu",
    gradeLabel: "Kelas 8 · SPLDV · Materi Matematika",
    secIntro: "🌟 Menyelesaikan Masalah Nyata dengan SPLDV",
    secLangkah: "📘 Langkah Penyelesaian Masalah SPLDV",
    secContoh1: "✏️ Contoh 1 — Tingkat Mudah (Harga Barang)",
    secContoh2: "✏️ Contoh 2 — Tingkat Sedang (Soal Umur)",
    secContoh3: "✏️ Contoh 3 — Tingkat Sulit (Geometri & Ukuran)",
    secRangkuman: "📌 Rangkuman",
    introDesc: "Setelah kita bisa membuat model SPLDV dari soal cerita, langkah berikutnya adalah menyelesaikannya secara tuntas — mulai dari memahami soal, membangun model, menyelesaikan dengan metode yang tepat, hingga menafsirkan jawaban kembali ke konteks soal. Inilah siklus penyelesaian masalah matematika yang sesungguhnya!",
    cycleTitle: "🔁 Siklus Penyelesaian Masalah SPLDV",
    cycleSteps: [
      { step: "1", label: "PAHAMI", desc: "Baca soal, identifikasi yang diketahui & ditanya", color: "bg-orange-900/40 border-orange-500/40 text-orange-200" },
      { step: "2", label: "RENCANAKAN", desc: "Pilih variabel & buat model SPLDV", color: "bg-violet-900/40 border-violet-500/40 text-violet-200" },
      { step: "3", label: "SELESAIKAN", desc: "Gunakan metode eliminasi, substitusi, atau campuran", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
      { step: "4", label: "TAFSIRKAN", desc: "Kembalikan jawaban ke konteks soal & verifikasi", color: "bg-green-900/40 border-green-500/40 text-green-200" },
    ],
    introTip: "Jangan lupa Langkah 4! Banyak siswa melewatkan tahap penafsiran — padahal di sinilah jawaban matematika diubah kembali menjadi kalimat yang menjawab pertanyaan soal.",
    summaryTitle: "🎯 Ringkasan Intisari",
    summaryDesc: "Penyelesaian masalah SPLDV adalah proses lengkap yang menyatukan kemampuan memahami soal, membuat model matematika, memilih dan menerapkan metode penyelesaian yang tepat, serta mengomunikasikan jawaban secara jelas dan kontekstual.",
    stepsTitle: "📋 5 Langkah Penyelesaian Masalah",
    step1Title: "Baca & Pahami Soal",
    step1Desc: "Identifikasi: apa yang diketahui? Apa yang ditanyakan? Adakah kondisi atau batasan khusus?",
    step2Title: "Tentukan Variabel & Buat Model SPLDV",
    step2Desc: "Beri nama variabel untuk dua besaran yang tidak diketahui. Terjemahkan dua informasi dari soal menjadi dua persamaan linear.",
    step3Title: "Pilih & Terapkan Metode Penyelesaian",
    step3Desc: "Gunakan metode yang paling efisien (substitusi, eliminasi, atau campuran) untuk menyelesaikan SPLDV dan menemukan nilai kedua variabel.",
    step4Title: "Verifikasi Jawaban",
    step4Desc: "Masukkan nilai variabel yang ditemukan ke kedua persamaan asli. Pastikan keduanya terpenuhi sebelum melanjutkan.",
    step5Title: "Tafsirkan & Komunikasikan Jawaban",
    step5Desc: "Ubah jawaban matematika kembali ke kalimat yang menjawab pertanyaan soal. Sertakan satuan yang sesuai.",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    fullSolTitle: "🔍 Pembahasan Lengkap (5 Langkah)",
    q1Problem: "Seorang pelanggan membeli 3 kg apel dan 2 kg jeruk seharga $54. Di toko yang sama, pelanggan lain membeli 1 kg apel dan 4 kg jeruk seharga $52. Berapa harga 1 kg apel dan 1 kg jeruk masing-masing?",
    q1L1Title: "Langkah 1 — Pahami Soal:",
    q1L1Points: ["Diketahui: dua kombinasi pembelian apel dan jeruk beserta harganya", "Ditanya: harga 1 kg apel dan harga 1 kg jeruk"],
    q1L2Title: "Langkah 2 — Variabel & Model:",
    q1L2Let: "Misalkan",
    q1L2Var1: "= harga 1 kg apel ($)",
    q1L2Var2: "= harga 1 kg jeruk ($)",
    q1L3Title: "Langkah 3 — Metode Campuran (Eliminasi lalu Substitusi):",
    q1L3Equalize: "Samakan koefisien",
    q1L3Calc: "Kalikan kedua persamaan",
    q1L3Vanish: "Koefisien a sama tanda → dikurangkan, a lenyap:",
    q1L3Subst: "Substitusi",
    q1L3Into: "ke Persamaan (II):",
    q1L4Title: "Langkah 4 — Verifikasi:",
    q1L5Title: "Langkah 5 — Jawaban:",
    q1Answer: "Harga 1 kg apel adalah $11.20 dan harga 1 kg jeruk adalah $10.20.",
    q2Problem: "Lima tahun lalu, umur Mr. Wells adalah empat kali umur anaknya, Indie. Tiga tahun mendatang, jumlah umur keduanya akan menjadi 56 tahun. Berapakah umur Mr. Wells dan Indie saat ini?",
    q2L1Title: "Langkah 1 — Pahami Soal:",
    q2L1Points: ["Informasi 1: kondisi 5 tahun lalu", "Informasi 2: kondisi 3 tahun mendatang", "Ditanya: umur sekarang"],
    q2L2Title: "Langkah 2 — Variabel & Model:",
    q2L2Let: "Misalkan",
    q2L2Var1: "= umur Mr. Wells sekarang",
    q2L2Var2: "= umur Indie sekarang",
    q2L2P1Note: "5 tahun lalu: Mr. Wells berumur",
    q2L2P2Note: "Indie berumur",
    q2L2S1: "Pernyataan 1: \"adalah 4 kali\"",
    q2L2S2: "3 tahun mendatang: jumlah umur = 56",
    q2L3Title: "Langkah 3 — Metode Eliminasi:",
    q2L3EqNote: "Koefisien h sudah sama → langsung operasikan",
    q2L3SubNote: "Kurangkan P2 − P1 → h lenyap:",
    q2L3SubstNote: "Substitusi",
    q2L3SubstInto: "ke Persamaan (II):",
    q2L4Title: "Langkah 4 — Verifikasi:",
    q2L4Check1: "Cek 5 tahun lalu:",
    q2L4Check2: "Cek 3 tahun lagi:",
    q2L5Title: "Langkah 5 — Jawaban:",
    q2Answer: "Umur Mr. Wells sekarang adalah 37 tahun dan umur Indie sekarang adalah 13 tahun.",
    q3Problem: "Sebuah kolam renang berbentuk persegi panjang memiliki keliling 54 meter. Panjangnya adalah 3 meter lebih dari dua kali lebarnya. Hitunglah luas kolam renang tersebut!",
    q3L1Title: "Langkah 1 — Pahami Soal:",
    q3L1Points: ["Diketahui: keliling persegi panjang = 54 m dan hubungan panjang-lebar", "Ditanya: luas kolam renang"],
    q3L2Title: "Langkah 2 — Variabel & Model:",
    q3L2Let: "Misalkan",
    q3L2Var1: "= panjang kolam (m)",
    q3L2Var2: "= lebar kolam (m)",
    q3L2Rel1: "Dari keliling:",
    q3L2Rel2: "Dari hubungan panjang-lebar: \"panjang = 3 lebih dari dua kali lebar\"",
    q3L3Title: "Langkah 3 — Metode Substitusi:",
    q3L3SubstNote: "Substitusikan",
    q3L3SubstInto: "ke Persamaan (I):",
    q3L4Title: "Langkah 4 — Verifikasi:",
    q3L4Check1: "Cek keliling:",
    q3L4Check2: "Cek hubungan:",
    q3L5Title: "Langkah 5 — Jawaban:",
    q3Answer: "Luas kolam = panjang × lebar = 19 × 8 = 152 m²",
    summaryPoints: [
      { poin: "Selalu ikuti 5 langkah: pahami → model → selesaikan → verifikasi → tafsirkan.", icon: "📋" },
      { poin: "Langkah paling sering terlewat: Langkah 5 (penafsiran). Jawaban harus kembali ke konteks soal!", icon: "⚠️" },
      { poin: "Pilih metode penyelesaian yang paling efisien berdasarkan bentuk persamaan yang diperoleh.", icon: "🎯" },
      { poin: "Verifikasi wajib dilakukan ke KEDUA persamaan, bukan hanya satu.", icon: "✅" },
      { poin: "Dalam soal nyata, pastikan jawaban masuk akal secara logika (harga tidak negatif, umur tidak negatif, dll.).", icon: "🧠" },
    ],
    backBtn: "← Kembali ke Menu SPLDV",
  },
  en: {
    pageTitle: "SOLVING REAL-WORLD SLETV PROBLEMS",
    pageSubtitle: "From Word Problems to Complete Solutions — One Unified Approach",
    gradeLabel: "Grade 8 · SLETV · Mathematics",
    secIntro: "🌟 Solving Real-World Problems with SLETV",
    secLangkah: "📘 Problem-Solving Steps for SLETV",
    secContoh1: "✏️ Example 1 — Easy (Prices of Items)",
    secContoh2: "✏️ Example 2 — Medium (Age Problem)",
    secContoh3: "✏️ Example 3 — Hard (Geometry & Dimensions)",
    secRangkuman: "📌 Summary",
    introDesc: "After building an SLETV model from a word problem, the next step is to solve it completely — from understanding the problem and building the model, to applying the right method and interpreting the answer back in context. This is the real mathematical problem-solving cycle!",
    cycleTitle: "🔁 SLETV Problem-Solving Cycle",
    cycleSteps: [
      { step: "1", label: "UNDERSTAND", desc: "Read the problem, identify what is known & asked", color: "bg-orange-900/40 border-orange-500/40 text-orange-200" },
      { step: "2", label: "PLAN", desc: "Choose variables & build the SLETV model", color: "bg-violet-900/40 border-violet-500/40 text-violet-200" },
      { step: "3", label: "SOLVE", desc: "Apply elimination, substitution, or combined method", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
      { step: "4", label: "INTERPRET", desc: "Return the answer to the problem context & verify", color: "bg-green-900/40 border-green-500/40 text-green-200" },
    ],
    introTip: "Don't skip Step 4! Many students miss the interpretation phase — yet this is where the mathematical answer is turned back into a sentence that actually answers the question.",
    summaryTitle: "🎯 Key Summary",
    summaryDesc: "Solving an SLETV problem is a complete process that unites the ability to understand the problem, build a mathematical model, choose and apply the right solution method, and communicate the answer clearly in context.",
    stepsTitle: "📋 5 Problem-Solving Steps",
    step1Title: "Read & Understand the Problem",
    step1Desc: "Identify: what is known? What is asked? Are there special conditions or constraints?",
    step2Title: "Define Variables & Build the SLETV Model",
    step2Desc: "Name variables for the two unknowns. Translate two pieces of information from the problem into two linear equations.",
    step3Title: "Choose & Apply a Solution Method",
    step3Desc: "Use the most efficient method (substitution, elimination, or combined) to solve the system and find both variables.",
    step4Title: "Verify the Answer",
    step4Desc: "Substitute the found values back into both original equations. Make sure both are satisfied before moving on.",
    step5Title: "Interpret & Communicate the Answer",
    step5Desc: "Turn the mathematical answer back into a sentence that answers the problem's question. Include appropriate units.",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    fullSolTitle: "🔍 Complete Solution (5 Steps)",
    q1Problem: "A customer buys 3 kg of apples and 2 kg of oranges for $54. At the same store, another customer buys 1 kg of apples and 4 kg of oranges for $52. What is the price per kg of apples and oranges?",
    q1L1Title: "Step 1 — Understand the Problem:",
    q1L1Points: ["Given: two purchase combinations with prices", "Find: price per kg of apples and per kg of oranges"],
    q1L2Title: "Step 2 — Variables & Model:",
    q1L2Let: "Let",
    q1L2Var1: "= price of 1 kg apples ($)",
    q1L2Var2: "= price of 1 kg oranges ($)",
    q1L3Title: "Step 3 — Combined Method (Elimination then Substitution):",
    q1L3Equalize: "Equalize coefficient of",
    q1L3Calc: "Multiply both equations",
    q1L3Vanish: "Same-sign a coefficients → subtract, a vanishes:",
    q1L3Subst: "Substitute",
    q1L3Into: "into Equation (II):",
    q1L4Title: "Step 4 — Verify:",
    q1L5Title: "Step 5 — Answer:",
    q1Answer: "Price of 1 kg apples: $11.20 and price of 1 kg oranges: $10.20.",
    q2Problem: "Five years ago, Mr. Wells's age was four times his child Indie's age. Three years from now, the sum of their ages will be 56. What are Mr. Wells's and Indie's current ages?",
    q2L1Title: "Step 1 — Understand the Problem:",
    q2L1Points: ["Info 1: condition 5 years ago", "Info 2: condition 3 years from now", "Find: current ages"],
    q2L2Title: "Step 2 — Variables & Model:",
    q2L2Let: "Let",
    q2L2Var1: "= Mr. Wells's current age",
    q2L2Var2: "= Indie's current age",
    q2L2P1Note: "5 years ago: Mr. Wells was",
    q2L2P2Note: "Indie was",
    q2L2S1: "Statement 1: \"was 4 times\"",
    q2L2S2: "3 years from now: sum of ages = 56",
    q2L3Title: "Step 3 — Elimination Method:",
    q2L3EqNote: "h coefficients already equal → apply directly",
    q2L3SubNote: "Subtract P2 − P1 → h vanishes:",
    q2L3SubstNote: "Substitute",
    q2L3SubstInto: "into Equation (II):",
    q2L4Title: "Step 4 — Verify:",
    q2L4Check1: "Check 5 years ago:",
    q2L4Check2: "Check 3 years from now:",
    q2L5Title: "Step 5 — Answer:",
    q2Answer: "Mr. Wells's current age is 37 years and Indie's current age is 13 years.",
    q3Problem: "A rectangular swimming pool has a perimeter of 54 meters. Its length is 3 meters more than twice its width. Calculate the area of the pool!",
    q3L1Title: "Step 1 — Understand the Problem:",
    q3L1Points: ["Given: perimeter of rectangle = 54 m and length-width relationship", "Find: area of the pool"],
    q3L2Title: "Step 2 — Variables & Model:",
    q3L2Let: "Let",
    q3L2Var1: "= length of pool (m)",
    q3L2Var2: "= width of pool (m)",
    q3L2Rel1: "From perimeter:",
    q3L2Rel2: "From length-width relationship: \"length = 3 more than twice the width\"",
    q3L3Title: "Step 3 — Substitution Method:",
    q3L3SubstNote: "Substitute",
    q3L3SubstInto: "into Equation (I):",
    q3L4Title: "Step 4 — Verify:",
    q3L4Check1: "Check perimeter:",
    q3L4Check2: "Check relationship:",
    q3L5Title: "Step 5 — Answer:",
    q3Answer: "Area = length × width = 19 × 8 = 152 m²",
    summaryPoints: [
      { poin: "Always follow 5 steps: understand → model → solve → verify → interpret.", icon: "📋" },
      { poin: "Most often skipped: Step 5 (interpretation). The answer must return to the problem context!", icon: "⚠️" },
      { poin: "Choose the most efficient solution method based on the form of equations obtained.", icon: "🎯" },
      { poin: "Verification must be done in BOTH equations, not just one.", icon: "✅" },
      { poin: "In real problems, make sure the answer is logically reasonable (prices not negative, ages not negative, etc.).", icon: "🧠" },
    ],
    backBtn: "← Back to SLETV Menu",
  },
  ja: {
    pageTitle: "連立方程式を使った実問題の解法",
    pageSubtitle: "文章題から完全な解答まで — 一つの統合されたアプローチ",
    gradeLabel: "中学2年 · 連立方程式 · 数学",
    secIntro: "🌟 連立方程式で現実の問題を解く",
    secLangkah: "📘 連立方程式の問題解決ステップ",
    secContoh1: "✏️ 例1 — 基本（商品の価格）",
    secContoh2: "✏️ 例2 — 標準（年齢の問題）",
    secContoh3: "✏️ 例3 — 発展（図形と寸法）",
    secRangkuman: "📌 まとめ",
    introDesc: "文章題から連立方程式モデルを作れたら、次のステップは完全に解くことです — 問題の理解、モデルの構築、適切な方法の選択、そして答えを文脈に戻して解釈することまで。これが本物の数学的問題解決サイクルです！",
    cycleTitle: "🔁 連立方程式問題解決サイクル",
    cycleSteps: [
      { step: "1", label: "理解する", desc: "問題を読み、わかっていることと求めることを特定する", color: "bg-orange-900/40 border-orange-500/40 text-orange-200" },
      { step: "2", label: "計画する", desc: "変数を選び、連立方程式のモデルを作る", color: "bg-violet-900/40 border-violet-500/40 text-violet-200" },
      { step: "3", label: "解く", desc: "加減法、代入法、または組み合わせ法を適用する", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
      { step: "4", label: "解釈する", desc: "答えを問題の文脈に戻して確認する", color: "bg-green-900/40 border-green-500/40 text-green-200" },
    ],
    introTip: "ステップ4を忘れずに！多くの生徒が解釈のステップを省きますが、ここで数学の答えを実際の質問への答えとなる文に変換します。",
    summaryTitle: "🎯 要点まとめ",
    summaryDesc: "連立方程式の問題解決は、問題の理解、数学的モデルの構築、適切な解法の選択と適用、そして答えを明確に文脈的に伝えるという能力を統合した完全なプロセスです。",
    stepsTitle: "📋 問題解決5ステップ",
    step1Title: "問題を読んで理解する",
    step1Desc: "わかっていることは何？求めることは何？特別な条件や制約はありますか？",
    step2Title: "変数を決め、連立方程式モデルを作る",
    step2Desc: "2つの未知量に変数名をつけます。問題の2つの情報を2本の一次方程式に変換します。",
    step3Title: "解法を選び適用する",
    step3Desc: "最も効率的な方法（代入法、加減法、または組み合わせ法）を使って連立方程式を解き、両方の変数の値を求めます。",
    step4Title: "答えを確認する",
    step4Desc: "求めた値を元の2本の方程式に代入します。先に進む前に両方が成立することを確認します。",
    step5Title: "答えを解釈・伝える",
    step5Desc: "数学の答えを問題の質問に答える文章に変換します。適切な単位を含めます。",
    easy: "基本", medium: "標準", hard: "発展",
    fullSolTitle: "🔍 完全な解説（5ステップ）",
    q1Problem: "ある客がリンゴ3kgとオレンジ2kgを$54で買いました。同じ店で別の客がリンゴ1kgとオレンジ4kgを$52で買いました。リンゴとオレンジそれぞれ1kgの価格はいくら？",
    q1L1Title: "ステップ1 — 問題を理解する：",
    q1L1Points: ["わかっていること：2つの購入の組み合わせと価格", "求めること：リンゴとオレンジの1kgあたりの価格"],
    q1L2Title: "ステップ2 — 変数とモデル：",
    q1L2Let: "設：",
    q1L2Var1: "= リンゴ1kgの価格（$）",
    q1L2Var2: "= オレンジ1kgの価格（$）",
    q1L3Title: "ステップ3 — 組み合わせ法（加減法 → 代入法）：",
    q1L3Equalize: "係数を揃える：",
    q1L3Calc: "両方の方程式を掛ける",
    q1L3Vanish: "aの係数が同符号 → 引く、aが消える：",
    q1L3Subst: "代入：",
    q1L3Into: "を方程式（II）に：",
    q1L4Title: "ステップ4 — 確認：",
    q1L5Title: "ステップ5 — 答え：",
    q1Answer: "リンゴ1kgの価格：$11.20、オレンジ1kgの価格：$10.20。",
    q2Problem: "5年前、Mr. Wellsの年齢は子どものIndieの年齢の4倍でした。3年後、2人の年齢の和は56歳になります。Mr. WellsとIndieの現在の年齢はそれぞれいくつ？",
    q2L1Title: "ステップ1 — 問題を理解する：",
    q2L1Points: ["情報1：5年前の状況", "情報2：3年後の状況", "求めること：現在の年齢"],
    q2L2Title: "ステップ2 — 変数とモデル：",
    q2L2Let: "設：",
    q2L2Var1: "= Mr. Wellsの現在の年齢",
    q2L2Var2: "= Indieの現在の年齢",
    q2L2P1Note: "5年前：Mr. Wellsは",
    q2L2P2Note: "Indieは",
    q2L2S1: "条件1：「4倍だった」",
    q2L2S2: "3年後：年齢の和 = 56",
    q2L3Title: "ステップ3 — 加減法：",
    q2L3EqNote: "hの係数はすでに等しい → そのまま操作",
    q2L3SubNote: "P2 − P1 → hが消える：",
    q2L3SubstNote: "代入：",
    q2L3SubstInto: "を方程式（II）に：",
    q2L4Title: "ステップ4 — 確認：",
    q2L4Check1: "5年前を確認：",
    q2L4Check2: "3年後を確認：",
    q2L5Title: "ステップ5 — 答え：",
    q2Answer: "Mr. Wellsの現在の年齢は37歳、Indieの現在の年齢は13歳。",
    q3Problem: "長方形の形をしたプールの周囲の長さは54メートルです。長さは幅の2倍より3メートル長いです。プールの面積を求めなさい！",
    q3L1Title: "ステップ1 — 問題を理解する：",
    q3L1Points: ["わかっていること：長方形の周囲の長さ = 54 m と縦横の関係", "求めること：プールの面積"],
    q3L2Title: "ステップ2 — 変数とモデル：",
    q3L2Let: "設：",
    q3L2Var1: "= プールの長さ（m）",
    q3L2Var2: "= プールの幅（m）",
    q3L2Rel1: "周囲の長さから：",
    q3L2Rel2: "縦横の関係：「長さ = 幅の2倍 + 3」",
    q3L3Title: "ステップ3 — 代入法：",
    q3L3SubstNote: "代入：",
    q3L3SubstInto: "を方程式（I）に：",
    q3L4Title: "ステップ4 — 確認：",
    q3L4Check1: "周囲の長さを確認：",
    q3L4Check2: "関係を確認：",
    q3L5Title: "ステップ5 — 答え：",
    q3Answer: "面積 = 長さ × 幅 = 19 × 8 = 152 m²",
    summaryPoints: [
      { poin: "常に5ステップに従う：理解 → モデル → 解く → 確認 → 解釈。", icon: "📋" },
      { poin: "最も省略されがちなのはステップ5（解釈）。答えは問題の文脈に戻らなければならない！", icon: "⚠️" },
      { poin: "得られた方程式の形に基づいて最も効率的な解法を選ぶ。", icon: "🎯" },
      { poin: "確認は1本ではなく元の2本の方程式両方で行う。", icon: "✅" },
      { poin: "実際の問題では、答えが論理的に合理的かどうかを確認する（価格や年齢が負にならないなど）。", icon: "🧠" },
    ],
    backBtn: "← 連立方程式メニューに戻る",
  },
};

const PenyelesaianMasalahSPLDVPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "langkah", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
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

  const Step = ({ no, title, children, color = "border-cyan-500/30 bg-cyan-900/10" }: { no: string; title: string; children: React.ReactNode; color?: string }) => (
    <div className={`border ${color} rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-display text-sm font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">{no}</span>
        <p className="font-body text-sm font-semibold text-white">{title}</p>
      </div>
      <div className="font-body text-sm text-white/80 pl-8">{children}</div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.pageTitle}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.pageSubtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.gradeLabel}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secIntro} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introDesc}</p>
                <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{t.cycleTitle}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-body">
                    {t.cycleSteps.map(({ step, label, desc, color }) => (
                      <div key={step} className={`border ${color} rounded-lg p-2`}>
                        <p className="font-bold">{step}. {label}</p>
                        <p className="text-white/60 mt-0.5">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.introTip}</strong></p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<CheckCircle className="w-5 h-5" />} iconColor="text-green-400" title={t.secLangkah} />
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.summaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.summaryDesc}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.stepsTitle}</p>
                  <Step no="1" title={t.step1Title} color="border-orange-500/30 bg-orange-900/10"><p className="text-white/70">{t.step1Desc}</p></Step>
                  <Step no="2" title={t.step2Title} color="border-violet-500/30 bg-violet-900/10"><p className="text-white/70">{t.step2Desc}</p></Step>
                  <Step no="3" title={t.step3Title} color="border-cyan-500/30 bg-cyan-900/10"><p className="text-white/70">{t.step3Desc}</p></Step>
                  <Step no="4" title={t.step4Title} color="border-green-500/30 bg-green-900/10"><p className="text-white/70">{t.step4Desc}</p></Step>
                  <Step no="5" title={t.step5Title} color="border-pink-500/30 bg-pink-900/10"><p className="text-white/70">{t.step5Desc}</p></Step>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.secContoh1} />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm text-white/85 leading-relaxed">{t.q1Problem}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.fullSolTitle}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold">{t.q1L1Title}</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2 mt-1">{t.q1L1Points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold">{t.q1L2Title}</p>
                      <p className="text-white/70 text-xs mt-1">{t.q1L2Let} <InlineMath math="a" /> {t.q1L2Var1}, <InlineMath math="j" /> {t.q1L2Var2}</p>
                      <BlockMath math="\begin{cases} 3a + 2j = 54 \quad \cdots (I) \\ a + 4j = 52 \quad \cdots (II) \end{cases}" />
                    </div>
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 space-y-2">
                      <p className="text-cyan-300 font-semibold">{t.q1L3Title}</p>
                      <p className="text-white/60 text-xs">{t.q1L3Equalize} <InlineMath math="a" /> ({t.q1L3Calc}):</p>
                      <div className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 space-y-1 font-body">
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5">P1</span><span className="text-white/80">3a + 2j = 54</span><span className="text-white/30 text-xs mx-1">|×1|</span></div>
                        <div className="flex items-center gap-2 font-mono text-sm"><span className="text-white/50 w-5">P2</span><span className="text-white/80">a + 4j = 52</span><span className="text-yellow-300 font-bold mx-1">|×3|</span><span className="text-cyan-300 font-bold">3a + 12j = 156</span></div>
                      </div>
                      <p className="text-white/60 text-xs">{t.q1L3Vanish}</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-10">P2×3</span><span className="text-white font-mono">3a + 12j = 156</span></div>
                        <div className="flex items-center gap-2 pb-1 border-b border-white/20"><span className="text-white/40 w-10">P1×1</span><span className="text-white font-mono">3a + 2j = 54</span><span className="text-red-400 font-bold ml-2">−</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-cyan-300 font-mono font-bold">10j = 102</span></div>
                      </div>
                      <BlockMath math="j = \dfrac{102}{10} = 10.2" />
                      <p className="text-white/60 text-xs">{t.q1L3Subst} <InlineMath math="j = 10.2" /> {t.q1L3Into}</p>
                      <div className="bg-slate-800/50 rounded-lg p-2">
                        <BlockMath math="a + 4(10.2) = 52 \Rightarrow a + 40.8 = 52 \Rightarrow a = 11.2" />
                      </div>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold">{t.q1L4Title}</p>
                      <p className="text-white/70 text-xs">(I): <InlineMath math="3(11.2) + 2(10.2) = 33.6 + 20.4 = 54" /> ✅</p>
                      <p className="text-white/70 text-xs">(II): <InlineMath math="11.2 + 4(10.2) = 11.2 + 40.8 = 52" /> ✅</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.q1L5Title}</p>
                      <p className="font-body text-sm text-white/80">{t.q1Answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secContoh2} />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.medium} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm text-white/85 leading-relaxed">{t.q2Problem}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.fullSolTitle}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold">{t.q2L1Title}</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2 mt-1">{t.q2L1Points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold">{t.q2L2Title}</p>
                      <p className="text-white/70 text-xs mt-1">{t.q2L2Let} <InlineMath math="h" /> {t.q2L2Var1}, <InlineMath math="r" /> {t.q2L2Var2}</p>
                      <div className="bg-slate-800/50 rounded-lg p-2 mt-2 space-y-1">
                        <p className="text-white/60 text-xs">{t.q2L2P1Note} <InlineMath math="(h-5)" />, {t.q2L2P2Note} <InlineMath math="(r-5)" /></p>
                        <p className="text-white/60 text-xs">{t.q2L2S1}:</p>
                        <BlockMath math="h - 5 = 4(r - 5) \Rightarrow h - 4r = -15 \quad \cdots (I)" />
                        <p className="text-white/60 text-xs mt-2">{t.q2L2S2}:</p>
                        <BlockMath math="(h+3) + (r+3) = 56 \Rightarrow h + r = 50 \quad \cdots (II)" />
                      </div>
                    </div>
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 space-y-2">
                      <p className="text-cyan-300 font-semibold">{t.q2L3Title}</p>
                      <div className="bg-slate-800/50 rounded-lg p-2">
                        <BlockMath math="\begin{cases} (I):\quad h - 4r = -15 \\ (II):\quad h + r = 50 \end{cases}" />
                      </div>
                      <p className="text-white/60 text-xs">{t.q2L3EqNote}</p>
                      <p className="text-white/60 text-xs">{t.q2L3SubNote}</p>
                      <div className="bg-slate-800/50 rounded-lg px-4 py-3 font-body">
                        <div className="flex items-center gap-2"><span className="text-white/40 w-10">P2</span><span className="text-white font-mono">h + r = 50</span></div>
                        <div className="flex items-center gap-2 pb-1 border-b border-white/20"><span className="text-white/40 w-10">P1</span><span className="text-white font-mono">h − 4r = −15</span><span className="text-red-400 font-bold ml-2">−</span></div>
                        <div className="flex items-center gap-2 pt-1"><span className="text-cyan-300 font-mono font-bold">5r = 65</span></div>
                      </div>
                      <BlockMath math="r = \dfrac{65}{5} = 13" />
                      <p className="text-white/60 text-xs">{t.q2L3SubstNote} <InlineMath math="r = 13" /> {t.q2L3SubstInto}</p>
                      <div className="bg-slate-800/50 rounded-lg p-2">
                        <BlockMath math="h + 13 = 50 \Rightarrow h = 37" />
                      </div>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold">{t.q2L4Title}</p>
                      <p className="text-white/70 text-xs">{t.q2L4Check1} <InlineMath math="37 - 5 = 32,\ 13 - 5 = 8" />; <InlineMath math="32 = 4 \times 8 = 32" /> ✅</p>
                      <p className="text-white/70 text-xs">{t.q2L4Check2} <InlineMath math="(37 + 3) + (13 + 3) = 40 + 16 = 56" /> ✅</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.q2L5Title}</p>
                      <p className="font-body text-sm text-white/80">{t.q2Answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.secContoh3} />
            {expandedSections.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm text-white/85 leading-relaxed">{t.q3Problem}</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.fullSolTitle}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold">{t.q3L1Title}</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2 mt-1">{t.q3L1Points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold">{t.q3L2Title}</p>
                      <p className="text-white/70 text-xs mt-1">{t.q3L2Let} <InlineMath math="p" /> {t.q3L2Var1}, <InlineMath math="l" /> {t.q3L2Var2}</p>
                      <div className="bg-slate-800/50 rounded-lg p-2 mt-2 space-y-1">
                        <p className="text-white/60 text-xs">{t.q3L2Rel1}</p>
                        <BlockMath math="2(p + l) = 54 \Rightarrow p + l = 27 \quad \cdots (I)" />
                        <p className="text-white/60 text-xs mt-2">{t.q3L2Rel2}:</p>
                        <BlockMath math="p = 2l + 3 \quad \cdots (II)" />
                      </div>
                    </div>
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 space-y-2">
                      <p className="text-cyan-300 font-semibold">{t.q3L3Title}</p>
                      <p className="text-white/60 text-xs">{t.q3L3SubstNote} <InlineMath math="p = 2l + 3" /> {t.q3L3SubstInto}</p>
                      <div className="bg-slate-800/50 rounded-lg p-2">
                        <BlockMath math="(2l + 3) + l = 27 \Rightarrow 3l = 24 \Rightarrow l = 8" />
                        <BlockMath math="p = 2(8) + 3 = 19" />
                      </div>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold">{t.q3L4Title}</p>
                      <p className="text-white/70 text-xs">{t.q3L4Check1} <InlineMath math="2(19 + 8) = 2(27) = 54" /> ✅</p>
                      <p className="text-white/70 text-xs">{t.q3L4Check2} <InlineMath math="p = 19 = 2(8) + 3 = 19" /> ✅</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.q3L5Title}</p>
                      <p className="font-body text-sm text-white/80">{t.q3Answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.secRangkuman} />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {t.summaryPoints.map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/spldv"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
              {t.backBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenyelesaianMasalahSPLDVPage;
