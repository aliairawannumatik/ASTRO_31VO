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
    pageTitle: "DEFINISI & BENTUK UMUM SPLDV",
    pageSubtitle: "Kaitannya dengan PLDV & Konsep Dasar Sistem Persamaan",
    gradeLabel: "Kelas 8 · SPLDV · Materi Matematika",
    secIntro: "🌟 Mengapa Kita Butuh SPLDV?",
    secPLDV: "📘 Sub-Bab 1: PLDV — Satu Persamaan, Dua Variabel",
    secSPLDV: "📗 Sub-Bab 2: SPLDV — Sistem Dua Persamaan",
    secContoh: "📝 Contoh Soal & Pembahasan",
    secRangkuman: "📋 Rangkuman",
    introDesc: "Bayangkan kamu pergi ke kantin dan membeli 2 nasi goreng dan 1 mie goreng seharga Rp25.000. Temanmu membeli 1 nasi goreng dan 2 mie goreng seharga Rp23.000. Dari dua informasi ini, bisa tidak kita tahu harga masing-masing makanan? Nah, inilah kegunaan SPLDV — alat matematika untuk memecahkan masalah yang punya dua ketidaktahuan sekaligus!",
    conceptMapTitle: "🛸 Peta Konsep",
    pldvLabel: "PLDV",
    pldvDesc: "1 persamaan, 2 variabel",
    spldvLabel: "SPLDV",
    spldvDesc: "sistem 2 persamaan",
    introTip: "SPLDV = Sistem Persamaan Linear Dua Variabel. Kata \"linear\" berarti pangkat tertinggi variabelnya adalah 1. Kata \"dua variabel\" berarti ada dua besaran yang tidak diketahui (biasanya x dan y).",
    pldvSummaryTitle: "🎯 Ringkasan Intisari",
    pldvSummaryDesc: "PLDV (Persamaan Linear Dua Variabel) adalah persamaan yang memiliki tepat dua variabel dan pangkat tertinggi setiap variabelnya adalah 1. Bentuk umumnya adalah ax + by = c dengan a, b ≠ 0. Satu persamaan linear dua variabel memiliki tak hingga banyak solusi karena kita bisa memasangkan nilai x apa saja dengan y yang sesuai.",
    pldvGeneralTitle: "📐 Bentuk Umum PLDV",
    pldvCoefLabel: "Koefisien variabel (bukan nol)",
    pldvVarLabel: "Dua variabel yang dicari",
    pldvConstLabel: "Konstanta (bilangan tetap)",
    pldvVsTitle: "✅ Contoh PLDV vs ❌ Bukan PLDV",
    pldvTableHeadEq: "Persamaan",
    pldvTableHeadIs: "PLDV?",
    pldvTableHeadReason: "Alasan",
    pldvRows: [
      ["2x + 3y = 6", "✅ Ya", "2 variabel, pangkat 1"],
      ["x − 5y = 10", "✅ Ya", "2 variabel, pangkat 1"],
      ["x² + y = 4", "❌ Bukan", "Ada pangkat 2 pada x"],
      ["3x = 9", "❌ Bukan", "Hanya 1 variabel"],
      ["xy + 2 = 0", "❌ Bukan", "Ada perkalian x dan y"],
      ["4x + 0y = 8", "❌ Bukan", "Koefisien y = 0 (jadi 1 variabel)"],
    ],
    pldvSolutionsTitle: "🌐 Solusi PLDV: Tak Hingga Banyaknya",
    pldvSolutionsDesc: "Contoh: x + 2y = 6 memiliki banyak pasangan solusi:",
    pldvSolutionsNote: "Inilah kenapa kita butuh dua persamaan untuk mendapat solusi tunggal!",
    spldvSummaryTitle: "🎯 Ringkasan Intisari",
    spldvSummaryDesc: "SPLDV adalah kumpulan (sistem) dua buah PLDV yang harus dipenuhi secara bersamaan oleh sepasang nilai variabel (x, y). Solusi SPLDV adalah nilai x dan y yang membuat kedua persamaan bernilai benar sekaligus.",
    spldvGeneralTitle: "📐 Bentuk Umum SPLDV",
    spldvEq1Label: "Persamaan 1:",
    spldvEq1Desc: "PLDV pertama dengan koefisiennya sendiri",
    spldvEq2Label: "Persamaan 2:",
    spldvEq2Desc: "PLDV kedua yang berbeda dari pertama",
    quizTitle: "🔍 Cek Solusi SPLDV — Pilihlah Jawaban yang Benar!",
    quizDesc: "Jawaban sudah disediakan. Tugasmu hanya memilih pasangan (x, y) yang memenuhi kedua persamaan sekaligus, lalu buktikan!",
    quiz1Label: "📘 Contoh 1 — Variabel x dan y",
    quiz1Ask: "Manakah pasangan",
    quiz1AskMid: "yang merupakan solusi SPLDV di atas?",
    quiz1ProofTitle: "🔬 Pembuktian — substitusikan ke kedua persamaan",
    quiz1Eq1Label: "Persamaan (1):",
    quiz1Eq2Label: "Persamaan (2):",
    quiz1Eq1Ok: "✅ Persamaan (1) terpenuhi",
    quiz1Eq1No: "❌ Persamaan (1) tidak terpenuhi",
    quiz1Eq2Ok: "✅ Persamaan (2) terpenuhi",
    quiz1Eq2No: "❌ Persamaan (2) tidak terpenuhi",
    quiz1Correct: (x: number, y: number) => `🎉 Benar! (${x}, ${y}) adalah solusi SPLDV — keduanya terpenuhi!`,
    quiz1Wrong: "❌ Bukan solusi. Persamaan (2) tidak terpenuhi. Coba pilihan lain!",
    quiz1Hint: "👆 Pilih salah satu jawaban di atas untuk membuktikannya",
    quiz2Label: "🍛 Contoh 2 — Soal Cerita Kontekstual",
    quiz2Story: (name1: string, name2: string) => `${name1} membeli 2 nasi goreng dan 1 mie goreng seharga Rp25.000. ${name2} membeli 1 nasi goreng dan 2 mie goreng seharga Rp23.000.`,
    quiz2Let: "Misalkan:",
    quiz2VarN: "n = harga nasi goreng (Rp)",
    quiz2VarM: "m = harga mie goreng (Rp)",
    quiz2AskFull: "Manakah pasangan (n, m) yang merupakan solusi SPLDV?",
    quiz2ProofTitle: "🔬 Pembuktian — substitusikan ke kedua persamaan",
    quiz2Eq1Label: "Persamaan (1):",
    quiz2Eq2Label: "Persamaan (2):",
    quiz2Eq1Ok: "✅ Persamaan (1) terpenuhi",
    quiz2Eq1No: "❌ Persamaan (1) tidak terpenuhi",
    quiz2Eq2Ok: "✅ Persamaan (2) terpenuhi",
    quiz2Eq2No: "❌ Persamaan (2) tidak terpenuhi",
    quiz2Correct: (n: number, m: number) => `🎉 Benar! Harga nasi goreng = Rp${n}.000, mie goreng = Rp${m}.000!`,
    quiz2Wrong: "❌ Bukan solusi. Persamaan (2) tidak terpenuhi. Coba pilihan lain!",
    quiz2Hint: "👆 Pilih salah satu jawaban di atas untuk membuktikannya",
    quiz2Choices: [
      { label: "A", n: 9, m: 7, p1: "2(9.000) + 7.000 = 18.000 + 7.000 = 25.000", p1ok: true, p2: "9.000 + 2(7.000) = 9.000 + 14.000 = 23.000", p2ok: true },
      { label: "B", n: 8, m: 9, p1: "2(8.000) + 9.000 = 16.000 + 9.000 = 25.000", p1ok: true, p2: "8.000 + 2(9.000) = 8.000 + 18.000 = 26.000 \\neq 23.000", p2ok: false },
      { label: "C", n: 10, m: 5, p1: "2(10.000) + 5.000 = 20.000 + 5.000 = 25.000", p1ok: true, p2: "10.000 + 2(5.000) = 10.000 + 10.000 = 20.000 \\neq 23.000", p2ok: false },
      { label: "D", n: 7, m: 11, p1: "2(7.000) + 11.000 = 14.000 + 11.000 = 25.000", p1ok: true, p2: "7.000 + 2(11.000) = 7.000 + 22.000 = 29.000 \\neq 23.000", p2ok: false },
    ],
    quiz2ChoiceLabel: (n: number, m: number) => `n=Rp${n}.000,\\ m=Rp${m}.000`,
    quiz1Choices: [
      { label: "A", x: 3, y: 1, p1: "2(3) + 1 = 7", p1ok: true, p2: "3 - 1 = 2", p2ok: true },
      { label: "B", x: 2, y: 3, p1: "2(2) + 3 = 7", p1ok: true, p2: "2 - 3 = -1 \\neq 2", p2ok: false },
      { label: "C", x: 4, y: -1, p1: "2(4) + (-1) = 7", p1ok: true, p2: "4 - (-1) = 5 \\neq 2", p2ok: false },
      { label: "D", x: 1, y: 5, p1: "2(1) + 5 = 7", p1ok: true, p2: "1 - 5 = -4 \\neq 2", p2ok: false },
    ],
    name1: "Budi", name2: "Ani",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    q1Problem: "Manakah dari persamaan berikut yang merupakan PLDV?",
    q1A: "a. 3x + 2y = 12", q1B: "b. x² − y = 5", q1C: "c. 5x − y = 0", q1D: "d. 2x = 8",
    q1Rows: [
      { ex: "a. 3x + 2y = 12", verdict: "✅ PLDV", reason: "Ada 2 variabel (x dan y), masing-masing berpangkat 1, dan kedua koefisiennya bukan nol.", c: "text-green-400" },
      { ex: "b. x² − y = 5", verdict: "❌ Bukan PLDV", reason: "Pangkat x adalah 2, bukan 1. Ini adalah persamaan kuadrat.", c: "text-red-400" },
      { ex: "c. 5x − y = 0", verdict: "✅ PLDV", reason: "Ada 2 variabel (x dan y), keduanya berpangkat 1. Konstanta 0 tetap valid.", c: "text-green-400" },
      { ex: "d. 2x = 8", verdict: "❌ Bukan PLDV", reason: "Hanya ada satu variabel (x). PLDV wajib memiliki tepat dua variabel.", c: "text-red-400" },
    ],
    q1Answer: "🔑 PLDV yang valid: a dan c.",
    q2Problem: "Diketahui SPLDV: 2x + y = 7 dan x − y = 2. Periksa apakah pasangan berikut merupakan solusi SPLDV:",
    q2A: "a. (x, y) = (3, 1)", q2B: "b. (x, y) = (2, 3)",
    q2CheckA: "Cek (3, 1) — substitusi ke kedua persamaan:",
    q2CheckB: "Cek (2, 3) — substitusi ke kedua persamaan:",
    q2ResultA: "✅ Kedua persamaan terpenuhi → (3, 1) adalah solusi SPLDV.",
    q2ResultB: "❌ Persamaan 2 tidak terpenuhi → (2, 3) bukan solusi SPLDV.",
    q2Note: "💡 Solusi SPLDV harus memenuhi SEMUA persamaan dalam sistem secara bersamaan!",
    q3Problem: "Tentukan apakah setiap SPLDV berikut memiliki tepat satu penyelesaian, tak hingga penyelesaian, atau tidak memiliki penyelesaian!",
    q3OneSol: "Tepat satu penyelesaian",
    q3InfSol: "Tak hingga penyelesaian",
    q3NoSol: "Tidak memiliki penyelesaian",
    q3QuickTitle: "🔑 Cara Cepat Menentukan Jenis Penyelesaian",
    q3QuickDesc: "Untuk SPLDV, bandingkan rasio koefisiennya:",
    q3R1: "🎯 1 penyelesaian:",
    q3R1Desc: "(gradien berbeda, garis berpotongan)",
    q3R2: "♾️ Tak hingga:",
    q3R2Desc: "(garis berimpit)",
    q3R3: "∅ Tidak ada:",
    q3R3Desc: "(garis sejajar)",
    q3Items: [
      { key: "a", eq: "x + 2y = 6", eq2: "3x - y = 4", type: "one", typeLabel: "✅ Tepat satu penyelesaian", color: "bg-emerald-900/20 border-emerald-500/30", labelColor: "text-emerald-300", detail: "Rasio: 1/3 ≠ 2/(−1) → gradien berbeda → garis berpotongan" },
      { key: "b", eq: "2x + 4y = 8", eq2: "x + 2y = 4", type: "inf", typeLabel: "♾️ Tak hingga penyelesaian", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "Persamaan 2 × 2 = Persamaan 1 → identik → garis berimpit" },
      { key: "c", eq: "3x - 6y = 9", eq2: "x - 2y = 5", type: "none", typeLabel: "∅ Tidak memiliki penyelesaian", color: "bg-red-900/20 border-red-500/30", labelColor: "text-red-300", detail: "Koefisien sebanding (rasio 3), konstanta tidak (9/5 ≠ 3) → garis sejajar" },
      { key: "d", eq: "5x + y = 10", eq2: "10x + 2y = 20", type: "inf", typeLabel: "♾️ Tak hingga penyelesaian", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "Persamaan 2 × ½ = Persamaan 1 → identik → garis berimpit" },
      { key: "e", eq: "4x - 2y = 6", eq2: "6x - 3y = 9", type: "inf", typeLabel: "♾️ Tak hingga penyelesaian", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "Rasio 4/6 = 2/3 = −2/−3 = 2/3 = 6/9 = 2/3 → semua rasio sama" },
      { key: "f", eq: "x + 3y = 7", eq2: "2x + 6y = 15", type: "none", typeLabel: "∅ Tidak memiliki penyelesaian", color: "bg-red-900/20 border-red-500/30", labelColor: "text-red-300", detail: "Koefisien sebanding (1/2), konstanta tidak (7/15 ≠ 1/2) → garis sejajar" },
    ],
    q3TableHead: ["SPLDV", "Jenis Penyelesaian"],
    q3TableRows: [
      { lbl: "a. x + 2y = 6  ;  3x − y = 4", result: "🎯 Tepat satu penyelesaian", c: "text-emerald-300" },
      { lbl: "b. 2x + 4y = 8  ;  x + 2y = 4", result: "♾️ Tak hingga penyelesaian", c: "text-yellow-300" },
      { lbl: "c. 3x − 6y = 9  ;  x − 2y = 5", result: "∅ Tidak memiliki penyelesaian", c: "text-red-300" },
      { lbl: "d. 5x + y = 10  ;  10x + 2y = 20", result: "♾️ Tak hingga penyelesaian", c: "text-yellow-300" },
      { lbl: "e. 4x − 2y = 6  ;  6x − 3y = 9", result: "♾️ Tak hingga penyelesaian", c: "text-yellow-300" },
      { lbl: "f. x + 3y = 7  ;  2x + 6y = 15", result: "∅ Tidak memiliki penyelesaian", c: "text-red-300" },
    ],
    q3RecapTitle: "📊 Rekapitulasi Jawaban",
    q3Note: "💡 Ingat: cukup bandingkan rasio koefisien a₁/a₂, b₁/b₂, dan c₁/c₂ — tidak perlu menyelesaikan SPLDV-nya secara lengkap!",
    summaryPoints: [
      { poin: "PLDV adalah persamaan linear dengan tepat dua variabel berpangkat 1: ax + by = c (a, b ≠ 0).", icon: "📐" },
      { poin: "Satu PLDV memiliki tak hingga solusi karena hanya ada satu persamaan untuk dua ketidaktahuan.", icon: "♾️" },
      { poin: "SPLDV adalah sistem dua PLDV yang harus dipenuhi secara bersamaan oleh (x, y).", icon: "🔗" },
      { poin: "Solusi SPLDV bisa: satu pasangan (x, y), tak hingga, atau tidak ada sama sekali.", icon: "🔢" },
      { poin: "Untuk memverifikasi solusi, substitusikan ke KEDUA persamaan — keduanya harus benar.", icon: "✅" },
    ],
    tipsTitle: "💡 Tips dan Trik",
    tips: [
      { tip: "Cara cepat cek apakah suatu persamaan adalah PLDV", detail: "Pastikan: (1) ada tepat 2 variabel, (2) pangkat variabel = 1, (3) tidak ada perkalian antar variabel (xy). Jika semua terpenuhi → itu PLDV!", color: "border-yellow-500/30 bg-yellow-900/10", badge: "bg-yellow-500/20 text-yellow-300" },
      { tip: "Gunakan rasio koefisien untuk menentukan jenis penyelesaian tanpa menghitung", detail: "Bandingkan a₁/a₂, b₁/b₂, c₁/c₂. Tidak perlu menyelesaikan SPLDV-nya — cukup 3 perbandingan untuk tahu ada berapa solusi.", color: "border-cyan-500/30 bg-cyan-900/10", badge: "bg-cyan-500/20 text-cyan-300" },
      { tip: "Jangan bingung PLDV dengan PLD satu variabel", detail: "PLD satu variabel: 2x = 8 → hanya 1 solusi. PLDV: 2x + y = 8 → tak hingga solusi karena ada dua ketidaktahuan.", color: "border-purple-500/30 bg-purple-900/10", badge: "bg-purple-500/20 text-purple-300" },
      { tip: "Verifikasi solusi: substitusi ke KEDUA persamaan", detail: "Banyak siswa hanya mengecek ke satu persamaan. Solusi SPLDV harus memenuhi persamaan pertama DAN persamaan kedua sekaligus.", color: "border-emerald-500/30 bg-emerald-900/10", badge: "bg-emerald-500/20 text-emerald-300" },
    ],
    closingTitle: "🎯 Kesimpulan",
    closingDesc: "SPLDV adalah fondasi dari aljabar lanjutan. Memahami konsep dasar — apa itu PLDV, bagaimana dua persamaan membentuk sistem, dan bagaimana mengenali jenis penyelesaiannya — adalah kunci untuk menguasai semua metode penyelesaian yang akan dipelajari berikutnya.",
    closingQuote: "\"Satu persamaan menceritakan sebuah garis. Dua persamaan menceritakan di mana dua garis bertemu.\"",
    backBtn: "← Kembali ke Menu SPLDV",
    contoh: "Contoh Soal",
    solution: "✅ Pembahasan",
  },
  en: {
    pageTitle: "DEFINITION & STANDARD FORM OF SLETV",
    pageSubtitle: "Connection to LTE & Fundamentals of Systems of Equations",
    gradeLabel: "Grade 8 · SLETV · Mathematics",
    secIntro: "🌟 Why Do We Need Systems of Linear Equations?",
    secPLDV: "📘 Section 1: LTE — One Equation, Two Variables",
    secSPLDV: "📗 Section 2: SLETV — A System of Two Equations",
    secContoh: "📝 Example Problems & Solutions",
    secRangkuman: "📋 Summary",
    introDesc: "Imagine you go to a cafeteria and buy 2 fried rice and 1 fried noodle for $25. Your friend buys 1 fried rice and 2 fried noodle for $23. From these two facts, can we find the price of each dish? This is what a System of Linear Equations in Two Variables (SLETV) is for — a mathematical tool for solving problems with two unknowns at once!",
    conceptMapTitle: "🛸 Concept Map",
    pldvLabel: "LTE",
    pldvDesc: "1 equation, 2 variables",
    spldvLabel: "SLETV",
    spldvDesc: "system of 2 equations",
    introTip: "SLETV = System of Linear Equations in Two Variables. \"Linear\" means the highest power of each variable is 1. \"Two variables\" means there are two unknowns (usually x and y).",
    pldvSummaryTitle: "🎯 Key Summary",
    pldvSummaryDesc: "A Linear Equation in Two Variables (LTE) has exactly two variables, each with a power of 1. Its standard form is ax + by = c, where a, b ≠ 0. One LTE has infinitely many solutions because any value of x can be paired with an appropriate y.",
    pldvGeneralTitle: "📐 Standard Form of LTE",
    pldvCoefLabel: "Coefficients of variables (non-zero)",
    pldvVarLabel: "The two variables to find",
    pldvConstLabel: "Constant (fixed number)",
    pldvVsTitle: "✅ LTE vs ❌ Not LTE",
    pldvTableHeadEq: "Equation",
    pldvTableHeadIs: "LTE?",
    pldvTableHeadReason: "Reason",
    pldvRows: [
      ["2x + 3y = 6", "✅ Yes", "2 variables, power 1"],
      ["x − 5y = 10", "✅ Yes", "2 variables, power 1"],
      ["x² + y = 4", "❌ No", "x has power 2"],
      ["3x = 9", "❌ No", "Only 1 variable"],
      ["xy + 2 = 0", "❌ No", "x and y are multiplied"],
      ["4x + 0y = 8", "❌ No", "Coefficient of y = 0 (only 1 variable)"],
    ],
    pldvSolutionsTitle: "🌐 Solutions of LTE: Infinitely Many",
    pldvSolutionsDesc: "Example: x + 2y = 6 has many solution pairs:",
    pldvSolutionsNote: "This is why we need two equations to get a unique solution!",
    spldvSummaryTitle: "🎯 Key Summary",
    spldvSummaryDesc: "An SLETV is a system of two LTEs that must be satisfied simultaneously by a pair of values (x, y). The solution is the x and y that make both equations true at the same time.",
    spldvGeneralTitle: "📐 Standard Form of SLETV",
    spldvEq1Label: "Equation 1:",
    spldvEq1Desc: "First LTE with its own coefficients",
    spldvEq2Label: "Equation 2:",
    spldvEq2Desc: "Second LTE, different from the first",
    quizTitle: "🔍 Check SLETV Solutions — Choose the Correct Answer!",
    quizDesc: "Answers are provided. Your task is to choose the pair (x, y) that satisfies both equations, then verify!",
    quiz1Label: "📘 Example 1 — Variables x and y",
    quiz1Ask: "Which pair",
    quiz1AskMid: "is the solution of the system above?",
    quiz1ProofTitle: "🔬 Proof — substitute into both equations",
    quiz1Eq1Label: "Equation (1):",
    quiz1Eq2Label: "Equation (2):",
    quiz1Eq1Ok: "✅ Equation (1) satisfied",
    quiz1Eq1No: "❌ Equation (1) not satisfied",
    quiz1Eq2Ok: "✅ Equation (2) satisfied",
    quiz1Eq2No: "❌ Equation (2) not satisfied",
    quiz1Correct: (x: number, y: number) => `🎉 Correct! (${x}, ${y}) is the solution — both equations satisfied!`,
    quiz1Wrong: "❌ Not a solution. Equation (2) is not satisfied. Try another choice!",
    quiz1Hint: "👆 Choose one of the answers above to verify it",
    quiz2Label: "🍛 Example 2 — Real-World Problem",
    quiz2Story: (name1: string, name2: string) => `${name1} buys 2 fried rice and 1 fried noodle for $25. ${name2} buys 1 fried rice and 2 fried noodle for $23.`,
    quiz2Let: "Let:",
    quiz2VarN: "n = price of fried rice ($)",
    quiz2VarM: "m = price of fried noodle ($)",
    quiz2AskFull: "Which pair (n, m) is the solution?",
    quiz2ProofTitle: "🔬 Proof — substitute into both equations",
    quiz2Eq1Label: "Equation (1):",
    quiz2Eq2Label: "Equation (2):",
    quiz2Eq1Ok: "✅ Equation (1) satisfied",
    quiz2Eq1No: "❌ Equation (1) not satisfied",
    quiz2Eq2Ok: "✅ Equation (2) satisfied",
    quiz2Eq2No: "❌ Equation (2) not satisfied",
    quiz2Correct: (n: number, m: number) => `🎉 Correct! Fried rice = $${n}, fried noodle = $${m}!`,
    quiz2Wrong: "❌ Not a solution. Equation (2) not satisfied. Try another!",
    quiz2Hint: "👆 Choose one of the answers above to verify it",
    quiz2Choices: [
      { label: "A", n: 9, m: 7, p1: "2(9) + 7 = 18 + 7 = 25", p1ok: true, p2: "9 + 2(7) = 9 + 14 = 23", p2ok: true },
      { label: "B", n: 8, m: 9, p1: "2(8) + 9 = 16 + 9 = 25", p1ok: true, p2: "8 + 2(9) = 8 + 18 = 26 \\neq 23", p2ok: false },
      { label: "C", n: 10, m: 5, p1: "2(10) + 5 = 20 + 5 = 25", p1ok: true, p2: "10 + 2(5) = 10 + 10 = 20 \\neq 23", p2ok: false },
      { label: "D", n: 7, m: 11, p1: "2(7) + 11 = 14 + 11 = 25", p1ok: true, p2: "7 + 2(11) = 7 + 22 = 29 \\neq 23", p2ok: false },
    ],
    quiz2ChoiceLabel: (n: number, m: number) => `n=\\$${n},\\ m=\\$${m}`,
    quiz1Choices: [
      { label: "A", x: 3, y: 1, p1: "2(3) + 1 = 7", p1ok: true, p2: "3 - 1 = 2", p2ok: true },
      { label: "B", x: 2, y: 3, p1: "2(2) + 3 = 7", p1ok: true, p2: "2 - 3 = -1 \\neq 2", p2ok: false },
      { label: "C", x: 4, y: -1, p1: "2(4) + (-1) = 7", p1ok: true, p2: "4 - (-1) = 5 \\neq 2", p2ok: false },
      { label: "D", x: 1, y: 5, p1: "2(1) + 5 = 7", p1ok: true, p2: "1 - 5 = -4 \\neq 2", p2ok: false },
    ],
    name1: "Theo", name2: "Nora",
    easy: "EASY", medium: "MEDIUM", hard: "HARD",
    q1Problem: "Which of the following equations is an LTE?",
    q1A: "a. 3x + 2y = 12", q1B: "b. x² − y = 5", q1C: "c. 5x − y = 0", q1D: "d. 2x = 8",
    q1Rows: [
      { ex: "a. 3x + 2y = 12", verdict: "✅ LTE", reason: "2 variables (x and y), both with power 1, both coefficients non-zero.", c: "text-green-400" },
      { ex: "b. x² − y = 5", verdict: "❌ Not LTE", reason: "x has power 2, not 1. This is a quadratic equation.", c: "text-red-400" },
      { ex: "c. 5x − y = 0", verdict: "✅ LTE", reason: "2 variables (x and y), both with power 1. A constant of 0 is still valid.", c: "text-green-400" },
      { ex: "d. 2x = 8", verdict: "❌ Not LTE", reason: "Only one variable (x). An LTE must have exactly two variables.", c: "text-red-400" },
    ],
    q1Answer: "🔑 Valid LTEs: a and c.",
    q2Problem: "Given: 2x + y = 7 and x − y = 2. Check if the following pairs are solutions:",
    q2A: "a. (x, y) = (3, 1)", q2B: "b. (x, y) = (2, 3)",
    q2CheckA: "Check (3, 1) — substitute into both equations:",
    q2CheckB: "Check (2, 3) — substitute into both equations:",
    q2ResultA: "✅ Both equations satisfied → (3, 1) is a solution of the system.",
    q2ResultB: "❌ Equation 2 not satisfied → (2, 3) is NOT a solution.",
    q2Note: "💡 A solution to an SLETV must satisfy ALL equations in the system simultaneously!",
    q3Problem: "Determine whether each SLETV has exactly one solution, infinitely many solutions, or no solution!",
    q3OneSol: "Exactly one solution",
    q3InfSol: "Infinitely many solutions",
    q3NoSol: "No solution",
    q3QuickTitle: "🔑 Quick Method to Determine the Type of Solution",
    q3QuickDesc: "For an SLETV, compare the coefficient ratios:",
    q3R1: "🎯 One solution:",
    q3R1Desc: "(different slopes, lines intersect)",
    q3R2: "♾️ Infinitely many:",
    q3R2Desc: "(lines coincide)",
    q3R3: "∅ No solution:",
    q3R3Desc: "(lines parallel)",
    q3Items: [
      { key: "a", eq: "x + 2y = 6", eq2: "3x - y = 4", type: "one", typeLabel: "✅ Exactly one solution", color: "bg-emerald-900/20 border-emerald-500/30", labelColor: "text-emerald-300", detail: "Ratios: 1/3 ≠ 2/(−1) → different slopes → lines intersect" },
      { key: "b", eq: "2x + 4y = 8", eq2: "x + 2y = 4", type: "inf", typeLabel: "♾️ Infinitely many solutions", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "Eq 2 × 2 = Eq 1 → identical → lines coincide" },
      { key: "c", eq: "3x - 6y = 9", eq2: "x - 2y = 5", type: "none", typeLabel: "∅ No solution", color: "bg-red-900/20 border-red-500/30", labelColor: "text-red-300", detail: "Coefficients proportional (ratio 3), constant not (9/5 ≠ 3) → parallel" },
      { key: "d", eq: "5x + y = 10", eq2: "10x + 2y = 20", type: "inf", typeLabel: "♾️ Infinitely many solutions", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "Eq 2 × ½ = Eq 1 → identical → lines coincide" },
      { key: "e", eq: "4x - 2y = 6", eq2: "6x - 3y = 9", type: "inf", typeLabel: "♾️ Infinitely many solutions", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "All ratios 4/6 = 2/3 = 6/9 = 2/3 → equal" },
      { key: "f", eq: "x + 3y = 7", eq2: "2x + 6y = 15", type: "none", typeLabel: "∅ No solution", color: "bg-red-900/20 border-red-500/30", labelColor: "text-red-300", detail: "Coefficients proportional (1/2), constant not (7/15 ≠ 1/2) → parallel" },
    ],
    q3TableHead: ["System", "Type of Solution"],
    q3TableRows: [
      { lbl: "a. x + 2y = 6  ;  3x − y = 4", result: "🎯 Exactly one solution", c: "text-emerald-300" },
      { lbl: "b. 2x + 4y = 8  ;  x + 2y = 4", result: "♾️ Infinitely many", c: "text-yellow-300" },
      { lbl: "c. 3x − 6y = 9  ;  x − 2y = 5", result: "∅ No solution", c: "text-red-300" },
      { lbl: "d. 5x + y = 10  ;  10x + 2y = 20", result: "♾️ Infinitely many", c: "text-yellow-300" },
      { lbl: "e. 4x − 2y = 6  ;  6x − 3y = 9", result: "♾️ Infinitely many", c: "text-yellow-300" },
      { lbl: "f. x + 3y = 7  ;  2x + 6y = 15", result: "∅ No solution", c: "text-red-300" },
    ],
    q3RecapTitle: "📊 Answer Summary",
    q3Note: "💡 Remember: just compare the coefficient ratios a₁/a₂, b₁/b₂, and c₁/c₂ — no need to fully solve the system!",
    summaryPoints: [
      { poin: "An LTE is a linear equation with exactly two variables of power 1: ax + by = c (a, b ≠ 0).", icon: "📐" },
      { poin: "One LTE has infinitely many solutions because one equation cannot uniquely determine two unknowns.", icon: "♾️" },
      { poin: "An SLETV is a system of two LTEs that must both be satisfied simultaneously by (x, y).", icon: "🔗" },
      { poin: "An SLETV's solution can be: one pair (x, y), infinitely many, or none.", icon: "🔢" },
      { poin: "To verify a solution, substitute into BOTH equations — both must be true.", icon: "✅" },
    ],
    tipsTitle: "💡 Tips & Tricks",
    tips: [
      { tip: "Quick check: is an equation an LTE?", detail: "Ensure: (1) exactly 2 variables, (2) variable powers = 1, (3) no multiplication between variables (xy). If all are true → it's an LTE!", color: "border-yellow-500/30 bg-yellow-900/10", badge: "bg-yellow-500/20 text-yellow-300" },
      { tip: "Use coefficient ratios to determine solution type without computing", detail: "Compare a₁/a₂, b₁/b₂, c₁/c₂. No need to solve — just 3 comparisons to know how many solutions exist.", color: "border-cyan-500/30 bg-cyan-900/10", badge: "bg-cyan-500/20 text-cyan-300" },
      { tip: "Don't confuse LTE with a linear equation in one variable", detail: "One-variable: 2x = 8 → only 1 solution. LTE: 2x + y = 8 → infinitely many solutions.", color: "border-purple-500/30 bg-purple-900/10", badge: "bg-purple-500/20 text-purple-300" },
      { tip: "Verify: substitute into BOTH equations", detail: "Many students only check one equation. An SLETV solution must satisfy the first AND the second equation simultaneously.", color: "border-emerald-500/30 bg-emerald-900/10", badge: "bg-emerald-500/20 text-emerald-300" },
    ],
    closingTitle: "🎯 Conclusion",
    closingDesc: "An SLETV is the foundation of advanced algebra. Understanding the basics — what an LTE is, how two equations form a system, and how to recognize the type of solution — is the key to mastering all solution methods ahead.",
    closingQuote: "\"One equation tells the story of a line. Two equations tell where two lines meet.\"",
    backBtn: "← Back to SLETV Menu",
    contoh: "Example",
    solution: "✅ Solution",
  },
  ja: {
    pageTitle: "連立方程式の定義と標準形",
    pageSubtitle: "一次方程式との関係と連立方程式の基礎概念",
    gradeLabel: "中学2年 · 連立方程式 · 数学",
    secIntro: "🌟 なぜ連立方程式が必要？",
    secPLDV: "📘 第1節：一次方程式 — 1本の式、2つの変数",
    secSPLDV: "📗 第2節：連立方程式 — 2本の式のシステム",
    secContoh: "📝 例題と解説",
    secRangkuman: "📋 まとめ",
    introDesc: "食堂でチャーハン2個とやきそば1個を$25で買ったとします。友達はチャーハン1個とやきそば2個を$23で買いました。この2つの情報から、それぞれの値段はわかる？これが連立方程式の用途です — 2つの未知数を同時に解く数学ツール！",
    conceptMapTitle: "🛸 概念マップ",
    pldvLabel: "一次方程式",
    pldvDesc: "1本の式、2変数",
    spldvLabel: "連立方程式",
    spldvDesc: "2本の式のシステム",
    introTip: "連立方程式 = 2変数の連立一次方程式。「一次」は各変数の最高次数が1であることを意味します。「2変数」は未知数が2つあること（通常xとy）を意味します。",
    pldvSummaryTitle: "🎯 要点まとめ",
    pldvSummaryDesc: "2変数の一次方程式は、各変数の次数が1の方程式で、標準形はax + by = c（a, b ≠ 0）です。xの値を何にでも設定できるため、1本の方程式には無数の解があります。",
    pldvGeneralTitle: "📐 一次方程式の標準形",
    pldvCoefLabel: "変数の係数（0以外）",
    pldvVarLabel: "求める2つの変数",
    pldvConstLabel: "定数（固定された数）",
    pldvVsTitle: "✅ 一次方程式 vs ❌ 一次方程式でない",
    pldvTableHeadEq: "方程式",
    pldvTableHeadIs: "一次方程式？",
    pldvTableHeadReason: "理由",
    pldvRows: [
      ["2x + 3y = 6", "✅ はい", "2変数、1次"],
      ["x − 5y = 10", "✅ はい", "2変数、1次"],
      ["x² + y = 4", "❌ いいえ", "xが2次"],
      ["3x = 9", "❌ いいえ", "変数が1つのみ"],
      ["xy + 2 = 0", "❌ いいえ", "xとyの積がある"],
      ["4x + 0y = 8", "❌ いいえ", "yの係数が0（実質1変数）"],
    ],
    pldvSolutionsTitle: "🌐 一次方程式の解：無数にある",
    pldvSolutionsDesc: "例：x + 2y = 6 は多くの解のペアを持ちます：",
    pldvSolutionsNote: "だから唯一解を求めるために2本の方程式が必要です！",
    spldvSummaryTitle: "🎯 要点まとめ",
    spldvSummaryDesc: "連立方程式は、変数のペア(x, y)によって同時に満たされなければならない2本の一次方程式のシステムです。連立方程式の解は、両方の方程式を同時に真にするxとyの値です。",
    spldvGeneralTitle: "📐 連立方程式の標準形",
    spldvEq1Label: "方程式1：",
    spldvEq1Desc: "最初の一次方程式（その係数を持つ）",
    spldvEq2Label: "方程式2：",
    spldvEq2Desc: "1番目とは異なる2番目の一次方程式",
    quizTitle: "🔍 連立方程式の解を確認 — 正しい答えを選ぼう！",
    quizDesc: "答えは用意されています。両方の方程式を満たすペア(x, y)を選んで確認しよう！",
    quiz1Label: "📘 例1 — 変数xとy",
    quiz1Ask: "ペア",
    quiz1AskMid: "のうち上の連立方程式の解はどれ？",
    quiz1ProofTitle: "🔬 証明 — 両方の方程式に代入",
    quiz1Eq1Label: "方程式(1)：",
    quiz1Eq2Label: "方程式(2)：",
    quiz1Eq1Ok: "✅ 方程式(1)を満たす",
    quiz1Eq1No: "❌ 方程式(1)を満たさない",
    quiz1Eq2Ok: "✅ 方程式(2)を満たす",
    quiz1Eq2No: "❌ 方程式(2)を満たさない",
    quiz1Correct: (x: number, y: number) => `🎉 正解！(${x}, ${y}) が解です — 両方の方程式を満たします！`,
    quiz1Wrong: "❌ 解ではありません。方程式(2)が満たされません。別の選択肢を試して！",
    quiz1Hint: "👆 上の答えを選んで確認しよう",
    quiz2Label: "🍛 例2 — 実際の問題",
    quiz2Story: (name1: string, name2: string) => `${name1}はチャーハン2個とやきそば1個を$25で買いました。${name2}はチャーハン1個とやきそば2個を$23で買いました。`,
    quiz2Let: "設：",
    quiz2VarN: "n = チャーハンの価格（$）",
    quiz2VarM: "m = やきそばの価格（$）",
    quiz2AskFull: "ペア(n, m)のうち解はどれ？",
    quiz2ProofTitle: "🔬 証明 — 両方の方程式に代入",
    quiz2Eq1Label: "方程式(1)：",
    quiz2Eq2Label: "方程式(2)：",
    quiz2Eq1Ok: "✅ 方程式(1)を満たす",
    quiz2Eq1No: "❌ 方程式(1)を満たさない",
    quiz2Eq2Ok: "✅ 方程式(2)を満たす",
    quiz2Eq2No: "❌ 方程式(2)を満たさない",
    quiz2Correct: (n: number, m: number) => `🎉 正解！チャーハン = $${n}、やきそば = $${m}！`,
    quiz2Wrong: "❌ 解ではありません。方程式(2)が満たされません。別の選択肢を試して！",
    quiz2Hint: "👆 上の答えを選んで確認しよう",
    quiz2Choices: [
      { label: "A", n: 9, m: 7, p1: "2(9) + 7 = 18 + 7 = 25", p1ok: true, p2: "9 + 2(7) = 9 + 14 = 23", p2ok: true },
      { label: "B", n: 8, m: 9, p1: "2(8) + 9 = 16 + 9 = 25", p1ok: true, p2: "8 + 2(9) = 8 + 18 = 26 \\neq 23", p2ok: false },
      { label: "C", n: 10, m: 5, p1: "2(10) + 5 = 20 + 5 = 25", p1ok: true, p2: "10 + 2(5) = 10 + 10 = 20 \\neq 23", p2ok: false },
      { label: "D", n: 7, m: 11, p1: "2(7) + 11 = 14 + 11 = 25", p1ok: true, p2: "7 + 2(11) = 7 + 22 = 29 \\neq 23", p2ok: false },
    ],
    quiz2ChoiceLabel: (n: number, m: number) => `n=\\$${n},\\ m=\\$${m}`,
    quiz1Choices: [
      { label: "A", x: 3, y: 1, p1: "2(3) + 1 = 7", p1ok: true, p2: "3 - 1 = 2", p2ok: true },
      { label: "B", x: 2, y: 3, p1: "2(2) + 3 = 7", p1ok: true, p2: "2 - 3 = -1 \\neq 2", p2ok: false },
      { label: "C", x: 4, y: -1, p1: "2(4) + (-1) = 7", p1ok: true, p2: "4 - (-1) = 5 \\neq 2", p2ok: false },
      { label: "D", x: 1, y: 5, p1: "2(1) + 5 = 7", p1ok: true, p2: "1 - 5 = -4 \\neq 2", p2ok: false },
    ],
    name1: "Theo", name2: "Nora",
    easy: "基本", medium: "標準", hard: "発展",
    q1Problem: "次の方程式のうち、2変数の一次方程式はどれ？",
    q1A: "a. 3x + 2y = 12", q1B: "b. x² − y = 5", q1C: "c. 5x − y = 0", q1D: "d. 2x = 8",
    q1Rows: [
      { ex: "a. 3x + 2y = 12", verdict: "✅ 一次方程式", reason: "2変数（xとy）、どちらも1次、両方の係数が0以外。", c: "text-green-400" },
      { ex: "b. x² − y = 5", verdict: "❌ 違う", reason: "xが2次。二次方程式です。", c: "text-red-400" },
      { ex: "c. 5x − y = 0", verdict: "✅ 一次方程式", reason: "2変数（xとy）、どちらも1次。定数0も有効。", c: "text-green-400" },
      { ex: "d. 2x = 8", verdict: "❌ 違う", reason: "変数が1つ（x）のみ。一次方程式には2変数が必要。", c: "text-red-400" },
    ],
    q1Answer: "🔑 有効な一次方程式：aとc。",
    q2Problem: "連立方程式：2x + y = 7 と x − y = 2。次のペアが解かどうか確認しよう：",
    q2A: "a. (x, y) = (3, 1)", q2B: "b. (x, y) = (2, 3)",
    q2CheckA: "(3, 1) を確認 — 両方の方程式に代入：",
    q2CheckB: "(2, 3) を確認 — 両方の方程式に代入：",
    q2ResultA: "✅ 両方の方程式を満たす → (3, 1)は連立方程式の解。",
    q2ResultB: "❌ 方程式2を満たさない → (2, 3)は解ではない。",
    q2Note: "💡 連立方程式の解はシステム内のすべての方程式を同時に満たさなければなりません！",
    q3Problem: "各連立方程式が唯一解・無数の解・解なし のどれかを判定しよう！",
    q3OneSol: "唯一解",
    q3InfSol: "無数の解",
    q3NoSol: "解なし",
    q3QuickTitle: "🔑 解の種類を素早く判定する方法",
    q3QuickDesc: "連立方程式の係数の比を比較します：",
    q3R1: "🎯 唯一解：",
    q3R1Desc: "（傾きが異なる、直線が交わる）",
    q3R2: "♾️ 無数の解：",
    q3R2Desc: "（直線が一致する）",
    q3R3: "∅ 解なし：",
    q3R3Desc: "（直線が平行）",
    q3Items: [
      { key: "a", eq: "x + 2y = 6", eq2: "3x - y = 4", type: "one", typeLabel: "✅ 唯一解", color: "bg-emerald-900/20 border-emerald-500/30", labelColor: "text-emerald-300", detail: "比：1/3 ≠ 2/(−1) → 傾きが異なる → 交わる" },
      { key: "b", eq: "2x + 4y = 8", eq2: "x + 2y = 4", type: "inf", typeLabel: "♾️ 無数の解", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "式2 × 2 = 式1 → 同一 → 直線が一致" },
      { key: "c", eq: "3x - 6y = 9", eq2: "x - 2y = 5", type: "none", typeLabel: "∅ 解なし", color: "bg-red-900/20 border-red-500/30", labelColor: "text-red-300", detail: "係数の比が等しい（比3）が定数が異なる（9/5 ≠ 3）→ 平行" },
      { key: "d", eq: "5x + y = 10", eq2: "10x + 2y = 20", type: "inf", typeLabel: "♾️ 無数の解", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "式2 × ½ = 式1 → 同一 → 直線が一致" },
      { key: "e", eq: "4x - 2y = 6", eq2: "6x - 3y = 9", type: "inf", typeLabel: "♾️ 無数の解", color: "bg-yellow-900/20 border-yellow-500/30", labelColor: "text-yellow-300", detail: "すべての比が4/6 = 2/3 = 6/9 = 2/3 → 等しい" },
      { key: "f", eq: "x + 3y = 7", eq2: "2x + 6y = 15", type: "none", typeLabel: "∅ 解なし", color: "bg-red-900/20 border-red-500/30", labelColor: "text-red-300", detail: "係数の比が等しい（1/2）が定数が異なる（7/15 ≠ 1/2）→ 平行" },
    ],
    q3TableHead: ["連立方程式", "解の種類"],
    q3TableRows: [
      { lbl: "a. x + 2y = 6  ;  3x − y = 4", result: "🎯 唯一解", c: "text-emerald-300" },
      { lbl: "b. 2x + 4y = 8  ;  x + 2y = 4", result: "♾️ 無数の解", c: "text-yellow-300" },
      { lbl: "c. 3x − 6y = 9  ;  x − 2y = 5", result: "∅ 解なし", c: "text-red-300" },
      { lbl: "d. 5x + y = 10  ;  10x + 2y = 20", result: "♾️ 無数の解", c: "text-yellow-300" },
      { lbl: "e. 4x − 2y = 6  ;  6x − 3y = 9", result: "♾️ 無数の解", c: "text-yellow-300" },
      { lbl: "f. x + 3y = 7  ;  2x + 6y = 15", result: "∅ 解なし", c: "text-red-300" },
    ],
    q3RecapTitle: "📊 解答まとめ",
    q3Note: "💡 覚えておこう：係数の比a₁/a₂、b₁/b₂、c₁/c₂を比較するだけ — 連立方程式を完全に解く必要はない！",
    summaryPoints: [
      { poin: "一次方程式はax + by = c（a, b ≠ 0）の形で2変数を持つ1次の方程式。", icon: "📐" },
      { poin: "1本の一次方程式には無数の解がある（2つの未知数に対して1本の式しかないため）。", icon: "♾️" },
      { poin: "連立方程式は(x, y)によって同時に満たされなければならない2本の一次方程式のシステム。", icon: "🔗" },
      { poin: "連立方程式の解は：1組の(x, y)、無数の解、または解なし。", icon: "🔢" },
      { poin: "解を確認するには両方の方程式に代入すること — 両方が真でなければならない。", icon: "✅" },
    ],
    tipsTitle: "💡 コツとヒント",
    tips: [
      { tip: "素早いチェック：一次方程式かどうか", detail: "確認：(1) 変数がちょうど2つ、(2) 変数の次数 = 1、(3) 変数同士の掛け算がない(xy)。すべて満たす → 一次方程式！", color: "border-yellow-500/30 bg-yellow-900/10", badge: "bg-yellow-500/20 text-yellow-300" },
      { tip: "係数の比で解の種類を計算なしで判定", detail: "a₁/a₂、b₁/b₂、c₁/c₂を比較。連立方程式を解かなくても3つの比較だけで解の数がわかる。", color: "border-cyan-500/30 bg-cyan-900/10", badge: "bg-cyan-500/20 text-cyan-300" },
      { tip: "一次方程式と1変数の方程式を混同しない", detail: "1変数：2x = 8 → 解は1つ。一次方程式：2x + y = 8 → 無数の解（未知数が2つあるため）。", color: "border-purple-500/30 bg-purple-900/10", badge: "bg-purple-500/20 text-purple-300" },
      { tip: "確認：両方の方程式に代入", detail: "1つの方程式だけで確認する生徒が多い。連立方程式の解は1番目の方程式だけでなく2番目も同時に満たさなければならない。", color: "border-emerald-500/30 bg-emerald-900/10", badge: "bg-emerald-500/20 text-emerald-300" },
    ],
    closingTitle: "🎯 結論",
    closingDesc: "連立方程式は高度な代数の基礎です。一次方程式とは何か、2本の方程式がどのようにシステムを形成するか、解の種類をどのように見分けるか — これらの基礎概念を理解することが、次に学ぶすべての解法をマスターするカギです。",
    closingQuote: "「1本の方程式は直線の物語を語る。2本の方程式は2本の直線が出会う場所を語る。」",
    backBtn: "← 連立方程式メニューに戻る",
    contoh: "例題",
    solution: "✅ 解説",
  },
};

const DefinisiSPLDVPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "pldv", "spldv", "contoh1", "rangkuman",
  ]);
  const [jawab1, setJawab1] = useState<number | null>(null);
  const [jawab2, setJawab2] = useState<number | null>(null);

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
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src="/images/spldv-konteks-warung.png" alt="Context illustration" className="w-full object-contain" />
                  <div className="bg-black/40 px-3 py-1.5 flex items-center gap-1.5">
                    <span className="text-white/40 text-[10px]">🖼️</span>
                    <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="font-body text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors underline underline-offset-2">bing.com/images/create</a>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src="/image_1781493810310.png" alt="Context illustration 2" className="w-full object-contain" />
                </div>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 text-sm font-body space-y-2">
                  <p className="text-cyan-300 font-semibold">{t.conceptMapTitle}</p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
                    <div className="bg-yellow-800/40 border border-yellow-500/40 rounded-lg px-3 py-2 text-yellow-200 text-xs font-bold">
                      {t.pldvLabel}<br /><span className="font-normal text-white/60">{t.pldvDesc}</span>
                    </div>
                    <span className="text-white/40 text-lg">+</span>
                    <div className="bg-yellow-800/40 border border-yellow-500/40 rounded-lg px-3 py-2 text-yellow-200 text-xs font-bold">
                      {t.pldvLabel}<br /><span className="font-normal text-white/60">{t.pldvDesc}</span>
                    </div>
                    <span className="text-white/40 text-lg">→</span>
                    <div className="bg-cyan-800/50 border border-cyan-400/50 rounded-lg px-3 py-2 text-cyan-200 text-xs font-bold">
                      {t.spldvLabel}<br /><span className="font-normal text-white/60">{t.spldvDesc}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> {t.introTip}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="pldv" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.secPLDV} />
            {expandedSections.includes("pldv") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-1">{t.pldvSummaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.pldvSummaryDesc}</p>
                </div>
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">{t.pldvGeneralTitle}</p>
                  <BlockMath math="ax + by = c" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="a" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="b" /></p>
                      <p className="text-white/60 mt-1">{t.pldvCoefLabel}</p>
                    </div>
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold"><InlineMath math="x" /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math="y" /></p>
                      <p className="text-white/60 mt-1">{t.pldvVarLabel}</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2 text-center">
                      <p className="text-violet-300 font-bold"><InlineMath math="c" /></p>
                      <p className="text-white/60 mt-1">{t.pldvConstLabel}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.pldvVsTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead><tr className="bg-green-900/50">
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">{t.pldvTableHeadEq}</th>
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-center">{t.pldvTableHeadIs}</th>
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">{t.pldvTableHeadReason}</th>
                      </tr></thead>
                      <tbody>{t.pldvRows.map(([eq, is, reason], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-white font-mono">{eq}</td>
                          <td className={`border border-white/10 px-3 py-2 text-center font-bold ${is.includes("✅") || is.includes("Yes") || is.includes("はい") ? "text-green-400" : "text-red-400"}`}>{is}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{reason}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.pldvSolutionsTitle}</p>
                  <p className="font-body text-xs text-white/70">{t.pldvSolutionsDesc} <InlineMath math="x + 2y = 6" /></p>
                  <div className="overflow-x-auto">
                    <table className="text-xs font-body border-collapse mx-auto">
                      <thead><tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200"><InlineMath math="x" /></th>
                        <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">0</th>
                        <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">2</th>
                        <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">4</th>
                        <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">6</th>
                        <th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">...</th>
                      </tr></thead>
                      <tbody><tr>
                        <td className="border border-white/10 px-4 py-2 text-cyan-200 font-bold"><InlineMath math="y" /></td>
                        <td className="border border-white/10 px-4 py-2 text-center text-white">3</td>
                        <td className="border border-white/10 px-4 py-2 text-center text-white">2</td>
                        <td className="border border-white/10 px-4 py-2 text-center text-white">1</td>
                        <td className="border border-white/10 px-4 py-2 text-center text-white">0</td>
                        <td className="border border-white/10 px-4 py-2 text-center text-white/40">∞</td>
                      </tr></tbody>
                    </table>
                  </div>
                  <p className="font-body text-xs text-center text-white/50">{t.pldvSolutionsNote}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="spldv" icon={<Layers className="w-5 h-5" />} iconColor="text-cyan-400" title={t.secSPLDV} />
            {expandedSections.includes("spldv") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-1">{t.spldvSummaryTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{t.spldvSummaryDesc}</p>
                </div>
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide">{t.spldvGeneralTitle}</p>
                  <BlockMath math="\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-lg p-2">
                      <p className="text-cyan-300 font-bold">{t.spldvEq1Label} <InlineMath math="a_1x + b_1y = c_1" /></p>
                      <p className="text-white/60 mt-1">{t.spldvEq1Desc}</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2">
                      <p className="text-violet-300 font-bold">{t.spldvEq2Label} <InlineMath math="a_2x + b_2y = c_2" /></p>
                      <p className="text-white/60 mt-1">{t.spldvEq2Desc}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-body text-sm font-bold text-white">{t.quizTitle}</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">{t.quizDesc}</p>

                  {/* Quiz 1 */}
                  {(() => {
                    const choices = t.quiz1Choices;
                    const sel = jawab1;
                    const chosen = sel !== null ? choices[sel] : null;
                    const isCorrect = chosen ? chosen.p1ok && chosen.p2ok : null;
                    return (
                      <div className="bg-slate-800/60 border border-cyan-500/30 rounded-2xl overflow-hidden">
                        <div className="px-4 pt-4 pb-3 border-b border-white/10 bg-cyan-900/20">
                          <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest mb-2">{t.quiz1Label}</p>
                          <div className="overflow-x-auto">
                            <BlockMath math="\begin{cases} 2x + y = 7 \quad \cdots (1) \\ x - y = 2 \quad \cdots (2) \end{cases}" />
                          </div>
                          <p className="font-body text-xs text-white/60 mt-1">{t.quiz1Ask} <InlineMath math="(x,\, y)" /> {t.quiz1AskMid}</p>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {choices.map((c, i) => {
                              const isSelected = sel === i;
                              const correct = c.p1ok && c.p2ok;
                              let cls = "border border-white/15 bg-slate-700/40 text-white/70 hover:bg-slate-600/50 hover:border-white/30";
                              if (isSelected && correct) cls = "border-2 border-emerald-400 bg-emerald-900/30 text-emerald-200 shadow-lg shadow-emerald-900/30";
                              else if (isSelected && !correct) cls = "border-2 border-red-400 bg-red-900/30 text-red-200";
                              return (
                                <button key={i} onClick={() => { playPopSound(); setJawab1(i); }}
                                  className={`rounded-xl px-3 py-2.5 text-sm font-body font-semibold text-left transition-all ${cls}`}>
                                  <span className="font-bold">{c.label}.</span>{" "}
                                  <InlineMath math={`x=${c.x},\\; y=${c.y}`} />
                                </button>
                              );
                            })}
                          </div>
                          {chosen && (
                            <div className={`mt-3 rounded-xl border p-4 space-y-3 transition-all duration-500 ${isCorrect ? "border-emerald-500/40 bg-emerald-900/20" : "border-red-500/40 bg-red-900/20"}`}>
                              <p className="font-body text-xs font-bold uppercase tracking-widest text-white/50">{t.quiz1ProofTitle}</p>
                              <div className="space-y-2">
                                <div className={`rounded-lg px-3 py-2 border ${chosen.p1ok ? "border-emerald-500/30 bg-emerald-900/20" : "border-red-500/30 bg-red-900/20"}`}>
                                  <p className="font-body text-xs text-white/50 mb-1">{t.quiz1Eq1Label} <InlineMath math="2x + y = 7" /></p>
                                  <div className="overflow-x-auto"><BlockMath math={chosen.p1 + (chosen.p1ok ? " \\checkmark" : " \\times")} /></div>
                                  <p className={`font-body text-xs font-bold ${chosen.p1ok ? "text-emerald-300" : "text-red-300"}`}>{chosen.p1ok ? t.quiz1Eq1Ok : t.quiz1Eq1No}</p>
                                </div>
                                <div className={`rounded-lg px-3 py-2 border ${chosen.p2ok ? "border-emerald-500/30 bg-emerald-900/20" : "border-red-500/30 bg-red-900/20"}`}>
                                  <p className="font-body text-xs text-white/50 mb-1">{t.quiz1Eq2Label} <InlineMath math="x - y = 2" /></p>
                                  <div className="overflow-x-auto"><BlockMath math={chosen.p2 + (chosen.p2ok ? " \\checkmark" : " \\times")} /></div>
                                  <p className={`font-body text-xs font-bold ${chosen.p2ok ? "text-emerald-300" : "text-red-300"}`}>{chosen.p2ok ? t.quiz1Eq2Ok : t.quiz1Eq2No}</p>
                                </div>
                              </div>
                              <div className={`rounded-xl px-4 py-2.5 text-center font-body font-bold text-sm border ${isCorrect ? "bg-emerald-900/40 border-emerald-400/50 text-emerald-300" : "bg-red-900/40 border-red-400/50 text-red-300"}`}>
                                {isCorrect ? t.quiz1Correct(chosen.x, chosen.y) : t.quiz1Wrong}
                              </div>
                            </div>
                          )}
                          {sel === null && <p className="font-body text-xs text-center text-white/30 italic pt-1">{t.quiz1Hint}</p>}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Quiz 2 — contextual food problem */}
                  {(() => {
                    const choices = t.quiz2Choices;
                    const sel = jawab2;
                    const chosen = sel !== null ? choices[sel] : null;
                    const isCorrect = chosen ? chosen.p1ok && chosen.p2ok : null;
                    return (
                      <div className="bg-slate-800/60 border border-amber-500/30 rounded-2xl overflow-hidden">
                        <div className="px-4 pt-4 pb-3 border-b border-white/10 bg-amber-900/20">
                          <p className="font-body text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">{t.quiz2Label}</p>
                          <div className="rounded-xl overflow-hidden border border-white/10 mb-3">
                            <img src="/images/spldv-konteks-warung.png" alt="Food context" className="w-full max-h-36 object-cover" />
                          </div>
                          <p className="font-body text-sm text-white/85 leading-relaxed mb-2">{t.quiz2Story(t.name1, t.name2)}</p>
                          <div className="bg-black/30 rounded-xl p-3 text-xs font-body text-white/60 space-y-1">
                            <p>{t.quiz2Let} <InlineMath math="n" /> = {t.quiz2VarN}, <InlineMath math="m" /> = {t.quiz2VarM}</p>
                            <div className="overflow-x-auto">
                              <BlockMath math="\begin{cases} 2n + m = 25 \quad \cdots (1) \\ n + 2m = 23 \quad \cdots (2) \end{cases}" />
                            </div>
                            <p>{t.quiz2AskFull}</p>
                          </div>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {choices.map((c, i) => {
                              const isSelected = sel === i;
                              const correct = c.p1ok && c.p2ok;
                              let cls = "border border-white/15 bg-slate-700/40 text-white/70 hover:bg-slate-600/50 hover:border-white/30";
                              if (isSelected && correct) cls = "border-2 border-emerald-400 bg-emerald-900/30 text-emerald-200 shadow-lg shadow-emerald-900/30";
                              else if (isSelected && !correct) cls = "border-2 border-red-400 bg-red-900/30 text-red-200";
                              return (
                                <button key={i} onClick={() => { playPopSound(); setJawab2(i); }}
                                  className={`rounded-xl px-3 py-2.5 text-sm font-body font-semibold text-left transition-all ${cls}`}>
                                  <span className="font-bold">{c.label}.</span>{" "}
                                  <InlineMath math={t.quiz2ChoiceLabel(c.n, c.m)} />
                                </button>
                              );
                            })}
                          </div>
                          {chosen && (
                            <div className={`mt-3 rounded-xl border p-4 space-y-3 transition-all duration-500 ${isCorrect ? "border-emerald-500/40 bg-emerald-900/20" : "border-red-500/40 bg-red-900/20"}`}>
                              <p className="font-body text-xs font-bold uppercase tracking-widest text-white/50">{t.quiz2ProofTitle}</p>
                              <div className="space-y-2">
                                <div className={`rounded-lg px-3 py-2 border ${chosen.p1ok ? "border-emerald-500/30 bg-emerald-900/20" : "border-red-500/30 bg-red-900/20"}`}>
                                  <p className="font-body text-xs text-white/50 mb-1">{t.quiz2Eq1Label} <InlineMath math="2n + m = 25" /></p>
                                  <div className="overflow-x-auto"><BlockMath math={chosen.p1 + (chosen.p1ok ? " \\checkmark" : " \\times")} /></div>
                                  <p className={`font-body text-xs font-bold ${chosen.p1ok ? "text-emerald-300" : "text-red-300"}`}>{chosen.p1ok ? t.quiz2Eq1Ok : t.quiz2Eq1No}</p>
                                </div>
                                <div className={`rounded-lg px-3 py-2 border ${chosen.p2ok ? "border-emerald-500/30 bg-emerald-900/20" : "border-red-500/30 bg-red-900/20"}`}>
                                  <p className="font-body text-xs text-white/50 mb-1">{t.quiz2Eq2Label} <InlineMath math="n + 2m = 23" /></p>
                                  <div className="overflow-x-auto"><BlockMath math={chosen.p2 + (chosen.p2ok ? " \\checkmark" : " \\times")} /></div>
                                  <p className={`font-body text-xs font-bold ${chosen.p2ok ? "text-emerald-300" : "text-red-300"}`}>{chosen.p2ok ? t.quiz2Eq2Ok : t.quiz2Eq2No}</p>
                                </div>
                              </div>
                              <div className={`rounded-xl px-4 py-2.5 text-center font-body font-bold text-sm border ${isCorrect ? "bg-emerald-900/40 border-emerald-400/50 text-emerald-300" : "bg-red-900/40 border-red-400/50 text-red-300"}`}>
                                {isCorrect ? t.quiz2Correct(chosen.n, chosen.m) : t.quiz2Wrong}
                              </div>
                            </div>
                          )}
                          {sel === null && <p className="font-body text-xs text-center text-white/30 italic pt-1">{t.quiz2Hint}</p>}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.secContoh} />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.easy} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.contoh} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q1Problem}<br />
                      {t.q1A}<br />{t.q1B}<br />{t.q1C}<br />{t.q1D}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.solution}</p>
                    <div className="space-y-2 font-body text-sm">
                      {t.q1Rows.map(({ ex, verdict, reason, c }) => (
                        <div key={ex} className="bg-slate-800/40 border border-white/10 rounded-lg px-3 py-2">
                          <p className="font-mono text-white/80">{ex}</p>
                          <p className={`font-bold text-xs mt-1 ${c}`}>{verdict}</p>
                          <p className="text-xs text-white/50 mt-0.5">{reason}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">{t.q1Answer}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.medium} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.contoh} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.q2Problem}<br />{t.q2A}<br />{t.q2B}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.solution}</p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">a. {t.q2CheckA}</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 space-y-1">
                        <BlockMath math="2(3) + 1 = 6 + 1 = 7 \checkmark" />
                        <BlockMath math="3 - 1 = 2 \checkmark" />
                      </div>
                      <p className="font-body text-xs text-green-300 mt-1">{t.q2ResultA}</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">b. {t.q2CheckB}</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 space-y-1">
                        <BlockMath math="2(2) + 3 = 4 + 3 = 7 \checkmark" />
                        <BlockMath math="2 - 3 = -1 \neq 2 \times" />
                      </div>
                      <p className="font-body text-xs text-red-300 mt-1">{t.q2ResultB}</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">{t.q2Note}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.hard} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.contoh} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90 leading-relaxed">{t.q3Problem}</p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-body">
                      {[
                        { no: "a", sys: String.raw`\begin{cases} x + 2y = 6 \\ 3x - y = 4 \end{cases}` },
                        { no: "b", sys: String.raw`\begin{cases} 2x + 4y = 8 \\ x + 2y = 4 \end{cases}` },
                        { no: "c", sys: String.raw`\begin{cases} 3x - 6y = 9 \\ x - 2y = 5 \end{cases}` },
                        { no: "d", sys: String.raw`\begin{cases} 5x + y = 10 \\ 10x + 2y = 20 \end{cases}` },
                        { no: "e", sys: String.raw`\begin{cases} 4x - 2y = 6 \\ 6x - 3y = 9 \end{cases}` },
                        { no: "f", sys: String.raw`\begin{cases} x + 3y = 7 \\ 2x + 6y = 15 \end{cases}` },
                      ].map(({ no, sys }) => (
                        <div key={no} className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2">
                          <p className="font-body text-xs text-white/50 mb-1 font-bold">{no}.</p>
                          <BlockMath math={sys} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.solution}</p>
                    <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3 space-y-2">
                      <p className="font-body text-xs font-bold text-cyan-300">{t.q3QuickTitle}</p>
                      <p className="font-body text-xs text-white/70">{t.q3QuickDesc}</p>
                      <div className="space-y-1 text-xs font-body">
                        <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                          <span className="text-emerald-300 font-bold shrink-0">{t.q3R1}</span>
                          <span className="text-white/70"><InlineMath math="\dfrac{a_1}{a_2} \neq \dfrac{b_1}{b_2}" /> {t.q3R1Desc}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                          <span className="text-yellow-300 font-bold shrink-0">{t.q3R2}</span>
                          <span className="text-white/70"><InlineMath math="\dfrac{a_1}{a_2} = \dfrac{b_1}{b_2} = \dfrac{c_1}{c_2}" /> {t.q3R2Desc}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/20 rounded-lg px-3 py-1.5">
                          <span className="text-red-300 font-bold shrink-0">{t.q3R3}</span>
                          <span className="text-white/70"><InlineMath math="\dfrac{a_1}{a_2} = \dfrac{b_1}{b_2} \neq \dfrac{c_1}{c_2}" /> {t.q3R3Desc}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {t.q3Items.map(({ key, eq, eq2, typeLabel, color, labelColor, detail }) => (
                        <div key={key} className={`${color} rounded-xl p-3 space-y-1`}>
                          <p className={`font-body text-xs font-bold ${labelColor}`}>{key}. <InlineMath math={eq} /> {language === "id" ? "dan" : language === "en" ? "and" : "と"} <InlineMath math={eq2} /></p>
                          <p className="font-body text-xs text-white/70">{detail}</p>
                          <p className={`font-body text-xs font-bold ${labelColor}`}>{typeLabel}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-xs font-bold text-white">{t.q3RecapTitle}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body border-collapse">
                          <thead><tr className="bg-slate-700/60">
                            <th className="border border-white/15 px-3 py-2 text-white/80 text-left">{t.q3TableHead[0]}</th>
                            <th className="border border-white/15 px-3 py-2 text-white/80 text-center">{t.q3TableHead[1]}</th>
                          </tr></thead>
                          <tbody>{t.q3TableRows.map(({ lbl, result, c }, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                              <td className="border border-white/10 px-3 py-2 text-white/70 font-mono">{lbl}</td>
                              <td className={`border border-white/10 px-3 py-2 text-center font-bold ${c}`}>{result}</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">{t.q3Note}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={t.secRangkuman} />
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
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="\text{LTE}: ax + by = c \quad \longrightarrow \quad \text{SLETV}: \begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}" />
                </div>
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-yellow-400/80 uppercase tracking-wide">{t.tipsTitle}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {t.tips.map(({ tip, detail, color, badge }) => (
                      <div key={tip} className={`border rounded-xl p-3 space-y-1 ${color}`}>
                        <p className={`font-body text-xs font-bold px-2 py-0.5 rounded-full inline-block ${badge}`}>✦ {tip}</p>
                        <p className="font-body text-xs text-white/70">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.closingTitle}</p>
                  <p className="font-body text-sm text-white/80">{t.closingDesc}</p>
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1">
                    <p className="font-body text-xs text-white/60 text-center italic">{t.closingQuote}</p>
                  </div>
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

export default DefinisiSPLDVPage;
