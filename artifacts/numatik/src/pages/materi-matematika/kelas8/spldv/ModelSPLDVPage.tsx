import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    pageTitle: "MEMBUAT MODEL SPLDV",
    pageSubtitle: "Ubah Cerita Sehari-hari Menjadi Persamaan Matematika",
    gradeLabel: "Kelas 8 · SPLDV · Materi Matematika",
    secIntro: "🌟 Mengapa Perlu Membuat Model?",
    secLangkah: "📘 Langkah-Langkah Membuat Model SPLDV",
    secContoh1: "✏️ Contoh 1 — Tingkat Mudah (Belanja di Toko)",
    secContoh2: "✏️ Contoh 2 — Tingkat Sedang (Umur & Selisih)",
    secContoh3: "✏️ Contoh 3 — Tingkat Sulit (Campuran Persentase)",
    secRangkuman: "📌 Rangkuman Membuat Model SPLDV",
    introDesc: "Dalam kehidupan nyata, masalah tidak datang dalam bentuk persamaan siap pakai. Kita perlu \"menerjemahkan\" situasi nyata ke dalam bahasa matematika — inilah yang disebut pemodelan matematika. Kemampuan ini adalah jembatan penting antara teori dan penerapan!",
    processTitle: "🔄 Proses Pemodelan",
    processSteps: [
      { label: "SITUASI NYATA", desc: "Cerita / soal dalam kalimat", color: "bg-orange-800/40 border-orange-500/40 text-orange-200" },
      { label: "IDENTIFIKASI VARIABEL", desc: "Tentukan apa yang dicari, beri nama variabel", color: "bg-violet-800/40 border-violet-500/40 text-violet-200" },
      { label: "BUAT PERSAMAAN", desc: "Terjemahkan setiap hubungan ke bentuk persamaan", color: "bg-cyan-800/40 border-cyan-500/40 text-cyan-200" },
      { label: "MODEL SPLDV SIAP", desc: "Dua persamaan dengan dua variabel", color: "bg-green-800/40 border-green-500/40 text-green-200" },
    ],
    keyTip: "Kunci Sukses Pemodelan:",
    keyTipDesc: "Baca soal minimal dua kali. Pertama untuk memahami situasinya, kedua untuk mengidentifikasi informasi yang bisa dijadikan persamaan.",
    summaryTitle: "🎯 Ringkasan Intisari",
    summaryDesc: "Membuat model SPLDV adalah proses mengubah permasalahan verbal/nyata menjadi dua buah persamaan linear yang memuat dua variabel. Kunci utamanya: identifikasi dua hal yang tidak diketahui dan dua hubungan di antara keduanya.",
    stepsTitle: "📋 4 Langkah Membuat Model",
    step1Title: "Identifikasi hal yang tidak diketahui",
    step1Desc: "Baca soal dan tentukan dua besaran yang diminta atau belum diketahui. Beri nama variabel yang jelas.",
    step1Example: "Contoh: \"harga pensil\"",
    step2Title: "Cari dua hubungan/informasi berbeda",
    step2Desc: "Dalam soal, cari dua pernyataan yang menghubungkan kedua variabel tersebut. Setiap pernyataan akan menjadi satu persamaan.",
    step3Title: "Terjemahkan ke persamaan matematika",
    step3Desc: "Ubah setiap pernyataan menjadi persamaan linear. Gunakan kata-kata kunci.",
    step3Keywords: [["jumlah / dan / ditambah", "+"], ["selisih / dikurangi", "−"], ["kali / hasil kali", "×"], ["dibagi", "÷"], ["sama dengan / adalah", "="]],
    step4Title: "Tuliskan model SPLDV secara lengkap",
    step4Desc: "Susun dua persamaan yang diperoleh dalam bentuk SPLDV yang siap diselesaikan. Periksa: sudah ada 2 variabel dan 2 persamaan yang berbeda?",
    step4Eq1: "Persamaan dari informasi pertama",
    step4Eq2: "Persamaan dari informasi kedua",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    q1Problem: "Juno membeli 2 penghapus dan 3 penggaris seharga $13. Remy membeli 1 penghapus dan 2 penggaris seharga $8. Buatlah model matematika dari permasalahan ini!",
    q1Title: "🔍 Pembahasan: Membuat Model",
    q1L1Title: "Langkah 1 — Tentukan Variabel:",
    q1Let: "Misalkan:",
    q1Var1: "= harga 1 penghapus",
    q1Var2: "= harga 1 penggaris",
    q1L2Title: "Langkah 2 — Identifikasi Dua Hubungan:",
    q1Info1: "Informasi 1 (dari Juno): \"2 penghapus dan 3 penggaris = $13\"",
    q1Info2: "Informasi 2 (dari Remy): \"1 penghapus dan 2 penggaris = $8\"",
    q1L3Title: "Langkah 3 — Terjemahkan ke Persamaan:",
    q1Info1Eq: "Informasi 1",
    q1Info2Eq: "Informasi 2",
    q1ModelTitle: "✅ Model SPLDV:",
    q1ModelWith: "dengan",
    q1ModelX: "= harga penghapus",
    q1ModelY: "= harga penggaris",
    q2Problem: "Umur Theo sekarang adalah 3 tahun lebih tua dari Nora. Jika jumlah umur mereka berdua adalah 27 tahun, buatlah model SPLDV dari permasalahan ini!",
    q2Title: "🔍 Pembahasan: Membuat Model",
    q2L1Title: "Langkah 1 — Tentukan Variabel:",
    q2Var1: "= umur Theo sekarang (tahun)",
    q2Var2: "= umur Nora sekarang (tahun)",
    q2L23Title: "Langkah 2 & 3 — Identifikasi & Terjemahkan:",
    q2Info1: "Informasi 1: \"Theo 3 tahun lebih tua dari Nora\"",
    q2Info1b: "→ Artinya: umur Theo = umur Nora + 3",
    q2Info2: "Informasi 2: \"Jumlah umur keduanya = 27 tahun\"",
    q2Or: "atau",
    q2ModelTitle: "✅ Model SPLDV:",
    q2ModelWith: "dengan",
    q2ModelB: "= umur Theo",
    q2ModelA: "= umur Nora",
    q2Tip: "💡 Perhatikan!",
    q2TipDesc: "Frasa \"lebih tua dari\" berarti selisih positif. Jika soal mengatakan \"lebih muda dari\", maka tandanya berbeda. Selalu perhatikan arah perbandingannya!",
    q3Problem: "Sebuah tempat parkir menampung kendaraan roda dua dan roda empat. Jumlah seluruh kendaraan ada 50 unit. Jumlah seluruh roda dari semua kendaraan ada 140 roda. Buatlah model SPLDV dari situasi ini!",
    q3Title: "🔍 Pembahasan: Membuat Model",
    q3L1Title: "Langkah 1 — Tentukan Variabel:",
    q3Var1: "= banyak kendaraan roda dua (motor)",
    q3Var2: "= banyak kendaraan roda empat (mobil)",
    q3L2Title: "Langkah 2 — Identifikasi Dua Hubungan:",
    q3Rel1Title: "Hubungan 1: Jumlah kendaraan",
    q3Rel1Desc: "Roda dua + Roda empat = 50 kendaraan",
    q3Rel2Title: "Hubungan 2: Jumlah roda",
    q3Rel2Desc: "Setiap motor punya 2 roda, setiap mobil punya 4 roda",
    q3Rel2Desc2: "Total roda = 140",
    q3L3Title: "Langkah 3 — Terjemahkan ke Persamaan:",
    q3From1: "Dari Hubungan 1:",
    q3From2: "Dari Hubungan 2 (motor punya 2 roda, mobil punya 4 roda):",
    q3ModelTitle: "✅ Model SPLDV:",
    q3ModelWith: "dengan",
    q3ModelM: "= jumlah motor",
    q3ModelK: "= jumlah mobil",
    q3HardTitle: "🌟 Mengapa Ini \"Sulit\"?",
    q3HardDesc: "Persamaan kedua tidak langsung terlihat jelas dari soal. Kamu harus sadar bahwa \"jumlah roda\" bukan sekadar menjumlahkan kendaraan, melainkan mengalikan jumlah kendaraan dengan banyaknya roda masing-masing. Inilah kunci pemodelan yang lebih dalam!",
    summaryKeyTitle: "🗝️ Kunci Pemodelan yang Sukses",
    summaryKeys: [
      "Selalu definisikan variabel dengan jelas (beri satuan!)",
      "Pastikan ada tepat 2 persamaan berbeda untuk 2 variabel",
      "Perhatikan kata kunci dalam soal: \"jumlah\", \"selisih\", \"kali\", \"lebih dari\", dll.",
      "Periksa: apakah model yang dibuat masuk akal secara konteks?",
    ],
    tableColWord: "Kata dalam Soal",
    tableColMeaning: "Artinya",
    tableRows: [
      ["jumlah ... dan ...", "penjumlahan kedua variabel"],
      ["selisih / lebih dari / lebih muda", "pengurangan antar variabel"],
      ["dua kali / tiga kali", "perkalian variabel dengan koefisien"],
      ["sama dengan / adalah / menjadi", "tanda = (sama dengan)"],
      ["jumlah total / keseluruhan", "biasanya menjadi satu persamaan"],
    ],
    closingTitle: "🎯 Kesimpulan",
    closingDesc: "Membuat model SPLDV adalah keterampilan yang membutuhkan latihan. Semakin banyak soal yang dikerjakan, semakin cepat kamu bisa mengidentifikasi variabel dan menerjemahkan kalimat menjadi persamaan. Kunci utama: baca soal dengan cermat dan pastikan dua persamaan yang dibuat saling berbeda!",
    backBtn: "← Kembali ke Menu SPLDV",
  },
  en: {
    pageTitle: "MODELLING SLETV PROBLEMS",
    pageSubtitle: "Turn Real-Life Stories into Mathematical Equations",
    gradeLabel: "Grade 8 · SLETV · Mathematics",
    secIntro: "🌟 Why Do We Need to Build Models?",
    secLangkah: "📘 Steps for Building an SLETV Model",
    secContoh1: "✏️ Example 1 — Easy (Shopping at a Store)",
    secContoh2: "✏️ Example 2 — Medium (Age & Difference)",
    secContoh3: "✏️ Example 3 — Hard (Mixed Context)",
    secRangkuman: "📌 Summary",
    introDesc: "In real life, problems don't come as ready-made equations. We need to \"translate\" real situations into the language of mathematics — this is called mathematical modelling. This skill is a key bridge between theory and application!",
    processTitle: "🔄 Modelling Process",
    processSteps: [
      { label: "REAL SITUATION", desc: "A story or problem in words", color: "bg-orange-800/40 border-orange-500/40 text-orange-200" },
      { label: "IDENTIFY VARIABLES", desc: "Determine what to find, name the variables", color: "bg-violet-800/40 border-violet-500/40 text-violet-200" },
      { label: "WRITE EQUATIONS", desc: "Translate each relationship into an equation", color: "bg-cyan-800/40 border-cyan-500/40 text-cyan-200" },
      { label: "SLETV MODEL READY", desc: "Two equations with two variables", color: "bg-green-800/40 border-green-500/40 text-green-200" },
    ],
    keyTip: "Key to Successful Modelling:",
    keyTipDesc: "Read the problem at least twice. First to understand the situation, second to identify information that can be turned into equations.",
    summaryTitle: "🎯 Key Summary",
    summaryDesc: "Building an SLETV model is the process of turning a verbal/real-world problem into two linear equations with two variables. The key: identify the two unknowns and the two relationships between them.",
    stepsTitle: "📋 4 Steps for Building a Model",
    step1Title: "Identify the unknowns",
    step1Desc: "Read the problem and determine the two quantities to find. Assign clear variable names.",
    step1Example: "Example: \"price of a pencil\"",
    step2Title: "Find two different relationships",
    step2Desc: "In the problem, find two statements that link the two variables. Each statement becomes one equation.",
    step3Title: "Translate into mathematical equations",
    step3Desc: "Turn each statement into a linear equation. Use keyword translations.",
    step3Keywords: [["sum / and / plus", "+"], ["difference / minus", "−"], ["times / product", "×"], ["divided by", "÷"], ["equals / is", "="]],
    step4Title: "Write the complete SLETV model",
    step4Desc: "Arrange the two equations into a system ready to solve. Check: are there exactly 2 variables and 2 different equations?",
    step4Eq1: "Equation from the first piece of information",
    step4Eq2: "Equation from the second piece of information",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    q1Problem: "Juno buys 2 erasers and 3 rulers for $13. Remy buys 1 eraser and 2 rulers for $8. Build the mathematical model for this problem!",
    q1Title: "🔍 Solution: Building the Model",
    q1L1Title: "Step 1 — Define Variables:",
    q1Let: "Let:",
    q1Var1: "= price of 1 eraser",
    q1Var2: "= price of 1 ruler",
    q1L2Title: "Step 2 — Identify Two Relationships:",
    q1Info1: "Info 1 (from Juno): \"2 erasers and 3 rulers = $13\"",
    q1Info2: "Info 2 (from Remy): \"1 eraser and 2 rulers = $8\"",
    q1L3Title: "Step 3 — Translate to Equations:",
    q1Info1Eq: "Info 1",
    q1Info2Eq: "Info 2",
    q1ModelTitle: "✅ SLETV Model:",
    q1ModelWith: "where",
    q1ModelX: "= price of eraser",
    q1ModelY: "= price of ruler",
    q2Problem: "Theo's age is 3 years older than Nora's. If the sum of their ages is 27, build the SLETV model for this problem!",
    q2Title: "🔍 Solution: Building the Model",
    q2L1Title: "Step 1 — Define Variables:",
    q2Var1: "= Theo's current age (years)",
    q2Var2: "= Nora's current age (years)",
    q2L23Title: "Steps 2 & 3 — Identify & Translate:",
    q2Info1: "Info 1: \"Theo is 3 years older than Nora\"",
    q2Info1b: "→ Meaning: Theo's age = Nora's age + 3",
    q2Info2: "Info 2: \"The sum of their ages is 27\"",
    q2Or: "or",
    q2ModelTitle: "✅ SLETV Model:",
    q2ModelWith: "where",
    q2ModelB: "= Theo's age",
    q2ModelA: "= Nora's age",
    q2Tip: "💡 Note!",
    q2TipDesc: "\"Older than\" means a positive difference. If the problem says \"younger than\", the sign changes. Always pay attention to the direction of comparison!",
    q3Problem: "A parking lot holds two-wheeled and four-wheeled vehicles. The total number of vehicles is 50. The total number of wheels from all vehicles is 140. Build the SLETV model for this situation!",
    q3Title: "🔍 Solution: Building the Model",
    q3L1Title: "Step 1 — Define Variables:",
    q3Var1: "= number of two-wheeled vehicles (motorbikes)",
    q3Var2: "= number of four-wheeled vehicles (cars)",
    q3L2Title: "Step 2 — Identify Two Relationships:",
    q3Rel1Title: "Relationship 1: Total vehicles",
    q3Rel1Desc: "Two-wheeled + Four-wheeled = 50 vehicles",
    q3Rel2Title: "Relationship 2: Total wheels",
    q3Rel2Desc: "Each motorbike has 2 wheels, each car has 4 wheels",
    q3Rel2Desc2: "Total wheels = 140",
    q3L3Title: "Step 3 — Translate to Equations:",
    q3From1: "From Relationship 1:",
    q3From2: "From Relationship 2 (motorbikes have 2 wheels, cars have 4):",
    q3ModelTitle: "✅ SLETV Model:",
    q3ModelWith: "where",
    q3ModelM: "= number of motorbikes",
    q3ModelK: "= number of cars",
    q3HardTitle: "🌟 Why Is This \"Hard\"?",
    q3HardDesc: "The second equation is not directly obvious. You have to realize that \"total wheels\" is not simply adding vehicles, but multiplying the count of each type by its wheel count. This is the key to deeper modelling!",
    summaryKeyTitle: "🗝️ Keys to Successful Modelling",
    summaryKeys: [
      "Always define variables clearly (include units!)",
      "Ensure there are exactly 2 different equations for 2 variables",
      "Pay attention to keywords: \"sum\", \"difference\", \"times\", \"more than\", etc.",
      "Check: does the model make sense in context?",
    ],
    tableColWord: "Word in Problem",
    tableColMeaning: "Meaning",
    tableRows: [
      ["sum ... and ...", "addition of both variables"],
      ["difference / more than / younger", "subtraction between variables"],
      ["twice / three times", "multiplication by coefficient"],
      ["equals / is / becomes", "= sign (equality)"],
      ["total / altogether", "usually one equation"],
    ],
    closingTitle: "🎯 Conclusion",
    closingDesc: "Building an SLETV model is a skill that improves with practice. The more problems you work through, the faster you can identify variables and translate sentences into equations. Key: read carefully and make sure the two equations are distinct!",
    backBtn: "← Back to SLETV Menu",
  },
  ja: {
    pageTitle: "連立方程式のモデル化",
    pageSubtitle: "日常の話を数学の式に変換しよう",
    gradeLabel: "中学2年 · 連立方程式 · 数学",
    secIntro: "🌟 なぜモデル化が必要？",
    secLangkah: "📘 連立方程式モデル化の手順",
    secContoh1: "✏️ 例1 — 基本（買い物）",
    secContoh2: "✏️ 例2 — 標準（年齢と差）",
    secContoh3: "✏️ 例3 — 発展（複合的な状況）",
    secRangkuman: "📌 まとめ",
    introDesc: "現実の問題はそのまま方程式の形で来ません。実際の状況を数学の言葉に「翻訳」する必要があります — これを数学的モデル化と言います。この能力は理論と応用をつなぐ重要な橋渡しです！",
    processTitle: "🔄 モデル化のプロセス",
    processSteps: [
      { label: "実際の状況", desc: "文章の問題", color: "bg-orange-800/40 border-orange-500/40 text-orange-200" },
      { label: "変数の特定", desc: "求めるものを決め、変数に名前をつける", color: "bg-violet-800/40 border-violet-500/40 text-violet-200" },
      { label: "方程式を作る", desc: "各関係を方程式に変換する", color: "bg-cyan-800/40 border-cyan-500/40 text-cyan-200" },
      { label: "連立方程式完成", desc: "2変数の方程式が2本できる", color: "bg-green-800/40 border-green-500/40 text-green-200" },
    ],
    keyTip: "モデル化成功のカギ：",
    keyTipDesc: "問題を最低2回読みましょう。1回目は状況を理解するため、2回目は方程式にできる情報を特定するため。",
    summaryTitle: "🎯 要点まとめ",
    summaryDesc: "連立方程式のモデル化とは、言葉で表された実際の問題を、2変数を持つ2本の一次方程式に変換するプロセスです。カギは：2つの未知数と、その間の2つの関係を特定すること。",
    stepsTitle: "📋 モデル化4ステップ",
    step1Title: "未知数を特定する",
    step1Desc: "問題を読んで、2つの求めたい量を特定します。明確な変数名をつけます。",
    step1Example: "例：「鉛筆の価格」",
    step2Title: "2つの異なる関係を見つける",
    step2Desc: "問題の中で2変数を結びつける2つの文を探します。各文が1本の方程式になります。",
    step3Title: "数学の方程式に変換する",
    step3Desc: "各文を一次方程式に変換します。キーワードを使います。",
    step3Keywords: [["和 / と / 足す", "+"], ["差 / 引く", "−"], ["倍 / 積", "×"], ["割る", "÷"], ["等しい / は / になる", "="]],
    step4Title: "完全な連立方程式を書く",
    step4Desc: "得られた2本の方程式を連立方程式の形にまとめます。確認：2変数と2本の異なる方程式がありますか？",
    step4Eq1: "1番目の情報からの方程式",
    step4Eq2: "2番目の情報からの方程式",
    easy: "基本", medium: "標準", hard: "発展",
    q1Problem: "Junoは消しゴム2個と定規3本を$13で買いました。Remyは消しゴム1個と定規2本を$8で買いました。この問題の数学的モデルを作りましょう！",
    q1Title: "🔍 解説：モデルの作り方",
    q1L1Title: "ステップ1 — 変数を決める：",
    q1Let: "設：",
    q1Var1: "= 消しゴム1個の価格",
    q1Var2: "= 定規1本の価格",
    q1L2Title: "ステップ2 — 2つの関係を特定：",
    q1Info1: "情報1（Junoから）：「消しゴム2個と定規3本 = $13」",
    q1Info2: "情報2（Remyから）：「消しゴム1個と定規2本 = $8」",
    q1L3Title: "ステップ3 — 方程式に変換：",
    q1Info1Eq: "情報1",
    q1Info2Eq: "情報2",
    q1ModelTitle: "✅ 連立方程式モデル：",
    q1ModelWith: "ただし",
    q1ModelX: "= 消しゴムの価格",
    q1ModelY: "= 定規の価格",
    q2Problem: "Theoの年齢はNoraより3歳年上です。2人の年齢の和が27歳のとき、この問題の連立方程式モデルを作りましょう！",
    q2Title: "🔍 解説：モデルの作り方",
    q2L1Title: "ステップ1 — 変数を決める：",
    q2Var1: "= Theoの現在の年齢（歳）",
    q2Var2: "= Noraの現在の年齢（歳）",
    q2L23Title: "ステップ2・3 — 特定と変換：",
    q2Info1: "情報1：「TheoはNoraより3歳年上」",
    q2Info1b: "→ 意味：Theoの年齢 = Noraの年齢 + 3",
    q2Info2: "情報2：「2人の年齢の和 = 27歳」",
    q2Or: "または",
    q2ModelTitle: "✅ 連立方程式モデル：",
    q2ModelWith: "ただし",
    q2ModelB: "= Theoの年齢",
    q2ModelA: "= Noraの年齢",
    q2Tip: "💡 注意！",
    q2TipDesc: "「年上」は正の差を意味します。「年下」と書かれていれば符号が変わります。比較の方向に常に注意しましょう！",
    q3Problem: "ある駐車場に二輪車と四輪車が合わせて50台あります。全車両の車輪の合計は140本です。この状況の連立方程式モデルを作りましょう！",
    q3Title: "🔍 解説：モデルの作り方",
    q3L1Title: "ステップ1 — 変数を決める：",
    q3Var1: "= 二輪車（バイク）の台数",
    q3Var2: "= 四輪車（車）の台数",
    q3L2Title: "ステップ2 — 2つの関係を特定：",
    q3Rel1Title: "関係1：台数の合計",
    q3Rel1Desc: "二輪車 + 四輪車 = 50台",
    q3Rel2Title: "関係2：車輪の合計",
    q3Rel2Desc: "バイクは車輪2本、車は車輪4本",
    q3Rel2Desc2: "車輪の合計 = 140本",
    q3L3Title: "ステップ3 — 方程式に変換：",
    q3From1: "関係1から：",
    q3From2: "関係2から（バイク2本、車4本）：",
    q3ModelTitle: "✅ 連立方程式モデル：",
    q3ModelWith: "ただし",
    q3ModelM: "= バイクの台数",
    q3ModelK: "= 車の台数",
    q3HardTitle: "🌟 なぜ「発展」なの？",
    q3HardDesc: "2番目の方程式は問題から直接明らかではありません。「車輪の合計」は台数を足すだけでなく、各種類の台数にその車輪数を掛けることに気づく必要があります。これが深いモデル化のカギです！",
    summaryKeyTitle: "🗝️ モデル化成功のポイント",
    summaryKeys: [
      "常に変数を明確に定義する（単位を含める！）",
      "2変数に対して異なる方程式が正確に2本あることを確認する",
      "問題中のキーワードに注意：「和」「差」「倍」「より多い」など",
      "作ったモデルは文脈的に意味があるか確認する",
    ],
    tableColWord: "問題の言葉",
    tableColMeaning: "意味",
    tableRows: [
      ["和 / ...と...", "両変数の足し算"],
      ["差 / より多い / より少ない", "変数間の引き算"],
      ["2倍 / 3倍", "係数との掛け算"],
      ["等しい / は / になる", "= (等号)"],
      ["合計 / 全部", "通常1本の方程式"],
    ],
    closingTitle: "🎯 結論",
    closingDesc: "連立方程式のモデル化は練習を重ねるほど上達するスキルです。多くの問題に取り組むほど、変数を特定して文を方程式に変換するのが速くなります。カギ：丁寧に読み、2本の方程式が異なることを確認しよう！",
    backBtn: "← 連立方程式メニューに戻る",
  },
};

const ModelSPLDVPage = () => {
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
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{t.processTitle}</p>
                  <div className="flex flex-col gap-2 text-xs font-body">
                    {t.processSteps.map(({ label, desc, color }, i) => (
                      <React.Fragment key={i}>
                        <div className={`border ${color} rounded-lg px-3 py-2`}>
                          <p className="font-bold">{i + 1}. {label}</p>
                          <p className="text-white/60">{desc}</p>
                        </div>
                        {i < t.processSteps.length - 1 && <div className="flex justify-center"><div className="w-0.5 h-3 bg-white/20" /></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200"><strong>{t.keyTip}</strong> {t.keyTipDesc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.secLangkah} />
            {expandedSections.includes("langkah") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.summaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.summaryDesc}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.stepsTitle}</p>
                  <Step no="1" title={t.step1Title} color="border-cyan-500/30 bg-cyan-900/10">
                    <p className="text-white/70">{t.step1Desc}</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <p className="text-white/60 text-xs">{t.step1Example} → <InlineMath math="x" /></p>
                    </div>
                  </Step>
                  <Step no="2" title={t.step2Title} color="border-violet-500/30 bg-violet-900/10">
                    <p className="text-white/70">{t.step2Desc}</p>
                  </Step>
                  <Step no="3" title={t.step3Title} color="border-green-500/30 bg-green-900/10">
                    <p className="text-white/70">{t.step3Desc}</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {t.step3Keywords.map(([kata, simbol]) => (
                          <div key={kata} className="flex gap-1 items-center">
                            <span className="text-white/50 text-xs">"{kata}"</span>
                            <span className="text-cyan-300 text-xs font-bold">{simbol}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Step>
                  <Step no="4" title={t.step4Title} color="border-orange-500/30 bg-orange-900/10">
                    <p className="text-white/70">{t.step4Desc}</p>
                    <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
                      <BlockMath math="\begin{cases} \text{(1)} \\ \text{(2)} \end{cases}" />
                    </div>
                  </Step>
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
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.q1Title}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 font-semibold">{t.q1L1Title}</p>
                      <p className="text-white/70">{t.q1Let}</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
                        <li><InlineMath math="x" /> {t.q1Var1}</li>
                        <li><InlineMath math="y" /> {t.q1Var2}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-violet-300 font-semibold">{t.q1L2Title}</p>
                      <div className="bg-violet-900/20 rounded p-2 mt-1">
                        <p className="text-white/70 text-xs">{t.q1Info1}</p>
                        <p className="text-white/70 text-xs mt-1">{t.q1Info2}</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-green-300 font-semibold">{t.q1L3Title}</p>
                      <p className="text-white/60 text-xs">{t.q1Info1Eq}:</p>
                      <BlockMath math="2x + 3y = 13" />
                      <p className="text-white/60 text-xs">{t.q1Info2Eq}:</p>
                      <BlockMath math="x + 2y = 8" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.q1ModelTitle}</p>
                      <BlockMath math="\begin{cases} 2x + 3y = 13 \\ x + 2y = 8 \end{cases}" />
                      <p className="text-white/60 text-xs mt-1">{t.q1ModelWith} <InlineMath math="x" /> {t.q1ModelX}, <InlineMath math="y" /> {t.q1ModelY}</p>
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
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.q2Title}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 font-semibold">{t.q2L1Title}</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
                        <li><InlineMath math="b" /> {t.q2Var1}</li>
                        <li><InlineMath math="a" /> {t.q2Var2}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-violet-300 font-semibold">{t.q2L23Title}</p>
                      <div className="space-y-2">
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs">{t.q2Info1}</p>
                          <p className="text-white/60 text-xs mt-0.5">{t.q2Info1b}</p>
                          <BlockMath math="b = a + 3 \quad \text{or} \quad b - a = 3" />
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs">{t.q2Info2}</p>
                          <BlockMath math="b + a = 27" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.q2ModelTitle}</p>
                      <BlockMath math="\begin{cases} b - a = 3 \\ b + a = 27 \end{cases}" />
                      <p className="text-white/60 text-xs mt-1">{t.q2ModelWith} <InlineMath math="b" /> {t.q2ModelB}, <InlineMath math="a" /> {t.q2ModelA}</p>
                    </div>
                    <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3">
                      <p className="font-body text-xs text-yellow-300 font-semibold">{t.q2Tip}</p>
                      <p className="font-body text-xs text-white/70 mt-1">{t.q2TipDesc}</p>
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
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.q3Title}</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 font-semibold">{t.q3L1Title}</p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-2">
                        <li><InlineMath math="m" /> {t.q3Var1}</li>
                        <li><InlineMath math="k" /> {t.q3Var2}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-violet-300 font-semibold">{t.q3L2Title}</p>
                      <div className="space-y-2">
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs font-semibold">{t.q3Rel1Title}</p>
                          <p className="text-white/60 text-xs">{t.q3Rel1Desc}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-white/60 text-xs font-semibold">{t.q3Rel2Title}</p>
                          <p className="text-white/60 text-xs">{t.q3Rel2Desc}</p>
                          <p className="text-white/60 text-xs">{t.q3Rel2Desc2}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                      <p className="text-green-300 font-semibold">{t.q3L3Title}</p>
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-white/60 text-xs">{t.q3From1}</p>
                        <BlockMath math="m + k = 50 \quad \cdots (I)" />
                      </div>
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-white/60 text-xs">{t.q3From2}</p>
                        <BlockMath math="2m + 4k = 140 \quad \cdots (II)" />
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.q3ModelTitle}</p>
                      <BlockMath math="\begin{cases} m + k = 50 \\ 2m + 4k = 140 \end{cases}" />
                      <p className="text-white/60 text-xs mt-1">{t.q3ModelWith} <InlineMath math="m" /> {t.q3ModelM}, <InlineMath math="k" /> {t.q3ModelK}</p>
                    </div>
                    <div className="bg-slate-800/40 border border-red-500/20 rounded-xl p-3">
                      <p className="font-body text-xs text-red-300 font-semibold">{t.q3HardTitle}</p>
                      <p className="font-body text-xs text-white/70 mt-1">{t.q3HardDesc}</p>
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
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.summaryKeyTitle}</p>
                  <ul className="space-y-2 text-sm font-body text-white/75">
                    {t.summaryKeys.map((key, i) => (
                      <li key={i} className="flex gap-2"><span className="text-green-400 shrink-0">✔</span><span>{key}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead><tr className="bg-cyan-900/40">
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{t.tableColWord}</th>
                      <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">{t.tableColMeaning}</th>
                    </tr></thead>
                    <tbody>{t.tableRows.map(([kata, arti], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                        <td className="border border-white/10 px-3 py-2 text-white/70 italic">"{kata}"</td>
                        <td className="border border-white/10 px-3 py-2 text-cyan-200">{arti}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-1">{t.closingTitle}</p>
                  <p className="font-body text-sm text-white/70">{t.closingDesc}</p>
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

export default ModelSPLDVPage;
